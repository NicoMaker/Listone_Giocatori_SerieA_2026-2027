// ============================================================
//  FALLBACK LOGHI SQUADRE — link principale -> Wikipedia -> iniziale
// ============================================================

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
  const startedAt =
    performance && performance.now ? performance.now() : Date.now();
  // Tempo minimo in cui mostrare l'intro, così l'animazione del pallone
  // si vede tutta anche quando i dati si caricano in un lampo.
  const MIN_INTRO_MS = 2600;
  try {
    const response = await fetch("data/data.json");
    if (!response.ok) throw new Error("Errore nel caricamento dei dati");
    const data = await response.json();
    serieAData = data;
    squadre = data.squadre;
    setupLogoFallback();

    const now = performance && performance.now ? performance.now() : Date.now();
    const elapsed = now - startedAt;
    const wait = Math.max(0, MIN_INTRO_MS - elapsed);

    setTimeout(() => {
      // dissolvenza dolce, poi rimuove l'intro e avvia l'app
      loading.classList.add("is-leaving");
      setTimeout(() => {
        loading.classList.add("hidden");
        init();
      }, 450);
    }, wait);
  } catch (error) {
    console.error("Errore:", error);
    loading.classList.remove("is-leaving");
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
  populateSquadreChips("acquistiSquadreChipsList");
  applyFilters();
  renderMioListone();
  syncBudgetInput();
  renderAcquisti();
  aggiornaContatori();
  aggiornaInfoSalvataggio();
  document.getElementById("panelListone").classList.remove("hidden");

  // Riapre la sezione (Listone / Il Mio) in cui l'utente si trovava
  // l'ultima volta. Se non c'è ancora nulla salvato (prima visita),
  // resta ovviamente su "Listone", che è già lo stato di default.
  const tabSalvato = getTabSalvato();
  if (tabSalvato === "mio" || tabSalvato === "acquisti") {
    switchTab(tabSalvato, { skipSave: true, skipScroll: true });
  } else {
    requestAnimationFrame(updateTabSlider);
  }
}
