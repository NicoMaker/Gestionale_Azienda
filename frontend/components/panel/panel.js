import { h } from "../../core/dom.js";

// Riquadro con titolo, collegamento opzionale ("Vedi tutte") e contenuto
export const Panel = ({ titolo, link, classe = "" }, ...contenuto) =>
  h(
    "section",
    { class: ("panel " + classe).trim() },
    h(
      "div",
      { class: "panel-testa" },
      h("h2", {}, titolo),
      link && h("a", { href: link.href }, link.testo),
    ),
    contenuto,
  );
