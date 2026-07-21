// ============================================================
//  BUDGET — input, step, sync, aggiornamento UI budget
// ============================================================

function onPrezzoChange(id, value, inputEl) {
  const rec = acquisti.find((a) => getPlayerId(a.nome, a.squadra) === id);
  if (!rec) return;
  const prezzo = clampPrezzo(value);
  rec.prezzo = prezzo;
  if (
    inputEl &&
    String(prezzo) !== String(value) &&
    document.activeElement !== inputEl
  ) {
    inputEl.value = prezzo;
  }
  saveAcquisti();
  updateBudgetUI();
}

// ---------- BUDGET ----------
function onBudgetChange(value) {
  acquistiBudget = clampBudget(value);
  localStorage.setItem("acquistiBudget", String(acquistiBudget));
  updateBudgetUI();
}
function stepBudget(delta) {
  acquistiBudget = clampBudget(acquistiBudget + delta);
  syncBudgetInput();
  localStorage.setItem("acquistiBudget", String(acquistiBudget));
  updateBudgetUI();
}
function syncBudgetInput() {
  const input = document.getElementById("budgetInput");
  if (input && document.activeElement !== input) input.value = acquistiBudget;
}

function updateBudgetUI() {
  const speso = totaleSpeso();
  const rimanente = acquistiBudget - speso;
  const spesoEl = document.getElementById("budgetSpeso");
  const rimEl = document.getElementById("budgetRimanente");
  const nEl = document.getElementById("budgetGiocatori");
  const card = document.getElementById("budgetRemainingCard");
  const fill = document.getElementById("budgetProgressFill");
  if (spesoEl) spesoEl.textContent = speso;
  if (rimEl) rimEl.textContent = rimanente;
  if (nEl) nEl.textContent = acquisti.length;
  if (card) card.classList.toggle("over", rimanente < 0);
  if (fill) {
    const pct =
      acquistiBudget > 0
        ? Math.min(100, (speso / acquistiBudget) * 100)
        : speso > 0
          ? 100
          : 0;
    fill.style.width = pct + "%";
    fill.classList.toggle("over", speso > acquistiBudget);
  }
}

// ---------- FILTRI ACQUISTI ----------
