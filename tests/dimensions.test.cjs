const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const M = require('../src/core.js');
const D = require('../src/dimensions.js');
const F = require('../src/formats.js');
const O = require('../src/office.js');
const Zip = require('../assets/jszip.min.js');
const E = require('../src/examples.js');
const business = () => M.validate(E.business);
const view = perspective => ({ focus:null, expanded:[], perspective, positions:{}, showExternal:true, relationshipTypeIds:null });

test('business model preserves all dimensions in JSON and YAML without mutation', () => {
  const m = business(), before = JSON.stringify(m);
  assert.deepEqual(M.parse(before),m); assert.deepEqual(F.parse(F.dump(m),'yaml'),m);
  for (const v of m.namedViews) M.projectView(m,v);
  assert.equal(JSON.stringify(m),before);
});
test('legacy models default to component-only solution views', () => {
  const m = M.validate(E.platform);
  assert.deepEqual(M.projectView(m,view('solution')).nodes.map(n=>n.id),M.project(m,null,[]).nodes.map(n=>n.id));
  assert.ok(M.projectView(business(),view('solution')).nodes.every(n=>D.kind(n)==='component'));
});
test('layer view flattens containment without changing it and places multi-layer components once', () => {
  const m = business(), before = JSON.stringify(m), v = view('layers'), p = M.projectView(m,v), layout = M.layoutView(m,p,v);
  assert.equal(p.nodes.length,m.nodes.filter(n=>D.kind(n)==='component').length);
  assert.ok(p.nodes.every(n=>n.parentVisible==null));
  assert.equal(layout.nodes.filter(n=>n.id==='function').length,1);
  assert.equal(layout.bands.length,5); assert.equal(JSON.stringify(m),before);
  const filtered = {...v,layerIds:['business-logic']}, p2=M.projectView(m,filtered), l2=M.layoutView(m,p2,filtered);
  assert.ok(p2.nodes.some(n=>n.id==='function')); assert.equal(l2.bands.length,1); assert.equal(l2.bands[0].id,'business-logic');
});
test('unassigned layer filter and empty perspective work without dangling edges', () => {
  const m=business(),v={...view('layers'),layerIds:[]}; assert.equal(M.projectView(m,v).nodes.length,0);
  assert.equal(M.layoutView(m,M.projectView(m,v),v).nodes.length,0);
  m.nodes.find(n=>n.id==='function').layerIds=[];
  assert.deepEqual(M.projectView(m,v).nodes.map(n=>n.id),['function']);
});
test('process view shows steps and exact supporting components as context', () => {
  const m=business(),v={...view('process'),processId:'case-process',expanded:['case-process','approvals']},p=M.projectView(m,v);
  assert.ok(p.nodes.some(n=>n.id==='submit-step')); assert.ok(p.nodes.some(n=>n.id==='approvals'&&n.external&&!n.expanded));
  assert.ok(p.edges.flatMap(e=>e.edges).some(e=>e.source==='approvals'&&e.target==='review-step'));
  const hidden=M.projectView(m,{...v,showExternal:false}); assert.ok(hidden.nodes.every(n=>D.kind(n)==='process'));
});
test('process-scoped traceability includes only relevant stakeholders and support mappings', () => {
  const m=business(),p=M.projectView(m,{...view('traceability'),processId:'review-step'});
  assert.deepEqual(p.nodes.map(n=>n.id).sort(),['review-step','caseworker','service-owner','caseapp','approvals','cases'].sort());
  assert.ok(p.edges.flatMap(e=>e.edges).some(e=>e.role==='A'));
  const roles=D.mappings(m,'review-step').filter(r=>r.semantic==='participation').map(r=>r.edge.role).sort(); assert.deepEqual(roles,['A','R']);
});
test('stakeholder perspective excludes technical components and retains RACI assignments', () => {
  const p=M.projectView(business(),{...view('stakeholder'),expanded:['case-process']});
  assert.ok(p.nodes.every(n=>D.kind(n)!=='component')); assert.ok(p.edges.flatMap(e=>e.edges).some(e=>e.role==='I'));
});
test('invalid layer, kind, semantic endpoints and role references are rejected', () => {
  for (const mutate of [m=>m.nodes[0].kind='other',m=>m.nodes[0].kind=null,m=>m.nodes[0].layerIds=['missing'],m=>m.nodes[0].layerIds=['foundation','foundation'],m=>m.layers[0].color='red',m=>m.nodes.find(n=>n.kind==='process').layerIds=['presentation'],m=>m.namedViews[4].perspective='unknown',m=>m.namedViews[4].processId='pp',m=>m.namedViews[4].layerIds=['missing'],m=>m.edges.find(e=>e.role==='R').role='X',m=>m.edges.find(e=>e.role==='R').source='caseapp',m=>m.relationshipTypes.find(t=>t.semantic==='supports').semantic='unknown']) { const m=business(); mutate(m); assert.throws(()=>M.validate(m)); }
});
test('deleting a process repairs view scope, incident links and positions', () => {
  const m=M.removeNode(business(),'review-step'); M.validate(m);
  assert.equal(m.namedViews.find(v=>v.id==='business-traceability').processId,null);
  assert.ok(!m.edges.some(e=>e.source==='review-step'||e.target==='review-step'));
});
test('deleting a layer detaches memberships but retains components and named views', () => {
  const m=business(); m.namedViews.find(v=>v.perspective==='layers').layerIds=['integration'];
  const next=D.removeLayer(m,'integration'); M.validate(next);
  assert.equal(next.nodes.length,m.nodes.length); assert.deepEqual(next.nodes.find(n=>n.id==='function').layerIds,['business-logic']);
  assert.equal(next.namedViews.find(v=>v.perspective==='layers').layerIds,null); assert.equal(m.layers.length,5);
});
test('business Office packs preserve perspectives, editable layer bands and exact RACI roles', async () => {
  const m=business(),views=m.namedViews.filter(v=>v.perspective),before=JSON.stringify(m),z=await Zip.loadAsync(await O.pptx(m,views));
  assert.ok((await z.file('ppt/slides/slide3.xml').async('string')).includes('name="layer-presentation"'));
  const notes=await z.file('ppt/notesSlides/notesSlide4.xml').async('string');
  assert.ok(notes.includes('Accountable (A)')); assert.ok(notes.includes('Caseworker')); assert.ok(notes.includes('Perspective: traceability'));
  const png=fs.readFileSync(require('node:path').join(__dirname,'../assets/icons/dataverse.png')).toString('base64');
  const doc=await Zip.loadAsync(await O.docx(m,views,{rasterize:async()=>png})),xml=await doc.file('word/document.xml').async('string');
  for(const text of ['Accountable (A)','Responsible (R)','Presentation','User interfaces and channels','Layers (primary first)','Stakeholder responsibilities']) assert.ok(xml.includes(text),text);
  assert.ok((await doc.file('word/media/view3.svg').async('string')).includes('Platform and identity'));
  assert.equal(JSON.stringify(m),before);
});
