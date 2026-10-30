import { h } from "../../core/dom.js";
import { ExportMenu, vociFormati } from "../export-menu/export-menu.js";
import { scarica } from "../../core/download.js";

// Scheda di una sezione (tabella) nella pagina di una categoria
export const SectionCard = (s) =>
  h(
    "article",
    { class: "sez" },
    h(
      "a",
      { class: "sez-link", href: "#" + s.nome },
      h("b", {}, s.titolo),
      h("span", { class: "sez-n" }, s.record.toLocaleString("it-IT")),
      h("small", {}, `${s.campi} campi` + (s.collegamenti ? ` · ${s.collegamenti} collegamenti` : "")),
    ),
    ExportMenu({
      testo: `Esporta ${s.titolo}`,
      soloIcona: true,
      voci: vociFormati((f) => scarica(`esporta/tabella/${s.nome}/${f}`)),
    }),
  );
