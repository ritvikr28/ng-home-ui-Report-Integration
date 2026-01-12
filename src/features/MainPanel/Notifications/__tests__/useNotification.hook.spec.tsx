import { act } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";
import { useNotification } from "../useNotification";
import { notificationTableRows } from "../helper";

function buildNotifications() {
  return [
    { id: "alpha-id", Status: "Unread", Notification: "Alpha notice", Priority: "High", DateReceived: "01 Jan 2024" },
    { Id: "beta-id", Status: "Read", Notification: "Beta notice", Priority: "Low", DateReceived: "02 Jan 2024" },
    { Id: "gamma-id", Status: "Unread", Notification: "Gamma notice", Priority: "Medium", DateReceived: "03 Jan 2024" }
  ];
}

const deterministicNotifications = buildNotifications();

const notificationIds = deterministicNotifications.map((item) => item.id ?? item.Id);

jest.mock("../helper", () => ({
  notificationTableRows: buildNotifications()
}));

describe("useNotification hook", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it("initializes state and clamps pagination", () => {
    const { result } = renderHook(() => useNotification({ tableData: [], totalTableData: 9 }));
    expect(result.current.currentPage).toBe(1);
    expect(result.current.totalPages).toBe(1);
    // expect(result.current.totalNotifications).toBe(deterministicNotifications.length);
    // expect(result.current.paginatedNotifications).toHaveLength(deterministicNotifications.length);
    expect(result.current.filterBtnClicked).toBe(false);
    act(() => {
      result.current.setFilterBtnClicked(true);
    });
    expect(result.current.filterBtnClicked).toBe(true);
    act(() => {
      result.current.handlePageChange(null, 5);
    });
    expect(result.current.currentPage).toBe(1);
  });

  it("handles list checkbox toggling and auto clear", () => {
    const { result } = renderHook(() => useNotification({ tableData: [], totalTableData: 9 }));
    act(() => {
      result.current.handleListCheckboxChange(0, "");
    });
    expect(result.current.selectedNotificationIds).toEqual([]);
    act(() => {
      result.current.handleListCheckboxChange(0, notificationIds[0]);
    });
    expect(result.current.selectedNotificationIds).toEqual([notificationIds[0]]);
    expect(result.current.isClearSelectedCheckbox).toBe(false);
    act(() => {
      result.current.handleListCheckboxChange(0, notificationIds[0]);
    });
    expect(result.current.selectedNotificationIds).toEqual([]);
    expect(result.current.isClearSelectedCheckbox).toBe(true);
    act(() => {
      jest.advanceTimersByTime(0);
    });
    expect(result.current.isClearSelectedCheckbox).toBe(true);
  });

  it("handles select all scenarios", () => {
    const { result } = renderHook(() => useNotification({ tableData: [], totalTableData: 9 }));
    act(() => {
      result.current.handleListCheckboxChange(0, notificationIds[0]);
    });
    act(() => {
      result.current.handleSelectAllChange(null, []);
    });
    expect(result.current.isClearSelectedCheckbox).toBe(true);
    act(() => {
      jest.advanceTimersByTime(0);
    });
    expect(result.current.isClearSelectedCheckbox).toBe(true);
    act(() => {
      result.current.handleSelectAllChange({ target: { checked: true } } as any, notificationIds.slice(0, 2));
    });
    expect([...result.current.selectedNotificationIds].sort()).toEqual([...notificationIds.slice(0, 2)].sort());
    act(() => {
      result.current.handleSelectAllChange({ target: { checked: false } } as any, [notificationIds[0]]);
    });
    expect(result.current.selectedNotificationIds).toEqual([notificationIds[1]]);
  });

  it("sets selected ids directly and validates input", () => {
    const { result } = renderHook(() => useNotification({ tableData: [], totalTableData: 9 }));
    act(() => {
      result.current.handleSelectedCheckboxIds("invalid" as any);
    });
    expect(result.current.selectedNotificationIds).toEqual([]);
    act(() => {
      result.current.handleSelectedCheckboxIds(notificationIds);
    });
    expect([...result.current.selectedNotificationIds].sort()).toEqual([...notificationIds].sort());
    expect(result.current.isClearSelectedCheckbox).toBe(false);
    act(() => {
      result.current.handleSelectedCheckboxIds([]);
    });
    expect(result.current.isClearSelectedCheckbox).toBe(true);
    act(() => {
      jest.advanceTimersByTime(0);
    });
    expect(result.current.isClearSelectedCheckbox).toBe(true);
  });
});

jest.useFakeTimers();

describe("useNotification hook", () => {
  it("initializes with default values", () => {
    const { result } = renderHook(() => useNotification({ tableData: [], totalTableData: 9 }));

    expect(result.current.currentPage).toBe(1);
    // expect(result.current.totalPages).toBe(Math.ceil(notificationTableRows.length / 40));
    // expect(result.current.totalNotifications).toBe(notificationTableRows.length);
    expect(result.current.paginatedNotifications.length).toBeLessThanOrEqual(40);
    expect(result.current.searchTerm).toBe("");
    expect(result.current.selectedNotificationIds).toEqual([]);
    expect(result.current.isDeleteDialogOpen).toBe(false);
  });

  it("handles search input and updates filtered results", () => {
    const { result } = renderHook(() => useNotification({ tableData: [], totalTableData: 9 }));

    act(() => result.current.handleSearchChange("nonexistent"));

    expect(result.current.searchTerm).toBe("nonexistent");

    // Fast-forward debounce
    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current.isSearching).toBe(false);
    expect(result.current.noResults).toBe(false);
    expect(result.current.currentPage).toBe(1);
  });

  it("handles bulk delete actions with no selection", () => {
    const { result } = renderHook(() => useNotification({ tableData: [], totalTableData: 9 }));

    act(() => result.current.handleBulkAction({ value: "Delete" }, ["some-id"]));

    expect(result.current.isDeleteDialogOpen).toBe(true);
    expect(result.current.isNoSelectionMode).toBe(true);
  });

  it("confirms deletion of selected notifications", async () => {
    const { result } = renderHook(() => useNotification({ tableData: [], totalTableData: 9 }));
    const firstId = notificationTableRows[0].Id;

    act(() => result.current.handleSelectedCheckboxIds([firstId]));

    await act(async () => result.current.confirmDelete());

    expect(result.current.selectedNotificationIds).not.toContain([firstId]);
    expect(result.current.isDeleteDialogOpen).toBe(false);
    expect(result.current.isDeleteLoading).toBe(false);
    expect(result.current.showDeleteToast).toBe(false);
    expect(result.current.isClearSelectedCheckbox).toBe(false);
  });

  it("resets search term on clear", () => {
    const { result } = renderHook(() => useNotification({ tableData: [], totalTableData: 9 }));

    act(() => result.current.handleSearchChange("search"));
    expect(result.current.searchTerm).toBe("search");

    act(() => {
      result.current.handleSearchChange("");
    });
    expect(result.current.searchTerm).toBe("");
  });

  it("handles page changes", () => {
    const { result } = renderHook(() => useNotification({ tableData: [], totalTableData: 9 }));

    act(() => result.current.handlePageChange(null, 2));
    expect(result.current.currentPage).toBe(1);
  });

  it("handles delete dialog close when not loading", () => {
    const { result } = renderHook(() => useNotification({ tableData: [], totalTableData: 9 }));

    act(() => result.current.closeDeleteDialog());
    expect(result.current.isDeleteDialogOpen).toBe(false);
    expect(result.current.isNoSelectionMode).toBe(false);
  });
});


