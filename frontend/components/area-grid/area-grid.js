import { h } from "../../core/dom.js";
import { icona, tonoGruppo } from "../../core/icons.js";

// Griglia di accesso rapido alle aree del gestionale
export const AreaGrid = (gruppi) =>
  h(
    "section",
    { class: "aree" },
    h("h2", {}, "Tutte le aree"),
    h(
      "div",
      { class: "aree-griglia" },
      gruppi.map((g) =>
        h(
          "a",
          {
            href: "#cat/" + g.id,
            class: "area",
            style: `--h:${tonoGruppo(g.id)}`,
          },
          h("span", { class: "tile", html: icona(g.id, 18) }),
          h(
            "span",
            {},
            h("b", {}, g.titolo),
            h("small", {}, g.tabelle.length + " sezioni"),
          ),
        ),
      ),
    ),
  );
