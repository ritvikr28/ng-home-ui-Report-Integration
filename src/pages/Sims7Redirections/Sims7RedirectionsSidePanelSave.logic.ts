import { validateDate, validateReason } from "./Sims7RedirectionsSaveValidate.logic";
import {
    handleReversingStatus,
    handleFutureDateStatus,
    handleMigratedStatus,
    handlePlannedStatus
} from "./Sims7RedirectionsSaveStatus.logic";

export interface HandleSaveParams {
    isDirty: boolean;
    setSidePanelMode: (mode: 'view' | 'edit') => void;
    requiresDate: any;
    requiresReason: any;
    dateParts: { day: string; month: string; year: string };
    effectiveDate: Date | null;
    isFutureDate: (date: Date) => boolean;
    selectedRow: any;
    redirectToNextGen: string;
    reasonForChanges: string;
    setReasonError: (msg: string) => void;
    setDateError: (msg: string) => void;
    setIsDirty: (dirty: boolean) => void;
    setShowSuccessToast: (show: boolean) => void;
}

// Removed invalid destructuring and function signature above
export function handleSave(params: HandleSaveParams): void {
    const {
        isDirty,
        setSidePanelMode,
        requiresDate,
        requiresReason,
        dateParts,
        effectiveDate,
        isFutureDate,
        selectedRow,
        redirectToNextGen,
        reasonForChanges,
        setReasonError,
        setDateError,
        setIsDirty,
        setShowSuccessToast
    }: HandleSaveParams = params;
    if (!isDirty) {
        setSidePanelMode('view');
        return;
    }
    // Validation
    if (!validateDate({ requiresDate, selectedRow, redirectToNextGen, dateParts, effectiveDate, isFutureDate, setDateError })) return;
    if (!validateReason({ requiresReason, selectedRow, redirectToNextGen, reasonForChanges, setReasonError })) return;

    // Status transitions
    if (selectedRow.status === 'Reversing') {
        handleReversingStatus(selectedRow, redirectToNextGen, effectiveDate, reasonForChanges);
    }
    handleFutureDateStatus(selectedRow, effectiveDate);
    if (selectedRow.status === 'Migrated') {
        handleMigratedStatus(selectedRow, redirectToNextGen, effectiveDate, reasonForChanges);
    }
    if (selectedRow.status === 'Planned') {
        handlePlannedStatus(selectedRow, redirectToNextGen);
    }
    setIsDirty(false);
    setSidePanelMode('view');
    setShowSuccessToast(true);
    setTimeout(() => {
        setShowSuccessToast(false);
    }, 3000);
}
