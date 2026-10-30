import { h } from "../../core/dom.js";
import { icona } from "../../core/icons.js";

// Pulsante «Esporta» con menu a comparsa. `voci`: [{ testo, nota, icon, onclick }]
// Con `soloIcona` mostra solo l'icona di download (per le schede).
export function ExportMenu({
  voci,
  testo = "Esporta",
  soloIcona = false,
  variante = "",
}) {
  const lista = h(
    "div",
    { class: "xm-lista", role: "menu", hidden: true },
    voci.map((v) =>
      h(
        "button",
        {
          type: "button",
          role: "menuitem",
          class: "xm-voce",
          onclick: (e) => {
            e.stopPropagation();
            chiudi();
            v.onclick();
          },
        },
        h("span", { html: icona(v.icon, 17) }),
        h("span", {}, h("b", {}, v.testo), v.nota && h("small", {}, v.nota)),
      ),
    ),
  );
  const bottone = h(
    "button",
    {
      type: "button",
      class: ("btn " + variante + (soloIcona ? " icon sm ghost" : "")).trim(),
      "aria-haspopup": "menu",
      "aria-expanded": "false",
      "aria-label": soloIcona ? testo : null,
      title: soloIcona ? testo : null,
      onclick: (e) => {
        e.stopPropagation();
        lista.hidden ? apri() : chiudi();
      },
    },
    h("span", { html: icona("download", soloIcona ? 16 : 16) }),
    !soloIcona && testo,
    !soloIcona && h("span", { class: "xm-freccia", html: icona("down", 13) }),
  );
  const el = h("div", { class: "xm" }, bottone, lista);
  const fuori = (e) => !el.contains(e.target) && chiudi();
  const tasto = (e) => e.key === "Escape" && (chiudi(), bottone.focus());
  function apri() {
    lista.hidden = false;
    bottone.setAttribute("aria-expanded", "true");
    setTimeout(() => {
      document.addEventListener("click", fuori);
      document.addEventListener("keydown", tasto);
    });
    lista.querySelector("button")?.focus();
  }
  function chiudi() {
    lista.hidden = true;
    bottone.setAttribute("aria-expanded", "false");
    document.removeEventListener("click", fuori);
    document.removeEventListener("keydown", tasto);
  }
  return el;
}

// Voci standard di esportazione: ricevono una funzione che scarica il formato scelto
export const vociFormati = (scarica, formati = ["xlsx", "pdf", "csv"]) =>
  formati
    .map(
      (f) =>
        ({
          xlsx: { testo: "Excel", nota: "Foglio .xlsx", icon: "sheet" },
          pdf: { testo: "PDF", nota: "Documento stampabile", icon: "pdf" },
          csv: { testo: "CSV", nota: "Testo separato da «;»", icon: "csv" },
        })[f],
    )
    .map((v, i) => ({ ...v, onclick: () => scarica(formati[i]) }));
