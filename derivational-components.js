// Phase B8.3: attach Bāb-specific derivational and hamzah identities.
// Identity comes from builder metadata or explicit Bāb/field structure, never from
// scanning the visible Arabic character alone.
(function exposeDerivationalComponents(globalScope) {
  "use strict";

  const contract = typeof module !== "undefined" && module.exports
    ? require("./component-contract.js")
    : globalScope.SarfComponentContract;
  if (!contract) throw new Error("Sarf component contract is required");
  const { withComponentIdentity } = contract;

  const ELEMENT_ROLE_MAP = Object.freeze({
    "form8Ta": { morphologicalRoles: ["form8-ta"] },
    "form9.hamzatWasl": { morphologicalRoles: ["hamza-of-ifilal"], orthographicRoles: ["hamzat-wasl"] },
    "form9.r3Copy": { morphologicalRoles: ["form9-r3-copy"] },
    "form10.hamzatWasl": { morphologicalRoles: ["hamza-of-istifal"], orthographicRoles: ["hamzat-wasl"] },
    "form10.sin": { morphologicalRoles: ["form10-sin"] },
    "form10.ta": { morphologicalRoles: ["form10-ta"] },
    "form10.masdarAlif": { morphologicalRoles: ["masdar-alif"] },
    "form10.participleMim": { morphologicalRoles: ["participle-mim"] },
    "form11.hamzatWasl": { morphologicalRoles: ["hamza-of-ifilal"], orthographicRoles: ["hamzat-wasl"] },
    "form11.medialAlif": { morphologicalRoles: ["form11-pattern-alif"] },
    "form11.r3Copy": { morphologicalRoles: ["form11-r3-copy"] },
    "form11.masdarYa": { morphologicalRoles: ["form11-masdar-ya"] },
    "form11.masdarAlif": { morphologicalRoles: ["masdar-alif"] },
    "form11.participleMim": { morphologicalRoles: ["participle-mim"] },
    "form12.hamzatWasl": { morphologicalRoles: ["hamza-of-ifawlal"], orthographicRoles: ["hamzat-wasl"] },
    "form12.waw": { morphologicalRoles: ["form12-waw"] },
    "form12.r2Copy": { morphologicalRoles: ["form12-r2-copy"] },
    "form12.masdarYa": { morphologicalRoles: ["form12-masdar-ya"] },
    "form12.masdarAlif": { morphologicalRoles: ["masdar-alif"] },
    "form12.participleMim": { morphologicalRoles: ["participle-mim"] },
    "form13.hamzatWasl": { morphologicalRoles: ["hamza-of-ifawwal"], orthographicRoles: ["hamzat-wasl"] },
    "form13.waw1+form13.waw2": { morphologicalRoles: ["form13-waw-geminate"] },
    "form13.masdarAlif": { morphologicalRoles: ["masdar-alif"] },
    "form13.participleMim": { morphologicalRoles: ["participle-mim"] },
    "form14.hamzatWasl": { morphologicalRoles: ["hamza-of-ifanlal"], orthographicRoles: ["hamzat-wasl"] },
    "form14.insertedNun": { morphologicalRoles: ["form14-inserted-nun"] },
    "form14.r3Copy": { morphologicalRoles: ["form14-r3-copy"] },
    "form14.masdarAlif": { morphologicalRoles: ["masdar-alif"] },
    "form14.participleMim": { morphologicalRoles: ["participle-mim"] },
    "ifanla.hamzatWasl": { morphologicalRoles: ["hamza-of-ifanla"], orthographicRoles: ["hamzat-wasl"] },
    "ifanla.insertedNun": { morphologicalRoles: ["form15-inserted-nun"] },
    "ifanla.finalYa": { morphologicalRoles: ["form15-final-ya"] },
    "quadriliteral-tafaul.ta": { morphologicalRoles: ["quadriliteral-tafaul-ta"] },
    "quadriliteral-tafaul.participleMim": { morphologicalRoles: ["participle-mim"] },
    "quadriliteral-ifanlal.hamzatWasl": { morphologicalRoles: ["hamza-of-quadriliteral-ifanlal"], orthographicRoles: ["hamzat-wasl"] },
    "quadriliteral-ifanlal.insertedNun": { morphologicalRoles: ["quadriliteral-ifanlal-inserted-nun"] },
    "quadriliteral-ifanlal.masdarAlif": { morphologicalRoles: ["masdar-alif"] },
    "quadriliteral-ifanlal.participleMim": { morphologicalRoles: ["participle-mim"] },
    "quadriliteral-ifalalla.hamzatWasl": { morphologicalRoles: ["hamza-of-quadriliteral-ifalalla"], orthographicRoles: ["hamzat-wasl"] },
    "quadriliteral-ifalalla.r4Copy": { morphologicalRoles: ["quadriliteral-ifalalla-r4-copy"] },
    "quadriliteral-ifalalla.masdarAlif": { morphologicalRoles: ["masdar-alif"] },
    "quadriliteral-ifalalla.participleMim": { morphologicalRoles: ["participle-mim"] },
  });

  // Older templates predate stable elementIds. Here the semantic identity is
  // determined by Bāb + generated field + derivational ordinal, never by glyph.
  const LEGACY_ROLE_SEQUENCES = Object.freeze({
    "form-iv-ifal": Object.freeze({
      past: [["hamza-of-ifal"]], passivePast: [["hamza-of-ifal"]], imperative: [["hamza-of-ifal"]], heavyImperative: [["hamza-of-ifal"]], lightImperative: [["hamza-of-ifal"]],
      masdar: [["hamza-of-ifal"], ["form4-masdar-alif"]], activeParticiple: [["participle-mim"]], passiveParticiple: [["participle-mim"]],
    }),
    "form-ii-tafil": Object.freeze({ masdar: [["form2-masdar-ta"], ["form2-masdar-ya"]], activeParticiple: [["participle-mim"]], passiveParticiple: [["participle-mim"]] }),
    "form-iii-mufaalah": Object.freeze({
      past: [["form3-alif"]], present: [["form3-alif"]], passivePast: [["form3-passive-waw"]], passivePresent: [["form3-alif"]],
      majzumPresent: [["form3-alif"]], mansubPresent: [["form3-alif"]], heavyEmphatic: [["form3-alif"]], lightEmphatic: [["form3-alif"]], imperative: [["form3-alif"]], heavyImperative: [["form3-alif"]], lightImperative: [["form3-alif"]],
      masdar: [["masdar-mim"], ["form3-alif"], ["masdar-ta-marbuta"]], activeParticiple: [["participle-mim"], ["form3-alif"]], passiveParticiple: [["participle-mim"], ["form3-alif"]],
    }),
    "form-v-tafaul": Object.freeze({
      past: [["form5-ta"]], present: [["form5-ta"]], passivePast: [["form5-ta"]], passivePresent: [["form5-ta"]], majzumPresent: [["form5-ta"]], mansubPresent: [["form5-ta"]], heavyEmphatic: [["form5-ta"]], lightEmphatic: [["form5-ta"]], imperative: [["form5-ta"]], heavyImperative: [["form5-ta"]], lightImperative: [["form5-ta"]],
      masdar: [["form5-ta"]], activeParticiple: [["participle-mim"], ["form5-ta"]], passiveParticiple: [["participle-mim"], ["form5-ta"]],
    }),
    "form-vi-tafaul": Object.freeze({
      past: [["form6-ta"], ["form6-alif"]], present: [["form6-ta"], ["form6-alif"]], passivePast: [["form6-ta"], ["form6-passive-waw"]], passivePresent: [["form6-ta"], ["form6-alif"]],
      majzumPresent: [["form6-ta"], ["form6-alif"]], mansubPresent: [["form6-ta"], ["form6-alif"]], heavyEmphatic: [["form6-ta"], ["form6-alif"]], lightEmphatic: [["form6-ta"], ["form6-alif"]], imperative: [["form6-ta"], ["form6-alif"]], heavyImperative: [["form6-ta"], ["form6-alif"]], lightImperative: [["form6-ta"], ["form6-alif"]],
      masdar: [["form6-ta"], ["form6-alif"]], activeParticiple: [["participle-mim"], ["form6-ta"], ["form6-alif"]], passiveParticiple: [["participle-mim"], ["form6-ta"], ["form6-alif"]],
    }),
    "form-vii-infial": Object.freeze({
      past: [["hamza-of-infial"], ["form7-nun"]], present: [["form7-nun"]], passivePast: [["hamza-of-infial"], ["form7-nun"]], passivePresent: [["form7-nun"]],
      majzumPresent: [["form7-nun"]], mansubPresent: [["form7-nun"]], heavyEmphatic: [["form7-nun"]], lightEmphatic: [["form7-nun"]], imperative: [["hamza-of-infial"], ["form7-nun"]], heavyImperative: [["hamza-of-infial"], ["form7-nun"]], lightImperative: [["hamza-of-infial"], ["form7-nun"]],
      masdar: [["hamza-of-infial"], ["form7-nun"], ["masdar-alif"]], activeParticiple: [["participle-mim"], ["form7-nun"]], passiveParticiple: [["participle-mim"], ["form7-nun"]],
    }),
    "form-viii-iftial": Object.freeze({
      past: [["hamza-of-iftial"], ["form8-ta"]], present: [["form8-ta"]], passivePast: [["hamza-of-iftial"], ["form8-ta"]], passivePresent: [["form8-ta"]],
      majzumPresent: [["form8-ta"]], mansubPresent: [["form8-ta"]], heavyEmphatic: [["form8-ta"]], lightEmphatic: [["form8-ta"]], imperative: [["hamza-of-iftial"], ["form8-ta"]], heavyImperative: [["hamza-of-iftial"], ["form8-ta"]], lightImperative: [["hamza-of-iftial"], ["form8-ta"]],
      masdar: [["hamza-of-iftial"], ["form8-ta"], ["masdar-alif"]], activeParticiple: [["participle-mim"], ["form8-ta"]], passiveParticiple: [["participle-mim"], ["form8-ta"]],
    }),
  });

  const HAMZA_WASL_ROLES = new Set(["hamza-of-infial", "hamza-of-iftial"]);
  function clone(value) { if (Array.isArray(value)) return value.map(clone); if (!value || typeof value !== "object") return value; return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, clone(v)])); }
  function deepFreeze(value) { if (!value || typeof value !== "object" || Object.isFrozen(value)) return value; for (const child of Object.values(value)) deepFreeze(child); return Object.freeze(value); }
  function mergedIdentity(run, addition) {
    const morphologicalRoles = [...(run.morphologicalRoles || [])];
    const orthographicRoles = [...(run.orthographicRoles || [])];
    for (const role of addition?.morphologicalRoles || []) if (!morphologicalRoles.includes(role)) morphologicalRoles.push(role);
    for (const role of addition?.orthographicRoles || []) if (!orthographicRoles.includes(role)) orthographicRoles.push(role);
    return withComponentIdentity(run, { morphologicalRoles, orthographicRoles });
  }
  function legacyAddition(roles) {
    if (!roles) return null;
    return {
      morphologicalRoles: roles,
      orthographicRoles: roles.includes("hamza-of-ifal") ? ["hamzat-qat"] : roles.some((role) => HAMZA_WASL_ROLES.has(role)) ? ["hamzat-wasl"] : [],
    };
  }
  function enrichPresentation(presentation, { bab, field }) {
    if (!presentation || !Array.isArray(presentation.runs)) return clone(presentation);
    const legacy = LEGACY_ROLE_SEQUENCES[bab]?.[field] || [];
    let derivationalOrdinal = 0;
    const runs = presentation.runs.map((run) => {
      if (!run || typeof run !== "object") return run;
      let addition = run.elementId ? ELEMENT_ROLE_MAP[run.elementId] : null;
      if (!addition && (run.kind === "derivational" || run.kind === "derivational-copy")) addition = legacyAddition(legacy[derivationalOrdinal]);
      if (run.kind === "derivational" || run.kind === "derivational-copy") derivationalOrdinal += 1;
      return addition ? mergedIdentity(run, addition) : clone(run);
    });
    return deepFreeze({ ...clone(presentation), runs });
  }
  function enrichRows(rows, bab) {
    return rows.map((row) => {
      const copy = clone(row);
      if (copy.presentation) for (const [field, presentation] of Object.entries(copy.presentation)) copy.presentation[field] = enrichPresentation(presentation, { bab, field });
      return deepFreeze(copy);
    });
  }
  function enrichSection04(section04, bab) {
    const copy = clone(section04 || {});
    for (const [group, rows] of Object.entries(copy)) {
      if (!Array.isArray(rows)) continue;
      const field = group === "masdar" ? "masdar" : group === "passiveParticiple" ? "passiveParticiple" : "activeParticiple";
      for (const row of rows) if (Array.isArray(row.presentations)) row.presentations = row.presentations.map((presentation) => enrichPresentation(presentation, { bab, field }));
    }
    return deepFreeze(copy);
  }
  function enrichDerivationalSnapshot(snapshot) {
    if (!snapshot || typeof snapshot !== "object" || !snapshot.sections) throw new Error("Generated snapshot is required");
    const copy = clone(snapshot);
    for (const section of ["section01", "section02", "section03"]) if (Array.isArray(copy.sections[section])) copy.sections[section] = enrichRows(copy.sections[section], copy.bab);
    if (copy.sections.section04) copy.sections.section04 = enrichSection04(copy.sections.section04, copy.bab);
    return deepFreeze(copy);
  }

  const api = deepFreeze({ ELEMENT_ROLE_MAP, LEGACY_ROLE_SEQUENCES, enrichPresentation, enrichDerivationalSnapshot });
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else globalScope.SarfDerivationalComponents = api;
})(typeof globalThis === "undefined" ? this : globalThis);
