// Handles the save logic for Sims7RedirectionsSidePanel
import { saveRedirectionHandler } from './Sims7RedirectionsSidePanelSaveHandler';
import { isSaveBlocked } from './Sims7RedirectionsSaveBlockers';

export async function onSaveHandler({
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
  onSaveSuccess
}: {
  mode: string;
  selectedRow: any;
  isDirty: boolean;
  redirectToNextGen: any;
  reasonForChanges: string;
  requiresReason: Function;
  setReasonError: (msg: string) => void;
  effectiveDate: any;
  t: Function;
  setDateError: (msg: string) => void;
  setShowSuccessToast: (val: boolean) => void;
  setShowFailureBanner: (val: boolean) => void;
  // eslint-disable-next-line no-shadow
  setSidePanelMode: (mode: 'view' | 'edit') => void;
  onSaveSuccess?: () => void;
}): Promise<void> {
  const blocked: boolean | 'success' = isSaveBlocked({
    mode,
    selectedRow,
    isDirty,
    redirectToNextGen,
    reasonForChanges,
    requiresReason,
    setReasonError,
    effectiveDate,
    t,
    setDateError
  });
  if (blocked === true) return;
  if (blocked === 'success') {
    showSuccessAndClose(setShowSuccessToast, setShowFailureBanner, setSidePanelMode, onSaveSuccess);
    return;
  }
  await saveRedirectionHandler({
    selectedRow,
    effectiveDate,
    redirectToNextGen,
    reasonForChanges,
    setDateError,
  setShowSuccessToast,
  setShowFailureBanner,
  setSidePanelMode: (panelMode: string) => setSidePanelMode(panelMode as 'edit' | 'view'),
  onSaveSuccess
  });
}

export function showSuccessAndClose(
  setShowSuccessToast: (val: boolean) => void,
  setShowFailureBanner: (val: boolean) => void,
  setSidePanelMode: (mode: 'view' | 'edit') => void,
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
