#!/usr/bin/env python3
"""
Scraper Multi-Ligas para SoccerSTATS
Obtiene equipos de múltiples ligas y scrapea sus estadísticas
"""
import json
import time
import os
import sys

try:
    import requests
    from bs4 import BeautifulSoup
except ImportError:
    print("❌ Instala las dependencias: pip install requests beautifulsoup4 lxml")
    sys.exit(1)

# ============================================
# CONFIGURACIÓN - Añade las ligas que quieras
# ============================================
LIGAS = {
    "brasil": "https://www.soccerstats.com/latest.asp?league=brazil",
    "italia": "https://www.soccerstats.com/latest.asp?league=italy",
    "paisesbajos": "https://www.soccerstats.com/latest.asp?league=netherlands",
    "francia": "https://www.soccerstats.com/latest.asp?league=france",
    "noruega":"https://www.soccerstats.com/latest.asp?league=norway",
    "peru": "https://www.soccerstats.com/latest.asp?league=peru",
    "inglaterra":"https://www.soccerstats.com/latest.asp?league=england",
    "alemania":"https://www.soccerstats.com/latest.asp?league=germany",
    "portugal":"https://www.soccerstats.com/latest.asp?league=portugal2",
    "spain":"https://www.soccerstats.com/latest.asp?league=spain",
    "":"",
    "alemania": "https://www.soccerstats.com/latest.asp?league=germany",
    "espana": "https://www.soccerstats.com/latest.asp?league=spain",
    "italia": "https://www.soccerstats.com/latest.asp?league=italy",
    "francia": "https://www.soccerstats.com/latest.asp?league=france",
    "holanda": "https://www.soccerstats.com/latest.asp?league=netherlands",
    "belgica": "https://www.soccerstats.com/latest.asp?league=belgium",
    "portugal": "https://www.soccerstats.com/latest.asp?league=portugal",
    "esclandia": "https://www.soccerstats.com/latest.asp?league=scotland",
    "turquia": "https://www.soccerstats.com/latest.asp?league=turkey",
    "grecia": "https://www.soccerstats.com/latest.asp?league=greece",
    "rusia": "https://www.soccerstats.com/latest.asp?league=russia",
}

BASE_URL = "https://www.soccerstats.com/"
HEADERS = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}
DELAY = 2  # Segundos entre requests

# Filas para extraer datos de goles (puede variar por liga)
HOME_FILAS = [58, 60, 62, 64, 66, 76, 78, 98, 100, 102, 104, 106]
AWAY_FILAS = [111, 113, 115, 117, 119, 129, 131, 151, 153, 155, 157, 159]


def get_teams_from_league(league_url):
    """Obtiene la lista de URLs de equipos de una página de liga"""
    print(f"🔍 Obteniendo equipos de: {league_url}")
    
    try:
        response = requests.get(league_url, headers=HEADERS, timeout=30)
        soup = BeautifulSoup(response.text, "lxml")
        
        teams = []
        
        # Buscar la tabla de equipos (buscar distintos h2 possíveis)
        h2_options = ["Table", "League Table", "Teams", "Standings"]
        
        for h2_text in h2_options:
            h2 = soup.find("h2", string=lambda t: t and h2_text.lower() in t.lower())
            if h2:
                tabla = h2.find_next("table")
                if tabla:
                    for link in tabla.find_all('a', href=True):
                        if "teamstats.asp" in link['href']:
                            full_url = BASE_URL + link['href']
                            if full_url not in teams:
                                teams.append(full_url)
                    break
        
        print(f"   ✅ {len(teams)} equipos encontrados")
        return teams
        
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return []


def scrape_team(url, team_id):
    """Scrapea estadísticas de un equipo específico"""
    time.sleep(DELAY)
    
    try:
        resp = requests.get(url, headers=HEADERS, timeout=30)
        soup = BeautifulSoup(resp.text, "lxml")
        
        # Obtener nombre del equipo
        nombre = f"Equipo_{team_id}"
        h2 = soup.find("h2", string=lambda t: t and "Comparison with league average" in t)
        if h2:
            try:
                tabla = h2.find_next("table")
                nombre = tabla.find_all("tr")[1].find_all("td")[1].text.strip()
            except:
                pass
        
        data = {
            "id": team_id,
            "name": nombre,
            "goals": {"home": {}, "away": {}},
            "scored_conceded": extract_scored_conceded(soup),
            "rates": extract_rates(soup),
            "corners_for": {"home": {}, "away": {}},
            "corners_against": {"home": {}, "away": {}},
            "Total_corners": {"home": {}, "away": {}}
        }
        
        # Procesar goals
        if h2:
            tabla = h2.find_next("table")
            filas = tabla.find_all("tr")
            process_filas(HOME_FILAS, filas, "home", data["goals"])
            process_filas(AWAY_FILAS, filas, "away", data["goals"])
        
        # Procesar corners
        process_corners(soup, "Corners For", "corners_for", data)
        process_corners(soup, "Corners Against", "corners_against", data)
        process_corners(soup, "Total corners", "Total_corners", data, is_total=True)
        
        print(f"   ✓ {nombre}")
        return data
        
    except Exception as e:
        print(f"   ✗ Error scrapeando: {e}")
        return None


