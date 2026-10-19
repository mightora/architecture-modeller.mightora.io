const {test}=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto').webcrypto;
const F=require('../src/formats.js');
const M=require('../src/core.js');
const root=path.join(__dirname,'..');
const tick=()=>new Promise(resolve=>setImmediate(resolve));
async function host() {
  let receive,changed,provider,applied=0,saveTarget=null,importTarget=null;
  const sent=[],writes=[],errors=[],commands=new Map();
  const uri={path:'/workspace/test.architecture.json',toString:()=> 'virtual:/workspace/test.architecture.json'};
  const doc={uri,version:1,lineCount:10,getText:()=>doc.text,text:JSON.stringify(M.empty('Original'))};
  const vscode={
    EventEmitter:class {event=()=>({dispose(){}});fire(){}dispose(){}},
    Uri:{joinPath:(base,...parts)=>({path:[base.path,...parts].join('/'),toString(){return this.path;}})},
    Range:class {constructor(...args){this.args=args;}},
    WorkspaceEdit:class {replace(uri,range,text){this.text=text;}},
    workspace:{workspaceFolders:[{uri}],onDidChangeTextDocument:f=>{changed=f;return {dispose(){}};},
      fs:{readFile:async target=>new TextEncoder().encode(target.path.endsWith('editor.html')?'<meta http-equiv="Content-Security-Policy" content="old"><script>test()</script>':doc.text),writeFile:async(target,bytes)=>writes.push({target,bytes})},
      applyEdit:async edit=>{applied++;doc.text=edit.text;doc.version++;changed({document:doc});return true;}},
    window:{registerCustomEditorProvider:(name,p)=>{provider=p;return {dispose(){}};},showOpenDialog:async()=>importTarget?[importTarget]:undefined,showSaveDialog:async()=>saveTarget,showErrorMessage:e=>errors.push(e),showInformationMessage(){}},
    commands:{registerCommand:(name,f)=>{commands.set(name,f);return {dispose(){}};},executeCommand:async()=>{}}
  };
  const context=vm.createContext({require:name=>{assert.equal(name,'vscode');return vscode;},module:{exports:{}},TextEncoder,TextDecoder,Uint8Array,crypto,console});
  vm.runInContext(fs.readFileSync(path.join(root,'vscode-extension/extension.js'),'utf8'),context);
  context.module.exports.activate({extensionUri:uri,subscriptions:[]});
  const panel={webview:{postMessage:async value=>{sent.push(value);return true;},onDidReceiveMessage:f=>{receive=f;return {dispose(){}};}},onDidDispose(){}};
  await provider.resolveCustomTextEditor(doc,panel);
  return {doc,panel,sent,writes,errors,commands,applied:()=>applied,send:async message=>{receive(message);await tick();await tick();},external:text=>{doc.text=text;doc.version++;changed({document:doc});},exportTo:target=>saveTarget=target,importFrom:target=>importTarget=target};
}
test('extension host uses nonce CSP, no resource roots, and only the browser-safe vscode module',async()=>{
  const h=await host();assert.equal(h.panel.webview.options.enableScripts,true);assert.equal(h.panel.webview.options.localResourceRoots.length,0);
  assert.match(h.panel.webview.html,/script-src 'nonce-[a-f0-9]+'/);assert.match(h.panel.webview.html,/<script nonce="[a-f0-9]+">/);assert.match(h.panel.webview.html,/connect-src 'none'/);
  const manifest=JSON.parse(fs.readFileSync(path.join(root,'vscode-extension/package.json')));
  assert.equal(manifest.browser,'./extension.js');assert.equal(manifest.capabilities.virtualWorkspaces,true);
});
test('workspace edits are version checked; external/native undo changes reach the canvas',async()=>{
  const h=await host();await h.send({type:'ready'});assert.equal(h.sent.at(-1).version,1);
  const text=JSON.stringify(M.empty('Changed'));await h.send({type:'edit',text,baseVersion:1,editId:'one'});
  assert.equal(h.doc.text,text);assert.equal(h.applied(),1);assert.equal(h.sent.at(-1).type,'ack');assert.ok(h.sent.some(m=>m.type==='document'&&m.origin==='one'));
  await h.send({type:'edit',text:'stale',baseVersion:1,editId:'two'});assert.equal(h.sent.at(-1).type,'conflict');assert.equal(h.doc.text,text);
  h.external(JSON.stringify(M.empty('Undo')));assert.equal(h.sent.at(-1).origin,null);assert.match(h.sent.at(-1).text,/Undo/);
});
test('workspace exports preserve binary bytes and require a picker; cancelled exports do not write',async()=>{
  const h=await host(),message={type:'export',name:'views.pptx',bytes:[0,1,128,255]};await h.send(message);assert.equal(h.writes.length,0);
  const target={path:'/chosen/views.pptx'};h.exportTo(target);await h.send(message);assert.equal(h.writes[0].target,target);assert.deepEqual([...h.writes[0].bytes],message.bytes);
  await h.send({...message,bytes:[256]});assert.equal(h.writes.length,1);assert.ok(h.errors.length);
});
test('workspace import and commands use file providers instead of Node fs',async()=>{
  const h=await host();h.importFrom({path:'/chosen/model.yaml'});await h.send({type:'import'});assert.equal(h.sent.at(-1).type,'imported');assert.equal(h.sent.at(-1).name,'model.yaml');
  assert.ok(h.commands.has('mightora.architecture.new'));assert.ok(h.commands.has('mightora.architecture.open'));
});
function bridge() {
  const sent=[],loaded=[],status={textContent:''};let listener;
  const context=vm.createContext({acquireVsCodeApi:()=>({postMessage:value=>sent.push(value)}),window:{addEventListener:(name,f)=>listener=f},document:{getElementById:()=>status},Blob,Uint8Array,ModellerFormats:F});
  vm.runInContext(fs.readFileSync(path.join(root,'src/vscode-bridge.js'),'utf8'),context);
  context.ModellerHost.onDocument(model=>loaded.push(model));
  return {api:context.ModellerHost,sent,loaded,status,event:value=>listener({data:value})};
}
test('bridge queues rapid canvas changes until ack and ignores delayed echoes of own writes',()=>{
  const b=bridge();assert.equal(b.api.canEdit(),false);b.event({type:'document',version:1,format:'json',text:JSON.stringify(M.empty('Initial'))});
  b.api.save(M.empty('First'));const first=b.sent.at(-1);b.api.save(M.empty('Latest'));assert.equal(b.sent.at(-1),first);
  b.event({type:'ack',version:2,editId:first.editId});const latest=b.sent.at(-1);assert.equal(latest.baseVersion,2);assert.match(latest.text,/Latest/);
  b.event({type:'document',version:2,format:'json',text:first.text,origin:first.editId});assert.equal(b.loaded.length,1);
  b.event({type:'ack',version:3,editId:latest.editId});b.event({type:'document',version:3,format:'json',text:latest.text,origin:latest.editId});assert.equal(b.loaded.length,1);
});
test('bridge YAML serialization and conflict handling preserve unsaved canvas recovery',()=>{
  const b=bridge();b.event({type:'document',version:1,format:'yaml',text:F.dump(M.empty('Initial'))});b.api.save(M.empty('Updated'));
  assert.equal(F.parse(b.sent.at(-1).text,'yaml').name,'Updated');
  b.event({type:'document',version:2,format:'yaml',text:F.dump(M.empty('External'))});assert.equal(b.loaded.length,1);assert.equal(b.api.canEdit(),false);assert.match(b.status.textContent,/Export JSON/);
});
test('nonce injection preserves script-looking text inside bundled JavaScript strings',()=>{
  const vscode={};const context=vm.createContext({require:name=>{assert.equal(name,'vscode');return vscode;},module:{exports:{}},TextEncoder,TextDecoder,Uint8Array,crypto,console});vm.runInContext(fs.readFileSync(path.join(root,'vscode-extension/extension.js'),'utf8'),context);
  const markup='<meta http-equiv="Content-Security-Policy" content="old"><script>const text="<script>literal";</script><script>globalThis.ok=true;</script>';
  const result=context.module.exports.webviewHTML(markup);assert.ok(result.includes('const text="<script>literal";'));assert.equal((result.match(/<script nonce=/g)||[]).length,2);
});
