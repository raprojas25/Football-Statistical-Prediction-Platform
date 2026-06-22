#!/usr/bin/env python3
"""
Scraper Multi-Ligas para FootyStats
Extrae fixtures, resultados y odds de partidos finalizados
"""
import argparse
import json
import os
import re
import sys
import time
from datetime import datetime, timezone

try:
    import requests
    from bs4 import BeautifulSoup
except ImportError:
    print("Instala: pip install requests beautifulsoup4 lxml")
    sys.exit(1)

try:
    import yaml
except ImportError:
    print("Instala PyYAML: pip install pyyaml")
    sys.exit(1)

HEADERS = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}
BASE_URL = "https://footystats.org"

LIGAS = {
    "belgium": {
        "url": "/belgium/pro-league/fixtures",
        "name": "cup",
        "country": "belgium",
    },
}

OUTPUT_DIR = None


def parse_args():
    p = argparse.ArgumentParser(description="FootyStats scraper multi-liga")
    p.add_argument("-c", "--config", default=None,
                   help="Ruta al archivo YAML de configuración")
    p.add_argument("-l", "--leagues", default=None,
                   help="Lista de ligas separadas por coma (ej: alemnia,argentina)")
    p.add_argument("--delay", type=float, default=None,
                   help="Delay entre requests (segundos)")
    p.add_argument("--output-dir", default=None,
                   help="Directorio de salida para los JSON")
    return p.parse_args()


def load_config(config_path):
    leagues = {}
    settings = {}

    if config_path and os.path.exists(config_path):
        with open(config_path) as f:
            cfg = yaml.safe_load(f) or {}
        settings = cfg.get("settings", {})
        for entry in cfg.get("leagues", []):
            if isinstance(entry, str):
                if entry in LIGAS:
                    leagues[entry] = LIGAS[entry]
            elif isinstance(entry, dict):
                key = entry.get("key")
                if key:
                    leagues[key] = {
                        "url": entry["url"],
                        "name": entry["name"],
                        "country": entry.get("country", key),
                    }
        return leagues, settings

    return None, settings


def parse_fixtures(soup):
    fixtures = []
    sections = soup.find_all("div", class_="full-matches-table")

    for section in sections:
        match_container = section.find("div", class_="match-feed")
        if not match_container:
            continue

        match_uls = match_container.find_all("ul", class_="match")
        for ul in match_uls:
            match_data = parse_single_match(ul)
            if match_data:
                fixtures.append(match_data)

    return fixtures


def parse_single_match(ul):
    match_id = None
    classes = ul.get("class", [])
    for c in classes:
        if c.startswith("z"):
            match_id = c[1:]
            break

    li_date = ul.find("li", class_="time")
    if not li_date:
        return None

    timestamp = li_date.get("data-time")
    date_str = ""
    for cls in ("timezone-convert-match-week", "timezone-convert-match-month"):
        date_span = li_date.find("span", class_=cls)
        if date_span:
            date_str = date_span.get_text(strip=True)
            break

    status_span = li_date.find("span", {"data-match-status": True})
    status = "SCHEDULED"
    if status_span:
        raw_status = status_span["data-match-status"]
        if raw_status == "complete":
            status = "FINISHED"
        elif raw_status == "incomplete":
            status = "SCHEDULED"

    li_info = ul.find("li", class_="match-info")
    if not li_info:
        return None

    home_a = li_info.find("a", class_="home")
    away_a = li_info.find("a", class_="away")
    h2h_a = li_info.find("a", class_="h2h-link")

    home_name = ""
    away_name = ""
    home_ppg = None
    away_ppg = None
    score_home = None
    score_away = None

    if home_a:
        name_span = home_a.find("span", class_="hover-modal-parent")
        home_name = name_span.get_text(strip=True) if name_span else home_a.get_text(strip=True)
        ppg_div = home_a.find("div", class_="form-box")
        if ppg_div:
            try:
                home_ppg = float(ppg_div.get_text(strip=True))
            except ValueError:
                pass

    if away_a:
        name_span = away_a.find("span", class_="hover-modal-parent")
        away_name = name_span.get_text(strip=True) if name_span else away_a.get_text(strip=True)
        ppg_div = away_a.find("div", class_="form-box")
        if ppg_div:
            try:
                away_ppg = float(ppg_div.get_text(strip=True))
            except ValueError:
                pass

    if h2h_a:
        score_span = h2h_a.find("span", class_="ft-score")
        if score_span:
            score_text = score_span.get_text(strip=True)
            if " - " in score_text:
                parts = score_text.split(" - ")
                try:
                    score_home = int(parts[0])
                    score_away = int(parts[1])
                except ValueError:
                    pass

    odds_home = None
    odds_draw = None
    odds_away = None

    stats_li = ul.find("li", class_="match-stats")
    if stats_li:
        odds_div = stats_li.find("div", class_="stat")
        if odds_div:
            odds_spans = odds_div.find_all("span", class_="col-lg-4")
            if len(odds_spans) >= 3:
                for i, s in enumerate(odds_spans):
                    m = re.search(r"(\d+\.\d+)", s.get_text())
                    if m:
                        val = float(m.group(1))
                        if i == 0:
                            odds_home = val
                        elif i == 1:
                            odds_draw = val
                        elif i == 2:
                            odds_away = val

    if not home_name or not away_name:
        return None

    match = {
        "id": match_id,
        "date_timestamp": int(timestamp) if timestamp else None,
        "date_str": date_str,
        "home_team": home_name,
        "away_team": away_name,
        "home_ppg": home_ppg,
        "away_ppg": away_ppg,
        "status": status,
        "score": {"home": score_home, "away": score_away} if score_home is not None else None,
    }

    if odds_home is not None:
        match["odds"] = {"home": odds_home, "draw": odds_draw, "away": odds_away}

    result = None
    if score_home is not None and score_away is not None:
        if score_home > score_away:
            result = "1"
        elif score_home < score_away:
            result = "2"
        else:
            result = "X"
    match["result"] = result

    return match


