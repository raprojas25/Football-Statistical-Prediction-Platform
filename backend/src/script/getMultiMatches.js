import axios from "axios";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url"; // necesario si usás ES modules

// Si usás "type": "module" en package.json, necesitás esto para tener __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_KEY = "0581031764294ddfaeb01bf29163f2e7";
const HEADERS = { "X-Auth-Token": API_KEY };
const BASE_URL = "https://api.football-data.org/v4";

const LIGAS = {
  BSA: { name: "Serie A (Brasil)", country: "Brasil", file: "BSA" },
  DED: { name: "Eredivisie", country: "Holanda", file: "DED" },
  BL1: { name: "Bundesliga", country: "Alemania", file: "BL1" },
  PL: { name: "Premier League", country: "Inglaterra", file: "PL" },
  PD: { name: "La Liga", country: "España", file: "PD" },
  SA: { name: "Serie A (Italia)", country: "Italia", file: "SA" },
  FL1: { name: "Ligue 1", country: "Francia", file: "FL1" },
  PO: { name: "Primeira Liga", country: "Portugal", file: "PO" },
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
      `❌ Error en ${competitionCode}:`,
      err.response?.status || err.message,
    );
    return [];
  }
}

async function main() {
  console.log("📅 Scraper de próximos partidos por país\n");

  // 1. Calcular la ruta de salida
  const projectRoot = path.resolve(__dirname, "../../../");
  const outputDir = path.join(
    projectRoot,
    "frontend",
    "public",
    "data",
    "partidos",
  );

  // 2. Crear la carpeta si no existe
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    console.log(`📁 Carpeta creada: ${outputDir}`);
  }

  let totalMatches = 0;

  // 3. Obtener y guardar partidos por liga
  for (const [code, info] of Object.entries(LIGAS)) {
    console.log(`🔍 Buscando ${info.name} (${code})...`);
    const matches = await getMatches(code, 14);
    console.log(`   ✅ ${matches.length} partidos encontrados`);

    const payload = {
      generated_at: new Date().toISOString(),
      competition: code,
      competition_name: info.name,
      country: info.country,
      count: matches.length,
      matches,
    };

    const filePath = path.join(outputDir, `${info.file}.json`);
    fs.writeFileSync(filePath, JSON.stringify(payload, null, 2));
    console.log(`   💾 Guardado en ${filePath}`);

    totalMatches += matches.length;
  }

  console.log(
    `\n✅ Total general: ${totalMatches} partidos en ${Object.keys(LIGAS).length} archivos.`,
  );
  console.log(`📂 Ubicación: ${outputDir}`);
}

main();
