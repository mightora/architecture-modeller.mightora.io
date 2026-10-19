# User guide

The model is the architecture knowledge. A view selects how to display that knowledge. Editing an entity changes it everywhere it appears.

## Files and recovery

**New model** creates a blank graph after a replacement confirmation. **Import** accepts JSON, YAML, YML and YAML-formatted TXT. Imports are validated before replacing your model. **Save model** writes/downloads a `.archmodel.json` file. **Save as** chooses a new destination. Reopen using Import, or a VS Code Custom Editor.

The website keeps an immediate local-storage recovery copy. The Model library uses IndexedDB for several models and five prior revisions. Changes to the active model create recovery revisions after a short debounce. Export portable files before clearing browser data or switching devices. Private browsing, storage quotas and `file://` policies can limit recovery. A warning explains save failures.

## Canvas

Add components with the toolbar, or open the explorer's Component catalogue and drag a block onto the canvas. Select a block to inspect it. Drag to move, drag the background to pan, use Ctrl/Command+scroll to zoom, or use Fit and Arrange.

Double-click or use Explore inside to drill down. Breadcrumbs return to any parent. Expand shows children alongside other levels. Relationships retain exact original endpoints even when represented by an enclosing block.

Shift-click selects several blocks. Canvas tools provides resize, alignment, distribution, grouping, ungrouping, snap toggle, fullscreen and inspector visibility. Panel edges are draggable; keyboard arrow keys resize a focused panel handle. Group creates a container. Ungroup moves children to the container's parent; the original group entity remains available for review/removal so its documentation and incident dependencies are not silently discarded.

Ctrl/Command+C copies selected branches and their internal links. Ctrl/Command+V inserts new identities; Ctrl/Command+D duplicates. Delete removes selected branches and incident dependencies. Ctrl/Command+Z undoes and Shift+Ctrl/Command+Z redoes. In VS Code these delegate to native document history. Ctrl/Command+S saves.

## Connections and documentation

Relationship chooses exact endpoints, type, optional label and notes. Endpoint constraints belong to the modelling language. Business mappings adds supporting systems, sequences and stakeholder participation/RACI. Documentation on an entity records ownership, technology, classification, environment, support ownership, risks, assumptions and other knowledge. Source links accept safe HTTP(S) URLs or workspace-relative paths. VS Code resolves local paths through file-provider APIs.

Use the top Documentation button for model-wide executive summary, principles, scope and next steps. Use an entity's Documentation action for that entity. ADRs stores the context, chosen decision, alternatives, consequences and related entities. ADR Markdown export remains portable.

## Views and reports

Choose a perspective. Scope filters processes/layers. View settings configures type visibility, hidden entities, swimlanes and connector routing. Save view records filters, layout, focus, expansion and camera. Manage views renames, reorders or deletes saved views. See [viewpoints](viewpoints.md).

Validate opens findings with remediation and navigation. Configure rules changes severity and enabled state without changing architecture data. Compare imports an earlier model and highlights added/modified entities, removed items and affected business entities. Impact follows explicit links in both directions; it reports potential reachability rather than predicting runtime failure.

Word and PowerPoint buttons export immediately. Export options selects current, selected, several, all, or complete-model scope; templates; text sections; and branding. Keep the model file for future editing: Office exports are communication artifacts, not round-trip model formats.
