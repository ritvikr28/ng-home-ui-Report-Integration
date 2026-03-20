import {
  handleCancel,
  handleCancelConfirm,
  handleCancelDialogClose
} from '../Sims7RedirectionsSidePanelCancel.logic';

describe('handleCancel', () => {
  it('should call setShowCancelDialog(true) if isDirty', () => {
    const setShowCancelDialog = jest.fn();
    const onClose = jest.fn();
    handleCancel(true, setShowCancelDialog, onClose);
    expect(setShowCancelDialog).toHaveBeenCalledWith(true);
    expect(onClose).not.toHaveBeenCalled();
  });

  it('should call onClose if not isDirty', () => {
    const setShowCancelDialog = jest.fn();
    const onClose = jest.fn();
    handleCancel(false, setShowCancelDialog, onClose);
    expect(setShowCancelDialog).not.toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });
});

describe('handleCancelConfirm', () => {
  it('should reset state and call onClose', () => {
    const setIsDirty = jest.fn();
    const setShowCancelDialog = jest.fn();
    const setReasonForChanges = jest.fn();
    const setReasonError = jest.fn();
    const setDateError = jest.fn();
    const onClose = jest.fn();
    const selectedRow = { reasonForChanges: 'test reason' };

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
    expect(setReasonForChanges).toHaveBeenCalledWith('test reason');
    expect(setReasonError).toHaveBeenCalledWith('');
    expect(setDateError).toHaveBeenCalledWith('');
    expect(onClose).toHaveBeenCalled();
  });

  it('should set reasonForChanges to empty string if not present', () => {
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

  it('should set reasonForChanges to empty string if selectedRow is undefined', () => {
    const setIsDirty = jest.fn();
    const setShowCancelDialog = jest.fn();
    const setReasonForChanges = jest.fn();
    const setReasonError = jest.fn();
    const setDateError = jest.fn();
    const onClose = jest.fn();
    handleCancelConfirm({
      setIsDirty,
      setShowCancelDialog,
      setReasonForChanges,
      selectedRow: undefined,
      setReasonError,
      setDateError,
      onClose
    });
    expect(setReasonForChanges).toHaveBeenCalledWith('');
  });
});

describe('handleCancelDialogClose', () => {
  it('should call setShowCancelDialog(false)', () => {
    const setShowCancelDialog = jest.fn();
    handleCancelDialogClose(setShowCancelDialog);
    expect(setShowCancelDialog).toHaveBeenCalledWith(false);
  });
});
