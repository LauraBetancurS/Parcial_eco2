// Importamos la base de datos en memoria de jugadores (array y funciones)
const playersDb = require("../db/players.db");

// Importamos funciones para emitir eventos con WebSockets (Socket.IO)
const {
  emitEvent,             // Enviar evento a TODOS los clientes conectados
  emitToSpecificClient,  // Enviar evento a un solo cliente (por socketId)
} = require("../services/socket.service");

/* ────────────────────────────────────────────────
  🧩 Función: joinGame
  ✔️ Agrega un nuevo jugador con nickname y socketId
  ✔️ Notifica a todos los clientes que se unió alguien
──────────────────────────────────────────────── */
const joinGame = async (req, res) => {
  try {
    const { nickname, socketId } = req.body;

    playersDb.addPlayer(nickname, socketId); // 👉 Guarda al jugador

    const gameData = playersDb.getGameData(); // 👉 Obtiene todos los jugadores

    emitEvent("userJoined", gameData); // 👉 Notifica en tiempo real a todos los clientes

    res.status(200).json({ success: true, players: gameData.players }); // 👉 Devuelve respuesta HTTP
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ────────────────────────────────────────────────
  🧩 Función: startGame
  ✔️ Asigna roles a cada jugador
  ✔️ Notifica a cada uno su rol individualmente
──────────────────────────────────────────────── */
const startGame = async (req, res) => {
  try {
    const playersWithRoles = playersDb.assignPlayerRoles(); // 👉 roles: marco, polo, polo-especial

    playersWithRoles.forEach((player) => {
      emitToSpecificClient(player.id, "startGame", player.role); // 👉 Cada uno recibe su rol
    });

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ────────────────────────────────────────────────
  🧩 Función: notifyMarco
  ✔️ Marco grita "¡Marco!" y se notifica a todos los polos
──────────────────────────────────────────────── */
const notifyMarco = async (req, res) => {
  try {
    const { socketId } = req.body;

    // 👉 Encuentra jugadores con rol polo o polo-especial
    const rolesToNotify = playersDb.findPlayersByRole([
      "polo",
      "polo-especial",
    ]);

    // 👉 Les envía el mensaje "Marco!!!"
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

/* ────────────────────────────────────────────────
  🧩 Función: notifyPolo
  ✔️ Cuando un polo grita "¡Polo!", se notifica solo al marco
──────────────────────────────────────────────── */
const notifyPolo = async (req, res) => {
  try {
    const { socketId } = req.body;

    const rolesToNotify = playersDb.findPlayersByRole("marco"); // 👉 Solo Marco

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

/* ────────────────────────────────────────────────
  🧩 Función: selectPolo
  ✔️ Marco elige a quién atrapó
  ✔️ Se evalúa si fue el polo especial o no
  ✔️ Se actualizan puntajes y se verifica si hay un ganador
──────────────────────────────────────────────── */
const selectPolo = async (req, res) => {
  try {
    const { socketId, poloId } = req.body;

    const marco = playersDb.findPlayerById(socketId);  // 👉 Marco que selecciona
    const polo = playersDb.findPlayerById(poloId);     // 👉 Jugador seleccionado
    const allPlayers = playersDb.getAllPlayers();      // 👉 Todos los jugadores conectados

    let message = "";

    if (polo.role === "polo-especial") {
      // 👉 Marco gana, Polo especial pierde puntos
      playersDb.updateScore(marco.id, 50);
      playersDb.updateScore(polo.id, -10);
      message = `¡${marco.nickname} atrapó al polo especial ${polo.nickname}!`;
    } else {
      // 👉 Marco falla, pierde puntos y polo-especial gana
      playersDb.updateScore(marco.id, -10);
      const poloEspecial = playersDb.findPlayersByRole("polo-especial")[0];
      if (poloEspecial) playersDb.updateScore(poloEspecial.id, 10);
      message = `¡${marco.nickname} falló! No atrapó al polo especial.`;
    }

    // 👉 Notifica a todos que terminó la ronda
    allPlayers.forEach((player) => {
      emitToSpecificClient(player.id, "notifyGameOver", {
        message,
      });
    });

    // 👉 Envía puntajes actualizados en tiempo real
    emitEvent("updateScores", { players: playersDb.getAllPlayers() });

    // 👉 Verifica si alguien superó 100 pts para declarar ganador
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

/* ────────────────────────────────────────────────
  🧩 Función: resetGame
  ✔️ Reinicia todos los puntajes
  ✔️ Notifica a todos los clientes para volver a la pantalla inicial
──────────────────────────────────────────────── */
const resetGame = async (req, res) => {
  try {
    playersDb.resetScores();             // 👉 Reinicia puntajes (no borra jugadores)
    emitEvent("restartGame");            // 👉 Notifica a todos los clientes
    res.status(200).json({ success: true, message: "Juego reiniciado" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 👉 Exportamos todas las funciones para que se usen en game.router.js
module.exports = {
  joinGame,
  startGame,
  notifyMarco,
  notifyPolo,
  selectPolo,
  resetGame,
};
