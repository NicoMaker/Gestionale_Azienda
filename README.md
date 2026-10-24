# Gestionale

Front (HTML/CSS/JS a componenti) + Back (Node.js, Express, SQLite3).

```bash
npm install
npm start        # http://localhost:3000
```

- `frontend/`: interfaccia con `components/` (sidebar, dashboard, data-table, modal-form, toast), `pages/`, `config/entities.js`, `core/`
- `backend/`: API REST con `components/` (clienti, prodotti, fatture, dashboard) e `db/database.js` (schema + dati di esempio)
- `docs/`: schema db

Per aggiungere una sezione: una voce in `frontend/config/entities.js` e un router in `backend/components/<nome>/`.

## 100 tabelle

Lo schema è in `schema/tabelle.js` (10 gruppi × 10 tabelle). Dopo averlo modificato: `npm run genera`
ricrea i componenti `back/components/<gruppo>/<tabella>/` e gli schemi `docs/schema-db.mmd` e `docs/schema-gruppi.mmd`.
Il front legge lo schema da `/api/schema`. Il menu "Scarica backup" scarica una copia del database (`/api/backup`).
