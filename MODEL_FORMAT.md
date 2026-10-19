# Architecture model file format

Schema version 2 is the current format. The original core fields below remain compatible; version 2 additions and migration rules follow.

Optional top-level `description` (up to 4,000 characters) records the question, audience and scope. JSON/YAML retain it; Word reports and PowerPoint notes include it. Older files remain compatible.

Entity or type `iconId` refers to a bundled entry in `assets/icon-catalog.json`. All five legacy IDs remain valid alongside the new collection IDs. Arbitrary SVG and remote image URLs are rejected. Icon bytes are app assets rather than duplicated in model files.

The portable JSON document contains `schemaVersion`, `name`, `types`, `relationshipTypes`, `nodes`, `edges` and `views`.

Optional version-1 extensions: `namedViews` is an ordered array of up to 50 records with id, name, description, focus, expanded IDs, relationshipTypeIds (null means all; [] means none), showExternal, positions and optional camera. A component or type can specify an `iconId` from the bundled registry; no arbitrary image URLs or SVG input are accepted. Empty iconId selects the generic symbol. Older version-1 files remain accepted.

YAML uses the same document structure and preserves the same semantics. The importer only uses the YAML JSON schema and validates safe expansion before converting to the model. Saved view IDs and reference IDs must be valid. Removing a focused component repairs saved views to overview; moving a component keeps stable endpoint IDs.

| Entity | Fields | Meaning |
| --- | --- | --- |
| Component type | id, name, color, shape, fields[] | User-defined language element. Shape: rounded, square or database. Fields are named text properties. |
| Relationship type | id, name, color, style, sourceTypes[], targetTypes[] | A directed link convention. Empty endpoint-rule arrays allow any component type. |
| Node | id, name, typeId, parentId, description, properties | A reusable identity with one containment parent, or null at the root. |
| Edge | id, source, target, typeId, label, description | Exact directed endpoints, independent of containment levels and diagram focus. |
| View | views[viewKey].positions[nodeId] | Absolute x/y positions for a focus and expansion state. Collapsed views use focusId or overview; expanded views use a deterministic expansion key. Layout changes do not alter semantic relationships. |

IDs are unique within their entity collection, safe ASCII strings of at most 80 characters. Parent relationships form an acyclic forest. Dependencies may be cyclic; traversal uses a visited set. Identical source/target IDs are rejected. Multiple distinct relationships between the same endpoints are allowed.

## Projection

1. Start with the selected focus, or the entire model for overview.
2. Show its direct children; descend into branches explicitly expanded in this view.
3. Keep the focused component as a visible scope boundary so links on the parent itself are not lost.
4. Map hidden internal endpoints to their nearest visible ancestor.
5. Map external endpoints to an external representative at their root boundary; for an external ancestor of the focus, use that actual ancestor.
6. Exclude links where both endpoints are outside the current focus.
7. If both endpoints roll up to the same block, count the relationship as internal, keeping it in the model. It reappears as detail is expanded.
8. Group other links by visible source, visible target and relationship type. Store all original edges in the group.

Projection never changes the saved edge endpoints. The inspector and relationship editor always expose exact paths. Containment itself does not create a dependency.

## Import validation

Imports validate required collections, IDs, types, colours, shapes, parent existence/cycles, endpoints, relationship rules and text limits. Stored positions are sanitized. Rendered names and labels are HTML/XML escaped; property values are text only. CSV cells beginning with spreadsheet formula prefixes are escaped. Script, markup and network URL fields are not evaluated.

Maximums are documented in the UI and `src/core.js`. The format accepts large models, but browsing a focused view is recommended; the verification guide records a 500-component/1,000-relationship benchmark.

# Schema version 2

Version 2 is the canonical output. Both version 1 and 2 can be imported; unsupported future versions fail clearly. The migration copies the input, changes its schema version and retains existing entity/relationship IDs, properties, views, icons and extension fields. It does not invent ownership or infer architecture. Website, extension and CLI share this migration and the same validation boundary.

The preferred extension is `.archmodel.json`. YAML uses the same information model. Legacy `.architecture.json/.yaml/.yml` files still open in the extension.

## Additional semantic fields

- Model: optional `id`, `documentation`, `metadata`, `policy`, `decisions`.
- Entity: optional `documentation`, `sourceLinks`, `decisionIds`, `viewpoints`, `activityType`, `swimlane`.
- Relationship: optional `documentation` for protocols, direction/pattern, authentication and other notes.
- Structured documentation maps human-readable keys to text values, with at most 80 keys of 80 characters and values up to 12,000 characters. Core legacy property limits remain unchanged.
- Source link: `label`, `kind` (repository/file/api/infrastructure/pipeline/documentation/adr), `target`, optional positive `line`. Targets are safe HTTP(S) URLs or workspace-relative paths without traversal/control characters.
- ADR: safe stable `id`, `title`, `status` (proposed/accepted/deprecated/superseded), ISO `date`, `context`, `decision`, `alternatives`, `consequences`, `componentIds`. Up to 500 records. Components may also reference `decisionIds`.
- `viewpoints` selects technical projections. Absence preserves legacy visibility. `activityType` is descriptive activity/decision/start/end metadata; swimlane is a text label.

## Additional view fields

`perspective` supports application, data, infrastructure, security, integration, deployment and custom in addition to solution/process/stakeholder/layers/traceability/all. Optional `includedIds`, `typeIds`, `hiddenIds`, `swimlanes`, `routing` (curved/straight/orthogonal), and `routes` configure a projection. `routes` maps an exact relationship ID to at most 20 finite bounded canvas points. Layout positions may include width 180–1,200 and height 124–1,000; default dimensions remain compatible.

Master entities remain in `nodes`; views never clone them. Layout does not change exact endpoint references. Removing a branch repairs view/ADR references, removes incident links and retains other entity identities.

## Governance policy

```json
{
  "rules": {"owner": {"enabled": true, "severity": "warning"}},
  "approvedTechnologies": ["Power Apps", "Dataverse"],
  "prohibitedDependencies": [{"sourceType": "presentation", "targetType": "data"}],
  "breaking": {"removals": true, "classificationChanges": true, "technologyChanges": false}
}
```

Rules return findings and remediation rather than changing the model. Policy-defined breaking changes are distinct from inferred API compatibility. See the validation guide for actual field matching.

## Canonical JSON and diffs

The exporter writes two-space indentation, sorted object keys and stable ID ordering for unordered entity collections. View/layer order remains meaningful. The semantic comparer ignores positions, camera, routing and expansion state while retaining view scope/filter changes. Layout-only changes can therefore be reviewed separately from architecture changes. `.archmodel.json` remains an ordinary UTF-8 text file for Git.

All imports receive recursive reserved-key/complexity checks before migration and the existing graph validation afterwards. The TypeScript interfaces in `packages/schema/types.ts` and executable validators define the authoritative format. Arbitrary model HTML/SVG/code is never executed.
