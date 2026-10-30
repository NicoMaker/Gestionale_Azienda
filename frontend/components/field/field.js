import { h } from "../../core/dom.js";

// Campo del modulo (testo, email, numero, data o menu a tendina) con etichetta
export function Field(c, { valore = "", opzioni = [] } = {}) {
  const id = "f-" + c.k;
  let controllo;
  if (c.type === "select") {
    const fisse = !!c.opzioni;
    const op = fisse
      ? c.opzioni.map((o) => [o, o.replace(/_/g, " ")])
      : opzioni;
    controllo = h(
      "select",
      { id, name: c.k, class: "campo", required: c.req },
      !fisse &&
        h(
          "option",
          { value: "" },
          op.length ? "Scegli…" : "Nessuna voce disponibile",
        ),
      op.map(([v, l]) =>
        h("option", { value: v, selected: String(v) === String(valore) }, l),
      ),
    );
  } else
    controllo = h("input", {
      id,
      name: c.k,
      class: "campo",
      type: c.type || "text",
      step: c.step,
      required: c.req,
      value: valore,
      autocomplete: "off",
    });
  return h(
    "div",
    { class: "mf-campo" },
    h(
      "label",
      { for: id },
      c.l,
      c.req && h("span", { class: "req", "aria-hidden": "true" }, " *"),
    ),
    controllo,
  );
}
