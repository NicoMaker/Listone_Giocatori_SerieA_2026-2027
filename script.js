// ============================================================
//  APP LOGICA · CARICAMENTO DATA.JSON + RENDER + FILTRI
// ============================================================

let serieAData = null;
let squadre = [];
let mioListone = [];
let filtroRuolo = 'all';
let filtroRuoloMio = 'all';
let squadreSelezionate = new Set(['all']);
let vistaCorrente = 'card';
let searchTerm = '';

// Carica il mio listone dal localStorage
function loadMioListone() {
    try {
        const saved = localStorage.getItem('mioListone');
        if (saved) {
            mioListone = JSON.parse(saved);
        }
    } catch (e) { mioListone = []; }
}

// Salva il mio listone
function saveMioListone() {
    localStorage.setItem('mioListone', JSON.stringify(mioListone));
    aggiornaContatori();
}

// ============================================================
//  CARICAMENTO DATI
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
    loadMioListone();
    loadData();
});

async function loadData() {
    const loading = document.getElementById("loading");
    try {
        const response = await fetch("data.json");
        if (!response.ok) throw new Error("Errore nel caricamento dei dati");
        const data = await response.json();
        serieAData = data;
        squadre = data.squadre;
        loading.classList.add("hidden");
        init();
    } catch (error) {
        console.error("Errore:", error);
        loading.innerHTML = `
            <i class="fas fa-exclamation-triangle" style="font-size: 2.5rem; color: #e74c3c;"></i>
            <p style="margin-top: 1rem; color: #c0392b; font-weight: 600;">Impossibile caricare data.json</p>
            <p style="font-size: 0.9rem; color: #5d7b99;">Verifica che il file sia nella stessa cartella</p>
        `;
    }
}

// ============================================================
//  INIT
// ============================================================
function init() {
    populateSquadreChips();
    applyFilters();
    renderMioListone();
    aggiornaContatori();
    document.getElementById("panelListone").classList.remove("hidden");
}

// ============================================================
//  SQUADRE CHIPS
// ============================================================
function populateSquadreChips() {
    const container = document.getElementById("squadreChips");
    container.innerHTML = '';
    squadre.forEach(s => {
        const chip = document.createElement("button");
        chip.className = "chip-squadra";
        chip.dataset.id = s.id;
        chip.innerHTML = `
            ${s.logo_url ? `<img src="${s.logo_url}" alt="${s.nome}" loading="lazy" onerror="this.style.display='none'" />` : ''}
            <span>${s.nome}</span>
        `;
        chip.onclick = () => toggleSquadraChip(chip);
        container.appendChild(chip);
    });
}

function toggleSquadraChip(chip) {
    const id = chip.dataset.id;
    const allChip = document.querySelector('.chip-squadra[data-id="all"]');
    
    if (id === 'all') {
        // Se clicco su Tutte, deseleziono tutte e seleziono Tutte
        document.querySelectorAll('.chip-squadra').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        squadreSelezionate = new Set(['all']);
    } else {
        // Rimuovo 'all' se presente
        squadreSelezionate.delete('all');
        allChip.classList.remove('active');
        
        // Toggle della squadra
        if (squadreSelezionate.has(id)) {
            squadreSelezionate.delete(id);
        } else {
            squadreSelezionate.add(id);
        }
        
        // Se non ho selezionato nessuna squadra, metto Tutte
        if (squadreSelezionate.size === 0) {
            squadreSelezionate.add('all');
            allChip.classList.add('active');
        }
        
        // Aggiorno lo stato dei chip
        document.querySelectorAll('.chip-squadra').forEach(c => {
            if (c.dataset.id === 'all') return;
            c.classList.toggle('active', squadreSelezionate.has(c.dataset.id));
        });
    }
    applyFilters();
}

// ============================================================
//  FILTRI
// ============================================================
function toggleRuolo(btn) {
    document.querySelectorAll('.btn-ruolo').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    filtroRuolo = btn.dataset.ruolo;
    applyFilters();
}

function toggleRuoloMio(btn) {
    document.querySelectorAll('#toolbarMio .btn-ruolo').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    filtroRuoloMio = btn.dataset.ruolo;
    renderMioListone();
}

