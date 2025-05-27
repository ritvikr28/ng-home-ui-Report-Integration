import React from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter
} from "@essnextgen/ui-kit";

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
    >
      <DialogContent>
        Please select at least one item from the search results to perform the
        action.
      </DialogContent>
      <DialogFooter className="invite-user-dialog-okay-btn">
        <Button dataTestId="close-btn" onClick={() => setShowDialog(false)}>
          Okay
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default InviteUsersDialog;
