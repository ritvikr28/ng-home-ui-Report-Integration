import { buildRequest, handleStatusLogic } from './Sims7RedirectionsSidePanelSaveHelpers';
/* eslint-disable */
import React, { useEffect, useState } from "react";
import { Sims7RedirectionsSidePanelProps } from "./Sims7RedirectionsInterfaces";
import Sims7RedirectionsView from "./Sims7RedirectionsView";
import Sims7RedirectionsEdit from "./Sims7RedirectionsEdit";
import {
    Dialog,
    DialogTemplate,
    Notification,
    NotificationStatus,
    SidePanel,
    SidePanelContent,
    SidePanelFooter,
    Button,
    ButtonColor,
    ButtonSize,
    Loader,
    LoaderType 
} from "@essnextgen/ui-kit";

import { handleDateChange, handleValidateDate, getDateParts as getDatePartsLogic } from "./Sims7RedirectionsSidePanelDate.logic";
import { handleCancel, handleCancelConfirm, handleCancelDialogClose } from "./Sims7RedirectionsSidePanelCancel.logic";
import { handleRedirectToNextGenChange } from "./Sims7RedirectionsSidePanelRedirect.logic";
import { requiresReason } from "./Sims7RedirectionsStatusHelpers";
import { isFormDirty } from "./Sims7RedirectionsFormDirty.logic";
import { useSims7RedirectionsForm, Sims7RedirectionsFormState } from "./useSims7RedirectionsForm";
import { validateReason } from "./Sims7RedirectionsSaveValidate.logic";
import { fetchSims7RedirectionById, Sims7RedirectionViewData } from "./Sims7RedirectionsPage.api";

interface Sims7RedirectionsSidePanelWithSave extends Sims7RedirectionsSidePanelProps {
    onSaveSuccess?: () => void;
}

