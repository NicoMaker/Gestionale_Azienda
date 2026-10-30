// Regole di popolamento per tabella. Per ogni tabella si può indicare:
//   n       numero di righe        fisse   righe fisse (valori nell'ordine dei campi, null = automatico)
//   campi   { campo: elenco | (X) => valore }        dopo   (riga, X) => ritocchi finali
// Ciò che non è indicato viene generato da generatore.js in base al nome e al tipo del campo.
const P = require("./pool");

const persona = (X) => X.persona();
const PERSONE = { nome: persona };
const stato3 = (r, X) => {
  const eta = X.eta(r.data);
  r.stato = eta > 60 ? (X.R.chance(0.9) ? "pagata" : "emessa") : X.R.pick(["bozza", "emessa", "pagata"]);
};

module.exports = {
  // ───────── Anagrafiche
  clienti: { n: 60, campi: { nome: (X) => P.AZIENDE(X.R, X.usati) } },
  fornitori: { n: 30, campi: { nome: (X) => P.AZIENDE(X.R, X.usati) } },
  contatti: { n: 90, campi: PERSONE },
  agenti: { n: 12, campi: PERSONE },
  categorie_clienti: { fisse: [["Premium", 10], ["Gold", 8], ["Silver", 5], ["Standard", 0], ["Rivenditore", 15], ["Pubblica amministrazione", 3], ["Grande distribuzione", 12], ["Occasionale", 0], ["Partner", 18], ["Nuovo cliente", 2]] },
  zone: { fisse: [["Nord Ovest", "Lombardia"], ["Nord Est", "Veneto"], ["Emilia", "Emilia-Romagna"], ["Piemonte e Valle d'Aosta", "Piemonte"], ["Toscana", "Toscana"], ["Lazio", "Lazio"], ["Campania", "Campania"], ["Puglia e Basilicata", "Puglia"], ["Sicilia", "Sicilia"], ["Sardegna", "Sardegna"], ["Liguria", "Liguria"], ["Friuli", "Friuli-Venezia Giulia"]] },
  nazioni: { fisse: [["Italia","IT","+39"],["Francia","FR","+33"],["Germania","DE","+49"],["Spagna","ES","+34"],["Regno Unito","GB","+44"],["Svizzera","CH","+41"],["Austria","AT","+43"],["Paesi Bassi","NL","+31"],["Belgio","BE","+32"],["Portogallo","PT","+351"],["Polonia","PL","+48"],["Stati Uniti","US","+1"],["Cina","CN","+86"],["Giappone","JP","+81"],["Canada","CA","+1"],["Grecia","GR","+30"],["Svezia","SE","+46"],["Irlanda","IE","+353"]] },
  valute: { fisse: [["EUR","Euro","€"],["USD","Dollaro statunitense","$"],["GBP","Sterlina britannica","£"],["CHF","Franco svizzero","CHF"],["JPY","Yen giapponese","¥"],["CAD","Dollaro canadese","C$"],["AUD","Dollaro australiano","A$"],["SEK","Corona svedese","kr"],["PLN","Zloty polacco","zł"],["CNY","Renminbi cinese","¥"]] },
  banche: { fisse: [["Intesa Sanpaolo","03069","Milano"],["UniCredit","02008","Milano"],["Banco BPM","05034","Milano"],["BPER Banca","05387","Modena"],["Monte dei Paschi di Siena","01030","Siena"],["Banca Nazionale del Lavoro","01005","Roma"],["Credem","03032","Reggio Emilia"],["Banca Popolare di Sondrio","05696","Sondrio"],["Crédit Agricole Italia","06230","Parma"],["Banca Sella","03268","Biella"],["Banca Mediolanum","03062","Basiglio"],["Fineco Bank","03015","Milano"]] },
  settori: { fisse: [["Manifatturiero","Produzione industriale e artigianale"],["Commercio","Vendita al dettaglio e all'ingrosso"],["Edilizia","Costruzioni e impiantistica"],["Servizi alle imprese","Consulenza, professioni, outsourcing"],["Informatica","Software, hardware e servizi IT"],["Trasporti e logistica","Spedizioni e magazzinaggio"],["Alimentare","Produzione e distribuzione di cibo"],["Turismo","Hotel, ristorazione, viaggi"],["Sanità","Studi, cliniche, farmaceutica"],["Energia","Produzione e distribuzione di energia"],["Agricoltura","Aziende agricole e cooperative"],["Moda e tessile","Abbigliamento e accessori"],["Pubblica amministrazione","Enti locali e centrali"],["Istruzione","Scuole, enti di formazione"],["Finanza e assicurazioni","Banche, SGR, compagnie"]] },

  // ───────── Vendite
  fatture: { n: 140, dopo: stato3 },
  preventivi: { n: 60, campi: { stato: ["aperto", "accettato", "accettato", "rifiutato", "aperto"] } },
  ordini_clienti: { n: 90 },
  note_credito: { n: 20 },
  spedizioni: { n: 70, campi: { corriere: ["BRT", "GLS", "SDA", "DHL", "UPS", "TNT", "Poste Delivery"], tracking: (X) => `IT${X.R.int(10000000, 99999999)}${X.R.int(100, 999)}` } },
  resi: { n: 25, campi: { motivo: ["Prodotto difettoso", "Articolo non conforme", "Consegna in ritardo", "Errore d'ordine", "Danneggiato nel trasporto", "Cambio di idea"] } },
  listini: { fisse: [["Listino base 2026", "EUR"], ["Listino rivenditori", "EUR"], ["Listino Export UE", "EUR"], ["Listino Regno Unito", "GBP"], ["Listino Stati Uniti", "USD"], ["Listino Svizzera", "CHF"], ["Listino promozionale estate", "EUR"], ["Listino grandi clienti", "EUR"]] },
  sconti: { fisse: [["Sconto quantità 10+", 5], ["Sconto quantità 50+", 10], ["Sconto fedeltà", 7], ["Sconto pagamento anticipato", 3], ["Sconto stagionale", 15], ["Sconto rivenditori", 20], ["Sconto nuovo cliente", 8], ["Sconto fine serie", 25], ["Sconto Black Friday", 30], ["Sconto convenzione", 12]] },
  promozioni: { fisse: [["Saldi invernali", "Riduzioni su tutta la gamma"], ["Primavera in offerta", "Promozioni su articoli selezionati"], ["Back to school", "Sconti su cancelleria e informatica"], ["Estate 3x2", "Tre prodotti al prezzo di due"], ["Black Friday", "Una settimana di sconti straordinari"], ["Natale insieme", "Pacchetti regalo aziendali"], ["Rottamazione", "Ritiro dell'usato con sconto sul nuovo"], ["Clienti fedeli", "Vantaggi riservati ai clienti storici"]] },
  contratti: { n: 30, campi: { titolo: ["Contratto di manutenzione annuale", "Contratto di fornitura", "Contratto di assistenza", "Licenza d'uso software", "Contratto di consulenza", "Accordo quadro", "Contratto di noleggio", "Contratto di agenzia"] } },

  // ───────── Acquisti
  ordini_fornitori: { n: 70 },
  fatture_acquisto: { n: 80 },
  richieste_offerta: { n: 25 },
  ddt_ingresso: { n: 50 },
  note_debito: { n: 15 },
  listini_acquisto: { fisse: [["Listino materie prime", null, null], ["Listino imballaggi", null, null], ["Listino informatica", null, null], ["Listino servizi", null, null], ["Listino trasporti", null, null], ["Listino energia", null, null], ["Listino ricambi", null, null], ["Listino cancelleria", null, null], ["Listino attrezzature", null, null], ["Listino manutenzioni", null, null]] },
  valutazioni_fornitori: { n: 40, campi: { punteggio: (X) => X.R.int(5, 10) } },
  budget_acquisti: { fisse: [["Materie prime", 2026], ["Imballaggi", 2026], ["Informatica", 2026], ["Servizi", 2026], ["Trasporti", 2026], ["Manutenzioni", 2026], ["Energia", 2026], ["Formazione", 2026], ["Materie prime", 2025], ["Informatica", 2025]] },
  approvazioni: { n: 35, campi: { oggetto: ["Acquisto notebook", "Ordine materie prime", "Rinnovo licenze", "Nuovo fornitore", "Spesa di trasferta", "Manutenzione straordinaria", "Consulenza esterna", "Acquisto arredi"], richiedente: persona } },
  spese_acquisto: { n: 60 },

  // ───────── Magazzino
  prodotti: { n: 60, campi: { nome: ["Notebook 15 pollici","Monitor 27 pollici","Tastiera meccanica","Mouse wireless","Stampante laser","Router Wi-Fi 6","Disco SSD 1TB","Cuffie con microfono","Webcam Full HD","Gruppo di continuità","Scrivania regolabile","Sedia ergonomica","Lampada da tavolo LED","Armadio ufficio","Cassettiera","Risma carta A4","Toner nero","Cartucce colore","Penna a sfera (conf.)","Quaderno A4","Lavagna magnetica","Proiettore","Switch 24 porte","Cavo HDMI 2m","Hub USB-C","Smartphone aziendale","Tablet 10 pollici","Telefono VoIP","Lettore codici a barre","Etichettatrice","Consulenza finanziaria","Analisi di portafoglio","Report mensile","Audit contabile","Formazione aziendale","Assistenza on-site","Licenza software annuale","Manutenzione programmata","Pacchetto sicurezza IT","Backup cloud 1TB","Cassa portavalori","Distruggi documenti","Carrello da magazzino","Transpallet manuale","Scaffale metallico","Casco antinfortunistico","Guanti da lavoro (conf.)","Estintore 6 kg","Kit pronto soccorso","Bilancia da banco","Sacchetti imballo (conf.)","Nastro adesivo (conf.)","Scatole 40x30 (conf.)","Pluriball rotolo","Bancale EPAL","Pellicola estensibile","Cinghia di serraggio","Lucchetto di sicurezza","Segnaletica di sicurezza","Etichette adesive (rotolo)"] } },
  categorie_prodotti: { fisse: [["Informatica", "Computer, periferiche e accessori"], ["Arredamento", "Mobili e complementi per ufficio"], ["Cancelleria", "Carta, penne e materiale d'uso"], ["Servizi", "Consulenze e assistenza"], ["Telefonia", "Telefoni e dispositivi mobili"], ["Reti", "Apparati di rete e cablaggi"], ["Sicurezza", "Dispositivi di protezione e antincendio"], ["Imballaggio", "Materiali per spedizioni"], ["Attrezzature", "Strumenti da magazzino e lavoro"], ["Software", "Licenze e abbonamenti"]] },
  marche: { fisse: [["Lenovo","Cina"],["HP","Stati Uniti"],["Dell","Stati Uniti"],["Logitech","Svizzera"],["Samsung","Corea del Sud"],["Brother","Giappone"],["Epson","Giappone"],["Ikea Business","Svezia"],["Esselte","Italia"],["Fellowes","Stati Uniti"],["Cisco","Stati Uniti"],["TP-Link","Cina"],["Bosch","Germania"],["3M","Stati Uniti"],["Fiskars","Finlandia"]] },
  magazzini: { fisse: [["Deposito centrale","Milano",12000],["Magazzino Nord","Bergamo",8000],["Magazzino Sud","Napoli",6500],["Deposito Nord-Est","Verona",7200],["Polo logistico Emilia","Bologna",15000],["Magazzino Centro","Roma",9000],["Punto di ritiro Padova","Padova",1800],["Reparto picking","Milano",2500]] },
  giacenze: { n: 90 },
  movimenti_magazzino: { n: 200, campi: { quantita: (X) => X.R.int(1, 120) } },
  lotti: { n: 50 },
  inventari: { n: 16, campi: { nome: (X) => `Inventario ${["marzo", "giugno", "settembre", "dicembre"][X.i % 4]} ${2025 + Math.floor(X.i / 8)}` } },
  unita_misura: { fisse: [["Pezzo","pz"],["Chilogrammo","kg"],["Grammo","g"],["Litro","l"],["Metro","m"],["Metro quadro","m²"],["Confezione","conf"],["Scatola","sc"],["Bancale","bn"],["Ora","h"],["Giorno","gg"],["Rotolo","rt"]] },
  ubicazioni: { n: 48, campi: { codice: (X) => `${"ABCDEF"[X.i % 6]}-${String(Math.floor(X.i / 6) + 1).padStart(2, "0")}-${X.R.int(1, 5)}` } },

  // ───────── Contabilità
  piano_conti: { fisse: [["100.01","Cassa contanti","attivo"],["100.02","Banca c/c principale","attivo"],["110.01","Crediti verso clienti","attivo"],["110.02","Crediti tributari","attivo"],["120.01","Magazzino merci","attivo"],["130.01","Immobilizzazioni materiali","attivo"],["200.01","Debiti verso fornitori","passivo"],["200.02","Debiti tributari","passivo"],["200.03","Debiti verso banche","passivo"],["210.01","TFR","passivo"],["220.01","Capitale sociale","passivo"],["300.01","Acquisti di merci","costo"],["300.02","Costi per servizi","costo"],["300.03","Costi del personale","costo"],["300.04","Affitti passivi","costo"],["300.05","Utenze","costo"],["300.06","Ammortamenti","costo"],["300.07","Interessi passivi","costo"],["400.01","Ricavi vendite","ricavo"],["400.02","Ricavi prestazioni","ricavo"],["400.03","Interessi attivi","ricavo"],["400.04","Altri ricavi","ricavo"]] },
  registrazioni: { n: 160 },
  iva: { fisse: [["Esente art. 10", 0], ["Aliquota minima", 4], ["Aliquota ridotta 5%", 5], ["Aliquota ridotta 10%", 10], ["Aliquota ordinaria", 22]] },
  cespiti: { n: 25, campi: { nome: ["Server Dell PowerEdge","Furgone Fiat Ducato","Fotocopiatrice multifunzione","Muletto elettrico","Notebook flotta aziendale","Impianto di allarme","Climatizzatore sede","Arredi ufficio","Stampante di rete","Macchina CNC","Carrello elevatore","Impianto fotovoltaico","Autovettura aziendale","Centralino VoIP","Scaffalatura magazzino","Telecamere videosorveglianza","Compressore industriale","Banco di collaudo","Nastro trasportatore","Software gestionale","Sito web aziendale","Router e switch","Monitor sala riunioni","Gruppo elettrogeno","Pulitrice industriale"] } },
  ammortamenti: { n: 60 },
  centri_costo: { fisse: [["CC01","Direzione"],["CC02","Amministrazione"],["CC03","Commerciale"],["CC04","Produzione"],["CC05","Logistica"],["CC06","Assistenza clienti"],["CC07","Ricerca e sviluppo"],["CC08","Marketing"],["CC09","Sistemi informativi"],["CC10","Risorse umane"]] },
  scadenzario: { n: 90, campi: { stato: ["aperta", "aperta", "saldata"] } },
  riconciliazioni: { n: 40 },
  bilanci: { fisse: [["Bilancio 2021", 2021], ["Bilancio 2022", 2022], ["Bilancio 2023", 2023], ["Bilancio 2024", 2024], ["Bilancio 2025", 2025]] },
  esercizi: { fisse: [["Esercizio 2022","2022-01-01","2022-12-31"],["Esercizio 2023","2023-01-01","2023-12-31"],["Esercizio 2024","2024-01-01","2024-12-31"],["Esercizio 2025","2025-01-01","2025-12-31"],["Esercizio 2026","2026-01-01","2026-12-31"]] },

  // ───────── Finanza
  conti_bancari: { n: 8, campi: { nome: ["Conto operativo", "Conto stipendi", "Conto fornitori", "Conto tasse", "Conto estero USD", "Conto risparmio", "Conto commerciale", "Conto anticipi"] } },
  movimenti_bancari: { n: 220 },
  pagamenti: { n: 120 },
  incassi: { n: 120 },
  prestiti: { fisse: [["Mutuo sede", 250000, 3.2, 180], ["Finanziamento macchinari", 80000, 4.1, 60], ["Prestito scorte", 40000, 5.0, 24], ["Leasing automezzi", 56000, 3.8, 48], ["Linea di credito", 100000, 6.0, 12], ["Finanziamento fotovoltaico", 120000, 2.9, 120]] },
  investimenti: { n: 12, campi: { nome: ["Fondo bilanciato", "Obbligazioni corporate", "BTP a 5 anni", "ETF mondo", "Polizza vita", "Deposito vincolato", "Azioni ordinarie", "Fondo immobiliare", "Titoli di Stato USA", "Fondo monetario", "Oro fisico", "Private equity"] } },
  titoli: { n: 12, campi: { nome: ["Alfa Industrie", "Beta Energia", "Gamma Banca", "Delta Telecom", "BTP 2030 3,5%", "BTP 2034 4,0%", "Fondo Sigma Bilanciato", "ETF Mondo Delta", "Omega Farmaceutica", "Zeta Logistica", "Kappa Assicurazioni", "Lambda Retail"], isin: (X) => `IT${X.R.int(1000000000, 9999999999)}` } },
  dividendi: { n: 30 },
  previsioni_cassa: { n: 12 },
  tassi_cambio: { n: 60 },

  // ───────── Personale
  dipendenti: { n: 40, campi: { nome: persona } },
  reparti: { fisse: [["Direzione", null], ["Amministrazione", null], ["Commerciale", null], ["Produzione", null], ["Logistica", null], ["Assistenza clienti", null], ["Acquisti", null], ["Sistemi informativi", null], ["Marketing", null], ["Risorse umane", null]] },
  ruoli: { fisse: [["Amministratore", 6], ["Direttore", 5], ["Responsabile di area", 4], ["Quadro", 4], ["Impiegato amministrativo", 3], ["Commerciale", 3], ["Tecnico specializzato", 3], ["Operatore di magazzino", 2], ["Addetto assistenza", 2], ["Stagista", 1]] },
  contratti_lavoro: { n: 40 },
  presenze: { n: 320, campi: { ore: (X) => X.R.pick([8, 8, 8, 8, 7, 6, 4, 9]) } },
  ferie: { n: 45 },
  buste_paga: { n: 120 },
  formazione: { n: 50, campi: { corso: ["Sicurezza sul lavoro", "Excel avanzato", "Gestione del tempo", "Inglese commerciale", "Privacy e GDPR", "Primo soccorso", "Leadership", "Negoziazione", "Antincendio", "Fatturazione elettronica"] } },
  selezioni: { n: 30, campi: { candidato: persona, posizione: ["Impiegato amministrativo", "Commerciale junior", "Sviluppatore", "Magazziniere", "Tecnico assistenza", "Responsabile acquisti", "Addetto marketing", "Contabile"] } },
  valutazioni_personale: { n: 60 },

  // ───────── Progetti
  progetti: { n: 30, campi: { nome: ["Nuovo portale clienti","Migrazione gestionale","App per i tecnici","Restyling sito web","Integrazione e-commerce","Automazione magazzino","Campagna marketing autunno","Certificazione ISO 9001","Nuova sede di Verona","Sistema di fatturazione","Dashboard vendite","Intranet aziendale","Cablaggio uffici","Programma fedeltà","Gestione contratti","Analisi dei costi","Digitalizzazione archivio","Audit sicurezza IT","Piano formazione 2026","Ottimizzazione logistica","Rinnovo flotta","Portale fornitori","Catalogo digitale","Chatbot assistenza","Business intelligence","Revisione listini","Apertura filiale Sud","Passaggio al cloud","Rinnovo licenze","Piano sostenibilità"] } },
  attivita: { n: 150, campi: { titolo: ["Analisi dei requisiti", "Progettazione", "Sviluppo", "Test di accettazione", "Formazione utenti", "Rilascio in produzione", "Revisione documenti", "Riunione di avvio", "Raccolta preventivi", "Migrazione dati", "Collaudo", "Verifica budget"] } },
  milestone: { n: 60, campi: { nome: ["Kick-off", "Analisi completata", "Prototipo", "Beta", "Collaudo", "Go-live", "Chiusura"] } },
  risorse: { n: 20, campi: { nome: persona, ruolo: ["Project manager", "Sviluppatore", "Analista", "Designer", "Tester", "Consulente", "Tecnico di rete"] } },
  timesheet: { n: 280, campi: { ore: (X) => X.R.int(1, 8) } },
  spese_progetto: { n: 80 },
  rischi: { n: 45, campi: { descrizione: ["Ritardo del fornitore", "Superamento del budget", "Mancanza di risorse", "Requisiti instabili", "Problemi di integrazione", "Turnover del team", "Rischio normativo", "Dipendenza da terzi"] } },
  documenti_progetto: { n: 70, campi: { titolo: ["Specifiche tecniche", "Piano di progetto", "Verbale di riunione", "Manuale utente", "Report di collaudo", "Offerta commerciale", "Analisi dei rischi", "Capitolato"] } },
  versioni: { n: 40, campi: { nome: (X) => `v${1 + Math.floor(X.i / 8)}.${X.i % 8}` } },
  rilasci: { n: 40, campi: { nome: (X) => `Rilascio ${X.i + 1}`, note: ["Correzione errori", "Nuove funzioni", "Miglioramenti prestazioni", "Aggiornamento sicurezza", "Interfaccia rinnovata"] } },

  // ───────── Assistenza
  ticket: { n: 120 },
  interventi: { n: 100 },
  garanzie: { n: 50 },
  richieste: { n: 60 },
  faq: { fisse: [["Come reimposto la password?", "Dalla schermata di accesso scegli «Password dimenticata» e segui le istruzioni inviate via email."], ["Come scarico una fattura?", "Apri la sezione Fatture, seleziona la riga e usa il pulsante Esporta."], ["Quanto dura la garanzia?", "La garanzia standard dura 24 mesi dalla data di acquisto."], ["Come richiedo un reso?", "Compila il modulo di reso entro 14 giorni dalla consegna."], ["Quali metodi di pagamento accettate?", "Bonifico, carta di credito e contanti alla consegna."], ["Come contatto l'assistenza?", "Via email, telefono o chat, dal lunedì al venerdì dalle 9 alle 18."], ["Posso modificare un ordine?", "Sì, finché non è passato allo stato «evaso»."], ["Come funziona il backup?", "Dal menu laterale puoi scaricare una copia del database."], ["Dove vedo lo stato della spedizione?", "Nella sezione Spedizioni, con il numero di tracking."], ["Come aggiungo un nuovo utente?", "Dalla sezione Utenti scegli «Aggiungi» e assegna un ruolo."], ["Come esporto i dati?", "Ogni tabella ha il pulsante Esporta: CSV, Excel o PDF."], ["Cosa significa stato «emessa»?", "La fattura è stata emessa ma non ancora incassata."]] },
  canali: { fisse: [["Email assistenza", "email"], ["Linea verde", "telefono"], ["Chat sul sito", "chat"], ["Email commerciale", "email"], ["Centralino", "telefono"], ["Chat WhatsApp", "chat"], ["Email amministrazione", "email"], ["Linea urgenze", "telefono"]] },
  sla: { fisse: [["Standard", 8, 72], ["Premium", 4, 24], ["Gold", 2, 12], ["Critico", 1, 4], ["Base", 24, 120]] },
  feedback: { n: 70, campi: { voto: (X) => X.R.pick([3, 4, 4, 5, 5, 5, 2, 1]), commento: P.COMMENTI } },
  tecnici: { n: 12, campi: { nome: persona, specialita: ["Reti", "Hardware", "Software", "Impianti", "Stampanti", "Telefonia", "Sicurezza"] } },
  ricambi: { n: 40, campi: { nome: ["Alimentatore 65W","Batteria notebook","Display 15,6\"","Tastiera ricambio","Ventola CPU","Memoria RAM 8GB","Disco SSD 512GB","Rullo stampante","Cinghia stampante","Cavo di rete 5m","Scheda madre","Touchpad","Cerniere display","Fusibile 10A","Interruttore","Antenna Wi-Fi","Presa USB","Condensatore","Kit pulizia","Pasta termica"] } },

  // ───────── Sistema
  utenti: { n: 15, campi: { nome: persona } },
  permessi: { fisse: [["lettura", "Visualizzare i dati"], ["scrittura", "Creare e modificare i dati"], ["eliminazione", "Eliminare i record"], ["esportazione", "Esportare in CSV, Excel e PDF"], ["backup", "Scaricare il backup del database"], ["utenti", "Gestire gli utenti"], ["fatturazione", "Emettere fatture"], ["magazzino", "Movimentare il magazzino"], ["contabilita", "Registrare in contabilità"], ["report", "Consultare i report"], ["impostazioni", "Modificare le impostazioni"], ["audit", "Consultare i log di accesso"]] },
  log_accessi: { n: 220 },
  notifiche: { n: 60, campi: { titolo: ["Nuova fattura emessa", "Scadenza in arrivo", "Ticket assegnato", "Ordine evaso", "Backup completato", "Nuovo preventivo accettato", "Giacenza sotto scorta", "Pagamento ricevuto"] } },
  impostazioni: { fisse: [["valuta", "EUR"], ["iva_default", "22"], ["giorni_scadenza", "30"], ["formato_data", "GG/MM/AAAA"], ["ragione_sociale", "Azienda Demo Srl"], ["partita_iva", "01234567897"], ["sede_legale", "Via Roma 1, 20121 Milano"], ["notifiche_email", "attive"], ["lingua", "it"], ["tema", "automatico"], ["backup_automatico", "ogni notte"], ["righe_per_pagina", "25"]] },
  backup_log: { n: 30, righe: (X) => Array.from({ length: 30 }, (_, k) => { const d = X.giorni(-(29 - k)); return [`gestionale-backup-${d}.db`, d, X.R.int(900, 2600)]; }) },
  modelli_email: { fisse: [["Conferma ordine", "Il suo ordine è stato ricevuto", "Gentile cliente, abbiamo ricevuto il suo ordine e lo stiamo preparando."], ["Sollecito di pagamento", "Fattura in scadenza", "Gentile cliente, le ricordiamo che la fattura risulta ancora da saldare."], ["Benvenuto", "Benvenuto nel nostro gestionale", "Il suo account è stato creato. Può accedere con le credenziali ricevute."], ["Preventivo", "Il suo preventivo", "In allegato trova il preventivo richiesto, valido 30 giorni."], ["Spedizione", "Il suo ordine è in viaggio", "Può seguire la spedizione con il numero di tracking indicato."], ["Ticket aperto", "Abbiamo aperto la sua richiesta", "Un tecnico la contatterà entro i tempi previsti dal suo contratto."], ["Ringraziamento", "Grazie per averci scelto", "La ringraziamo per la fiducia accordata."], ["Scadenza contratto", "Il suo contratto sta per scadere", "Il contratto scadrà a breve: contattaci per il rinnovo."]] },
  allegati: { n: 80, campi: { tipo: ["PDF", "XLSX", "DOCX", "PNG", "ZIP"] } },
  tag: { fisse: [["Prioritario","#d8384a"],["Da verificare","#e08a1e"],["Strategico","#3447e0"],["Nuovo","#12a05c"],["In scadenza","#c0392b"],["Approvato","#0b8a5c"],["Archiviato","#727a94"],["Internazionale","#2a7fd4"],["Rivenditore","#8e44ad"],["VIP","#d4a017"]] },
  task_pianificati: { fisse: [["Backup notturno", "0 2 * * *", "si"], ["Sollecito pagamenti", "0 9 * * 1", "si"], ["Report settimanale", "0 8 * * 1", "si"], ["Pulizia log", "0 3 1 * *", "si"], ["Aggiornamento cambi", "0 7 * * 1-5", "si"], ["Controllo giacenze", "0 6 * * *", "si"], ["Invio notifiche", "*/15 * * * *", "si"], ["Esportazione contabile", "0 23 L * *", "no"]] },
};
