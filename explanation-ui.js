// Phase B10.6: learner-facing Rules & Explanation UI with explicit bidi isolation.
(function exposeExplanationUi(globalScope) {
  "use strict";

  const LOCALE = "en";
  const SECTION_CONFIG = Object.freeze({
    section01: Object.freeze({ fields: Object.freeze(["past", "present", "passivePast", "passivePresent"]) }),
    section02: Object.freeze({ fields: Object.freeze(["majzumPresent", "mansubPresent", "heavyEmphatic", "lightEmphatic"]) }),
    section03: Object.freeze({ fields: Object.freeze(["imperative", "heavyImperative", "lightImperative"]) }),
    section04: Object.freeze({ fields: Object.freeze([]) }),
  });

  function create(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = text;
    return node;
  }

  function appendMixedText(container, text) {
    const source = String(text ?? "");
    const arabic = /([\p{Script=Arabic}\p{M}]+(?:\s+[\p{Script=Arabic}\p{M}]+)*)/gu;
    let last = 0;
    for (const match of source.matchAll(arabic)) {
      if (match.index > last) container.append(document.createTextNode(source.slice(last, match.index)));
      const token = create("bdi", "explanation-inline-arabic", match[0]);
      token.lang = "ar";
      token.dir = "rtl";
      container.append(token);
      last = match.index + match[0].length;
    }
    if (last < source.length) container.append(document.createTextNode(source.slice(last)));
    return container;
  }

  function replaceOptions(select, options) {
    const previous = select.value;
    select.replaceChildren();
    for (const optionData of options) {
      const option = document.createElement("option");
      option.value = optionData.value;
      option.textContent = optionData.label;
      select.append(option);
    }
    if (options.some(({ value }) => value === previous)) select.value = previous;
  }

  function readSnapshotFromForm() {
    if (typeof globalScope.dispatchGeneration !== "function") throw new Error("Sarf generation API is unavailable");
    const rootFamily = document.querySelector("#root-family").value;
    const rootArity = rootFamily === "quadriliteral" ? 4 : 3;
    const root = ["#root-one", "#root-two", "#root-three", "#root-four"]
      .slice(0, rootArity)
      .map((selector) => document.querySelector(selector).value.trim());
    const babSelect = document.querySelector("#bab");
    if (!babSelect.value) throw new Error("Select a Bāb before opening an explanation");
    return globalScope.dispatchGeneration({
      rootFamily,
      root,
      bab: babSelect.value,
      babLabel: babSelect.options[babSelect.selectedIndex].text,
      majzumParticle: document.querySelector("#majzum-particle").value,
      mansubParticle: document.querySelector("#mansub-particle").value,
      colourRootLetters: document.querySelector("#colour-root-letters").checked,
    });
  }

  function initialize() {
    const panel = document.querySelector("#explanation-panel");
    const form = document.querySelector("#sarf-form");
    const localization = globalScope.SarfLocalization;
    if (!panel || !form || !localization || !globalScope.SarfExplanationEngine || !globalScope.SarfExplanationText) return;

    const t = (key, params) => localization.translate(LOCALE, key, params);
    const sectionSelect = document.querySelector("#explanation-section");
    const fieldSelect = document.querySelector("#explanation-field");
    const rowSelect = document.querySelector("#explanation-row");
    const valueSelect = document.querySelector("#explanation-value");
    const valueField = document.querySelector("#explanation-value-field");
    const output = document.querySelector("#explanation-output");

    document.querySelector("#explanation-heading").textContent = t("ui.explanation.title");
    document.querySelector("#explanation-intro").textContent = t("ui.explanation.intro");
    document.querySelector('label[for="explanation-section"]').textContent = t("ui.control.section");
    document.querySelector('label[for="explanation-field"]').textContent = t("ui.control.form");
    document.querySelector('label[for="explanation-row"]').textContent = t("ui.control.row");
    document.querySelector('label[for="explanation-value"]').textContent = t("ui.control.value");

    let snapshot = null;
    replaceOptions(sectionSelect, Object.keys(SECTION_CONFIG).map((value) => ({ value, label: t(`ui.section.${value}`) })));

    const TERM_LABELS = Object.freeze({
      "present-prefix-alif": "Present-tense prefix ا (همزة المضارعة)",
      "present-prefix-nun": "Present-tense prefix ن (نون المضارعة)",
      "present-prefix-ya": "Present-tense prefix ي (ياء المضارعة)",
      "present-prefix-ta": "Present-tense prefix ت (تاء المضارعة)",
      "nun-niswa": "Feminine plural ن (نون النسوة)",
      "subject-ta": "Subject ت (تاء الفاعل)",
      "subject-na": "Subject نا (نا الفاعلين)",
      "feminine-ta": "Feminine ت (تاء التأنيث)",
      "heavy-emphasis-nun": "Heavy-emphasis ن (نون التوكيد الثقيلة)",
      "light-emphasis-nun": "Light-emphasis ن (نون التوكيد الخفيفة)",
      "feminine-emphasis-separator-alif": "Separating ا (الألف الفاصلة)",
      "jussive-particle": "Jussive particle (أداة الجزم)",
      "subjunctive-particle": "Subjunctive particle (أداة النصب)",
      "case-nominative": "Nominative (مرفوع)",
      "case-accusative": "Accusative (منصوب)",
      "case-genitive": "Genitive (مجرور)",
      "dual-nun": "Dual ن (نون التثنية)",
      "sound-masculine-plural-nun": "Sound masculine plural ن (نون جمع المذكر السالم)",
      "hamzat-wasl": "Hamzat al-waṣl (همزة الوصل)",
      "hamzat-qat": "Hamzat al-qaṭʿ (همزة القطع)",
    });

    function currentSectionRows() {
      return snapshot?.sections?.[sectionSelect.value] || [];
    }

    function currentBabName() {
      const label = snapshot?.babLabel || "";
      const [name] = label.split("—");
      return name.trim() || label.trim();
    }

    function radicalLabel(segment) {
      const n = segment.radicalIndex ?? segment.sourceRadicalIndex;
      if (n === 1) return "First root radical (فاء الكلمة)";
      if (n === 2) return "Second root radical (عين الكلمة)";
      if (n === 3) return "Third root radical (لام الكلمة)";
      if (n === 4) return "Fourth root radical (لام الكلمة الثانية)";
      return null;
    }

    function learnerStructureLabel(segment) {
      const roles = segment.morphologicalRoles || [];
      const babName = currentBabName();
      const radical = radicalLabel(segment);

      if (babName && roles.some((role) => role.startsWith("hamza-of-"))) {
        const qat = roles.includes("hamzat-qat") || (segment.orthographicRoles || []).includes("hamzat-qat");
        return `${qat ? "Hamzat al-qaṭʿ (همزة القطع)" : "Hamzat al-waṣl (همزة الوصل)"} of ${babName}`;
      }
      if (babName && roles.includes("form8-ta")) return `ت of ${babName}`;
      if (
        snapshot?.bab === "form-viii-iftial" &&
        segment.radicalIndex === 1 &&
        String(segment.text).includes("ّ") &&
        snapshot.transformation?.affectedElement?.assimilatedIntoRadicalIndex === 1
      ) {
        return `First root radical (فاء الكلمة) + transformed ت of ${babName} — merged by Assimilation (إدغام)`;
      }
      if (roles.length) {
        const labels = roles.map((role) => TERM_LABELS[role]).filter(Boolean);
        if (labels.length) return labels.join(" · ");
      }
      return radical || segment.note || segment.radicalLabel || segment.kindLabel;
    }

    function splitLearnerStructure(segment) {
      const roles = segment.morphologicalRoles || [];
      if (roles.includes("subject-ta") && roles.includes("nun-niswa")) {
        const i = String(segment.text).indexOf("ن");
        if (i > 0) {
          return [
            { ...segment, text: String(segment.text).slice(0, i), morphologicalRoles: ["subject-ta"], note: "" },
            { ...segment, text: String(segment.text).slice(i), morphologicalRoles: ["nun-niswa"], note: "" },
          ];
        }
      }
      return [segment];
    }

    function learnerRuleText(rule) {
      const babName = currentBabName() || "the selected Bāb";
      const r1 = snapshot?.root?.[0];
      const form8 = {
        "form8-emphatic-ta-to-ta": {
          shortText: "Substitution (إبدال): ت changes to ط.",
          detailText: `In ${babName}, ت of ${babName} changes to ط after the first root radical ${r1}.`,
        },
        "form8-voiced-ta-to-dal": {
          shortText: "Substitution (إبدال): ت changes to د.",
          detailText: `In ${babName}, ت of ${babName} changes to د after the first root radical ${r1}.`,
        },
        "form8-dal-ta-assimilation": {
          shortText: "Substitution followed by Assimilation (إبدال ثم إدغام).",
          detailText: `In ${babName}, ت of ${babName} changes to د; the original root د and transformed د then merge into one doubled دّ.`,
        },
        "form8-ta-ta-assimilation": {
          shortText: "Substitution followed by Assimilation (إبدال ثم إدغام).",
          detailText: `In ${babName}, ت of ${babName} changes to ط because the first root radical is ط; the original ط and transformed ط then merge into one doubled طّ.`,
        },
        "form8-dhal-ta-dal-assimilation": {
          shortText: "Substitution and Assimilation (إبدال وإدغام): ذ + ت resolve through د.",
          detailText: `In ${babName}, the ذ + ت junction changes and assimilates according to this rule.`,
        },
        "form8-za-ta-to-emphatic-ta": {
          shortText: "Substitution (إبدال): ت changes to ط after ز.",
          detailText: `In ${babName}, the first root radical ز remains while ت of ${babName} changes to ط.`,
        },
        "form8-ta-ta-idgham": {
          shortText: "Assimilation (إدغام): the two ت letters merge into تّ.",
          detailText: `In ${babName}, the first root radical ت and ت of ${babName} merge into one doubled تّ.`,
        },
        "form8-tha-junction-variants": {
          shortText: "The ث + ت junction has accepted variants.",
          detailText: `In ${babName}, the ث + ت junction preserves the implemented alternative paths.`,
        },
      };
      return form8[rule.id] || rule;
    }

    function operationLearnerLabel(stage) {
      const raw = stage.operationLabel || stage.operation || "";
      if (/substitution/i.test(raw)) return "Substitution (إبدال)";
      if (/assimilation|idgh/i.test(raw)) return "Assimilation (إدغام)";
      return raw;
    }

    function updateFieldOptions() {
      if (!snapshot) return;
      const section = sectionSelect.value;
      if (section === "section04") {
        const groups = snapshot.sections.section04 || {};
        replaceOptions(fieldSelect, Object.entries(groups)
          .filter(([, rows]) => Array.isArray(rows) && rows.length)
          .map(([value]) => ({ value, label: t(`ui.group.${value}`) })));
      } else {
        replaceOptions(fieldSelect, SECTION_CONFIG[section].fields.map((value) => ({ value, label: t(`ui.form.${value}`) })));
      }
      updateRowOptions();
    }

    function updateRowOptions() {
      if (!snapshot || !fieldSelect.value) return;
      const section = sectionSelect.value;
      const rows = section === "section04" ? (snapshot.sections.section04?.[fieldSelect.value] || []) : currentSectionRows();
      replaceOptions(rowSelect, rows.map((row, index) => ({ value: String(index), label: row.pronoun || row.label || t("ui.row.fallback", { number: index + 1 }) })));
      updateValueOptions();
    }

    function updateValueOptions() {
      if (!snapshot || sectionSelect.value !== "section04") {
        valueField.hidden = true;
        replaceOptions(valueSelect, [{ value: "0", label: t("ui.value.fallback", { number: 1 }) }]);
        return;
      }
      const rows = snapshot.sections.section04?.[fieldSelect.value] || [];
      const row = rows[Number(rowSelect.value || 0)];
      const values = row?.values || [];
      replaceOptions(valueSelect, values.map((value, index) => ({ value: String(index), label: value || t("ui.value.fallback", { number: index + 1 }) })));
      valueField.hidden = values.length <= 1;
    }

    function buildTarget() {
      const section = sectionSelect.value;
      const rowIndex = Number(rowSelect.value || 0);
      return section === "section04"
        ? { section, group: fieldSelect.value, rowIndex, valueIndex: Number(valueSelect.value || 0) }
        : { section, rowIndex, field: fieldSelect.value };
    }

    function appendEmpty(container, key) {
      container.append(create("p", "explanation-empty", t(key)));
    }

    function renderStructure(container, model) {
      const block = create("section", "explanation-block");
      block.append(create("h3", null, t("ui.block.structure")));
      if (!model.structure.length) appendEmpty(block, "ui.empty.structure");
      else {
        const runs = create("div", "structure-runs");
        for (const sourceSegment of model.structure) {
          for (const segment of splitLearnerStructure(sourceSegment)) {
            const item = create("div", "structure-run");
            const arabic = create("span", "structure-run__arabic", segment.text);
            arabic.lang = "ar";
            arabic.dir = "rtl";
            const label = create("span", "structure-run__label");
            label.dir = "ltr";
            appendMixedText(label, learnerStructureLabel(segment));
            item.append(arabic, label);
            runs.append(item);
          }
        }
        block.append(runs);
      }
      container.append(block);
    }

    function renderRules(container, model) {
      const block = create("section", "explanation-block");
      block.append(create("h3", null, t("ui.block.rules")));
      if (!model.rules.length) appendEmpty(block, "ui.empty.rules");
      else {
        for (const rule of model.rules) {
          const learnerRule = learnerRuleText(rule);
          const card = create("article", "rule-card");
          const heading = create("strong");
          heading.dir = "ltr";
          appendMixedText(heading, learnerRule.shortText);
          const detail = create("div");
          detail.dir = "ltr";
          appendMixedText(detail, learnerRule.detailText);
          card.append(heading, detail);
          const combinedForm8 = ["form8-dal-ta-assimilation", "form8-ta-ta-assimilation", "form8-dhal-ta-dal-assimilation"].includes(rule.id);
          if (!combinedForm8) {
            const metadata = [rule.categoryLabel, rule.defaultOperationLabel].filter(Boolean).join(" · ");
            if (metadata) card.append(create("p", "explanation-meta", metadata));
          }
          block.append(card);
        }
      }
      container.append(block);
    }

    function appendTransformation(container, beforeText, afterText) {
      const change = create("span", "explanation-step__change");
      change.dir = "ltr";
      const before = create("bdi", "explanation-step__arabic-token", beforeText);
      before.lang = "ar";
      before.dir = "rtl";
      const arrow = create("span", "explanation-step__arrow", "→");
      arrow.setAttribute("aria-hidden", "true");
      const after = create("bdi", "explanation-step__arabic-token", afterText);
      after.lang = "ar";
      after.dir = "rtl";
      change.append(before, arrow, after);
      container.append(change);
    }

    function renderDerivation(container, model) {
      const block = create("section", "explanation-block");
      block.append(create("h3", null, t("ui.block.derivation")));
      if (model.derivation.underlyingText) {
        const underlying = create("p", "explanation-step");
        underlying.append(create("span", null, t("ui.derivation.underlying")));
        const arabic = create("span", "explanation-step__arabic", model.derivation.underlyingText);
        arabic.lang = "ar";
        arabic.dir = "rtl";
        underlying.append(arabic);
        block.append(underlying);
      }
      if (!model.derivation.stages.length) appendEmpty(block, "ui.empty.derivation");
      else {
        const list = create("ol", "explanation-list");
        for (const stage of model.derivation.stages) {
          const item = create("li", "explanation-step");
          const operation = create("span");
          operation.dir = "ltr";
          appendMixedText(operation, operationLearnerLabel(stage));
          item.append(operation);
          if (stage.before !== null && stage.after !== null) appendTransformation(item, stage.before, stage.after);
          list.append(item);
        }
        block.append(list);
      }
      container.append(block);
    }

    function renderAlternatives(container, model) {
      const block = create("section", "explanation-block");
      block.append(create("h3", null, t("ui.block.alternatives")));
      if (!model.alternatives.length) appendEmpty(block, "ui.empty.alternatives");
      else for (const alternative of model.alternatives) {
        const card = create("article", "alternative-card");
        const value = create("strong", null, alternative.value);
        value.lang = "ar";
        value.dir = "rtl";
        card.append(value, create("div", null, alternative.statusLabel));
        if (alternative.preferenceText) card.append(create("p", "explanation-meta", alternative.preferenceText));
        if (alternative.reasonText) card.append(create("p", "explanation-meta", alternative.reasonText));
        block.append(card);
      }
      container.append(block);
    }

    function renderSources(container, model) {
      const block = create("section", "explanation-block");
      block.append(create("h3", null, t("ui.block.sources")));
      if (!model.sources.length) appendEmpty(block, "ui.empty.sources");
      else for (const source of model.sources) {
        const card = create("article", "source-card");
        card.append(create("div", null, source.citationText));
        if (source.evidenceLabel) card.append(create("p", "explanation-meta", source.evidenceLabel));
        block.append(card);
      }
      container.append(block);
    }

    function renderExplanation() {
      if (!snapshot || !fieldSelect.value || (!rowSelect.value && rowSelect.value !== "0")) return;
      try {
        const record = globalScope.SarfExplanationEngine.buildExplanationRecord(snapshot, buildTarget());
        const model = globalScope.SarfExplanationText.buildLocalizedExplanation(record, LOCALE);
        output.replaceChildren();
        const surfaceCard = create("section", "explanation-surface-card");
        const surface = create("div", "explanation-surface", model.surface || model.availability.label);
        if (model.surface) { surface.lang = "ar"; surface.dir = "rtl"; }
        surfaceCard.append(surface, create("p", "explanation-summary", model.summary));
        const context = [model.context.babLabel, model.context.pronoun || model.context.rowLabel, model.availability.label].filter(Boolean).join(" · ");
        if (context) surfaceCard.append(create("p", "explanation-meta", context));
        output.append(surfaceCard);
        const grid = create("div", "explanation-grid");
        renderStructure(grid, model);
        renderDerivation(grid, model);
        renderRules(grid, model);
        renderAlternatives(grid, model);
        renderSources(grid, model);
        output.append(grid);
      } catch (error) {
        console.error("Sarf explanation rendering failed", error);
        output.replaceChildren(create("p", "explanation-empty", t("ui.error.render")));
      }
    }

    function refreshSnapshot({ show = true } = {}) {
      try {
        snapshot = readSnapshotFromForm();
        if (show) panel.hidden = false;
        updateFieldOptions();
        renderExplanation();
      } catch (error) {
        snapshot = null;
        panel.hidden = true;
      }
    }

    form.addEventListener("submit", () => refreshSnapshot({ show: true }));
    sectionSelect.addEventListener("change", () => { updateFieldOptions(); renderExplanation(); });
    fieldSelect.addEventListener("change", () => { updateRowOptions(); renderExplanation(); });
    rowSelect.addEventListener("change", () => { updateValueOptions(); renderExplanation(); });
    valueSelect.addEventListener("change", renderExplanation);

    for (const selector of ["#root-one", "#root-two", "#root-three", "#root-four", "#bab", "#root-family"]) {
      const control = document.querySelector(selector);
      control?.addEventListener(selector === "#bab" || selector === "#root-family" ? "change" : "input", () => {
        snapshot = null;
        panel.hidden = true;
      });
    }
    for (const selector of ["#majzum-particle", "#mansub-particle", "#colour-root-letters"]) {
      document.querySelector(selector)?.addEventListener("change", () => { if (!panel.hidden) refreshSnapshot({ show: true }); });
    }
  }

  const api = Object.freeze({ LOCALE, SECTION_CONFIG });
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else {
    globalScope.SarfExplanationUi = api;
    if (typeof document !== "undefined") initialize();
  }
})(typeof globalThis === "undefined" ? this : globalThis);
