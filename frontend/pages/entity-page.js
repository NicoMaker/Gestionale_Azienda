import { h } from "../core/dom.js";
import { api } from "../core/api.js";
import { ENTITIES } from "../config/entities.js";
import { DataTable } from "../components/data-table/data-table.js";
import { apriForm } from "../components/modal-form/modal-form.js";
import { toast } from "../components/toast/toast.js";

// Pagina generica: elenco + crea / modifica / elimina per una sezione di ENTITIES
export async function EntityPage(nome, ridisegna) {
  const E = ENTITIES[nome];
  const righe = await api.get(nome);
  // opzioni dei menu a tendina che dipendono da altre sezioni (es. cliente della fattura)
  const opzioni = {};
  for (const c of E.campi.filter((c) => c.da)) opzioni[c.k] = (await api.get(c.da)).map((x) => [x.id, x[ENTITIES[c.da].label]]);

  const salva = async (r) => {
    const v = await apriForm({ titolo: (r ? "Modifica " : "Nuovo ") + E.singolare, campi: E.campi, valori: r || {}, opzioni });
    if (!v) return;
    try { r ? await api.put(`${nome}/${r.id}`, v) : await api.post(nome, v); toast("Salvato"); ridisegna(); }
    catch (e) { toast(e.message, "err"); }
  };
  const elimina = async (r) => {
    if (!confirm("Eliminare questo elemento?")) return;
    try { await api.del(`${nome}/${r.id}`); toast("Eliminato"); ridisegna(); } catch (e) { toast(e.message, "err"); }
  };
  return h("section", {},
    h("div", { class: "testa" }, h("div", {}, h("h1", {}, E.titolo), h("p", { class: "sub" }, righe.length + " elementi")),
      h("button", { class: "btn primary", onclick: () => salva(null) }, "+ Nuovo")),
    DataTable({ colonne: E.colonne, righe, onEdit: salva, onDelete: elimina }));
}
