import { h } from "../../core/dom.js";
import { GRUPPI, ENTITIES } from "../../config/entities.js";

// Menu laterale: Dashboard, ricerca tabelle, 10 gruppi a tendina con le 100 sezioni, backup
export function Sidebar(attiva) {
  const gAttivo = ENTITIES[attiva]?.gruppo;
  const link = (t) => h("a", { href: "#" + t.nome, class: "sb-link sm" + (t.nome === attiva ? " on" : ""), "data-n": t.titolo.toLowerCase() }, t.titolo);
  const sezioni = GRUPPI.map((g) => h("details", { open: g.id === gAttivo },
    h("summary", {}, h("span", {}, g.icona), g.titolo, h("em", {}, g.tabelle.length)), g.tabelle.map(link)));
  const cerca = h("input", { class: "sb-cerca", type: "search", placeholder: "Cerca tabella…", oninput: (e) => {
    const q = e.target.value.toLowerCase();
    sezioni.forEach((d) => { let n = 0; d.querySelectorAll("a").forEach((a) => { const s = a.dataset.n.includes(q); a.hidden = !s; n += s; }); d.hidden = !n; if (q) d.open = true; });
  } });
  return h("div", { class: "sb" },
    h("div", { class: "sb-logo" }, h("span", {}, "Σ"), "Gestionale"),
    h("a", { href: "#dashboard", class: "sb-link" + (attiva === "dashboard" ? " on" : "") }, h("span", {}, "📊"), "Dashboard"),
    cerca, h("nav", {}, sezioni),
    h("a", { href: "/api/backup", class: "sb-link sb-backup", download: "" }, h("span", {}, "💾"), "Scarica backup"));
}
