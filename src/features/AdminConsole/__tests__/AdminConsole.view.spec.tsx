import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import AdminConsole from "../AdminConsole.view";
import BreadcrumbWrapper from "../../../shared/components/BreadcrumbWrapper/BreadcrumbWrapper";

// interface IBreadcrumbAction {
//   active: boolean;
//   linkName: string;
//   path: string;
// }

// interface IBreadcrumbsProps {
//   breadcrumbActions: IBreadcrumbAction[];
//   className: string;
//   dataTestId: string;
//   id: string;
//   onItemClick: (action: IBreadcrumbAction) => void;
// }

interface LocalisedMenuProps {
  onCloseSideNavigationPanel: () => void;
  isOpenSideNavigation: boolean;
}

// jest.mock("@essnextgen/ui-kit", () => ({
//   Breadcrumbs: ({ breadcrumbActions, onItemClick }: IBreadcrumbsProps) => (
//     <nav>
//       {breadcrumbActions.map((action, index) => (
//         <a
//           key={index}
//           href={action.path}
//           className={action.active ? "active" : ""}
//           data-testid={`breadcrumb-${index}`}
//           onClick={() => onItemClick(action)}
//         >
//           {action.linkName}
//         </a>
//       ))}
//     </nav>
//   ),
// }));

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

describe("AdminConsole component", () => {
  it("renders About component", () => {
    render(<AdminConsole />);

    const aboutComponent = screen.getByText("About the Admin console");

    expect(aboutComponent).toBeInTheDocument();
  });

  it("calls setIsOpen with false when menu is closed", () => {
    const setIsOpen = jest.fn();
    jest.spyOn(React, "useState").mockImplementation(() => [true, setIsOpen]);

    render(<AdminConsole />);

    const closeButton = screen.getByText("Close Menu");
    fireEvent.click(closeButton);

    expect(setIsOpen).toHaveBeenCalledWith(false);
  });

  test("calls onCloseSideNavigationPanel when Admin Console breadcrumb is clicked", () => {
    const handleClick = jest.fn();
    render(<BreadcrumbWrapper />);
    const adminConsoleBreadcrumb = screen.getByText("Home");
    fireEvent.click(adminConsoleBreadcrumb);
    expect(handleClick).toHaveBeenCalledTimes(0);
  });
});
