import { h, euro } from "../../core/dom.js";
import { api } from "../../core/api.js";

const kpi = (l, v, cls = "") =>
  h("div", { class: "kpi " + cls }, h("span", {}, l), h("b", {}, v));

// Dashboard: indicatori principali e barre per stato fattura
export async function Dashboard() {
  const s = await api.get("dashboard");
  const max = Math.max(1, ...s.perStato.map((x) => x.tot));
  return h(
    "section",
    {},
    h("h1", {}, "Dashboard"),
    h("p", { class: "sub" }, "Panoramica della tua attività"),
    h(
      "div",
      { class: "kpis" },
      kpi("Fatturato", euro(s.fatturato), "hero"),
      kpi("Incassato", euro(s.incassato)),
      kpi("Clienti", s.clienti),
      kpi("Prodotti", s.prodotti),
      kpi("Fatture", s.fatture),
    ),
    h(
      "div",
      { class: "panel" },
      h("h2", {}, "Fatturato per stato"),
      s.perStato.map((x) =>
        h(
          "div",
          { class: "bar" },
          h("span", {}, x.stato),
          h(
            "i",
            { style: `--w:${(x.tot / max) * 100}%` },
            h("em", { class: x.stato }),
          ),
          h("b", {}, euro(x.tot)),
        ),
      ),
    ),
  );
}
