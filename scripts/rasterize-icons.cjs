/* Build-time conversion; only generated PNGs, no runtime image dependency. */
const fs=require('node:fs'),path=require('node:path');
const sharp=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES ? path.join(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES,'sharp') : 'sharp');
const root=path.join(__dirname,'..'),catalog=require('../assets/icon-catalog.json');
Promise.all(catalog.map(async icon=>{
  await sharp(path.join(root,'assets/icons',icon.id+'.svg')).resize(96,96,{fit:'contain',background:{r:255,g:255,b:255,alpha:0}}).png().toFile(path.join(root,'assets/icons',icon.id+'.png'));
})).then(()=>console.log('Created proportion-preserving PNG fallbacks for '+catalog.length+' icons.')).catch(error=>{console.error(error);process.exitCode=1;});
