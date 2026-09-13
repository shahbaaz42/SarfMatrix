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
  const ACTIVE_PAST_ENDINGS = Object.freeze({
    1: Object.freeze([Object.freeze({ letters: 1, label: "This is the masculine dual subject marker (ألف الاثنين للمثنى المذكر الغائب)" })]),
    2: Object.freeze([Object.freeze({ letters: 2, label: "This is the masculine plural subject marker (واو الجماعة لجمع المذكر الغائب)" })]),
    3: Object.freeze([Object.freeze({ letters: 1, label: "This is the feminine singular marker (تاء التأنيث الساكنة للمفردة المؤنثة الغائبة)" })]),
    4: Object.freeze([
      Object.freeze({ letters: 1, label: "This is the feminine marker (تاء التأنيث)" }),
      Object.freeze({ letters: 1, label: "This is the feminine dual subject marker (ألف الاثنين للمثنى المؤنث الغائب)" }),
    ]),
    5: Object.freeze([Object.freeze({ letters: 1, label: "This is the feminine plural subject marker (نون النسوة لجمع المؤنث الغائب)" })]),
    6: Object.freeze([Object.freeze({ letters: 1, label: "This is the masculine singular addressee subject ending with fatḥah (تاء الفاعل للمخاطب المفرد المذكر)" })]),
    7: Object.freeze([
      Object.freeze({ letters: 1, label: "This is ت of the masculine dual addressee subject ending (تاء الفاعل للمثنى المخاطب)" }),
      Object.freeze({ letters: 1, label: "This is م of the masculine dual addressee ending (أنتما)" }),
      Object.freeze({ letters: 1, label: "This is ا of the masculine dual addressee ending (أنتما)" }),
    ]),
    8: Object.freeze([
      Object.freeze({ letters: 1, label: "This is ت of the masculine plural addressee subject ending (تاء الفاعل لجمع المذكر المخاطب)" }),
      Object.freeze({ letters: 1, label: "This is م of the masculine plural addressee ending (أنتم)" }),
    ]),
    9: Object.freeze([Object.freeze({ letters: 1, label: "This is the feminine singular addressee subject ending with kasrah (تاء الفاعل للمخاطبة المفردة المؤنثة)" })]),
    10: Object.freeze([
      Object.freeze({ letters: 1, label: "This is ت of the feminine dual addressee subject ending (تاء الفاعل للمثنى المخاطب)" }),
      Object.freeze({ letters: 1, label: "This is م of the feminine dual addressee ending (أنتما)" }),
      Object.freeze({ letters: 1, label: "This is ا of the feminine dual addressee ending (أنتما)" }),
    ]),
    11: Object.freeze([
      Object.freeze({ letters: 1, label: "This is ت of the feminine plural addressee subject ending (تاء الفاعل لجمع المؤنث المخاطب)" }),
      Object.freeze({ letters: 1, label: "This is ن of the feminine plural addressee ending (أنتنّ)" }),
    ]),
    12: Object.freeze([Object.freeze({ letters: 1, label: "This is the first-person singular subject ending with ḍammah (تاء الفاعل للمتكلم المفرد)" })]),
    13: Object.freeze([Object.freeze({ letters: 2, label: "This is the first-person plural subject ending (نا الفاعلين للمتكلمين)" })]),
  });

  // Active/passive indicative-present identities. Prefixes encode person and
  // often gender/number; the five verbs retain nūn as the indicative marker.
  const PRESENT_LAYOUTS = Object.freeze([
    Object.freeze({ prefix: "This is the third-person masculine singular present prefix ي (ياء المضارعة للغائب المفرد المذكر)", ending: null }),
    Object.freeze({ prefix: "This is the third-person masculine dual present prefix ي (ياء المضارعة للمثنى المذكر الغائب)", ending: Object.freeze([
      Object.freeze({ letters: 1, label: "This is ا of the masculine dual subject (ألف الاثنين)" }),
      Object.freeze({ letters: 1, label: "This is ن of the indicative five-verbs ending (نون الرفع في الأفعال الخمسة)" }),
    ]) }),
    Object.freeze({ prefix: "This is the third-person masculine plural present prefix ي (ياء المضارعة لجمع المذكر الغائب)", ending: Object.freeze([
      Object.freeze({ letters: 1, label: "This is و of the masculine plural subject (واو الجماعة)" }),
      Object.freeze({ letters: 1, label: "This is ن of the indicative five-verbs ending (نون الرفع في الأفعال الخمسة)" }),
    ]) }),
    Object.freeze({ prefix: "This is the third-person feminine singular present prefix ت (تاء المضارعة للغائبة المفردة المؤنثة)", ending: null }),
    Object.freeze({ prefix: "This is the third-person feminine dual present prefix ت (تاء المضارعة للمثنى المؤنث الغائب)", ending: Object.freeze([
      Object.freeze({ letters: 1, label: "This is ا of the feminine dual subject (ألف الاثنين)" }),
      Object.freeze({ letters: 1, label: "This is ن of the indicative five-verbs ending (نون الرفع في الأفعال الخمسة)" }),
    ]) }),
    Object.freeze({ prefix: "This is the third-person feminine plural present prefix ي (ياء المضارعة لجمع المؤنث الغائب)", ending: Object.freeze([
      Object.freeze({ letters: 1, label: "This is the feminine plural subject marker (نون النسوة)" }),
    ]) }),
    Object.freeze({ prefix: "This is the masculine singular addressee present prefix ت (تاء المضارعة للمخاطب المفرد المذكر)", ending: null }),
    Object.freeze({ prefix: "This is the masculine dual addressee present prefix ت (تاء المضارعة للمثنى المخاطب المذكر)", ending: Object.freeze([
      Object.freeze({ letters: 1, label: "This is ا of the masculine dual addressee subject (ألف الاثنين)" }),
      Object.freeze({ letters: 1, label: "This is ن of the indicative five-verbs ending (نون الرفع في الأفعال الخمسة)" }),
    ]) }),
    Object.freeze({ prefix: "This is the masculine plural addressee present prefix ت (تاء المضارعة لجمع المذكر المخاطب)", ending: Object.freeze([
      Object.freeze({ letters: 1, label: "This is و of the masculine plural addressee subject (واو الجماعة)" }),
      Object.freeze({ letters: 1, label: "This is ن of the indicative five-verbs ending (نون الرفع في الأفعال الخمسة)" }),
    ]) }),
    Object.freeze({ prefix: "This is the feminine singular addressee present prefix ت (تاء المضارعة للمخاطبة المفردة المؤنثة)", ending: Object.freeze([
      Object.freeze({ letters: 1, label: "This is ي of the feminine singular addressee subject (ياء المخاطبة)" }),
      Object.freeze({ letters: 1, label: "This is ن of the indicative five-verbs ending (نون الرفع في الأفعال الخمسة)" }),
    ]) }),
    Object.freeze({ prefix: "This is the feminine dual addressee present prefix ت (تاء المضارعة للمثنى المخاطب المؤنث)", ending: Object.freeze([
      Object.freeze({ letters: 1, label: "This is ا of the feminine dual addressee subject (ألف الاثنين)" }),
      Object.freeze({ letters: 1, label: "This is ن of the indicative five-verbs ending (نون الرفع في الأفعال الخمسة)" }),
    ]) }),
    Object.freeze({ prefix: "This is the feminine plural addressee present prefix ت (تاء المضارعة لجمع المؤنث المخاطب)", ending: Object.freeze([
      Object.freeze({ letters: 1, label: "This is the feminine plural addressee subject marker (نون النسوة)" }),
    ]) }),
    Object.freeze({ prefix: "This is the first-person singular present prefix أ (همزة المضارعة للمتكلم المفرد)", ending: null }),
    Object.freeze({ prefix: "This is the first-person plural present prefix ن (نون المضارعة للمتكلمين)", ending: null }),
  ]);

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

  function currentPresentLayout() {
    if (document.querySelector("#explanation-section")?.value !== "section01") return null;
    const field = document.querySelector("#explanation-field")?.value;
    if (field !== "present" && field !== "passivePresent") return null;
    const rowIndex = Number(document.querySelector("#explanation-row")?.value);
    return Number.isInteger(rowIndex) ? PRESENT_LAYOUTS[rowIndex] || null : null;
  }

  function isLexicalOrDerivationalCard(card) {
    const label = card.querySelector(".structure-run__label")?.textContent || "";
    if (/root radical/i.test(label)) return true;
    if (/Hamzat al-/i.test(label)) return true;
    if (/باب|Form\s+\d+/i.test(label)) return true;
    return false;
  }

  function isPastEndingCard(card) {
    const arabic = card.querySelector(".structure-run__arabic")?.textContent || "";
    if (!/\p{Script=Arabic}/u.test(arabic)) return false;
    return !isLexicalOrDerivationalCard(card);
  }

  function splitReferenceAuditedPastEnding() {
    const layout = currentPastLayout();
    if (!layout) return false;
    const cards = Array.from(document.querySelectorAll("#explanation-output .structure-run"));
    if (cards.some((card) => card.dataset.semanticSplit === "true")) return false;
    const expectedLetters = layout.reduce((sum, part) => sum + part.letters, 0);
    const candidate = cards.find((card) => {
      if (!isPastEndingCard(card)) return false;
      const arabic = card.querySelector(".structure-run__arabic")?.textContent || "";
      const units = arabicUnits(arabic).filter((unit) => /\p{Script=Arabic}/u.test(unit));
      return units.length === expectedLetters;
    });
    if (!candidate) return false;
    const units = arabicUnits(candidate.querySelector(".structure-run__arabic")?.textContent).filter((unit) => /\p{Script=Arabic}/u.test(unit));
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

  function relabelAlreadySplitPastEnding() {
    const layout = currentPastLayout();
    if (!layout || layout.length < 2) return false;
    const cards = Array.from(document.querySelectorAll("#explanation-output .structure-run")).filter(isPastEndingCard);
    if (cards.length !== layout.length) return false;
    for (let i = 0; i < layout.length; i += 1) {
      const units = arabicUnits(cards[i].querySelector(".structure-run__arabic")?.textContent).filter((unit) => /\p{Script=Arabic}/u.test(unit));
      if (units.length !== layout[i].letters) return false;
    }
    let changed = false;
    cards.forEach((card, index) => {
      const label = card.querySelector(".structure-run__label");
      if (!label) return;
      if (label.textContent !== layout[index].label) {
        label.textContent = layout[index].label;
        changed = true;
      }
      if (label.dir !== "ltr") label.dir = "ltr";
      card.dataset.semanticSplit = "true";
    });
    return changed;
  }

  function relabelPresentPrefix() {
    const layout = currentPresentLayout();
    if (!layout) return false;
    const card = Array.from(document.querySelectorAll("#explanation-output .structure-run")).find((candidate) => {
      const label = candidate.querySelector(".structure-run__label")?.textContent || "";
      return /Present-tense prefix|present prefix/i.test(label);
    });
    if (!card) return false;
    const label = card.querySelector(".structure-run__label");
    if (!label || label.textContent === layout.prefix) return false;
    label.textContent = layout.prefix;
    label.dir = "ltr";
    card.dataset.presentPrefix = "true";
    return true;
  }

  function isPresentEndingCard(card) {
    if (card.dataset.presentPrefix === "true") return false;
    const label = card.querySelector(".structure-run__label")?.textContent || "";
    const arabic = card.querySelector(".structure-run__arabic")?.textContent || "";
    if (!/\p{Script=Arabic}/u.test(arabic)) return false;
    if (/Present-tense prefix|present prefix/i.test(label)) return false;
    return !isLexicalOrDerivationalCard(card);
  }

  function applyPresentEndingLayout() {
    const layout = currentPresentLayout();
    if (!layout?.ending) return false;
    const cards = Array.from(document.querySelectorAll("#explanation-output .structure-run")).filter(isPresentEndingCard);
    if (!cards.length) return false;

    const expectedLetters = layout.ending.reduce((sum, part) => sum + part.letters, 0);
    if (cards.length === layout.ending.length) {
      let compatible = true;
      for (let i = 0; i < cards.length; i += 1) {
        const units = arabicUnits(cards[i].querySelector(".structure-run__arabic")?.textContent).filter((unit) => /\p{Script=Arabic}/u.test(unit));
        if (units.length !== layout.ending[i].letters) compatible = false;
      }
      if (compatible) {
        let changed = false;
        cards.forEach((card, index) => {
          const label = card.querySelector(".structure-run__label");
          if (label && label.textContent !== layout.ending[index].label) {
            label.textContent = layout.ending[index].label;
            label.dir = "ltr";
            changed = true;
          }
          card.dataset.semanticSplit = "true";
        });
        return changed;
      }
    }

    const candidate = cards.find((card) => {
      const units = arabicUnits(card.querySelector(".structure-run__arabic")?.textContent).filter((unit) => /\p{Script=Arabic}/u.test(unit));
      return units.length === expectedLetters;
    });
    if (!candidate) return false;
    const units = arabicUnits(candidate.querySelector(".structure-run__arabic")?.textContent).filter((unit) => /\p{Script=Arabic}/u.test(unit));
    const replacements = [];
    let offset = 0;
    for (const part of layout.ending) {
      replacements.push(makeStructureCard(candidate, units.slice(offset, offset + part.letters).join(""), part.label));
      offset += part.letters;
    }
    candidate.replaceWith(...replacements);
    return true;
  }

  function relabelStructure() {
    splitReferenceAuditedPastEnding();
    relabelAlreadySplitPastEnding();
    relabelPresentPrefix();
    applyPresentEndingLayout();

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
    PRESENT_LAYOUTS,
    arabicUnits,
    bareArabic,
    splitReferenceAuditedPastEnding,
    relabelAlreadySplitPastEnding,
    relabelPresentPrefix,
    applyPresentEndingLayout,
    apply,
  });
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else {
    globalScope.SarfExplanationLearnerLabels = api;
    if (typeof document !== "undefined") initialize();
  }
})(typeof globalThis === "undefined" ? this : globalThis);