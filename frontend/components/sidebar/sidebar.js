import { h } from "../../core/dom.js";
import { icona, tonoGruppo } from "../../core/icons.js";
import { IconButton } from "../button/button.js";
import { GRUPPI, ENTITIES } from "../../config/entities.js";

// Menu laterale: Dashboard, 10 gruppi a tendina con le 100 sezioni, backup
export function Sidebar(attiva) {
  const gAttivo = ENTITIES[attiva]?.gruppo;
  const link = (t) =>
    h(
      "a",
      {
        href: "#" + t.nome,
        class: "sb-link" + (t.nome === attiva ? " on" : ""),
        "aria-current": t.nome === attiva ? "page" : null,
      },
      t.titolo,
    );
  const gruppi = GRUPPI.map((g) =>
    h(
      "details",
      { class: "sb-gruppo", open: g.id === gAttivo, style: `--h:${tonoGruppo(g.id)}` },
      h(
        "summary",
        {},
        h("span", { class: "tile", html: icona(g.id, 17) }),
        h("span", { class: "nome" }, g.titolo),
        h("em", {}, g.tabelle.length),
        h("span", { class: "freccia", html: icona("chevron", 14) }),
      ),
      h("div", { class: "sb-voci" }, g.tabelle.map(link)),
    ),
  );
  return h(
    "div",
    { class: "sb" },
    h(
      "div",
      { class: "sb-testa" },
      h(
        "a",
        { href: "#dashboard", class: "sb-logo", "aria-label": "Vai alla dashboard" },
        h("span", { class: "marchio" }, "G"),
        h("span", {}, "Gestionale", h("small", {}, "Azienda")),
      ),
      IconButton({ icon: "x", etichetta: "Chiudi menu", class: "btn ghost icon sb-chiudi", onclick: () => document.body.classList.remove("menu-aperto") }),
    ),
    h(
      "a",
      {
        href: "#dashboard",
        class: "sb-link sb-home" + (attiva === "dashboard" ? " on" : ""),
        style: "--h:262",
      },
      h("span", { class: "tile", html: icona("dashboard", 17) }),
      "Dashboard",
    ),
    h("nav", { class: "sb-nav", "aria-label": "Sezioni" }, gruppi),
    h(
      "a",
      { href: "/api/backup", class: "sb-backup", download: "" },
      h("span", { html: icona("download", 17) }),
      h("span", {}, "Scarica backup", h("small", {}, "Copia del database")),
    ),
  );
}
