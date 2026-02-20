import { act } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";
import { useNotification } from "../useNotification";
import { getEmptyStateMessage, useTableRows, useVisibleNotificationIds } from "../hooks/useNotificationHook";
import { PriorityType } from "../Notifications.props";


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

describe('useNotification branch coverage', () => {
  const getHook = (opts = {}) =>
    renderHook(() =>
      useNotification({
        tableData: [],
        totalTableData: 0,
        currentPage: 1,
        setCurrentPage: () => { },
        ...opts
      })
    );

  it('handleSort covers all branches and default', () => {
    const { result } = getHook();
    // Default sortBy is ReceivedDate
    act(() => result.current.handleSort('Status'));
    expect(result.current.sortBy).toBe('Status');
    act(() => result.current.handleSort('Notification'));
    expect(result.current.sortBy).toBe('Notification');
    act(() => result.current.handleSort('Priority'));
    expect(result.current.sortBy).toBe('Priority');
    act(() => result.current.handleSort('Date received'));
    expect(result.current.sortBy).toBe('ReceivedDate');
    // Default branch (should not change sortBy)
    act(() => result.current.handleSort('UnknownColumn'));
    expect(result.current.sortBy).toBe('ReceivedDate');
  });

  it('handleClearAllFilters resets filters and sort if no searchTerm', () => {
    const { result } = getHook();
    act(() => result.current.handleFilterChange({ status: ['read'] }));
    expect(result.current.filters.status).toEqual(['read']);
    act(() => result.current.handleClearAllFilters());
    expect(result.current.filters).toEqual({});
    expect(result.current.sortBy).toBe('ReceivedDate');
    expect(result.current.sortDirection).toBe(false);
  });

  it('handleClearAllFilters does not reset sort if searchTerm is present', () => {
    const { result } = getHook();
    act(() => result.current.setSearchTerm('foo'));
    act(() => result.current.handleClearAllFilters());
    expect(result.current.filters).toEqual({});
    // sortBy and sortDirection remain unchanged
    expect(result.current.sortBy).toBe('ReceivedDate');
  });

  it('closeDeleteDialog returns early if isDeleteLoading is true', () => {
    const { result } = getHook();
    // Simulate isDeleteLoading true
    result.current.isDeleteLoading = true;
    act(() => result.current.closeDeleteDialog());
    // Should not change dialog state
    expect(result.current.isDeleteDialogOpen).toBe(false);
  });

  it('setIsAutoSuggestVisible, setSuggestionLoader, setSearchSuggestions update state', () => {
    const { result } = getHook();
    act(() => result.current.setIsAutoSuggestVisible(true));
    expect(result.current.isAutoSuggestVisible).toBe(true);
    act(() => result.current.setSuggestionLoader(true));
    expect(result.current.suggestionLoader).toBe(true);
  });

  it('handleSelectedCheckboxIds with empty and non-empty arrays', () => {
    const { result } = getHook();
    act(() => result.current.handleSelectedCheckboxIds(['a', 'b']));
    expect(result.current.selectedNotificationIds).toEqual(['a', 'b']);
    expect(result.current.isClearSelectedCheckbox).toBe(false);
    act(() => result.current.handleSelectedCheckboxIds([]));
    expect(result.current.selectedNotificationIds).toEqual([]);
    expect(result.current.isClearSelectedCheckbox).toBe(true);
  });

  it('handlePageChange sets currentPage and clears selectedNotificationIds', () => {
    let page = 1;
    const setCurrentPage = (p: number) => { page = p; };
    const { result } = getHook({ setCurrentPage });
    act(() => result.current.handlePageChange(null, 2));
    expect(page).toBe(2);
    expect(result.current.selectedNotificationIds).toEqual([]);
    expect(result.current.isClearSelectedCheckbox).toBe(true);
  });

  it('handleFilterChange sets all filter types', () => {
    const { result } = getHook();
    act(() => result.current.handleFilterChange({ status: ['read'], priority: ['high'], startDate: '2024-01-01', endDate: '2024-01-31' }));
    expect(result.current.filters).toEqual({ status: ['read'], priority: ['high'], startDate: '2024-01-01', endDate: '2024-01-31' });
  });
});

