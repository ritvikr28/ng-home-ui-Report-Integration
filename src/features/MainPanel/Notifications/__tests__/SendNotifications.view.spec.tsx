import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import * as logic from "../SendNotifications.logic";
import SendNotification from "../SendNotifications.view";

// Mock authService
jest.mock("@essnextgen/auth-ui", () => ({
  authService: {
    getUsername: jest.fn(() => "TestUser"),
    getOrgId: jest.fn(() => "Org123"),
    getUserId: jest.fn(() => "User456"),
  },
}));

// Mock logic functions
jest.spyOn(logic, "connectWebSocket").mockImplementation(jest.fn());
// jest.spyOn(logic, "fetchActiveConnectionCount").mockImplementation(({ setActiveConnectionCount }) => {
//   setActiveConnectionCount(5);
// });
jest.spyOn(logic, "handleSendNotification").mockImplementation(jest.fn());

describe("SendNotification", () => {
  beforeEach(() => {
    window.sessionStorage.setItem("ACCESS_TOKEN", "dummy-token");
    jest.clearAllMocks();
  });

  afterEach(() => {
    window.sessionStorage.clear();
  });

  it("renders headings, inputs, and buttons", () => {
    render(<SendNotification />);
    expect(screen.getByText("Demo Notification App")).toBeInTheDocument();
    expect(screen.getByText("Send Notification")).toBeInTheDocument();
    expect(screen.getByText("Received Notifications")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Type")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Message")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Roles (comma separated)")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("User IDs (comma separated)")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Connect WebSocket/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Send/i })).toBeInTheDocument();
  });

  it("shows user info when token is present", () => {
    render(<SendNotification />);
    expect(screen.getByText(/TestUser Logged in!/)).toBeInTheDocument();
    expect(screen.getByText(/Org ID:/)).toBeInTheDocument();
    expect(screen.getByText(/User ID:/)).toBeInTheDocument();
  });

  it("calls connectWebSocket when connect button is clicked", () => {
    render(<SendNotification />);
    const btn = screen.getByRole("button", { name: /Connect WebSocket/i });
    fireEvent.click(btn);
    expect(logic.connectWebSocket).toHaveBeenCalled();
  });

  it("calls handleSendNotification with correct data when send button is clicked", async () => {
    render(<SendNotification />);
    fireEvent.change(screen.getByPlaceholderText("Type"), { target: { value: "info" } });
    fireEvent.change(screen.getByPlaceholderText("Message"), { target: { value: "Hello world" } });
    fireEvent.change(screen.getByPlaceholderText("Roles (comma separated)"), { target: { value: "admin,user" } });
    fireEvent.change(screen.getByPlaceholderText("User IDs (comma separated)"), { target: { value: "u1,u2" } });
    const sendBtn = screen.getByRole("button", { name: /Send/i });
    fireEvent.click(sendBtn);
    await waitFor(() => {
      expect(logic.handleSendNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          token: "dummy-token",
          notification: {
            type: "info",
            message: "Hello world",
            roles: ["admin", "user"],
            userIds: ["u1", "u2"],
          },
        })
      );
    });
  });

  it("disables send button when token is missing", () => {
    window.sessionStorage.removeItem("ACCESS_TOKEN");
    render(<SendNotification />);
    expect(screen.getByRole("button", { name: /Send/i })).toBeDisabled();
  });
});