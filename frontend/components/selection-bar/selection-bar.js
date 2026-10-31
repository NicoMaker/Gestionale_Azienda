import { h } from "../../core/dom.js";
import { icona } from "../../core/icons.js";
import { Button } from "../button/button.js";

// Barra fissa in basso che compare quando ci sono elementi selezionati.
// `el.aggiorna(n)` mostra/nasconde la barra e aggiorna il conteggio.
export function SelectionBar({ onElimina, onAnnulla }) {
  const n = h("b", { "aria-live": "polite" });
  const testo = h("span", { class: "sb-testo" });
  const el = h(
    "div",
    {
      class: "selbar",
      role: "region",
      "aria-label": "Elementi selezionati",
      hidden: true,
    },
    h("span", { class: "selbar-ic", html: icona("check", 16) }),
    testo,
    Button({ testo: "Deseleziona", variante: "ghost", onclick: onAnnulla }),
    Button({
      testo: "Elimina",
      icon: "trash",
      variante: "danger",
      onclick: onElimina,
    }),
  );
  testo.append(n, " selezionati");
  el.aggiorna = (tot) => {
    el.hidden = !tot;
    n.textContent = tot;
    testo.lastChild.textContent = tot === 1 ? " selezionato" : " selezionati";
  };
  return el;
}
