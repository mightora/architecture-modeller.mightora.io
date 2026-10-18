/* Exercise the exact browser exporter under Node with a rasterization adapter for QA. */
const fs = require('node:fs');
const path = require('node:path');
const M = require('../src/core.js');
const F = require('../src/formats.js');
globalThis.ModellerIconLicenseText = fs.readFileSync(path.join(__dirname, '../assets/LUCIDE-LICENSE.txt'), 'utf8');
globalThis.ModellerIcons = Object.fromEntries(require('../assets/icon-catalog.json').map(icon => [icon.id, { ...icon, svg: 'data:image/svg+xml;base64,' + fs.readFileSync(path.join(__dirname, '../assets/icons/' + icon.id + '.svg')).toString('base64'), png: 'data:image/png;base64,' + fs.readFileSync(path.join(__dirname, '../assets/icons/' + icon.id + '.png')).toString('base64') }]));
const O = require('../src/office.js');
const E = process.argv[3] === 'first' ? require('../src/guidance.js').example(M,require('../src/dimensions.js')) : require('../src/examples.js').business;
const out = process.argv[2];
if (!out || !path.isAbsolute(out)) throw new Error('Supply an absolute QA output directory.');
fs.mkdirSync(out, { recursive: true });
const sharp = require(path.join(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES, 'sharp'));
(async () => {
  const views = process.argv[3] === 'first' ? [E.namedViews[0],E.namedViews[1],E.namedViews[5]] : E.namedViews.filter(v => v.perspective);
  fs.writeFileSync(path.join(out, 'architecture-views.pptx'), await O.pptx(E, views));
  fs.writeFileSync(path.join(out, 'architecture-views.docx'), await O.docx(E, views, { tables: false, rasterize: async svg => (await sharp(Buffer.from(svg)).resize({ width: 1800 }).png().toBuffer()).toString('base64') }));
  fs.writeFileSync(path.join(out, 'architecture-report.docx'), await O.docx(E, views.slice(2), { rasterize: async svg => (await sharp(Buffer.from(svg)).resize({ width: 1800 }).png().toBuffer()).toString('base64') }));
  fs.writeFileSync(path.join(out, 'architecture-model.yaml'), F.dump(E));
  for (let i = 0; i < views.length; i++) fs.writeFileSync(path.join(out, 'view-' + (i + 1) + '.svg'), O.svg(O.scene(E, views[i])));
  console.log('Created Office QA fixtures using production export logic.');
})().catch(e => { console.error(e); process.exitCode = 1; });
