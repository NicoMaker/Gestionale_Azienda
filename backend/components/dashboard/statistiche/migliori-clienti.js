// I cinque clienti con il fatturato più alto
const db = require("../../../db/database");

module.exports = async () => ({
  topClienti: await db.all(
    `SELECT c.nome, COUNT(*) n, COALESCE(SUM(f.importo),0) tot
     FROM fatture f JOIN clienti c ON c.id = f.cliente_id
     GROUP BY c.id ORDER BY tot DESC LIMIT 5`,
  ),
});
