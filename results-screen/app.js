// 📦 Importa las funciones que renderizan las pantallas de este cliente
import renderScreen1 from "./screens/screen1.js";   // 🎯 Muestra jugadores y puntajes en tiempo real
import renderScreen2 from "./screens/screen2.js";   // 🏁 Muestra ganador y ranking final

// 🌐 Establece conexión con el servidor a través de Socket.IO
// Usa la ruta personalizada "/real-time" (igual que en el servidor)
const socket = io("/", { path: "/real-time" });

/* ────────────────────────────────────────────────
  ✅ clearScripts()
  ✔️ Limpia el contenedor principal antes de cargar otra pantalla
──────────────────────────────────────────────── */
function clearScripts() {
  document.getElementById("app").innerHTML = "";
}

// 🧭 Objeto que representa la ruta actual y los datos de contexto
let route = { path: "/", data: {} };

// 🔄 Llama inmediatamente a renderRoute() para cargar la pantalla inicial
renderRoute(route);

/* ────────────────────────────────────────────────
  ✅ renderRoute(currentRoute)
  ✔️ Según el path, llama a la función correspondiente
  ✔️ Cada pantalla se renderiza desde su propio archivo
──────────────────────────────────────────────── */
function renderRoute(currentRoute) {
  switch (currentRoute?.path) {
    case "/":
      clearScripts();
      renderScreen1(currentRoute?.data); // 🟣 Pantalla principal de resultados
      break;

    case "/screen2":
      clearScripts();
      renderScreen2(currentRoute?.data); // 🏆 Pantalla final con ranking
      break;

    default:
      // ❌ Pantalla 404 si la ruta no coincide
      const app = document.getElementById("app");
      app.innerHTML = `<h1>404 - Not Found</h1><p>The page you are looking for does not exist.</p>`;
  }
}

/* ────────────────────────────────────────────────
  ✅ navigateTo(path, data)
  ✔️ Cambia la ruta activa
  ✔️ Llama a renderRoute() para mostrar la nueva pantalla
──────────────────────────────────────────────── */
function navigateTo(path, data) {
  route = { path, data };
  renderRoute(route);
}

/* ────────────────────────────────────────────────
  🔄 socket.on("restartGame")
  ✔️ Cuando se emite este evento desde el backend
  ✔️ La pantalla vuelve automáticamente a screen1
──────────────────────────────────────────────── */
socket.on("restartGame", () => {
  navigateTo("/"); // Regresa a la pantalla principal de resultados
});

/* ────────────────────────────────────────────────
  📤 Exporta navigateTo y socket para que screen1/screen2 los usen
──────────────────────────────────────────────── */
export { navigateTo, socket };
