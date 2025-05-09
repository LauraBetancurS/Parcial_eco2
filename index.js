// 🔹 Importa el framework Express para crear el servidor HTTP
const express = require("express");

// 🔹 Importa 'path' para construir rutas de archivos y carpetas de forma segura
const path = require("path");

// 🔹 Importa 'createServer' para combinar Express con WebSocket (Socket.IO)
const { createServer } = require("http");

// 🔹 Importa el router de jugadores (maneja rutas como /api/players)
const playersRouter = require("./server/routes/players.router");

// 🔹 Importa el router del juego (maneja rutas como /api/game/start, /marco, /polo)
const gameRouter = require("./server/routes/game.router");

// 🔹 Importa la función que inicializa Socket.IO (comunicación en tiempo real)
const { initSocketInstance } = require("./server/services/socket.service");

// 🔹 Define el puerto donde se ejecutará el servidor
const PORT = 5050;

// 🔹 Crea una instancia de la aplicación Express
const app = express();

// 🔹 Crea el servidor HTTP pasando la app de Express (necesario para usar Socket.IO)
const httpServer = createServer(app);

// -----------------------------
// 🧰 MIDDLEWARES Y ARCHIVOS ESTÁTICOS
// -----------------------------

// 🔸 Permite que el servidor acepte solicitudes con formato JSON (ej. req.body)
app.use(express.json());

// 🔸 Sirve el frontend del juego desde la carpeta /game cuando se accede a /game en el navegador
app.use("/game", express.static(path.join(__dirname, "game")));

// 🔸 Sirve el frontend de resultados desde la carpeta /results-screen cuando se accede a /results
app.use("/results", express.static(path.join(__dirname, "results-screen")));

// -----------------------------
// 🌐 RUTAS DE LA API (BACKEND)
// -----------------------------

// 🔸 Rutas relacionadas con los jugadores (ej. GET /api/players)
app.use("/api", playersRouter);

// 🔸 Rutas relacionadas con la lógica del juego (ej. POST /api/game/start)
app.use("/api/game", gameRouter);

// -----------------------------
// 🌐 SOCKET.IO (TIEMPO REAL)
// -----------------------------

// 🔸 Inicializa la instancia de WebSocket y la conecta al servidor HTTP
initSocketInstance(httpServer);

// -----------------------------
// 🚀 INICIO DEL SERVIDOR
// -----------------------------

// 🔸 Inicia el servidor y muestra un mensaje en consola cuando está listo
httpServer.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
