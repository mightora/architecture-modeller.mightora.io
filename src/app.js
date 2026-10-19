(function () {
  'use strict';
  const M = globalThis.Modeller, D = globalThis.ModellerDimensions, G = globalThis.ModellerGuidance, $ = selector => document.querySelector(selector);
  const STORAGE = 'mightora-architecture-modeller-v1', HOST = globalThis.ModellerHost;
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const el = id => document.getElementById(id);
  let model = M.copy(globalThis.ModellerExamples.platform), focus = null, selected = null, selectedGroup = null;
  let expanded = new Set(), treeOpen = new Set(['pp', 'azure', 'm365', 'identity']), trace = null, projection, diagram;
  let camera = null, homeCamera = null, undoStack = [], redoStack = [], drag = null, pendingPositions = null, toastTimer;
  let saveFailure = '', initialWarning = '';
  let activeNamedView = null, viewPositions = null, relationshipTypeIds = null, showExternal = true;
  let perspective = 'solution', processId = null, selectedLayerIds = null, viewExtras = {};
  let guideVisible = false, guideStep = 0, lastPointerNode = null, alignmentGuides = [];
  const perspectiveNames = { application:'Application architecture',data:'Data architecture',infrastructure:'Infrastructure architecture',security:'Security architecture',integration:'Integration architecture',deployment:'Deployment architecture',custom:'Custom viewpoint', solution: 'Solution architecture', process: 'Business processes', stakeholder: 'Stakeholder responsibilities', layers: 'Application layers', traceability: 'Business traceability', all: 'All entities' };
  function viewSpec() { return { focus, expanded: [...expanded], relationshipTypeIds, showExternal, perspective, processId, layerIds: selectedLayerIds, ...viewExtras }; }
  function changePerspective(value) { viewExtras = {}; perspective = value; focus = null; selected = null; expanded = new Set(); processId = null; selectedLayerIds = null; camera = null; viewPositions = null; activeNamedView = null; render(); }
  if (!HOST) try { const saved = localStorage.getItem(STORAGE); if (saved) model = M.parse(saved); } catch (e) { initialWarning = `Saved model could not be loaded: ${e.message} The example is shown. Your stored file has not been overwritten.`; saveFailure = initialWarning; }
  function toast(message) { clearTimeout(toastTimer); el('toast').textContent = message; el('toast').hidden = false; toastTimer = setTimeout(() => { el('toast').hidden = true; }, 6500); }
  function persist() {
    if (HOST) { HOST.save(model); return; }
    try { localStorage.setItem(STORAGE, JSON.stringify(model)); saveFailure = ''; el('save-state').textContent = 'Saved in this browser · ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); }
    catch (_) { saveFailure = 'Browser storage unavailable or full. Export JSON to keep your changes.'; el('save-state').textContent = saveFailure; toast(saveFailure); }
  }
  function commit(next, message = 'Model updated', resetView = false, replaceModel = false) {
    if (HOST && !HOST.canEdit()) throw new Error('Wait for the workspace document, or resolve the file conflict. Export JSON to preserve canvas changes before reopening.');
    const validated = M.validate(next);
    undoStack.push(JSON.stringify(model)); if (undoStack.length > 30) undoStack.shift(); redoStack = []; model = validated;
    if (focus && !model.nodes.some(n => n.id === focus)) focus = null;
    if (selected && !model.nodes.some(n => n.id === selected)) selected = null;
    selectedGroup = null; trace = null; pendingPositions = null;
    if (replaceModel) { window.dispatchEvent(new CustomEvent('modeller-replaced')); viewExtras = {}; activeNamedView = null; relationshipTypeIds = null; showExternal = true; viewPositions = null; perspective = 'solution'; processId = null; selectedLayerIds = null; }
    if (processId && !model.nodes.some(n => n.id === processId && D.kind(n) === 'process')) processId = null;
    if (selectedLayerIds) selectedLayerIds = selectedLayerIds.filter(id => (model.layers || []).some(l => l.id === id));
    if (activeNamedView && !(model.namedViews || []).some(v => v.id === activeNamedView)) activeNamedView = null;
    if (relationshipTypeIds !== null) relationshipTypeIds = relationshipTypeIds.filter(id => model.relationshipTypes.some(t => t.id === id));
    if (resetView) { camera = null; viewPositions = null; }
    persist(); render(); window.dispatchEvent(new CustomEvent('modeller-changed')); if (message) toast(message);
  }
  function history(direction) {
    if(HOST?.undo){HOST.undo(direction);return;}
    const from = direction === 'undo' ? undoStack : redoStack, to = direction === 'undo' ? redoStack : undoStack;
    if (!from.length) return; to.push(JSON.stringify(model)); model = M.parse(from.pop()); focus = model.nodes.some(n => n.id === focus) ? focus : null; selected = null; selectedGroup = null; trace = null; expanded = new Set(); camera = null; viewPositions = null; activeNamedView = null; relationshipTypeIds = null; showExternal = true; persist(); render();
  }
  function setFocus(nodeId) { const n = model.nodes.find(n => n.id === nodeId); if (n) { perspective = D.kind(n) === 'component' ? 'solution' : D.kind(n) === 'process' ? 'process' : 'stakeholder'; processId = null; selectedLayerIds = null; } focus = nodeId; expanded = new Set(); selected = nodeId; selectedGroup = null; trace = null; camera = null; viewPositions = null; activeNamedView = null; render(); }
  function updateSelectionStyles() {
    for (const group of el('graph').querySelectorAll('[data-node]')) {
      const n = diagram.nodes.find(n => n.id === group.dataset.node);
      group.classList.toggle('selected', !!n && selected === (n.originalId || n.id));
      if (!trace) { group.classList.remove('dim'); group.classList.remove('trace'); }
    }
    for (const group of el('graph').querySelectorAll('[data-group]')) group.classList.toggle('selected', group.dataset.group === selectedGroup);
  }
  function select(nodeId) { selected = nodeId; window.dispatchEvent(new CustomEvent('modeller-selected', {detail:nodeId})); selectedGroup = null; trace = null; updateSelectionStyles(); renderInspector(); renderTree(); }
  function childrenOf(nodeId) { return model.nodes.filter(n => n.parentId === nodeId); }
  function typeOf(node) { return model.types.find(t => t.id === node.typeId); }
  function relationOf(edge) { return model.relationshipTypes.find(t => t.id === edge.typeId); }
  function viewKey() {
    if (!expanded.size && perspective === 'solution' && !processId && selectedLayerIds === null) return focus || 'overview';
    let hash = 2166136261;
    for (const c of JSON.stringify([perspective, processId, selectedLayerIds, focus, [...expanded].sort()])) { hash ^= c.charCodeAt(0); hash = Math.imul(hash, 16777619); }
    return 'expanded_' + (hash >>> 0).toString(16);
  }
  function render() {
    el('rename-model').textContent = model.name; el('node-count').textContent = model.nodes.length;
    el('model-stats').textContent = `${model.nodes.length} entities · ${model.edges.length} relationships · One connected model`;
    el('perspective').value = perspective;
    el('undo').disabled = HOST ? false : !undoStack.length; el('redo').disabled = HOST ? false : !redoStack.length;
    if (saveFailure) el('save-state').textContent = saveFailure;
    el('scope-title').textContent = focus ? model.nodes.find(n => n.id === focus).name : perspectiveNames[perspective];
    el('scope-subtitle').textContent = `${perspectiveNames[perspective]}${processId ? ' · ' + M.path(model,processId) : ''}${selectedLayerIds !== null ? ' · Layer filter active' : ''} · Double-click a block to explore.`;
    el('up-level').disabled = focus === null;
    renderBreadcrumb(); renderTree(); renderRelations(); renderGraph(); renderInspector(); updateExplorerButton(); renderSavedViews(); renderGuidance(); window.dispatchEvent(new CustomEvent('modeller-rendered'));
  }
  function renderBreadcrumb() {
    const { nodes } = M.index(model); let n = nodes.get(focus); const ancestors = [];
    while (n) { ancestors.unshift(n); n = nodes.get(n.parentId); }
    el('breadcrumb').innerHTML = `<button type="button" data-action="focus" data-id="" ${focus === null ? 'aria-current="page"' : ''}>Overview</button>` + ancestors.map((n, i) => `<span aria-hidden="true">/</span><button type="button" data-action="focus" data-id="${esc(n.id)}" ${i === ancestors.length - 1 ? 'aria-current="page"' : ''} title="${esc(n.name)}">${esc(n.name)}</button>`).join('');
  }
  function renderTree() {
    const term = el('search').value.trim().toLocaleLowerCase();
    if (term) {
      const matches = model.nodes.filter(n => `${M.path(model, n.id)} ${typeOf(n).name} ${n.description || ''}`.toLocaleLowerCase().includes(term));
      el('tree').innerHTML = matches.map(n => `<button type="button" class="search-result" data-action="locate" data-id="${esc(n.id)}"><strong>${esc(n.name)}</strong><small>${esc(M.path(model, n.id))}</small></button>`).join('') || '<p class="small-note">No matching components.</p>'; return;
    }
    const { children } = M.index(model);
    const list = parentId => '<ul>' + (children.get(parentId) || []).map(n => {
      const kids = children.get(n.id) || [], t = typeOf(n), open = treeOpen.has(n.id);
      return `<li><div class="tree-row ${selected === n.id ? 'active' : ''}">${kids.length ? `<button type="button" class="tree-toggle" aria-label="${open ? 'Collapse' : 'Expand'} ${esc(n.name)} in explorer" aria-expanded="${open}" data-action="tree-toggle" data-id="${esc(n.id)}">${open ? '▾' : '▸'}</button>` : '<span class="tree-toggle"></span>'}<button type="button" class="tree-label" data-action="select" data-id="${esc(n.id)}" title="${esc(n.name)}"><span class="type-dot" style="--type-color:${t.color}"></span>${esc(n.name)}</button><button type="button" class="tree-open" data-action="focus" data-id="${esc(n.id)}" aria-label="Explore inside ${esc(n.name)}">›</button></div>${kids.length && open ? list(n.id) : ''}</li>`;
    }).join('') + '</ul>';
    el('tree').innerHTML = model.nodes.length ? list(null) : '<p class="small-note">No components yet. Add your first component.</p>';
  }
  function renderRelations() {
    el('all-relations').innerHTML = model.edges.map(e => `<button type="button" class="dependency-row" data-action="edge-detail" data-id="${esc(e.id)}"><strong>${esc(model.nodes.find(n => n.id === e.source).name)} → ${esc(model.nodes.find(n => n.id === e.target).name)}</strong><small>${esc(relationOf(e).name)}${e.label ? ' · ' + esc(e.label) : ''}</small></button>`).join('') || '<p class="small-note">No relationships yet.</p>';
  }
  function lines(text, limit = 27, maxLines = 2) {
    const words = String(text).split(/\s+/); const result = []; let line = '';
    for (let word of words) {
      while (word.length > limit) { if (line) { result.push(line); line = ''; } result.push(word.slice(0, limit)); word = word.slice(limit); }
      if ((line + ' ' + word).trim().length > limit) { result.push(line); line = word; } else line = (line + ' ' + word).trim();
    }
    if (line) result.push(line);
    if (result.length > maxLines) { result.length = maxLines; result[maxLines - 1] = result[maxLines - 1].slice(0, limit - 1) + '…'; }
    return result;
  }
  function nodeMarkup(n, background = false) {
    const originalId = n.originalId || n.id, original = model.nodes.find(v => v.id === originalId), t = typeOf(original);
    const kids = perspective === 'layers' ? 0 : childrenOf(originalId).length, isSelected = selected === originalId;
    const isTrace = trace && (trace.nodes.has(originalId) || originalId === trace.origin || [...M.descendants(model, originalId)].some(id => trace.nodes.has(id) || id === trace.origin));
    const cls = ['node', n.expanded ? 'scope-node' : '', n.external ? 'external-node' : '', isSelected ? 'selected' : '', trace ? (isTrace ? 'trace' : 'dim') : ''].join(' ');
    const radius = t.shape === 'square' ? 3 : 11;
    const label = `${n.name}, ${t.name}${kids ? `, contains ${kids} components` : ''}${n.external ? ', external context' : ''}`;
    if (background) return `<g class="${cls}" transform="translate(${n.x} ${n.y})" data-node="${esc(n.id)}"><rect class="node-body" width="${n.w}" height="${n.h}" rx="${radius}" fill="var(--graph-highlight)" fill-opacity=".55" stroke="${t.color}" stroke-width="1"/><rect x="0" y="0" width="${n.w}" height="55" fill="var(--graph-surface)" fill-opacity=".7" rx="${radius}"/></g>`;
    const titleLines = lines(n.name, n.expanded ? Math.max(22, Math.floor((n.w - 90) / 8)) : 25, n.expanded ? 1 : 2);
    const hidden = projection.hidden.get(n.id) || 0;
    const icon = globalThis.ModellerOffice.iconFor(model, n);
    if (icon) return nodeMarkupWithIcon(n, cls, radius, label, titleLines, hidden, kids, t, icon);
    return `<g class="${cls}" transform="translate(${n.x} ${n.y})" data-node="${esc(n.id)}" tabindex="0" role="button" aria-label="${esc(label)}"><title>${esc(label)}</title>${n.expanded ? `<rect width="${n.w}" height="55" fill="transparent"/>` : `<rect class="node-body" width="${n.w}" height="${n.h}" rx="${radius}" fill="var(--graph-surface)" stroke="var(--graph-line)"/><rect x="0" y="15" width="4" height="${n.h - 30}" rx="2" fill="${t.color}"/>`}${!n.expanded && t.shape === 'database' ? `<path d="M18 25c0-6 20-6 20 0v14c0 6-20 6-20 0Z M18 25c0 6 20 6 20 0" fill="none" stroke="${t.color}" stroke-width="1.5"/>` : `<rect x="18" y="${n.expanded ? 19 : 23}" width="13" height="13" rx="${t.shape === 'square' ? 1 : 3}" fill="${t.color}" fill-opacity=".16" stroke="${t.color}"/>`}${n.expanded ? `<text x="42" y="31" class="node-title" style="font-size:13px">${esc(titleLines[0])}</text><text x="${n.w - 52}" y="31" text-anchor="end" class="node-meta">${n.isScope ? 'CURRENT LEVEL' : 'EXPANDED'}</text>` : `<text x="${t.shape === 'database' ? 48 : 42}" y="33" class="node-type" fill="${t.color}">${esc(t.name.toLocaleUpperCase().slice(0, 27))}</text><text x="18" y="62" class="node-title">${titleLines.map((line, i) => `<tspan x="18" dy="${i ? 19 : 0}">${esc(line)}</tspan>`).join('')}</text><text x="18" y="107" class="node-meta">${n.external ? 'EXTERNAL CONTEXT ↗' : `${kids ? `${kids} component${kids === 1 ? '' : 's'} inside` : 'Component'}${hidden ? ` · ${hidden} internal link${hidden === 1 ? '' : 's'}` : ''}`}</text>`}${kids && !n.isScope && !n.external ? `<g data-action="expand-node" data-id="${esc(originalId)}" role="button" tabindex="0" aria-label="${n.expanded ? 'Collapse' : 'Expand'} ${esc(n.name)} here"><rect x="${n.w - 33}" y="${n.expanded ? 12 : 88}" width="24" height="24" rx="5" fill="var(--graph-highlight)" stroke="var(--graph-line)"/><text x="${n.w - 21}" y="${n.expanded ? 29 : 105}" text-anchor="middle" fill="var(--accent-hover)" font-size="16">${n.expanded ? '−' : '+'}</text></g>` : ''}</g>`;
  }
  function edgeMarkup(group, nodeMap, i) {
    const source = nodeMap.get(group.source), target = nodeMap.get(group.target); if (!source || !target) return '';
    const rt = relationOf(group), a = { x: source.x, y: source.y, w: source.w, h: source.expanded ? 54 : source.h }, b = { x: target.x, y: target.y, w: target.w, h: target.expanded ? 54 : target.h };
    const dx = b.x + b.w / 2 - a.x - a.w / 2, dy = b.y + b.h / 2 - a.y - a.h / 2;
    let p1, p2, c1, c2;
    const siblings = projection.edges.filter(e => e.source === group.source && e.target === group.target), offset = (siblings.indexOf(group) - (siblings.length - 1) / 2) * 23;
    if (Math.abs(dx) > Math.abs(dy) * .8) {
      const sign = dx >= 0 ? 1 : -1; p1 = [a.x + (sign > 0 ? a.w : 0), a.y + a.h / 2 + offset]; p2 = [b.x + (sign > 0 ? 0 : b.w), b.y + b.h / 2 + offset]; const bend = Math.max(55, Math.abs(p2[0] - p1[0]) * .5); c1 = [p1[0] + sign * bend, p1[1]]; c2 = [p2[0] - sign * bend, p2[1]];
    } else {
      const sign = dy >= 0 ? 1 : -1; p1 = [a.x + a.w / 2 + offset, a.y + (sign > 0 ? a.h : 0)]; p2 = [b.x + b.w / 2 + offset, b.y + (sign > 0 ? 0 : b.h)]; const bend = Math.max(50, Math.abs(p2[1] - p1[1]) * .5); c1 = [p1[0], p1[1] + sign * bend]; c2 = [p2[0], p2[1] - sign * bend];
    }
    const manual = viewExtras.routes?.[group.edges[0]?.id];
    const path = manual?.length ? 'M'+p1.join(' ')+' L'+manual.map(p=>p.x+' '+p.y).join(' L')+' L'+p2.join(' ') : viewExtras.routing==='straight' ? 'M'+p1.join(' ')+' L'+p2.join(' ') : viewExtras.routing==='orthogonal' ? 'M'+p1.join(' ')+' L'+[(p1[0]+p2[0])/2,p1[1]].join(' ')+' L'+[(p1[0]+p2[0])/2,p2[1]].join(' ')+' L'+p2.join(' ') : `M${p1.join(' ')} C${c1.join(' ')} ${c2.join(' ')} ${p2.join(' ')}`;
    const lx = (p1[0] + 3 * c1[0] + 3 * c2[0] + p2[0]) / 8, ly = (p1[1] + 3 * c1[1] + 3 * c2[1] + p2[1]) / 8;
    const roles = [...new Set(group.edges.map(e => e.role).filter(Boolean))].join('/');
    const label = `${group.edges.length > 1 ? group.edges.length + ' × ' : ''}${rt.name}${roles ? ' · ' + roles : ''}`.slice(0, 48), width = label.length * 5.3 + 18;
    return `<g class="graph-edge ${selectedGroup === group.id ? 'selected' : ''}" data-group="${group.id}" tabindex="0" role="button" aria-label="${esc(`${group.edges.length} ${rt.name} relationship${group.edges.length === 1 ? '' : 's'} from ${source.name} to ${target.name}`)}"><title>${esc(`${source.name} → ${target.name}: ${label}. Select to see exact endpoints.`)}</title><path d="${path}" class="edge-hit"/><path d="${path}" class="edge-line" stroke="${rt.color}" ${rt.style === 'dashed' ? 'stroke-dasharray="6 5"' : ''} marker-end="url(#arrow-${i})"/><g transform="translate(${lx} ${ly})"><rect class="edge-pill" x="${-width / 2}" y="-11" width="${width}" height="21" rx="5"/><text class="edge-label" y="3">${esc(label)}</text></g></g>`;
  }
  function renderGraph() {
    projection = M.projectView(model, viewSpec());
    diagram = M.layoutView(model, projection, viewSpec(), pendingPositions || viewPositions || model.views[viewKey()]?.positions || {});
    const nodeMap = new Map(diagram.nodes.map(n => [n.id, n]));
    el('graph').innerHTML = `<defs>${projection.edges.map((g, i) => `<marker id="arrow-${i}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 1L9 5L0 9" fill="none" stroke="${relationOf(g).color}" stroke-width="1.5"/></marker>`).join('')}</defs><title>${esc(model.name)} — ${esc(focus ? M.path(model, focus) : 'overview')}</title>` + diagram.nodes.filter(n => n.expanded).map(n => nodeMarkup(n, true)).join('') + projection.edges.map((g, i) => edgeMarkup(g, nodeMap, i)).join('') + diagram.nodes.map(n => nodeMarkup(n)).join('');
    el('graph').insertAdjacentHTML('afterbegin', (diagram.bands || []).map(b => `<g aria-label="${esc(b.name)} layer"><rect x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" rx="12" fill="var(--graph-highlight)" stroke="${b.color}"/><text x="${b.x + 20}" y="${b.y + 27}" fill="${b.color}" font-size="16" font-weight="650">${esc(b.name)}</text><text x="${b.x + 20}" y="${b.y + 47}" fill="var(--graph-muted)" font-size="11">${esc(b.description.slice(0, 125))}</text></g>`).join(''));
    if(alignmentGuides.length) el('graph').insertAdjacentHTML('beforeend',alignmentGuides.map(g=>`<line x1="${g.x1}" y1="${g.y1}" x2="${g.x2}" y2="${g.y2}" stroke="#6366f1" stroke-width="1.5" stroke-dasharray="6 4" pointer-events="none"/>`).join(''));
    el('empty-canvas').hidden = diagram.nodes.length > 0;
    el('legend').innerHTML = [...new Set(diagram.nodes.map(n => n.typeId))].map(typeId => { const t = model.types.find(x => x.id === typeId); return `<span><i class="type-dot" style="--type-color:${t.color}"></i>${esc(t.name)}</span>`; }).join('');
    const internal = diagram.nodes.filter(n => !n.external && !n.isScope).length, external = diagram.nodes.filter(n => n.external).length;
    el('projection-count').textContent = `${internal} visible · ${external} external · ${projection.edges.length} link groups`;
    if (!camera) fitView(); else applyCamera();
  }
  function bounds() {
    const ns = [...diagram.nodes, ...(diagram.bands || [])]; const minx = Math.min(0, ...ns.map(n => n.x - 40)), miny = Math.min(0, ...ns.map(n => n.y - 40));
    return { x: minx, y: miny, w: Math.max(400, ...ns.map(n => n.x + n.w + 45)) - minx, h: Math.max(300, ...ns.map(n => n.y + n.h + 65)) - miny };
  }
  function fitView() {
    const box = bounds(), viewport = el('viewport'), aspect = (viewport.clientWidth || 800) / (viewport.clientHeight || 510);
    let w = box.w, h = box.h; if (w / h < aspect) w = h * aspect; else h = w / aspect;
    camera = { x: box.x - (w - box.w) / 2, y: box.y - (h - box.h) / 2, w, h }; homeCamera = { ...camera }; applyCamera();
  }
  function applyCamera() { if (!camera) return; el('graph').setAttribute('viewBox', `${camera.x} ${camera.y} ${camera.w} ${camera.h}`); el('zoom-label').textContent = `${Math.round((homeCamera?.w || camera.w) / camera.w * 100)}%`; window.dispatchEvent(new CustomEvent('modeller-camera')); }
  function zoom(factor, point = null) {
    if (!camera) return; const ratio = Math.max(.1, Math.min(5, (homeCamera?.w || camera.w) / (camera.w * factor))); const actual = (homeCamera?.w || camera.w) / (ratio * camera.w);
    const cx = point?.x ?? camera.x + camera.w / 2, cy = point?.y ?? camera.y + camera.h / 2;
    camera = { x: cx + (camera.x - cx) * actual, y: cy + (camera.y - cy) * actual, w: camera.w * actual, h: camera.h * actual }; applyCamera();
  }
  function graphPoint(event) {
    const svg = el('graph'), rect = svg.getBoundingClientRect(), scale = Math.min(rect.width / camera.w, rect.height / camera.h);
    return { x: camera.x + (event.clientX - rect.left - (rect.width - camera.w * scale) / 2) / scale, y: camera.y + (event.clientY - rect.top - (rect.height - camera.h * scale) / 2) / scale };
  }
  function dependencyRow(e, dir) {
    const other = dir === 'out' ? e.target : e.source, n = model.nodes.find(x => x.id === other);
    return `<button type="button" class="dependency-row" data-action="edge-detail" data-id="${esc(e.id)}"><strong>${dir === 'out' ? '→' : '←'} ${esc(n.name)}</strong><small>${esc(relationOf(e).name)}${e.label ? ' · ' + esc(e.label) : ''}</small><small>${esc(M.path(model, other))}</small></button>`;
  }
  function renderInspector() { renderInspectorBase(); dimensionDetails(); }
  function renderInspectorBase() {
    const content = el('inspector-content'); el('clear-selection').hidden = !selected && !selectedGroup;
    if (selectedGroup) {
      const g = projection.edges.find(e => e.id === selectedGroup); if (!g) { selectedGroup = null; return renderInspector(); }
      el('inspector-heading').textContent = 'Relationship group';
      content.innerHTML = `<h3>${esc(relationOf(g).name)}</h3><p>${g.edges.length} exact relationship${g.edges.length === 1 ? '' : 's'} represented by this visible link. The endpoints below stay unchanged when the view is collapsed.</p>` + g.edges.map(e => `<div class="relationship-list-item"><strong>${esc(M.path(model, e.source))}</strong><p>↓ ${esc(e.label || relationOf(e).name)}</p><strong>${esc(M.path(model, e.target))}</strong><button type="button" class="button tiny" data-action="edit-edge" data-id="${esc(e.id)}">Edit relationship</button></div>`).join(''); return;
    }
    const n = model.nodes.find(n => n.id === selected);
    if (!n) {
      el('inspector-heading').textContent = 'Your model';
      content.innerHTML = `<div class="inspector-empty"><span class="inspector-symbol" aria-hidden="true">▧</span><h3>A little context.<br>A lot more clarity.</h3><p>Select a component to see its properties and connections.</p><p>Double-click any block to explore inside. You can also expand blocks to show several levels together.</p><div class="detail-section"><h4>Try this</h4><button type="button" class="dependency-row" data-action="focus" data-id="${esc(model.nodes.find(x => x.id === 'pp')?.id || model.nodes[0]?.id || '')}"><strong>Explore ${esc(model.nodes.find(x => x.id === 'pp')?.name || model.nodes[0]?.name || 'your model')} →</strong><small>Follow the detail without losing the bigger picture.</small></button></div></div>`; return;
    }
    el('inspector-heading').textContent = 'Component details'; const t = typeOf(n), outgoing = model.edges.filter(e => e.source === n.id), incoming = model.edges.filter(e => e.target === n.id), kids = childrenOf(n.id);
    const props = [...new Set([...t.fields, ...Object.keys(n.properties || {})])];
    content.innerHTML = `<p class="inspector-path">${esc(M.path(model, n.id))}</p><span class="type-badge"><i class="type-dot" style="--type-color:${t.color}"></i> ${esc(t.name)}</span><h3>${esc(n.name)}</h3><p>${esc(n.description || 'Add a description to explain the purpose of this component.')}</p><div class="inspector-actions"><button type="button" class="button primary" data-action="focus" data-id="${esc(n.id)}">Explore inside →</button><button type="button" class="button" data-action="edit-node" data-id="${esc(n.id)}">Edit</button><button type="button" class="button" data-action="add-child" data-id="${esc(n.id)}">＋ Child</button><button type="button" class="button" data-action="link-from" data-id="${esc(n.id)}">↗ Link</button></div><dl class="inspector-properties"><dt>Contains</dt><dd>${kids.length} direct · ${M.descendants(model, n.id).size} total</dd>${props.map(f => `<dt>${esc(f)}</dt><dd>${esc(n.properties?.[f] || '—')}</dd>`).join('')}</dl><div class="trace-controls"><button type="button" class="button tiny" data-action="trace-in" data-id="${esc(n.id)}">Trace incoming</button><button type="button" class="button tiny" data-action="trace-out" data-id="${esc(n.id)}">Trace outgoing</button></div>${trace ? `<div class="trace-note">${trace.nodes.size} component${trace.nodes.size === 1 ? '' : 's'} reachable by ${trace.direction} links. Follows explicit relationships only.<br><button type="button" data-action="clear-trace">Clear trace</button></div>` : ''}<div class="detail-section"><h4>Outgoing · ${outgoing.length}</h4>${outgoing.map(e => dependencyRow(e, 'out')).join('') || '<p>No direct outgoing links.</p>'}</div><div class="detail-section"><h4>Incoming · ${incoming.length}</h4>${incoming.map(e => dependencyRow(e, 'in')).join('') || '<p>No direct incoming links.</p>'}</div><div class="detail-section"><h4>Components inside</h4>${kids.map(c => `<button type="button" class="dependency-row" data-action="locate" data-id="${esc(c.id)}"><strong>${esc(c.name)} →</strong><small>${esc(typeOf(c).name)}</small></button>`).join('') || '<p>No children yet. Use “＋ Child” to add detail.</p>'}</div>`;
  }
  function dimensionDetails() {
    el('dimension-details')?.remove();
    const n = model.nodes.find(n => n.id === selected); if (!n) return;
    const layers = (n.layerIds || []).map(id => model.layers?.find(l => l.id === id)?.name).filter(Boolean);
    el('inspector-content').insertAdjacentHTML('afterbegin', `<div id="dimension-details" class="detail-section"><h4>${esc(D.kind(n))}</h4>${D.kind(n) === 'component' ? `<p>Layers (primary first): ${esc(layers.join(', ') || 'Unassigned')}</p>` : ''}${model.edges.filter(e => e.source === n.id || e.target === n.id).filter(e => e.role).map(e => `<p>${esc(D.roleLabel(e))}: ${esc(model.nodes.find(x => x.id === (e.source === n.id ? e.target : e.source)).name)}</p>`).join('')}</div>`);
  }
  function dialog(title, html, submit = null) {
    el('dialog-title').textContent = title; el('dialog-content').innerHTML = html; el('dialog-error').hidden = true;
    const form = el('dialog-content').querySelector('form');
    if (form && submit) form.addEventListener('submit', event => { event.preventDefault(); try { submit(new FormData(form)); } catch (e) { el('dialog-error').textContent = e.message; el('dialog-error').hidden = false; } });
    if (!el('dialog').open) el('dialog').showModal();
  }
  function closeDialog() { el('dialog').close(); }
  function options(list, value, name = 'name') { return list.map(t => `<option value="${esc(t.id)}"${t.id === value ? ' selected' : ''}>${esc(t[name])}</option>`).join(''); }
  function nodeOptions(value, exclude = new Set(), includeRoot = false) {
    const ns = model.nodes.filter(n => !exclude.has(n.id)).map(n => ({ id: n.id, name: M.path(model, n.id) })).sort((a, b) => a.name.localeCompare(b.name));
    return (includeRoot ? `<option value=""${value === null ? ' selected' : ''}>Architecture overview (top level)</option>` : '') + options(ns, value);
  }
  function customFields(typeId, values, typeList = model.types) { const t = typeList.find(t => t.id === typeId); return (t?.fields || []).map((f, i) => `<label class="form-field">${esc(f)}<input name="property_${i}" data-property="${esc(f)}" maxlength="2000" value="${esc(values?.[f] || '')}"></label>`).join(''); }
  function mountIconPicker(initial) {
    const old = el('node-form').querySelector('[name=iconId]').closest('label');
    old.outerHTML = `<fieldset class="icon-picker"><legend>Architecture or product icon</legend><input type="hidden" name="iconId" id="chosen-icon" value="${esc(initial || '')}"><div class="form-row"><label class="form-field">Search icons<input type="search" id="icon-search" placeholder="e.g. Lambda, database, Power Apps"></label><label class="form-field">Collection<select id="icon-collection"><option value="">All collections</option>${[...new Set(Object.values(globalThis.ModellerIcons).map(i=>i.collection))].sort().map(c=>`<option>${esc(c)}</option>`).join('')}</select></label></div><div id="icon-grid" class="icon-grid" role="group" aria-label="Available architecture icons"></div><p id="icon-result-count" class="small-note" role="status" aria-live="polite"></p><div id="icon-preview" class="icon-preview"></div><p class="small-note">Use vendor artwork to identify the actual product. Keep its proportions and a product label. <a href="https://github.com/mightora/architecture-modeller.mightora.io/blob/main/THIRD-PARTY-NOTICES.md" target="_blank" rel="noopener">Collections and usage terms ↗</a>.</p></fieldset>`;
    const draw = () => {
      const selected = el('chosen-icon').value, term = el('icon-search').value.trim().toLowerCase(), collection = el('icon-collection').value;
      const matches = Object.values(globalThis.ModellerIcons).filter(i=>(!collection||i.collection===collection)&&(`${i.name} ${i.id} ${i.collection}`).toLowerCase().includes(term));
      el('icon-grid').innerHTML = `<button type="button" class="icon-choice" data-icon-id="" aria-pressed="${!selected}"><span aria-hidden="true">▧</span>Generic symbol</button>` + matches.map(i=>`<button type="button" class="icon-choice" data-icon-id="${i.id}" aria-pressed="${selected===i.id}" title="${esc(i.collection)}"><img src="${i.svg}" alt="" width="30" height="30"><span>${esc(i.name)}</span></button>`).join('');
      el('icon-result-count').textContent = `${matches.length} icons match. Selection is retained when filtering.`;
      const icon = globalThis.ModellerIcons[selected];
      el('icon-preview').innerHTML = icon ? `<img src="${icon.svg}" alt="${esc(icon.name)}" width="36" height="36"><span><strong>${esc(icon.name)}</strong><small>${esc(icon.collection)} · <a href="${esc(icon.termsUrl)}" target="_blank" rel="noopener">Use terms ↗</a></small></span>` : '<span>Selected: generic component symbol</span>';
    };
    el('icon-grid').onclick = event => { const button = event.target.closest('[data-icon-id]'); if (!button) return; const id=button.dataset.iconId;el('chosen-icon').value=id;draw();el('icon-grid').querySelector(`[data-icon-id="${id}"]`)?.focus(); };
    el('icon-search').oninput = draw; el('icon-collection').onchange = draw; draw();
  }
  function nodeForm(nodeId = null, parentId = focus, intendedKind = null) {
    const draft = M.copy(model), language = D.ensureLanguage(M, draft);
    const existing = model.nodes.find(n => n.id === nodeId), newKind = intendedKind || D.kind(model.nodes.find(n => n.id === parentId));
    const n = existing || { id: M.id(), kind: newKind, name: '', description: '', typeId: newKind === 'process' ? language.processType : newKind === 'stakeholder' ? language.stakeholderType : model.types[0].id, parentId, properties: {} };
    const excluded = existing ? M.descendants(model, nodeId, true) : new Set(), propertyValues = { ...n.properties };
    dialog(existing ? 'Edit component' : 'Add a component', `<form id="node-form"><label class="form-field">Name<input name="name" required maxlength="160" value="${esc(n.name)}" placeholder="e.g. Customer service application" autofocus></label><div class="form-row"><label class="form-field">Component type<select name="typeId" id="node-type">${options(model.types, n.typeId)}</select></label><label class="form-field">Inside / parent<select name="parentId">${nodeOptions(n.parentId, excluded, true)}</select></label></div><label class="form-field">Description<textarea name="description" maxlength="4000" rows="3">${esc(n.description)}</textarea></label><div id="custom-fields">${customFields(n.typeId, propertyValues)}</div><p class="small-note">Nesting is independent of type. Any component can contain children. Relationships keep the component’s ID when you move it.</p><div class="dialog-actions">${existing ? `<button type="button" class="button danger" data-action="delete-node" data-id="${esc(n.id)}">Delete…</button>` : ''}<button type="button" class="button" data-action="close-dialog">Cancel</button><button type="submit" class="button primary">${existing ? 'Save changes' : 'Add component'}</button></div></form>`, data => {
      for (const input of el('custom-fields').querySelectorAll('input')) propertyValues[input.dataset.property] = input.value;
      const next = M.copy(draft), kind = data.get('kind'), primary = data.get('primaryLayer'), updated = { ...n, kind, layerIds: kind === 'component' ? [...new Set([primary, ...data.getAll('layer')].filter(Boolean))] : [], name: data.get('name').trim(), typeId: data.get('typeId'), parentId: data.get('parentId') || null, description: data.get('description'), properties: propertyValues, iconId: data.get('iconId') || '' };
      if (existing) next.nodes[next.nodes.findIndex(v => v.id === nodeId)] = updated; else next.nodes.push(updated);
      next.views = {}; selected = n.id; commit(next, existing ? 'Component updated' : 'Component added', true); closeDialog();
    });
    el('dialog-title').textContent = `${existing ? 'Edit' : 'Add'} ${D.kind(n)}`;
    el('node-type').innerHTML = options(draft.types, n.typeId); el('custom-fields').innerHTML = customFields(n.typeId, propertyValues, draft.types);
    el('node-form').insertAdjacentHTML('afterbegin', `<label class="form-field">Entity category<select name="kind">${D.kinds.map(k => `<option value="${k}"${D.kind(n) === k ? ' selected' : ''}>${k}</option>`).join('')}</select></label>`);
    el('custom-fields').insertAdjacentHTML('beforebegin', `<label class="form-field">Primary application layer<select name="primaryLayer"><option value="">Unassigned</option>${options(model.layers || [], n.layerIds?.[0])}</select><small>Independent of the parent hierarchy. The primary layer determines placement in the layer view.</small></label><fieldset><legend>Additional layers (components only)</legend>${(model.layers || []).map(l => `<label class="check-field"><input type="checkbox" name="layer" value="${l.id}"${n.layerIds?.slice(1).includes(l.id) ? ' checked' : ''}>${esc(l.name)}</label>`).join('') || '<p class="small-note">Define layers using Application layers.</p>'}</fieldset><label class="form-field">Product icon<select name="iconId"><option value="">Generic component symbol</option>${options(Object.values(globalThis.ModellerIcons), n.iconId)}</select><small>Official archived Microsoft icons. Product names must match the icon used. <a href="#icon-terms" data-action="icon-terms">Source and use terms</a>.</small></label>`);
    el('node-type').addEventListener('change', event => { for (const input of el('custom-fields').querySelectorAll('input')) propertyValues[input.dataset.property] = input.value; el('custom-fields').innerHTML = customFields(event.target.value, propertyValues, draft.types); });
    mountIconPicker(n.iconId);
  }
  function edgeForm(edgeId = null, fromId = selected) {
    if (model.nodes.length < 2) return toast('Add at least two components before creating a relationship.');
    const existing = model.edges.find(e => e.id === edgeId), first = model.nodes.find(n => n.id === fromId)?.id || model.nodes[0].id;
    const edge = existing || { id: M.id('e'), source: first, target: model.nodes.find(n => n.id !== first).id, typeId: model.relationshipTypes[0].id, label: '', description: '' };
    dialog(existing ? 'Edit relationship' : 'Connect any two components', `<form><p class="dialog-copy">Choose exact endpoints at any level. The diagram will roll the link up to visible ancestors when you collapse the model.</p><label class="form-field">Source component<select name="source" id="edge-source">${nodeOptions(edge.source)}</select></label><button type="button" class="button tiny" id="swap-endpoints" style="margin-top:8px">⇅ Swap source and target</button><label class="form-field">Relationship type<select name="typeId" id="edge-type">${options(model.relationshipTypes, edge.typeId)}</select><small id="relationship-rules"></small></label><label class="form-field">Target component<select name="target" id="edge-target">${nodeOptions(edge.target)}</select></label><label class="form-field">Label (optional)<input name="label" maxlength="160" value="${esc(edge.label)}" placeholder="e.g. Sends case documents"></label><label class="form-field">Notes (optional)<textarea name="description" maxlength="4000" rows="2">${esc(edge.description)}</textarea></label><div class="dialog-actions">${existing ? `<button type="button" class="button danger" data-action="delete-edge" data-id="${esc(edge.id)}">Delete relationship</button>` : ''}<button type="button" class="button" data-action="close-dialog">Cancel</button><button type="submit" class="button primary">${existing ? 'Save changes' : 'Create relationship'}</button></div></form>`, data => {
      const next = M.copy(model), updated = { id: edge.id, source: data.get('source'), target: data.get('target'), typeId: data.get('typeId'), role: data.get('role') || '', label: data.get('label').trim(), description: data.get('description') };
      if (existing) next.edges[next.edges.findIndex(e => e.id === edgeId)] = updated; else next.edges.push(updated);
      commit(next, existing ? 'Relationship updated' : 'Relationship created', true); closeDialog();
    });
    el('edge-target').closest('label').insertAdjacentHTML('afterend', `<label class="form-field">Stakeholder responsibility<select name="role"><option value="">Not specified</option>${D.roles.map(r => `<option value="${r}"${edge.role === r ? ' selected' : ''}>${esc(D.roleLabel({ role: r }))}</option>`).join('')}</select><small>RACI is valid only from a stakeholder to a process.</small></label>`);
    const rules = () => { const t = model.relationshipTypes.find(t => t.id === el('edge-type').value), labels = ids => ids.length ? ids.map(id => model.types.find(t => t.id === id).name).join(', ') : 'Any type'; el('relationship-rules').textContent = `Source: ${labels(t.sourceTypes)}. Target: ${labels(t.targetTypes)}.${t.semantic ? ' Meaning: ' + t.semantic + '.' : ''}`; };
    rules(); el('edge-type').addEventListener('change', rules); el('swap-endpoints').onclick = () => { const a = el('edge-source'), b = el('edge-target'); [a.value, b.value] = [b.value, a.value]; };
  }
  function edgeDetail(edgeId) {
    const edge = model.edges.find(e => e.id === edgeId); if (!edge) return;
    dialog('Relationship details', `<div class="relationship-list-item"><strong>${esc(M.path(model, edge.source))}</strong><p>↓ ${esc(relationOf(edge).name)}${edge.label ? ' · ' + esc(edge.label) : ''}</p><strong>${esc(M.path(model, edge.target))}</strong><p>${esc(edge.description)}</p></div><div class="dialog-actions"><button type="button" class="button" data-action="locate-close" data-id="${esc(edge.source)}">Show source</button><button type="button" class="button" data-action="locate-close" data-id="${esc(edge.target)}">Show target</button><button type="button" class="button primary" data-action="edit-edge" data-id="${esc(edge.id)}">Edit relationship</button></div>`);
  }
  function deleteNode(nodeId) {
    const n = model.nodes.find(n => n.id === nodeId), removed = M.descendants(model, nodeId, true), edges = model.edges.filter(e => removed.has(e.source) || removed.has(e.target)).length;
    dialog('Delete this component?', `<form><p class="dialog-copy">This removes <strong>${esc(n.name)}</strong>${removed.size > 1 ? ` and its ${removed.size - 1} nested components` : ''}, together with ${edges} connected relationship${edges === 1 ? '' : 's'}. You can undo the change.</p><div class="dialog-actions"><button type="button" class="button" data-action="close-dialog">Keep component</button><button type="submit" class="button danger">Delete ${removed.size} component${removed.size === 1 ? '' : 's'}</button></div></form>`, () => { commit(M.removeNode(model, nodeId), 'Component removed', true); closeDialog(); });
  }
  function languageDialog() {
    const row = (t, relation) => `<div class="language-type-row"><i class="type-dot" style="--type-color:${t.color}"></i><div><strong>${esc(t.name)}</strong><small>${relation ? `${t.style} · ${t.sourceTypes.length || 'Any'} source types · ${t.targetTypes.length || 'Any'} target types` : `${t.shape} · ${t.fields.length ? esc(t.fields.join(', ')) : 'No custom fields'}`}</small></div><button type="button" class="button tiny" data-action="${relation ? 'edit-rel-type' : 'edit-type'}" data-id="${esc(t.id)}">Edit</button></div>`;
    dialog('Your modelling language', `<p class="dialog-copy">Define the building blocks and connections your organisation needs. Every component type can contain other components. Relationship rules are optional and apply to the actual endpoints.</p><div class="dialog-subheading"><h3>Component types</h3><button type="button" class="button tiny" data-action="new-type">＋ Type</button></div><div class="language-list">${model.types.map(t => row(t, false)).join('')}</div><div class="dialog-subheading"><h3>Relationship types</h3><button type="button" class="button tiny" data-action="new-rel-type">＋ Relationship type</button></div><div class="language-list">${model.relationshipTypes.map(t => row(t, true)).join('')}</div><div class="dialog-actions"><button type="button" class="button primary" data-action="close-dialog">Done</button></div>`);
  }
  function typeForm(typeId = null, relation = false) {
    const list = relation ? model.relationshipTypes : model.types, existing = list.find(t => t.id === typeId), t = existing || { id: M.id('t'), name: '', color: '#059669', shape: 'rounded', fields: [], style: 'solid', sourceTypes: [], targetTypes: [] };
    const used = relation ? model.edges.some(e => e.typeId === typeId) : model.nodes.some(n => n.typeId === typeId) || model.relationshipTypes.some(r => [...r.sourceTypes, ...r.targetTypes].includes(typeId));
    const multi = (key, label) => `<label class="form-field">${label}<select name="${key}" class="multi-select" multiple size="4">${model.types.map(v => `<option value="${esc(v.id)}"${t[key].includes(v.id) ? ' selected' : ''}>${esc(v.name)}</option>`).join('')}</select><small>None selected means any type. Hold Ctrl / ⌘ to select several, or use your device’s selection menu.</small></label>`;
    dialog(`${existing ? 'Edit' : 'Add'} ${relation ? 'relationship' : 'component'} type`, `<form><label class="form-field">Type name<input name="name" required maxlength="80" value="${esc(t.name)}" placeholder="${relation ? 'e.g. publishes to' : 'e.g. Business capability'}"></label><div class="form-row"><label class="form-field">Colour<input name="color" type="color" value="${t.color}"></label>${relation ? `<label class="form-field">Line style<select name="style"><option value="solid"${t.style === 'solid' ? ' selected' : ''}>Solid</option><option value="dashed"${t.style === 'dashed' ? ' selected' : ''}>Dashed</option></select></label>` : `<label class="form-field">Shape<select name="shape">${options([{ id: 'rounded', name: 'Rounded block' }, { id: 'square', name: 'Square block' }, { id: 'database', name: 'Data store' }], t.shape)}</select></label>`}</div>${relation ? multi('sourceTypes', 'Allowed source types') + multi('targetTypes', 'Allowed target types') : `<label class="form-field">Custom property names<textarea name="fields" rows="2" placeholder="Owner, Lifecycle, Criticality">${esc(t.fields.join(', '))}</textarea><small>Separate names with commas. Up to 16 fields. Existing property values are retained when you change the field list.</small></label>`}<div class="dialog-actions">${existing && !used && list.length > 1 ? `<button type="button" class="button danger" data-action="${relation ? 'delete-rel-type' : 'delete-type'}" data-id="${esc(t.id)}">Delete type</button>` : ''}<button type="button" class="button" data-action="language">Back</button><button type="submit" class="button primary">Save type</button></div></form>`, data => {
      const next = M.copy(model), listName = relation ? 'relationshipTypes' : 'types';
      const updated = relation ? { id: t.id, name: data.get('name').trim(), color: data.get('color'), style: data.get('style'), sourceTypes: data.getAll('sourceTypes'), targetTypes: data.getAll('targetTypes') } : { id: t.id, name: data.get('name').trim(), color: data.get('color'), shape: data.get('shape'), fields: data.get('fields').split(',').map(s => s.trim()).filter(Boolean) };
      if (t.semantic) updated.semantic = t.semantic;
      if (t.iconId) updated.iconId = t.iconId;
      if (existing) next[listName][next[listName].findIndex(x => x.id === typeId)] = updated; else next[listName].push(updated);
      commit(next, 'Modelling language updated'); languageDialog();
    });
  }
  function renameDialog(newModel = false) {
    dialog(newModel ? 'Start a new architecture model' : 'Model question and scope', `<form><p class="dialog-copy">${newModel ? 'Create a blank model. Back up the current JSON if you need a separate copy. This change can be undone.' : 'Record the question this model should answer and its intended audience.'}</p><label class="form-field">Model name<input name="name" required maxlength="160" value="${newModel ? 'Untitled architecture' : esc(model.name)}"></label><label class="form-field">Question, audience and boundaries<textarea name="description" maxlength="4000" rows="4" placeholder="What decision should this model support? Which service is in scope?">${newModel ? '' : esc(model.description || '')}</textarea></label><div class="dialog-actions"><button type="button" class="button" data-action="close-dialog">Cancel</button><button type="submit" class="button primary">${newModel ? 'Create model' : 'Save model details'}</button></div></form>`, data => { const next = newModel ? M.empty(data.get('name').trim()) : { ...M.copy(model), name: data.get('name').trim() }; next.description = data.get('description').trim(); if (newModel) { focus = null; selected = null; expanded = new Set(); } commit(next, newModel ? 'New model created' : 'Model details saved', newModel, newModel); closeDialog(); });
  }
  function replaceDialog(next, message) {
    dialog('Load this model?', `<form><p class="dialog-copy"><strong>${esc(next.name)}</strong> contains ${next.nodes.length} components and ${next.edges.length} relationships. It will replace the active browser model. Export a copy of your current model first if you need it. This change can also be undone.</p><div class="dialog-actions"><button type="button" class="button" data-action="export-json">Back up current JSON</button><button type="button" class="button" data-action="close-dialog">Cancel</button><button type="submit" class="button primary">Load model</button></div></form>`, () => { focus = null; selected = null; expanded = new Set(); treeOpen = new Set(); commit(next, message, true, true); closeDialog(); });
  }
  function locate(nodeId) { const n = model.nodes.find(n => n.id === nodeId); if (!n) return; perspective = D.kind(n) === 'component' ? 'solution' : D.kind(n) === 'process' ? 'process' : 'stakeholder'; processId = null; selectedLayerIds = null; focus = n.parentId; expanded = new Set(); selected = nodeId; selectedGroup = null; trace = null; camera = null; viewPositions = null; activeNamedView = null; let p = n.parentId; while (p) { treeOpen.add(p); p = model.nodes.find(n => n.id === p)?.parentId; } render(); }
  function expandNode(nodeId) { if (expanded.has(nodeId)) expanded.delete(nodeId); else expanded.add(nodeId); camera = null; viewPositions = null; activeNamedView = null; renderGraph(); renderSavedViews(); }
  function download(content, filename, type) { if (HOST) return HOST.download(content,filename,type); const blob = new Blob([content], { type }), url = URL.createObjectURL(blob), link = document.createElement('a'); link.href = url; link.download = filename; document.body.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000); }
  function filename(suffix) { return (model.name.toLocaleLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80) || 'architecture') + suffix; }
  function exportJSON() { download(globalThis.ModellerPlatform.canonical(model), filename('.archmodel.json'), 'application/json'); }
  function exportCSV() {
    const cell = value => { const s = String(value ?? ''); return '"' + (/^[=+@\-\t\r\n]/.test(s) ? "'" : '') + s.replace(/"/g, '""') + '"'; };
    const rows = [['Source ID', 'Source path', 'Source category', 'Relationship', 'RACI role', 'Label', 'Target ID', 'Target path', 'Target category', 'Notes'], ...model.edges.map(e => [e.source, M.path(model, e.source), D.kind(model.nodes.find(n => n.id === e.source)), relationOf(e).name, D.roleLabel(e), e.label, e.target, M.path(model, e.target), D.kind(model.nodes.find(n => n.id === e.target)), e.description])];
    download('\uFEFF' + rows.map(row => row.map(cell).join(',')).join('\r\n'), filename('-relationships.csv'), 'text/csv;charset=utf-8');
  }
  function exportSVG() {
    const svg = el('graph').cloneNode(true), box = bounds(), computed = getComputedStyle(document.documentElement), vars = ['graph-surface', 'graph-text', 'graph-muted', 'graph-line', 'graph-highlight', 'accent', 'accent-hover'];
    let css = '.node-title{font-size:15px;font-weight:650;fill:var(--graph-text)}.node-type{font-size:10px;font-weight:650}.node-meta{font-size:10px;fill:var(--graph-muted)}.edge-line{fill:none;stroke-width:1.7}.edge-label{font-size:10px;font-weight:550;fill:var(--graph-muted);text-anchor:middle}.edge-pill{fill:var(--graph-surface);stroke:var(--graph-line);stroke-width:.7}.edge-hit{fill:none;stroke:transparent}.node.selected>.node-body{stroke:var(--accent);stroke-width:2.5}.scope-node>.node-body,.external-node>.node-body{stroke-dasharray:5 5}.trace>.node-body{stroke:#d97706;stroke-width:3}.dim{opacity:.3}';
    for (const v of vars) { const value = computed.getPropertyValue('--' + v).trim(); css = css.replaceAll(`var(--${v})`, value); for (const n of svg.querySelectorAll('*')) for (const attr of [...n.attributes]) if (attr.value.includes(`var(--${v})`)) n.setAttribute(attr.name, attr.value.replaceAll(`var(--${v})`, value)); }
    const style = document.createElementNS('http://www.w3.org/2000/svg', 'style'); style.textContent = `text{font-family:system-ui,-apple-system,Segoe UI,sans-serif}${css}`; svg.prepend(style);
    for (const n of svg.querySelectorAll('[tabindex]')) { n.removeAttribute('tabindex'); n.removeAttribute('role'); }
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg'); svg.setAttribute('width', String(box.w)); svg.setAttribute('height', String(box.h)); svg.setAttribute('viewBox', `${box.x} ${box.y} ${box.w} ${box.h}`); svg.setAttribute('role', 'img');
    const metadata=document.createElementNS('http://www.w3.org/2000/svg','metadata');metadata.textContent=globalThis.ModellerOffice.attribution(model,diagram.nodes).join('\n');svg.prepend(metadata);
    download('<?xml version="1.0" encoding="UTF-8"?>\n' + new XMLSerializer().serializeToString(svg), filename('-view.svg'), 'image/svg+xml');
  }
  function refreshNetwork() {
    const entries = performance.getEntriesByType('resource'), domains = new Map();
    for (const item of entries) { try { const url = new URL(item.name, location.href); if (['http:', 'https:'].includes(url.protocol)) domains.set(url.hostname, (domains.get(url.hostname) || 0) + 1); } catch (_) { /* Non-URL resource. */ } }
    el('network-summary').textContent = `${entries.length} resource timing entr${entries.length === 1 ? 'y' : 'ies'} visible to this page. ${domains.size} HTTP(S) domain${domains.size === 1 ? '' : 's'}.`;
    el('network-domains').innerHTML = [...domains].map(([domain, count]) => `<li>${esc(domain)} · ${count} request${count === 1 ? '' : 's'}</li>`).join('') || '<li>No HTTP(S) resources are reported.</li>';
  }
  function updateHeaderHeight() { const header = $('mightora-header'), nav = $('.quick-jump-nav'); document.documentElement.style.setProperty('--measured-header', `${header.getBoundingClientRect().height}px`); document.documentElement.style.setProperty('--quick-h', `${nav.getBoundingClientRect().height}px`); }
  function nodeMarkupWithIcon(n, cls, radius, label, titleLines, hidden, kids, t, icon) {
    return `<g class="${cls}" transform="translate(${n.x} ${n.y})" data-node="${esc(n.id)}" tabindex="0" role="button" aria-label="${esc(label)}"><title>${esc(label)} · ${esc(icon.name)}</title>${n.expanded ? `<rect width="${n.w}" height="55" fill="transparent"/>` : `<rect class="node-body" width="${n.w}" height="${n.h}" rx="${radius}" fill="var(--graph-surface)" stroke="var(--graph-line)"/><rect x="0" y="15" width="4" height="${n.h - 30}" rx="2" fill="${t.color}"/>`}<image href="${icon.svg}" x="15" y="${n.expanded ? 12 : 16}" width="26" height="26" preserveAspectRatio="xMidYMid meet"/>${n.expanded ? `<text x="49" y="31" class="node-title" style="font-size:13px">${esc(titleLines[0])}</text>` : `<text x="49" y="33" class="node-type" fill="${t.color}">${esc(t.name.toUpperCase().slice(0, 27))}</text><text x="18" y="62" class="node-title">${titleLines.map((line, i) => `<tspan x="18" dy="${i ? 19 : 0}">${esc(line)}</tspan>`).join('')}</text><text x="18" y="107" class="node-meta">${n.external ? 'EXTERNAL CONTEXT ↗' : `${kids ? `${kids} components inside` : esc(icon.name)}${hidden ? ` · ${hidden} internal links` : ''}`}</text>`}${kids && !n.isScope && !n.external ? `<g data-action="expand-node" data-id="${esc(n.originalId || n.id)}" role="button" tabindex="0" aria-label="${n.expanded ? 'Collapse' : 'Expand'} ${esc(n.name)} here"><rect x="${n.w - 33}" y="${n.expanded ? 12 : 88}" width="24" height="24" rx="5" fill="var(--graph-highlight)" stroke="var(--graph-line)"/><text x="${n.w - 21}" y="${n.expanded ? 29 : 105}" text-anchor="middle" fill="var(--accent-hover)" font-size="16">${n.expanded ? '−' : '+'}</text></g>` : ''}</g>`;
  }
  function snapshot(name = null) {
    return { id: M.id('view'), name: name || (focus ? model.nodes.find(n => n.id === focus).name : perspectiveNames[perspective]), description: '', ...viewSpec(), positions: Object.fromEntries(diagram.nodes.filter(n => !n.external).map(n => [n.id, { x: n.x, y: n.y, w:n.w, h:n.h }])), ...(camera ? { camera: { ...camera } } : {}) };
  }
  function renderSavedViews() { el('saved-view').innerHTML = '<option value="">Saved views…</option>' + options(model.namedViews || [], activeNamedView); el('save-view').textContent = activeNamedView ? 'Save / update view' : 'Save view'; }
  function saveView() {
    const existing = (model.namedViews || []).find(v => v.id === activeNamedView), current = snapshot(existing?.name);
    dialog('Save the current view', `<form><label class="form-field">View name<input name="name" required maxlength="160" value="${esc(current.name)}"></label><label class="form-field">Description<textarea name="description" maxlength="2000" rows="3">${esc(existing?.description || '')}</textarea></label>${existing ? '<label class="check-field"><input type="checkbox" name="update" checked> Update this saved view (untick to save a new copy)</label>' : ''}<p class="dialog-copy">Stores the current focus, expanded blocks, relationship filters, external context, positions and zoom. JSON and YAML carry saved views with your model.</p><div class="dialog-actions"><button type="button" class="button" data-action="close-dialog">Cancel</button><button type="submit" class="button primary">Save view</button></div></form>`, data => {
      const next = M.copy(model); next.namedViews ||= []; const saved = { ...current, name: data.get('name').trim(), description: data.get('description') };
      if (existing && data.has('update')) { saved.id = existing.id; next.namedViews[next.namedViews.findIndex(v => v.id === saved.id)] = saved; } else next.namedViews.push(saved);
      activeNamedView = saved.id; commit(next, 'View saved'); closeDialog();
    });
  }
  function loadView(id) {
    const v = (model.namedViews || []).find(v => v.id === id); if (!v) return;
    viewExtras = Object.fromEntries(['includedIds','typeIds','hiddenIds','routing','routes','swimlanes'].filter(k=>v[k]!==undefined).map(k=>[k,M.copy(v[k])]));
    perspective = v.perspective || 'solution'; processId = v.processId || null; selectedLayerIds = v.layerIds == null ? null : [...v.layerIds];
    focus = v.focus; expanded = new Set(v.expanded); relationshipTypeIds = v.relationshipTypeIds == null ? null : [...v.relationshipTypeIds]; showExternal = v.showExternal; viewPositions = M.copy(v.positions); camera = v.camera ? { ...v.camera } : null; homeCamera = camera ? { ...camera } : null; selected = null; selectedGroup = null; trace = null; activeNamedView = id;
    if (el('dialog').open) closeDialog(); render();
  }
  function manageViews() {
    dialog('Saved views and export order', `<p class="dialog-copy">Reorder views here to set their order in Word and PowerPoint. Saved views refer to the current model, so component changes appear in every view.</p><div class="language-list">${(model.namedViews || []).map((v, i, all) => `<div class="language-type-row"><div><strong>${esc(v.name)}</strong><small>${esc(v.focus ? M.path(model, v.focus) : 'Overview')} · ${v.expanded.length} expanded</small></div><button type="button" class="button tiny" data-action="load-view" data-id="${v.id}">Open</button><button type="button" class="button tiny" data-action="edit-view" data-id="${v.id}">Edit</button><button type="button" class="button tiny" data-action="move-view-up" data-id="${v.id}" aria-label="Move ${esc(v.name)} up"${i ? '' : ' disabled'}>↑</button><button type="button" class="button tiny" data-action="move-view-down" data-id="${v.id}" aria-label="Move ${esc(v.name)} down"${i < all.length - 1 ? '' : ' disabled'}>↓</button><button type="button" class="button tiny" data-action="delete-view" data-id="${v.id}" aria-label="Delete saved view ${esc(v.name)}">✕</button></div>`).join('') || '<p class="small-note">No saved views yet. Choose a focus and use Save view.</p>'}</div><div class="dialog-actions"><button type="button" class="button primary" data-action="close-dialog">Done</button></div>`);
  }
  function editView(id) {
    const v = model.namedViews.find(v => v.id === id);
    dialog('Edit view details', `<form><label class="form-field">Name<input name="name" required maxlength="160" value="${esc(v.name)}"></label><label class="form-field">Description<textarea name="description" maxlength="2000">${esc(v.description)}</textarea></label><p class="small-note">To change its focus, filters or layout, open the view and use Save / update view.</p><div class="dialog-actions"><button type="button" class="button" data-action="close-dialog">Cancel</button><button type="submit" class="button primary">Save</button></div></form>`, data => { const next = M.copy(model), n = next.namedViews.find(v => v.id === id); n.name = data.get('name').trim(); n.description = data.get('description'); commit(next, 'View details updated'); manageViews(); });
  }
  function deleteView(id) { const next = M.copy(model); next.namedViews = next.namedViews.filter(v => v.id !== id); if (activeNamedView === id) activeNamedView = null; commit(next, 'Saved view deleted. Undo is available.'); manageViews(); }
  function moveView(id, offset) { const next = M.copy(model), i = next.namedViews.findIndex(v => v.id === id), j = i + offset; if (j < 0 || j >= next.namedViews.length) return; [next.namedViews[i], next.namedViews[j]] = [next.namedViews[j], next.namedViews[i]]; commit(next, 'View order updated'); manageViews(); }
  function updateExplorerButton() { const open = window.matchMedia('(max-width:1040px)').matches ? el('editor-grid').classList.contains('show-explorer') : !el('editor-grid').classList.contains('no-explorer'); el('toggle-explorer').setAttribute('aria-expanded', String(open)); }
  function filterView() {
    dialog('View filters', `<form><p class="dialog-copy">Filter the relationships displayed in this view. All components and exact relationships remain in the model.</p>${model.relationshipTypes.map(t => `<label class="check-field"><input type="checkbox" name="type" value="${t.id}"${relationshipTypeIds === null || relationshipTypeIds.includes(t.id) ? ' checked' : ''}><span class="type-dot" style="--type-color:${t.color}"></span> ${esc(t.name)}</label>`).join('')}<label class="check-field"><input type="checkbox" name="external"${showExternal ? ' checked' : ''}> Show external context blocks</label><div class="dialog-actions"><button type="button" class="button" data-action="close-dialog">Cancel</button><button type="submit" class="button primary">Apply filters</button></div></form>`, data => { const values = data.getAll('type'); relationshipTypeIds = values.length === model.relationshipTypes.length ? null : values; showExternal = data.has('external'); viewPositions = null; camera = null; activeNamedView = null; selectedGroup = null; trace = null; render(); closeDialog(); });
  }
  function dimensionFilters() {
    dialog('Dimension filters', `<form><label class="form-field">Process scope<select name="process"><option value="">All processes</option>${options(model.nodes.filter(n => D.kind(n) === 'process').map(n => ({ id: n.id, name: M.path(model, n.id) })), processId)}</select><small>Includes the selected process and its nested steps in business views.</small></label><label class="form-field">Application layer<select name="layer"><option value="*">All layers</option><option value=""${selectedLayerIds?.length === 0 ? ' selected' : ''}>Unassigned</option>${options(model.layers || [], selectedLayerIds?.[0])}</select><small>Filters components; process and stakeholder records remain visible.</small></label><div class="dialog-actions"><button type="button" class="button" data-action="close-dialog">Cancel</button><button type="submit" class="button primary">Apply</button></div></form>`, data => { processId = data.get('process') || null; const layer = data.get('layer'); selectedLayerIds = layer === '*' ? null : layer ? [layer] : []; focus = null; expanded = new Set(); camera = null; viewPositions = null; activeNamedView = null; closeDialog(); render(); });
  }
  function layerManager() {
    dialog('Define application layers', `<p class="dialog-copy">Layers describe architectural responsibility, not containment. A component can belong to several layers; its primary layer controls placement. Edit membership on each component.</p><div class="language-list">${(model.layers || []).map((l, i, all) => `<div class="language-type-row"><i class="type-dot" style="--type-color:${l.color}"></i><div><strong>${esc(l.name)}</strong><small>${esc(l.description)}</small></div><button type="button" class="button tiny" data-action="edit-layer" data-id="${l.id}">Edit</button><button type="button" class="button tiny" data-action="layer-up" data-id="${l.id}"${i ? '' : ' disabled'} aria-label="Move layer up">↑</button><button type="button" class="button tiny" data-action="layer-down" data-id="${l.id}"${i < all.length - 1 ? '' : ' disabled'} aria-label="Move layer down">↓</button></div>`).join('') || '<p>No layers defined yet.</p>'}</div><div class="dialog-actions"><button type="button" class="button primary" data-action="new-layer">Add layer</button><button type="button" class="button" data-action="close-dialog">Done</button></div>`);
  }
  function layerForm(id) {
    const l = (model.layers || []).find(l => l.id === id) || { id: M.id('layer'), name: '', description: '', color: '#059669' };
    dialog(id ? 'Edit application layer' : 'Add application layer', `<form><label class="form-field">Name<input name="name" required maxlength="100" value="${esc(l.name)}" placeholder="e.g. Presentation"></label><label class="form-field">Definition<textarea name="description" maxlength="2000" rows="3">${esc(l.description)}</textarea></label><label class="form-field">Colour<input name="color" type="color" value="${l.color}"></label><div class="dialog-actions">${id ? `<button type="button" class="button danger" data-action="delete-layer" data-id="${id}">Delete…</button>` : ''}<button type="button" class="button" data-action="layers">Cancel</button><button type="submit" class="button primary">Save layer</button></div></form>`, data => { const next = M.copy(model); next.layers ||= []; const updated = { id: l.id, name: data.get('name').trim(), description: data.get('description'), color: data.get('color') }; if (id) next.layers[next.layers.findIndex(l => l.id === id)] = updated; else next.layers.push(updated); commit(next, 'Application layer saved', true); layerManager(); });
  }
  function deleteLayer(id) { const l = model.layers.find(l => l.id === id); dialog('Delete layer?', `<form><p>This removes the layer “${esc(l.name)}” and its membership assignments, not the components. Undo is available.</p><div class="dialog-actions"><button type="button" class="button" data-action="layers">Cancel</button><button type="submit" class="button danger">Delete layer</button></div></form>`, () => { commit(D.removeLayer(model, id), 'Layer removed; components retained', true); layerManager(); }); }
  function moveLayer(id, offset) { const next = M.copy(model), i = next.layers.findIndex(l => l.id === id), j = i + offset; if (j < 0 || j >= next.layers.length) return; [next.layers[i], next.layers[j]] = [next.layers[j], next.layers[i]]; commit(next, 'Layer order updated', true); layerManager(); }
  function mappingManager() {
    const processes = model.nodes.filter(n => D.kind(n) === 'process');
    dialog('Business mappings and responsibilities', `<p class="dialog-copy">Map technical support and stakeholder responsibilities to a whole process or an individual step. These are exact links, independent of where components are nested. R = Responsible, A = Accountable, C = Consulted, I = Informed. Roles are recorded, not enforced as a governance policy.</p><div class="dialog-actions"><button type="button" class="button" data-action="add-process">Add process</button><button type="button" class="button" data-action="add-stakeholder">Add stakeholder</button><button type="button" class="button primary" data-action="new-mapping">Add mapping / sequence</button></div>${processes.map(p => { const rows = D.mappings(model, p.id); return `<section class="detail-section"><h3>${esc(M.path(model, p.id))}</h3>${rows.map(r => `<button type="button" class="dependency-row" data-action="edit-edge" data-id="${r.edge.id}"><strong>${esc(r.source.name)}</strong><small>${esc(r.semantic === 'supports' ? 'Supporting component' : D.roleLabel(r.edge) || 'Participant')}${r.edge.label ? ' · ' + esc(r.edge.label) : ''}</small></button>`).join('') || '<p class="small-note">No component or stakeholder mappings yet.</p>'}</section>`; }).join('') || '<p>Add a business process, then add nested steps using Child.</p>'}<div class="dialog-actions"><button type="button" class="button" data-action="close-dialog">Done</button></div>`);
  }
  function mappingForm() {
    const draft = M.copy(model), language = D.ensureLanguage(M, draft);
    if (!draft.nodes.some(n => D.kind(n) === 'process')) throw new Error('Add a process first.');
    dialog('Map business context', `<form><label class="form-field">Mapping<select name="meaning"><option value="supports">Component supports process</option><option value="participation">Stakeholder participates in process</option><option value="sequence">Process followed by process</option></select></label><label class="form-field">Source<select name="source" id="mapping-source"></select></label><label class="form-field">Target process or step<select name="target">${options(draft.nodes.filter(n => D.kind(n) === 'process').map(n => ({ id: n.id, name: M.path(draft, n.id) })))}</select></label><label class="form-field">Responsibility<select name="role"><option value="">Not specified</option>${D.roles.map(r => `<option value="${r}">${esc(D.roleLabel({role:r}))}</option>`).join('')}</select></label><label class="form-field">Label<input name="label" maxlength="160"></label><div class="dialog-actions"><button type="button" class="button" data-action="mappings">Cancel</button><button type="submit" class="button primary">Create mapping</button></div></form>`, data => { const next = M.copy(draft), meaning = data.get('meaning'); next.edges.push({ id: M.id('e'), source: data.get('source'), target: data.get('target'), typeId: language[meaning], role: meaning === 'participation' ? data.get('role') : '', label: data.get('label').trim(), description: '' }); commit(next, 'Business mapping created', true); mappingManager(); });
    const meaning = el('dialog-content').querySelector('[name=meaning]'), role = el('dialog-content').querySelector('[name=role]');
    const update = () => { const k = { supports: 'component', participation: 'stakeholder', sequence: 'process' }[meaning.value]; el('mapping-source').innerHTML = options(draft.nodes.filter(n => D.kind(n) === k).map(n => ({ id:n.id, name:M.path(draft,n.id) }))); role.disabled = meaning.value !== 'participation'; }; meaning.onchange = update; update();
  }
  function exportPack() {
    const current = snapshot('Current view'), available = [current, ...(model.namedViews || [])];
    dialog('Export an Office view pack', `<form id="office-form"><p class="dialog-copy">Select views in the order shown. Use Manage views to reorder saved views. Export includes each saved view’s full diagram; zoom is restored when opening a view.</p><div class="office-choices">${available.map((v, i) => `<label class="check-field"><input type="checkbox" name="view" value="${v.id}"${i === 0 && available.length > 1 ? '' : ' checked'}><span><strong>${esc(v.name)}</strong><small>${esc(v.description || (v.focus ? M.path(model, v.focus) : 'Architecture overview'))}</small></span></label>`).join('')}</div><div class="form-row"><label class="form-field">Format<select name="format"><option value="pptx">PowerPoint — editable diagram shapes</option><option value="docx">Word — diagrams and editable report</option></select></label><label class="form-field">Word page orientation<select name="orientation"><option value="portrait">Portrait</option><option value="landscape">Landscape</option></select></label></div><label class="check-field"><input type="checkbox" name="tables" checked> Include component and relationship tables in Word</label><p class="small-note">PowerPoint blocks, text and attached connectors are editable; logos remain images. Word diagrams are embedded SVGs with PNG fallbacks. Large expanded views may have small labels; save focused views for readability.</p><p id="office-progress" role="status" aria-live="polite"></p><div class="dialog-actions"><button type="button" class="button" data-action="close-dialog">Cancel</button><button type="submit" class="button primary" id="office-submit">Generate export</button></div></form>`, data => {
      const ids = new Set(data.getAll('view')), chosen = available.filter(v => ids.has(v.id)); if (!chosen.length) throw new Error('Select at least one view.');
      const format = data.get('format'), button = el('office-submit'), progress = el('office-progress'); button.disabled = true; progress.textContent = `Generating ${chosen.length} views locally…`;
      const generator = format === 'pptx' ? globalThis.ModellerOffice.pptx(model, chosen) : globalThis.ModellerOffice.docx(model, chosen, { landscape: data.get('orientation') === 'landscape', tables: data.has('tables') });
      generator.then(bytes => { download(bytes, filename('-views.' + format), format === 'pptx' ? 'application/vnd.openxmlformats-officedocument.presentationml.presentation' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'); progress.textContent = 'Export ready. Your browser has started the download.'; }).catch(e => { progress.textContent = 'Export failed: ' + e.message; }).finally(() => { button.disabled = false; });
    });
  }
  function renderGuidance() {
    const panel = el('model-guide'); if (!panel) return;
    panel.hidden = !guideVisible; el('first-model-guide').setAttribute('aria-expanded',String(guideVisible)); if (!guideVisible) return;
    const step = G.steps[guideStep], done = G.progress(model);
    panel.innerHTML = `<div class="guide-top"><div><p class="eyebrow">BUILD YOUR FIRST MODEL · ${guideStep+1} OF ${G.steps.length}</p><h2 id="guide-step-title" tabindex="-1">${esc(step.title)}</h2></div><button type="button" class="button tiny" data-action="guide-toggle" aria-label="Close first model guide">Close guide</button></div><nav class="guide-step-nav" aria-label="First model steps">${G.steps.map((s,i)=>`<button type="button" data-action="guide-step" data-id="${i}" aria-current="${i===guideStep ? 'step' : 'false'}" title="${esc(s.title)}">${done[i] ? '✓' : i+1}<span class="sr-only"> ${esc(s.title)}</span></button>`).join('')}</nav><p class="guide-goal">${esc(step.goal)}</p><p>${esc(step.instruction)}</p><p class="guide-tip">${esc(step.tip)}</p><p class="small-note" role="status">${done[guideStep] ? (guideStep===7 ? 'This model has saved views and is ready for review and export.' : 'The model contains the elements for this step. Check that they express your intended design.') : 'Try the action below, then return to the guide. You can move between steps at any time.'}</p><div class="guide-actions">${step.actions.map(([id,label])=>`<button type="button" class="button" data-action="guide-action" data-id="${id}">${esc(label)}</button>`).join('')}</div><div class="guide-bottom"><div class="tool-group"><button type="button" class="button tiny" data-action="guide-new">Start a blank model</button><button type="button" class="button tiny" data-action="first-example">Load worked example…</button></div><div class="tool-group"><button type="button" class="button" data-action="guide-step" data-id="${guideStep-1}"${guideStep ? '' : ' disabled'}>← Previous</button><button type="button" class="button primary" data-action="${guideStep===7 ? 'guide-toggle' : 'guide-step'}" data-id="${guideStep+1}">${guideStep===7 ? 'Finish guide' : 'Next →'}</button></div></div>`;
  }
  function guideAction(id) {
    const action = {purpose:()=>renameDialog(),root:()=>nodeForm(null,null,'component'),inside:()=>{if(!selected) return toast('Select a component in the diagram or explorer first.');setFocus(selected);},child:()=>{const parent=focus||selected;if(!parent)return toast('Select or open a parent component first.');nodeForm(null,parent,'component');},relationship:()=>edgeForm(),layers:layerManager,'edit-selected':()=>{if(!selected)return toast('Select a component first, then use this action to assign its layer.');nodeForm(selected);},'show-layers':()=>changePerspective('layers'),process:()=>nodeForm(null,null,'process'),stakeholder:()=>nodeForm(null,null,'stakeholder'),mappings:mappingManager,'save-view':saveView,'show-traceability':()=>changePerspective('traceability'),scope:dimensionFilters,review:reviewModel,'export-json':exportJSON,office:exportPack}[id];
    action?.();
  }
  function glossaryDialog() {
    dialog('Modelling help and glossary', `<label class="form-field">Find a concept<input type="search" id="glossary-search" placeholder="e.g. layers, external, RACI"></label><div id="glossary-results"></div><div class="dialog-actions"><button type="button" class="button" data-action="guide-open">Open first-model guide</button><button type="button" class="button" data-action="close-dialog">Done</button></div>`);
    const draw = () => { const term=el('glossary-search').value.toLowerCase();el('glossary-results').innerHTML = G.glossary.filter(([name,definition])=>(name+' '+definition).toLowerCase().includes(term)).map(([name,definition])=>`<section class="detail-section"><h3>${esc(name)}</h3><p>${esc(definition)}</p></section>`).join('') || '<p class="small-note">No matching concept. Try a shorter word.</p>'; };el('glossary-search').oninput=draw;draw();
  }
  function reviewModel() {
    const result = G.review(model), codes=[...new Set(result.issues.map(i=>i.code))];
    dialog('Review the architecture model', `<p class="dialog-copy">${esc(result.summary)}</p><p class="small-note">${result.counts.entities} entities · ${result.counts.relationships} relationships · ${result.counts.views} saved views · ${result.issues.length} prompts</p><label class="form-field">Review topic<select id="review-filter"><option value="">All prompts</option>${codes.map(code=>`<option value="${code}">${esc(result.issues.find(i=>i.code===code).title)}</option>`).join('')}</select></label><div id="review-results"></div><div class="dialog-actions"><button type="button" class="button" data-action="close-dialog">Done</button></div>`);
    const draw = () => { const filter=el('review-filter').value, matches=result.issues.filter(i=>!filter||i.code===filter); el('review-results').innerHTML=matches.slice(0,100).map(i=>`<section class="review-item"><div><strong>${esc(i.title)}</strong><p>${esc(i.detail)}</p></div><div class="tool-group">${i.nodeId ? `<button type="button" class="button tiny" data-action="locate-close" data-id="${i.nodeId}">Locate</button><button type="button" class="button tiny" data-action="edit-node" data-id="${i.nodeId}">Edit</button>` : '<button type="button" class="button tiny" data-action="guide-action" data-id="purpose">Add model question</button>'}</div></section>`).join('')+(matches.length>100?'<p class="small-note">Showing the first 100 prompts. Filter by topic or resolve some and review again.</p>':'')||'<p class="small-note">No prompts for this topic. Check the design against your audience and intended decision.</p>'; };el('review-filter').onchange=draw;draw();
  }
  const actions = {
    'guide-toggle':()=>{guideVisible=!guideVisible;renderGuidance();},'guide-open':()=>{closeDialog();guideVisible=true;renderGuidance();el('model-guide').scrollIntoView({block:'start'});},
    'guide-step':id=>{guideVisible=true;guideStep=Math.max(0,Math.min(7,Number(id)||0));renderGuidance();el('guide-step-title').focus();},'guide-action':guideAction,
    'guide-new':()=>{guideVisible=true;guideStep=0;renameDialog(true);},'first-example':()=>replaceDialog(G.example(M,D),'First-model worked example loaded'),
    'review-model':reviewModel,'glossary':glossaryDialog,
    'add-process': () => nodeForm(null, null, 'process'), 'add-stakeholder': () => nodeForm(null, null, 'stakeholder'),
    'layers': layerManager, 'new-layer': () => layerForm(), 'edit-layer': layerForm, 'delete-layer': deleteLayer, 'layer-up': id => moveLayer(id, -1), 'layer-down': id => moveLayer(id, 1),
    'mappings': mappingManager, 'new-mapping': mappingForm, 'dimension-filters': dimensionFilters,
    'focus': id => setFocus(id || null), 'select': select, 'locate': locate,
    'locate-close': id => { closeDialog(); locate(id); },
    'tree-toggle': id => { treeOpen.has(id) ? treeOpen.delete(id) : treeOpen.add(id); renderTree(); },
    'expand-node': expandNode, 'edit-node': id => nodeForm(id), 'add-child': id => nodeForm(null, id), 'link-from': id => edgeForm(null, id),
    'delete-node': deleteNode, 'edit-edge': id => edgeForm(id), 'edge-detail': edgeDetail,
    'delete-edge': id => { const next = M.copy(model); next.edges = next.edges.filter(e => e.id !== id); commit(next, 'Relationship deleted', true); closeDialog(); },
    'language': languageDialog, 'new-type': () => typeForm(), 'new-rel-type': () => typeForm(null, true), 'edit-type': id => typeForm(id), 'edit-rel-type': id => typeForm(id, true),
    'delete-type': id => { const next = M.copy(model); next.types = next.types.filter(t => t.id !== id); commit(next, 'Component type deleted'); languageDialog(); },
    'delete-rel-type': id => { const next = M.copy(model); next.relationshipTypes = next.relationshipTypes.filter(t => t.id !== id); for (const v of next.namedViews || []) if (v.relationshipTypeIds) v.relationshipTypeIds = v.relationshipTypeIds.filter(t => t !== id); commit(next, 'Relationship type deleted'); languageDialog(); },
    'trace-in': id => { trace = { origin: id, direction: 'incoming', nodes: M.impact(model, id, 'incoming') }; renderGraph(); renderInspector(); },
    'trace-out': id => { trace = { origin: id, direction: 'outgoing', nodes: M.impact(model, id, 'outgoing') }; renderGraph(); renderInspector(); },
    'clear-trace': () => { trace = null; renderGraph(); renderInspector(); }, 'close-dialog': closeDialog, 'export-json': exportJSON,
    'save-offline-copy': () => download('<!doctype html>\n' + document.documentElement.outerHTML, 'architecture-modeller-offline.html', 'text/html'),
    'load-view': loadView, 'edit-view': editView, 'delete-view': deleteView, 'move-view-up': id => moveView(id, -1), 'move-view-down': id => moveView(id, 1),
    'icon-terms': () => { closeDialog(); document.getElementById('icon-terms').scrollIntoView(); }
  };
  document.addEventListener('click', event => {
    const target = event.target.closest('[data-action]');
    if (target) { event.preventDefault(); event.stopPropagation(); try { actions[target.dataset.action]?.(target.dataset.id); } catch (e) { toast(e.message); } }
  });
  el('add-node').onclick = () => nodeForm(); el('empty-add').onclick = () => nodeForm(); el('add-edge').onclick = () => edgeForm();
  el('language-button').onclick = languageDialog; el('configure-language').onclick = languageDialog;
  el('rename-model').onclick = () => renameDialog(); el('new-model').onclick = () => renameDialog(true);
  el('close-dialog').onclick = closeDialog; el('dialog').addEventListener('click', event => { if (event.target === el('dialog')) { const r = el('dialog').getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) closeDialog(); } });
  el('undo').onclick = () => history('undo'); el('redo').onclick = () => history('redo');
  el('clear-selection').onclick = () => { selected = null; selectedGroup = null; trace = null; renderGraph(); renderInspector(); renderTree(); };
  el('up-level').onclick = () => { if (focus) setFocus(model.nodes.find(n => n.id === focus).parentId); };
  el('expand-all').onclick = () => { expanded = M.descendants(model, focus); camera = null; viewPositions = null; activeNamedView = null; renderGraph(); renderSavedViews(); };
  el('collapse-all').onclick = () => { expanded = new Set(); camera = null; viewPositions = null; activeNamedView = null; renderGraph(); renderSavedViews(); };
  el('auto-layout').onclick = () => { const next = M.copy(model); delete next.views[viewKey()]; commit(next, 'Components arranged', true); };
  el('zoom-in').onclick = () => zoom(.8); el('zoom-out').onclick = () => zoom(1.25); el('fit-view').onclick = fitView;
  el('search').oninput = renderTree;
  el('toggle-explorer').onclick = () => { const grid = el('editor-grid'); if (window.matchMedia('(max-width:1040px)').matches) grid.classList.toggle('show-explorer'); else grid.classList.toggle('no-explorer'); updateExplorerButton(); requestAnimationFrame(fitView); };
  function explorerTab(tree) { el('tree-tab').setAttribute('aria-selected', String(tree)); el('relations-tab').setAttribute('aria-selected', String(!tree)); el('tree-panel').hidden = !tree; el('relations-panel').hidden = tree; }
  el('tree-tab').onclick = () => explorerTab(true); el('relations-tab').onclick = () => explorerTab(false);
  [el('tree-tab'), el('relations-tab')].forEach(button => button.addEventListener('keydown', event => { if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) { event.preventDefault(); const tree = event.key === 'Home' || (event.key !== 'End' && button === el('relations-tab')); explorerTab(tree); el(tree ? 'tree-tab' : 'relations-tab').focus(); } }));
  el('example').onchange = event => { const key = event.target.value; event.target.value = ''; if (globalThis.ModellerExamples[key]) replaceDialog(M.validate(globalThis.ModellerExamples[key]), 'Example model loaded'); };
  el('import-model').onclick = () => HOST ? HOST.import() : el('import-file').click();
  el('import-file').accept = '.json,.yaml,.yml,.txt,application/json,text/yaml,text/plain';
  el('import-file').onchange = async event => { const file = event.target.files?.[0]; event.target.value = ''; if (!file) return; try { if (file.size > M.LIMITS.bytes) throw new Error('Import a model smaller than 5 MB.'); replaceDialog(globalThis.ModellerFormats.parse(await file.text(), file.name.split('.').pop()), 'Model imported'); } catch (e) { toast(`Import failed: ${e.message}`); } };
  el('export-json').onclick = exportJSON; el('export-svg').onclick = exportSVG; el('export-csv').onclick = exportCSV; el('refresh-network').onclick = refreshNetwork;
  el('save-view').onclick = saveView; el('manage-views').onclick = manageViews; el('view-filters').onclick = filterView; el('export-pack').onclick = exportPack;
  el('saved-view').onchange = event => { if (event.target.value) loadView(event.target.value); };
  el('export-yaml').onclick = () => { try { download(globalThis.ModellerFormats.dump(model), filename('.yaml'), 'text/yaml;charset=utf-8'); } catch (e) { toast(e.message); } };
  el('graph').addEventListener('dblclick', event => { if (event.target.closest('[data-action]')) return; const node = event.target.closest('[data-node]'); const n = diagram.nodes.find(n => n.id === (node?.dataset.node || lastPointerNode)); if(n) setFocus(n.originalId || n.id); });
  el('graph').addEventListener('click', event => { if (event.target.closest('[data-action]')) return; const group = event.target.closest('[data-group]'); if (group) { selectedGroup = group.dataset.group; selected = null; trace = null; updateSelectionStyles(); renderInspector(); } });
  el('graph').addEventListener('keydown', event => {
    if (!['Enter', ' '].includes(event.key)) return;
    const action = event.target.closest('[data-action]'); if (action) { event.preventDefault(); actions[action.dataset.action]?.(action.dataset.id); return; }
    const group = event.target.closest('[data-group]'); if (group) { event.preventDefault(); selectedGroup = group.dataset.group; selected = null; renderInspector(); return; }
    const node = event.target.closest('[data-node]'); if (node) { event.preventDefault(); const n = diagram.nodes.find(n => n.id === node.dataset.node); if (event.key === 'Enter') setFocus(n.originalId || n.id); else select(n.originalId || n.id); }
  });
  el('graph').addEventListener('pointerdown', event => {
    if (event.button !== 0 || event.target.closest('[data-action]') || event.target.closest('[data-group]') || !camera) return;
    const nodeElement = event.target.closest('[data-node]'), n = diagram.nodes.find(n => n.id === nodeElement?.dataset.node), point = graphPoint(event);
    lastPointerNode = n?.id || null;
    drag = { pointerId: event.pointerId, start: point, startClient: { x: event.clientX, y: event.clientY }, camera: { ...camera }, node: n, moved: false, positions: M.copy(viewPositions || model.views[viewKey()]?.positions || {}) };
    if (n && !n.external) { drag.original = { x: n.x, y: n.y }; drag.children = diagram.nodes.filter(c => c.id !== n.id && ((perspective !== 'layers' && M.descendants(model,n.id).has(c.id)) || globalThis.ModellerEditor?.multi?.has(c.id))).map(c => ({ id: c.id, x: c.x, y: c.y })); }
    el('graph').setPointerCapture(event.pointerId); if (!n) el('graph').classList.add('panning');
  });
  el('graph').addEventListener('pointermove', event => {
    if (!drag || drag.pointerId !== event.pointerId) return;
    if (Math.hypot(event.clientX - drag.startClient.x, event.clientY - drag.startClient.y) < 5 && !drag.moved) return;
    drag.moved = true; const point = graphPoint(event), dx = point.x - drag.start.x, dy = point.y - drag.start.y;
    if (drag.node && !drag.node.external) {
      let x = globalThis.ModellerPlatform.snap(drag.original.x + dx, globalThis.ModellerEditor?.snap !== false), y = globalThis.ModellerPlatform.snap(drag.original.y + dy, globalThis.ModellerEditor?.snap !== false); const parent = diagram.nodes.find(n => n.id === drag.node.parentVisible);
      if (perspective === 'layers') { const band = diagram.bands.find(b => drag.original.y >= b.y && drag.original.y < b.y + b.h); if (band) { x = Math.max(band.x+12,Math.min(band.x+band.w-drag.node.w-12,x)); y = Math.max(band.y+60,Math.min(band.y+band.h-drag.node.h-12,y)); } }
      if (parent) { x = Math.max(parent.x + 12, Math.min(parent.x + parent.w - drag.node.w - 12, x)); y = Math.max(parent.y + 65, Math.min(parent.y + parent.h - drag.node.h - 12, y)); }
      alignmentGuides = [];
      for(const peer of diagram.nodes.filter(n=>n.id!==drag.node.id&&!drag.children.some(c=>c.id===n.id))){if(Math.abs(peer.x-x)<8){x=peer.x;alignmentGuides.push({x1:x,y1:Math.min(y,peer.y)-40,x2:x,y2:Math.max(y+drag.node.h,peer.y+peer.h)+40});}if(Math.abs(peer.y-y)<8){y=peer.y;alignmentGuides.push({x1:Math.min(x,peer.x)-40,y1:y,x2:Math.max(x+drag.node.w,peer.x+peer.w)+40,y2:y});}}
      const actualX = x - drag.original.x, actualY = y - drag.original.y; pendingPositions = { ...drag.positions, [drag.node.id]: { x, y } };
      for (const c of drag.children) pendingPositions[c.id] = { x: c.x + actualX, y: c.y + actualY };
      renderGraph();
    } else if (!drag.node) {
      const rect = el('graph').getBoundingClientRect(); camera.x = drag.camera.x - (event.clientX - drag.startClient.x) * drag.camera.w / rect.width; camera.y = drag.camera.y - (event.clientY - drag.startClient.y) * drag.camera.h / rect.height; applyCamera();
    }
  });
  const finishDrag = event => {
    if (!drag || event.pointerId !== drag.pointerId) return; const current = drag; drag = null; alignmentGuides = []; el('graph').classList.remove('panning');
    if (current.moved && current.node && !current.node.external && pendingPositions) { const next = M.copy(model); next.views[viewKey()] = { positions: pendingPositions }; viewPositions = pendingPositions; commit(next, ''); }
    else if (!current.moved && current.node) select(current.node.originalId || current.node.id);
    pendingPositions = null;
  };
  el('graph').addEventListener('pointerup', finishDrag); el('graph').addEventListener('pointercancel', event => { if (drag?.pointerId === event.pointerId) { drag = null; pendingPositions = null; el('graph').classList.remove('panning'); renderGraph(); } });
  el('graph').addEventListener('wheel', event => { if (event.ctrlKey || event.metaKey) { event.preventDefault(); zoom(event.deltaY > 0 ? 1.08 : .92, graphPoint(event)); } }, { passive: false });
  document.addEventListener('keydown', event => { const editing = event.target.closest('input,textarea,select,[contenteditable=true]'); if (!editing && !el('dialog').open && (event.ctrlKey || event.metaKey) && event.key.toLocaleLowerCase() === 'z') { event.preventDefault(); history(event.shiftKey ? 'redo' : 'undo'); } if (!editing && !el('dialog').open && event.key === 'Escape') { selected = null; selectedGroup = null; trace = null; renderGraph(); renderInspector(); } });
  $('.menu-toggle')?.addEventListener('click', event => { const menu = el('fallback-menu'); if (!menu) return; const open = menu.classList.toggle('open'); event.currentTarget.setAttribute('aria-expanded', String(open)); updateHeaderHeight(); });
  if (typeof ResizeObserver !== 'undefined') new ResizeObserver(updateHeaderHeight).observe($('mightora-header'));
  if (typeof MutationObserver !== 'undefined') new MutationObserver(updateHeaderHeight).observe($('mightora-header'), { childList: true, subtree: true, attributes: true });
  window.addEventListener('resize', () => { updateHeaderHeight(); updateExplorerButton(); if (!drag) fitView(); });
  window.addEventListener('storage', event => { if (event.key === STORAGE) toast('The saved model changed in another tab. Export this tab’s JSON before making changes if you need to preserve both versions.'); });
  el('add-node').parentElement.insertAdjacentHTML('beforeend', '<button type="button" class="button" data-action="add-process">＋ Process</button><button type="button" class="button" data-action="add-stakeholder">＋ Stakeholder</button>');
  el('saved-view').parentElement.insertAdjacentHTML('afterbegin', `<label class="sr-only" for="perspective">Perspective</label><select id="perspective">${Object.entries(perspectiveNames).map(([id,name]) => `<option value="${id}">${name}</option>`).join('')}</select><button type="button" class="button" data-action="dimension-filters">Scope</button><button type="button" class="button" data-action="layers">Application layers</button><button type="button" class="button" data-action="mappings">Business mappings</button>`);
  el('perspective').onchange = event => changePerspective(event.target.value);
  el('example').insertAdjacentHTML('beforeend', '<option value="business">Business processes, stakeholders and layers</option>');
  globalThis.ModellerExamples.first = G.example(M,D);
  for(const [key,name] of Object.entries(globalThis.ModellerPlatform.templateNames)){globalThis.ModellerExamples[key]=globalThis.ModellerPlatform.template(key);el('example').insertAdjacentHTML('beforeend',`<option value="${key}">${esc(name)}</option>`);}
  el('example').insertAdjacentHTML('beforeend','<option value="first">First model — customer request service</option>');
  el('language-button').parentElement.insertAdjacentHTML('beforeend','<button type="button" class="button" id="first-model-guide" data-action="guide-toggle" aria-expanded="false" aria-controls="model-guide">Build your first model</button><button type="button" class="button" data-action="glossary">Help & glossary</button><button type="button" class="button" data-action="review-model">Review model</button>');
  document.querySelector('.workspace-tools').insertAdjacentHTML('afterend','<aside id="model-guide" class="model-guide" aria-labelledby="guide-step-title" hidden></aside>');
  globalThis.ModellerEditor = {get model(){return model;},get selected(){return selected;},get diagram(){return diagram;},get camera(){return camera;}, get viewKey(){return viewKey();},get host(){return HOST;},get activeView(){return activeNamedView;},snapshot,commit,dialog,closeDialog,point:graphPoint,download,filename,toast,locate,select,loadView,changePerspective,history,render,fitView,replace:replaceDialog,nodeForm,edgeForm,exportJSON,
    setViewExtras(value){viewExtras=value;camera=null;viewPositions=null;render();},get extras(){return viewExtras;},setPositions(value){const next=M.copy(model);next.views[viewKey()]={positions:value};viewPositions=value;commit(next,'Layout updated');},
    dispatch(action){ actions[action]?.(); }};
  render(); updateHeaderHeight(); refreshNetwork(); if (initialWarning) toast(initialWarning);
  if (HOST) {
    HOST.onDocument(next => { viewExtras = {}; model = M.validate(next); focus = null; selected = null; selectedGroup = null; expanded = new Set(); perspective = 'solution'; processId = null; selectedLayerIds = null; camera = null; viewPositions = null; pendingPositions = null; activeNamedView = null; relationshipTypeIds = null; undoStack = []; redoStack = []; saveFailure = ''; render(); });
    HOST.onImport((text,name) => { try { replaceDialog(globalThis.ModellerFormats.parse(text,name.split('.').pop()),'Model imported into this document'); } catch(error) { toast('Import failed: '+error.message); } });
  }
  window.addEventListener('load', () => { updateHeaderHeight(); refreshNetwork(); fitView(); });
})();
