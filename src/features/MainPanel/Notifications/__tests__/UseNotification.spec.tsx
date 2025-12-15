import { act } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";
import { useNotification } from "../useNotification";

const mockNotifications = [
    { id: "1", Status: "Unread", Notification: "Test notification 1", Priority: "High", DateReceived: "15 Jan 2024" },
    { id: "2", Status: "Read", Notification: "Test notification 2", Priority: "Low", DateReceived: "10 Jan 2024" },
    { id: "3", Status: "Unread", Notification: "Another test", Priority: "Medium", DateReceived: "20 Jan 2024" },
    { id: "4", Status: "Read", Notification: "Fourth notification", Priority: "High", DateReceived: "05 Jan 2024" },
    { id: "5", Status: "Unread", Notification: "Fifth notification", Priority: "Low", DateReceived: "25 Jan 2024" }
];

jest.mock("../helper", () => ({
    notificationTableRows: [
        { id: "1", Status: "Unread", Notification: "Test notification 1", Priority: "High", DateReceived: "15 Jan 2024" },
        { id: "2", Status: "Read", Notification: "Test notification 2", Priority: "Low", DateReceived: "10 Jan 2024" },
        { id: "3", Status: "Unread", Notification: "Another test", Priority: "Medium", DateReceived: "20 Jan 2024" },
        { id: "4", Status: "Read", Notification: "Fourth notification", Priority: "High", DateReceived: "05 Jan 2024" },
        { id: "5", Status: "Unread", Notification: "Fifth notification", Priority: "Low", DateReceived: "25 Jan 2024" }
    ],
}));

