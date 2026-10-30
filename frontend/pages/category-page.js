import { h } from "../core/dom.js";
import { api } from "../core/api.js";
import { scarica } from "../core/download.js";
import { PageHeader } from "../components/page-header/page-header.js";
import { StatStrip } from "../components/stat-strip/stat-strip.js";
import { Button } from "../components/button/button.js";
import { SectionCard } from "../components/section-card/section-card.js";
import {
  ExportMenu,
  vociFormati,
} from "../components/export-menu/export-menu.js";

// Pagina di una categoria: le sue sezioni con il numero di record e l'esportazione dell'intera categoria
export async function CategoryPage(id) {
  const g = (await api.get("riepilogo")).find((x) => x.id === id);
  if (!g) throw new Error("Categoria non trovata");
  const collegamenti = g.sezioni.reduce((a, s) => a + s.collegamenti, 0);
  return h(
    "section",
    {},
    h("a", { class: "indietro", href: "#home" }, "← Panoramica"),
    PageHeader({
      titolo: g.titolo,
      sottotitolo: `${g.sezioni.length} sezioni · ${g.record.toLocaleString("it-IT")} record`,
      azioni: [
        ExportMenu({
          testo: "Esporta categoria",
          variante: "primary",
          voci: vociFormati(
            (f) => scarica(`esporta/gruppo/${g.id}/${f}`),
            ["xlsx", "pdf"],
          ),
        }),
      ],
    }),
    StatStrip([
      { etichetta: "Sezioni", valore: g.sezioni.length },
      { etichetta: "Record", valore: g.record.toLocaleString("it-IT") },
      { etichetta: "Collegamenti tra tabelle", valore: collegamenti },
    ]),
    h("div", { class: "sez-griglia" }, g.sezioni.map(SectionCard)),
  );
}
