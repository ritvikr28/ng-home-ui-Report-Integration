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

export function getEmptyStateMessage({
    tableDataError,
    totalNotifications,
    isSearching,
    hasActiveFilters,
    searchTerm,
    searchSuggestions,
    t = (key: string) => key
}: {
    tableDataError: any,
    totalNotifications: number,
    isSearching: boolean,
    hasSearch: boolean,
    hasActiveFilters: boolean | string,
    searchTerm: string,
    searchSuggestions: Suggestion[],
    t?: (key: string, options?: any) => string
}): string {
    if (totalNotifications === 0 || tableDataError) {
        return t("NotificationCenter_T.noDataToDisplay");
    }
    if (tableDataError === true) {
        return t("NotificationCenter_T.noDataToDisplay");
    }
    if (totalNotifications === 0 && !isSearching && searchTerm.trim().length > 0 && !searchSuggestions.length) {
        return t("NotificationCenter_T.resultNotFoundMessage", { searchTerm });
    }
    if (totalNotifications === 0 && !isSearching && hasActiveFilters) {
        return t("NotificationCenter_T.noNotificationsFoundForFilters");
    }
    return "";
}