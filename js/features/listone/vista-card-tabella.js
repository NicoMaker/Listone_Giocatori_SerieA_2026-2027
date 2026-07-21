// ============================================================
//  VISTA (card/tabella) — switch vista listone e mio listone
// ============================================================

// ============================================================
//  VISTA (card/tabella)
// ============================================================
function setVista(vista, btn) {
  vistaCorrente = vista;
  document
    .querySelectorAll(".btn-vista")
    .forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  applyFilters();
}

function setMioVista(vista, btn) {
  mioVistaCorrente = vista;
  const panel = document.getElementById("panelMio");
  (panel || document)
    .querySelectorAll(".btn-vista-mio")
    .forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  renderMioListone();
}
