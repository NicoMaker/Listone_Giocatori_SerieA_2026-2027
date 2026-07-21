// ============================================================
//  ANIMAZIONE CONTATORI — count-up e bump badge
// ============================================================

// ============================================================
//  ANIMAZIONE CONTATORI (count-up + "bump" sul badge)
// ============================================================
function animaContatore(el, nuovoValore) {
  if (!el) return;
  const attuale = parseInt(el.textContent, 10) || 0;
  if (attuale === nuovoValore) return;

  const durata = 420;
  const inizio = performance.now();
  const partenza = attuale;
  const delta = nuovoValore - partenza;

  function step(now) {
    const t = Math.min(1, (now - inizio) / durata);
    const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
    el.textContent = Math.round(partenza + delta * eased);
    if (t < 1) {
      requestAnimationFrame(step);
    } else {
      el.textContent = nuovoValore;
      el.classList.add("bump");
      setTimeout(() => el.classList.remove("bump"), 400);
    }
  }
  requestAnimationFrame(step);
}

