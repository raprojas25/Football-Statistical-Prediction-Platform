#!/usr/bin/env python3
import argparse
import json
import os
import sys
import time
from concurrent.futures import ThreadPoolExecutor, as_completed

try:
    import requests
    from bs4 import BeautifulSoup
except ImportError:
    print("pip install requests beautifulsoup4 lxml")
    sys.exit(1)

try:
    import yaml
except ImportError:
    print("pip install pyyaml")
    sys.exit(1)

HEADERS = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}
BASE_URL = "https://www.soccerstats.com/"

HOME_FILAS = [58, 60, 62, 64, 66, 76, 78, 98, 100, 102, 104, 106]
AWAY_FILAS = [111, 113, 115, 117, 119, 129, 131, 151, 153, 155, 157, 159]

GOALS_MAPPING = [
    "win", "draw", "defeats",
    "goals_scored_per_game", "goals_conceded_per_game",
    "team_scored_first", "opponent_scored_first",
    "total_goal_per_game",
    "over_1_5", "over_2_5", "over_3_5", "both_teams_scored",
]


def parse_args():
    p = argparse.ArgumentParser(description="SoccerSTATS scraper multi-liga")
    p.add_argument("-c", "--config", help="Ruta al archivo YAML de configuración")
    p.add_argument("-l", "--leagues", help="Ligas separadas por coma (ej: brasil,italia)")
    p.add_argument("--delay", type=float, help="Delay entre requests (segundos)")
    p.add_argument("--output-dir", help="Directorio de salida para los JSON")
    p.add_argument("--workers", type=int, help="Threads concurrentes por liga")
    return p.parse_args()


def load_config(config_path):
    leagues = {}
    settings = {}
    if config_path and os.path.exists(config_path):
        with open(config_path) as f:
            cfg = yaml.safe_load(f) or {}
        settings = cfg.pop("settings", {})
        for key, value in cfg.items():
            if isinstance(value, str):
                leagues[key] = value
            elif isinstance(value, dict) and "url" in value:
                leagues[key] = value["url"]
    return leagues, settings


def get_team_name(soup):
    h2 = soup.find("h2", string=lambda t: t and "Comparison with league average" in t)
    if h2:
        try:
            tabla = h2.find_next("table")
            return tabla.find_all("tr")[1].find_all("td")[1].text.strip()
        except:
            pass
    return "Unknown"


def extract_goals(soup):
    data = {"home": {}, "away": {}}
    h2 = soup.find("h2", string=lambda t: t and "Comparison with league average" in t)
    if not h2:
        return data
    filas = h2.find_next("table").find_all("tr")
    for filas_idx, side in [(HOME_FILAS, "home"), (AWAY_FILAS, "away")]:
        idx = 0
        for fila_i in filas_idx:
            try:
                fila = filas[fila_i]
                cols = fila.find_all(["td", "th"])
                if len(cols) >= 3:
                    val = cols[2].text.strip().replace("%", "").replace(",", ".")
                    if val and idx < len(GOALS_MAPPING):
                        data[side][GOALS_MAPPING[idx]] = float(val)
                        idx += 1
            except:
                pass
    return data


def extract_scored_conceded(soup):
    data = {"home": {}, "away": {}}
    try:
        h2 = soup.find("h2", string=lambda t: t and "Goals scored / Goals conceded" in t)
        if not h2:
            return data
        rows = h2.find_next("table").find_all("tr")[1:]
        for row in rows:
            cols = row.find_all("td")
            if len(cols) >= 3:
                key = (cols[0].text.strip().lower().replace(" ", "_")
                       .replace("+", "plus").replace("/", "_")
                       .replace(">", "over").replace(".", ""))
                for i, side in enumerate(["home", "away"]):
                    val = cols[i + 1].text.strip().replace("%", "")
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
        rows = h2.find_next("table").find_all("tr")[1:]
        for row in rows:
            cols = row.find_all("td")
            if len(cols) >= 3:
                key = (cols[0].text.strip().lower().replace(" ", "_")
                       .replace("+", "plus").replace("/", "_")
                       .replace(">", "over").replace("-", "_").replace(".", ""))
                for i, side in enumerate(["home", "away"]):
                    val = cols[i + 1].text.strip().replace("%", "")
                    try:
                        data[side][key] = int(val)
                    except:
                        data[side][key] = 0
    except:
        pass
    return data


