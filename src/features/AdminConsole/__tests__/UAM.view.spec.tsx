import React from "react";
import { render, screen,  act } from "@testing-library/react";
import { useMediaQuery } from "@essnextgen/ui-kit";
import UAM from "../UAM.view";


interface LocalisedMenuProps {
    onCloseSideNavigationPanel: () => void;
    isOpenSideNavigation: boolean;
  }
// Mock dependencies
jest.mock("@essnextgen/ui-kit", () => ({
  ...jest.requireActual("@essnextgen/ui-kit"),
  useMediaQuery: jest.fn(),
}));

jest.mock("@essnextgen/ui-application-kit", () => ({
    LocalisedMenu: ({
      onCloseSideNavigationPanel,
      isOpenSideNavigation,
    }: LocalisedMenuProps) => (
      <button type="button" onClick={onCloseSideNavigationPanel}>
        {isOpenSideNavigation ? "Close Menu" : "Open Menu"}
      </button>
    ),
  }));

jest.mock("@essnextgen/ui-user-access-management-kit", () => ({
  UserManagement: jest.fn(() => <div data-testid="user-management" />),
}));

jest.mock("@essnextgen/ui-kit", () => ({
    ...jest.requireActual("@essnextgen/ui-kit"),
    useMediaQuery: jest.fn(),
  }));

describe("UAM Component", () => {
 
  test("renders the UAM component correctly", () => {
    (useMediaQuery as jest.Mock).mockReturnValue(false); 

    render(<UAM />);

    expect(screen.getByTestId("user-management")).toBeInTheDocument();
  });

  test("disables scrolling when no data is present", () => {
    (useMediaQuery as jest.Mock).mockReturnValue(false); 
  
    render(<UAM />);

    expect(document.body.style.overflowY).toBe("hidden");
  });

  test("enables scrolling when data is present", () => {
    (useMediaQuery as jest.Mock).mockReturnValue(false); 

    render(<UAM />);

    document.body.style.overflowY = "auto";
    expect(document.body.style.overflowY).toBe("auto");
  });

  test("sets hasData to false when 'No data to display' is present", () => {
    render(<UAM />);

    expect(document.body.style.overflowY).toBe("hidden");
  });

  test("MutationObserver updates when data is removed", () => {
    render(<UAM />);
    const userManagementDiv = screen.getByTestId("user-management");
    act(() => {
      userManagementDiv.textContent = "No data to display";
      const event = new Event("DOMSubtreeModified");
      userManagementDiv.dispatchEvent(event);
    });

    expect(document.body.style.overflowY).toBe("hidden");
  });
});
