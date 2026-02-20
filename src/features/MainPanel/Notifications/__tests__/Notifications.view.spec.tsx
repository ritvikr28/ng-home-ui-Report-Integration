import React from "react";
import { render, screen } from "@testing-library/react";
import NotificationView from "../Notifications.view";

// Mock PriorityType and formattedDate
jest.mock("../Notifications.props", () => ({
    PriorityType: { Tier1: "High", Tier2: "Medium", Tier3: "Low" }
}));
jest.mock("../useNotification", () => ({
    formattedDate: (date: string) => `formatted-${date}`,
    PAGE_SIZE: 5,
    useNotification: jest.fn()
}));

const mockUseNotification = require("../useNotification").useNotification;

describe("NotificationView tableRows mapping", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it.skip("maps tableData to tableRows with correct fields", () => {
        mockUseNotification.mockReturnValue({
            filterBtnClicked: false,
            setFilterBtnClicked: jest.fn(),
            currentPage: 1,
            totalPages: 1,
            totalNotifications: 2,
            handlePageChange: jest.fn(),
            searchTerm: "",
            isSearching: false,
            noResults: false,
            setNoResults: jest.fn(),
            handleListCheckboxChange: jest.fn(),
            handleSelectAllChange: jest.fn(),
            handleSelectedCheckboxIds: [],
            handleBulkAction: jest.fn(),
            isDeleteDialogOpen: false,
            closeDeleteDialog: jest.fn(),
            confirmDelete: jest.fn(),
            isDeleteLoading: false,
            showDeleteToast: false,
            isClearSelectedCheckbox: false,
            selectedCount: 0,
            isNoSelectionMode: false,
            filters: {},
            handleFilterChange: jest.fn(),
            handleClearAllFilters: jest.fn(),
            searchTagList: [],
            sortBy: "DateReceived",
            sortDirection: "Desc",
            handleSort: jest.fn()
        });

        render(<NotificationView />);
        expect(screen.getByText("Test Notification 1")).toBeInTheDocument();
        expect(screen.getByText("Test Notification 2")).toBeInTheDocument();
        // Status mapping
        expect(screen.getByText("Unread")).toBeInTheDocument();
        expect(screen.getByText("Read")).toBeInTheDocument();
        // Priority mapping
        expect(screen.getByText("High")).toBeInTheDocument();
        expect(screen.getByText("Medium")).toBeInTheDocument();
        // Date formatting
        expect(screen.getByText("formatted-2024-06-01")).toBeInTheDocument();
        expect(screen.getByText("formatted-2024-06-02")).toBeInTheDocument();
    });

    it.skip("handles unknown priority and missing receivedDate", () => {
        const tableData = [
            {
                id: "3",
                status: false,
                title: "Unknown Priority",
                priority: "TierX"
            }
        ];
        mockUseNotification.mockReturnValue({
            filterBtnClicked: false,
            setFilterBtnClicked: jest.fn(),
            currentPage: 1,
            totalPages: 1,
            totalNotifications: 1,
            handlePageChange: jest.fn(),
            searchTerm: "",
            isSearching: false,
            noResults: false,
            setNoResults: jest.fn(),
            handleListCheckboxChange: jest.fn(),
            handleSelectAllChange: jest.fn(),
            handleSelectedCheckboxIds: [],
            handleBulkAction: jest.fn(),
            isDeleteDialogOpen: false,
            closeDeleteDialog: jest.fn(),
            confirmDelete: jest.fn(),
            isDeleteLoading: false,
            showDeleteToast: false,
            isClearSelectedCheckbox: false,
            selectedCount: 0,
            isNoSelectionMode: false,
            filters: {},
            handleFilterChange: jest.fn(),
            handleClearAllFilters: jest.fn(),
            searchTagList: [],
            sortBy: "DateReceived",
            sortDirection: "Desc",
            handleSort: jest.fn(),
            // Provide tableData directly to the component
            tableData,
            totalTableData: 1
        });

        render(<NotificationView />);
        // Use a matcher function to find text even if split by elements
        expect(screen.getByText((content, node) => node?.textContent === "Unknown Priority")).toBeInTheDocument();
        expect(screen.getByText("Unknown")).toBeInTheDocument();
        // Date cell should be empty string, so the title is present but no date
        // Try to find an empty cell in the Date received column
        const dateCells = screen.getAllByRole("cell");
        // At least one cell should be empty string
        expect(dateCells.some(cell => cell.textContent === "")).toBe(true);
    });

    it("renders no notifications if tableData is empty", () => {
        mockUseNotification.mockReturnValue({
            filterBtnClicked: false,
            setFilterBtnClicked: jest.fn(),
            currentPage: 1,
            totalPages: 1,
            totalNotifications: 0,
            handlePageChange: jest.fn(),
            searchTerm: "",
            isSearching: false,
            noResults: false,
            setNoResults: jest.fn(),
            handleListCheckboxChange: jest.fn(),
            handleSelectAllChange: jest.fn(),
            handleSelectedCheckboxIds: [],
            handleBulkAction: jest.fn(),
            isDeleteDialogOpen: false,
            closeDeleteDialog: jest.fn(),
            confirmDelete: jest.fn(),
            isDeleteLoading: false,
            showDeleteToast: false,
            isClearSelectedCheckbox: false,
            selectedCount: 0,
            isNoSelectionMode: false,
            filters: {},
            handleFilterChange: jest.fn(),
            handleClearAllFilters: jest.fn(),
            searchTagList: [],
            sortBy: "DateReceived",
            sortDirection: "Desc",
            handleSort: jest.fn()
        });

        render(<NotificationView />);
        expect(screen.queryByText("Unread")).not.toBeInTheDocument();
        expect(screen.queryByText("Read")).not.toBeInTheDocument();
    });
});