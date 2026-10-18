const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const M=require('../src/core.js'),D=require('../src/dimensions.js'),G=require('../src/guidance.js'),F=require('../src/formats.js'),catalog=require('../assets/icon-catalog.json'),Zip=require('../assets/jszip.min.js');
globalThis.ModellerIcons=Object.fromEntries(catalog.map(i=>[i.id,{...i,svg:'data:image/svg+xml;base64,'+fs.readFileSync(path.join(__dirname,'../assets/icons',i.id+'.svg')).toString('base64'),png:'data:image/png;base64,'+fs.readFileSync(path.join(__dirname,'../assets/icons',i.id+'.png')).toString('base64')}]));
const O=require('../src/office.js');
test('first-model example is portable, has multi-dimension views and meets walkthrough goals',()=>{
  const m=G.example(M,D);assert.equal(G.steps.length,8);assert.deepEqual(G.progress(m),Array(8).fill(true));assert.deepEqual(F.parse(F.dump(m),'yaml'),m);
  for(const v of m.namedViews) {const p=M.projectView(m,v);assert.ok(p.nodes.length>0);const drawn=new Set(p.nodes.map(n=>n.id));assert.ok(p.edges.every(e=>drawn.has(e.source)&&drawn.has(e.target)));}
  assert.deepEqual(G.progress(M.empty()),Array(8).fill(false));
});
test('review prompts identify missing context without inferring step accountability from a parent',()=>{
  const m=G.example(M,D),before=JSON.stringify(m);G.review(m);assert.equal(JSON.stringify(m),before);
  m.description='';m.nodes.find(n=>n.id==='portal').properties.Owner='';m.edges=m.edges.filter(e=>e.id!=='owner-review'&&e.id!=='support-review'&&e.id!=='support-records');
  const participation=m.relationshipTypes.find(t=>t.semantic==='participation').id;
  m.edges.push({id:'parent-a',source:'owner',target:'handling',typeId:participation,role:'A',label:'',description:''});
  const issues=G.review(m).issues;assert.ok(issues.some(i=>i.code==='purpose'));assert.ok(issues.some(i=>i.code==='owner'&&i.nodeId==='portal'));assert.ok(issues.some(i=>i.code==='accountable'&&i.nodeId==='review'));assert.ok(issues.some(i=>i.code==='support'&&i.nodeId==='review'));
});
test('review detects ambiguous sibling names but allows same names under different parents',()=>{
  const m=G.example(M,D),original=m.nodes.find(n=>n.id==='portal');m.nodes.push({...M.copy(original),id:'duplicate'});assert.ok(G.review(m).issues.some(i=>i.code==='duplicate'&&i.nodeId==='duplicate'));
  m.nodes.find(n=>n.id==='duplicate').parentId=null;assert.ok(!G.review(m).issues.some(i=>i.code==='duplicate'));
});
test('curated catalog retains legacy IDs, matches SVG provenance hashes and embeds real PNG fallbacks',()=>{
  assert.equal(catalog.length,44);assert.equal(new Set(catalog.map(i=>i.id)).size,catalog.length);
  for(const id of ['power-apps','power-automate','dataverse','power-pages','power-bi'])assert.ok(M.ICON_IDS.includes(id));
  for(const i of catalog) {const svg=fs.readFileSync(path.join(__dirname,'../assets/icons',i.id+'.svg')),png=fs.readFileSync(path.join(__dirname,'../assets/icons',i.id+'.png'));assert.equal(crypto.createHash('sha256').update(svg).digest('hex'),i.sha256);assert.equal(png.subarray(1,4).toString(),'PNG');assert.match(i.termsUrl,/^https:/);assert.match(i.sourceUrl,/^https:/);assert.ok(!/<(?:script|foreignObject)\b|\bon\w+=/i.test(svg.toString()));}
});
test('new icon IDs round-trip and arbitrary external icon URLs are rejected',()=>{
  const m=G.example(M,D);for(const id of ['aws-s3','azure-functions','generic-server','copilot-studio']){m.nodes[0].iconId=id;assert.equal(M.parse(JSON.stringify(m)).nodes[0].iconId,id);}
  m.nodes[0].iconId='https://invalid.example/tracker.svg';assert.throws(()=>M.validate(m),/icon/);m.nodes[0].iconId='';m.description=7;assert.throws(()=>M.validate(m),/question/);
});
test('Office exports carry AWS, Azure, Lucide and Power Platform attribution and product images',async()=>{
  const m=G.example(M,D),view=m.namedViews.find(v=>v.id==='overview'),credits=O.attribution(m,O.scene(m,view).nodes).join('\n');
  for(const text of ['AWS','Microsoft Azure','Lucide','ISC License','Cole Bemis'])assert.ok(credits.includes(text),text);
  const ppt=await Zip.loadAsync(await O.pptx(m,[view]));const notes=await ppt.file('ppt/notesSlides/notesSlide1.xml').async('string');assert.ok(notes.includes('AWS'));assert.ok(notes.includes('ISC License'));assert.ok(notes.includes('approved record'));
  const doc=await Zip.loadAsync(await O.docx(m,[view],{tables:false,rasterize:async()=>fs.readFileSync(path.join(__dirname,'../assets/icons/aws-s3.png')).toString('base64')}));const xml=await doc.file('word/document.xml').async('string');assert.ok(xml.includes('AWS'));assert.ok(xml.includes('Lucide'));assert.ok(xml.includes('approved record'));
});
