import {build} from 'esbuild';
import {mkdir} from 'node:fs/promises';
await mkdir('.generated',{recursive:true});
await build({entryPoints:['packages/index.ts'],bundle:true,platform:'browser',format:'iife',globalName:'ModellerPlatform',target:'es2022',outfile:'.generated/platform.js'});
await build({entryPoints:['packages/index.ts'],bundle:true,platform:'neutral',format:'cjs',target:'es2022',outfile:'.generated/platform.cjs'});
await build({entryPoints:['vscode-extension/src/extension.ts'],bundle:true,platform:'browser',format:'cjs',target:'es2022',external:['vscode'],outfile:'vscode-extension/extension.js'});
