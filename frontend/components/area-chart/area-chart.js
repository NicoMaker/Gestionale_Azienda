import { h, compatto, euro, meseBreve, meseLungo } from "../../core/dom.js";
import { svg as s } from "../../core/svg.js";

// Andamento mensile: area per il fatturato, linea per l'incassato, tooltip al passaggio.
// `dati` = [{ mese: "2026-03", tot, inc }]
export function AreaChart({ dati }) {
  const box = h("div", { class: "ch" });
  const tip = h("div", { class: "ch-tip", hidden: true });
  const H = 250;
  const m = { t: 14, r: 12, b: 28, l: 46 };

  const disegna = () => {
    const W = Math.max(box.clientWidth, 280);
    const iw = W - m.l - m.r,
      ih = H - m.t - m.b;
    const top =
      Math.ceil(Math.max(1, ...dati.map((d) => d.tot)) / 1000) * 1000 || 1;
    const x = (i) =>
      m.l + (dati.length < 2 ? iw / 2 : (i / (dati.length - 1)) * iw);
    const y = (v) => m.t + ih - (v / top) * ih;
    const linea = (k) =>
      dati
        .map(
          (d, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(d[k]).toFixed(1)}`,
        )
        .join("");
    const grafico = s("svg", {
      width: W,
      height: H,
      role: "img",
      "aria-label": "Andamento mensile di fatturato e incassato",
    });
    for (let i = 0; i <= 4; i++) {
      const yy = y((top / 4) * i);
      grafico.append(
        s("line", { x1: m.l, x2: W - m.r, y1: yy, y2: yy, class: "g-grid" }),
        s(
          "text",
          { x: m.l - 8, y: yy + 4, class: "g-tick", "text-anchor": "end" },
          compatto((top / 4) * i),
        ),
      );
    }
    const passo = Math.ceil(dati.length / Math.max(2, Math.floor(iw / 56)));
    dati.forEach(
      (d, i) =>
        i % passo === 0 &&
        grafico.append(
          s(
            "text",
            { x: x(i), y: H - 8, class: "g-tick", "text-anchor": "middle" },
            meseBreve(d.mese),
          ),
        ),
    );
    grafico.append(
      s("path", {
        d: `${linea("tot")}L${x(dati.length - 1)},${y(0)}L${x(0)},${y(0)}Z`,
        class: "g-area",
      }),
      s("path", { d: linea("tot"), class: "g-fat", pathLength: 1 }),
      s("path", { d: linea("inc"), class: "g-inc", pathLength: 1 }),
    );
    const guida = s("line", {
      y1: m.t,
      y2: m.t + ih,
      class: "g-guida",
      visibility: "hidden",
    });
    const p1 = s("circle", { r: 4.5, class: "g-pt fat", visibility: "hidden" });
    const p2 = s("circle", { r: 4.5, class: "g-pt inc", visibility: "hidden" });
    grafico.append(guida, p1, p2);
    const mostra = (e) => {
      const px = e.clientX - grafico.getBoundingClientRect().left;
      const i = Math.max(
        0,
        Math.min(
          dati.length - 1,
          Math.round(((px - m.l) / iw) * (dati.length - 1)),
        ),
      );
      const d = dati[i];
      guida.setAttribute("x1", x(i));
      guida.setAttribute("x2", x(i));
      p1.setAttribute("cx", x(i));
      p1.setAttribute("cy", y(d.tot));
      p2.setAttribute("cx", x(i));
      p2.setAttribute("cy", y(d.inc));
      [guida, p1, p2].forEach((n) => n.setAttribute("visibility", "visible"));
      tip.hidden = false;
      tip.replaceChildren(
        h("b", {}, meseLungo(d.mese)),
        h(
          "span",
          { class: "k fat" },
          "Fatturato ",
          h("strong", {}, euro(d.tot)),
        ),
        h(
          "span",
          { class: "k inc" },
          "Incassato ",
          h("strong", {}, euro(d.inc)),
        ),
      );
      tip.style.left = Math.min(Math.max(x(i), 90), W - 90) + "px";
    };
    grafico.addEventListener("pointermove", mostra);
    grafico.addEventListener("pointerdown", mostra);
    grafico.addEventListener("pointerleave", () => {
      tip.hidden = true;
      [guida, p1, p2].forEach((n) => n.setAttribute("visibility", "hidden"));
    });
    box.replaceChildren(grafico, tip);
  };
  let larg = 0;
  new ResizeObserver(
    () => box.clientWidth !== larg && ((larg = box.clientWidth), disegna()),
  ).observe(box);
  return h(
    "div",
    {},
    h(
      "div",
      { class: "legenda" },
      h("span", { class: "k fat" }, "Fatturato"),
      h("span", { class: "k inc" }, "Incassato"),
    ),
    box,
  );
}
