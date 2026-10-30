// Generatore pseudo-casuale deterministico: stessi dati a ogni installazione
function crea(seme = 20260101) {
  let a = seme >>> 0;
  const r = () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const int = (x, y) => x + Math.floor(r() * (y - x + 1));
  return {
    r,
    int,
    pick: (arr) => arr[Math.floor(r() * arr.length)],
    money: (x, y) => Math.round((x + r() * (y - x)) * 100) / 100,
    chance: (p) => r() < p,
    // indice con preferenza per i primi elementi: pochi record «grandi», molti piccoli
    skew: (n) => Math.min(n - 1, Math.floor(Math.pow(r(), 1.6) * n)),
    shuffle: (arr) => {
      const c = [...arr];
      for (let i = c.length - 1; i > 0; i--) {
        const j = Math.floor(r() * (i + 1));
        [c[i], c[j]] = [c[j], c[i]];
      }
      return c;
    },
  };
}
module.exports = { crea };
