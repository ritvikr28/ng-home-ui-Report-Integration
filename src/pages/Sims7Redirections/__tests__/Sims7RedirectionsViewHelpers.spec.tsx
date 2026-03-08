import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { getStatusTagColor, ModifiedByField, EffectiveDateField, ReasonForChangesField, EditButton, getRedirectToNextGenText } from '../Sims7RedirectionsViewHelpers';

describe('getStatusTagColor', () => {
  it('returns Success for Permanent', () => {
    expect(getStatusTagColor('Permanent')).toBe('success');
  });
  it('returns Success for Migrated', () => {
    expect(getStatusTagColor('Migrated')).toBe('success');
  });
  it('returns Neutral for Not migrated', () => {
    expect(getStatusTagColor('Not migrated')).toBe('neutral');
  });
  it('returns Outstanding for Planned', () => {
    expect(getStatusTagColor('Planned')).toBe('outstanding');
  });
  it('returns Outstanding for Reversing', () => {
    expect(getStatusTagColor('Reversing')).toBe('outstanding');
  });
  it('returns Neutral for unknown', () => {
    expect(getStatusTagColor('Other')).toBe('neutral');
  });
});

describe('ModifiedByField', () => {
  it('renders Modified by if value is not dash', () => {
    render(<ModifiedByField modifiedBy="John Doe" />);
    expect(screen.getByText('Modified by')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
  it('renders nothing if value is dash', () => {
    const { container }: { container: HTMLElement } = render(<ModifiedByField modifiedBy="-" />);
    expect(container).toBeEmptyDOMElement();
  });
});

describe('EffectiveDateField', () => {
  it('renders Effective date if value is present and not dash', () => {
    render(<EffectiveDateField status="Migrated" effectiveDate="01 Jan 2026" />);
    expect(screen.getByText('Effective date')).toBeInTheDocument();
    expect(screen.getByText('01 Jan 2026')).toBeInTheDocument();
  });
  it('renders nothing if value is dash', () => {
    const { container }: { container: HTMLElement } = render(<EffectiveDateField status="Migrated" effectiveDate="-" />);
    expect(container).toBeEmptyDOMElement();
  });
  it('renders nothing if value is empty string', () => {
    const { container }: { container: HTMLElement } = render(<EffectiveDateField status="Migrated" effectiveDate="" />);
    expect(container).toBeEmptyDOMElement();
  });
});

describe('ReasonForChangesField', () => {
  it('renders Reason for changes if value is present', () => {
    render(<ReasonForChangesField reasonForChanges="Some reason" />);
    expect(screen.getByText('Reason for changes')).toBeInTheDocument();
    expect(screen.getByText('Some reason')).toBeInTheDocument();
  });
  it('renders nothing if value is empty', () => {
    const { container }: { container: HTMLElement } = render(<ReasonForChangesField reasonForChanges="" />);
    expect(container).toBeEmptyDOMElement();
  });
});

describe('EditButton', () => {
  const t: (key: string) => string = (key: string) => key;
  it('renders Edit button if status is not Permanent', () => {
    const setSidePanelMode: jest.Mock<any, any> = jest.fn();
    render(<EditButton status="Migrated" t={t} setSidePanelMode={setSidePanelMode} />);
    expect(screen.getByText('UI_KIT_EditableSectionEditBtnText')).toBeInTheDocument();
    fireEvent.click(screen.getByText('UI_KIT_EditableSectionEditBtnText'));
    expect(setSidePanelMode).toHaveBeenCalledWith('edit');
  });
  it('renders nothing if status is Permanent', () => {
    const setSidePanelMode: jest.Mock<any, any> = jest.fn();
    const { container }: { container: HTMLElement } = render(<EditButton status="Permanent" t={t} setSidePanelMode={setSidePanelMode} />);
    expect(container).toBeEmptyDOMElement();
  });
});

describe('getRedirectToNextGenText', () => {
  it('returns Yes for migrated', () => {
    expect(getRedirectToNextGenText('migrated')).toBe('Yes');
  });
  it('returns Yes for permanent', () => {
    expect(getRedirectToNextGenText('permanent')).toBe('Yes');
  });
  it('returns Yes for planned', () => {
    expect(getRedirectToNextGenText('planned')).toBe('Yes');
  });
  it('returns No for undefined', () => {
    expect(getRedirectToNextGenText(undefined)).toBe('No');
  });
  it('returns No for not migrated', () => {
    expect(getRedirectToNextGenText('not migrated')).toBe('No');
  });
  it('returns No for random status', () => {
    expect(getRedirectToNextGenText('random')).toBe('No');
  });
});
