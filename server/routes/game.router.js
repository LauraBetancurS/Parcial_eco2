// 📦 Importa Express para crear rutas HTTP
const express = require("express");

// 📥 Importa el controlador con la lógica del juego (game.controller.js)
const gameController = require("../controllers/game.controller");

// 🔧 Crea un nuevo enrutador de Express
const router = express.Router();

/* ────────────────────────────────────────────────
  ✅ RUTAS DEL JUEGO
  Cada ruta responde a una acción específica del flujo
──────────────────────────────────────────────── */

// 🎮 Ruta para que un jugador se una al juego
// 🔗 POST /api/game/join
router.post("/join", gameController.joinGame);

// 🚀 Ruta para iniciar la partida y asignar roles
// 🔗 POST /api/game/start
router.post("/start", gameController.startGame);

// 📢 Ruta cuando el marco grita "¡Marco!"
// 🔗 POST /api/game/marco
router.post("/marco", gameController.notifyMarco);

// 📣 Ruta cuando un polo grita "¡Polo!"
// 🔗 POST /api/game/polo
router.post("/polo", gameController.notifyPolo);

// 🕹️ Ruta cuando el marco selecciona a quién atrapó
// 🔗 POST /api/game/select-polo
router.post("/select-polo", gameController.selectPolo);

// 🔄 Ruta nueva para reiniciar el juego y los puntajes
// 🔗 POST /api/game/reset
router.post("/reset", gameController.resetGame);

/* ────────────────────────────────────────────────
  ✅ Exporta el router para usarlo en index.js
──────────────────────────────────────────────── */
module.exports = router;

