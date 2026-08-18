// Collect the page elements once so they can be reused when the form is submitted.
const form = document.querySelector("#sarf-form");
const rootInputs = [
  document.querySelector("#root-one"),
  document.querySelector("#root-two"),
  document.querySelector("#root-three"),
];
const babSelect = document.querySelector("#bab");
const results = document.querySelector("#results");

form.addEventListener("submit", (event) => {
  // Keep the form on this page instead of sending it to a server.
  event.preventDefault();

  const root = rootInputs.map((input) => input.value.trim()).join(" ");
  const selectedBab = babSelect.value;

  // Build elements and use textContent so user input is displayed as plain text.
  const heading = document.createElement("h2");
  heading.textContent = "Your selection";

  const rootSummary = document.createElement("p");
  rootSummary.className = "root-result";
  rootSummary.dir = "rtl";
  rootSummary.textContent = `Root: ${root}`;

  const babSummary = document.createElement("p");
  babSummary.textContent = `Bāb: ${selectedBab}`;

  results.replaceChildren(heading, rootSummary, babSummary);
});
