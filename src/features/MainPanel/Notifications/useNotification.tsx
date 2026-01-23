import { useState, useMemo, useEffect, Dispatch, SetStateAction } from "react";
import { UseNotificationReturn } from "./useNotification.props";

export const PAGE_SIZE = 40;
// const getNotificationId: (notification: any) => any = (notification: any) => notification?.id ?? notification?.Id;

export const formattedDate: (dateStr: string) => string = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });

// const removeStatusFilter: (prev: any, value: string) => any = (
//     prev: {
//         status?: string[];
//         priority?: string[];
//         startDate?: string;
//         endDate?: string;
//     },
//     value: string
// ) => {
//     const updatedStatus = prev.status?.filter(
//         (s) => s.toLowerCase() !== value.toLowerCase()
//     ) || [];
//     if (updatedStatus.length > 0) {
//         return { ...prev, status: updatedStatus };
//     }
//     const { status, ...rest }: { status?: string[]; priority?: string[]; startDate?: string; endDate?: string; } = prev;
//     return rest;
// };

// const removePriorityFilter: (prev: any, value: string) => any = (
//     prev: {
//         status?: string[];
//         priority?: string[];
//         startDate?: string;
//         endDate?: string;
//     },
//     value: string
// ) => {
//     const updatedPriority: string[] = prev.priority?.filter(
//         (p) => p.toLowerCase() !== value.toLowerCase()
//     ) || [];
//     if (updatedPriority.length > 0) {
//         return { ...prev, priority: updatedPriority };
//     }
//     const { priority, ...rest }: { status?: string[]; priority?: string[]; startDate?: string; endDate?: string; } = prev;
//     return rest;
// };

export const useNotification: ({ tableData, totalTableData }: {
    tableData: any[];
    totalTableData: number;
    currentPage: number;
    setCurrentPage: Dispatch<SetStateAction<number>>;
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
        const [sortBy]: [
            string,
            Dispatch<SetStateAction<string>>
        ] = useState<string>("DateReceived");
        const [sortDirection]: [
            string,
            Dispatch<SetStateAction<string>>
        ] = useState<string>("Desc");

        // const parseFilterDate: (dateStr: string) => Date | null = (
        //     dateStr: string
        // ): Date | null => {
        //     if (!dateStr) return null;
        //     const parts: string[] = dateStr.split("-");
        //     if (parts.length !== 3) return null;
        //     const year = parseInt(parts[0], 10);
        //     const month = parseInt(parts[1], 10) - 1;
        //     const day = parseInt(parts[2], 10);
        //     if (Number.isNaN(day) || Number.isNaN(month) || Number.isNaN(year))
        //         return null;
        //     return new Date(year, month, day);
        // };

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
        };

        // const handleListCheckboxChange: (
        //     _index: number,
        //     id: string
        // ) => void = (_index: number, id: string) => {
        //     if (!id) {
        //         return;
        //     }
        //     setSelectedNotificationIds((prev) => {
        //         if (prev.includes(id)) {
        //             const next: string[] = prev.filter((selectedId) => selectedId !== id);
        //             setIsClearSelectedCheckbox(next.length === 0);
        //             return next;
        //         }
        //         const next: string[] = [...prev, id];
        //         setIsClearSelectedCheckbox(false);
        //         return next;
        //     });
        // };

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

        // const handleClearAllFilters: () => void = () => {
        //     setFilters({});
        //     if (!searchTerm.trim()) {
        //         setSortBy("DateReceived");
        //         setSortDirection("Desc");
        //     }
        // };

        // const handleSort: (columnName: string) => void = (columnName: string) => {
        //     let apiColumnName: string = columnName;
        //     switch (columnName) {
        //         case "Date received": {
        //             apiColumnName = "DateReceived";
        //             let newDirection = "Desc";
        //             if (sortBy === "DateReceived") {
        //                 newDirection = sortDirection === "Desc" ? "Asc" : "Desc";
        //             }
        //             setSortBy("DateReceived");
        //             setSortDirection(newDirection);
        //             return;
        //         }
        //         case "Priority":
        //             apiColumnName = "Priority";
        //             break;
        //         case "Status":
        //             apiColumnName = "Status";
        //             break;
        //         default:
        //             return;
        //     }
        //     let newDirectionSelected = "Asc";
        //     if (sortBy === apiColumnName) {
        //         newDirectionSelected = sortDirection === "Desc" ? "Asc" : "Desc";
        //     }

        //     setSortBy(apiColumnName);
        //     setSortDirection(newDirectionSelected);
        // };

        // const searchTagList: {
        //     text: string;
        //     categoryName: string;
        //     closeObj: {
        //         name: string;
        //         id: number;
        //         value?: string | undefined;
        //     };
        // }[] = useMemo(() => {
        //     const tags: Array<{
        //         text: string;
        //         categoryName: string;
        //         closeObj: { name: string; id: number; value?: string };
        //     }> = [];
        //     if (filters.status && filters.status.length > 0) {
        //         filters.status.forEach((status) => {
        //             const statusLabel = status.charAt(0).toUpperCase() + status.slice(1);
        //             tags.push({
        //                 text: statusLabel,
        //                 categoryName: "Status",
        //                 closeObj: { name: statusLabel, id: 1, value: status }
        //             });
        //         });
        //     }

        //     if (filters.priority && filters.priority.length > 0) {
        //         filters.priority.forEach((priority) => {
        //             const priorityLabel =
        //                 priority.charAt(0).toUpperCase() + priority.slice(1);
        //             tags.push({
        //                 text: priorityLabel,
        //                 categoryName: "Priority",
        //                 closeObj: { name: priorityLabel, id: 2, value: priority }
        //             });
        //         });
        //     }

        //     if (filters.startDate || filters.endDate) {
        //         const startDate: Date | null = filters.startDate
        //             ? parseFilterDate(filters.startDate)
        //             : null;
        //         const endDate: Date | null = filters.endDate
        //             ? parseFilterDate(filters.endDate)
        //             : null;

        //         const monthNames = [
        //             "Jan",
        //             "Feb",
        //             "Mar",
        //             "Apr",
        //             "May",
        //             "Jun",
        //             "Jul",
        //             "Aug",
        //             "Sep",
        //             "Oct",
        //             "Nov",
        //             "Dec"
        //         ];

        //         const formatDate: (date: Date) => string = (date: Date) => {
        //             const day: string = date.getDate().toString().padStart(2, "0");
        //             const month: string = monthNames[date.getMonth()];
        //             const year: string = date.getFullYear().toString();
        //             return `${day} ${month} ${year}`;
        //         };

        //         let dateLabel = "";
        //         if (startDate && endDate) {
        //             dateLabel = `${formatDate(startDate)} to ${formatDate(endDate)}`;
        //         } else if (startDate) {
        //             dateLabel = formatDate(startDate);
        //         } else if (endDate) {
        //             dateLabel = formatDate(endDate);
        //         }

        //         if (dateLabel) {
        //             tags.push({
        //                 text: dateLabel,
        //                 categoryName: "Date",
        //                 closeObj: { name: "Date", id: 3 }
        //             });
        //         }
        //     }

        //     return tags;
        // }, [filters]);

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
            handleSearchChange,
            // handleClearSearch,
            filters,
            handleFilterChange,
            // handleRemoveFilter,
            // handleClearAllFilters,
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
            // handleSort,
            setNoResults
        };
    };