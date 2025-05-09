// 🔗 Importa funciones clave:
// - makeRequest: para hacer peticiones HTTP al backend
// - navigateTo: para cambiar de pantalla
// - socket: para escuchar eventos en tiempo real
import { makeRequest, navigateTo, socket } from "../app.js";

/* ────────────────────────────────────────────────
  ✅ Función: renderGameOverScreen(data)
  ✔️ Muestra la pantalla de "Game Over"
  ✔️ Muestra el mensaje de resultado
  ✔️ Incluye botón para reiniciar
  ✔️ Escucha el evento de inicio para regresar al juego
──────────────────────────────────────────────── */
export default function renderGameOverScreen(data) {
  // 🎯 Selecciona el contenedor principal
  const app = document.getElementById("app");

  // 🧱 Renderiza el contenido HTML para la pantalla de fin de juego
  app.innerHTML = `
    <div id="game-over">
      <h1>Game Over</h1>
      <h2 id="game-result">${data.message}</h2>
      <button id="restart-button">Restart game</button>
    </div>
  `;

  console.log("data", data); // 🐞 Debug opcional: muestra los datos recibidos

  // 🔘 Referencia al botón de reinicio
  const restartButton = document.getElementById("restart-button");

  /* ────────────────────────────────────────────────
    ✅ Evento: click en botón "Restart game"
    ✔️ Hace una petición POST al backend para reiniciar el juego
    ✔️ El backend asigna nuevos roles y dispara el evento "startGame"
  ──────────────────────────────────────────────── */
  restartButton.addEventListener("click", async () => {
    await makeRequest("/api/game/start", "POST"); // 👉 Llama a startGame
  });

  /* ────────────────────────────────────────────────
    ✅ socket.on("startGame")
    ✔️ Escucha el evento emitido por el backend cuando el juego reinicia
    ✔️ Navega a la pantalla del juego con el nuevo rol
  ──────────────────────────────────────────────── */
  socket.on("startGame", (role) => {
    navigateTo("/game", { nickname: data.nickname, role });
  });
}
