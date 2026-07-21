// ============================================================
//  RIPPLE EFFECT — microinterazione sui pulsanti
// ============================================================

// ============================================================
//  RIPPLE EFFECT (microinterazione sui pulsanti)
// ============================================================
function initRippleEffect() {
  const rippleSelector =
    ".btn-action, .btn-ruolo, .btn-vista, .btn-tab, .btn-export, .btn-import, " +
    ".btn-danger, .btn-reset, .btn-back, .btn-theme, .chip-squadra, " +
    ".btn-select-all-squadra, .btn-vista-singola, .btn-vista-mio, .btn-add-table, .riga-add, " +
    ".btn-buy, .btn-buy-table, .riga-buy, .btn-buy-mini, .budget-step";

  document.addEventListener("click", (e) => {
    const btn = e.target.closest(rippleSelector);
    if (!btn || btn.disabled) return;
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const span = document.createElement("span");
    span.className = "ripple-span";
    span.style.width = span.style.height = `${size}px`;
    span.style.left = `${e.clientX - rect.left - size / 2}px`;
    span.style.top = `${e.clientY - rect.top - size / 2}px`;
    btn.appendChild(span);
    span.addEventListener("animationend", () => span.remove());
  });
}

