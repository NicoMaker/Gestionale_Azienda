// Carica lo schema dal server: gruppi (menu) e sezioni (ENTITIES) per le 100 tabelle
import { api } from "../core/api.js";
export let GRUPPI = [];
export const ENTITIES = {};
export async function caricaSchema() {
  GRUPPI = await api.get("schema");
  for (const g of GRUPPI) for (const t of g.tabelle) ENTITIES[t.nome] = { ...t, gruppo: g.id, icona: g.icona, singolare: t.titolo.toLowerCase() };
}
