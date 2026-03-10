import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { renderEditFields } from '../Sims7RedirectionsEditFields';

type SelectedRowType = {
  status: string;
  reasonForChanges?: string;
};

interface BaseProps {
  selectedRow: SelectedRowType;
  redirectToNextGen: string;
  effectiveDate: Date;
  reasonForChanges: string;
  dateError: string;
  reasonError: string;
  getDateParts: () => { day: number; month: number; year: number };
  handleDateChange: jest.Mock<any, any>;
  handleValidateDate: jest.Mock<any, any>;
  setReasonForChanges: jest.Mock<any, any>;
  setIsDirty: jest.Mock<any, any>;
  isFormDirty: jest.Mock<boolean, []>;
  t: (key: string) => string;
}

const t = (key: string) => key;

const baseProps: BaseProps = {
  selectedRow: { status: 'Migrated', reasonForChanges: 'reason' },
  redirectToNextGen: 'no',
  effectiveDate: new Date(2026, 0, 21),
  reasonForChanges: 'reason',
  dateError: '',
  reasonError: '',
  getDateParts: () => ({ day: 21, month: 1, year: 2026 }),
  handleDateChange: jest.fn(),
  handleValidateDate: jest.fn(),
  setReasonForChanges: jest.fn(),
  setIsDirty: jest.fn(),
  isFormDirty: jest.fn(() => false),
  t
};

function renderWithFragment(node: React.ReactNode) {
  return render(<>{node}</>);
}

describe('renderEditFields', () => {

  it('renders fields for Migrated & no', () => {

    const { getByText } = renderWithFragment(
      renderEditFields({
        ...baseProps,
        selectedRow: { status: 'Migrated' },
        redirectToNextGen: 'no'
      })
    );

    expect(getByText('SIMS7Redirects.effectiveDate')).toBeInTheDocument();
    expect(getByText('SIMS7Redirects.reasonForChanges')).toBeInTheDocument();

  });

  it('renders fields for Reversing & no', () => {

    const { getByText } = renderWithFragment(
      renderEditFields({
        ...baseProps,
        selectedRow: { status: 'Reversing' },
        redirectToNextGen: 'no'
      })
    );

    expect(getByText('SIMS7Redirects.effectiveDate')).toBeInTheDocument();
    expect(getByText('SIMS7Redirects.reasonForChanges')).toBeInTheDocument();

  });

  it('renders only Effective date for Not migrated & yes', () => {

    const { getByText, queryByText } = renderWithFragment(
      renderEditFields({
        ...baseProps,
        selectedRow: { status: 'Not migrated' },
        redirectToNextGen: 'yes'
      })
    );

    expect(getByText('SIMS7Redirects.effectiveDate')).toBeInTheDocument();
    expect(queryByText('SIMS7Redirects.reasonForChanges')).not.toBeInTheDocument();

  });

  it('renders only Effective date for other statuses & yes', () => {

    const { getByText, queryByText } = renderWithFragment(
      renderEditFields({
        ...baseProps,
        selectedRow: { status: 'Other' },
        redirectToNextGen: 'yes'
      })
    );

    expect(getByText('SIMS7Redirects.effectiveDate')).toBeInTheDocument();
    expect(queryByText('SIMS7Redirects.reasonForChanges')).not.toBeInTheDocument();

  });

  it('renders only Reason for changes for other statuses & no with reason', () => {

    const { getByText, queryByText } = renderWithFragment(
      renderEditFields({
        ...baseProps,
        selectedRow: { status: 'Other', reasonForChanges: 'reason' },
        redirectToNextGen: 'no'
      })
    );

    expect(getByText('SIMS7Redirects.reasonForChanges')).toBeInTheDocument();
    expect(queryByText('SIMS7Redirects.effectiveDate')).not.toBeInTheDocument();

  });

  it('renders null for unmatched conditions', () => {

    const { container } = renderWithFragment(
      renderEditFields({
        ...baseProps,
        selectedRow: { status: 'Other', reasonForChanges: '' },
        redirectToNextGen: 'no'
      })
    );

    expect(container).toBeEmptyDOMElement();

  });

});