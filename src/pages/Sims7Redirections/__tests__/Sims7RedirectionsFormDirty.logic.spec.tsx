import { isFormDirty } from '../Sims7RedirectionsFormDirty.logic';

describe('isFormDirty', () => {
  describe('Not migrated status', () => {
    const row = { status: 'Not migrated', effectiveDate: '-', reasonForChanges: '' };

    it('returns false when redirect is "no" (original value)', () => {
      expect(isFormDirty(row, 'no', null, '')).toBe(false);
    });

    it('returns true when redirect is "yes" (changed)', () => {
      expect(isFormDirty(row, 'yes', null, '')).toBe(true);
    });

    it('ignores date and reason changes for Not migrated', () => {
      expect(isFormDirty(row, 'no', new Date(), 'some reason')).toBe(false);
    });
  });

  describe('Reversing status', () => {
    const row = { status: 'Reversing', effectiveDate: '21 Mar 2026', reasonForChanges: 'original reason' };

    it('returns false when redirect is "no" (original value)', () => {
      expect(isFormDirty(row, 'no', null, 'original reason')).toBe(false);
    });

    it('returns true when redirect is "yes" (changed)', () => {
      expect(isFormDirty(row, 'yes', null, 'original reason')).toBe(true);
    });

    it('ignores date changes for Reversing', () => {
      expect(isFormDirty(row, 'no', new Date(), 'original reason')).toBe(false);
    });

    it('ignores reason changes for Reversing', () => {
      expect(isFormDirty(row, 'no', null, 'different reason')).toBe(false);
    });

    it('returns false when going No → Yes → No (toggle back)', () => {
      expect(isFormDirty(row, 'no', new Date('2026-03-21'), 'some reason')).toBe(false);
    });
  });

  describe('Migrated status', () => {
    const row = { status: 'Migrated', effectiveDate: '01 Dec 2025', reasonForChanges: 'original' };

    it('returns false when nothing changed', () => {
      expect(isFormDirty(row, 'yes', new Date(2025, 11, 1), 'original')).toBe(false);
    });

    it('returns true when redirect changed to "no"', () => {
      expect(isFormDirty(row, 'no', new Date(2025, 11, 1), 'original')).toBe(true);
    });

    it('returns true when date changed', () => {
      expect(isFormDirty(row, 'yes', new Date(2025, 11, 2), 'original')).toBe(true);
    });

    it('returns true when reason changed', () => {
      expect(isFormDirty(row, 'yes', new Date(2025, 11, 1), 'new reason')).toBe(true);
    });

    it('returns false when date is null (no date change to compare)', () => {
      expect(isFormDirty(row, 'yes', null, 'original')).toBe(false);
    });

    it('returns false when selectedRow has no reasonForChanges and reason is empty', () => {
      const rowNoReason = { status: 'Migrated', effectiveDate: '01 Dec 2025', reasonForChanges: undefined };
      expect(isFormDirty(rowNoReason, 'yes', new Date(2025, 11, 1), '')).toBe(false);
    });

    it('returns true when selectedRow has no reasonForChanges and reason is non-empty', () => {
      const rowNoReason = { status: 'Migrated', effectiveDate: '01 Dec 2025', reasonForChanges: undefined };
      expect(isFormDirty(rowNoReason, 'yes', new Date(2025, 11, 1), 'added reason')).toBe(true);
    });
  });

  describe('Planned status', () => {
    const row = { status: 'Planned', effectiveDate: '15 Apr 2026', reasonForChanges: '' };

    it('returns false when redirect is "yes" and nothing changed', () => {
      expect(isFormDirty(row, 'yes', new Date(2026, 3, 15), '')).toBe(false);
    });

    it('returns true when redirect changed to "no"', () => {
      expect(isFormDirty(row, 'no', new Date(2026, 3, 15), '')).toBe(true);
    });

    it('returns true when date changed', () => {
      expect(isFormDirty(row, 'yes', new Date(2026, 3, 20), '')).toBe(true);
    });
  });
});
