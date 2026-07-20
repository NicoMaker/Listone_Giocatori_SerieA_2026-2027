// ============================================================
//  APP LOGICA · CARICAMENTO DATA.JSON + RENDER + FILTRI + SELEZIONE MULTIPLA
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

// ===== SELEZIONE MULTIPLA =====
let selectedPlayers = new Map();

function getPlayerId(nome, squadra) {
  return `${nome}_${squadra}`;
}

function togglePlayerSelection(id, player, checkbox) {
  if (checkbox && !checkbox.checked) {
    selectedPlayers.delete(id);
  } else {
    selectedPlayers.set(id, player);
  }
  updateSelectionUI();
}

function updateSelectionUI() {
  const count = selectedPlayers.size;
  const addBtn = document.getElementById("addSelectedBtn");
  const removeBtn = document.getElementById("removeSelectedBtn");
  const countSpan = document.getElementById("selectedCount");
  const countSpanMio = document.getElementById("selectedCountMio");

  if (addBtn) addBtn.disabled = count === 0;
  if (removeBtn) removeBtn.disabled = count === 0;
  if (countSpan) countSpan.textContent = count;
  if (countSpanMio) countSpanMio.textContent = count;

  const allCheck = document.getElementById("selectAllTable");
  if (allCheck) {
    const visibleCheckboxes = document.querySelectorAll(
      ".player-checkbox:not(.hidden)",
    );
    const checked = document.querySelectorAll(
      ".player-checkbox:not(.hidden):checked",
    );
    if (
      visibleCheckboxes.length > 0 &&
      checked.length === visibleCheckboxes.length
    ) {
      allCheck.checked = true;
    } else {
      allCheck.checked = false;
    }
  }
}

function clearSelection() {
  selectedPlayers.clear();
  document
    .querySelectorAll(".player-checkbox")
    .forEach((cb) => (cb.checked = false));
  updateSelectionUI();
}

function selectAllVisible() {
  const checkboxes = document.querySelectorAll(".player-checkbox:not(.hidden)");
  if (checkboxes.length === 0) {
    showToast("Nessun giocatore visibile da selezionare", "fa-info-circle");
    return;
  }
  checkboxes.forEach((cb) => {
    cb.checked = true;
    const id = cb.dataset.id;
    const player = cb.dataset.player ? JSON.parse(cb.dataset.player) : null;
    if (player) {
      selectedPlayers.set(id, player);
    }
  });
  updateSelectionUI();
  showToast(`Selezionati ${checkboxes.length} giocatori`, "fa-check-double");
}

// ===== SELEZIONE NEL "MIO LISTONE" =====
// Seleziona tutte le checkbox contenute in un elemento (sezione o pannello).
function selectCheckboxesIn(container) {
  if (!container) return 0;
  const checkboxes = container.querySelectorAll(".player-checkbox");
  let n = 0;
  checkboxes.forEach((cb) => {
    cb.checked = true;
    const id = cb.dataset.id;
    const player = cb.dataset.player ? JSON.parse(cb.dataset.player) : null;
    if (player) {
      selectedPlayers.set(id, player);
      n++;
    }
  });
  updateSelectionUI();
  return n;
}

// Seleziona TUTTI i giocatori presenti nel Mio Listone (solo quelli visibili
// con i filtri correnti).
function selectAllMio() {
  const grid = document.getElementById("mioListoneGrid");
  const n = selectCheckboxesIn(grid);
  if (n === 0) {
    showToast("Nessun giocatore da selezionare nel tuo listone", "fa-info-circle");
    return;
  }
  showToast(`Selezionati ${n} giocatori del tuo listone`, "fa-check-double");
}

// Seleziona tutti i giocatori di una sezione del Mio Listone
// (un ruolo intero in vista "Per Ruolo", una squadra intera in vista "Per Squadra").
function selectMioSection(btn) {
  const section = btn.closest(".mio-ruolo-section, .mio-squadra-section");
  if (!section) return;
  const n = selectCheckboxesIn(section);
  const label = section.querySelector(".mio-section-label");
  const nome = label ? label.textContent.trim() : "";
  showToast(
    n ? `Selezionati ${n} giocatori${nome ? " · " + nome : ""}` : "Nessun giocatore da selezionare",
    n ? "fa-check-double" : "fa-info-circle",
  );
}

