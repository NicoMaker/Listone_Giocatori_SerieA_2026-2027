// ============================================================
//  VISTA SINGOLA SQUADRA — toggle griglia/lista
// ============================================================

// ============================================================
//  VISTA SINGOLA SQUADRA
// ============================================================
function setVistaSingola(vista, btn) {
  vistaSingolaCorrente = vista;
  document
    .querySelectorAll(".btn-vista-singola")
    .forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  if (singolaSquadraSelezionata) {
    renderSingolaSquadra(singolaSquadraSelezionata);
  }
}
