import { formatDate, isFutureDate, parseDateString } from "../Sims7RedirectionsDateHelpers";
import { isFormDirty } from "../Sims7RedirectionsFormDirty.logic";
import { getNextStatus } from "../Sims7RedirectionsNextStatus.logic";
import { requiresDate, requiresReason } from "../Sims7RedirectionsStatusHelpers";
import {
  isPanelEditable,
  isSuccessToast,
  isReasonMissing,
  isDateInvalid,
  isEffectiveDateInPast
} from '../Sims7RedirectionsSidePanelHelpers';

describe('Sims7RedirectionsSidePanelHelpers', () => {
  describe('formatDate', () => {
    it('formats a date as DD MMM YYYY', () => {
      const date = new Date(2025, 11, 1); // 1 Dec 2025
      expect(formatDate(date)).toBe('01 Dec 2025');
    });
  });

  describe('parseDateString', () => {
    it('parses a valid date string', () => {
      expect(parseDateString('01 Dec 2025')).toEqual(new Date(2025, 11, 1));
    });
    it('returns null for invalid or dash', () => {
      expect(parseDateString('-')).toBeNull();
      expect(parseDateString('invalid')).toBeNull();
    });
  });

  describe('isFutureDate', () => {
    it('returns true for a future date', () => {
      const future = new Date();
      future.setDate(future.getDate() + 1);
      expect(isFutureDate(future)).toBe(true);
    });
    it('returns false for today or past', () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      expect(isFutureDate(today)).toBe(false);
      const past = new Date();
      past.setDate(past.getDate() - 1);
      expect(isFutureDate(past)).toBe(false);
    });
  });

  describe('requiresDate', () => {
    it('returns true for Migrated/No', () => {
      expect(requiresDate('Migrated', 'no')).toBe(true);
    });
    it('returns false for Migrated/Yes', () => {
      expect(requiresDate('Migrated', 'yes')).toBe(false);
    });
  });

  describe('requiresReason', () => {
    it('returns true for Not migrated/No', () => {
      expect(requiresReason('Not migrated', 'no')).toBe(true);
    });
    it('returns false for Not migrated/Yes', () => {
      expect(requiresReason('Not migrated', 'yes')).toBe(false);
    });
  });

  describe('getNextStatus', () => {
    it('handles Planned to Not migrated and resets effectiveDate and modifiedBy', () => {
      const row = { status: 'Planned', effectiveDate: '22 Jan 2026', modifiedBy: 'someone', reasonForChanges: '' };
      const result = getNextStatus(row, 'no', new Date(2026, 0, 24), '');
      expect(result.status).toBe('Not migrated');
      expect(result.effectiveDate).toBe('-');
      expect(result.modifiedBy).toBe('-');
    });
    it('handles Reversing with no redirect and updates effectiveDate and reasonForChanges', () => {
      const row = { status: 'Reversing', redirectToNextGen: 'no', effectiveDate: '-', reasonForChanges: 'old reason' };
      const effDate = new Date(2026, 0, 23); // 23 Jan 2026
      const result = getNextStatus(row, 'no', effDate, 'new reason');
      expect(result.status).toBe('Reversing');
      expect(result.effectiveDate).toBe('23 Jan 2026');
      expect(result.reasonForChanges).toBe('new reason');
    });
    it('handles Reversing to Migrated', () => {
      const row = { status: 'Reversing', redirectToNextGen: 'no', reasonForChanges: 'test' };
      const result = getNextStatus(row, 'yes', null, '');
      expect(result.status).toBe('Migrated');
      expect(result.redirectToNextGen).toBe('yes');
      expect(result.reasonForChanges).toBe('');
    });
    it('handles Migrated to Reversing', () => {
      const row = { status: 'Migrated', redirectToNextGen: 'yes', reasonForChanges: '' };
      const result = getNextStatus(row, 'no', new Date(2025, 11, 1), 'reason');
      expect(result.status).toBe('Reversing');
      expect(result.redirectToNextGen).toBe('no');
      expect(result.reasonForChanges).toBe('reason');
    });
    it('handles Not migrated to Planned and clears reasonForChanges', () => {
      const row = { status: 'Not migrated', effectiveDate: '-', reasonForChanges: 'should clear' };
      const effDate = new Date(2026, 0, 22); // 22 Jan 2026 (future)
      const result = getNextStatus(row, 'yes', effDate, 'should clear');
      expect(result.status).toBe('Not migrated');
      expect(result.reasonForChanges).toBe('should clear');
      expect(result.effectiveDate).toBe('-');
    });
  });

  describe('isFormDirty', () => {
    it('detects dirty form for Not migrated', () => {
      const row = { status: 'Not migrated', reasonForChanges: '' };
      expect(isFormDirty(row, 'yes', null, '')).toBe(true);
      expect(isFormDirty(row, 'no', null, '')).toBe(false);
    });
    it('detects dirty form for changed date', () => {
      const row = { status: 'Migrated', effectiveDate: '01 Dec 2025', reasonForChanges: '' };
      expect(isFormDirty(row, 'yes', new Date(2025, 11, 2), '')).toBe(true);
    });
    it('detects dirty form for changed reason', () => {
      const row = { status: 'Migrated', effectiveDate: '01 Dec 2025', reasonForChanges: 'old' };
      expect(isFormDirty(row, 'yes', new Date(2025, 11, 1), 'new')).toBe(true);
    });
  });

  describe('isPanelEditable', () => {
    it('returns false if canEditSidePanel returns true', () => {
      expect(isPanelEditable('edit', { foo: 'bar' })).toBe(false);
    });
    it('returns true if canEditSidePanel returns false', () => {
      expect(isPanelEditable('view', null)).toBe(true);
    });
  });

  describe('isSuccessToast', () => {
    it('returns true if shouldShowSuccessToast returns true', () => {
      expect(isSuccessToast({ status: 'Migrated' }, false)).toBe(true);
    });
    it('returns false otherwise', () => {
      expect(isSuccessToast({ status: 'Migrated' }, true)).toBe(false);
      expect(isSuccessToast({ status: 'Not migrated' }, false)).toBe(false);
    });
  });

  describe('isReasonMissing', () => {
    it('returns true and sets error if reason is required and missing', () => {
      const setReasonError = jest.fn();
      const localRequiresReason = () => true;
      expect(isReasonMissing({ status: 'A' }, 'B', '   ', localRequiresReason, setReasonError)).toBe(true);
      expect(setReasonError).toHaveBeenCalledWith('Reason for changes is required');
    });
    it('returns false if reason is not required', () => {
      const setReasonError = jest.fn();
      const localRequiresReason = () => false;
      expect(isReasonMissing({ status: 'A' }, 'B', '', localRequiresReason, setReasonError)).toBe(false);
      expect(setReasonError).not.toHaveBeenCalled();
    });
    it('returns false if reason is present', () => {
      const setReasonError = jest.fn();
      const localRequiresReason = () => true;
      expect(isReasonMissing({ status: 'A' }, 'B', 'something', localRequiresReason, setReasonError)).toBe(false);
      expect(setReasonError).not.toHaveBeenCalled();
    });
  });

  describe('isDateInvalid', () => {
    it('returns true if isEffectiveDateInPast returns true', () => {
      const setDateError = jest.fn();
      const t = () => 'error';
      // Use a date in the past
      expect(isDateInvalid(new Date(Date.now() - 86400000), t, setDateError)).toBe(true);
      expect(setDateError).toHaveBeenCalled();
    });
    it('returns false if isEffectiveDateInPast returns false', () => {
      const setDateError = jest.fn();
      const t = () => 'error';
      // Use a date in the future
      expect(isDateInvalid(new Date(Date.now() + 86400000), t, setDateError)).toBe(false);
      expect(setDateError).not.toHaveBeenCalled();
    });
  });

  describe('isEffectiveDateInPast', () => {
    it('returns false if no date', () => {
      const setDateError = jest.fn();
      const t = () => 'error';
      expect(isEffectiveDateInPast(null, t, setDateError)).toBe(false);
    });
    it('returns true and sets error if date is today or past', () => {
      const setDateError = jest.fn();
      const t = () => 'error';
      expect(isEffectiveDateInPast(new Date(), t, setDateError)).toBe(true);
      expect(setDateError).toHaveBeenCalledWith('error');
    });
    it('returns false if date is in the future', () => {
      const setDateError = jest.fn();
      const t = () => 'error';
      expect(isEffectiveDateInPast(new Date(Date.now() + 86400000), t, setDateError)).toBe(false);
      expect(setDateError).not.toHaveBeenCalled();
    });
  });
});
