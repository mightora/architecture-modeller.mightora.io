/* One CommonJS entry point for both the browser extension host and desktop VS Code. */
'use strict';
const vscode = require('vscode');
const VIEW = 'mightora.architectureModeller', MAX_MODEL = 5 * 1024 * 1024, MAX_EXPORT = 25 * 1024 * 1024;
const encoder = new TextEncoder(), decoder = new TextDecoder();
function nonce() { return [...crypto.getRandomValues(new Uint8Array(24))].map(n=>n.toString(16).padStart(2,'0')).join(''); }
function format(uri) { return /\.ya?ml$/i.test(uri.path) ? 'yaml' : 'json'; }
function webviewHTML(html) {
  const value = nonce();
  return html.replace(/<meta http-equiv="Content-Security-Policy"[^>]*>/, `<meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'nonce-${value}'; style-src 'unsafe-inline'; img-src data: blob:; font-src data:; connect-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none';">`).replace(/<script\b/g, `<script nonce="${value}"`);
}
function activate(context) {
  const media = name => vscode.Uri.joinPath(context.extensionUri, 'media', name);
  const provider = {
    async resolveCustomTextEditor(document, panel) {
      panel.webview.options = { enableScripts:true, localResourceRoots:[] };
      let disposed = false, writeOrigin = null, authored = null, queue = Promise.resolve();
      const sendDocument = origin => panel.webview.postMessage({ type:'document', text:document.getText(), version:document.version, format:format(document.uri), origin });
      const changed = vscode.workspace.onDidChangeTextDocument(event => { if (event.document.uri.toString() === document.uri.toString()) sendDocument(writeOrigin || (authored?.text === document.getText() ? authored.id : null)); });
      const messages = panel.webview.onDidReceiveMessage(message => {
        queue = queue.then(async () => {
          if (disposed || !message || typeof message.type !== 'string') return;
          if (message.type === 'ready') { await sendDocument(null); return; }
          if (message.type === 'edit') {
            if (typeof message.text !== 'string' || encoder.encode(message.text).length > MAX_MODEL || !Number.isInteger(message.baseVersion) || typeof message.editId !== 'string') throw new Error('Invalid or oversized model update.');
            if (message.baseVersion !== document.version) { await panel.webview.postMessage({type:'conflict',editId:message.editId}); return; }
            if (message.text !== document.getText()) {
              const edit = new vscode.WorkspaceEdit();
              edit.replace(document.uri, new vscode.Range(0,0,document.lineCount,0), message.text);
              writeOrigin = message.editId; authored = {text:message.text,id:message.editId};
              try { if (!await vscode.workspace.applyEdit(edit)) throw new Error('VS Code did not accept the edit.'); }
              finally { writeOrigin = null; }
            }
            await panel.webview.postMessage({type:'ack',editId:message.editId,version:document.version}); return;
          }
          if (message.type === 'import') {
            const files = await vscode.window.showOpenDialog({canSelectMany:false,filters:{'Architecture model':['json','yaml','yml','txt']}});
            if (!files?.length) return;
            const bytes = await vscode.workspace.fs.readFile(files[0]); if (bytes.length > MAX_MODEL) throw new Error('Import a model smaller than 5 MB.');
            await panel.webview.postMessage({type:'imported',text:decoder.decode(bytes),name:files[0].path.split('/').pop()}); return;
          }
          if (message.type === 'export') {
            if (typeof message.name !== 'string' || message.name.length > 160 || !Array.isArray(message.bytes) || message.bytes.length > MAX_EXPORT || !message.bytes.every(n=>Number.isInteger(n)&&n>=0&&n<=255)) throw new Error('Invalid or oversized export.');
            const name = message.name.replace(/[^a-zA-Z0-9._-]/g,'-'), folder = vscode.workspace.workspaceFolders?.[0]?.uri;
            const target = await vscode.window.showSaveDialog({title:'Save architecture export', ...(folder ? {defaultUri:vscode.Uri.joinPath(folder,name)} : {}), saveLabel:'Save export'});
            if (target) { await vscode.workspace.fs.writeFile(target,new Uint8Array(message.bytes)); vscode.window.showInformationMessage('Architecture export saved.'); }
          }
        }).catch(error => { panel.webview.postMessage({type:'error',message:error.message,editId:message?.editId}); vscode.window.showErrorMessage('Architecture Modeller: '+error.message); });
      });
      panel.onDidDispose(() => { disposed = true; changed.dispose(); messages.dispose(); });
      panel.webview.html = webviewHTML(decoder.decode(await vscode.workspace.fs.readFile(media('editor.html'))));
    }
  };
  context.subscriptions.push(vscode.window.registerCustomEditorProvider(VIEW,provider,{webviewOptions:{retainContextWhenHidden:true},supportsMultipleEditorsPerDocument:false}));
  context.subscriptions.push(vscode.commands.registerCommand('mightora.architecture.new',async () => {
    const folder = vscode.workspace.workspaceFolders?.[0]?.uri;
    const target = await vscode.window.showSaveDialog({title:'New architecture model', ...(folder ? {defaultUri:vscode.Uri.joinPath(folder,'untitled.architecture.json')} : {}), filters:{'Architecture JSON':['json']}});
    if (!target) return;
    // VS Code's save dialog confirms an overwrite before this write.
    await vscode.workspace.fs.writeFile(target,await vscode.workspace.fs.readFile(media('starter.architecture.json')));
    await vscode.commands.executeCommand('vscode.openWith',target,VIEW);
  }));
  context.subscriptions.push(vscode.commands.registerCommand('mightora.architecture.open',async () => {
    const files = await vscode.window.showOpenDialog({canSelectMany:false,filters:{'Architecture model':['json','yaml','yml','txt']}});
    if (files?.length) await vscode.commands.executeCommand('vscode.openWith',files[0],VIEW);
  }));
}
module.exports = { activate, deactivate(){}, webviewHTML };
