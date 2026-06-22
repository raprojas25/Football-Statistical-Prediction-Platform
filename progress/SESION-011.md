# Progreso del Proyecto - Sesión 011

**Fecha:** 2026-06-01
**Estado:** ✅ Completada

---

## ✅ Completado en Esta Sesión

### 1. Refactor de `footystats_client.py` → Formato PE.json

**Archivo modificado:** `backend/scraper/footystats_client.py`

Refactor completo para que la salida coincida con el formato `client/public/fixtures/PE.json`
manteniendo el campo `odds` que footystats provee.

**Cambios en `parse_single_match`:**

| Antes | Después |
|-------|---------|
| `date_timestamp` + `date_str` | `date` (ISO 8601 desde `data-time` crudo) |
| `home_team`, `away_team` | `homeTeam`, `awayTeam` (camelCase) |
| `home_ppg`, `away_ppg` | `homePpg`, `awayPpg` (camelCase) |
| `status` + `score` | ❌ Eliminados del output |
| `matchday` | `null` (no disponible en footystats) |
| `odds` | ✅ Mantenido |
| `id` (string) | `id` (int) |

**Cambios en `scrape_league`:**
- Filtra solo partidos `SCHEDULED`
- Output: `generated_at`, `competition`, `competition_name`, `country`, `count`, `matches`
- Archivo: `{league_key}.json` (ej: `chile.json`)
- Código muerto eliminado: `parse_standings()`, `h2h_a`, score parsing

**Ejemplo de output final:**
```json
{
  "generated_at": "2026-06-01T00:00:00Z",
  "competition": "CHILE",
  "competition_name": "Primera División (Chile)",
  "country": "Chile",
  "count": 10,
  "matches": [
    {
      "id": 123456,
      "date": "2026-06-05T20:00:00Z",
      "homeTeam": "Colo Colo",
      "awayTeam": "Universidad de Chile",
      "homePpg": 2.1,
      "awayPpg": 1.8,
      "matchday": null,
      "odds": { "home": 2.10, "draw": 3.20, "away": 3.80 }
    }
  ]
}
```

### 2. Estructura final del archivo (218 líneas, sin código muerto)

---

## 🗺️ Roadmap de Mejoras (orden de implementación)

### Paso 1: Config externa (YAML) + más ligas
- Mover `LIGAS` dict a un archivo YAML/JSON externo (`backend/scraper/ligas.{yml,json}`)
- Cargar ligas desde el archivo externo
- Poblarlo con 7+ ligas sudamericanas (tomar de `scraper_footystats.py`)
- Base necesaria para que el CLI pueda referirse a ligas por nombre

### Paso 2: CLI argumentos (argparse)
- `--liga chile` → scrapear solo una liga
- `--dry-run` → mostrar qué se scrapearía sin escribir archivos
- `--output DIR` → directorio de salida custom
- `--delay SEC` → sobreescribir delay entre requests

### Paso 3: Normalizar nombres de equipos
- Crear mapper `backend/scraper/team_mapper.py` que traduzca nombres de footystats
  a los nombres usados en los JSON de stats (`client/public/data/*.json`)
- Revisar `client/src/utils/teamAdapters.ts` y replicar la lógica en Python
- Aplicar el mapper automáticamente en `parse_single_match` o post-procesamiento

### Paso 4: Reintentos con backoff
- Wrapper para `requests.get()` con:
  - 3 intentos
  - Backoff exponencial (1, 2, 4 segundos)
  - Solo reintentar en `RequestException` (timeout, conexión)
  - No reintentar en 4xx

### Paso 5: Validación de datos (schema)
- Antes de escribir JSON, validar que:
  - Cada match tenga: `id`, `date`, `homeTeam`, `awayTeam`
  - `date` sea ISO 8601 válido
  - Si tiene `odds`, que tenga `home`, `draw`, `away` numéricos
- Usar schema simple (dict + checks) o librería `pydantic`/`marshmallow`
- Loggear warnings con los matches inválidos

### Paso 6: Multi-threading / async
- Usar `concurrent.futures.ThreadPoolExecutor` para scrapear ligas en paralelo
- Cada thread mantiene su propio delay para respetar rate limiting
- Opcional: `asyncio` + `aiohttp` para IO并行 más eficiente

---

## 📁 Archivos Modificados/Creados

```
backend/scraper/
├── footystats_client.py              ← Refactor + carga configuración externa
├── ligas.yaml                        ← NUEVO: 7 ligas sudamericanas
└── ligas.json                        ← (fallback si no hay YAML)
```

---

## 🔗 Dependencias entre pasos

```
Paso 1 (config YAML) ──→ Paso 2 (CLI)
       │
       └────────── No bloquea pasos 3,4,5,6 (pueden ir en paralelo)

Paso 3 (mapper) ──→ Se conecta con client/src/utils/teamAdapters.ts
Paso 4 (backoff) ──→ Independiente, wrapper pequeño
Paso 5 (validación) ──→ Independiente, post-procesamiento
Paso 6 (async) ──→ Último, requiere que todo lo demás funcione
```

---

## 📝 Notas

- `scraper_footystats.py` (el de 7 ligas, en `backend/scraper/`) **no se tocó**
- Ambos scrapers coexisten: `footystats_client.py` para formato PE.json,
  `scraper_footystats.py` para el formato antiguo con standings
- El `data-time` de footystats es Unix timestamp en segundos

---

### Detalle: Config externa (Paso 1)

**Archivo creado:** `backend/scraper/ligas.yaml`

Contiene 7 ligas sudamericanas: chile, peru, uruguay, argentina, colombia, ecuador, paraguay.

**Cadena de carga en `footystats_client.py`:**
1. Busca `ligas.yaml` en el directorio del script → `yaml.safe_load()`
2. Si no existe YAML, busca `ligas.json`
3. Si todo falla, usa `LIGAS_FALLBACK` hardcodeado (solo chile)

Para agregar/quitar ligas, solo editar `ligas.yaml` sin tocar Python.

---

### Detalle: CLI argumentos (Paso 2)

**Archivo modificado:** `backend/scraper/footystats_client.py`

**Argumentos disponibles:**

| Flag | Descripción |
|------|-------------|
| `--liga`, `-l` | Scrapear solo una liga (ej: `--liga chile`) |
| `--dry-run`, `-n` | Mostrar qué se scrapearía sin escribir archivos |
| `--output`, `-o` | Directorio de salida custom |
| `--delay`, `-d` | Segundos entre requests (default: 1.5) |

**Ejemplos:**
```bash
python3 backend/scraper/footystats_client.py --liga chile
python3 backend/scraper/footystats_client.py --liga peru --dry-run
python3 backend/scraper/footystats_client.py --output ./data
python3 backend/scraper/footystats_client.py --liga argentina --delay 3.0
python3 backend/scraper/footystats_client.py --liga brasil
# → ERROR: Liga 'brasil' no encontrada. Disponibles: chile, peru, ...
```

**Cambios internos:**
- `scrape_league()` ahora recibe `output_dir` y `dry_run` como parámetros
- `--dry-run` retorna un output dummy sin hacer petición HTTP
- `main()` usa `parse_args()` al inicio
