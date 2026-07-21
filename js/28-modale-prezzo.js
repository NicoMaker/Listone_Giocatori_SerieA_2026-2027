// ============================================================
//  MODALE 'IMPOSTA PREZZO' — scelta del prezzo prima dell'acquisto
// ============================================================

// ============================================================
//  MODALE "IMPOSTA PREZZO" · scelta del prezzo prima dell'acquisto
// ============================================================
function openPrezzoModal(giocatore, onConfirm, onCancel) {
  // rimuove un'eventuale modale già aperta (senza innescare onCancel)
  dismissPrezzoModal();

  const { nome, squadra, ruolo, logo_url, quotazione, step } = giocatore;
  const base = clampPrezzo(quotazione || 1) || 1;
  const ruoloAbbr =
    { Portiere: "P", Difensore: "D", Centrocampista: "C", Attaccante: "A" }[
      ruolo
    ] || "";

  const overlay = document.createElement("div");
  overlay.className = "pm-overlay";
  overlay.id = "prezzoModalOverlay";
  overlay.innerHTML = `
    <div class="pm-modal" role="dialog" aria-modal="true" aria-label="Imposta prezzo di acquisto">
      <div class="pm-header">
        <div class="pm-logo">
          ${logo_url ? `<img src="${logo_url}" alt="${escAttr(squadra)}" onerror="this.style.display='none'; this.parentElement.innerHTML='<span class=\\'pm-logo-fb\\'>${(squadra || "?").charAt(0)}</span>'" />` : `<span class="pm-logo-fb">${(squadra || "?").charAt(0)}</span>`}
        </div>
        <div class="pm-title">
          <div class="pm-nome"><span class="ruolo-tag ${{ Portiere: "por", Difensore: "dif", Centrocampista: "cen", Attaccante: "att" }[ruolo] || ""}">${ruoloAbbr}</span><span>${nome}</span></div>
          <div class="pm-sub">${squadra} · Quotazione ${quotazione || "—"} cr</div>
        </div>
        <button type="button" class="pm-close" id="pmCloseBtn" title="Annulla" aria-label="Annulla">
          <i class="fas fa-times"></i>
        </button>
      </div>

      ${
        step && step.total > 1
          ? `<div class="pm-step-badge"><i class="fas fa-layer-group"></i> Giocatore ${step.current} di ${step.total}</div>`
          : ""
      }

      <div class="pm-label">A quanto lo prendi?</div>
      <div class="pm-price-row">
        <button type="button" class="pm-step" id="pmMinus" aria-label="Diminuisci">−</button>
        <div class="pm-price-field">
          <input type="number" id="pmPrezzoInput" min="0" max="750" step="1" value="${base}" inputmode="numeric" aria-label="Prezzo di acquisto" />
          <span class="pm-unit">cr</span>
        </div>
        <button type="button" class="pm-step" id="pmPlus" aria-label="Aumenta">+</button>
      </div>

      <div class="pm-chips" id="pmChips"></div>

      <div class="pm-budget-row" id="pmBudgetRow">
        <span>Budget rimanente</span>
        <strong id="pmBudgetVal"></strong>
      </div>
      <div id="pmBudgetError" class="pm-budget-error hidden">
        <i class="fas fa-exclamation-circle"></i> Budget insufficiente!
      </div>

      <div class="pm-actions">
        <button type="button" class="pm-btn pm-btn-cancel" id="pmCancelBtn">${step && step.total > 1 ? "Interrompi" : "Annulla"}</button>
        <button type="button" class="pm-btn pm-btn-confirm" id="pmConfirmBtn">
          <i class="fas fa-sack-dollar"></i> ${step && step.total > 1 && step.current < step.total ? "Conferma e vai al prossimo" : "Acquista"}
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  const input = overlay.querySelector("#pmPrezzoInput");
  const chipsWrap = overlay.querySelector("#pmChips");
  const budgetRow = overlay.querySelector("#pmBudgetRow");
  const budgetVal = overlay.querySelector("#pmBudgetVal");
  const errorEl = overlay.querySelector("#pmBudgetError");
  const confirmBtn = overlay.querySelector("#pmConfirmBtn");

  // chip rapide: base quotazione + qualche scatto comune
  const chipValues = [
    ...new Set(
      [base, base + 5, base + 10, 1].filter((v) => v >= 0 && v <= PREZZO_MAX),
    ),
  ].slice(0, 4);
  chipsWrap.innerHTML = chipValues
    .map(
      (v) =>
        `<button type="button" class="pm-chip" data-val="${v}">${v === base ? "Quot. " : ""}${v} cr</button>`,
    )
    .join("");

  function syncChipsActive() {
    const cur = clampPrezzo(input.value);
    chipsWrap.querySelectorAll(".pm-chip").forEach((c) => {
      c.classList.toggle("pm-chip-active", Number(c.dataset.val) === cur);
    });
  }

  function syncBudget() {
    const cur = clampPrezzo(input.value);
    const speso = totaleSpeso();
    const rimanente = acquistiBudget - speso - cur;
    budgetVal.textContent = `${rimanente} cr`;
    budgetRow.classList.toggle("pm-over", rimanente < 0);
    // Se il prezzo supera il budget rimanente, disabilita il pulsante e mostra errore
    const insufficiente = rimanente < 0;
    confirmBtn.disabled = insufficiente;
    errorEl.classList.toggle("hidden", !insufficiente);
  }
  function refresh() {
    syncChipsActive();
    syncBudget();
  }
  refresh();

  chipsWrap.querySelectorAll(".pm-chip").forEach((chip) => {
    chip.onclick = () => {
      input.value = chip.dataset.val;
      refresh();
      input.focus();
    };
  });

  overlay.querySelector("#pmMinus").onclick = () => {
    input.value = Math.max(0, (clampPrezzo(input.value) || 0) - 1);
    refresh();
  };
  overlay.querySelector("#pmPlus").onclick = () => {
    input.value = Math.min(PREZZO_MAX, (clampPrezzo(input.value) || 0) + 1);
    refresh();
  };
  input.oninput = refresh;
  input.onkeydown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      doConfirm();
    } else if (e.key === "Escape") {
      doCancel();
    }
  };

  function doConfirm() {
    const prezzo = clampPrezzo(input.value) || 0;
    const spesoCorrente = totaleSpeso();
    const rimanente = acquistiBudget - spesoCorrente - prezzo;
    if (rimanente < 0) {
      // Mostra errore e non chiudere
      showToast(
        `Budget insufficiente! Ti mancano ${-rimanente} cr.`,
        "fa-exclamation-triangle",
      );
      return;
    }
    dismissPrezzoModal();
    onConfirm(prezzo);
  }
  function doCancel() {
    dismissPrezzoModal();
    if (onCancel) onCancel();
  }

  overlay.querySelector("#pmConfirmBtn").onclick = doConfirm;
  overlay.querySelector("#pmCancelBtn").onclick = doCancel;
  overlay.querySelector("#pmCloseBtn").onclick = doCancel;
  overlay.addEventListener("mousedown", (e) => {
    if (e.target === overlay) doCancel();
  });
  overlay._pmCancel = doCancel;
  document.addEventListener("keydown", pmEscListener);

  requestAnimationFrame(() => {
    overlay.classList.add("pm-show");
    input.focus();
    input.select();
  });
}

function pmEscListener(e) {
  if (e.key !== "Escape") return;
  const overlay = document.getElementById("prezzoModalOverlay");
  if (overlay && overlay._pmCancel) overlay._pmCancel();
}

// chiude la modale senza avvisare il chiamante (usato internamente prima
// di aprirne un'altra, o dopo conferma/annullamento già gestiti)
function dismissPrezzoModal() {
  const overlay = document.getElementById("prezzoModalOverlay");
  if (!overlay) return;
  document.removeEventListener("keydown", pmEscListener);
  overlay.classList.remove("pm-show");
  setTimeout(() => overlay.remove(), 180);
}

// chiude la modale annullando l'acquisto in corso (uso esterno)
function closePrezzoModal() {
  const overlay = document.getElementById("prezzoModalOverlay");
  if (overlay && overlay._pmCancel) {
    overlay._pmCancel();
  } else {
    dismissPrezzoModal();
  }
}

