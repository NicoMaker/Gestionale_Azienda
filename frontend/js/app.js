import { h } from "../core/dom.js";
import { Sidebar } from "../components/sidebar/sidebar.js";
import { Dashboard } from "../components/dashboard/dashboard.js";
import { EntityPage } from "../pages/entity-page.js";
import { ENTITIES, caricaSchema } from "../config/entities.js";
import { toast } from "../components/toast/toast.js";

// Router a hash: #dashboard, #clienti, #prodotti, #fatture
async function mostra() {
  const nome = location.hash.slice(1) || "dashboard";
  document.getElementById("sidebar").replaceChildren(Sidebar(nome));
  const view = document.getElementById("view");
  try {
    view.replaceChildren(nome in ENTITIES ? await EntityPage(nome, mostra) : await Dashboard());
  } catch (e) { view.replaceChildren(h("p", {}, "Errore di caricamento")); toast(e.message, "err"); }
}
addEventListener("hashchange", mostra);
caricaSchema().then(mostra).catch((e) => toast(e.message, "err"));
