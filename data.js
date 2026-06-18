// ============================================================
//  DATI SERIE A 2026-27 · SQUADRE E GIOCATORI (ESEMPIO)
//  Fonte squadre: Sky Sport (20 squadre)
//  Giocatori: lista di esempio con ruoli
// ============================================================

const serieAData = {
    "stagione": "2026-2027",
    "squadre": [
        {
            "id": 1,
            "nome": "Atalanta",
            "giocatori": [
                { "nome": "Carnesecchi", "ruolo": "Portiere" },
                { "nome": "Djimsiti", "ruolo": "Difensore" },
                { "nome": "Hien", "ruolo": "Difensore" },
                { "nome": "Kolasinac", "ruolo": "Difensore" },
                { "nome": "De Roon", "ruolo": "Centrocampista" },
                { "nome": "Ederson", "ruolo": "Centrocampista" },
                { "nome": "Lookman", "ruolo": "Attaccante" },
                { "nome": "Scamacca", "ruolo": "Attaccante" }
            ]
        },
        {
            "id": 2,
            "nome": "Bologna",
            "giocatori": [
                { "nome": "Skorupski", "ruolo": "Portiere" },
                { "nome": "Posch", "ruolo": "Difensore" },
                { "nome": "Beukema", "ruolo": "Difensore" },
                { "nome": "Lucumí", "ruolo": "Difensore" },
                { "nome": "Aebischer", "ruolo": "Centrocampista" },
                { "nome": "Ferguson", "ruolo": "Centrocampista" },
                { "nome": "Orsolini", "ruolo": "Attaccante" },
                { "nome": "Zirkzee", "ruolo": "Attaccante" }
            ]
        },
        {
            "id": 3,
            "nome": "Cagliari",
            "giocatori": [
                { "nome": "Scuffet", "ruolo": "Portiere" },
                { "nome": "Mina", "ruolo": "Difensore" },
                { "nome": "Obert", "ruolo": "Difensore" },
                { "nome": "Augello", "ruolo": "Difensore" },
                { "nome": "Makoumbou", "ruolo": "Centrocampista" },
                { "nome": "Deiola", "ruolo": "Centrocampista" },
                { "nome": "Pavoletti", "ruolo": "Attaccante" },
                { "nome": "Luvumbo", "ruolo": "Attaccante" }
            ]
        },
        {
            "id": 4,
            "nome": "Como",
            "giocatori": [
                { "nome": "Audero", "ruolo": "Portiere" },
                { "nome": "Goldaniga", "ruolo": "Difensore" },
                { "nome": "Curto", "ruolo": "Difensore" },
                { "nome": "Iovine", "ruolo": "Difensore" },
                { "nome": "Bellemo", "ruolo": "Centrocampista" },
                { "nome": "Baselli", "ruolo": "Centrocampista" },
                { "nome": "Cutrone", "ruolo": "Attaccante" },
                { "nome": "Gabrielloni", "ruolo": "Attaccante" }
            ]
        },
        {
            "id": 5,
            "nome": "Empoli",
            "giocatori": [
                { "nome": "Vicario", "ruolo": "Portiere" },
                { "nome": "Ismajli", "ruolo": "Difensore" },
                { "nome": "Walukiewicz", "ruolo": "Difensore" },
                { "nome": "Cacace", "ruolo": "Difensore" },
                { "nome": "Maleh", "ruolo": "Centrocampista" },
                { "nome": "Marin", "ruolo": "Centrocampista" },
                { "nome": "Caputo", "ruolo": "Attaccante" },
                { "nome": "Baldanzi", "ruolo": "Attaccante" }
            ]
        },
        {
            "id": 6,
            "nome": "Fiorentina",
            "giocatori": [
                { "nome": "Terracciano", "ruolo": "Portiere" },
                { "nome": "Milenkovic", "ruolo": "Difensore" },
                { "nome": "Martinez Quarta", "ruolo": "Difensore" },
                { "nome": "Biraghi", "ruolo": "Difensore" },
                { "nome": "Bonaventura", "ruolo": "Centrocampista" },
                { "nome": "Mandragora", "ruolo": "Centrocampista" },
                { "nome": "González", "ruolo": "Attaccante" },
                { "nome": "Beltran", "ruolo": "Attaccante" }
            ]
        },
        {
            "id": 7,
            "nome": "Genoa",
            "giocatori": [
                { "nome": "Martínez", "ruolo": "Portiere" },
                { "nome": "Vásquez", "ruolo": "Difensore" },
                { "nome": "Bani", "ruolo": "Difensore" },
                { "nome": "Martin", "ruolo": "Difensore" },
                { "nome": "Frendrup", "ruolo": "Centrocampista" },
                { "nome": "Badelj", "ruolo": "Centrocampista" },
                { "nome": "Retegui", "ruolo": "Attaccante" },
                { "nome": "Gudmundsson", "ruolo": "Attaccante" }
            ]
        },
        {
            "id": 8,
            "nome": "Inter",
            "giocatori": [
                { "nome": "Sommer", "ruolo": "Portiere" },
                { "nome": "Pavard", "ruolo": "Difensore" },
                { "nome": "Acerbi", "ruolo": "Difensore" },
                { "nome": "Bastoni", "ruolo": "Difensore" },
                { "nome": "Barella", "ruolo": "Centrocampista" },
                { "nome": "Calhanoglu", "ruolo": "Centrocampista" },
                { "nome": "Mkhitaryan", "ruolo": "Centrocampista" },
                { "nome": "Lautaro", "ruolo": "Attaccante" },
                { "nome": "Thuram", "ruolo": "Attaccante" }
            ]
        },
        {
            "id": 9,
            "nome": "Juventus",
            "giocatori": [
                { "nome": "Szczesny", "ruolo": "Portiere" },
                { "nome": "Danilo", "ruolo": "Difensore" },
                { "nome": "Bremer", "ruolo": "Difensore" },
                { "nome": "Cambiaso", "ruolo": "Difensore" },
                { "nome": "Locatelli", "ruolo": "Centrocampista" },
                { "nome": "Rabiot", "ruolo": "Centrocampista" },
                { "nome": "Chiesa", "ruolo": "Attaccante" },
                { "nome": "Vlahovic", "ruolo": "Attaccante" }
            ]
        },
        {
            "id": 10,
            "nome": "Lazio",
            "giocatori": [
                { "nome": "Provedel", "ruolo": "Portiere" },
                { "nome": "Romagnoli", "ruolo": "Difensore" },
                { "nome": "Casale", "ruolo": "Difensore" },
                { "nome": "Hysaj", "ruolo": "Difensore" },
                { "nome": "Rovella", "ruolo": "Centrocampista" },
                { "nome": "Alberto", "ruolo": "Centrocampista" },
                { "nome": "Zaccagni", "ruolo": "Attaccante" },
                { "nome": "Immobile", "ruolo": "Attaccante" }
            ]
        },
        {
            "id": 11,
            "nome": "Lecce",
            "giocatori": [
                { "nome": "Falcone", "ruolo": "Portiere" },
                { "nome": "Baschirotto", "ruolo": "Difensore" },
                { "nome": "Toumba", "ruolo": "Difensore" },
                { "nome": "Gallo", "ruolo": "Difensore" },
                { "nome": "Blin", "ruolo": "Centrocampista" },
                { "nome": "Oudin", "ruolo": "Centrocampista" },
                { "nome": "Sansone", "ruolo": "Attaccante" },
                { "nome": "Krstovic", "ruolo": "Attaccante" }
            ]
        },
        {
            "id": 12,
            "nome": "Milan",
            "giocatori": [
                { "nome": "Maignan", "ruolo": "Portiere" },
                { "nome": "Tomori", "ruolo": "Difensore" },
                { "nome": "Thiaw", "ruolo": "Difensore" },
                { "nome": "Theo", "ruolo": "Difensore" },
                { "nome": "Reijnders", "ruolo": "Centrocampista" },
                { "nome": "Bennacer", "ruolo": "Centrocampista" },
                { "nome": "Leão", "ruolo": "Attaccante" },
                { "nome": "Giroud", "ruolo": "Attaccante" }
            ]
        },
        {
            "id": 13,
            "nome": "Monza",
            "giocatori": [
                { "nome": "Di Gregorio", "ruolo": "Portiere" },
                { "nome": "Mari", "ruolo": "Difensore" },
                { "nome": "Izzo", "ruolo": "Difensore" },
                { "nome": "Caldirola", "ruolo": "Difensore" },
                { "nome": "Pessina", "ruolo": "Centrocampista" },
                { "nome": "Gagliardini", "ruolo": "Centrocampista" },
                { "nome": "Colombo", "ruolo": "Attaccante" },
                { "nome": "Mota", "ruolo": "Attaccante" }
            ]
        },
        {
            "id": 14,
            "nome": "Napoli",
            "giocatori": [
                { "nome": "Meret", "ruolo": "Portiere" },
                { "nome": "Di Lorenzo", "ruolo": "Difensore" },
                { "nome": "Rrahmani", "ruolo": "Difensore" },
                { "nome": "Juan Jesus", "ruolo": "Difensore" },
                { "nome": "Lobotka", "ruolo": "Centrocampista" },
                { "nome": "Zielinski", "ruolo": "Centrocampista" },
                { "nome": "Kvaratskhelia", "ruolo": "Attaccante" },
                { "nome": "Osimhen", "ruolo": "Attaccante" }
            ]
        },
        {
            "id": 15,
            "nome": "Parma",
            "giocatori": [
                { "nome": "Buffon", "ruolo": "Portiere" },
                { "nome": "Del Prato", "ruolo": "Difensore" },
                { "nome": "Balogh", "ruolo": "Difensore" },
                { "nome": "Coulibaly", "ruolo": "Difensore" },
                { "nome": "Sohm", "ruolo": "Centrocampista" },
                { "nome": "Bernabé", "ruolo": "Centrocampista" },
                { "nome": "Man", "ruolo": "Attaccante" },
                { "nome": "Benedyczak", "ruolo": "Attaccante" }
            ]
        },
        {
            "id": 16,
            "nome": "Roma",
            "giocatori": [
                { "nome": "Patricio", "ruolo": "Portiere" },
                { "nome": "Mancini", "ruolo": "Difensore" },
                { "nome": "Ndicka", "ruolo": "Difensore" },
                { "nome": "Spinazzola", "ruolo": "Difensore" },
                { "nome": "Cristante", "ruolo": "Centrocampista" },
                { "nome": "Paredes", "ruolo": "Centrocampista" },
                { "nome": "Dybala", "ruolo": "Attaccante" },
                { "nome": "Lukaku", "ruolo": "Attaccante" }
            ]
        },
        {
            "id": 17,
            "nome": "Salernitana",
            "giocatori": [
                { "nome": "Ochoa", "ruolo": "Portiere" },
                { "nome": "Fazio", "ruolo": "Difensore" },
                { "nome": "Gyömbér", "ruolo": "Difensore" },
                { "nome": "Zortea", "ruolo": "Difensore" },
                { "nome": "Maggiore", "ruolo": "Centrocampista" },
                { "nome": "Coulibaly", "ruolo": "Centrocampista" },
                { "nome": "Dia", "ruolo": "Attaccante" },
                { "nome": "Simy", "ruolo": "Attaccante" }
            ]
        },
        {
            "id": 18,
            "nome": "Sassuolo",
            "giocatori": [
                { "nome": "Consigli", "ruolo": "Portiere" },
                { "nome": "Erlic", "ruolo": "Difensore" },
                { "nome": "Tressoldi", "ruolo": "Difensore" },
                { "nome": "Doig", "ruolo": "Difensore" },
                { "nome": "Frattesi", "ruolo": "Centrocampista" },
                { "nome": "Thorstvedt", "ruolo": "Centrocampista" },
                { "nome": "Berardi", "ruolo": "Attaccante" },
                { "nome": "Pinamonti", "ruolo": "Attaccante" }
            ]
        },
        {
            "id": 19,
            "nome": "Torino",
            "giocatori": [
                { "nome": "Milinkovic", "ruolo": "Portiere" },
                { "nome": "Schuurs", "ruolo": "Difensore" },
                { "nome": "Buongiorno", "ruolo": "Difensore" },
                { "nome": "Rodriguez", "ruolo": "Difensore" },
                { "nome": "Ricci", "ruolo": "Centrocampista" },
                { "nome": "Ilic", "ruolo": "Centrocampista" },
                { "nome": "Sanabria", "ruolo": "Attaccante" },
                { "nome": "Zapata", "ruolo": "Attaccante" }
            ]
        },
        {
            "id": 20,
            "nome": "Udinese",
            "giocatori": [
                { "nome": "Silvestri", "ruolo": "Portiere" },
                { "nome": "Becao", "ruolo": "Difensore" },
                { "nome": "Perez", "ruolo": "Difensore" },
                { "nome": "Kamara", "ruolo": "Difensore" },
                { "nome": "Walace", "ruolo": "Centrocampista" },
                { "nome": "Lovric", "ruolo": "Centrocampista" },
                { "nome": "Thauvin", "ruolo": "Attaccante" },
                { "nome": "Lucca", "ruolo": "Attaccante" }
            ]
        }
    ]
};