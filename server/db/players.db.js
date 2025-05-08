/**
 * Database service for player-related operations
 */
const { assignRoles } = require("../utils/helpers");

const players = [];

/**
 * Get all players
 * @returns {Array} Array of player objects
 */
const getAllPlayers = () => {
  return players;
};

/**
 * Add a new player
 * @param {string} nickname - Player's nickname
 * @param {string} socketId - Player's socket ID
 * @returns {Object} The created player
 */
const addPlayer = (nickname, socketId) => {
  const newPlayer = { id: socketId, nickname, score: 0 };
  players.push(newPlayer);
  return newPlayer;
};

/**
 * Find a player by their socket ID
 * @param {string} socketId - Player's socket ID
 * @returns {Object|null} Player object or null if not found
 */
const findPlayerById = (socketId) => {
  return players.find((player) => player.id === socketId) || null;
};

/**
 * Assign roles to all players
 * @returns {Array} Array of players with assigned roles
 */
const assignPlayerRoles = () => {
  const playersWithRoles = assignRoles(players);
  // Keep scores intact while assigning new roles
  playersWithRoles.forEach((updated) => {
    const existing = findPlayerById(updated.id);
    if (existing) updated.score = existing.score || 0;
  });

  players.splice(0, players.length, ...playersWithRoles);
  return players;
};

/**
 * Find players by role
 * @param {string|Array} role - Role or array of roles to find
 * @returns {Array} Array of players with the specified role(s)
 */
const findPlayersByRole = (role) => {
  if (Array.isArray(role)) {
    return players.filter((player) => role.includes(player.role));
  }
  return players.filter((player) => player.role === role);
};

/**
 * Get all game data (includes players)
 * @returns {Object} Object containing players array
 */
const getGameData = () => {
  return { players };
};

/**
 * Reset game data (clears all players)
 */
const resetGame = () => {
  players.splice(0, players.length);
};

/**
 * Update score of a player
 * @param {string} socketId - Player's socket ID
 * @param {number} delta - Points to add (can be negative)
 */
const updateScore = (socketId, delta) => {
  const player = findPlayerById(socketId);
  if (player) {
    player.score += delta;
  }
  return player;
};

/**
 * Check if someone won (>= 100 points)
 * @returns {Object|null} Player who won or null
 */
const checkForWinner = () => {
  return players.find((player) => player.score >= 100) || null;
};

/**
 * Get players sorted by score descending
 * @returns {Array}
 */
const getPlayersSortedByScore = () => {
  return [...players].sort((a, b) => b.score - a.score);
};

/**
 * Get players sorted alphabetically
 * @returns {Array}
 */
const getPlayersSortedByName = () => {
  return [...players].sort((a, b) => a.nickname.localeCompare(b.nickname));
};

/**
 * Reset only scores
 */
const resetScores = () => {
  players.forEach((p) => (p.score = 0));
};

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
