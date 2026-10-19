# Architecture validation and Git governance

Schema validation rejects malformed models before editing: invalid identities, references, types, nesting cycles, unsafe fields, unsupported versions and exceeded limits. Governance evaluates architectural meaning without silently changing the model.

| Rule | Default | Remediation |
| --- | --- | --- |
| owner | Warning | Record application/system ownership |
| criticality | Warning | Rate important systems |
| classification | Warning | Classify stores/sensitive data |
| authentication | Error | Record authentication across external boundaries |
| support | Warning | Assign production support ownership |
| decision | Information | Link critical components to ADRs |
| process-support | Warning | Map systems supporting important processes |
| references | Error | Repair dangling or duplicate references |
| dependency-policy | Error | Review prohibited source-type/target-type combinations |
| technology | Warning | Review technologies outside an approved list |

Field matching is case-insensitive across properties and structured documentation. Criticality recognises Critical, High and Tier 1 labels. Production checks use Environment; boundary checks use Boundary = External or a relationship's External = Yes. These rules document assumptions and are intentionally configurable.

Validate opens a severity-filterable panel. Locate navigates to the component or relationship source. Configure rules enables/disables rules, selects severity, sets approved technology names and optional prohibited dependency pairs. Findings include a suggested action and can be exported as JSON and in full design packs. VS Code also publishes findings to Problems using positions in the underlying JSON/YAML text.

## CLI

After `npm ci && npm run compile`:

```sh
node tools/cli/architecture.cjs validate docs/examples/simple.archmodel.json
node tools/cli/architecture.cjs validate model.archmodel.json --json > architecture-report.json
node tools/cli/architecture.cjs validate model.archmodel.json --sarif > architecture.sarif
node tools/cli/architecture.cjs diff before.json after.json --json > model-diff.json
```

Exit 0 means schema valid/no error-severity finding. Exit 1 means governance errors or policy-defined breaking changes. Exit 2 means schema/parse/usage error. Invalid-schema JSON is written to stderr; callers should capture stderr when retaining failed reports. SARIF is generated locally; uploading it to a hosting platform is a separate opt-in configuration.

The checked-in reusable workflow validates a chosen model and uploads readable/JSON evidence. Set `enforce: true` and configure branch protection only when the repository owner chooses to make validation mandatory. No paid GitHub feature is required for artifact reports.

Example caller in the same repository:

```yaml
name: Architecture review
on: [pull_request]
jobs:
  architecture:
    uses: ./.github/workflows/architecture-validation.yml
    with:
      model: docs/examples/simple.archmodel.json
      enforce: false
```

For another repository, check out/install the modeller CLI at a pinned release and run it against that repository's file. The reusable workflow assumes its checkout contains this tool, so copying the caller alone into an unrelated repository is insufficient.

## Comparison and impact

Compare identifies additions, removals and modifications to entities, relationships, types, layers, decisions, model documentation and view definitions. Positions, camera, connector routing and expansion state are layout-only. Ownership, technology and classification changes appear in changed properties/documentation. The change report lists affected processes and stakeholders reachable through explicit relationships in either direction.

`policy.breaking` can flag removals, technology changes and classification changes. Detection uses case-insensitive Technology and Classification across properties and documentation. It does not infer API compatibility or semantic versioning. Dependency reachability indicates a review scope rather than proven runtime impact.
