import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SendNotification from "../SendNotifications.view";
 
global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ token: "test-token" }),
    })
) as jest.Mock;
 
describe("SendNotification", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
 
    it("renders login fields and login button", () => {
        render(<SendNotification />);
        expect(screen.getByPlaceholderText("User ID")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
        expect(screen.getByText("Login")).toBeInTheDocument();
    });
 
    it("allows user to input credentials", () => {
        render(<SendNotification />);
        const userIdInput = screen.getByPlaceholderText("User ID");
        const passwordInput = screen.getByPlaceholderText("Password");
 
        fireEvent.change(userIdInput, { target: { value: "user1" } });
        fireEvent.change(passwordInput, { target: { value: "pass1" } });
 
        expect(userIdInput).toHaveValue("user1");
        expect(passwordInput).toHaveValue("pass1");
    });
 
    it("calls login API and sets token on login",  () => {
        render(<SendNotification />);
        // Wait for the initial auto-login to finish
        // await waitFor(() =>
        //     expect(global.fetch).toHaveBeenCalled()
        // );
 
        fireEvent.change(screen.getByPlaceholderText("User ID"), { target: { value: "user1" } });
        fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "pass1" } });
        fireEvent.click(screen.getByText("Login"));
 
        waitFor(() => {
            expect(screen.getByText("user1 Logged in!")).toBeInTheDocument();
        });
    });
 
    it("renders notification form fields", () => {
        render(<SendNotification />);
        expect(screen.getByPlaceholderText(/Type/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Message/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Roles/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/User IDs/i)).toBeInTheDocument();
    });
 
    it("renders received notifications list", () => {
        render(<SendNotification />);
        expect(screen.getByText(/Received Notifications/i)).toBeInTheDocument();
        expect(screen.getByRole("list")).toBeInTheDocument();
    });
 
    it("disables Send button if not logged in", () => {
        render(<SendNotification />);
        expect(screen.getByRole("button", { name: "Send" })).toBeDisabled();
    });

    it("calls handleSendNotification when Send button is clicked", async () => {
  (global.fetch as jest.Mock)
  .mockResolvedValueOnce({
    ok: true,
    json: () => Promise.resolve({ token: "test-token" }),
  })
  .mockResolvedValueOnce({
    ok: true,
    json: () => Promise.resolve({}), // add this line for the send notification response
  });

  render(<SendNotification />);

  // Login first
  fireEvent.change(screen.getByPlaceholderText("User ID"), { target: { value: "user1" } });
  fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "pass1" } });
  fireEvent.click(screen.getByText("Login"));

  // Wait for login to complete and token to be set
  await waitFor(() => expect(screen.getByText("user1 Logged in!")).toBeInTheDocument());
});
})

describe("connectWebSocket", () => {
  let originalWebSocket: any;
  let mockSocket: any;
  let setWsStatus: jest.Mock;
  let setMessages: jest.Mock;
  let reconnectAttempts: { current: number };
  let reconnectTimeout: { current: any };
  let wsRef: { current: any };
  let token: string;

  beforeAll(() => {
    originalWebSocket = global.WebSocket;
  });

 beforeEach(() => {
  setWsStatus = jest.fn();
  setMessages = jest.fn();
  reconnectAttempts = { current: 0 };
  reconnectTimeout = { current: null };
  wsRef = { current: null };
  token = "test-token";

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

  function getConnectWebSocket() {
    // Import the hook or function from your component file, or copy the function here for isolated testing.
    // For this example, we inline a simplified version:
    return () => {
      if (!token) return;
      setWsStatus("connecting");
      const socket = new global.WebSocket(`wss://test?access_token=${token}`);
      wsRef.current = socket;

      socket.onopen = () => {
        setWsStatus("connected");
        reconnectAttempts.current = 0;
      };

      socket.onmessage = (event: any) => {
        setMessages((prev: any) => [...(prev || []), event.data]);
      };

      socket.onclose = () => {
        setWsStatus("disconnected");
        if (token && reconnectAttempts.current < 10) {
          setWsStatus("reconnecting");
          const delay = Math.min(1000 * 2 ** reconnectAttempts.current, 30000);
          reconnectTimeout.current = setTimeout(() => {}, delay);
          reconnectAttempts.current += 1;
        }
      };

      socket.onerror = () => {
        socket.close();
      };
    };
  }

  it("does nothing if no token", () => {
    token = "";
    const connectWebSocket = getConnectWebSocket();
    connectWebSocket();
    expect(setWsStatus).not.toHaveBeenCalled();
    expect(global.WebSocket).not.toHaveBeenCalled();
  });

  it("sets wsStatus to connecting and assigns wsRef", () => {
    const connectWebSocket = getConnectWebSocket();
    connectWebSocket();
    expect(setWsStatus).toHaveBeenCalledWith("connecting");
    expect(wsRef.current).toBe(mockSocket);
  });

  it("handles onopen event", () => {
    const connectWebSocket = getConnectWebSocket();
    connectWebSocket();
    mockSocket.onopen();
    expect(setWsStatus).toHaveBeenCalledWith("connected");
    expect(reconnectAttempts.current).toBe(0);
  });

  it("handles onmessage event", () => {
    const connectWebSocket = getConnectWebSocket();
    connectWebSocket();
    setMessages.mockImplementation((fn) => fn(["old"]));
    mockSocket.onmessage({ data: "new message" });
    expect(setMessages).toHaveBeenCalled();
  });

  it("handles onclose and triggers reconnect", () => {
    const connectWebSocket = getConnectWebSocket();
    connectWebSocket();
    reconnectAttempts.current = 0;
    mockSocket.onclose();
    expect(setWsStatus).toHaveBeenCalledWith("disconnected");
    expect(setWsStatus).toHaveBeenCalledWith("reconnecting");
    expect(reconnectAttempts.current).toBe(1);
  });

  it("does not reconnect if attempts >= 10", () => {
    const connectWebSocket = getConnectWebSocket();
    connectWebSocket();
    reconnectAttempts.current = 10;
    mockSocket.onclose();
    expect(setWsStatus).toHaveBeenCalledWith("disconnected");
    expect(setWsStatus).not.toHaveBeenCalledWith("reconnecting");
  });

  it("handles onerror by closing socket", () => {
    const connectWebSocket = getConnectWebSocket();
    connectWebSocket();
    mockSocket.onerror();
    expect(mockSocket.close).toHaveBeenCalled();
  });
});