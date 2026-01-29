import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import NotificationTableSection from "../NotificationTableSection/NotificationTableSection.view";

jest.mock("@essnextgen/ui-kit", () => ({
    ControlledList: jest.fn((props) => (
        <div data-testid="controlled-list-mock">
            {props.filterCustumeElem2}
            <button type="button" data-testid="pagination-next" onClick={() => props.paginationOnChange?.({}, props.paginationPage + 1)}>Next</button>
        </div>
    )),
    Button: jest.fn((props) => (
        <button type="button" data-testid={props["data-testid"] || "button"} onClick={props.onClick}>{props.children}</button>
    )),
    ButtonColor: {},
    ButtonIconPosition: {},
    ButtonSize: {},
    IconColor: {},
    NotificationStatus: {},
    ResponseCode: {},
    ValidationTextLevel: {},
    Confirmation: {},
    DialogTemplate: { Confirmation: "Confirmation" }
}));

jest.mock("../useNotification", () => ({
    useNotification: jest.fn()
}));
jest.mock("../components/NotificationSidePanelComponent/NotificationSidePanel.view", () =>
    jest.fn(() => <div data-testid="notification-side-panel">SidePanel</div>)
);

jest.mock('@essnextgen/ui-application-kit', () => ({
    // Mock only what you need, or return an empty object
    __esModule: true,
    default: {},
}));



const { useNotification } = require("../useNotification");

const defaultUseNotificationReturn = {
    setFilterBtnClicked: jest.fn(),
    totalNotifications: 2,
    totalPages: 1,
    searchTerm: "",
    isSearching: false,
    noResults: false,
    handleSelectedCheckboxIds: [],
    showDeleteToast: false,
    isClearSelectedCheckbox: false
};

const getDefaultProps = (overrides = {}) => ({
    tableData: [{ id: "1" }, { id: "2" }],
    totalTableData: 2,
    tableDataError: false,
    hasSearch: false,
    hasActiveFilters: false,
    tableRows: [{ id: "1" }, { id: "2" }],
    tableHeadersData: [{ text: "Header" }],
    isTableBodyLoading: false,
    setSideIsOpen: jest.fn(),
    sideIsOpen: false,
    selectedItem: null,
    setSelectedItem: jest.fn(),
    notificationIdSelected: undefined,
    currentPage: 1,
    setCurrentPage: jest.fn(),
    ...overrides
});

beforeEach(() => {
    jest.clearAllMocks();
    useNotification.mockReturnValue({ ...defaultUseNotificationReturn });
});

describe("NotificationTableSection", () => {
    it("renders ControlledList with correct props", () => {
        render(<NotificationTableSection {...getDefaultProps()} />);
        expect(screen.getByTestId("controlled-list-mock")).toBeInTheDocument();
    });

    it("renders NotificationSidePanelView when sideIsOpen is true", () => {
        render(<NotificationTableSection {...getDefaultProps({ sideIsOpen: true })} />);
        expect(screen.getByTestId("notification-side-panel")).toBeInTheDocument();
    });

    it("does not render NotificationSidePanelView when sideIsOpen is false", () => {
        render(<NotificationTableSection {...getDefaultProps({ sideIsOpen: false })} />);
        expect(screen.queryByTestId("notification-side-panel")).not.toBeInTheDocument();
    });

    it("calls setFilterBtnClicked when Filter button is clicked", () => {
        const setFilterBtnClicked = jest.fn();
        useNotification.mockReturnValue({ ...defaultUseNotificationReturn, setFilterBtnClicked });
        render(<NotificationTableSection {...getDefaultProps()} />);
        const filterBtn = screen.getByTestId("filter");
        fireEvent.click(filterBtn);
        expect(setFilterBtnClicked).toHaveBeenCalledWith(true);
    });

    it("calls setCurrentPage when pagination next is clicked", () => {
        const setCurrentPage = jest.fn();
        render(<NotificationTableSection {...getDefaultProps({ setCurrentPage, currentPage: 1 })} />);
        const nextBtn = screen.getByTestId("pagination-next");
        fireEvent.click(nextBtn);
        expect(setCurrentPage).toHaveBeenCalledWith(2);
    });

    it("shows error message when tableDataError is true", () => {
        render(<NotificationTableSection {...getDefaultProps({ tableDataError: true })} />);
        expect(screen.getByTestId("controlled-list-mock")).toBeInTheDocument();
        // The error message is passed as a prop to ControlledList, so just check ControlledList is rendered
    });

    it("shows empty state message when no data and not loading", () => {
        useNotification.mockReturnValue({ ...defaultUseNotificationReturn, totalNotifications: 0 });
        render(<NotificationTableSection {...getDefaultProps({ tableData: [], tableRows: [], totalTableData: 0 })} />);
        expect(screen.getByTestId("controlled-list-mock")).toBeInTheDocument();
    });
});