# Documentación del Proyecto: Sistema de Pronósticos Deportivos

## 1. Visión General del Proyecto

### Descripción

Plataforma full-stack para generar pronósticos deportivos basados en estadísticas de fútbol scrapeadas de SoccerSTATS. El sistema automatiza la recolección de datos, almacenamiento en PostgreSQL, cálculo de predicciones y visualización en una interfaz web estilo Betano.

### Alcance

- Scraping de múltiples ligas europeas e internacionales
- Almacenamiento histórico de estadísticas de equipos
- Motor de predicción con algoritmos estadísticos
- API REST para consumo de datos
- Frontend React con UI profesional
- Automatización de actualizaciones periódicas

### Arquitectura General

```
┌─────────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React + Vite)                    │
│  TypeScript • Tailwind CSS • Framer Motion • Modo Oscuro           │
└─────────────────────────────┬───────────────────────────────────────┘
                              │ REST API
┌─────────────────────────────▼───────────────────────────────────────┐
│                         BACKEND (API + Motor)                      │
│  FastAPI (Python) • Motor de Predicciones • Scheduler               │
└─────────────────────────────┬───────────────────────────────────────┘
                              │
┌─────────────────────────────▼───────────────────────────────────────┐
│                         DATA LAYER                                 │
│  PostgreSQL • SQLAlchemy • Alembic                                  │
└─────────────────────────────┬───────────────────────────────────────┘
                              │
┌─────────────────────────────▼───────────────────────────────────────┐
│                    DATA ACQUISITION (Scraper)                      │
│  BeautifulSoup • Requests • Automation (cron/Linux)                 │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 2. Stack Tecnológico

### Frontend

| Tecnología | Propósito | Versión |
|------------|-----------|---------|
| React | Framework UI | 18.x |
| Vite | Build tool | 5.x |
| TypeScript | Tipado estático | 5.x |
| Tailwind CSS | Estilos utility-first | 3.x |
| Framer Motion | Animaciones | 11.x |
| React Router | Navegación | 6.x |
| Axios | Cliente HTTP | 1.x |
| React Query | Estado servidor | 5.x |
| Zod | Validación esquemas | 3.x |
| Lucide React | Iconos | 0.300+ |

### Backend

| Tecnología | Propósito | Versión |
|------------|-----------|---------|
| FastAPI | Framework web async | 0.109.x |
| SQLAlchemy | ORM | 2.x |
| Alembic | Migraciones DB | 1.x |
| Pydantic | Validación datos | 2.x |
| Uvicorn | Servidor ASGI | 0.27.x |
| BeautifulSoup4 | Scraping HTML | 4.x |
| Requests | HTTP client | 2.x |
| APScheduler | Scheduling tareas | 3.x |
| NumPy/Pandas | Análisis numérico | latest |
| Scikit-learn | ML predicciones | 1.x |

### Base de Datos

| Tecnología | Propósito |
|------------|-----------|
| PostgreSQL | Base de datos relacional |
| pgvector (extensión) | Embeddings para ML (futuro) |
| Docker | Contenedor DB |

### DevOps & Herramientas

| Tecnología | Propósito |
|------------|-----------|
| Git | Control de versiones |
| GitHub Actions | CI/CD |
| GitHub Pages / Vercel | Hosting frontend |
| Railway / Render | Hosting backend |
| Termux | Desarrollo móvil |

---

## 3. Estructura del Proyecto

### Repositorio GitHub

```
sport-predictions/
├── frontend/                 # React + Vite + TypeScript
│   ├── src/
│   │   ├── components/       # Componentes React
│   │   ├── pages/           # Páginas/Rutas
│   │   ├── hooks/           # Custom hooks
│   │   ├── services/        # Servicios API
│   │   ├── types/           # Tipos TypeScript
│   │   ├── utils/           # Utilidades
│   │   ├── stores/          # Estado global (Zustand)
│   │   └── styles/          # Config Tailwind
│   ├── public/              # Assets estáticos
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── package.json
│
├── backend/                  # FastAPI
│   ├── app/
│   │   ├── api/             # Endpoints API
│   │   ├── core/            # Configuración
│   │   ├── db/              # Modelos SQLAlchemy
│   │   ├── models/          # Entidades DB
│   │   ├── schemas/        # Schemas Pydantic
│   │   ├── services/       # Lógica de negocio
│   │   └── scraper/        # Módulos scraping
│   ├── scripts/            # Scripts utilidad
│   ├── alembic/             # Migraciones
│   ├── requirements.txt
│   └── main.py
│
├── docs/                    # Documentación
│   └── arquitectura.md
│
├── docker-compose.yml       # Contenedores
├── Dockerfile.frontend
├── Dockerfile.backend
├── .gitignore
└── README.md
```

---

## 4. Modelo de Datos (PostgreSQL)

### Esquema de Base de Datos

```sql
-- Tabla de ligas
CREATE TABLE leagues (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    country VARCHAR(50),
    continent VARCHAR(50),
    logo_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de equipos
CREATE TABLE teams (
    id SERIAL PRIMARY KEY,
    league_id INTEGER REFERENCES leagues(id),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE,
    logo_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de estadísticas por equipo (por jornada)
CREATE TABLE team_stats (
    id SERIAL PRIMARY KEY,
    team_id INTEGER REFERENCES teams(id),
    match_date DATE NOT NULL,
    is_home BOOLEAN NOT NULL,
    -- Goles
    goals_scored FLOAT,
    goals_conceded FLOAT,
    total_goals FLOAT,
    over_1_5 FLOAT,
    over_2_5 FLOAT,
    over_3_5 FLOAT,
    both_teams_scored FLOAT,
    -- Resultados
    win_rate FLOAT,
    draw_rate FLOAT,
    defeat_rate FLOAT,
    -- Primer gol
    scored_first_rate FLOAT,
    conceded_first_rate FLOAT,
    -- Corners
    corners_for_avg FLOAT,
    corners_against_avg FLOAT,
    total_corners_avg FLOAT,
    corners_over_2_5 FLOAT,
    corners_over_3_5 FLOAT,
    -- Tasas de Scoring
    scoring_rate FLOAT,
    scoring_rate_1st_half FLOAT,
    scoring_rate_2nd_half FLOAT,
    conceding_rate FLOAT,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(team_id, match_date, is_home)
);

-- Tabla de partidos
CREATE TABLE matches (
    id SERIAL PRIMARY KEY,
    league_id INTEGER REFERENCES leagues(id),
    home_team_id INTEGER REFERENCES teams(id),
    away_team_id INTEGER REFERENCES teams(id),
    match_date TIMESTAMP NOT NULL,
    status VARCHAR(20) DEFAULT 'scheduled',
    -- Resultados (nullable hasta que ocurra el partido)
    home_goals INTEGER,
    away_goals INTEGER,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de predicciones
CREATE TABLE predictions (
    id SERIAL PRIMARY KEY,
    match_id INTEGER REFERENCES matches(id),
    predicted_winner VARCHAR(10),
    over_1_5_probability FLOAT,
    over_2_5_probability FLOAT,
    over_3_5_probability FLOAT,
    btts_probability FLOAT,
    corners_over_9_5_probability FLOAT,
    confidence_level VARCHAR(20),
    created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 5. Fases del Proyecto

### Fase 1: Fundamentos y Configuración (Semana 1)

**Objetivo:** Establecer la estructura base del proyecto, configurar el entorno de desarrollo y preparar la infraestructura.

#### 1.1 Configuración del Repositorio

- [ ] Crear repositorio público en GitHub
- [ ] Inicializar estructura de directorios
- [ ] Configurar GitFlow o trunk-based development
- [ ] Crear README.md con descripción del proyecto

#### 1.2 Backend - Configuración Inicial

- [ ] Crear entorno virtual Python
- [ ] Instalar dependencias (FastAPI, SQLAlchemy, etc.)
- [ ] Crear estructura de módulos backend
- [ ] Configurar Docker y docker-compose
- [ ] Crear archivo `requirements.txt`
- [ ] Configurar Alembic para migraciones
- [ ] Crear modelos SQLAlchemy iniciales

#### 1.3 Frontend - Configuración Inicial

- [ ] Crear proyecto Vite con React + TypeScript
- [ ] Configurar Tailwind CSS con tema personalizado
- [ ] Configurar ESLint y Prettier
- [ ] Crear estructura de componentes base
- [ ] Implementar tema oscuro por defecto
- [ ] Configurar aliases en tsconfig y vite

#### 1.4 Documentación Inicial

- [ ] Crear documento de arquitectura
- [ ] Documentar convenciones de código
- [ ] Crear guía de contribución

**Entregables:**
- Repositorio GitHub configurado
- Backend con conexión a PostgreSQL funcionando
- Frontend con Tailwind y tema oscuro configurado
- Docker Compose para levantar todo el stack

---

### Fase 2: Scraper y Base de Datos (Semanas 2-3)

**Objetivo:** Implementar el sistema de scraping, crear la base de datos y poblar con datos iniciales.

#### 2.1 Módulo de Scraping

- [ ] Refactorizar el script actual de scraping (Plan.md)
- [ ] Crear clase `ScraperService` con manejo de errores
- [ ] Implementar rate limiting y reintentos
- [ ] Crear parser para cada sección de SoccerSTATS:
  - Goals comparison
  - Goals scored/conceded rates
  - Corners (for, against, total)
- [ ] Implementar caché para evitar scrapeo repetido
- [ ] Crear tests unitarios para scraper

#### 2.2 Base de Datos - Models y Migraciones

- [ ] Crear modelos SQLAlchemy completos
- [ ] Generar migraciones con Alembic
- [ ] Implementar seeders para datos iniciales
- [ ] Crear métodos de acceso a datos (repositorios)

#### 2.3 Pipeline de Datos

- [ ] Crear script para ejecutar scraping completo
- [ ] Implementar transformación de datos (清洗)
- [ ] Crear lógica de upsert (actualizar si existe)
- [ ] Implementar logging y monitoreo
- [ ] Crear脚本 de carga masiva

#### 2.4 API - Endpoints de Datos

- [ ] GET /api/leagues - Listar ligas
- [ ] GET /api/leagues/{id}/teams - Equipos por liga
- [ ] GET /api/teams/{id}/stats - Estadísticas de equipo
- [ ] GET /api/teams/{id}/history - Histórico de partidos

**Entregables:**
- Scraper funcionando para Bundesliga (prueba)
- Base de datos con datos de prueba
- API expuesta con endpoints básicos

---

### Fase 3: Motor de Predicciones (Semanas 4-5)

**Objetivo:** Desarrollar el motor de análisis estadístico y algoritmos de predicción.

#### 3.1 Motor de Análisis

- [ ] Crear clase `PredictionEngine`
- [ ] Implementar algoritmos de cálculo:
  - Promedio móvil de últimos N partidos
  - Media armónica para tasas
  - Weighted average (partidos recientes pesan más)
- [ ] Crear métricas de comparación:
  - attack vs defense strength
  - home/away performance
  - over/under probabilities
- [ ] Implementar cálculo de confianza

#### 3.2 Algoritmos de Predicción

```python
# Ejemplo de estructura del motor
class PredictionEngine:
    def calculate_over_2_5(self, home_team, away_team):
        home_avg = home_team.recent_over_2_5
        away_avg = away_team.recent_over_2_5
        # Formula: (home + away) / 2 con ajustes
        return self._weighted_average(home_avg, away_avg)
    
    def calculate_btts(self, home_team, away_team):
        # Both Teams To Score probability
        ...
    
    def calculate_corners(self, home_team, away_team):
        # Predicción de corners totales
        ...
```

#### 3.3 API - Endpoints de Predicciones

- [ ] POST /api/predictions/generate - Generar predicción
- [ ] GET /api/predictions/match/{id} - Predicción por partido
- [ ] GET /api/predictions/league/{id} - Predicciones de liga
- [ ] POST /api/predictions/compare - Comparar 2 equipos

#### 3.4 Validación de Predicciones

- [ ] Guardar predicciones históricas
- [ ] Implementar sistema de accuracy tracking
- [ ] Crear dashboard de estadísticas de acierto

**Entregables:**
- Motor de predicciones funcionando
- API con endpoints de predicción
- Sistema de tracking de accuracy

---

### Fase 4: Frontend - Interfaz Principal (Semanas 6-8)

**Objetivo:** Desarrollar la interfaz de usuario estilo Betano con todas las funcionalidades.

#### 4.1 Estructura de Rutas

```
/                       → Home (lista de ligas)
/league/{slug}          → Liga específica
/match/{id}             → Detalle de partido
/predictions            → Todas las predicciones
/settings               → Configuración usuario
```

#### 4.2 Componentes UI - Betano Style

- [ ] Navbar con navegación
- [ ] Selector de liga/equipo (dropdowns)
- [ ] Tarjetas de partidos
- [ ] Tablas de estadísticas
- [ ] Tabs (Goals, Corners, Stats)
- [ ] Gráficos de tendencias
- [ ] Loading states y skeletons

#### 4.3 Integración con API

- [ ] Servicio API con Axios + React Query
- [ ] Tipos TypeScript para respuestas
- [ ] Manejo de estados (loading, error, success)
- [ ] Cache con React Query

#### 4.4 Funcionalidades Interactivas

- [ ] Selector de equipo local vs visitante
- [ ] Botón "Calcular" para generar predicción
- [ ] Tabla de resultados con cálculos
- [ ] Botón "Capturar" (exportar imagen)
- [ ] Exportar a PDF

#### 4.5 Tema Oscuro y Estilos

- [ ] Colores del tema Betano (hexadecimales)
- [ ] Modo oscuro/claro toggle
- [ ] Tailwind config con colores custom
- [ ] Componentes responsivos

**Entregables:**
- UI completa estilo Betano
- Integración con API funcionando
- Exportación de datos

---

### Fase 5: Automatización y Scheduler (Semanas 9-10)

**Objetivo:** Implementar la automatización completa del pipeline.

#### 5.1 Sistema de Scheduling

- [ ] Implementar APScheduler en backend
- [ ] Tarea programada: Scraping semanal (jueves)
- [ ] Tarea: Actualizar predicciones post-jornada
- [ ] Tarea: Cleanup de datos antiguos

#### 5.2 Obtención de Calendarios

- [ ] Investigar APIs gratuitas de calendarios:
  - API-Football (version gratuita limitada)
  - Football-Data.org
  - Oddspedia scrapping
- [ ] Implementar fallback con scraping de calendarios
- [ ] Crear tabla de partidos programados

#### 5.3 Pipeline de Actualización

```
Cron (Cada jueves 18:00 UTC)
    ↓
Scraper → SoccerSTATS
    ↓
Transform → Limpiar datos
    ↓
Upsert → PostgreSQL
    ↓
Recalculate → Predicciones
    ↓
Notify → Frontend (polling/sockets)
```

#### 5.4 Monitoreo

- [ ] Logging estructurado
- [ ] Alertas de errores (Sentry)
- [ ] Dashboard de métricas

**Entregables:**
- Automatización funcionando
- Sistema de calendario implementado
- Pipeline completo automatizado

---

### Fase 6: Multi-Liga y Expansión Internacional (Semanas 11-12)

**Objetivo:** Expandir a más ligas y organizar por continentes.

#### 6.1 Expansión de Ligas

**Europa:**
- Bundesliga (ya tengo datos)
- Premier League
- La Liga
- Serie A
- Ligue 1
- Eredivisie
- Belgian Pro League
- Portuguese Liga

**América Latina:**
- Liga Profesional Argentina
- Chile Primera División
- Peruano
- MLS

#### 6.2 Estructura por Continentes

- [ ] Agrupar ligas por continente en DB
- [ ] Filtro por continente en UI
- [ ] Búsqueda de partidos internacionales
- [ ] Torneos continentales (Champions League, etc.)

#### 6.3 Optimización de Performance

- [ ] Pagination en endpoints
- [ ] Cache en Redis (opcional)
- [ ] Optimización de queries SQL
- [ ] Lazy loading en frontend

**Entregables:**
- Mínimo 10 ligas implementadas
- UI con filtros por continente
- Búsqueda de partidos internacionales

---

### Fase 7: Mejoras y Features Avanzados (Semanas 13-16)

**Objetivo:** Añadir características avanzadas y mejorar.

#### 7.1 Features Avanzados

- [ ] Modo análisis comparativo (equipo vs equipo)
- [ ] Historial de enfrentamientos directos (H2H)
- [ ] Racha actual (ultimos 5 partidos)
- [ ] Predicciones combinadas (parlay)
- [ ] Guardar favoritos / equipos preferidos

#### 7.2 UI/UX Improvements

- [ ] Animaciones con Framer Motion
- [ ] Modo offline (Service Worker)
- [ ] PWA - Instalable en móvil
- [ ] Tema Betano refinado
- [ ] Gráficos con Recharts

#### 7.3 Testing

- [ ] Tests unitarios (Jest + Testing Library)
- [ ] Tests de integración (Playwright)
- [ ] Tests E2E del flujo principal

#### 7.4 Despliegue

- [ ] CI/CD con GitHub Actions
- [ ] Deploy a producción (Vercel + Railway)
- [ ] Variables de entorno seguras
- [ ] HTTPS habilitado

---

## 6. Distribución de Tareas entre Agentes IA

### Arquitectura de Agentes

```
Usuario (Arquitecto)
    │
    ├── Agente Frontend (Specialist)
    │   └── Encargado: React, TypeScript, UI
    │
    ├── Agente Backend (Specialist)
    │   └── Encargado: FastAPI, DB, API
    │
    ├── Agente Scraper (Specialist)
    │   └── Encargado: Python scraping, datos
    │
    └── Agente DevOps (Specialist)
        └── Encargado: Docker, CI/CD, deployment
```

### Documentación para Agentes

#### Para Agente Frontend

```markdown
# Contexto del Frontend

## Tech Stack
- React 18 + Vite 5
- TypeScript 5
- Tailwind CSS 3
- Framer Motion 11
- React Router 6

## Estilo Visual
- Tema: Betano.com (colores oscuros con acentos verdes/naranjas)
- Primary: #1DB954 (verde Betano)
- Secondary: #FF6B00 (naranja)
- Background: #0D0D0D
- Surface: #1A1A1A
- Text: #FFFFFF / #B3B3B3

## Estructura de Componentes
- components/common/ (Button, Card, Input, etc.)
- components/predictions/ (PredictionCard, TeamSelector, etc.)
- pages/ (Home, League, Match, Predictions)
- hooks/ (usePredictions, useTeams, etc.)
- services/ (api.ts - cliente axios)

## Convenciones
- Componentes en PascalCase
- Hooks en camelCase preceded by "use"
- Props con tipado estricto
- CSS con clases Tailwind
- Animaciones con Framer Motion
```

#### Para Agente Backend

```markdown
# Contexto del Backend

## Tech Stack
- FastAPI 0.109
- PostgreSQL + SQLAlchemy 2
- Pydantic 2
- Alembic (migraciones)
- APScheduler (tareas programadas)

## Estructura
- app/api/routes/ (endpoints)
- app/models/ (entidades SQLAlchemy)
- app/schemas/ (schemas Pydantic)
- app/services/ (lógica de negocio)
- app/scraper/ (módulos scraping)

## Convenciones
- Nombres de endpoints en snake_case
- Respuestas en JSON con mensajes claros
- Manejo de errores con HTTPException
- Dependencias inyectadas con Depends()
- Logs con logging estándar
```

#### Para Agente Scraper

```markdown
# Contexto del Scraper

## Fuente de Datos
- URL Base: soccerstats.com
- URLs por liga举例: soccerstats.com/teamstats.asp?league=germany

## Datos a Extraer
1. Goals comparison
   - Win/Draw/Defeats %
   - Goals scored/conceded per game
   - First goal stats
   - Over 1.5/2.5/3.5
   - BTTS

2. Scoring/Conceding rates
   - Scoring rate per half
   - Conceding rate per half

3. Corners
   - Corners For (avg, over 2.5/3.5/4.5/5.5/6.5)
   - Corners Against
   - Total Corners (over 9.5/10.5/11.5/12.5/13.5)

## Estructura de Datos de Salida
{
  "id": int,
  "name": "Team Name",
  "goals": { "home": {...}, "away": {...} },
  "scored_conceded": { "home": {...}, "away": {...} },
  "rates": { "home": {...}, "away": {...} },
  "corners_for": { "home": {...}, "away": {...} },
  "corners_against": { "home": {...}, "away": {...} },
  "Total_corners": { "home": {...}, "away": {...} }
}

## Requisitos
- Manejo de errores robusto
- Rate limiting (1 request cada 2 segundos)
- Reintentos automáticos (3 intentos)
- Logging de errores
- Guardar progreso en caso de fallo
```

---

## 7. APIs de Calendario (Investigación)

### Opciones Gratuitas

| API | Limite Gratis | Ligasy Disponibles |
|-----|---------------|-------------------|
| API-Football | 100 req/day | 1000+ |
| Football-Data.org | 10 req/day | 160 |
| RapidAPI (varios) | Variable | Variable |
| Scrapping odds portals | Ilimitado | variable |

### Recomendación

**Opción 1 (短期):** Usar API-Football gratis (100 req/day suficiente para scraping semanal)

**Opción 2 (largo plazo):** Implementar scraping de calendario desde:
- flashscore.com.mx
- marcadores.com

**Opción 3 (complemento):** Crear manualmente calendario básico con fechas conocidas de Bundesliga, Premier, La Liga, etc.

---

## 8. Configuración de Variables de Entorno

### Backend (.env)

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/sports_db

# API Keys
API_FOOTBALL_KEY=tu_api_key_aqui
FOOTBALL_DATA_KEY=tu_api_key_aqui

# Scraper
SCRAPER_USER_AGENT=Mozilla/5.0 (compatible; SportsBot/1.0)
SCRAPER_DELAY=2

# Server
HOST=0.0.0.0
PORT=8000
DEBUG=true

# Frontend URL (CORS)
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:8000/api
VITE_APP_NAME=Sports Predictions
```

---

## 9. Comandos de Desarrollo

### Iniciar Desarrollo (Termux)

```bash
# Clonar repositorio
git clone https://github.com/tu-usuario/sport-predictions.git
cd sport-predictions

# Backend
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python main.py

# Frontend (nueva terminal)
cd frontend
npm install
npm run dev
```

### Docker Compose (Completo)

```bash
# Iniciar todo el stack
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener
docker-compose down
```

---

## 10. Próximos Pasos Inmediatos

1. **Inicializar repositorio GitHub** - Crear repositorio público
2. **Configurar estructura base** - Crear carpetas frontend/backend
3. **Docker Compose inicial** - PostgreSQL + Backend + Frontend
4. **Primer commit** - Push inicial a GitHub
5. **Asignar tareas a agentes** - Basado en esta documentación

---

## 11. Glosario de Términos

| Término | Definición |
|---------|------------|
| Scraping | Extracción de datos de páginas web |
| BTTS | Both Teams To Score (ambos equipos marcan) |
| Over/Under | Pronóstico de goles mayor/menor a X |
| Corner | Saque de esquina |
| H2H | Head to Head (enfrentamientos directos) |
| Odds | Cuotas de apuestas |
| Stake | Cantidad apostada |
| Yield | Profitability ratio |

---

*Documento creado para planificación del proyecto. Actualizar según avances y aprendizajes.*