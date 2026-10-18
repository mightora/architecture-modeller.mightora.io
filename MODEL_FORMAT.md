# Model format, version 1

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

Maximums are documented in the UI and `src/core.js`. The format accepts large models, but browsing a focused view is recommended; no large-model render benchmark has been performed.
