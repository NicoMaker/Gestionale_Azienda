import { h } from "../../core/dom.js";
import { icona, tonoGruppo } from "../../core/icons.js";
import { ExportMenu, vociFormati } from "../export-menu/export-menu.js";
import { scarica } from "../../core/download.js";

const n = (x) => x.toLocaleString("it-IT");

// Scheda di una categoria nella pagina generale: icona, totali, prime sezioni e download
export const CategoryCard = (g) => {
  const piene = g.sezioni.filter((s) => s.record).length;
  return h(
    "article",
    { class: "cat", style: `--h:${tonoGruppo(g.id)}` },
    h(
      "div",
      { class: "cat-testa" },
      h("span", { class: "tile", html: icona(g.id, 20) }),
      h("div", {}, h("h3", {}, h("a", { href: "#cat/" + g.id }, g.titolo)), h("small", {}, `${g.sezioni.length} sezioni · ${n(g.record)} record`)),
      ExportMenu({
        testo: `Esporta ${g.titolo}`,
        soloIcona: true,
        voci: vociFormati((f) => scarica(`esporta/gruppo/${g.id}/${f}`), ["xlsx", "pdf"]),
      }),
    ),
    h(
      "ul",
      { class: "cat-lista" },
      g.sezioni.slice(0, 5).map((s) =>
        h("li", {}, h("a", { href: "#" + s.nome }, s.titolo), h("em", {}, n(s.record))),
      ),
    ),
    h(
      "a",
      { class: "cat-apri", href: "#cat/" + g.id },
      piene === g.sezioni.length ? "Apri la categoria" : `Apri la categoria (${piene}/${g.sezioni.length} con dati)`,
      h("span", { html: icona("chevron", 14) }),
    ),
  );
};
