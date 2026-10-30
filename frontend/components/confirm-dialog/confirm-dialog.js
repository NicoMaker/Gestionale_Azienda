import { h } from "../../core/dom.js";
import { Button } from "../button/button.js";
import { apriDialog } from "../dialog/dialog.js";

// Conferma prima di un'azione irreversibile; restituisce true o false
export function conferma({ titolo, testo, azione = "Elimina" }) {
  return new Promise((ok) => {
    let esito = false;
    const dlg = apriDialog({
      classe: "modale stretta",
      role: "alertdialog",
      contenuto: [
        h(
          "div",
          { class: "conferma-testo" },
          h("h2", {}, titolo),
          h("p", {}, testo),
        ),
        h(
          "div",
          { class: "mf-az conferma-az" },
          Button({ testo: "Annulla", onclick: () => dlg.close() }),
          Button({
            testo: azione,
            variante: "danger",
            onclick: () => ((esito = true), dlg.close()),
          }),
        ),
      ],
    });
    dlg.addEventListener("close", () => ok(esito));
    dlg.querySelector(".btn").focus();
  });
}
