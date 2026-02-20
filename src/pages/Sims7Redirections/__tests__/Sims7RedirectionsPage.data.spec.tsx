import React from 'react';
import {
  sims7RedirectionsTableHeaders
} from '../Sims7RedirectionsPage.data';

describe('sims7RedirectionsTableHeaders', () => {
  it('should contain expected columns', () => {
  const headerTexts: string[] = sims7RedirectionsTableHeaders.map((h: { text: string }) => h.text);
    expect(headerTexts).toEqual(
      expect.arrayContaining([
        'ID',
        'Category',
        'Next Gen module',
        'SIMS 7 module',
        'Modified by',
        'Effective date',
        'Status',
        'Reason for changes'
      ])
    );
  });

  it('should have Next Gen module with anyComponent function', () => {
  const nextGenHeader: typeof sims7RedirectionsTableHeaders[number] | undefined = sims7RedirectionsTableHeaders.find((h: { text: string }) => h.text === 'Next Gen module');
    expect(nextGenHeader).toBeDefined();
    expect(typeof nextGenHeader?.anyComponent).toBe('function');
    // Test the component rendering logic
  const short: React.ReactNode | undefined = nextGenHeader && nextGenHeader.anyComponent ? nextGenHeader.anyComponent('Short Name') : undefined;
  const long: React.ReactNode | undefined = nextGenHeader && nextGenHeader.anyComponent ? nextGenHeader.anyComponent('This is a very long module name for testing') : undefined;
  expect(short).toBeTruthy();
  expect(long).toBeTruthy();
  });

  it('should return null from anyComponent if value is falsy', () => {
  const nextGenHeader: typeof sims7RedirectionsTableHeaders[number] | undefined = sims7RedirectionsTableHeaders.find((h: { text: string }) => h.text === 'Next Gen module');
    expect(nextGenHeader).toBeDefined();
  expect(nextGenHeader && nextGenHeader.anyComponent ? nextGenHeader.anyComponent('') : undefined).toBeNull();
  expect(nextGenHeader && nextGenHeader.anyComponent ? nextGenHeader.anyComponent(null as any) : undefined).toBeNull();
  expect(nextGenHeader && nextGenHeader.anyComponent ? nextGenHeader.anyComponent(undefined as any) : undefined).toBeNull();
  });

  it('should have Status column with statusColors', () => {
  const statusHeader: typeof sims7RedirectionsTableHeaders[number] | undefined = sims7RedirectionsTableHeaders.find((h: { text: string }) => h.text === 'Status');
    expect(statusHeader?.statusColors).toBeDefined();
    expect(statusHeader?.statusColors?.Migrated).toBeDefined();
  });
});

