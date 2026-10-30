import { h } from "../../core/dom.js";

// Striscia di indicatori: [{ etichetta, valore, nota }]
export const StatStrip = (dati) =>
  h(
    "div",
    { class: "striscia" },
    dati.map((d) =>
      h(
        "div",
        { class: "dato" },
        h("span", {}, d.etichetta),
        h("b", {}, d.valore),
        d.nota && h("small", {}, d.nota),
      ),
    ),
  );
