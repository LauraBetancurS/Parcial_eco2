// Importamos la clase Server de la librería socket.io
const { Server } = require("socket.io");

// Variable para guardar la instancia global de Socket.IO
let io;

/* 
==============================
 1. Inicializar Socket.IO
==============================
*/

// Esta función se llama una vez para conectar Socket.IO al servidor HTTP
const initSocketInstance = (httpServer) => {
  io = new Server(httpServer, {
    path: "/real-time", // ruta personalizada para las conexiones WebSocket
    cors: {
      origin: "*",      // permite conexiones desde cualquier origen (útil para desarrollo o apps externas)
    },
  });
};

/* 
==========================================
 2. Emitir un evento a un cliente específico
==========================================
*/

// Esta función envía un mensaje solo a UN cliente identificado por su socketId
const emitToSpecificClient = (socketId, eventName, data) => {
  if (!io) {
    throw new Error("Socket.io instance is not initialized"); // seguridad: evita errores si io no está listo
  }
  io.to(socketId).emit(eventName, data); // emitimos el evento al socket indicado
};

/* 
==========================================
 3. Emitir un evento a TODOS los clientes conectados
==========================================
*/

// Esta función transmite un evento global a TODOS los sockets conectados
const emitEvent = (eventName, data) => {
  if (!io) {
    throw new Error("Socket.io instance is not initialized"); // seguridad: revisa si ya está conectado
  }
  io.emit(eventName, data); // emitimos evento a todos los clientes
};

/* 
==============================
 4. Exportar funciones del servicio
==============================
*/

// Exportamos las funciones para que puedan ser usadas en otros archivos (ej. controladores)
module.exports = {
  emitEvent,
  initSocketInstance,
  emitToSpecificClient,
};
