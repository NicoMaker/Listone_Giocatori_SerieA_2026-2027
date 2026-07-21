// ============================================================
//  RENDER ACQUISTI — griglia acquisti per ruolo/squadra
// ============================================================

function renderAcquisti() {
  const container = document.getElementById("acquistiGrid");
  const empty = document.getElementById("emptyAcquisti");
  const riepilogo = document.getElementById("riepilogoAcquistiBar");
  if (!container) return;

  updateBudgetUI();
  syncBudgetInput();

  // ripristina lo stato attivo dei bottoni vista (potrebbe essere stato
  // toccato dalla vista del Mio Listone, che condivide la stessa classe)
  const panel = document.getElementById("panelAcquisti");
  if (panel) {
    panel.querySelectorAll(".btn-vista-mio").forEach((b, i) => {
      const isRuolo = i === 0;
      b.classList.toggle(
        "active",
        (isRuolo && acquistiVistaCorrente === "ruolo") ||
          (!isRuolo && acquistiVistaCorrente === "squadra"),
      );
    });
  }

  let filtered = acquisti;
  if (filtriRuoliAcquisti.length > 0) {
    filtered = filtered.filter((m) => filtriRuoliAcquisti.includes(m.ruolo));
  }
  if (
    window.acquistiSquadreSelezionate &&
    window.acquistiSquadreSelezionate.size > 0
  ) {
    const ids = window.acquistiSquadreSelezionate;
    const nomi = squadre.filter((s) => ids.has(s.id)).map((s) => s.nome);
    filtered = filtered.filter((m) => nomi.includes(m.squadra));
  }
  const searchEl = document.getElementById("searchInputAcquisti");
  const term = searchEl ? searchEl.value.toLowerCase().trim() : "";
  if (term)
    filtered = filtered.filter((m) => m.nome.toLowerCase().includes(term));

  if (acquisti.length === 0) {
    container.innerHTML = "";
    empty.classList.remove("hidden");
    riepilogo.innerHTML = "";
    return;
  }
  empty.classList.add("hidden");

  // riepilogo per ruolo (conteggio + spesa)
  const ruoliCount = {};
  const ruoliSpesa = {};
  acquisti.forEach((m) => {
    ruoliCount[m.ruolo] = (ruoliCount[m.ruolo] || 0) + 1;
    ruoliSpesa[m.ruolo] = (ruoliSpesa[m.ruolo] || 0) + (Number(m.prezzo) || 0);
  });
  const total = acquisti.length;
  riepilogo.innerHTML = `
    <div class="riepilogo-card"><span class="riepilogo-num">${total}</span><span class="riepilogo-label">Totale</span></div>
    <div class="riepilogo-card"><span class="riepilogo-num" style="color:var(--por-c);">${ruoliCount.Portiere || 0}</span><span class="riepilogo-label">🧤 Portieri</span></div>
    <div class="riepilogo-card"><span class="riepilogo-num" style="color:var(--dif-c);">${ruoliCount.Difensore || 0}</span><span class="riepilogo-label">🛡️ Difensori</span></div>
    <div class="riepilogo-card"><span class="riepilogo-num" style="color:var(--cen-c);">${ruoliCount.Centrocampista || 0}</span><span class="riepilogo-label">⚡ Centrocampisti</span></div>
    <div class="riepilogo-card"><span class="riepilogo-num" style="color:var(--att-c);">${ruoliCount.Attaccante || 0}</span><span class="riepilogo-label">⚽ Attaccanti</span></div>
  `;

  if (filtered.length === 0) {
    container.innerHTML = `<div class="empty-state" style="grid-column:1/-1;"><div class="empty-icon"><i class="fas fa-filter"></i></div><p>Nessun acquisto con questi filtri</p><small>Prova a modificare ruolo, squadra o ricerca</small></div>`;
    return;
  }

  const iconMap = {
    Portiere: "🧤",
    Difensore: "🛡️",
    Centrocampista: "⚡",
    Attaccante: "⚽",
  };
  const colorMap = {
    Portiere: "var(--por-c)",
    Difensore: "var(--dif-c)",
    Centrocampista: "var(--cen-c)",
    Attaccante: "var(--att-c)",
  };

  if (acquistiVistaCorrente === "ruolo") {
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
      const spesa = giocatoriRuolo.reduce(
        (acc, g) => acc + (Number(g.prezzo) || 0),
        0,
      );
      html += `
        <div class="mio-ruolo-section">
          <div class="mio-ruolo-title">
            <span class="dot" style="background:${colorMap[ruolo] || "var(--text-3)"};"></span>
            <span class="mio-section-label">${iconMap[ruolo] || ""} ${ruolo}</span>
            <span class="mio-section-count">${giocatoriRuolo.length}</span>
            <span class="mio-spesa-chip"><i class="fas fa-coins"></i> ${spesa} cr</span>
            <button class="mio-section-selectall" onclick="selectMioSection(this)" title="Seleziona tutti i ${ruolo}">
              <i class="fas fa-check-double"></i> Tutti
            </button>
          </div>
          <div class="mio-giocatori-grid">
      `;
      giocatoriRuolo.forEach((g) => {
        html += createAcquistoCard(g);
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
      const spesa = giocatoriSquadra.reduce(
        (acc, g) => acc + (Number(g.prezzo) || 0),
        0,
      );
      html += `
        <div class="mio-squadra-section">
          <div class="mio-squadra-title">
            ${squadraData?.logo_url ? `<img src="${squadraData.logo_url}" alt="${squadraNome}" class="logo-mini" onerror="this.style.display='none'" />` : `<span class="logo-mini-fallback">${squadraNome.charAt(0)}</span>`}
            <span class="mio-section-label">${squadraNome}</span>
            <span class="mio-section-count">${giocatoriSquadra.length}</span>
            <span class="mio-spesa-chip"><i class="fas fa-coins"></i> ${spesa} cr</span>
            <button class="mio-section-selectall" onclick="selectMioSection(this)" title="Seleziona tutta la ${squadraNome}">
              <i class="fas fa-check-double"></i> Tutti
            </button>
          </div>
          <div class="mio-giocatori-grid">
      `;
      giocatoriSquadra.forEach((g) => {
        html += createAcquistoCard(g);
      });
      html += `</div></div>`;
    });
    container.innerHTML = html;
  }

  observeReveal(".mio-ruolo-section, .mio-squadra-section", container);
  updateSelectionUI();

  // Se ho appena comprato un giocatore, porto il cursore sul suo prezzo
  // e lo seleziono: basta digitare per impostare quanto l'hai pagato.
  if (focusPrezzoId) {
    const panelVisibile = panel && !panel.classList.contains("hidden");
    const input = container.querySelector(
      `.acquisto-card .prezzo-input[data-id="${cssEscape(focusPrezzoId)}"]`,
    );
    if (panelVisibile && input) {
      requestAnimationFrame(() => {
        input.focus();
        input.select();
        const card = input.closest(".acquisto-card");
        if (card) {
          card.classList.add("just-added");
          card.scrollIntoView({ behavior: "smooth", block: "center" });
          setTimeout(() => card.classList.remove("just-added"), 1600);
        }
      });
      focusPrezzoId = null;
    }
  }
}