// ===== SELEZIONA TUTTI I GIOCATORI DI UNA SQUADRA (dalla card) =====
function selectAllSquadra(squadraId) {
  const squadra = squadre.find((s) => s.id === squadraId);
  if (!squadra) return;
  const checkboxes = document.querySelectorAll(
    `.card-squadra[data-squadra-id="${squadraId}"] .player-checkbox, .card-squadra[data-squadra-id="${squadraId}"] .player-checkbox`,
  );
  // Se non ci sono checkbox nella card (vista tabella), cerchiamo nella tabella
  let checkboxesToUse =
    checkboxes.length > 0
      ? checkboxes
      : document.querySelectorAll(
          `#tableBody .player-checkbox[data-squadra="${squadra.nome}"]`,
        );
  if (checkboxesToUse.length === 0) {
    showToast(
      `Nessun giocatore visibile per ${squadra.nome}`,
      "fa-info-circle",
    );
    return;
  }
  checkboxesToUse.forEach((cb) => {
    cb.checked = true;
    const id = cb.dataset.id;
    const player = cb.dataset.player ? JSON.parse(cb.dataset.player) : null;
    if (player) {
      selectedPlayers.set(id, player);
    }
  });
  updateSelectionUI();
  showToast(
    `Selezionati tutti i giocatori di ${squadra.nome}`,
    "fa-check-double",
  );
}

function toggleSelectAllTable(master) {
  const checkboxes = document.querySelectorAll("#tableBody .player-checkbox");
  checkboxes.forEach((cb) => {
    cb.checked = master.checked;
    const id = cb.dataset.id;
    const player = cb.dataset.player ? JSON.parse(cb.dataset.player) : null;
    if (master.checked) {
      if (player) selectedPlayers.set(id, player);
    } else {
      selectedPlayers.delete(id);
    }
  });
  updateSelectionUI();
}

function addSelectedToMio() {
  if (selectedPlayers.size === 0) return;
  let added = 0;
  for (let [id, player] of selectedPlayers) {
    if (
      !mioListone.some(
        (m) => m.nome === player.nome && m.squadra === player.squadra,
      )
    ) {
      mioListone.push({ ...player });
      added++;
    }
  }
  if (added > 0) {
    saveMioListone();
    if (singolaSquadraSelezionata) {
      renderSingolaSquadra(singolaSquadraSelezionata);
    } else {
      applyFilters();
    }
    renderMioListone();
    aggiornaContatori();
    showToast(`Aggiunti ${added} giocatori al listone!`, "fa-plus-circle");
    clearSelection();
  } else {
    showToast("I giocatori selezionati sono già nel listone", "fa-info-circle");
  }
}

function removeSelectedFromMio() {
  if (selectedPlayers.size === 0) return;
  if (!confirm(`Rimuovere ${selectedPlayers.size} giocatori dal listone?`))
    return;
  let removed = 0;
  for (let [id, player] of selectedPlayers) {
    const index = mioListone.findIndex(
      (m) => m.nome === player.nome && m.squadra === player.squadra,
    );
    if (index > -1) {
      mioListone.splice(index, 1);
      removed++;
    }
  }
  if (removed > 0) {
    saveMioListone();
    if (singolaSquadraSelezionata) {
      renderSingolaSquadra(singolaSquadraSelezionata);
    } else {
      applyFilters();
    }
    renderMioListone();
    aggiornaContatori();
    showToast(`Rimossi ${removed} giocatori dal listone`, "fa-trash");
    clearSelection();
  } else {
    showToast("Nessuno dei selezionati era nel listone", "fa-info-circle");
  }
}

// ============================================================
//  TOAST
// ============================================================
function showToast(message, icon = "fa-check-circle") {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<i class="fas ${icon}"></i> ${message}`;
  toast.classList.add("show");
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => toast.classList.remove("show"), 3000);
}

// ============================================================
//  SALVATAGGIO
// ============================================================
function aggiornaInfoSalvataggio() {
  const info = document.getElementById("salvataggioInfo");
  const span = document.getElementById("ultimoSalvataggio");
  if (!info || !span) return;

  const lastSave = localStorage.getItem("mioListone_lastSave");
  if (lastSave) {
    const date = new Date(parseInt(lastSave));
    const now = new Date();
    const diffMs = now - date;
    const diffMin = Math.floor(diffMs / 60000);
    const diffHour = Math.floor(diffMs / 3600000);
    const diffDay = Math.floor(diffMs / 86400000);

    let label = "";
    if (diffMin < 1) label = "Ora";
    else if (diffMin < 60) label = `${diffMin} min fa`;
    else if (diffHour < 24) label = `${diffHour} h fa`;
    else if (diffDay < 7) label = `${diffDay} g fa`;
    else label = date.toLocaleDateString("it-IT");

    span.textContent = `Salvato ${label}`;
    info.style.display = "flex";
  } else {
    span.textContent = "Non salvato";
    info.style.display = "flex";
  }
}

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

// ============================================================
//  ESPORTA / IMPORTA
// ============================================================
function esportaListone() {
  if (mioListone.length === 0) {
    showToast(
      "Il listone è vuoto! Niente da esportare.",
      "fa-exclamation-circle",
    );
    return;
  }
  const data = {
    exportDate: new Date().toISOString(),
    version: "1.0",
    giocatori: mioListone,
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `mio-listone-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast("Listone esportato con successo!", "fa-download");
}

