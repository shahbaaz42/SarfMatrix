// Learner-facing terminology and morphology labels.
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

  const ACTIVE_PAST_ENDINGS = Object.freeze({
    1: [{ letters: 1, label: "This is the masculine dual subject marker (ألف الاثنين للمثنى المذكر الغائب)" }],
    2: [{ letters: 2, label: "This is the masculine plural subject marker (واو الجماعة لجمع المذكر الغائب)" }],
    3: [{ letters: 1, label: "This is the feminine singular marker (تاء التأنيث الساكنة للمفردة المؤنثة الغائبة)" }],
    4: [{ letters: 1, label: "This is the feminine marker (تاء التأنيث)" }, { letters: 1, label: "This is the feminine dual subject marker (ألف الاثنين للمثنى المؤنث الغائب)" }],
    5: [{ letters: 1, label: "This is the feminine plural subject marker (نون النسوة لجمع المؤنث الغائب)" }],
    6: [{ letters: 1, label: "This is the masculine singular addressee subject ending with fatḥah (تاء الفاعل للمخاطب المفرد المذكر)" }],
    7: [{ letters: 1, label: "This is ت of the masculine dual addressee subject ending (تاء الفاعل للمثنى المخاطب)" }, { letters: 1, label: "This is م of the masculine dual addressee ending (أنتما)" }, { letters: 1, label: "This is ا of the masculine dual addressee ending (أنتما)" }],
    8: [{ letters: 1, label: "This is ت of the masculine plural addressee subject ending (تاء الفاعل لجمع المذكر المخاطب)" }, { letters: 1, label: "This is م of the masculine plural addressee ending (أنتم)" }],
    9: [{ letters: 1, label: "This is the feminine singular addressee subject ending with kasrah (تاء الفاعل للمخاطبة المفردة المؤنثة)" }],
    10: [{ letters: 1, label: "This is ت of the feminine dual addressee subject ending (تاء الفاعل للمثنى المخاطب)" }, { letters: 1, label: "This is م of the feminine dual addressee ending (أنتما)" }, { letters: 1, label: "This is ا of the feminine dual addressee ending (أنتما)" }],
    11: [{ letters: 1, label: "This is ت of the feminine plural addressee subject ending (تاء الفاعل لجمع المؤنث المخاطب)" }, { letters: 1, label: "This is ن of the feminine plural addressee ending (أنتنّ)" }],
    12: [{ letters: 1, label: "This is the first-person singular subject ending with ḍammah (تاء الفاعل للمتكلم المفرد)" }],
    13: [{ letters: 2, label: "This is the first-person plural subject ending (نا الفاعلين للمتكلمين)" }],
  });

  const THUBUT_NUN = "This is the retained nūn of the Five Verbs in the indicative (ثبوت النون في الأفعال الخمسة)";
  const P3M = "This is the Muḍāriʿ prefix for the third person – masculine (حرف المضارعة للغائب المذكر)";
  const P3F = "This is the Muḍāriʿ prefix for the third person – feminine (حرف المضارعة للغائبة المؤنثة)";
  const P2M = "This is the Muḍāriʿ prefix for the second person – masculine (حرف المضارعة للمخاطب المذكر)";
  const P2F = "This is the Muḍāriʿ prefix for the second person – feminine (حرف المضارعة للمخاطبة المؤنثة)";
  const P1S = "This is the Muḍāriʿ prefix for the first person – singular (حرف المضارعة للمتكلم المفرد)";
  const P1P = "This is the Muḍāriʿ prefix for the first person – plural (حرف المضارعة للمتكلمين)";

  const PRESENT_LAYOUTS = Object.freeze([
    { prefix: P3M, ending: null },
    { prefix: P3M, ending: [{ letters: 1, label: "This is ا of the masculine dual subject (ألف الاثنين)" }, { letters: 1, label: THUBUT_NUN }] },
    { prefix: P3M, ending: [{ letters: 1, label: "This is و of the masculine plural subject (واو الجماعة)" }, { letters: 1, label: THUBUT_NUN }] },
    { prefix: P3F, ending: null },
    { prefix: P3F, ending: [{ letters: 1, label: "This is ا of the feminine dual subject (ألف الاثنين)" }, { letters: 1, label: THUBUT_NUN }] },
    { prefix: P3F, ending: [{ letters: 1, label: "This is the feminine plural subject marker (نون النسوة)" }] },
    { prefix: P2M, ending: null },
    { prefix: P2M, ending: [{ letters: 1, label: "This is ا of the masculine dual addressee subject (ألف الاثنين)" }, { letters: 1, label: THUBUT_NUN }] },
    { prefix: P2M, ending: [{ letters: 1, label: "This is و of the masculine plural addressee subject (واو الجماعة)" }, { letters: 1, label: THUBUT_NUN }] },
    { prefix: P2F, ending: [{ letters: 1, label: "This is ي of the feminine singular addressee subject (ياء المخاطبة)" }, { letters: 1, label: THUBUT_NUN }] },
    { prefix: P2F, ending: [{ letters: 1, label: "This is ا of the feminine dual addressee subject (ألف الاثنين)" }, { letters: 1, label: THUBUT_NUN }] },
    { prefix: P2F, ending: [{ letters: 1, label: "This is the feminine plural addressee subject marker (نون النسوة)" }] },
    { prefix: P1S, ending: null },
    { prefix: P1P, ending: null },
  ]);

  const MAJZUM_LAYOUTS = Object.freeze([
    { prefix: P3M, ending: null, rule: "sukun" },
    { prefix: P3M, ending: [{ letters: 1, label: "This is ا of the masculine dual subject (ألف الاثنين)" }], rule: "deleteNun" },
    { prefix: P3M, ending: [{ letters: 2, label: "This is وا of the masculine plural subject (واو الجماعة)" }], rule: "deleteNun" },
    { prefix: P3F, ending: null, rule: "sukun" },
    { prefix: P3F, ending: [{ letters: 1, label: "This is ا of the feminine dual subject (ألف الاثنين)" }], rule: "deleteNun" },
    { prefix: P3F, ending: [{ letters: 1, label: "This is the feminine plural subject marker (نون النسوة)" }], rule: "nunNiswa" },
    { prefix: P2M, ending: null, rule: "sukun" },
    { prefix: P2M, ending: [{ letters: 1, label: "This is ا of the masculine dual addressee subject (ألف الاثنين)" }], rule: "deleteNun" },
    { prefix: P2M, ending: [{ letters: 2, label: "This is وا of the masculine plural addressee subject (واو الجماعة)" }], rule: "deleteNun" },
    { prefix: P2F, ending: [{ letters: 1, label: "This is ي of the feminine singular addressee subject (ياء المخاطبة)" }], rule: "deleteNun" },
    { prefix: P2F, ending: [{ letters: 1, label: "This is ا of the feminine dual addressee subject (ألف الاثنين)" }], rule: "deleteNun" },
    { prefix: P2F, ending: [{ letters: 1, label: "This is the feminine plural addressee subject marker (نون النسوة)" }], rule: "nunNiswa" },
    { prefix: P1S, ending: null, rule: "sukun" },
    { prefix: P1P, ending: null, rule: "sukun" },
  ]);

  const MANSUB_LAYOUTS = Object.freeze([
    { prefix: P3M, ending: null, rule: "fathah" },
    { prefix: P3M, ending: [{ letters: 1, label: "This is ا of the masculine dual subject (ألف الاثنين)" }], rule: "deleteNun" },
    { prefix: P3M, ending: [{ letters: 2, label: "This is وا of the masculine plural subject (واو الجماعة)" }], rule: "deleteNun" },
    { prefix: P3F, ending: null, rule: "fathah" },
    { prefix: P3F, ending: [{ letters: 1, label: "This is ا of the feminine dual subject (ألف الاثنين)" }], rule: "deleteNun" },
    { prefix: P3F, ending: [{ letters: 1, label: "This is the feminine plural subject marker (نون النسوة)" }], rule: "nunNiswa" },
    { prefix: P2M, ending: null, rule: "fathah" },
    { prefix: P2M, ending: [{ letters: 1, label: "This is ا of the masculine dual addressee subject (ألف الاثنين)" }], rule: "deleteNun" },
    { prefix: P2M, ending: [{ letters: 2, label: "This is وا of the masculine plural addressee subject (واو الجماعة)" }], rule: "deleteNun" },
    { prefix: P2F, ending: [{ letters: 1, label: "This is ي of the feminine singular addressee subject (ياء المخاطبة)" }], rule: "deleteNun" },
    { prefix: P2F, ending: [{ letters: 1, label: "This is ا of the feminine dual addressee subject (ألف الاثنين)" }], rule: "deleteNun" },
    { prefix: P2F, ending: [{ letters: 1, label: "This is the feminine plural addressee subject marker (نون النسوة)" }], rule: "nunNiswa" },
    { prefix: P1S, ending: null, rule: "fathah" },
    { prefix: P1P, ending: null, rule: "fathah" },
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

  function rowIndex() {
    const value = Number(document.querySelector("#explanation-row")?.value);
    return Number.isInteger(value) ? value : null;
  }

  function currentPastLayout() {
    if (document.querySelector("#explanation-section")?.value !== "section01") return null;
    const field = document.querySelector("#explanation-field")?.value;
    if (field !== "past" && field !== "passivePast") return null;
    const index = rowIndex();
    return index === null ? null : ACTIVE_PAST_ENDINGS[index] || null;
  }

  function currentPresentLayout() {
    if (document.querySelector("#explanation-section")?.value !== "section01") return null;
    const field = document.querySelector("#explanation-field")?.value;
    if (field !== "present" && field !== "passivePresent") return null;
    const index = rowIndex();
    return index === null ? null : PRESENT_LAYOUTS[index] || null;
  }

  function currentMajzumLayout() {
    if (document.querySelector("#explanation-section")?.value !== "section02" || document.querySelector("#explanation-field")?.value !== "majzumPresent") return null;
    const index = rowIndex();
    return index === null ? null : MAJZUM_LAYOUTS[index] || null;
  }

  function currentMansubLayout() {
    if (document.querySelector("#explanation-section")?.value !== "section02" || document.querySelector("#explanation-field")?.value !== "mansubPresent") return null;
    const index = rowIndex();
    return index === null ? null : MANSUB_LAYOUTS[index] || null;
  }

  function currentNonpastLayout() {
    return currentPresentLayout() || currentMajzumLayout() || currentMansubLayout();
  }

  function isLexicalOrDerivationalCard(card) {
    const label = card.querySelector(".structure-run__label")?.textContent || "";
    return /root radical|Hamzat al-|باب|Form\s+\d+/i.test(label);
  }

  function isPastEndingCard(card) {
    const arabic = card.querySelector(".structure-run__arabic")?.textContent || "";
    return /\p{Script=Arabic}/u.test(arabic) && !isLexicalOrDerivationalCard(card);
  }

  function splitReferenceAuditedPastEnding() {
    const layout = currentPastLayout();
    if (!layout) return false;
    const cards = Array.from(document.querySelectorAll("#explanation-output .structure-run"));
    if (cards.some((card) => card.dataset.semanticSplit === "true")) return false;
    const expectedLetters = layout.reduce((sum, part) => sum + part.letters, 0);
    const candidate = cards.find((card) => isPastEndingCard(card) && arabicUnits(card.querySelector(".structure-run__arabic")?.textContent).filter((unit) => /\p{Script=Arabic}/u.test(unit)).length === expectedLetters);
    if (!candidate) return false;
    const units = arabicUnits(candidate.querySelector(".structure-run__arabic")?.textContent).filter((unit) => /\p{Script=Arabic}/u.test(unit));
    const replacements = [];
    let offset = 0;
    for (const part of layout) {
      replacements.push(makeStructureCard(candidate, units.slice(offset, offset + part.letters).join(""), part.label));
      offset += part.letters;
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
      if (arabicUnits(cards[i].querySelector(".structure-run__arabic")?.textContent).filter((unit) => /\p{Script=Arabic}/u.test(unit)).length !== layout[i].letters) return false;
    }
    let changed = false;
    cards.forEach((card, index) => {
      const label = card.querySelector(".structure-run__label");
      if (label && label.textContent !== layout[index].label) {
        label.textContent = layout[index].label;
        changed = true;
      }
      if (label) label.dir = "ltr";
      card.dataset.semanticSplit = "true";
    });
    return changed;
  }

  function relabelPresentPrefix() {
    const layout = currentNonpastLayout();
    if (!layout) return false;
    const card = Array.from(document.querySelectorAll("#explanation-output .structure-run")).find((candidate) => /Present-tense prefix|present prefix|Muḍāriʿ prefix/i.test(candidate.querySelector(".structure-run__label")?.textContent || ""));
    if (!card) return false;
    const label = card.querySelector(".structure-run__label");
    if (!label || label.textContent === layout.prefix) {
      card.dataset.presentPrefix = "true";
      return false;
    }
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
    if (/Present-tense prefix|present prefix|Muḍāriʿ prefix|Particle|jussive particle|subjunctive particle/i.test(label)) return false;
    return !isLexicalOrDerivationalCard(card);
  }

  function applyPresentEndingLayout() {
    const layout = currentNonpastLayout();
    if (!layout?.ending) return false;
    const cards = Array.from(document.querySelectorAll("#explanation-output .structure-run")).filter(isPresentEndingCard);
    if (!cards.length) return false;
    const expectedLetters = layout.ending.reduce((sum, part) => sum + part.letters, 0);

    if (cards.length === layout.ending.length) {
      let compatible = true;
      for (let i = 0; i < cards.length; i += 1) {
        const count = arabicUnits(cards[i].querySelector(".structure-run__arabic")?.textContent).filter((unit) => /\p{Script=Arabic}/u.test(unit)).length;
        if (count !== layout.ending[i].letters) compatible = false;
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

    const candidate = cards.find((card) => arabicUnits(card.querySelector(".structure-run__arabic")?.textContent).filter((unit) => /\p{Script=Arabic}/u.test(unit)).length === expectedLetters);
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

  function relabelMoodParticle() {
    const majzum = currentMajzumLayout();
    const mansub = currentMansubLayout();
    if (!majzum && !mansub) return false;
    const card = Array.from(document.querySelectorAll("#explanation-output .structure-run")).find((candidate) => /Particle|jussive particle|subjunctive particle/i.test(candidate.querySelector(".structure-run__label")?.textContent || ""));
    if (!card) return false;
    const arabic = card.querySelector(".structure-run__arabic")?.textContent?.trim() || "";
    const label = card.querySelector(".structure-run__label");
    const text = majzum ? `This is the jussive particle ${arabic} (حرف جزم)` : `This is the subjunctive particle ${arabic} (حرف نصب)`;
    if (!label || label.textContent === text) return false;
    label.textContent = text;
    label.dir = "ltr";
    return true;
  }

  function rulesBlock() {
    return Array.from(document.querySelectorAll("#explanation-output .explanation-block")).find((block) => /^Rules$/i.test(block.querySelector("h3")?.textContent?.trim() || "")) || null;
  }

  function applyMoodRule() {
    const majzum = currentMajzumLayout();
    const mansub = currentMansubLayout();
    const layout = majzum || mansub;
    if (!layout) return false;
    const block = rulesBlock();
    if (!block) return false;

    let text = "";
    let className = "";
    if (majzum) {
      className = "majzum-rule";
      if (layout.rule === "deleteNun") text = "The verb is majzūm because of the jussive particle. As one of the Five Verbs (الأفعال الخمسة), its jussive sign is deletion of the nūn (علامة جزمه حذف النون).";
      else if (layout.rule === "nunNiswa") text = "The Muḍāriʿ verb is connected to nūn al-niswah (نون النسوة), so it is built on sukūn (مبني على السكون) and is in the syntactic position of jussive (في محل جزم).";
      else text = "The verb is majzūm because of the jussive particle, and its jussive sign is sukūn (علامة جزمه السكون).";
    } else {
      className = "mansub-rule";
      if (layout.rule === "deleteNun") text = "The verb is manṣūb because of the subjunctive particle. As one of the Five Verbs (الأفعال الخمسة), its subjunctive sign is deletion of the nūn (علامة نصبه حذف النون).";
      else if (layout.rule === "nunNiswa") text = "The Muḍāriʿ verb is connected to nūn al-niswah (نون النسوة), so it is built on sukūn (مبني على السكون) and is in the syntactic position of subjunctive (في محل نصب).";
      else text = "The verb is manṣūb because of the subjunctive particle, and its subjunctive sign is fatḥah (علامة نصبه الفتحة).";
    }

    block.querySelector(".explanation-empty")?.remove();
    block.querySelector(majzum ? ".mansub-rule" : ".majzum-rule")?.remove();
    let paragraph = block.querySelector(`.${className}`);
    if (!paragraph) {
      paragraph = document.createElement("p");
      paragraph.className = className;
      paragraph.dir = "ltr";
      block.append(paragraph);
    }
    if (paragraph.textContent === text) return false;
    paragraph.textContent = text;
    return true;
  }

  function relabelStructure() {
    splitReferenceAuditedPastEnding();
    relabelAlreadySplitPastEnding();
    relabelPresentPrefix();
    relabelMoodParticle();
    applyPresentEndingLayout();
    applyMoodRule();

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
    for (const id of ["#explanation-section", "#explanation-field", "#explanation-row"]) {
      document.querySelector(id)?.addEventListener("change", () => queueMicrotask(apply));
    }
  }

  const api = Object.freeze({
    SECTION_LABELS,
    FORM_LABELS,
    NOMINAL_COMPONENT_PREFIX,
    ACTIVE_PAST_ENDINGS,
    PRESENT_LAYOUTS,
    MAJZUM_LAYOUTS,
    MANSUB_LAYOUTS,
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
