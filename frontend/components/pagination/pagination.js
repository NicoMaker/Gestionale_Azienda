import { h } from "../../core/dom.js";
import { Button } from "../button/button.js";

// Piede della tabella: intervallo mostrato e pulsanti Precedente / Successiva
export const Pagination = ({ da, a, totale, pagina, pagine, onCambia }) =>
  h(
    "div",
    { class: "dt-piede" },
    h("span", {}, `${da}–${a} di ${totale}`),
    h(
      "div",
      {},
      Button({
        testo: "Precedente",
        variante: "sm-txt",
        disabled: pagina === 0,
        onclick: () => onCambia(pagina - 1),
      }),
      Button({
        testo: "Successiva",
        variante: "sm-txt",
        disabled: pagina >= pagine - 1,
        onclick: () => onCambia(pagina + 1),
      }),
    ),
  );
