// ============================================================
//  TOGGLE MIO LISTONE (singolo) — add/remove/clear
// ============================================================

// ============================================================
//  TOGGLE MIO LISTONE (singolo)
// ============================================================
function toggleMioListone(nome, squadra, ruolo, logo_url, quotazione) {
  const index = mioListone.findIndex(
    (m) => m.nome === nome && m.squadra === squadra,
  );
  if (index > -1) {
    mioListone.splice(index, 1);
    showToast(`Rimosso ${nome} dal listone`, "fa-trash");
  } else {
    mioListone.push({ nome, squadra, ruolo, logo_url, quotazione });
    showToast(`Aggiunto ${nome} al listone!`, "fa-plus-circle");
  }
  saveMioListone();
  if (singolaSquadraSelezionata) {
    renderSingolaSquadra(singolaSquadraSelezionata);
  } else {
    applyFilters();
  }
  renderMioListone();
  aggiornaContatori();
}

function removeFromMioListone(nome, squadra) {
  const index = mioListone.findIndex(
    (m) => m.nome === nome && m.squadra === squadra,
  );
  if (index > -1) {
    mioListone.splice(index, 1);
    saveMioListone();
    if (singolaSquadraSelezionata) {
      renderSingolaSquadra(singolaSquadraSelezionata);
    } else {
      applyFilters();
    }
    renderMioListone();
    aggiornaContatori();
    showToast(`Rimosso ${nome} dal listone`, "fa-trash");
  }
}

function clearMioListone() {
  if (mioListone.length === 0) return;
  if (confirm("Sei sicuro di voler svuotare il tuo listone?")) {
    mioListone = [];
    saveMioListone();
    if (singolaSquadraSelezionata) {
      renderSingolaSquadra(singolaSquadraSelezionata);
    } else {
      applyFilters();
    }
    renderMioListone();
    aggiornaContatori();
    showToast("Listone svuotato!", "fa-trash");
  }
}

