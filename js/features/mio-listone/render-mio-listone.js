// ============================================================
//  RENDER MIO LISTONE — con filtri multipli
// ============================================================

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

  observeReveal(".mio-ruolo-section, .mio-squadra-section", container);
}

function createMioCard(g) {
  const id = getPlayerId(g.nome, g.squadra);
  const isSelected = selectedPlayers.has(id);
  return `
    <div class="mio-card">
      <input type="checkbox" class="player-checkbox" data-id="${id}" data-player='${escAttr(JSON.stringify(g))}' ${isSelected ? "checked" : ""} onchange="togglePlayerSelection('${id}', JSON.parse(this.dataset.player), this)" />
      <div class="mio-logo">
        ${g.logo_url ? `<img src="${g.logo_url}" alt="${g.squadra}" onerror="this.style.display='none'; this.parentElement.innerHTML='<span class=\\'mio-logo-fb\\'>${g.squadra.charAt(0)}</span>'" />` : `<span class="mio-logo-fb">${g.squadra.charAt(0)}</span>`}
      </div>
      <div class="mio-info">
        <div class="mio-nome">${g.nome}</div>
        <div class="mio-squadra">${g.squadra}</div>
      </div>
      <span class="mio-quota">${g.quotazione || "—"}</span>
      <button class="btn-buy-mini ${isAcquistato(g.nome, g.squadra) ? "bought" : ""}" onclick="quickAcquista('${g.nome.replace(/'/g, "\\'")}', '${g.squadra.replace(/'/g, "\\'")}', '${g.ruolo}', '${(g.logo_url || "").replace(/'/g, "\\'")}', ${g.quotazione || 0})" title="${isAcquistato(g.nome, g.squadra) ? "Rimuovi dagli acquisti" : "Acquista"}">
        <i class="fas ${isAcquistato(g.nome, g.squadra) ? "fa-circle-check" : "fa-sack-dollar"}"></i>
      </button>
      <button class="btn-remove" onclick="removeFromMioListone('${g.nome.replace(/'/g, "\\'")}', '${g.squadra.replace(/'/g, "\\'")}')" title="Rimuovi dal mio listone">
        <i class="fas fa-times"></i>
      </button>
    </div>
  `;
}