function applyFilters() {
    const searchInput = document.getElementById('searchInput');
    searchTerm = searchInput.value.toLowerCase().trim();
    
    let filtered = squadre.map(s => {
        let giocatori = s.giocatori || [];
        
        // Filtro per ruolo
        if (filtroRuolo !== 'all') {
            giocatori = giocatori.filter(g => g.ruolo === filtroRuolo);
        }
        
        // Filtro per ricerca
        if (searchTerm) {
            giocatori = giocatori.filter(g => 
                g.nome.toLowerCase().includes(searchTerm)
            );
        }
        
        return { ...s, giocatori };
    });
    
    // Filtro per squadre selezionate
    if (!squadreSelezionate.has('all')) {
        filtered = filtered.filter(s => squadreSelezionate.has(String(s.id)));
    }
    
    filtered = filtered.filter(s => s.giocatori.length > 0);
    
    renderListone(filtered);
    aggiornaContatori();
}

function resetFiltri() {
    // Reset squadre
    document.querySelectorAll('.chip-squadra').forEach(c => c.classList.remove('active'));
    document.querySelector('.chip-squadra[data-id="all"]').classList.add('active');
    squadreSelezionate = new Set(['all']);
    
    // Reset ruolo
    document.querySelectorAll('.btn-ruolo').forEach(b => b.classList.remove('active'));
    document.querySelector('.btn-ruolo[data-ruolo="all"]').classList.add('active');
    filtroRuolo = 'all';
    
    // Reset search
    document.getElementById('searchInput').value = '';
    searchTerm = '';
    
    applyFilters();
}

