import { render, screen, fireEvent } from '@testing-library/react';
import { Sims7RedirectionsPanelContent, Sims7RedirectionsPanelFooter } from '../Sims7RedirectionsPanelParts';

const requiredContentProps = {
  mode: 'view' as 'view' | 'edit',
  viewLoading: false,
  viewData: null,
  t: (key: string) => key,
  setSidePanelMode: jest.fn(),
  selectedRow: { status: 'Migrated', effectiveDate: '2025-12-01', reasonForChanges: 'Initial migration', modifiedBy: 'John Doe' },
  redirectToNextGen: '',
  effectiveDate: null,
  reasonForChanges: '',
  dateError: '',
  reasonError: '',
  getDateParts: () => ({}),
  onRedirectToNextGenChange: jest.fn(),
  onDateChange: jest.fn(),
  onValidateDate: jest.fn(),
  setReasonForChanges: jest.fn(),
  setIsDirty: jest.fn(),
  isFormDirty: () => false,
  showFailureBanner: false,
  showSuccessToast: false,
  showCancelDialog: false,
  onCancelDialogClose: jest.fn(),
  onCancelConfirm: jest.fn(),
};

describe('Sims7RedirectionsPanelContent', () => {

  it('handles missing selectedRow gracefully', () => {
    render(<Sims7RedirectionsPanelContent {...requiredContentProps} selectedRow={undefined as any} />);
  });

  it('renders edit mode', () => {
    render(<Sims7RedirectionsPanelContent {...requiredContentProps} mode="edit" />);
    // Add assertions for edit mode fields if needed
  });
});

const requiredFooterProps = {
  mode: 'edit' as 'edit' | 'view',
  t: (key: string) => key,
  onClose: jest.fn(),
  onCancel: jest.fn(),
  onSave: jest.fn(),
};

describe('Sims7RedirectionsPanelFooter', () => {
  it('renders Save and Cancel buttons in edit mode', () => {
    render(<Sims7RedirectionsPanelFooter {...requiredFooterProps} />);
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  it('calls onSave when Save is clicked', () => {
    render(<Sims7RedirectionsPanelFooter {...requiredFooterProps} />);
    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    expect(requiredFooterProps.onSave).toHaveBeenCalled();
  });
});
