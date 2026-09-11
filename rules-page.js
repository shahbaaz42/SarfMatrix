// Phase B7: searchable, source-aware Rules Reference built from the B3 registry and B5 localization.
(function exposeRulesPage(globalScope) {
  "use strict";

  const registry = globalScope.SarfRuleRegistry;
  const localization = globalScope.SarfLocalization;
  if (!registry || !localization || typeof document === "undefined") return;

  const { RULE_REGISTRY, getRuleSources } = registry;
  const { translate, listSupportedLocales, hasTranslation } = localization;

  const PAGE_COPY = Object.freeze({
    en: Object.freeze({
      allCategories: "All categories",
      total: (count) => `${count} rule${count === 1 ? "" : "s"} shown`,
      sourced: (count) => `${count} source-backed`,
      bab: "Bāb / pattern",
      environments: "Environment",
      sources: "Source evidence",
      related: "Related rules",
      noSource: "No source reference is currently attached to this registry rule.",
      localeName: "English",
    }),
  });

  const searchInput = document.querySelector("#rule-search");
  const categorySelect = document.querySelector("#rule-category");
  const evidenceSelect = document.querySelector("#rule-evidence");
  const localeSelect = document.querySelector("#rules-locale");
  const localeField = document.querySelector("#locale-field");
  const list = document.querySelector("#rules-list");
  const empty = document.querySelector("#rules-empty");
  const countNode = document.querySelector("#rules-count");
  const sourceCountNode = document.querySelector("#rules-source-count");

  let locale = "en";

  function copy() {
    return PAGE_COPY[locale] || PAGE_COPY.en;
  }

  function localizedLabel(family, id) {
    if (!id) return null;
    const key = `${family}.${id}`;
    return hasTranslation(locale, key) ? translate(locale, key) : id;
  }

  function sourceRecord(ruleId) {
    return getRuleSources(ruleId).map(({ source, locator }) => ({ source, locator }));
  }

  function citation({ source, locator }) {
    const params = { title: source.title, pdfPage: locator.pdfPage, printedPage: locator.printedPage };
    const key = locator.printedPage === null || locator.printedPage === undefined ? "citation.pdf" : "citation.pdfPrinted";
    return translate(locale, key, params);
  }

  function create(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = text;
    return node;
  }

  function searchableText(rule, sources) {
    return [
      rule.id,
      translate(locale, rule.shortExplanationKey),
      translate(locale, rule.explanationKey),
      localizedLabel("category", rule.category),
      localizedLabel("operation", rule.defaultOperation),
      ...(rule.scope?.babIds || []),
      ...(rule.scope?.environments || []),
      ...sources.flatMap(({ source, locator }) => [source.title, source.filename, locator.locator, locator.evidenceClass]),
    ].filter(Boolean).join(" ").toLocaleLowerCase();
  }

  function renderSources(container, sources) {
    const heading = create("strong", null, copy().sources);
    container.append(heading);
    const sourceList = create("div", "source-list");
    if (!sources.length) {
      sourceList.append(create("div", "rule-meta", copy().noSource));
    } else {
      for (const entry of sources) {
        const card = create("div", "source-card");
        card.append(create("strong", null, citation(entry)));
        const evidence = localizedLabel("evidence", entry.locator.evidenceClass);
        const locator = [evidence, entry.locator.locator].filter(Boolean).join(" · ");
        if (locator) card.append(create("span", null, locator));
        card.append(create("span", null, entry.source.filename));
        sourceList.append(card);
      }
    }
    container.append(sourceList);
  }

  function focusRelated(ruleId) {
    searchInput.value = ruleId;
    categorySelect.value = "";
    evidenceSelect.value = "";
    render();
    const card = document.querySelector(`[data-rule-id="${CSS.escape(ruleId)}"]`);
    card?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function renderCard(rule) {
    const sources = sourceRecord(rule.id);
    const card = create("article", "rule-card");
    card.dataset.ruleId = rule.id;

    const top = create("div", "rule-card__top");
    top.append(create("h2", null, translate(locale, rule.shortExplanationKey)));
    top.append(create("span", "rule-id", rule.id));
    card.append(top);
    card.append(create("p", "rule-detail", translate(locale, rule.explanationKey)));

    const badges = create("div", "badges");
    badges.append(create("span", "badge", localizedLabel("category", rule.category)));
    if (rule.defaultOperation) badges.append(create("span", "badge", localizedLabel("operation", rule.defaultOperation)));
    if (sources.length) badges.append(create("span", "badge", `${sources.length} source${sources.length === 1 ? "" : "s"}`));
    card.append(badges);

    const scope = create("div", "rule-meta");
    const babIds = (rule.scope?.babIds || []).join(", ") || "—";
    const environments = (rule.scope?.environments || []).join(", ") || "—";
    scope.append(create("div", null, `${copy().bab}: ${babIds}`));
    scope.append(create("div", null, `${copy().environments}: ${environments}`));
    card.append(scope);

    const sourceBlock = create("div", "rule-meta");
    renderSources(sourceBlock, sources);
    card.append(sourceBlock);

    if (rule.relatedRuleIds?.length) {
      const related = create("div", "rule-meta");
      related.append(create("strong", null, copy().related));
      const relatedList = create("div", "related-list");
      for (const relatedId of rule.relatedRuleIds) {
        const button = create("button", "related-rule", relatedId);
        button.type = "button";
        button.addEventListener("click", () => focusRelated(relatedId));
        relatedList.append(button);
      }
      related.append(relatedList);
      card.append(related);
    }

    return { card, sources };
  }

  function populateCategories() {
    const previous = categorySelect.value;
    const categories = [...new Set(Object.values(RULE_REGISTRY).map(({ category }) => category))]
      .sort((a, b) => localizedLabel("category", a).localeCompare(localizedLabel("category", b)));
    categorySelect.replaceChildren();
    const all = document.createElement("option");
    all.value = "";
    all.textContent = copy().allCategories;
    categorySelect.append(all);
    for (const category of categories) {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = localizedLabel("category", category);
      categorySelect.append(option);
    }
    if (categories.includes(previous)) categorySelect.value = previous;
  }

  function render() {
    const query = searchInput.value.trim().toLocaleLowerCase();
    const category = categorySelect.value;
    const evidence = evidenceSelect.value;
    const cards = [];
    let sourcedCount = 0;

    for (const rule of Object.values(RULE_REGISTRY)) {
      const sources = sourceRecord(rule.id);
      if (category && rule.category !== category) continue;
      if (evidence === "sourced" && !sources.length) continue;
      if (evidence === "unsourced" && sources.length) continue;
      if (query && !searchableText(rule, sources).includes(query)) continue;
      const rendered = renderCard(rule);
      if (rendered.sources.length) sourcedCount += 1;
      cards.push(rendered.card);
    }

    list.replaceChildren(...cards);
    empty.hidden = cards.length > 0;
    countNode.textContent = copy().total(cards.length);
    sourceCountNode.textContent = copy().sourced(sourcedCount);
  }

  function initializeLocales() {
    const supported = listSupportedLocales();
    localeSelect.replaceChildren();
    for (const code of supported) {
      const option = document.createElement("option");
      option.value = code;
      option.textContent = PAGE_COPY[code]?.localeName || code;
      localeSelect.append(option);
    }
    localeField.hidden = supported.length <= 1;
    if (supported.includes(locale)) localeSelect.value = locale;
    localeSelect.addEventListener("change", () => {
      locale = localeSelect.value;
      populateCategories();
      render();
    });
  }

  initializeLocales();
  populateCategories();
  render();

  for (const control of [searchInput, categorySelect, evidenceSelect]) {
    control.addEventListener(control === searchInput ? "input" : "change", render);
  }

  globalScope.SarfRulesPage = Object.freeze({ render });
})(typeof globalThis === "undefined" ? this : globalThis);
