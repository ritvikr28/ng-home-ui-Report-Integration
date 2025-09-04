/* eslint-disable @typescript-eslint/no-unused-vars */
/// <reference types="node" />
import { useState, useRef, useEffect } from "react";
import "./style.scss";
import { connectWebSocket, handleLogin, handleSendNotification } from "./SendNotifications.logic";

const API_BASE = "https://dev.home.sims.co.uk/web"; // Change to your backend URL
const WS_BASE = "https://dev.home.sims.co.uk/web/ws"; // Change to your websocket endpoint

export const SendNotification = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [userId, setUserId] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const [activeConnectionCount, setActiveConnectionCount] = useState(0);

  const [notification, setNotification] = useState<{
    type: string;
    message: string;
    roles: string[];
    userIds: string[];
  }>({
    type: "alert",
    message: "",
    roles: [],
    userIds: [],
  });
  const [wsStatus, setWsStatus] = useState("disconnected"); // "connecting", "connected", "reconnecting", "disconnected"
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttempts = useRef(0);
  // eslint-disable-next-line
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);


  // Login and get JWT token
const handleLoginClick = async () => {
  await handleLogin({
    API_BASE,
    userId,
    password,
    setToken,
  });
};
  // Connect to WebSocket with JWT and handle reconnection
  

  // Manual connect button
  const handleConnect = () => {
  reconnectAttempts.current = 0;
  connectWebSocket({
    token,
    setWsStatus,
    wsRef,
    setMessages,
    reconnectAttempts,
    reconnectTimeout,
    WS_BASE,
  });
};
  // Clean up on unmount
useEffect(() => {
      if (wsRef.current) wsRef.current.close();
      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
  }, []);

  // Auto-connect when token changes
  useEffect(() => {
    if (token) {
      handleConnect();
    }
    // eslint-disable-next-line
  }, [token]);

  useEffect(() => {
    fetchActiveConnectionCount(); // initial fetch
    const interval = setInterval(
      fetchActiveConnectionCount, 3000); // fetch every 5 seconds
    return () => clearInterval(interval);
  }, []);

  // Send notification
const handleSendNotificationClick = async () => {
  await handleSendNotification({
    API_BASE,
    token,
    notification,
  });
};

  // Get active websocket connections
  const fetchActiveConnectionCount = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/websocket-status/active-count`);
      if (res.ok) {
        const count = await res.json();
        setActiveConnectionCount(count);
      }
    } catch (err) {
      setActiveConnectionCount(0);
    }
  };

  useEffect(() => {
    handleLoginClick();
  }, []);

  return (
    <div className="notification-app-container">
      <h2>Demo Notification App</h2>
      <div>
         <input
          placeholder="User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="button" onClick={handleLoginClick}>Login</button>
        {token && (
          <span style={{ marginLeft: 10 }}>
            {userId} Logged in!
          </span>
        )}
      </div>
      <div style={{ marginTop: 20 }}>
        <button type="button" onClick={handleConnect} disabled={!token || wsStatus === "connected" || wsStatus === "connecting"}>
          Connect WebSocket
        </button>
        <span style={{ marginLeft: 10 }}>
          WebSocket Status: <b>{wsStatus}</b>
        </span>
      </div>
      <div style={{ marginTop: 20 }}>
        <span>
          Active WebSocket Connections: <b>{activeConnectionCount}</b>
        </span>
      </div>
      <div style={{ marginTop: 20 }}>
        <h4>Send Notification</h4>
        <input
          placeholder="Type"
          value={notification.type}
          onChange={(e) =>
            setNotification({ ...notification, type: e.target.value })
          }
        />
        <input
          placeholder="Message"
          value={notification.message}
          onChange={(e) =>
            setNotification({ ...notification, message: e.target.value })
          }
        />
        <input
          placeholder="Roles (comma separated)"
          value={notification.roles.join(",")}
          onChange={(e) =>
            setNotification({
              ...notification,
              roles: e.target.value.split(",").map((r) => r.trim()).filter(Boolean),
            })
          }
        />
        <input
          placeholder="User IDs (comma separated)"
          value={notification.userIds.join(",")}
          onChange={(e) =>
            setNotification({
              ...notification,
              userIds: e.target.value.split(",").map((u) => u.trim()).filter(Boolean),
            })
          }
        />
        <button
          onClick={handleSendNotificationClick}
          disabled={!token}
          style={{ marginLeft: 10 }}
          type="button"
        >
          Send
        </button>
      </div>
      <div style={{ marginTop: 20 }}>
        <h4>Received Notifications</h4>
        <ul>
          {messages.map((msg, idx) => (
            <li key={idx}>{msg}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default SendNotification;