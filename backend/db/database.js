// Connessione SQLite + helper a promise + schema e dati di esempio
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

// Dati dimostrativi: compaiono solo al primo avvio, a database vuoto
async function datiDiEsempio() {
  const clienti = [
    ["Rossi Srl", "info@rossi.it", "02 1234567", "Milano"],
    ["Bianchi SpA", "amm@bianchi.it", "06 7654321", "Roma"],
    ["Verdi & Co", "ciao@verdi.it", "011 998877", "Torino"],
    ["Ferrari Impianti", "ordini@ferrariimpianti.it", "051 330022", "Bologna"],
    ["Conti Logistica", "info@contilogistica.it", "041 552211", "Venezia"],
    ["Marino Design", "studio@marinodesign.it", "081 227788", "Napoli"],
    ["Greco Alimentari", "greco@grecoalimentari.it", "091 445566", "Palermo"],
    ["Colombo Tessuti", "vendite@colombotessuti.it", "031 887766", "Como"],
  ];
  for (const c of clienti)
    await run(
      "INSERT INTO clienti(nome,email,telefono,citta) VALUES(?,?,?,?)",
      c,
    );
  for (const p of [
    ["Consulenza finanziaria", 150, 999],
    ["Analisi di portafoglio", 480, 999],
    ["Report mensile", 90, 999],
    ["Audit contabile", 1200, 999],
    ["Formazione aziendale", 650, 999],
  ])
    await run("INSERT INTO prodotti(nome,prezzo,giacenza) VALUES(?,?,?)", p);

  // 30 fatture distribuite sugli ultimi 12 mesi (generazione deterministica)
  const oggi = new Date();
  const importi = [1200, 3400.5, 560, 980, 2150, 780.9, 4100, 1890, 640, 2750];
  for (let i = 0; i < 30; i++) {
    const mesiFa = 11 - Math.floor(i / 2.6);
    const d = new Date(
      oggi.getFullYear(),
      oggi.getMonth() - mesiFa,
      3 + ((i * 7) % 24),
    );
    const stato =
      mesiFa > 1
        ? i % 9 === 0
          ? "emessa"
          : "pagata"
        : ["bozza", "emessa", "pagata"][i % 3];
    await run(
      "INSERT INTO fatture(cliente_id,data,importo,stato) VALUES(?,?,?,?)",
      [
        (i % clienti.length) + 1,
        d.toISOString().slice(0, 10),
        importi[(i * 3) % importi.length] + (i % 4) * 110,
        stato,
      ],
    );
  }
}
module.exports = { run, all, get, init };
