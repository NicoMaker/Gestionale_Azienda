// Fatturato e incassato degli ultimi 12 mesi, dal più vecchio al più recente
const db = require("../../../db/database");

module.exports = async () => ({
  perMese: (
    await db.all(
      `SELECT substr(data,1,7) mese, COALESCE(SUM(importo),0) tot,
              COALESCE(SUM(CASE WHEN stato='pagata' THEN importo END),0) inc
       FROM fatture WHERE data IS NOT NULL GROUP BY 1 ORDER BY 1 DESC LIMIT 12`,
    )
  ).reverse(),
});
