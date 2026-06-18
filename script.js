// ============================================================
//  APP LOGICA · CARICAMENTO DATA.JSON + RENDER + FILTRI
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

    // Elementi DOM
    const container = document.getElementById('squadreContainer');
    const loading = document.getElementById('loading');
    const filterSquadra = document.getElementById('filterSquadra');
    const filterRuolo = document.getElementById('filterRuolo');
    const resetBtn = document.getElementById('resetFiltri');
    const countSpan = document.getElementById('countNum');

    let serieAData = null;
    let squadre = [];

    // --- Carica data.json ---
    async function loadData() {
        try {
            const response = await fetch('data.json');
            if (!response.ok) throw new Error('Errore nel caricamento dei dati');
            const data = await response.json();
            serieAData = data;
            squadre = data.squadre;
            loading.classList.add('hidden');
            init();
        } catch (error) {
            console.error('Errore:', error);
            loading.innerHTML = `
                <i class="fas fa-exclamation-triangle" style="font-size: 2.5rem; color: #e74c3c;"></i>
                <p style="margin-top: 1rem; color: #c0392b; font-weight: 600;">Impossibile caricare data.json</p>
                <p style="font-size: 0.9rem; color: #5d7b99;">Verifica che il file sia nella stessa cartella</p>
            `;
        }
    }

    // --- Popola select squadre ---
    function populateSquadreSelect() {
        filterSquadra.innerHTML = '<option value="all">Tutte le squadre</option>';
        squadre.forEach(s => {
            const opt = document.createElement('option');
            opt.value = s.id;
            opt.textContent = s.nome;
            filterSquadra.appendChild(opt);
        });
    }

    // --- RENDER ---
    function render(squadreDaRenderizzare) {
        if (!squadreDaRenderizzare || squadreDaRenderizzare.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-frown"></i>
                    <p style="margin-top: 0.5rem; font-weight: 500;">Nessun giocatore trovato con questi filtri</p>
                    <p style="font-size: 0.85rem; margin-top: 0.2rem;">Prova a modificare i filtri o premi "Reset"</p>
                </div>
            `;
            countSpan.textContent = '0';
            return;
        }

        let totalPlayers = 0;
        let html = '';

        squadreDaRenderizzare.forEach(squadra => {
            // Raggruppa per ruolo
            const ruoliMap = new Map();
            squadra.giocatori.forEach(g => {
                if (!ruoliMap.has(g.ruolo)) ruoliMap.set(g.ruolo, []);
                ruoliMap.get(g.ruolo).push(g.nome);
            });

            // Ordine ruoli desiderato
            const ordineRuoli = ['Portiere', 'Difensore', 'Centrocampista', 'Attaccante'];
            const ruoliOrdinati = [];
            ordineRuoli.forEach(r => {
                if (ruoliMap.has(r)) {
                    ruoliOrdinati.push({ ruolo: r, giocatori: ruoliMap.get(r) });
                }
            });
            // Eventuali altri ruoli (non dovrebbero esserci)
            ruoliMap.forEach((nomi, ruolo) => {
                if (!ordineRuoli.includes(ruolo)) {
                    ruoliOrdinati.push({ ruolo, giocatori: nomi });
                }
            });

            // Conta giocatori
            const count = squadra.giocatori.length;
            totalPlayers += count;

            // Inizio card
            html += `
                <div class="card-squadra">
                    <div class="squadra-header">
                        <div class="squadra-icon">${squadra.nome.charAt(0)}</div>
                        <h2>${squadra.nome}</h2>
                        <span class="giocatori-count">${count}</span>
                    </div>
            `;

            // Sezioni per ruolo
            ruoliOrdinati.forEach(({ ruolo, giocatori }) => {
                const iconMap = {
                    'Portiere': '🧤',
                    'Difensore': '🛡️',
                    'Centrocampista': '⚡',
                    'Attaccante': '⚽'
                };
                const icon = iconMap[ruolo] || '👤';
                html += `
                    <div class="ruolo-section">
                        <div class="ruolo-label">${icon} ${ruolo}</div>
                        <div class="lista-giocatori">
                `;
                giocatori.forEach(nome => {
                    html += `<span class="giocatore-tag"><i class="fas fa-user"></i> ${nome}</span>`;
                });
                html += `
                        </div>
                    </div>
                `;
            });

            html += `</div>`; // chiusura card
        });

        container.innerHTML = html;
        countSpan.textContent = totalPlayers;
    }

    // --- FILTRI ---
    function applyFilters() {
        if (!squadre.length) return;

        const squadraId = filterSquadra.value;
        const ruolo = filterRuolo.value;

        let filtered = squadre.map(s => {
            // Clona squadra e filtra giocatori per ruolo
            let giocatoriFiltrati = s.giocatori;
            if (ruolo !== 'all') {
                giocatoriFiltrati = giocatoriFiltrati.filter(g => g.ruolo === ruolo);
            }
            return { ...s, giocatori: giocatoriFiltrati };
        });

        // Filtra per squadra
        if (squadraId !== 'all') {
            filtered = filtered.filter(s => s.id === parseInt(squadraId));
        }

        // Rimuovi squadre senza giocatori (dopo filtro ruolo)
        filtered = filtered.filter(s => s.giocatori.length > 0);

        render(filtered);
    }

    // --- RESET ---
    function resetFiltri() {
        filterSquadra.value = 'all';
        filterRuolo.value = 'all';
        applyFilters();
    }

    // --- INIT ---
    function init() {
        populateSquadreSelect();
        // Eventi
        filterSquadra.addEventListener('change', applyFilters);
        filterRuolo.addEventListener('change', applyFilters);
        resetBtn.addEventListener('click', resetFiltri);
        // Render iniziale
        applyFilters();
    }

    // --- Avvia caricamento ---
    loadData();
});