import type { Position } from '../schema/types';
export const snap=(value:number,enabled=true):number=>enabled?Math.round(value/20)*20:value;
export function align(positions: Record<string,Position>, ids:string[], mode:'left'|'top'|'horizontal'|'vertical'):Record<string,Position>{
  const next=JSON.parse(JSON.stringify(positions)) as Record<string,Position>,items=ids.filter(id=>next[id]);if(items.length<2)return next;
  const axis=mode==='left'||mode==='horizontal'?'x':'y',sorted=items.sort((a,b)=>next[a]![axis]-next[b]![axis]),first=next[sorted[0]!]![axis],last=next[sorted.at(-1)!]![axis];
  sorted.forEach((id,i)=>{next[id]![axis]=mode==='left'||mode==='top'?first:first+(last-first)*i/(sorted.length-1);});return next;
}
export function orthogonal(a:Position,b:Position,via?:Position[]):Position[]{ return via?.length?[a,...via,b]:[a,{x:(a.x+b.x)/2,y:a.y},{x:(a.x+b.x)/2,y:b.y},b]; }
