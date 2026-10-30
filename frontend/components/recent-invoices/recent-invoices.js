import { h, euro, data } from "../../core/dom.js";
import { Badge } from "../badge/badge.js";
import { Panel } from "../panel/panel.js";
import { RowList } from "../row-list/row-list.js";

// Pannello con le ultime fatture registrate
export const RecentInvoices = (fatture) =>
  Panel(
    {
      titolo: "Ultime fatture",
      link: { href: "#fatture", testo: "Vedi tutte" },
    },
    RowList(
      fatture.map((f) => ({
        titolo: f.cliente || "Cliente non indicato",
        nota: data(f.data),
        mezzo: Badge(f.stato),
        valore: euro(f.importo),
      })),
    ),
  );
