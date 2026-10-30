import { h, euro } from "../../core/dom.js";
import { svg as s } from "../../core/svg.js";

// Ciambella con legenda. `parti` = [{ etichetta, valore, tono }], `totale` = numero al centro
export function DonutChart({ parti, totale, unita = "fatture" }) {
  const R = 52, C = 2 * Math.PI * R;
  const somma = parti.reduce((a, p) => a + p.valore, 0) || 1;
  let acc = 0;
  const grafico = s("svg", { viewBox: "0 0 140 140", width: 140, height: 140, role: "img", "aria-label": "Ripartizione per stato" },
    s("circle", { cx: 70, cy: 70, r: R, class: "d-fondo" }),
    ...parti.map((p) => {
      const len = (p.valore / somma) * C;
      const arco = s("circle", { cx: 70, cy: 70, r: R, class: "d-arco " + p.tono, "stroke-dasharray": `${Math.max(len - 3, 0)} ${C}`, "stroke-dashoffset": -acc, transform: "rotate(-90 70 70)" });
      acc += len;
      return arco;
    }),
    s("text", { x: 70, y: 68, class: "d-num", "text-anchor": "middle" }, String(totale)),
    s("text", { x: 70, y: 86, class: "d-lab", "text-anchor": "middle" }, unita),
  );
  return h("div", { class: "ciambella" }, grafico,
    h("ul", {}, parti.map((p) => h("li", {}, h("i", { class: "pt " + p.tono }), h("span", {}, p.etichetta), h("b", {}, euro(p.valore))))));
}
