// Backup: copia coerente del database scaricabile dal browser
const r = require("express").Router();
const os = require("node:os");
const path = require("node:path");
const fs = require("node:fs");
const db = require("../../../db/database");

r.get("/", async (req, res, next) => {
  try {
    const d = new Date().toISOString().slice(0, 10);
    const tmp = path.join(os.tmpdir(), `gestionale-${Date.now()}.db`);
    await db.run("VACUUM INTO ?", [tmp]);
    res.download(tmp, `gestionale-backup-${d}.db`, () =>
      fs.unlink(tmp, () => {}),
    );
  } catch (e) {
    next(e);
  }
});
module.exports = r;
