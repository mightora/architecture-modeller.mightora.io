/* Portable text formats. js-yaml JSON schema deliberately excludes executable tags. */
(function(root) {
  'use strict';
  const M = typeof module !== 'undefined' && module.exports ? require('./core.js') : root.Modeller;
  const yaml = typeof module !== 'undefined' && module.exports ? require('../assets/js-yaml.min.js') : root.jsyaml;
  function guard(value) {
    let visits = 0, chars = 0; const stack = new Set();
    function walk(v, depth) {
      if (++visits > 100000 || depth > 100) throw new Error('YAML is too deeply nested or contains too many aliases.');
      if (typeof v === 'string') { chars += v.length; if (chars > M.LIMITS.bytes) throw new Error('Expanded model exceeds 5 MB.'); }
      if (!v || typeof v !== 'object') return;
      if (stack.has(v)) throw new Error('Cyclic YAML aliases are not supported.'); stack.add(v);
      for (const [key, child] of Object.entries(v)) { if (['__proto__', 'constructor', 'prototype'].includes(key)) throw new Error('Reserved YAML property name.'); walk(child, depth + 1); }
      stack.delete(v);
    }
    walk(value, 0);
    if (new TextEncoder().encode(JSON.stringify(value)).length > M.LIMITS.bytes) throw new Error('Expanded model exceeds 5 MB.');
    return value;
  }
  function parse(text, extension = 'json') {
    if (new TextEncoder().encode(text).length > M.LIMITS.bytes) throw new Error('Import a model smaller than 5 MB.');
    if (['yaml', 'yml', 'txt'].includes(extension.toLowerCase())) return M.validate(guard(yaml.load(text, { schema: yaml.JSON_SCHEMA })));
    return M.parse(text);
  }
  function dump(model) { return '# Mightora Architecture Modeller — portable model\n' + yaml.dump(M.validate(model), { schema: yaml.JSON_SCHEMA, noRefs: true, lineWidth: 100, quotingType: '"' }); }
  const api = { parse, dump };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.ModellerFormats = api;
})(globalThis);
