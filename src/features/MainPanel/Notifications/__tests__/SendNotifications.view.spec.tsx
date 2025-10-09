import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { authService } from "@essnextgen/auth-ui";
import * as logic from "../SendNotifications.logic";
import { SendNotification } from "../SendNotifications.view";

jest.spyOn(authService, "getAuthTokens").mockReturnValue(null);

// Mock authService
jest.mock("@essnextgen/auth-ui", () => ({
  authService: {
    getUsername: jest.fn(() => "TestUser"),
    getOrgId: jest.fn(() => "Org123"),
    getUserId: jest.fn(() => "User456"),
    isAuthorised: jest.fn(() => true),
    getAuthTokens: jest.fn(() => "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IldIVmVvZVBuZk5qZnUxZE9HTlFkSWhSN2FCdyIsImtpZCI6IldIVmVvZVBuZk5qZnUxZE9HTlFkSWhSN2FCdyJ9.eyJpc3MiOiJodHRwczovL3NpbXNpZC1wYXJ0bmVyLXN0c3NlcnZlci5henVyZXdlYnNpdGVzLm5ldC8iLCJhdWQiOiJwbS1zc28tZWRjNGE3ZWMtNjI0Zi00OWQ0LTkxODEtNTU1YjczMDFlMzNmIiwiZXhwIjoxNjcyMDU2NTk5LCJuYmYiOjE2NzIwNTYyOTksImlhdCI6MTY3MjA1NjI5OSwic2lkIjoiNzMyNzAzZWQ3NzQ5ZTZhZWE3ZjJlN2U0OTdlMDM5ZjQiLCJzdWIiOiIxNDk5MDZ8RjZDMTdBMDItRkVCMC00OUFELTg4MjQtRTZBOTQxOTUwQkFDfEluaXRpYWwuQWRtaW4zMEBzaW1zaWQucGxhY2Vob2xkZXIuaWRlbnRpdHlmb3IuY28udWt8U0lNUyBJRHw2NTNhNDVjZi1hOGY3LTQyM2EtYjEzNC1jOGVjMmE0NGE1OGQiLCJhdXRoX3RpbWUiOjE2NzIwNTYyOTcsImlkcCI6Imlkc3J2IiwiTGFzdExvZ2luVGltZXN0YW1wIjoiRGVjIDI2LCAyMDIyIDEwOjE5OjEzIiwiUGFzc3dvcmRDaGFuZ2VkVGltZXN0YW1wIjoiRGVjIDA4LCAyMDIxIDE3OjAyOjQwIiwic2l0ZSI6IkI0MUJCMkFCIiwibGF1bmNoZXIiOiJ3ZWItYWNjZXNzIiwiU2l0ZVJvbGUiOiJBZG1pbiIsImhvbWVvcmdhbmlzYXRpb25pZGVudGlmaWVyIjoiQjQxQkIyQUItMzk3QS00RkNGLUJBNTktNjE1NkY0NTUzMjY5IiwibXVsdGlwbGVvcmdhbmlzYXRpb25zIjoiZmFsc2UiLCJuYW1lIjoiSW5pdGlhbCBBZG1pbiIsInJvbGUiOiJhZG1pbkBiNDFiYjJhYi0zOTdhLTRmY2YtYmE1OS02MTU2ZjQ1NTMyNjkiLCJhZGRpdGlvbmFscm9sZXNwcmVzZW50IjoiZmFsc2UiLCJ1c2Vyb3JnYW5pc2F0aW9uaWRlbnRpZmllciI6IjlGMEU2RTUyLTVGMjItNDYxRi05RjNCLTYwNEJFRDQxMEU5Q3xCNDFCQjJBQi0zOTdBLTRGQ0YtQkE1OS02MTU2RjQ1NTMyNjl8UyIsInByb3ZpZGVyIjoiU0lNUyBJRCIsInByb3ZpZGVyaWQiOiIxNDk5MDYiLCJwcm92aWRlcm5hbWUiOiJJbml0aWFsIEFkbWluIiwidmVuZG9yaWQiOiIyODYxQTAwMC03OTM0LTQ0QkYtOUY2RS05NkE5MjIyNjZGMzkiLCJhcHBsaWNhdGlvbmlkIjoiMUEyQjMyQzctOUMzOS00Q0NGLUE1ODEtRTI1M0E5RkEwN0E0IiwiYXBwbGljYXRpb25uYW1lIjoiRVNTLVNhdGVsbGl0ZXMtRGV2ZWxvcG1lbnQtU3RhZmYgJiBBZG1pbiIsImFtciI6WyJwYXNzd29yZCJdfQ.0dhbAIzNyXm5oJ679cOuiqwT8RgqcBhEGACfvxfGBLKHSNxvlBKqwmtRNxySYIc4MgH3w2sT4SLpo8yaEihjk9AXzfSPshHKbfAigb82834xnfMAEDnyc0hMT9jaxvfYVw8ZORPsVw68mxAwt4-WTVoUxLy4IK7tpI-Pzc_aFpW-BbMHr9Ctt_ls8EPH8NxJ22LnNbxJPSx3iBn8OwvcCIf2TeJL0fs30_VAm-XMLnF4w2SMbOC5O8CNd-ii6dmDLDriYYVzp-mQ4NiARohGJyDl6IwdgX6wXsSJB78Yy6AmCxUIXPQk4TYg_8wI9a_XNgilY5iMmEV6GXoLtm4e0A")
  },
  MatchPermissions: {
    any: "any", // ← mock value (doesn't matter what)
  },
}));

// Mock logic functions
jest.spyOn(logic, "connectWebSocket").mockImplementation(jest.fn());

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
    
  });

  it("shows user info when token is present", () => {
    render(<SendNotification />);
    expect(screen.getByText(/TestUser Logged in!/)).toBeInTheDocument();
    expect(screen.getByText(/Org ID:/)).toBeInTheDocument();
    expect(screen.getByText(/User ID:/)).toBeInTheDocument();
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
            rolesIds: ["admin", "user"],
            userIds: ["u1", "u2"],
          },
        })
      );
    });
  });
});
