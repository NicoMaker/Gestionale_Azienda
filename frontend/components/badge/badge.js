import { h, etichetta, tonoStato } from "../../core/dom.js";

// Pallino + testo colorato in base allo stato (pagata, emessa, annullato…)
export const Badge = (valore) => h("span", { class: "badge " + tonoStato(valore) }, etichetta(valore));
