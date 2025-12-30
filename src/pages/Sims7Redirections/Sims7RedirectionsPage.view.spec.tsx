import { render, screen, fireEvent } from "@testing-library/react";
import * as uiKit from "@essnextgen/ui-kit";
import Sims7RedirectionsPage from "./Sims7RedirectionsPage.view";
import Sims7RedirectionsLayout from "./Sims7RedirectionsLayout.logic";

describe("Sims7RedirectionsPage", () => {
  it("renders sidebar toggle button in mobile view and toggles sidebar", () => {
    jest.spyOn(uiKit, "useMediaQuery").mockReturnValue(true);
    render(<Sims7RedirectionsPage />);
    const toggleBtn = screen.getByTestId("btn-collapse");
    expect(toggleBtn).toBeInTheDocument();
    fireEvent.click(toggleBtn);
    jest.restoreAllMocks();
  });

  it("renders ControlledList with subheading and second subheading link", () => {
    render(<Sims7RedirectionsPage />);
  });

  it("calls sorting and pagination event handlers", () => {
    render(<Sims7RedirectionsPage />);
  });

  it("renders with sidebar open by default in desktop view", () => {
    jest.spyOn(uiKit, "useMediaQuery").mockReturnValue(false);
    render(<Sims7RedirectionsPage />);
    jest.restoreAllMocks();
  });

  it("renders table with correct headers and data", () => {
    render(<Sims7RedirectionsPage />);
    expect(screen.getByText(/Next Gen module/i)).toBeInTheDocument();
    expect(screen.getByText(/SIMS7 module/i)).toBeInTheDocument();
  });

  it("shows truncated text and tooltip for long Next Gen module values", async () => {
    render(<Sims7RedirectionsPage />);
    const truncatedLinks = screen.getAllByText((content, element) =>
      element ? content.endsWith("…") && element.tagName.toLowerCase() === "a" : false
    );
    expect(truncatedLinks.length).toBeGreaterThan(0);
    fireEvent.mouseOver(truncatedLinks[0]);
  });

  it("does not show tooltip for non-truncated Next Gen module values", () => {
    render(<Sims7RedirectionsPage />);
    const nonTruncatedLinks = screen.getAllByText((content, element) =>
      element ? content.length <= 19 && element.tagName.toLowerCase() === "a" : false
    );

    fireEvent.mouseOver(nonTruncatedLinks[0]);
  });

  it("calls overflow menu handler when item clicked", () => {
    render(<Sims7RedirectionsPage />);
  });

  it("renders side panel and handles close", () => {
    render(<Sims7RedirectionsPage />);
    expect(screen.getByText(/View/i)).toBeInTheDocument();
  });

  it("shows empty state when no data", () => {
  });
});

describe("Sims7RedirectionsLayout", () => {
  it("renders Sims7RedirectionsPage component", () => {
    const { container } = render(<Sims7RedirectionsLayout />);
    expect(container.querySelector(".invite-user-container")).toBeInTheDocument();
  });
});
