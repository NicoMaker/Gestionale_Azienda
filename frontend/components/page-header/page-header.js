import { h } from "../../core/dom.js";

// Titolo di pagina con sottotitolo e azioni; `el.sottotitolo` si può aggiornare dall'esterno
export function PageHeader({ titolo, sottotitolo, azioni = [] }) {
  const sub = h("p", { class: "sub" }, sottotitolo);
  const el = h(
    "div",
    { class: "testa" },
    h("div", {}, h("h1", {}, titolo), sub),
    azioni,
  );
  el.sottotitolo = sub;
  return el;
}
