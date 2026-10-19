import fs from 'node:fs/promises';
import path from 'node:path';
import {spawn} from 'node:child_process';
import {downloadAndUnzipVSCode,resolveCliArgsFromVSCodeExecutablePath} from '@vscode/test-electron';
import {chromium} from 'playwright';
import {build} from 'esbuild';
const root=process.cwd(),workspace=path.join(root,'artifacts/desktop-workspace'),profile=path.join(root,'artifacts/desktop-profile');
await fs.mkdir(workspace,{recursive:true});await fs.mkdir(path.join(profile,'User'),{recursive:true});await fs.mkdir('vscode-extension/test',{recursive:true});
await fs.writeFile(path.join(profile,'User/settings.json'),JSON.stringify({'files.simpleDialog.enable':true,'security.workspace.trust.enabled':false,'workbench.startupEditor':'none','extensions.ignoreRecommendations':true}));
await build({entryPoints:['tests/vscode-web-suite.cjs'],bundle:true,platform:'browser',format:'cjs',external:['vscode'],outfile:'vscode-extension/test/desktop-suite.js'});
const executable=await downloadAndUnzipVSCode('stable');
const child=spawn(executable,['--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--disable-workspace-trust','--skip-welcome','--skip-release-notes','--remote-debugging-port=9237','--user-data-dir='+profile,'--extensions-dir='+path.join(root,'artifacts/desktop-extensions'),'--extensionDevelopmentPath='+path.join(root,'vscode-extension'),'--extensionTestsPath='+path.join(root,'vscode-extension/test/desktop-suite.js'),workspace],{stdio:['ignore','pipe','pipe']});
const logs=[];for(const stream of [child.stdout,child.stderr])stream.on('data',chunk=>{const text=chunk.toString();logs.push(text);if(text.includes('MIGHTORA_'))console.log(text.trim());});
let exitCode;const result=new Promise(resolve=>child.once('exit',code=>{exitCode=code;resolve(code);}));let browser,timer;
try{
  const started=Date.now();while(Date.now()-started<60000){try{browser=await chromium.connectOverCDP('http://127.0.0.1:9237');break;}catch{await new Promise(r=>setTimeout(r,200));}}
  if(!browser)throw Error('Desktop debugging endpoint did not start.');
  const context=browser.contexts()[0],page=context.pages()[0]||await context.waitForEvent('page',{timeout:60000});let frame;const frameStart=Date.now();while(Date.now()-frameStart<60000){for(const f of page.frames())if(await f.locator('#export-word').count()){frame=f;break;}if(frame)break;await page.waitForTimeout(200);}
  if(!frame)throw Error('Desktop custom editor did not load.');
  await frame.waitForFunction(()=>document.getElementById('rename-model')?.textContent==='VSCode acceptance model');
  for(const id of ['#export-word','#export-powerpoint']){await frame.locator(id).click();await page.getByRole('button',{name:/Save export|^Save$|^OK$/}).last().click({timeout:30000});if(id==='#export-word')await page.waitForTimeout(150);}
  const code=await Promise.race([result,new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error('Desktop host test timed out.')),90000);})]);clearTimeout(timer);
  await fs.writeFile('artifacts/vscode-desktop-results.json',JSON.stringify({passed:code===0,host:'VS Code Stable Desktop',logs},null,2));
  if(code!==0)throw Error('Desktop suite exited '+code);console.log('Verified actual VS Code Desktop editor, saves, diagnostics and Office exports.');
}catch(error){console.log(logs.join('').slice(-12000));await fs.writeFile('artifacts/vscode-desktop-results.json',JSON.stringify({passed:false,error:error.message,logs},null,2));throw error;}
finally{clearTimeout(timer);await browser?.close().catch(()=>{});if(exitCode===undefined)child.kill();}
