import { navigateTo, socket } from "../app.js";

export default function renderScreen2(data) {
  const app = document.getElementById("app");

  const section = document.createElement("section");
  section.id = "screen2";
  section.innerHTML = `
    <h2>🏆 ¡Ganador: ${data.winner}!</h2>
    <h3>Ranking de jugadores</h3>
    <ul id="ranking-list"></ul>
    <div style="margin-top: 20px;">
      <button id="sort-alpha">Ordenar alfabéticamente</button>
      <button id="reset-game">Reiniciar juego</button>
    </div>
  `;
  app.innerHTML = "";
  app.appendChild(section);

  const rankingList = document.getElementById("ranking-list");

const renderRanking = (players) => {
  rankingList.innerHTML = "";
  players.forEach((player, index) => {
    const li = document.createElement("li");
    li.textContent = `${index + 1}. ${player.nickname}: ${player.score} pts`; // <- CORREGIDO
    rankingList.appendChild(li);
  });
};


  // Render inicial con orden por puntaje
  renderRanking(data.ranking);

  // Ordenar alfabéticamente
  const sortAlphaBtn = document.getElementById("sort-alpha");
  sortAlphaBtn.addEventListener("click", async () => {
    const response = await fetch("http://localhost:5050/api/players?sort=alpha");
    const players = await response.json();
    renderRanking(players);
  });

  // Reiniciar el juego (bonus)
  const resetBtn = document.getElementById("reset-game");
  resetBtn.addEventListener("click", async () => {
    await fetch("http://localhost:5050/api/game/reset", {
      method: "POST",
    });
    navigateTo("/");
    socket.emit("restartGame");
  });
}