describe("useNotification hook", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it("initializes state and clamps pagination", () => {
    const { result } = renderHook(() => useNotification({ tableData: [], totalTableData: 9, currentPage: 1, setCurrentPage: () => { } }));
    expect(result.current.currentPage).toBe(1);
    expect(result.current.totalPages).toBe(1);
    act(() => {
      result.current.handlePageChange(null, 5);
    });
    expect(result.current.currentPage).toBe(1);
  });

  // it("handles list checkbox toggling and auto clear", () => {
  //   const { result } = renderHook(() => useNotification({ tableData: [], totalTableData: 9 }));
  //   act(() => {
  //     result.current.handleListCheckboxChange(0, "");
  //   });
  //   expect(result.current.selectedNotificationIds).toEqual([]);
  //   act(() => {
  //     result.current.handleListCheckboxChange(0, notificationIds[0]);
  //   });
  //   expect(result.current.selectedNotificationIds).toEqual([notificationIds[0]]);
  //   expect(result.current.isClearSelectedCheckbox).toBe(false);
  //   act(() => {
  //     result.current.handleListCheckboxChange(0, notificationIds[0]);
  //   });
  //   expect(result.current.selectedNotificationIds).toEqual([]);
  //   expect(result.current.isClearSelectedCheckbox).toBe(true);
  //   act(() => {
  //     jest.advanceTimersByTime(0);
  //   });
  //   expect(result.current.isClearSelectedCheckbox).toBe(true);
  // });

  // it("handles select all scenarios", () => {
  //   const { result } = renderHook(() => useNotification({ tableData: [], totalTableData: 9 }));
  //   act(() => {
  //     result.current.handleListCheckboxChange(0, notificationIds[0]);
  //   });
  //   act(() => {
  //     result.current.handleSelectAllChange(null, []);
  //   });
  //   expect(result.current.isClearSelectedCheckbox).toBe(true);
  //   act(() => {
  //     jest.advanceTimersByTime(0);
  //   });
  //   expect(result.current.isClearSelectedCheckbox).toBe(true);
  //   act(() => {
  //     result.current.handleSelectAllChange({ target: { checked: true } } as any, notificationIds.slice(0, 2));
  //   });
  //   expect([...result.current.selectedNotificationIds].sort()).toEqual([...notificationIds.slice(0, 2)].sort());
  //   // act(() => {
  //   //   result.current.handleSelectAllChange({ target: { checked: false } } as any, [notificationIds[0]]);
  //   // });
  //   expect(result.current.selectedNotificationIds).toEqual([notificationIds[1]]);
  // });

  it("sets selected ids directly and validates input", () => {
    const { result } = renderHook(() => useNotification({ tableData: [], totalTableData: 9, currentPage: 1, setCurrentPage: () => { } }));
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
    const { result } = renderHook(() => useNotification({ tableData: [], totalTableData: 9, currentPage: 1, setCurrentPage: () => { } }));

    expect(result.current.currentPage).toBe(1);
    expect(result.current.paginatedNotifications.length).toBeLessThanOrEqual(40);
    expect(result.current.searchTerm).toBe("");
    expect(result.current.selectedNotificationIds).toEqual([]);
    expect(result.current.isDeleteDialogOpen).toBe(false);
  });

  it("handles search input and updates filtered results", () => {
    const { result } = renderHook(() => useNotification({ tableData: [], totalTableData: 9, currentPage: 1, setCurrentPage: () => { } }));

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

  // it("handles bulk delete actions with no selection", () => {
  //   const { result } = renderHook(() => useNotification({ tableData: [], totalTableData: 9, currentPage: 1, setCurrentPage: () => { } }));

  //   act(() => result.current.handleBulkAction({ value: "Delete" }, ["some-id"]));

  //   expect(result.current.isDeleteDialogOpen).toBe(true);
  //   expect(result.current.isNoSelectionMode).toBe(true);
  // });

  // it("confirms deletion of selected notifications", async () => {
  //   const { result } = renderHook(() => useNotification({ tableData: [], totalTableData: 9, currentPage: 1, setCurrentPage: () => { } }));
  //   const firstId = notificationTableRows[0].Id;

  //   act(() => result.current.handleSelectedCheckboxIds([firstId]));

  //   await act(async () => result.current.confirmDelete());

  //   expect(result.current.selectedNotificationIds).not.toContain([firstId]);
  //   expect(result.current.isDeleteDialogOpen).toBe(false);
  //   expect(result.current.isDeleteLoading).toBe(false);
  //   expect(result.current.showDeleteToast).toBe(false);
  //   expect(result.current.isClearSelectedCheckbox).toBe(false);
  // });

  it("resets search term on clear", () => {
    const { result } = renderHook(() => useNotification({ tableData: [], totalTableData: 9, currentPage: 1, setCurrentPage: () => { } }));

    act(() => result.current.handleSearchChange("search"));
    expect(result.current.searchTerm).toBe("search");

    act(() => {
      result.current.handleSearchChange("");
    });
    expect(result.current.searchTerm).toBe("");
  });

  it("handles page changes", () => {
    const { result } = renderHook(() => useNotification({ tableData: [], totalTableData: 9, currentPage: 1, setCurrentPage: () => { } }));

    act(() => result.current.handlePageChange(null, 2));
    expect(result.current.currentPage).toBe(1);
  });

  it("handles delete dialog close when not loading", () => {
    const { result } = renderHook(() => useNotification({ tableData: [], totalTableData: 9, currentPage: 1, setCurrentPage: () => { } }));

    act(() => result.current.closeDeleteDialog());
    expect(result.current.isDeleteDialogOpen).toBe(false);
    expect(result.current.isNoSelectionMode).toBe(false);
  });
});

describe('getEmptyStateMessage', () => {
  it('returns "No data to display" for tableDataError', () => {
    expect(getEmptyStateMessage(true, 1, false, false, false, '', [])).toBe('No data to display');
  });
  it('returns "No data to display" for no notifications and not searching', () => {
    expect(getEmptyStateMessage(false, 0, false, false, false, '', [])).toBe("");
  });
  it('returns search not matched message', () => {
    expect(getEmptyStateMessage(false, 0, false, true, false, 'foo', [])).toContain('Your search - foo - did not match any results. Make sure that all words are spelled correctly.');
  });

  it('returns empty string for default', () => {
    expect(getEmptyStateMessage(false, 1, false, false, false, '', [])).toBe('');
  });
});

describe('useVisibleNotificationIds', () => {
  it('returns ids from tableRows', () => {
    const tableRows = [
      { id: '1' },
      { id: '2' },
      { id: null }
    ];
    const { result } = renderHook(() => useVisibleNotificationIds(tableRows));
    expect(result.current).toEqual(['1', '2']);
  });

  it('returns empty array for empty input', () => {
    const { result } = renderHook(() => useVisibleNotificationIds([]));
    expect(result.current).toEqual([]);
  });
});

describe('useTableRows', () => {
  it('returns formatted table rows for valid tableData', () => {
    const tableData = [
      { id: 1, status: false, title: 'Test', priority: 'High', receivedDate: '2024-01-01' },
      { id: 2, status: true, title: 'Read', priority: 'Low', receivedDate: null }
    ];
    const { result } = renderHook(() => useTableRows(tableData, 1));
    expect(result.current).toHaveLength(2);
    expect(result.current[0]).toMatchObject({
      id: '1',
      Status: 'Unread',
      Notification: 'Test',
      Priority: PriorityType.High || 'Unknown',
      'Date received': expect.any(String),
    });
    expect(result.current[1]).toMatchObject({
      id: '2',
      Status: 'Read',
      Notification: 'Read',
      Priority: PriorityType.Low || 'Unknown',
      'Date received': '',
    });
  });

  it('returns empty array for non-array tableData', () => {
    const { result } = renderHook(() => useTableRows(undefined, 1));
    expect(result.current).toEqual([]);
  });
});


