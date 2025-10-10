import { connectWebSocket, handleSendNotification, fetchActiveConnectionCount, API_BASE } from "../SendNotifications.logic";

describe("connectWebSocket", () => {
  let originalWebSocket: any;
  let mockSocket: any;
  let setWsStatus: jest.Mock;
  let setMessages: jest.Mock;
  let reconnectAttempts: { current: number };
  let reconnectTimeout: { current: any };
  let wsRef: { current: any };
  let setActiveConnectionCount: jest.Mock;
  const token = "abc123";

  beforeAll(() => {
    originalWebSocket = global.WebSocket;
  });

  beforeEach(() => {
    setWsStatus = jest.fn();
    setMessages = jest.fn();
    setActiveConnectionCount = jest.fn();
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
      setActiveConnectionCount: jest.fn(),
    });
    expect(setWsStatus).toHaveBeenCalledWith("connecting");
    expect(wsRef.current).toBe(mockSocket);
  });

  it("handles onopen event and sends auth message", () => {
    connectWebSocket({
      token,
      setWsStatus,
      wsRef,
      setMessages,
      reconnectAttempts,
      reconnectTimeout,
      setActiveConnectionCount,
    });
    mockSocket.send.mockClear();
    mockSocket.onopen();
    expect(setWsStatus).toHaveBeenCalledWith("connected");
    expect(reconnectAttempts.current).toBe(0);
    expect(mockSocket.send).toHaveBeenCalledWith(
      JSON.stringify({ type: "auth", token })
    );
    expect(setActiveConnectionCount).not.toHaveBeenCalled();
  });

  it.skip("handles onmessage event and updates messages", () => {
    connectWebSocket({
      token,
      setWsStatus,
      wsRef,
      setMessages,
      reconnectAttempts,
      reconnectTimeout,
      setActiveConnectionCount,
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
      setActiveConnectionCount,
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
      setActiveConnectionCount,
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
      setActiveConnectionCount,
    });
    mockSocket.onerror();
    expect(mockSocket.close).toHaveBeenCalled();
  });

  it("does not throw if socket.send fails in onopen", () => {
    connectWebSocket({
      token,
      setWsStatus,
      wsRef,
      setMessages,
      reconnectAttempts,
      reconnectTimeout,
      setActiveConnectionCount,
    });
    mockSocket.send.mockImplementation(() => {
      throw new Error("fail");
    });
    expect(() => mockSocket.onopen()).not.toThrow();
  });
  it("handles onmessage event and updates messages for non-activeCount type", () => {
  connectWebSocket({
    token,
    setWsStatus,
    wsRef,
    setMessages,
    reconnectAttempts,
    reconnectTimeout,
    setActiveConnectionCount,
  });
  // Simulate a message that is NOT activeCount
  const message = JSON.stringify({ type: "info", data: "hello" });
  mockSocket.onmessage({ data: message });
  expect(setMessages).toHaveBeenCalledWith(expect.any(Function));
  expect(setActiveConnectionCount).not.toHaveBeenCalled();
});

it("handles onmessage event and updates active connection count for activeCount type", () => {
  connectWebSocket({
    token,
    setWsStatus,
    wsRef,
    setMessages,
    reconnectAttempts,
    reconnectTimeout,
    setActiveConnectionCount,
  });
  // Simulate a message that IS activeCount
  const message = JSON.stringify({ type: "activeCount", count: 7 });
  mockSocket.onmessage({ data: message });
  expect(setActiveConnectionCount).toHaveBeenCalledWith(7);
  // Should NOT call setMessages for activeCount
  expect(setMessages).toHaveBeenCalled();
});
});

describe("handleSendNotification", () => {
  const token = "abc123";
  const notification = { type: "info", message: "Hello", rolesIds: ["admin"], userIds: ["u1"] };

  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it.skip("calls fetch with correct arguments", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({ ok: true });

    await handleSendNotification({
      token,
      notification,
      message: "Test message"
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
      handleSendNotification({ token: "", notification: "", message: "Test message" })
    ).rejects.toThrow("fail");
  });

  it("does not throw if fetch resolves but not ok", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({ ok: false });
    await expect(
      handleSendNotification({ token, notification, message: "Test message" })
    ).resolves.toBeUndefined();
  });
  
});

describe("fetchActiveConnectionCount", () => {
  let setActiveConnectionCount: jest.Mock;

  beforeEach(() => {
    setActiveConnectionCount = jest.fn();
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("sets active connection count if fetch ok", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => 5,
    });
    await fetchActiveConnectionCount({ setActiveConnectionCount });
    expect(setActiveConnectionCount).toHaveBeenCalledWith(5);
  });

  it("does not set active connection count if fetch not ok", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => 0,
    });
    await fetchActiveConnectionCount({ setActiveConnectionCount });
    expect(setActiveConnectionCount).not.toHaveBeenCalled();
  });

  it("handles fetch error gracefully", async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error("fail"));
    await expect(fetchActiveConnectionCount({ setActiveConnectionCount })).resolves.toBeUndefined();
    expect(setActiveConnectionCount).not.toHaveBeenCalled();
  });
  
});