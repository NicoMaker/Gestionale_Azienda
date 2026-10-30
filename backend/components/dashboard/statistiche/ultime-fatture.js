// Le sei fatture più recenti, con il nome del cliente
const db = require("../../../db/database");

module.exports = async () => ({
  ultime: await db.all(
    `SELECT f.id, f.data, f.importo, f.stato, c.nome cliente
     FROM fatture f LEFT JOIN clienti c ON c.id = f.cliente_id
     ORDER BY f.data DESC, f.id DESC LIMIT 6`,
  ),
});
