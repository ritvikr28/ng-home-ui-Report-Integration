import {
  handleCancel,
  handleCancelConfirm,
  handleCancelDialogClose
} from './Sims7RedirectionsSidePanelCancel.logic';

describe('handleCancel', () => {
  it('shows cancel dialog if form is dirty', () => {
    const setShowCancelDialog = jest.fn();
    const onClose = jest.fn();
    handleCancel(true, setShowCancelDialog, onClose);
    expect(setShowCancelDialog).toHaveBeenCalledWith(true);
    expect(onClose).not.toHaveBeenCalled();
  });

  it('calls onClose if form is not dirty', () => {
    const setShowCancelDialog = jest.fn();
    const onClose = jest.fn();
    handleCancel(false, setShowCancelDialog, onClose);
    expect(setShowCancelDialog).not.toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });
});

describe('handleCancelConfirm', () => {
  it('resets state and closes dialog', () => {
    const setIsDirty = jest.fn();
    const setShowCancelDialog = jest.fn();
    const setReasonForChanges = jest.fn();
    const setReasonError = jest.fn();
    const setDateError = jest.fn();
    const onClose = jest.fn();
    const selectedRow = { reasonForChanges: 'Test reason' };

    handleCancelConfirm({
      setIsDirty,
      setShowCancelDialog,
      setReasonForChanges,
      selectedRow,
      setReasonError,
      setDateError,
      onClose
    });

    expect(setIsDirty).toHaveBeenCalledWith(false);
    expect(setShowCancelDialog).toHaveBeenCalledWith(false);
    expect(setReasonForChanges).toHaveBeenCalledWith('Test reason');
    expect(setReasonError).toHaveBeenCalledWith('');
    expect(setDateError).toHaveBeenCalledWith('');
    expect(onClose).toHaveBeenCalled();
  });

  it('sets empty reason if selectedRow.reasonForChanges is undefined', () => {
    const setIsDirty = jest.fn();
    const setShowCancelDialog = jest.fn();
    const setReasonForChanges = jest.fn();
    const setReasonError = jest.fn();
    const setDateError = jest.fn();
    const onClose = jest.fn();
    const selectedRow = {};

    handleCancelConfirm({
      setIsDirty,
      setShowCancelDialog,
      setReasonForChanges,
      selectedRow,
      setReasonError,
      setDateError,
      onClose
    });

    expect(setReasonForChanges).toHaveBeenCalledWith('');
  });
});

describe('handleCancelDialogClose', () => {
  it('closes cancel dialog', () => {
    const setShowCancelDialog = jest.fn();
    handleCancelDialogClose(setShowCancelDialog);
    expect(setShowCancelDialog).toHaveBeenCalledWith(false);
  });
});

describe('handleCancelConfirm branch coverage', () => {
  it('covers selectedRow?.reasonForChanges undefined', () => {
    const setReasonForChanges = jest.fn();
    handleCancelConfirm({
      setIsDirty: jest.fn(),
      setShowCancelDialog: jest.fn(),
      setReasonForChanges,
      selectedRow: {}, // reasonForChanges is undefined
      setReasonError: jest.fn(),
      setDateError: jest.fn(),
      onClose: jest.fn()
    });
    expect(setReasonForChanges).toHaveBeenCalledWith('');
  });

  it('covers selectedRow?.reasonForChanges defined', () => {
    const setReasonForChanges = jest.fn();
    handleCancelConfirm({
      setIsDirty: jest.fn(),
      setShowCancelDialog: jest.fn(),
      setReasonForChanges,
      selectedRow: { reasonForChanges: 'Some reason' },
      setReasonError: jest.fn(),
      setDateError: jest.fn(),
      onClose: jest.fn()
    });
    expect(setReasonForChanges).toHaveBeenCalledWith('Some reason');
  });
});
