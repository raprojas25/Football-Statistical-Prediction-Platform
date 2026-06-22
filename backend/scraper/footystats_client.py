#!/usr/bin/env python3
"""
Scraper Multi-Ligas para FootyStats
Extrae fixtures programados con odds desde footystats.org
Formato de salida compatible con PE.json
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

HEADERS = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}
BASE_URL = "https://footystats.org"
DELAY = 1.5

LIGAS_FALLBACK = {
    "chile": {
        "url": "/chile/primera-division/fixtures",
        "name": "Primera División",
        "country": "Chile",
    },
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
                import yaml
                with open(path, "r") as f:
                    data = yaml.safe_load(f)
            else:
                with open(path, "r") as f:
                    data = json.load(f)
            if isinstance(data, dict) and data:
                print(f"  Config: {path} ({len(data)} ligas)")
                return data
        except Exception as e:
            print(f"  WARN: error loading {path}: {e}")
    print(f"  WARN: usando LIGAS_FALLBACK (1 liga)")
    return dict(LIGAS_FALLBACK)


LIGAS = load_ligas()

DEFAULT_OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "../..", "client", "public", "fixtures")


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

    if timestamp:
        dt = datetime.fromtimestamp(int(timestamp), tz=timezone.utc)
        date_iso = dt.strftime("%Y-%m-%dT%H:%M:%SZ")
    else:
        date_iso = None

    status_span = li_date.find("span", {"data-match-status": True})
    status = "SCHEDULED"
    if status_span:
        raw_status = status_span["data-match-status"]
        if raw_status == "complete":
            status = "FINISHED"

    li_info = ul.find("li", class_="match-info")
    if not li_info:
        return None

    home_a = li_info.find("a", class_="home")
    away_a = li_info.find("a", class_="away")

    home_name = ""
    away_name = ""
    home_ppg = None
    away_ppg = None

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
        "id": int(match_id) if match_id and match_id.isdigit() else match_id,
        "date": date_iso,
        "homeTeam": home_name,
        "awayTeam": away_name,
        "homePpg": home_ppg,
        "awayPpg": away_ppg,
        "matchday": None,
        "status": status,
    }

    if odds_home is not None:
        match["odds"] = {"home": odds_home, "draw": odds_draw, "away": odds_away}

    return match


def parse_args():
    parser = argparse.ArgumentParser(
        description="Scrapea fixtures programados con odds desde footystats.org",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=(
            "Ejemplos:\n"
            "  %(prog)s                           # todas las ligas\n"
            "  %(prog)s --liga chile              # solo una liga\n"
            "  %(prog)s --liga chile --dry-run    # mostrar sin guardar\n"
            "  %(prog)s --output ./data           # directorio custom\n"
            "  %(prog)s --delay 3.0               # esperar 3s entre requests\n"
        ),
    )
    parser.add_argument(
        "--liga", "-l",
        help="Scrapear solo una liga (clave: chile, peru, etc.)",
    )
    parser.add_argument(
        "--dry-run", "-n",
        action="store_true",
        help="Mostrar qué se scrapearía sin escribir archivos",
    )
    parser.add_argument(
        "--output", "-o",
        default=DEFAULT_OUTPUT_DIR,
        help="Directorio de salida (default: client/public/fixtures/)",
    )
    parser.add_argument(
        "--delay", "-d",
        type=float,
        default=DELAY,
        help=f"Segundos entre requests (default: {DELAY})",
    )
    return parser.parse_args()


def scrape_league(league_key, info, output_dir, dry_run=False):
    url = f"{BASE_URL}{info['url']}"
    print(f"\n{'='*55}")
    print(f"  {info['country']:12s} | {info['name']}")
    print(f"{'='*55}")
    print(f"  URL: {url}")

    if dry_run:
        print(f"  [DRY-RUN] Se omitiría la petición HTTP")
        return {
            "generated_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
            "competition": league_key.upper(),
            "competition_name": f"{info['name']} ({info['country']})",
            "country": info["country"],
            "count": 0,
            "matches": [],
        }

    try:
        resp = requests.get(url, headers=HEADERS, timeout=30)
        resp.raise_for_status()
    except requests.RequestException as e:
        print(f"  ERROR: {e}")
        return None

    soup = BeautifulSoup(resp.text, "lxml")

    all_fixtures = parse_fixtures(soup)
    fixtures = [m for m in all_fixtures if m.get("status") == "SCHEDULED"]

    for m in fixtures:
        m.pop("status", None)

    output = {
        "generated_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "competition": league_key.upper(),
        "competition_name": f"{info['name']} ({info['country']})",
        "country": info["country"],
        "count": len(fixtures),
        "matches": fixtures,
    }

    os.makedirs(output_dir, exist_ok=True)
    output_file = os.path.join(output_dir, f"{league_key}.json")
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(output, f, indent=2, ensure_ascii=False)

    print(f"  Partidos programados: {len(fixtures)}/{len(all_fixtures)}")
    with_odds = sum(1 for f in fixtures if f.get("odds"))
    print(f"  With odds: {with_odds}/{len(fixtures)}")
    print(f"  Guardado:  {output_file}")

    return output


def main():
    args = parse_args()

    ligas = LIGAS
    if args.liga:
        if args.liga not in ligas:
            print(f"ERROR: Liga '{args.liga}' no encontrada. Disponibles: {', '.join(ligas)}")
            sys.exit(1)
        ligas = {args.liga: ligas[args.liga]}

    print(f"{'='*55}")
    print("  FOOTYSTATS SCRAPER - MULTI LIGA")
    print(f"{'='*55}")
    print(f"  Ligas: {len(ligas)}")
    for key, info in ligas.items():
        print(f"    - {info['country']:12s} | {info['name']:25s} | {key}")
    if args.dry_run:
        print(f"  Modo:  DRY-RUN (no se guardarán archivos)")
    print(f"  Delay: {args.delay}s")
    print(f"  Salida: {args.output}")
    print()

    for league_key, info in ligas.items():
        scrape_league(league_key, info, output_dir=args.output, dry_run=args.dry_run)
        if not args.dry_run:
            time.sleep(args.delay)

    print(f"\n{'='*55}")
    print("  LISTO!")
    print(f"{'='*55}")


if __name__ == "__main__":
    main()