function importaListone(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const data = JSON.parse(e.target.result);
      let giocatori = [];
      if (data.giocatori && Array.isArray(data.giocatori)) {
        giocatori = data.giocatori;
      } else if (Array.isArray(data)) {
        giocatori = data;
      } else {
        throw new Error("Formato non valido");
      }
      if (giocatori.length === 0) {
        showToast("Nessun giocatore da importare.", "fa-exclamation-circle");
        return;
      }
      if (
        !confirm(
          `Vuoi importare ${giocatori.length} giocatori? Sostituirà il tuo listone attuale.`,
        )
      )
        return;
      mioListone = giocatori;
      saveMioListone();
      if (singolaSquadraSelezionata) {
        renderSingolaSquadra(singolaSquadraSelezionata);
      } else {
        applyFilters();
      }
      renderMioListone();
      aggiornaContatori();
      showToast(`Importati ${giocatori.length} giocatori!`, "fa-upload");
    } catch (error) {
      showToast("Errore: file non valido.", "fa-exclamation-triangle");
      console.error("Import error:", error);
    }
  };
  reader.readAsText(file);
  event.target.value = "";
}

// ============================================================
//  CARICAMENTO DATI
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  loadMioListone();
  loadData();
});

// ============================================================
//  FALLBACK LOGHI SQUADRE (link principale -> Wikipedia -> iniziale)
//  I loghi usano i link della squadra dal file dati; se un link
//  non carica, si prova automaticamente il fallback Wikipedia e,
//  se anche quello fallisce, la logica inline mostra l'iniziale.
// ============================================================
let logoFallbacks = {};
let logoFallbackReady = false;

function setupLogoFallback() {
  logoFallbacks = {};
  squadre.forEach((s) => {
    if (s.logo_fallback) logoFallbacks[s.nome] = s.logo_fallback;
  });
  if (logoFallbackReady) return;
  logoFallbackReady = true;
  // Ascolto in fase di cattura: gli eventi "error" delle immagini non
  // fanno bubbling, ma vengono comunque intercettati in cattura.
  document.addEventListener(
    "error",
    function (e) {
      const img = e.target;
      if (!(img instanceof HTMLImageElement)) return;
      if (img.dataset.logoRetried === "1") return; // già ritentato -> lascia il fallback inline
      const fb = logoFallbacks[img.alt];
      if (fb && img.getAttribute("src") !== fb) {
        img.dataset.logoRetried = "1";
        e.stopImmediatePropagation(); // blocca l'onerror inline in questo giro
        img.src = fb;
      }
    },
    true,
  );
}

async function loadData() {
  const loading = document.getElementById("loading");
  try {
    const response = await fetch("data.json");
    if (!response.ok) throw new Error("Errore nel caricamento dei dati");
    const data = await response.json();
    serieAData = data;
    squadre = data.squadre;
    setupLogoFallback();
    loading.classList.add("hidden");
    init();
  } catch (error) {
    console.error("Errore:", error);
    loading.innerHTML = `
      <i class="fas fa-exclamation-triangle" style="font-size: 2.5rem; color: #ef4444;"></i>
      <p style="margin-top: 1rem; color: #dc2626; font-weight: 600;">Impossibile caricare data.json</p>
      <p style="font-size: 0.9rem; color: var(--text-3);">Verifica che il file sia nella stessa cartella</p>
    `;
  }
}

function init() {
  populateSquadreChips("squadreChips");
  populateSquadreChips("mioSquadreChipsList");
  applyFilters();
  renderMioListone();
  aggiornaContatori();
  aggiornaInfoSalvataggio();
  document.getElementById("panelListone").classList.remove("hidden");
}

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

