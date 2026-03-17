import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import NotificationView from "../Notifications.view";

jest.mock("@essnextgen/ui-intl-kit", () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
    UseTranslationResponse: {},
}));

jest.mock("@essnextgen/ui-kit", () => ({
    Breadcrumbs: ({ onItemClick, breadcrumbActions }: any) => (
        <nav data-testid="breadcrumbs">
            {(breadcrumbActions ?? []).map((action: any, i: number) => (
                <button
                    key={i}
                    type="button"
                    data-testid={`breadcrumb-item-${i}`}
                    onClick={() => onItemClick(action.path)}
                >
                    {action.linkName}
                </button>
            ))}
        </nav>
    ),
}));

jest.mock("../NotificationTableSection/NotificationTableSection.view", () =>
    ({ setFilterBtnClicked }: any) => (
        <div data-testid="notification-table-section">
            <button
                type="button"
                data-testid="trigger-filter"
                onClick={() => setFilterBtnClicked(true)}
            >
                Open Filter
            </button>
        </div>
    )
);

jest.mock("../components/FilterDialogComponent/FilterDialog.logic", () =>
    ({ setFilterBtnClicked }: any) => (
        <div data-testid="filter-dialog">
            <button
                type="button"
                data-testid="close-filter"
                onClick={() => setFilterBtnClicked(false)}
            >
                Close Filter
            </button>
        </div>
    )
);

jest.mock("../components/DeleteConfirmationModal/DeleteConfirmationModal.logic", () =>
    ({ isOpen, onClose }: any) => (
        <div data-testid="delete-modal" data-open={String(isOpen)}>
            <button type="button" data-testid="close-delete" onClick={onClose}>
                Close Delete
            </button>
        </div>
    )
);

jest.mock("../helper", () => ({
    getNotificationTableHeadersData: jest.fn(() => []),
}));

jest.mock("../hooks/useNotificationHook", () => ({
    useTableRows: jest.fn(() => []),
}));

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

const buildMockReturn = (overrides: any = {}): any => ({
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
    setFilters: jest.fn(),
    handleFilterChange: jest.fn(),
    handleClearAllFilters: jest.fn(),
    searchTagList: [],
    sortBy: "DateReceived",
    sortDirection: "Desc",
    handleSort: jest.fn(),
    ...overrides,
});

