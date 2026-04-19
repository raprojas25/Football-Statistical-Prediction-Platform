Quiero crear una super aplicación web (full-stack)  de pronósticos deportivos,  a partir de datos estadísticos 
Obtenidos mediante un scraping web, ostos datos obtenidos serán formateados y luego almacenados en una base de datos 
Postgresql.
Ejm. Del scraping
```py
import requests
from bs4 import BeautifulSoup
import json

urls = [
   "https://www.soccerstats.com/teamstats.asp?league=germany&stats=u1392-bayern-munich",
  "https://www.soccerstats.com/teamstats.asp?league=germany&stats=u1404-dortmund",
  "https://www.soccerstats.com/teamstats.asp?league=germany&stats=u1402-stuttgart",
  "https://www.soccerstats.com/teamstats.asp?league=germany&stats=u1406-rb-leipzig",
  "https://www.soccerstats.com/teamstats.asp?league=germany&stats=u1409-leverkusen",
  "https://www.soccerstats.com/teamstats.asp?league=germany&stats=u1399-hoffenheim",
  "https://www.soccerstats.com/teamstats.asp?league=germany&stats=u1394-e.-frankfurt",
  "https://www.soccerstats.com/teamstats.asp?league=germany&stats=u1403-freiburg",
  "https://www.soccerstats.com/teamstats.asp?league=germany&stats=u1407-fsv-mainz",
  "https://www.soccerstats.com/teamstats.asp?league=germany&stats=u1397-fc-augsburg",
  "https://www.soccerstats.com/teamstats.asp?league=germany&stats=u1396-union-berlin",
  "https://www.soccerstats.com/teamstats.asp?league=germany&stats=u1398-fc-koln",
  "https://www.soccerstats.com/teamstats.asp?league=germany&stats=u1410-hamburger-sv",
  "https://www.soccerstats.com/teamstats.asp?league=germany&stats=u1405-monchengladbach",
  "https://www.soccerstats.com/teamstats.asp?league=germany&stats=u1400-werder-bremen",
  "https://www.soccerstats.com/teamstats.asp?league=germany&stats=u1427-sankt-pauli",
  "https://www.soccerstats.com/teamstats.asp?league=germany&stats=u1408-wolfsburg",
  "https://www.soccerstats.com/teamstats.asp?league=germany&stats=u1420-heidenheim"
]

ligas= "alemania.json"

home_filas = [58, 60, 62, 64, 66, 76, 78, 98, 100, 102, 104, 106]
away_filas = [111, 113, 115, 117, 119, 129, 131, 151, 153, 155, 157, 159]

id_counter = 1
todos_los_equipos = []

def inicializar_corners(keys):
    return { "home": {k: 0 for k in keys}, "away": {k: 0 for k in keys} }

def procesar_filas(filas_objetivo, filas, seccion, data):
    mapping = [
        "win", "draw", "defeats", "goals_scored_per_game", "goals_conceded_per_game",
        "team_scored_first", "opponent_scored_first", "total_goal_per_game",
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
            print(f"❌ Error en fila {fila_idx}: {e}")

def procesar_goles(soup, data):
    h2_goles = soup.find("h2", string=lambda text: text and "Comparison with league average" in text)
    if not h2_goles:
        print(f"❌ No se encontró tabla de goles para {data['name']}")
        return

    tabla = h2_goles.find_next("table")
    filas = tabla.find_all("tr")
    procesar_filas(home_filas, filas, "home", data)
    procesar_filas(away_filas, filas, "away", data)

def procesar_corners_tipo(soup, h2_text, key_name, keys_map, data):
    h2 = soup.find("h2", string=lambda text: text and h2_text in text)
    if not h2:
        #print(f"⚠️ No se encontró sección {h2_text} para {data['name']}. Se rellenará con ceros.")
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

        home_vals = [col.text.strip().replace("%", "").replace(",", ".") for col in filas[1].find_all(["td", "th"])[1:7]]
        away_vals = [col.text.strip().replace("%", "").replace(",", ".") for col in filas[2].find_all(["td", "th"])[1:7]]

        data[key_name]["home"] = {}
        data[key_name]["away"] = {}

        for idx, key in enumerate(headers):
            try:
                # Changed int to float here based on common practice for percentages/averages
                data[key_name]["home"][key] = float(home_vals[idx])
                data[key_name]["away"][key] = float(away_vals[idx])
            except:
                pass
    except Exception as e:
        print(f"❌ Error procesando {h2_text}: {e}")
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
                key = cols[0].text.strip().lower().replace(" ", "_").replace(".", "").replace("+","plus").replace("/", "_").replace(">","over")
                for idx, side in enumerate(["home", "away"]):
                    val = cols[idx+1].text.strip().replace("%","")
                    try:
                        val = int(val)
                    except:
                        val = 0.0
                    data[side][key] = val
    except Exception as e:
        print(f"⚠️ Error en scored_conceded: {e}")
    return data

def rates(soup):
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
                key = cols[0].text.strip().lower().replace(" ", "_").replace(".", "").replace("+","plus").replace("/", "_").replace(">","over").replace("-","_")
                for idx, side in enumerate(["home", "away"]):
                    val = cols[idx+1].text.strip().replace("%","")
                    try:
                        val = int(val)
                    except:
                        val = 0.0
                    data[side][key] = val
    except Exception as e:
        print(f"⚠️ Error en scored_conceded: {e}")
    return data

for url in urls:

    try:
        response = requests.get(url)
        soup = BeautifulSoup(response.text, "html.parser")

        # Buscar nombre del equipo desde tabla de goles
        nombre_equipo = f"Equipo_{id_counter}"
        h2_goles = soup.find("h2", string=lambda text: text and "Comparison with league average" in text)
        if h2_goles:
            try:
                tabla_goles = h2_goles.find_next("table")
                filas = tabla_goles.find_all("tr")
                nombre_equipo = filas[1].find_all(["td", "th"])[1].text.strip()
            except Exception as e:
                print(f"❌ Error extrayendo nombre del equipo: {e}")

        # Inicializar estructura JSON para el equipo
        data = {
            "id": id_counter,
            "name": nombre_equipo,
            "goals": { "home": {}, "away": {} },
            "scored_conceded": extract_scored_conceded(soup),
            "rates": rates(soup),
            "corners_for": inicializar_corners(["avg", "over_2_5", "over_3_5", "over_4_5", "over_5_5", "over_6_5"]),
            "corners_against": inicializar_corners(["avg", "over_2_5", "over_3_5", "over_4_5", "over_5_5", "over_6_5"]),
            "Total_corners": inicializar_corners(["avg", "over_9_5", "over_10_5", "over_11_5", "over_12_5", "over_13_5"])

        }

        # Procesar goles
        procesar_goles(soup, data)

        # Procesar corners por tipo
        keys_map_for = {
            "avg": "avg", "2_5": "over_2_5", "3_5": "over_3_5", "4_5": "over_4_5", "5_5": "over_5_5", "6_5": "over_6_5"
        }
        keys_map_total = {
            "avg": "avg", "9_5": "over_9_5", "10_5": "over_10_5", "11_5": "over_11_5", "12_5": "over_12_5", "13_5": "over_13_5"
        }
        procesar_corners_tipo(soup, "Corners For", "corners_for", keys_map_for, data)
        procesar_corners_tipo(soup, "Corners Against", "corners_against", keys_map_for, data)
        procesar_corners_tipo(soup, "Total corners", "Total_corners", keys_map_total, data)

        todos_los_equipos.append(data)
        id_counter += 1


        print(f"{id_counter-1} {nombre_equipo} correctamente")

    except Exception as e:
        print(f"❌ Error procesando {url}: {e}")

with open(ligas, "w") as f:
    json.dump(todos_los_equipos, f, indent=4)

print("\n✅ JSON final generado correctamente para todos los equipos.")
# Guardar en JSON
print("\n✅ JSON final generado.")
#print(json.dumps(todos_los_equipos, indent=4))

# Descargar desde Google Colab
from google.colab import files
files.download(ligas)
```
La salida del objeto es esto, faltaría categorizar bien y borrar datos duplicados