// ============================================================
//  RENDER SINGOLA SQUADRA (con filtri ruoli multipli)
// ============================================================
function renderSingolaSquadra(id) {
  const squadra = squadre.find((s) => String(s.id) === String(id));
  if (!squadra) return;

  const searchInput = document.getElementById("searchInput");
  const searchTermLocal = searchInput
    ? searchInput.value.toLowerCase().trim()
    : "";

  let giocatoriFiltrati = squadra.giocatori;

  if (filtriRuoli.length > 0) {
    giocatoriFiltrati = giocatoriFiltrati.filter((g) =>
      filtriRuoli.includes(g.ruolo),
    );
  }

  if (searchTermLocal) {
    giocatoriFiltrati = giocatoriFiltrati.filter((g) =>
      g.nome.toLowerCase().includes(searchTermLocal),
    );
  }

  const info = document.getElementById("singolaSquadraInfo");
  info.innerHTML = `
    <div style="display:flex;align-items:center;gap:1.2rem;flex-wrap:wrap;width:100%;">
      <div>
        ${squadra.logo_url ? `<img src="${squadra.logo_url}" alt="${squadra.nome}" class="squadra-logo-grande" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'" />` : ""}
        <div class="squadra-logo-grande-fallback" style="${squadra.logo_url ? "display:none" : ""}">${squadra.nome.charAt(0)}</div>
      </div>
      <div class="squadra-dettaglio">
        <span class="mini-flag-it"><span></span><span></span><span></span></span>
        <h2>${squadra.nome}</h2>
        <div class="squadra-citta"><i class="fas fa-map-pin"></i> ${squadra.citta}</div>
        <div style="display:flex;gap:0.5rem;margin-top:0.3rem;flex-wrap:wrap;">
          ${squadra.colori.map((c) => `<span style="display:inline-block;width:20px;height:20px;border-radius:50%;background:${c};border:2px solid var(--border);"></span>`).join("")}
        </div>
      </div>
      <div class="squadra-count"><i class="fas fa-users"></i> ${giocatoriFiltrati.length} giocatori</div>
    </div>
  `;

  const containerGriglia = document.getElementById("singolaSquadraContent");
  const containerLista = document.getElementById("singolaSquadraLista");

  if (giocatoriFiltrati.length === 0) {
    containerGriglia.innerHTML = `<div class="empty-state" style="grid-column:1/-1;"><i class="fas fa-search"></i><p>Nessun giocatore trovato con questi filtri</p><small>Prova a modificare i filtri</small></div>`;
    containerLista.innerHTML = "";
    containerGriglia.classList.remove("hidden");
    containerLista.classList.add("hidden");
    return;
  }

  const ruoliMap = new Map();
  giocatoriFiltrati.forEach((g) => {
    if (!ruoliMap.has(g.ruolo)) ruoliMap.set(g.ruolo, []);
    ruoliMap.get(g.ruolo).push(g);
  });

  const ordineRuoli = ["Portiere", "Difensore", "Centrocampista", "Attaccante"];
  const iconMap = {
    Portiere: "🧤",
    Difensore: "🛡️",
    Centrocampista: "⚡",
    Attaccante: "⚽",
  };
  const ruoloClassMap = {
    Portiere: "por",
    Difensore: "dif",
    Centrocampista: "cen",
    Attaccante: "att",
  };

  // GRIGLIA
  let gridHtml = '<div class="singola-squadra-ruoli">';
  ordineRuoli.forEach((ruolo) => {
    const giocatori = ruoliMap.get(ruolo) || [];
    if (giocatori.length === 0) return;
    gridHtml += `
      <div class="ruolo-section">
        <div class="ruolo-label">${iconMap[ruolo] || ""} ${ruolo} (${giocatori.length})</div>
        <div class="lista-giocatori">
    `;
    giocatori.forEach((g) => {
      const isInMio = mioListone.some(
        (m) => m.nome === g.nome && m.squadra === squadra.nome,
      );
      const id = getPlayerId(g.nome, squadra.nome);
      const isSelected = selectedPlayers.has(id);
      const playerData = {
        nome: g.nome,
        squadra: squadra.nome,
        ruolo: g.ruolo,
        quotazione: g.quotazione,
        logo_url: squadra.logo_url,
      };
      gridHtml += `
        <span class="giocatore-tag ${isInMio ? "nel-listone" : ""}" style="display:inline-flex;align-items:center;gap:0.3rem;">
          <input type="checkbox" class="player-checkbox" data-id="${id}" data-player='${JSON.stringify(playerData)}' ${isSelected ? "checked" : ""} onchange="togglePlayerSelection('${id}', JSON.parse(this.dataset.player), this)" />
          <i class="fas fa-user"></i> ${g.nome}
          <span class="tag-num">${g.quotazione || "—"}</span>
          <span class="tag-add"></span>
        </span>
      `;
    });
    gridHtml += `</div></div>`;
  });
  gridHtml += "</div>";
  containerGriglia.innerHTML = gridHtml;

  // LISTA
  let listaHtml = '<div class="singola-lista-giocatori">';
  let index = 0;
  ordineRuoli.forEach((ruolo) => {
    const giocatori = ruoliMap.get(ruolo) || [];
    giocatori.forEach((g) => {
      index++;
      const isInMio = mioListone.some(
        (m) => m.nome === g.nome && m.squadra === squadra.nome,
      );
      const rClass = ruoloClassMap[g.ruolo] || "";
      const id = getPlayerId(g.nome, squadra.nome);
      const isSelected = selectedPlayers.has(id);
      const playerData = {
        nome: g.nome,
        squadra: squadra.nome,
        ruolo: g.ruolo,
        quotazione: g.quotazione,
        logo_url: squadra.logo_url,
      };
      listaHtml += `
        <div class="singola-riga-giocatore">
          <input type="checkbox" class="player-checkbox" data-id="${id}" data-player='${JSON.stringify(playerData)}' ${isSelected ? "checked" : ""} onchange="togglePlayerSelection('${id}', JSON.parse(this.dataset.player), this)" />
          <span class="riga-posizione">${index}</span>
          <span class="riga-nome"><i class="fas fa-user" style="color:var(--text-3);font-size:0.7rem;margin-right:0.3rem;"></i> ${g.nome}</span>
          <span class="riga-ruolo ${rClass}">${g.ruolo}</span>
          <span class="riga-quota">${g.quotazione || "—"}</span>
          <button class="riga-add ${isInMio ? "added" : ""}" onclick="toggleMioListone('${g.nome.replace(/'/g, "\\'")}', '${squadra.nome.replace(/'/g, "\\'")}', '${g.ruolo}', '${squadra.logo_url || ""}', ${g.quotazione || 0})" title="${isInMio ? "Rimuovi" : "Aggiungi"}">
            <i class="fas ${isInMio ? "fa-check" : "fa-plus"}"></i>
          </button>
        </div>
      `;
    });
  });
  listaHtml += "</div>";
  containerLista.innerHTML = listaHtml;

  if (vistaSingolaCorrente === "griglia") {
    containerGriglia.classList.remove("hidden");
    containerLista.classList.add("hidden");
  } else {
    containerGriglia.classList.add("hidden");
    containerLista.classList.remove("hidden");
  }
  updateSelectionUI();
}

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
}

// ============================================================
//  APPLICA FILTRI (multipli)
// ============================================================
function applyFilters() {
  if (singolaSquadraSelezionata) {
    renderSingolaSquadra(singolaSquadraSelezionata);
    return;
  }

  const searchInput = document.getElementById("searchInput");
  searchTerm = searchInput.value.toLowerCase().trim();

  let filtered = squadre.map((s) => {
    let giocatori = s.giocatori || [];

    if (squadreSelezionate.size > 0) {
      giocatori = giocatori.filter((g) => squadreSelezionate.has(s.id));
    }

    if (filtriRuoli.length > 0) {
      giocatori = giocatori.filter((g) => filtriRuoli.includes(g.ruolo));
    }

    if (searchTerm) {
      giocatori = giocatori.filter((g) =>
        g.nome.toLowerCase().includes(searchTerm),
      );
    }

    return { ...s, giocatori };
  });

  filtered = filtered.filter((s) => s.giocatori.length > 0);

  renderListone(filtered);
  aggiornaContatori();
}

function resetFiltri() {
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

  filtriRuoli = [];
  document
    .querySelectorAll("#ruoloBtns .btn-ruolo")
    .forEach((b) => b.classList.remove("active"));
  document
    .querySelector('#ruoloBtns .btn-ruolo[data-ruolo="all"]')
    .classList.add("active");

  document.getElementById("searchInput").value = "";
  searchTerm = "";

  if (vistaCorrente === "card") {
    document.getElementById("vistaCardContainer").classList.remove("hidden");
  } else {
    document.getElementById("vistaTabContainer").classList.remove("hidden");
  }

  applyFilters();
}

// ============================================================
//  RENDER LISTONE (con pulsante "Seleziona tutti" per squadra)
// ============================================================
function renderListone(squadreDaRenderizzare) {
  const cardContainer = document.getElementById("vistaCardContainer");
  const tabContainer = document.getElementById("vistaTabContainer");
  const tableBody = document.getElementById("tableBody");
  const emptyState = document.getElementById("emptyListone");

  const totalPlayers = squadreDaRenderizzare.reduce(
    (acc, s) => acc + s.giocatori.length,
    0,
  );

  if (totalPlayers === 0) {
    cardContainer.innerHTML = "";
    tableBody.innerHTML = "";
    emptyState.classList.remove("hidden");
    cardContainer.classList.add("hidden");
    tabContainer.classList.add("hidden");
    return;
  }
  emptyState.classList.add("hidden");

  // CARD VIEW
  let cardHtml = "";
  squadreDaRenderizzare.forEach((squadra) => {
    const ruoliMap = new Map();
    squadra.giocatori.forEach((g) => {
      if (!ruoliMap.has(g.ruolo)) ruoliMap.set(g.ruolo, []);
      ruoliMap.get(g.ruolo).push(g);
    });

    const ordineRuoli = [
      "Portiere",
      "Difensore",
      "Centrocampista",
      "Attaccante",
    ];
    const ruoliOrdinati = [];
    ordineRuoli.forEach((r) => {
      if (ruoliMap.has(r))
        ruoliOrdinati.push({ ruolo: r, giocatori: ruoliMap.get(r) });
    });
    ruoliMap.forEach((nomi, ruolo) => {
      if (!ordineRuoli.includes(ruolo))
        ruoliOrdinati.push({ ruolo, giocatori: nomi });
    });

    const teamColor =
      squadra.colori && squadra.colori[0] ? squadra.colori[0] : "var(--accent)";
    cardHtml += `
      <div class="card-squadra" style="--team-color:${teamColor}" data-squadra-id="${squadra.id}" onclick="apriSingolaSquadra(${squadra.id})">
        <div class="squadra-header">
          <div class="squadra-icon">
            ${squadra.logo_url ? `<img src="${squadra.logo_url}" alt="${squadra.nome}" loading="lazy" onerror="this.parentElement.innerHTML='<span class=\\'squadra-icon-fallback\\'>${squadra.nome.charAt(0)}</span>'" />` : `<span class="squadra-icon-fallback">${squadra.nome.charAt(0)}</span>`}
          </div>
          <div class="squadra-titleblock">
            <span class="mini-flag-it"><span></span><span></span><span></span></span>
            <h2>${squadra.nome}</h2>
          </div>
          <span class="giocatori-count">${squadra.giocatori.length}</span>
          <button class="btn-select-all-squadra" onclick="event.stopPropagation(); selectAllSquadra(${squadra.id})" title="Seleziona tutti i giocatori di questa squadra">
            <i class="fas fa-check-double"></i>
          </button>
          <i class="fas fa-chevron-right"></i>
        </div>
    `;

    ruoliOrdinati.forEach(({ ruolo, giocatori }) => {
      const iconMap = {
        Portiere: "🧤",
        Difensore: "🛡️",
        Centrocampista: "⚡",
        Attaccante: "⚽",
      };
      const icon = iconMap[ruolo] || "👤";
      cardHtml += `
        <div class="ruolo-section">
          <div class="ruolo-label">${icon} ${ruolo}</div>
          <div class="lista-giocatori">
      `;
      giocatori.forEach((g) => {
        const isInMio = mioListone.some(
          (m) => m.nome === g.nome && m.squadra === squadra.nome,
        );
        const id = getPlayerId(g.nome, squadra.nome);
        const isSelected = selectedPlayers.has(id);
        const playerData = {
          nome: g.nome,
          squadra: squadra.nome,
          ruolo: g.ruolo,
          quotazione: g.quotazione,
          logo_url: squadra.logo_url,
        };
        cardHtml += `
          <span class="giocatore-tag ${isInMio ? "nel-listone" : ""}" style="display:inline-flex;align-items:center;gap:0.3rem;" onclick="event.stopPropagation();">
            <input type="checkbox" class="player-checkbox" data-id="${id}" data-player='${JSON.stringify(playerData)}' ${isSelected ? "checked" : ""} onchange="togglePlayerSelection('${id}', JSON.parse(this.dataset.player), this)" />
            <i class="fas fa-user"></i> ${g.nome}
            <span class="tag-num">${g.quotazione || "—"}</span>
            <span class="tag-add"></span>
          </span>
        `;
      });
      cardHtml += `</div></div>`;
    });

    cardHtml += `</div>`;
  });

  cardContainer.innerHTML = cardHtml;
  cardContainer.classList.remove("hidden");

  // TABLE VIEW (con checkbox "Seleziona tutti" per riga? Non aggiungiamo per squadra, ma utente può filtrare)
  let tableHtml = "";
  squadreDaRenderizzare.forEach((squadra) => {
    squadra.giocatori.forEach((g) => {
      const isInMio = mioListone.some(
        (m) => m.nome === g.nome && m.squadra === squadra.nome,
      );
      const ruoloClass =
        {
          Portiere: "por",
          Difensore: "dif",
          Centrocampista: "cen",
          Attaccante: "att",
        }[g.ruolo] || "";
      const id = getPlayerId(g.nome, squadra.nome);
      const isSelected = selectedPlayers.has(id);
      const playerData = {
        nome: g.nome,
        squadra: squadra.nome,
        ruolo: g.ruolo,
        quotazione: g.quotazione,
        logo_url: squadra.logo_url,
      };
      tableHtml += `
        <tr>
          <td><input type="checkbox" class="player-checkbox" data-id="${id}" data-player='${JSON.stringify(playerData)}' ${isSelected ? "checked" : ""} onchange="togglePlayerSelection('${id}', JSON.parse(this.dataset.player), this)" /></td>
          <td>
            <div class="td-nome">
              <i class="fas fa-user" style="color:var(--text-3);font-size:.7rem;"></i>
              ${g.nome}
            </div>
          </td>
          <td>
            <div class="td-squadra-cell" onclick="apriSingolaSquadra(${squadra.id})">
              ${squadra.logo_url ? `<img src="${squadra.logo_url}" alt="${squadra.nome}" class="td-logo" onerror="this.style.display='none'" />` : ""}
              ${squadra.nome}
            </div>
          </td>
          <td><span class="badge-ruolo ${ruoloClass}">${g.ruolo}</span></td>
          <td><span class="quota-badge">${g.quotazione || "—"}</span></td>
          <td>
            <button class="btn-add-table ${isInMio ? "added" : "add"}" onclick="toggleMioListone('${g.nome.replace(/'/g, "\\'")}', '${squadra.nome.replace(/'/g, "\\'")}', '${g.ruolo}', '${squadra.logo_url || ""}', ${g.quotazione || 0})">
              <i class="fas ${isInMio ? "fa-check" : "fa-plus"}"></i>
              ${isInMio ? "Aggiunto" : "Aggiungi"}
            </button>
          </td>
        </tr>
      `;
    });
  });

  tableBody.innerHTML = tableHtml;
  tabContainer.classList.remove("hidden");

  if (vistaCorrente === "card") {
    cardContainer.classList.remove("hidden");
    tabContainer.classList.add("hidden");
  } else {
    cardContainer.classList.add("hidden");
    tabContainer.classList.remove("hidden");
  }

  updateSelectionUI();
}

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
}

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
  document
    .querySelectorAll(".btn-vista-mio")
    .forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  renderMioListone();
}

// ============================================================
//  TOGGLE MIO LISTONE (singolo)
// ============================================================
function toggleMioListone(nome, squadra, ruolo, logo_url, quotazione) {
  const index = mioListone.findIndex(
    (m) => m.nome === nome && m.squadra === squadra,
  );
  if (index > -1) {
    mioListone.splice(index, 1);
    showToast(`Rimosso ${nome} dal listone`, "fa-trash");
  } else {
    mioListone.push({ nome, squadra, ruolo, logo_url, quotazione });
    showToast(`Aggiunto ${nome} al listone!`, "fa-plus-circle");
  }
  saveMioListone();
  if (singolaSquadraSelezionata) {
    renderSingolaSquadra(singolaSquadraSelezionata);
  } else {
    applyFilters();
  }
  renderMioListone();
  aggiornaContatori();
}

function removeFromMioListone(nome, squadra) {
  const index = mioListone.findIndex(
    (m) => m.nome === nome && m.squadra === squadra,
  );
  if (index > -1) {
    mioListone.splice(index, 1);
    saveMioListone();
    if (singolaSquadraSelezionata) {
      renderSingolaSquadra(singolaSquadraSelezionata);
    } else {
      applyFilters();
    }
    renderMioListone();
    aggiornaContatori();
    showToast(`Rimosso ${nome} dal listone`, "fa-trash");
  }
}

function clearMioListone() {
  if (mioListone.length === 0) return;
  if (confirm("Sei sicuro di voler svuotare il tuo listone?")) {
    mioListone = [];
    saveMioListone();
    if (singolaSquadraSelezionata) {
      renderSingolaSquadra(singolaSquadraSelezionata);
    } else {
      applyFilters();
    }
    renderMioListone();
    aggiornaContatori();
    showToast("Listone svuotato!", "fa-trash");
  }
}

// ============================================================
//  RENDER MIO LISTONE (con filtri multipli)
// ============================================================
function renderMioListone() {
  const container = document.getElementById("mioListoneGrid");
  const empty = document.getElementById("emptyMio");
  const riepilogo = document.getElementById("riepilogoBar");

  let filtered = mioListone;

  if (filtriRuoliMio.length > 0) {
    filtered = filtered.filter((m) => filtriRuoliMio.includes(m.ruolo));
  }

  if (window.mioSquadreSelezionate && window.mioSquadreSelezionate.size > 0) {
    const squadreIds = window.mioSquadreSelezionate;
    const squadreNomi = squadre
      .filter((s) => squadreIds.has(s.id))
      .map((s) => s.nome);
    filtered = filtered.filter((m) => squadreNomi.includes(m.squadra));
  }

  if (filtered.length === 0) {
    container.innerHTML = "";
    empty.classList.remove("hidden");
    riepilogo.innerHTML = "";
    return;
  }
  empty.classList.add("hidden");

  const ruoliCount = {};
  mioListone.forEach((m) => {
    ruoliCount[m.ruolo] = (ruoliCount[m.ruolo] || 0) + 1;
  });
  const total = mioListone.length;
  riepilogo.innerHTML = `
    <div class="riepilogo-card"><span class="riepilogo-num">${total}</span><span class="riepilogo-label">Totale</span></div>
    <div class="riepilogo-card"><span class="riepilogo-num" style="color:var(--por-c);">${ruoliCount.Portiere || 0}</span><span class="riepilogo-label">🧤 Portieri</span></div>
    <div class="riepilogo-card"><span class="riepilogo-num" style="color:var(--dif-c);">${ruoliCount.Difensore || 0}</span><span class="riepilogo-label">🛡️ Difensori</span></div>
    <div class="riepilogo-card"><span class="riepilogo-num" style="color:var(--cen-c);">${ruoliCount.Centrocampista || 0}</span><span class="riepilogo-label">⚡ Centrocampisti</span></div>
    <div class="riepilogo-card"><span class="riepilogo-num" style="color:var(--att-c);">${ruoliCount.Attaccante || 0}</span><span class="riepilogo-label">⚽ Attaccanti</span></div>
  `;

  if (mioVistaCorrente === "ruolo") {
    const ordineRuoli = [
      "Portiere",
      "Difensore",
      "Centrocampista",
      "Attaccante",
    ];
    let html = "";
    ordineRuoli.forEach((ruolo) => {
      const giocatoriRuolo = filtered.filter((m) => m.ruolo === ruolo);
      if (giocatoriRuolo.length === 0) return;
      const colorMap = {
        Portiere: "var(--por-c)",
        Difensore: "var(--dif-c)",
        Centrocampista: "var(--cen-c)",
        Attaccante: "var(--att-c)",
      };
      const iconMap = {
        Portiere: "🧤",
        Difensore: "🛡️",
        Centrocampista: "⚡",
        Attaccante: "⚽",
      };
      html += `
        <div class="mio-ruolo-section">
          <div class="mio-ruolo-title">
            <span class="dot" style="background:${colorMap[ruolo] || "var(--text-3)"};"></span>
            <span class="mio-section-label">${iconMap[ruolo] || ""} ${ruolo}</span>
            <span class="mio-section-count">${giocatoriRuolo.length}</span>
            <button class="mio-section-selectall" onclick="selectMioSection(this)" title="Seleziona tutti i ${ruolo}">
              <i class="fas fa-check-double"></i> Tutti
            </button>
          </div>
          <div class="mio-giocatori-grid">
      `;
      giocatoriRuolo.forEach((g) => {
        html += createMioCard(g);
      });
      html += `</div></div>`;
    });
    container.innerHTML = html;
  } else {
    const squadreNomi = [...new Set(filtered.map((m) => m.squadra))];
    let html = "";
    squadreNomi.forEach((squadraNome) => {
      const giocatoriSquadra = filtered.filter(
        (m) => m.squadra === squadraNome,
      );
      const squadraData = squadre.find((s) => s.nome === squadraNome);
      html += `
        <div class="mio-squadra-section">
          <div class="mio-squadra-title">
            ${squadraData?.logo_url ? `<img src="${squadraData.logo_url}" alt="${squadraNome}" class="logo-mini" onerror="this.style.display='none'" />` : `<span class="logo-mini-fallback">${squadraNome.charAt(0)}</span>`}
            <span class="mio-section-label">${squadraNome}</span>
            <span class="mio-section-count">${giocatoriSquadra.length}</span>
            <button class="mio-section-selectall" onclick="selectMioSection(this)" title="Seleziona tutta la ${squadraNome}">
              <i class="fas fa-check-double"></i> Tutti
            </button>
          </div>
          <div class="mio-giocatori-grid">
      `;
      giocatoriSquadra.forEach((g) => {
        html += createMioCard(g);
      });
      html += `</div></div>`;
    });
    container.innerHTML = html;
  }
}

function createMioCard(g) {
  const id = getPlayerId(g.nome, g.squadra);
  const isSelected = selectedPlayers.has(id);
  return `
    <div class="mio-card">
      <input type="checkbox" class="player-checkbox" data-id="${id}" data-player='${JSON.stringify(g)}' ${isSelected ? "checked" : ""} onchange="togglePlayerSelection('${id}', JSON.parse(this.dataset.player), this)" />
      <div class="mio-logo">
        ${g.logo_url ? `<img src="${g.logo_url}" alt="${g.squadra}" onerror="this.style.display='none'; this.parentElement.innerHTML='<span class=\\'mio-logo-fb\\'>${g.squadra.charAt(0)}</span>'" />` : `<span class="mio-logo-fb">${g.squadra.charAt(0)}</span>`}
      </div>
      <div class="mio-info">
        <div class="mio-nome">${g.nome}</div>
        <div class="mio-squadra">${g.squadra}</div>
      </div>
      <span class="mio-quota">${g.quotazione || "—"}</span>
      <button class="btn-remove" onclick="removeFromMioListone('${g.nome.replace(/'/g, "\\'")}', '${g.squadra.replace(/'/g, "\\'")}')" title="Rimuovi">
        <i class="fas fa-times"></i>
      </button>
    </div>
  `;
}

// ============================================================
//  CONTATORI
// ============================================================
function aggiornaContatori() {
  const totalPlayers = squadre.reduce(
    (acc, s) => acc + (s.giocatori || []).length,
    0,
  );
  document.getElementById("totalGiocatori").textContent = totalPlayers;
  document.getElementById("totalMieiCount").textContent = mioListone.length;
}

// ============================================================
//  SWITCH TAB
// ============================================================
function switchTab(tab) {
  document
    .querySelectorAll(".btn-tab")
    .forEach((b) => b.classList.remove("active"));
  if (tab === "listone") {
    document.getElementById("tabListone").classList.add("active");
    document.getElementById("panelListone").classList.remove("hidden");
    document.getElementById("panelMio").classList.add("hidden");
    document.getElementById("toolbarListone").classList.remove("hidden");
    document.getElementById("toolbarMio").classList.add("hidden");
  } else {
    document.getElementById("tabMio").classList.add("active");
    document.getElementById("panelListone").classList.add("hidden");
    document.getElementById("panelMio").classList.remove("hidden");
    document.getElementById("toolbarListone").classList.add("hidden");
    document.getElementById("toolbarMio").classList.remove("hidden");
    renderMioListone();
  }
}