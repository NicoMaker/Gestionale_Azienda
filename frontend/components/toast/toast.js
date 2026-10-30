import { h } from "../../core/dom.js";
import { icona } from "../../core/icons.js";
import { IconButton } from "../button/button.js";

// Notifica temporanea in basso a destra
export function toast(msg, tipo = "ok") {
  const t = h(
    "div",
    { class: "toast " + tipo, role: tipo === "err" ? "alert" : "status" },
    h("span", { html: icona(tipo === "err" ? "alert" : "check", 18) }),
    h("span", { class: "msg" }, msg),
    IconButton({ icon: "x", etichetta: "Chiudi", piccolo: true, size: 15, onclick: () => t.remove() }),
  );
  document.getElementById("toasts").append(t);
  setTimeout(() => t.remove(), tipo === "err" ? 6000 : 3200);
}
