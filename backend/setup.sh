#!/bin/bash

# Colores para output
GREEN='\033[0;32m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Creando estructura del backend con ES modules...${NC}"

# 1. Crear carpetas
mkdir -p backend/src/{config,db,routes,services,utils,middlewares}
mkdir -p backend/scripts

# 2. Entrar al proyecto
cd backend

# 3. Inicializar package.json con "type": "module"
npm init -y
# Modificar type a module (si no quedó automático)
node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
pkg.type = 'module';
pkg.main = 'dist/index.js';
pkg.scripts = {
  dev: 'nodemon --exec ts-node --esm src/index.ts',
  build: 'tsc',
  start: 'node dist/index.js'
};
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
"

# 4. Instalar dependencias de producción
npm install express cors helmet morgan dotenv drizzle-orm pg

# 5. Instalar dependencias de desarrollo
npm install -D typescript @types/node @types/express @types/cors @types/morgan ts-node nodemon

# 6. Crear tsconfig.json (ES modules con NodeNext)
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*"],
  "ts-node": {
    "esm": true,
    "experimentalSpecifierResolution": "node"
  }
}
EOF

# 7. Crear archivo .env de ejemplo
cat > .env << 'EOF'
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
EOF

# 8. Crear src/app.ts (configuración Express)
cat > src/app.ts << 'EOF'
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Rutas (se añadirán después)
// app.use('/api/leagues', leaguesRouter);

export default app;
EOF

# 9. Crear src/index.ts (entrada del servidor)
cat > src/index.ts << 'EOF'
import app from './app.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
EOF

# 10. Crear un archivo ejemplo de ruta (para mostrar estructura)
cat > src/routes/leagues.ts << 'EOF'
import { Router } from 'express';

const router = Router();

// Ejemplo de ruta
router.get('/', (req, res) => {
  res.json({ message: 'Lista de ligas' });
});

export default router;
EOF

# 11. Modificar app.ts para importar esa ruta (descomentar)
# Esto se hace con sed para no sobrescribir todo
sed -i "s|// app.use('/api/leagues', leaguesRouter);|import leaguesRouter from './routes/leagues.js';\napp.use('/api/leagues', leaguesRouter);|" src/app.ts

echo -e "${GREEN}✅ Estructura creada correctamente.${NC}"
echo -e "${GREEN}📁 Entra al proyecto: cd backend${NC}"
echo -e "${GREEN}▶️  Ejecuta: npm run dev${NC}"
