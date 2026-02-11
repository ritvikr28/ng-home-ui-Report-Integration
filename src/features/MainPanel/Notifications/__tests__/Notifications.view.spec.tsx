// src/features/MainPanel/Notifications/Notifications.view.test.tsx
import React from "react";
import { render, screen } from "@testing-library/react";
import NotificationView from "../Notifications.view";

jest.mock("../useNotification", () => {
    const actual = jest.requireActual("../useNotification");
    // Provide a default mock implementation to prevent destructuring errors
    return {
        ...actual,
        useNotification: jest.fn(() => ({
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
            handleSort: jest.fn(),
            searchSuggestions: [],
            setSearchSuggestions: jest.fn(),
        })),
        formattedDate: (date: any) => `formatted-${date}`,
        PAGE_SIZE: 5,
    };
});

const mockUseNotification = require("../useNotification").useNotification;

// Shared baseMock for all tests
const baseMock = {
    filterBtnClicked: false,
    setFilterBtnClicked: jest.fn(),
    currentPage: 1,
    totalPages: 1,
    handlePageChange: jest.fn(),
    setNoResults: jest.fn(),
    handleListCheckboxChange: jest.fn(),
    handleSelectAllChange: jest.fn(),
    handleSelectedCheckboxIds: [],
    handleBulkAction: jest.fn(),
    closeDeleteDialog: jest.fn(),
    confirmDelete: jest.fn(),
    showDeleteToast: false,
    isClearSelectedCheckbox: false,
    selectedCount: 0,
    isNoSelectionMode: false,
    handleFilterChange: jest.fn(),
    handleClearAllFilters: jest.fn(),
    searchTagList: [],
    sortBy: "DateReceived",
    sortDirection: "Desc",
    handleSort: jest.fn(),
    setSearchSuggestions: jest.fn(),
};
describe("NotificationView", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("renders empty state when no data", () => {
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
            handleSort: jest.fn(),
            searchSuggestions: [],
            setSearchSuggestions: jest.fn(),
        });
        render(<NotificationView />);
        expect(screen.getByTestId("notification-layout")).toBeInTheDocument();
    });

    it.skip("renders with table data", () => {
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
            searchSuggestions: [],
            setSearchSuggestions: jest.fn(),
            // Add tableData for coverage
            tableData: [
                {
                    id: "1",
                    status: false,
                    title: "Test Notification",
                    priority: "Tier1",
                    receivedDate: "2024-06-01",
                }
            ],
            totalTableData: 1,
        });
        render(<NotificationView />);
        expect(screen.getByTestId("notification-layout")).toBeInTheDocument();
        // Assert for the notification title in the mock
        // Status mapping
        expect(screen.getByText("Unread")).toBeInTheDocument();
        // Priority mapping
        expect(screen.getByText("High")).toBeInTheDocument();
        // Date formatting
        expect(screen.getByText("formatted-2024-06-01")).toBeInTheDocument();
    });
    it('renders with search suggestions visible', () => {
        mockUseNotification.mockReturnValue({
            ...baseMock,
            totalNotifications: 2,
            searchTerm: 'not',
            isSearching: false,
            noResults: false,
            isDeleteDialogOpen: false,
            isDeleteLoading: false,
            filters: {},
            searchSuggestions: [
                { name: 'not', values: [{ text: 'note', props: { externalId: '1', name: 'note' }, value: <div>note</div> }] }
            ]
        });
        render(<NotificationView />);
        expect(screen.getByTestId('notification-layout')).toBeInTheDocument();
    });

    it.skip('renders with multiple filters applied', () => {
        mockUseNotification.mockReturnValue({
            ...baseMock,
            totalNotifications: 0,
            searchTerm: '',
            isSearching: false,
            noResults: false,
            isDeleteDialogOpen: false,
            isDeleteLoading: false,
            filters: { status: ['Read'], priority: ['High'], startDate: '2024-01-01', endDate: '2024-12-31' },
            searchSuggestions: [],
        });
        render(<NotificationView />);
        expect(
            screen.getByText((content, node) =>
                !!node?.textContent && node.textContent.toLowerCase().includes('no notifications found for selected filters')
            )
        ).toBeInTheDocument();
    });

    it('shows delete dialog in no selection mode', () => {
        mockUseNotification.mockReturnValue({
            ...baseMock,
            totalNotifications: 1,
            searchTerm: '',
            isSearching: false,
            noResults: false,
            isDeleteDialogOpen: true,
            isDeleteLoading: false,
            isNoSelectionMode: true,
            selectedCount: 0,
            tableData: [
                { id: '1', status: false, title: 'Test', priority: 'Tier1', receivedDate: '2024-01-01' }
            ],
            totalTableData: 1,
            filterBtnClicked: false,
            setFilterBtnClicked: jest.fn(),
            currentPage: 1,
            handlePageChange: jest.fn(),
            setNoResults: jest.fn(),
            handleListCheckboxChange: jest.fn(),
            handleSelectAllChange: jest.fn(),
            handleSelectedCheckboxIds: [],
            handleBulkAction: jest.fn(),
            closeDeleteDialog: jest.fn(),
            confirmDelete: jest.fn(),
            showDeleteToast: false,
            isClearSelectedCheckbox: false,
            filters: {},
            handleFilterChange: jest.fn(),
            handleClearAllFilters: jest.fn(),
            searchTagList: [],
            sortBy: "DateReceived",
            sortDirection: "Desc",
            handleSort: jest.fn(),
            setSearchSuggestions: jest.fn(),
            searchSuggestions: [],
        });
        render(<NotificationView />);
        expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it.skip('renders table with multiple notifications', () => {
        mockUseNotification.mockReturnValue({
            ...baseMock,
            totalNotifications: 2,
            totalPages: 1,
            searchTerm: '',
            isSearching: false,
            noResults: false,
            isDeleteDialogOpen: false,
            isDeleteLoading: false,
            filters: {},
            searchSuggestions: [],
            tableData: [
                { id: '1', status: false, title: 'First', priority: 'Tier1', receivedDate: '2024-01-01' },
                { id: '2', status: true, title: 'Second', priority: 'Tier2', receivedDate: '2024-02-01' }
            ],
            totalTableData: 2
        });
        render(<NotificationView />);
        // Use matcher function for robust text matching
        expect(screen.getByText((content, node) => node?.textContent === "First")).toBeInTheDocument();
        expect(screen.getByText((content, node) => node?.textContent === "Second")).toBeInTheDocument();
        expect(screen.getByText((content, node) => node?.textContent === "High")).toBeInTheDocument();
        expect(screen.getByText((content, node) => node?.textContent === "Medium")).toBeInTheDocument();
    });
});


it.skip("handles unknown priority and missing receivedDate", () => {
    const tableData = [
        {
            id: "3",
            status: false,
            title: "Unknown Priority",
            priority: "TierX",
            // receivedDate missing
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
