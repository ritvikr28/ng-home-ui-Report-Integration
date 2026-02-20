
import { PAGE_SIZE } from "../useNotification";
import { getNotificationTableData } from "../../../../shared/services/notification/api";
import { NotificationResponseTableData, NotificationTableHandlerOptions, serachKeyPressedObjectType } from "./NotificationTableSection.props";


export const handleSearchKeyPressed: (options: NotificationTableHandlerOptions) => Promise<void> = async (options: NotificationTableHandlerOptions) => {
    const {
        inputValue,
        currentPage,
        sortBy,
        sortDirection,
        setIsTableBodyLoading,
        setTableData,
        setTotalTableData,
        setTableDataError,
        setNoResults
    }: serachKeyPressedObjectType = options;

    setIsTableBodyLoading(true);
    try {
        const data: NotificationResponseTableData = await getNotificationTableData({
            PageSize: PAGE_SIZE,
            PageNumber: currentPage,
            SearchTerm: inputValue.toLowerCase(),
            SortBy: sortBy,
            SortDirection: sortDirection
        });
        if (!data.error && Array.isArray(data.payload) && data.total) {
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
};

export const handleSearchChangeWithAutoSuggest: (value: string, setSearchTerm: (v: string) => void, setIsAutoSuggestVisible: (v: boolean) => void) => void = (
    value: string,
    setSearchTerm: (v: string) => void,
    setIsAutoSuggestVisible: (v: boolean) => void
    // handleSearchKeyPressed: (inputValue: string) => void
) => {
    setSearchTerm(value);
    const trimmed: string = value.trim();
    if (trimmed === "") {
        setIsAutoSuggestVisible(false);
        handleSearchKeyPressed({
            inputValue: "",
            currentPage: 1, 
            sortBy: "", 
            sortDirection: true, 
            setIsTableBodyLoading: () => { }, 
            setTableData: () => { }, 
            setTotalTableData: () => { }, 
            setTableDataError: () => { }, 
            setNoResults: () => { } 
        });
        return;
    }
    setIsAutoSuggestVisible(trimmed.length >= 2);
};