```json
{
        "id": 1,
        "name": "Bayern Munich",
        "goals": {
            "home": {
                "win": 86.0,
                "draw": 7.0,
                "defeats": 7.0,
                "goals_scored_per_game": 4.0,
                "goals_conceded_per_game": 0.93,
                "team_scored_first": 86.0,
                "opponent_scored_first": 14.0,
                "total_goal_per_game": 4.93,
                "over_1_5": 100.0,
                "over_2_5": 100.0,
                "over_3_5": 79.0,
                "both_teams_scored": 64.0
            },
            "away": {
                "win": 80.0,
                "draw": 20.0,
                "defeats": 0.0,
                "goals_scored_per_game": 3.27,
                "goals_conceded_per_game": 0.93,
                "team_scored_first": 53.0,
                "opponent_scored_first": 47.0,
                "total_goal_per_game": 4.2,
                "over_1_5": 100.0,
                "over_2_5": 93.0,
                "over_3_5": 73.0,
                "both_teams_scored": 60.0
            }
        },
        "scored_conceded": {
            "home": {
                "gf_over_05": 100,
                "gf_over_15": 93,
                "gf_over_25": 79,
                "gf_over_35": 57,
                "gf_over_45": 36,
                "ga_over_05": 64,
                "ga_over_15": 29,
                "ga_over_25": 0,
                "ga_over_35": 0,
                "ga_over_45": 0
            },
            "away": {
                "gf_over_05": 100,
                "gf_over_15": 93,
                "gf_over_25": 80,
                "gf_over_35": 33,
                "gf_over_45": 20,
                "ga_over_05": 60,
                "ga_over_15": 33,
                "ga_over_25": 0,
                "ga_over_35": 0,
                "ga_over_45": 0
            }
        },
        "rates": {
            "home": {
                "scoring_rate": 100,
                "scoring_rate_1st_h": 100,
                "scoring_rate_2nd_h": 86,
                "scored_in_both_halves": 86,
                "both_teams_scored": 64,
                "conceding_rate": 64,
                "conceding_rate_1st_half": 36,
                "conceding_rate_2nd_half": 36,
                "conceded_in_both_halves": 7
            },
            "away": {
                "scoring_rate": 100,
                "scoring_rate_1st_h": 67,
                "scoring_rate_2nd_h": 100,
                "scored_in_both_halves": 67,
                "both_teams_scored": 60,
                "conceding_rate": 60,
                "conceding_rate_1st_half": 40,
                "conceding_rate_2nd_half": 40,
                "conceded_in_both_halves": 20
            }
        },
        "corners_for": {
            "home": {
                "avg": 7.21,
                "over_2_5": 100.0,
                "over_3_5": 93.0,
                "over_4_5": 86.0,
                "over_5_5": 71.0,
                "over_6_5": 64.0
            },
            "away": {
                "avg": 5.27,
                "over_2_5": 87.0,
                "over_3_5": 80.0,
                "over_4_5": 60.0,
                "over_5_5": 40.0,
                "over_6_5": 27.0
            }
        },
        "corners_against": {
            "home": {
                "avg": 2.86,
                "over_2_5": 57.0,
                "over_3_5": 29.0,
                "over_4_5": 21.0,
                "over_5_5": 7.0,
                "over_6_5": 0.0
            },
            "away": {
                "avg": 3.8,
                "over_2_5": 80.0,
                "over_3_5": 60.0,
                "over_4_5": 40.0,
                "over_5_5": 13.0,
                "over_6_5": 7.0
            }
        },
        "Total_corners": {
            "home": {
                "avg": 10.07,
                "over_9_5": 57.0,
                "over_10_5": 43.0,
                "over_11_5": 36.0,
                "over_12_5": 21.0,
                "over_13_5": 7.0
            },
            "away": {
                "avg": 9.07,
                "over_9_5": 47.0,
                "over_10_5": 33.0,
                "over_11_5": 27.0,
                "over_12_5": 13.0,
                "over_13_5": 7.0
            }
        }
    }
```
---
Anteriormente estaba trabajando en una web estática; pero ahora quiero migrarlo a react + Vite
Está interfaz puede cambiar y podemos categorizar mejor, no solo en 2 tablas, sino en varios tabs estilo casa de apuestas

