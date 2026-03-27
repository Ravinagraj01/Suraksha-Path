export function connectSocket(path, onMessage) {
  const base = (import.meta.env.VITE_WS_URL || "ws://localhost:8000").replace(/\/$/, "");
  const socket = new WebSocket(`${base}${path}`);
  socket.onmessage = (event) => onMessage(JSON.parse(event.data));
  socket.onopen = () => socket.send("subscribe");
  return socket;
}
