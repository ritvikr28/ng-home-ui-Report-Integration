import { requiresDate, requiresReason } from './Sims7RedirectionsStatusHelpers';

describe('requiresDate', () => {
  it('returns true for Migrated and redirectToNextGen=no', () => {
    expect(requiresDate('Migrated', 'no')).toBe(true);
  });
  it('returns true for Reversing and redirectToNextGen=no', () => {
    expect(requiresDate('Reversing', 'no')).toBe(true);
  });
  it('returns true for Not migrated and redirectToNextGen=yes', () => {
    expect(requiresDate('Not migrated', 'yes')).toBe(true);
  });
  it('returns true for status not Migrated/Not migrated/Reversing and redirectToNextGen=yes', () => {
    expect(requiresDate('Planned', 'yes')).toBe(true);
  });
  it('returns false for Migrated and redirectToNextGen=yes', () => {
    expect(requiresDate('Migrated', 'yes')).toBe(false);
  });
  it('returns false for Not migrated and redirectToNextGen=no', () => {
    expect(requiresDate('Not migrated', 'no')).toBe(false);
  });
});

describe('requiresReason', () => {
  it('returns true for Migrated and redirectToNextGen=no', () => {
    expect(requiresReason('Migrated', 'no')).toBe(true);
  });
  it('returns true for Reversing and redirectToNextGen=no', () => {
    expect(requiresReason('Reversing', 'no')).toBe(true);
  });
  it('returns true for Not migrated and redirectToNextGen=no', () => {
    expect(requiresReason('Not migrated', 'no')).toBe(true);
  });
  it('returns false for Migrated and redirectToNextGen=yes', () => {
    expect(requiresReason('Migrated', 'yes')).toBe(false);
  });
  it('returns false for Not migrated and redirectToNextGen=yes', () => {
    expect(requiresReason('Not migrated', 'yes')).toBe(false);
  });
  it('returns false for Planned and redirectToNextGen=no', () => {
    expect(requiresReason('Planned', 'no')).toBe(false);
  });
});
