#!/usr/bin/env node
'use strict';
const fs=require('node:fs'),path=require('node:path');
const M=require('../../src/core.js'),F=require('../../src/formats.js'),P=require('../../.generated/platform.cjs');
const args=process.argv.slice(2),command=args.shift(),files=args.filter(a=>!a.startsWith('--'));
function read(file){const stat=fs.statSync(file);if(stat.size>M.LIMITS.bytes)throw Error('Import a model smaller than 5 MB.');return F.parse(fs.readFileSync(file,'utf8'),path.extname(file).slice(1));}
try{
  if(!['validate','diff'].includes(command)||!files.length)throw Error('Usage: node tools/cli/architecture.cjs validate model.archmodel.json [--json] [--sarif] | diff before.json after.json [--json]');
  if(command==='validate'){
    const model=read(files[0]),issues=P.validateArchitecture(model),errors=issues.filter(i=>i.severity==='error');
    if(args.includes('--sarif'))process.stdout.write(JSON.stringify({version:'2.1.0',$schema:'https://json.schemastore.org/sarif-2.1.0.json',runs:[{tool:{driver:{name:'Mightora Architecture Modeller',rules:P.rules.map(([id,name])=>({id,shortDescription:{text:name}}))}},results:issues.map(i=>({ruleId:i.rule,level:{error:'error',warning:'warning',information:'note'}[i.severity],message:{text:i.message+' '+i.remediation},locations:[{physicalLocation:{artifactLocation:{uri:files[0]}},logicalLocations:[{name:i.entityId}]}]}))}]},null,2)+'\n');
    else if(args.includes('--json'))process.stdout.write(JSON.stringify({schemaValid:true,model:model.name,issues,errorCount:errors.length},null,2)+'\n');
    else{console.log(model.name+': schema valid, '+issues.length+' findings, '+errors.length+' errors');for(const i of issues)console.log(i.severity.toUpperCase()+' '+i.rule+' ['+i.entityId+'] '+i.message+' '+i.remediation);}
    process.exitCode=errors.length?1:0;
  }else{
    if(files.length<2)throw Error('Choose before and after model files.');const report=P.compareModels(read(files[0]),read(files[1]));
    console.log(args.includes('--json')?JSON.stringify(report,null,2):report.layoutOnly?'Layout changes only.':report.changes.map(c=>c.kind+' '+c.collection+' '+c.name+' ['+c.fields.join(', ')+']'+(c.breaking?' BREAKING':'')).join('\n')||'No semantic changes.');process.exitCode=report.changes.some(c=>c.breaking)?1:0;
  }
}catch(error){console.error(args.includes('--json')?JSON.stringify({schemaValid:false,error:error.message}):'Architecture validation failed: '+error.message);process.exitCode=2;}
