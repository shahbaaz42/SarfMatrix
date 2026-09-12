// Phase B10.3: optional Arabic root keyboard for users without an Arabic keyboard.
(function exposeArabicRootKeyboard(globalScope) {
  "use strict";

  const LETTERS = Object.freeze([
    "ا", "ب", "ت", "ث", "ج", "ح", "خ",
    "د", "ذ", "ر", "ز", "س", "ش", "ص", "ض",
    "ط", "ظ", "ع", "غ", "ف", "ق", "ك", "ل",
    "م", "ن", "ه", "و", "ي",
  ]);
  const ROOT_SELECTORS = Object.freeze(["#root-one", "#root-two", "#root-three", "#root-four"]);

  function activeInputs() {
    return ROOT_SELECTORS
      .map((selector) => document.querySelector(selector))
      .filter((input) => input && !input.disabled && !input.closest("[hidden]"));
  }

  function firstAvailableInput() {
    const inputs = activeInputs();
    return inputs.find((input) => !input.value.trim()) || inputs[0] || null;
  }

  function initialize() {
    const rootInputs = document.querySelector(".root-inputs");
    if (!rootInputs || document.querySelector("#arabic-root-keyboard")) return;

    let target = firstAvailableInput();
    for (const input of ROOT_SELECTORS.map((selector) => document.querySelector(selector)).filter(Boolean)) {
      input.addEventListener("focus", () => { target = input; });
    }

    const wrapper = document.createElement("div");
    wrapper.className = "arabic-keyboard-control";
    wrapper.dir = "ltr";

    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "arabic-keyboard-toggle";
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-controls", "arabic-root-keyboard");
    toggle.textContent = "⌨ Arabic Keyboard";

    const keyboard = document.createElement("div");
    keyboard.id = "arabic-root-keyboard";
    keyboard.className = "arabic-root-keyboard";
    keyboard.lang = "ar";
    keyboard.dir = "rtl";
    keyboard.hidden = true;

    for (const letter of LETTERS) {
      const key = document.createElement("button");
      key.type = "button";
      key.className = "arabic-root-key";
      key.textContent = letter;
      key.setAttribute("aria-label", `Arabic letter ${letter}`);
      key.addEventListener("click", () => {
        const inputs = activeInputs();
        if (!target || !inputs.includes(target)) target = firstAvailableInput();
        if (!target) return;
        target.value = letter;
        target.dispatchEvent(new Event("input", { bubbles: true }));
        const currentIndex = inputs.indexOf(target);
        target = inputs[currentIndex + 1] || inputs.find((input) => !input.value.trim()) || inputs[0] || target;
        target?.focus();
      });
      keyboard.append(key);
    }

    const backspace = document.createElement("button");
    backspace.type = "button";
    backspace.className = "arabic-root-key arabic-root-key--action";
    backspace.textContent = "⌫";
    backspace.setAttribute("aria-label", "Clear current root letter");
    backspace.addEventListener("click", () => {
      if (!target) target = firstAvailableInput();
      if (!target) return;
      target.value = "";
      target.dispatchEvent(new Event("input", { bubbles: true }));
      target.focus();
    });
    keyboard.append(backspace);

    toggle.addEventListener("click", () => {
      keyboard.hidden = !keyboard.hidden;
      toggle.setAttribute("aria-expanded", String(!keyboard.hidden));
      if (!keyboard.hidden) target = firstAvailableInput();
    });

    wrapper.append(toggle, keyboard);
    rootInputs.insertAdjacentElement("afterend", wrapper);
  }

  const api = Object.freeze({ LETTERS });
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else {
    globalScope.SarfArabicRootKeyboard = api;
    if (typeof document !== "undefined") {
      if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initialize, { once: true });
      else initialize();
    }
  }
})(typeof globalThis === "undefined" ? this : globalThis);
