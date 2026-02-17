// src/features/MainPanel/Notifications/Notifications.view.test.tsx
import React from "react";
import { render, screen } from "@testing-library/react";
import NotificationView from "../Notifications.view";

jest.mock("../useNotification", () => {
  const actual = jest.requireActual("../useNotification");
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
      filters: {
        status: [],
        priority: [],
        startDate: undefined,
        endDate: undefined,
      },
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

const baseMock = {
  filterBtnClicked: false,
  setFilterBtnClicked: jest.fn(),
  currentPage: 1,
  totalPages: 1,
  handlePageChange: jest.fn(),
  searchTerm: "",
  filters: {
    status: [],
    priority: [],
    startDate: undefined,
    endDate: undefined,
  },
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
  searchSuggestions: [],
};

describe("NotificationView", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders stable when no data", () => {
    mockUseNotification.mockReturnValue({
      ...baseMock,
      totalNotifications: 0,
    });
    render(<NotificationView />);
    expect(screen.getByTestId("notification-layout")).toBeInTheDocument();
  });

  it("renders stable with table data", () => {
    mockUseNotification.mockReturnValue({
      ...baseMock,
      totalNotifications: 1,
      tableData: [
        {
          id: "1",
          status: false,
          title: "Test Notification",
          priority: "Tier1",
          receivedDate: "2024-06-01",
        }
      ],
      totalTableData: 1
    });
    render(<NotificationView />);
    expect(screen.getByTestId("notification-layout")).toBeInTheDocument();
  });

  it("renders stable with search suggestions", () => {
    mockUseNotification.mockReturnValue({
      ...baseMock,
      totalNotifications: 2,
      searchTerm: "not",
      searchSuggestions: [
        {
          name: "not",
          values: [
            {
              text: "note",
              props: { externalId: "1", name: "note" },
              value: <div>note</div>,
            }
          ],
        }
      ],
    });
    render(<NotificationView />);
    expect(screen.getByTestId("notification-layout")).toBeInTheDocument();
  });

  it("renders stable with multiple filters applied", () => {
    mockUseNotification.mockReturnValue({
      ...baseMock,
      totalNotifications: 0,
      filters: {
        status: ["Read"],
        priority: ["High"],
        startDate: "2024-01-01",
        endDate: "2024-12-31",
      },
    });
    render(<NotificationView />);
    expect(screen.getByTestId("notification-layout")).toBeInTheDocument();
  });

  it("shows dialog when isDeleteDialogOpen is true", () => {
    mockUseNotification.mockReturnValue({
      ...baseMock,
      totalNotifications: 1,
      isDeleteDialogOpen: true,
      isDeleteLoading: false,
      isNoSelectionMode: true,
      selectedCount: 0,
      tableData: [
        {
          id: "1",
          status: false,
          title: "Test",
          priority: "Tier1",
          receivedDate: "2024-01-01",
        }
      ],
      totalTableData: 1,
    });
    render(<NotificationView />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("renders stable with multiple notifications", () => {
    mockUseNotification.mockReturnValue({
      ...baseMock,
      totalNotifications: 2,
      totalPages: 1,
      tableData: [
        {
          id: "1",
          status: false,
          title: "First",
          priority: "Tier1",
          receivedDate: "2024-01-01",
        },
        {
          id: "2",
          status: true,
          title: "Second",
          priority: "Tier2",
          receivedDate: "2024-02-01",
        }
      ],
      totalTableData: 2,
    });
    render(<NotificationView />);
    expect(screen.getByTestId("notification-layout")).toBeInTheDocument();
  });

  it("renders stable when tableDataError is true", () => {
    mockUseNotification.mockReturnValue({
      ...baseMock,
      totalNotifications: 0,
      tableDataError: true,
    });
    render(<NotificationView />);
    expect(screen.getByTestId("notification-layout")).toBeInTheDocument();
  });

  it("renders stable when tableData is empty", () => {
    mockUseNotification.mockReturnValue({
      ...baseMock,
      totalNotifications: 0,
    });
    render(<NotificationView />);
    expect(screen.getByTestId("notification-layout")).toBeInTheDocument();
  });
});
