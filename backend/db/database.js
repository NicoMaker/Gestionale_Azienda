// Connessione SQLite + helper a promise + creazione schema e dati di esempio
const sqlite3 = require("sqlite3").verbose();
const path = require("node:path");
const { tabelle } = require("./schema-loader");
const db = new sqlite3.Database(path.join(__dirname, "gestionale.db"));

const run = (sql, p = []) =>
  new Promise((ok, ko) =>
    db.run(sql, p, function (e) {
      e ? ko(e) : ok({ id: this.lastID, changes: this.changes });
    }),
  );
const all = (sql, p = []) =>
  new Promise((ok, ko) => db.all(sql, p, (e, r) => (e ? ko(e) : ok(r))));
const get = (sql, p = []) =>
  new Promise((ok, ko) => db.get(sql, p, (e, r) => (e ? ko(e) : ok(r))));

async function init() {
  await run("PRAGMA foreign_keys = ON");
  for (const t of tabelle) await run(t.ddl); // le 100 tabelle dallo schema
  const { n } = await get("SELECT COUNT(*) n FROM clienti");
  if (n === 0) await datiDiEsempio();
}

// Dati dimostrativi: compaiono solo al primo avvio, a database vuoto (vedi ./seed)
const datiDiEsempio = async () => {
  const righe = await require("./seed").popola({ run });
  console.log(`Dati di esempio caricati: ${righe} righe in ${tabelle.length} tabelle`);
};
module.exports = { run, all, get, init };
