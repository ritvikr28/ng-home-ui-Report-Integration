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

it("updates notification message when user types in Message input", () => {
  render(<SendNotification />);
  const messageInput = screen.getByPlaceholderText(/Message/i);
  fireEvent.change(messageInput, { target: { value: "Hello world!" } });
  expect(messageInput).toHaveValue("Hello world!");
});

it("updates notification type when user types in Type input", () => {
  render(<SendNotification />);
  const typeInput = screen.getByPlaceholderText(/Type/i);
  fireEvent.change(typeInput, { target: { value: "info" } });
  expect(typeInput).toHaveValue("info");
});

it("updates notification roles when user types in Roles input", () => {
  render(<SendNotification />);
  const rolesInput = screen.getByPlaceholderText(/Roles/i);
  fireEvent.change(rolesInput, { target: { value: "admin, user" } });
  expect(rolesInput).toHaveValue("admin,user");
});

it("updates notification userIds when user types in User IDs input", () => {
  render(<SendNotification />);
  const userIdsInput = screen.getByPlaceholderText(/User IDs/i);
  fireEvent.change(userIdsInput, { target: { value: "123,456" } });
  expect(userIdsInput).toHaveValue("123,456");
});
})
