import { useState, useMemo, useEffect, useRef } from "react";
import { notificationTableRows } from "./helper";

const PAGE_SIZE = 40;
const getNotificationId = (notification: any) => notification?.id ?? notification?.Id;

export const useNotification = () => {
    const [filterBtnClicked, setFilterBtnClicked] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [notifications, setNotifications] = useState(notificationTableRows);
    const [selectedNotificationIds, setSelectedNotificationIds] = useState<string[]>([]);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [pendingDeletionIds, setPendingDeletionIds] = useState<string[]>([]);
    const [isDeleteLoading, setIsDeleteLoading] = useState(false);
    const [showDeleteToast, setShowDeleteToast] = useState(false);
    const [isClearSelectedCheckbox, setIsClearSelectedCheckbox] = useState(false);
    const [isNoSelectionMode, setIsNoSelectionMode] = useState(false);

    const [searchTerm, setSearchTerm] = useState("");
    const [filters, setFilters] = useState<{
        status?: string[];
        priority?: string[];
        startDate?: string;
        endDate?: string;
    }>({});
    const [isSearching, setIsSearching] = useState(false);
    const [noResults, setNoResults] = useState(false);
    const [sortBy, setSortBy] = useState<string>("Date received");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

    const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    const parseDate = (dateStr: string): Date | null => {
        if (!dateStr) return null;
        const months: { [key: string]: number } = {
            "Jan": 0, "Feb": 1, "Mar": 2, "Apr": 3, "May": 4, "Jun": 5,
            "Jul": 6, "Aug": 7, "Sep": 8, "Oct": 9, "Nov": 10, "Dec": 11
        };
        const parts = dateStr.trim().split(" ");
        if (parts.length !== 3) return null;
        const day = parseInt(parts[0], 10);
        const month = months[parts[1]];
        const year = parseInt(parts[2], 10);
        if (Number.isNaN(day) || Number.isNaN(year) || month === undefined) return null;
        return new Date(year, month, day);
    };

    const parseFilterDate = (dateStr: string): Date | null => {
        if (!dateStr) return null;
        const parts = dateStr.split("-");
        if (parts.length !== 3) return null;
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);
        if (Number.isNaN(day) || Number.isNaN(month) || Number.isNaN(year)) return null;
        return new Date(year, month, day);
    };

    const filteredRows = useMemo(() => {
        let rows = notifications;

        if (filters.status && filters.status.length > 0) {
            rows = rows.filter(row => {
                const rowStatus = row.Status?.toLowerCase() || "";
                return filters.status?.some(status => status.toLowerCase() === rowStatus);
            });
        }

        if (filters.priority && filters.priority.length > 0) {
            rows = rows.filter(row => {
                const rowPriority = row.Priority?.toLowerCase() || "";
                return filters.priority?.some(priority => priority.toLowerCase() === rowPriority);
            });
        }

        if (filters.startDate || filters.endDate) {
            const startDate = filters.startDate ? parseFilterDate(filters.startDate) : null;
            const endDate = filters.endDate ? parseFilterDate(filters.endDate) : null;

            rows = rows.filter(row => {
                const rowDate = parseDate(row.DateReceived);
                if (!rowDate) return false;

                if (startDate && endDate) {
                    const rowTime = new Date(rowDate.getFullYear(), rowDate.getMonth(), rowDate.getDate()).getTime();
                    const startTime = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()).getTime();
                    const endTime = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()).getTime();
                    return rowTime >= startTime && rowTime <= endTime;
                }
                if (startDate) {
                    const rowTime = new Date(rowDate.getFullYear(), rowDate.getMonth(), rowDate.getDate()).getTime();
                    const startTime = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()).getTime();
                    return rowTime >= startTime;
                }
                if (endDate) {
                    const rowTime = new Date(rowDate.getFullYear(), rowDate.getMonth(), rowDate.getDate()).getTime();
                    const endTime = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()).getTime();
                    return rowTime <= endTime;
                }

                return true;
            });
        }

        // Apply search (title only)
        if (searchTerm.trim()) {
            rows = rows.filter(row =>
                row.Notification.toLowerCase().includes(searchTerm.trim().toLowerCase())
            );
        }

        if (sortBy && rows.length > 0) {
            rows = [...rows].sort((a, b) => {
                let comparison = 0;

                switch (sortBy) {
                    case "Date received": {
                        const dateA = parseDate(a.DateReceived);
                        const dateB = parseDate(b.DateReceived);
                        if (!dateA && !dateB) return 0;
                        if (!dateA) return 1;
                        if (!dateB) return -1;
                        comparison = dateA.getTime() - dateB.getTime();
                        break;
                    }
                    case "Priority": {
                        const priorityOrder = { "Low": 1, "Medium": 2, "High": 3 };
                        const priorityA = priorityOrder[a.Priority as keyof typeof priorityOrder] || 0;
                        const priorityB = priorityOrder[b.Priority as keyof typeof priorityOrder] || 0;
                        comparison = priorityA - priorityB;
                        break;
                    }
                    case "Status": {
                        const statusA = a.Status?.toLowerCase() || "";
                        const statusB = b.Status?.toLowerCase() || "";
                        comparison = statusA.localeCompare(statusB);
                        break;
                    }
                    default:
                        return 0;
                }

                return sortDirection === "asc" ? comparison : -comparison;
            });
        }

        return rows;
    }, [notifications, searchTerm, filters, sortBy, sortDirection]);

    useEffect(() => {
        setIsSearching(true);
        if (searchTimeout.current) clearTimeout(searchTimeout.current);

        searchTimeout.current = setTimeout(() => {
            setIsSearching(false);
            setNoResults(filteredRows.length === 0);
            setCurrentPage(1);
        }, 300);

        return () => {
            if (searchTimeout.current) clearTimeout(searchTimeout.current);
        };
    }, [searchTerm, filters, filteredRows.length]);

    useEffect(() => {
        if (isClearSelectedCheckbox) {
            const timeout = setTimeout(() => setIsClearSelectedCheckbox(false), 0);
            return () => clearTimeout(timeout);
        }
        return undefined;
    }, [isClearSelectedCheckbox]);

    const totalNotifications = filteredRows.length;
    const totalPages = totalNotifications > 0 ? Math.ceil(totalNotifications / PAGE_SIZE) : 1;

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
        setSelectedNotificationIds((prev) => prev.filter((id) => filteredRows.some((item) => getNotificationId(item) === id)));
    }, [filteredRows]);

    useEffect(() => {
        if (!showDeleteToast) {
            return undefined;
        }
        const timeout = setTimeout(() => setShowDeleteToast(false), 4000);
        return () => clearTimeout(timeout);
    }, [showDeleteToast]);

    const paginatedNotifications = useMemo(() => {
        const startIndex = (currentPage - 1) * PAGE_SIZE;
        const endIndex = startIndex + PAGE_SIZE;
        return filteredRows.slice(startIndex, endIndex);
    }, [filteredRows, currentPage]);

    const handlePageChange = (event: any, page: number) => {
        setCurrentPage(page);
    };

    const handleListCheckboxChange = (_index: number, id: string) => {
        if (!id) {
            return;
        }
        setSelectedNotificationIds((prev) => {
            if (prev.includes(id)) {
                const next = prev.filter((selectedId) => selectedId !== id);
                setIsClearSelectedCheckbox(next.length === 0);
                return next;
            }
            const next = [...prev, id];
            setIsClearSelectedCheckbox(false);
            return next;
        });
    };

    const handleSearchChange = (value: string) => {
        setSearchTerm(value);
    };

    const handleSelectAllChange = (event: any, visibleIds: string[] = []) => {
        const ids = visibleIds.filter(Boolean);
        if (!ids.length) {
            setIsClearSelectedCheckbox(true);
            return;
        }
        const isChecked = Boolean(event?.target?.checked);
        setSelectedNotificationIds((prev) => {
            let next: string[] = [];
            if (isChecked) {
                const merged = new Set([...prev, ...ids]);
                next = Array.from(merged);
            } else {
                next = prev.filter((selectedId) => !ids.includes(selectedId));
            }
            setIsClearSelectedCheckbox(next.length === 0);
            return next;
        });
    };

    const handleSelectedCheckboxIds = (ids: string[]) => {
        if (!Array.isArray(ids)) {
            return;
        }
        setSelectedNotificationIds(ids);
        setIsClearSelectedCheckbox(ids.length === 0);
    };

    const handleBulkAction = (selectedItem: { value?: string } | null, visibleIds: string[] = []) => {
        if (!selectedItem || selectedItem.value !== "Delete") {
            return;
        }
        const idsOnCurrentPage = selectedNotificationIds.filter((id) => visibleIds.includes(id));
        if (!idsOnCurrentPage.length) {
            setIsNoSelectionMode(true);
            setIsDeleteDialogOpen(true);
            return;
        }
        setIsNoSelectionMode(false);
        setPendingDeletionIds(idsOnCurrentPage);
        setIsDeleteDialogOpen(true);
    };

    const closeDeleteDialog = () => {
        if (isDeleteLoading) {
            return;
        }
        setIsDeleteDialogOpen(false);
        setPendingDeletionIds([]);
        setIsNoSelectionMode(false);
    };

    const confirmDelete = async () => {
        if (!pendingDeletionIds.length) {
            setIsDeleteDialogOpen(false);
            return;
        }
        setIsDeleteLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 0));
        setNotifications((prev) => prev.filter((notification) => !pendingDeletionIds.includes(getNotificationId(notification))));
        setSelectedNotificationIds((prev) => prev.filter((id) => !pendingDeletionIds.includes(id)));
        setPendingDeletionIds([]);
        setIsDeleteDialogOpen(false);
        setIsDeleteLoading(false);
        setIsClearSelectedCheckbox(true);
        setShowDeleteToast(true);
    };


    const handleFilterChange = (newFilters: {
        status?: string[];
        priority?: string[];
        startDate?: string;
        endDate?: string;
    }) => {
        setFilters(newFilters);
    };

    const handleRemoveFilter = (filterType: 'status' | 'priority' | 'startDate' | 'endDate', value?: string) => {
        setFilters((prev) => {
            const newFilters = { ...prev };
            if (filterType === 'startDate' || filterType === 'endDate') {
                delete newFilters.startDate;
                delete newFilters.endDate;
            } else if (filterType === 'status' && value) {
                const updatedStatus = prev.status?.filter(s => s.toLowerCase() !== value.toLowerCase()) || [];
                if (updatedStatus.length > 0) {
                    newFilters.status = updatedStatus;
                } else {
                    delete newFilters.status;
                }
            } else if (filterType === 'priority' && value) {
                const updatedPriority = prev.priority?.filter(p => p.toLowerCase() !== value.toLowerCase()) || [];
                if (updatedPriority.length > 0) {
                    newFilters.priority = updatedPriority;
                } else {
                    delete newFilters.priority;
                }
            } else {
                delete newFilters[filterType];
            }
            return newFilters;
        });
    };

    const handleClearAllFilters = () => {
        setFilters({});
        if (!searchTerm.trim()) {
            setSortBy("Date received");
            setSortDirection("desc");
        }
    };

    const handleSort = (columnName: string) => {
        const columnMap: { [key: string]: string } = {
            "Date received": "Date received",
            "Priority": "Priority",
            "Status": "Status"
        };

        const mappedColumn = columnMap[columnName];
        if (!mappedColumn) return;

        if (sortBy === mappedColumn) {
            setSortDirection(prev => prev === "asc" ? "desc" : "asc");
        } else {
            setSortBy(mappedColumn);
            setSortDirection("desc");
        }
    };

    const handleClearSearch = () => {
        setSearchTerm("");
        const hasActiveFilters = (filters.status && filters.status.length > 0) || (filters.priority && filters.priority.length > 0) || filters.startDate || filters.endDate;
        if (!hasActiveFilters) {
            setSortBy("Date received");
            setSortDirection("desc");
        }
    };

    
    const searchTagList = useMemo(() => {
        const tags: Array<{ text: string; categoryName: string; closeObj: { name: string; id: number; value?: string } }> = [];
        
        if (filters.status && filters.status.length > 0) {
            filters.status.forEach((status) => {
                const statusLabel = status.charAt(0).toUpperCase() + status.slice(1);
                tags.push({
                    text: statusLabel,
                    categoryName: 'Status',
                    closeObj: { name: statusLabel, id: 1, value: status }
                });
            });
        }
        
        if (filters.priority && filters.priority.length > 0) {
            filters.priority.forEach((priority) => {
                const priorityLabel = priority.charAt(0).toUpperCase() + priority.slice(1);
                tags.push({
                    text: priorityLabel,
                    categoryName: 'Priority',
                    closeObj: { name: priorityLabel, id: 2, value: priority }
                });
            });
        }
        
        if (filters.startDate || filters.endDate) {
            const startDate = filters.startDate ? parseFilterDate(filters.startDate) : null;
            const endDate = filters.endDate ? parseFilterDate(filters.endDate) : null;
            
            let dateLabel = '';
            if (startDate && endDate) {
                const formatDate = (date: Date) => {
                    const day = date.getDate().toString().padStart(2, '0');
                    const month = (date.getMonth() + 1).toString().padStart(2, '0');
                    const year = date.getFullYear();
                    return `${day}/${month}/${year}`;
                };
                dateLabel = `${formatDate(startDate)} - ${formatDate(endDate)}`;
            } else if (startDate) {
                const formatDate = (date: Date) => {
                    const day = date.getDate().toString().padStart(2, '0');
                    const month = (date.getMonth() + 1).toString().padStart(2, '0');
                    const year = date.getFullYear();
                    return `${day}/${month}/${year}`;
                };
                dateLabel = `From ${formatDate(startDate)}`;
            } else if (endDate) {
                const formatDate = (date: Date) => {
                    const day = date.getDate().toString().padStart(2, '0');
                    const month = (date.getMonth() + 1).toString().padStart(2, '0');
                    const year = date.getFullYear();
                    return `${day}/${month}/${year}`;
                };
                dateLabel = `Until ${formatDate(endDate)}`;
            }
            
            if (dateLabel) {
                tags.push({
                    text: dateLabel,
                    categoryName: 'Date',
                    closeObj: { name: 'Date', id: 3 }
                });
            }
        }
        
        return tags;
    }, [filters]);

    return {
        filterBtnClicked,
        setFilterBtnClicked,
        currentPage,
        totalPages,
        paginatedNotifications,
        totalNotifications,
        handlePageChange,
        searchTerm,
        handleSearchChange,
        handleClearSearch,
        filters,
        handleFilterChange,
        handleRemoveFilter,
        handleClearAllFilters,
        searchTagList,
        isSearching,
        noResults,
        handleListCheckboxChange,
        handleSelectAllChange,
        handleSelectedCheckboxIds,
        handleBulkAction,
        isDeleteDialogOpen,
        closeDeleteDialog,
        confirmDelete,
        isDeleteLoading,
        showDeleteToast,
        isClearSelectedCheckbox,
        selectedCount: pendingDeletionIds.length,
        selectedNotificationIds,
        isNoSelectionMode,
        sortBy,
        sortDirection,
        handleSort
    };
};