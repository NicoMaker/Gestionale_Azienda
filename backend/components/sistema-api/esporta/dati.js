// Prepara i dati da esportare: colonne leggibili e righe con le chiavi esterne già risolte
const db = require("../../../db/database");
const { tabelle, tabella } = require("../../../db/schema-loader");
const GRUPPI = require("../../../../schema/tabelle");


const tipoColonna = (c) =>
  c.step ? "euro" : c.type === "date" ? "data" : c.type === "number" ? "numero" : "testo";

// Colonne: ID + tutti i campi (le chiavi esterne mostrano il nome del record collegato)
const colonne = (t) => [
  { k: "id", l: "ID", tipo: "id" },
  ...t.campi.map((c) => ({
    k: c.da ? c.k.replace(/_id$/, "") : c.k,
    l: c.l,
    tipo: tipoColonna(c),
  })),
];

// Ricerca testuale identica a quella della tabella a schermo
const filtra = (righe, q) => {
  const t = String(q || "").trim().toLowerCase();
  return t
    ? righe.filter((r) => JSON.stringify(Object.values(r)).toLowerCase().includes(t))
    : righe;
};

// Nome foglio valido per Excel: massimo 31 caratteri e nessun carattere speciale
const nomeFoglio = (s, usati) => {
  let n = s.replace(/[\\/?*[\]:]/g, " ").slice(0, 31);
  for (let i = 2; usati.has(n.toLowerCase()); i++) n = n.slice(0, 28) + " " + i;
  usati.add(n.toLowerCase());
  return n;
};

async function foglio(t, q, usati = new Set()) {
  const righe = filtra(await db.all(`${t.select} ORDER BY t.id`), q);
  return {
    nome: nomeFoglio(t.titolo, usati),
    titolo: t.titolo,
    colonne: colonne(t),
    righe,
  };
}

const perTabella = async (nome, q) => {
  const t = tabella(nome);
  return t ? { nome: t.titolo, fogli: [await foglio(t, q)] } : null;
};

const perGruppo = async (id) => {
  const g = GRUPPI[id];
  if (!g) return null;
  const usati = new Set(["indice"]);
  const fogli = [];
  for (const t of tabelle.filter((x) => x.gruppo === id)) fogli.push(await foglio(t, "", usati));
  return { nome: g.titolo, fogli };
};

const tutto = async () => {
  const usati = new Set(["indice"]);
  const fogli = [];
  for (const t of tabelle) fogli.push(await foglio(t, "", usati));
  return { nome: "Tutti i dati", fogli };
};

module.exports = { perTabella, perGruppo, tutto };