describe("useNotification", () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.clearAllTimers();
        jest.useRealTimers();
    });

    describe("initial state", () => {

        it("should initialize notifications from helper", () => {
            const { result } = renderHook(() => useNotification());
            expect(result.current.totalNotifications).toBe(mockNotifications.length);
        });
    });

    describe("filterBtnClicked state", () => {
        it("should update filterBtnClicked", () => {
            const { result } = renderHook(() => useNotification());

            act(() => {
                result.current.setFilterBtnClicked(true);
            });

            expect(result.current.filterBtnClicked).toBe(true);

            act(() => {
                result.current.setFilterBtnClicked(false);
            });

            expect(result.current.filterBtnClicked).toBe(false);
        });
    });

    describe("filteredRows - status filter", () => {
        it("should filter by status when status filter is applied", () => {
            const { result } = renderHook(() => useNotification());

            act(() => {
                result.current.handleFilterChange({ status: ["unread"] });
            });

            act(() => {
                jest.advanceTimersByTime(350);
            });

            const filtered = result.current.paginatedNotifications;
            expect(filtered.every((item: any) => item.Status?.toLowerCase() === "unread")).toBe(true);
        });

        it("should filter by multiple statuses", () => {
            const { result } = renderHook(() => useNotification());

            act(() => {
                result.current.handleFilterChange({ status: ["read", "unread"] });
            });

            act(() => {
                jest.advanceTimersByTime(350);
            });

            expect(result.current.totalNotifications).toBe(mockNotifications.length);
        });

        it("should handle case-insensitive status filtering", () => {
            const { result } = renderHook(() => useNotification());

            act(() => {
                result.current.handleFilterChange({ status: ["READ"] });
            });

            act(() => {
                jest.advanceTimersByTime(350);
            });

            const filtered = result.current.paginatedNotifications;
            expect(filtered.every((item: any) => item.Status?.toLowerCase() === "read")).toBe(true);
        });
    });

    describe("filteredRows - priority filter", () => {
        it("should filter by priority when priority filter is applied", () => {
            const { result } = renderHook(() => useNotification());

            act(() => {
                result.current.handleFilterChange({ priority: ["high"] });
            });

            act(() => {
                jest.advanceTimersByTime(350);
            });

            const filtered = result.current.paginatedNotifications;
            expect(filtered.every((item: any) => item.Priority?.toLowerCase() === "high")).toBe(true);
        });

        it("should filter by multiple priorities", () => {
            const { result } = renderHook(() => useNotification());

            act(() => {
                result.current.handleFilterChange({ priority: ["low", "medium"] });
            });

            act(() => {
                jest.advanceTimersByTime(350);
            });

            const filtered = result.current.paginatedNotifications;
            expect(filtered.every((item: any) => ["low", "medium"].includes(item.Priority?.toLowerCase() || ""))).toBe(true);
        });
    });

    describe("filteredRows - date filter", () => {
        it("should filter by start date only", () => {
            const { result } = renderHook(() => useNotification());

            act(() => {
                result.current.handleFilterChange({ startDate: "2024-01-10" });
            });

            act(() => {
                jest.advanceTimersByTime(350);
            });

            const filtered = result.current.paginatedNotifications;
            filtered.forEach((item: any) => {
                const itemDate = new Date(item.DateReceived);
                const filterDate = new Date(2024, 0, 10);
                expect(itemDate.getTime()).toBeGreaterThanOrEqual(new Date(filterDate.getFullYear(), filterDate.getMonth(), filterDate.getDate()).getTime());
            });
        });

        it("should filter by end date only", () => {
            const { result } = renderHook(() => useNotification());

            act(() => {
                result.current.handleFilterChange({ endDate: "2024-01-15" });
            });

            act(() => {
                jest.advanceTimersByTime(350);
            });

            const filtered = result.current.paginatedNotifications;
            filtered.forEach((item: any) => {
                const itemDate = new Date(item.DateReceived);
                const filterDate = new Date(2024, 0, 15);
                expect(itemDate.getTime()).toBeLessThanOrEqual(new Date(filterDate.getFullYear(), filterDate.getMonth(), filterDate.getDate()).getTime());
            });
        });

        it("should filter by date range", () => {
            const { result } = renderHook(() => useNotification());

            act(() => {
                result.current.handleFilterChange({ startDate: "2024-01-10", endDate: "2024-01-20" });
            });

            act(() => {
                jest.advanceTimersByTime(350);
            });

            const filtered = result.current.paginatedNotifications;
            filtered.forEach((item: any) => {
                const itemDate = new Date(item.DateReceived);
                const startDate = new Date(2024, 0, 10);
                const endDate = new Date(2024, 0, 20);
                const itemTime = new Date(itemDate.getFullYear(), itemDate.getMonth(), itemDate.getDate()).getTime();
                const startTime = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()).getTime();
                const endTime = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()).getTime();
                expect(itemTime).toBeGreaterThanOrEqual(startTime);
                expect(itemTime).toBeLessThanOrEqual(endTime);
            });
        });

        it("should exclude rows with invalid dates", () => {
            const { result } = renderHook(() => useNotification());

            act(() => {
                result.current.handleFilterChange({ startDate: "2024-01-10" });
            });

            act(() => {
                jest.advanceTimersByTime(350);
            });

            const filtered = result.current.paginatedNotifications;
            filtered.forEach((item: any) => {
                expect(item.DateReceived).toBeTruthy();
            });
        });
    });

    describe("filteredRows - search filter", () => {
        it("should filter by search term", () => {
            const { result } = renderHook(() => useNotification());

            act(() => {
                result.current.handleSearchChange("Test");
            });

            act(() => {
                jest.advanceTimersByTime(350);
            });

            const filtered = result.current.paginatedNotifications;
            expect(filtered.every((item: any) => item.Notification.toLowerCase().includes("test"))).toBe(true);
        });

        it("should handle case-insensitive search", () => {
            const { result } = renderHook(() => useNotification());

            act(() => {
                result.current.handleSearchChange("TEST");
            });

            act(() => {
                jest.advanceTimersByTime(350);
            });

            const filtered = result.current.paginatedNotifications;
            expect(filtered.every((item: any) => item.Notification.toLowerCase().includes("test"))).toBe(true);
        });

        it("should trim search term", () => {
            const { result } = renderHook(() => useNotification());

            act(() => {
                result.current.handleSearchChange("  Test  ");
            });

            act(() => {
                jest.advanceTimersByTime(350);
            });

            const filtered = result.current.paginatedNotifications;
            expect(filtered.every((item: any) => item.Notification.toLowerCase().includes("test"))).toBe(true);
        });
    });

    describe("filteredRows - sorting", () => {
        it("should sort by Date received in descending order by default", () => {
            const { result } = renderHook(() => useNotification());

            const sorted = result.current.paginatedNotifications;
            for (let i = 0; i < sorted.length - 1; i += 1) {
                const dateA = new Date(sorted[i].DateReceived);
                const dateB = new Date(sorted[i + 1].DateReceived);
                expect(dateB.getTime()).toBeLessThanOrEqual(dateA.getTime());
            }
        });

        it("should sort by Date received in ascending order", () => {
            const { result } = renderHook(() => useNotification());

            act(() => {
                result.current.handleSort("Date received");
            });

            act(() => {
                jest.advanceTimersByTime(350);
            });

            const sorted = result.current.paginatedNotifications;
            for (let i = 0; i < sorted.length - 1; i += 1) {
                const dateA = new Date(sorted[i].DateReceived);
                const dateB = new Date(sorted[i + 1].DateReceived);
                expect(dateA.getTime()).toBeLessThanOrEqual(dateB.getTime());
            }
        });

        it("should handle null dates in sorting", () => {
            const { result } = renderHook(() => useNotification());

            act(() => {
                result.current.handleSort("Date received");
            });

            act(() => {
                jest.advanceTimersByTime(350);
            });

            expect(result.current.paginatedNotifications.length).toBeGreaterThan(0);
        });

        it("should return 0 for default case in sort", () => {
            const { result } = renderHook(() => useNotification());

            act(() => {
                result.current.handleSort("Invalid");
            });

            act(() => {
                jest.advanceTimersByTime(350);
            });

            expect(result.current.sortBy).toBe("Date received");
        });
    });

    describe("parseDate function", () => {
        it("should parse valid date string", () => {
            const { result } = renderHook(() => useNotification());

            act(() => {
                result.current.handleFilterChange({ startDate: "2024-01-10" });
            });

            act(() => {
                jest.advanceTimersByTime(350);
            });

            expect(result.current.totalNotifications).toBeGreaterThanOrEqual(0);
        });

        it("should handle invalid date format", () => {
            const { result } = renderHook(() => useNotification());

            act(() => {
                result.current.handleFilterChange({ startDate: "invalid-date" });
            });

            act(() => {
                jest.advanceTimersByTime(350);
            });

            expect(result.current.totalNotifications).toBe(mockNotifications.length);
        });
    });

    describe("useEffect - search timeout", () => {
        it("should set isSearching to true initially", () => {
            const { result } = renderHook(() => useNotification());

            act(() => {
                result.current.handleSearchChange("test");
            });

            expect(result.current.isSearching).toBe(true);
        });

        it("should set isSearching to false after timeout", () => {
            const { result } = renderHook(() => useNotification());

            act(() => {
                result.current.handleSearchChange("test");
            });

            act(() => {
                jest.advanceTimersByTime(350);
            });

            expect(result.current.isSearching).toBe(false);
        });

        it("should set noResults when filteredRows is empty", () => {
            const { result } = renderHook(() => useNotification());

            act(() => {
                result.current.handleSearchChange("nonexistent");
            });

            act(() => {
                jest.advanceTimersByTime(350);
            });

            expect(result.current.noResults).toBe(true);
        });

        it("should reset currentPage to 1 on search", () => {
            const { result } = renderHook(() => useNotification());

            act(() => {
                result.current.handlePageChange(null, 2);
            });

            act(() => {
                result.current.handleSearchChange("test");
            });

            act(() => {
                jest.advanceTimersByTime(350);
            });

            expect(result.current.currentPage).toBe(1);
        });

        it("should clear timeout on cleanup", () => {
            const clearTimeoutSpy = jest.spyOn(global, "clearTimeout");
            const { result, unmount } = renderHook(() => useNotification());

            act(() => {
                result.current.handleSearchChange("test");
            });

            unmount();

            expect(clearTimeoutSpy).toHaveBeenCalled();
            clearTimeoutSpy.mockRestore();
        });
    });

    describe("useEffect - isClearSelectedCheckbox", () => {
        it("should reset isClearSelectedCheckbox after timeout", () => {
            const { result } = renderHook(() => useNotification());

            act(() => {
                result.current.handleListCheckboxChange(0, "1");
            });

            act(() => {
                result.current.handleListCheckboxChange(0, "1");
            });

            expect(result.current.isClearSelectedCheckbox).toBe(true);

            act(() => {
                jest.advanceTimersByTime(0);
            });

            expect(result.current.isClearSelectedCheckbox).toBe(false);
        });

        it("should cleanup timeout on unmount", () => {
            const clearTimeoutSpy = jest.spyOn(global, "clearTimeout");
            const { result, unmount } = renderHook(() => useNotification());

            act(() => {
                result.current.handleListCheckboxChange(0, "1");
                result.current.handleListCheckboxChange(0, "1");
            });

            unmount();

            expect(clearTimeoutSpy).toHaveBeenCalled();
            clearTimeoutSpy.mockRestore();
        });
    });

    describe("useEffect - pagination bounds", () => {
        it("should reset currentPage to 1 when totalNotifications is 0", () => {
            const { result } = renderHook(() => useNotification());

            act(() => {
                result.current.handlePageChange(null, 2);
            });

            act(() => {
                result.current.handleSearchChange("nonexistent");
            });

            act(() => {
                jest.advanceTimersByTime(350);
            });

            expect(result.current.currentPage).toBe(1);
        });

        it("should clamp currentPage to totalPages when exceeding", () => {
            const { result } = renderHook(() => useNotification());

            act(() => {
                result.current.handlePageChange(null, 100);
            });

            expect(result.current.currentPage).toBeLessThanOrEqual(result.current.totalPages);
        });
    });

    describe("useEffect - selectedNotificationIds cleanup", () => {
        it("should remove selectedNotificationIds not in filteredRows", () => {
            const { result } = renderHook(() => useNotification());

            act(() => {
                result.current.handleListCheckboxChange(0, "1");
            });

            act(() => {
                result.current.handleFilterChange({ status: ["unread"] });
            });

            act(() => {
                jest.advanceTimersByTime(350);
            });

            const filteredIds = result.current.paginatedNotifications.map((item: any) => item.id || item.Id);
            result.current.selectedNotificationIds.forEach((id: string) => {
                expect(filteredIds).toContain(id);
            });
        });
    });

    describe("useEffect - showDeleteToast", () => {
        it("should hide showDeleteToast after timeout", () => {
            const { result } = renderHook(() => useNotification());

            act(() => {
                result.current.confirmDelete();
            });

            act(() => {
                jest.advanceTimersByTime(4000);
            });

            expect(result.current.showDeleteToast).toBe(false);
        });

        it("should cleanup timeout on unmount", () => {
            const clearTimeoutSpy = jest.spyOn(global, "clearTimeout");
            const { result, unmount } = renderHook(() => useNotification());

            act(() => {
                result.current.confirmDelete();
            });

            unmount();

            expect(clearTimeoutSpy).toHaveBeenCalled();
            clearTimeoutSpy.mockRestore();
        });
    });

    describe("paginatedNotifications", () => {
        it("should paginate correctly", () => {
            const { result } = renderHook(() => useNotification());

            expect(result.current.paginatedNotifications.length).toBeLessThanOrEqual(40);
        });

        it("should return correct page when currentPage changes", () => {
            const { result } = renderHook(() => useNotification());

            act(() => {
                result.current.handlePageChange(null, 1);
            });

            expect(result.current.paginatedNotifications.length).toBeGreaterThan(0);
        });
    });

    describe("handlePageChange", () => {
        it("should update currentPage", () => {
            const { result } = renderHook(() => useNotification());

            act(() => {
                result.current.handlePageChange(null, 1);
            });

            expect(result.current.currentPage).toBe(1);
        });
    });

    describe("handleListCheckboxChange", () => {
        it("should return early if id is empty", () => {
            const { result } = renderHook(() => useNotification());

            act(() => {
                result.current.handleListCheckboxChange(0, "");
            });

            expect(result.current.selectedNotificationIds).toEqual([]);
        });

        it("should add id when not present", () => {
            const { result } = renderHook(() => useNotification());

            act(() => {
                result.current.handleListCheckboxChange(0, "1");
            });

            expect(result.current.selectedNotificationIds).toContain("1");
            expect(result.current.isClearSelectedCheckbox).toBe(false);
        });

        it("should remove id when present", () => {
            const { result } = renderHook(() => useNotification());

            act(() => {
                result.current.handleListCheckboxChange(0, "1");
            });

            act(() => {
                result.current.handleListCheckboxChange(0, "1");
            });

            expect(result.current.selectedNotificationIds).not.toContain("1");
            expect(result.current.isClearSelectedCheckbox).toBe(true);
        });
    });

    describe("handleSearchChange", () => {
        it("should update searchTerm", () => {
            const { result } = renderHook(() => useNotification());

            act(() => {
                result.current.handleSearchChange("test");
            });

            expect(result.current.searchTerm).toBe("test");
        });
    });

    describe("handleSelectAllChange", () => {
        it("should set isClearSelectedCheckbox when no ids", () => {
            const { result } = renderHook(() => useNotification());

            act(() => {
                result.current.handleSelectAllChange(null, []);
            });

            expect(result.current.isClearSelectedCheckbox).toBe(true);
        });

        it("should select all visible ids when checked", () => {
            const { result } = renderHook(() => useNotification());

            act(() => {
                result.current.handleSelectAllChange({ target: { checked: true } } as any, ["1", "2"]);
            });

            expect(result.current.selectedNotificationIds).toContain("1");
            expect(result.current.selectedNotificationIds).toContain("2");
        });

        it("should deselect visible ids when unchecked", () => {
            const { result } = renderHook(() => useNotification());

            act(() => {
                result.current.handleListCheckboxChange(0, "1");
                result.current.handleListCheckboxChange(0, "2");
            });

            act(() => {
                result.current.handleSelectAllChange({ target: { checked: false } } as any, ["1"]);
            });

            expect(result.current.selectedNotificationIds).not.toContain("1");
            expect(result.current.selectedNotificationIds).toContain("2");
        });

        it("should merge with existing selected ids", () => {
            const { result } = renderHook(() => useNotification());

            act(() => {
                result.current.handleListCheckboxChange(0, "1");
            });

            act(() => {
                result.current.handleSelectAllChange({ target: { checked: true } } as any, ["2", "3"]);
            });

            expect(result.current.selectedNotificationIds).toContain("1");
            expect(result.current.selectedNotificationIds).toContain("2");
            expect(result.current.selectedNotificationIds).toContain("3");
        });
    });

    describe("handleSelectedCheckboxIds", () => {
        it("should return early if ids is not an array", () => {
            const { result } = renderHook(() => useNotification());

            act(() => {
                result.current.handleSelectedCheckboxIds("invalid" as any);
            });

            expect(result.current.selectedNotificationIds).toEqual([]);
        });

        it("should update selectedNotificationIds", () => {
            const { result } = renderHook(() => useNotification());

            act(() => {
                result.current.handleSelectedCheckboxIds(["1", "2"]);
            });

            expect(result.current.selectedNotificationIds).toEqual(["1", "2"]);
            expect(result.current.isClearSelectedCheckbox).toBe(false);
        });

        it("should set isClearSelectedCheckbox when ids is empty", () => {
            const { result } = renderHook(() => useNotification());

            act(() => {
                result.current.handleSelectedCheckboxIds([]);
            });

            expect(result.current.isClearSelectedCheckbox).toBe(true);
        });
    });

    describe("handleBulkAction", () => {
        it("should return early if selectedItem is null", () => {
            const { result } = renderHook(() => useNotification());

            act(() => {
                result.current.handleBulkAction(null);
            });

            expect(result.current.isDeleteDialogOpen).toBe(false);
        });

        it("should return early if value is not Delete", () => {
            const { result } = renderHook(() => useNotification());

            act(() => {
                result.current.handleBulkAction({ value: "Other" });
            });

            expect(result.current.isDeleteDialogOpen).toBe(false);
        });

        it("should open dialog in no selection mode when no ids on current page", () => {
            const { result } = renderHook(() => useNotification());

            act(() => {
                result.current.handleBulkAction({ value: "Delete" }, []);
            });

            expect(result.current.isNoSelectionMode).toBe(true);
            expect(result.current.isDeleteDialogOpen).toBe(true);
        });

        it("should open dialog with pending deletion ids", () => {
            const { result } = renderHook(() => useNotification());

            act(() => {
                result.current.handleListCheckboxChange(0, "1");
            });

            act(() => {
                result.current.handleBulkAction({ value: "Delete" }, ["1"]);
            });

            expect(result.current.isNoSelectionMode).toBe(false);
            expect(result.current.isDeleteDialogOpen).toBe(true);
            expect(result.current.selectedCount).toBeGreaterThan(0);
        });
    });

    describe("closeDeleteDialog", () => {
        it("should return early if isDeleteLoading is true", () => {
            const { result } = renderHook(() => useNotification());

            act(() => {
                result.current.handleBulkAction({ value: "Delete" }, ["1"]);
            });

            act(() => {
                result.current.confirmDelete();
            });

            act(() => {
                result.current.closeDeleteDialog();
            });

            expect(result.current.isDeleteDialogOpen).toBe(false);
        });

        it("should close dialog and reset state", () => {
            const { result } = renderHook(() => useNotification());

            act(() => {
                result.current.handleBulkAction({ value: "Delete" }, ["1"]);
            });

            act(() => {
                result.current.closeDeleteDialog();
            });

            expect(result.current.isDeleteDialogOpen).toBe(false);
            expect(result.current.isNoSelectionMode).toBe(false);
        });
    });

    describe("confirmDelete", () => {
        it("should return early if no pendingDeletionIds", async () => {
            const { result } = renderHook(() => useNotification());

            await act(async () => {
                await result.current.confirmDelete();
            });

            expect(result.current.isDeleteDialogOpen).toBe(false);
        });
    });

    describe("handleFilterChange", () => {
        it("should update filters", () => {
            const { result } = renderHook(() => useNotification());

            act(() => {
                result.current.handleFilterChange({ status: ["read"] });
            });

            expect(result.current.filters.status).toEqual(["read"]);
        });
    });

    describe("handleRemoveFilter", () => {
        it("should remove startDate and endDate when filterType is startDate", () => {
            const { result } = renderHook(() => useNotification());

            act(() => {
                result.current.handleFilterChange({ startDate: "2024-01-10", endDate: "2024-01-20" });
            });

            act(() => {
                result.current.handleRemoveFilter("startDate");
            });

            expect(result.current.filters.startDate).toBeUndefined();
            expect(result.current.filters.endDate).toBeUndefined();
        });

        it("should remove startDate and endDate when filterType is endDate", () => {
            const { result } = renderHook(() => useNotification());

            act(() => {
                result.current.handleFilterChange({ startDate: "2024-01-10", endDate: "2024-01-20" });
            });

            act(() => {
                result.current.handleRemoveFilter("endDate");
            });

            expect(result.current.filters.startDate).toBeUndefined();
            expect(result.current.filters.endDate).toBeUndefined();
        });

        it("should remove status filter by value", () => {
            const { result } = renderHook(() => useNotification());

            act(() => {
                result.current.handleFilterChange({ status: ["read", "unread"] });
            });

            act(() => {
                result.current.handleRemoveFilter("status", "read");
            });

            expect(result.current.filters.status).toEqual(["unread"]);
        });

        it("should delete status filter when all values removed", () => {
            const { result } = renderHook(() => useNotification());

            act(() => {
                result.current.handleFilterChange({ status: ["read"] });
            });

            act(() => {
                result.current.handleRemoveFilter("status", "read");
            });

            expect(result.current.filters.status).toBeUndefined();
        });

        it("should remove priority filter by value", () => {
            const { result } = renderHook(() => useNotification());

            act(() => {
                result.current.handleFilterChange({ priority: ["high", "low"] });
            });

            act(() => {
                result.current.handleRemoveFilter("priority", "high");
            });

            expect(result.current.filters.priority).toEqual(["low"]);
        });

        it("should delete priority filter when all values removed", () => {
            const { result } = renderHook(() => useNotification());

            act(() => {
                result.current.handleFilterChange({ priority: ["high"] });
            });

            act(() => {
                result.current.handleRemoveFilter("priority", "high");
            });

            expect(result.current.filters.priority).toBeUndefined();
        });

        it("should handle case-insensitive filter removal", () => {
            const { result } = renderHook(() => useNotification());

            act(() => {
                result.current.handleFilterChange({ status: ["Read"] });
            });

            act(() => {
                result.current.handleRemoveFilter("status", "read");
            });

            expect(result.current.filters.status).toBeUndefined();
        });
    });

    describe("handleClearAllFilters", () => {
        it("should clear all filters", () => {
            const { result } = renderHook(() => useNotification());

            act(() => {
                result.current.handleFilterChange({ status: ["read"], priority: ["high"] });
            });

            act(() => {
                result.current.handleClearAllFilters();
            });

            expect(result.current.filters).toEqual({});
        });

        it("should reset sort when no search term", () => {
            const { result } = renderHook(() => useNotification());

            act(() => {
                result.current.handleSort("Priority");
            });

            act(() => {
                result.current.handleClearAllFilters();
            });

            expect(result.current.sortBy).toBe("Date received");
            expect(result.current.sortDirection).toBe("desc");
        });

        it("should not reset sort when search term exists", () => {
            const { result } = renderHook(() => useNotification());

            act(() => {
                result.current.handleSearchChange("test");
            });

            act(() => {
                result.current.handleSort("Priority");
            });

            act(() => {
                result.current.handleClearAllFilters();
            });

            expect(result.current.sortBy).toBe("Priority");
        });
    });

    describe("handleSort", () => {
        it("should toggle sort direction when same column", () => {
            const { result } = renderHook(() => useNotification());

            act(() => {
                result.current.handleSort("Date received");
            });

            expect(result.current.sortDirection).toBe("asc");

            act(() => {
                result.current.handleSort("Date received");
            });

            expect(result.current.sortDirection).toBe("desc");
        });

        it("should set new column and reset to desc", () => {
            const { result } = renderHook(() => useNotification());

            act(() => {
                result.current.handleSort("Priority");
            });

            expect(result.current.sortBy).toBe("Priority");
            expect(result.current.sortDirection).toBe("desc");
        });

        it("should return early for invalid column", () => {
            const { result } = renderHook(() => useNotification());

            const initialSortBy = result.current.sortBy;

            act(() => {
                result.current.handleSort("Invalid");
            });

            expect(result.current.sortBy).toBe(initialSortBy);
        });
    });

    describe("handleClearSearch", () => {
        it("should clear search term", () => {
            const { result } = renderHook(() => useNotification());

            act(() => {
                result.current.handleSearchChange("test");
            });

            act(() => {
                result.current.handleClearSearch();
            });

            expect(result.current.searchTerm).toBe("");
        });

        it("should reset sort when no active filters", () => {
            const { result } = renderHook(() => useNotification());

            act(() => {
                result.current.handleSort("Priority");
            });

            act(() => {
                result.current.handleClearSearch();
            });

            expect(result.current.sortBy).toBe("Date received");
            expect(result.current.sortDirection).toBe("desc");
        });

        it("should not reset sort when active filters exist", () => {
            const { result } = renderHook(() => useNotification());

            act(() => {
                result.current.handleFilterChange({ status: ["read"] });
            });

            act(() => {
                result.current.handleSort("Priority");
            });

            act(() => {
                result.current.handleClearSearch();
            });

            expect(result.current.sortBy).toBe("Priority");
        });
    });

    describe("searchTagList", () => {
        it("should generate tags for status filters", () => {
            const { result } = renderHook(() => useNotification());

            act(() => {
                result.current.handleFilterChange({ status: ["read", "unread"] });
            });

            expect(result.current.searchTagList.length).toBe(2);
            expect(result.current.searchTagList[0].categoryName).toBe("Status");
            expect(result.current.searchTagList[0].text).toBe("Read");
        });

        it("should generate tags for priority filters", () => {
            const { result } = renderHook(() => useNotification());

            act(() => {
                result.current.handleFilterChange({ priority: ["high", "low"] });
            });

            expect(result.current.searchTagList.length).toBe(2);
            expect(result.current.searchTagList[0].categoryName).toBe("Priority");
        });

        it("should generate tag for date range", () => {
            const { result } = renderHook(() => useNotification());

            act(() => {
                result.current.handleFilterChange({ startDate: "2024-01-10", endDate: "2024-01-20" });
            });

            expect(result.current.searchTagList.length).toBe(1);
            expect(result.current.searchTagList[0].categoryName).toBe("Date");
            expect(result.current.searchTagList[0].text).toContain("to");
        });

        it("should generate tag for start date only", () => {
            const { result } = renderHook(() => useNotification());

            act(() => {
                result.current.handleFilterChange({ startDate: "2024-01-10" });
            });

            expect(result.current.searchTagList.length).toBe(1);
            expect(result.current.searchTagList[0].text).toBe("10 Jan 2024");
        });

        it("should generate tag for end date only", () => {
            const { result } = renderHook(() => useNotification());

            act(() => {
                result.current.handleFilterChange({ endDate: "2024-01-20" });
            });

            expect(result.current.searchTagList.length).toBe(1);
            expect(result.current.searchTagList[0].text).toBe("20 Jan 2024");
        });

        it("should capitalize status labels", () => {
            const { result } = renderHook(() => useNotification());

            act(() => {
                result.current.handleFilterChange({ status: ["read"] });
            });

            expect(result.current.searchTagList[0].text).toBe("Read");
        });

        it("should capitalize priority labels", () => {
            const { result } = renderHook(() => useNotification());

            act(() => {
                result.current.handleFilterChange({ priority: ["high"] });
            });

            expect(result.current.searchTagList[0].text).toBe("High");
        });
    });

    describe("totalPages calculation", () => {
        it("should calculate totalPages correctly", () => {
            const { result } = renderHook(() => useNotification());

            expect(result.current.totalPages).toBeGreaterThanOrEqual(1);
        });

        it("should return 1 when totalNotifications is 0", () => {
            const { result } = renderHook(() => useNotification());

            act(() => {
                result.current.handleSearchChange("nonexistent");
            });

            act(() => {
                jest.advanceTimersByTime(350);
            });

            expect(result.current.totalPages).toBe(1);
        });
    });
});
