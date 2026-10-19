/* Business context and application layers, independent of component containment. */
(function(root) {
  'use strict';
  const kinds = ['component', 'process', 'stakeholder'];
  const perspectives = ['solution', 'application', 'data', 'infrastructure', 'security', 'integration', 'deployment', 'custom', 'process', 'stakeholder', 'layers', 'traceability', 'all'];
  const roles = ['R', 'A', 'C', 'I'];
  const kind = n => n?.kind || 'component';
  const safeId = id => typeof id === 'string' && /^[A-Za-z0-9_-]{1,80}$/.test(id) && !['__proto__', 'constructor', 'prototype'].includes(id);
  const check = (value, message) => { if (!value) throw new Error(message); };
  const text = (v, limit) => typeof v === 'string' && v.length <= limit;
  function validate(m) {
    const nodes = new Map(m.nodes.map(n => [n.id, n])), layers = new Map();
    if (m.layers !== undefined) {
      check(Array.isArray(m.layers) && m.layers.length <= 50, 'Define up to 50 application layers.');
      for (const l of m.layers) { check(l && safeId(l.id) && !layers.has(l.id), 'Layer IDs must be safe and unique.'); check(text(l.name, 100) && l.name.trim() && text(l.description || '', 2000) && /^#[\da-f]{6}$/i.test(l.color), 'Layers need a name, description and six-digit hex colour.'); layers.set(l.id, l); }
    }
    for (const n of m.nodes) {
      check(n.kind === undefined || kinds.includes(n.kind), 'Unknown entity kind. Use component, process or stakeholder.');
      if (n.layerIds !== undefined) check(Array.isArray(n.layerIds) && n.layerIds.length <= 50 && new Set(n.layerIds).size === n.layerIds.length && n.layerIds.every(id => layers.has(id)) && (kind(n) === 'component' || n.layerIds.length === 0), 'Only components can reference existing application layers.');
    }
    for (const t of m.relationshipTypes) check(t.semantic === undefined || ['sequence', 'supports', 'participation'].includes(t.semantic), 'Unknown business relationship meaning.');
    const types = new Map(m.relationshipTypes.map(t => [t.id, t]));
    for (const e of m.edges) {
      const from = kind(nodes.get(e.source)), to = kind(nodes.get(e.target)), semantic = types.get(e.typeId)?.semantic;
      if (semantic === 'sequence') check(from === 'process' && to === 'process', 'Process sequence links must join two processes or steps.');
      if (semantic === 'supports') check(from === 'component' && to === 'process', 'Supporting links must go from a component to a process or step.');
      if (semantic === 'participation') check(from === 'stakeholder' && to === 'process', 'Stakeholder participation must go from a stakeholder to a process or step.');
      if (e.role !== undefined && e.role !== '') check(roles.includes(e.role) && from === 'stakeholder' && to === 'process', 'RACI roles belong on stakeholder-to-process relationships.');
    }
    for (const v of m.namedViews || []) {
      check(v.perspective === undefined || perspectives.includes(v.perspective), 'Unknown saved view perspective.');
      check(v.processId == null || (nodes.has(v.processId) && kind(nodes.get(v.processId)) === 'process'), 'Saved process filter references an unknown process.');
      check(v.layerIds == null || (Array.isArray(v.layerIds) && v.layerIds.length <= 50 && v.layerIds.every(id => layers.has(id))), 'Saved layer filter references an unknown application layer.');
    }
  }
  function ensureLanguage(M, m) {
    const type = (id, name, color, fields) => {
      let t = m.types.find(t => t.id === id); if (!t) { t = { id: m.types.some(t => t.id === id) ? M.id('type') : id, name, color, shape: 'rounded', fields }; m.types.push(t); } return t.id;
    };
    const processType = type('business-process', 'Business process', '#b45309', ['Outcome']), stakeholderType = type('business-stakeholder', 'Stakeholder', '#9333ea', ['Organisation', 'Role']);
    const relation = (semantic, name, color) => { let t = m.relationshipTypes.find(t => t.semantic === semantic); if (!t) { t = { id: M.id('rel'), name, color, style: 'solid', sourceTypes: [], targetTypes: [], semantic }; m.relationshipTypes.push(t); } return t.id; };
    return { processType, stakeholderType, sequence: relation('sequence', 'followed by', '#b45309'), supports: relation('supports', 'supports', '#0284c7'), participation: relation('participation', 'participates in', '#9333ea') };
  }
  function processBranch(M, model, id) { const result = id ? M.descendants(model, id, true) : new Set(model.nodes.filter(n => kind(n) === 'process').map(n => n.id)); return new Set([...result].filter(nid => kind(model.nodes.find(n => n.id === nid)) === 'process')); }
  function project(M, model, view) {
    const perspective = view.perspective || 'solution', processIds = processBranch(M, model, view.processId), included = new Set(), context = new Set();
    const processScope = n => kind(n) === 'process' && processIds.has(n.id);
    for (const n of model.nodes) {
      const k = kind(n); let keep = perspective === 'all' || (['solution', 'application', 'data', 'infrastructure', 'security', 'integration', 'deployment', 'custom', 'layers'].includes(perspective) && k === 'component') || (['process', 'stakeholder', 'traceability'].includes(perspective) && processScope(n));
      if (perspective === 'stakeholder' && k === 'stakeholder' && !view.processId) keep = true;
      if (keep && k === 'component' && view.layerIds != null) keep = view.layerIds.length ? (n.layerIds || []).some(id => view.layerIds.includes(id)) : !(n.layerIds || []).length;
      if (keep && ['application','data','infrastructure','security','integration','deployment'].includes(perspective) && n.viewpoints?.length) keep = n.viewpoints.includes(perspective);
      if (keep && view.includedIds != null) keep = view.includedIds.includes(n.id);
      if (keep && view.typeIds != null) keep = view.typeIds.includes(n.typeId);
      if (view.hiddenIds?.includes(n.id)) keep = false;
      if (keep) included.add(n.id);
    }
    const semantic = e => model.relationshipTypes.find(t => t.id === e.typeId)?.semantic;
    for (const e of model.edges) {
      if (!processIds.has(e.target)) continue;
      const source = model.nodes.find(n => n.id === e.source);
      if (semantic(e) === 'participation' && ['stakeholder', 'traceability'].includes(perspective)) included.add(e.source);
      if (semantic(e) === 'supports' && ['process', 'traceability'].includes(perspective) && (perspective === 'traceability' || view.showExternal !== false)) {
        if (view.layerIds != null && !(view.layerIds.length ? (source.layerIds || []).some(id => view.layerIds.includes(id)) : !(source.layerIds || []).length)) continue;
        included.add(e.source); if (perspective === 'process') context.add(e.source);
      }
    }
    const original = M.index(model).nodes;
    const nodes = model.nodes.filter(n => included.has(n.id)).map(n => { let p = n.parentId; while (p && !included.has(p)) p = original.get(p)?.parentId ?? null; return { ...n, parentId: perspective === 'layers' || context.has(n.id) ? null : p }; });
    const edges = model.edges.filter(e => included.has(e.source) && included.has(e.target) && (view.relationshipTypeIds == null || view.relationshipTypeIds.includes(e.typeId)));
    const focus = included.has(view.focus) && perspective !== 'layers' ? view.focus : null;
    const projected = M.project({ ...model, nodes, edges }, focus, (view.expanded || []).filter(id => !context.has(id)));
    for (const n of projected.nodes) if (context.has(n.id) && !n.isScope) { n.external = true; n.originalId = n.id; n.parentVisible = null; n.expanded = false; }
    if (view.showExternal === false) { const ids = new Set(projected.nodes.filter(n => !n.external).map(n => n.id)); projected.nodes = projected.nodes.filter(n => ids.has(n.id)); projected.edges = projected.edges.filter(e => ids.has(e.source) && ids.has(e.target)); }
    projected.perspective = perspective; return projected;
  }
  function layout(M, model, projection, view, positions = {}) {
    if (view.swimlanes && ['process','stakeholder','traceability'].includes(view.perspective)) {
      const lanes = [...new Set(projection.nodes.map(n=>n.swimlane || 'Unassigned'))], bands=[], nodes=[];let y=30;
      for(const lane of lanes){ const members=projection.nodes.filter(n=>(n.swimlane||'Unassigned')===lane), h=80+Math.ceil(members.length/3)*170;bands.push({id:'lane-'+bands.length,name:lane,description:'Process swimlane',color:'#059669',x:30,y,w:1030,h});members.forEach((n,i)=>nodes.push({...n,x:positions[n.id]?.x??55+(i%3)*335,y:positions[n.id]?.y??y+65+Math.floor(i/3)*170,w:252,h:124,expanded:false,parentVisible:null}));y+=h+30;}
      return {nodes,bands,width:1100,height:Math.max(470,y)};
    }
    if ((view.perspective || 'solution') !== 'layers') return M.layout(projection, positions);
    const layers = [...(model.layers || []), { id: null, name: 'Unassigned', description: 'Components without an application layer', color: '#64748b' }];
    const bands = [], nodes = []; let y = 30;
    for (const layer of layers) {
      const members = projection.nodes.filter(n => { const ids = n.layerIds || []; return (view.layerIds?.length ? ids.find(id => view.layerIds.includes(id)) : ids[0] || null) === layer.id; });
      if (!members.length) continue;
      const rows = Math.ceil(members.length / 3), height = 70 + rows * 178;
      const placed = members.map((n, i) => ({ ...n, x: positions[n.id]?.x ?? 55 + (i % 3) * 335, y: positions[n.id]?.y ?? y + 65 + Math.floor(i / 3) * 178, w: 252, h: 124, expanded: false, parentVisible: null }));
      bands.push({ ...layer, x: 30, y, w: 1030, h: height }); nodes.push(...placed); y += height + 30;
    }
    return { nodes, bands, width: Math.max(1100, ...nodes.map(n => n.x + n.w + 50)), height: Math.max(470, y) };
  }
  function roleLabel(e) { return e.role ? ({ R: 'Responsible', A: 'Accountable', C: 'Consulted', I: 'Informed' }[e.role] + ' (' + e.role + ')') : ''; }
  function mappings(model, processId = null) {
    const processIds = new Set(model.nodes.filter(n => kind(n) === 'process' && (!processId || n.id === processId)).map(n => n.id)), types = new Map(model.relationshipTypes.map(t => [t.id, t]));
    return model.edges.filter(e => processIds.has(e.target) && ['supports', 'participation'].includes(types.get(e.typeId)?.semantic)).map(e => ({ edge: e, semantic: types.get(e.typeId).semantic, source: model.nodes.find(n => n.id === e.source), process: model.nodes.find(n => n.id === e.target) }));
  }
  function removeLayer(model, id) {
    const next = JSON.parse(JSON.stringify(model)); next.layers = (next.layers || []).filter(l => l.id !== id);
    for (const n of next.nodes) if (n.layerIds) n.layerIds = n.layerIds.filter(l => l !== id);
    for (const v of next.namedViews || []) { if (v.layerIds?.includes(id)) v.layerIds = null; if (v.perspective === 'layers') { v.positions = {}; delete v.camera; } }
    return next;
  }
  const api = { kinds, perspectives, roles, kind, validate, ensureLanguage, project, layout, roleLabel, mappings, removeLayer, processBranch };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.ModellerDimensions = api;
})(globalThis);
