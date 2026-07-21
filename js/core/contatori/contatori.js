// ============================================================
//  CONTATORI — aggiorna contatori header
// ============================================================

// ============================================================
//  CONTATORI
// ============================================================
function aggiornaContatori() {
  const totalPlayers = squadre.reduce(
    (acc, s) => acc + (s.giocatori || []).length,
    0,
  );
  animaContatore(document.getElementById("totalGiocatori"), totalPlayers);
  animaContatore(document.getElementById("totalMieiCount"), mioListone.length);
  animaContatore(
    document.getElementById("totalAcquistiCount"),
    typeof acquisti !== "undefined" ? acquisti.length : 0,
  );
}
