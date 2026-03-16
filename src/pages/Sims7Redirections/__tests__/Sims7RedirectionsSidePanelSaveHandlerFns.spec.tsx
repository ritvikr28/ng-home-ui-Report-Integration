import { onSaveHandler, showSuccessAndClose } from '../Sims7RedirectionsSidePanelSaveHandlerFns';
import * as SaveBlockers from '../Sims7RedirectionsSaveBlockers';
import * as SaveHandler from '../Sims7RedirectionsSidePanelSaveHandler';

describe('Sims7RedirectionsSidePanelSaveHandlerFns', () => {
  describe('showSuccessAndClose', () => {
    jest.useFakeTimers();
    it('should show success toast, hide failure banner, set mode to view, and call onSaveSuccess after timeout', () => {
      const setShowSuccessToast = jest.fn();
      const setShowFailureBanner = jest.fn();
      const setSidePanelMode = jest.fn();
      const onSaveSuccess = jest.fn();
      showSuccessAndClose(setShowSuccessToast, setShowFailureBanner, setSidePanelMode, onSaveSuccess);
      expect(setShowSuccessToast).toHaveBeenCalledWith(true);
      expect(setShowFailureBanner).toHaveBeenCalledWith(false);
      expect(setSidePanelMode).toHaveBeenCalledWith('view');
      jest.advanceTimersByTime(1500);
      expect(setShowSuccessToast).toHaveBeenCalledWith(false);
      expect(onSaveSuccess).toHaveBeenCalled();
    });
    it('should not call onSaveSuccess if not provided', () => {
      const setShowSuccessToast = jest.fn();
      const setShowFailureBanner = jest.fn();
      const setSidePanelMode = jest.fn();
      showSuccessAndClose(setShowSuccessToast, setShowFailureBanner, setSidePanelMode);
      jest.advanceTimersByTime(1500);
      // No error should occur
    });
  });

  describe('onSaveHandler', () => {
    afterEach(() => {
      jest.resetAllMocks();
    });

    it('should return early if isSaveBlocked returns true', async () => {
      jest.spyOn(SaveBlockers, 'isSaveBlocked').mockImplementation(() => true);
      const setReasonError = jest.fn();
      const setDateError = jest.fn();
      const setShowSuccessToast = jest.fn();
      const setShowFailureBanner = jest.fn();
      const setSidePanelMode = jest.fn();
      await onSaveHandler({
        mode: 'edit',
        selectedRow: {},
        isDirty: true,
        redirectToNextGen: {},
        reasonForChanges: '',
        requiresReason: jest.fn(),
        setReasonError,
        effectiveDate: new Date(),
        t: jest.fn(),
        setDateError,
        setShowSuccessToast,
        setShowFailureBanner,
        setSidePanelMode,
      });
      expect(setShowSuccessToast).not.toHaveBeenCalled();
      expect(setShowFailureBanner).not.toHaveBeenCalled();
    });

    it('should call success/failure/mode setters if isSaveBlocked returns "success"', async () => {
      jest.spyOn(SaveBlockers, 'isSaveBlocked').mockImplementation(() => 'success');
      const setReasonError = jest.fn();
      const setDateError = jest.fn();
      const setShowSuccessToast = jest.fn();
      const setShowFailureBanner = jest.fn();
      const setSidePanelMode = jest.fn();
      await onSaveHandler({
        mode: 'edit',
        selectedRow: {},
        isDirty: true,
        redirectToNextGen: {},
        reasonForChanges: '',
        requiresReason: jest.fn(),
        setReasonError,
        effectiveDate: new Date(),
        t: jest.fn(),
        setDateError,
        setShowSuccessToast,
        setShowFailureBanner,
        setSidePanelMode,
      });
      expect(setShowSuccessToast).toHaveBeenCalledWith(true);
      expect(setShowFailureBanner).toHaveBeenCalledWith(false);
      expect(setSidePanelMode).toHaveBeenCalledWith('view');
    });

    it('should call saveRedirectionHandler if not blocked', async () => {
      jest.spyOn(SaveBlockers, 'isSaveBlocked').mockImplementation(() => false);
      jest.spyOn(SaveHandler, 'saveRedirectionHandler').mockImplementation(jest.fn());
      const setReasonError = jest.fn();
      const setDateError = jest.fn();
      const setShowSuccessToast = jest.fn();
      const setShowFailureBanner = jest.fn();
      const setSidePanelMode = jest.fn();
      await onSaveHandler({
        mode: 'edit',
        selectedRow: {},
        isDirty: true,
        redirectToNextGen: {},
        reasonForChanges: '',
        requiresReason: jest.fn(),
        setReasonError,
        effectiveDate: new Date(),
        t: jest.fn(),
        setDateError,
        setShowSuccessToast,
        setShowFailureBanner,
        setSidePanelMode,
      });
  expect(SaveHandler.saveRedirectionHandler).toHaveBeenCalled();
    });
  });
});
