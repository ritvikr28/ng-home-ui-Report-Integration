import React from "react";
import { Button, Dialog, DialogContent, DialogFooter} from "@essnextgen/ui-kit";
// import './style.scss'

interface INoSelectionDialogProps {
  setShowDialog: React.Dispatch<React.SetStateAction<boolean>>;
  message?: string;
}

const NoSelectionDialog = (props: INoSelectionDialogProps) => {
    const { setShowDialog, message } = props;
    return(
        <Dialog
            dataTestId="test-id"
            id="no-selection-dialog-id"
            title="No items selected"
            onClose={() => setShowDialog(false)}
            className="no-selection-dialog-footer"
            >
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