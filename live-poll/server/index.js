const http = require("http");
const WebSocket = require("ws");

const server = http.createServer();
const wss = new WebSocket.Server({ server });

/**
 * rooms structure:
 * rooms[roomId] = {
 *   question: { id, text, options[] } | null,
 *   counts: number[],
 *   total: number,
 *   votedBy: Map<string, number>  // key -> optionIndex
 *   clients: Set<WebSocket>
 * }
 */
const rooms = new Map();

function getRoom(roomId) {
  if (!rooms.has(roomId)) {
    rooms.set(roomId, {
      question: null,
      counts: [],
      total: 0,
      votedBy: new Map(),
      clients: new Set(),
    });
  }
  return rooms.get(roomId);
}

function safeSend(ws, msgObj) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(msgObj));
  }
}

function broadcast(roomId, msgObj) {
  const room = getRoom(roomId);
  for (const client of room.clients) safeSend(client, msgObj);
}

function roomState(roomId) {
  const room = getRoom(roomId);
  return {
    type: "STATE",
    payload: {
      roomId,
      question: room.question,
      counts: room.counts,
      total: room.total,
    },
  };
}

function errorMsg(message) {
  return { type: "ERROR", payload: { message } };
}

wss.on("connection", (ws) => {
  ws.meta = { roomId: null, name: null, role: null };

  ws.on("message", (raw) => {
    let msg;
    try {
      msg = JSON.parse(raw.toString());
    } catch {
      return safeSend(ws, errorMsg("Mensaje no es JSON válido."));
    }

    const { type, payload } = msg || {};
    if (!type || !payload) return safeSend(ws, errorMsg("Formato inválido."));

    if (type === "JOIN") {
      const { roomId, name, role } = payload;
      if (!roomId || !name || !role)
        return safeSend(ws, errorMsg("JOIN incompleto."));
      if (!["player", "host"].includes(role))
        return safeSend(ws, errorMsg("Rol inválido."));

      ws.meta = { roomId, name, role };
      const room = getRoom(roomId);
      room.clients.add(ws);

      // Enviar estado actual al que entra
      return safeSend(ws, roomState(roomId));
    }

    // A partir de aquí, debe haber JOIN
    if (!ws.meta.roomId)
      return safeSend(ws, errorMsg("Debes hacer JOIN primero."));

    const roomId = ws.meta.roomId;
    const room = getRoom(roomId);

    if (type === "HOST_SET_QUESTION") {
      if (ws.meta.role !== "host")
        return safeSend(ws, errorMsg("Solo host puede crear preguntas."));
      const q = payload.question;
      if (!q || !q.id || !q.text || !Array.isArray(q.options))
        return safeSend(ws, errorMsg("Pregunta inválida."));
      if (q.options.length < 2 || q.options.length > 4)
        return safeSend(ws, errorMsg("Opciones deben ser 2 a 4."));

      room.question = { id: q.id, text: q.text, options: q.options };
      room.counts = new Array(q.options.length).fill(0);
      room.total = 0;
      room.votedBy = new Map(); // reset votos para nueva pregunta

      return broadcast(roomId, roomState(roomId));
    }

    if (type === "VOTE") {
      const { questionId, optionIndex, name } = payload;
      if (!room.question)
        return safeSend(ws, errorMsg("No hay pregunta activa."));
      if (questionId !== room.question.id)
        return safeSend(ws, errorMsg("QuestionId no coincide."));
      if (typeof optionIndex !== "number")
        return safeSend(ws, errorMsg("optionIndex inválido."));
      if (optionIndex < 0 || optionIndex >= room.counts.length)
        return safeSend(ws, errorMsg("Opción fuera de rango."));
      if (!name) return safeSend(ws, errorMsg("Nombre requerido para votar."));

      const key = `${roomId}:${room.question.id}:${name.trim().toLowerCase()}`;
      if (room.votedBy.has(key))
        return safeSend(ws, errorMsg("Ya votaste en esta pregunta."));

      room.votedBy.set(key, optionIndex);
      room.counts[optionIndex] += 1;
      room.total += 1;

      return broadcast(roomId, roomState(roomId));
    }

    if (type === "CLEAR_VOTE") {
      const { questionId, name } = payload;
      if (!room.question)
        return safeSend(ws, errorMsg("No hay pregunta activa."));
      if (questionId !== room.question.id)
        return safeSend(ws, errorMsg("QuestionId no coincide."));
      if (!name) return safeSend(ws, errorMsg("Nombre requerido."));

      const key = `${roomId}:${room.question.id}:${name.trim().toLowerCase()}`;
      if (room.votedBy.has(key)) {
        const prevOption = room.votedBy.get(key);
        room.votedBy.delete(key);
        room.counts[prevOption] -= 1;
        room.total -= 1;
        return broadcast(roomId, roomState(roomId));
      }
      return;
    }

    if (type === "LEAVE_ROOM") {
      room.clients.delete(ws);
      ws.meta = { roomId: null, name: null, role: null };
      return;
    }

    return safeSend(ws, errorMsg("Tipo de mensaje no soportado."));
  });

  ws.on("close", () => {
    const { roomId } = ws.meta || {};
    if (!roomId) return;
    const room = getRoom(roomId);
    room.clients.delete(ws);
  });
});

const PORT = 8080;
server.listen(PORT, () => console.log(`WS server on ws://localhost:${PORT}`));
