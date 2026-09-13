// Phase B10.8+: learner-facing Arabic terminology and Bāb-specific component labels.
(function exposeLearnerLabels(globalScope) {
  "use strict";

  const SECTION_LABELS = Object.freeze({
    section01: "Section 01 — Indicative & passive (القسم 01 — المرفوع والمجهول)",
    section02: "Section 02 — Jussive, subjunctive & emphasis (القسم 02 — المجزوم والمنصوب والتوكيد)",
    section03: "Section 03 — Commands (القسم 03 — فعل الأمر)",
    section04: "Section 04 — Derived forms (القسم 04 — المشتقات)",
  });

  const FORM_LABELS = Object.freeze({
    past: "Active past (الفعل الماضي المعلوم)",
    present: "Active present (الفعل المضارع المعلوم)",
    passivePast: "Passive past (الفعل الماضي المجهول)",
    passivePresent: "Passive present (الفعل المضارع المجهول)",
    majzumPresent: "Jussive present (الفعل المضارع المجزوم)",
    mansubPresent: "Subjunctive present (الفعل المضارع المنصوب)",
    heavyEmphatic: "Heavy emphasis (المضارع المؤكد بالنون الثقيلة)",
    lightEmphatic: "Light emphasis (المضارع المؤكد بالنون الخفيفة)",
    imperative: "Imperative (فعل الأمر)",
    heavyImperative: "Heavy-emphasis imperative (فعل الأمر بنون التوكيد الثقيلة)",
    lightImperative: "Light-emphasis imperative (فعل الأمر بنون التوكيد الخفيفة)",
    masdar: "Verbal noun / Maṣdar (المصدر)",
    activeParticiple: "Active participle (اسم الفاعل)",
    passiveParticiple: "Passive participle (اسم المفعول)",
    elative: "Elative (اسم التفضيل)",
    zarf: "Adverb of time/place (اسم الظرف)",
  });

  const NOMINAL_COMPONENT_PREFIX = /^(?:ا|و|ي|ن|ت|ة|ات)\s+of\b/i;
  const ARABIC_MARK = /\p{M}/u;

  // Past-tense learner decomposition shared by active and passive voice.
  // The ending carries the same person, number and gender information in
  // both voices; only the stem vocalization changes. Generated Arabic is untouched.
  const ACTIVE_PAST_ENDINGS = Object.freeze({
    1: Object.freeze([
      Object.freeze({ letters: 1, label: "This is the masculine dual subject marker (ألف الاثنين للمثنى المذكر الغائب)" }),
    ]),
    2: Object.freeze([
      Object.freeze({ letters: 2, label: "This is the masculine plural subject marker (واو الجماعة لجمع المذكر الغائب)" }),
    ]),
    3: Object.freeze([
      Object.freeze({ letters: 1, label: "This is the feminine singular marker (تاء التأنيث الساكنة للمفردة المؤنثة الغائبة)" }),
    ]),
    4: Object.freeze([
      Object.freeze({ letters: 1, label: "This is the feminine marker (تاء التأنيث)" }),
      Object.freeze({ letters: 1, label: "This is the feminine dual subject marker (ألف الاثنين للمثنى المؤنث الغائب)" }),
    ]),
    5: Object.freeze([
      Object.freeze({ letters: 1, label: "This is the feminine plural subject marker (نون النسوة لجمع المؤنث الغائب)" }),
    ]),
    6: Object.freeze([
      Object.freeze({ letters: 1, label: "This is the masculine singular مخاطب subject ending with fatḥah (تاء الفاعل للمخاطب المفرد المذكر)" }),
    ]),
    7: Object.freeze([
      Object.freeze({ letters: 1, label: "This is تاء الفاعل of the dual مخاطب ending (تاء الفاعل للمثنى المخاطب)" }),
      Object.freeze({ letters: 1, label: "This is م in the dual مخاطب ending (أنتما)" }),
      Object.freeze({ letters: 1, label: "This is ا of the dual مخاطب ending (أنتما)" }),
    ]),
    8: Object.freeze([
      Object.freeze({ letters: 1, label: "This is تاء الفاعل of the masculine plural مخاطب ending (تاء الفاعل لجمع المذكر المخاطب)" }),
      Object.freeze({ letters: 1, label: "This is م of the masculine plural مخاطب ending (أنتم)" }),
    ]),
    9: Object.freeze([
      Object.freeze({ letters: 1, label: "This is the feminine singular مخاطبة subject ending with kasrah (تاء الفاعل للمخاطبة المفردة المؤنثة)" }),
    ]),
    10: Object.freeze([
      Object.freeze({ letters: 1, label: "This is تاء الفاعل of the dual مخاطبة ending (تاء الفاعل للمثنى المخاطب)" }),
      Object.freeze({ letters: 1, label: "This is م in the dual مخاطبة ending (أنتما)" }),
      Object.freeze({ letters: 1, label: "This is ا of the dual مخاطبة ending (أنتما)" }),
    ]),
    11: Object.freeze([
      Object.freeze({ letters: 1, label: "This is تاء الفاعل of the feminine plural مخاطبة ending (تاء الفاعل لجمع المؤنث المخاطب)" }),
      Object.freeze({ letters: 1, label: "This is ن of the feminine plural مخاطبة ending (أنتنّ)" }),
    ]),
    12: Object.freeze([
      Object.freeze({ letters: 1, label: "This is the first-person singular subject ending with ḍammah (تاء الفاعل للمتكلم المفرد)" }),
    ]),
    13: Object.freeze([
      Object.freeze({ letters: 2, label: "This is the first-person plural subject ending (نا الفاعلين للمتكلمين)" }),
    ]),
  });

  function currentBabName() {
    const select = document.querySelector("#bab");
    const label = select?.selectedOptions?.[0]?.textContent || "";
    const [name] = label.split("—");
    return name.trim() || label.trim();
  }

  function relabelSelect(select, labels) {
    if (!select) return;
    for (const option of select.options) {
      const label = labels[option.value];
      if (label && option.textContent !== label) option.textContent = label;
    }
  }

  function relabelControls() {
    relabelSelect(document.querySelector("#explanation-section"), SECTION_LABELS);
    relabelSelect(document.querySelector("#explanation-field"), FORM_LABELS);
  }

  function arabicUnits(text) {
    const units = [];
    for (const char of Array.from(String(text || ""))) {
      if (ARABIC_MARK.test(char) && units.length) units[units.length - 1] += char;
      else units.push(char);
    }
    return units.filter((unit) => unit.trim());
  }

  function bareArabic(text) {
    return String(text || "").normalize("NFD").replace(/\p{M}/gu, "");
  }

  function makeStructureCard(source, arabic, labelText) {
    const card = source.cloneNode(true);
    card.dataset.semanticSplit = "true";
    const arabicNode = card.querySelector(".structure-run__arabic");
    const label = card.querySelector(".structure-run__label");
    if (arabicNode) arabicNode.textContent = arabic;
    if (label) {
      label.textContent = labelText;
      label.dir = "ltr";
    }
    return card;
  }

  function currentPastLayout() {
    if (document.querySelector("#explanation-section")?.value !== "section01") return null;
    const field = document.querySelector("#explanation-field")?.value;
    if (field !== "past" && field !== "passivePast") return null;
    const rowIndex = Number(document.querySelector("#explanation-row")?.value);
    return Number.isInteger(rowIndex) ? ACTIVE_PAST_ENDINGS[rowIndex] || null : null;
  }

  function splitReferenceAuditedPastEnding() {
    const layout = currentPastLayout();
    if (!layout) return false;

    const cards = Array.from(document.querySelectorAll("#explanation-output .structure-run"));
    if (cards.some((card) => card.dataset.semanticSplit === "true")) return false;

    const expectedLetters = layout.reduce((sum, part) => sum + part.letters, 0);
    const candidate = cards.find((card) => {
      const label = card.querySelector(".structure-run__label")?.textContent || "";
      const arabic = card.querySelector(".structure-run__arabic")?.textContent || "";
      const units = arabicUnits(arabic).filter((unit) => /\p{Script=Arabic}/u.test(unit));
      if (/root radical/i.test(label)) return false;
      if (/Hamzat al-/i.test(label)) return false;
      return units.length === expectedLetters;
    });
    if (!candidate) return false;

    const units = arabicUnits(candidate.querySelector(".structure-run__arabic")?.textContent)
      .filter((unit) => /\p{Script=Arabic}/u.test(unit));
    if (units.length !== expectedLetters) return false;

    const replacements = [];
    let offset = 0;
    for (const part of layout) {
      const value = units.slice(offset, offset + part.letters).join("");
      offset += part.letters;
      replacements.push(makeStructureCard(candidate, value, part.label));
    }
    candidate.replaceWith(...replacements);
    return true;
  }

  function relabelStructure() {
    splitReferenceAuditedPastEnding();
    const babName = currentBabName();
    if (!babName) return;
    for (const card of document.querySelectorAll("#explanation-output .structure-run")) {
      const label = card.querySelector(".structure-run__label");
      const arabic = card.querySelector(".structure-run__arabic")?.textContent?.trim();
      if (!label || !arabic) continue;
      const text = label.textContent.trim();
      if (/^Form\s+\d+\b/i.test(text)) {
        label.textContent = `This is ${arabic} of ${babName}`;
        label.dir = "ltr";
        continue;
      }
      if (!/^This is\b/i.test(text) && NOMINAL_COMPONENT_PREFIX.test(text)) {
        label.textContent = `This is ${text}`;
        label.dir = "ltr";
      }
    }
  }

  function apply() {
    relabelControls();
    relabelStructure();
  }

  function initialize() {
    const panel = document.querySelector("#explanation-panel");
    if (!panel) return;
    apply();
    let applying = false;
    const observer = new MutationObserver(() => {
      if (applying) return;
      applying = true;
      queueMicrotask(() => {
        apply();
        applying = false;
      });
    });
    observer.observe(panel, { childList: true, subtree: true });
    document.querySelector("#bab")?.addEventListener("change", apply);
    document.querySelector("#explanation-section")?.addEventListener("change", () => queueMicrotask(apply));
    document.querySelector("#explanation-field")?.addEventListener("change", () => queueMicrotask(apply));
    document.querySelector("#explanation-row")?.addEventListener("change", () => queueMicrotask(apply));
  }

  const api = Object.freeze({
    SECTION_LABELS,
    FORM_LABELS,
    NOMINAL_COMPONENT_PREFIX,
    ACTIVE_PAST_ENDINGS,
    arabicUnits,
    bareArabic,
    splitReferenceAuditedPastEnding,
    apply,
  });
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else {
    globalScope.SarfExplanationLearnerLabels = api;
    if (typeof document !== "undefined") initialize();
  }
})(typeof globalThis === "undefined" ? this : globalThis);
