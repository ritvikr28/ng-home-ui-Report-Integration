import React from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter
} from "@essnextgen/ui-kit";
import "./style.scss";
import {
  useTranslation,
  UseTranslationResponse
} from "@essnextgen/ui-intl-kit";

interface IInviteUsersDialogProps {
  setShowDialog: React.Dispatch<React.SetStateAction<boolean>>;
}

const InviteUsersDialog: (props: IInviteUsersDialogProps) => JSX.Element = (props: IInviteUsersDialogProps) => {
  const { t }: UseTranslationResponse<"translation", undefined> =
    useTranslation();
  const { setShowDialog }: { setShowDialog: React.Dispatch<React.SetStateAction<boolean>> } = props;
  return (
    <Dialog
      dataTestId="test-id"
      id="invite-user-element-id"
      title={`${t("invitePerson.noItemsSelected")}`}
      onClose={() => setShowDialog(false)}
      className="invite-user-dialog-footer"
    >
      <DialogContent>
        {`${t("invitePerson.selectAtLeastOneItem")}`}
      </DialogContent>
      <DialogFooter>
        <Button dataTestId="close-btn" onClick={() => setShowDialog(false)}>
          {`${t("invitePerson.okay")}`}
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default InviteUsersDialog;
