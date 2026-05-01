"""
Scraper para SoccerSTATS - Extracción de estadísticas de equipos de fútbol
"""
import json
import time
import logging
from typing import Dict, List, Any, Optional
from dataclasses import dataclass, asdict

import requests
from bs4 import BeautifulSoup

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@dataclass
class TeamStatsData:
    """Estructura de datos para estadísticas de equipo"""
    id: int
    name: str
    goals: Dict[str, Dict[str, float]]
    scored_conceded: Dict[str, Dict[str, float]]
    rates: Dict[str, Dict[str, float]]
    corners_for: Dict[str, Dict[str, float]]
    corners_against: Dict[str, Dict[str, float]]
    Total_corners: Dict[str, Dict[str, float]]


class SoccerStatsScraper:
    """Scraper para SoccerSTATS.com"""

    BASE_URL = "https://www.soccerstats.com"
    USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"

    # URLs de ejemplo para Bundesliga
    DEFAULT_LEAGUES = {
        "alemania": [
            "https://www.soccerstats.com/teamstats.asp?league=germany&stats=u1392-bayern-munich",
            "https://www.soccerstats.com/teamstats.asp?league=germany&stats=u1404-dortmund",
            "https://www.soccerstats.com/teamstats.asp?league=germany&stats=u1402-stuttgart",
            "https://www.soccerstats.com/teamstats.asp?league=germany&stats=u1406-rb-leipzig",
            "https://www.soccerstats.com/teamstats.asp?league=germany&stats=u1409-leverkusen",
        ]
    }

    # Filas específicas para extracción de datos
    HOME_FILAS = [58, 60, 62, 64, 66, 76, 78, 98, 100, 102, 104, 106]
    AWAY_FILAS = [111, 113, 115, 117, 119, 129, 131, 151, 153, 155, 157, 159]

    def __init__(self, delay: float = 2.0):
        self.delay = delay
        self.session = requests.Session()
        self.session.headers.update({"User-Agent": self.USER_AGENT})

    def _make_request(self, url: str, max_retries: int = 3) -> Optional[BeautifulSoup]:
        """Realiza request con reintentos"""
        for attempt in range(max_retries):
            try:
                response = self.session.get(url, timeout=30)
                response.raise_for_status()
                return BeautifulSoup(response.text, "html.parser")
            except Exception as e:
                logger.warning(f"Attempt {attempt + 1} failed for {url}: {e}")
                time.sleep(self.delay * (attempt + 1))
        return None

    def _initialize_corners(self, keys: List[str]) -> Dict[str, Dict[str, float]]:
        """Inicializa estructura de corners"""
        return {key: 0.0 for key in keys}

    def _process_filas(
        self,
        filas_objetivo: List[int],
        filas: List[Any],
        seccion: str,
        data: Dict[str, Any]
    ) -> None:
        """Procesa filas de estadísticas de goles"""
        mapping = [
            "win", "draw", "defeats", "goals_scored_per_game",
            "goals_conceded_per_game", "team_scored_first",
            "opponent_scored_first", "total_goal_per_game",
            "over_1_5", "over_2_5", "over_3_5", "both_teams_scored"
        ]

        idx = 0
        for fila_idx in filas_objetivo:
            try:
                fila = filas[fila_idx]
                columnas = fila.find_all(["td", "th"])
                if len(columnas) >= 3:
                    valor = columnas[2].text.strip().replace("%", "").replace(",", ".")
                    if valor:
                        data["goals"][seccion][mapping[idx]] = float(valor)
                        idx += 1
            except Exception as e:
                logger.warning(f"Error en fila {fila_idx}: {e}")

    def _process_goles(self, soup: BeautifulSoup, data: Dict[str, Any]) -> None:
        """Procesa tabla de comparación de goles"""
        h2_goles = soup.find("h2", string=lambda text: text and "Comparison with league average" in text)
        if not h2_goles:
            logger.warning(f"No se encontró tabla de goles para {data['name']}")
            return

        tabla = h2_goles.find_next("table")
        filas = tabla.find_all("tr")
        self._process_filas(self.HOME_FILAS, filas, "home", data)
        self._process_filas(self.AWAY_FILAS, filas, "away", data)

    def _process_corners_tipo(
        self,
        soup: BeautifulSoup,
        h2_text: str,
        key_name: str,
        keys_map: Dict[str, str],
        data: Dict[str, Any]
    ) -> None:
        """Procesa tablas de corners"""
        h2 = soup.find("h2", string=lambda text: text and h2_text in text)
        if not h2:
            return

        try:
            tabla = h2.find_next("table")
            filas = tabla.find_all("tr")

            headers = []
            for col in filas[0].find_all(["td", "th"])[1:7]:
                texto = col.text.strip().lower().replace("+", "").replace(".", "_").replace(" ", "_")
                if "avg" in texto:
                    headers.append("avg")
                else:
                    headers.append(keys_map.get(texto, f"over_{texto}"))

            home_vals = [col.text.strip().replace("%", "").replace(",", ".")
                        for col in filas[1].find_all(["td", "th"])[1:7]]
            away_vals = [col.text.strip().replace("%", "").replace(",", ".")
                        for col in filas[2].find_all(["td", "th"])[1:7]]

            data[key_name]["home"] = {}
            data[key_name]["away"] = {}

            for idx, key in enumerate(headers):
                try:
                    data[key_name]["home"][key] = float(home_vals[idx])
                    data[key_name]["away"][key] = float(away_vals[idx])
                except (ValueError, IndexError):
                    pass
        except Exception as e:
            logger.warning(f"Error procesando {h2_text}: {e}")

    def _extract_scored_conceded(self, soup: BeautifulSoup) -> Dict[str, Dict[str, float]]:
        """Extrae datos de Goals scored / Goals conceded"""
        data = {"home": {}, "away": {}}
        try:
            h2 = soup.find("h2", string=lambda t: t and "Goals scored / Goals conceded" in t)
            if not h2:
                return data

            table = h2.find_next("table")
            rows = table.find_all("tr")[1:]
            for row in rows:
                cols = row.find_all("td")
                if len(cols) >= 3:
                    key = cols[0].text.strip().lower().replace(" ", "_").replace(".", "").replace("+", "plus").replace("/", "_").replace(">", "over")
                    for idx, side in enumerate(["home", "away"]):
                        val = cols[idx + 1].text.strip().replace("%", "")
                        try:
                            data[side][key] = int(val)
                        except ValueError:
                            data[side][key] = 0.0
        except Exception as e:
            logger.warning(f"Error en scored_conceded: {e}")
        return data

    def _extract_rates(self, soup: BeautifulSoup) -> Dict[str, Dict[str, float]]:
        """Extrae datos de Scoring & Conceding rates"""
        data = {"home": {}, "away": {}}
        try:
            h2 = soup.find("h2", string=lambda t: t and "Scoring & Conceding rates" in t)
            if not h2:
                return data

            table = h2.find_next("table")
            rows = table.find_all("tr")[1:]
            for row in rows:
                cols = row.find_all("td")
                if len(cols) >= 3:
                    key = cols[0].text.strip().lower().replace(" ", "_").replace(".", "").replace("+", "plus").replace("/", "_").replace(">", "over").replace("-", "_")
                    for idx, side in enumerate(["home", "away"]):
                        val = cols[idx + 1].text.strip().replace("%", "")
                        try:
                            data[side][key] = int(val)
                        except ValueError:
                            data[side][key] = 0.0
        except Exception as e:
            logger.warning(f"Error en rates: {e}")
        return data

    def scrape_team(self, url: str, team_id: int) -> Optional[TeamStatsData]:
        """Scrapea datos de un equipo específico"""
        time.sleep(self.delay)

        soup = self._make_request(url)
        if not soup:
            logger.error(f"Failed to fetch {url}")
            return None

        # Buscar nombre del equipo
        nombre_equipo = f"Equipo_{team_id}"
        h2_goles = soup.find("h2", string=lambda text: text and "Comparison with league average" in text)
        if h2_goles:
            try:
                tabla_goles = h2_goles.find_next("table")
                filas = tabla_goles.find_all("tr")
                nombre_equipo = filas[1].find_all(["td", "th"])[1].text.strip()
            except Exception as e:
                logger.warning(f"Error extrayendo nombre del equipo: {e}")

        # Inicializar estructura de datos
        data = {
            "id": team_id,
            "name": nombre_equipo,
            "goals": {"home": {}, "away": {}},
            "scored_conceded": self._extract_scored_conceded(soup),
            "rates": self._extract_rates(soup),
            "corners_for": {
                "home": {"avg": 0, "over_2_5": 0, "over_3_5": 0, "over_4_5": 0, "over_5_5": 0, "over_6_5": 0},
                "away": {"avg": 0, "over_2_5": 0, "over_3_5": 0, "over_4_5": 0, "over_5_5": 0, "over_6_5": 0}
            },
            "corners_against": {
                "home": {"avg": 0, "over_2_5": 0, "over_3_5": 0, "over_4_5": 0, "over_5_5": 0, "over_6_5": 0},
                "away": {"avg": 0, "over_2_5": 0, "over_3_5": 0, "over_4_5": 0, "over_5_5": 0, "over_6_5": 0}
            },
            "Total_corners": {
                "home": {"avg": 0, "over_9_5": 0, "over_10_5": 0, "over_11_5": 0, "over_12_5": 0, "over_13_5": 0},
                "away": {"avg": 0, "over_9_5": 0, "over_10_5": 0, "over_11_5": 0, "over_12_5": 0, "over_13_5": 0}
            }
        }

        # Procesar datos
        self._process_goles(soup, data)

        keys_map_for = {
            "avg": "avg", "2_5": "over_2_5", "3_5": "over_3_5",
            "4_5": "over_4_5", "5_5": "over_5_5", "6_5": "over_6_5"
        }
        keys_map_total = {
            "avg": "avg", "9_5": "over_9_5", "10_5": "over_10_5",
            "11_5": "over_11_5", "12_5": "over_12_5", "13_5": "over_13_5"
        }

        self._process_corners_tipo(soup, "Corners For", "corners_for", keys_map_for, data)
        self._process_corners_tipo(soup, "Corners Against", "corners_against", keys_map_for, data)
        self._process_corners_tipo(soup, "Total corners", "Total_corners", keys_map_total, data)

        logger.info(f"✓ {nombre_equipo} scrapeado correctamente")
        return TeamStatsData(**data)

    def scrape_league(self, league_name: str, urls: List[str]) -> List[Dict[str, Any]]:
        """Scrapea todos los equipos de una liga"""
        equipos = []
        for idx, url in enumerate(urls, 1):
            equipo = self.scrape_team(url, idx)
            if equipo:
                equipos.append(asdict(equipo))
        return equipos

    def save_to_json(self, data: List[Dict[str, Any]], filename: str) -> None:
        """Guarda los datos en un archivo JSON"""
        with open(filename, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=4, ensure_ascii=False)
        logger.info(f"✓ Datos guardados en {filename}")


def main():
    """Función principal para pruebas"""
    scraper = SoccerStatsScraper(delay=2.0)

    # Ejemplo: scrape Bundesliga (solo 5 equipos para prueba)
    urls = SoccerStatsScraper.DEFAULT_LEAGUES["alemania"]

    print(f"Iniciando scraping de {len(urls)} equipos...")
    equipos = scraper.scrape_league("alemania", urls)

    # Guardar en JSON
    scraper.save_to_json(equipos, "alemania.json")
    print(f"✓ Scraping completado. {len(equipos)} equipos procesados.")


if __name__ == "__main__":
    main()