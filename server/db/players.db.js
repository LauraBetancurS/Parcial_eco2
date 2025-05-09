// 📦 Importa el helper para asignar roles aleatoriamente
const { assignRoles } = require("../utils/helpers");

// 🧠 Base de datos en memoria: un arreglo que guarda a los jugadores
const players = [];

/* ────────────────────────────────────────────────
  ✅ Obtener todos los jugadores
──────────────────────────────────────────────── */
const getAllPlayers = () => {
  return players;
};

/* ────────────────────────────────────────────────
  ✅ Agregar un nuevo jugador con nickname y socketId
  ✔️ Inicializa su score en 0
──────────────────────────────────────────────── */
const addPlayer = (nickname, socketId) => {
  const newPlayer = { id: socketId, nickname, score: 0 };
  players.push(newPlayer);
  return newPlayer;
};

/* ────────────────────────────────────────────────
  ✅ Buscar jugador por su socketId
  ✔️ Se usa en lógica como selectPolo o updateScore
──────────────────────────────────────────────── */
const findPlayerById = (socketId) => {
  return players.find((player) => player.id === socketId) || null;
};

/* ────────────────────────────────────────────────
  ✅ Asignar roles a los jugadores
  ✔️ Conserva los puntajes anteriores
  ✔️ Usa assignRoles() desde helpers.js
──────────────────────────────────────────────── */
const assignPlayerRoles = () => {
  const playersWithRoles = assignRoles(players);

  // Conserva puntuación previa al reasignar roles
  playersWithRoles.forEach((updated) => {
    const existing = findPlayerById(updated.id);
    if (existing) updated.score = existing.score || 0;
  });

  // Reemplaza el array de jugadores con los que ya tienen rol
  players.splice(0, players.length, ...playersWithRoles);
  return players;
};

/* ────────────────────────────────────────────────
  ✅ Buscar jugadores por rol (o array de roles)
  ✔️ Útil para notificar a "polo", "marco", etc.
──────────────────────────────────────────────── */
const findPlayersByRole = (role) => {
  if (Array.isArray(role)) {
    return players.filter((player) => role.includes(player.role));
  }
  return players.filter((player) => player.role === role);
};

/* ────────────────────────────────────────────────
  ✅ Obtener el estado general del juego (jugadores)
──────────────────────────────────────────────── */
const getGameData = () => {
  return { players };
};

/* ────────────────────────────────────────────────
  ❌ Reiniciar completamente el juego (borra todos los jugadores)
  ✔️ Se usa si quieres reiniciar desde cero
──────────────────────────────────────────────── */
const resetGame = () => {
  players.splice(0, players.length);
};

/* ────────────────────────────────────────────────
  🔢 Actualizar la puntuación de un jugador
  ✔️ Se puede sumar o restar puntos
──────────────────────────────────────────────── */
const updateScore = (socketId, delta) => {
  const player = findPlayerById(socketId);
  if (player) {
    player.score += delta;
  }
  return player;
};

/* ────────────────────────────────────────────────
  🏆 Verifica si alguien ha ganado (≥ 100 pts)
──────────────────────────────────────────────── */
const checkForWinner = () => {
  return players.find((player) => player.score >= 100) || null;
};

/* ────────────────────────────────────────────────
  📊 Obtener jugadores ordenados por puntaje (desc)
  ✔️ Para mostrar rankings
──────────────────────────────────────────────── */
const getPlayersSortedByScore = () => {
  return [...players].sort((a, b) => b.score - a.score);
};

/* ────────────────────────────────────────────────
  🔠 Obtener jugadores ordenados alfabéticamente
──────────────────────────────────────────────── */
const getPlayersSortedByName = () => {
  return [...players].sort((a, b) => a.nickname.localeCompare(b.nickname));
};

/* ────────────────────────────────────────────────
  🔁 Reinicia solo los puntajes de todos los jugadores
  ✔️ Se usa al reiniciar el juego pero manteniendo usuarios
──────────────────────────────────────────────── */
const resetScores = () => {
  players.forEach((p) => (p.score = 0));
};

// 📤 Exporta todas las funciones para uso en controladores
module.exports = {
  getAllPlayers,
  addPlayer,
  findPlayerById,
  assignPlayerRoles,
  findPlayersByRole,
  getGameData,
  resetGame,
  updateScore,
  checkForWinner,
  getPlayersSortedByScore,
  getPlayersSortedByName,
  resetScores,
};
