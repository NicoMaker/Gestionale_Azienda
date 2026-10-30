// Converte le righe di una tabella in testo CSV (separatore «;», adatto a Excel in italiano)
export const toCsv = (colonne, righe) =>
  [
    colonne.map((c) => c.l),
    ...righe.map((r) => colonne.map((c) => r[c.k] ?? "")),
  ]
    .map((riga) =>
      riga.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(";"),
    )
    .join("\r\n");

export function scaricaCsv(nome, testo) {
  const url = URL.createObjectURL(
    new Blob(["\ufeff" + testo], { type: "text/csv;charset=utf-8" }),
  );
  Object.assign(document.createElement("a"), {
    href: url,
    download: nome + ".csv",
  }).click();
  URL.revokeObjectURL(url);
}
