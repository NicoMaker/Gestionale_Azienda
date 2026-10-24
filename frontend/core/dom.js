// Mini helper per creare elementi e formattare valori
export const h = (tag, props = {}, ...kids) => {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(props || {})) {
    if (k.startsWith("on")) e.addEventListener(k.slice(2), v);
    else if (k === "class") e.className = v;
    else if (v != null && v !== false) e.setAttribute(k, v);
  }
  e.append(...kids.flat().filter((x) => x != null && x !== false));
  return e;
};
export const euro = (n) =>
  new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(
    n || 0,
  );
