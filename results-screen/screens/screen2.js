// 🔗 Importa las funciones para cambiar de pantalla y usar sockets
import { navigateTo, socket } from "../app.js";

/* ────────────────────────────────────────────────
  ✅ Función principal: renderScreen2(data)
  ✔️ Muestra al ganador
  ✔️ Muestra ranking de jugadores por puntaje
  ✔️ Permite orden alfabético
  ✔️ Permite reiniciar el juego (bonus)
──────────────────────────────────────────────── */
export default function renderScreen2(data) {
  const app = document.getElementById("app");

  // 🧱 Crea el contenido de la pantalla final
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

  // 🎯 Limpia y muestra esta sección en pantalla
  app.innerHTML = "";
  app.appendChild(section);

  // 🔗 Referencia al contenedor del ranking
  const rankingList = document.getElementById("ranking-list");

  /* ────────────────────────────────────────────────
    ✅ renderRanking(players)
    ✔️ Recibe un array de jugadores
    ✔️ Muestra su posición, nombre y puntaje
  ──────────────────────────────────────────────── */
  const renderRanking = (players) => {
    rankingList.innerHTML = "";
    players.forEach((player, index) => {
      const li = document.createElement("li");
      li.textContent = `${index + 1}. ${player.nickname}: ${player.score} pts`;
      rankingList.appendChild(li);
    });
  };

  // 🟣 Renderiza ranking inicial con orden por puntaje
  renderRanking(data.ranking);

  /* ────────────────────────────────────────────────
    ✅ Botón: Ordenar alfabéticamente
    ✔️ Hace GET a /api/players?sort=alpha
    ✔️ Vuelve a renderizar la lista ordenada por nombre
  ──────────────────────────────────────────────── */
  const sortAlphaBtn = document.getElementById("sort-alpha");
  sortAlphaBtn.addEventListener("click", async () => {
    const response = await fetch("http://localhost:5050/api/players?sort=alpha");
    const players = await response.json();
    renderRanking(players);
  });

  /* ────────────────────────────────────────────────
    ✅ Botón: Reiniciar juego (BONUS)
    ✔️ Llama a /api/game/reset
    ✔️ Vuelve a pantalla de inicio
    ✔️ Emite restartGame para sincronizar todos los clientes
  ──────────────────────────────────────────────── */
  const resetBtn = document.getElementById("reset-game");
  resetBtn.addEventListener("click", async () => {
    await fetch("http://localhost:5050/api/game/reset", {
      method: "POST",
    });

    navigateTo("/");           // Va a pantalla de inicio localmente
    socket.emit("restartGame"); // Notifica a los demás
  });
}
