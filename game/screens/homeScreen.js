// 🔗 Importa:
// - navigateTo: para navegar entre pantallas
// - socket: para identificar al jugador
// - makeRequest: para hacer peticiones HTTP al backend
import { navigateTo, socket, makeRequest } from "../app.js";

/* ────────────────────────────────────────────────
  ✅ Función: renderHomeScreen()
  ✔️ Renderiza la pantalla de inicio del juego
  ✔️ Permite que el jugador ingrese su nickname
  ✔️ Al hacer clic en "Join", hace una petición al servidor para unirse
──────────────────────────────────────────────── */
export default function renderHomeScreen() {
  // 🎯 Selecciona el contenedor principal
  const app = document.getElementById("app");

  // 🧱 Inserta el HTML para la pantalla de bienvenida
  app.innerHTML = `
    <div id="home-welcome-screen">
      <h2>Bienvenidos</h2>
      <p>Ingresa tu nombre de usuario para unirte al juego</p>
      <div id="form">
        <input type="text" id="nickname" placeholder="nickname" />
        <button id="join-button">Join Game</button>
      </div>
    </div>
  `;

  // 🔗 Referencias a los elementos del formulario
  const nicknameInput = document.getElementById("nickname");
  const joinButton = document.getElementById("join-button");

  /* ────────────────────────────────────────────────
    ✅ Evento: Clic en "Join Game"
    ✔️ Valida que el usuario escriba un nickname
    ✔️ Hace una solicitud POST al backend con nickname y socket.id
    ✔️ Si es exitoso, navega a la pantalla del lobby
  ──────────────────────────────────────────────── */
  joinButton.addEventListener("click", async () => {
    const userName = nicknameInput.value;

    if (!userName.trim()) {
      alert("Please enter a nickname"); // ⚠️ Validación simple
      return;
    }

    // 🚀 Hace POST a /api/game/join con nickname y socketId
    const result = await makeRequest("/api/game/join", "POST", {
      nickname: userName,
      socketId: socket.id,
    });

    if (result.success !== false) {
      // ✅ Navega al lobby con los datos del jugador y lista de jugadores
      navigateTo("/lobby", { nickname: userName, players: result.players });
    } else {
      alert("Failed to join game. Please try again."); // ❌ Error al unirse
    }
  });
}
