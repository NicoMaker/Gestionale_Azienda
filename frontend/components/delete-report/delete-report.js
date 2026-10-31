import { h } from "../../core/dom.js";
import { Button } from "../button/button.js";
import { apriDialog } from "../dialog/dialog.js";

const MAX = 8;

// Riepilogo dopo un'eliminazione multipla in cui alcuni elementi sono rimasti perché collegati.
// Dice cosa è stato eliminato e, per ogni elemento rimasto, dove è usato.
export function mostraEsito({ eliminati, bloccati, tabella }) {
  const ok =
    eliminati === 1
      ? "1 elemento eliminato"
      : `${eliminati} elementi eliminati`;
  const no =
    bloccati.length === 1
      ? "1 elemento non eliminato"
      : `${bloccati.length} elementi non eliminati`;
  const dlg = apriDialog({
    classe: "modale",
    role: "dialog",
    contenuto: [
      h(
        "div",
        { class: "esito" },
        h(
          "h2",
          {},
          eliminati
            ? `${ok}, ${bloccati.length === 1 ? "1 rimasto" : `${bloccati.length} rimasti`}`
            : no,
        ),
        h(
          "p",
          {},
          `In ${tabella} restano gli elementi usati da altre tabelle. Per eliminarli, rimuovi prima i dati che li usano.`,
        ),
        h(
          "ul",
          { class: "esito-lista" },
          bloccati
            .slice(0, MAX)
            .map((b) =>
              h(
                "li",
                {},
                h("b", {}, b.etichetta || `Elemento ${b.id}`),
                h("small", {}, `Usato in ${b.usato_in}`),
              ),
            ),
          bloccati.length > MAX &&
            h(
              "li",
              { class: "esito-altri" },
              `e altri ${bloccati.length - MAX}`,
            ),
        ),
      ),
      h(
        "div",
        { class: "mf-az" },
        Button({
          testo: "Ho capito",
          variante: "primary",
          onclick: () => dlg.close(),
        }),
      ),
    ],
  });
  dlg.querySelector(".btn").focus();
}