def scrape_league(league_key, info):
    url = f"{BASE_URL}{info['url']}"
    print(f"\n{'='*55}")
    print(f"  {info['country']:12s} | {info['name']}")
    print(f"{'='*55}")
    print(f"  URL: {url}")

    try:
        resp = requests.get(url, headers=HEADERS, timeout=30)
        resp.raise_for_status()
    except requests.RequestException as e:
        print(f"  ERROR: {e}")
        return None

    soup = BeautifulSoup(resp.text, "lxml")

    fixtures = parse_fixtures(soup)
    fixtures = [f for f in fixtures if f.get("status") == "FINISHED"]

    output = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "source": url,
        "league": info["name"],
        "country": info["country"],
        "season": 2026,
        "fixtures": fixtures,
    }

    output_file = os.path.join(OUTPUT_DIR, f"{league_key}_fixtures.json")
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(output, f, indent=2, ensure_ascii=False)

    print(f"  Fixtures (FINISHED): {len(fixtures)} partidos")
    with_odds = sum(1 for f in fixtures if f.get("odds"))
    print(f"  With odds: {with_odds}/{len(fixtures)}")
    print(f"  Guardado:  {output_file}")

    return output


def main():
    args = parse_args()

    # Resolver delay
    delay = args.delay or 1.5

    # Resolver directorio de salida
    out_dir = args.output_dir
    if out_dir is None:
        out_dir = os.path.join(os.path.dirname(__file__), "../..", "client", "public", "odds")
    os.makedirs(out_dir, exist_ok=True)

    # Resolver ligas: YAML > CLI > defaults
    leagues = dict(LIGAS)
    yaml_leagues, yaml_settings = load_config(args.config)

    if yaml_leagues is not None:
        if yaml_leagues:
            leagues = yaml_leagues
        if yaml_settings.get("output_dir"):
            out_dir = yaml_settings["output_dir"]
            os.makedirs(out_dir, exist_ok=True)
        if yaml_settings.get("delay"):
            delay = yaml_settings["delay"]

    if args.leagues:
        keys = [k.strip() for k in args.leagues.split(",")]
        leagues = {k: leagues[k] for k in keys if k in leagues}

    # Sobrescribir output_dir global para scrape_league
    global OUTPUT_DIR
    OUTPUT_DIR = out_dir

    print(f"{'='*55}")
    print("  FOOTYSTATS SCRAPER - MULTI LIGA")
    print(f"{'='*55}")
    print(f"  Ligas: {len(leagues)}")
    for key, info in leagues.items():
        print(f"    - {info['country']:12s} | {info['name']:25s} | {key}")
    print(f"  Delay: {delay}s")
    print(f"  Output: {out_dir}")
    print()

    for league_key, info in leagues.items():
        scrape_league(league_key, info)
        time.sleep(delay)

    print(f"\n{'='*55}")
    print("  LISTO!")
    print(f"{'='*55}")


if __name__ == "__main__":
    main()
