// Totali: numero di clienti, prodotti e fatture con fatturato e incassato
const db = require("../../../db/database");

module.exports = async () => {
  const [c, p, f] = await Promise.all([
    db.get("SELECT COUNT(*) n FROM clienti"),
    db.get("SELECT COUNT(*) n FROM prodotti"),
    db.get(
      "SELECT COUNT(*) n, COALESCE(SUM(importo),0) tot, COALESCE(SUM(CASE WHEN stato='pagata' THEN importo END),0) inc FROM fatture",
    ),
  ]);
  return { clienti: c.n, prodotti: p.n, fatture: f.n, fatturato: f.tot, incassato: f.inc };
};
