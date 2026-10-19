import {readdir,readFile} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
const files=(await readdir('src')).filter(f=>f.endsWith('.js'));for(const file of files){const run=spawnSync(process.execPath,['--check','src/'+file],{stdio:'inherit'});if(run.status)process.exit(run.status);const text=await readFile('src/'+file,'utf8');if(/\beval\s*\(|new\s+Function\s*\(/.test(text))throw Error('Dynamic code execution in '+file);}
console.log('JavaScript syntax and dynamic-code lint passed; strict TypeScript is checked separately.');
