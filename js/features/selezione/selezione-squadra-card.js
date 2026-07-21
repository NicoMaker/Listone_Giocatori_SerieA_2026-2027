// ============================================================
//  SELEZIONA TUTTI I GIOCATORI DI UNA SQUADRA + aggiungi/rimuovi dal Mio Listone
// ============================================================

// ===== SELEZIONA TUTTI I GIOCATORI DI UNA SQUADRA (dalla card) =====
function selectAllSquadra(squadraId) {
  const squadra = squadre.find((s) => s.id === squadraId);
  if (!squadra) return;
  const checkboxes = document.querySelectorAll(
    `.card-squadra[data-squadra-id="${squadraId}"] .player-checkbox, .card-squadra[data-squadra-id="${squadraId}"] .player-checkbox`,
  );
  // Se non ci sono checkbox nella card (vista tabella), cerchiamo nella tabella
  let checkboxesToUse =
    checkboxes.length > 0
      ? checkboxes
      : document.querySelectorAll(
          `#tableBody .player-checkbox[data-squadra="${squadra.nome}"]`,
        );
  if (checkboxesToUse.length === 0) {
    showToast(
      `Nessun giocatore visibile per ${squadra.nome}`,
      "fa-info-circle",
    );
    return;
  }
  checkboxesToUse.forEach((cb) => {
    cb.checked = true;
    const id = cb.dataset.id;
    const player = cb.dataset.player ? JSON.parse(cb.dataset.player) : null;
    if (player) {
      selectedPlayers.set(id, player);
    }
  });
  updateSelectionUI();
  showToast(
    `Selezionati tutti i giocatori di ${squadra.nome}`,
    "fa-check-double",
  );
}

function toggleSelectAllTable(master) {
  const checkboxes = document.querySelectorAll("#tableBody .player-checkbox");
  checkboxes.forEach((cb) => {
    cb.checked = master.checked;
    const id = cb.dataset.id;
    const player = cb.dataset.player ? JSON.parse(cb.dataset.player) : null;
    if (master.checked) {
      if (player) selectedPlayers.set(id, player);
    } else {
      selectedPlayers.delete(id);
    }
  });
  updateSelectionUI();
}

function addSelectedToMio() {
  if (selectedPlayers.size === 0) return;
  let added = 0;
  for (let [id, player] of selectedPlayers) {
    if (
      !mioListone.some(
        (m) => m.nome === player.nome && m.squadra === player.squadra,
      )
    ) {
      mioListone.push({ ...player });
      added++;
    }
  }
  if (added > 0) {
    saveMioListone();
    if (singolaSquadraSelezionata) {
      renderSingolaSquadra(singolaSquadraSelezionata);
    } else {
      applyFilters();
    }
    renderMioListone();
    aggiornaContatori();
    showToast(`Aggiunti ${added} giocatori al listone!`, "fa-plus-circle");
    clearSelection();
  } else {
    showToast("I giocatori selezionati sono già nel listone", "fa-info-circle");
  }
}

function removeSelectedFromMio() {
  if (selectedPlayers.size === 0) return;
  if (!confirm(`Rimuovere ${selectedPlayers.size} giocatori dal listone?`))
    return;
  let removed = 0;
  for (let [id, player] of selectedPlayers) {
    const index = mioListone.findIndex(
      (m) => m.nome === player.nome && m.squadra === player.squadra,
    );
    if (index > -1) {
      mioListone.splice(index, 1);
      removed++;
    }
  }
  if (removed > 0) {
    saveMioListone();
    if (singolaSquadraSelezionata) {
      renderSingolaSquadra(singolaSquadraSelezionata);
    } else {
      applyFilters();
    }
    renderMioListone();
    aggiornaContatori();
    showToast(`Rimossi ${removed} giocatori dal listone`, "fa-trash");
    clearSelection();
  } else {
    showToast("Nessuno dei selezionati era nel listone", "fa-info-circle");
  }
}