```html
<div class="container mt-3 bg-white shadow rounded-2 py-2">
      <div class="row g-2">
        <div class="col-12 d-none">
          <form class="d-flex">
            <input
              class="form-control me-2"
              type="search"
              placeholder="Search"
              id="buscador"
            />
            <input
              type="button"
              value="Buscar"
              class="btn btn-outline-info"
              onclick="buscar()"
            />
          </form>
        </div>
        <div class="col-12 col-lg-6 mb-3">
          <select name="clubes" id="clubes" class="form-select" onchange="">
            <option value="cero">Seleccionar una Competencia</option>
          </select>
        </div>
        <div class="col-6 col-md-4 col-lg-3">
          <select id="equipo-local" class="form-select">
            <option value="">Selecciona local</option>
          </select>
        </div>
        <div class="col-6 col-md-4 col-lg-3">
          <select id="equipo-visitante" class="form-select">
            <option value="">Selecciona visita</option>
          </select>
        </div>
        <div class="col-12 col-md-8 col-lg-6 text-center d-grid">
          <input
            type="button"
            value="Agregar"
            onclick=""
            id="btn-calcular"
            class="btn btn-success btn-block"
          />
        </div>
        <div class="col-6 col-md-4 col-lg-3 text-center d-none d-md-grid">
          <input type="reset" value="Borrar" class="btn btn-danger btn-block" />
        </div>
      </div>
    </div>

    <div class="bd-cheatsheet container bg-white shadow py-3 my-3 rounded-2">
      <div class="col-12">
        <nav>
          <div
            class="nav nav-tabs nav-fill border-primary mb-3"
            id="nav-tab"
            role="tablist"
          >
            <button
              class="nav-link active"
              id="nav-home-tab"
              data-bs-toggle="tab"
              data-bs-target="#nav-home"
              type="button"
              role="tab"
              aria-controls="nav-home"
              aria-selected="true"
            >
              Goals
            </button>
            <button
              class="nav-link"
              id="nav-profile-tab"
              data-bs-toggle="tab"
              data-bs-target="#nav-profile"
              type="button"
              role="tab"
              aria-controls="nav-profile"
              aria-selected="false"
              tabindex="-1"
            >
              Corners
            </button>
          </div>
        </nav>
        <div class="tab-content" id="nav-tabContent">
          <div
            class="tab-pane fade show active"
            id="nav-home"
            role="tabpanel"
            aria-labelledby="nav-home-tab"
          >
            <div class="table-responsive table-wrapper" id="scrollableTable">
              <table
                class="table table-striped table-sm mb-0"
                id="tablaGoles"
                style="font-size: 10px"
              >
                <thead class="table-dark text-center">
                  <tr>
                    <th>Equipos</th>
                    <th>ID</th>
                    <th>GL</th>
                    <th>GV</th>
                    <th>1.5</th>
                    <th>2.5</th>
                    <th>3.5</th>
                    <th>L</th>
                    <th>E</th>
                    <th>V</th>
                    <th>W</th>
                    <th>D</th>
                    <th>L</th>
                    <th>GG</th>
                    <th>T</th>
                    <th>0.5</th>
                    <th>1.5</th>
                    <th>2.5</th>
                    <th>3.5</th>
                    <th>1°</th>
                    <th>H-T</th>
                    <th>S-T</th>
                    <th>B-H</th>
                  </tr>
                </thead>
                <tbody id="resultados"></tbody>
              </table>
            </div>
            <div class="row mt-3">
              <div class="col-6"></div>
              <div class="col-6">
                <input
                  type="button"
                  value="Capturar"
                  onclick="capturar()"
                  class="btn btn-warning"
                />
              </div>
            </div>
          </div>
          <div
            class="tab-pane fade"
            id="nav-profile"
            role="tabpanel"
            aria-labelledby="nav-profile-tab"
          >
            <div class="table-responsive p-md-2" id="tablaCorners">
              <table
                class="table table-striped table-sm table-dark mb-0"
                style="font-size: 10px"
              >
                <thead class="table-dark text-center">
                  <tr>
                    <th>Local</th>
                    <th>CL</th>
                    <th>CV</th>
                    <th>+/-</th>
                    <th>2.5</th>
                    <th>3.5</th>
                    <th>4.5</th>
                    <th>5.5</th>
                    <th>6.5</th>
                    <th>T</th>
                    <th>9.5</th>
                    <th>10.5</th>
                    <th>11.5</th>
                    <th>12.5</th>
                    <th>13.5</th>
                  </tr>
                </thead>
                <tbody id="corners_cards"></tbody>
              </table>
            </div>
            <div class="row mt-3">
              <div class="col-6"></div>
              <div class="col-6">
                <i class="bi bi-telephone-fill"></i>
                <input
                  type="button"
                  value="Capturar"
                  onclick=""
                  class="btn btn-warning"
                  id="downloadBtn"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
```
Y el script.js , es código muy amplio por qué lo hice cuando recién iniciaba en programación,
Pero hoy mejorable

