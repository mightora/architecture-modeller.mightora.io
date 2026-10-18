const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const M = require('../src/core.js');
const F = require('../src/formats.js');
const E = require('../src/examples.js').platform;
const Zip = require('../assets/jszip.min.js');
globalThis.ModellerIcons = Object.fromEntries(M.ICON_IDS.map(id => [id, { id, name: id, svg: 'data:image/svg+xml;base64,' + fs.readFileSync(path.join(__dirname, '../assets/icons/' + id + '.svg')).toString('base64'), png: 'data:image/png;base64,' + fs.readFileSync(path.join(__dirname, '../assets/icons/' + id + '.png')).toString('base64') }]));
const O = require('../src/office.js');

test('YAML round-trips hierarchy, exact endpoints, icons, saved view order and coordinates', () => {
  const model = M.copy(E); model.namedViews[1].positions = { apps: { x: 50, y: 100 } }; model.namedViews[2].relationshipTypeIds = ['calls'];
  assert.deepEqual(F.parse(F.dump(model), 'yaml'), model);
  assert.deepEqual(F.parse(JSON.stringify(model), 'json'), model);
  assert.deepEqual(F.parse(F.dump(model), 'txt'), model);
});
test('YAML duplicate keys, executable tags, cyclic aliases and prototype keys are rejected', () => {
  for (const value of ['name: A\nname: B', 'x: !!js/function >\n  function () {}', 'x: &x [*x]', '__proto__: bad']) assert.throws(() => F.parse(value, 'yaml'));
});
test('unknown or stale saved view references fail import validation', () => {
  const m = M.copy(E); m.namedViews[0].focus = 'gone'; assert.throws(() => M.validate(m), /focus/);
  m.namedViews[0].focus = null; m.namedViews[0].relationshipTypeIds = ['gone']; assert.throws(() => M.validate(m), /relationship type/);
  m.namedViews[0].relationshipTypeIds = null; m.nodes[0].iconId = 'https://tracker.invalid/x.svg'; assert.throws(() => M.validate(m), /icon/);
});
test('relationship filters and external context affect the projection without changing data', () => {
  const m = M.validate(E), before = JSON.stringify(m), view = { ...m.namedViews[1], relationshipTypeIds: ['reads'], showExternal: false };
  const p = M.projectView(m, view); assert.ok(p.edges.every(e => e.typeId === 'reads')); assert.ok(p.nodes.every(n => !n.external));
  assert.equal(JSON.stringify(m), before); assert.equal(M.projectView(m, { ...view, relationshipTypeIds: [] }).edges.length, 0);
});
test('component deletion repairs saved views and retains their identities', () => {
  const next = M.removeNode(M.validate(E), 'dv'); const saved = next.namedViews.find(v => v.id === 'business-data');
  assert.equal(saved.focus, null); assert.equal(saved.name, 'Dataverse detail'); assert.ok(!saved.expanded.includes('cases'));
});
test('scene SVG is self contained, embeds official icons and escapes labels', () => {
  const m = M.copy(E); m.nodes.find(n => n.id === 'dv').name = '<script>alert("x")</script>';
  const s = O.svg(O.scene(m, m.namedViews[1])); assert.ok(s.includes('data:image/png;base64,')); assert.ok(!s.includes('<script>')); assert.ok(s.includes('&lt;script&gt;')); assert.ok(!/href="https?:/.test(s));
});
test('PowerPoint exports chosen view order as editable shapes and attached native connectors', async () => {
  const views = [E.namedViews[2], E.namedViews[0]], bytes = await O.pptx(E, views), z = await Zip.loadAsync(bytes);
  const slides = Object.keys(z.files).filter(n => /^ppt\/slides\/slide\d+\.xml$/.test(n)); assert.equal(slides.length, 2);
  const first = await z.file(slides[0]).async('string'); assert.ok(first.includes('Dataverse detail')); assert.ok(first.includes('<p:sp>'));
  assert.ok(first.includes('<p:cxnSp>')); assert.ok(first.includes('<a:stCxn ')); assert.ok(first.includes('<a:endCxn '));
  const ids = new Set([...first.matchAll(/<p:cNvPr[^>]+id="(\d+)"/g)].map(m => m[1]));
  for (const match of first.matchAll(/<a:(?:stCxn|endCxn) id="(\d+)"/g)) assert.ok(ids.has(match[1]));
  const second = await z.file('ppt/slides/slide2.xml').async('string'); assert.ok(second.includes('Architecture overview'));
  assert.ok(Object.keys(z.files).some(n => n.startsWith('ppt/media/')));
});
test('Word exports scalable diagrams, PNG fallbacks and editable endpoint tables', async () => {
  const tinyPng = fs.readFileSync(path.join(__dirname, '../assets/icons/dataverse.png')).toString('base64');
  const bytes = await O.docx(E, E.namedViews.slice(0, 2), { rasterize: async () => tinyPng, landscape: true }), z = await Zip.loadAsync(bytes);
  const xml = await z.file('word/document.xml').async('string'); assert.ok(xml.includes('w:orient="landscape"')); assert.ok(xml.includes('<w:tbl>')); assert.ok(xml.includes('Approval flow')); assert.ok(xml.includes('Document Function')); assert.ok(xml.includes('<asvg:svgBlip '));
  for (const file of ['word/media/view1.svg', 'word/media/view1.png', 'word/media/view2.svg', 'word/media/view2.png']) assert.ok(z.file(file));
  assert.ok(!xml.includes('TargetMode="External"'));
});
test('Office export rejects empty selections and does not mutate the model', async () => {
  const before = JSON.stringify(E); await assert.rejects(O.pptx(E, []), /Choose/); await O.pptx(E, E.namedViews.slice(0, 1)); assert.equal(JSON.stringify(E), before);
});
test('example export labels avoid component blocks and other labels', () => {
  for (const view of E.namedViews) {
    const s = O.scene(E, view), used = [];
    for (const edge of s.edges) {
      const before = [...used], p = O.labelGeometry(s, edge, used), r = p.rect;
      const obstacles = [...s.nodes.map(n => ({ x: n.x, y: n.y, w: n.w, h: n.expanded ? 66 : n.h })), ...before];
      assert.ok(!obstacles.some(o => r.x < o.x + o.w && r.x + r.w > o.x && r.y < o.y + o.h && r.y + r.h > o.y), view.name + ': ' + p.label);
    }
  }
});
