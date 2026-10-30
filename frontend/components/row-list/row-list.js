import { h } from "../../core/dom.js";

// Elenco a righe: [{ titolo, nota, mezzo, valore }] — `mezzo` è un elemento (badge, barra…)
export const RowList = (righe, classe = "") =>
  h(
    "ul",
    { class: ("elenco " + classe).trim() },
    righe.map((r) =>
      h(
        "li",
        {},
        h("div", {}, h("b", {}, r.titolo), h("small", {}, r.nota)),
        r.mezzo,
        h("b", { class: "imp" }, r.valore),
      ),
    ),
  );
