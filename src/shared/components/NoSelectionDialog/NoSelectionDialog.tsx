import React from "react";
import { Button, Dialog, DialogContent, DialogFooter, NotificationStatus } from "@essnextgen/ui-kit";
import { Notification } from "@essnextgen/ui-kit"; // Ensure Notification is imported as a React component
// import './style.scss'

interface INoSelectionDialogProps {
  setShowDialog: React.Dispatch<React.SetStateAction<boolean>>;
  message?: string;
  title?: string;
  notificationTitle?: string;
}

const NoSelectionDialog = (props: INoSelectionDialogProps) => {
    const { setShowDialog, message, title, notificationTitle } = props;
    return(
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
    )
}

NoSelectionDialog.defaultProps = {
  message: "", 
};


export default NoSelectionDialog;