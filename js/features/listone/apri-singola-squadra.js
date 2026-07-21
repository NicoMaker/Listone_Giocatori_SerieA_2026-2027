// ============================================================
//  APRI SINGOLA SQUADRA
// ============================================================

// ============================================================
//  APRI SINGOLA SQUADRA
// ============================================================
function apriSingolaSquadra(id) {
  singolaSquadraSelezionata = id;
  document.getElementById("vistaCardContainer").classList.add("hidden");
  document.getElementById("vistaTabContainer").classList.add("hidden");
  document.getElementById("vistaSingolaSquadra").classList.remove("hidden");

  document.querySelectorAll("#squadreChips .chip-squadra").forEach((c) => {
    c.classList.toggle("active", String(c.dataset.id) === String(id));
  });
  const allChip = document.querySelector(
    '#squadreChips .chip-squadra[data-id="all"]',
  );
  if (allChip) allChip.classList.remove("active");

  renderSingolaSquadra(id);
  scrollToMain();
}

