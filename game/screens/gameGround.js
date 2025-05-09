// 🔗 Importa funciones necesarias desde app.js
import { navigateTo, socket, makeRequest } from "../app.js";

/* ────────────────────────────────────────────────
  ✅ Función principal: renderGameGround(data)
  ✔️ Renderiza la pantalla del juego para cada jugador
  ✔️ Muestra el rol del jugador
  ✔️ Permite gritar "Marco" o "Polo"
  ✔️ Si es Marco, permite seleccionar un jugador
──────────────────────────────────────────────── */
export default function renderGameGround(data) {
  // 🎯 Obtiene el contenedor principal
  const app = document.getElementById("app");

  // 🧱 Inserta HTML dinámico según el rol del jugador
  app.innerHTML = `
    <div id="game-ground">
      <h2 id="game-nickname-display">${data.nickname}</h2>
      <p>Tu rol es:</p>
      <h2 id="role-display">${data.role}</h2>
      <h2 id="shout-display"></h2>
      <div id="pool-players"></div>
      <button id="shout-button">Gritar ${data.role}</button>
    </div>
  `;

  // 📌 Variables del jugador actual
  const nickname = data.nickname;
  const polos = []; // Lista de polos que gritaron
  const myRole = data.role;

  // 🔗 Referencias a elementos del DOM
  const shoutbtn = document.getElementById("shout-button");
  const shoutDisplay = document.getElementById("shout-display");
  const container = document.getElementById("pool-players");

  // 👀 Si no eres "marco", no puedes gritar
  if (myRole !== "marco") {
    shoutbtn.style.display = "none";
  }

  shoutDisplay.style.display = "none";

  /* ────────────────────────────────────────────────
    ✅ Evento: Click en botón "Gritar"
    ✔️ Si es Marco, llama a /marco
    ✔️ Si es Polo, llama a /polo
  ──────────────────────────────────────────────── */
  shoutbtn.addEventListener("click", async () => {
    if (myRole === "marco") {
      await makeRequest("/api/game/marco", "POST", {
        socketId: socket.id,
      });
    }
    if (myRole === "polo" || myRole === "polo-especial") {
      await makeRequest("/api/game/polo", "POST", {
        socketId: socket.id,
      });
    }

    // 👋 Oculta el botón después de gritar
    shoutbtn.style.display = "none";
  });

  /* ────────────────────────────────────────────────
    ✅ Evento: Marco selecciona un Polo que gritó
    ✔️ Escucha clics en botones generados dinámicamente
  ──────────────────────────────────────────────── */
  container.addEventListener("click", async function (event) {
    if (event.target.tagName === "BUTTON") {
      const key = event.target.dataset.key;
      await makeRequest("/api/game/select-polo", "POST", {
        socketId: socket.id,
        poloId: key,
      });
    }
  });

  /* ────────────────────────────────────────────────
    ✅ socket.on("notification")
    ✔️ Muestra el grito recibido (Marco o Polo)
    ✔️ Si eres Marco: aparecen botones para seleccionar
    ✔️ Si eres Polo: muestra texto de "Marco ha gritado"
  ──────────────────────────────────────────────── */
  socket.on("notification", (data) => {
    console.log("Notification", data);

    if (myRole === "marco") {
      container.innerHTML = "<p>Haz click sobre el polo que quieres escoger:</p>";
      polos.push(data); // Guarda el grito recibido

      polos.forEach((elemt) => {
        const button = document.createElement("button");
        button.innerHTML = `Un jugador gritó: ${elemt.message}`;
        button.setAttribute("data-key", elemt.userId);
        container.appendChild(button);
      });
    } else {
      // 🟣 Para polos normales y especiales
      shoutbtn.style.display = "block";
      shoutDisplay.innerHTML = `Marco ha gritado: ${data.message}`;
      shoutDisplay.style.display = "block";
    }
  });

  /* ────────────────────────────────────────────────
    ✅ socket.on("notifyGameOver")
    ✔️ Cuando termina la ronda, navega a la pantalla de resultado
  ──────────────────────────────────────────────── */
  socket.on("notifyGameOver", (data) => {
    navigateTo("/gameOver", { message: data.message, nickname });
  });
}
