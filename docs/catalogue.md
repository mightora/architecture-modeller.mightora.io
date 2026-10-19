# Component catalogue and patterns

The explorer contains generic draggable building blocks for applications, services, databases, APIs, brokers, interfaces, networks, infrastructure, security controls and integrations. Add Process/Stakeholder from the toolbar. Existing modelling-language controls define additional component types, properties, colours, block shapes and endpoint constraints.

The component editor includes a searchable bundled icon picker with collection filters, product labels, provenance and usage links. Existing Microsoft/Power Platform, Azure, AWS and Lucide architecture icons are preserved. Product icons identify the actual product and retain their proportions. The code's MIT licence does not replace an artwork owner's terms.

Official sources and terms were reviewed for this release:

- Azure: https://learn.microsoft.com/azure/architecture/icons/
- Power Platform: https://learn.microsoft.com/power-platform/guidance/icons
- AWS: https://aws.amazon.com/architecture/icons/
- Full bundled collection notices and recorded source hashes: [THIRD-PARTY-NOTICES](../THIRD-PARTY-NOTICES.md).

Microsoft permits architecture/documentation use and distribution for that permitted use, and prohibits distortion or representing another product with its icon. AWS package use remains subject to the original terms and notices. No vendor endorsement is implied. Generic symbols remain available. Arbitrary remote SVGs are not accepted in model files.

Patterns contains API gateway, event-driven integration, identity/authentication, ingestion, Power Platform integration, three-tier web, messaging and secure external access starting points. Insertion remaps identities/types/relationships to avoid collisions. Inserted components remain editable. These examples require design review; they do not establish production fitness or compliance.

Save selected branch as pattern exports an open JSON pattern file. Import pattern library reviews/validates its model before inserting. Pattern files can be kept in Git alongside an organisation's documentation. There is no central catalogue service.

Nine editable example models cover web, three-tier, Power Platform, Azure integration, event-driven, microservices, hybrid integration, business transformation and enterprise landscape. Each contains shared business and technical viewpoints rather than disconnected drawings.