// piccola escape per usare un id dentro un selettore CSS in modo sicuro
function cssEscape(s) {
  if (window.CSS && CSS.escape) return CSS.escape(s);
  return String(s).replace(/["\\\]\[#.:>+~*^$|=()]/g, "\\$&");
}

function createAcquistoCard(g) {
  const id = getPlayerId(g.nome, g.squadra);
  const isSelected = selectedPlayers.has(id);
  const prezzo = Number(g.prezzo) || 0;
  const ruoloAbbr =
    { Portiere: "P", Difensore: "D", Centrocampista: "C", Attaccante: "A" }[
      g.ruolo
    ] || "";
  const ruoloCls =
    {
      Portiere: "por",
      Difensore: "dif",
      Centrocampista: "cen",
      Attaccante: "att",
    }[g.ruolo] || "";
  return `
    <div class="mio-card acquisto-card">
      <input type="checkbox" class="player-checkbox" data-id="${id}" data-player='${escAttr(JSON.stringify(g))}' ${isSelected ? "checked" : ""} onchange="togglePlayerSelection('${id}', JSON.parse(this.dataset.player), this)" />
      <div class="mio-logo">
        ${g.logo_url ? `<img src="${g.logo_url}" alt="${g.squadra}" onerror="this.style.display='none'; this.parentElement.innerHTML='<span class=\\'mio-logo-fb\\'>${g.squadra.charAt(0)}</span>'" />` : `<span class="mio-logo-fb">${g.squadra.charAt(0)}</span>`}
      </div>
      <div class="mio-info">
        <div class="mio-nome" title="${escAttr(g.nome)}"><span class="ruolo-tag ${ruoloCls}">${ruoloAbbr}</span><span class="nome-txt">${g.nome}</span></div>
        <div class="mio-squadra">${g.squadra} · <span class="mio-quota-inline">Quot. ${g.quotazione || "—"}</span></div>
      </div>
      <div class="prezzo-field" onclick="event.stopPropagation();">
        <input type="number" class="prezzo-input" data-id="${id}" min="0" max="750" step="1" value="${prezzo}" oninput="onPrezzoChange('${id}', this.value, this)" onfocus="this.select()" aria-label="Prezzo di ${escAttr(g.nome)}" />
        <span class="prezzo-unit">cr</span>
      </div>
      <button class="btn-remove" onclick="removeFromAcquisti('${g.nome.replace(/'/g, "\\'")}', '${g.squadra.replace(/'/g, "\\'")}')" title="Rimuovi dagli acquisti">
        <i class="fas fa-times"></i>
      </button>
    </div>
  `;
}

