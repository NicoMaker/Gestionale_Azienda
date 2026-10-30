import { h } from "../../core/dom.js";
import { icona, tonoGruppo } from "../../core/icons.js";
import { IconButton } from "../button/button.js";
import { GRUPPI, ENTITIES } from "../../config/entities.js";

// Menu laterale: Panoramica, Dashboard, 10 categorie a tendina con le 100 sezioni, esportazione e backup
export function Sidebar(attiva) {
  const gAttivo =
    ENTITIES[attiva]?.gruppo ??
    (attiva.startsWith("cat/") ? attiva.slice(4) : null);
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
      {
        class: "sb-gruppo",
        open: g.id === gAttivo,
        style: `--h:${tonoGruppo(g.id)}`,
      },
      h(
        "summary",
        {},
        h("span", { class: "tile", html: icona(g.id, 17) }),
        h("span", { class: "nome" }, g.titolo),
        h("em", {}, g.tabelle.length),
        h("span", { class: "freccia", html: icona("chevron", 14) }),
      ),
      h(
        "div",
        { class: "sb-voci" },
        h(
          "a",
          {
            href: "#cat/" + g.id,
            class: "sb-link sb-cat" + (attiva === "cat/" + g.id ? " on" : ""),
          },
          "Panoramica " + g.titolo.toLowerCase(),
        ),
        g.tabelle.map(link),
      ),
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
        {
          href: "#home",
          class: "sb-logo",
          "aria-label": "Vai alla panoramica",
        },
        h("span", { class: "marchio" }, "G"),
        h("span", {}, "Gestionale", h("small", {}, "Azienda")),
      ),
      IconButton({
        icon: "x",
        etichetta: "Chiudi menu",
        class: "btn ghost icon sb-chiudi",
        onclick: () => document.body.classList.remove("menu-aperto"),
      }),
    ),
    h(
      "a",
      {
        href: "#home",
        class: "sb-link sb-home" + (attiva === "home" ? " on" : ""),
        style: "--h:262",
      },
      h("span", { class: "tile", html: icona("home", 17) }),
      "Panoramica",
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
      { href: "/api/esporta/tutto/xlsx", class: "sb-backup", download: "" },
      h("span", { html: icona("sheet", 17) }),
      h(
        "span",
        {},
        "Esporta tutto",
        h("small", {}, "Excel con tutte le tabelle"),
      ),
    ),
    h(
      "a",
      { href: "/api/backup", class: "sb-backup", download: "" },
      h("span", { html: icona("download", 17) }),
      h("span", {}, "Scarica backup", h("small", {}, "Copia del database")),
    ),
  );
}
