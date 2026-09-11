// Phase B5: human-readable catalogs and a strict, locale-explicit translation API.
(function exposeLocalization(globalScope) {
  "use strict";

  function deepFreeze(value) {
    if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
    for (const child of Object.values(value)) deepFreeze(child);
    return Object.freeze(value);
  }

  const messages = {
    "heading.explanation": "Form explanation",
    "summary.direct": "This form is generated directly from the selected pattern.",
    "summary.one": "This form contains 1 morphological transformation.",
    "summary.many": "This form contains {count} morphological transformations.",
    "structure.copyNote": "Derivational copy of the {radical}",
    "derivation.step": "{operation}: {before} → {after}",
    "citation.pdf": "{title} — PDF p. {pdfPage}",
    "citation.pdfPrinted": "{title} — PDF p. {pdfPage} / printed p. {printedPage}",
    "structure.kind.radical": "Root radical",
    "structure.kind.derivational": "Derivational element",
    "structure.kind.derivational-copy": "Copied derivational element",
    "structure.kind.grammatical": "Grammatical ending",
    "structure.kind.particle": "Particle",
    "structure.kind.presentation": "Presentation-only element",
    "radical.1": "First root radical", "radical.2": "Second root radical",
    "radical.3": "Third root radical", "radical.4": "Fourth root radical",
    "category.eligibility": "Engine eligibility", "category.ibdal": "Substitution (Ibdāl)",
    "category.idgham": "Assimilation (Idghām)", "category.gemination": "Gemination",
    "category.fakk": "Separation (Fakk al-idghām)", "category.weak-final": "Weak-final change",
    "category.variant-selection": "Variant selection", "category.retention": "Retention",
    "operation.substitution": "Substitution", "operation.assimilation": "Assimilation",
    "operation.gemination": "Gemination", "operation.fakk": "Separation",
    "operation.deletion": "Deletion", "operation.retention": "Retention",
    "operation.weak-letter-change": "Weak-letter change",
    "status.default": "Default", "status.accepted": "Accepted", "status.preferred": "Preferred",
    "status.deprecated": "Deprecated",
    "availability.generated": "Generated", "availability.suppressed": "Suppressed for this pattern",
    "availability.unsupported": "Not currently supported", "availability.unavailable": "Not available",
    "evidence.direct-form": "Direct form evidence", "evidence.direct-sequence": "Direct sequence evidence",
    "evidence.direct-general-rule": "Direct general rule evidence", "evidence.direct-rule": "Direct rule evidence",
    "evidence.pattern-instantiation": "Pattern application", "evidence.inference": "Inference",
    "context.root": "Root", "context.bab": "Pattern / Bāb", "context.pronoun": "Pronoun",
    "context.section": "Section", "context.row": "Row / group",
    "preference.al-afsah": "The more eloquent variant",
  };

  const addRule = (id, short, detail) => {
    messages[`rules.${id}.short`] = short;
    messages[`rules.${id}.detail`] = detail;
  };
  for (const [id, name] of [
    ["form10.regular-sound-only", "Form X"], ["form11.regular-sound-only", "Form XI"],
    ["form12.regular-sound-only", "Form XII"], ["form13.regular-sound-only", "Form XIII"],
    ["form14.regular-sound-only", "Form XIV"], ["form15.regular-sound-only", "Form XV"],
    ["quadriliteral-mujarrad.regular-sound-only", "the quadriliteral basic pattern"],
    ["quadriliteral-tafaul.regular-sound-only", "the quadriliteral tafaʿul pattern"],
    ["quadriliteral-ifanlal.regular-sound-only", "the quadriliteral ifʿanlal pattern"],
    ["quadriliteral-ifalalla.regular-sound-only", "the quadriliteral ifʿalalla pattern"],
  ]) addRule(id, `Current ${name} support is limited to regular sound roots.`, `The engine currently generates ${name} only when the root passes its regular-sound eligibility check.`);

  [
    ["form8-emphatic-ta-to-ta", "The inserted tāʾ changes to ṭāʾ.", "The inserted Form VIII tāʾ changes to ṭāʾ after this emphatic initial radical."],
    ["form8-voiced-ta-to-dal", "The inserted tāʾ changes to dāl.", "The inserted Form VIII tāʾ changes to dāl after this voiced initial radical."],
    ["form8-dal-ta-assimilation", "Dāl and tāʾ assimilate.", "The initial dāl and inserted tāʾ assimilate at their junction."],
    ["form8-ta-ta-assimilation", "The two tāʾ elements assimilate.", "The initial tāʾ and inserted tāʾ assimilate at their junction."],
    ["form8-dhal-ta-dal-assimilation", "Dhāl and tāʾ assimilate through dāl.", "At the Form VIII junction, dhāl and tāʾ change and assimilate as dāl."],
    ["form8-za-ta-to-emphatic-ta", "The inserted tāʾ changes to ṭāʾ after zāy.", "The Form VIII junction retains zāy while the inserted tāʾ changes to ṭāʾ."],
    ["form8-ta-ta-idgham", "The tāʾ junction undergoes assimilation.", "The two tāʾ elements at the Form VIII junction are merged."],
    ["form8-tha-junction-variants", "The thāʾ junction has retained variants.", "The Form VIII thāʾ junction preserves the implemented alternative paths."],
    ["form9.final-copy-gemination", "The final derivational copy is geminated.", "The derivational copy of R3 merges with the lexical third radical."],
    ["form9.jussive-final-geminate", "The jussive has final-geminate alternatives.", "The jussive permits the implemented geminated and separated final-copy variants."],
    ["form9.imperative-final-geminate", "The imperative has final-geminate alternatives.", "The imperative permits the implemented geminated and separated final-copy variants."],
    ["form11.final-copy-idgham", "The final derivational copy undergoes idghām.", "The derivational copy of R3 merges with the lexical third radical."],
    ["form11.final-copy-fakk-before-consonantal-subject-ending", "The final consonants separate before this subject ending.", "The lexical final radical and its derivational copy are separated before a consonantal subject ending."],
    ["form11.nun-niswa-fakk", "Nūn al-niswah requires separation.", "The final copied radical is separated from the lexical final radical before nūn al-niswah."],
    ["form11.jussive-final-geminate", "The jussive has final-geminate variants.", "The jussive preserves the implemented idghām and separation variants."],
    ["form11.imperative-final-geminate", "The imperative has final-geminate variants.", "The imperative preserves the implemented idghām and separation variants."],
    ["form11.lam-al-amr-final-geminate", "Lām al-amr has final-geminate variants.", "The lām al-amr form preserves the implemented idghām and separation variants."],
    ["ifanla.final-ya.to-maqsura", "The final derivational yāʾ changes to alif maqṣūrah.", "The final derivational yāʾ surfaces as alif maqṣūrah in this environment."],
    ["ifanla.final-ya.restore-before-consonant-suffix", "The final derivational yāʾ is restored.", "The final derivational yāʾ is restored before this consonantal suffix."],
    ["ifanla.final-ya.delete-before-waw", "The final derivational yāʾ is deleted before wāw.", "The weak-final derivational element is deleted before the plural wāw ending."],
    ["ifanla.final-ya.delete-before-feminine-ta", "The final derivational yāʾ is deleted before feminine tāʾ.", "The weak-final derivational element is deleted before the feminine tāʾ ending."],
    ["ifanla.final-ya.retain", "The final derivational yāʾ is retained.", "The weak-final derivational element remains present in this form."],
    ["ifanla.final-ya.retain-before-niswah", "The final derivational yāʾ is retained before nūn al-niswah.", "The weak-final derivational element remains before nūn al-niswah."],
    ["ifanla.final-ya.delete-jussive", "The final derivational yāʾ is deleted in the jussive.", "The weak-final derivational element is deleted in this jussive form."],
    ["ifanla.final-ya.delete-before-2fs-ending", "The final derivational yāʾ is deleted before the second-person feminine ending.", "The weak-final derivational element is deleted before the second-person feminine singular ending."],
    ["ifanla.final-ya.retain-subjunctive", "The final derivational yāʾ is retained in the subjunctive.", "The weak-final derivational element remains present in this subjunctive form."],
    ["ifanla.emphasis.delete-plural-waw", "The plural wāw is deleted before emphasis.", "The plural wāw is deleted when the emphatic ending is attached."],
    ["ifanla.emphasis.delete-2fs-ya", "The second-person feminine yāʾ is deleted before emphasis.", "The second-person feminine singular yāʾ is deleted when the emphatic ending is attached."],
    ["ifanla.emphasis.niswah-separator", "A separator is retained with nūn al-niswah.", "The implemented separator remains between nūn al-niswah and the emphatic ending."],
    ["ifanla.final-ya.restore-before-emphasis", "The final derivational yāʾ is restored before emphasis.", "The weak-final derivational element is restored when the emphatic ending is attached."],
    ["ifanla.final-ya.to-masdar-hamza", "The final derivational yāʾ changes to hamzah in the maṣdar.", "The maṣdar applies the implemented hamzah transformation to the final derivational yāʾ."],
    ["ifanla.participle.indefinite-ya-deletion", "The participle yāʾ is deleted in this indefinite form.", "The final derivational yāʾ is deleted in the implemented indefinite participle environment."],
    ["ifanla.participle.ya-retention", "The participle yāʾ is retained.", "The final derivational yāʾ remains present in this participle environment."],
    ["final-derivational-copy-gemination", "The final derivational R4 copy is geminated.", "The derivational copy of R4 merges with the lexical fourth radical; separation is retained where the inflection requires it."],
  ].forEach((entry) => addRule(...entry));

  const LOCALIZATION_CATALOGS = deepFreeze({ en: { locale: "en", messages } });

  function getLocalizationCatalog(locale) {
    if (typeof locale !== "string" || !LOCALIZATION_CATALOGS[locale]) throw new Error(`Unsupported locale: ${String(locale)}`);
    return LOCALIZATION_CATALOGS[locale];
  }
  function listSupportedLocales() { return Object.freeze(Object.keys(LOCALIZATION_CATALOGS)); }
  function hasTranslation(locale, key) {
    const catalog = getLocalizationCatalog(locale);
    return typeof key === "string" && Object.prototype.hasOwnProperty.call(catalog.messages, key);
  }
  function translate(locale, key, params = {}) {
    const catalog = getLocalizationCatalog(locale);
    if (!Object.prototype.hasOwnProperty.call(catalog.messages, key)) throw new Error(`Missing translation for locale ${locale}: ${key}`);
    const template = catalog.messages[key];
    const required = [...template.matchAll(/\{([A-Za-z][A-Za-z0-9]*)\}/g)].map((match) => match[1]);
    for (const name of required) if (!Object.prototype.hasOwnProperty.call(params, name)) throw new Error(`Missing interpolation parameter "${name}" for ${key}`);
    return template.replace(/\{([A-Za-z][A-Za-z0-9]*)\}/g, (_match, name) => String(params[name]));
  }
  function validateRuleTranslations(locale, ruleRegistry) {
    for (const rule of Object.values(ruleRegistry)) {
      for (const property of ["shortExplanationKey", "explanationKey"]) {
        if (!hasTranslation(locale, rule[property])) throw new Error(`Missing required ${locale} translation for ${rule.id}: ${rule[property]}`);
      }
      if (rule.technicalNoteKey && hasTranslation(locale, rule.technicalNoteKey) && typeof translate(locale, rule.technicalNoteKey) !== "string") throw new Error(`Invalid technical translation for ${rule.id}`);
    }
    return true;
  }

  const api = deepFreeze({ LOCALIZATION_CATALOGS, getLocalizationCatalog, translate, hasTranslation, listSupportedLocales, validateRuleTranslations });
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else globalScope.SarfLocalization = api;
})(typeof globalThis === "undefined" ? this : globalThis);
