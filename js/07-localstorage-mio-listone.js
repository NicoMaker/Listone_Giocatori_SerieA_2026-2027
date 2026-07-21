// ============================================================
//  LOCALSTORAGE — load/save Mio Listone
// ============================================================

// ============================================================
//  LOCALSTORAGE
// ============================================================
function loadMioListone() {
  try {
    const saved = localStorage.getItem("mioListone");
    if (saved) {
      mioListone = JSON.parse(saved);
      setTimeout(aggiornaInfoSalvataggio, 100);
    }
  } catch (e) {
    mioListone = [];
  }
}

function saveMioListone() {
  localStorage.setItem("mioListone", JSON.stringify(mioListone));
  localStorage.setItem("mioListone_lastSave", String(Date.now()));
  aggiornaContatori();
  aggiornaInfoSalvataggio();
}

