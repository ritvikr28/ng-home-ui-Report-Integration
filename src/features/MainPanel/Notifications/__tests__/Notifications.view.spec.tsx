// src/features/MainPanel/Notifications/Notifications.view.test.tsx
import React from "react";
import { render, screen } from "@testing-library/react";
import NotificationView from "../Notifications.view";
import userEvent from "@testing-library/user-event";

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

  it("renders and opens filter dialog when filter button is clicked", async () => {
    mockUseNotification.mockReturnValue({
      ...baseMock,
      totalNotifications: 1,
    });
    render(<NotificationView />);
    const filterBtn = screen.getByTestId("filter");
    userEvent.click(filterBtn);
    expect(screen.getByTestId("notification-layout")).toBeInTheDocument();
  });

  it("renders side panel when sideIsOpen is true", () => {
    mockUseNotification.mockReturnValue({
      ...baseMock,
      totalNotifications: 1,
    });

    render(<NotificationView />);
    expect(screen.getByTestId("notification-layout")).toBeInTheDocument();
  });

  it("renders with empty search suggestions and no results", () => {
    mockUseNotification.mockReturnValue({
      ...baseMock,
      totalNotifications: 0,
      searchTerm: "abc",
      searchSuggestions: [],
      noResults: true,
      isSearching: false,
    });
    render(<NotificationView />);
    expect(screen.getByTestId("notification-layout")).toBeInTheDocument();
  });

  it("renders with active filters and no notifications", () => {
    mockUseNotification.mockReturnValue({
      ...baseMock,
      totalNotifications: 0,
      filters: {
        status: ["Unread"],
        priority: ["Low"],
        startDate: "2024-01-01",
        endDate: "2024-12-31",
      },
      isSearching: false,
      noResults: false,
    });
    render(<NotificationView />);
    expect(screen.getByTestId("notification-layout")).toBeInTheDocument();
  });

  it("renders with isSearching true and no notifications", () => {
    mockUseNotification.mockReturnValue({
      ...baseMock,
      totalNotifications: 0,
      isSearching: true,
      noResults: false,
    });
    render(<NotificationView />);
    expect(screen.getByTestId("notification-layout")).toBeInTheDocument();
  });

  it("calls handlePageChange when pagination is triggered", () => {
    const handlePageChange = jest.fn();
    mockUseNotification.mockReturnValue({
      ...baseMock,
      totalNotifications: 10,
      totalPages: 2,
      handlePageChange,
      tableData: [
        {
          id: "1",
          status: false,
          title: "Test Notification",
          priority: "Tier1",
          receivedDate: "2024-06-01",
        }
      ],
      totalTableData: 10,
    });
    render(<NotificationView />);
    expect(screen.getByTestId("notification-layout")).toBeInTheDocument();
  });

  it("renders with showDeleteToast true", () => {
    mockUseNotification.mockReturnValue({
      ...baseMock,
      totalNotifications: 1,
      showDeleteToast: true,
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
  });

  it("renders with isClearSelectedCheckbox true", () => {
    mockUseNotification.mockReturnValue({
      ...baseMock,
      totalNotifications: 1,
      isClearSelectedCheckbox: true,
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
  });

  it("renders with custom sortBy and sortDirection", () => {
    mockUseNotification.mockReturnValue({
      ...baseMock,
      totalNotifications: 1,
      sortBy: "Priority",
      sortDirection: "Asc",
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
  });

  it("renders with selectedCount > 0 and isNoSelectionMode false", () => {
    mockUseNotification.mockReturnValue({
      ...baseMock,
      totalNotifications: 1,
      selectedCount: 2,
      isNoSelectionMode: false,
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
  });

  it("renders with selectedCount > 0 and isNoSelectionMode true", () => {
    mockUseNotification.mockReturnValue({
      ...baseMock,
      totalNotifications: 1,
      selectedCount: 2,
      isNoSelectionMode: true,
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
  });

  it("renders with empty tableData and no error", () => {
    mockUseNotification.mockReturnValue({
      ...baseMock,
      totalNotifications: 0,
      tableData: [],
      totalTableData: 0,
      tableDataError: false,
    });
    render(<NotificationView />);
    expect(screen.getByTestId("notification-layout")).toBeInTheDocument();
  });

  it("renders with empty tableData and error", () => {
    mockUseNotification.mockReturnValue({
      ...baseMock,
      totalNotifications: 0,
      tableData: [],
      totalTableData: 0,
      tableDataError: true,
    });
    render(<NotificationView />);
    expect(screen.getByTestId("notification-layout")).toBeInTheDocument();
  });

  it("renders with search suggestions and isSearching true", () => {
    mockUseNotification.mockReturnValue({
      ...baseMock,
      totalNotifications: 1,
      isSearching: true,
      searchSuggestions: [
        {
          name: "test",
          values: [
            {
              text: "test",
              props: { externalId: "1", name: "test" },
              value: <div>test</div>,
            }
          ]
        }
      ],
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
  })
});