def process_filas(filas_objetivo, filas, seccion, data):
    mapping = ["win", "draw", "defeats", "goals_scored_per_game", 
               "goals_conceded_per_game", "team_scored_first", 
               "opponent_scored_first", "total_goal_per_game",
               "over_1_5", "over_2_5", "over_3_5", "both_teams_scored"]
    idx = 0
    for fila_idx in filas_objetivo:
        try:
            fila = filas[fila_idx]
            cols = fila.find_all(["td", "th"])
            if len(cols) >= 3:
                val = cols[2].text.strip().replace("%", "").replace(",", ".")
                if val:
                    data[seccion][mapping[idx]] = float(val)
                    idx += 1
        except:
            pass


def extract_scored_conceded(soup):
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
                key = cols[0].text.strip().lower().replace(" ", "_").replace("+", "plus").replace("/", "_").replace(">", "over").replace(".","")
                for i, side in enumerate(["home", "away"]):
                    val = cols[i+1].text.strip().replace("%", "")
                    try:
                        data[side][key] = int(val)
                    except:
                        data[side][key] = 0
    except:
        pass
    return data


def extract_rates(soup):
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
                key = cols[0].text.strip().lower().replace(" ", "_").replace("+", "plus").replace("/", "_").replace(">", "over").replace("-", "_").replace(".","")
                for i, side in enumerate(["home", "away"]):
                    val = cols[i+1].text.strip().replace("%", "")
                    try:
                        data[side][key] = int(val)
                    except:
                        data[side][key] = 0
    except:
        pass
    return data


def process_corners(soup, h2_text, key_name, data, is_total=False):
    try:
        h2 = soup.find("h2", string=lambda t: t and h2_text in t)
        if not h2:
            return
        tabla = h2.find_next("table")
        filas = tabla.find_all("tr")
        
        headers = []
        for col in filas[0].find_all(["td", "th"])[1:7]:
            txt = col.text.strip().lower()
            if "avg" in txt:
                headers.append("avg")
            elif "2.5" in txt:
                headers.append("over_2_5")
            elif "3.5" in txt:
                headers.append("over_3_5")
            elif "4.5" in txt:
                headers.append("over_4_5")
            elif "5.5" in txt:
                headers.append("over_5_5")
            elif "6.5" in txt:
                headers.append("over_6_5")
            elif "9.5" in txt:
                headers.append("over_9_5")
            elif "10.5" in txt:
                headers.append("over_10_5")
            elif "11.5" in txt:
                headers.append("over_11_5")
            elif "12.5" in txt:
                headers.append("over_12_5")
            elif "13.5" in txt:
                headers.append("over_13_5")
            else:
                headers.append("avg")
        
        home_vals = [c.text.strip().replace("%", "").replace(",", ".") for c in filas[1].find_all(["td", "th"])[1:7]]
        away_vals = [c.text.strip().replace("%", "").replace(",", ".") for c in filas[2].find_all(["td", "th"])[1:7]]
        
        data[key_name]["home"] = {}
        data[key_name]["away"] = {}
        
        for i, key in enumerate(headers):
            try:
                data[key_name]["home"][key] = float(home_vals[i])
                data[key_name]["away"][key] = float(away_vals[i])
            except:
                pass
    except:
        pass


def scrape_league(league_name, league_url):
    """Scrapea todos los equipos de una liga"""
    print(f"\n{'='*50}")
    print(f"🏆 SCRAPING: {league_name.upper()}")
    print(f"{'='*50}")
    
    # Obtener URLs de equipos
    team_urls = get_teams_from_league(league_url)
    
    if not team_urls:
        print(f"❌ No se encontraron equipos para {league_name}")
        return []
    
    # Scrape cada equipo
    equipos = []
    for idx, url in enumerate(team_urls, 1):
        data = scrape_team(url, idx)
        if data:
            equipos.append(data)
    
    return equipos


def main():
    print("🏆 SCRAPER MULTI-LIGAS - SoccerSTATS")
    print("=" * 50)
    print(f"Ligas a scrapear: {len(LIGAS)}")
    for name in LIGAS.keys():
        print(f"   - {name}")
    print()
    
    # Directorio de salida
    output_dir = os.path.join(os.path.dirname(__file__), "../..", "frontend", "public", "data")
    os.makedirs(output_dir, exist_ok=True)
    
    # Scrapear cada liga
    for league_name, league_url in LIGAS.items():
        equipos = scrape_league(league_name, league_url)
        
        if equipos:
            output_file = os.path.join(output_dir, f"{league_name}.json")
            with open(output_file, "w", encoding="utf-8") as f:
                json.dump(equipos, f, indent=2, ensure_ascii=False)
            print(f"\n✅ {league_name}: {len(equipos)} equipos guardados en {output_file}")
        else:
            print(f"\n⚠️ {league_name}: Sin datos")
    
    print("\n" + "=" * 50)
    print("🎉 SCRAPING COMPLETADO!")
    print("=" * 50)


if __name__ == "__main__":
    main()
