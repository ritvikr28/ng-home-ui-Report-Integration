import { Button, ButtonColor, Dialog, DialogContent, DialogFooter, Notification, NotificationStatus, Loader, LoaderType } from "@essnextgen/ui-kit";
import  { useEffect, useRef } from "react";
import { DeleteConfirmationModalProps } from "./DeleteConfirmationModal.props";
import "./style.scss";

const DeleteConfirmationModalView = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    selectedCount,
    isLoading = false,
    isNoSelection = false
}: DeleteConfirmationModalProps) => {
    const keepItButtonRef = useRef<HTMLButtonElement>(null);
    const okayButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (isOpen) {
            if (isNoSelection && okayButtonRef.current) {
                okayButtonRef.current.focus();
            } else if (!isNoSelection && keepItButtonRef.current) {
                keepItButtonRef.current.focus();
            }
        }
    }, [isOpen, isNoSelection]);

    if (isNoSelection) {
        return (
            <Dialog
                className="delete-confirmation-dialog"
                dataTestId="delete-confirmation-modal"
                isOpen={isOpen}
                escapeExits
                returnFocusOnDeactivate={false}
                onClose={onClose}
                title="No items selected"
            >
                <DialogContent>
                    Please select at least one item to perform the action.
                </DialogContent>
                <DialogFooter>
                    <div style={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
                        <Button
                            ref={okayButtonRef}
                            dataTestId="no-selection-ok-btn"
                            onClick={onClose}
                            color={ButtonColor.Primary}
                        >
                            Okay
                        </Button>
                    </div>
                </DialogFooter>
            </Dialog>
        );
    }

    return (
        <Dialog
            className="delete-confirmation-dialog"
            dataTestId="delete-confirmation-modal"
            isOpen={isOpen}
            escapeExits={!isLoading}
            returnFocusOnDeactivate={false}
            onClose={isLoading ? undefined : onClose}
            title="Delete notification?"
        >
            {isLoading ? (
                <DialogContent>
                    <Loader loaderType={LoaderType.Circular} loaderText="Loading" />
                </DialogContent>
            ) : (
                <>
                    <DialogContent>
                        <div className="delete-confirmation-content">
                            <Notification
                                status={NotificationStatus.WARNING}
                                title={`[${selectedCount}] notifications will be gone forever once deleted.`}
                                hideCloseButton
                            />
                        </div>
                    </DialogContent>
                    <DialogFooter>
                        <div className="dialog-footer">
                            <Button
                                ref={keepItButtonRef}
                                dataTestId="keep-it-btn"
                                onClick={onClose}
                                color={ButtonColor.Secondary}
                                aria-label="Keep notifications"
                            >
                                Keep it
                            </Button>
                            <Button
                                dataTestId="delete-btn"
                                onClick={onConfirm}
                                color={ButtonColor.Primary}
                                aria-label="Delete selected notifications"
                            >
                                Delete
                            </Button>
                        </div>
                    </DialogFooter>
                </>
            )}
        </Dialog>
    );
};

export default DeleteConfirmationModalView;