// ============================================================
//  RENDER LISTONE
// ============================================================
function renderListone(squadreDaRenderizzare) {
    const cardContainer = document.getElementById('vistaCardContainer');
    const tabContainer = document.getElementById('vistaTabContainer');
    const tableBody = document.getElementById('tableBody');
    const emptyState = document.getElementById('emptyListone');
    
    const totalPlayers = squadreDaRenderizzare.reduce((acc, s) => acc + s.giocatori.length, 0);
    
    if (totalPlayers === 0) {
        cardContainer.innerHTML = '';
        tableBody.innerHTML = '';
        emptyState.classList.remove('hidden');
        cardContainer.classList.add('hidden');
        tabContainer.classList.add('hidden');
        return;
    }
    emptyState.classList.add('hidden');
    
    // RENDER CARD
    let cardHtml = '';
    squadreDaRenderizzare.forEach(squadra => {
        const ruoliMap = new Map();
        squadra.giocatori.forEach(g => {
            if (!ruoliMap.has(g.ruolo)) ruoliMap.set(g.ruolo, []);
            ruoliMap.get(g.ruolo).push(g);
        });
        
        const ordineRuoli = ["Portiere", "Difensore", "Centrocampista", "Attaccante"];
        const ruoliOrdinati = [];
        ordineRuoli.forEach(r => {
            if (ruoliMap.has(r)) ruoliOrdinati.push({ ruolo: r, giocatori: ruoliMap.get(r) });
        });
        ruoliMap.forEach((nomi, ruolo) => {
            if (!ordineRuoli.includes(ruolo)) ruoliOrdinati.push({ ruolo, giocatori: nomi });
        });
        
        cardHtml += `
            <div class="card-squadra">
                <div class="squadra-header">
                    <div class="squadra-icon">
                        ${squadra.logo_url ? `<img src="${squadra.logo_url}" alt="${squadra.nome}" loading="lazy" onerror="this.parentElement.innerHTML='<span class=\\'squadra-icon-fallback\\'>${squadra.nome.charAt(0)}</span>'" />` : `<span class="squadra-icon-fallback">${squadra.nome.charAt(0)}</span>`}
                    </div>
                    <h2>${squadra.nome}</h2>
                    <span class="giocatori-count">${squadra.giocatori.length}</span>
                </div>
        `;
        
        ruoliOrdinati.forEach(({ ruolo, giocatori }) => {
            const iconMap = { Portiere: "🧤", Difensore: "🛡️", Centrocampista: "⚡", Attaccante: "⚽" };
            const icon = iconMap[ruolo] || "👤";
            cardHtml += `
                <div class="ruolo-section">
                    <div class="ruolo-label">${icon} ${ruolo}</div>
                    <div class="lista-giocatori">
            `;
            giocatori.forEach(g => {
                const isInMio = mioListone.some(m => m.nome === g.nome && m.squadra === squadra.nome);
                cardHtml += `
                    <span class="giocatore-tag ${isInMio ? 'nel-listone' : ''}" onclick="toggleMioListone('${g.nome}', '${squadra.nome}', '${g.ruolo}', '${squadra.logo_url || ''}', ${g.numero || 0})">
                        <i class="fas fa-user"></i> ${g.nome}
                        <span class="tag-add"></span>
                    </span>
                `;
            });
            cardHtml += `
                    </div>
                </div>
            `;
        });
        
        cardHtml += `</div>`;
    });
    
    cardContainer.innerHTML = cardHtml;
    cardContainer.classList.remove('hidden');
    
    // RENDER TABELLA
    let tableHtml = '';
    squadreDaRenderizzare.forEach(squadra => {
        squadra.giocatori.forEach(g => {
            const isInMio = mioListone.some(m => m.nome === g.nome && m.squadra === squadra.nome);
            const ruoloClass = { Portiere: 'por', Difensore: 'dif', Centrocampista: 'cen', Attaccante: 'att' }[g.ruolo] || '';
            tableHtml += `
                <tr>
                    <td>
                        <div class="td-nome">
                            <i class="fas fa-user" style="color:var(--text-3);font-size:.7rem;"></i>
                            ${g.nome}
                        </div>
                    </td>
                    <td>
                        <div class="td-squadra-cell">
                            ${squadra.logo_url ? `<img src="${squadra.logo_url}" alt="${squadra.nome}" class="td-logo" onerror="this.style.display='none'" />` : ''}
                            ${squadra.nome}
                        </div>
                    </td>
                    <td><span class="badge-ruolo ${ruoloClass}">${g.ruolo}</span></td>
                    <td><span class="quota-badge">${g.numero || '—'}</span></td>
                    <td>
                        <button class="btn-add-table ${isInMio ? 'added' : 'add'}" onclick="toggleMioListone('${g.nome}', '${squadra.nome}', '${g.ruolo}', '${squadra.logo_url || ''}', ${g.numero || 0})">
                            <i class="fas ${isInMio ? 'fa-check' : 'fa-plus'}"></i>
                            ${isInMio ? 'Aggiunto' : 'Aggiungi'}
                        </button>
                    </td>
                </tr>
            `;
        });
    });
    
    tableBody.innerHTML = tableHtml;
    tabContainer.classList.remove('hidden');
    
    // Mostra solo la vista attiva
    if (vistaCorrente === 'card') {
        cardContainer.classList.remove('hidden');
        tabContainer.classList.add('hidden');
    } else {
        cardContainer.classList.add('hidden');
        tabContainer.classList.remove('hidden');
    }
}

// ============================================================
//  VISTA
// ============================================================
function setVista(vista, btn) {
    vistaCorrente = vista;
    document.querySelectorAll('.btn-vista').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    applyFilters();
}

// ============================================================
//  TOGGLE MIO LISTONE
// ============================================================
function toggleMioListone(nome, squadra, ruolo, logo_url, numero) {
    const index = mioListone.findIndex(m => m.nome === nome && m.squadra === squadra);
    if (index > -1) {
        mioListone.splice(index, 1);
    } else {
        mioListone.push({ nome, squadra, ruolo, logo_url, numero });
    }
    saveMioListone();
    applyFilters();
    renderMioListone();
    aggiornaContatori();
}

function removeFromMioListone(nome, squadra) {
    const index = mioListone.findIndex(m => m.nome === nome && m.squadra === squadra);
    if (index > -1) {
        mioListone.splice(index, 1);
        saveMioListone();
        applyFilters();
        renderMioListone();
        aggiornaContatori();
    }
}

