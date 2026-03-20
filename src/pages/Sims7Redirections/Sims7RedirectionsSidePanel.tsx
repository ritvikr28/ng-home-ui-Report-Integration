import { onSaveHandler } from './Sims7RedirectionsSidePanelSaveHandlerFns';
/* eslint-disable */
import React, { useEffect, useState } from "react";
import { Sims7RedirectionsSidePanelProps } from "./Sims7RedirectionsInterfaces";
import { SidePanel, SidePanelContent, SidePanelFooter } from "@essnextgen/ui-kit";
import { Sims7RedirectionsPanelContent, Sims7RedirectionsPanelFooter } from "./Sims7RedirectionsPanelParts";

import { requiresReason } from "./Sims7RedirectionsStatusHelpers";
import { useSims7RedirectionsForm, Sims7RedirectionsFormState } from "./useSims7RedirectionsForm";
import {
    getSetReasonForChanges,
    getOnRedirectToNextGenChange,
    getOnDateChange,
    getOnValidateDate,
    getGetDateParts,
    getOnCancel,
    getOnCancelConfirm,
    getOnCancelDialogClose
} from "./Sims7RedirectionsSidePanelHandlers";
import { fetchSims7RedirectionById, Sims7RedirectionViewData } from "./Sims7RedirectionsPage.api";

interface Sims7RedirectionsSidePanelWithSave extends Sims7RedirectionsSidePanelProps {
    onSaveSuccess?: () => void;
    setSelectedRow?: (row: any) => void;
}

const Sims7RedirectionsSidePanel: React.FC<Sims7RedirectionsSidePanelWithSave> = ({
    isOpen,
    onClose,
    mode,
    selectedRow,
    t,
    setSidePanelMode,
    onSaveSuccess,
    setSelectedRow
}) => {

    const [viewData, setViewData]: [Sims7RedirectionViewData | null, React.Dispatch<React.SetStateAction<Sims7RedirectionViewData | null>>] = useState<Sims7RedirectionViewData | null>(null);

    React.useEffect(() => {
        if (mode === 'edit' && selectedRow) {
            console.log('Entering edit mode with selectedRow:', selectedRow);
        }
    }, [mode, selectedRow]);

    const [viewLoading, setViewLoading]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState(false);
    useEffect(() => {
        if (!selectedRow?.id) return;
        setViewLoading(true);
        fetchSims7RedirectionById({ moduleId: selectedRow.id })
            .then(setViewData)
            .catch(() => {
                setViewData(null);
                setShowFailureBanner(true);
            })
            .finally(() => setViewLoading(false));
    }, [selectedRow?.id, mode]);
    const [initialReasonForChanges, setInitialReasonForChanges]: [string, React.Dispatch<React.SetStateAction<string>>] = useState<string>("");
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

    // Update reasonForChanges from API response (viewData) when loaded
    useEffect(() => {
        if (mode === 'edit' && viewData && (viewData as { payload?: { reasonForChanges?: string; reasonForChange?: string } }).payload) {
            const payload: { reasonForChanges?: string; reasonForChange?: string } = (viewData as { payload?: { reasonForChanges?: string; reasonForChange?: string } }).payload || {};
            let value = '';
            if (typeof payload.reasonForChanges !== 'undefined') {
                value = payload.reasonForChanges ?? '';
            } else if (typeof payload.reasonForChange !== 'undefined') {
                value = payload.reasonForChange ?? '';
            }
            setReasonForChangesRaw(value);
            setInitialReasonForChanges(value);
        }
    }, [mode, viewData, setReasonForChangesRaw]);

    // Debug: Print reasonForChanges in edit mode
    useEffect(() => {
        if (mode === 'edit') {
            // eslint-disable-next-line no-console
            console.log('[DEBUG] reasonForChanges in edit mode:', reasonForChanges);
        }
    }, [mode, reasonForChanges]);


    const setReasonForChanges: (val: string) => void = getSetReasonForChanges(setReasonForChangesRaw, selectedRow, redirectToNextGen, setReasonError);
    // Custom isFormDirty that uses initialReasonForChanges
    const isFormDirtyWithApi: (reason: string) => boolean = (reason: string): boolean => {
        return reason !== initialReasonForChanges;
    };
    const onRedirectToNextGenChange: (e: React.SyntheticEvent<Element, Event>, value: string | number) => void = getOnRedirectToNextGenChange({
        selectedRow,
        setRedirectToNextGen,
        setEffectiveDate,
        setDateParts,
        setIsDirty,
        effectiveDate,
        reasonForChanges,
        setDateError
    });
    const onDateChange: (arg1: any, arg2?: any, arg3?: any) => void = getOnDateChange({
        t,
        setDateParts,
        setEffectiveDate,
        setDateError,
        setIsDirty,
        selectedRow,
        redirectToNextGen,
        reasonForChanges
    });
    const onValidateDate: (date: Date) => void = getOnValidateDate(setDateError, t);
    const [showFailureBanner, setShowFailureBanner]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = React.useState(false);
    const onSave: () => Promise<void> = async () => {
        await onSaveHandler({
            mode,
            selectedRow,
            isDirty,
            redirectToNextGen,
            reasonForChanges,
            requiresReason,
            setReasonError,
            effectiveDate,
            t,
            setDateError,
            setShowSuccessToast,
            setShowFailureBanner,
            setSidePanelMode,
            onSaveSuccess,
            onSelectedRowUpdate: setSelectedRow
        });
    };
    const getDateParts: (_date: Date | null) => any = getGetDateParts(dateParts);
    const onCancel: () => void = getOnCancel(isDirty, setShowCancelDialog, onClose);
    const onCancelConfirm: () => void = getOnCancelConfirm(setIsDirty, setShowCancelDialog, setReasonForChanges, selectedRow, setReasonError, setDateError, onClose);
    const onCancelDialogClose: () => void = getOnCancelDialogClose(setShowCancelDialog);

    return (
        <SidePanel
            isOpen={isOpen}
            onClose={onCancel}
            isOnClose
            title={mode === 'view'? t("SIMS7Redirects.viewTitle"):t("SIMS7Redirects.editTitle")}
            alignHeading
        >
            <SidePanelContent>
                <Sims7RedirectionsPanelContent
                    mode={mode}
                    viewLoading={viewLoading}
                    viewData={viewData}
                    t={t}
                    setSidePanelMode={setSidePanelMode}
                    selectedRow={selectedRow}
                    redirectToNextGen={redirectToNextGen}
                    effectiveDate={effectiveDate}
                    reasonForChanges={reasonForChanges}
                    dateError={dateError}
                    reasonError={reasonError}
                    getDateParts={getDateParts}
                    onRedirectToNextGenChange={onRedirectToNextGenChange}
                    onDateChange={onDateChange}
                    onValidateDate={onValidateDate}
                    setReasonForChanges={setReasonForChanges}
                    setIsDirty={setIsDirty}
                    isFormDirty={isFormDirtyWithApi}
                    showFailureBanner={showFailureBanner}
                    showSuccessToast={showSuccessToast}
                    showCancelDialog={showCancelDialog}
                    onCancelDialogClose={onCancelDialogClose}
                    onCancelConfirm={onCancelConfirm}
                />
            </SidePanelContent>
            <SidePanelFooter>
                <Sims7RedirectionsPanelFooter
                    mode={mode}
                    t={t}
                    onClose={onClose}
                    onCancel={onCancel}
                    onSave={onSave}
                />
            </SidePanelFooter>
        </SidePanel>
    );
};

export default Sims7RedirectionsSidePanel;
