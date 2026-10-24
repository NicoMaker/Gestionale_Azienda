import { h } from "../../core/dom.js";

// Finestra con modulo generato dai campi; restituisce una Promise con i valori (o null se annullato)
export function apriForm({ titolo, campi, valori = {}, opzioni = {} }) {
  return new Promise((ok) => {
    const chiudi = (v) => { ov.remove(); ok(v); };
    const input = (c) => {
      const val = valori[c.k] ?? "";
      if (c.type === "select") {
        const op = c.opzioni ? c.opzioni.map((o) => [o, o]) : (opzioni[c.k] || []);
        return h("select", { name: c.k, required: c.req }, op.map(([v, l]) => h("option", { value: v, selected: String(v) === String(val) }, l)));
      }
      return h("input", { name: c.k, type: c.type || "text", step: c.step, required: c.req, value: val });
    };
    const form = h("form", { class: "mf", onsubmit: (e) => {
      e.preventDefault();
      const d = Object.fromEntries(new FormData(form));
      campi.filter((c) => c.type === "number").forEach((c) => (d[c.k] = Number(d[c.k] || 0)));
      chiudi(d);
    } },
      h("h2", {}, titolo),
      campi.map((c) => h("label", {}, c.l, input(c))),
      h("div", { class: "mf-az" },
        h("button", { type: "button", class: "btn", onclick: () => chiudi(null) }, "Annulla"),
        h("button", { class: "btn primary" }, "Salva")));
    const ov = h("div", { class: "ov", onclick: (e) => e.target === ov && chiudi(null) }, form);
    document.body.append(ov);
    form.querySelector("input,select")?.focus();
  });
}