def extract_corners(soup):
    sections = [
        ("corners_for", "Corners For"),
        ("corners_against", "Corners Against"),
        ("Total_corners", "Total corners"),
    ]
    result = {}
    for key_name, h2_text in sections:
        try:
            h2 = soup.find("h2", string=lambda t: t and h2_text in t)
            if not h2:
                continue
            filas = h2.find_next("table").find_all("tr")
            headers = []
            for col in filas[0].find_all(["td", "th"])[1:7]:
                txt = col.text.strip().lower()
                if "avg" in txt:
                    headers.append("avg")
                elif "13.5" in txt: headers.append("over_13_5")
                elif "12.5" in txt: headers.append("over_12_5")
                elif "11.5" in txt: headers.append("over_11_5")
                elif "10.5" in txt: headers.append("over_10_5")
                elif "9.5" in txt: headers.append("over_9_5")
                elif "6.5" in txt: headers.append("over_6_5")
                elif "5.5" in txt: headers.append("over_5_5")
                elif "4.5" in txt: headers.append("over_4_5")
                elif "3.5" in txt: headers.append("over_3_5")
                elif "2.5" in txt: headers.append("over_2_5")
                else:
                    headers.append("avg")
            home_vals = [c.text.strip().replace("%", "").replace(",", ".")
                         for c in filas[1].find_all(["td", "th"])[1:7]]
            away_vals = [c.text.strip().replace("%", "").replace(",", ".")
                         for c in filas[2].find_all(["td", "th"])[1:7]]
            home, away = {}, {}
            for i, h in enumerate(headers):
                try:
                    home[h] = float(home_vals[i])
                    away[h] = float(away_vals[i])
                except:
                    pass
            result[key_name] = {"home": home, "away": away}
        except:
            result[key_name] = {"home": {}, "away": {}}
    return result


def transform_team(old):
    team = {"id": old["id"], "name": old["name"], "home": {}, "away": {}}

    goals_map = {
        "win": "wins", "draw": "draws", "defeats": "defeats",
        "goals_scored_per_game": "scored_pg", "goals_conceded_per_game": "conceded_pg",
        "team_scored_first": "scored_first", "opponent_scored_first": "opponent_first",
        "total_goal_per_game": "total_pg",
        "over_1_5": "over_1_5", "over_2_5": "over_2_5", "over_3_5": "over_3_5",
        "both_teams_scored": "both_scored",
    }
    rates_map = {
        "scoring_rate": "rate",
        "scoring_rate_1st_h": "rate_1st_h",
        "scoring_rate_2nd_h": "rate_2nd_h",
        "scored_in_both_halves": "scored_both_halves",
        "conceding_rate": "conceding_rate",
        "conceding_rate_1st_half": "conceding_1st_h",
        "conceding_rate_2nd_half": "conceding_2nd_h",
        "conceded_in_both_halves": "conceded_both_halves",
    }

    for side in ("home", "away"):
        goals = {}
        for old_k, new_k in goals_map.items():
            if old_k in old["goals"].get(side, {}):
                goals[new_k] = old["goals"][side][old_k]

        scoring = {}
        for k, v in old.get("scored_conceded", {}).get(side, {}).items():
            scoring[k] = v
        for old_k, new_k in rates_map.items():
            if old_k in old.get("rates", {}).get(side, {}) and old_k != "both_teams_scored":
                scoring[new_k] = old["rates"][side][old_k]

        corners = {}
        for prefix, section in [("for_", "corners_for"), ("against_", "corners_against"), ("total_", "Total_corners")]:
            for k, v in old.get(section, {}).get(side, {}).items():
                corners[f"{prefix}{k}"] = v

        team[side] = {"goals": goals, "scoring": scoring, "corners": corners}

    return team


