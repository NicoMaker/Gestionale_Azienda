import { h } from "../../core/dom.js";
import { icona } from "../../core/icons.js";
import { toCsv, scaricaCsv } from "../../core/csv.js";
import { Button, IconButton } from "../button/button.js";
import { TableToolbar } from "../table-toolbar/table-toolbar.js";
import { Pagination } from "../pagination/pagination.js";
import { EmptyState } from "../empty-state/empty-state.js";
import { DataTableCell } from "../data-table-cell/data-table-cell.js";

const PER_PAGINA = 25;
const numerica = (c) => c.fmt === "euro";

// Tabella con ricerca, ordinamento, paginazione, esportazione CSV, modifica ed elimina.
// `el.aggiorna(righe)` sostituisce i dati mantenendo ricerca, ordinamento e pagina.
export function DataTable({ colonne, righe, nome, onEdit, onDelete, onNew }) {
  let q = "", ord = null, pag = 0, tutte = righe;
  const body = h("tbody");
  const tw = h("div", { class: "tw" });
  const vuoto = h("div", { hidden: true });
  const piede = h("div");

  const ordina = (k) => {
    ord = ord?.k === k ? (ord.dir === 1 ? { k, dir: -1 } : null) : { k, dir: 1 };
    pag = 0;
    disegna();
  };
  const ths = colonne.map((c) =>
    h("th", { scope: "col", class: numerica(c) ? "num" : "", "aria-sort": "none" },
      h("button", { type: "button", onclick: () => ordina(c.k) }, c.l, h("span", { class: "freccia-ord" })),
    ),
  );
  const barra = TableToolbar({
    onCerca: (t) => ((q = t), (pag = 0), disegna()),
    onEsporta: () => scaricaCsv(nome, toCsv(colonne, filtrate())),
  });

  const filtrate = () => {
    const t = q.toLowerCase();
    const f = t ? tutte.filter((r) => JSON.stringify(Object.values(r)).toLowerCase().includes(t)) : [...tutte];
    if (ord)
      f.sort((a, b) => {
        const x = a[ord.k], y = b[ord.k];
        if (x == null || x === "") return 1;
        if (y == null || y === "") return -1;
        return (typeof x === "number" && typeof y === "number" ? x - y : String(x).localeCompare(String(y), "it", { numeric: true })) * ord.dir;
      });
    return f;
  };

  const riga = (r) =>
    h("tr", { onclick: () => onEdit(r) },
      colonne.map((c) => h("td", { "data-l": c.l, class: numerica(c) ? "num" : "" }, DataTableCell(c, r))),
      h("td", { class: "az" },
        IconButton({ icon: "edit", etichetta: "Modifica", piccolo: true, size: 16, onclick: (e) => (e.stopPropagation(), onEdit(r)) }),
        IconButton({ icon: "trash", etichetta: "Elimina", variante: "ghost rosso", piccolo: true, size: 16, onclick: (e) => (e.stopPropagation(), onDelete(r)) }),
      ),
    );

  function disegna() {
    const f = filtrate();
    const pagine = Math.max(1, Math.ceil(f.length / PER_PAGINA));
    pag = Math.min(pag, pagine - 1);
    const da = pag * PER_PAGINA;
    ths.forEach((th, i) => {
      const attiva = ord?.k === colonne[i].k;
      th.setAttribute("aria-sort", attiva ? (ord.dir === 1 ? "ascending" : "descending") : "none");
      th.querySelector(".freccia-ord").innerHTML = attiva ? icona(ord.dir === 1 ? "up" : "down", 13) : "";
    });
    body.replaceChildren(...f.slice(da, da + PER_PAGINA).map(riga));
    barra.conta(q ? `${f.length} di ${tutte.length}` : `${tutte.length} elementi`);
    tw.hidden = !f.length;
    piede.replaceChildren(f.length > PER_PAGINA ? Pagination({ da: da + 1, a: Math.min(da + PER_PAGINA, f.length), totale: f.length, pagina: pag, pagine, onCambia: (p) => ((pag = p), disegna()) }) : "");
    vuoto.hidden = !!f.length;
    vuoto.replaceChildren(
      f.length ? "" : tutte.length
        ? EmptyState({ titolo: "Nessun risultato", testo: `Nessun elemento contiene «${q}».`, azione: Button({ testo: "Cancella la ricerca", onclick: () => ((barra.input.value = q = ""), disegna(), barra.input.focus()) }) })
        : EmptyState({ titolo: "Ancora nessun elemento", testo: "Aggiungi il primo per iniziare a lavorare su questa sezione.", azione: Button({ testo: "Aggiungi", icon: "plus", variante: "primary", onclick: onNew }) }),
    );
  }

  tw.append(h("table", {}, h("thead", {}, h("tr", {}, ths, h("th", { class: "az" }, h("span", { class: "sr" }, "Azioni")))), body));
  const el = h("div", {}, barra, tw, vuoto, piede);
  el.aggiorna = (nuove) => ((tutte = nuove), disegna());
  disegna();
  return el;
}
