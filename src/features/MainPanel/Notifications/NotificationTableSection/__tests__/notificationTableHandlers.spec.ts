import { act, renderHook } from "@testing-library/react-hooks";
import { handleSearchKeyPressed, handleSearchChangeWithAutoSuggest } from "../notificationTableHandlers";
import { PAGE_SIZE } from "../../useNotification";
import { getNotificationTableData } from "../../../../../shared/services/notification/api";
import { getSearchOnClickClose } from "../notificationTableHandlers.view";
import { SearchTag } from "../NotificationTableSection.props";

import { getBulkDeleteIds, useNotificationBulkDelete } from "../../useNotificationBulkDelete";
import { useNotificationSelection } from "../../useNotificationSelection";

jest.mock("../../../../../shared/services/notification/api");

const mockSetIsTableBodyLoading = jest.fn();
const mockSetTableData = jest.fn();
const mockSetTotalTableData = jest.fn();
const mockSetTableDataError = jest.fn();
const mockSetNoResults = jest.fn();

describe("handleSearchKeyPressed", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should set table data and total when API returns data without error", async () => {
        (getNotificationTableData as jest.Mock).mockResolvedValue({
            error: false,
            payload: [{ id: 1 }],
            total: 10
        });
        await handleSearchKeyPressed({
            inputValue: "Test",
            currentPage: 2,
            sortBy: "date",
            sortDirection: false,
            setIsTableBodyLoading: mockSetIsTableBodyLoading,
            setTableData: mockSetTableData,
            setTotalTableData: mockSetTotalTableData,
            setTableDataError: mockSetTableDataError,
            setNoResults: mockSetNoResults
        });
        expect(mockSetIsTableBodyLoading).toHaveBeenCalledWith(true);
        expect(getNotificationTableData).toHaveBeenCalledWith({
            PageSize: PAGE_SIZE,
            PageNumber: 2,
            SearchTerm: "test",
            SortBy: "date",
            SortDirection: false
        });
        expect(mockSetTableData).toHaveBeenCalledWith([{ id: 1 }]);
        expect(mockSetTotalTableData).toHaveBeenCalledWith(10);
        expect(mockSetTableDataError).toHaveBeenCalledWith(false);
        expect(mockSetNoResults).toHaveBeenCalledWith(false);
        expect(mockSetIsTableBodyLoading).toHaveBeenLastCalledWith(false);
    });

    it("should handle API error and set error states", async () => {
        (getNotificationTableData as jest.Mock).mockResolvedValue({
            error: true,
            payload: [],
            total: 0
        });
        await handleSearchKeyPressed({
            inputValue: "Test",
            currentPage: 1,
            sortBy: "",
            sortDirection: true,
            setIsTableBodyLoading: mockSetIsTableBodyLoading,
            setTableData: mockSetTableData,
            setTotalTableData: mockSetTotalTableData,
            setTableDataError: mockSetTableDataError,
            setNoResults: mockSetNoResults
        });
        expect(mockSetNoResults).toHaveBeenCalledWith(true);
        expect(mockSetTableDataError).toHaveBeenCalledWith(true);
        expect(mockSetTableData).toHaveBeenCalledWith([]);
        expect(mockSetIsTableBodyLoading).toHaveBeenLastCalledWith(false);
    });
});

describe("handleSearchChangeWithAutoSuggest", () => {
    it("should set search term and hide autosuggest if trimmed value is empty", () => {
        const setSearchTerm = jest.fn();
        const setIsAutoSuggestVisible = jest.fn();
        handleSearchChangeWithAutoSuggest("   ", setSearchTerm, setIsAutoSuggestVisible);
        expect(setSearchTerm).toHaveBeenCalledWith("   ");
        expect(setIsAutoSuggestVisible).toHaveBeenCalledWith(false);
    });

    it("should show autosuggest if trimmed value length >= 2", () => {
        const setSearchTerm = jest.fn();
        const setIsAutoSuggestVisible = jest.fn();
        handleSearchChangeWithAutoSuggest("ab", setSearchTerm, setIsAutoSuggestVisible);
        expect(setSearchTerm).toHaveBeenCalledWith("ab");
        expect(setIsAutoSuggestVisible).toHaveBeenCalledWith(true);
    });

    it("should hide autosuggest if trimmed value length < 2 and not empty", () => {
        const setSearchTerm = jest.fn();
        const setIsAutoSuggestVisible = jest.fn();
        handleSearchChangeWithAutoSuggest(" a ", setSearchTerm, setIsAutoSuggestVisible);
        expect(setSearchTerm).toHaveBeenCalledWith(" a ");
        expect(setIsAutoSuggestVisible).toHaveBeenCalledWith(false);
    });
});