```js
let equipos = [];
      function buscar() {
        const buscar = document.getElementById("buscador").value;
        fetch(`json/\${buscar}.json`)
          .then((res) => res.json())
          .then((data) => {
            equipos = data;
            cargar();
          });
      }
      const archivos = [
        "peru.json",
        "mls.json",
        "alemania.json",
        "argentina.json",
        "inglaterra.json",
        "noruega.json",
        "spain.json",
        "chile.json",
        "francia.json",
        "italy.json",
        "eredivise.json",
      ];
      // Inicialización
      document.addEventListener("DOMContentLoaded", function () {
        inicializarApp();
      });

      // Función principal de inicialización
      function inicializarApp() {
        cargarCompetencias();
        configurarEventos();
      }

      // Cargar lista de competencias
      async function cargarCompetencias() {
        const select = document.getElementById("clubes");

        // Limpiar opciones existentes
        select.innerHTML =
          '<option value="cero">Seleccionar una Competencia</option>';

        // Ordenar y cargar archivos
        archivos.sort((a, b) => a.localeCompare(b));

        for (const archivo of archivos) {
          try {
            const response = await fetch(`json/\${archivo}`);
            const data = await response.json();
            const nombre = data.nombre || archivo.replace(".json", "");

            const option = document.createElement("option");
            option.value = nombre.toLowerCase();
            option.textContent = nombre;
            select.appendChild(option);
          } catch (error) {
            console.error(`Error cargando \${archivo}:`, error);
          }
        }
      }

      // Configurar eventos
      function configurarEventos() {
        document
          .getElementById("clubes")
          .addEventListener("change", cambiarCompetencia);
        document
          .getElementById("btn-calcular")
          .addEventListener("click", calcular);
      }
      // Cambiar competencia seleccionada
      async function cambiarCompetencia() {
        const competencia = document.getElementById("clubes").value;

        if (competencia !== "cero") {
          try {
            const response = await fetch(`json/\${competencia}.json`);
            equipos = await response.json();
            cargarEquipos();
          } catch (error) {
            console.error(`Error cargando equipos:`, error);
            alert("Error al cargar los equipos de la competencia seleccionada");
          }
        }
      }

      // Cargar equipos en los selectores
      function cargarEquipos() {
        const selectLocal = document.getElementById("equipo-local");
        const selectVisitante = document.getElementById("equipo-visitante");

        // Limpiar selects
        selectLocal.innerHTML = "";
        selectVisitante.innerHTML = "";

        // Ordenar equipos por nombre
        equipos.sort((a, b) => a.name.localeCompare(b.name));

        // Agregar opciones
        equipos.forEach((equipo) => {
          const option = document.createElement("option");
          option.value = equipo.id;
          option.textContent = equipo.name;

          selectLocal.appendChild(option.cloneNode(true));
          selectVisitante.appendChild(option);
        });
      }

      function calcular() {
        const buscar = document.getElementById("clubes").value;
        const idLocal = parseInt(document.getElementById("equipo-local").value);
        const idVisita = parseInt(
          document.getElementById("equipo-visitante").value,
        );

        const equipoLocal = equipos.find((eq) => eq.id === idLocal);
        const equipoVisita = equipos.find((eq) => eq.id === idVisita);

        if (!equipoLocal || !equipoVisita || idLocal === idVisita) {
          alert("Debes seleccionar dos equipos diferentes.");
          return;
        }

        const pgfl = (
          (equipoLocal.goals.home.goals_scored_per_game +
            equipoVisita.goals.away.goals_conceded_per_game) /
          2
        ).toFixed(2);
        const pgfv = (
          (equipoLocal.goals.home.goals_conceded_per_game +
            equipoVisita.goals.away.goals_scored_per_game) /
          2
        ).toFixed(2);

        const gover_1_5 = (
          (equipoLocal.goals.home.over_1_5 + equipoVisita.goals.away.over_1_5) /
          2
        ).toFixed(0);
        const gover_2_5 = (
          (equipoLocal.goals.home.over_2_5 + equipoVisita.goals.away.over_2_5) /
          2
        ).toFixed(0);
        const gover_3_5 = (
          (equipoLocal.goals.home.over_3_5 + equipoVisita.goals.away.over_3_5) /
          2
        ).toFixed(0);
        const btts = (
          (equipoLocal.goals.home.both_teams_scored +
            equipoVisita.goals.away.both_teams_scored) /
          2
        ).toFixed(1);
        const total_game = (
          (equipoLocal.goals.home.total_goal_per_game +
            equipoVisita.goals.away.total_goal_per_game) /
          2
        ).toFixed(2);

        const win = (
          (equipoLocal.goals.home.win + equipoVisita.goals.away.defeats) /
          2
        ).toFixed(0);
        const draw = (
          (equipoLocal.goals.home.draw + equipoVisita.goals.away.draw) /
          2
        ).toFixed(0);
        const loss = (
          (equipoLocal.goals.home.defeats + equipoVisita.goals.away.win) /
          2
        ).toFixed(0);

        const uno = (
          (equipoLocal.scored_conceded.home.gf_over_05 +
            equipoVisita.scored_conceded.away.ga_over_05) /
          2
        ).toFixed(1);
        const dos = (
          (equipoLocal.scored_conceded.home.gf_over_15 +
            equipoVisita.scored_conceded.away.ga_over_15) /
          2
        ).toFixed(1);
        const tres = (
          (equipoLocal.scored_conceded.home.gf_over_25 +
            equipoVisita.scored_conceded.away.ga_over_25) /
          2
        ).toFixed(1);
        const cuatro = (
          (equipoLocal.scored_conceded.home.gf_over_35 +
            equipoVisita.scored_conceded.away.ga_over_35) /
          2
        ).toFixed(1);
        const cinco = (
          (equipoLocal.scored_conceded.home.gf_over_45 +
            equipoVisita.scored_conceded.away.ga_over_45) /
          2
        ).toFixed(1);
        const seis = (
          (equipoLocal.scored_conceded.home.ga_over_05 +
            equipoVisita.scored_conceded.away.gf_over_05) /
          2
        ).toFixed(1);
        const siete = (
          (equipoLocal.scored_conceded.home.ga_over_15 +
            equipoVisita.scored_conceded.away.gf_over_15) /
          2
        ).toFixed(1);
        const ocho = (
          (equipoLocal.scored_conceded.home.ga_over_25 +
            equipoVisita.scored_conceded.away.gf_over_25) /
          2
        ).toFixed(1);
        const nueve = (
          (equipoLocal.scored_conceded.home.ga_over_35 +
            equipoVisita.scored_conceded.away.gf_over_35) /
          2
        ).toFixed(1);
        const diez = (
          (equipoLocal.scored_conceded.home.ga_over_45 +
            equipoVisita.scored_conceded.away.gf_over_45) /
          2
        ).toFixed(1);

        const firstl = (
          (equipoLocal.goals.home.team_scored_first +
            equipoVisita.goals.away.opponent_scored_first) /
          2
        ).toFixed(0);
        const firstv = (
          (equipoLocal.goals.home.opponent_scored_first +
            equipoVisita.goals.away.team_scored_first) /
          2
        ).toFixed(0);

        /*for (let i = 0; i < 3; i++) {
                la += ((equipoLocal.last_3_result.home.for[i] + equipoVisita.last_3_result.away.against[i]));
                va += ((equipoLocal.last_3_result.home.against[i] + equipoVisita.last_3_result.away.for[i]));
            }
            */
        const total = ((Number(pgfl) + Number(pgfv)) / 1.2).toFixed(2);

        //rates
        const ssl = (
          (equipoLocal.rates.home.scoring_rate +
            equipoVisita.rates.away.conceding_rate) /
          2
        ).toFixed(1);
        const ptl = (
          (equipoLocal.rates.home.scoring_rate_1st_h +
            equipoVisita.rates.away.conceding_rate_1st_half) /
          2
        ).toFixed(1);
        const stl = (
          (equipoLocal.rates.home.scoring_rate_2nd_h +
            equipoVisita.rates.away.conceding_rate_2nd_half) /
          2
        ).toFixed(1);
        const aal = (
          (equipoLocal.rates.home.scored_in_both_halves +
            equipoVisita.rates.away.conceded_in_both_halves) /
          2
        ).toFixed(1);

        const ssv = (
          (equipoLocal.rates.home.conceding_rate +
            equipoVisita.rates.away.scoring_rate) /
          2
        ).toFixed(1);
        const ptv = (
          (equipoLocal.rates.home.conceding_rate_1st_half +
            equipoVisita.rates.away.scoring_rate_1st_h) /
          2
        ).toFixed(1);
        const stv = (
          (equipoLocal.rates.home.conceding_rate_2nd_half +
            equipoVisita.rates.away.scoring_rate_2nd_h) /
          2
        ).toFixed(1);
        const aav = (
          (equipoLocal.rates.home.conceded_in_both_halves +
            equipoVisita.rates.away.scored_in_both_halves) /
          2
        ).toFixed(1);

        //la = (la/6).toFixed(2);
        //va = (va/6).toFixed(2);
        // tla = ((Number(la)+Number(pgfl))/2).toFixed(2);
        //  tva = ((Number(va)+Number(pgfv))/2).toFixed(2);

        var myTable = document.getElementById("resultados");
        //agregar filas a la tabla

        var row = myTable.insertRow(myTable.rows.length);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        var cell5 = row.insertCell(4);
        var cell6 = row.insertCell(5);
        var cell7 = row.insertCell(6);
        var cell8 = row.insertCell(7);
        var cell9 = row.insertCell(8);
        var cell10 = row.insertCell(9);
        var cell11 = row.insertCell(10);
        var cell12 = row.insertCell(11);
        var cell13 = row.insertCell(12);
        var cell14 = row.insertCell(13);
        var cell15 = row.insertCell(14);
        var cell16 = row.insertCell(15);
        var cell17 = row.insertCell(16);
        var cell18 = row.insertCell(17);
        var cell19 = row.insertCell(18);
        var cell20 = row.insertCell(19);
        var cell21 = row.insertCell(20);
        var cell22 = row.insertCell(21);
        var cell23 = row.insertCell(22);

        cell1.innerHTML = equipoLocal.name + `</br>` + equipoVisita.name;
        cell1.setAttribute("onClick", `cargarDatos(\${idLocal},\${idVisita})`);
        cell2.innerHTML = equipoLocal.id + `</br>` + equipoVisita.id;
        //`<span class="text-underline"  onclick="cargarDatos(\${idLocal},'local')">\${equipoLocal.name} </span> ` +`</br>`+equipoVisita.name;
        cell3.innerHTML = pgfl;
        cell3.classList.add("text-success", "fw-bolder");
        cell4.innerHTML = pgfv;
        cell4.classList.add("text-danger", "fw-bolder");
        cell5.innerHTML = gover_1_5;
        cell6.innerHTML = gover_2_5;
        colorear(gover_2_5, cell6, 2);
        cell7.innerHTML = gover_3_5;
        colorear(gover_3_5, cell7, 3);

        //cell8.classList.add("text-warning");
        //cell8.classList.add("fw-bolder");
        cell8.innerHTML = win;
        //cell9.classList.add("text-primary");
        cell9.innerHTML = draw;
        //cell10.classList.add("text-primary");
        cell10.innerHTML = loss;
        //cell11.classList.add("text-primary");
        ganador(win, draw, loss, cell8, cell9, cell10);
        cell11.innerHTML =
          equipoLocal.goals.home.win + `</br>` + equipoVisita.goals.away.win;
        cell12.innerHTML =
          equipoLocal.goals.home.draw + `</br>` + equipoVisita.goals.away.draw;
        cell13.innerHTML =
          equipoLocal.goals.home.defeats +
          `</br>` +
          equipoVisita.goals.away.defeats;
        cell14.innerHTML = btts;
        colorear(btts, cell14, 4);
        cell15.innerHTML = total_game;
        cell15.classList.add("text-primary", "fw-bolder");
        cell16.innerHTML = porcent(uno, seis, cell16, "cero");
        //uno +`</br>`+ seis;
        cell17.innerHTML = porcent(dos, siete, cell17, "uno");
        //dos +`</br>`+ siete;
        cell18.innerHTML = porcent(tres, ocho, cell18, "dos");
        //tres +`</br>`+ ocho;
        cell19.innerHTML = porcent(cuatro, nueve, cell19, "tres");
        //cuatro +`</br>`+ nueve;
        //cell20.innerHTML = cinco +`</br>`+ diez;
        cell20.innerHTML = firstcolor(firstl, firstv, cell20);
        cell20.classList.add("bg-warning-subtle");
        //firstl +`</br>`+ firstv;
        cell21.innerHTML = tiempos(ptl, ptv, cell21, "ht-ft");
        //ptl+ "</br>"+ptv;
        cell22.innerHTML = tiempos(stl, stv, cell22, "ht-ft");
        //stl +"</br>"+ stv;
        cell23.innerHTML = tiempos(aal, aav, cell23, "bt");
        //aal +"</br>"+ aav;
        // corners

        const pcfl = (
          (equipoLocal.corners_for.home.avg +
            equipoVisita.corners_against.away.avg) /
          2
        ).toFixed(2);
        const pcfv = (
          (equipoLocal.corners_against.home.avg +
            equipoVisita.corners_for.away.avg) /
          2
        ).toFixed(2);
        const pct = (
          (equipoLocal.Total_corners.home.avg +
            equipoVisita.Total_corners.away.avg) /
          2
        ).toFixed(2);

        const lover_2_5 = (
          (equipoLocal.corners_for.home.over_2_5 +
            equipoVisita.corners_against.away.over_2_5) /
          2
        ).toFixed(0);
        const lover_3_5 = (
          (equipoLocal.corners_for.home.over_3_5 +
            equipoVisita.corners_against.away.over_3_5) /
          2
        ).toFixed(0);
        const lover_4_5 = (
          (equipoLocal.corners_for.home.over_4_5 +
            equipoVisita.corners_against.away.over_4_5) /
          2
        ).toFixed(0);
        const lover_5_5 = (
          (equipoLocal.corners_for.home.over_5_5 +
            equipoVisita.corners_against.away.over_5_5) /
          2
        ).toFixed(0);
        const lover_6_5 = (
          (equipoLocal.corners_for.home.over_6_5 +
            equipoVisita.corners_against.away.over_6_5) /
          2
        ).toFixed(0);

        const vover_2_5 = (
          (equipoLocal.corners_against.home.over_2_5 +
            equipoVisita.corners_for.away.over_2_5) /
          2
        ).toFixed(0);
        const vover_3_5 = (
          (equipoLocal.corners_against.home.over_3_5 +
            equipoVisita.corners_for.away.over_3_5) /
          2
        ).toFixed(0);
        const vover_4_5 = (
          (equipoLocal.corners_against.home.over_4_5 +
            equipoVisita.corners_for.away.over_4_5) /
          2
        ).toFixed(0);
        const vover_5_5 = (
          (equipoLocal.corners_against.home.over_5_5 +
            equipoVisita.corners_for.away.over_5_5) /
          2
        ).toFixed(0);
        const vover_6_5 = (
          (equipoLocal.corners_against.home.over_6_5 +
            equipoVisita.corners_for.away.over_6_5) /
          2
        ).toFixed(0);

        //const corners_total = ((equipoLocal.Total_corners.home.avg + equipoVisita.Total_corners.away.avg)/2).toFixed(2);
        const over_9_5 = (
          (equipoLocal.Total_corners.home.over_9_5 +
            equipoVisita.Total_corners.away.over_9_5) /
          2
        ).toFixed(0);
        const over_10_5 = (
          (equipoLocal.Total_corners.home.over_10_5 +
            equipoVisita.Total_corners.away.over_10_5) /
          2
        ).toFixed(0);
        const over_11_5 = (
          (equipoLocal.Total_corners.home.over_11_5 +
            equipoVisita.Total_corners.away.over_11_5) /
          2
        ).toFixed(0);
        const over_12_5 = (
          (equipoLocal.Total_corners.home.over_12_5 +
            equipoVisita.Total_corners.away.over_12_5) /
          2
        ).toFixed(0);
        const over_13_5 = (
          (equipoLocal.Total_corners.home.over_13_5 +
            equipoVisita.Total_corners.away.over_13_5) /
          2
        ).toFixed(0);

        const total_corners = ((Number(pcfl) + Number(pcfv)) / 1.1).toFixed(2);
        //const cl = ((Number(total_corners)+Number(equipoLocal.corners.home.total))/2).toFixed(2);
        //const cv = ((Number(total_corners)+Number(equipoLocal.corners.away.total))/2).toFixed(2);

        var myTablec = document.getElementById("corners_cards");
        //agregar filas a la tabla

        var row = myTablec.insertRow(myTablec.rows.length);

        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        var cell5 = row.insertCell(4);
        var cell6 = row.insertCell(5);
        var cell7 = row.insertCell(6);
        var cell8 = row.insertCell(7);
        var cell9 = row.insertCell(8);
        var cell10 = row.insertCell(9);
        var cell11 = row.insertCell(10);
        var cell12 = row.insertCell(11);
        var cell13 = row.insertCell(12);
        var cell14 = row.insertCell(13);
        var cell15 = row.insertCell(14);

        cell1.innerHTML = equipoLocal.name + `</br>` + equipoVisita.name;
        cell2.innerHTML = pcfl;
        cell2.classList.add("text-success");
        cell3.innerHTML = pcfv;
        cell3.classList.add("text-danger");
        cell4.innerHTML = total_corners;
        cell4.classList.add("text-warning");
        cell5.innerHTML = lover_2_5 + "</br>" + vover_2_5;
        cell6.innerHTML = lover_3_5 + "</br>" + vover_3_5;
        cell7.innerHTML = lover_4_5 + "</br>" + vover_4_5;
        cell8.innerHTML = lover_5_5 + "</br>" + vover_5_5;
        cell9.innerHTML = lover_6_5 + "</br>" + vover_6_5;
        cell10.innerHTML = pct;
        cell10.classList.add("text-warning");
        cell11.innerHTML = over_9_5;
        cell12.innerHTML = over_10_5;
        cell13.innerHTML = over_11_5;
        cell14.innerHTML = over_12_5;
        cell15.innerHTML = over_13_5;
      }

      function ganador(local, empate, visita, celda9, celda10, celda11) {
        let ganador = [local, visita];

        let mayor = Math.max(...ganador);
        let menor = Math.min(...ganador);
        let diferencia;

        celda9.classList.add("text-primary");
        celda10.classList.add("text-primary");
        celda11.classList.add("text-primary");

        if (empate > menor) {
          diferencia = mayor - empate;
        } else {
          diferencia = mayor - menor;
        }
        if (empate > mayor && empate - mayor >= 4) {
          celda10.classList.add("fw-bolder");
          //celda10.classList.add("text-violet");
        }
        if (diferencia > 19 && mayor == local) {
          celda9.classList.add("fw-bolder");
          //celda9.classList.add("text-violet");
        }
        if (diferencia > 14 && mayor == visita) {
          celda11.classList.add("fw-bolder");
          //celda11.classList.add("text-violet");
        }

        return (celda9, celda10, celda11);
      }
      function tiempos(local, visita, celda, caso) {
        switch (caso) {
          case "ht-ft":
            if (local > 49) {
              celda = `<span class="text-violet">\${local}</span>`;
            } else {
              celda = local;
            }
            if (visita > 49) {
              celda += `</br><span class="text-violet">\${visita}</span>`;
            } else {
              celda += `</br>` + visita;
            }
            return celda;
            break;
          case "bt":
            if (local - visita >= 14.5) {
              celda = `<span class="text-violet">\${local}</span>`;
            } else {
              celda = local;
            }
            if (visita - local >= 14.5) {
              celda += `</br><span class="text-violet">\${visita}</span>`;
            } else {
              celda += `</br>` + visita;
            }
            return celda;
            break;
        }
      }
      function porcent(local, visita, celda, caso) {
        switch (caso) {
          case "cero":
            if (local > 69) {
              celda = `<span class="text-orange">\${local}</span>`;
            } else {
              celda = local;
            }
            if (visita > 64) {
              celda += `</br><span class="text-orange">\${visita}</span>`;
            } else {
              celda += `</br>` + visita;
            }
            return celda;
            break;
          case "uno":
            if (local > 55) {
              celda = `<span class="text-success">\${local}</span>`;
            } else {
              celda = local;
            }
            if (visita > 49) {
              celda += `</br><span class="text-success">\${visita}</span>`;
            } else {
              celda += `</br>` + visita;
            }
            return celda;
            break;
          case "dos":
            if (local > 36) {
              celda = `<span class="text-success">\${local}</span>`;
            } else {
              celda = local;
            }
            if (visita > 26) {
              celda += `</br><span class="text-success">\${visita}</span>`;
            } else {
              celda += `</br>` + visita;
            }
            return celda;
            break;
          case "tres":
            if (local > 20) {
              celda = `<span class="text-success">\${local}</span>`;
            } else {
              celda = local;
            }
            if (visita > 15) {
              celda += `</br><span class="text-success">\${visita}</span>`;
            } else {
              celda += `</br>` + visita;
            }
            return celda;
            break;
        }
      }
      function colorear(color, celda, caso) {
        switch (caso) {
          case 2:
            if (color < 62) {
              celda.classList.add("text-muted");
            }
            return celda;
            break;
          case 3:
            if (color < 38) {
              celda.classList.add("text-muted");
            }
            return celda;
            break;
          case 4:
            celda.classList.add("text-warning");
            if (color > 55) {
              celda.classList.add("fw-bolder");
            }
            return celda;
            break;
        }
      }
      function firstcolor(local, visita, celda) {
        let primero = [local, visita];

        let mayor = Math.max(...primero);
        let menor = Math.min(...primero);
        let diferencia = mayor - menor;

        if (mayor == local) {
          if (diferencia > 24) {
            celda = `<span class="text-danger">\${local}</span></br>\${visita}`;
          } else {
            celda = `\${local}</br>\${visita}`;
          }
        } else if (mayor == visita) {
          if (diferencia > 24) {
            celda = `\${local}</br><span class="text-danger">\${visita}</span>`;
          } else {
            celda = `\${local}</br>\${visita}`;
          }
        }
        return celda;
      }
      function capturar() {
        const div = document.getElementById("tablaGoles");
        //const tag = document.getElementById("clubes").value;

        html2canvas(div).then((canvas) => {
          // Opción 1: Mostrar en pantalla
          // Opción 2: Descargar como imagen
          const enlace = document.createElement("a");
          enlace.download = "goles.png";
          enlace.href = canvas.toDataURL("image/png");
          enlace.click();
        });
      }
      function capturarCorners() {
        const div = document.getElementById("tablaCorners");
        //const tag = document.getElementById("clubes").value;

        html2canvas(div).then((canvas) => {
          // Opción 1: Mostrar en pantalla
          // Opción 2: Descargar como imagen
          const enlace = document.createElement("a");
          enlace.download = "corners.png";
          enlace.href = canvas.toDataURL("image/png");
          enlace.click();
        });
      }
      function cargarDatos(id1, id2) {
        //const home = document.getElementById('local');
        //const away = document.getElementById("visita");
        //let array = ['local','visita'];
        const equipoLocal = equipos.find((eq) => eq.id === id1);
        const equipoVisita = equipos.find((eq) => eq.id === id2);
        let ides = [equipoLocal, equipoVisita];
        let lovi = ["home", "away"];
        var i = 0;

        function cargar(obj, localia) {
          let div = document.getElementById(localia);
          //nuevo.av_results.home[key] = parseFloat(form[`av_results.home.\${key}`].value);
          div.innerHTML = "";
          div.classList.add("d-flex", "flex-column");
          const namel = document.createElement("h5");
          namel.innerHTML = ides[i].name;
          const id = document.createElement("b");
          id.innerHTML = ides[i].id;
          const gol = document.createElement("small");
          const gg = document.createElement("small");
          const over = document.createElement("small");
          gol.innerHTML = "GPG: " + obj.total_goal_per_game;
          gg.innerHTML = "GG: " + obj.both_teams_scored;
          over.innerHTML = "2.5+: " + obj.over_2_5;
          //console.log(`ides[i].goals.\${key}.both_teams_scored`);
          div.appendChild(namel);
          div.appendChild(id);
          div.appendChild(gol);
          div.appendChild(over);
          div.appendChild(gg);
          i++;
        }
        cargar(equipoLocal.goals.home, "home");
        cargar(equipoVisita.goals.away, "away");
      }

      document.addEventListener("DOMContentLoaded", function () {
        const table = document.getElementById("tablaGoles");
        const wrapper = document.getElementById("scrollableTable");

        // Función para fijar la primera columna
        function fixFirstColumn() {
          // Asegurarse que la primera celda de cabecera tenga las clases correctas
          const firstHeaderCell = table.querySelector("thead th:first-child");
          if (firstHeaderCell) {
            firstHeaderCell.classList.add("fixed-column", "fixed-header");
          }

          // Aplicar a todas las celdas del cuerpo
          const bodyCells = table.querySelectorAll("tbody td:first-child");
          bodyCells.forEach((cell) => {
            cell.classList.add("fixed-column");
          });
          const footCells = table.querySelectorAll("tfoot td:first-child");
          footCells.forEach((cell) => {
            cell.classList.add("fixed-column");
          });

          // Ajustar el margen izquierdo del contenedor al ancho de la columna fija
          /*if (firstHeaderCell) {
      wrapper.style.marginLeft = `\${firstHeaderCell.offsetWidth}px`;
    }*/
        }

        // Llamar la función inicialmente
        fixFirstColumn();

        // Opcional: Observar cambios en la tabla (para tablas dinámicas)
        const observer = new MutationObserver(function (mutations) {
          mutations.forEach(() => {
            fixFirstColumn();
          });
        });

        observer.observe(table, {
          childList: true,
          subtree: true,
        });

        // Opcional: Recalcular en redimensionamiento
        window.addEventListener("resize", fixFirstColumn);
      });
```
Es potencialmente:

Pipeline de datos + motor estadístico + aplicación de análisis.

Ahora aparecen 5 capas reales

1. Data Acquisition (Scraping) Fuente: SoccerSTATS

2. Data Storage.

3. Prediction Engine.

4. API Esto antes no existía.

5. UI  React con estilo de "Betano.com"

---
Quiero automatizar esto:

- después de cada jornada ó cada jueves.
- Scraper corre.
- Actualiza DB.
- Recalcula pronósticos.
- React refleja cambios.

> He aquí un problema, y es que necesitamos laprogramacion de fechas;
Y no se cómo obtener, si hay Apis gratuitas?  o conseguir, mediante otro scraping.

Quiero que la web tenga los estilos de betano.com
- automatizar para varias ligas, ordenados por países 
- enfrentamientos internacionales ordenados por continentes

Quiero desarrollarlo con varios agentes IA, 
- cada agente se encargara de una tarea para avanzar parte por parte
- quiero que tú y yo seamos los cerebros o arquitectos del proyecto y delegar las tareas 
a los otros agentes IA, con una buena documentación, para que tengan buen contexto del proyecto.
- tengo una limitante y es que estaré trabajando desde la terminal "termux" del móvil
- trabajaré en un repositorio público de Github 
- quiero trabajar con React + Vite,  typescript, tailwind css, frame-motion,  con modo oscuro 
- Quiero extender el archivo tailwind.config.js con los valores personalizados de colores, Con una UI similar a Betano.com.


Planifica las fases del proyecto, para empezar con una buena base.
