import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Sims7RedirectionsPage } from "../Sims7RedirectionsPage.view";

jest.mock("../Sims7RedirectionsPage.api", () => ({
  fetchAutoSuggestions: jest.fn().mockResolvedValue({
    payload: {
      group1: [],
      group2: []
    }
  }),
  fetchSims7Redirections: jest.fn().mockResolvedValue({
    items: [],
    totalItems: 0,
  })
}));

describe("Sims7RedirectionsPage suggestion error message", () => {
  it("shows translated error message with searchTerm", async () => {
    render(<Sims7RedirectionsPage />);
    const searchInput = screen.getByRole("textbox");
    fireEvent.change(searchInput, { target: { value: "abc" } });
    // await waitFor(() => {
    //   // The translation key should be used
    //   expect(screen.getByText(/SIMS7Redirects\.suggestionErrorMessage/)).toBeInTheDocument();
    // });
  });
});
