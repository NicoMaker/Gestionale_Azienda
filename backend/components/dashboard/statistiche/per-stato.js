// Fatture e importi raggruppati per stato
const db = require("../../../db/database");

module.exports = async () => ({
  perStato: await db.all(
    "SELECT stato, COUNT(*) n, COALESCE(SUM(importo),0) tot FROM fatture GROUP BY stato",
  ),
});
