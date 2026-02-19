import { getValues, PAGE_SIZE } from "../useNotification";
import { getNotificationTableData, getSearchAutoSuggestData } from "../../../../shared/services/notification/api";
import { AutoSuggestReturnResponse, NotificationResponseTableData } from "./NotificationTableSection.props";

export function shouldFetchTableData({ sideIsOpen, hasSearch, searchCleared }: { sideIsOpen: boolean; hasSearch: boolean; searchCleared: boolean }): boolean {
    return !sideIsOpen || hasSearch || searchCleared;
}

export function isShowdynamictableNoMsg({
    totalNotifications,
    noResults,
    isSearching,
    tableDataError
}: {
    totalNotifications: number;
    noResults: boolean;
    isSearching: boolean;
    tableDataError: boolean;
}): boolean {
    return (totalNotifications === 0 || !noResults) || !isSearching || tableDataError;
}

export async function fetchSearchAutoSuggestData({
    searchTerm,
    setSuggestionLoader,
    setSearchSuggestions
}: {
    searchTerm: string;
    setSuggestionLoader: (v: boolean) => void;
    setSearchSuggestions: (v: any) => void;
}): Promise<void> {
    setSuggestionLoader(true);
    const data: AutoSuggestReturnResponse = await getSearchAutoSuggestData({ SearchTerm: searchTerm.toLowerCase() });
    let suggestionList: any[] = [];
    if (Array.isArray(data?.payload) && data.payload.length) {
        suggestionList = [
            {
                name: "",
                values: getValues(data.payload)
            }
        ];
    }
    setSuggestionLoader(false);
    setSearchSuggestions(suggestionList);
}

export async function fetchNotificationTableData({
    currentPage,
    searchTerm,
    sortBy,
    sortDirection,
    setIsTableBodyLoading,
    setTableData,
    setTotalTableData,
    setTableDataError,
    setNoResults
}: {
    currentPage: number;
    searchTerm: string;
    sortBy: string;
    sortDirection: boolean | undefined;
    setIsTableBodyLoading: (v: boolean) => void;
    setTableData: (v: any[]) => void;
    setTotalTableData: (v: number) => void;
    setTableDataError: (v: boolean) => void;
    setNoResults: (v: boolean) => void;
}): Promise<void> {
    setIsTableBodyLoading(true);
    try {
        const data: NotificationResponseTableData = await getNotificationTableData({
            PageSize: PAGE_SIZE,
            PageNumber: currentPage,
            SearchTerm: searchTerm.toLowerCase(),
            SortBy: sortBy,
            SortDirection: sortDirection
        });
        if (!data.error) {
            setTableData(data.payload);
            setTotalTableData(data.total);
            setTableDataError(false);
            setNoResults(data.payload.length === 0);
        } else {
            setNoResults(true);
            setTableDataError(true);
            setTableData([]);
        }
    } finally {
        setIsTableBodyLoading(false);
    }
}