function clearMioListone() {
    if (mioListone.length === 0) return;
    if (confirm('Sei sicuro di voler svuotare il tuo listone?')) {
        mioListone = [];
        saveMioListone();
        applyFilters();
        renderMioListone();
        aggiornaContatori();
    }
}

// ============================================================
//  RENDER MIO LISTONE
// ============================================================
function renderMioListone() {
    const container = document.getElementById('mioListoneGrid');
    const empty = document.getElementById('emptyMio');
    const riepilogo = document.getElementById('riepilogoBar');
    
    let filtered = mioListone;
    if (filtroRuoloMio !== 'all') {
        filtered = filtered.filter(m => m.ruolo === filtroRuoloMio);
    }
    
    if (filtered.length === 0) {
        container.innerHTML = '';
        empty.classList.remove('hidden');
        riepilogo.innerHTML = '';
        return;
    }
    empty.classList.add('hidden');
    
    // Riepilogo
    const ruoliCount = {};
    mioListone.forEach(m => {
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
    
    // Grid per ruolo
    const ordineRuoli = ["Portiere", "Difensore", "Centrocampista", "Attaccante"];
    let html = '';
    ordineRuoli.forEach(ruolo => {
        const giocatoriRuolo = filtered.filter(m => m.ruolo === ruolo);
        if (giocatoriRuolo.length === 0) return;
        
        const colorMap = { Portiere: 'var(--por-c)', Difensore: 'var(--dif-c)', Centrocampista: 'var(--cen-c)', Attaccante: 'var(--att-c)' };
        const iconMap = { Portiere: '🧤', Difensore: '🛡️', Centrocampista: '⚡', Attaccante: '⚽' };
        
        html += `
            <div class="mio-ruolo-section">
                <div class="mio-ruolo-title">
                    <span class="dot" style="background:${colorMap[ruolo] || 'var(--text-3)'};"></span>
                    ${iconMap[ruolo] || ''} ${ruolo} <span style="font-size:.8rem;color:var(--text-3);font-weight:400;">(${giocatoriRuolo.length})</span>
                </div>
                <div class="mio-giocatori-grid">
        `;
        
        giocatoriRuolo.forEach(g => {
            html += `
                <div class="mio-card">
                    <div class="mio-logo">
                        ${g.logo_url ? `<img src="${g.logo_url}" alt="${g.squadra}" onerror="this.style.display='none'; this.parentElement.innerHTML='<span class=\\'mio-logo-fb\\'>${g.squadra.charAt(0)}</span>'" />` : `<span class="mio-logo-fb">${g.squadra.charAt(0)}</span>`}
                    </div>
                    <div class="mio-info">
                        <div class="mio-nome">${g.nome}</div>
                        <div class="mio-squadra">${g.squadra}</div>
                    </div>
                    ${g.numero ? `<span class="mio-quota">${g.numero}</span>` : ''}
                    <button class="btn-remove" onclick="removeFromMioListone('${g.nome}', '${g.squadra}')" title="Rimuovi">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// ============================================================
//  CONTATORI
// ============================================================
function aggiornaContatori() {
    const totalPlayers = squadre.reduce((acc, s) => acc + (s.giocatori || []).length, 0);
    document.getElementById('totalGiocatori').textContent = totalPlayers;
    document.getElementById('totalMieiCount').textContent = mioListone.length;
}

// ============================================================
//  SWITCH TAB
// ============================================================
function switchTab(tab) {
    // Tabs
    document.querySelectorAll('.btn-tab').forEach(b => b.classList.remove('active'));
    if (tab === 'listone') {
        document.getElementById('tabListone').classList.add('active');
        document.getElementById('panelListone').classList.remove('hidden');
        document.getElementById('panelMio').classList.add('hidden');
        document.getElementById('toolbarListone').classList.remove('hidden');
        document.getElementById('toolbarMio').classList.add('hidden');
    } else {
        document.getElementById('tabMio').classList.add('active');
        document.getElementById('panelListone').classList.add('hidden');
        document.getElementById('panelMio').classList.remove('hidden');
        document.getElementById('toolbarListone').classList.add('hidden');
        document.getElementById('toolbarMio').classList.remove('hidden');
        renderMioListone();
    }
}