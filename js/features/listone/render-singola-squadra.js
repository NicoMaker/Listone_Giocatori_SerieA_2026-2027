// ============================================================
//  RENDER SINGOLA SQUADRA — con filtri ruoli multipli
// ============================================================

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
          <input type="checkbox" class="player-checkbox" data-id="${id}" data-player='${escAttr(JSON.stringify(playerData))}' ${isSelected ? "checked" : ""} onchange="togglePlayerSelection('${id}', JSON.parse(this.dataset.player), this)" />
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
          <input type="checkbox" class="player-checkbox" data-id="${id}" data-player='${escAttr(JSON.stringify(playerData))}' ${isSelected ? "checked" : ""} onchange="togglePlayerSelection('${id}', JSON.parse(this.dataset.player), this)" />
          <span class="riga-posizione">${index}</span>
          <span class="riga-nome"><i class="fas fa-user" style="color:var(--text-3);font-size:0.7rem;margin-right:0.3rem;"></i> ${g.nome}</span>
          <span class="riga-ruolo ${rClass}">${g.ruolo}</span>
          <span class="riga-quota">${g.quotazione || "—"}</span>
          <button class="riga-add ${isInMio ? "added" : ""}" onclick="toggleMioListone('${g.nome.replace(/'/g, "\\'")}', '${squadra.nome.replace(/'/g, "\\'")}', '${g.ruolo}', '${squadra.logo_url || ""}', ${g.quotazione || 0})" title="${isInMio ? "Rimuovi dal mio listone" : "Aggiungi al mio listone"}">
            <i class="fas ${isInMio ? "fa-check" : "fa-plus"}"></i>
          </button>
          <button class="riga-buy ${isAcquistato(g.nome, squadra.nome) ? "bought" : ""}" onclick="quickAcquista('${g.nome.replace(/'/g, "\\'")}', '${squadra.nome.replace(/'/g, "\\'")}', '${g.ruolo}', '${squadra.logo_url || ""}', ${g.quotazione || 0})" title="${isAcquistato(g.nome, squadra.nome) ? "Rimuovi dagli acquisti" : "Acquista"}">
            <i class="fas ${isAcquistato(g.nome, squadra.nome) ? "fa-circle-check" : "fa-sack-dollar"}"></i>
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

