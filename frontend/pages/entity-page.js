import { h } from "../core/dom.js";
import { api } from "../core/api.js";
import { ENTITIES } from "../config/entities.js";
import { Button } from "../components/button/button.js";
import { PageHeader } from "../components/page-header/page-header.js";
import { DataTable } from "../components/data-table/data-table.js";
import { apriForm } from "../components/modal-form/modal-form.js";
import { conferma } from "../components/confirm-dialog/confirm-dialog.js";
import { toast } from "../components/toast/toast.js";
import { mostraEsito } from "../components/delete-report/delete-report.js";

// Pagina generica: elenco + crea / modifica / elimina per una sezione di ENTITIES
export async function EntityPage(nome) {
  const E = ENTITIES[nome];
  const fk = E.campi.filter((c) => c.da);
  // righe e opzioni dei menu a tendina (es. il cliente di una fattura) si caricano insieme
  const [righe, ...liste] = await Promise.all([
    api.get(nome),
    ...fk.map((c) => api.get(c.da)),
  ]);
  const opzioni = Object.fromEntries(
    fk.map((c, i) => [
      c.k,
      liste[i].map((x) => [x.id, x[ENTITIES[c.da].label]]),
    ]),
  );

  const conta = (n) => (n === 1 ? "1 elemento" : `${n} elementi`);

  const ricarica = async () => {
    const nuove = await api.get(nome);
    tabella.aggiorna(nuove);
    testa.sottotitolo.textContent = conta(nuove.length);
  };
  const salva = async (r) => {
    const v = await apriForm({
      titolo: r ? "Modifica elemento" : "Nuovo elemento",
      sottotitolo: E.titolo,
      azione: r ? "Salva modifiche" : "Aggiungi",
      campi: E.campi,
      valori: r || {},
      opzioni,
    });
    if (!v) return;
    try {
      r ? await api.put(`${nome}/${r.id}`, v) : await api.post(nome, v);
      toast(r ? "Modifiche salvate" : "Elemento aggiunto");
      await ricarica();
    } catch (e) {
      toast(e.message, "err");
    }
  };
  const elimina = async (r) => {
    const etichetta = r[E.label] ?? "questo elemento";
    if (
      !(await conferma({
        titolo: "Eliminare l'elemento?",
        testo: `«${etichetta}» verrà rimosso da ${E.titolo}. L'operazione non si può annullare.`,
      }))
    )
      return;
    try {
      await api.del(`${nome}/${r.id}`);
      toast("Elemento eliminato");
      await ricarica();
    } catch (e) {
      toast(e.message, "err");
    }
  };

  // Eliminazione multipla: i dati collegati ad altre tabelle vengono saltati dal server
  const eliminaMolti = async (ids, tutti) => {
    if (!ids.length) return;
    const n = ids.length;
    if (
      !(await conferma({
        titolo: tutti ? "Eliminare tutti gli elementi?" : "Eliminare gli elementi?",
        testo: `${n === 1 ? "1 elemento verrà rimosso" : `${n} elementi verranno rimossi`} da ${E.titolo}. Quelli collegati ad altre tabelle non vengono eliminati. L'operazione non si può annullare.`,
        azione: n === 1 ? "Elimina" : `Elimina ${n}`,
      }))
    )
      return;
    try {
      const { eliminati, bloccati } = await api.post(
        `${nome}/elimina`,
        tutti ? { tutti: true } : { ids },
      );
      await ricarica();
      if (bloccati.length) mostraEsito({ eliminati, bloccati, tabella: E.titolo });
      else if (eliminati)
        toast(eliminati === 1 ? "1 elemento eliminato" : `${eliminati} elementi eliminati`);
      else toast("Nessun elemento da eliminare", "err");
    } catch (e) {
      toast(e.message, "err");
    }
  };

  const tabella = DataTable({
    colonne: E.colonne,
    righe,
    nome,
    onEdit: salva,
    onDelete: elimina,
    onDeleteMany: eliminaMolti,
    onNew: () => salva(null),
  });
  const testa = PageHeader({
    titolo: E.titolo,
    sottotitolo: conta(righe.length),
    azioni: Button({
      testo: "Aggiungi",
      icon: "plus",
      variante: "primary",
      onclick: () => salva(null),
    }),
  });
  return h("section", {}, testa, tabella);
}
