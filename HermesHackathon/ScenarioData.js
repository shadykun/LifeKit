export const CPR_SCENARIO = [
    {
      id: 'start',
      text: "Ești în parc. Un bărbat de aproximativ 50 de ani se prăbușește brusc în fața ta. Nu se mai mișcă. Ce faci?",
      // Folosim o imagine placeholder online
      image: 'https://img.icons8.com/fluency/240/fallen-person.png', 
      choices: [
        { text: "Îl scutur de umeri și strig: 'Domnule, sunteți bine?'", nextNodeId: 'check_response' },
        { text: "Încep imediat compresiile toracice.", nextNodeId: 'game_over_1' },
        { text: "Sun la 112 și aștept instrucțiuni.", nextNodeId: 'call_112_passive' }
      ]
    },
    {
      id: 'check_response',
      text: "Bărbatul nu reacționează deloc la stimulii tăi. Nu răspunde și nu se mișcă.",
      image: 'https://img.icons8.com/fluency/240/unconscious-person.png',
      choices: [
        { text: "Verific dacă respiră (Privesc, Ascult, Simt).", nextNodeId: 'check_breathing' },
        { text: "Îi dau câteva palme peste față.", nextNodeId: 'game_over_slap' }
      ]
    },
    {
      id: 'check_breathing',
      text: "Te apleci deasupra gurii lui. Nu simți aerul pe obraz, toracele nu se mișcă. Victima este în Stop Cardio-Respirator.",
      image: 'https://img.icons8.com/fluency/240/breathing-exercise.png',
      choices: [
        { text: "Sun la 112 și cer un defibrilator, apoi încep RCP.", nextNodeId: 'start_cpr' },
        { text: "Încep RCP imediat, sun la 112 mai târziu.", nextNodeId: 'game_over_delay' }
      ]
    },
    {
      id: 'start_cpr',
      text: "BRAVO! Ai alertat serviciile. Acum trebuie să începi masajul cardiac. Unde plasezi mâinile?",
      image: 'https://img.icons8.com/fluency/240/cpr.png',
      choices: [
        { text: "În centrul pieptului, pe stern.", nextNodeId: 'cpr_rhythm' },
        { text: "În partea stângă, în dreptul inimii.", nextNodeId: 'game_over_position' }
      ]
    },
    {
      id: 'cpr_rhythm',
      text: "Corect! Începi compresiile. Cu ce ritm apeși?",
      image: 'https://img.icons8.com/fluency/240/heart-beat.png',
      choices: [
        { text: "100-120 compresii pe minut (Ritm rapid).", nextNodeId: 'success' },
        { text: "60 compresii pe minut (Ritm lent).", nextNodeId: 'game_over_slow' }
      ]
    },
    // --- FINALE (Terminal Nodes) ---
    {
      id: 'success',
      text: "FELICITĂRI! 🏆\nAmbulanța a sosit. Datorită ție, sângele oxigenat a continuat să circule spre creier. Ai salvat o viață!",
      isTerminal: true,
      success: true
    },
    {
      id: 'game_over_1',
      text: "GREȘIT! ❌\nNu începi niciodată RCP fără să verifici conștiența. Poate omul doar a leșinat.",
      isTerminal: true,
      success: false
    },
    {
      id: 'call_112_passive',
      text: "GREȘIT! ❌\nÎn stop cardio-respirator, fiecare secundă contează. Creierul moare în 3-4 minute fără oxigen.",
      isTerminal: true,
      success: false
    },
    {
      id: 'game_over_slap',
      text: "GREȘIT! ❌\nNu agresăm victima. Dacă nu răspunde la scuturat umerii, e inconștientă.",
      isTerminal: true,
      success: false
    },
    {
      id: 'game_over_delay',
      text: "GREȘIT! ❌\nTrebuie să suni la 112 PRIMUL lucru pentru a chema ajutor specializat.",
      isTerminal: true,
      success: false
    },
    {
      id: 'game_over_position',
      text: "GREȘIT! ❌\nCompresiile se fac pe STERN (centrul pieptului), nu pe coaste în stânga.",
      isTerminal: true,
      success: false
    },
    {
      id: 'game_over_slow',
      text: "GREȘIT! ❌\n60 bpm este prea lent. Ritmul corect este 100-120 bpm.",
      isTerminal: true,
      success: false
    }
  ];