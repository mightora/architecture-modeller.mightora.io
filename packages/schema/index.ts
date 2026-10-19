import type { Model } from './types';
export * from './types';
export const SCHEMA_VERSION = 2;
export const MAX_BYTES = 5 * 1024 * 1024;
export const perspectives = ['solution','application','data','infrastructure','security','process','stakeholder','integration','deployment','custom','layers','traceability','all'] as const;
const reserved = new Set(['__proto__','constructor','prototype']);
export function invariant(value: unknown, message: string): asserts value { if (!value) throw new Error(message); }
export function safeId(value: unknown): value is string { return typeof value === 'string' && /^[A-Za-z0-9_-]{1,80}$/.test(value) && !reserved.has(value); }
export function text(value: unknown, max = 4000): asserts value is string { invariant(typeof value === 'string' && value.length <= max, `Expected text of at most ${max} characters.`); }
export function guard(input: unknown): void {
  const stack = new Set<object>(); let count = 0;
  const visit = (value: unknown, depth: number): void => {
    invariant(++count < 500000 && depth < 110, 'Model is too complex or deeply nested.');
    if (!value || typeof value !== 'object') return;
    invariant(!stack.has(value), 'Cyclic data is not supported.'); stack.add(value);
    for (const [key, child] of Object.entries(value)) { invariant(!reserved.has(key), 'Reserved model property name.'); visit(child, depth+1); }
    stack.delete(value);
  };
  visit(input,0); invariant(new TextEncoder().encode(JSON.stringify(input)).length <= MAX_BYTES, 'Import a model smaller than 5 MB.');
}
export function migrate(input: unknown): Model {
  guard(input); invariant(input && typeof input === 'object' && !Array.isArray(input), 'Expected an architecture model.');
  const version = (input as {schemaVersion?: unknown}).schemaVersion;
  invariant(version === 1 || version === 2, 'Unsupported schema version. Supported versions: 1 and 2.');
  const model = JSON.parse(JSON.stringify(input)) as Model;
  model.schemaVersion = SCHEMA_VERSION; // v1 identities, properties, links, icons and views are retained.
  return model;
}
export function safeLink(target: string): boolean {
  if (target.length > 2000 || /[\u0000-\u0020\\]/.test(target)) return false;
  if (/^https?:\/\//i.test(target)) { try { const u = new URL(target); return !!u.hostname && !u.username && !u.password; } catch { return false; } }
  return !/[:?#%]/.test(target) && !target.startsWith('/') && target.split('/').every(p => !!p && p !== '.' && p !== '..');
}
export function validateExtensions(model: Model): void {
  if (model.id !== undefined) invariant(safeId(model.id), 'Invalid model ID.');
  const ids = new Set(model.nodes.map(n=>n.id)), typeIds = new Set(model.types.map(t=>t.id));
  const records = (record: Record<string,string> | undefined, limit = 80): void => {
    if (record === undefined) return;
    invariant(record && typeof record === 'object' && !Array.isArray(record) && Object.keys(record).length <= limit, 'Invalid documentation record.');
    for (const [key,value] of Object.entries(record)) { text(key,80); text(value,12000); }
  };
  records(model.documentation); records(model.metadata,20);
  invariant(!model.decisions || (Array.isArray(model.decisions) && model.decisions.length <= 500), 'Use up to 500 decisions.');
  const decisionIds = new Set<string>();
  for (const d of model.decisions || []) {
    invariant(safeId(d.id) && !decisionIds.has(d.id), 'ADR IDs must be safe and unique.'); decisionIds.add(d.id);
    for (const key of ['title','context','decision','alternatives','consequences'] as const) text(d[key], key === 'title' ? 160 : 12000);
    invariant(d.title.trim() && ['proposed','accepted','deprecated','superseded'].includes(d.status) && /^\d{4}-\d{2}-\d{2}$/.test(d.date), 'ADR needs a title, valid status and ISO date.');
    invariant(Array.isArray(d.componentIds) && d.componentIds.length <= 3000 && d.componentIds.every(id=>ids.has(id)), 'ADR references an unknown component.');
  }
  for (const n of model.nodes) {
    records(n.documentation);
    if (n.decisionIds) invariant(Array.isArray(n.decisionIds) && n.decisionIds.every(id=>decisionIds.has(id)), 'Component references an unknown ADR.');
    if (n.viewpoints) invariant(Array.isArray(n.viewpoints) && n.viewpoints.every(p=>perspectives.includes(p)), 'Unknown component viewpoint.');
    if (n.activityType) invariant(['activity','decision','start','end'].includes(n.activityType), 'Unknown process activity type.');
    if (n.swimlane !== undefined) text(n.swimlane,100);
    if (n.sourceLinks) {
      invariant(Array.isArray(n.sourceLinks) && n.sourceLinks.length <= 40, 'Use at most 40 source links.');
      for (const link of n.sourceLinks) {
        text(link.label,160); invariant(typeof link.target === 'string' && safeLink(link.target), 'Use a safe HTTP(S) link or workspace-relative file path.');
        invariant(['repository','file','api','infrastructure','pipeline','documentation','adr'].includes(link.kind), 'Unknown source link category.');
        if (link.line !== undefined) invariant(Number.isInteger(link.line) && link.line > 0 && link.line < 1000000, 'Invalid source line.');
      }
    }
  }
  for (const e of model.edges) records(e.documentation);
  for (const v of model.namedViews || []) {
    for (const field of ['includedIds','hiddenIds'] as const) if (v[field] != null) invariant(Array.isArray(v[field]) && v[field]!.every(id=>ids.has(id)), 'View references a deleted component.');
    if (v.typeIds != null) invariant(Array.isArray(v.typeIds) && v.typeIds.every(id=>typeIds.has(id)), 'View references an unknown component type.');
    if (v.routing) invariant(['curved','orthogonal','straight'].includes(v.routing), 'Unknown connector routing.');
    if (v.swimlanes !== undefined) invariant(typeof v.swimlanes === 'boolean', 'Invalid swimlane option.');
    if (v.routes) for (const [id,points] of Object.entries(v.routes)) invariant(model.edges.some(e=>e.id===id) && Array.isArray(points) && points.length <= 20 && points.every(p=>Number.isFinite(p.x)&&Number.isFinite(p.y)&&Math.abs(p.x)<100000&&Math.abs(p.y)<100000), 'Invalid manual connector route.');
  }
  if (model.policy) {
    invariant(typeof model.policy === 'object' && !Array.isArray(model.policy), 'Invalid governance policy.');
    for (const [key,c] of Object.entries(model.policy.rules || {})) { invariant(safeId(key) && c && typeof c === 'object', 'Invalid rule configuration.'); if (c.enabled !== undefined) invariant(typeof c.enabled === 'boolean', 'Invalid rule switch.'); if (c.severity) invariant(['error','warning','information'].includes(c.severity), 'Invalid rule severity.'); }
    if (model.policy.approvedTechnologies) { invariant(Array.isArray(model.policy.approvedTechnologies) && model.policy.approvedTechnologies.length<=1000, 'Invalid technology catalogue.'); model.policy.approvedTechnologies.forEach(t=>text(t,160)); }
    if (model.policy.prohibitedDependencies) invariant(Array.isArray(model.policy.prohibitedDependencies) && model.policy.prohibitedDependencies.length<=100 && model.policy.prohibitedDependencies.every(p=>typeIds.has(p.sourceType)&&typeIds.has(p.targetType)), 'Prohibited dependency references an unknown type.');
    if (model.policy.breaking) for (const value of Object.values(model.policy.breaking)) invariant(typeof value === 'boolean', 'Invalid breaking change policy.');
  }
}
export function canonical(model: Model): string {
  const sorted = (value: unknown): unknown => Array.isArray(value) ? value.map(sorted) : value && typeof value==='object' ? Object.fromEntries(Object.entries(value).sort(([a],[b])=>a.localeCompare(b)).map(([k,v])=>[k,sorted(v)])) : value;
  const copy = JSON.parse(JSON.stringify(model)) as Model;
  for (const key of ['nodes','edges','types','relationshipTypes','decisions'] as const) copy[key]?.sort((a,b)=>a.id.localeCompare(b.id));
  return JSON.stringify(sorted(copy),null,2)+'\n';
}
