import React from "react";
import { Button, Dialog, DialogContent, DialogFooter, NotificationStatus, Notification, Loader, LoaderType } from "@essnextgen/ui-kit";
// import './style.scss'

interface INoSelectionDialogProps {
  setShowDialog: React.Dispatch<React.SetStateAction<boolean>>;
  message?: string;
  title?: string;
  notificationTitle?: string;
  loading?: boolean;
}

const NoSelectionDialog = (props: INoSelectionDialogProps) => {
  const { setShowDialog, message, title, notificationTitle, loading } = props;
  if (loading) {
  return (
    <Dialog
      dataTestId="test-id"
      id="no-selection-dialog-id"
      onClose={() => setShowDialog(false)}
      className="no-selection-dialog-footer"
    >
      <DialogContent>
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <Loader loaderType={LoaderType.Circular} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
  return (
    <Dialog
      dataTestId="test-id"
      id="no-selection-dialog-id"
      title={title}
      onClose={() => setShowDialog(false)}
      className="no-selection-dialog-footer"
    >
      {notificationTitle && (
        <Notification
          status={NotificationStatus.WARNING}
          title={notificationTitle}
          hideCloseButton
        />
      )}
      <DialogContent>
        {message}
      </DialogContent>
      <DialogFooter>
        <Button dataTestId="close-btn" onClick={() => setShowDialog(false)}>
          Okay
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

NoSelectionDialog.defaultProps = {
  message: "",
  title: "",
  notificationTitle: "",
  loading: false,
};

export default NoSelectionDialog;