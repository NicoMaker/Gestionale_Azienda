// Fabbrica di router CRUD: riceve la definizione di una tabella (da schema-loader)
const { Router } = require("express");
const db = require("../db/database");
const { usataDa } = require("../db/schema-loader");

const wrap = (fn) => (req, res, next) => fn(req, res).catch(next);
const nonTrovato = () =>
  Object.assign(new Error("Elemento non trovato"), { status: 404 });

const bloccato = (m) => Object.assign(new Error(m), { status: 409 });
const CHUNK = 500;

module.exports = (t) => {
  const r = Router();
  const nomi = t.campi.map((c) => c.k);
  const q = (s) => `"${s}"`;
  const vals = (b = {}) =>
    nomi.map((f) => (b[f] === "" ? null : (b[f] ?? null)));

  r.get(
    "/",
    wrap(async (req, res) =>
      res.json(await db.all(`${t.select} ORDER BY 1 DESC`)),
    ),
  );

  r.post(
    "/",
    wrap(async (req, res) => {
      const x = await db.run(
        `INSERT INTO ${q(t.nome)}(${nomi.map(q)}) VALUES(${nomi.map(() => "?")})`,
        vals(req.body),
      );
      res.status(201).json({ id: x.id });
    }),
  );

  r.put(
    "/:id",
    wrap(async (req, res) => {
      const x = await db.run(
        `UPDATE ${q(t.nome)} SET ${nomi.map((f) => q(f) + "=?")} WHERE id=?`,
        [...vals(req.body), req.params.id],
      );
      if (!x.changes) throw nonTrovato();
      res.json({ ok: true });
    }),
  );

  // Per ogni id indica dove è usato (tabelle collegate): gli id non presenti sono liberi
  const collegamenti = async () => {
    const m = new Map();
    for (const u of usataDa[t.nome]) {
      const righe = await db.all(
        `SELECT ${q(u.campo)} AS id, COUNT(*) AS n FROM ${q(u.tabella)} WHERE ${q(u.campo)} IS NOT NULL GROUP BY ${q(u.campo)}`,
      );
      for (const x of righe) {
        const l = m.get(x.id) || [];
        l.push({ tabella: u.titolo, n: x.n });
        m.set(x.id, l);
      }
    }
    return m;
  };
  const descrivi = (l) =>
    l
      .slice(0, 4)
      .map((x) => `${x.tabella} (${x.n})`)
      .join(", ") + (l.length > 4 ? ` e altre ${l.length - 4} tabelle` : "");

  r.delete(
    "/:id",
    wrap(async (req, res) => {
      const l = (await collegamenti()).get(Number(req.params.id));
      if (l) throw bloccato(`Non eliminabile: collegato a ${descrivi(l)}`);
      const x = await db.run(`DELETE FROM ${q(t.nome)} WHERE id=?`, [
        req.params.id,
      ]);
      if (!x.changes) throw nonTrovato();
      res.json({ ok: true });
    }),
  );

  // Eliminazione multipla: { ids: [1,2,3] } oppure { tutti: true }.
  // Gli elementi collegati ad altre tabelle vengono saltati e restituiti in `bloccati`.
  r.post(
    "/elimina",
    wrap(async (req, res) => {
      const { ids, tutti } = req.body || {};
      let lista;
      if (tutti) lista = (await db.all(`SELECT id FROM ${q(t.nome)}`)).map((x) => x.id);
      else if (Array.isArray(ids)) lista = [...new Set(ids.map(Number))].filter(Number.isInteger);
      else throw Object.assign(new Error("Nessun elemento indicato"), { status: 400 });

      const usati = await collegamenti();
      const liberi = lista.filter((id) => !usati.has(id));
      const idBloccati = lista.filter((id) => usati.has(id));
      // il nome leggibile dei primi record bloccati, per il riepilogo a video
      const nomi = new Map();
      const primi = idBloccati.slice(0, 100);
      if (primi.length)
        for (const x of await db.all(
          `SELECT id, ${q(t.label)} AS e FROM ${q(t.nome)} WHERE id IN (${primi.map(() => "?")})`,
          primi,
        ))
          nomi.set(x.id, x.e);
      const bloccati = idBloccati.map((id) => ({
        id,
        etichetta: nomi.get(id) ?? null,
        usato_in: descrivi(usati.get(id)),
      }));

      let eliminati = 0;
      for (let i = 0; i < liberi.length; i += CHUNK) {
        const parte = liberi.slice(i, i + CHUNK);
        const x = await db.run(
          `DELETE FROM ${q(t.nome)} WHERE id IN (${parte.map(() => "?")})`,
          parte,
        );
        eliminati += x.changes;
      }
      res.json({ eliminati, bloccati });
    }),
  );
  return r;
};
