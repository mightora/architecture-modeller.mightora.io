import type { Model, ValidationIssue, Severity, Component } from '../schema/types';
export const rules = [
  ['owner','Application ownership','warning','Document the business owner.'],
  ['criticality','Criticality','warning','Set Criticality for important systems.'],
  ['classification','Data classification','warning','Document Classification for data and sensitive components.'],
  ['authentication','External integration authentication','error','Record Authentication on the integration.'],
  ['support','Production support','warning','Record Support owner for production components.'],
  ['decision','Architecture decisions','information','Link an ADR to critical components.'],
  ['process-support','Business process support','warning','Map at least one supporting component to this process.'],
  ['references','Entity references','error','Repair or remove the invalid reference.'],
  ['dependency-policy','Prohibited dependencies','error','Review the prohibited dependency or update the policy.'],
  ['technology','Approved technology','warning','Use an approved technology or agree a policy exception.']
] as const;
export function property(n: Component, field: string): string {
  const pair = Object.entries({...n.properties,...n.documentation}).find(([key])=>key.toLowerCase()===field.toLowerCase()); return pair?.[1]?.trim() || '';
}
export function validateArchitecture(model: Model): ValidationIssue[] {
  const results: ValidationIssue[] = [], nodes = new Map(model.nodes.map(n=>[n.id,n])), types = new Map(model.types.map(t=>[t.id,t])), rels = new Map(model.relationshipTypes.map(t=>[t.id,t]));
  const add = (rule: string, entityId: string, message: string): void => {
    const def = rules.find(r=>r[0]===rule); if (!def || model.policy?.rules?.[rule]?.enabled === false) return;
    results.push({rule,entityId,message,severity:model.policy?.rules?.[rule]?.severity || def[2] as Severity,remediation:def[3]});
  };
  const supported = new Set(model.edges.filter(e=>rels.get(e.typeId)?.semantic==='supports').map(e=>e.target));
  const seen = new Set<string>();
  for (const n of model.nodes) {
    if (seen.has(n.id)) add('references',n.id,'Duplicate component ID.'); seen.add(n.id);
    const type = types.get(n.typeId), criticality=property(n,'Criticality'), important=/critical|high|tier.?1/i.test(criticality), cls=property(n,'Classification');
    if (!type || (n.parentId && !nodes.has(n.parentId))) add('references',n.id,'Unknown type or deleted parent.');
    if ((n.kind||'component') === 'component') {
      if (!property(n,'Owner') && /application|app|system|platform/i.test((type?.name||'')+' '+n.typeId)) add('owner',n.id,`${n.name} has no documented owner.`);
      if (!criticality && /system|platform/i.test(type?.name||'')) add('criticality',n.id,`${n.name} has no criticality rating.`);
      if (!cls && (/data|database|store/i.test(type?.name||'') || /sensitive|personal|secret/i.test(property(n,'Data')))) add('classification',n.id,`${n.name} has no data classification.`);
      if (/prod/i.test(property(n,'Environment')) && !property(n,'Support owner')) add('support',n.id,`${n.name} has no production support owner.`);
      if (important && !(n.decisionIds?.length || model.decisions?.some(d=>d.componentIds.includes(n.id)))) add('decision',n.id,`${n.name} has no linked architecture decision.`);
      const tech=property(n,'Technology'); if (tech && model.policy?.approvedTechnologies?.length && !model.policy.approvedTechnologies.some(t=>t.toLowerCase()===tech.toLowerCase())) add('technology',n.id,`${tech} is outside the approved technology catalogue.`);
    }
    if (n.kind==='process' && (important || !criticality) && !supported.has(n.id)) add('process-support',n.id,`${n.name} has no explicitly supporting system.`);
    for (const id of n.decisionIds||[]) if (!model.decisions?.some(d=>d.id===id)) add('references',n.id,'Unknown linked ADR.');
  }
  const edgeIds = new Set<string>();
  for (const e of model.edges) {
    if (edgeIds.has(e.id) || !nodes.has(e.source)||!nodes.has(e.target)||!rels.has(e.typeId)) add('references',e.id,'Duplicate integration ID, missing endpoint or relationship type.'); edgeIds.add(e.id);
    const source=nodes.get(e.source),target=nodes.get(e.target);
    if (!source||!target) continue;
    const props={...source.properties,...source.documentation,...target.properties,...target.documentation,...e.documentation};
    const external = /external/i.test(property(source,'Boundary')+' '+property(target,'Boundary')) || Object.entries(e.documentation||{}).some(([k,v])=>k.toLowerCase()==='external'&&/true|yes/i.test(v));
    if (external && !Object.entries(props).some(([k,v])=>k.toLowerCase()==='authentication'&&v.trim())) add('authentication',e.id,`${source.name} to ${target.name} crosses an external boundary without authentication.`);
    if (model.policy?.prohibitedDependencies?.some(p=>source.typeId===p.sourceType&&target.typeId===p.targetType)) add('dependency-policy',e.id,`${source.name} to ${target.name} violates the configured dependency policy.`);
  }
  return results;
}
