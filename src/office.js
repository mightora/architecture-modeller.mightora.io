/* Local-only export: native PowerPoint shapes; Word SVG diagrams plus editable report text. */
(function(root) {
  'use strict';
  const nodeEnv = typeof module !== 'undefined' && module.exports;
  const M = nodeEnv ? require('./core.js') : root.Modeller;
  const D = nodeEnv ? require('./dimensions.js') : root.ModellerDimensions;
  const layerNames = (model, n) => (n.layerIds || []).map(id => model.layers.find(l => l.id === id)?.name).filter(Boolean).join(', ');
  const Zip = nodeEnv ? require('../assets/jszip.min.js') : root.JSZip;
  const Pptx = nodeEnv ? require('node:vm').runInNewContext(require('node:fs').readFileSync(require('node:path').join(__dirname, '../assets/pptxgen.bundle.js'), 'utf8') + '\nPptxGenJS;', { JSZip: Zip, console, Buffer, Uint8Array, ArrayBuffer, Blob, TextEncoder, TextDecoder, setTimeout, clearTimeout, btoa, atob }) : root.PptxGenJS;
  const x = s => String(s ?? '').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[c]));
  const xmlns = 'http://schemas.openxmlformats.org/';
  const icons = () => root.ModellerIcons || {};
  function iconFor(model, n) { const original = model.nodes.find(v => v.id === (n.originalId || n.id)); const type = model.types.find(t => t.id === original?.typeId); return icons()[original?.iconId ?? type?.iconId] || null; }
  function scene(model, view) {
    const projection = M.projectView(model, view), layout = M.layoutView(model, projection, view, view.positions || {}), boxes = [...layout.nodes, ...(layout.bands || [])];
    const minX = Math.min(0, ...boxes.map(n => n.x - 25)), minY = Math.min(0, ...boxes.map(n => n.y - 25));
    const width = Math.max(400, ...boxes.map(n => n.x + n.w + 30)) - minX, height = Math.max(240, ...boxes.map(n => n.y + n.h + 30)) - minY;
    return { model, view, projection, nodes: layout.nodes, bands: layout.bands || [], edges: projection.edges, minX, minY, width, height };
  }
  function geometry(s, edge) {
    const a = s.nodes.find(n => n.id === edge.source), b = s.nodes.find(n => n.id === edge.target);
    const ah = a.expanded ? 52 : a.h, bh = b.expanded ? 52 : b.h;
    const dx = b.x + b.w / 2 - a.x - a.w / 2, dy = b.y + bh / 2 - a.y - ah / 2;
    const peers = s.edges.filter(e => e.source === edge.source && e.target === edge.target), offset = (peers.indexOf(edge) - (peers.length - 1) / 2) * 23;
    if (Math.abs(dx) > Math.abs(dy) * .8) return { x1: a.x + (dx > 0 ? a.w : 0), y1: a.y + ah / 2 + offset, x2: b.x + (dx > 0 ? 0 : b.w), y2: b.y + bh / 2 + offset, start: dx > 0 ? 3 : 1, end: dx > 0 ? 1 : 3 };
    return { x1: a.x + a.w / 2 + offset, y1: a.y + (dy > 0 ? ah : 0), x2: b.x + b.w / 2 + offset, y2: b.y + (dy > 0 ? 0 : bh), start: dy > 0 ? 2 : 0, end: dy > 0 ? 0 : 2 };
  }
  function wrap(text, limit = 26, max = 3) {
    const result = []; let current = '';
    for (let word of String(text).split(/\s+/)) { while (word.length > limit) { if (current) { result.push(current); current = ''; } result.push(word.slice(0, limit)); word = word.slice(limit); } if ((current + ' ' + word).trim().length > limit) { result.push(current); current = word; } else current = (current + ' ' + word).trim(); }
    if (current) result.push(current); if (result.length > max) return [...result.slice(0, max - 1), result[max - 1].slice(0, limit - 1) + '…']; return result;
  }
  function labelGeometry(s, edge, used) {
    const roles = [...new Set(edge.edges.map(e => e.role).filter(Boolean))].join('/');
    const g = geometry(s, edge), type = s.model.relationshipTypes.find(t => t.id === edge.typeId), label = `${edge.edges.length > 1 ? edge.edges.length + ' × ' : ''}${type.name}${roles ? ' · ' + roles : ''}`, width = Math.min(290, label.length * 5.5 + 14);
    const dx = g.x2 - g.x1, dy = g.y2 - g.y1, length = Math.hypot(dx, dy) || 1, nx = -dy / length, ny = dx / length;
    const obstacles = [...s.nodes.map(n => ({ x: n.x - 4, y: n.y - 4, w: n.w + 8, h: (n.expanded ? 66 : n.h) + 8 })), ...used];
    let result;
    outer: for (const offset of [0, 18, -18, 36, -36, 60, -60, 85, -85, 110, -110, 150, -150]) for (const at of [.5, .4, .6, .25, .75]) {
      const cx = g.x1 + dx * at + nx * offset, cy = g.y1 + dy * at + ny * offset, rect = { x: cx - width / 2, y: cy - 11, w: width, h: 22 };
      if (rect.x < s.minX || rect.y < s.minY || rect.x + rect.w > s.minX + s.width || rect.y + rect.h > s.minY + s.height) continue;
      if (obstacles.some(o => rect.x < o.x + o.w && rect.x + rect.w > o.x && rect.y < o.y + o.h && rect.y + rect.h > o.y)) continue;
      result = { cx, cy, rect, fromX: g.x1 + dx * at, fromY: g.y1 + dy * at, leader: Math.abs(offset) > 12 }; break outer;
    }
    result ||= { cx: (g.x1 + g.x2) / 2, cy: (g.y1 + g.y2) / 2, rect: { x: (g.x1 + g.x2 - width) / 2, y: (g.y1 + g.y2) / 2 - 11, w: width, h: 22 }, leader: false };
    used.push(result.rect); return { ...result, label, width, g };
  }
  function svg(s) {
    const type = n => s.model.types.find(t => t.id === n.typeId);
    const node = (n, background) => {
      const t = type(n), icon = iconFor(s.model, n), xx = n.x, yy = n.y;
      if (background) return `<rect x="${xx}" y="${yy}" width="${n.w}" height="${n.h}" rx="9" fill="#f0fdf4" stroke="${t.color}" stroke-dasharray="5 4"/>`;
      const label = wrap(n.name, n.expanded ? Math.max(24, Math.floor(n.w / 8) - 5) : 26, n.expanded ? 1 : 2);
      return `${n.expanded ? '' : `<rect x="${xx}" y="${yy}" width="${n.w}" height="${n.h}" rx="${t.shape === 'square' ? 2 : 9}" fill="white" stroke="${t.color}"${n.external ? ' stroke-dasharray="6 4"' : ''}/>`}${icon ? `<image href="${icon.png}" x="${xx + 15}" y="${yy + 12}" width="25" height="25" preserveAspectRatio="xMidYMid meet"/>` : `<rect x="${xx + 17}" y="${yy + 20}" width="11" height="11" rx="2" fill="${t.color}"/>`}<text x="${xx + 47}" y="${yy + 29}" fill="${t.color}" font-size="10">${x(n.expanded ? t.name : t.name.toUpperCase())}</text><text x="${xx + 16}" y="${yy + (n.expanded ? 52 : 61)}" fill="#111827" font-size="14" font-weight="600">${label.map((line, i) => `<tspan x="${xx + 16}" dy="${i ? 18 : 0}">${x(line)}</tspan>`).join('')}</text>${n.expanded ? '' : `<text x="${xx + 16}" y="${yy + 108}" fill="#57675e" font-size="10">${n.external ? 'EXTERNAL CONTEXT' : `${s.model.nodes.filter(c => c.parentId === (n.originalId || n.id)).length} components inside`}</text>`}`;
    };
    const labels = [], used = [];
    const edges = s.edges.map((e, i) => { const p = labelGeometry(s, e, used), { g, label, width: w, cx: mx, cy: my } = p, t = s.model.relationshipTypes.find(t => t.id === e.typeId);
      labels.push(`${p.leader ? `<path d="M${p.fromX} ${p.fromY}L${mx} ${my}" stroke="#94a3b8" stroke-width=".7"/>` : ''}<rect x="${mx - w / 2}" y="${my - 11}" width="${w}" height="21" rx="4" fill="white" stroke="#dce5df"/><text x="${mx}" y="${my + 3}" text-anchor="middle" fill="#475569" font-size="10">${x(label)}</text>`);
      return `<defs><marker id="a${i}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10Z" fill="${t.color}"/></marker></defs><path d="M${g.x1} ${g.y1}L${g.x2} ${g.y2}" fill="none" stroke="${t.color}" stroke-width="1.7"${t.style === 'dashed' ? ' stroke-dasharray="5 5"' : ''} marker-end="url(#a${i})"/>`;
    }).join('');
    const bands = s.bands.map(b => `<rect x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" rx="10" fill="#f5faf7" stroke="${b.color}"/><text x="${b.x + 20}" y="${b.y + 27}" fill="${b.color}" font-size="16" font-weight="600">${x(b.name)}</text><text x="${b.x + 20}" y="${b.y + 47}" fill="#57675e" font-size="11">${x(b.description.slice(0,125))}</text>`).join('');
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${s.width}" height="${s.height}" viewBox="${s.minX} ${s.minY} ${s.width} ${s.height}" role="img"><title>${x(s.view.name)}</title><rect x="${s.minX}" y="${s.minY}" width="${s.width}" height="${s.height}" fill="white"/><g font-family="Arial, sans-serif">${bands}${s.nodes.filter(n => n.expanded).map(n => node(n, true)).join('')}${edges}${s.nodes.map(n => node(n, false)).join('')}${labels.join('')}</g></svg>`;
  }
  function prepare(model, views) {
    M.validate(model); if (!views.length || views.length > 50) throw new Error('Choose between 1 and 50 views.');
    const scenes = views.map(v => scene(model, v));
    if (scenes.some(s => s.nodes.length > 500)) throw new Error('For Office export, focus or collapse each view to 500 visible components or fewer.');
    return scenes;
  }
  async function pptx(model, views) {
    const scenes = prepare(model, views), deck = new Pptx(); deck.layout = 'LAYOUT_WIDE'; deck.author = 'Mightora Architecture Modeller'; deck.subject = 'Architecture views'; deck.title = model.name; deck.company = 'Mightora'; deck.lang = 'en-GB'; deck.theme = { headFontFace: 'Arial', bodyFontFace: 'Arial', lang: 'en-GB' };
    const connectorMaps = [];
    for (let i = 0; i < scenes.length; i++) {
      const s = scenes[i], slide = deck.addSlide(); slide.background = { color: 'FFFFFF' };
      slide.addText(s.view.name, { x: .45, y: .25, w: 12.4, h: .42, fontSize: 22, bold: true, color: '111827', margin: 0 });
      slide.addText(s.view.description ? s.view.description.slice(0, 180) + (s.view.description.length > 180 ? '…' : '') : `${model.name} · ${s.view.focus ? M.path(model, s.view.focus) : 'Architecture overview'}`, { x: .45, y: .76, w: 12.4, h: .43, fontSize: 10.5, color: '57675E', margin: 0, breakLine: false });
      const scale = Math.min(12.3 / s.width, 5.65 / s.height), ox = .5 + (12.3 - s.width * scale) / 2, oy = 1.28 + (5.65 - s.height * scale) / 2;
      const px = v => ox + (v - s.minX) * scale, py = v => oy + (v - s.minY) * scale;
      const maps = [];
      for (const b of s.bands) {
        slide.addShape(deck.ShapeType.roundRect, { x:px(b.x), y:py(b.y), w:b.w*scale, h:b.h*scale, fill:{color:'F5FAF7'}, line:{color:b.color.slice(1),width:.8}, objectName:'layer-'+(b.id || 'unassigned') });
        slide.addText(b.name, { x:px(b.x+20), y:py(b.y+10), w:(b.w-40)*scale, h:23*scale, fontSize:Math.max(5,16*scale*72), bold:true, color:b.color.slice(1), margin:0 });
        slide.addText(b.description.slice(0,125), { x:px(b.x+20), y:py(b.y+35), w:(b.w-40)*scale, h:18*scale, fontSize:Math.max(4,10*scale*72), color:'57675E', margin:0, fit:'shrink' });
      }
      function box(n) { const t = model.types.find(t => t.id === n.typeId); slide.addShape(t.shape === 'square' ? deck.ShapeType.rect : deck.ShapeType.roundRect, { x: px(n.x), y: py(n.y), w: n.w * scale, h: n.h * scale, radius: .05, rectRadius: .05, fill: { color: n.expanded ? 'F0FDF4' : 'FFFFFF' }, line: { color: t.color.slice(1), width: .8, dashType: n.external || n.expanded ? 'dash' : 'solid' }, objectName: `node-${n.id}` }); }
      s.nodes.filter(n => n.expanded).forEach(box);
      for (const edge of s.edges) {
        const g = geometry(s, edge), t = model.relationshipTypes.find(t => t.id === edge.typeId), xx1 = px(g.x1), yy1 = py(g.y1), xx2 = px(g.x2), yy2 = py(g.y2);
        slide.addShape(deck.ShapeType.line, { x: Math.min(xx1, xx2), y: Math.min(yy1, yy2), w: Math.max(.001, Math.abs(xx2 - xx1)), h: Math.max(.001, Math.abs(yy2 - yy1)), flipH: xx2 < xx1, flipV: yy2 < yy1, line: { color: t.color.slice(1), width: 1, endArrowType: 'triangle', dashType: t.style === 'dashed' ? 'dash' : 'solid' }, objectName: `link-${edge.id}` });
        maps.push({ name: `link-${edge.id}`, source: `node-${edge.source}`, target: `node-${edge.target}`, start: g.start, end: g.end });
      }
      s.nodes.filter(n => !n.expanded).forEach(box);
      for (const n of s.nodes) {
        const t = model.types.find(t => t.id === n.typeId), icon = iconFor(model, n), font = Math.max(5, Math.min(12, 14 * scale * 72));
        if (icon) slide.addImage({ data: icon.png, x: px(n.x + 15), y: py(n.y + 11), w: 25 * scale, h: 25 * scale, altText: icon.name });
        slide.addText(t.name, { x: px(n.x + (icon ? 47 : 16)), y: py(n.y + 14), w: Math.max(.1, (n.w - (icon ? 63 : 32)) * scale), h: 18 * scale, fontSize: Math.max(4, 10 * scale * 72), color: t.color.slice(1), margin: 0, fit: 'shrink' });
        slide.addText(n.name, { x: px(n.x + 16), y: py(n.y + (n.expanded ? 34 : 44)), w: (n.w - 32) * scale, h: (n.expanded ? 24 : 48) * scale, fontSize: font, bold: true, color: '111827', margin: 0, valign: 'mid', fit: 'shrink', breakLine: false });
        if (n.external) slide.addText('EXTERNAL CONTEXT', { x: px(n.x + 16), y: py(n.y + 101), w: (n.w - 32) * scale, h: 14 * scale, fontSize: Math.max(4, 9 * scale * 72), color: '57675E', margin: 0 });
      }
      const usedLabels = [];
      for (const edge of s.edges) {
        const p = labelGeometry(s, edge, usedLabels), w = p.width * scale;
        if (p.leader) slide.addShape(deck.ShapeType.line, { x: Math.min(px(p.fromX), px(p.cx)), y: Math.min(py(p.fromY), py(p.cy)), w: Math.max(.001, Math.abs(p.cx - p.fromX) * scale), h: Math.max(.001, Math.abs(p.cy - p.fromY) * scale), flipH: p.cx < p.fromX, flipV: p.cy < p.fromY, line: { color: '94A3B8', width: .5 } });
        slide.addText(p.label, { x: px(p.cx) - w / 2, y: py(p.cy) - 10 * scale, w, h: 20 * scale, fontSize: Math.max(4, 10 * scale * 72), align: 'center', color: '475569', fill: { color: 'FFFFFF' }, margin: 0, fit: 'shrink' });
      }
      slide.addText(`${i + 1} / ${scenes.length} · ${model.name} · Mightora`, { x: .45, y: 7.12, w: 12.4, h: .17, fontSize: 8, color: '64748B', margin: 0 });
      const exact = s.edges.flatMap(e => e.edges).map(e => `${M.path(model, e.source)} — ${model.relationshipTypes.find(t => t.id === e.typeId).name}${e.role ? ' · ' + D.roleLabel(e) : ''}${e.label ? ' (' + e.label + ')' : ''} → ${M.path(model, e.target)}`);
      slide.addNotes(['Perspective: '+(s.view.perspective || 'solution'), ...s.nodes.map(n => `${n.name} [${D.kind(n)}]${layerNames(model,n) ? ' — Layers: '+layerNames(model,n) : ''}`), ...(model.layers || []).map(l => `${l.name}: ${l.description}`)]);
      slide.addNotes([s.view.description || '', 'Exact relationships in this view:', ...exact, 'Microsoft icons: Microsoft/PowerBI-Icons archived official set, CC BY 4.0; Microsoft architecture icon use and trademark terms apply. https://github.com/microsoft/PowerBI-Icons']);
      connectorMaps.push(maps);
    }
    // Convert line shapes into attached native DrawingML connectors. Source IDs are generated by PptxGenJS.
    const data = await deck.write({ outputType: 'uint8array' }), zip = await Zip.loadAsync(data);
    for (let i = 0; i < scenes.length; i++) {
      const path = `ppt/slides/slide${i + 1}.xml`; let xml = await zip.file(path).async('string');
      const ids = new Map([...xml.matchAll(/<p:cNvPr\b[^>]*\bid="(\d+)"[^>]*\bname="([^"]+)"/g)].map(m => [m[2], m[1]]));
      for (const map of connectorMaps[i]) xml = xml.replace(/<p:sp>.*?<\/p:sp>/gs, shape => {
        if (!shape.includes(`name="${x(map.name)}"`)) return shape;
        const from = ids.get(x(map.source)), to = ids.get(x(map.target)); if (!from || !to) throw new Error('Could not attach a PowerPoint connector.');
        return shape.replace('<p:sp>', '<p:cxnSp>').replace('</p:sp>', '</p:cxnSp>').replaceAll('p:nvSpPr', 'p:nvCxnSpPr').replace(/<p:cNvSpPr[^>]*\/>/, `<p:cNvCxnSpPr><a:stCxn id="${from}" idx="${map.start}"/><a:endCxn id="${to}" idx="${map.end}"/></p:cNvCxnSpPr>`).replace(/<p:txBody>.*?<\/p:txBody>/s, '');
      });
      zip.file(path, xml);
    }
    return zip.generateAsync({ type: 'uint8array', compression: 'DEFLATE' });
  }
  async function rasterize(source) {
    const url = URL.createObjectURL(new Blob([source], { type: 'image/svg+xml' }));
    try {
      const image = new Image(); const loaded = new Promise((resolve, reject) => { image.onload = resolve; image.onerror = () => reject(new Error('The diagram could not be converted for Word.')); }); image.src = url; await loaded;
      const factor = Math.min(2, 4096 / Math.max(image.naturalWidth, image.naturalHeight)), canvas = document.createElement('canvas'); canvas.width = Math.ceil(image.naturalWidth * factor); canvas.height = Math.ceil(image.naturalHeight * factor);
      const context = canvas.getContext('2d'); if (!context) throw new Error('Canvas is unavailable.'); context.drawImage(image, 0, 0, canvas.width, canvas.height); return canvas.toDataURL('image/png').split(',')[1];
    } finally { URL.revokeObjectURL(url); }
  }
  function paragraph(text, style = 'Normal', before = false) { return `<w:p><w:pPr><w:pStyle w:val="${style}"/>${before ? '<w:pageBreakBefore/>' : ''}</w:pPr><w:r><w:t xml:space="preserve">${x(text)}</w:t></w:r></w:p>`; }
  function table(rows, widths) {
    return `<w:tbl><w:tblPr><w:tblW w:w="0" w:type="auto"/><w:tblLayout w:type="fixed"/><w:tblCellMar><w:top w:w="90" w:type="dxa"/><w:left w:w="100" w:type="dxa"/><w:bottom w:w="90" w:type="dxa"/><w:right w:w="100" w:type="dxa"/></w:tblCellMar><w:tblBorders>${['top', 'left', 'bottom', 'right', 'insideH', 'insideV'].map(k => `<w:${k} w:val="single" w:sz="4" w:color="D9D9D9"/>`).join('')}</w:tblBorders></w:tblPr><w:tblGrid>${widths.map(w => `<w:gridCol w:w="${w}"/>`).join('')}</w:tblGrid>${rows.map((row, i) => `<w:tr><w:trPr><w:cantSplit/>${i === 0 ? '<w:tblHeader/>' : ''}</w:trPr>${row.map((value, j) => `<w:tc><w:tcPr><w:tcW w:w="${widths[j]}" w:type="dxa"/><w:vAlign w:val="center"/>${i === 0 ? '<w:shd w:fill="E2E8F0"/>' : ''}</w:tcPr>${paragraph(value, i === 0 ? 'TableHeader' : 'TableText')}</w:tc>`).join('')}</w:tr>`).join('')}</w:tbl>`;
  }
  async function docx(model, views, settings = {}) {
    const scenes = prepare(model, views), zip = new Zip(), rels = [{ id: 'rStyles', type: 'styles', target: 'styles.xml' }], body = [];
    const landscape = settings.landscape === true, pageWidth = landscape ? 15840 : 12240, pageHeight = landscape ? 12240 : 15840, usable = pageWidth - 1800;
    body.push(paragraph(model.name, 'Title'), paragraph(`Architecture views · ${views.length} selected · Generated with Mightora Architecture Modeller`));
    for (let i = 0; i < scenes.length; i++) {
      const s = scenes[i], source = svg(s), png = await (settings.rasterize || rasterize)(source);
      zip.file(`word/media/view${i + 1}.svg`, source); zip.file(`word/media/view${i + 1}.png`, png, { base64: true });
      rels.push({ id: `rPng${i}`, type: 'image', target: `media/view${i + 1}.png` }, { id: `rSvg${i}`, type: 'image', target: `media/view${i + 1}.svg` });
      body.push(paragraph(s.view.name, 'Heading1', i > 0)); if (s.view.description) body.push(paragraph(s.view.description));
      const w = Math.min(usable, (landscape ? 5100 : 7000) * s.width / s.height), h = w * s.height / s.width, cx = Math.round(w * 635), cy = Math.round(h * 635);
      body.push(`<w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:drawing><wp:inline distT="0" distB="0" distL="0" distR="0"><wp:extent cx="${cx}" cy="${cy}"/><wp:docPr id="${i + 1}" name="${x(s.view.name)}" descr="Architecture diagram for ${x(s.view.name)}"/><a:graphic xmlns:a="${xmlns}drawingml/2006/main"><a:graphicData uri="${xmlns}drawingml/2006/picture"><pic:pic xmlns:pic="${xmlns}drawingml/2006/picture"><pic:nvPicPr><pic:cNvPr id="0" name="${x(s.view.name)}"/><pic:cNvPicPr/></pic:nvPicPr><pic:blipFill><a:blip r:embed="rPng${i}"><a:extLst><a:ext uri="{96DAC541-7B7A-43D3-8B79-37D633B846F1}"><asvg:svgBlip xmlns:asvg="http://schemas.microsoft.com/office/drawing/2016/SVG/main" r:embed="rSvg${i}"/></a:ext></a:extLst></a:blip><a:stretch><a:fillRect/></a:stretch></pic:blipFill><pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="${cx}" cy="${cy}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr></pic:pic></a:graphicData></a:graphic></wp:inline></w:drawing></w:r></w:p>`);
      body.push(paragraph(`${s.nodes.length} visible entities · ${s.edges.length} visible relationship groups. Perspective: ${s.view.perspective || 'solution'}. External representatives and grouped links retain exact endpoints in the relationship table.`, 'Caption'));
      if (settings.tables !== false) {
        body.push(paragraph('Entities and application layers', 'Heading2'));
        body.push(table([['Entity', 'Category / type', 'Description, layers and properties'], ...s.nodes.map(n => { const original = model.nodes.find(v => v.id === (n.originalId || n.id)); return [M.path(model, original.id) + (n.external ? ' (external context)' : ''), D.kind(original)+' / '+model.types.find(t => t.id === n.typeId).name, [original.description, layerNames(model,original) ? 'Layers (primary first): '+layerNames(model,original) : '', ...Object.entries(original.properties || {}).map(([key, value]) => `${key}: ${value}`)].filter(Boolean).join('\n')]; })], [Math.round(usable * .33), Math.round(usable * .18), usable - Math.round(usable * .33) - Math.round(usable * .18)]));
        if (s.view.perspective === 'layers' && model.layers?.length) body.push(table([['Layer', 'Definition'], ...model.layers.map(l => [l.name,l.description])], [Math.round(usable*.3),usable-Math.round(usable*.3)]));
        const exact = s.edges.flatMap(e => e.edges);
        if (exact.length) { body.push(paragraph('Relationships', 'Heading2')); body.push(table([['Source', 'Relationship / responsibility', 'Target'], ...exact.map(e => [M.path(model, e.source), `${model.relationshipTypes.find(t => t.id === e.typeId).name}${e.role ? '\n'+D.roleLabel(e) : ''}${e.label ? ': ' + e.label : ''}${e.description ? '\n' + e.description : ''}`, M.path(model, e.target)])], [Math.round(usable * .36), Math.round(usable * .28), usable - Math.round(usable * .36) - Math.round(usable * .28)])); }
      }
    }
    body.push(paragraph('Microsoft product icons are from the official archived Microsoft PowerBI Icons set, licensed CC BY 4.0. Architecture icon use and trademark terms apply. Source: https://github.com/microsoft/PowerBI-Icons', 'Caption'));
    body.push(`<w:sectPr><w:pgSz w:w="${pageWidth}" w:h="${pageHeight}"${landscape ? ' w:orient="landscape"' : ''}/><w:pgMar w:top="900" w:right="900" w:bottom="900" w:left="900" w:header="0" w:footer="0" w:gutter="0"/></w:sectPr>`);
    zip.file('word/document.xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="${xmlns}wordprocessingml/2006/main" xmlns:r="${xmlns}officeDocument/2006/relationships" xmlns:wp="${xmlns}drawingml/2006/wordprocessingDrawing"><w:body>${body.join('')}</w:body></w:document>`);
    zip.file('word/_rels/document.xml.rels', `<?xml version="1.0"?><Relationships xmlns="${xmlns}package/2006/relationships">${rels.map(r => `<Relationship Id="${r.id}" Type="${xmlns}officeDocument/2006/relationships/${r.type}" Target="${r.target}"/>`).join('')}</Relationships>`);
    zip.file('_rels/.rels', `<?xml version="1.0"?><Relationships xmlns="${xmlns}package/2006/relationships"><Relationship Id="rDocument" Type="${xmlns}officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>`);
    const styles = [['Normal', 22, false], ['Title', 34, true], ['Heading1', 28, true], ['Heading2', 24, true], ['Caption', 18, false], ['TableText', 20, false], ['TableHeader', 20, true]].map(([name, size, bold]) => `<w:style w:type="paragraph" w:styleId="${name}"><w:name w:val="${name}"/><w:pPr><w:spacing w:before="${name.startsWith('Heading') ? 200 : 0}" w:after="${name.startsWith('Table') ? 0 : 130}" w:line="280" w:lineRule="auto"/>${name.startsWith('Heading') || name === 'Title' ? '<w:keepNext/>' : ''}</w:pPr><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial"/><w:sz w:val="${size}"/><w:color w:val="${name === 'Caption' ? '475569' : '000000'}"/>${bold ? '<w:b/>' : ''}</w:rPr></w:style>`).join('');
    zip.file('word/styles.xml', `<?xml version="1.0"?><w:styles xmlns:w="${xmlns}wordprocessingml/2006/main">${styles}</w:styles>`);
    zip.file('[Content_Types].xml', `<?xml version="1.0"?><Types xmlns="${xmlns}package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Default Extension="svg" ContentType="image/svg+xml"/><Default Extension="png" ContentType="image/png"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/></Types>`);
    return zip.generateAsync({ type: 'uint8array', compression: 'DEFLATE' });
  }
  const api = { scene, geometry, labelGeometry, svg, pptx, docx, iconFor };
  if (nodeEnv) module.exports = api; else root.ModellerOffice = api;
})(globalThis);
