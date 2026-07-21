// ============================================================
//  ESPORTA / IMPORTA — acquisti e 'tutto' (mio listone + acquisti)
// ============================================================

// ============================================================
//  ESPORTA / IMPORTA · acquisti e "tutto"
// ============================================================
function dateStamp() {
  return new Date().toISOString().slice(0, 10);
}
function downloadJSON(obj, filename) {
  const blob = new Blob([JSON.stringify(obj, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
function readJSONFile(event, handler) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      handler(JSON.parse(e.target.result));
    } catch (err) {
      showToast("Errore: file non valido.", "fa-exclamation-triangle");
      console.error("Import error:", err);
    }
  };
  reader.readAsText(file);
  event.target.value = "";
}
function normalizeAcquisto(a) {
  let p;
  if (a.prezzo !== undefined && a.prezzo !== null && a.prezzo !== "") {
    p = clampPrezzo(a.prezzo);
  } else {
    p = clampPrezzo(a.quotazione != null ? a.quotazione : 1) || 1;
  }
  return {
    nome: a.nome,
    squadra: a.squadra,
    ruolo: a.ruolo,
    logo_url: a.logo_url,
    quotazione: a.quotazione,
    prezzo: p,
  };
}

function esportaAcquisti() {
  if (acquisti.length === 0) {
    showToast("Nessun acquisto da esportare.", "fa-exclamation-circle");
    return;
  }
  downloadJSON(
    {
      exportDate: new Date().toISOString(),
      version: "1.0",
      tipo: "acquisti",
      budget: acquistiBudget,
      speso: totaleSpeso(),
      giocatori: acquisti,
    },
    `acquisti-${dateStamp()}.json`,
  );
  showToast("Acquisti esportati con successo!", "fa-download");
}

function importaAcquisti(event) {
  readJSONFile(event, (data) => {
    let giocatori = [];
    if (data.tipo === "completo" && Array.isArray(data.acquisti)) {
      giocatori = data.acquisti;
    } else if (Array.isArray(data.giocatori)) {
      giocatori = data.giocatori;
    } else if (Array.isArray(data.acquisti)) {
      giocatori = data.acquisti;
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
        `Vuoi importare ${giocatori.length} acquisti? Sostituirà gli acquisti attuali.`,
      )
    )
      return;
    acquisti = giocatori.map(normalizeAcquisto);
    if (typeof data.budget === "number")
      acquistiBudget = clampBudget(data.budget);
    saveAcquisti();
    syncBudgetInput();
    refreshAfterAcquistiChange();
    showToast(`Importati ${giocatori.length} acquisti!`, "fa-upload");
  });
}

function esportaTutto() {
  if (mioListone.length === 0 && acquisti.length === 0) {
    showToast("Niente da esportare: tutto vuoto.", "fa-exclamation-circle");
    return;
  }
  downloadJSON(
    {
      exportDate: new Date().toISOString(),
      version: "1.0",
      tipo: "completo",
      budget: acquistiBudget,
      speso: totaleSpeso(),
      mioListone: mioListone,
      acquisti: acquisti,
    },
    `listone-completo-${dateStamp()}.json`,
  );
  showToast("Tutto esportato: mio listone + acquisti!", "fa-cloud-arrow-down");
}

function importaTutto(event) {
  readJSONFile(event, (data) => {
    const hasMio = Array.isArray(data.mioListone);
    const hasAcq = Array.isArray(data.acquisti);

    if (data.tipo === "completo" || hasMio || hasAcq) {
      const nMio = hasMio ? data.mioListone.length : 0;
      const nAcq = hasAcq ? data.acquisti.length : 0;
      if (
        !confirm(
          `Importare tutto? ${nMio} nel mio listone e ${nAcq} acquisti. Sostituirà i dati attuali.`,
        )
      )
        return;
      if (hasMio) {
        mioListone = data.mioListone;
        saveMioListone();
      }
      if (hasAcq) acquisti = data.acquisti.map(normalizeAcquisto);
      if (typeof data.budget === "number")
        acquistiBudget = clampBudget(data.budget);
      saveAcquisti();
      syncBudgetInput();
      refreshAfterAcquistiChange();
      showToast(
        `Importati ${nMio} nel listone e ${nAcq} acquisti!`,
        "fa-cloud-arrow-up",
      );
      return;
    }

    // fallback: file "mio listone" semplice (solo giocatori)
    let giocatori = Array.isArray(data.giocatori)
      ? data.giocatori
      : Array.isArray(data)
        ? data
        : null;
    if (!giocatori) throw new Error("Formato non valido");
    if (giocatori.length === 0) {
      showToast("Nessun giocatore da importare.", "fa-exclamation-circle");
      return;
    }
    if (
      !confirm(
        `Il file contiene solo un listone (${giocatori.length} giocatori). Importarlo nel Mio Listone?`,
      )
    )
      return;
    mioListone = giocatori;
    saveMioListone();
    refreshAfterAcquistiChange();
    showToast(`Importati ${giocatori.length} giocatori!`, "fa-upload");
  });
}

(function () {
  var saved = localStorage.getItem("listoneTheme");
  var theme =
    saved ||
    (window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark");
  document.documentElement.setAttribute("data-theme", theme);
})();
