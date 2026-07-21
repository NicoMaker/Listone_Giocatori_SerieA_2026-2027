// ============================================================
//  SALVATAGGIO — indicatore 'ultimo salvataggio'
// ============================================================

// ============================================================
//  SALVATAGGIO
// ============================================================
function aggiornaInfoSalvataggio() {
  const info = document.getElementById("salvataggioInfo");
  const span = document.getElementById("ultimoSalvataggio");
  if (!info || !span) return;

  const lastSave = localStorage.getItem("mioListone_lastSave");
  if (lastSave) {
    const date = new Date(parseInt(lastSave));
    const now = new Date();
    const diffMs = now - date;
    const diffMin = Math.floor(diffMs / 60000);
    const diffHour = Math.floor(diffMs / 3600000);
    const diffDay = Math.floor(diffMs / 86400000);

    let label = "";
    if (diffMin < 1) label = "Ora";
    else if (diffMin < 60) label = `${diffMin} min fa`;
    else if (diffHour < 24) label = `${diffHour} h fa`;
    else if (diffDay < 7) label = `${diffDay} g fa`;
    else label = date.toLocaleDateString("it-IT");

    span.textContent = `Salvato ${label}`;
    info.style.display = "flex";
  } else {
    span.textContent = "Non salvato";
    info.style.display = "flex";
  }
}

