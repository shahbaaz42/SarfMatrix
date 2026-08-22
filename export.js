(function initSarfExport(globalScope) {
  "use strict";

  const SECTION_TITLES = Object.freeze({
    section01: "القسم 01 — المرفوع والمجهول",
    section02: "القسم 02 — المجزوم والمنصوب والتوكيد",
    section03: "القسم 03 — فعل الأمر",
    section04: "القسم 04 — المشتقات",
  });
  const FOOTER = "Developed by Shahbaaz Ahmed | shahbaaz.education@gmail.com | © Shahbaaz Ahmed. All Rights Reserved.";
  const ROOT_COLOURS = ["C62828", "1565C0", "2E7D32"];
  const HEADINGS = Object.freeze({
    section01: ["الضمير", "الفعل الماضي المرفوع", "الفعل المضارع المرفوع", "الفعل الماضي المجهول", "الفعل المضارع المجهول"],
    section02: ["الضمير", "مجزوم المضارع", "منصوب المضارع", "لام تأكيد با نون تأكيد ثقيلة", "لام تأكيد با نون تأكيد خفيفة"],
    section03: ["الضمير", "فعل الامر", "فعل الامر با نون تأكيد ثقيلة", "فعل الامر با نون تأكيد خفيفة"],
    activeParticiple: ["الحالة", "مذكر مفرد", "مذكر مثنى", "مذكر جمع", "مؤنث مفرد", "مؤنث مثنى", "مؤنث جمع"],
    passiveParticiple: ["الحالة", "مذكر مفرد", "مذكر مثنى", "مذكر جمع", "مؤنث مفرد", "مؤنث مثنى", "مؤنث جمع"],
    elative: ["الخيار", "مذكر مفرد", "مذكر مثنى", "مذكر جمع", "مؤنث مفرد", "مؤنث مثنى", "مؤنث جمع"],
    zarf: ["الصيغة", "مفرد", "مثنى", "جمع"],
  });
  const DERIVED_TITLES = Object.freeze({ activeParticiple: "اسم الفاعل", passiveParticiple: "اسم المفعول", elative: "اسم التفضيل", zarf: "اسم الظرف" });

  function escapeXml(value) {
    return String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
  }

  function filenameFor(snapshot, format) {
    return `Sarf_${snapshot.root.join("")}.${format === "docx" ? "docx" : "pdf"}`;
  }

  function metadataRows(snapshot) {
    return [
      ["الجذر", snapshot.root.join("")],
      ["الباب", snapshot.babLabel],
      ["حرف الجزم", snapshot.majzumParticle],
      ["حرف النصب", snapshot.mansubParticle],
    ];
  }

  function metadataLine(snapshot) {
    return metadataRows(snapshot).map(([key, value]) => `${key}: ${value}`).join(" | ");
  }

  function morphologyCell(text, presentation) { return { text, presentation }; }

  function sectionRows(snapshot, key) {
    const rows = snapshot.sections[key];
    if (key === "section01") return rows.map((row) => [row.pronoun, morphologyCell(row.past, row.presentation.past), morphologyCell(row.present, row.presentation.present), morphologyCell(row.passivePast, row.presentation.passivePast), morphologyCell(row.passivePresent, row.presentation.passivePresent)]);
    if (key === "section02") return rows.map((row) => [row.pronoun, morphologyCell(row.majzumPresent, row.presentation.majzumPresent), morphologyCell(row.mansubPresent, row.presentation.mansubPresent), morphologyCell(row.heavyEmphatic, row.presentation.heavyEmphatic), morphologyCell(row.lightEmphatic, row.presentation.lightEmphatic)]);
    return rows.map((row) => [row.pronoun, morphologyCell(row.imperative, row.presentation.imperative), morphologyCell(row.heavyImperative, row.presentation.heavyImperative), morphologyCell(row.lightImperative, row.presentation.lightImperative)]);
  }

  function landscapeVerbTable(snapshot) {
    const headings = [HEADINGS.section01[0], ...HEADINGS.section01.slice(1), ...HEADINGS.section02.slice(1), ...HEADINGS.section03.slice(1)];
    const rows = snapshot.sections.section01.map((one, index) => {
      const two = snapshot.sections.section02[index];
      const three = snapshot.sections.section03[index];
      return [one.pronoun, morphologyCell(one.past, one.presentation.past), morphologyCell(one.present, one.presentation.present), morphologyCell(one.passivePast, one.presentation.passivePast), morphologyCell(one.passivePresent, one.presentation.passivePresent), morphologyCell(two.majzumPresent, two.presentation.majzumPresent), morphologyCell(two.mansubPresent, two.presentation.mansubPresent), morphologyCell(two.heavyEmphatic, two.presentation.heavyEmphatic), morphologyCell(two.lightEmphatic, two.presentation.lightEmphatic), morphologyCell(three.imperative, three.presentation.imperative), morphologyCell(three.heavyImperative, three.presentation.heavyImperative), morphologyCell(three.lightImperative, three.presentation.lightImperative)];
    });
    return { headings, rows };
  }

  function colouredHtml(cell, snapshot) {
    if (!snapshot.presentation.colourRootLetters || !cell.text) return escapeXml(cell.text ?? "");
    return cell.presentation.runs.map((run) => run.radicalIndex
      ? `<span style="color:#${ROOT_COLOURS[run.radicalIndex - 1]}">${escapeXml(run.text)}</span>`
      : escapeXml(run.text)).join("");
  }

  function htmlTable(headings, rows, snapshot, derived = false) {
    const head = headings.map((heading) => `<th>${escapeXml(heading)}</th>`).join("");
    const body = rows.map((row) => `<tr>${row.map((value, index) => `<td class="${index === 0 ? "category" : "morphology"}">${index === 0 ? escapeXml(value ?? "") : colouredHtml(value, snapshot)}</td>`).join("")}</tr>`).join("");
    return `<table class="${derived ? "derived-table" : "verb-table"}" dir="rtl"><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table>`;
  }

  function metadataHtml(snapshot) {
    return `<p class="metadata" dir="rtl">${escapeXml(metadataLine(snapshot))}</p>`;
  }

  function derivedHtml(snapshot, keys) {
    return keys.map((key) => {
      const rows = snapshot.sections.section04[key].map(({ label, values, presentations }) => [label, ...values.map((value, index) => morphologyCell(value, presentations[index]))]);
      return `<section class="derived"><h2>${DERIVED_TITLES[key]}</h2>${htmlTable(HEADINGS[key], rows, snapshot, true)}</section>`;
    }).join("");
  }

  function pageShell(snapshot, body, pageClass = "") {
    return `<article class="export-page ${pageClass}">${metadataHtml(snapshot)}<main>${body}</main><footer>${escapeXml(FOOTER)}</footer></article>`;
  }

  function buildExportPages(snapshot, layout = "portrait") {
    if (layout === "landscape") {
      const verbs = landscapeVerbTable(snapshot);
      return [
        pageShell(snapshot, htmlTable(verbs.headings, verbs.rows, snapshot), "landscape verb-page"),
        pageShell(snapshot, `<h1>${SECTION_TITLES.section04}</h1>${derivedHtml(snapshot, ["activeParticiple", "passiveParticiple"])}`, "landscape section04-page"),
        pageShell(snapshot, `<h1>${SECTION_TITLES.section04}</h1>${derivedHtml(snapshot, ["elative", "zarf"])}`, "landscape section04-page"),
      ];
    }
    return ["section01", "section02", "section03"].map((key) => pageShell(snapshot, `<h1>${SECTION_TITLES[key]}</h1>${htmlTable(HEADINGS[key], sectionRows(snapshot, key), snapshot)}`, `${key}-page`)).concat([
      pageShell(snapshot, `<h1>${SECTION_TITLES.section04}</h1>${derivedHtml(snapshot, ["activeParticiple", "passiveParticiple"])}`, "section04-page"),
      pageShell(snapshot, `<h1>${SECTION_TITLES.section04}</h1>${derivedHtml(snapshot, ["elative", "zarf"])}`, "section04-page"),
    ]);
  }

  const PAGE_CSS = `
    *{box-sizing:border-box}body{margin:0;font-family:Calibri,"Segoe UI",Arial,sans-serif;background:#fff;color:#172f28}
    .export-page{position:relative;width:100%;height:100%;padding:48px 42px 68px;overflow:hidden;background:#fff}
    h1,h2{text-align:right;margin:10px 0;direction:rtl}h1{font-size:25px}h2{font-size:20px}
    .metadata{margin:0 0 12px;font-size:13px;text-align:right;direction:rtl;white-space:nowrap}
    table{width:100%;border-collapse:collapse;table-layout:fixed;direction:rtl;margin-bottom:14px}
    th,td{border:1px solid #b7cbc4;padding:5px 3px;text-align:center;vertical-align:middle;direction:rtl}
    th{background:#edf6f3;color:#405e54;font-size:14px}.category{text-align:center;font-size:18.5px}.derived-table .category{text-align:right}.morphology{font-size:18.5px;font-weight:700}
    .verb-page th{font-size:8px}.verb-page td{font-size:10px;padding:3px 1px}.verb-page .category{font-size:10px;text-align:center}
    .derived{break-inside:avoid}footer{position:absolute;bottom:22px;left:20px;right:20px;text-align:center;color:#536b63;font-size:11px}
  `;

  function htmlToSvg(pageHtml, width, height) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><foreignObject width="100%" height="100%"><div xmlns="http://www.w3.org/1999/xhtml" style="width:${width}px;height:${height}px"><style>${PAGE_CSS}</style>${pageHtml}</div></foreignObject></svg>`;
  }

  async function rasterizePage(pageHtml, width, height) {
    const svg = htmlToSvg(pageHtml, width, height);
    if (document.fonts && document.fonts.ready) await document.fonts.ready;
    const image = new Image();
    const dataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
    await new Promise((resolve, reject) => {
      image.onload = resolve;
      image.onerror = () => reject(new Error("The browser could not render the Arabic SVG export page."));
      image.src = dataUrl;
    });
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("The browser did not provide a 2D canvas context.");
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, width, height);
    context.drawImage(image, 0, 0, width, height);
    const jpegBlob = await new Promise((resolve, reject) => canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("The browser could not encode the PDF page as JPEG.")), "image/jpeg", 0.92));
    return new Uint8Array(await jpegBlob.arrayBuffer());
  }

  function asciiBytes(value) { return Uint8Array.from(value, (character) => character.charCodeAt(0) & 0xff); }
  function concatBytes(parts) {
    const length = parts.reduce((sum, part) => sum + part.length, 0);
    const result = new Uint8Array(length);
    let offset = 0;
    for (const part of parts) { result.set(part, offset); offset += part.length; }
    return result;
  }

  function buildPdfDocument(images, layout = "portrait") {
    const landscape = layout === "landscape";
    const pageWidth = landscape ? 842 : 595;
    const pageHeight = landscape ? 595 : 842;
    const objects = [];
    const add = (bytes) => { objects.push(typeof bytes === "string" ? asciiBytes(bytes) : bytes); return objects.length; };
    const catalogId = add("");
    const pagesId = add("");
    const pageIds = [];
    images.forEach((jpeg, index) => {
      const imageId = add(concatBytes([asciiBytes(`<< /Type /XObject /Subtype /Image /Width ${landscape ? 1123 : 794} /Height ${landscape ? 794 : 1123} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpeg.length} >>\nstream\n`), jpeg, asciiBytes("\nendstream")]));
      const command = `q ${pageWidth} 0 0 ${pageHeight} 0 0 cm /Im${index + 1} Do Q`;
      const contentId = add(`<< /Length ${command.length} >>\nstream\n${command}\nendstream`);
      const pageId = add(`<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /XObject << /Im${index + 1} ${imageId} 0 R >> >> /Contents ${contentId} 0 R >>`);
      pageIds.push(pageId);
    });
    objects[catalogId - 1] = asciiBytes(`<< /Type /Catalog /Pages ${pagesId} 0 R >>`);
    objects[pagesId - 1] = asciiBytes(`<< /Type /Pages /Count ${pageIds.length} /Kids [${pageIds.map((id) => `${id} 0 R`).join(" ")}] >>`);
    const chunks = [asciiBytes("%PDF-1.4\n%\xE2\xE3\xCF\xD3\n")];
    const offsets = [0];
    let offset = chunks[0].length;
    objects.forEach((object, index) => {
      offsets.push(offset);
      const wrapped = concatBytes([asciiBytes(`${index + 1} 0 obj\n`), object, asciiBytes("\nendobj\n")]);
      chunks.push(wrapped);
      offset += wrapped.length;
    });
    const xrefOffset = offset;
    const xref = [`xref\n0 ${objects.length + 1}\n`, "0000000000 65535 f \n", ...offsets.slice(1).map((value) => `${String(value).padStart(10, "0")} 00000 n \n`)].join("");
    chunks.push(asciiBytes(xref + `trailer\n<< /Size ${objects.length + 1} /Root ${catalogId} 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`));
    return concatBytes(chunks);
  }

  function crc32(bytes) {
    let crc = 0xffffffff;
    for (const byte of bytes) {
      crc ^= byte;
      for (let bit = 0; bit < 8; bit += 1) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0);
    }
    return (crc ^ 0xffffffff) >>> 0;
  }
  function little(value, size) { const bytes = new Uint8Array(size); for (let i = 0; i < size; i += 1) bytes[i] = (value >>> (8 * i)) & 0xff; return bytes; }
  function utf8(value) { return new TextEncoder().encode(value); }

  function createZip(files) {
    const locals = [];
    const centrals = [];
    let offset = 0;
    for (const [name, content] of Object.entries(files)) {
      const nameBytes = utf8(name);
      const data = typeof content === "string" ? utf8(content) : content;
      const crc = crc32(data);
      const local = concatBytes([little(0x04034b50, 4), little(20, 2), little(0x0800, 2), little(0, 2), little(0, 2), little(0, 2), little(crc, 4), little(data.length, 4), little(data.length, 4), little(nameBytes.length, 2), little(0, 2), nameBytes, data]);
      locals.push(local);
      centrals.push(concatBytes([little(0x02014b50, 4), little(20, 2), little(20, 2), little(0x0800, 2), little(0, 2), little(0, 2), little(0, 2), little(crc, 4), little(data.length, 4), little(data.length, 4), little(nameBytes.length, 2), little(0, 2), little(0, 2), little(0, 2), little(0, 2), little(0, 4), little(offset, 4), nameBytes]));
      offset += local.length;
    }
    const central = concatBytes(centrals);
    return concatBytes([...locals, central, little(0x06054b50, 4), little(0, 2), little(0, 2), little(centrals.length, 2), little(centrals.length, 2), little(central.length, 4), little(offset, 4), little(0, 2)]);
  }

  function wordRuns(cell, snapshot, colour = true) {
    const normalized = cell && typeof cell === "object" ? cell : { text: cell ?? "", presentation: null };
    const runs = colour && snapshot.presentation.colourRootLetters && normalized.text
      ? normalized.presentation.runs
      : [{ text: normalized.text, radicalIndex: null }];
    return runs.map((run) => `<w:r><w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri" w:cs="Calibri"/><w:sz w:val="28"/><w:szCs w:val="28"/>${run.radicalIndex ? `<w:color w:val="${ROOT_COLOURS[run.radicalIndex - 1]}"/>` : ""}<w:rtl/></w:rPr><w:t xml:space="preserve">${escapeXml(run.text)}</w:t></w:r>`).join("");
  }
  function wordParagraph(value, snapshot, colour = true, align = "center") { return `<w:p><w:pPr><w:bidi/><w:jc w:val="${align}"/></w:pPr>${wordRuns(value, snapshot, colour)}</w:p>`; }
  function wordTable(headings, rows, snapshot, derived = false) {
    const rowXml = (cells, heading = false) => `<w:tr>${cells.map((cell, index) => `<w:tc><w:tcPr><w:textDirection w:val="lrTb"/>${heading ? "<w:shd w:fill=\"EDF6F3\"/>" : ""}</w:tcPr>${wordParagraph(cell, snapshot, !heading && index > 0, derived && index === 0 && !heading ? "right" : "center")}</w:tc>`).join("")}</w:tr>`;
    const tableGrid = `<w:tblGrid>${headings.map(() => "<w:gridCol/>").join("")}</w:tblGrid>`;
    return `<w:tbl><w:tblPr><w:bidiVisual/><w:tblW w:w="0" w:type="auto"/><w:tblBorders><w:top w:val="single" w:sz="4"/><w:left w:val="single" w:sz="4"/><w:bottom w:val="single" w:sz="4"/><w:right w:val="single" w:sz="4"/><w:insideH w:val="single" w:sz="4"/><w:insideV w:val="single" w:sz="4"/></w:tblBorders></w:tblPr>${tableGrid}${rowXml(headings, true)}${rows.map((row) => rowXml(row)).join("")}</w:tbl>`;
  }
  function wordHeading(value) { return `<w:p><w:pPr><w:bidi/><w:jc w:val="right"/><w:keepNext/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="30"/><w:rtl/></w:rPr><w:t>${escapeXml(value)}</w:t></w:r></w:p>`; }
  function pageBreak() { return "<w:p><w:r><w:br w:type=\"page\"/></w:r></w:p>"; }
  function wordMetadata(snapshot) { return wordParagraph(metadataLine(snapshot), snapshot, false, "right"); }
  function wordDerived(snapshot, keys) { return keys.map((key) => wordHeading(DERIVED_TITLES[key]) + wordTable(HEADINGS[key], snapshot.sections.section04[key].map(({ label, values, presentations }) => [label, ...values.map((value, index) => morphologyCell(value, presentations[index]))]), snapshot, true)).join(""); }

  function buildDocx(snapshot, layout = "portrait") {
    let body = "";
    if (layout === "landscape") {
      const verbs = landscapeVerbTable(snapshot);
      body += wordMetadata(snapshot) + wordTable(verbs.headings, verbs.rows, snapshot);
      body += pageBreak() + wordMetadata(snapshot) + wordHeading(SECTION_TITLES.section04) + wordDerived(snapshot, ["activeParticiple", "passiveParticiple", "elative", "zarf"]);
    } else {
      ["section01", "section02", "section03"].forEach((key, index) => { if (index) body += pageBreak(); body += wordMetadata(snapshot) + wordHeading(SECTION_TITLES[key]) + wordTable(HEADINGS[key], sectionRows(snapshot, key), snapshot); });
      body += pageBreak() + wordMetadata(snapshot) + wordHeading(SECTION_TITLES.section04) + wordDerived(snapshot, ["activeParticiple", "passiveParticiple", "elative", "zarf"]);
    }
    const orientation = layout === "landscape" ? 'w:w="15840" w:h="12240" w:orient="landscape"' : 'w:w="12240" w:h="15840"';
    const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><w:body>${body}<w:sectPr><w:footerReference w:type="default" r:id="rId1"/><w:pgSz ${orientation}/><w:pgMar w:top="720" w:right="540" w:bottom="720" w:left="540" w:footer="300"/></w:sectPr></w:body></w:document>`;
    const footerXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:ftr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/></w:rPr><w:t>${escapeXml(FOOTER)}</w:t></w:r></w:p></w:ftr>`;
    return createZip({
      "[Content_Types].xml": `<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/footer1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml"/></Types>`,
      "_rels/.rels": `<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>`,
      "word/_rels/document.xml.rels": `<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/footer" Target="footer1.xml"/></Relationships>`,
      "word/document.xml": documentXml,
      "word/footer1.xml": footerXml,
    });
  }

  function save(bytes, name, type) {
    const url = URL.createObjectURL(new Blob([bytes], { type }));
    const anchor = document.createElement("a");
    anchor.href = url; anchor.download = name;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async function download(snapshot, { format = "pdf", layout = "portrait" } = {}) {
    if (format === "docx") {
      const name = filenameFor(snapshot, format);
      save(buildDocx(snapshot, layout), name, "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
      return name;
    }
    const landscape = layout === "landscape";
    const width = landscape ? 1123 : 794;
    const height = landscape ? 794 : 1123;
    const images = [];
    for (const page of buildExportPages(snapshot, layout)) images.push(await rasterizePage(page, width, height));
    const name = filenameFor(snapshot, format);
    save(buildPdfDocument(images, layout), name, "application/pdf");
    return name;
  }

  const api = { SECTION_TITLES, FOOTER, HEADINGS, filenameFor, metadataRows, metadataLine, landscapeVerbTable, buildExportPages, buildDocx, buildPdfDocument, createZip, download };
  if (typeof module !== "undefined") module.exports = api;
  globalScope.SarfExport = api;
}(typeof window !== "undefined" ? window : globalThis));
