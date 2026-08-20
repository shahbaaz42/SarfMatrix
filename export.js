const EXPORT_FOOTER = "Developed by Shahbaaz Ahmed | shahbaaz.education@gmail.com | © Shahbaaz Ahmed. All Rights Reserved.";
const ROOT_COLOURS = ["A12622", "075EA8", "4F6F12"];

function escapeXml(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function sanitizeFilename(root, extension) {
  const safeRoot = root.join("").replace(/[\\/:*?"<>|\u0000-\u001f]/g, "").trim() || "root";
  return `Sarf_${safeRoot}.${extension}`;
}

function crc32(bytes) {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function zipStore(files) {
  const encoder = new TextEncoder();
  const chunks = [];
  const central = [];
  let offset = 0;
  const u16 = (n) => new Uint8Array([n & 255, (n >>> 8) & 255]);
  const u32 = (n) => new Uint8Array([n & 255, (n >>> 8) & 255, (n >>> 16) & 255, (n >>> 24) & 255]);
  const join = (parts) => { const out = new Uint8Array(parts.reduce((sum, part) => sum + part.length, 0)); let at = 0; for (const part of parts) { out.set(part, at); at += part.length; } return out; };
  for (const [name, content] of Object.entries(files)) {
    const filename = encoder.encode(name);
    const data = content instanceof Uint8Array ? content : encoder.encode(content);
    const checksum = crc32(data);
    const local = join([u32(0x04034b50), u16(20), u16(0x0800), u16(0), u16(0), u16(0), u32(checksum), u32(data.length), u32(data.length), u16(filename.length), u16(0), filename, data]);
    chunks.push(local);
    central.push(join([u32(0x02014b50), u16(20), u16(20), u16(0x0800), u16(0), u16(0), u16(0), u32(checksum), u32(data.length), u32(data.length), u16(filename.length), u16(0), u16(0), u16(0), u16(0), u32(0), u32(offset), filename]));
    offset += local.length;
  }
  const directory = join(central);
  const end = join([u32(0x06054b50), u16(0), u16(0), u16(central.length), u16(central.length), u32(directory.length), u32(offset), u16(0)]);
  return join([...chunks, directory, end]);
}

function textRuns(value, root, coloured) {
  if (!coloured) return [{ text: value ?? "", radical: null }];
  if (typeof window !== "undefined") return window.SARF_PRESENTATION.splitRootRuns(value, root);
  const characters = [...value];
  const candidates = root.map((radical) => characters.flatMap((character, index) => character === radical ? [index] : []));
  let best = null;
  for (const first of candidates[0]) for (const second of candidates[1]) for (const third of candidates[2]) if (first < second && second < third && (!best || third - first < best.score)) best = { indexes: [first, second, third], score: third - first };
  if (!best) return [{ text: value, radical: null }];
  const runs = []; let cursor = 0;
  best.indexes.forEach((index, radical) => { if (index > cursor) runs.push({ text: characters.slice(cursor, index).join(""), radical: null }); let end = index + 1; while (end < characters.length && /\p{M}/u.test(characters[end])) end += 1; runs.push({ text: characters.slice(index, end).join(""), radical }); cursor = end; });
  if (cursor < characters.length) runs.push({ text: characters.slice(cursor).join(""), radical: null });
  return runs;
}

function wordRuns(value, root, coloured, bold = false) {
  return textRuns(value, root, coloured).map(({ text, radical }) => `<w:r><w:rPr><w:rtl/>${bold ? "<w:b/>" : ""}${radical === null ? "" : `<w:color w:val="${ROOT_COLOURS[radical]}"/>`}</w:rPr><w:t xml:space="preserve">${escapeXml(text)}</w:t></w:r>`).join("");
}

function tableModel(table) {
  return {
    headers: [...table.querySelectorAll("thead tr:last-child th")].map((cell) => cell.textContent),
    rows: [...table.querySelectorAll("tbody tr")].map((row) => [...row.cells].map((cell) => cell.textContent)),
  };
}

function exportModel() {
  const sections = [...document.querySelectorAll(".result-section")];
  return {
    titles: sections.map((section) => section.querySelector("h2").textContent),
    verbs: sections.slice(0, 3).map((section) => tableModel(section.querySelector("table"))),
    derived: [...sections[3].querySelectorAll(".derived-card")].map((card) => ({ title: card.querySelector("h3").textContent, ...tableModel(card.querySelector("table")) })),
  };
}

function consolidatedVerbTable(verbs) {
  return {
    headers: [verbs[0].headers[0], ...verbs.flatMap(({ headers }) => headers.slice(1))],
    rows: verbs[0].rows.map((row, index) => [row[0], ...verbs.flatMap(({ rows }) => rows[index].slice(1))]),
  };
}

function wordTable(model, root, coloured) {
  const row = (cells, header = false) => `<w:tr>${header ? "<w:trPr><w:tblHeader/></w:trPr>" : ""}${cells.map((value, index) => `<w:tc><w:tcPr><w:bidiVisual/></w:tcPr><w:p><w:pPr><w:bidi/><w:jc w:val="${index === 0 && !header ? "right" : "center"}"/></w:pPr>${wordRuns(value, root, coloured && !header && index > 0, header)}</w:p></w:tc>`).join("")}</w:tr>`;
  return `<w:tbl><w:tblPr><w:bidiVisual/><w:tblBorders><w:top w:val="single" w:sz="4"/><w:left w:val="single" w:sz="4"/><w:bottom w:val="single" w:sz="4"/><w:right w:val="single" w:sz="4"/><w:insideH w:val="single" w:sz="4"/><w:insideV w:val="single" w:sz="4"/></w:tblBorders></w:tblPr>${row(model.headers, true)}${model.rows.map((cells) => row(cells)).join("")}</w:tbl>`;
}

function paragraph(value, style = "") {
  return `<w:p><w:pPr><w:bidi/><w:jc w:val="right"/>${style}</w:pPr><w:r><w:rPr><w:rtl/></w:rPr><w:t>${escapeXml(value)}</w:t></w:r></w:p>`;
}

function buildDocx(model, metadata, root, coloured, layout) {
  const landscape = layout === "landscape";
  const sectionProperties = `<w:sectPr><w:footerReference w:type="default" r:id="rId1"/><w:pgSz w:w="${landscape ? 15840 : 12240}" w:h="${landscape ? 12240 : 15840}"${landscape ? ' w:orient="landscape"' : ""}/><w:pgMar w:top="720" w:right="500" w:bottom="720" w:left="500" w:footer="360"/></w:sectPr>`;
  const meta = paragraph(`الجذر: ${root.join(" ")}    الباب: ${metadata.bab}    حرف الجزم: ${metadata.majzum}    حرف النصب: ${metadata.mansub}`);
  let content = meta;
  if (landscape) {
    content += paragraph("القسم 01–03 — الأفعال", '<w:keepNext/>') + wordTable(consolidatedVerbTable(model.verbs), root, coloured);
    content += '<w:p><w:r><w:br w:type="page"/></w:r></w:p>' + paragraph(model.titles[3]);
    for (const table of model.derived) content += paragraph(table.title) + wordTable(table, root, coloured);
  } else {
    model.verbs.forEach((table, index) => {
      if (index) content += '<w:p><w:r><w:br w:type="page"/></w:r></w:p>' + meta;
      content += paragraph(model.titles[index]) + wordTable(table, root, coloured);
    });
    content += '<w:p><w:r><w:br w:type="page"/></w:r></w:p>' + meta + paragraph(model.titles[3]);
    for (const table of model.derived) content += paragraph(table.title) + wordTable(table, root, coloured);
  }
  const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><w:body>${content}${sectionProperties}</w:body></w:document>`;
  const footerXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:ftr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:sz w:val="16"/></w:rPr><w:t>${escapeXml(EXPORT_FOOTER)}</w:t></w:r></w:p></w:ftr>`;
  return zipStore({
    "[Content_Types].xml": `<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/footer1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml"/></Types>`,
    "_rels/.rels": `<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>`,
    "word/document.xml": documentXml,
    "word/_rels/document.xml.rels": `<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/footer" Target="footer1.xml"/></Relationships>`,
    "word/footer1.xml": footerXml,
  });
}

function buildPdfFromJpegs(images) {
  const encoder = new TextEncoder();
  const chunks = [encoder.encode("%PDF-1.4\n%\xE2\xE3\xCF\xD3\n")];
  const offsets = [0];
  const objects = [];
  const pageRefs = images.map((_, index) => 3 + index * 3);
  objects.push(`<< /Type /Catalog /Pages 2 0 R >>`);
  objects.push(`<< /Type /Pages /Kids [${pageRefs.map((ref) => `${ref} 0 R`).join(" ")}] /Count ${images.length} >>`);
  images.forEach((image, index) => {
    const page = 3 + index * 3, content = page + 1, picture = page + 2;
    objects.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${image.width} ${image.height}] /Resources << /XObject << /Im${index} ${picture} 0 R >> >> /Contents ${content} 0 R >>`);
    const command = `q ${image.width} 0 0 ${image.height} 0 0 cm /Im${index} Do Q`;
    objects.push(`<< /Length ${command.length} >>\nstream\n${command}\nendstream`);
    objects.push({ binary: image.bytes, prefix: `<< /Type /XObject /Subtype /Image /Width ${image.pixelWidth} /Height ${image.pixelHeight} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${image.bytes.length} >>\nstream\n` });
  });
  let length = chunks[0].length;
  objects.forEach((object, index) => {
    offsets.push(length);
    const head = encoder.encode(`${index + 1} 0 obj\n`);
    const body = object.binary ? [encoder.encode(object.prefix), object.binary, encoder.encode("\nendstream")] : [encoder.encode(object)];
    const tail = encoder.encode("\nendobj\n");
    chunks.push(head, ...body, tail); length += head.length + body.reduce((sum, part) => sum + part.length, 0) + tail.length;
  });
  const xrefAt = length;
  let xref = `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (const offset of offsets.slice(1)) xref += `${String(offset).padStart(10, "0")} 00000 n \n`;
  xref += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefAt}\n%%EOF`;
  chunks.push(encoder.encode(xref));
  const output = new Uint8Array(chunks.reduce((sum, chunk) => sum + chunk.length, 0)); let at = 0; for (const chunk of chunks) { output.set(chunk, at); at += chunk.length; }
  return output;
}

function metadataNode(metadata, root) {
  const node = document.createElement("p");
  node.className = "export-metadata";
  node.textContent = `الجذر: ${root.join(" ")}    الباب: ${metadata.bab}    حرف الجزم: ${metadata.majzum}    حرف النصب: ${metadata.mansub}`;
  return node;
}

function buildPdfPages(metadata, root, layout) {
  const pages = [];
  const sections = [...document.querySelectorAll(".result-section")];
  const makePage = () => { const page = document.createElement("div"); page.className = `pdf-page ${layout}`; page.dir = "rtl"; page.append(metadataNode(metadata, root)); return page; };
  if (layout === "portrait") {
    for (const section of sections) { const page = makePage(); page.append(section.cloneNode(true)); pages.push(page); }
  } else {
    const page = makePage(); const heading = document.createElement("h2"); heading.textContent = "القسم 01–03 — الأفعال"; page.append(heading);
    const table = document.createElement("table"); const model = consolidatedVerbTable(exportModel().verbs);
    const makeRow = (values, heading = false) => { const row = document.createElement("tr"); values.forEach((value, index) => { const cell = document.createElement(heading ? "th" : "td"); if (heading || index === 0 || !document.querySelector("#colour-roots").checked) cell.textContent = value; else for (const run of window.SARF_PRESENTATION.splitRootRuns(value, root)) { const span = document.createElement("span"); span.textContent = run.text; if (run.radical !== null) span.className = `root-radical--${run.radical + 1}`; cell.append(span); } row.append(cell); }); return row; };
    const head = table.createTHead(); head.append(makeRow(model.headers, true)); const body = table.createTBody(); for (const row of model.rows) body.append(makeRow(row)); page.append(table); pages.push(page);
    const derived = makePage(); derived.append(sections[3].cloneNode(true)); pages.push(derived);
  }
  for (const page of pages) { const footer = document.createElement("footer"); footer.textContent = EXPORT_FOOTER; page.append(footer); }
  return pages;
}

async function pageToJpeg(page, layout) {
  const width = layout === "landscape" ? 1600 : 1200, height = layout === "landscape" ? 1131 : 1697;
  const css = `<style>*{box-sizing:border-box}body{margin:0}.pdf-page{position:relative;width:${width}px;height:${height}px;padding:45px 45px 75px;font-family:Calibri,"Segoe UI",Arial,sans-serif;background:white;color:#18332b;overflow:hidden}.pdf-page h2,.pdf-page h3{text-align:right}.pdf-page h2{font-size:25px}.pdf-page h3{font-size:21px;margin:14px 0 6px}.export-metadata{text-align:right;font-size:18px;border-bottom:1px solid #aaa;padding-bottom:12px}table{width:100%;border-collapse:collapse;table-layout:fixed;direction:rtl;margin-bottom:12px}th,td{border:1px solid #9aa;padding:5px 3px;text-align:center;font-size:${layout === "landscape" ? 13 : 18}px;line-height:1.45}th{background:#eef8f4}.derived-card td:first-child{text-align:right}.derived-card{margin-bottom:10px}.table-wrap{overflow:visible}.root-radical--1{color:#A12622}.root-radical--2{color:#075EA8}.root-radical--3{color:#4F6F12}footer{position:absolute;bottom:24px;left:30px;right:30px;border-top:1px solid #aaa;padding-top:8px;text-align:center;font-size:13px;color:#555}</style>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><foreignObject width="100%" height="100%"><body xmlns="http://www.w3.org/1999/xhtml">${css}${page.outerHTML}</body></foreignObject></svg>`;
  const image = new Image(); image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`; await image.decode();
  const canvas = document.createElement("canvas"); canvas.width = width; canvas.height = height; const context = canvas.getContext("2d"); context.fillStyle = "white"; context.fillRect(0, 0, width, height); context.drawImage(image, 0, 0);
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.94));
  return { bytes: new Uint8Array(await blob.arrayBuffer()), width: layout === "landscape" ? 842 : 595, height: layout === "landscape" ? 595 : 842, pixelWidth: width, pixelHeight: height };
}

function download(bytes, type, filename) {
  const url = URL.createObjectURL(new Blob([bytes], { type })); const anchor = document.createElement("a"); anchor.href = url; anchor.download = filename; anchor.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
}

if (typeof document !== "undefined") {
  document.querySelector("#download-results").addEventListener("click", async () => {
    const root = ["#root-one", "#root-two", "#root-three"].map((selector) => document.querySelector(selector).value.trim());
    const metadata = { bab: document.querySelector("#bab").selectedOptions[0].textContent, majzum: document.querySelector("#majzum-particle").value, mansub: document.querySelector("#mansub-particle").value };
    const coloured = document.querySelector("#colour-roots").checked;
    const format = document.querySelector('[name="export-format"]:checked').value, layout = document.querySelector('[name="export-layout"]:checked').value;
    if (format === "docx") download(buildDocx(exportModel(), metadata, root, coloured, layout), "application/vnd.openxmlformats-officedocument.wordprocessingml.document", sanitizeFilename(root, "docx"));
    else { const images = []; for (const page of buildPdfPages(metadata, root, layout)) images.push(await pageToJpeg(page, layout)); download(buildPdfFromJpegs(images), "application/pdf", sanitizeFilename(root, "pdf")); }
  });
}

if (typeof module !== "undefined") module.exports = { EXPORT_FOOTER, ROOT_COLOURS, buildDocx, buildPdfFromJpegs, consolidatedVerbTable, crc32, escapeXml, sanitizeFilename, zipStore };
