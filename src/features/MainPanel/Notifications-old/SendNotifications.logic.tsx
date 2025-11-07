import { type MutableRefObject, type Dispatch, type SetStateAction } from "react";
/* eslint-disable no-param-reassign */

export const API_BASE = "https://dev.home.sims.co.uk/web"; // Change to your backend URL
export const WS_BASE = "wss://dev.home.sims.co.uk/web/ws"; // Change to your websocket endpoint


interface FetchActiveConnectionCountProps {
  setActiveConnectionCount: Dispatch<SetStateAction<number>>;
}

export const fetchActiveConnectionCount = async ({
  setActiveConnectionCount,
}: FetchActiveConnectionCountProps): Promise<void> => {
  try {
    const res = await fetch(`${API_BASE}/api/websocket-status/active-count`);
    if (res.ok) {
      const count: number = await res.json();
      setActiveConnectionCount(count);
    }
  } catch (err) {
    // setActiveConnectionCount(0);
    console.log("Error fetching active connection count:", err);
  }
};

export async function connectWebSocket({
  token,
  setWsStatus,
  wsRef,
  setMessages,
  reconnectAttempts,
  reconnectTimeout,
  setActiveConnectionCount
}: {
  token: string;
  setWsStatus: (status: string) => void;
  wsRef: MutableRefObject<WebSocket | null>;
  setMessages: Dispatch<SetStateAction<string[]>>;
  reconnectAttempts: MutableRefObject<number>;
  reconnectTimeout: MutableRefObject<ReturnType<typeof setTimeout> | null>;
  setActiveConnectionCount: Dispatch<SetStateAction<number>>;
}) {
  if (!token) return;
  setWsStatus("connecting");
  const socket = new WebSocket(`${WS_BASE}`);
  wsRef.current = socket;

  socket.onopen = () => {
    setWsStatus("connected");
    fetchActiveConnectionCount({ setActiveConnectionCount });
    reconnectAttempts.current = 0;
    try {
      const authMessage = { type: "auth", token };
      // eslint-disable-next-line no-console
      console.log("auth send", authMessage);
      socket.send(JSON.stringify(authMessage));
    } catch (_) {
      // swallow send errors; socket.onerror/onclose will handle lifecycle
    }

  };


  // socket.addEventListener('message', (event) => {
  //   // Handle the message event here if needed
  //   setMessages((prev) => [...prev, event.data]);

  // });

  socket.onmessage = (event) => {
    const parsedData = JSON.parse(event.data);
    
    if (parsedData.type !== "activeCount") {
      setMessages((prev) => [...prev, event.data]);
    }
    else {
      setMessages((prev) => [...prev, event.data]);
    }
    const msg = JSON.parse(event.data);
    if (msg.type === "activeCount") {
      setActiveConnectionCount(msg.count);
    }
  };

  socket.onclose = () => {
    setWsStatus("disconnected");
    if (token && reconnectAttempts.current < 10) {
      setWsStatus("reconnecting");
      const delay = Math.min(1000 * 2 ** reconnectAttempts.current, 30000);
      reconnectTimeout.current = setTimeout(() => {
        connectWebSocket({
          token,
          setWsStatus,
          wsRef,
          setMessages,
          reconnectAttempts,
          reconnectTimeout,
          setActiveConnectionCount
        });
      }, delay);
      reconnectAttempts.current += 1;
    }
  };

  socket.onerror = () => {
    socket.close();
  };
}

export async function handleSendNotification({
  // API_BASE,
  token,
  notification,
  message
}: {
  // API_BASE: string;
  token: string;
  notification: any;
  message: string;
}) {
  await fetch(`${API_BASE}/notification/send`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ ...notification, message }),
  });
}
