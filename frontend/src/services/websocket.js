export function connectSocket(path = "/ws") {
  try {
    const base = (import.meta.env.VITE_WS_URL || "ws://localhost:8000").replace(/\/$/, "");
    const socket = new WebSocket(`${base}${path}`);
    
    socket.onopen = () => {
      console.log(`WebSocket connected to ${base}${path}`);
      socket.send(JSON.stringify({ action: "subscribe" }));
    };
    
    socket.onerror = (error) => {
      console.error(`WebSocket connection error for ${base}${path}:`, error);
    };
    
    socket.onclose = (event) => {
      console.log(`WebSocket connection closed for ${base}${path}. Code: ${event.code}, Reason: ${event.reason}`);
    };
    
    return socket;
  } catch (error) {
    console.error('Failed to create WebSocket connection:', error);
    return null;
  }
}
