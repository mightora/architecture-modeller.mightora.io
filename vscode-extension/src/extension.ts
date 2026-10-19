import * as vscode from 'vscode';
import { safeLink, guard, compareModels, validateArchitecture, canonical, type Model, type SourceLink } from '../../packages';
import * as Formats from '../../src/formats.js';
const VIEW='mightora.architectureModeller',MAX_MODEL=5*1024*1024,MAX_EXPORT=25*1024*1024;
const encoder=new TextEncoder(),decoder=new TextDecoder();
function nonce():string{return [...crypto.getRandomValues(new Uint8Array(24))].map(n=>n.toString(16).padStart(2,'0')).join('');}
function format(uri:vscode.Uri):string{return /\.ya?ml$/i.test(uri.path)?'yaml':'json';}
export function webviewHTML(html:string):string{
  const value=nonce();return html.replace(/<meta http-equiv="Content-Security-Policy"[^>]*>/,`<meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'nonce-${value}'; style-src 'unsafe-inline'; img-src data: blob:; font-src data:; connect-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none';">`).replace(/<script\b([^>]*)>([\s\S]*?)<\/script>/g,(_match:string,attributes:string,body:string)=>`<script nonce="${value}"${attributes}>${body}</script>`);
}
interface Session{document:vscode.TextDocument;panel:vscode.WebviewPanel;model?:Model}
interface Message{type?:unknown;text?:unknown;baseVersion?:unknown;editId?:unknown;name?:unknown;bytes?:unknown;link?:unknown;command?:unknown;as?:unknown}
export function activate(context:vscode.ExtensionContext):void{
  const sessions=new Map<string,Session>();let active:Session|undefined;
  const diagnostics=vscode.languages?.createDiagnosticCollection?.('mightora-architecture');if(diagnostics)context.subscriptions.push(diagnostics);
  const outlineChange=new vscode.EventEmitter<void>();context.subscriptions.push(outlineChange);
  function current():Session|undefined{if(active)return active;vscode.window.showInformationMessage('Open an architecture model in the visual editor first.');return undefined;}
  function update(session:Session):void{
    try{session.model=Formats.parse(session.document.getText(),format(session.document.uri));const text=session.document.getText(),issues=validateArchitecture(session.model);diagnostics?.set(session.document.uri,issues.map(i=>{const offset=text.indexOf('"'+i.entityId+'"'),position=session.document.positionAt(Math.max(0,offset)),d=new vscode.Diagnostic(new vscode.Range(position,position),i.message+' '+i.remediation,{error:vscode.DiagnosticSeverity.Error,warning:vscode.DiagnosticSeverity.Warning,information:vscode.DiagnosticSeverity.Information}[i.severity]);d.code=i.rule;d.source='Architecture Modeller';return d;}));}
    catch(error){session.model=undefined;if(diagnostics)diagnostics.set(session.document.uri,[new vscode.Diagnostic(new vscode.Range(0,0,0,1),String((error as Error).message),vscode.DiagnosticSeverity.Error)]);}
    outlineChange.fire();
  }
  const tree:vscode.TreeDataProvider<string>={onDidChangeTreeData:outlineChange.event,getTreeItem:id=>{const node=active?.model?.nodes.find(n=>n.id===id);const item=new vscode.TreeItem(node?.name||id,active?.model?.nodes.some(n=>n.parentId===id)?vscode.TreeItemCollapsibleState.Collapsed:vscode.TreeItemCollapsibleState.None);item.description=node?.kind||node?.typeId;item.command={command:'mightora.architecture.reveal',title:'Show architecture component',arguments:[id]};return item;},getChildren:id=>active?.model?.nodes.filter(n=>n.parentId===(id||null)).map(n=>n.id)||[]};
  if(vscode.window.registerTreeDataProvider)context.subscriptions.push(vscode.window.registerTreeDataProvider('mightoraArchitectureOutline',tree));
  const provider:vscode.CustomTextEditorProvider={async resolveCustomTextEditor(document,panel){
    const session:Session={document,panel};sessions.set(document.uri.toString(),session);active=session;
    panel.webview.options={enableScripts:true,localResourceRoots:[]};let disposed=false,writeOrigin:string|null=null,authored:{text:string;id:string}|null=null,queue=Promise.resolve();
    const sendDocument=(origin:string|null):Thenable<boolean>=>panel.webview.postMessage({type:'document',text:document.getText(),version:document.version,format:format(document.uri),origin});
    const changed=vscode.workspace.onDidChangeTextDocument(event=>{if(event.document.uri.toString()===document.uri.toString()){void sendDocument(writeOrigin||(authored?.text===document.getText()?authored.id:null));update(session);}});
    const viewState=panel.onDidChangeViewState?.(event=>{if(event.webviewPanel.active){active=session;update(session);}});
    const messages=panel.webview.onDidReceiveMessage((message:Message)=>{
      queue=queue.then(async()=>{
        if(disposed||!message||typeof message.type!=='string')return;
        if(message.type==='ready'){await sendDocument(null);return;}
        if(message.type==='edit'){
          if(typeof message.text!=='string'||encoder.encode(message.text).length>MAX_MODEL||!Number.isInteger(message.baseVersion)||typeof message.editId!=='string')throw Error('Invalid or oversized model update.');
          if(message.baseVersion!==document.version){await panel.webview.postMessage({type:'conflict',editId:message.editId});return;}
          Formats.parse(message.text,format(document.uri));
          if(message.text!==document.getText()){
            const edit=new vscode.WorkspaceEdit();edit.replace(document.uri,new vscode.Range(0,0,document.lineCount,0),message.text);writeOrigin=message.editId;authored={text:message.text,id:message.editId};
            try{if(!await vscode.workspace.applyEdit(edit))throw Error('VS Code did not accept the edit.');}finally{writeOrigin=null;}
          }
          await panel.webview.postMessage({type:'ack',editId:message.editId,version:document.version});return;
        }
        if(message.type==='import'||message.type==='compare'){
          const files=await vscode.window.showOpenDialog({canSelectMany:false,filters:{'Architecture model':['json','yaml','yml','txt']}});if(!files?.length)return;
          const bytes=await vscode.workspace.fs.readFile(files[0]!);if(bytes.length>MAX_MODEL)throw Error('Import a model smaller than 5 MB.');const text=decoder.decode(bytes);
          if(message.type==='compare'){const before=Formats.parse(text,format(files[0]!)),after=Formats.parse(document.getText(),format(document.uri));await panel.webview.postMessage({type:'comparison',report:compareModels(before,after)});}else await panel.webview.postMessage({type:'imported',text,name:files[0]!.path.split('/').pop()});return;
        }
        if(message.type==='save'){if(message.as)await vscode.commands.executeCommand('workbench.action.files.saveAs');else await document.save();return;}
        if(message.type==='undo'||message.type==='redo'){await vscode.commands.executeCommand(message.type);return;}
        if(message.type==='diagnostics'){update(session);return;}
        if(message.type==='source'){
          const link=message.link as SourceLink;if(!link||typeof link.target!=='string'||!safeLink(link.target))throw Error('Unsafe source link.');
          if(/^https?:\/\//i.test(link.target))await vscode.env.openExternal(vscode.Uri.parse(link.target));
          else{const folder=vscode.workspace.getWorkspaceFolder?.(document.uri)||vscode.workspace.workspaceFolders?.[0];if(!folder)throw Error('Open a workspace to resolve source references.');const target=vscode.Uri.joinPath(folder.uri,link.target);const doc=await vscode.workspace.openTextDocument(target);await vscode.window.showTextDocument(doc,{selection:new vscode.Range(Math.max(0,(link.line||1)-1),0,Math.max(0,(link.line||1)-1),0)});}return;
        }
        if(message.type==='export'){
          if(typeof message.name!=='string'||message.name.length>160||!Array.isArray(message.bytes)||message.bytes.length>MAX_EXPORT||!message.bytes.every((n:unknown)=>typeof n==='number'&&Number.isInteger(n)&&n>=0&&n<=255))throw Error('Invalid or oversized export.');
          const name=message.name.replace(/[^a-zA-Z0-9._-]/g,'-'),folder=vscode.workspace.workspaceFolders?.[0]?.uri;
          const target=await vscode.window.showSaveDialog({title:'Save architecture export',...(folder?{defaultUri:vscode.Uri.joinPath(folder,name)}:{}),saveLabel:'Save export'});
          if(target){await vscode.workspace.fs.writeFile(target,new Uint8Array(message.bytes as number[]));void vscode.window.showInformationMessage('Architecture export saved.');}
          await panel.webview.postMessage({type:'export-result',requestId:message.editId,saved:!!target});return;
        }
      }).catch((error:Error)=>{void panel.webview.postMessage({type:'error',message:error.message,editId:message?.editId});void vscode.window.showErrorMessage('Architecture Modeller: '+error.message);});
    });
    panel.onDidDispose(()=>{disposed=true;changed.dispose();messages.dispose();viewState?.dispose();sessions.delete(document.uri.toString());if(active===session)active=undefined;diagnostics?.delete(document.uri);outlineChange.fire();});
    panel.webview.html=webviewHTML(decoder.decode(await vscode.workspace.fs.readFile(vscode.Uri.joinPath(context.extensionUri,'media','editor.html'))));update(session);
  }};
  context.subscriptions.push(vscode.window.registerCustomEditorProvider(VIEW,provider,{webviewOptions:{retainContextWhenHidden:true},supportsMultipleEditorsPerDocument:false}));
  const command=(id:string,action:(...args:unknown[])=>unknown):void=>{context.subscriptions.push(vscode.commands.registerCommand('mightora.architecture.'+id,action));};
  command('new',async()=>{const folder=vscode.workspace.workspaceFolders?.[0]?.uri,target=await vscode.window.showSaveDialog({title:'New architecture model',...(folder?{defaultUri:vscode.Uri.joinPath(folder,'untitled.archmodel.json')}:{}),filters:{'Architecture JSON':['json']}});if(!target)return;await vscode.workspace.fs.writeFile(target,await vscode.workspace.fs.readFile(vscode.Uri.joinPath(context.extensionUri,'media','starter.architecture.json')));await vscode.commands.executeCommand('vscode.openWith',target,VIEW);});
  command('open',async(uri)=>{if(uri&&typeof uri==='object'&&'scheme' in uri){await vscode.commands.executeCommand('vscode.openWith',uri,VIEW);return;}const files=await vscode.window.showOpenDialog({canSelectMany:false,filters:{'Architecture model':['json','yaml','yml','txt']}});if(files?.length)await vscode.commands.executeCommand('vscode.openWith',files[0],VIEW);});
  for(const [id,action] of [['validate','validate'],['word','word'],['powerpoint','powerpoint'],['documentation','office-options'],['adr','new-adr'],['compare','compare-host']] as const)command(id,()=>current()?.panel.webview.postMessage({type:'command',command:action}));
  command('reveal',id=>current()?.panel.webview.postMessage({type:'command',command:'locate',id}));
  command('viewpoint',async()=>{const session=current();if(!session)return;const items=(session.model?.namedViews||[]).map(v=>({label:v.name||v.id!,id:v.id!})),choice=await vscode.window.showQuickPick(items,{title:'Select architecture viewpoint'});if(choice)await session.panel.webview.postMessage({type:'command',command:'viewpoint',id:choice.id});});
  command('search',async()=>{const session=current();if(!session)return;const choice=await vscode.window.showQuickPick((session.model?.nodes||[]).map(n=>({label:n.name,description:n.typeId,id:n.id})),{title:'Find an architecture component',matchOnDescription:true});if(choice)await session.panel.webview.postMessage({type:'command',command:'locate',id:choice.id});});
}
export function deactivate():void{}
