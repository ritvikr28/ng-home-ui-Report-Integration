import { useEffect, useMemo } from "react";
import { getNotificationTableData } from "../../../../shared/services/notification/api";
import { formattedDate, PAGE_SIZE } from "../useNotification";
import { NotificationTableRow, PriorityType, TableNotificationProps } from "../Notifications.props";

export function useNotificationTableData(
    currentPage: number,
    sideIsOpen: boolean,
    setTableData: any,
    setTotalTableData: any,
    setNoResults: any,
    setTableDataError: any,
    setIsTableBodyLoading: any
): void {
    useEffect(() => {
        if (!sideIsOpen) {
            setIsTableBodyLoading(true);
            getNotificationTableData(PAGE_SIZE, currentPage)
                .then((data) => {
                    if (!data.error) {
                        setTableData(data.payload);
                        setTotalTableData(data.total);
                        if (data.payload.length === 0) {
                            setNoResults(true);
                        }
                    } else {
                        setNoResults(true);
                        setTableDataError(true);
                        setTableData([]);
                    }
                })
                .finally(() => setIsTableBodyLoading(false));
        }
    }, [currentPage, sideIsOpen]);
}

export function useTableRows(tableData: any, currentPage: number): NotificationTableRow[] {
    return useMemo(
        () =>
            Array.isArray(tableData)
                ? tableData.map((notification: TableNotificationProps) => ({
                    id: `${notification.id}`,
                    Status: notification.status === false ? 'Unread' : 'Read',
                    Notification: notification.title,
                    Priority: PriorityType[notification.priority] || "Unknown",
                    "Date received": notification.receivedDate
                        ? formattedDate(notification.receivedDate)
                        : "",
                    doc: JSON.stringify({
                        id: `${notification.id}`,
                        Status: notification.status === false ? 'Unread' : 'Read',
                        Notification: notification.title,
                        title: "View"
                    })
                }))
                : [],
        [tableData, currentPage]
    );
}

export function useVisibleNotificationIds(tableRows: any[]): string[] {
    return useMemo(() => tableRows.map((notification: any) => notification.id).filter(Boolean), [tableRows]);
}

export function getEmptyStateMessage(
    tableDataError: any,
    totalNotifications: number,
    isSearching: boolean,
    hasSearch: boolean,
    hasActiveFilters: boolean | string,
    searchTerm: string
): string {
    if (tableDataError) {
        return "No data to display";
    }
    if (!totalNotifications && !isSearching) {
        return "No data to display";
    }
    if (tableDataError === true) {
        return "No data to display";
    }
    if (totalNotifications === 0 && !isSearching && hasSearch) {
        return `Your search - ${searchTerm} - did not match any results. Make sure that all words are spelled correctly.`;
    }
    if (totalNotifications === 0 && !isSearching && hasActiveFilters) {
        return "No notifications found for selected filters.";
    }
    return "";
}