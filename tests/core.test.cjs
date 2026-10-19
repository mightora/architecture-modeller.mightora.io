const { test } = require('node:test');
const assert = require('node:assert/strict');
const M = require('../src/core.js');
const examples = require('../src/examples.js');
const fresh = () => M.validate(examples.platform);

test('both complete examples validate without mutating the input', () => {
  for (const original of Object.values(examples)) { const before = JSON.stringify(original); assert.equal(M.validate(original).schemaVersion, M.VERSION); assert.equal(JSON.stringify(original), before); }
});
test('overview rolls deep endpoints up to visible roots and retains exact edges', () => {
  const m = fresh(), p = M.project(m), g = p.edges.find(g => g.source === 'pp' && g.target === 'azure' && g.typeId === 'calls');
  assert.ok(g); assert.equal(g.edges[0].source, 'approvals'); assert.equal(g.edges[0].target, 'function');
  assert.equal(p.nodes.length, 4); assert.ok(p.hidden.get('pp') > 0);
  const represented = p.edges.flatMap(g => g.edges).length + [...p.hidden.values()].reduce((a, b) => a + b, 0);
  assert.equal(represented, m.edges.length);
});
test('nested focus retains its boundary and crossing links to external context', () => {
  const p = M.project(fresh(), 'dv');
  assert.ok(p.nodes.some(n => n.id === 'dv' && n.isScope));
  assert.ok(p.nodes.some(n => n.id === 'cases'));
  assert.ok(p.nodes.some(n => n.id === 'external:azure' && n.originalId === 'azure'));
  const edge = p.edges.find(g => g.source === 'cases' && g.target === 'external:azure');
  assert.equal(edge.edges[0].target, 'function');
});
test('platform-to-deep-child links stay visible through a focused boundary', () => {
  const p = M.project(fresh(), 'pp');
  const g = p.edges.find(g => g.source === 'pp' && g.typeId === 'auth');
  assert.ok(g && g.edges.some(e => e.source === 'pp' && e.target === 'entra'));
});
test('mixed expansion shows different levels in one view', () => {
  const p = M.project(fresh(), null, ['pp', 'dv']);
  for (const id of ['pp', 'apps', 'dv', 'cases', 'accounts', 'azure']) assert.ok(p.nodes.some(n => n.id === id));
  assert.ok(!p.nodes.some(n => n.id === 'caseapp'));
  const g = p.edges.find(g => g.source === 'apps' && g.target === 'cases');
  assert.equal(g.edges[0].source, 'caseapp');
});
test('fully expanded overview represents all exact edges without loss', () => {
  const m = fresh(), p = M.project(m, null, m.nodes.map(n => n.id));
  assert.equal(p.nodes.length, m.nodes.length); assert.equal(p.hidden.size, 0);
  assert.deepEqual(p.edges.flatMap(g => g.edges).map(e => e.id).sort(), m.edges.map(e => e.id).sort());
});
test('aggregation separates directions and relationship types', () => {
  const m = fresh(); m.edges.push({ id: 'reverse', source: 'function', target: 'cases', typeId: 'calls', label: '' });
  const p = M.project(M.validate(m));
  assert.ok(p.edges.some(g => g.source === 'pp' && g.target === 'azure' && g.typeId === 'calls'));
  assert.ok(p.edges.some(g => g.source === 'pp' && g.target === 'azure' && g.typeId === 'depends'));
  assert.ok(p.edges.some(g => g.source === 'azure' && g.target === 'pp' && g.typeId === 'calls'));
});
test('leaf focus can show links to a parent-level external representative', () => {
  const m = fresh(); m.edges.push({ id: 'parent-link', source: 'pp', target: 'cases', typeId: 'depends', label: '' });
  const p = M.project(M.validate(m), 'cases'); assert.ok(p.edges.some(g => g.source === 'external:pp' && g.target === 'cases'));
});
test('unrelated external-to-external links are excluded from a focused view', () => {
  const p = M.project(fresh(), 'dv'); assert.ok(!p.edges.flatMap(g => g.edges).some(e => e.id === 'e5'));
});
test('moving a component retains all relationship IDs and endpoint IDs', () => {
  const m = fresh(), next = M.reparent(m, 'cases', 'azure');
  assert.equal(next.nodes.find(n => n.id === 'cases').parentId, 'azure'); assert.deepEqual(next.edges, m.edges);
  assert.equal(m.nodes.find(n => n.id === 'cases').parentId, 'dv');
});
test('cyclic containment and self-parenting are rejected', () => {
  assert.throws(() => M.reparent(fresh(), 'pp', 'cases'), /ancestors/);
  assert.throws(() => M.reparent(fresh(), 'pp', 'pp'), /parent/);
});
test('removing a boundary removes descendants and incident links only', () => {
  const m = fresh(), removed = M.descendants(m, 'pp', true), next = M.removeNode(m, 'pp');
  assert.ok(next.nodes.every(n => !removed.has(n.id)));
  assert.ok(next.edges.every(e => !removed.has(e.source) && !removed.has(e.target)));
  assert.ok(next.edges.some(e => e.id === 'e5'));
});
test('directed dependency traversal terminates on graph cycles', () => {
  const m = fresh(); m.edges.push({ id: 'cycle', source: 'function', target: 'approvals', typeId: 'calls', label: '' });
  const visited = M.impact(m, 'function'); assert.ok(visited.has('approvals')); assert.ok(!visited.has('function')); assert.ok(visited.size < m.nodes.length);
  assert.ok(M.impact(m, 'caseapp', 'outgoing').has('cases'));
});
test('containment does not invent dependency edges', () => {
  const m = fresh(), visited = M.impact(m, 'cases'); assert.ok(visited.has('caseapp')); assert.ok(!visited.has('pp'));
});
test('custom modelling language and properties round-trip', () => {
  const m = fresh(); m.types.push({ id: 'capability', name: 'Business capability', color: '#ab12cd', shape: 'square', fields: ['Criticality'] });
  m.nodes.push({ id: 'cap', parentId: null, typeId: 'capability', name: 'Customer support', description: '', properties: { Criticality: 'High' } });
  assert.deepEqual(M.parse(JSON.stringify(M.validate(m))), m);
});
test('relationship endpoint rules apply to real endpoints before projection', () => {
  const m = fresh(); m.relationshipTypes.find(t => t.id === 'reads').targetTypes = ['data']; assert.doesNotThrow(() => M.validate(m));
  m.edges.find(e => e.id === 'e1').target = 'function'; assert.throws(() => M.validate(m), /target type/);
});
test('bad IDs, duplicates, dangling edges, unsafe colours and unknown versions are rejected', () => {
  for (const mutate of [m => m.nodes[0].id = '__proto__', m => m.nodes[1].id = m.nodes[0].id, m => m.edges[0].source = 'missing', m => m.types[0].color = 'red;url(https://x)', m => m.schemaVersion = 999, m => m.nodes[0].parentId = 'missing']) {
    const m = fresh(); mutate(m); assert.throws(() => M.validate(m));
  }
});
test('unsafe property names and non-text property values are rejected', () => {
  const m = fresh(); m.nodes[0].properties = JSON.parse('{"__proto__":"bad"}'); assert.throws(() => M.validate(m), /Reserved/);
  m.nodes[0].properties = { x: { html: '<script>' } }; assert.throws(() => M.validate(m), /Property value/);
});
test('import bounds and nesting limits fail clearly', () => {
  assert.throws(() => M.parse(' '.repeat(M.LIMITS.bytes + 1)), /5 MB/);
  const m = M.empty(); for (let i = 0; i < 65; i++) m.nodes.push({ id: 'n' + i, name: 'N' + i, typeId: 'component', parentId: i ? 'n' + (i - 1) : null, properties: {}, description: '' });
  assert.throws(() => M.validate(m), /64/);
});
test('stored coordinates are sanitized and remain portable in JSON', () => {
  const m = fresh(); m.views = { overview: { positions: { pp: { x: 40, y: 90 }, azure: { x: Infinity, y: 10 }, unknown: { x: 5, y: 9 } } } };
  const clean = M.validate(m); assert.deepEqual(clean.views.overview.positions, { pp: { x: 40, y: 90 } });
  assert.equal(M.layout(M.project(clean), clean.views.overview.positions).nodes.find(n => n.id === 'pp').x, 40);
});
test('automatic layout keeps expanded descendants inside their container', () => {
  const m = fresh(), p = M.project(m, null, m.nodes.map(n => n.id)), out = M.layout(p), map = new Map(out.nodes.map(n => [n.id, n]));
  for (const n of out.nodes) { assert.ok(Number.isFinite(n.x) && Number.isFinite(n.y)); if (n.parentVisible) { const parent = map.get(n.parentVisible); assert.ok(n.x >= parent.x && n.y >= parent.y + 55); assert.ok(n.x + n.w <= parent.x + parent.w); assert.ok(n.y + n.h <= parent.y + parent.h); } }
});
test('empty model and empty focused component can be rendered', () => {
  const m = M.validate(M.empty()); assert.equal(M.layout(M.project(m)).nodes.length, 0);
  const m2 = fresh(); const p = M.project(m2, 'blob'); assert.ok(p.nodes.some(n => n.id === 'blob' && n.isScope));
});
