// Server Express: un router per ogni tabella (100), schema, backup, dashboard e front statico
const express = require("express");
const path = require("node:path");
const db = require("./db/database");
const { tabelle } = require("./db/schema-loader");

const app = express();
app.disable("x-powered-by");
app.use(express.json({ limit: "1mb" }));
app.use((req, res, next) => {
  res.set("X-Content-Type-Options", "nosniff");
  res.set("Referrer-Policy", "same-origin");
  next();
});

for (const t of tabelle)
  app.use(
    "/api/" + t.nome,
    require(`./components/${t.gruppo}/${t.nome}/${t.nome}`),
  );
app.use("/api/schema", require("./components/sistema-api/schema/schema"));
app.use("/api/backup", require("./components/sistema-api/backup/backup"));
app.use("/api/dashboard", require("./components/dashboard/dashboard"));
app.use("/api", (req, res) =>
  res.status(404).json({ errore: "Risorsa non trovata" }),
);

app.use(express.static(path.join(__dirname, "../frontend")));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ errore: err.message });
});

const PORT = process.env.PORT || 3000;
db.init().then(() =>
  app.listen(PORT, () => console.log(`Gestionale su http://localhost:${PORT}`)),
);
