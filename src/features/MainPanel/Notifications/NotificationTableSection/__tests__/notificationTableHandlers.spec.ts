import { handleSearchKeyPressed, handleSearchChangeWithAutoSuggest } from "../notificationTableHandlers";
import { PAGE_SIZE } from "../../useNotification";
import { getNotificationTableData } from "../../../../../shared/services/notification/api";

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
