import { buildRequest } from './buildRequest';
import { handleStatusLogic } from './handleStatusLogic';
import type { UpdateSims7RedirectionRequest } from './Sims7RedirectionsPage.api';

export interface ApiRequest {
    id: string;
    dfeNumber: string;
    ngModule: string;
    ngComponent: string;
    switchToSchool: boolean;
    effectiveDate: string;
    currentStatus: string;
    plannedStatus: string;
    reasonForChange: string;
}

const { getEffectiveDateStr }: { getEffectiveDateStr: (date: Date | string | null) => string } = require('./Sims7RedirectionsSidePanelSaveHelpers');

export interface SaveRedirectionHandlerArgs {
    selectedRow: any;
    effectiveDate: Date | string | null;
    redirectToNextGen: string;
    reasonForChanges: string;
    setDateError: (msg: string) => void;
    setShowSuccessToast: (val: boolean) => void;
    setShowFailureBanner: (val: boolean) => void;
    setSidePanelMode: (mode: string) => void;
    onSaveSuccess?: () => void;
}

export async function saveRedirectionHandler({
    selectedRow,
    effectiveDate,
    redirectToNextGen,
    reasonForChanges,
    setDateError,
    setShowSuccessToast,
    setShowFailureBanner,
    setSidePanelMode,
    onSaveSuccess
}: SaveRedirectionHandlerArgs): Promise<void> {
    try {
        const effectiveDateStr: string = getEffectiveDateStr(effectiveDate);
        const updatedRow: Record<string, any> = { ...selectedRow };
        await handleStatusLogic(updatedRow, redirectToNextGen, effectiveDate, reasonForChanges);
        if (hasMissingDFENumber(updatedRow, setDateError)) return;
        await callUpdateApi({
            updatedRow,
            effectiveDateStr,
            status: selectedRow.status,
            setShowSuccessToast,
            setShowFailureBanner,
            setSidePanelMode,
            onSaveSuccess
        });
    } catch (err) {
        setShowSuccessToast(false);
        setShowFailureBanner(true);
    }
}

function hasMissingDFENumber(row: Record<string, any>, setDateError: (msg: string) => void): boolean {
    const dfeNumber = row.dfeNumber || row.DfeNumber;
    if (!dfeNumber) {
        setDateError('DFE Number is missing from the selected row.');
        return true;
    }
    return false;
}


export async function callUpdateApi({
    updatedRow,
    effectiveDateStr,
    status,
    setShowSuccessToast,
    setShowFailureBanner,
    setSidePanelMode,
    onSaveSuccess
}: {
    updatedRow: Record<string, any>;
    effectiveDateStr: string;
    status: string;
    setShowSuccessToast: (val: boolean) => void;
    setShowFailureBanner: (val: boolean) => void;
    setSidePanelMode: (mode: string) => void;
    onSaveSuccess?: () => void;
}): Promise<void> {
    const apiReq: ApiRequest = buildRequest(updatedRow, effectiveDateStr, status);
    const { updateSims7Redirection }: { updateSims7Redirection: (req: UpdateSims7RedirectionRequest) => Promise<any> } = await import('./Sims7RedirectionsPage.api');
    await updateSims7Redirection(apiReq);
    showSuccessAndClose(setShowSuccessToast, setShowFailureBanner, setSidePanelMode, onSaveSuccess);
}

function showSuccessAndClose(
    setShowSuccessToast: (val: boolean) => void,
    setShowFailureBanner: (val: boolean) => void,
    setSidePanelMode: (mode: string) => void,
    onSaveSuccess?: () => void
): void {
    setShowSuccessToast(true);
    setShowFailureBanner(false);
    setSidePanelMode('view');
    setTimeout(() => {
        setShowSuccessToast(false);
        if (onSaveSuccess) onSaveSuccess();
    }, 1500);
}
