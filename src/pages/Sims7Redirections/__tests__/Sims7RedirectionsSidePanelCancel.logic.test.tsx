import { handleCancel, handleCancelConfirm, handleCancelDialogClose, HandleCancelConfirmParams } from '../Sims7RedirectionsSidePanelCancel.logic';

describe('Sims7RedirectionsSidePanelCancel.logic', () => {
  describe('handleCancel', () => {
    it('should show cancel dialog if dirty', () => {
      const setShowCancelDialog = jest.fn();
      const onClose = jest.fn();
      handleCancel(true, setShowCancelDialog, onClose);
      expect(setShowCancelDialog).toHaveBeenCalledWith(true);
      expect(onClose).not.toHaveBeenCalled();
    });
    it('should call onClose if not dirty', () => {
      const setShowCancelDialog = jest.fn();
      const onClose = jest.fn();
      handleCancel(false, setShowCancelDialog, onClose);
      expect(onClose).toHaveBeenCalled();
      expect(setShowCancelDialog).not.toHaveBeenCalledWith(true);
    });
  });

  describe('handleCancelConfirm', () => {
    function getParams(selectedRow: any = { reasonForChanges: 'abc' }) {
      return {
        setIsDirty: jest.fn(),
        setShowCancelDialog: jest.fn(),
        setReasonForChanges: jest.fn(),
        selectedRow,
        setReasonError: jest.fn(),
        setDateError: jest.fn(),
        onClose: jest.fn(),
      } as HandleCancelConfirmParams;
    }
    it('should reset dirty state, hide dialog, reset reason, errors, and call onClose', () => {
      const params = getParams({ reasonForChanges: 'abc' });
      handleCancelConfirm(params);
      expect(params.setIsDirty).toHaveBeenCalledWith(false);
      expect(params.setShowCancelDialog).toHaveBeenCalledWith(false);
      expect(params.setReasonForChanges).toHaveBeenCalledWith('abc');
      expect(params.setReasonError).toHaveBeenCalledWith('');
      expect(params.setDateError).toHaveBeenCalledWith('');
      expect(params.onClose).toHaveBeenCalled();
    });
    it('should set reason to empty string if selectedRow.reasonForChanges is undefined', () => {
      const params = getParams({});
      handleCancelConfirm(params);
      expect(params.setReasonForChanges).toHaveBeenCalledWith('');
    });
  });

  describe('handleCancelDialogClose', () => {
    it('should hide cancel dialog', () => {
      const setShowCancelDialog = jest.fn();
      handleCancelDialogClose(setShowCancelDialog);
      expect(setShowCancelDialog).toHaveBeenCalledWith(false);
    });
  });
});
