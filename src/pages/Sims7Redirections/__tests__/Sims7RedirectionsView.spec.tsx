
import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Sims7RedirectionsView from "../Sims7RedirectionsView";

jest.mock("@essnextgen/ui-kit", () => ({
  Tag: ({ text }: any) => <div data-testid="status-tag">{text}</div>,
  TagSize: { Large: "Large" },
  SidePanelContent: ({ children }: any) => (
    <div data-testid="sidepanel-content">{children}</div>
  )
}));

const mockSetSidePanelMode = jest.fn();

jest.mock("../Sims7RedirectionsViewHelpers", () => ({
  getStatusTagColor: jest.fn(() => "green"),
  getRedirectToNextGenText: jest.fn(() => "Redirected"),
  EditButton: ({ setSidePanelMode }: any) => (
    <button
      type="button"
      data-testid="edit-button"
      onClick={() => setSidePanelMode("edit")}
    >
      Edit
    </button>
  )
}));

const mockPayload = {
  payload: {
    ngComponent: "Test Category",
    ngModule: "NextGenModule",
    sims7Module: "SIMS7Module",
    redirectStatus: "PLANNED",
    updatedByUserName: "TestUser",
    effectiveDate: "2026-02-18T00:00:00",
    nextGenComponentUrl: "https://example.com/module/NextGenModule"
  }
};

const mockT = (key: string) => key;

describe("Sims7RedirectionsView", () => {
  it("renders all main fields correctly", () => {
    render(
      <Sims7RedirectionsView
        viewData={mockPayload}
        t={mockT}
        setSidePanelMode={mockSetSidePanelMode}
      />
    );

    expect(screen.getByText("SIMS7Redirects.category")).toBeInTheDocument();
    expect(screen.getByText("Test Category")).toBeInTheDocument();

    expect(screen.getByText("SIMS7Redirects.nextGenModule")).toBeInTheDocument();
    expect(screen.getByText("NextGenModule")).toBeInTheDocument();

    expect(screen.getByText("SIMS7Redirects.sims7Module")).toBeInTheDocument();
    expect(screen.getByText("SIMS7Module")).toBeInTheDocument();

    expect(screen.getByText("SIMS7Redirects.redirectToNextGen")).toBeInTheDocument();
    expect(screen.getByText("Redirected")).toBeInTheDocument();

    expect(screen.getByText("SIMS7Redirects.modifiedBy")).toBeInTheDocument();
    expect(screen.getByText("TestUser")).toBeInTheDocument();

    expect(screen.getByText("SIMS7Redirects.effectiveDate")).toBeInTheDocument();
    expect(screen.getByText("18 Feb 2026")).toBeInTheDocument();

    expect(screen.getByTestId("status-tag")).toHaveTextContent("PLANNED");
  });

  it("renders Next Gen module link correctly", () => {
    render(
      <Sims7RedirectionsView
        viewData={mockPayload}
        t={mockT}
        setSidePanelMode={mockSetSidePanelMode}
      />
    );

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute(
      "href",
      "https://example.com/module/NextGenModule"
    );
  });

  it("does not render modified by when value is '-'", () => {
    const data = {
      payload: {
        ...mockPayload.payload,
        updatedByUserName: "-"
      }
    };

    render(
      <Sims7RedirectionsView
        viewData={data}
        t={mockT}
        setSidePanelMode={mockSetSidePanelMode}
      />
    );

    expect(screen.queryByText("Modified by")).not.toBeInTheDocument();
  });

  it("does not render effective date when value is '-'", () => {
    const data = {
      payload: {
        ...mockPayload.payload,
        effectiveDate: "-"
      }
    };

    render(
      <Sims7RedirectionsView
        viewData={data}
        t={mockT}
        setSidePanelMode={mockSetSidePanelMode}
      />
    );

    expect(screen.queryByText("Effective date")).not.toBeInTheDocument();
  });

  it("calls edit mode when edit button clicked", () => {
    render(
      <Sims7RedirectionsView
        viewData={mockPayload}
        t={mockT}
        setSidePanelMode={mockSetSidePanelMode}
      />
    );

    screen.getByTestId("edit-button").click();

    expect(mockSetSidePanelMode).toHaveBeenCalledWith("edit");
  });
});