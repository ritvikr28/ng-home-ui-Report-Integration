/* eslint-disable */
import React from "react";
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
    ButtonSize
} from "@essnextgen/ui-kit";

import { handleDateChange, handleValidateDate, getDateParts as getDatePartsLogic } from "./Sims7RedirectionsSidePanelDate.logic";
import { handleSave } from "./Sims7RedirectionsSidePanelSave.logic";
import { handleCancel, handleCancelConfirm, handleCancelDialogClose } from "./Sims7RedirectionsSidePanelCancel.logic";
import { handleRedirectToNextGenChange } from "./Sims7RedirectionsSidePanelRedirect.logic";
import { requiresDate, requiresReason } from "./Sims7RedirectionsStatusHelpers";
import { isFutureDate } from "./Sims7RedirectionsDateHelpers";
import { isFormDirty } from "./Sims7RedirectionsFormDirty.logic";
import { useSims7RedirectionsForm, Sims7RedirectionsFormState } from "./useSims7RedirectionsForm";
import { validateReason } from "./Sims7RedirectionsSaveValidate.logic";

const Sims7RedirectionsSidePanel: React.FC<Sims7RedirectionsSidePanelProps> = ({
    isOpen,
    onClose,
    mode,
    selectedRow,
    t,
    setSidePanelMode
}) => {
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
        handleValidateDate(date, setDateError);
    };

    const onSave: () => void = () => {
        handleSave({
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
        });
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
            title={mode === 'view' ? 'View SIMS 7 redirects' : 'Edit SIMS 7 redirects'}
            alignHeading
        >
            <SidePanelContent>
                <>
                    {mode === 'view' && selectedRow && (
                        <Sims7RedirectionsView
                            selectedRow={selectedRow}
                            t={t}
                            setSidePanelMode={setSidePanelMode}
                        />
                    )}
                    {mode === 'edit' && selectedRow && (
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
                    )}
                    {showSuccessToast && (
                        <Notification status={NotificationStatus.SUCCESSTOAST} title="Changes saved" />
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
                            cancelText: "Cancel",
                            okText: "Discard"
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
                        Close
                    </Button>
                    :
                    <>
                        <Button
                            size={ButtonSize.Large}
                            color={ButtonColor.Secondary}
                            className="btn-full-width"
                            onClick={onCancel}
                        >
                            Cancel
                        </Button>
                        <Button
                            size={ButtonSize.Large}
                            color={ButtonColor.Primary}
                            className="btn-full-width"
                            onClick={onSave}
                        >
                            Save
                        </Button>
                    </>
                }
            </SidePanelFooter>
        </SidePanel>
    );
};

export default Sims7RedirectionsSidePanel;
