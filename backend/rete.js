// Indirizzi di rete mostrati all'avvio del server: pubblico, locale e localhost
const os = require("node:os");

// Primo indirizzo IPv4 non interno (quello della rete locale)
const ipLocale = () => {
  for (const reti of Object.values(os.networkInterfaces()))
    for (const r of reti || [])
      if (r.family === "IPv4" && !r.internal) return r.address;
  return "127.0.0.1";
};

// IP pubblico tramite servizio esterno; se offline o lento (3 s) restituisce null
const ipPubblico = async () => {
  try {
    const r = await fetch("https://api.ipify.org", {
      signal: AbortSignal.timeout(3000),
    });
    return r.ok ? (await r.text()).trim() : null;
  } catch {
    return null;
  }
};

async function stampaAvvio(PORT) {
  const publicIP = (await ipPubblico()) ?? "non disponibile (offline)";
  const localIP = ipLocale();
  console.log(`\n🚀 Server avviato con successo!`);
  console.log(`🌐 IP Pubblico: http://${publicIP}:${PORT}`);
  console.log(`🏠 IP Locale:   http://${localIP}:${PORT}`);
  console.log(`📍 Localhost:   http://localhost:${PORT}`);
}
module.exports = { ipLocale, ipPubblico, stampaAvvio };
