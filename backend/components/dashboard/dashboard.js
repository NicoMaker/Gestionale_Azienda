// Statistiche per la dashboard: ogni indicatore è un componente in ./statistiche
const { Router } = require("express");
const r = Router();
const statistiche = [
  require("./statistiche/totali"),
  require("./statistiche/per-stato"),
  require("./statistiche/per-mese"),
  require("./statistiche/ultime-fatture"),
  require("./statistiche/migliori-clienti"),
];

r.get("/", async (req, res, next) => {
  try {
    const parti = await Promise.all(statistiche.map((s) => s()));
    res.json(Object.assign({}, ...parti));
  } catch (e) {
    next(e);
  }
});
module.exports = r;
