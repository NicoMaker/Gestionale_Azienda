import { h, euroInt } from "../../core/dom.js";
import { Panel } from "../panel/panel.js";
import { RowList } from "../row-list/row-list.js";

// Pannello con i clienti che hanno fatturato di più, con barra proporzionale
export function TopClients(clienti) {
  const max = Math.max(1, ...clienti.map((c) => c.tot));
  return Panel(
    {
      titolo: "Migliori clienti",
      link: { href: "#clienti", testo: "Vedi tutti" },
    },
    RowList(
      clienti.map((c) => ({
        titolo: c.nome,
        nota: c.n + (c.n === 1 ? " fattura" : " fatture"),
        mezzo: h("i", { style: `--w:${(c.tot / max) * 100}%` }),
        valore: euroInt(c.tot),
      })),
      "classifica",
    ),
  );
}
