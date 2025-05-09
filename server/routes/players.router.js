// 📦 Importa Express para poder definir rutas
const express = require('express');

// 📥 Importa el controlador que maneja la lógica de jugadores (puntajes, orden)
const playersController = require('../controllers/players.controller');

// 🔧 Crea un nuevo enrutador con Express
const router = express.Router();

/* ────────────────────────────────────────────────
  ✅ Ruta: GET /api/players
  ✔️ Devuelve lista de jugadores
  ✔️ Permite ordenarlos por puntaje (default) o alfabéticamente con ?sort=alpha
  ✔️ Se usa en las pantallas de resultados
──────────────────────────────────────────────── */
router.get('/players', playersController.getPlayers);

// 📤 Exporta el router para que se use en index.js del backend
module.exports = router;
