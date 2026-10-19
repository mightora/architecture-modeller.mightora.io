# Viewpoint modelling

Supported perspectives are Solution, Application, Data, Infrastructure, Security, Integration, Deployment, Business process, Stakeholder, Application layers, Business traceability, All entities and Custom.

A component is a single logical entity, independent of its positions in diagrams. A name, owner or classification change propagates to every view. Hierarchy is containment; layers describe responsibility independently of containment.

Technical perspectives show components. Optional viewpoint tags in entity Documentation narrow specialist technical perspectives. Untagged components remain visible so older models do not lose information. A component tagged for Application and Data appears in those specialist perspectives; Solution remains an inclusive overview. Scope can filter by application layer. Custom supports explicit types, visible entities and relationship filters.

Process projections show processes and optional supporting components as context. Stakeholder projections show participants and process responsibilities. Traceability combines processes, their supporting components and stakeholders. Filters refer to exact process steps, not inferred inherited responsibility.

Save view stores perspective, hierarchy focus, expanded IDs, process/layer filter, relationship types, external-context switch, included types, hidden IDs, routing, swimlane switch, manual routes, component positions/sizes and camera. Views use stable IDs. Manage views controls export ordering.

Curved, straight and orthogonal routes are available. Optional manual routes map a relationship ID to canvas points in View settings. They route the first exact relationship represented by an aggregate link. Native Office connectors preserve exact endpoints; some custom visual routing is simplified in Office. This is documented rather than advertised as identical rendering.

A view has no independent copies of master components. Export current view for a targeted report, or entire model to include entities that are collapsed or filtered out of that view.
