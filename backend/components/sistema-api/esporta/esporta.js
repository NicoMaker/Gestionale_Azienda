// Esportazione dati: /api/esporta/tabella/:nome/:formato · /gruppo/:id/:formato · /tutto/:formato
//   tabella: csv | xlsx | pdf (opzionale ?q=testo per esportare solo le righe filtrate)
//   gruppo e tutto: xlsx | pdf
const { Router } = require("express");
const dati = require("./dati");
const FORMATI = {
  csv: require("./formati/csv"),
  xlsx: require("./formati/xlsx"),
  pdf: require("./formati/pdf"),
};
const r = Router();

const errore = (status, msg) => Object.assign(new Error(msg), { status });
const oggi = () => new Date().toISOString().slice(0, 10);

// Crea il file nel formato richiesto e lo invia come download
async function invia(res, pacchetto, formato, base, soloMulti) {
  const f = FORMATI[formato];
  if (!f || (soloMulti && formato === "csv"))
    throw errore(400, "Formato non supportato");
  if (!pacchetto) throw errore(404, "Elemento non trovato");
  const buffer = await f.crea(pacchetto);
  res.type(f.mime);
  res.attachment(`${base}-${oggi()}.${f.estensione}`);
  res.send(buffer);
}
const wrap = (fn) => (req, res, next) => fn(req, res).catch(next);

r.get(
  "/tabella/:nome/:formato",
  wrap(async (req, res) =>
    invia(
      res,
      await dati.perTabella(req.params.nome, req.query.q),
      req.params.formato,
      req.params.nome,
    ),
  ),
);
r.get(
  "/gruppo/:id/:formato",
  wrap(async (req, res) =>
    invia(
      res,
      await dati.perGruppo(req.params.id),
      req.params.formato,
      req.params.id,
      true,
    ),
  ),
);
r.get(
  "/tutto/:formato",
  wrap(async (req, res) =>
    invia(
      res,
      await dati.tutto(),
      req.params.formato,
      "gestionale-completo",
      true,
    ),
  ),
);

module.exports = r;
