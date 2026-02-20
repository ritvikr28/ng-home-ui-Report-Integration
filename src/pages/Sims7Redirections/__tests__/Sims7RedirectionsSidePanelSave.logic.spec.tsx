import { handleSave, HandleSaveParams } from '../Sims7RedirectionsSidePanelSave.logic';

describe('handleSave', () => {
  jest.useFakeTimers();

  let setShowSuccessToast: jest.Mock;
  let setSidePanelMode: jest.Mock;
  let setIsDirty: jest.Mock;
  let setDateError: jest.Mock;
  let setReasonError: jest.Mock;

  beforeEach(() => {
    setShowSuccessToast = jest.fn();
    setSidePanelMode = jest.fn();
    setIsDirty = jest.fn();
    setDateError = jest.fn();
    setReasonError = jest.fn();
  });

  it('should hide success toast after timeout', () => {
    const params: HandleSaveParams = {
      isDirty: true,
      setSidePanelMode,
      requiresDate: () => true,
      requiresReason: () => true,
      dateParts: { day: '01', month: '01', year: '2027' },
      effectiveDate: new Date(2027, 0, 1),
      isFutureDate: () => true,
      selectedRow: { status: 'Other' },
      redirectToNextGen: 'no',
      reasonForChanges: 'reason',
      setReasonError,
      setDateError,
      setIsDirty,
      setShowSuccessToast
    };
    // Mock validateDate and validateReason to always return true
    jest.mock('../Sims7RedirectionsSaveValidate.logic', () => ({
      validateDate: () => true,
      validateReason: () => true
    }));
    // Mock status handlers
    jest.mock('../Sims7RedirectionsSaveStatus.logic', () => ({
      handleReversingStatus: jest.fn(),
      handleFutureDateStatus: jest.fn(),
      handleMigratedStatus: jest.fn(),
      handlePlannedStatus: jest.fn()
    }));

    handleSave(params);
    expect(setShowSuccessToast).toHaveBeenCalledWith(true);
    // Fast-forward timers
    jest.runAllTimers();
    expect(setShowSuccessToast).toHaveBeenCalledWith(false);
  });
});
