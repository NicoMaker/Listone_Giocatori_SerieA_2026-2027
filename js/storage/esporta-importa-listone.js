// ============================================================
//  ESPORTA / IMPORTA — Mio Listone in JSON
// ============================================================

// ============================================================
//  ESPORTA / IMPORTA
// ============================================================
function esportaListone() {
  if (mioListone.length === 0) {
    showToast(
      "Il listone è vuoto! Niente da esportare.",
      "fa-exclamation-circle",
    );
    return;
  }
  const data = {
    exportDate: new Date().toISOString(),
    version: "1.0",
    giocatori: mioListone,
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `mio-listone-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast("Listone esportato con successo!", "fa-download");
}

function importaListone(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const data = JSON.parse(e.target.result);
      let giocatori = [];
      if (data.giocatori && Array.isArray(data.giocatori)) {
        giocatori = data.giocatori;
      } else if (Array.isArray(data)) {
        giocatori = data;
      } else {
        throw new Error("Formato non valido");
      }
      if (giocatori.length === 0) {
        showToast("Nessun giocatore da importare.", "fa-exclamation-circle");
        return;
      }
      if (
        !confirm(
          `Vuoi importare ${giocatori.length} giocatori? Sostituirà il tuo listone attuale.`,
        )
      )
        return;
      mioListone = giocatori;
      saveMioListone();
      if (singolaSquadraSelezionata) {
        renderSingolaSquadra(singolaSquadraSelezionata);
      } else {
        applyFilters();
      }
      renderMioListone();
      aggiornaContatori();
      showToast(`Importati ${giocatori.length} giocatori!`, "fa-upload");
    } catch (error) {
      showToast("Errore: file non valido.", "fa-exclamation-triangle");
      console.error("Import error:", error);
    }
  };
  reader.readAsText(file);
  event.target.value = "";
}

