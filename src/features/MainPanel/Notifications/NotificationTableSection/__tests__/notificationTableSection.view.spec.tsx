import React from "react";
import { render, fireEvent } from "@testing-library/react";
import NotificationTableSection from "../NotificationTableSection.view";

// Mock ControlledList to expose the filter button for test
jest.mock("@essnextgen/ui-kit", () => {
    const original = jest.requireActual("@essnextgen/ui-kit");
    return {
        ...original,
        ControlledList: ({ filterCustumeElem2, searchOnFocus }: any) => (
            <div data-testid="controlled-list">
                {filterCustumeElem2}
                <input
                    data-testid="search-input"
                    onFocus={searchOnFocus}
                />
            </div>
        )
    };
});

describe("NotificationTableSection", () => {
    const baseProps = {
        tableData: [],
        totalTableData: 0,
        tableDataError: false,
        hasSearch: false,
        hasActiveFilters: false,
        tableRows: [],
        tableHeadersData: [],
        isTableBodyLoading: false,
        setSideIsOpen: jest.fn(),
        sideIsOpen: false,
        selectedItem: null,
        setSelectedItem: jest.fn(),
        notificationIdSelected: undefined,
        currentPage: 1,
        setCurrentPage: jest.fn(),
        setNoResults: jest.fn(),
        setTableData: jest.fn(),
        setTotalTableData: jest.fn(),
        setTableDataError: jest.fn(),
        setIsTableBodyLoading: jest.fn(),
        notificationState: { searchCleared: false },
        setNotificationState: jest.fn(),
        setFilterBtnClicked: jest.fn(),
        filterBtnClicked: false,
        filters: {},
        setFilters: jest.fn(),
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
        totalPages: 1
    };

    it("renders without crashing", () => {
        const { getByLabelText } = render(<NotificationTableSection {...baseProps} />);
        expect(getByLabelText("Notifications table")).toBeInTheDocument();
    });

    it("calls setFilterBtnClicked when filter button is clicked", () => {
        const setFilterBtnClicked = jest.fn();
        const { getByTestId } = render(<NotificationTableSection {...baseProps} setFilterBtnClicked={setFilterBtnClicked} />);
        fireEvent.click(getByTestId("filter"));
        expect(setFilterBtnClicked).toHaveBeenCalledWith(true);
    });

    it("calls setIsAutoSuggestVisible on search focus", () => {
        const setIsAutoSuggestVisible = jest.fn();
        const { getByTestId } = render(<NotificationTableSection {...baseProps} setIsAutoSuggestVisible={setIsAutoSuggestVisible} />);
        const searchInput = getByTestId("search-input");
        fireEvent.focus(searchInput);
        expect(setIsAutoSuggestVisible).toHaveBeenCalledWith(true);
    });
});
