import axios from "axios";
import fs from "fs";

const API_KEY = "0581031764294ddfaeb01bf29163f2e7";
const HEADERS = { "X-Auth-Token": API_KEY };
const BASE_URL = "https://api.football-data.org/v4";

const LIGAS = {
  BSA: { name: "Serie A", country: "Brasil" },
  DED: { name: "Eredivisie", country: "Holanda" },
  BL1: { name: "Bundesliga", country: "Alemania" },
  PL: { name: "Premier League", country: "Inglaterra" },
  PD: { name: "La Liga", country: "España" },
  SA: { name: "Serie A", country: "Italia" },
  FL1: { name: "Ligue 1", country: "Francia" },
  PO: { name: "Primeira Liga", country: "Portugal" },
  //
  // CL: { name: 'Champions League', country: 'Europa' },
  // SC1: { name: 'Scottish Premiership', country: 'Escocia' },
  // TR: { name: 'Super Lig', country: 'Turquía' },
  // EL: { name: 'Europa League', country: 'Europa' },
  // BE1: { name: 'Pro League', country: 'Bélgica' },
};

async function getMatches(competitionCode, daysAhead = 14) {
  const today = new Date().toISOString().split("T")[0];
  const endDate = new Date(Date.now() + daysAhead * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  const url = `${BASE_URL}/competitions/${competitionCode}/matches`;

  try {
    const resp = await axios.get(url, {
      headers: HEADERS,
      params: { dateFrom: today, dateTo: endDate, status: "SCHEDULED" },
    });

    return resp.data.matches.map((m) => ({
      id: m.id,
      homeTeam: m.homeTeam?.name,
      awayTeam: m.awayTeam?.name,
      date: m.utcDate,
      competition: competitionCode,
      matchday: m.matchday,
    }));
  } catch (err) {
    console.error(
      `Error ${competitionCode}:`,
      err.response?.status || err.message,
    );
    return [];
  }
}

async function getAllMatches(daysAhead = 14) {
  const allMatches = [];

  for (const [code, info] of Object.entries(LIGAS)) {
    console.log(`🔍 ${info.name}...`);
    const matches = await getMatches(code, daysAhead);
    console.log(`   ✅ ${matches.length} partidos`);
    allMatches.push(...matches);
  }

  return allMatches;
}

async function main() {
  console.log("📅 Scraper de Partidos - Football-Data.org\n");

  const matches = await getAllMatches(14);

  console.log(`\n✅ Total: ${matches.length} partidos`);

  const summary = {};
  for (const m of matches) {
    summary[m.competition] = (summary[m.competition] || 0) + 1;
  }

  console.log("\n📊 Resumen:");
  for (const [code, count] of Object.entries(summary)) {
    console.log(`  ${LIGAS[code]?.name || code}: ${count}`);
  }

  fs.writeFileSync(
    "partidos.json",
    JSON.stringify(
      {
        generated_at: new Date().toISOString(),
        count: matches.length,
        matches,
      },
      null,
      2,
    ),
  );

  console.log("\n💾 Guardado en partidos.json");
}

main();

import axios from "axios";
import fs from "fs";
import path from "path";
// Resto de tu código...

async function main() {
  console.log("📅 Scraper de Partidos - Football-Data.org\n");

  const matches = await getAllMatches(14);

  console.log(`\n✅ Total: ${matches.length} partidos`);

  const summary = {};
  for (const m of matches) {
    summary[m.competition] = (summary[m.competition] || 0) + 1;
  }

  console.log("\n📊 Resumen:");
  for (const [code, count] of Object.entries(summary)) {
    console.log(`  ${LIGAS[code]?.name || code}: ${count}`);
  }

  // Define la ruta para guardar el archivo
  const outputPath = path.join(
    __dirname,
    "../../frontend/public/data/partidos.json",
  );

  fs.writeFileSync(
    outputPath,
    JSON.stringify(
      {
        generated_at: new Date().toISOString(),
        count: matches.length,
        matches,
      },
      null,
      2,
    ),
  );

  console.log("\n💾 Guardado en partidos.json");
}

// Llama a la función principal
main();
