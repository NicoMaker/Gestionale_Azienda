import { h } from "../core/dom.js";
import { applicaTema } from "../core/store.js";
import { Sidebar } from "../components/sidebar/sidebar.js";
import { Topbar } from "../components/topbar/topbar.js";
import { Dashboard } from "../components/dashboard/dashboard.js";
import { HomePage } from "../pages/home-page.js";
import { CategoryPage } from "../pages/category-page.js";
import { EntityPage } from "../pages/entity-page.js";
import { ENTITIES, GRUPPI, caricaSchema } from "../config/entities.js";
import { Skeleton } from "../components/skeleton/skeleton.js";
import { toast } from "../components/toast/toast.js";
import { apriRicerca } from "../components/command-palette/command-palette.js";

applicaTema();

// Router a hash: #home (pagina generale), #cat/vendite (categoria), #dashboard, #clienti, #fatture, …
let giro = 0;
async function mostra() {
  const mio = ++giro;
  document.body.classList.remove("menu-aperto");
  const nome = location.hash.slice(1);
  const catId = nome.startsWith("cat/") ? nome.slice(4) : null;
  const attiva =
    nome in ENTITIES || nome === "dashboard"
      ? nome
      : GRUPPI.some((g) => g.id === catId)
        ? nome
        : "home";
  document.getElementById("sidebar").replaceChildren(Sidebar(attiva));
  document
    .getElementById("topbar")
    .replaceChildren(Topbar(attiva, apriRicerca));
  const titolo =
    ENTITIES[attiva]?.titolo ||
    (catId && GRUPPI.find((g) => g.id === catId)?.titolo) ||
    (attiva === "dashboard" ? "Dashboard" : "Panoramica");
  document.title = titolo + " · Gestionale";
  const view = document.getElementById("view");
  view.replaceChildren(Skeleton());
  try {
    const pagina =
      attiva === "home"
        ? await HomePage()
        : attiva === "dashboard"
          ? await Dashboard()
          : attiva.startsWith("cat/")
            ? await CategoryPage(catId)
            : await EntityPage(attiva);
    if (mio !== giro) return; // nel frattempo l'utente è passato a un'altra sezione
    view.replaceChildren(pagina);
    scrollTo({ top: 0 });
  } catch (e) {
    if (mio !== giro) return;
    view.replaceChildren(
      h(
        "p",
        { class: "sub" },
        "Non è stato possibile caricare questa sezione. Riprova tra poco.",
      ),
    );
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
document
  .getElementById("scrim")
  .addEventListener("click", () =>
    document.body.classList.remove("menu-aperto"),
  );
caricaSchema()
  .then(mostra)
  .catch((e) => toast(e.message, "err"));