const Sims7RedirectionsSidePanel: React.FC<Sims7RedirectionsSidePanelWithSave> = ({
    isOpen,
    onClose,
    mode,
    selectedRow,
    t,
    setSidePanelMode,
    onSaveSuccess
}) => {

    const [viewData, setViewData]: [Sims7RedirectionViewData | null, React.Dispatch<React.SetStateAction<Sims7RedirectionViewData | null>>] = useState<Sims7RedirectionViewData | null>(null);

    React.useEffect(() => {
        if (mode === 'edit' && selectedRow) {
            console.log('Entering edit mode with selectedRow:', selectedRow);
        }
    }, [mode, selectedRow]);

    const [viewLoading, setViewLoading] = useState(false);
    useEffect(() => {
        if (mode !== "view" || !selectedRow?.id) return;
        setViewLoading(true);
        fetchSims7RedirectionById({ moduleId: selectedRow.id })
            .then(setViewData)
            .catch(() => {
                setViewData(null);
                setShowFailureBanner(true);
            })
            .finally(() => setViewLoading(false));
    }, [selectedRow?.id, mode]);
    const {
        reasonForChanges,
        setReasonForChanges: setReasonForChangesRaw,
        showSuccessToast,
        setShowSuccessToast,
        isDirty,
        setIsDirty,
        dateError,
        setDateError,
        reasonError,
        setReasonError,
        showCancelDialog,
        setShowCancelDialog,
        redirectToNextGen,
        setRedirectToNextGen,
        dateParts,
        setDateParts,
        effectiveDate,
        setEffectiveDate
    }: Sims7RedirectionsFormState = useSims7RedirectionsForm(selectedRow, mode);

    const setReasonForChanges: (val: string) => void = (val: string) => {
        setReasonForChangesRaw(val);
        validateReason({
            requiresReason,
            selectedRow,
            redirectToNextGen,
            reasonForChanges: val,
            setReasonError
        });
    };

    const onRedirectToNextGenChange: (_e: React.SyntheticEvent<Element, Event>, value: string | number) => void = (_e, value) => {
        handleRedirectToNextGenChange({
            event: _e,
            value,
            selectedRow,
            setRedirectToNextGen,
            setEffectiveDate,
            setDateParts,
            setIsDirty,
            effectiveDate,
            reasonForChanges
        });
    };

    const onDateChange: (arg1: any, arg2?: any, arg3?: any) => void = (arg1, arg2, arg3) => {
        handleDateChange({
            t,
            arg1,
            arg2,
            arg3,
            setDateParts,
            setEffectiveDate,
            setDateError,
            setIsDirty,
            selectedRow,
            redirectToNextGen,
            reasonForChanges
        });
    };

    const onValidateDate: (date: Date) => void = (date) => {
        handleValidateDate(date, setDateError, t);
    };

    // Save handler: call PUT API in edit mode
    const [showFailureBanner, setShowFailureBanner] = React.useState(false);
    //const [failureMessage, setFailureMessage] = React.useState('');
    const onSave: () => Promise<void> = async () => {
        if (!canEditSidePanel(mode, selectedRow)) return;
        if (shouldShowSuccessToast(selectedRow, isDirty)) {
            showSuccessAndClose(setShowSuccessToast, setShowFailureBanner, setSidePanelMode, onSaveSuccess);
            return;
        }
        // Block save if reason is required and missing
        if (requiresReason(selectedRow.status, redirectToNextGen) && !reasonForChanges.trim()) {
            setReasonError('Reason for changes is required');
            return;
        }
        // Block save if effectiveDate is in the past
        if (effectiveDate) {
            const now = new Date();
            const dateToCheck = typeof effectiveDate === 'string' ? new Date(effectiveDate) : effectiveDate;
            // Only compare date part, ignore time
            const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const checkDate = new Date(dateToCheck.getFullYear(), dateToCheck.getMonth(), dateToCheck.getDate());
            if (checkDate <= nowDate) {
                setDateError('SIMS7Redirects.dateError');
                return;
            }
        }
        await saveRedirectionHandler({
            selectedRow,
            effectiveDate,
            redirectToNextGen,
            reasonForChanges,
            setDateError,
            setShowSuccessToast,
            setShowFailureBanner,
            setSidePanelMode,
            onSaveSuccess
        });
    async function saveRedirectionHandler({ selectedRow, effectiveDate, redirectToNextGen, reasonForChanges, setDateError, setShowSuccessToast, setShowFailureBanner, setSidePanelMode, onSaveSuccess }: any) {
        try {
            const { getEffectiveDateStr } = require('./Sims7RedirectionsSidePanelSaveHelpers');
            const effectiveDateStr = getEffectiveDateStr(effectiveDate);
            const updatedRow = { ...selectedRow };
            console.log('selectedRow.previousDate:', selectedRow.previousDate);
            await handleStatusLogic(updatedRow, redirectToNextGen, effectiveDate, reasonForChanges);
            const dfeNumber = updatedRow.dfeNumber || updatedRow.DfeNumber;
            if (!dfeNumber) {
                setDateError('DFE Number is missing from the selected row.');
                return;
            }
            const req = buildRequest(updatedRow, effectiveDateStr, selectedRow.status);
            const { updateSims7Redirection } = await import('./Sims7RedirectionsPage.api');
            await updateSims7Redirection(req);
            showSuccessAndClose(setShowSuccessToast, setShowFailureBanner, setSidePanelMode, onSaveSuccess);
        } catch (err) {
            setShowSuccessToast(false);
            setShowFailureBanner(true);
        }
    }
    };

    function canEditSidePanel(mode: string, selectedRow: any) {
        return mode === 'edit' && !!selectedRow;
    }

    function shouldShowSuccessToast(selectedRow: any, isDirty: boolean) {
        return selectedRow.status === 'Migrated' && !isDirty;
    }

    function showSuccessAndClose(setShowSuccessToast: Function, setShowFailureBanner: Function, setSidePanelMode: Function, onSaveSuccess?: Function) {
        setShowSuccessToast(true);
        setShowFailureBanner(false);
        setSidePanelMode('view');
        setTimeout(() => {
            setShowSuccessToast(false);
            if (onSaveSuccess) onSaveSuccess();
        }, 1500);
    };

    const getDateParts: (_date: Date | null) => any = (_date) => {
        return getDatePartsLogic(dateParts);
    };

    const onCancel: () => void = () => {
        handleCancel(isDirty, setShowCancelDialog, onClose);
    };

    const onCancelConfirm: () => void = () => {
        handleCancelConfirm({
            setIsDirty,
            setShowCancelDialog,
            setReasonForChanges,
            selectedRow,
            setReasonError,
            setDateError,
            onClose
        });
    };

    const onCancelDialogClose: () => void = () => {
        handleCancelDialogClose(setShowCancelDialog);
    };

    return (
        <SidePanel
            isOpen={isOpen}
            onClose={onCancel}
            isOnClose
            title={mode === 'view'? t("SIMS7Redirects.viewTitle"):t("SIMS7Redirects.editTitle")}
            alignHeading
        >
            <SidePanelContent>
                <>
                    {mode === 'view' && viewLoading && (
                        <Loader
                            className="loader-wrapper"
                            loaderText="Loading..."
                            loaderType={LoaderType.Circular}
                        />
                    )}
                    {mode === 'view' && !viewLoading && viewData && (
                        <Sims7RedirectionsView
                            viewData={viewData}
                            t={t}
                            setSidePanelMode={setSidePanelMode}
                        />
                    )}
                    {mode === 'edit' && selectedRow && (
                        <>
                            <Sims7RedirectionsEdit
                                selectedRow={selectedRow}
                                redirectToNextGen={redirectToNextGen}
                                effectiveDate={effectiveDate}
                                reasonForChanges={reasonForChanges}
                                dateError={dateError}
                                reasonError={reasonError}
                                getDateParts={getDateParts}
                                handleRedirectToNextGenChange={onRedirectToNextGenChange}
                                handleDateChange={onDateChange}
                                handleValidateDate={onValidateDate}
                                setReasonForChanges={setReasonForChanges}
                                setIsDirty={setIsDirty}
                                isFormDirty={(redirect, date, reason) => isFormDirty(selectedRow, redirect, date, reason)}
                                t={t}
                            />
                            {showFailureBanner && (
                                <Notification
                                    status={NotificationStatus.WARNING}
                                    title="Unable to save changes"
                                    message="A technical issue at our end has stopped us from saving your changes. Please try again. We appreciate your patience and understanding during this time."
                                    onClickClose={(e: React.SyntheticEvent) => setShowFailureBanner(false)}
                                />
                            )}
                        </>
                    )}
                    {mode === 'view' && showFailureBanner && (
                        <Notification
                            status={NotificationStatus.WARNING}
                            title="Information unavailable"
                            message="A technical issue at our end has stopped us from displaying some information. Please try again later. If the issue persists please get in touch with our support team. "
                            hideCloseButton={true}
                        />
                    )}
                    {showSuccessToast && (
                        <Notification status={NotificationStatus.SUCCESSTOAST} title={t("SIMS7Redirects.changesSave")} />
                    )}
                    <Dialog
                        isOpen={showCancelDialog}
                        onClose={onCancelDialogClose}
                        escapeExits={true}
                        title={t("SIMS7Redirects.discardChanges")}
                        templateProps={{
                            template: DialogTemplate.Confirmation,
                            contentText: t("SIMS7Redirects.discardChangesDescription"),
                            onConfirm: onCancelConfirm,
                            onCancel: onCancelDialogClose,
                           cancelText: t("SIMS7Redirects.cancelbtn"),
                            okText: t("SIMS7Redirects.discardbtn")
                        }}
                    />
                </>
            </SidePanelContent>
            <SidePanelFooter>
                {mode === 'view' ?
                    <Button
                        size={ButtonSize.Large}
                        color={ButtonColor.Secondary}
                        className="btn-full-width"
                        onClick={onClose}
                    >
                       {t("SIMS7Redirects.closebtn")}
                    </Button>
                    :
                    <>
                        <Button
                            size={ButtonSize.Large}
                            color={ButtonColor.Secondary}
                            className="btn-full-width"
                            onClick={onCancel}
                        >
                            {t("SIMS7Redirects.cancelbtn")}
                        </Button>
                        <Button
                            size={ButtonSize.Large}
                            color={ButtonColor.Primary}
                            className="btn-full-width"
                            onClick={onSave}
                        >
                            {t("SIMS7Redirects.savebtn")}
                        </Button>
                    </>
                }
            </SidePanelFooter>
        </SidePanel>
    );
};

export default Sims7RedirectionsSidePanel;
