import * as SaveValidateLogic from '../Sims7RedirectionsSaveValidate.logic';
import * as SaveStatusLogic from '../Sims7RedirectionsSaveStatus.logic';
import { handleSave, HandleSaveParams } from '../Sims7RedirectionsSidePanelSave.logic';

describe('handleSave', () => {
  let params: HandleSaveParams;
  let setSidePanelMode: jest.Mock;
  let setShowSuccessToast: jest.Mock;
  let setIsDirty: jest.Mock;
  let setDateError: jest.Mock;
  let setReasonError: jest.Mock;

  beforeEach(() => {
    setSidePanelMode = jest.fn();
    setShowSuccessToast = jest.fn();
    setIsDirty = jest.fn();
    setDateError = jest.fn();
    setReasonError = jest.fn();
    params = {
      isDirty: true,
      setSidePanelMode,
      requiresDate: {},
      requiresReason: {},
      dateParts: { day: '01', month: '01', year: '2026' },
      effectiveDate: new Date('2026-01-01'),
      isFutureDate: jest.fn(() => false),
      selectedRow: { status: 'Migrated' },
      redirectToNextGen: 'yes',
      reasonForChanges: 'reason',
      setReasonError,
      setDateError,
      setIsDirty,
      setShowSuccessToast,
    };
  });

  it('should switch to view mode and not proceed if not dirty', () => {
    params.isDirty = false;
    handleSave(params);
    expect(setSidePanelMode).toHaveBeenCalledWith('view');
    expect(setShowSuccessToast).not.toHaveBeenCalled();
  });

  it('should not proceed if date validation fails', () => {
    const validateDate = jest.spyOn(SaveValidateLogic, 'validateDate').mockReturnValue(false);
    handleSave(params);
    expect(validateDate).toHaveBeenCalled();
    expect(setSidePanelMode).not.toHaveBeenCalledWith('view');
    validateDate.mockRestore();
  });

  it('should not proceed if reason validation fails', () => {
    jest.spyOn(SaveValidateLogic, 'validateDate').mockReturnValue(true);
    const validateReason = jest.spyOn(SaveValidateLogic, 'validateReason').mockReturnValue(false);
    handleSave(params);
    expect(validateReason).toHaveBeenCalled();
    expect(setSidePanelMode).not.toHaveBeenCalledWith('view');
    validateReason.mockRestore();
  });

  it('should handle status transitions for Reversing, Migrated, Planned', () => {
    jest.spyOn(SaveValidateLogic, 'validateDate').mockReturnValue(true);
    jest.spyOn(SaveValidateLogic, 'validateReason').mockReturnValue(true);
    const handleReversingStatus = jest.spyOn(SaveStatusLogic, 'handleReversingStatus').mockImplementation(() => {});
    const handleMigratedStatus = jest.spyOn(SaveStatusLogic, 'handleMigratedStatus').mockImplementation(() => {});
    const handlePlannedStatus = jest.spyOn(SaveStatusLogic, 'handlePlannedStatus').mockImplementation(() => {});
    params.selectedRow.status = 'Reversing';
    handleSave(params);
    expect(handleReversingStatus).toHaveBeenCalled();
    params.selectedRow.status = 'Migrated';
    handleSave(params);
    expect(handleMigratedStatus).toHaveBeenCalled();
    params.selectedRow.status = 'Planned';
    handleSave(params);
    expect(handlePlannedStatus).toHaveBeenCalled();
    handleReversingStatus.mockRestore();
    handleMigratedStatus.mockRestore();
    handlePlannedStatus.mockRestore();
  });

  it('should set dirty to false, switch to view mode, show and hide success toast after save', () => {
    jest.spyOn(SaveValidateLogic, 'validateDate').mockReturnValue(true);
    jest.spyOn(SaveValidateLogic, 'validateReason').mockReturnValue(true);
    handleSave(params);
    expect(setIsDirty).toHaveBeenCalledWith(false);
    expect(setSidePanelMode).toHaveBeenCalledWith('view');
    expect(setShowSuccessToast).toHaveBeenCalledWith(true);
  });
});
