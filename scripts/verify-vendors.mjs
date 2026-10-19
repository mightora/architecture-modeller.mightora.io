import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
const entries=JSON.parse(await fs.readFile('assets/vendor-lock.json','utf8'));
for(const entry of entries){
 const pkg=JSON.parse(await fs.readFile('node_modules/'+entry.package+'/package.json','utf8'));
 if(pkg.version!==entry.version)throw Error('Vendor version mismatch for '+entry.package);
 const shipped=await fs.readFile(entry.file),installed=await fs.readFile('node_modules/'+entry.package+'/'+entry.packageFile),digest=createHash('sha256').update(shipped).digest('hex');
 if(digest!==entry.sha256||!shipped.equals(installed))throw Error('Vendored bytes do not match the audited package: '+entry.file);
}
console.log('Verified bundled YAML, ZIP and PowerPoint library versions and hashes against audited packages.');
