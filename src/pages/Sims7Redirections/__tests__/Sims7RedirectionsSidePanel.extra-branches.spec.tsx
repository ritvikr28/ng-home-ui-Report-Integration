/* eslint-disable */
import { render, screen, fireEvent } from "@testing-library/react";
import Sims7RedirectionsSidePanel from "../Sims7RedirectionsSidePanel";

describe("Sims7RedirectionsSidePanel extra branch coverage", () => {
  const baseProps = {
    isOpen: true,
    onClose: jest.fn(),
    mode: "edit" as const,
    selectedRow: {
      category: "TestCat",
      nextGenModule: "TestMod",
      sims7Module: "SIMS7",
      modifiedBy: "-",
      effectiveDate: "-",
      status: "Planned",
      reasonForChanges: "",
    },
    t: (key: string) => key,
    setSidePanelMode: jest.fn(),
  };

  it("shows effective date input for Planned status and yes redirect", () => {
    render(
      <Sims7RedirectionsSidePanel
        {...baseProps}
        selectedRow={{ ...baseProps.selectedRow, status: "Planned" }}
      />
    );
    fireEvent.click(screen.getByLabelText("Yes"));
    expect(screen.getByText("Effective date")).toBeInTheDocument();
  });

  it("shows reason for changes for Not migrated and no redirect", () => {
    render(
      <Sims7RedirectionsSidePanel
        {...baseProps}
        selectedRow={{ ...baseProps.selectedRow, status: "Not migrated", reasonForChanges: "Some reason" }}
      />
    );
    fireEvent.click(screen.getByLabelText("No"));
    expect(screen.getByText("Reason for changes")).toBeInTheDocument();
  });

  it("shows dialog when cancel is clicked and form is dirty", async () => {
    render(
      <Sims7RedirectionsSidePanel
        {...baseProps}
        selectedRow={{ ...baseProps.selectedRow, status: "Migrated" }}
      />
    );
    fireEvent.click(screen.getByLabelText("No"));
    fireEvent.change(screen.getByLabelText("text-aria"), { target: { value: "changed" } });
    fireEvent.click(screen.getByText("Cancel"));
    expect(await screen.findByText("SIMS7Redirects.discardChanges")).toBeInTheDocument();
  });

  it("shows error for invalid date input", () => {
    render(
      <Sims7RedirectionsSidePanel
        {...baseProps}
        selectedRow={{ ...baseProps.selectedRow, status: "Migrated" }}
      />
    );
    fireEvent.click(screen.getByLabelText("No"));
    fireEvent.change(screen.getByLabelText("Day"), { target: { value: "32" } });
    fireEvent.change(screen.getByLabelText("Month"), { target: { value: "13" } });
    fireEvent.change(screen.getByLabelText("Year"), { target: { value: "2026" } });
    fireEvent.blur(screen.getByLabelText("Year"));
    fireEvent.click(screen.getByText("Save"));
    expect(screen.getByText("Invalid Date")).toBeInTheDocument();
  });

  it("shows success toast after save", async () => {
    render(
      <Sims7RedirectionsSidePanel
        {...baseProps}
        selectedRow={{ ...baseProps.selectedRow, status: "Migrated" }}
      />
    );
    fireEvent.click(screen.getByLabelText("No"));
    fireEvent.change(screen.getByLabelText("text-aria"), { target: { value: "reason" } });
    fireEvent.change(screen.getByLabelText("Day"), { target: { value: "15" } });
    fireEvent.change(screen.getByLabelText("Month"), { target: { value: "12" } });
    fireEvent.change(screen.getByLabelText("Year"), { target: { value: "2027" } });
    fireEvent.click(screen.getByText("Save"));
    expect(await screen.findByText("Changes saved")).toBeInTheDocument();
  });

  it("handles unknown status gracefully", () => {
    render(
      <Sims7RedirectionsSidePanel
        {...baseProps}
        mode="view"
        selectedRow={{ ...baseProps.selectedRow, status: "UnknownStatus" }}
      />
    );
    expect(screen.getByText("UnknownStatus")).toBeInTheDocument();
  });
});
