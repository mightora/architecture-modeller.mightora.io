import type { Model, Comparison, Change, Decision, Component } from '../schema/types';
import { canonical } from '../schema';
import { property } from '../validation';
export function uid(prefix='n'): string { return prefix+'_'+(globalThis.crypto?.randomUUID?.() || Date.now().toString(36)+'_'+Math.random().toString(36).slice(2)); }
export function impact(model: Model, componentId: string): { components: string[]; processes: string[]; stakeholders: string[] } {
  const adjacency=new Map<string,Set<string>>();
  for (const e of model.edges) { for (const [a,b] of [[e.source,e.target],[e.target,e.source]] as [string,string][]) { if(!adjacency.has(a)) adjacency.set(a,new Set()); adjacency.get(a)!.add(b); } }
  const reached=new Set([componentId]),queue=[componentId];
  for(let i=0;i<queue.length;i++) for(const next of adjacency.get(queue[i]!)||[]) if(!reached.has(next)) { reached.add(next);queue.push(next); }
  const group=(kind:string):string[]=>model.nodes.filter(n=>reached.has(n.id)&&(n.kind||'component')===kind).map(n=>n.id);
  return {components:group('component'),processes:group('process'),stakeholders:group('stakeholder')};
}
const serial=(v:unknown):string=>JSON.stringify(v,(_k,x)=>x&&typeof x==='object'&&!Array.isArray(x)?Object.fromEntries(Object.entries(x).sort(([a],[b])=>a.localeCompare(b))):x);
export function compareModels(before: Model, after: Model): Comparison {
  const changes:Change[]=[],affected=new Set<string>();
  const scan=(collection:string,a: {id:string}[],b:{id:string}[]):void=>{
    const prev=new Map(a.map(x=>[x.id,x])),next=new Map(b.map(x=>[x.id,x]));
    for(const id of new Set([...prev.keys(),...next.keys()])) {
      const old=prev.get(id) as (Record<string,unknown>&{id:string})|undefined,now=next.get(id) as (Record<string,unknown>&{id:string})|undefined;
      if(serial(old)===serial(now)) continue;
      const fields=Object.keys({...old,...now}).filter(k=>serial(old?.[k])!==serial(now?.[k]));
      const policy=after.policy?.breaking;
      changes.push({collection,id,name:String(now?.name||old?.name||now?.title||old?.title||id),kind:!old?'added':!now?'removed':'modified',fields,breaking:(!now&&!!policy?.removals)||(collection==='components'&&!!old&&!!now&&((!!policy?.technologyChanges&&property(old as unknown as Component,'Technology')!==property(now as unknown as Component,'Technology'))||(!!policy?.classificationChanges&&property(old as unknown as Component,'Classification')!==property(now as unknown as Component,'Classification'))))});
      if(collection==='components') affected.add(id);
      if(collection==='relationships') for(const item of [old,now]) { if(item?.source) affected.add(String(item.source));if(item?.target) affected.add(String(item.target)); }
    }
  };
  scan('components',before.nodes,after.nodes);scan('relationships',before.edges,after.edges);scan('decisions',before.decisions||[],after.decisions||[]);
  scan('componentTypes',before.types,after.types);scan('relationshipTypes',before.relationshipTypes,after.relationshipTypes);scan('layers',before.layers||[],after.layers||[]);
  const semanticView=(m:Model)=>(m.namedViews||[]).map(({positions:_p,camera:_c,routes:_r,expanded:_x,routing:_rt,swimlanes:_sw,...v})=>({...v,id:v.id!}));
  scan('views',semanticView(before),semanticView(after));
  const {views:_bv,namedViews:_bn,nodes:_bno,edges:_be,types:_bt,relationshipTypes:_br,decisions:_bd,layers:_bl,schemaVersion:_bs,...bMeta}=before;
  const {views:_av,namedViews:_an,nodes:_ano,edges:_ae,types:_at,relationshipTypes:_ar,decisions:_ad,layers:_al,schemaVersion:_as,...aMeta}=after;
  if(serial(bMeta)!==serial(aMeta)) changes.push({collection:'model',id:after.id||'model',name:after.name,kind:'modified',fields:Object.keys({...bMeta,...aMeta}).filter(k=>serial((bMeta as Record<string,unknown>)[k])!==serial((aMeta as Record<string,unknown>)[k])),breaking:false});
  const processes=new Set<string>(),stakeholders=new Set<string>();
  for(const id of affected) for(const model of [before,after]) { const result=impact(model,id);result.processes.forEach(p=>processes.add(p));result.stakeholders.forEach(s=>stakeholders.add(s)); }
  return {changes,layoutOnly:changes.length===0&&canonical(before)!==canonical(after),affectedProcesses:[...processes],affectedStakeholders:[...stakeholders]};
}
export function decisionMarkdown(d: Decision): string {
  return `# ${d.id} ${d.title}\n\nStatus: ${d.status}\n\nDate: ${d.date}\n\n## Context\n\n${d.context}\n\n## Decision\n\n${d.decision}\n\n## Alternatives\n\n${d.alternatives}\n\n## Consequences\n\n${d.consequences}\n\n## Related components\n\n${d.componentIds.map(id=>'- '+id).join('\n')}\n`;
}
export function duplicate(model: Model, selected: string[], parentId: string|null, makeId=uid): Model {
  const next=JSON.parse(JSON.stringify(model)) as Model,ids=new Set(selected);
  let added=true;while(added){added=false;for(const n of model.nodes)if(n.parentId&&ids.has(n.parentId)&&!ids.has(n.id)){ids.add(n.id);added=true;}}
  const mapping=new Map([...ids].map(id=>[id,makeId('n')]));
  for(const n of model.nodes.filter(n=>ids.has(n.id))) next.nodes.push({...JSON.parse(JSON.stringify(n)) as Component,id:mapping.get(n.id)!,name:n.name+' copy',parentId:n.parentId&&mapping.has(n.parentId)?mapping.get(n.parentId)!:parentId});
  for(const e of model.edges.filter(e=>ids.has(e.source)&&ids.has(e.target))) next.edges.push({...e,id:makeId('e'),source:mapping.get(e.source)!,target:mapping.get(e.target)!});
  return next;
}
