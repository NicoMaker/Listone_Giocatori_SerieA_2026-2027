// ============================================================
//  AZIONI ACQUISTO — acquista selezionati, rimuovi, svuota
// ============================================================

// ---------- ACQUISTA I SELEZIONATI (dal Listone) ----------
function acquistaSelezionati() {
  _acquistaSelezione({ vaiAgliAcquisti: false });
}

// ---------- ACQUISTA I SELEZIONATI (dalla sezione "Il Mio") ----------
// Permette di comprare in blocco i giocatori spuntati nel Mio Listone
// e ti porta direttamente agli Acquisti per impostare i prezzi.
function acquistaSelezionatiDaMio() {
  _acquistaSelezione({ vaiAgliAcquisti: true });
}

function _acquistaSelezione({ vaiAgliAcquisti }) {
  if (selectedPlayers.size === 0) return;
  const daAcquistare = [...selectedPlayers.values()].filter(
    (p) => !isAcquistato(p.nome, p.squadra),
  );
  if (daAcquistare.length === 0) {
    showToast(
      "I giocatori selezionati sono già negli acquisti",
      "fa-info-circle",
    );
    return;
  }
  clearSelection();
  acquistaInSequenza(daAcquistare, 0, vaiAgliAcquisti);
}

// Apre la modale prezzo per un giocatore alla volta, in sequenza, finché
// non sono stati impostati tutti i prezzi dei giocatori selezionati.
function acquistaInSequenza(lista, index, vaiAgliAcquisti) {
  if (index >= lista.length) {
    if (index > 0) {
      saveAcquisti();
      if (vaiAgliAcquisti) {
        switchTab("acquisti", { skipScroll: true });
      }
      refreshAfterAcquistiChange();
      showToast(`Acquistati ${index} giocatori!`, "fa-sack-dollar");
    }
    return;
  }

  const player = lista[index];
  // Controllo budget preventivo: se il budget residuo è già zero, non posso
  // permettere nessun acquisto ulteriore.
  const spesoCorrente = totaleSpeso();
  const rimanente = acquistiBudget - spesoCorrente;
  if (rimanente <= 0) {
    showToast(
      `Budget esaurito! Non puoi acquistare altri giocatori.`,
      "fa-exclamation-triangle",
    );
    // Interrompo la sequenza ma tengo quelli già acquistati
    if (index > 0) {
      saveAcquisti();
      refreshAfterAcquistiChange();
    }
    return;
  }

  openPrezzoModal(
    {
      nome: player.nome,
      squadra: player.squadra,
      ruolo: player.ruolo,
      logo_url: player.logo_url,
      quotazione: player.quotazione,
      step: { current: index + 1, total: lista.length },
    },
    (prezzo) => {
      // Controllo budget al momento della conferma (potrebbe essere cambiato)
      const spesoCorrente2 = totaleSpeso();
      if (acquistiBudget - spesoCorrente2 - prezzo < 0) {
        showToast(
          `Budget insufficiente! Non puoi acquistare ${player.nome}.`,
          "fa-exclamation-triangle",
        );
        // Interrompo la sequenza
        if (index > 0) {
          saveAcquisti();
          refreshAfterAcquistiChange();
          showToast(
            `Acquisto interrotto: ${index} giocatori aggiunti`,
            "fa-info-circle",
          );
        }
        return;
      }
      acquisti.push({
        nome: player.nome,
        squadra: player.squadra,
        ruolo: player.ruolo,
        logo_url: player.logo_url,
        quotazione: player.quotazione,
        prezzo,
      });
      acquistaInSequenza(lista, index + 1, vaiAgliAcquisti);
    },
    () => {
      // annullato: mi fermo qui, tengo quelli già confermati
      if (index > 0) {
        saveAcquisti();
        refreshAfterAcquistiChange();
        showToast(
          `Acquisto interrotto: ${index} giocatori aggiunti`,
          "fa-info-circle",
        );
      } else {
        showToast("Acquisto annullato", "fa-info-circle");
      }
    },
  );
}

function removeFromAcquisti(nome, squadra) {
  const idx = acquisti.findIndex(
    (a) => a.nome === nome && a.squadra === squadra,
  );
  if (idx > -1) {
    acquisti.splice(idx, 1);
    saveAcquisti();
    refreshAfterAcquistiChange();
    showToast(`Rimosso ${nome} dagli acquisti`, "fa-trash");
  }
}

function removeSelectedFromAcquisti() {
  if (selectedPlayers.size === 0) return;
  if (!confirm(`Rimuovere ${selectedPlayers.size} giocatori dagli acquisti?`))
    return;
  let removed = 0;
  for (let [id, player] of selectedPlayers) {
    const idx = acquisti.findIndex(
      (a) => a.nome === player.nome && a.squadra === player.squadra,
    );
    if (idx > -1) {
      acquisti.splice(idx, 1);
      removed++;
    }
  }
  if (removed > 0) {
    saveAcquisti();
    refreshAfterAcquistiChange();
    showToast(`Rimossi ${removed} giocatori dagli acquisti`, "fa-trash");
    clearSelection();
  } else {
    showToast("Nessuno dei selezionati era negli acquisti", "fa-info-circle");
  }
}

function clearAcquisti() {
  if (acquisti.length === 0) return;
  if (confirm("Sei sicuro di voler svuotare gli acquisti?")) {
    acquisti = [];
    saveAcquisti();
    refreshAfterAcquistiChange();
    showToast("Acquisti svuotati!", "fa-trash");
  }
}

// ---------- PREZZO PER GIOCATORE ----------
