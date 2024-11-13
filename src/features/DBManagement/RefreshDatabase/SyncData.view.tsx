import {
  ButtonSize,
  GridItem,
  HeadingSubHeading,
  ReactionButtonGroup,
  ReactionButton,
  Button,
  FormLabel,
  ButtonColor
} from "@essnextgen/ui-kit";
import "../style.scss";
import ConfirmDialog from "./ConfirmationDialog.logic";
import { useEffect, useState } from "react";

interface AttachDatabaseViewProps {
  status: (value: string) => string; // Add status prop
}
const SyncDataView: React.FC<AttachDatabaseViewProps> = ({ status }) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const handleButtonClick = () => {
    setShowDeleteDialog(true); // Show the component
  };

  const handleCloseDialog = () => {
    setShowDeleteDialog(false);
    status("true");
  };

  const handleDelete = () => {
    // Perform delete action here
    // After deletion, call status
    handleCloseDialog();
  };

  useEffect(() => {
    if (showDeleteDialog) {
      //status(); // Call status when showDeleteDialog is set to true
    }
  }, [showDeleteDialog, status]);

  return (
    <>
      <GridItem sm={12}>
        <p className="label-height">
          Data sync will be completed by {1} time tomorrow
        </p>
        <Button
          id="btn-sync"
          //dataTestId="add-id"
          className="btn-full-width"
          size={ButtonSize.Small}
          color={ButtonColor.Utility}
          onClick={handleButtonClick}
        >
          Sync
        </Button>
        {showDeleteDialog && (
          <ConfirmDialog
            confirmActionButtonText="Close"
            title={"Data Sync in progress"}
            onCloseHandle={handleCloseDialog}
            onSubmitHandle={handleDelete}
            description={
              "SIMS7 data is currently syncing with Next Gen database. This process can't be stopped once started."
            }
          />
        )}
      </GridItem>
    </>
  );
};

export default SyncDataView;
