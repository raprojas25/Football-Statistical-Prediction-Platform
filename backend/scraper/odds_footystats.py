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

FALLBACK_SETTINGS = {
    "delay": 1.5,
    "workers": 4,
    "output_dir": os.path.join(os.path.dirname(__file__), "../..", "client", "public", "odds"),
}

CONFIG_DIR = os.path.dirname(os.path.abspath(__file__))
CONFIG_PATHS = [
    os.path.join(CONFIG_DIR, "ligas.yaml"),
    os.path.join(CONFIG_DIR, "ligas.json"),
]


def load_ligas():
    for path in CONFIG_PATHS:
        if not os.path.exists(path):
            continue
        ext = os.path.splitext(path)[1]
        try:
            if ext == ".yaml":
                with open(path, "r") as f:
                    data = yaml.safe_load(f)
            else:
                with open(path, "r") as f:
                    data = json.load(f)
            if isinstance(data, dict) and data:
                settings = data.pop("settings", {}) if isinstance(data, dict) else {}
                ligas = {k: v for k, v in data.items() if isinstance(v, str)}
                if ligas:
                    merged = dict(FALLBACK_SETTINGS)
                    merged.update(settings)
                    print(f"  Config: {path} ({len(ligas)} ligas)")
                    return ligas, merged
        except Exception as e:
            print(f"  WARN: error loading {path}: {e}")
    print(f"  WARN: usando fallback (1 liga)")
    return {"chile": "/chile/primera-division/fixtures"}, dict(FALLBACK_SETTINGS)


LIGAS, SETTINGS = load_ligas()


def load_config(config_path):
    if not config_path or not os.path.exists(config_path):
        return None, {}
    with open(config_path) as f:
        cfg = yaml.safe_load(f) or {}
    if not isinstance(cfg, dict):
        return None, {}
    settings = cfg.pop("settings", {}) if isinstance(cfg, dict) else {}
    ligas = {k: v for k, v in cfg.items() if isinstance(v, str)}
    if ligas:
        merged = dict(FALLBACK_SETTINGS)
        merged.update(settings)
        return ligas, merged
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


def _extract_country(url_path):
    parts = url_path.strip("/").split("/")
    return parts[0].title() if parts else ""


def _extract_league_name(soup, url_path):
    title_tag = soup.find("title")
    if title_tag:
        text = title_tag.get_text(strip=True)
        m = re.match(r"^(.+?)\s+Fixtures", text, re.IGNORECASE)
        if m:
            return m.group(1).strip()
        m2 = re.match(r"^(.+?)\s*\|", text)
        if m2:
            return m2.group(1).strip()
    parts = url_path.strip("/").split("/")
    return " ".join(p.replace("-", " ").title() for p in parts)


def scrape_league(league_key, url_path, output_dir):
    url = f"{BASE_URL}{url_path}"
    country = _extract_country(url_path)

    print(f"\n{'='*55}")
    print(f"  {country:12s} | {url_path}")
    print(f"{'='*55}")
    print(f"  URL: {url}")

    try:
        resp = requests.get(url, headers=HEADERS, timeout=30)
        resp.raise_for_status()
    except requests.RequestException as e:
        print(f"  ERROR: {e}")
        return None

    soup = BeautifulSoup(resp.text, "lxml")

    competition_name = _extract_league_name(soup, url_path)
    print(f"  Liga: {competition_name}")

    fixtures = parse_fixtures(soup)
    fixtures = [f for f in fixtures if f.get("status") == "FINISHED"]

    output = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "source": url,
        "league": competition_name,
        "country": country,
        "season": 2026,
        "fixtures": fixtures,
    }

    os.makedirs(output_dir, exist_ok=True)
    output_file = os.path.join(output_dir, f"{league_key}.json")
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(output, f, indent=2, ensure_ascii=False)

    print(f"  Fixtures (FINISHED): {len(fixtures)} partidos")
    with_odds = sum(1 for f in fixtures if f.get("odds"))
    print(f"  With odds: {with_odds}/{len(fixtures)}")
    print(f"  Guardado:  {output_file}")

    return output


def parse_args():
    p = argparse.ArgumentParser(description="FootyStats scraper multi-liga")
    p.add_argument("-c", "--config", default=None,
                   help="Ruta al archivo YAML de configuración (opcional, por defecto usa ligas.yaml)")
    p.add_argument("-l", "--leagues", default=None,
                   help="Lista de ligas separadas por coma (ej: alemnia,argentina)")
    p.add_argument("--delay", type=float, default=None,
                   help="Delay entre requests (segundos)")
    p.add_argument("--output-dir", default=None,
                   help="Directorio de salida para los JSON")
    return p.parse_args()


def main():
    args = parse_args()

    ligas = LIGAS
    settings = SETTINGS

    # Custom config overrides default
    if args.config:
        cfg_leagues, cfg_settings = load_config(args.config)
        if cfg_leagues:
            ligas = cfg_leagues
        if cfg_settings:
            merged = dict(settings)
            merged.update(cfg_settings)
            settings = merged

    # CLI league filter
    if args.leagues:
        keys = [k.strip() for k in args.leagues.split(",")]
        ligas = {k: ligas[k] for k in keys if k in ligas}

    delay = args.delay if args.delay is not None else settings.get("delay", FALLBACK_SETTINGS["delay"])
    output_dir = args.output_dir if args.output_dir is not None else settings.get("output_dir", FALLBACK_SETTINGS["output_dir"])

    os.makedirs(output_dir, exist_ok=True)

    print(f"{'='*55}")
    print("  FOOTYSTATS SCRAPER - MULTI LIGA (ODDS)")
    print(f"{'='*55}")
    print(f"  Ligas: {len(ligas)}")
    for key, url_path in ligas.items():
        print(f"    - {key:12s} | {url_path}")
    print(f"  Delay: {delay}s")
    print(f"  Output: {output_dir}")
    print()

    for league_key, url_path in ligas.items():
        scrape_league(league_key, url_path, output_dir=output_dir)
        time.sleep(delay)

    print(f"\n{'='*55}")
    print("  LISTO!")
    print(f"{'='*55}")


if __name__ == "__main__":
    main()
