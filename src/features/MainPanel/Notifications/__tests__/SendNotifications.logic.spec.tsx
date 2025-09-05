import { connectWebSocket, handleLogin, handleSendNotification } from "../SendNotifications.logic";

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
    });
    // Simulate onopen
    mockSocket.onopen();
    expect(setWsStatus).toHaveBeenCalledWith("connected");
    expect(reconnectAttempts.current).toBe(0);
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
    });
    mockSocket.onerror();
    expect(mockSocket.close).toHaveBeenCalled();
  });
});

describe("handleLogin", () => {
  const API_BASE = "http://api";
  const userId = "user";
  const password = "pass";
  let setToken: jest.Mock;

  beforeEach(() => {
    setToken = jest.fn();
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("calls setToken if token is present in response", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      json: async () => ({ token: "abc123" }),
    });

    await handleLogin({ API_BASE, userId, password, setToken });
    expect(global.fetch).toHaveBeenCalledWith(
      `${API_BASE}/auth/login`,
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, password }),
      })
    );
    expect(setToken).toHaveBeenCalledWith("abc123");
  });

  it("does not call setToken if token is missing", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      json: async () => ({}),
    });

    await handleLogin({ API_BASE, userId, password, setToken });
    expect(setToken).not.toHaveBeenCalled();
  });

  it("throws if fetch fails", async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error("fail"));
    await expect(
      handleLogin({ API_BASE, userId, password, setToken })
    ).rejects.toThrow("fail");
  });
});

describe("handleSendNotification", () => {
  const API_BASE = "http://api";
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

    await handleSendNotification({ API_BASE, token, notification });

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
      handleSendNotification({ API_BASE, token, notification })
    ).rejects.toThrow("fail");
  });
});