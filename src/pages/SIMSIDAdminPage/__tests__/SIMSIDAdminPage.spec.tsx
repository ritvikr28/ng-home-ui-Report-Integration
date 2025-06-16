import { render, fireEvent } from "@testing-library/react";
import { useMediaQuery } from "@essnextgen/ui-kit";
import SIMSIDAdminPageView from "../SIMSIDAdminPage.view";


jest.mock("@essnextgen/ui-kit", () => ({
  ...jest.requireActual("@essnextgen/ui-kit"),
  useMediaQuery: jest.fn(),
  Grid: ({ children, className, dataTestId }: any) => (
    <div className={className} data-testid={dataTestId}>{children}</div>
  ),
  GridItem: ({ children, className, lg }: any) => (
    <div className={className} data-lg={lg}>{children}</div>
  ),
}));

jest.mock("../../../features/SidePanel/SidePanel.view", () => ({
  __esModule: true,
  default: ({ togglePanel, closePanel }: any) => (
    <div data-testid="side-panel-mock">
      <button type="button" onClick={togglePanel} data-testid="toggle-button">Toggle</button>
      <button type="button" onClick={closePanel} data-testid="close-button">Close</button>
    </div>
  ),
}));

jest.mock("../../../features/SIMSIDAdmin/Components/SIMSIDAdminMainPanelView/SIMSIDAdminMainPanel.logic", () => ({
  __esModule: true,
  default: ({ isOpen, setIsOpen }: any) => (
    <div data-testid="main-panel-mock">
      Main Panel (isOpen: {isOpen.toString()})
      <button type="button" onClick={() => setIsOpen(!isOpen)} data-testid="main-panel-toggle">
        Toggle from Main Panel
      </button>
    </div>
  ),
}));

describe("SIMSIDAdminPageView", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Desktop View", () => {
    beforeEach(() => {
      (useMediaQuery as jest.Mock).mockReturnValue(false);
    });

    test("renders with side panel open by default", () => {
      const { getByTestId } = render(<SIMSIDAdminPageView />);

      expect(getByTestId("SIMSIDAdminPage")).toBeInTheDocument();
      expect(getByTestId("side-panel-mock")).toBeInTheDocument();
      expect(getByTestId("main-panel-mock")).toBeInTheDocument();

      const container = getByTestId("SIMSIDAdminPage");
      expect(container.querySelector(".side-margin-simsid-admin")).toBeTruthy();
      expect(container.querySelector(".body-open-panel-simsid-admin")).toBeTruthy();
    });

    test("toggles side panel visibility when toggle button is clicked", () => {
      const { getByTestId } = render(<SIMSIDAdminPageView />);

      const toggleButton = getByTestId("toggle-button");
      fireEvent.click(toggleButton);

      const container = getByTestId("SIMSIDAdminPage");
      expect(container.querySelector(".side-margin-closed-simsid-admin")).toBeTruthy();
      expect(container.querySelector(".body-panel-simsid-admin")).toBeTruthy();
    });

    test("closes side panel when close button is clicked", () => {
      const { getByTestId } = render(<SIMSIDAdminPageView />);

      const closeButton = getByTestId("close-button");
      fireEvent.click(closeButton);

      const container = getByTestId("SIMSIDAdminPage");
      expect(container.querySelector(".side-margin-closed-simsid-admin")).toBeTruthy();
      expect(container.querySelector(".body-panel-simsid-admin")).toBeTruthy();
    });

    test("toggles panel from main panel component", () => {
      const { getByTestId } = render(<SIMSIDAdminPageView />);

      const mainPanelToggle = getByTestId("main-panel-toggle");
      fireEvent.click(mainPanelToggle);
      const container = getByTestId("SIMSIDAdminPage");
      expect(container.querySelector(".side-margin-closed-simsid-admin")).toBeTruthy();
      expect(container.querySelector(".body-panel-simsid-admin")).toBeTruthy();
    });
  });

  describe("Mobile View", () => {
    beforeEach(() => {
      (useMediaQuery as jest.Mock).mockReturnValue(true);
    });

    test("renders with side panel closed by default", () => {
      const { getByTestId } = render(<SIMSIDAdminPageView />);

      expect(getByTestId("SIMSIDAdminPage")).toBeInTheDocument();
      expect(getByTestId("main-panel-mock")).toBeInTheDocument();

      const container = getByTestId("SIMSIDAdminPage");
      expect(container.querySelector(".side-margin-closed-simsid-admin")).toBeTruthy();
      expect(container.querySelector(".body-panel-mobile-simsid-admin")).toBeTruthy();
    });

    test("toggles mobile side panel visibility", () => {
      const { getByTestId } = render(<SIMSIDAdminPageView />);

      const mainPanelToggle = getByTestId("main-panel-toggle");
      fireEvent.click(mainPanelToggle);

      const container = getByTestId("SIMSIDAdminPage");
      expect(getByTestId("side-panel-mock")).toBeInTheDocument();
      expect(container.querySelector(".body-panel-mobile-open-simsid-admin")).toBeTruthy();
    });

    test("closes mobile side panel", () => {
      const { getByTestId } = render(<SIMSIDAdminPageView />);

      const mainPanelToggle = getByTestId("main-panel-toggle");
      fireEvent.click(mainPanelToggle);

      const closeButton = getByTestId("close-button");
      fireEvent.click(closeButton);

      const container = getByTestId("SIMSIDAdminPage");
      expect(container.querySelector(".body-panel-mobile-simsid-admin")).toBeTruthy();
    });
  });
});
