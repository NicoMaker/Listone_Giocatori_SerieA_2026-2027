// ============================================================
//  APPLICA FILTRI (multipli) + reset filtri
// ============================================================

// ============================================================
//  APPLICA FILTRI (multipli)
// ============================================================
function applyFilters() {
  if (singolaSquadraSelezionata) {
    renderSingolaSquadra(singolaSquadraSelezionata);
    return;
  }

  const searchInput = document.getElementById("searchInput");
  searchTerm = searchInput.value.toLowerCase().trim();

  let filtered = squadre.map((s) => {
    let giocatori = s.giocatori || [];

    if (squadreSelezionate.size > 0) {
      giocatori = giocatori.filter((g) => squadreSelezionate.has(s.id));
    }

    if (filtriRuoli.length > 0) {
      giocatori = giocatori.filter((g) => filtriRuoli.includes(g.ruolo));
    }

    if (searchTerm) {
      giocatori = giocatori.filter((g) =>
        g.nome.toLowerCase().includes(searchTerm),
      );
    }

    return { ...s, giocatori };
  });

  filtered = filtered.filter((s) => s.giocatori.length > 0);

  renderListone(filtered);
  aggiornaContatori();
}

function resetFiltri() {
  singolaSquadraSelezionata = null;
  document.getElementById("vistaSingolaSquadra").classList.add("hidden");

  document
    .querySelectorAll("#squadreChips .chip-squadra")
    .forEach((c) => c.classList.remove("active"));
  const allChip = document.querySelector(
    '#squadreChips .chip-squadra[data-id="all"]',
  );
  if (allChip) allChip.classList.add("active");
  squadreSelezionate.clear();

  filtriRuoli = [];
  document
    .querySelectorAll("#ruoloBtns .btn-ruolo")
    .forEach((b) => b.classList.remove("active"));
  document
    .querySelector('#ruoloBtns .btn-ruolo[data-ruolo="all"]')
    .classList.add("active");

  document.getElementById("searchInput").value = "";
  searchTerm = "";

  if (vistaCorrente === "card") {
    document.getElementById("vistaCardContainer").classList.remove("hidden");
  } else {
    document.getElementById("vistaTabContainer").classList.remove("hidden");
  }

  applyFilters();
}
