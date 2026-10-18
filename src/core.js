/* Mightora Architecture Modeller — dependency-free graph model. MIT licence. */
(function (root) {
  'use strict';
  const VERSION = 1;
  const ICON_IDS = ['power-apps', 'power-automate', 'dataverse', 'power-pages', 'power-bi'];
  const LIMITS = Object.freeze({ nodes: 3000, edges: 10000, types: 50, depth: 64, bytes: 5 * 1024 * 1024 });
  const forbidden = new Set(['__proto__', 'prototype', 'constructor']);
  const copy = value => JSON.parse(JSON.stringify(value));
  const assert = (condition, message) => { if (!condition) throw new Error(message); };
  const validId = id => typeof id === 'string' && /^[A-Za-z0-9_-]{1,80}$/.test(id) && !forbidden.has(id);
  const text = (value, max, label, required = false) => {
    assert(typeof value === 'string' && value.length <= max && (!required || value.trim().length > 0), `${label} must be ${required ? 'non-empty ' : ''}text of up to ${max} characters.`);
  };
  function id(prefix = 'n') { return `${prefix}_${globalThis.crypto?.randomUUID?.() || `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 12)}`}`; }
  function index(model) {
    const nodes = new Map(model.nodes.map(n => [n.id, n]));
    const children = new Map([[null, []]]);
    for (const n of model.nodes) { if (!children.has(n.parentId)) children.set(n.parentId, []); children.get(n.parentId).push(n); }
    return { nodes, children, types: new Map(model.types.map(t => [t.id, t])), relationTypes: new Map(model.relationshipTypes.map(t => [t.id, t])) };
  }
  function path(model, nodeId) {
    const { nodes } = index(model); const result = []; let n = nodes.get(nodeId);
    while (n) { result.unshift(n.name); n = nodes.get(n.parentId); }
    return result.join(' / ');
  }
  function descendants(model, nodeId, includeSelf = false) {
    const { children } = index(model); const out = new Set(includeSelf && nodeId !== null ? [nodeId] : []); const stack = [nodeId];
    while (stack.length) for (const n of children.get(stack.pop()) || []) { out.add(n.id); stack.push(n.id); }
    return out;
  }
  function validate(input) {
    assert(input && typeof input === 'object' && !Array.isArray(input), 'This file is not an architecture model.');
    assert(input.schemaVersion === VERSION, `Unsupported model version. Expected schemaVersion ${VERSION}.`);
    const m = copy(input);
    text(m.name, 160, 'Model name', true);
    assert(Array.isArray(m.types) && m.types.length > 0 && m.types.length <= LIMITS.types, 'Include 1–50 component types.');
    assert(Array.isArray(m.relationshipTypes) && m.relationshipTypes.length > 0 && m.relationshipTypes.length <= LIMITS.types, 'Include 1–50 relationship types.');
    assert(Array.isArray(m.nodes) && m.nodes.length <= LIMITS.nodes, 'The model supports up to 3,000 components.');
    assert(Array.isArray(m.edges) && m.edges.length <= LIMITS.edges, 'The model supports up to 10,000 relationships.');
    for (const [list, label] of [[m.types, 'Component type'], [m.relationshipTypes, 'Relationship type'], [m.nodes, 'Component'], [m.edges, 'Relationship']]) {
      const seen = new Set();
      for (const item of list) { assert(item && validId(item.id) && !seen.has(item.id), `${label} IDs must be safe and unique.`); seen.add(item.id); }
    }
    for (const t of m.types) {
      assert(t.iconId === undefined || t.iconId === '' || ICON_IDS.includes(t.iconId), 'Unknown component type icon.');
      text(t.name, 80, 'Component type name', true);
      assert(/^#[\da-f]{6}$/i.test(t.color), 'Type colours must be six-digit hex colours.');
      assert(['rounded', 'square', 'database'].includes(t.shape), 'Unsupported component shape.');
      assert(Array.isArray(t.fields) && t.fields.length <= 16 && new Set(t.fields).size === t.fields.length, 'Use up to 16 unique custom property names.');
      for (const f of t.fields) { text(f, 60, 'Property name', true); assert(!forbidden.has(f), 'Reserved property name.'); }
    }
    const { nodes, types, relationTypes } = index(m);
    for (const t of m.relationshipTypes) {
      text(t.name, 80, 'Relationship type name', true);
      assert(/^#[\da-f]{6}$/i.test(t.color) && ['solid', 'dashed'].includes(t.style), 'Invalid relationship appearance.');
      for (const key of ['sourceTypes', 'targetTypes']) {
        if (t[key] === undefined) t[key] = [];
        assert(Array.isArray(t[key]) && t[key].length <= LIMITS.types && t[key].every(x => types.has(x)), 'Relationship rules reference an unknown component type.');
      }
    }
    for (const n of m.nodes) {
      assert(n.iconId === undefined || n.iconId === '' || ICON_IDS.includes(n.iconId), 'Unknown component icon.');
      text(n.name, 160, 'Component name', true); text(n.description || '', 4000, 'Description');
      assert(types.has(n.typeId), `Unknown type on ${n.name}.`);
      assert(n.parentId === null || (nodes.has(n.parentId) && n.parentId !== n.id), `Invalid parent on ${n.name}.`);
      if (n.properties === undefined) n.properties = {};
      assert(n.properties && typeof n.properties === 'object' && !Array.isArray(n.properties), 'Component properties must be an object.');
      assert(Object.keys(n.properties).length <= 40, 'Use at most 40 properties on a component.');
      for (const [k, v] of Object.entries(n.properties)) { text(k, 60, 'Property name', true); assert(!forbidden.has(k), 'Reserved property name.'); text(v, 2000, 'Property value'); }
      const seen = new Set([n.id]); let parent = n.parentId;
      while (parent !== null) { assert(!seen.has(parent), 'Components cannot contain their own ancestors.'); seen.add(parent); assert(seen.size <= LIMITS.depth, 'Nesting is limited to 64 levels.'); parent = nodes.get(parent).parentId; }
    }
    for (const e of m.edges) {
      assert(nodes.has(e.source) && nodes.has(e.target) && e.source !== e.target, 'Relationships must join two different existing components.');
      assert(relationTypes.has(e.typeId), 'Unknown relationship type.');
      text(e.label || '', 160, 'Relationship label'); text(e.description || '', 4000, 'Relationship notes');
      const t = relationTypes.get(e.typeId);
      assert(!t.sourceTypes.length || t.sourceTypes.includes(nodes.get(e.source).typeId), `The source type is not permitted for “${t.name}”.`);
      assert(!t.targetTypes.length || t.targetTypes.includes(nodes.get(e.target).typeId), `The target type is not permitted for “${t.name}”.`);
    }
    m.views = m.views && typeof m.views === 'object' && !Array.isArray(m.views) ? m.views : {};
    const safeViews = {};
    for (const [key, value] of Object.entries(m.views).slice(0, 100)) {
      if (!validId(key) || !value || typeof value !== 'object') continue;
      const positions = {};
      for (const [nid, p] of Object.entries(value.positions || {}).slice(0, LIMITS.nodes)) {
        if (nodes.has(nid) && Number.isFinite(p?.x) && Number.isFinite(p?.y) && Math.abs(p.x) <= 100000 && Math.abs(p.y) <= 100000) positions[nid] = { x: p.x, y: p.y };
      }
      safeViews[key] = { positions };
    }
    m.views = safeViews;
    if (m.namedViews !== undefined) {
      assert(Array.isArray(m.namedViews) && m.namedViews.length <= 50, 'Save up to 50 named views.');
      const seen = new Set();
      for (const view of m.namedViews) {
        assert(view && validId(view.id) && !seen.has(view.id), 'Saved view IDs must be safe and unique.'); seen.add(view.id);
        text(view.name, 160, 'View name', true); text(view.description || '', 2000, 'View description');
        assert(view.focus === null || nodes.has(view.focus), 'Saved view focus does not exist.');
        assert(Array.isArray(view.expanded) && view.expanded.length <= LIMITS.nodes && view.expanded.every(id => nodes.has(id)), 'Saved expansion references an unknown component.');
        assert(view.relationshipTypeIds == null || (Array.isArray(view.relationshipTypeIds) && view.relationshipTypeIds.length <= LIMITS.types && view.relationshipTypeIds.every(id => relationTypes.has(id))), 'Saved view references an unknown relationship type.');
        assert(typeof view.showExternal === 'boolean', 'Saved view external context must be true or false.');
        const positions = {};
        for (const [nid, p] of Object.entries(view.positions || {}).slice(0, LIMITS.nodes)) if (nodes.has(nid) && Number.isFinite(p?.x) && Number.isFinite(p?.y) && Math.abs(p.x) <= 100000 && Math.abs(p.y) <= 100000) positions[nid] = { x: p.x, y: p.y };
        view.positions = positions;
        if (view.camera !== undefined) assert(view.camera && ['x', 'y', 'w', 'h'].every(k => Number.isFinite(view.camera[k]) && Math.abs(view.camera[k]) <= 1000000) && view.camera.w > 0 && view.camera.h > 0, 'Invalid saved view camera.');
      }
    }
    const dimensions = typeof module !== 'undefined' && module.exports ? require('./dimensions.js') : root.ModellerDimensions;
    dimensions.validate(m);
    return m;
  }
  function parse(json) { assert(typeof json === 'string' && new TextEncoder().encode(json).length <= LIMITS.bytes, 'Import a model smaller than 5 MB.'); return validate(JSON.parse(json)); }
  function reparent(model, nodeId, parentId) {
    const next = copy(model); const n = next.nodes.find(x => x.id === nodeId);
    assert(n, 'Component not found.'); n.parentId = parentId; next.views = {}; return validate(next);
  }
  function removeNode(model, nodeId) {
    const next = copy(model); const removed = descendants(next, nodeId, true);
    next.nodes = next.nodes.filter(n => !removed.has(n.id)); next.edges = next.edges.filter(e => !removed.has(e.source) && !removed.has(e.target)); next.views = {};
    for (const v of next.namedViews || []) { if (removed.has(v.focus)) v.focus = null; if (removed.has(v.processId)) v.processId = null; v.expanded = v.expanded.filter(id => !removed.has(id)); v.positions = {}; delete v.camera; }
    return validate(next);
  }
  function impact(model, nodeId, direction = 'incoming') {
    const adjacency = new Map();
    for (const e of model.edges) { const from = direction === 'incoming' ? e.target : e.source, to = direction === 'incoming' ? e.source : e.target; if (!adjacency.has(from)) adjacency.set(from, []); adjacency.get(from).push(to); }
    const reached = new Set([nodeId]); const queue = [nodeId];
    for (let i = 0; i < queue.length; i++) for (const to of adjacency.get(queue[i]) || []) if (!reached.has(to)) { reached.add(to); queue.push(to); }
    reached.delete(nodeId); return reached;
  }
  function project(model, focus = null, expandedIds = []) {
    const { nodes, children } = index(model); const expanded = new Set(expandedIds); const visible = new Map();
    assert(focus === null || nodes.has(focus), 'The focused component no longer exists.');
    const inside = focus === null ? new Set(nodes.keys()) : descendants(model, focus, true);
    const add = (nodeId, parentVisible = null) => {
      const n = nodes.get(nodeId); const open = expanded.has(nodeId) && (children.get(nodeId) || []).length > 0;
      visible.set(nodeId, { ...n, parentVisible, expanded: open, external: false, isScope: false });
      if (open) for (const child of children.get(nodeId) || []) add(child.id, nodeId);
    };
    if (focus !== null) visible.set(focus, { ...nodes.get(focus), parentVisible: null, expanded: true, external: false, isScope: true });
    for (const n of children.get(focus) || []) add(n.id, focus);
    const representative = nodeId => {
      if (inside.has(nodeId)) { let cur = nodeId; while (cur !== null) { if (visible.has(cur)) return cur; cur = nodes.get(cur)?.parentId ?? null; } return null; }
      let cur = nodeId;
      while (nodes.get(cur).parentId !== null && !inside.has(nodes.get(cur).parentId)) cur = nodes.get(cur).parentId;
      const extId = `external:${cur}`;
      if (!visible.has(extId)) visible.set(extId, { ...nodes.get(cur), id: extId, originalId: cur, external: true, expanded: false, parentVisible: null });
      return extId;
    };
    const groups = new Map(); const hidden = new Map();
    for (const edge of model.edges) {
      if (!inside.has(edge.source) && !inside.has(edge.target)) continue;
      const source = representative(edge.source), target = representative(edge.target);
      if (!source || !target) continue;
      if (source === target) { hidden.set(source, (hidden.get(source) || 0) + 1); continue; }
      const key = JSON.stringify([source, target, edge.typeId]);
      if (!groups.has(key)) groups.set(key, { id: `group-${groups.size}`, source, target, typeId: edge.typeId, edges: [] });
      groups.get(key).edges.push(edge);
    }
    return { nodes: [...visible.values()], edges: [...groups.values()], hidden, focus, inside };
  }
  function layout(projection, saved = {}) {
    const byId = new Map(projection.nodes.map(n => [n.id, { ...n }]));
    const children = new Map();
    for (const n of byId.values()) { const p = n.external ? 'external' : n.parentVisible; if (!children.has(p)) children.set(p, []); children.get(p).push(n); }
    const measure = n => {
      const kids = children.get(n.id) || [];
      if (!n.expanded || !kids.length) { n.w = 252; n.h = 124; return; }
      kids.forEach(measure); const cols = Math.min(2, kids.length); const cellW = Math.max(...kids.map(c => c.w)); let y = 76;
      for (let r = 0; r < Math.ceil(kids.length / cols); r++) { const row = kids.slice(r * cols, (r + 1) * cols); for (let c = 0; c < row.length; c++) { row[c].rx = 26 + c * (cellW + 70); row[c].ry = y; } y += Math.max(...row.map(c => c.h)) + 62; }
      n.w = cols * cellW + (cols - 1) * 70 + 52; n.h = y - 30;
    };
    const roots = children.get(null) || []; roots.forEach(measure);
    const cols = Math.min(2, roots.length || 1); const cellW = Math.max(252, ...roots.map(n => n.w)); let y = 56;
    for (let r = 0; r < Math.ceil(roots.length / cols); r++) { const row = roots.slice(r * cols, (r + 1) * cols); row.forEach((n, c) => { n.rx = 60 + c * (cellW + 160); n.ry = y; }); y += Math.max(...row.map(n => n.h)) + 128; }
    const place = (n, px = 0, py = 0) => { n.x = saved[n.id]?.x ?? px + (n.rx || 0); n.y = saved[n.id]?.y ?? py + (n.ry || 0); for (const c of children.get(n.id) || []) place(c, n.x, n.y); };
    roots.forEach(n => place(n));
    const right = Math.max(312, ...roots.map(n => n.x + n.w));
    const external = children.get('external') || [];
    external.forEach((n, i) => { n.x = right + 170; n.y = 80 + i * 200; n.w = 252; n.h = 124; });
    return { nodes: [...byId.values()], width: Math.max(720, ...[...byId.values()].map(n => n.x + n.w + 80)), height: Math.max(470, ...[...byId.values()].map(n => n.y + n.h + 80)) };
  }
  function empty(name = 'Untitled architecture') {
    return { schemaVersion: VERSION, name, types: [{ id: 'system', name: 'System', color: '#059669', shape: 'rounded', fields: ['Owner', 'Lifecycle'] }, { id: 'component', name: 'Component', color: '#6366f1', shape: 'rounded', fields: ['Owner', 'Technology'] }, { id: 'data', name: 'Data store', color: '#0284c7', shape: 'database', fields: ['Classification'] }], relationshipTypes: [{ id: 'depends', name: 'depends on', color: '#059669', style: 'solid', sourceTypes: [], targetTypes: [] }], nodes: [], edges: [], views: {} };
  }
  function projectView(model, view) {
    const dimensions = typeof module !== 'undefined' && module.exports ? require('./dimensions.js') : root.ModellerDimensions;
    return dimensions.project(api, model, view);
  }
  function layoutView(model, projection, view, positions = {}) { const dimensions = typeof module !== 'undefined' && module.exports ? require('./dimensions.js') : root.ModellerDimensions; return dimensions.layout(api, model, projection, view, positions); }
  const api = { VERSION, ICON_IDS, LIMITS, copy, id, index, path, descendants, validate, parse, reparent, removeNode, impact, project, projectView, layout, layoutView, empty };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.Modeller = api;
})(globalThis);
