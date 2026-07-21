// ============================================================
//  ACQUISTI CORE — stato acquisti, budget, quick-acquista
// ============================================================

// ============================================================
//  ACQUISTI · comprare giocatori con prezzo + budget (max 750)
// ============================================================
let acquisti = [];
let filtriRuoliAcquisti = [];
let acquistiVistaCorrente = "ruolo";
let acquistiBudget = 750;
const BUDGET_MAX = 750;
const PREZZO_MAX = 750;
// id del giocatore appena comprato: al primo render degli acquisti il suo
// campo prezzo viene messo a fuoco e selezionato, così imposti subito
// a quanto l'hai preso.
let focusPrezzoId = null;

// ---------- LOCALSTORAGE ----------
function loadAcquisti() {
  try {
    const saved = localStorage.getItem("acquistiListone");
    if (saved) acquisti = JSON.parse(saved) || [];
  } catch (e) {
    acquisti = [];
  }
  try {
    const b = localStorage.getItem("acquistiBudget");
    if (b !== null) acquistiBudget = clampBudget(parseFloat(b));
  } catch (e) {}
}

function saveAcquisti() {
  localStorage.setItem("acquistiListone", JSON.stringify(acquisti));
  localStorage.setItem("acquistiBudget", String(acquistiBudget));
  aggiornaContatori();
}

// ---------- LIMITI ----------
function clampBudget(v) {
  v = parseFloat(v);
  if (!isFinite(v) || v < 0) return 0;
  return Math.min(BUDGET_MAX, Math.round(v));
}
function clampPrezzo(v) {
  v = parseFloat(v);
  if (!isFinite(v) || v < 0) return 0;
  return Math.min(PREZZO_MAX, Math.round(v));
}
function totaleSpeso() {
  return acquisti.reduce((acc, a) => acc + (Number(a.prezzo) || 0), 0);
}
function isAcquistato(nome, squadra) {
  return acquisti.some((a) => a.nome === nome && a.squadra === squadra);
}

// ---------- AGGIORNA VISTE DOPO UNA MODIFICA ----------
function refreshAfterAcquistiChange() {
  if (singolaSquadraSelezionata) {
    renderSingolaSquadra(singolaSquadraSelezionata);
  } else {
    applyFilters();
  }
  renderMioListone();
  renderAcquisti();
  aggiornaContatori();
}

// ---------- AGGIUNGI / RIMUOVI SINGOLO ----------
function quickAcquista(nome, squadra, ruolo, logo_url, quotazione) {
  const idx = acquisti.findIndex(
    (a) => a.nome === nome && a.squadra === squadra,
  );
  if (idx > -1) {
    // Se è già negli acquisti, lo rimuovo e libero budget
    acquisti.splice(idx, 1);
    saveAcquisti();
    refreshAfterAcquistiChange();
    showToast(`Rimosso ${nome} dagli acquisti`, "fa-trash");
    return;
  }
  // Prima di aggiungerlo agli acquisti, chiedo subito il prezzo pagato
  // con una modale: niente più valore "di partenza" da correggere dopo.
  openPrezzoModal({ nome, squadra, ruolo, logo_url, quotazione }, (prezzo) => {
    // Controllo budget prima di aggiungere
    const spesoCorrente = totaleSpeso();
    const rimanente = acquistiBudget - spesoCorrente;
    if (prezzo > rimanente) {
      showToast(
        `Budget insufficiente! Ti mancano ${prezzo - rimanente} cr.`,
        "fa-exclamation-triangle",
      );
      return; // non aggiungo
    }
    acquisti.push({ nome, squadra, ruolo, logo_url, quotazione, prezzo });
    saveAcquisti();
    refreshAfterAcquistiChange();
    showToast(`${nome} acquistato per ${prezzo} cr`, "fa-sack-dollar");
  });
}
