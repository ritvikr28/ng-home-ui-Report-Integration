import { Button, ButtonColor, Dialog, DialogContent, DialogFooter, Notification, NotificationStatus, Loader, LoaderType } from "@essnextgen/ui-kit";
import { useEffect, useRef, RefObject } from "react";
import { useTranslation, UseTranslationResponse } from "@essnextgen/ui-intl-kit";
import { DeleteConfirmationModalProps } from "./DeleteConfirmationModal.props";
import "./style.scss";

const DeleteConfirmationModalView: ({ isOpen, onClose, onConfirm, selectedCount, isLoading, isNoSelection }:
    DeleteConfirmationModalProps) => JSX.Element = ({
        isOpen,
        onClose,
        onConfirm,
        selectedCount,
        isLoading = false,
        isNoSelection = false
    }: DeleteConfirmationModalProps) => {
        const keepItButtonRef: RefObject<HTMLButtonElement> = useRef<HTMLButtonElement>(null);
        const okayButtonRef: RefObject<HTMLButtonElement> = useRef<HTMLButtonElement>(null);
        const { t }: UseTranslationResponse<"translation", undefined> = useTranslation();

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
                    title={t("NotificationCenter_T.deleteModalNoItemsTitle")}
                >
                    <DialogContent>
                        {t("NotificationCenter_T.deleteModalNoItemsMessage")}
                    </DialogContent>
                    <DialogFooter>
                        <div style={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
                            <Button
                                ref={okayButtonRef}
                                dataTestId="no-selection-ok-btn"
                                onClick={onClose}
                                color={ButtonColor.Primary}
                            >
                                {t("NotificationCenter_T.deleteModalOkay")}
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
                title={t("NotificationCenter_T.deleteModalTitle")}
            >
                {isLoading ? (
                    <DialogContent>
                        <Loader loaderType={LoaderType.Circular} loaderText={t("NotificationCenter_T.deleteModalLoading")} />
                    </DialogContent>
                ) : (
                    <>
                        <DialogContent>
                            <div className="delete-confirmation-content">
                                <Notification
                                    status={NotificationStatus.WARNING}
                                    title={t("NotificationCenter_T.deleteModalWarning", { count: selectedCount })}
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
                                    {t("NotificationCenter_T.deleteModalKeepIt")}
                                </Button>
                                <Button
                                    dataTestId="delete-btn"
                                    onClick={onConfirm}
                                    color={ButtonColor.Primary}
                                    aria-label="Delete selected notifications"
                                >
                                    {t("NotificationCenter_T.deleteModalDelete")}
                                </Button>
                            </div>
                        </DialogFooter>
                    </>
                )}
            </Dialog>
        );
    };

export default DeleteConfirmationModalView;

