// ============================================================
//  FILTRI ACQUISTI — ruolo, squadra, vista
// ============================================================

function toggleRuoloAcquisti(btn) {
  const ruolo = btn.dataset.ruolo;
  const container = document.getElementById("ruoloBtnsAcquisti");
  const allBtn = container.querySelector('[data-ruolo="all"]');
  const btns = container.querySelectorAll(".btn-ruolo");

  if (ruolo === "all") {
    filtriRuoliAcquisti = [];
    btns.forEach((b) => b.classList.remove("active"));
    allBtn.classList.add("active");
    renderAcquisti();
    return;
  }
  if (filtriRuoliAcquisti.length === 0) allBtn.classList.remove("active");
  const i = filtriRuoliAcquisti.indexOf(ruolo);
  if (i > -1) {
    filtriRuoliAcquisti.splice(i, 1);
    btn.classList.remove("active");
  } else {
    filtriRuoliAcquisti.push(ruolo);
    btn.classList.add("active");
  }
  if (filtriRuoliAcquisti.length === 0) allBtn.classList.add("active");
  renderAcquisti();
}

function toggleAcquistiSquadraChip(chip) {
  const id = chip.dataset.id;
  const allChip = document.querySelector(
    '#acquistiSquadreChips .chip-squadra[data-id="all"]',
  );
  if (typeof window.acquistiSquadreSelezionate === "undefined") {
    window.acquistiSquadreSelezionate = new Set();
  }
  const set = window.acquistiSquadreSelezionate;

  if (id === "all") {
    set.clear();
    document
      .querySelectorAll("#acquistiSquadreChipsList .chip-squadra")
      .forEach((c) => c.classList.remove("active"));
    if (allChip) allChip.classList.add("active");
    renderAcquisti();
    return;
  }
  if (set.size === 0 && allChip) allChip.classList.remove("active");
  const idNum = Number(id);
  if (set.has(idNum)) {
    set.delete(idNum);
    chip.classList.remove("active");
  } else {
    set.add(idNum);
    chip.classList.add("active");
  }
  if (set.size === 0 && allChip) allChip.classList.add("active");
  renderAcquisti();
}

// ---------- VISTA ACQUISTI (per ruolo / per squadra) ----------
function setAcquistiVista(vista, btn) {
  acquistiVistaCorrente = vista;
  const panel = document.getElementById("panelAcquisti");
  (panel || document)
    .querySelectorAll(".btn-vista-mio")
    .forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  renderAcquisti();
}

// ---------- SELEZIONA TUTTI GLI ACQUISTI ----------
function selectAllAcquisti() {
  const grid = document.getElementById("acquistiGrid");
  const n = selectCheckboxesIn(grid);
  if (n === 0) {
    showToast(
      "Nessun giocatore da selezionare negli acquisti",
      "fa-info-circle",
    );
    return;
  }
  showToast(`Selezionati ${n} acquisti`, "fa-check-double");
}

// ---------- RENDER ACQUISTI ----------
