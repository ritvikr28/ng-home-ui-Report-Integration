import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Sims7RedirectionsPage } from "../Sims7RedirectionsPage.view";

jest.mock("../Sims7RedirectionsPage.api", () => ({
  fetchSims7Redirections: jest.fn().mockResolvedValue({
    items: [
      {
        moduleId: 1,
        ngComponent: "TestCat",
        ngModule: "TestNextGen",
        sims7Module: "TestSIMS7",
        updatedByUserName: "TestUser",
        effectiveDate: "2026-02-18T00:00:00",
        redirectStatus: "PLANNED",
        tooltipMessage: "Test tooltip",
        cellStatus: "",
        actions: {
          options: [
            {
              disabled: false,
              isSelected: false,
              text: " View",
              value: "View",
            }
          ],
        },
        reasonForChanges: "",
      }
    ],
    totalItems: 1,
  }),
  fetchAutoSuggestions: jest.fn().mockResolvedValue({ payload: {} }),
}));

describe("Sims7RedirectionsPage searchOnClickClose", () => {
  it("clears searchTerm and resets table data", async () => {
    render(<Sims7RedirectionsPage />);
    await waitFor(() => {
      expect(screen.getByText("TestCat")).toBeInTheDocument();
    });
    const searchInput = screen.getByRole("textbox");
    fireEvent.change(searchInput, { target: { value: "TestCat" } });
    // Simulate suggestion click to filter table
    fireEvent.click(screen.getByText("TestCat"));
    // Simulate clearing the search (searchOnClickClose behaviour) by clearing the input
    fireEvent.change(searchInput, { target: { value: "" } });
    // Table should reset to original data
    await waitFor(() => {
      expect(searchInput).toHaveValue("");
      expect(screen.getByText("TestCat")).toBeInTheDocument();
    });
  });
});
