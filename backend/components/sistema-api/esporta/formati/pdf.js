// PDF (A4 orizzontale): una sezione per tabella, intestazione ripetuta a ogni pagina, numeri di pagina
const PDFDocument = require("pdfkit");

const M = 36;
const COL = {
  ink: "#14172b",
  mu: "#636a84",
  ac: "#3447e0",
  riga: "#f3f4fa",
  linea: "#e2e4ee",
};
const euro = (n) =>
  Number(n).toLocaleString("it-IT", { style: "currency", currency: "EUR" });
const dataIt = (s) =>
  s ? String(s).slice(0, 10).split("-").reverse().join("/") : "";
const testo = (c, v) =>
  v == null || v === ""
    ? ""
    : c.tipo === "euro"
      ? euro(v)
      : c.tipo === "data"
        ? dataIt(v)
        : String(v).replace(/_/g, " ");

// Larghezze proporzionali al contenuto, con minimo e massimo
function larghezze(doc, f, tot) {
  const peso = f.colonne.map((c) => {
    const m = f.righe
      .slice(0, 80)
      .reduce((a, r) => Math.max(a, testo(c, r[c.k]).length), c.l.length);
    return c.tipo === "id" ? 3 : Math.min(30, Math.max(7, m));
  });
  const somma = peso.reduce((a, b) => a + b, 0);
  return peso.map((p) => (p / somma) * tot);
}

module.exports = {
  estensione: "pdf",
  mime: "application/pdf",
  crea({ nome, fogli }) {
    return new Promise((ok, ko) => {
      const doc = new PDFDocument({
        size: "A4",
        layout: "landscape",
        margin: M,
        bufferPages: true,
        info: { Title: nome, Author: "Gestionale" },
      });
      const blocchi = [];
      doc.on("data", (b) => blocchi.push(b));
      doc.on("end", () => ok(Buffer.concat(blocchi)));
      doc.on("error", ko);
      const W = doc.page.width - M * 2;
      const fondo = doc.page.height - M - 18;
      const oggi = new Date().toLocaleDateString("it-IT", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });

      // Copertina con indice quando ci sono più tabelle
      if (fogli.length > 1) {
        doc
          .fillColor(COL.ac)
          .font("Helvetica-Bold")
          .fontSize(26)
          .text(nome, M, 90);
        doc
          .fillColor(COL.mu)
          .font("Helvetica")
          .fontSize(11)
          .text(
            `Esportato il ${oggi} · ${fogli.length} tabelle · ${fogli.reduce((a, f) => a + f.righe.length, 0)} righe`,
          );
        doc.moveDown(1.2).fillColor(COL.ink).fontSize(10);
        const per = Math.ceil(fogli.length / (fogli.length > 24 ? 3 : 1));
        const colW = W / Math.ceil(fogli.length / per);
        const y0 = doc.y;
        fogli.forEach((f, i) => {
          const c = Math.floor(i / per);
          doc.text(
            `${f.titolo}  (${f.righe.length})`,
            M + c * colW,
            y0 + (i % per) * 14,
            { width: colW - 10, lineBreak: false, ellipsis: true },
          );
        });
        doc.addPage();
      }

      fogli.forEach((f, n) => {
        if (n) doc.addPage();
        const ws = larghezze(doc, f, W);
        const testa = () => {
          doc
            .fillColor(COL.ink)
            .font("Helvetica-Bold")
            .fontSize(15)
            .text(f.titolo, M, M);
          doc
            .fillColor(COL.mu)
            .font("Helvetica")
            .fontSize(9)
            .text(`${nome} · ${f.righe.length} righe · ${oggi}`, M, M + 20);
          let y = M + 40,
            x = M;
          doc.rect(M, y, W, 20).fill(COL.ac);
          doc.fillColor("#ffffff").font("Helvetica-Bold").fontSize(8);
          f.colonne.forEach((c, i) => {
            doc.text(c.l, x + 4, y + 6, {
              width: ws[i] - 8,
              lineBreak: false,
              ellipsis: true,
              align: c.tipo === "euro" ? "right" : "left",
            });
            x += ws[i];
          });
          return y + 20;
        };
        let y = testa();
        doc.font("Helvetica").fontSize(8);
        if (!f.righe.length)
          doc
            .fillColor(COL.mu)
            .text("Nessun dato in questa tabella.", M + 4, y + 8);
        f.righe.forEach((r, k) => {
          if (y + 17 > fondo) {
            doc.addPage();
            y = testa();
            doc.font("Helvetica").fontSize(8);
          }
          if (k % 2) doc.rect(M, y, W, 17).fill(COL.riga);
          let x = M;
          doc.fillColor(COL.ink);
          f.colonne.forEach((c, i) => {
            doc.text(testo(c, r[c.k]), x + 4, y + 5, {
              width: ws[i] - 8,
              lineBreak: false,
              ellipsis: true,
              align: c.tipo === "euro" ? "right" : "left",
            });
            x += ws[i];
          });
          y += 17;
        });
      });

      const { start, count } = doc.bufferedPageRange();
      for (let i = start; i < start + count; i++) {
        doc.switchToPage(i);
        doc
          .fillColor(COL.mu)
          .font("Helvetica")
          .fontSize(8)
          .text(`Pagina ${i + 1} di ${count}`, M, doc.page.height - M + 4, {
            width: W,
            align: "right",
            lineBreak: false,
          });
      }
      doc.end();
    });
  },
};
