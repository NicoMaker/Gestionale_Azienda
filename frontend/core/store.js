// Preferenze salvate nel browser (tema)
const KEY = "gestionale:tema";
const leggi = () => {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
};
export const temaCorrente = () =>
  document.documentElement.dataset.tema ||
  (matchMedia("(prefers-color-scheme: dark)").matches ? "scuro" : "chiaro");
export function applicaTema(t = leggi()) {
  if (t) document.documentElement.dataset.tema = t;
}
export function scambiaTema() {
  const t = temaCorrente() === "scuro" ? "chiaro" : "scuro";
  document.documentElement.dataset.tema = t;
  try {
    localStorage.setItem(KEY, t);
  } catch {}
  return t;
}
