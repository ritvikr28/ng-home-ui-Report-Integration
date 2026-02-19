import React, { useState, useMemo, useEffect, Dispatch, SetStateAction } from "react";
import { UseNotificationReturn } from "./useNotification.props";
import { Suggestion } from "./Notifications.props";

export const PAGE_SIZE = 40;

export const formattedDate: (dateStr: string) => string = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });

export const getValues: (data: any[]) => {
    text: string;
    props: {
        externalId: string;
        name: string;
    };
    value: JSX.Element;
}[] = (
    data: any[]
): Array<{
    text: string;
    props: {
        externalId: string;
        name: string;
    };
    value: JSX.Element;
}> => {
        if (!Array.isArray(data) || data.length === 0) return [];
        return data.map((record: any) => ({
            text: record.title ?? '',
            props: {
                externalId: String(record.id ?? ''),
                name: record.title ?? ''
            },
            value: <></>
        }));
    };

export const useNotification: ({ tableData, totalTableData, currentPage, setCurrentPage, setIsTableBodyLoading, setTableData, setTotalTableData, setTableDataError }: {
    tableData: any[];
    totalTableData: number;
    currentPage: number;
    setCurrentPage: Dispatch<SetStateAction<number>>;
    setIsTableBodyLoading?: Dispatch<SetStateAction<boolean>>;
    setTableData?: Dispatch<SetStateAction<any[]>>;
    setTotalTableData?: Dispatch<SetStateAction<number>>;
    setTableDataError?: Dispatch<SetStateAction<any>>;
}) => UseNotificationReturn = ({
    tableData,
    totalTableData,
    currentPage,
    setCurrentPage
}: {
    tableData: any[];
    totalTableData: number;
    currentPage: number;
    setCurrentPage: Dispatch<SetStateAction<number>>;
    setIsTableBodyLoading?: Dispatch<SetStateAction<boolean>>;
    setTableData?: Dispatch<SetStateAction<any[]>>;
    setTotalTableData?: Dispatch<SetStateAction<number>>;
    setTableDataError?: Dispatch<SetStateAction<boolean>>;
}): UseNotificationReturn => {
        const [filterBtnClicked, setFilterBtnClicked]: [
            boolean,
            Dispatch<SetStateAction<boolean>>
        ] = useState<boolean>(false);

        const [notifications]: [
            any[],
            Dispatch<SetStateAction<any[]>>
        ] = useState<any[]>(tableData);
        const [selectedNotificationIds, setSelectedNotificationIds]: [
            string[],
            Dispatch<SetStateAction<string[]>>
        ] = useState<string[]>([]);
        const [isDeleteDialogOpen, setIsDeleteDialogOpen]: [
            boolean,
            Dispatch<SetStateAction<boolean>>
        ] = useState<boolean>(false);
        const [pendingDeletionIds, setPendingDeletionIds]: [
            string[],
            Dispatch<SetStateAction<string[]>>
        ] = useState<string[]>([]);
        const [isDeleteLoading]: [
            boolean,
            Dispatch<SetStateAction<boolean>>
        ] = useState<boolean>(false);
        const [showDeleteToast, setShowDeleteToast]: [
            boolean,
            Dispatch<SetStateAction<boolean>>
        ] = useState<boolean>(false);
        const [isClearSelectedCheckbox, setIsClearSelectedCheckbox]: [
            boolean,
            Dispatch<SetStateAction<boolean>>
        ] = useState<boolean>(false);
        const [isNoSelectionMode, setIsNoSelectionMode]: [
            boolean,
            Dispatch<SetStateAction<boolean>>
        ] = useState<boolean>(false);

        const [searchTerm, setSearchTerm]: [
            string,
            Dispatch<SetStateAction<string>>
        ] = useState<string>("");
        const [filters, setFilters]: [
            {
                status?: string[] | undefined;
                priority?: string[] | undefined;
                startDate?: string | undefined;
                endDate?: string | undefined;
            },
            Dispatch<
                SetStateAction<{
                    status?: string[];
                    priority?: string[];
                    startDate?: string;
                    endDate?: string;
                }>
            >
        ] = useState<{
            status?: string[];
            priority?: string[];
            startDate?: string;
            endDate?: string;
        }>({});
        const [isSearching]: [
            boolean,
            Dispatch<SetStateAction<boolean>>
        ] = useState(false);
        const [noResults, setNoResults]: [
            boolean,
            Dispatch<SetStateAction<boolean>>
        ] = useState(false);
        const [sortBy, setSortBy]: [
            string,
            Dispatch<SetStateAction<string>>
        ] = useState<string>("ReceivedDate");
        const [sortDirection, setSortDirection]: [
            boolean,
            Dispatch<SetStateAction<boolean>>
        ] = useState<boolean>(false);

        const [isAutoSuggestVisible, setIsAutoSuggestVisible]: [boolean, Dispatch<SetStateAction<boolean>>] = React.useState(false);
        const [suggestionLoader, setSuggestionLoader]: [boolean, Dispatch<SetStateAction<boolean>>] = React.useState(false);
        const [searchSuggestions, setSearchSuggestions]: [Suggestion[], Dispatch<SetStateAction<Suggestion[]>>] = useState<Array<Suggestion>>([]);


        const totalNotifications: number = totalTableData;
        const totalOriginalNotifications: any[] = notifications;
        const totalPages: number =
            totalNotifications > 0
                ? Math.ceil(totalNotifications / PAGE_SIZE)
                : 1;

        useEffect(() => {
            if (totalNotifications === 0) {
                setCurrentPage(1);
                return;
            }
            if (currentPage > totalPages) {
                setCurrentPage(totalPages);
            }
        }, [currentPage, totalNotifications, totalPages]);

        useEffect(() => {
            if (!showDeleteToast) {
                return undefined;
            }
            const timeout: ReturnType<typeof setTimeout> = setTimeout(
                () => setShowDeleteToast(false),
                4000
            );
            return () => clearTimeout(timeout);
        }, [showDeleteToast]);

        const paginatedNotifications: any[] = useMemo(() => {
            const startIndex = (currentPage - 1) * PAGE_SIZE;
            const endIndex = startIndex + PAGE_SIZE;
            return tableData && tableData.slice(startIndex, endIndex);
        }, [tableData, currentPage]);

        const handlePageChange: (event: any, page: number) => void = (
            event: any,
            page: number
        ) => {
            setCurrentPage(page);
            setSelectedNotificationIds([]);
            setIsClearSelectedCheckbox(true);
        };

        const handleSearchChange: (value: string) => void = (value: string) => {
            setSearchTerm(value);
        };

        // const handleSelectAllChange: (
        //     event: any,
        //     visibleIds: string[]
        // ) => void = (event: any, visibleIds: string[] = []) => {
        //     const ids: string[] = visibleIds.filter(Boolean);
        //     if (!ids.length) {
        //         setIsClearSelectedCheckbox(true);
        //         return;
        //     }
        //     const isChecked = Boolean(event?.target?.checked);
        //     setSelectedNotificationIds((prev) => {
        //         let next: string[] = [];
        //         if (isChecked) {
        //             const merged: Set<string> = new Set([...prev, ...ids]);
        //             next = Array.from(merged);
        //         } else {
        //             next = prev.filter((selectedId) => !ids.includes(selectedId));
        //         }
        //         setIsClearSelectedCheckbox(next.length === 0);
        //         return next;
        //     });
        // };

        const handleSelectedCheckboxIds: (ids: string[]) => void = (
            ids: string[]
        ) => {
            if (!Array.isArray(ids)) {
                return;
            }
            setSelectedNotificationIds(ids);
            setIsClearSelectedCheckbox(ids.length === 0);
        };

        // const handleBulkAction: (
        //     selectedItem: { value?: string | undefined } | null,
        //     visibleIds?: string[]
        // ) => void = (
        //     selectedItem: { value?: string } | null,
        //     visibleIds: string[] = []
        // ) => {
        //         if (!selectedItem || selectedItem.value !== "Delete") {
        //             return;
        //         }
        //         const idsOnCurrentPage: string[] = selectedNotificationIds.filter((id) =>
        //             visibleIds.includes(id)
        //         );
        //         if (!idsOnCurrentPage.length) {
        //             setIsNoSelectionMode(true);
        //             setIsDeleteDialogOpen(true);
        //             return;
        //         }
        //         setIsNoSelectionMode(false);
        //         setPendingDeletionIds(idsOnCurrentPage);
        //         setIsDeleteDialogOpen(true);
        //     };

        const closeDeleteDialog: () => void = () => {
            if (isDeleteLoading) {
                return;
            }
            setIsDeleteDialogOpen(false);
            setPendingDeletionIds([]);
            setIsNoSelectionMode(false);
        };

        // const confirmDelete: () => Promise<void> = async () => {
        //     if (!pendingDeletionIds.length) {
        //         setIsDeleteDialogOpen(false);
        //         return;
        //     }
        //     setIsDeleteLoading(true);
        //     await new Promise((resolve) => setTimeout(resolve, 0));
        //     setNotifications((prev) =>
        //         prev.filter(
        //             (notification) => !pendingDeletionIds.includes(getNotificationId(notification))
        //         )
        //     );
        //     setSelectedNotificationIds((prev) =>
        //         prev.filter((id) => !pendingDeletionIds.includes(id))
        //     );
        //     setPendingDeletionIds([]);
        //     setIsDeleteDialogOpen(false);
        //     setIsDeleteLoading(false);
        //     setIsClearSelectedCheckbox(true);
        //     setShowDeleteToast(true);
        // };

        const handleFilterChange: (newFilters: {
            status?: string[] | undefined;
            priority?: string[] | undefined;
            startDate?: string | undefined;
            endDate?: string | undefined;
        }) => void = (newFilters: {
            status?: string[];
            priority?: string[];
            startDate?: string;
            endDate?: string;
        }) => {
                setFilters(newFilters);
            };

        // const handleRemoveFilter: (
        //     filterType: "status" | "priority" | "startDate" | "endDate",
        //     value?: string | undefined
        // ) => void = (
        //     filterType: "status" | "priority" | "startDate" | "endDate",
        //     value?: string | undefined
        // ) => {
        //         setFilters((prev) => {
        //             if (filterType === "startDate" || filterType === "endDate") {
        //                 const { startDate, endDate, ...rest }: { startDate?: string; endDate?: string } = prev;
        //                 return rest;
        //             }
        //             if (filterType === "status" && value) {
        //                 return removeStatusFilter(prev, value);
        //             }
        //             if (filterType === "priority" && value) {
        //                 return removePriorityFilter(prev, value);
        //             }
        //             const { [filterType]: _, ...rest }: { [key: string]: any } = prev;
        //             return rest;
        //         });
        //     };

        const handleClearAllFilters: () => void = () => {
            setFilters({});
            if (!searchTerm.trim()) {
                setSortBy("ReceivedDate");
                setSortDirection(false);
            }
        };


        const handleSort: (columnName: string) => void = (columnName: string) => {
            let apiColumnName: string = columnName;
            switch (columnName) {
                case "Status":
                    apiColumnName =
                        "Status";
                    break;
                case "Notification":
                    apiColumnName = "Notification";
                    break;
                case "Priority":
                    apiColumnName = "Priority";
                    break;
                case "Date received":
                    apiColumnName = "ReceivedDate";
                    break;
                default:
                    return;
            }
            if (sortBy === apiColumnName) {
                setSortDirection(prev => !prev);
            } else {
                setSortDirection(false);
            }

            setSortBy(apiColumnName);
        };


        return {
            filterBtnClicked,
            setFilterBtnClicked,
            currentPage,
            setCurrentPage,
            totalPages,
            paginatedNotifications,
            totalNotifications,
            totalOriginalNotifications,
            handlePageChange,
            searchTerm,
            setSearchTerm,
            handleSearchChange,
            // handleClearSearch,
            filters,
            handleFilterChange,
            // handleRemoveFilter,
            handleClearAllFilters,
            // searchTagList,
            isSearching,
            noResults,
            // handleListCheckboxChange,
            // handleSelectAllChange,
            handleSelectedCheckboxIds,
            // handleBulkAction,
            isDeleteDialogOpen,
            closeDeleteDialog,
            // confirmDelete,
            isDeleteLoading,
            showDeleteToast,
            isClearSelectedCheckbox,
            selectedCount: pendingDeletionIds.length,
            selectedNotificationIds,
            isNoSelectionMode,
            sortBy,
            sortDirection,
            handleSort,
            setNoResults,
            // handleSearchChangeWithAutoSuggest,
            // handleSearchKeyPressed,
            isAutoSuggestVisible,
            setIsAutoSuggestVisible,
            suggestionLoader,
            setSuggestionLoader,
            searchSuggestions,
            setSearchSuggestions
        };
    };