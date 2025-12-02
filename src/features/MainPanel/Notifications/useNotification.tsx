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

    const [searchTerm, setSearchTerm] = useState("");
    const [filters, setFilters] = useState<any>({});
    const [isSearching, setIsSearching] = useState(false);
    const [noResults, setNoResults] = useState(false);

    const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    const filteredRows = useMemo(() => {
        let rows = notifications;

        // Apply filters (dummy logic, replace with actual filter logic)
        // if (filters && Object.keys(filters).length > 0) {
        //     // Example: rows = rows.filter(row => row.status === filters.status);
        // }

        // Apply search (title only)
        if (searchTerm.trim()) {
            rows = rows.filter(row =>
                row.Notification.toLowerCase().includes(searchTerm.trim().toLowerCase())
            );
        }

        return rows;
    }, [notifications, searchTerm, filters]);

    useEffect(() => {
        setIsSearching(true);
        if (searchTimeout.current) clearTimeout(searchTimeout.current);

        searchTimeout.current = setTimeout(() => {
            setIsSearching(false);
            setNoResults(filteredRows.length === 0);
            setCurrentPage(1); // Reset to first page on new search/filter
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
            return;
        }
        setPendingDeletionIds(idsOnCurrentPage);
        setIsDeleteDialogOpen(true);
    };

    const closeDeleteDialog = () => {
        if (isDeleteLoading) {
            return;
        }
        setIsDeleteDialogOpen(false);
        setPendingDeletionIds([]);
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

    const handleClearSearch = () => {
        setSearchTerm("");
    };

    // Dummy filter setter for future use
    const handleFilterChange = (newFilters: any) => {
        setFilters(newFilters);
    };

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
        selectedNotificationIds
    };
};