def scrape_team(session, url, team_id, delay):
    time.sleep(delay)
    try:
        resp = session.get(url, headers=HEADERS, timeout=30)
        resp.raise_for_status()
        soup = BeautifulSoup(resp.text, "lxml")

        old = {"id": team_id, "name": get_team_name(soup)}
        old["goals"] = extract_goals(soup)
        old["scored_conceded"] = extract_scored_conceded(soup)
        old["rates"] = extract_rates(soup)
        old.update(extract_corners(soup))

        return transform_team(old)
    except Exception as e:
        print(f"    Error: {e}")
        return None


def get_teams_from_league(session, league_url):
    print(f"  Obteniendo equipos: {league_url}")
    try:
        resp = session.get(league_url, headers=HEADERS, timeout=30)
        resp.raise_for_status()
        soup = BeautifulSoup(resp.text, "lxml")
        teams = []
        for h2_text in ["Table", "League Table", "Teams", "Standings"]:
            h2 = soup.find("h2", string=lambda t: t and h2_text.lower() in t.lower())
            if h2:
                tabla = h2.find_next("table")
                if tabla:
                    for link in tabla.find_all("a", href=True):
                        if "teamstats.asp" in link["href"]:
                            full_url = BASE_URL + link["href"]
                            if full_url not in teams:
                                teams.append(full_url)
                break
        print(f"    {len(teams)} equipos encontrados")
        return teams
    except Exception as e:
        print(f"    Error: {e}")
        return []


def scrape_league(session, league_name, league_url, delay, workers):
    print(f"\n{'=' * 50}")
    print(f"  {league_name.upper()}")
    print(f"{'=' * 50}")

    team_urls = get_teams_from_league(session, league_url)
    if not team_urls:
        print(f"  Sin equipos para {league_name}")
        return []

    equipos = []
    with ThreadPoolExecutor(max_workers=workers) as pool:
        futuros = {pool.submit(scrape_team, session, url, i + 1, delay): url
                   for i, url in enumerate(team_urls)}
        for futuro in as_completed(futuros):
            data = futuro.result()
            if data:
                equipos.append(data)
                print(f"    {data['name']}")

    equipos.sort(key=lambda e: e["id"])
    return equipos


def main():
    args = parse_args()

    if not args.config and not args.leagues:
        print("Error: Debes proporcionar --config o --leagues")
        sys.exit(1)

    leagues = {}
    settings = {}
    if args.config:
        leagues, settings = load_config(args.config)

    if args.leagues:
        keys = [k.strip() for k in args.leagues.split(",")]
        leagues = {k: leagues[k] for k in keys if k in leagues}

    if not leagues:
        print("Error: No hay ligas configuradas")
        sys.exit(1)

    delay = args.delay if args.delay is not None else settings.get("delay", 0.5)
    workers = args.workers if args.workers is not None else settings.get("workers", 4)
    out_dir = args.output_dir or settings.get("output_dir")
    if not out_dir:
        out_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)),
                               "../..", "client", "public", "data")
    os.makedirs(out_dir, exist_ok=True)

    print("=" * 50)
    print("  SCRAPER SOCCERSTATS - MULTI LIGA")
    print("=" * 50)
    for name in leagues:
        print(f"    - {name}")
    print(f"  Delay: {delay}s | Workers: {workers}")
    print(f"  Output: {out_dir}")
    print()

    session = requests.Session()
    session.headers.update(HEADERS)

    for league_name, league_url in leagues.items():
        equipos = scrape_league(session, league_name, league_url, delay, workers)
        if equipos:
            path = os.path.join(out_dir, f"{league_name}.json")
            with open(path, "w", encoding="utf-8") as f:
                json.dump(equipos, f, indent=2, ensure_ascii=False)
            print(f"\n  {league_name}: {len(equipos)} equipos -> {path}")
        else:
            print(f"\n  {league_name}: sin datos")

    print("\n" + "=" * 50)
    print("  LISTO!")
    print("=" * 50)


if __name__ == "__main__":
    main()
