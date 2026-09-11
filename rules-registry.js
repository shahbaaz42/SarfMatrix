// Phase B3 registry metadata is deliberately separate from executable morphology.
// It contains stable, language-neutral identities and verified source locators only.
(function exposeRuleRegistry(globalScope) {
  "use strict";

  function deepFreeze(value) {
    if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
    for (const child of Object.values(value)) deepFreeze(child);
    return Object.freeze(value);
  }

  const EVIDENCE_CLASSES = deepFreeze([
    "direct-form", "direct-sequence", "direct-general-rule", "direct-rule",
    "pattern-instantiation", "inference",
  ]);

  const SOURCE_REGISTRY = deepFreeze({
    "matn-al-bina": {
      id: "matn-al-bina", filename: "Matn al-Bināʾ.pdf", title: "Matn al-Bināʾ",
      language: "ar", edition: null, notes: null,
    },
    "al-inba-sharh-matn-al-bina": {
      id: "al-inba-sharh-matn-al-bina", filename: "al-Inbāʾ bi Sharḥ Matn al-Bināʾ.pdf",
      title: "al-Inbāʾ bi Sharḥ Matn al-Bināʾ", language: "ar", edition: null, notes: null,
    },
    "tashil-al-sarf-english": {
      id: "tashil-al-sarf-english", filename: "Tashīl al-Ṣarf (English).pdf",
      title: "Tashīl al-Ṣarf", language: "en", edition: null, notes: null,
    },
  });

  const ref = (sourceId, pdfPage, printedPage, locator, evidenceClass) => ({ sourceId, pdfPage, printedPage, locator, evidenceClass });
  const form11Example = [ref("matn-al-bina", 19, 17, "bāb al-ifʿīlāl form sequence", "direct-sequence")];
  const generalGeminate = [ref("al-inba-sharh-matn-al-bina", 130, "128–133", "general idghām and fekk discussion (PDF 130–135)", "direct-general-rule")];
  const obligatoryFakk = [ref("al-inba-sharh-matn-al-bina", 134, 132, "fekk before tāʾ al-fāʿil, nā, and nūn al-niswa", "direct-rule")];
  const bareVariants = [ref("al-inba-sharh-matn-al-bina", 133, "131–132", "bare jussive and imperative idghām/fekk variants (PDF 133–134)", "direct-rule")];
  const lamCommand = [ref("tashil-al-sarf-english", 32, "24–28", "lām al-amr and emphatic command behavior (PDF 32–36)", "direct-general-rule")];

  const definitions = [];
  const add = (id, category, defaultOperation, babIds, environments = [], sourceRefs = [], relatedRuleIds = []) => definitions.push({
    id, category, defaultOperation,
    scope: { babIds, environments },
    explanationKey: `rules.${id}.detail`, shortExplanationKey: `rules.${id}.short`,
    technicalNoteKey: `rules.${id}.technical`, sourceRefs, relatedRuleIds,
  });
  const eligibility = [
    ["form10.regular-sound-only", "form-x-istifal"], ["form11.regular-sound-only", "bab-al-ifilal"],
    ["form12.regular-sound-only", "bab-al-ifawlal"], ["form13.regular-sound-only", "bab-al-ifawwal"],
    ["form14.regular-sound-only", "bab-al-ifanlal"], ["form15.regular-sound-only", "bab-al-ifanla"],
    ["quadriliteral-mujarrad.regular-sound-only", "quadriliteral-form-i"],
    ["quadriliteral-tafaul.regular-sound-only", "quadriliteral-tafaul"],
    ["quadriliteral-ifanlal.regular-sound-only", "quadriliteral-ifanlal"],
    ["quadriliteral-ifalalla.regular-sound-only", "quadriliteral-ifalalla"],
  ];
  for (const [id, bab] of eligibility) add(id, "eligibility", null, [bab], ["root-eligibility"]);

  for (const [id, category, operation] of [
    ["form8-emphatic-ta-to-ta", "ibdal", "substitution"], ["form8-voiced-ta-to-dal", "ibdal", "substitution"],
    ["form8-dal-ta-assimilation", "idgham", "assimilation"], ["form8-ta-ta-assimilation", "idgham", "assimilation"],
    ["form8-dhal-ta-dal-assimilation", "idgham", "assimilation"], ["form8-za-ta-to-emphatic-ta", "ibdal", "substitution"],
    ["form8-ta-ta-idgham", "idgham", "assimilation"], ["form8-tha-junction-variants", "retention", "retention"],
  ]) add(id, category, operation, ["form-viii-iftial"], ["initial-radical-junction"]);

  add("form9.final-copy-gemination", "gemination", "gemination", ["form-ix-ifilal"], ["final-derivational-copy"]);
  add("form9.jussive-final-geminate", "variant-selection", "fakk", ["form-ix-ifilal"], ["jussive"]);
  add("form9.imperative-final-geminate", "variant-selection", "fakk", ["form-ix-ifilal"], ["imperative"]);

  const form11Family = ["form11.final-copy-idgham", "form11.final-copy-fakk-before-consonantal-subject-ending", "form11.nun-niswa-fakk", "form11.jussive-final-geminate", "form11.imperative-final-geminate", "form11.lam-al-amr-final-geminate"];
  add(form11Family[0], "idgham", "gemination", ["bab-al-ifilal"], ["final-derivational-copy"], form11Example.concat(generalGeminate), form11Family.slice(1));
  add(form11Family[1], "fakk", "fakk", ["bab-al-ifilal"], ["consonantal-subject-ending"], obligatoryFakk, [form11Family[0]]);
  add(form11Family[2], "fakk", "fakk", ["bab-al-ifilal"], ["nun-al-niswa"], obligatoryFakk, [form11Family[0]]);
  add(form11Family[3], "variant-selection", "gemination", ["bab-al-ifilal"], ["jussive"], bareVariants, [form11Family[0]]);
  add(form11Family[4], "variant-selection", "gemination", ["bab-al-ifilal"], ["imperative"], bareVariants, [form11Family[0]]);
  add(form11Family[5], "variant-selection", "gemination", ["bab-al-ifilal"], ["lam-al-amr"], bareVariants.concat(lamCommand), [form11Family[0]]);

  const weakFinalRules = [
    ["ifanla.final-ya.to-maqsura", "weak-letter-change"], ["ifanla.final-ya.restore-before-consonant-suffix", "weak-letter-change"],
    ["ifanla.final-ya.delete-before-waw", "deletion"], ["ifanla.final-ya.delete-before-feminine-ta", "deletion"],
    ["ifanla.final-ya.retain", "retention"], ["ifanla.final-ya.retain-before-niswah", "retention"],
    ["ifanla.final-ya.delete-jussive", "deletion"], ["ifanla.final-ya.delete-before-2fs-ending", "deletion"],
    ["ifanla.final-ya.retain-subjunctive", "retention"], ["ifanla.emphasis.delete-plural-waw", "deletion"],
    ["ifanla.emphasis.delete-2fs-ya", "deletion"], ["ifanla.emphasis.niswah-separator", "retention"],
    ["ifanla.final-ya.restore-before-emphasis", "weak-letter-change"], ["ifanla.final-ya.to-masdar-hamza", "weak-letter-change"],
    ["ifanla.participle.indefinite-ya-deletion", "deletion"], ["ifanla.participle.ya-retention", "retention"],
  ];
  for (const [id, operation] of weakFinalRules) add(id, operation === "retention" ? "retention" : "weak-final", operation, ["bab-al-ifanla"], ["derivational-weak-final"]);

  add("final-derivational-copy-gemination", "gemination", "gemination", ["quadriliteral-ifalalla"], ["final-derivational-copy"], generalGeminate);

  function createRuleRegistry(entries) {
    const registry = {};
    for (const entry of entries) {
      if (registry[entry.id]) throw new Error(`Duplicate rule ID: ${entry.id}`);
      registry[entry.id] = entry;
    }
    return deepFreeze(registry);
  }
  const RULE_REGISTRY = createRuleRegistry(definitions);

  function getRuleDefinition(ruleId) {
    const rule = RULE_REGISTRY[ruleId];
    if (!rule) throw new Error(`Unknown rule ID: ${ruleId}`);
    return rule;
  }
  function getSourceDefinition(sourceId) {
    const source = SOURCE_REGISTRY[sourceId];
    if (!source) throw new Error(`Unknown source ID: ${sourceId}`);
    return source;
  }
  function getRuleSources(ruleId) {
    return deepFreeze(getRuleDefinition(ruleId).sourceRefs.map((locator) => ({ source: getSourceDefinition(locator.sourceId), locator })));
  }
  function validateRegistries() {
    for (const rule of Object.values(RULE_REGISTRY)) for (const sourceRef of rule.sourceRefs) {
      getSourceDefinition(sourceRef.sourceId);
      if (!EVIDENCE_CLASSES.includes(sourceRef.evidenceClass)) throw new Error(`Invalid evidence class for ${rule.id}`);
    }
    return true;
  }
  validateRegistries();

  const api = deepFreeze({ EVIDENCE_CLASSES, RULE_REGISTRY, SOURCE_REGISTRY, createRuleRegistry, getRuleDefinition, getRuleSources, getSourceDefinition, validateRegistries });
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else globalScope.SarfRuleRegistry = api;
})(typeof globalThis === "undefined" ? this : globalThis);
