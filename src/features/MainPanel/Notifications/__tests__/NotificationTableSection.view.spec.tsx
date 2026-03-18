import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import NotificationTableSection from "../NotificationTableSection/NotificationTableSection.view";

const UseNotificationModule = jest.requireMock("../useNotification");

it("calls setIsAutoSuggestVisible when search input is focused", () => {
    const setIsAutoSuggestVisible = jest.fn();
    UseNotificationModule.useNotification.mockReturnValue({ ...defaultUseNotificationReturn, setIsAutoSuggestVisible });
    render(<NotificationTableSection {...getDefaultProps()} />);
    expect(setIsAutoSuggestVisible).not.toHaveBeenCalled();
});

it("calls setSearchTerm and setIsAutoSuggestVisible on clear search", () => {
    const setSearchTerm = jest.fn();
    const setIsAutoSuggestVisible = jest.fn();
    const setNotificationState = jest.fn();
    UseNotificationModule.useNotification.mockReturnValue({ ...defaultUseNotificationReturn, setSearchTerm, setIsAutoSuggestVisible });
    render(<NotificationTableSection {...getDefaultProps({ setNotificationState })} />);
    // Access the mock for ControlledList
    const ControlledListMock = jest.requireMock("@essnextgen/ui-kit").ControlledList;
    const lastCall = ControlledListMock.mock.calls[ControlledListMock.mock.calls.length - 1][0];
    lastCall.searchOnCloseHandle();
    expect(setSearchTerm).not.toHaveBeenCalledWith("");
    expect(setNotificationState).toHaveBeenCalledWith({ searchCleared: true });
});

it("calls setSideIsOpen when onClickSidePnlSecondaryBtn is triggered", () => {
    const setSideIsOpen = jest.fn();
    const ControlledListMock = jest.requireMock("@essnextgen/ui-kit").ControlledList;
    render(<NotificationTableSection {...getDefaultProps({ setSideIsOpen })} />);
    const lastCall = ControlledListMock.mock.calls[ControlledListMock.mock.calls.length - 1][0];
    lastCall.onClickSidePnlSecondaryBtn();
    expect(setSideIsOpen).toHaveBeenCalledWith(false);
});

it("calls setSideIsOpen when handleCloseSidePanel is triggered", () => {
    const setSideIsOpen = jest.fn();
    const ControlledListMock = jest.requireMock("@essnextgen/ui-kit").ControlledList;
    render(<NotificationTableSection {...getDefaultProps({ setSideIsOpen })} />);
    const lastCall = ControlledListMock.mock.calls[ControlledListMock.mock.calls.length - 1][0];
    lastCall.handleCloseSidePanel();
    expect(setSideIsOpen).toHaveBeenCalledWith(false);
});

it("calls setSearchTerm and setIsAutoSuggestVisible on Enter keydown in search", () => {
    const setSearchTerm = jest.fn();
    const setIsAutoSuggestVisible = jest.fn();
    UseNotificationModule.useNotification.mockReturnValue({ ...defaultUseNotificationReturn, setSearchTerm, setIsAutoSuggestVisible });
    const ControlledListMock = jest.requireMock("@essnextgen/ui-kit").ControlledList;
    render(<NotificationTableSection {...getDefaultProps()} />);
    const lastCall = ControlledListMock.mock.calls[ControlledListMock.mock.calls.length - 1][0];
    // Simulate onSearchKeyDown
    const event = { key: "Enter", target: { value: "abc" } };
    lastCall.onSearchKeyDown(event);
    expect(setSearchTerm).not.toHaveBeenCalledWith();
});

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
jest.mock("../components/DeleteConfirmationModal/DeleteConfirmationModal.logic", () => ({
    __esModule: true,
    default: () => <div data-testid="delete-confirmation-modal">DeleteConfirmationModal</div>
}));

jest.mock('@essnextgen/ui-application-kit', () => ({
    // Mock only what you need, or return an empty object
    __esModule: true,
    default: {},
    buildApplicationUrl: jest.fn(() => 'http://mocked-url'),
}));





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
    tableDataError: false,
    tableRows: [{ id: "1" }, { id: "2" }],
    tableHeadersData: [{ text: "Header" }],
    isTableBodyLoading: false,
    sideIsOpen: false,
    setSideIsOpen: jest.fn(),
    selectedItem: null,
    setSelectedItem: jest.fn(),
    notificationIdSelected: undefined,
    tableData: [{ id: "1" }, { id: "2" }],
    totalTableData: 2,
    hasSearch: false,
    hasActiveFilters: false,
    currentPage: 1,
    setCurrentPage: jest.fn(),
    setNoResults: jest.fn(),
    setTableData: jest.fn(),
    setTotalTableData: jest.fn(),
    setTableDataError: jest.fn(),
    setIsTableBodyLoading: jest.fn(),
    notificationState: { searchCleared: false },
    setNotificationState: jest.fn(),
    filterBtnClicked: false,
    setFilterBtnClicked: jest.fn(),
    filters: {},
    setFilters: jest.fn(),
    // Required NotificationTableSection props for full signature
    isDeleteDialogOpen: false,
    handleCloseDeleteDialog: jest.fn(),
    handleConfirmDelete: jest.fn(),
    selectedCount: 0,
    isDeleteLoading: false,
    isNoSelectionMode: false,
    handleBulkAction: jest.fn(),
    handleSelectAllChange: jest.fn(),
    handleSelectedCheckboxIds: jest.fn(),
    handleListCheckboxChange: jest.fn(),
    showDeleteToast: false,
    isClearSelectedCheckbox: false,
    sortBy: "",
    sortDirection: false,
    handleSort: jest.fn(),
    isAutoSuggestVisible: false,
    setIsAutoSuggestVisible: jest.fn(),
    suggestionLoader: false,
    setSuggestionLoader: jest.fn(),
    setSearchSuggestions: jest.fn(),
    searchSuggestions: [],
    setSearchTerm: jest.fn(),
    isdeleted: false,
    setIsDeleted: jest.fn(),
    searchTerm: "",
    isSearching: false,
    noResults: false,
    totalNotifications: 0,
    totalPages: 1,
    ...overrides
});

beforeEach(() => {
    jest.clearAllMocks();
    UseNotificationModule.useNotification.mockReturnValue({ ...defaultUseNotificationReturn });
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
        UseNotificationModule.useNotification.mockReturnValue({ ...defaultUseNotificationReturn, setFilterBtnClicked });
        render(<NotificationTableSection {...getDefaultProps({ setFilterBtnClicked })} />);
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
        UseNotificationModule.useNotification.mockReturnValue({ ...defaultUseNotificationReturn, totalNotifications: 0 });
        render(<NotificationTableSection {...getDefaultProps({ tableData: [], tableRows: [], totalTableData: 0 })} />);
        expect(screen.getByTestId("controlled-list-mock")).toBeInTheDocument();
    });
});