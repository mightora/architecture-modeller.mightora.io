/* The exact app runs inside the extension webview, using messages for documents and downloads. */
(function() {
  'use strict';
  if (typeof acquireVsCodeApi !== 'function') return;
  const vscode = acquireVsCodeApi(); let version = 0, format = 'json', pending = null, inFlight = null, blocked = false, serial = 0, onDocument, onImport, saveRequested = null;
  const exports = new Map();
  const ownEdits = new Set();
  const message = text => { const element = document.getElementById('save-state'); if (element) element.textContent = text; };
  function flush() {
    if (blocked || inFlight || !version) return;
    if (!pending) { if(saveRequested!==null){vscode.postMessage({type:'save',as:saveRequested});saveRequested=null;} return; }
    const model = pending; pending = null; const text = format === 'yaml' ? globalThis.ModellerFormats.dump(model) : JSON.stringify(model,null,2)+'\n';
    inFlight = 'edit-'+(++serial); ownEdits.add(inFlight); if (ownEdits.size > 100) ownEdits.delete(ownEdits.values().next().value); vscode.postMessage({type:'edit',text,baseVersion:version,editId:inFlight}); message('Updating VS Code document…');
  }
  globalThis.ModellerHost = {
    canEdit() { return version > 0 && !blocked; },
    save(model) { pending = model; flush(); },
    onDocument(callback) { onDocument = callback; vscode.postMessage({type:'ready'}); },
    onImport(callback) { onImport = callback; },
    import() { vscode.postMessage({type:'import'}); },
    compare(){vscode.postMessage({type:'compare'});},
    saveFile(as=false){saveRequested=as;flush();},
    undo(direction){vscode.postMessage({type:direction});},
    openSource(link){vscode.postMessage({type:'source',link});},
    publishDiagnostics(){vscode.postMessage({type:'diagnostics'});},
    async download(content,name,type) {
      try { const bytes = new Uint8Array(await new Blob([content],{type}).arrayBuffer()); if (bytes.length > 25*1024*1024) throw new Error('Export is larger than the extension’s 25 MB limit.'); const requestId='export-'+(++serial);return await new Promise((resolve,reject)=>{exports.set(requestId,{resolve,reject});vscode.postMessage({type:'export',name,bytes:Array.from(bytes),editId:requestId});}); }
      catch(error) { message(error.message); throw error; }
    }
  };
  window.addEventListener('message',event => {
    const value = event.data; if (!value || typeof value.type !== 'string') return;
    if (value.type === 'document') {
      version = Math.max(version,value.version); format = value.format;
      if (ownEdits.has(value.origin)) return;
      if (inFlight || pending) { blocked = true; message('Document changed elsewhere. Export JSON to keep your canvas edits, then reopen this editor.'); return; }
      try { onDocument?.(globalThis.ModellerFormats.parse(value.text,format)); message('VS Code document · Ctrl/⌘+S to save'); }
      catch(error) { blocked = true; message('Cannot read model: '+error.message+'. Fix the text file and reopen the editor.'); }
    } else if (value.type === 'ack' && value.editId === inFlight) {
      version = value.version; inFlight = null; message(blocked ? 'Document conflict: export canvas JSON before reopening.' : 'Updated VS Code document · Ctrl/⌘+S to save'); flush();
    } else if(value.type==='export-result'){const pending=exports.get(value.requestId);if(pending){pending.resolve(value.saved);exports.delete(value.requestId);}message(value.saved?'Export saved in workspace.':'Export cancelled.');
    } else if(value.type==='comparison'){globalThis.ModellerEditor?.showComparison?.(value.report);
    } else if(value.type==='command'){const app=globalThis.ModellerEditor;if(!app)return;const command=value.command;if(command==='locate')app.locate(value.id);else if(command==='viewpoint')app.loadView(value.id);else if(command==='office-options')app.officeDialog();else if(command==='compare-host')app.platformActions.compare();else if(['word','powerpoint','validate','new-adr'].includes(command))Promise.resolve(app.platformActions[command]?.()).catch(e=>message(e.message));
    } else if (value.type === 'conflict' || value.type === 'error') {
      if(exports.has(value.editId)){exports.get(value.editId).reject(new Error(value.message));exports.delete(value.editId);message(value.message);return;}
      if (value.editId) { blocked = true; inFlight = null; }
      message(value.message || 'Document changed elsewhere. Export canvas JSON before reopening; no file was overwritten.');
    } else if (value.type === 'imported') onImport?.(value.text,value.name);
  });
})();
