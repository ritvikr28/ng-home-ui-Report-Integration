export interface HandleCancelConfirmParams {
    setIsDirty: (dirty: boolean) => void;
    setShowCancelDialog: (show: boolean) => void;
    setReasonForChanges: (val: string) => void;
    selectedRow: any;
    setReasonError: (msg: string) => void;
    setDateError: (msg: string) => void;
    onClose: () => void;
}
// Cancel logic for Sims7RedirectionsSidePanel
export function handleCancel(isDirty: boolean, setShowCancelDialog: (b: boolean) => void, onClose: () => void): void {
    if (isDirty) {
        setShowCancelDialog(true);
        return;
    }
    onClose();
}

export function handleCancelConfirm(params: HandleCancelConfirmParams): void {
    const {
        setIsDirty,
        setShowCancelDialog,
        setReasonForChanges,
        selectedRow,
        setReasonError,
        setDateError,
        onClose
    }: HandleCancelConfirmParams = params;
    setIsDirty(false);
    setShowCancelDialog(false);
    setReasonForChanges(selectedRow?.reasonForChanges || "");
    setReasonError("");
    setDateError("");
    onClose();
}

export function handleCancelDialogClose(setShowCancelDialog: (b: boolean) => void): void {
    setShowCancelDialog(false);
}
