// ============================================================
//  SELEZIONE MULTIPLA — checkbox, id giocatore, UI selezione
// ============================================================

// ===== SELEZIONE MULTIPLA =====
let selectedPlayers = new Map();

function getPlayerId(nome, squadra) {
  return `${nome}_${squadra}`;
}

// Rende sicura una stringa da inserire dentro un attributo HTML delimitato
// da apici singoli (es. data-player='...'). Senza questo, nomi giocatore
// con l'apostrofo (CALO', BERNABE', D'ANDREA, N'DRI, SOULE', CANDE',
// LAURIENTE', SIDIBE') chiudono l'attributo in anticipo e spezzano tutto
// l'HTML a seguire: è la causa dei checkbox "Seleziona tutti" che non
// selezionavano davvero tutti e del pulsante "Aggiungi selezionati" che
// sembrava non funzionare più dopo averli usati.
function escAttr(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
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
  const buyBtn = document.getElementById("buySelectedBtn");
  const buyMioBtn = document.getElementById("buySelectedMioBtn");
  const removeAcqBtn = document.getElementById("removeSelectedAcquistiBtn");
  const countSpan = document.getElementById("selectedCount");
  const countSpanMio = document.getElementById("selectedCountMio");
  const countSpanBuy = document.getElementById("selectedCountBuy");
  const countSpanBuyMio = document.getElementById("selectedCountBuyMio");
  const countSpanAcq = document.getElementById("selectedCountAcquisti");

  if (addBtn) addBtn.disabled = count === 0;
  if (removeBtn) removeBtn.disabled = count === 0;
  if (buyBtn) buyBtn.disabled = count === 0;
  if (buyMioBtn) buyMioBtn.disabled = count === 0;
  if (removeAcqBtn) removeAcqBtn.disabled = count === 0;

  [countSpanBuy, countSpanBuyMio, countSpanAcq].forEach((el) => {
    if (el && el.textContent !== String(count)) {
      el.textContent = count;
      el.classList.add("bump");
      setTimeout(() => el.classList.remove("bump"), 400);
    }
  });
  if (countSpan && countSpan.textContent !== String(count)) {
    countSpan.textContent = count;
    countSpan.classList.add("bump");
    setTimeout(() => countSpan.classList.remove("bump"), 400);
  }
  if (countSpanMio && countSpanMio.textContent !== String(count)) {
    countSpanMio.textContent = count;
    countSpanMio.classList.add("bump");
    setTimeout(() => countSpanMio.classList.remove("bump"), 400);
  }

  const allCheck = document.getElementById("selectAllTable");
  if (allCheck) {
    // Il checkbox "master" vive nell'header della tabella: va calcolato SOLO
    // sulle checkbox dentro #tableBody, altrimenti le checkbox duplicate e
    // nascoste della vista a card lo facevano risultare sempre "non completo"
    // e si auto-deselezionava subito dopo il click.
    const tableCheckboxes = document.querySelectorAll(
      "#tableBody .player-checkbox",
    );
    const tableChecked = document.querySelectorAll(
      "#tableBody .player-checkbox:checked",
    );
    allCheck.checked =
      tableCheckboxes.length > 0 &&
      tableChecked.length === tableCheckboxes.length;
  }
}

// Restituisce SOLO le checkbox della vista attualmente visibile a schermo.
// Card view, tabella, griglia/lista della singola squadra e il Mio Listone
// possono coesistere nel DOM (solo il contenitore viene nascosto), quindi
// qui scegliamo esplicitamente il contenitore giusto invece di affidarci
// a una classe "hidden" sulla singola checkbox, che non viene mai applicata.
function getCheckboxContainerAttivo() {
  const panelListone = document.getElementById("panelListone");
  const panelListoneVisibile =
    panelListone && !panelListone.classList.contains("hidden");

  if (panelListoneVisibile) {
    if (singolaSquadraSelezionata) {
      return vistaSingolaCorrente === "griglia"
        ? document.getElementById("singolaSquadraContent")
        : document.getElementById("singolaSquadraLista");
    }
    return vistaCorrente === "card"
      ? document.getElementById("vistaCardContainer")
      : document.getElementById("vistaTabContainer");
  }
  const panelAcquisti = document.getElementById("panelAcquisti");
  if (panelAcquisti && !panelAcquisti.classList.contains("hidden")) {
    return document.getElementById("acquistiGrid");
  }
  return document.getElementById("mioListoneGrid");
}

function clearSelection() {
  selectedPlayers.clear();
  document
    .querySelectorAll(".player-checkbox")
    .forEach((cb) => (cb.checked = false));
  updateSelectionUI();
}

function selectAllVisible() {
  const container = getCheckboxContainerAttivo();
  const checkboxes = container
    ? container.querySelectorAll(".player-checkbox")
    : [];
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

