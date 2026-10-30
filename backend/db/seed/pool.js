// Elenchi di base: nomi, città, aziende, descrizioni
const NOMI = "Luca Giulia Marco Chiara Andrea Sara Davide Elena Matteo Francesca Paolo Martina Simone Valentina Stefano Alessia Federico Laura Giorgio Silvia Roberto Anna Alessandro Cristina Daniele Monica Fabio Elisa Riccardo Irene Michele Giorgia Nicola Beatrice Antonio Federica Emanuele Claudia".split(" ");
const COGNOMI = "Rossi Ferrari Russo Bianchi Romano Colombo Ricci Marino Greco Bruno Gallo Conti Esposito Costa Giordano Mancini Rizzo Lombardi Moretti Barbieri Fontana Santoro Mariani Rinaldi Caruso Ferrara Galli Martini Leone Longo Gentile Martinelli Vitale Serra Coppola Pellegrini Farina Sala Fabbri".split(" ");
const CITTA = [["Milano","MI","Lombardia","20121"],["Roma","RM","Lazio","00184"],["Torino","TO","Piemonte","10121"],["Bologna","BO","Emilia-Romagna","40121"],["Napoli","NA","Campania","80121"],["Verona","VR","Veneto","37121"],["Firenze","FI","Toscana","50121"],["Bergamo","BG","Lombardia","24121"],["Padova","PD","Veneto","35121"],["Bari","BA","Puglia","70121"],["Genova","GE","Liguria","16121"],["Venezia","VE","Veneto","30121"],["Palermo","PA","Sicilia","90121"],["Brescia","BS","Lombardia","25121"],["Parma","PR","Emilia-Romagna","43121"],["Trieste","TS","Friuli-Venezia Giulia","34121"],["Como","CO","Lombardia","22100"],["Modena","MO","Emilia-Romagna","41121"],["Trento","TN","Trentino-Alto Adige","38121"],["Cagliari","CA","Sardegna","09121"]];
const VIE = ["Via Roma","Via Garibaldi","Corso Italia","Via Mazzini","Via Dante","Viale Europa","Via Verdi","Piazza della Repubblica","Via dei Mille","Via Cavour","Via Manzoni","Via Torino"];
const ATTIVITA = "Impianti Logistica Design Alimentari Tessuti Meccanica Costruzioni Informatica Servizi Trasporti Consulting Arredamenti Energia Ristorazione Farmaceutica Edilizia Packaging Elettronica Agricola Turismo".split(" ");
const FORME = ["Srl", "SpA", "& C. Snc", "Sas", "Group", "Italia"];
const MESI = ["Gennaio","Febbraio","Marzo","Aprile","Maggio","Giugno","Luglio","Agosto","Settembre","Ottobre","Novembre","Dicembre"];

const DESCRIZIONI = ["Canone mensile","Consulenza oraria","Fornitura materiale","Manutenzione impianto","Licenza software","Spese di spedizione","Servizio di assistenza","Acquisto attrezzature","Formazione del personale","Noleggio automezzo","Pubblicità online","Abbonamento telefonia","Energia elettrica","Pulizia uffici","Materiale di cancelleria","Rimborso spese trasferta","Assicurazione annuale","Affitto sede","Hosting e domini","Revisione contabile"];
const OGGETTI = ["Richiesta di preventivo","Conferma d'ordine","Problema di accesso","Aggiornamento anagrafica","Fornitura urgente","Verifica fattura","Richiesta di rimborso","Modifica contratto","Ritardo nella consegna","Installazione nuovo modulo","Reset password","Richiesta di informazioni","Sollecito di pagamento","Variazione indirizzo","Anomalia a gestionale"];
const NOTE = ["Cliente puntuale nei pagamenti","Richiede conferma scritta","Da ricontattare entro fine mese","Sconto concordato del 5%","Preferisce comunicazioni via email","Verificare i dati fiscali","Referente cambiato di recente","Contratto in rinnovo","Consegna al piano","Pagamento a 60 giorni"];
const COMMENTI = ["Servizio eccellente, molto rapidi","Tutto ok, nulla da segnalare","Tempi di risposta migliorabili","Tecnico preparato e cortese","Problema risolto al primo intervento","Troppa attesa al telefono","Consiglierei il servizio","Documentazione poco chiara"];
const AZIENDE = (R, usati) => {
  for (;;) {
    const n = `${R.pick(COGNOMI)} ${R.pick(ATTIVITA)} ${R.pick(FORME)}`;
    if (!usati.has(n)) return usati.add(n), n;
  }
};
module.exports = { NOMI, COGNOMI, CITTA, VIE, ATTIVITA, FORME, MESI, DESCRIZIONI, OGGETTI, NOTE, COMMENTI, AZIENDE };
