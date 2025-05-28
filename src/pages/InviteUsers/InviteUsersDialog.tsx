import React from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter
} from "@essnextgen/ui-kit";
import './style.scss'

interface IInviteUsersDialogProps {
  setShowDialog: React.Dispatch<React.SetStateAction<boolean>>;
}

const InviteUsersDialog = (props: IInviteUsersDialogProps) => {
  const { setShowDialog } = props;
  return (
    <Dialog
      dataTestId="test-id"
      id="invite-user-element-id"
      title="No items selected"
      onClose={() => setShowDialog(false)}
      className="invite-user-dialog-footer"
    >
      <DialogContent>
        Please select at least one item from the search results to perform the
        action.
      </DialogContent>
      <DialogFooter>
        <Button dataTestId="close-btn" onClick={() => setShowDialog(false)}>
          Okay
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default InviteUsersDialog;