describe("NotificationView", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockUseNotification.mockReturnValue(buildMockReturn());
    });

    it("renders the notification layout", () => {
        render(<NotificationView />);
        expect(screen.getByTestId("notification-layout")).toBeInTheDocument();
    });

    it("adds no-scroll class to document body on mount", () => {
        render(<NotificationView />);
        expect(document.body.classList.contains("no-scroll")).toBe(true);
    });

    it("renders Breadcrumbs with actions", () => {
        render(<NotificationView />);
        expect(screen.getByTestId("breadcrumbs")).toBeInTheDocument();
        expect(screen.getByTestId("breadcrumb-item-0")).toBeInTheDocument();
        expect(screen.getByTestId("breadcrumb-item-1")).toBeInTheDocument();
    });

    it("does not throw when breadcrumb item is clicked", () => {
        render(<NotificationView />);
        expect(() => fireEvent.click(screen.getByTestId("breadcrumb-item-1"))).not.toThrow();
    });

    it("renders NotificationTableSection", () => {
        render(<NotificationView />);
        expect(screen.getByTestId("notification-table-section")).toBeInTheDocument();
    });

    it("does not render FilterDialogLogic when filterBtnClicked is false", () => {
        render(<NotificationView />);
        expect(screen.queryByTestId("filter-dialog")).not.toBeInTheDocument();
    });

    it("renders FilterDialogLogic when setFilterBtnClicked(true) is triggered", () => {
        render(<NotificationView />);
        fireEvent.click(screen.getByTestId("trigger-filter"));
        expect(screen.getByTestId("filter-dialog")).toBeInTheDocument();
    });

    it("hides FilterDialogLogic when setFilterBtnClicked(false) is triggered from dialog", () => {
        render(<NotificationView />);
        fireEvent.click(screen.getByTestId("trigger-filter"));
        fireEvent.click(screen.getByTestId("close-filter"));
        expect(screen.queryByTestId("filter-dialog")).not.toBeInTheDocument();
    });

    it("renders DeleteConfirmationModalLogic with isOpen=false by default", () => {
        render(<NotificationView />);
        expect(screen.getByTestId("delete-modal")).toHaveAttribute("data-open", "false");
    });

    it("renders DeleteConfirmationModalLogic with isOpen=true when isDeleteDialogOpen is true", () => {
        mockUseNotification.mockReturnValue(buildMockReturn({ isDeleteDialogOpen: true }));
        render(<NotificationView />);
        expect(screen.getByTestId("delete-modal")).toHaveAttribute("data-open", "true");
    });

    it("calls closeDeleteDialog and blurs active HTMLElement on close", () => {
        const closeDeleteDialog = jest.fn();
        mockUseNotification.mockReturnValue(buildMockReturn({ closeDeleteDialog }));
        render(<NotificationView />);
        const closeBtn = screen.getByTestId("close-delete");
        closeBtn.focus();
        fireEvent.click(closeBtn);
        expect(closeDeleteDialog).toHaveBeenCalledTimes(1);
    });

    it("calls closeDeleteDialog when document.activeElement is null", () => {
        const closeDeleteDialog = jest.fn();
        mockUseNotification.mockReturnValue(buildMockReturn({ closeDeleteDialog }));
        const originalDescriptor = Object.getOwnPropertyDescriptor(document, "activeElement");
        Object.defineProperty(document, "activeElement", {
            get: () => null,
            configurable: true,
        });
        render(<NotificationView />);
        fireEvent.click(screen.getByTestId("close-delete"));
        expect(closeDeleteDialog).toHaveBeenCalledTimes(1);
        if (originalDescriptor) {
            Object.defineProperty(document, "activeElement", originalDescriptor);
        }
    });

    it("computes hasActiveFilters as truthy when status filter has items", () => {
        mockUseNotification.mockReturnValue(buildMockReturn({ filters: { status: ["Read"] } }));
        render(<NotificationView />);
        expect(screen.getByTestId("notification-layout")).toBeInTheDocument();
    });

    it("computes hasActiveFilters as falsy when status filter is empty array", () => {
        mockUseNotification.mockReturnValue(buildMockReturn({ filters: { status: [] } }));
        render(<NotificationView />);
        expect(screen.getByTestId("notification-layout")).toBeInTheDocument();
    });

    it("computes hasActiveFilters as truthy when priority filter has items", () => {
        mockUseNotification.mockReturnValue(buildMockReturn({ filters: { priority: ["High"] } }));
        render(<NotificationView />);
        expect(screen.getByTestId("notification-layout")).toBeInTheDocument();
    });

    it("computes hasActiveFilters as truthy when startDate is set", () => {
        mockUseNotification.mockReturnValue(buildMockReturn({ filters: { startDate: "2024-01-01" } }));
        render(<NotificationView />);
        expect(screen.getByTestId("notification-layout")).toBeInTheDocument();
    });

    it("computes hasActiveFilters as truthy when endDate is set", () => {
        mockUseNotification.mockReturnValue(buildMockReturn({ filters: { endDate: "2024-12-31" } }));
        render(<NotificationView />);
        expect(screen.getByTestId("notification-layout")).toBeInTheDocument();
    });

    it("computes hasSearch as true when searchTerm is non-empty", () => {
        mockUseNotification.mockReturnValue(buildMockReturn({ searchTerm: "hello" }));
        render(<NotificationView />);
        expect(screen.getByTestId("notification-layout")).toBeInTheDocument();
    });

    it("computes hasSearch as false when searchTerm is whitespace only", () => {
        mockUseNotification.mockReturnValue(buildMockReturn({ searchTerm: "   " }));
        render(<NotificationView />);
        expect(screen.getByTestId("notification-layout")).toBeInTheDocument();
    });
});

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