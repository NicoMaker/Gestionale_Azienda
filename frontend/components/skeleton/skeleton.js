import { h } from "../../core/dom.js";

// Segnaposto animato mostrato durante il caricamento di una pagina
export const Skeleton = (righe = 6) =>
  h("div", { "aria-busy": "true", "aria-label": "Caricamento" },
    h("div", { class: "sk", style: "height:34px;width:min(280px,60%);margin:12px 0 28px" }),
    ...Array.from({ length: righe }, () => h("div", { class: "sk", style: "height:46px;margin-bottom:10px;border-radius:10px" })),
  );