describe("getSearchOnClickClose", () => {
    let filters: any;
    let setFilters: jest.Mock;
    let searchTagList: SearchTag;
    beforeEach(() => {
        setFilters = jest.fn();
        filters = {
            status: ["Open", "Closed"],
            priority: ["High", "Low"],
            startDate: "2024-01-01",
            endDate: "2024-01-31"
        };
        searchTagList = [
            { text: "Open", categoryName: "Status", closeObj: { name: "Open", id: 1 } },
            { text: "High", categoryName: "Priority", closeObj: { name: "High", id: 2 } },
            { text: "01 Jan 2024 to 31 Jan 2024", categoryName: "Date", closeObj: { name: "Date", id: 3 } }
        ];
    });

    it("removes status tag and updates filters", () => {
        const closeObj = { name: "Open", id: 1 };
        const handler = getSearchOnClickClose(filters, setFilters, searchTagList);
        handler({} as any, "Open", closeObj);
        expect(setFilters).toHaveBeenCalledWith({
            ...filters,
            status: ["Closed"]
        });
    });

    it("removes priority tag and updates filters", () => {
        const closeObj = { name: "High", id: 2 };
        const handler = getSearchOnClickClose(filters, setFilters, searchTagList);
        handler({} as any, "High", closeObj);
        expect(setFilters).toHaveBeenCalledWith({
            ...filters,
            priority: ["Low"]
        });
    });

    it("removes date tag and updates filters", () => {
        const closeObj = { name: "Date", id: 3 };
        const handler = getSearchOnClickClose(filters, setFilters, searchTagList);
        handler({} as any, "Date", closeObj);
        expect(setFilters).toHaveBeenCalledWith({
            ...filters,
            startDate: undefined,
            endDate: undefined
        });
    });

    it("does nothing if closeObj or filters are missing", () => {
        const handler = getSearchOnClickClose(undefined, setFilters, searchTagList);
        handler({} as any, "Open", null as any);
        expect(setFilters).not.toHaveBeenCalled();
    });
});


describe("getBulkDeleteIds", () => {
    it("returns only ids present in visibleIds", () => {
        const selected = ["a", "b", "c"];
        const visible = ["b", "c", "d"];
        expect(getBulkDeleteIds(selected, visible)).toEqual(["b", "c"]);
    });

    it("returns empty array if no matches", () => {
        expect(getBulkDeleteIds(["x"], ["y"]).length).toBe(0);
    });
});

describe("useNotificationBulkDelete", () => {
    let setIsNoSelectionMode: jest.Mock;
    let setIsDeleteDialogOpen: jest.Mock;
    let setPendingDeletionIds: jest.Mock;

    beforeEach(() => {
        setIsNoSelectionMode = jest.fn();
        setIsDeleteDialogOpen = jest.fn();
        setPendingDeletionIds = jest.fn();
    });

    it("does nothing if selectedItem is null or not Delete", () => {
        const fn = useNotificationBulkDelete({
            selectedNotificationIds: ["1"],
            setIsNoSelectionMode,
            setIsDeleteDialogOpen,
            setPendingDeletionIds
        });
        fn(null, ["1"]);
        fn({ value: "Other" }, ["1"]);
        expect(setIsNoSelectionMode).not.toHaveBeenCalled();
        expect(setIsDeleteDialogOpen).not.toHaveBeenCalled();
        expect(setPendingDeletionIds).not.toHaveBeenCalled();
    });

    it("shows no selection mode if no ids on current page", () => {
        const fn = useNotificationBulkDelete({
            selectedNotificationIds: ["1"],
            setIsNoSelectionMode,
            setIsDeleteDialogOpen,
            setPendingDeletionIds
        });
        fn({ value: "Delete" }, []);
        expect(setIsNoSelectionMode).toHaveBeenCalledWith(true);
        expect(setIsDeleteDialogOpen).toHaveBeenCalledWith(true);
        expect(setPendingDeletionIds).not.toHaveBeenCalled();
    });

    it("sets pending deletion ids and opens dialog if ids exist", () => {
        const fn = useNotificationBulkDelete({
            selectedNotificationIds: ["1", "2"],
            setIsNoSelectionMode,
            setIsDeleteDialogOpen,
            setPendingDeletionIds
        });
        fn({ value: "Delete" }, ["2"]);
        expect(setIsNoSelectionMode).toHaveBeenCalledWith(false);
        expect(setPendingDeletionIds).toHaveBeenCalledWith(["2"]);
        expect(setIsDeleteDialogOpen).toHaveBeenCalledWith(true);
    });
});

describe("useNotificationSelection", () => {
    it("selects all visible ids when checked", () => {
        const setIsClearSelectedCheckbox = jest.fn();
        const { result } = renderHook(() => useNotificationSelection(setIsClearSelectedCheckbox));
        act(() => {
            result.current.handleSelectAllChange({ target: { checked: true } }, ["a", "b"]);
        });
        expect(result.current.selectedNotificationIds).toEqual(["a", "b"]);
        expect(setIsClearSelectedCheckbox).toHaveBeenCalledWith(false);
    });

    it("clears all when unchecked", () => {
        const setIsClearSelectedCheckbox = jest.fn();
        const { result } = renderHook(() => useNotificationSelection(setIsClearSelectedCheckbox));
        act(() => {
            result.current.handleSelectAllChange({ target: { checked: true } }, ["a"]);
            result.current.handleSelectAllChange({ target: { checked: false } }, ["a"]);
        });
        expect(result.current.selectedNotificationIds).toEqual([]);
        expect(setIsClearSelectedCheckbox).toHaveBeenCalledWith(true);
    });

    it("handles handleSelectedCheckboxIds", () => {
        const setIsClearSelectedCheckbox = jest.fn();
        const { result } = renderHook(() => useNotificationSelection(setIsClearSelectedCheckbox));
        act(() => {
            result.current.handleSelectedCheckboxIds(["x", "y"]);
        });
        expect(result.current.selectedNotificationIds).toEqual(["x", "y"]);
        expect(setIsClearSelectedCheckbox).toHaveBeenCalledWith(false);
    });

    it("handles handleListCheckboxChange add/remove", () => {
        const setIsClearSelectedCheckbox = jest.fn();
        const { result } = renderHook(() => useNotificationSelection(setIsClearSelectedCheckbox));
        act(() => {
            result.current.handleListCheckboxChange(0, "id1");
        });
        expect(result.current.selectedNotificationIds).toEqual(["id1"]);
        act(() => {
            result.current.handleListCheckboxChange(0, "id1");
        });
        expect(result.current.selectedNotificationIds).toEqual([]);
    });
});
