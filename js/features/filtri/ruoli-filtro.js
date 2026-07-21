// ============================================================
//  RUOLI — gestione filtro multiplo per ruolo
// ============================================================

// ============================================================
//  RUOLI (gestione multipla)
// ============================================================
function toggleRuolo(btn) {
  const ruolo = btn.dataset.ruolo;
  const container = document.getElementById("ruoloBtns");
  const allBtn = container.querySelector('[data-ruolo="all"]');
  const btns = container.querySelectorAll(".btn-ruolo");

  if (ruolo === "all") {
    filtriRuoli = [];
    btns.forEach((b) => b.classList.remove("active"));
    allBtn.classList.add("active");
    applyFilters();
    return;
  }

  if (filtriRuoli.length === 0) {
    allBtn.classList.remove("active");
  }

  const index = filtriRuoli.indexOf(ruolo);
  if (index > -1) {
    filtriRuoli.splice(index, 1);
    btn.classList.remove("active");
  } else {
    filtriRuoli.push(ruolo);
    btn.classList.add("active");
  }

  if (filtriRuoli.length === 0) {
    allBtn.classList.add("active");
  }

  applyFilters();
}

function toggleRuoloMio(btn) {
  const ruolo = btn.dataset.ruolo;
  const container = document.getElementById("ruoloBtnsMio");
  const allBtn = container.querySelector('[data-ruolo="all"]');
  const btns = container.querySelectorAll(".btn-ruolo");

  if (ruolo === "all") {
    filtriRuoliMio = [];
    btns.forEach((b) => b.classList.remove("active"));
    allBtn.classList.add("active");
    renderMioListone();
    return;
  }

  if (filtriRuoliMio.length === 0) {
    allBtn.classList.remove("active");
  }

  const index = filtriRuoliMio.indexOf(ruolo);
  if (index > -1) {
    filtriRuoliMio.splice(index, 1);
    btn.classList.remove("active");
  } else {
    filtriRuoliMio.push(ruolo);
    btn.classList.add("active");
  }

  if (filtriRuoliMio.length === 0) {
    allBtn.classList.add("active");
  }
  renderMioListone();
}
