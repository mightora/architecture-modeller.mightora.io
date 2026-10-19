export type Kind = 'component' | 'process' | 'stakeholder';
export type Perspective = 'solution' | 'application' | 'data' | 'infrastructure' | 'security' | 'process' | 'stakeholder' | 'integration' | 'deployment' | 'custom' | 'layers' | 'traceability' | 'all';
export type Severity = 'error' | 'warning' | 'information';
export interface Position { x: number; y: number; w?: number; h?: number }
export interface ComponentType { id: string; name: string; color: string; shape: 'rounded' | 'square' | 'database'; fields: string[]; iconId?: string }
export interface RelationshipType { id: string; name: string; color: string; style: 'solid' | 'dashed'; sourceTypes: string[]; targetTypes: string[]; semantic?: 'sequence' | 'supports' | 'participation' }
export interface SourceLink { label: string; target: string; kind: 'repository' | 'file' | 'api' | 'infrastructure' | 'pipeline' | 'documentation' | 'adr'; line?: number }
export interface Component {
  id: string; name: string; typeId: string; parentId: string | null; kind?: Kind; description?: string;
  properties: Record<string, string>; iconId?: string; layerIds?: string[];
  documentation?: Record<string, string>; sourceLinks?: SourceLink[]; decisionIds?: string[];
  viewpoints?: Perspective[]; activityType?: 'activity' | 'decision' | 'start' | 'end'; swimlane?: string;
}
export interface Relationship { id: string; source: string; target: string; typeId: string; label?: string; description?: string; role?: '' | 'R' | 'A' | 'C' | 'I'; documentation?: Record<string, string> }
export interface View {
  id?: string; name?: string; description?: string; focus: string | null; expanded: string[]; perspective?: Perspective;
  positions?: Record<string, Position>; camera?: { x: number; y: number; w: number; h: number };
  relationshipTypeIds?: string[] | null; showExternal?: boolean; processId?: string | null; layerIds?: string[] | null;
  includedIds?: string[] | null; typeIds?: string[] | null; hiddenIds?: string[]; swimlanes?: boolean;
  routing?: 'curved' | 'orthogonal' | 'straight'; routes?: Record<string, Position[]>;
}
export interface Decision { id: string; title: string; status: 'proposed' | 'accepted' | 'deprecated' | 'superseded'; date: string; context: string; decision: string; alternatives: string; consequences: string; componentIds: string[] }
export interface RuleConfig { enabled?: boolean; severity?: Severity }
export interface Policy { rules?: Record<string, RuleConfig>; approvedTechnologies?: string[]; prohibitedDependencies?: { sourceType: string; targetType: string }[]; breaking?: { removals?: boolean; classificationChanges?: boolean; technologyChanges?: boolean } }
export interface Model {
  schemaVersion: number; id?: string; name: string; description?: string; types: ComponentType[]; relationshipTypes: RelationshipType[];
  nodes: Component[]; edges: Relationship[]; views: Record<string, { positions: Record<string, Position> }>;
  namedViews?: View[]; layers?: { id: string; name: string; description: string; color: string }[];
  decisions?: Decision[]; documentation?: Record<string, string>; policy?: Policy; metadata?: Record<string, string>;
}
export interface ValidationIssue { rule: string; entityId?: string; severity: Severity; message: string; remediation: string }
export interface Change { collection: string; id: string; name: string; kind: 'added' | 'removed' | 'modified'; fields: string[]; breaking: boolean }
export interface Comparison { changes: Change[]; layoutOnly: boolean; affectedProcesses: string[]; affectedStakeholders: string[] }
