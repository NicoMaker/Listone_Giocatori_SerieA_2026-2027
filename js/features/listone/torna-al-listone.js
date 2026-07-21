// ============================================================
//  TORNA AL LISTONE
// ============================================================

// ============================================================
//  TORNA AL LISTONE
// ============================================================
function tornaAlListone() {
  singolaSquadraSelezionata = null;
  document.getElementById("vistaSingolaSquadra").classList.add("hidden");
  document
    .querySelectorAll("#squadreChips .chip-squadra")
    .forEach((c) => c.classList.remove("active"));
  const allChip = document.querySelector(
    '#squadreChips .chip-squadra[data-id="all"]',
  );
  if (allChip) allChip.classList.add("active");
  squadreSelezionate.clear();
  if (vistaCorrente === "card") {
    document.getElementById("vistaCardContainer").classList.remove("hidden");
  } else {
    document.getElementById("vistaTabContainer").classList.remove("hidden");
  }
  applyFilters();
  scrollToMain();
}
