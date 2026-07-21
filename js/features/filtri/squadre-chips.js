// ============================================================
//  SQUADRE CHIPS — gestione selezione multipla squadre
// ============================================================

// ============================================================
//  SQUADRE CHIPS (gestione multipla)
// ============================================================
function populateSquadreChips(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = "";
  squadre.forEach((s) => {
    const chip = document.createElement("button");
    chip.className = "chip-squadra";
    chip.dataset.id = s.id;
    chip.innerHTML = `
      ${s.logo_url ? `<img src="${s.logo_url}" alt="${s.nome}" loading="lazy" onerror="this.style.display='none'" />` : ""}
      <span>${s.nome}</span>
    `;
    if (containerId === "squadreChips") {
      chip.onclick = () => toggleSquadraChip(chip);
    } else if (containerId === "acquistiSquadreChipsList") {
      chip.onclick = () => toggleAcquistiSquadraChip(chip);
    } else {
      chip.onclick = () => toggleMioSquadraChip(chip);
    }
    container.appendChild(chip);
  });
}

function toggleSquadraChip(chip) {
  const id = chip.dataset.id;
  const allChip = document.querySelector(
    '#squadreChips .chip-squadra[data-id="all"]',
  );

  if (id === "all") {
    if (squadreSelezionate.size === 0) {
      squadreSelezionate.clear();
    } else {
      squadreSelezionate.clear();
    }
    document
      .querySelectorAll("#squadreChips .chip-squadra")
      .forEach((c) => c.classList.remove("active"));
    if (allChip) allChip.classList.add("active");
    singolaSquadraSelezionata = null;
    document.getElementById("vistaSingolaSquadra").classList.add("hidden");
    document.getElementById("vistaCardContainer").classList.remove("hidden");
    document.getElementById("vistaTabContainer").classList.remove("hidden");
    applyFilters();
    return;
  }

  if (squadreSelezionate.size === 0) {
    if (allChip) allChip.classList.remove("active");
  }

  const idNum = Number(id);
  if (squadreSelezionate.has(idNum)) {
    squadreSelezionate.delete(idNum);
    chip.classList.remove("active");
  } else {
    squadreSelezionate.add(idNum);
    chip.classList.add("active");
  }

  if (squadreSelezionate.size === 0) {
    if (allChip) allChip.classList.add("active");
  }

  singolaSquadraSelezionata = null;
  document.getElementById("vistaSingolaSquadra").classList.add("hidden");
  document.getElementById("vistaCardContainer").classList.remove("hidden");
  document.getElementById("vistaTabContainer").classList.remove("hidden");
  applyFilters();
}

function toggleMioSquadraChip(chip) {
  const id = chip.dataset.id;
  const allChip = document.querySelector(
    '#mioSquadreChipsList .chip-squadra[data-id="all"]',
  );

  if (typeof window.mioSquadreSelezionate === "undefined") {
    window.mioSquadreSelezionate = new Set();
  }
  const set = window.mioSquadreSelezionate;
  if (id === "all") {
    set.clear();
    document
      .querySelectorAll("#mioSquadreChipsList .chip-squadra")
      .forEach((c) => c.classList.remove("active"));
    if (allChip) allChip.classList.add("active");
    filtroSquadraMio = "all";
    renderMioListone();
    return;
  }
  if (set.size === 0 && allChip) {
    allChip.classList.remove("active");
  }
  const idNum = Number(id);
  if (set.has(idNum)) {
    set.delete(idNum);
    chip.classList.remove("active");
  } else {
    set.add(idNum);
    chip.classList.add("active");
  }
  if (set.size === 0 && allChip) {
    allChip.classList.add("active");
    filtroSquadraMio = "all";
  } else {
    filtroSquadraMio = "multiple";
  }
  renderMioListone();
}
