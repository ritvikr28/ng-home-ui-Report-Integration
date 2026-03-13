import {
  handleMigratedNoChanges,
  getEffectiveDateStr,
  buildRequest,
  getBackendStatus,
  handleStatusLogic
} from '../Sims7RedirectionsSidePanelSaveHelpers';

describe('Sims7RedirectionsSidePanelSaveHelpers', () => {
  it('handleMigratedNoChanges returns true and calls callbacks for Migrated and not dirty', () => {
  jest.useFakeTimers();
  const setShowSuccessToast = jest.fn();
  const setShowFailureBanner = jest.fn();
  const setSidePanelMode = jest.fn();
  const onSaveSuccess = jest.fn();
  const result = handleMigratedNoChanges({ status: 'Migrated' }, false, setShowSuccessToast, setShowFailureBanner, setSidePanelMode, onSaveSuccess);
  expect(result).toBe(true);
  expect(setShowSuccessToast).toHaveBeenCalledWith(true);
  expect(setShowFailureBanner).toHaveBeenCalledWith(false);
  jest.runAllTimers();
  expect(setSidePanelMode).toHaveBeenCalledWith('view');
  });

  it('handleMigratedNoChanges returns false for not Migrated or dirty', () => {
    const setShowSuccessToast = jest.fn();
    const setShowFailureBanner = jest.fn();
    const setSidePanelMode = jest.fn();
    expect(handleMigratedNoChanges({ status: 'Planned' }, false, setShowSuccessToast, setShowFailureBanner, setSidePanelMode)).toBe(false);
    expect(handleMigratedNoChanges({ status: 'Migrated' }, true, setShowSuccessToast, setShowFailureBanner, setSidePanelMode)).toBe(false);
  });

  it('getEffectiveDateStr returns formatted date for Date input', () => {
    const date = new Date(2026, 2, 8); // March 8, 2026
    expect(getEffectiveDateStr(date)).toBe('2026-03-08');
  });

  it('getEffectiveDateStr returns string for string input', () => {
    expect(getEffectiveDateStr('2026-03-08')).toBe('2026-03-08');
  });

  it('getEffectiveDateStr returns empty string for invalid input', () => {
    expect(getEffectiveDateStr(null)).toBe('');
    expect(getEffectiveDateStr(undefined)).toBe('');
    expect(getEffectiveDateStr({})).toBe('');
  });

  it('buildRequest returns correct payload and handles status transitions', () => {
    const row = { id: '1', dfeNumber: '123', nextGenModule: 'mod', category: 'cat', switchToSchool: true, reasonForChanges: 'reason', plannedStatus: 'Migrated', status: 'Reversing' };
    const payload = buildRequest(row, '2026-03-08', 'Reversing');
  expect(payload.effectiveDate).toBe('2026-03-08');
    expect(payload.reasonForChange).toBe('');
  expect(payload.plannedStatus).toBe('N');
  });

  it('getBackendStatus maps status correctly', () => {
    expect(getBackendStatus('Not migrated')).toBe('NotMigrated');
    expect(getBackendStatus('Migrated')).toBe('Migrated');
    expect(getBackendStatus('Planned')).toBe('Planned');
    expect(getBackendStatus('Permanent')).toBe('Permanent');
    expect(getBackendStatus('Reversing')).toBe('Reversing');
    expect(getBackendStatus('Other')).toBe('Other');
  });

  it('handleStatusLogic calls correct status handlers', async () => {
    const updatedRow = { status: 'Reversing' };
    const mockReversing = jest.fn();
    const mockFuture = jest.fn();
    const mockMigrated = jest.fn();
    const mockPlanned = jest.fn();
    jest.mock('../Sims7RedirectionsSaveStatus.logic', () => ({
      handleReversingStatus: mockReversing,
      handleFutureDateStatus: mockFuture,
      handleMigratedStatus: mockMigrated,
      handlePlannedStatus: mockPlanned
    }));
    await handleStatusLogic(updatedRow, 'redirect', '2026-03-08', 'reason');
    expect(mockReversing).toHaveBeenCalled();
    expect(mockFuture).toHaveBeenCalled();
  });
});
