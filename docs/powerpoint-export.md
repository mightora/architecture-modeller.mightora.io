# Microsoft PowerPoint export

**Export to PowerPoint** generates the current projection. **Export options** selects PowerPoint, views, documentation sections and a presentation preset. Widescreen 16:9 is the default.

Presets are Executive Overview, Technical Solution Design, Enterprise Architecture Review, Security Architecture Review, Stakeholder Presentation and Full Architecture Pack. Executive/Stakeholder presets reduce narrative/catalogue content for their audiences. Technical/Enterprise/Security/Full presets preserve the full selected content; choose Security views and security-related sections for a security review. The presets do not invent a security assessment or automatically classify untagged legacy models.

Diagram components and labels are native editable shapes/text boxes. Directed links are native DrawingML connectors attached to generated component shape IDs. You can edit labels, move supported blocks and restyle them in PowerPoint. Product icons are embedded images with applicable attribution. Some routing/custom swimlane details are simplified, and arbitrary object grouping is not exported as native Office groups.

Large diagrams are split into logical layer pages or bounded detail slides. All visible components appear across the slides. Cross-page exact links remain in full-pack report slides and notes. Current-view-only output intentionally covers the chosen projection; use full-model scope for hidden/nested content.

Report sections use editable text boxes with explicit line budgets and continuation slides. Component descriptions, ownership, decisions and dependencies are preserved rather than compressed into a screenshot. A full technical pack can have many slides; choose a smaller scope or Executive Overview for a concise presentation.

PptxGenJS is bundled locally and shared by the website/VS Code/offline app. A small OOXML postprocessor attaches connectors. No model data is sent to a presentation service, and PowerPoint is not required to generate files.
