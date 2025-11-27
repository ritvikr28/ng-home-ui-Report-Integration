import { useEffect, useMemo, useState } from "react";
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

    useEffect(() => {
        if (isClearSelectedCheckbox) {
            const timeout = setTimeout(() => setIsClearSelectedCheckbox(false), 0);
            return () => clearTimeout(timeout);
        }
        return undefined;
    }, [isClearSelectedCheckbox]);

    const totalNotifications = notifications.length;
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
        setSelectedNotificationIds((prev) => prev.filter((id) => notifications.some((item) => getNotificationId(item) === id)));
    }, [notifications]);

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
        return notifications.slice(startIndex, endIndex);
    }, [currentPage, notifications]);

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

    return {
        filterBtnClicked,
        setFilterBtnClicked,
        currentPage,
        totalPages,
        paginatedNotifications,
        totalNotifications,
        handlePageChange,
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