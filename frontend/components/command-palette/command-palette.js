import { h } from "../../core/dom.js";
import { icona, tonoGruppo } from "../../core/icons.js";
import { apriDialog } from "../dialog/dialog.js";
import { GRUPPI } from "../../config/entities.js";

// Ricerca rapida (Ctrl/⌘ + K): salta a una categoria o a una delle 100 sezioni
export function apriRicerca() {
  if (document.querySelector(".palette")) return;
  const voci = [
    { nome: "home", titolo: "Panoramica", gruppo: "Pagina generale", g: "home" },
    {
      nome: "dashboard",
      titolo: "Dashboard",
      gruppo: "Panoramica",
      g: "dashboard",
    },
    ...GRUPPI.map((g) => ({
      nome: "cat/" + g.id,
      titolo: g.titolo,
      gruppo: "Categoria",
      g: g.id,
    })),
    ...GRUPPI.flatMap((g) =>
      g.tabelle.map((t) => ({
        nome: t.nome,
        titolo: t.titolo,
        gruppo: g.titolo,
        g: g.id,
      })),
    ),
  ];
  let sel = 0;
  let trovate = voci;
  const lista = h("ul", {
    class: "pal-lista",
    role: "listbox",
    id: "pal-lista",
  });
  let dlg;
  const input = h("input", {
    class: "pal-input",
    type: "search",
    placeholder: "Cerca una sezione, ad esempio «fatture»…",
    autocomplete: "off",
    role: "combobox",
    "aria-controls": "pal-lista",
    "aria-expanded": "true",
  });

  const vai = (v) => {
    dlg.close();
    location.hash = v.nome;
  };
  const disegna = () => {
    lista.replaceChildren(
      ...(trovate.length
        ? trovate.slice(0, 40).map((v, i) =>
            h(
              "li",
              {
                role: "option",
                class: i === sel ? "on" : "",
                "aria-selected": i === sel,
                style: `--h:${tonoGruppo(v.g)}`,
                onclick: () => vai(v),
                onmousemove: () => sel !== i && ((sel = i), disegna()),
              },
              h("span", { class: "tile", html: icona(v.g, 16) }),
              h("span", { class: "t" }, v.titolo),
              h("span", { class: "g" }, v.gruppo),
            ),
          )
        : [
            h(
              "li",
              { class: "pal-vuoto" },
              "Nessuna sezione corrisponde alla ricerca.",
            ),
          ]),
    );
    lista.querySelector(".on")?.scrollIntoView({ block: "nearest" });
  };
  input.addEventListener("input", () => {
    const q = input.value.trim().toLowerCase();
    trovate = voci.filter((v) =>
      (v.titolo + " " + v.gruppo + " " + v.nome).toLowerCase().includes(q),
    );
    sel = 0;
    disegna();
  });
  input.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const n = Math.min(trovate.length, 40) || 1;
      sel = (sel + (e.key === "ArrowDown" ? 1 : n - 1)) % n;
      disegna();
    } else if (e.key === "Enter" && trovate[sel]) vai(trovate[sel]);
  });
  const testa = h(
    "div",
    { class: "pal-testa", html: icona("search", 18) },
    input,
    h("kbd", {}, "Esc"),
  );
  dlg = apriDialog({
    classe: "palette",
    "aria-label": "Ricerca rapida",
    contenuto: [testa, lista],
  });
  disegna();
  input.focus();
}
