import { h } from "../../core/dom.js";
import { Button, IconButton } from "../button/button.js";
import { Field } from "../field/field.js";
import { apriDialog } from "../dialog/dialog.js";

// Finestra con modulo generato dai campi; restituisce una Promise con i valori (o null se annullato)
export function apriForm({
  titolo,
  sottotitolo,
  azione = "Salva",
  campi,
  valori = {},
  opzioni = {},
}) {
  return new Promise((ok) => {
    let esito = null;
    const form = h(
      "form",
      {
        method: "dialog",
        class: "mf",
        onsubmit: (e) => {
          e.preventDefault();
          const d = Object.fromEntries(new FormData(form));
          for (const c of campi) {
            if (d[c.k] === "") d[c.k] = null;
            else if (c.type === "number") d[c.k] = Number(d[c.k]);
          }
          esito = d;
          dlg.close();
        },
      },
      h(
        "header",
        { class: "mf-testa" },
        h(
          "div",
          {},
          h("h2", {}, titolo),
          sottotitolo && h("p", {}, sottotitolo),
        ),
        IconButton({
          icon: "x",
          etichetta: "Chiudi",
          onclick: () => dlg.close(),
        }),
      ),
      h(
        "div",
        { class: "mf-griglia" },
        campi.map((c) =>
          Field(c, { valore: valori[c.k] ?? "", opzioni: opzioni[c.k] || [] }),
        ),
      ),
      h(
        "footer",
        { class: "mf-az" },
        Button({ testo: "Annulla", onclick: () => dlg.close() }),
        Button({ testo: azione, variante: "primary", tipo: "submit" }),
      ),
    );
    const dlg = apriDialog({ contenuto: form });
    dlg.addEventListener("close", () => ok(esito));
    form.querySelector("input,select")?.focus();
  });
}
