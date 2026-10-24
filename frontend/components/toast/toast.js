import { h } from "../../core/dom.js";
// Notifica temporanea in basso a destra
export function toast(msg, tipo = "ok") {
  const t = h("div", { class: "toast " + tipo }, msg);
  document.getElementById("toasts").append(t);
  setTimeout(() => t.remove(), 3200);
}
