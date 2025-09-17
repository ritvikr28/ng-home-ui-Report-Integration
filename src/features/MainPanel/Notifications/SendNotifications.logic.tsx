import type { MutableRefObject, Dispatch, SetStateAction } from "react";
/* eslint-disable no-param-reassign */

export function connectWebSocket({
  token,
  setWsStatus,
  wsRef,
  setMessages,
  reconnectAttempts,
  reconnectTimeout,
  WS_BASE,
}: {
  token: string;
  setWsStatus: (status: string) => void;
  wsRef: MutableRefObject<WebSocket | null>;
  setMessages: Dispatch<SetStateAction<string[]>>;
  reconnectAttempts: MutableRefObject<number>;
  reconnectTimeout: MutableRefObject<ReturnType<typeof setTimeout> | null>;
  WS_BASE: string;
}) {
  if (!token) return;
  setWsStatus("connecting");
  const socket = new WebSocket(`${WS_BASE}?access_token=${token}`);
  wsRef.current = socket;

  socket.onopen = () => {
    setWsStatus("connected");
    reconnectAttempts.current = 0;
  };

  socket.onmessage = (event) => {
    setMessages((prev) => [...prev, event.data]);
  };

  socket.onclose = () => {
    setWsStatus("disconnected");
    // Reconnect with exponential backoff
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
          WS_BASE,
        });
      }, delay);
      reconnectAttempts.current += 1;
    }
  };

  socket.onerror = () => {
    socket.close();
  };
}

// export async function handleLogin({
//   API_BASE,
//   userId,
//   password,
//   setToken,
// }: {
//   API_BASE: string;
//   userId: string;
//   password: string;
//   setToken: (token: string) => void;
// }) {
//   // const res = await fetch(`${API_BASE}/auth/login`, {
//   //   method: "POST",
//   //   headers: { "Content-Type": "application/json" },
//   //   body: JSON.stringify({ userId, password }),
//   // });
//   const authToken = await authService.getIdToken();
//   console.log("Auth Token:", authToken);
//   const data = await res.json();
//   if (data.token) setToken(authService.getIdToken);
// }

export async function handleSendNotification({
  API_BASE,
  token,
  notification,
}: {
  API_BASE: string;
  token: string;
  notification: any;
}) {
  await fetch(`${API_BASE}/notification/send`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(notification),
  });
}