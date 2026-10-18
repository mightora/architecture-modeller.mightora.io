const yaml = require('../assets/js-yaml.min.js');
const fs = require('node:fs');
const text = fs.readFileSync(0, 'utf8');
const data = yaml.load(text, { schema: yaml.JSON_SCHEMA });
if (!data || !Array.isArray(data.sections) || !data.sections.length || !Array.isArray(data.brands)) throw new Error('Shared footer needs sections and brands.');
const url = value => { if (typeof value !== 'string' || !/^https:\/\//.test(value)) throw new Error('Footer links must use HTTPS.'); };
for (const s of data.sections) {
  if (typeof s.title !== 'string' || ![1,2,3].includes(s.column) || !Number.isFinite(s.position) || !Array.isArray(s.links)) throw new Error('Invalid footer section.');
  for (const link of s.links) { if (typeof link.name !== 'string') throw new Error('Invalid link name.'); url(link.url); }
}
for (const b of data.brands) { if (typeof b.name !== 'string') throw new Error('Invalid brand name.'); url(b.url); url(b.logo); }
process.stdout.write(JSON.stringify({ sections: data.sections.length, links: data.sections.reduce((n,s)=>n+s.links.length,0), brands:data.brands.length }));
