# Sports Predictions - Sistema de Pronósticos Deportivos

Plataforma full-stack para generar pronósticos deportivos basados en estadísticas de fútbol, con scraping automatizado, almacenamiento en PostgreSQL y frontend estilo Betano.

## 🚀 Características

- **Scraping Automatizado**: Extracción de estadísticas desde SoccerSTATS
- **Motor de Predicciones**: Algoritmos estadísticos para calcular probabilidades
- **Multi-Liga**: Soporte para Bundesliga, Premier League, La Liga, Serie A, Ligue 1
- **Interfaz Moderna**: UI estilo Betano con tema oscuro
- **Automatización**: Actualizaciones periódicas programadas
- **API REST**: Backend basado en FastAPI

## 🛠️ Tech Stack

### Frontend
- React 18 + Vite 5
- TypeScript 5
- Tailwind CSS 3
- Framer Motion 11
- React Router 6
- React Query 5
- Zustand

### Backend
- FastAPI 0.109
- PostgreSQL + SQLAlchemy 2
- BeautifulSoup4 (Scraping)
- APScheduler (Automatización)

## 📁 Estructura del Proyecto

```
sport-predictions/
├── frontend/              # React + Vite
│   ├── src/
│   │   ├── components/   # Componentes React
│   │   ├── pages/        # Páginas
│   │   ├── hooks/        # Custom hooks
│   │   ├── services/     # API client
│   │   └── types/        # TypeScript types
│   └── package.json
│
├── backend/               # FastAPI
│   ├── app/
│   │   ├── api/          # Endpoints
│   │   ├── models/       # SQLAlchemy models
│   │   ├── scraper/      # Módulos scraping
│   │   └── services/     # Lógica de negocio
│   ├── requirements.txt
│   └── main.py
│
└── PROYECTO-PRONOSTICOS.md  # Documentación completa
```

## 🚦 Primeros Pasos

### Requisitos
- Node.js 18+
- Python 3.10+
- PostgreSQL (local o remoto)

### Instalación

```bash
# Clonar repositorio
git clone https://github.com/tu-usuario/sport-predictions.git
cd sport-predictions

# Frontend
cd frontend
npm install
npm run dev

# Backend (nueva terminal)
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

### Configuración

1. Crear base de datos PostgreSQL:
```sql
CREATE DATABASE sports_db;
```

2. Copiar archivos de configuración:
```bash
cp backend/.env.example backend/.env
# Editar .env con tus credenciales
```

3. Ejecutar migraciones:
```bash
cd backend
alembic upgrade head
```

## 📖 Documentación

Ver [PROYECTO-PRONOSTICOS.md](./PROYECTO-PRONOSTICOS.md) para documentación detallada del proyecto.

## 🤝 Contribuciones

1. Fork del repositorio
2. Crear rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Add feature'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📝 Licencia

MIT License

---

⭐️ Created for sports betting analysis