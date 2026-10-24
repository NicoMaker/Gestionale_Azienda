// Client delle API REST
const call = async (method, url, body) => {
  const r = await fetch("/api/" + url, {
    method, headers: { "Content-Type": "application/json" }, body: body ? JSON.stringify(body) : undefined,
  });
  if (!r.ok) throw new Error((await r.json().catch(() => ({}))).errore || r.statusText);
  return r.json();
};
export const api = {
  get: (u) => call("GET", u), post: (u, b) => call("POST", u, b),
  put: (u, b) => call("PUT", u, b), del: (u) => call("DELETE", u),
};
