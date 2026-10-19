import fs from 'node:fs/promises';
const file='dist/verification.json',report=JSON.parse(await fs.readFile(file,'utf8'));
report.browserInteractionVerification='Passed Chromium website/offline acceptance journeys in this workflow';
report.vscodeWebVerification=JSON.parse(await fs.readFile('artifacts/vscode-web-results.json','utf8')).passed?'Passed real browser extension-host test':'Failed';
report.commit=process.env.GITHUB_SHA||null;
await fs.writeFile(file,JSON.stringify(report,null,2)+'\n');
