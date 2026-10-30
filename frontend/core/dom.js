// Helper per creare elementi e formattare valori
const PROP = new Set(["value", "checked", "selected", "hidden", "disabled", "open", "required"]);

export const h = (tag, props = {}, ...kids) => {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(props || {})) {
    if (k.startsWith("on")) e.addEventListener(k.slice(2), v);
    else if (k === "class") e.className = v;
    else if (k === "html") e.innerHTML = v;
    else if (PROP.has(k)) e[k] = v;
    else if (v != null && v !== false) e.setAttribute(k, v === true ? "" : v);
  }
  e.append(...kids.flat(Infinity).filter((x) => x != null && x !== false));
  return e;
};

const nfEuro = new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" });
const nfEuroInt = new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
const nfCompatto = new Intl.NumberFormat("it-IT", { notation: "compact", maximumFractionDigits: 1 });

export const euro = (n) => nfEuro.format(n || 0);
export const euroInt = (n) => nfEuroInt.format(n || 0);
export const compatto = (n) => nfCompatto.format(n || 0);
export const data = (s) =>
  s && !isNaN(new Date(s))
    ? new Date(s).toLocaleDateString("it-IT", { day: "2-digit", month: "short", year: "numeric" })
    : "";
export const meseBreve = (ym) =>
  new Date(ym + "-01").toLocaleDateString("it-IT", { month: "short" }).replace(".", "");
export const meseLungo = (ym) =>
  new Date(ym + "-01").toLocaleDateString("it-IT", { month: "long", year: "numeric" });
export const etichetta = (s) => String(s ?? "").replace(/_/g, " ");

// Tono semantico di uno stato (colore del badge)
const TONI = {
  ok: "pagata saldata ricevuto consegnata accettato evaso approvata approvate assunto attivo fatta si chiuso",
  warn: "emessa in_viaggio da_pagare in_attesa in_corso aperta aperto colloquio richieste sospeso media",
  dn: "annullato rifiutato respinta respinte scartato no alta",
};
export const tonoStato = (v) =>
  Object.keys(TONI).find((t) => TONI[t].split(" ").includes(String(v))) || "mu";
