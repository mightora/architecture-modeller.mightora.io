import path from 'node:path';
import fs from 'node:fs/promises';
import {build} from 'esbuild';
import {open} from '@vscode/test-web';
import {chromium} from 'playwright';
const root=process.cwd();
await fs.mkdir('artifacts/vscode-workspace',{recursive:true});
await fs.mkdir('vscode-extension/test',{recursive:true});
await build({entryPoints:['tests/vscode-web-suite.cjs'],bundle:true,platform:'browser',format:'cjs',external:['vscode'],outfile:'vscode-extension/test/web-suite.js'});
const server=await open({quality:'stable',browserType:'none',extensionDevelopmentPath:path.join(root,'vscode-extension'),extensionTestsPath:path.join(root,'vscode-extension/test/web-suite.js'),folderPath:path.join(root,'artifacts/vscode-workspace'),host:'localhost',port:3023});
let browser;
try{
  browser=await chromium.launch({headless:true,executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH||undefined,args:['--no-sandbox','--disable-gpu','--disable-dev-shm-usage']});
  const page=await browser.newPage({viewport:{width:1500,height:1000}});const logs=[];let finished,finish;const result=new Promise(resolve=>finish=resolve);
  await page.exposeFunction('codeAutomationLog',(type,args)=>{const line=args.join(' ');logs.push(line);if(/MIGHTORA_|Error|error/.test(line))console.log(line);});
  await page.exposeFunction('codeAutomationExit',code=>{finished=code;finish(code);});
  page.on('pageerror',error=>console.log('Browser error:',error.stack));page.on('console',msg=>{if(msg.type()==='error')console.log('BROWSER_CONSOLE',msg.text().slice(0,700));});
  await page.goto('http://localhost:3023');
  let frame;const started=Date.now();while(Date.now()-started<60000){for(const f of page.frames())if(await f.locator('#export-word').count()){frame=f;break;}if(frame)break;await page.waitForTimeout(250);}
  if(!frame||!await frame.locator('#export-word').count()){await page.screenshot({path:'artifacts/vscode-no-editor.png'});console.log((await page.locator('body').innerText()).slice(0,8000));console.log(page.frames().map(f=>f.url()));for(const f of page.frames())console.log('FRAME',f.url(),(await f.locator('body').innerText().catch(()=>'' )).slice(0,2500));throw Error('VS Code webview did not open.');}
  await frame.waitForFunction(()=>document.getElementById('rename-model')?.textContent==='VSCode acceptance model');
  for(const id of ['#export-word','#export-powerpoint']){
    await frame.locator(id).click();
    await page.getByRole('button',{name:/Save export|^Save$|^OK$/}).last().click({timeout:30000});
    await frame.locator('#export-status').filter({hasText:'Export saved'}).waitFor({timeout:30000}).catch(()=>{});
  }
  let timer;const code=await Promise.race([result,new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error('Web extension test timed out.')),60000);})]);clearTimeout(timer);
  await page.screenshot({path:'artifacts/vscode-web-verified.png'});
  await fs.writeFile('artifacts/vscode-web-results.json',JSON.stringify({passed:code===0,host:'VS Code stable browser extension host',logs},null,2));
  if(code!==0)throw Error('VS Code Web suite failed: '+code);
  console.log('Verified actual VS Code Web custom editor and local Office exports.');
}catch(error){const page=browser?.contexts()[0]?.pages()[0];if(page){await page.screenshot({path:'artifacts/vscode-failure.png'});console.log('VS CODE STATE',(await page.locator('body').innerText()).slice(-6000));for(const f of page.frames())if(await f.locator('#export-status').count())console.log('EXPORT STATE',await f.locator('#export-status').innerText());}throw error;}finally{await browser?.close();server.dispose();}
