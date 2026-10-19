/* Runs inside the real browser extension host, not a mock of vscode. */
const vscode=require('vscode');
const M=require('../src/core.js');
const Zip=require('../assets/jszip.min.js');
const assert=(condition,message)=>{if(!condition)throw new Error(message);};
const pause=()=>new Promise(resolve=>setTimeout(resolve,150));
exports.run=async()=>{
  const folder=vscode.workspace.workspaceFolders[0].uri,uri=vscode.Uri.joinPath(folder,'acceptance.archmodel.json');
  const model=M.empty('VSCode acceptance model');model.nodes.push({id:'app',name:'Web application',typeId:'system',parentId:null,properties:{}});
  await vscode.workspace.fs.writeFile(uri,new TextEncoder().encode(JSON.stringify(model,null,2)));
  await vscode.commands.executeCommand('vscode.openWith',uri,'mightora.architectureModeller');
  const commands=await vscode.commands.getCommands(true);for(const id of ['word','powerpoint','validate','viewpoint','compare','adr','search'])assert(commands.includes('mightora.architecture.'+id),'Missing command '+id);
  const doc=await vscode.workspace.openTextDocument(uri);
  const next=M.copy(model);next.description='Created in the real VS Code web extension host.';const edit=new vscode.WorkspaceEdit();edit.replace(uri,new vscode.Range(0,0,doc.lineCount,0),JSON.stringify(next,null,2));assert(await vscode.workspace.applyEdit(edit),'Native edit was rejected.');assert(await doc.save(),'Native save failed.');
  const saved=M.parse(new TextDecoder().decode(await vscode.workspace.fs.readFile(uri)));assert(saved.description===next.description,'File-provider round trip failed.');
  await vscode.commands.executeCommand('mightora.architecture.validate');
  console.log('MIGHTORA_WEB_EDITOR_READY');
  const files=['vscode-acceptance-model.docx','vscode-acceptance-model.pptx'];
  for(const file of files){const target=vscode.Uri.joinPath(folder,file);let bytes;const started=Date.now();while(Date.now()-started<90000){try{bytes=await vscode.workspace.fs.readFile(target);break;}catch{await pause();}}assert(bytes?.length>1000,'Export was not written through workspace.fs: '+file);const zip=await Zip.loadAsync(bytes);if(file.endsWith('docx')){assert(zip.file('word/document.xml'),'Missing Word document');assert((await zip.file('word/document.xml').async('string')).includes('Web application'),'Word export omitted the component');}else{assert(zip.file('ppt/presentation.xml'),'Missing PowerPoint presentation');assert((await zip.file('ppt/slides/slide2.xml').async('string')).includes('Web application'),'PowerPoint export omitted the component');}}
  const diagnostics=vscode.languages.getDiagnostics(uri);assert(diagnostics.some(d=>d.code==='owner'),'Governance diagnostics did not reach Problems.');
  console.log('MIGHTORA_WEB_TEST_PASS commands, virtual workspace editing, save, diagnostics, real DOCX and PPTX writes');
};
