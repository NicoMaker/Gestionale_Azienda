import { h } from "../../core/dom.js";
import { icona } from "../../core/icons.js";
import { scarica } from "../../core/download.js";
import { Button, IconButton } from "../button/button.js";
import { TableToolbar } from "../table-toolbar/table-toolbar.js";
import { Pagination } from "../pagination/pagination.js";
import { EmptyState } from "../empty-state/empty-state.js";
import { DataTableCell } from "../data-table-cell/data-table-cell.js";
import { SelectionBar } from "../selection-bar/selection-bar.js";

const PER_PAGINA = 25;
const numerica = (c) => c.fmt === "euro";

// Tabella con ricerca, ordinamento, paginazione, esportazione (Excel, PDF, CSV), modifica ed elimina.
// `el.aggiorna(righe)` sostituisce i dati mantenendo ricerca, ordinamento e pagina.
// Con `onDeleteMany(ids, tutti)` compaiono le caselle di selezione e la barra «Elimina» in basso e il pulsante «Elimina tutti».
export function DataTable({
  colonne,
  righe,
  nome,
  onEdit,
  onDelete,
  onDeleteMany,
  onNew,
}) {
  let q = "",
    ord = null,
    pag = 0,
    tutte = righe;
  const sel = new Set(); // id selezionati (restano anche cambiando pagina)
  const body = h("tbody");
  const tw = h("div", { class: "tw" });
  const vuoto = h("div", { hidden: true });
  const piede = h("div");

  const ordina = (k) => {
    ord =
      ord?.k === k ? (ord.dir === 1 ? { k, dir: -1 } : null) : { k, dir: 1 };
    pag = 0;
    disegna();
  };
  const ths = colonne.map((c) =>
    h(
      "th",
      { scope: "col", class: numerica(c) ? "num" : "", "aria-sort": "none" },
      h(
        "button",
        { type: "button", onclick: () => ordina(c.k) },
        c.l,
        h("span", { class: "freccia-ord" }),
      ),
    ),
  );
  const barra = TableToolbar({
    onCerca: (t) => ((q = t), (pag = 0), disegna()),
    // il server esporta tutta la tabella (o solo le righe che contengono il testo cercato)
    onEsporta: (formato) =>
      scarica(
        `esporta/tabella/${nome}/${formato}${q ? "?q=" + encodeURIComponent(q) : ""}`,
      ),
  });

  const deseleziona = () => (sel.clear(), disegna());
  const barraSel = SelectionBar({
    onElimina: () => onDeleteMany([...sel], false),
    onAnnulla: deseleziona,
  });
  // Esc toglie la selezione (il listener si rimuove da solo quando la tabella esce dalla pagina)
  const suEsc = (e) => {
    if (!el.isConnected) return document.removeEventListener("keydown", suEsc);
    if (e.key === "Escape" && sel.size && !document.querySelector("dialog[open]"))
      deseleziona();
  };
  document.addEventListener("keydown", suEsc);
  const btnTutti = Button({
    testo: "Elimina tutti",
    icon: "trash",
    variante: "ghost rosso dt-tutti",
    onclick: () => {
      const f = filtrate();
      // senza ricerca attiva si elimina l'intera tabella, altrimenti solo i risultati trovati
      onDeleteMany(
        f.map((r) => r.id),
        !q,
      );
    },
  });
  if (onDeleteMany) barra.querySelector(".dt-conta").after(btnTutti);

  const chkTutti = h("input", {
    type: "checkbox",
    class: "dt-chk",
    "aria-label": "Seleziona tutti gli elementi",
    onchange: (e) => {
      const f = filtrate();
      f.forEach((r) => (e.target.checked ? sel.add(r.id) : sel.delete(r.id)));
      disegna();
    },
  });

  const filtrate = () => {
    const t = q.toLowerCase();
    const f = t
      ? tutte.filter((r) =>
          JSON.stringify(Object.values(r)).toLowerCase().includes(t),
        )
      : [...tutte];
    if (ord)
      f.sort((a, b) => {
        const x = a[ord.k],
          y = b[ord.k];
        if (x == null || x === "") return 1;
        if (y == null || y === "") return -1;
        return (
          (typeof x === "number" && typeof y === "number"
            ? x - y
            : String(x).localeCompare(String(y), "it", { numeric: true })) *
          ord.dir
        );
      });
    return f;
  };

  const riga = (r) =>
    h(
      "tr",
      { onclick: () => onEdit(r), class: sel.has(r.id) ? "selezionata" : "" },
      onDeleteMany &&
        h(
          "td",
          { class: "sel", onclick: (e) => e.stopPropagation() },
          h("input", {
            type: "checkbox",
            class: "dt-chk",
            "aria-label": "Seleziona elemento",
            checked: sel.has(r.id),
            onchange: (e) => {
              e.target.checked ? sel.add(r.id) : sel.delete(r.id);
              disegna();
            },
          }),
        ),
      colonne.map((c) =>
        h(
          "td",
          { "data-l": c.l, class: numerica(c) ? "num" : "" },
          DataTableCell(c, r),
        ),
      ),
      h(
        "td",
        { class: "az" },
        IconButton({
          icon: "edit",
          etichetta: "Modifica",
          piccolo: true,
          size: 16,
          onclick: (e) => (e.stopPropagation(), onEdit(r)),
        }),
        IconButton({
          icon: "trash",
          etichetta: "Elimina",
          variante: "ghost rosso",
          piccolo: true,
          size: 16,
          onclick: (e) => (e.stopPropagation(), onDelete(r)),
        }),
      ),
    );

  function disegna() {
    const f = filtrate();
    const pagine = Math.max(1, Math.ceil(f.length / PER_PAGINA));
    pag = Math.min(pag, pagine - 1);
    const da = pag * PER_PAGINA;
    ths.forEach((th, i) => {
      const attiva = ord?.k === colonne[i].k;
      th.setAttribute(
        "aria-sort",
        attiva ? (ord.dir === 1 ? "ascending" : "descending") : "none",
      );
      th.querySelector(".freccia-ord").innerHTML = attiva
        ? icona(ord.dir === 1 ? "up" : "down", 13)
        : "";
    });
    // la selezione contiene solo righe ancora esistenti
    const esistenti = new Set(tutte.map((r) => r.id));
    for (const id of sel) if (!esistenti.has(id)) sel.delete(id);
    body.replaceChildren(...f.slice(da, da + PER_PAGINA).map(riga));
    barra.conta(
      (q ? `${f.length} di ${tutte.length}` : `${tutte.length} elementi`) +
        (sel.size ? ` · ${sel.size} selezionati` : ""),
    );
    const nSel = f.filter((r) => sel.has(r.id)).length;
    chkTutti.checked = !!f.length && nSel === f.length;
    chkTutti.indeterminate = nSel > 0 && nSel < f.length;
    barraSel.aggiorna(sel.size);
    btnTutti.hidden = !f.length;
    btnTutti.lastChild.textContent = q ? "Elimina trovati" : "Elimina tutti";
    tw.hidden = !f.length;
    piede.replaceChildren(
      f.length > PER_PAGINA
        ? Pagination({
            da: da + 1,
            a: Math.min(da + PER_PAGINA, f.length),
            totale: f.length,
            pagina: pag,
            pagine,
            onCambia: (p) => ((pag = p), disegna()),
          })
        : "",
    );
    vuoto.hidden = !!f.length;
    vuoto.replaceChildren(
      f.length
        ? ""
        : tutte.length
          ? EmptyState({
              titolo: "Nessun risultato",
              testo: `Nessun elemento contiene «${q}».`,
              azione: Button({
                testo: "Cancella la ricerca",
                onclick: () => (
                  (barra.input.value = q = ""),
                  disegna(),
                  barra.input.focus()
                ),
              }),
            })
          : EmptyState({
              titolo: "Ancora nessun elemento",
              testo:
                "Aggiungi il primo per iniziare a lavorare su questa sezione.",
              azione: Button({
                testo: "Aggiungi",
                icon: "plus",
                variante: "primary",
                onclick: onNew,
              }),
            }),
    );
  }

  tw.append(
    h(
      "table",
      {},
      h(
        "thead",
        {},
        h(
          "tr",
          {},
          onDeleteMany && h("th", { class: "sel", scope: "col" }, chkTutti),
          ths,
          h("th", { class: "az" }, h("span", { class: "sr" }, "Azioni")),
        ),
      ),
      body,
    ),
  );
  const el = h("div", {}, barra, tw, vuoto, piede, barraSel);
  el.aggiorna = (nuove) => ((tutte = nuove), disegna());
  disegna();
  return el;
}
