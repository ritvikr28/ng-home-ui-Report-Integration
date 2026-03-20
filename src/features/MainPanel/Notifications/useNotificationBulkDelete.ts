import { Dispatch, SetStateAction } from "react";

export function getBulkDeleteIds(selectedIds: string[], visibleIds: string[]): string[] {
    return selectedIds.filter((id) => visibleIds.includes(id));
}

export function useNotificationBulkDelete({ selectedNotificationIds, setIsNoSelectionMode, setIsDeleteDialogOpen, setPendingDeletionIds }: {
    selectedNotificationIds: string[],
    setIsNoSelectionMode: Dispatch<SetStateAction<boolean>>,
    setIsDeleteDialogOpen: Dispatch<SetStateAction<boolean>>,
    setPendingDeletionIds: Dispatch<SetStateAction<string[]>>,
}): (selectedItem: {
    value?: string;
} | null, visibleIds?: string[]) => void {
    return (selectedItem: { value?: string } | null, visibleIds: string[] = []) => {
        if (!selectedItem || selectedItem.value !== "Delete") return;
        const idsOnCurrentPage: string[] = getBulkDeleteIds(selectedNotificationIds, visibleIds);
        if (!idsOnCurrentPage.length) {
            setIsNoSelectionMode(true);
            setIsDeleteDialogOpen(true);
            return;
        }
        setIsNoSelectionMode(false);
        setPendingDeletionIds(idsOnCurrentPage);
        setIsDeleteDialogOpen(true);
    };
}
