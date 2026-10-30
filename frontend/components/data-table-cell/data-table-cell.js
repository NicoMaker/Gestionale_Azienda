import { h, euro, data } from "../../core/dom.js";
import { Badge } from "../badge/badge.js";

// Contenuto di una cella in base al formato della colonna (euro, data, email, badge)
export function DataTableCell(c, r) {
  const v = r[c.k];
  if (v == null || v === "") return h("span", { class: "nd" }, "–");
  if (c.fmt === "euro") return euro(v);
  if (c.fmt === "date") return data(v);
  if (c.fmt === "email") return h("a", { href: "mailto:" + v, onclick: (e) => e.stopPropagation() }, v);
  if (c.fmt === "badge") return Badge(v);
  return v;
}
