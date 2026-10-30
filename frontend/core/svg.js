// Crea elementi SVG: svg("circle", { r: 4 }, ...figli)
const NS = "http://www.w3.org/2000/svg";
export const svg = (tag, attrs = {}, ...figli) => {
  const e = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  e.append(...figli);
  return e;
};
