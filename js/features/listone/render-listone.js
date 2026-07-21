// ============================================================
//  RENDER LISTONE — con pulsante 'Seleziona tutti' per squadra
// ============================================================

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
            <input type="checkbox" class="player-checkbox" data-id="${id}" data-player='${escAttr(JSON.stringify(playerData))}' ${isSelected ? "checked" : ""} onchange="togglePlayerSelection('${id}', JSON.parse(this.dataset.player), this)" />
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
          <td><input type="checkbox" class="player-checkbox" data-id="${id}" data-player='${escAttr(JSON.stringify(playerData))}' ${isSelected ? "checked" : ""} onchange="togglePlayerSelection('${id}', JSON.parse(this.dataset.player), this)" /></td>
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
            <div class="td-actions">
              <button class="btn-add-table ${isInMio ? "added" : "add"}" onclick="toggleMioListone('${g.nome.replace(/'/g, "\\'")}', '${squadra.nome.replace(/'/g, "\\'")}', '${g.ruolo}', '${squadra.logo_url || ""}', ${g.quotazione || 0})">
                <i class="fas ${isInMio ? "fa-check" : "fa-plus"}"></i>
                ${isInMio ? "Aggiunto" : "Aggiungi"}
              </button>
              <button class="btn-buy-table ${isAcquistato(g.nome, squadra.nome) ? "bought" : ""}" onclick="quickAcquista('${g.nome.replace(/'/g, "\\'")}', '${squadra.nome.replace(/'/g, "\\'")}', '${g.ruolo}', '${squadra.logo_url || ""}', ${g.quotazione || 0})" title="${isAcquistato(g.nome, squadra.nome) ? "Rimuovi dagli acquisti" : "Acquista"}">
                <i class="fas ${isAcquistato(g.nome, squadra.nome) ? "fa-circle-check" : "fa-sack-dollar"}"></i>
              </button>
            </div>
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
  observeReveal(".card-squadra", cardContainer);
}
