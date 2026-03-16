import {
  handleMigratedNoChanges,
  getEffectiveDateStr
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
  // Removed invalid types: undefined and object
  });

});
