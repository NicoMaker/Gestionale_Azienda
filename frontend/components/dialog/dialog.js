import { h } from "../../core/dom.js";

// Base di tutte le finestre: <dialog> nativo (focus, Esc e sfondo gestiti dal browser).
// Si chiude con un clic sullo sfondo e si rimuove dal DOM da sola.
export function apriDialog({ classe = "modale", contenuto, ...attrs }) {
  const dlg = h("dialog", { class: classe, ...attrs }, contenuto);
  dlg.addEventListener("click", (e) => e.target === dlg && dlg.close());
  dlg.addEventListener("close", () => dlg.remove());
  document.body.append(dlg);
  dlg.showModal();
  return dlg;
}
