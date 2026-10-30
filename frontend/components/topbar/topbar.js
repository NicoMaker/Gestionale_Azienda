import { h } from "../../core/dom.js";
import { icona, tonoGruppo } from "../../core/icons.js";
import { ENTITIES, GRUPPI } from "../../config/entities.js";
import { IconButton } from "../button/button.js";
import { scambiaTema, temaCorrente } from "../../core/store.js";

// Barra superiore: menu (mobile), percorso, ricerca rapida e cambio tema
export function Topbar(attiva, apriRicerca) {
  const E = ENTITIES[attiva];
  const gruppo = E && GRUPPI.find((g) => g.id === E.gruppo);
  const percorso = E
    ? [h("span", {}, gruppo.titolo), h("span", { class: "sep", html: icona("chevron", 13) }), h("strong", {}, E.titolo)]
    : [h("strong", {}, "Dashboard")];
  const scuro = temaCorrente() === "scuro";
  const tema = IconButton({
    icon: scuro ? "sun" : "moon",
    etichetta: scuro ? "Passa al tema chiaro" : "Passa al tema scuro",
    onclick: () => {
      scambiaTema();
      const ora = temaCorrente() === "scuro";
      tema.setAttribute("aria-label", ora ? "Passa al tema chiaro" : "Passa al tema scuro");
      tema.innerHTML = icona(ora ? "sun" : "moon");
    },
  });
  return h(
    "header",
    { class: "topbar", style: `--h:${E ? tonoGruppo(E.gruppo) : 262}` },
    IconButton({ icon: "menu", etichetta: "Apri menu", class: "btn ghost icon burger", onclick: () => document.body.classList.add("menu-aperto") }),
    h("nav", { class: "briciole", "aria-label": "Percorso" }, h("i", { class: "punto" }), percorso),
    h(
      "button",
      { class: "cerca-rapida", type: "button", onclick: apriRicerca },
      h("span", { html: icona("search", 16) }),
      h("span", { class: "testo" }, "Vai a una sezione"),
      h("kbd", {}, /Mac|iPhone|iPad/.test(navigator.platform) ? "⌘K" : "Ctrl K"),
    ),
    tema,
  );
}
