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

  // Active-past learner decomposition, aligned to the repository references.
  // The source material explicitly treats perfect-tense endings as the carriers
  // of person, gender and number. We therefore separate learner-visible ending
  // components without changing the generated Arabic surface.
  const ACTIVE_PAST_ENDINGS = Object.freeze({
    3: Object.freeze([
      Object.freeze({ letters: 1, label: "This is ت of the feminine marker (تاء التأنيث)" }),
    ]),
    4: Object.freeze([
      Object.freeze({ letters: 1, label: "This is ت of the feminine marker (تاء التأنيث)" }),
      Object.freeze({ letters: 1, label: "This is ا of the dual marker (ألف الاثنين)" }),
    ]),
    6: Object.freeze([
      Object.freeze({ letters: 1, label: "This is ت of the مخاطب subject ending (تاء الفاعل للمخاطب)" }),
    ]),
    7: Object.freeze([
      Object.freeze({ letters: 1, label: "This is ت of the مخاطب subject ending (تاء الفاعل للمخاطب)" }),
      Object.freeze({ letters: 1, label: "This is م in the dual مخاطب ending (أنتما)" }),
      Object.freeze({ letters: 1, label: "This is ا of the dual marker (ألف الاثنين)" }),
    ]),
    8: Object.freeze([
      Object.freeze({ letters: 1, label: "This is ت of the مخاطب subject ending (تاء الفاعل للمخاطب)" }),
      Object.freeze({ letters: 1, label: "This is م of the masculine-plural مخاطب ending (أنتم)" }),
    ]),
    9: Object.freeze([
      Object.freeze({ letters: 1, label: "This is ت of the مخاطب subject ending (تاء الفاعل للمخاطب)" }),
    ]),
    10: Object.freeze([
      Object.freeze({ letters: 1, label: "This is ت of the مخاطب subject ending (تاء الفاعل للمخاطب)" }),
      Object.freeze({ letters: 1, label: "This is م in the dual مخاطب ending (أنتما)" }),
      Object.freeze({ letters: 1, label: "This is ا of the dual marker (ألف الاثنين)" }),
    ]),
    11: Object.freeze([
      Object.freeze({ letters: 1, label: "This is ت of the مخاطب subject ending (تاء الفاعل للمخاطب)" }),
      Object.freeze({ letters: 1, label: "This is ن of the feminine-plural مخاطب ending (أنتنّ)" }),
    ]),
    12: Object.freeze([
      Object.freeze({ letters: 1, label: "This is ت of the speaker subject ending (تاء الفاعل للمتكلم)" }),
    ]),
    13: Object.freeze([
      Object.freeze({ letters: 2, label: "This is نا of the speaker subject ending (نا الفاعلين)" }),
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

  function currentActivePastLayout() {
    if (document.querySelector("#explanation-section")?.value !== "section01") return null;
    if (document.querySelector("#explanation-field")?.value !== "past") return null;
    const rowIndex = Number(document.querySelector("#explanation-row")?.value);
    return Number.isInteger(rowIndex) ? ACTIVE_PAST_ENDINGS[rowIndex] || null : null;
  }

  function splitReferenceAuditedPastEnding() {
    const layout = currentActivePastLayout();
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
