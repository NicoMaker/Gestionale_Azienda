// Riepilogo per la pagina generale: categorie, sezioni e numero di record di ciascuna
const { Router } = require("express");
const db = require("../../../db/database");
const { tabelle } = require("../../../db/schema-loader");
const GRUPPI = require("../../../../schema/tabelle");
const r = Router();

r.get("/", async (req, res, next) => {
  try {
    const conta = Object.fromEntries(
      await Promise.all(
        tabelle.map(async (t) => [
          t.nome,
          (await db.get(`SELECT COUNT(*) n FROM "${t.nome}"`)).n,
        ]),
      ),
    );
    res.json(
      Object.entries(GRUPPI).map(([id, g]) => {
        const sezioni = tabelle
          .filter((t) => t.gruppo === id)
          .map((t) => ({
            nome: t.nome,
            titolo: t.titolo,
            record: conta[t.nome],
            campi: t.campi.length,
            collegamenti: t.campi.filter((c) => c.da).length,
          }));
        return {
          id,
          titolo: g.titolo,
          icona: g.icona,
          sezioni,
          record: sezioni.reduce((a, s) => a + s.record, 0),
        };
      }),
    );
  } catch (e) {
    next(e);
  }
});
module.exports = r;
