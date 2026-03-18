import { useState, Dispatch, SetStateAction } from "react";
import { UseNotificationSelectionReturn } from "./useNotification.props";

export function useNotificationSelection(setIsClearSelectedCheckbox: Dispatch<SetStateAction<boolean>>): UseNotificationSelectionReturn {
    const [selectedNotificationIds, setSelectedNotificationIds]: [string[], Dispatch<SetStateAction<string[]>>] = useState<string[]>([]);
    const [isClearSelectedCheckboxState, setIsClearSelectedCheckboxState]: [boolean, Dispatch<SetStateAction<boolean>>] = useState<boolean>(false);

    const handleSelectAllChange: (event: any, visibleIds?: string[]) => void = (event: any, visibleIds: string[] = []) => {
        const ids: string[] = visibleIds.filter(Boolean);
        if (!ids.length) {
            setIsClearSelectedCheckbox(true);
            setIsClearSelectedCheckboxState(true);
            return;
        }
        const isChecked = Boolean(event?.target?.checked);
        setSelectedNotificationIds((prev) => {
            let next: string[] = [];
            if (isChecked) {
                const merged: Set<string> = new Set([...prev, ...ids]);
                next = Array.from(merged);
            } else {
                next = prev.filter((selectedId) => !ids.includes(selectedId));
            }
            setIsClearSelectedCheckbox(next.length === 0);
            setIsClearSelectedCheckboxState(next.length === 0);
            return next;
        });
    };

    const handleSelectedCheckboxIds: (ids: string[]) => void = (ids: string[]) => {
        if (!Array.isArray(ids)) {
            return;
        }
        setSelectedNotificationIds(ids);
        setIsClearSelectedCheckbox(ids.length === 0);
        setIsClearSelectedCheckboxState(ids.length === 0);
    };

    const handleListCheckboxChange: (_index: number, id: string) => void = (_index: number, id: string) => {
        if (!id) {
            return;
        }
        setSelectedNotificationIds((prev) => {
            if (prev.includes(id)) {
                const next: string[] = prev.filter((selectedId) => selectedId !== id);
                setIsClearSelectedCheckbox(next.length === 0);
                setIsClearSelectedCheckboxState(next.length === 0);
                return next;
            }
            const next: string[] = [...prev, id];
            setIsClearSelectedCheckbox(false);
            setIsClearSelectedCheckboxState(false);
            return next;
        });
    };

    return {
        selectedNotificationIds,
        setSelectedNotificationIds,
        isClearSelectedCheckboxState,
        handleSelectAllChange,
        handleSelectedCheckboxIds,
        handleListCheckboxChange
    };
}
