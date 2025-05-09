// 🔗 Importa herramientas necesarias:
// - navigateTo: para cambiar de pantalla
// - socket: para escuchar eventos en tiempo real
// - makeRequest: para enviar solicitudes HTTP al servidor
import { navigateTo, socket, makeRequest } from "../app.js";

/* ────────────────────────────────────────────────
  ✅ Función: renderLobbyScreen(data)
  ✔️ Muestra el lobby del juego
  ✔️ Muestra cuántos jugadores hay conectados
  ✔️ Permite iniciar el juego desde esta pantalla
──────────────────────────────────────────────── */
export default function renderLobbyScreen(data) {
  // 🎯 Selecciona el contenedor principal
  const app = document.getElementById("app");

  // 🧱 Inserta el HTML con nickname y cantidad de jugadores
  app.innerHTML = `
    <div id="lobby-screen">
      <h2 id="nickname-display">${data.nickname}</h2>
      <p>
        Esperando a que otros se unan:
        <b id="users-count"><b>0</b></b> usuarios en la sala
      </p>
      <button id="start-button">Start game</button>
    </div>
  `;

  // 🔗 Referencias a elementos DOM
  const startButton = document.getElementById("start-button");
  const usersCount = document.getElementById("users-count");

  // 👥 Inicializa el contador de usuarios conectados
  usersCount.innerHTML = data?.players.length || 0;

  /* ────────────────────────────────────────────────
    ✅ socket.on("userJoined")
    ✔️ Escucha cuando otro jugador entra
    ✔️ Actualiza el contador de jugadores en tiempo real
  ──────────────────────────────────────────────── */
  socket.on("userJoined", (data) => {
    console.log(data); // 🐞 Debug: muestra los jugadores conectados
    usersCount.innerHTML = data?.players.length || 0;
  });

  /* ────────────────────────────────────────────────
    ✅ Evento: clic en "Start game"
    ✔️ Llama al backend para comenzar la partida
  ──────────────────────────────────────────────── */
  startButton.addEventListener("click", async () => {
    await makeRequest("/api/game/start", "POST");
  });

  /* ────────────────────────────────────────────────
    ✅ socket.on("startGame")
    ✔️ Escucha cuando el backend indica que comenzó el juego
    ✔️ Navega a la pantalla principal con el rol asignado
  ──────────────────────────────────────────────── */
  socket.on("startGame", (role) => {
    navigateTo("/game", { nickname: data.nickname, role });
  });
}
