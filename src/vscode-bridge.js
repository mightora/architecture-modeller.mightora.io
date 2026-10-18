/* The exact app runs inside the extension webview, using messages for documents and downloads. */
(function() {
  'use strict';
  if (typeof acquireVsCodeApi !== 'function') return;
  const vscode = acquireVsCodeApi(); let version = 0, format = 'json', pending = null, inFlight = null, blocked = false, serial = 0, onDocument, onImport;
  const ownEdits = new Set();
  const message = text => { const element = document.getElementById('save-state'); if (element) element.textContent = text; };
  function flush() {
    if (blocked || inFlight || !pending || !version) return;
    const model = pending; pending = null; const text = format === 'yaml' ? globalThis.ModellerFormats.dump(model) : JSON.stringify(model,null,2)+'\n';
    inFlight = 'edit-'+(++serial); ownEdits.add(inFlight); if (ownEdits.size > 100) ownEdits.delete(ownEdits.values().next().value); vscode.postMessage({type:'edit',text,baseVersion:version,editId:inFlight}); message('Updating VS Code document…');
  }
  globalThis.ModellerHost = {
    canEdit() { return version > 0 && !blocked; },
    save(model) { pending = model; flush(); },
    onDocument(callback) { onDocument = callback; vscode.postMessage({type:'ready'}); },
    onImport(callback) { onImport = callback; },
    import() { vscode.postMessage({type:'import'}); },
    async download(content,name,type) {
      try { const bytes = new Uint8Array(await new Blob([content],{type}).arrayBuffer()); if (bytes.length > 25*1024*1024) throw new Error('Export is larger than the extension’s 25 MB limit.'); vscode.postMessage({type:'export',name,bytes:Array.from(bytes)}); }
      catch(error) { message(error.message); }
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
    } else if (value.type === 'conflict' || value.type === 'error') {
      if (value.editId) { blocked = true; inFlight = null; }
      message(value.message || 'Document changed elsewhere. Export canvas JSON before reopening; no file was overwritten.');
    } else if (value.type === 'imported') onImport?.(value.text,value.name);
  });
})();
