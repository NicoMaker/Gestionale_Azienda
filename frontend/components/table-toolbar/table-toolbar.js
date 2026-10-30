import { h } from "../../core/dom.js";
import { icona } from "../../core/icons.js";
import { Button } from "../button/button.js";

// Barra sopra la tabella: ricerca, conteggio ed esportazione.
// Il risultato espone `.input` e `.conta(testo)`.
export function TableToolbar({ onCerca, onEsporta }) {
  const input = h("input", {
    class: "campo",
    type: "search",
    placeholder: "Cerca in questa sezione",
    "aria-label": "Cerca in questa sezione",
    oninput: (e) => onCerca(e.target.value.trim()),
  });
  const conta = h("span", { class: "dt-conta" });
  const el = h(
    "div",
    { class: "dt-barra" },
    h(
      "label",
      { class: "dt-cerca" },
      h("span", { html: icona("search", 16) }),
      input,
    ),
    conta,
    Button({ testo: "Esporta CSV", icon: "download", onclick: onEsporta }),
  );
  el.input = input;
  el.conta = (t) => (conta.textContent = t);
  return el;
}
