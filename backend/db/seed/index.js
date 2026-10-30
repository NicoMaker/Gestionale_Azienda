// Popola tutte le 100 tabelle con dati di esempio coerenti (chiavi esterne rispettate).
// Si avvia da solo al primo avvio, a database vuoto. Regole per tabella: ./tabelle.js
const { tabelle } = require("../schema-loader");
const { crea } = require("./random");
const { valore, ritocca } = require("./generatore");
const P = require("./pool");
const REGOLE = require("./tabelle");

// Le tabelle con un numero di righe indicato (n) vengono moltiplicate per avere dati abbondanti
const FATTORE = 2;
const PERSONE = new Set(["contatti", "agenti", "dipendenti", "tecnici", "utenti", "risorse"]);
const iso = (d) => d.toISOString().slice(0, 10);

// Ordine di inserimento: ogni tabella dopo quelle a cui fa riferimento
function ordina() {
  const per = Object.fromEntries(tabelle.map((t) => [t.nome, t]));
  const fatto = new Set(), out = [];
  const visita = (t) => {
    if (fatto.has(t.nome)) return;
    fatto.add(t.nome);
    for (const c of t.campi) if (c.da && c.da !== t.nome) visita(per[c.da]);
    out.push(t);
  };
  tabelle.forEach(visita);
  return out;
}

async function popola({ run }) {
  const R = crea(20260101);
  const oggi = new Date();
  const giorni = (n) => iso(new Date(oggi.getFullYear(), oggi.getMonth(), oggi.getDate() + n));
  const somma = (d, n) => iso(new Date(new Date(d + "T00:00:00Z").getTime() + n * 864e5));
  const eta = (d) => Math.round((oggi - new Date(d)) / 864e5);
  const ids = {}, usati = new Set(), q = (s) => `"${s}"`;
  const persona = () => `${R.pick(P.NOMI)} ${R.pick(P.COGNOMI)}`;
  const fk = (tab) => { const l = ids[tab]; return l[R.skew(l.length)]; };

  await run("BEGIN");
  try {
    for (const t of ordina()) {
      const cfg = REGOLE[t.nome] || {};
      const X = { R, t, cfg, giorni, somma, eta, usati, persona, fk, persone: PERSONE, ids };
      const righe = cfg.righe ? cfg.righe(X) : cfg.fisse;
      const n = righe ? righe.length : (cfg.n ? (Array.isArray(cfg.campi?.nome) && cfg.n <= cfg.campi.nome.length ? cfg.n : cfg.n * FATTORE) : Array.isArray(cfg.campi?.nome) ? cfg.campi.nome.length : 40 * FATTORE);
      ids[t.nome] = [];
      const sql = `INSERT INTO ${q(t.nome)}(${t.campi.map((c) => q(c.k))}) VALUES(${t.campi.map(() => "?")})`;
      const combinazioni = new Set();
      for (let i = 0; i < n; i++) {
        const row = {};
        X.i = i; X.row = row;
        t.campi.forEach((c, j) => {
          const dato = righe?.[i]?.[j];
          row[c.k] = dato !== undefined && dato !== null ? dato : valore(c, X);
        });
        ritocca(t, row, X);
        cfg.dopo?.(row, X);
        // le giacenze sono una per coppia prodotto/magazzino
        if (t.nome === "giacenze") {
          const key = row.prodotto_id + "-" + row.magazzino_id;
          if (combinazioni.has(key)) continue;
          combinazioni.add(key);
        }
        const x = await run(sql, t.campi.map((c) => row[c.k] ?? null));
        ids[t.nome].push(x.id);
      }
    }
    await run("COMMIT");
  } catch (e) {
    await run("ROLLBACK");
    throw e;
  }
  return Object.values(ids).reduce((a, l) => a + l.length, 0);
}
module.exports = { popola };
