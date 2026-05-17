let ws = null;

export function initWS(userId, onEvent) {
  ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URL);

  ws.onopen = () => {
    ws.send(JSON.stringify({
      type: "dashboard_register",
      userId
    }));
  };

  ws.onmessage = (msg) => {
    const data = JSON.parse(msg.data);

    if (onEvent) onEvent(data);
  };

  ws.onclose = () => {
    console.log("WS disconnected, retrying...");

    setTimeout(() => initWS(userId, onEvent), 3000);
  };
}

export function sendWS(data) {
  if (ws && ws.readyState === 1) {
    ws.send(JSON.stringify(data));
  }
}