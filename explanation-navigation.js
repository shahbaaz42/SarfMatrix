// Phase B10: direct navigation from generated result cells to their explanation target.
(function exposeExplanationNavigation(globalScope) {
  "use strict";

  const VERBAL_TABLES = Object.freeze({
    "section-01-body": Object.freeze({ section: "section01", fields: Object.freeze(["past", "present", "passivePast", "passivePresent"]) }),
    "section-02-body": Object.freeze({ section: "section02", fields: Object.freeze(["majzumPresent", "mansubPresent", "heavyEmphatic", "lightEmphatic"]) }),
    "section-03-body": Object.freeze({ section: "section03", fields: Object.freeze(["imperative", "heavyImperative", "lightImperative"]) }),
  });

  const DERIVED_TABLES = Object.freeze({
    "masdar-body": "masdar",
    "active-participle-body": "activeParticiple",
    "passive-participle-body": "passiveParticiple",
    "elative-body": "elative",
    "zarf-body": "zarf",
  });

  function targetForResultPosition(tbodyId, rowIndex, cellIndex) {
    if (!Number.isInteger(rowIndex) || rowIndex < 0 || !Number.isInteger(cellIndex) || cellIndex <= 0) return null;
    const verbal = VERBAL_TABLES[tbodyId];
    if (verbal) {
      const field = verbal.fields[cellIndex - 1];
      return field ? Object.freeze({ section: verbal.section, rowIndex, field }) : null;
    }
    const group = DERIVED_TABLES[tbodyId];
    if (!group) return null;
    return Object.freeze({ section: "section04", group, rowIndex, valueIndex: cellIndex - 1 });
  }

  function recognizedBody(tbody) {
    return !!tbody && (Object.prototype.hasOwnProperty.call(VERBAL_TABLES, tbody.id)
      || Object.prototype.hasOwnProperty.call(DERIVED_TABLES, tbody.id));
  }

  function targetForCell(cell) {
    if (!cell || cell.tagName !== "TD") return null;
    const row = cell.parentElement;
    const tbody = row?.parentElement;
    if (!recognizedBody(tbody)) return null;
    const rowIndex = Array.prototype.indexOf.call(tbody.children, row);
    const cellIndex = Array.prototype.indexOf.call(row.children, cell);
    return targetForResultPosition(tbody.id, rowIndex, cellIndex);
  }

  function setInteractive(cell, enabled) {
    if (!cell) return;
    if (enabled) {
      cell.classList.add("explanation-link-cell");
      cell.tabIndex = 0;
      cell.setAttribute("role", "button");
      cell.setAttribute("aria-label", `Open explanation for ${cell.textContent.trim()}`);
    } else {
      cell.classList.remove("explanation-link-cell");
      cell.removeAttribute("tabindex");
      cell.removeAttribute("role");
      cell.removeAttribute("aria-label");
    }
  }

  function markInteractiveCells(results) {
    if (!results) return;
    for (const tbody of results.querySelectorAll("tbody")) {
      if (!recognizedBody(tbody)) continue;
      for (const row of tbody.rows) {
        for (let cellIndex = 1; cellIndex < row.cells.length; cellIndex += 1) {
          const cell = row.cells[cellIndex];
          setInteractive(cell, !!cell.textContent.trim() && !!targetForCell(cell));
        }
      }
    }
  }

  function clearInteractiveCells(results) {
    if (!results) return;
    for (const cell of results.querySelectorAll(".explanation-link-cell")) setInteractive(cell, false);
  }

  function initialize() {
    if (typeof document === "undefined") return;
    const results = document.querySelector("#results");
    const panel = document.querySelector("#explanation-panel");
    const form = document.querySelector("#sarf-form");
    const sectionSelect = document.querySelector("#explanation-section");
    const fieldSelect = document.querySelector("#explanation-field");
    const rowSelect = document.querySelector("#explanation-row");
    const valueSelect = document.querySelector("#explanation-value");
    if (!results || !panel || !form || !sectionSelect || !fieldSelect || !rowSelect || !valueSelect) return;

    function dispatchChange(control) {
      control.dispatchEvent(new Event("change", { bubbles: true }));
    }

    function openTarget(target) {
      if (!target || panel.hidden) return false;
      sectionSelect.value = target.section;
      dispatchChange(sectionSelect);

      fieldSelect.value = target.section === "section04" ? target.group : target.field;
      if (!fieldSelect.value) return false;
      dispatchChange(fieldSelect);

      rowSelect.value = String(target.rowIndex);
      if (rowSelect.value !== String(target.rowIndex)) return false;
      dispatchChange(rowSelect);

      if (target.section === "section04") {
        valueSelect.value = String(target.valueIndex);
        if (valueSelect.value !== String(target.valueIndex)) return false;
        dispatchChange(valueSelect);
      }

      panel.scrollIntoView({ behavior: "smooth", block: "start" });
      return true;
    }

    function activate(cell) {
      if (!cell?.classList.contains("explanation-link-cell")) return false;
      return openTarget(targetForCell(cell));
    }

    results.addEventListener("click", (event) => {
      const cell = event.target.closest?.("td");
      activate(cell);
    });

    results.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      const cell = event.target.closest?.("td");
      if (activate(cell)) event.preventDefault();
    });

    // script.js and explanation-ui.js register their submit listeners before this
    // module is loaded, so generated cells and the fresh explanation snapshot are
    // already available when this handler runs.
    form.addEventListener("submit", () => markInteractiveCells(results));

    for (const selector of ["#root-one", "#root-two", "#root-three", "#root-four", "#bab", "#root-family"]) {
      const control = document.querySelector(selector);
      control?.addEventListener(selector === "#bab" || selector === "#root-family" ? "change" : "input", () => clearInteractiveCells(results));
    }

    for (const selector of ["#majzum-particle", "#mansub-particle", "#colour-root-letters"]) {
      document.querySelector(selector)?.addEventListener("change", () => markInteractiveCells(results));
    }
  }

  const api = Object.freeze({ VERBAL_TABLES, DERIVED_TABLES, targetForResultPosition, targetForCell });
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else {
    globalScope.SarfExplanationNavigation = api;
    initialize();
  }
})(typeof globalThis === "undefined" ? this : globalThis);
