import { h } from "../../core/dom.js";
import { icona } from "../../core/icons.js";

// Bottone con testo e icona opzionale; con `href` diventa un link
export function Button({
  testo,
  icon,
  variante = "",
  tipo = "button",
  href,
  ...resto
}) {
  return h(
    href ? "a" : "button",
    {
      class: ("btn " + variante).trim(),
      ...(href ? { href } : { type: tipo }),
      ...resto,
    },
    icon && h("span", { html: icona(icon, 16) }),
    testo,
  );
}

// Bottone quadrato con la sola icona (serve sempre un'etichetta per l'accessibilità)
export function IconButton({
  icon,
  etichetta,
  variante = "ghost",
  piccolo = false,
  size = 18,
  ...resto
}) {
  return h("button", {
    class: `btn ${variante} icon${piccolo ? " sm" : ""}`,
    type: "button",
    "aria-label": etichetta,
    title: etichetta,
    html: icona(icon, size),
    ...resto,
  });
}
