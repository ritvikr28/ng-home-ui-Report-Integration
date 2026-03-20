import { act } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";
import { useNotification } from "../useNotification";
import { getEmptyStateMessage, useTableRows, useVisibleNotificationIds } from "../hooks/useNotificationHook";
import { PriorityType } from "../Notifications.props";


function mockBuildNotifications() {
  return [
    { id: "alpha-id", Status: "Unread", Notification: "Alpha notice", Priority: "High", DateReceived: "01 Jan 2024" },
    { Id: "beta-id", Status: "Read", Notification: "Beta notice", Priority: "Low", DateReceived: "02 Jan 2024" },
    { Id: "gamma-id", Status: "Unread", Notification: "Gamma notice", Priority: "Medium", DateReceived: "03 Jan 2024" }
  ];
}

const deterministicNotifications = mockBuildNotifications();

const notificationIds = deterministicNotifications.map((item) => item.id ?? item.Id);

jest.mock("../helper", () => ({
  notificationTableRows: mockBuildNotifications()
}));

describe.skip('useNotification branch coverage', () => {
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
  it('returns noDataToDisplay key for tableDataError', () => {
    expect(getEmptyStateMessage({
      tableDataError: true,
      totalNotifications: 1,
      isSearching: false,
      hasSearch: false,
      hasActiveFilters: false,
      searchTerm: '',
      searchSuggestions: []
    })).toBe('NotificationCenter_T.noDataToDisplay');
  });
  it('returns noDataToDisplay key for no notifications and not searching', () => {
    expect(getEmptyStateMessage({
      tableDataError: false,
      totalNotifications: 0,
      isSearching: false,
      hasSearch: false,
      hasActiveFilters: false,
      searchTerm: '',
      searchSuggestions: []
    })).toBe('NotificationCenter_T.noDataToDisplay');
  });
  it('returns noDataToDisplay key for search with no results', () => {
    expect(getEmptyStateMessage({
      tableDataError: false,
      totalNotifications: 0,
      isSearching: false,
      hasSearch: true,
      hasActiveFilters: false,
      searchTerm: 'foo',
      searchSuggestions: []
    })).toBe('NotificationCenter_T.noDataToDisplay');
  });

  it('returns empty string for default', () => {
    expect(getEmptyStateMessage({
      tableDataError: false,
      totalNotifications: 1,
      isSearching: false,
      hasSearch: false,
      hasActiveFilters: false,
      searchTerm: '',
      searchSuggestions: []
    })).toBe('');
  });

  it('uses the provided t function for translation', () => {
    const mockT = jest.fn((key: string) => `[${key}]`);
    const result = getEmptyStateMessage({
      tableDataError: true,
      totalNotifications: 5,
      isSearching: false,
      hasSearch: false,
      hasActiveFilters: false,
      searchTerm: '',
      searchSuggestions: [],
      t: mockT
    });
    expect(mockT).toHaveBeenCalledWith('NotificationCenter_T.noDataToDisplay');
    expect(result).toBe('[NotificationCenter_T.noDataToDisplay]');
  });

  it('returns noDataToDisplay when tableDataError is a truthy string', () => {
    expect(getEmptyStateMessage({
      tableDataError: 'network error',
      totalNotifications: 5,
      isSearching: false,
      hasSearch: false,
      hasActiveFilters: false,
      searchTerm: '',
      searchSuggestions: []
    })).toBe('NotificationCenter_T.noDataToDisplay');
  });

  it('returns noDataToDisplay when tableDataError is a truthy object', () => {
    expect(getEmptyStateMessage({
      tableDataError: { message: 'err' },
      totalNotifications: 5,
      isSearching: false,
      hasSearch: false,
      hasActiveFilters: false,
      searchTerm: '',
      searchSuggestions: []
    })).toBe('NotificationCenter_T.noDataToDisplay');
  });

  it('returns noDataToDisplay when both totalNotifications is 0 and tableDataError is truthy', () => {
    expect(getEmptyStateMessage({
      tableDataError: true,
      totalNotifications: 0,
      isSearching: false,
      hasSearch: false,
      hasActiveFilters: false,
      searchTerm: '',
      searchSuggestions: []
    })).toBe('NotificationCenter_T.noDataToDisplay');
  });

  it('returns empty string when totalNotifications > 0 and tableDataError is false and isSearching is true', () => {
    expect(getEmptyStateMessage({
      tableDataError: false,
      totalNotifications: 3,
      isSearching: true,
      hasSearch: false,
      hasActiveFilters: false,
      searchTerm: '',
      searchSuggestions: []
    })).toBe('');
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

  it('returns empty array when all ids are falsy', () => {
    const tableRows = [{ id: null }, { id: undefined }, { id: '' }];
    const { result } = renderHook(() => useVisibleNotificationIds(tableRows));
    expect(result.current).toEqual([]);
  });

  it('returns a single-element array for one valid id', () => {
    const { result } = renderHook(() => useVisibleNotificationIds([{ id: 'only-one' }]));
    expect(result.current).toEqual(['only-one']);
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

  it('returns empty array for empty array input', () => {
    const { result } = renderHook(() => useTableRows([], 1));
    expect(result.current).toEqual([]);
  });

  it('returns "Unknown" for unrecognized priority', () => {
    const tableData = [
      { id: 99, status: false, title: 'Unknown Priority Test', priority: 'InvalidPriority', receivedDate: '2024-06-01' }
    ];
    const { result } = renderHook(() => useTableRows(tableData, 1));
    expect(result.current[0].Priority).toBe('Unknown');
  });

  it('doc field contains correct JSON structure for Unread status', () => {
    const tableData = [
      { id: 42, status: false, title: 'DocTest', priority: 'Tier1', receivedDate: null }
    ];
    const { result } = renderHook(() => useTableRows(tableData, 1));
    const doc = JSON.parse(result.current[0].doc);
    expect(doc).toMatchObject({ id: '42', Status: 'Unread', Notification: 'DocTest', title: 'View' });
  });

  it('doc field contains correct JSON structure for Read status', () => {
    const tableData = [
      { id: 7, status: true, title: 'ReadDoc', priority: 'Tier3', receivedDate: null }
    ];
    const { result } = renderHook(() => useTableRows(tableData, 1));
    const doc = JSON.parse(result.current[0].doc);
    expect(doc).toMatchObject({ id: '7', Status: 'Read', Notification: 'ReadDoc', title: 'View' });
  });

  it('maps all three valid priority tiers correctly', () => {
    const tableData = [
      { id: 1, status: false, title: 'T1', priority: 'Tier1', receivedDate: null },
      { id: 2, status: false, title: 'T2', priority: 'Tier2', receivedDate: null },
      { id: 3, status: false, title: 'T3', priority: 'Tier3', receivedDate: null }
    ];
    const { result } = renderHook(() => useTableRows(tableData, 1));
    expect(result.current[0].Priority).toBe('High');
    expect(result.current[1].Priority).toBe('Medium');
    expect(result.current[2].Priority).toBe('Low');
  });
});


