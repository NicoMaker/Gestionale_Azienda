import { h } from "../core/dom.js";
import { api } from "../core/api.js";
import { icona } from "../core/icons.js";
import { scarica } from "../core/download.js";
import { PageHeader } from "../components/page-header/page-header.js";
import { StatStrip } from "../components/stat-strip/stat-strip.js";
import { Panel } from "../components/panel/panel.js";
import { Button } from "../components/button/button.js";
import { CategoryCard } from "../components/category-card/category-card.js";
import { ExportMenu, vociFormati } from "../components/export-menu/export-menu.js";
import { EmptyState } from "../components/empty-state/empty-state.js";

const n = (x) => x.toLocaleString("it-IT");

// Pagina generale: tutte le categorie con i loro numeri, ricerca e download dei dati
export async function HomePage() {
  const gruppi = await api.get("riepilogo");
  const sezioni = gruppi.flatMap((g) => g.sezioni);
  const record = gruppi.reduce((a, g) => a + g.record, 0);

  const testa = PageHeader({
    titolo: "Panoramica",
    sottotitolo: `${gruppi.length} categorie · ${sezioni.length} sezioni · ${n(record)} record`,
    azioni: [
      ExportMenu({
        testo: "Scarica tutti i dati",
        variante: "primary",
        voci: [
          ...vociFormati((f) => scarica(`esporta/tutto/${f}`), ["xlsx", "pdf"]),
          { testo: "Copia del database", nota: "File .db di sicurezza", icon: "shield", onclick: () => scarica("backup") },
        ],
      }),
    ],
  });

  const griglia = h("div", { class: "cat-griglia" });
  const vuoto = h("div", { hidden: true }, EmptyState({ titolo: "Nessun risultato", testo: "Nessuna categoria o sezione corrisponde alla ricerca." }));
  const disegna = (q = "") => {
    const t = q.toLowerCase();
    const trovate = gruppi
      .map((g) => (!t || g.titolo.toLowerCase().includes(t) ? g : { ...g, sezioni: g.sezioni.filter((s) => (s.titolo + s.nome).toLowerCase().includes(t)) }))
      .filter((g) => g.sezioni.length);
    griglia.replaceChildren(...trovate.map(CategoryCard));
    vuoto.hidden = !!trovate.length;
  };
  const cerca = h(
    "label",
    { class: "dt-cerca home-cerca" },
    h("span", { html: icona("search", 16) }),
    h("input", { class: "campo", type: "search", placeholder: "Cerca una categoria o una sezione", "aria-label": "Cerca una categoria o una sezione", oninput: (e) => disegna(e.target.value.trim()) }),
  );
  disegna();

  return h(
    "section",
    {},
    testa,
    StatStrip([
      { etichetta: "Categorie", valore: gruppi.length },
      { etichetta: "Sezioni", valore: sezioni.length },
      { etichetta: "Record totali", valore: n(record) },
      { etichetta: "Sezioni con dati", valore: `${sezioni.filter((s) => s.record).length}/${sezioni.length}` },
    ]),
    h("div", { class: "home-barra" }, h("h2", {}, "Categorie"), cerca),
    griglia,
    vuoto,
    Panel(
      { titolo: "Dati e sicurezza", classe: "home-dati" },
      h(
        "div",
        { class: "home-azioni" },
        Button({ testo: "Tutto in Excel", icon: "sheet", onclick: () => scarica("esporta/tutto/xlsx") }),
        Button({ testo: "Tutto in PDF", icon: "pdf", onclick: () => scarica("esporta/tutto/pdf") }),
        Button({ testo: "Copia del database", icon: "shield", onclick: () => scarica("backup") }),
        h("small", {}, "Il backup è un file .db completo: conservalo in un posto sicuro."),
      ),
    ),
  );
}
