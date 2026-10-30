// Genera il valore di un campo in base al nome, al tipo e alle regole della tabella
const P = require("./pool");

const pad = (n, w) => String(n).padStart(w, "0");
const slug = (s) => String(s).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "").slice(0, 16);
const sigla = (nome) => nome.replace(/_/g, "").slice(0, 3).toUpperCase();

// Partita IVA italiana con cifra di controllo corretta
function piva(R) {
  const d = Array.from({ length: 10 }, (_, i) => (i === 0 ? R.int(1, 9) : R.int(0, 9)));
  let s = 0;
  d.forEach((x, i) => {
    if (i % 2) { x *= 2; if (x > 9) x -= 9; }
    s += x;
  });
  return d.join("") + ((10 - (s % 10)) % 10);
}
// IBAN italiano con cifre di controllo corrette (mod 97)
function iban(R, abi = "03069") {
  const bban = "X" + abi + pad(R.int(1000, 9999), 5) + pad(R.int(0, 999999999999), 12);
  const num = (bban + "IT00").replace(/[A-Z]/g, (c) => c.charCodeAt(0) - 55);
  let resto = 0;
  for (const ch of num) resto = (resto * 10 + Number(ch)) % 97;
  return `IT${pad(98 - resto, 2)}${bban}`;
}
const telefono = (R) => R.chance(0.45) ? `3${R.int(20, 99)} ${R.int(1000000, 9999999)}` : `0${R.pick([2, 6, 11, 41, 51, 55, 81, 45, 35, 49])} ${R.int(100000, 999999)}`;

// Intervalli di importi in base al nome del campo
const EURO = { importo: [60, 15000], valore: [2000, 90000], ral: [24000, 68000], lordo: [1900, 4300], netto: [1400, 3000], prezzo: [5, 2400], saldo: [1500, 260000], capitale: [10000, 500000], costo_orario: [28, 140], budget: [8000, 260000], utile: [-20000, 180000], entrate: [25000, 190000], uscite: [20000, 170000], tasso: [0.5, 1.6] };
const NUM = { provvigione: [3, 12], sconto: [0, 20], percentuale: [5, 30], giacenza: [0, 480], quantita: [1, 200], ore: [1, 8], anno: [2022, 2026], punteggio: [4, 10], voto: [1, 5], livello: [1, 6], capienza: [800, 20000], durata_mesi: [12, 120], tasso: [1, 7], rendimento: [1, 9], ore_risposta: [1, 24], ore_risoluzione: [4, 96], dimensione: [12, 9000] };

// Quanti giorni (indietro/avanti) coprire per i campi data
const FUTURI = new Set(["scadenza", "fine", "al", "valido_al"]);

