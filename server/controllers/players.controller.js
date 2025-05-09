// 📦 Importa la base de datos de jugadores
// Este archivo contiene funciones para acceder, ordenar y modificar a los jugadores
const playersDb = require("../db/players.db");

/* ────────────────────────────────────────────────
  🧩 Función: getPlayers
  ✔️ Devuelve la lista de jugadores actuales
  ✔️ Puede ordenarse por puntaje o alfabéticamente
──────────────────────────────────────────────── */
const getPlayers = async (req, res) => {
  try {
    // 🔍 Extrae el parámetro de consulta opcional `sort`
    // Puede ser ?sort=alpha para ordenar alfabéticamente
    const sortType = req.query.sort;

    let players;

    // ✅ Si la URL contiene ?sort=alpha, ordena por nombre
    if (sortType === "alpha") {
      players = playersDb.getPlayersSortedByName(); // 🟣 Orden alfabético A-Z
    } else {
      // ✅ Si no se especifica, ordena por puntaje descendente
      players = playersDb.getPlayersSortedByScore(); // 🟣 Orden por score de mayor a menor
    }

    // 📤 Devuelve la lista al cliente (pantalla de resultados)
    res.status(200).json(players);

  } catch (err) {
    // ❌ Si ocurre un error, lo captura y responde con código 500
    res.status(500).json({ error: err.message });
  }
};

// 📦 Exporta la función para que pueda ser usada en players.router.js
module.exports = {
  getPlayers,
};
