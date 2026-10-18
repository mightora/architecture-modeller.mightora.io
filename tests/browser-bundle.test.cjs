const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
test('browser globals initialize together and export PPTX without a network API', async () => {
  let requests = 0;
  const png = 'data:image/png;base64,' + fs.readFileSync(path.join(__dirname, '../assets/icons/dataverse.png')).toString('base64');
  const context = vm.createContext({ console, ModellerIcons: { dataverse: { id: 'dataverse', name: 'Dataverse', png } }, Uint8Array, ArrayBuffer, Blob, TextEncoder, TextDecoder, setTimeout, clearTimeout, btoa, atob, fetch: () => { requests++; throw new Error('Unexpected network request'); } }, { codeGeneration: { strings: false, wasm: false } });
  vm.runInContext('globalThis.window = globalThis; globalThis.self = globalThis;', context);
  context.ModellerIconCatalog = require('../assets/icon-catalog.json');
  for (const file of ['assets/js-yaml.min.js', 'assets/jszip.min.js', 'assets/pptxgen.bundle.js', 'src/core.js', 'src/dimensions.js', 'src/examples.js', 'src/formats.js', 'src/office.js']) vm.runInContext(fs.readFileSync(path.join(__dirname, '..', file), 'utf8'), context, { filename: file });
  const text = vm.runInContext('ModellerFormats.dump(ModellerExamples.platform)', context);
  assert.ok(text.includes('namedViews:'));
  const bytes = await vm.runInContext('ModellerOffice.pptx(ModellerExamples.platform, ModellerExamples.platform.namedViews.slice(0, 1))', context);
  assert.ok(bytes.byteLength > 10000); assert.equal(requests, 0);
});
