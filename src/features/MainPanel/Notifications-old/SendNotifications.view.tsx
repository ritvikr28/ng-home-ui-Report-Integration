/* eslint-disable @typescript-eslint/no-unused-vars */
/// <reference types="node" />
import { useState, useRef, useEffect } from "react";
import "./style.scss";
import { authService } from "@essnextgen/auth-ui";
import { connectWebSocket, fetchActiveConnectionCount, handleSendNotification, WS_BASE } from "./SendNotifications.logic";
import { sendNotificationFlagr } from "../../../Layout";


export const socket = (() => {
  if (sendNotificationFlagr) {
    return new WebSocket(`${WS_BASE}`);
  }
  return null;
})();

export const SendNotification = () => {
  const [token, setToken] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const [activeConnectionCount, setActiveConnectionCount] = useState(0);
  const wsRef = useRef<WebSocket | null>(null);

  wsRef.current = sendNotificationFlagr ? socket : null;

  const [notification, setNotification] = useState<{
    type: string;
    message: string;
    rolesIds: string[];
    userIds: string[];
  }>({
    type: "",
    message: "",
    rolesIds: [],
    userIds: [],
  });
  const [message, setMessage] = useState("");
  const [wsStatus, setWsStatus] = useState("disconnected"); // "connecting", "connected", "reconnecting", "disconnected"
  const reconnectAttempts = useRef(0);
  // eslint-disable-next-line
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);


  // Login and get JWT token
  // const handleLoginClick = async () => {
  //   await handleLogin({
  //     API_BASE,
  //     userId,
  //     password,
  //     setToken,
  //   });
  // };
  // // Connect to WebSocket with JWT and handle reconnection

  useEffect(() => {
    const accessToken = window.sessionStorage.getItem("ACCESS_TOKEN") || "";
    setToken(accessToken || "");
  }, []);

  // Manual connect button
  const handleConnect = () => {

    connectWebSocket({
      token,
      setWsStatus,
      wsRef,
      setMessages,
      reconnectAttempts,
      reconnectTimeout,
      setActiveConnectionCount
    });
  };
  // Clean up on unmount
  useEffect(() => {
    if (wsRef.current) wsRef.current.close();
    if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
  }, []);


  useEffect(() => {
    fetchActiveConnectionCount({ setActiveConnectionCount }); // initial fetch
  }, []);

  // Send notification
  const handleSendNotificationClick = async () => {
    // Update notification state with the latest message only when sending
    const updatedNotification = { ...notification, message };
    setNotification(updatedNotification);
    await handleSendNotification({
      token,
      notification: updatedNotification,
      message
    });
  };


  useEffect(() => {

    if (wsRef.current) wsRef.current.close();
    if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
  }, []);

  useEffect(() => {
    if (token && wsStatus === "disconnected" && sendNotificationFlagr) {
      handleConnect();
    }
    // eslint-disable-next-line
  }, [token]);



  const userName = authService.getUsername();
  const userOrgId = authService.getOrgId();
  const userIdDetail = authService.getUserId();

  return (
    <div className="notification-app-container">
      <h2>Demo Notification App</h2>
      <div>
        {token && (
          <span style={{ marginLeft: 10 }}>
            {userName} Logged in!<br /><br />
            Org ID: <b>{userOrgId}</b> <br />
            User ID: <b>{userIdDetail}</b>
          </span>
        )}
      </div>
      <div style={{ marginTop: 20 }}>
        {/* <button type="button" onClick={() => handleConnect()} disabled={!token || wsStatus === "connected" || wsStatus === "connecting"}>
          Connect WebSocket
        </button> */}
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
          value={message}
          onChange={(e) => {
            setMessage(e.target.value)
          }}
        />
        <input
          placeholder="Roles (comma separated)"
          value={notification.rolesIds.join(",")}
          onChange={(e) =>
            setNotification({
              ...notification,
              rolesIds: e.target.value.split(",").map((r) => r.trim()).filter(Boolean),
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
