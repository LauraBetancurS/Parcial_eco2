// El archivo results-screen/screens/screen1.js será responsable de:

// Mostrar la lista de jugadores conectados.

// Escuchar el evento userJoined para actualizar la lista.

// Escuchar updateScores para reflejar los puntajes en tiempo real.


import { navigateTo, socket } from "../app.js";

export default function renderScreen1() {
  const app = document.getElementById("app");

  const section = document.createElement("section");
  section.id = "screen1";
  section.innerHTML = `
    <h2>Jugadores activos y puntajes</h2>
    <ul id="players-list"></ul>
  `;
  app.innerHTML = "";
  app.appendChild(section);

  const listElement = document.getElementById("players-list");

  // Función para renderizar jugadores
 const renderPlayers = (players) => {
  listElement.innerHTML = "";
  players.forEach((player) => {
    const li = document.createElement("li");
    li.textContent = `${player.nickname}: ${player.score} pts`; // <- CORREGIDO
    listElement.appendChild(li);
  });
};


  // Evento para cuando alguien se une
  socket.on("userJoined", (data) => {
    if (data?.players) {
      renderPlayers(data.players);
    }
  });

  // Evento para actualización de puntajes
  socket.on("updateScores", (data) => {
    if (data?.players) {
      renderPlayers(data.players);
    }
  });

  // Ir a pantalla final si hay ganador
  socket.on("showFinalRanking", (data) => {
    navigateTo("/screen2", data);
  });
}