function valore(c, X) {
  const { R, t, row, i } = X;
  const k = c.k;
  const regola = X.cfg.campi?.[k];
  if (typeof regola === "function") return regola(X);
  if (Array.isArray(regola)) return regola[i % regola.length];

  if (c.da) return X.fk(c.da);
  if (c.opzioni) {
    const o = c.opzioni, p = o.length === 2 ? [0.7] : o.length === 3 ? [0.5, 0.82] : [0.4, 0.7, 0.9];
    const x = R.r();
    return o[Math.max(0, p.findIndex((q) => x < q) === -1 ? o.length - 1 : p.findIndex((q) => x < q))];
  }
  if (c.type === "email") {
    const nome = row.nome || row.candidato || "";
    return X.persone.has(t.nome) || t.nome === "selezioni"
      ? `${slug(nome.split(" ")[0])}.${slug(nome.split(" ").slice(1).join(""))}@azienda-demo.it`
      : `info@${slug(nome.split(" ").slice(0, 2).join("") || t.nome)}.it`;
  }
  if (c.type === "date") {
    if (k === "acquisto") return X.giorni(-R.int(120, 1800));
    if (FUTURI.has(k)) return X.giorni(R.int(-40, 420));
    if (["inizio", "dal", "valido_dal"].includes(k)) return X.giorni(-R.int(40, 520));
    return X.giorni(-Math.floor(Math.pow(R.r(), 0.8) * 360));
  }
  if (c.step) {
    if (k === "tasso") return Math.round((0.5 + R.r() * 1.1) * 10000) / 10000;
    const [a, b] = EURO[k] || [20, 6000];
    return R.money(a, b);
  }
  if (c.type === "number") { const [a, b] = NUM[k] || [1, 100]; return R.int(a, b); }

  switch (k) {
    case "nome": return X.persone.has(t.nome) ? X.persona() : `${t.titolo} ${i + 1}`;
    case "codice": return `${sigla(t.nome)}-${pad(i + 1, 3)}`;
    case "numero": return `${sigla(t.nome)}/${new Date().getFullYear()}/${pad(i + 1, 4)}`;
    case "telefono": return telefono(R);
    case "citta": return R.pick(P.CITTA)[0];
    case "regione": return R.pick(P.CITTA)[2];
    case "piva": return piva(R);
    case "iban": return iban(R);
    case "abi": return pad(R.int(1000, 9999), 5);
    case "descrizione": return R.pick(P.DESCRIZIONI);
    case "oggetto": return R.pick(P.OGGETTI);
    case "motivo": return R.pick(P.OGGETTI);
    case "note": case "commento": case "testo": return R.pick(P.NOTE);
    case "titolo": return R.pick(P.OGGETTI);
    case "mese": return `${P.MESI[(X.i + 0) % 12]} ${new Date().getFullYear() - (X.i >= 12 ? 1 : 0)}`;
    case "valuta": return R.pick(["EUR", "EUR", "EUR", "USD", "GBP", "CHF"]);
    case "ip": return `192.168.${R.int(0, 20)}.${R.int(2, 250)}`;
    case "responsabile": case "richiedente": return X.persona();
    case "specialita": return R.pick(["Reti", "Hardware", "Software"]);
    case "tipo": return R.pick(["PDF", "XLSX", "DOCX"]);
    case "colore": return R.pick(["#3447e0", "#12a05c", "#d8384a", "#e08a1e"]);
    case "simbolo": return "€";
    case "corso": return "Corso " + (i + 1);
    case "domanda": return "Domanda " + (i + 1) + "?";
    case "risposta": return R.pick(P.NOTE);
    case "ruolo": return R.pick(["Responsabile", "Operatore", "Consulente"]);
    case "tracking": return `IT${R.int(10000000, 99999999)}`;
    case "corriere": return R.pick(["BRT", "GLS", "SDA"]);
    case "file": return `file-${i + 1}.pdf`;
    case "chiave": return `chiave_${i + 1}`;
    case "valore": return String(R.int(1, 100));
    case "cron": return "0 6 * * *";
    case "isin": return `IT${R.int(1000000000, 9999999999)}`;
    case "posizione": return R.pick(["Impiegato", "Commerciale", "Tecnico"]);
    case "candidato": return X.persona();
    default: return `${c.l} ${i + 1}`;
  }
}

// Ritocchi comuni: coppie di date coerenti, ferie brevi, contratti a tempo indeterminato, netto ≤ lordo
function ritocca(t, row, X) {
  const R = X.R;
  for (const [a, b, min, max] of [["inizio", "fine", 30, 540], ["dal", "al", 3, 15], ["valido_dal", "valido_al", 90, 540]])
    if (row[a] && b in row) row[b] = X.somma(row[a], R.int(min, max));
  if (t.nome === "contratti_lavoro" && R.chance(0.6)) row.fine = null;
  if ("lordo" in row && "netto" in row) row.netto = Math.round(row.lordo * R.money(0.68, 0.76) * 100) / 100;
  if ("tasso" in row && t.nome === "tassi_cambio") {
    const mappa = { EUR: [1, 1], USD: [1.05, 1.12], GBP: [0.83, 0.88], CHF: [0.93, 0.98], JPY: [155, 168], CAD: [1.45, 1.52], AUD: [1.62, 1.72], SEK: [11.2, 11.8], PLN: [4.2, 4.4], CNY: [7.6, 8.0] };
    const v = Object.keys(mappa)[X.i % 10];
    row.valuta = v;
    row.tasso = Math.round(R.money(...mappa[v]) * 10000) / 10000;
  }
  if (t.nome === "ammortamenti") row.importo = Math.round(row.importo * 0.2 * 100) / 100;
}

module.exports = { valore, ritocca, slug };
