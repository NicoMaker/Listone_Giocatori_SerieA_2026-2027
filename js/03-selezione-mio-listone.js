// ============================================================
//  SELEZIONE NEL MIO LISTONE — selezione per sezione
// ============================================================

// ===== SELEZIONE NEL "MIO LISTONE" =====
// Seleziona tutte le checkbox contenute in un elemento (sezione o pannello).
function selectCheckboxesIn(container) {
  if (!container) return 0;
  const checkboxes = container.querySelectorAll(".player-checkbox");
  let n = 0;
  checkboxes.forEach((cb) => {
    cb.checked = true;
    const id = cb.dataset.id;
    const player = cb.dataset.player ? JSON.parse(cb.dataset.player) : null;
    if (player) {
      selectedPlayers.set(id, player);
      n++;
    }
  });
  updateSelectionUI();
  return n;
}

// Seleziona TUTTI i giocatori presenti nel Mio Listone (solo quelli visibili
// con i filtri correnti).
function selectAllMio() {
  const grid = document.getElementById("mioListoneGrid");
  const n = selectCheckboxesIn(grid);
  if (n === 0) {
    showToast(
      "Nessun giocatore da selezionare nel tuo listone",
      "fa-info-circle",
    );
    return;
  }
  showToast(`Selezionati ${n} giocatori del tuo listone`, "fa-check-double");
}

// Seleziona tutti i giocatori di una sezione del Mio Listone
// (un ruolo intero in vista "Per Ruolo", una squadra intera in vista "Per Squadra").
function selectMioSection(btn) {
  const section = btn.closest(".mio-ruolo-section, .mio-squadra-section");
  if (!section) return;
  const n = selectCheckboxesIn(section);
  const label = section.querySelector(".mio-section-label");
  const nome = label ? label.textContent.trim() : "";
  showToast(
    n
      ? `Selezionati ${n} giocatori${nome ? " · " + nome : ""}`
      : "Nessun giocatore da selezionare",
    n ? "fa-check-double" : "fa-info-circle",
  );
}

