// 📦 Importa cada pantalla que se puede renderizar en el cliente del juego
import renderHomeScreen from "./screens/homeScreen.js";
import renderLobbyScreen from "./screens/lobbyScreen.js";
import renderGameGround from "./screens/gameGround.js";
import renderGameOverScreen from "./screens/gameOverScreen.js";

// 🌐 Establece la conexión con el servidor de sockets
// Se conecta a la ruta personalizada '/real-time'
const socket = io("/", { path: "/real-time" });

/* ────────────────────────────────────────────────
  ✅ clearScripts()
  ✔️ Limpia el contenido actual de la pantalla antes de renderizar otra
──────────────────────────────────────────────── */
function clearScripts() {
  document.getElementById("app").innerHTML = "";
}

// 🌐 Objeto que representa la ruta actual (pantalla activa)
let route = { path: "/", data: {} };

// 🖥️ Renderiza la pantalla inicial
renderRoute(route);

/* ────────────────────────────────────────────────
  ✅ renderRoute(currentRoute)
  ✔️ Decide qué pantalla mostrar según el valor de `path`
  ✔️ Cada caso llama a la función de render correspondiente
──────────────────────────────────────────────── */
function renderRoute(currentRoute) {
  switch (currentRoute?.path) {
    case "/":
      clearScripts();
      renderHomeScreen(currentRoute?.data);
      break;

    case "/lobby":
      clearScripts();
      renderLobbyScreen(currentRoute?.data);
      break;

    case "/game":
      clearScripts();
      renderGameGround(currentRoute?.data);
      break;

    case "/gameOver":
      clearScripts();
      renderGameOverScreen(currentRoute?.data);
      break;

    default:
      // ❌ Si la ruta no existe, muestra mensaje de error
      const app = document.getElementById("app");
      app.innerHTML = `<h1>404 - Not Found</h1><p>The page you are looking for does not exist.</p>`;
  }
}

/* ────────────────────────────────────────────────
  ✅ navigateTo(path, data)
  ✔️ Cambia la ruta actual y renderiza la nueva pantalla
──────────────────────────────────────────────── */
function navigateTo(path, data) {
  route = { path, data };
  renderRoute(route);
}

/* ────────────────────────────────────────────────
  ✅ makeRequest(url, method, body)
  ✔️ Hace una solicitud HTTP al backend (usado en lugar de socket.emit)
  ✔️ Función genérica para POST a endpoints como /join, /start, etc.
──────────────────────────────────────────────── */
async function makeRequest(url, method, body) {
  try {
    const BASE_URL = "http://localhost:5050";

    const response = await fetch(`${BASE_URL}${url}`, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    return result;

  } catch (error) {
    console.error("API request failed:", error);
    return { success: false, error: error.message };
  }
}

/* ────────────────────────────────────────────────
  🔄 Evento: restartGame
  ✔️ Cuando el backend emite este evento, el cliente vuelve a la pantalla de inicio
──────────────────────────────────────────────── */
socket.on("restartGame", () => {
  navigateTo("/");
});

// 📤 Exporta las funciones clave para que se usen en otras pantallas
export { navigateTo, socket, makeRequest };
