import { Button, ButtonColor, Dialog, DialogContent, DialogFooter, Notification, NotificationStatus, Loader, LoaderType } from "@essnextgen/ui-kit";
import  { useEffect, useRef } from "react";
import { DeleteConfirmationModalProps } from "./DeleteConfirmationModal.props";
import "./style.scss";

const DeleteConfirmationModalView = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    selectedCount,
    isLoading = false
}: DeleteConfirmationModalProps) => {
    const keepItButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (isOpen && keepItButtonRef.current) {
            keepItButtonRef.current.focus();
        }
    }, [isOpen]);

    

    return (
        <Dialog
            className="delete-confirmation-dialog"
            dataTestId="delete-confirmation-modal"
            isOpen={isOpen}
            escapeExits={!isLoading}
            returnFocusOnDeactivate
            onClose={isLoading ? undefined : onClose}
            title="Delete notification?"           
        >
            <DialogContent>
                {isLoading ? (
                    <div>
                        <Loader loaderType={LoaderType.Circular} loaderText="Loading" />
                    </div>
                ) : (
                    <div className="delete-confirmation-content">
                        <Notification
                            status={NotificationStatus.WARNING}
                            title={`[${selectedCount}] notifications will be gone forever once deleted.`}
                            hideCloseButton
                        />
                    </div>
                )}
            </DialogContent>
            {!isLoading && (
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
            )}
        </Dialog>
    );
};

export default DeleteConfirmationModalView;

