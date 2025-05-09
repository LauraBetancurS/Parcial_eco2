// El archivo results-screen/screens/screen1.js será responsable de:

// Mostrar la lista de jugadores conectados.

// Escuchar el evento userJoined para actualizar la lista.

// Escuchar updateScores para reflejar los puntajes en tiempo real.

// 🔗 Importa herramientas para navegación y sockets
import { navigateTo, socket } from "../app.js";

/* ────────────────────────────────────────────────
  ✅ Función principal: renderScreen1()
  ✔️ Muestra lista de jugadores y sus puntajes
  ✔️ Escucha eventos de Socket.IO en tiempo real
  ✔️ Cambia a pantalla final si hay un ganador
──────────────────────────────────────────────── */
export default function renderScreen1() {
  // 🎯 Selecciona el contenedor principal
  const app = document.getElementById("app");

  // 🧱 Crea el contenido HTML dinámicamente
  const section = document.createElement("section");
  section.id = "screen1";
  section.innerHTML = `
    <h2>Jugadores activos y puntajes</h2>
    <ul id="players-list"></ul>
  `;

  app.innerHTML = "";           // Limpia contenido previo
  app.appendChild(section);     // Inserta la sección generada

  // 🔗 Referencia al elemento UL donde se renderizarán los jugadores
  const listElement = document.getElementById("players-list");

  /* ────────────────────────────────────────────────
    ✅ Función interna: renderPlayers(players)
    ✔️ Recorre cada jugador y crea un <li> con su nickname y puntaje
  ──────────────────────────────────────────────── */
  const renderPlayers = (players) => {
    listElement.innerHTML = ""; // Limpia la lista actual
    players.forEach((player) => {
      const li = document.createElement("li");
      li.textContent = `${player.nickname}: ${player.score} pts`; // ✅ Muestra nombre y puntos
      listElement.appendChild(li);
    });
  };

  /* ────────────────────────────────────────────────
    ✅ Evento: "userJoined"
    ✔️ Cuando alguien nuevo entra, se actualiza la lista de jugadores
  ──────────────────────────────────────────────── */
  socket.on("userJoined", (data) => {
    if (data?.players) {
      renderPlayers(data.players);
    }
  });

  /* ────────────────────────────────────────────────
    ✅ Evento: "updateScores"
    ✔️ Cuando cambian los puntajes, se actualiza la lista en tiempo real
  ──────────────────────────────────────────────── */
  socket.on("updateScores", (data) => {
    if (data?.players) {
      renderPlayers(data.players);
    }
  });

  /* ────────────────────────────────────────────────
    ✅ Evento: "showFinalRanking"
    ✔️ Cuando alguien gana, se cambia a la pantalla final
    ✔️ Se pasa la data (jugadores y ganador) a screen2
  ──────────────────────────────────────────────── */
  socket.on("showFinalRanking", (data) => {
    navigateTo("/screen2", data); // 👈 Cambio de pantalla
  });
}
