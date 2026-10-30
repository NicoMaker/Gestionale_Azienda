// Avvia il download di un file servito dal backend (es. /api/esporta/...)
export function scarica(url) {
  const a = Object.assign(document.createElement("a"), {
    href: "/api/" + url,
    download: "",
  });
  document.body.append(a);
  a.click();
  a.remove();
}
