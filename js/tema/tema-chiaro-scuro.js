// ============================================================
//  TEMA CHIARO / SCURO — gestione toggle e persistenza tema
// ============================================================

// ============================================================
//  TEMA CHIARO / SCURO
// ============================================================
function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("listoneTheme", theme);
  const icon = document.getElementById("themeToggleIcon");
  if (icon) {
    icon.className = theme === "light" ? "fas fa-moon" : "fas fa-sun";
    icon.classList.add("spin-swap");
    setTimeout(() => icon.classList.remove("spin-swap"), 500);
  }
  const label = document.getElementById("themeToggleLabel");
  if (label) {
    label.textContent = theme === "light" ? "Scuro" : "Chiaro";
  }
}

function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme") || "dark";
  applyTheme(current === "dark" ? "light" : "dark");
}

function initTheme() {
  const saved = localStorage.getItem("listoneTheme");
  if (saved) {
    applyTheme(saved);
  } else {
    const prefersLight = window.matchMedia(
      "(prefers-color-scheme: light)",
    ).matches;
    applyTheme(prefersLight ? "light" : "dark");
  }
}

let serieAData = null;
let squadre = [];
let mioListone = [];
let filtriRuoli = [];
let filtriRuoliMio = [];
let filtroSquadraMio = "all";
let squadreSelezionate = new Set();
let vistaCorrente = "card";
let mioVistaCorrente = "ruolo";
let vistaSingolaCorrente = "griglia";
let searchTerm = "";
let singolaSquadraSelezionata = null;

