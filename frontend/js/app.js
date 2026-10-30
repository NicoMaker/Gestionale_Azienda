import { h } from "../core/dom.js";
import { applicaTema } from "../core/store.js";
import { Sidebar } from "../components/sidebar/sidebar.js";
import { Topbar } from "../components/topbar/topbar.js";
import { Dashboard } from "../components/dashboard/dashboard.js";
import { EntityPage } from "../pages/entity-page.js";
import { ENTITIES, caricaSchema } from "../config/entities.js";
import { Skeleton } from "../components/skeleton/skeleton.js";
import { toast } from "../components/toast/toast.js";
import { apriRicerca } from "../components/command-palette/command-palette.js";

applicaTema();

// Router a hash: #dashboard, #clienti, #fatture, …
let giro = 0;
async function mostra() {
  const mio = ++giro;
  document.body.classList.remove("menu-aperto");
  const nome = location.hash.slice(1);
  const attiva = nome in ENTITIES ? nome : "dashboard";
  document.getElementById("sidebar").replaceChildren(Sidebar(attiva));
  document.getElementById("topbar").replaceChildren(Topbar(attiva, apriRicerca));
  document.title = (ENTITIES[attiva]?.titolo || "Dashboard") + " · Gestionale";
  const view = document.getElementById("view");
  view.replaceChildren(Skeleton());
  try {
    const pagina = attiva === "dashboard" ? await Dashboard() : await EntityPage(attiva);
    if (mio !== giro) return; // nel frattempo l'utente è passato a un'altra sezione
    view.replaceChildren(pagina);
    scrollTo({ top: 0 });
  } catch (e) {
    if (mio !== giro) return;
    view.replaceChildren(h("p", { class: "sub" }, "Non è stato possibile caricare questa sezione. Riprova tra poco."));
    toast(e.message, "err");
  }
}

addEventListener("hashchange", mostra);
addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
    e.preventDefault();
    apriRicerca();
  }
});
document.getElementById("scrim").addEventListener("click", () => document.body.classList.remove("menu-aperto"));
caricaSchema().then(mostra).catch((e) => toast(e.message, "err"));
