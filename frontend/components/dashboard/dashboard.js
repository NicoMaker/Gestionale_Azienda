import { h, euro, euroInt, etichetta, tonoStato } from "../../core/dom.js";
import { api } from "../../core/api.js";
import { GRUPPI } from "../../config/entities.js";
import { Button } from "../button/button.js";
import { PageHeader } from "../page-header/page-header.js";
import { StatStrip } from "../stat-strip/stat-strip.js";
import { Panel } from "../panel/panel.js";
import { AreaChart } from "../area-chart/area-chart.js";
import { DonutChart } from "../donut-chart/donut-chart.js";
import { RecentInvoices } from "../recent-invoices/recent-invoices.js";
import { TopClients } from "../top-clients/top-clients.js";
import { AreaGrid } from "../area-grid/area-grid.js";

const saluto = () => {
  const ora = new Date().getHours();
  return ora < 13 ? "Buongiorno" : ora < 18 ? "Buon pomeriggio" : "Buonasera";
};
const vuoto = (t) => h("p", { class: "sub" }, t);

// Pagina dashboard: compone i componenti con i dati di /api/dashboard
export async function Dashboard() {
  const s = await api.get("dashboard");
  const daIncassare = s.perStato.find((x) => x.stato === "emessa")?.tot || 0;
  const pct = s.fatturato ? Math.round((s.incassato / s.fatturato) * 100) : 0;

  const intro = PageHeader({
    titolo: saluto(),
    azioni: Button({
      testo: "Vai alle fatture",
      icon: "vendite",
      variante: "primary",
      href: "#fatture",
    }),
  });
  intro.sottotitolo.className = "sub frase";
  intro.sottotitolo.replaceChildren(
    ...(s.fatture
      ? [
          "In ",
          h("b", {}, s.fatture + " fatture"),
          " hai fatturato ",
          h("b", {}, euroInt(s.fatturato)),
          ": ",
          h("b", { class: "ok" }, pct + "%"),
          " è già stato incassato.",
        ]
      : [
          "Non ci sono ancora fatture: appena ne registri una, qui compare il quadro della tua attività.",
        ]),
  );

  return h(
    "section",
    {},
    intro,
    StatStrip([
      { etichetta: "Fatturato", valore: euro(s.fatturato) },
      { etichetta: "Incassato", valore: euro(s.incassato) },
      {
        etichetta: "Da incassare",
        valore: euro(daIncassare),
        nota: "fatture emesse",
      },
      { etichetta: "Clienti", valore: s.clienti },
      { etichetta: "Prodotti", valore: s.prodotti },
    ]),
    h(
      "div",
      { class: "griglia" },
      Panel(
        { titolo: "Andamento degli ultimi mesi" },
        s.perMese.length
          ? AreaChart({ dati: s.perMese })
          : vuoto("Nessun dato da mostrare."),
      ),
      Panel(
        { titolo: "Fatturato per stato" },
        s.perStato.length
          ? DonutChart({
              totale: s.fatture,
              parti: s.perStato.map((x) => ({
                etichetta: etichetta(x.stato),
                valore: x.tot,
                tono: tonoStato(x.stato),
              })),
            })
          : vuoto("Nessun dato da mostrare."),
      ),
    ),
    h(
      "div",
      { class: "griglia due" },
      RecentInvoices(s.ultime),
      TopClients(s.topClienti),
    ),
    AreaGrid(GRUPPI),
  );
}
