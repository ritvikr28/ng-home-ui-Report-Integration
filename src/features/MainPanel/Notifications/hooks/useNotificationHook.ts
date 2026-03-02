import { useMemo } from "react";
import { Suggestion } from "@essnextgen/ui-kit";
import { formattedDate } from "../useNotification";
import { NotificationTableRow, PriorityType, TableNotificationProps } from "../Notifications.props";

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
    searchTerm: string,
    searchSuggestions: Suggestion[]
): string {
    if (totalNotifications === 0 || tableDataError) {
        return "No data to display";
    }
    if (tableDataError === true) {
        return "No data to display";
    }
    if (totalNotifications === 0 && !isSearching && searchTerm.trim().length > 0 && !searchSuggestions.length) {
        return `Your search - ${searchTerm} - did not match any results. Make sure that all words are spelled correctly.`;
    }
    if (totalNotifications === 0 && !isSearching && hasActiveFilters) {
        return "No notifications found for selected filters.";
    }
    return "";
}