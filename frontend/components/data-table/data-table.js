import { h, euro } from "../../core/dom.js";

const cella = (c, r) => {
  const v = r[c.k] ?? "";
  if (c.fmt === "euro") return euro(v);
  if (c.fmt === "badge") return h("span", { class: "badge " + v }, v);
  return v;
};

// Tabella con ricerca, modifica ed elimina
export function DataTable({ colonne, righe, onEdit, onDelete }) {
  const body = h("tbody");
  const disegna = (q = "") => {
    const f = righe.filter((r) => JSON.stringify(Object.values(r)).toLowerCase().includes(q.toLowerCase()));
    body.replaceChildren(...(f.length ? f.map((r) => h("tr", {},
      colonne.map((c) => h("td", { "data-l": c.l }, cella(c, r))),
      h("td", { class: "az" },
        h("button", { class: "btn sm", onclick: () => onEdit(r) }, "Modifica"),
        h("button", { class: "btn sm danger", onclick: () => onDelete(r) }, "Elimina")))) :
      [h("tr", {}, h("td", { colspan: colonne.length + 1, class: "vuoto" }, "Nessun risultato"))]));
  };
  disegna();
  return h("div", {},
    h("input", { class: "cerca", type: "search", placeholder: "Cerca…", oninput: (e) => disegna(e.target.value) }),
    h("div", { class: "tw" }, h("table", {}, h("thead", {}, h("tr", {}, colonne.map((c) => h("th", {}, c.l)), h("th"))), body)));
}
