import { connectWebSocket, handleSendNotification } from "../SendNotifications.logic";
import { API_BASE } from "../SendNotifications.view";

describe("connectWebSocket", () => {
  let originalWebSocket: any;
  let mockSocket: any;
  let setWsStatus: jest.Mock;
  let setMessages: jest.Mock;
  let reconnectAttempts: { current: number };
  let reconnectTimeout: { current: any };
  let wsRef: { current: any };
  const WS_BASE = "ws://test";
  const token = "abc123";

  beforeAll(() => {
    originalWebSocket = global.WebSocket;
  });

  beforeEach(() => {
    setWsStatus = jest.fn();
    setMessages = jest.fn();
    reconnectAttempts = { current: 0 };
    reconnectTimeout = { current: null };
    wsRef = { current: null };

    mockSocket = {
      onopen: null,
      onmessage: null,
      onclose: null,
      onerror: null,
      close: jest.fn(),
      send: jest.fn(),
    };

    // Mock WebSocket constructor and static properties
    const WS = jest.fn(() => mockSocket) as any;
    WS.CONNECTING = 0;
    WS.OPEN = 1;
    WS.CLOSING = 2;
    WS.CLOSED = 3;
    WS.prototype = {};
    global.WebSocket = WS;
  });

  afterAll(() => {
    global.WebSocket = originalWebSocket;
  });

  it("does nothing if no token", () => {
    connectWebSocket({
      token: "",
      setWsStatus,
      wsRef,
      setMessages,
      reconnectAttempts,
      reconnectTimeout,
      WS_BASE,
      setActiveConnectionCount: jest.fn(),
    });
    expect(setWsStatus).not.toHaveBeenCalled();
    expect(global.WebSocket).not.toHaveBeenCalled();
  });

  it("sets wsStatus to connecting and assigns wsRef", () => {
    connectWebSocket({
      token,
      setWsStatus,
      wsRef,
      setMessages,
      reconnectAttempts,
      reconnectTimeout,
      WS_BASE,
      setActiveConnectionCount: jest.fn(),
    });
    expect(setWsStatus).toHaveBeenCalledWith("connecting");
    expect(wsRef.current).toBe(mockSocket);
  });

  it("handles onopen event", () => {
    connectWebSocket({
      token,
      setWsStatus,
      wsRef,
      setMessages,
      reconnectAttempts,
      reconnectTimeout,
      WS_BASE,
      setActiveConnectionCount: jest.fn(),
    });
    mockSocket.send.mockClear();
    mockSocket.onopen();
    expect(setWsStatus).toHaveBeenCalledWith("connected");
    expect(reconnectAttempts.current).toBe(0);
    expect(mockSocket.send).toHaveBeenCalledWith(
      JSON.stringify({ type: "auth", token })
    );
  });

  it("handles onmessage event", () => {
    connectWebSocket({
      token,
      setWsStatus,
      wsRef,
      setMessages,
      reconnectAttempts,
      reconnectTimeout,
      WS_BASE,
      setActiveConnectionCount: jest.fn(),
    });
    setMessages.mockImplementation((fn) => fn(["old"]));
    mockSocket.onmessage({ data: "new" });
    expect(setMessages).toHaveBeenCalled();
  });

  it("handles onclose and triggers reconnect if attempts < 10", () => {
    jest.useFakeTimers();
    connectWebSocket({
      token,
      setWsStatus,
      wsRef,
      setMessages,
      reconnectAttempts,
      reconnectTimeout,
      WS_BASE,
      setActiveConnectionCount: jest.fn(),
    });
    reconnectAttempts.current = 0;
    mockSocket.onclose();
    expect(setWsStatus).toHaveBeenCalledWith("disconnected");
    expect(setWsStatus).toHaveBeenCalledWith("reconnecting");
    expect(typeof reconnectTimeout.current).toBe("number");
    expect(reconnectAttempts.current).toBe(1);
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it("does not reconnect if attempts >= 10", () => {
    connectWebSocket({
      token,
      setWsStatus,
      wsRef,
      setMessages,
      reconnectAttempts,
      reconnectTimeout,
      WS_BASE,
      setActiveConnectionCount: jest.fn(),
    });
    reconnectAttempts.current = 10;
    mockSocket.onclose();
    expect(setWsStatus).toHaveBeenCalledWith("disconnected");
    expect(setWsStatus).not.toHaveBeenCalledWith("reconnecting");
  });

  it("handles onerror by closing socket", () => {
    connectWebSocket({
      token,
      setWsStatus,
      wsRef,
      setMessages,
      reconnectAttempts,
      reconnectTimeout,
      WS_BASE,
      setActiveConnectionCount: jest.fn(),
    });
    mockSocket.onerror();
    expect(mockSocket.close).toHaveBeenCalled();
  });
});

describe("handleSendNotification", () => {
  const token = "abc123";
  const notification = { type: "info", message: "Hello", roles: ["admin"], userIds: ["u1"] };

  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("calls fetch with correct arguments", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({ ok: true });

    await handleSendNotification({
      token,
      notification,
    });

    expect(global.fetch).toHaveBeenCalledWith(
      `${API_BASE}/notification/send`,
      expect.objectContaining({
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(notification),
      })
    );
  });

  it("throws if fetch fails", async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error("fail"));

    await expect(
      handleSendNotification({ token:"", notification:"" })
    ).rejects.toThrow("fail");
  });
});