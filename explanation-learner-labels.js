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

  function relabelStructure() {
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
    const observer = new MutationObserver(apply);
    observer.observe(panel, { childList: true, subtree: true });
    document.querySelector("#bab")?.addEventListener("change", apply);
    document.querySelector("#explanation-section")?.addEventListener("change", () => queueMicrotask(apply));
    document.querySelector("#explanation-field")?.addEventListener("change", () => queueMicrotask(apply));
  }

  const api = Object.freeze({ SECTION_LABELS, FORM_LABELS, NOMINAL_COMPONENT_PREFIX, apply });
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else {
    globalScope.SarfExplanationLearnerLabels = api;
    if (typeof document !== "undefined") initialize();
  }
})(typeof globalThis === "undefined" ? this : globalThis);
