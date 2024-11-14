import React from "react";
import {
  ButtonSize,
  GridItem,
  Button,
  ButtonColor
} from "@essnextgen/ui-kit";
import "../style.scss";
import { useEffect, useState } from "react";
import ConfirmDialog from "./ConfirmationDialog.logic";

interface AttachDatabaseViewProps {
  status: (value: string) => void; // Corrected to void
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
    handleCloseDialog();
  };

  useEffect(() => {
    if (showDeleteDialog) {
      // Call status when showDeleteDialog is set to true
      status("syncing");
    }
  }, [showDeleteDialog, status]);

  return (
    <>
      <GridItem sm={12}>
        <p className="label-height">
          Data sync will be completed by 1 time tomorrow
        </p>
        <Button
          id="btn-sync"
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
            title="Data Sync in progress"
            onCloseHandle={handleCloseDialog}
            onSubmitHandle={handleDelete}
            description="SIMS7 data is currently syncing with Next Gen database. This process can't be stopped once started."
          />
        )}
      </GridItem>
    </>
  );
};

export default SyncDataView;
