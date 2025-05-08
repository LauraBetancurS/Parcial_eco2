const playersDb = require("../db/players.db");
const {
  emitEvent,
  emitToSpecificClient,
} = require("../services/socket.service");

const joinGame = async (req, res) => {
  try {
    const { nickname, socketId } = req.body;
    playersDb.addPlayer(nickname, socketId);

    const gameData = playersDb.getGameData();
    emitEvent("userJoined", gameData); // Actualiza también en screen1.js

    res.status(200).json({ success: true, players: gameData.players });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const startGame = async (req, res) => {
  try {
    const playersWithRoles = playersDb.assignPlayerRoles();

    playersWithRoles.forEach((player) => {
      emitToSpecificClient(player.id, "startGame", player.role);
    });

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const notifyMarco = async (req, res) => {
  try {
    const { socketId } = req.body;

    const rolesToNotify = playersDb.findPlayersByRole([
      "polo",
      "polo-especial",
    ]);

    rolesToNotify.forEach((player) => {
      emitToSpecificClient(player.id, "notification", {
        message: "Marco!!!",
        userId: socketId,
      });
    });

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const notifyPolo = async (req, res) => {
  try {
    const { socketId } = req.body;

    const rolesToNotify = playersDb.findPlayersByRole("marco");

    rolesToNotify.forEach((player) => {
      emitToSpecificClient(player.id, "notification", {
        message: "Polo!!",
        userId: socketId,
      });
    });

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const selectPolo = async (req, res) => {
  try {
    const { socketId, poloId } = req.body;

    const marco = playersDb.findPlayerById(socketId);
    const polo = playersDb.findPlayerById(poloId);
    const allPlayers = playersDb.getAllPlayers();

    let message = "";

    if (polo.role === "polo-especial") {
      playersDb.updateScore(marco.id, 50);
      playersDb.updateScore(polo.id, -10);
      message = `¡${marco.nickname} atrapó al polo especial ${polo.nickname}!`;
    } else {
      playersDb.updateScore(marco.id, -10);
      const poloEspecial = playersDb.findPlayersByRole("polo-especial")[0];
      if (poloEspecial) playersDb.updateScore(poloEspecial.id, 10);
      message = `¡${marco.nickname} falló! No atrapó al polo especial.`;
    }

    allPlayers.forEach((player) => {
      emitToSpecificClient(player.id, "notifyGameOver", {
        message,
      });
    });

    emitEvent("updateScores", { players: playersDb.getAllPlayers() });

    const winner = playersDb.checkForWinner();
    if (winner) {
      emitEvent("showFinalRanking", {
        winner: winner.nickname,
        ranking: playersDb.getPlayersSortedByScore(),
      });
    }

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ NUEVO controlador para reiniciar puntajes y juego
const resetGame = async (req, res) => {
  try {
    playersDb.resetScores();
    emitEvent("restartGame"); // lo deben escuchar todos los clientes
    res.status(200).json({ success: true, message: "Juego reiniciado" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  joinGame,
  startGame,
  notifyMarco,
  notifyPolo,
  selectPolo,
  resetGame,
};
