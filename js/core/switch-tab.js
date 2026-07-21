// ============================================================
//  SWITCH TAB — cambio schede Listone/Mio/Acquisti
// ============================================================

// ============================================================
//  SWITCH TAB
// ============================================================
const TAB_STORAGE_KEY = "listoneTabAttivo";

// Legge da localStorage l'ultima sezione aperta. Se non c'è nulla
// salvato (prima visita in assoluto) o localStorage non è
// disponibile, non ritorna nulla e resta valido il default "listone".
function getTabSalvato() {
  try {
    return localStorage.getItem(TAB_STORAGE_KEY);
  } catch (e) {
    return null;
  }
}

function salvaTabAttivo(tab) {
  try {
    localStorage.setItem(TAB_STORAGE_KEY, tab);
  } catch (e) {
    // localStorage non disponibile (es. modalità privata): nessun problema,
    // semplicemente non si ricorderà la sezione al prossimo avvio.
  }
}

function switchTab(tab, opts = {}) {
  const { skipSave = false, skipScroll = false } = opts;
  document
    .querySelectorAll(".btn-tab")
    .forEach((b) => b.classList.remove("active"));

  const panelListone = document.getElementById("panelListone");
  const panelMio = document.getElementById("panelMio");
  const panelAcquisti = document.getElementById("panelAcquisti");
  const tbListone = document.getElementById("toolbarListone");
  const tbMio = document.getElementById("toolbarMio");
  const tbAcquisti = document.getElementById("toolbarAcquisti");

  [panelListone, panelMio, panelAcquisti].forEach(
    (p) => p && p.classList.add("hidden"),
  );
  [tbListone, tbMio, tbAcquisti].forEach((t) => t && t.classList.add("hidden"));

  if (tab === "acquisti") {
    document.getElementById("tabAcquisti").classList.add("active");
    panelAcquisti.classList.remove("hidden");
    if (tbAcquisti) tbAcquisti.classList.remove("hidden");
    renderAcquisti();
  } else if (tab === "mio") {
    document.getElementById("tabMio").classList.add("active");
    panelMio.classList.remove("hidden");
    if (tbMio) tbMio.classList.remove("hidden");
    renderMioListone();
  } else {
    document.getElementById("tabListone").classList.add("active");
    panelListone.classList.remove("hidden");
    if (tbListone) tbListone.classList.remove("hidden");
  }
  requestAnimationFrame(updateTabSlider);
  if (!skipScroll) scrollToMain();
  if (!skipSave) salvaTabAttivo(tab);
}
