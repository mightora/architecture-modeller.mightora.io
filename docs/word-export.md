# Microsoft Word export

**Export to Word** generates the current projection immediately. **Export options** selects Word, a preset and current/selected/several/all/entire-model scope. Select included sections and fill document title, author, organisation, project, version, date, confidentiality, font, colour and optional raster logo. Portrait and landscape are supported; diagram scaling fits the usable page.

The full pack contains applicable diagrams, executive summary, scope, principles, component catalogue, process maps, stakeholder mapping, technology inventory, exact integration/dependency tables, risks, assumptions, constraints, ADRs, governance findings and glossary. Assessment mode explicitly identifies missing selected narrative sections. Empty inapplicable tables are omitted.

Word output uses actual OOXML headings, paragraphs, tables, metadata, repeatable table headers, page numbering and header/footer. The contents field is a real Word TOC field. In Word, right-click it and choose Update Field/Update entire table. A reader that does not evaluate fields may show a placeholder until updated.

Text and tables are editable. Diagrams use self-contained SVG with PNG fallback. Diagram objects are not editable native Word shapes. Product artwork attribution accompanies exported diagrams. Full model packs retain entities and exact links that are collapsed or outside a single diagram.

Large views split into detail pages with bounded diagrams. Cross-page relationships remain in full-pack dependency documentation; diagram partitions do not pretend all connectors fit one page. Long canvas labels can be abbreviated visually; full names and documentation remain in tables.

Exports use local JSZip/OOXML code retained from the existing app. We evaluated replacing it with `docx`; retaining the tested browser writer avoids a separate conversion path and preserves SVG/PNG dual embedding. There is no external conversion service or requirement to install Office.

Generation errors leave the model intact. Save a portable model before sharing documents. Test samples are validated as OOXML ZIPs and rendered; this is distinct from testing every Word version.
