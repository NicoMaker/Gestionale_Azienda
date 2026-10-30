import { h } from "../../core/dom.js";
import { icona } from "../../core/icons.js";

// Stato vuoto con messaggio e azione suggerita
export const EmptyState = ({ titolo, testo, azione }) =>
  h("div", { class: "vuoto" }, h("span", { class: "vuoto-ic", html: icona("inbox", 26) }), h("strong", {}, titolo), h("p", {}, testo), azione);
