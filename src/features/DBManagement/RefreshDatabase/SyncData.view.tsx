import React, { useState } from "react";
import { ButtonSize, GridItem, Button, ButtonColor } from "@essnextgen/ui-kit";
import "../style.scss";
import ConfirmDialog from "./ConfirmationDialog.logic";

export interface AttachDatabaseViewProps {
  status: (value: string) => string; // Add status prop
}
const SyncDataView: React.FC<AttachDatabaseViewProps> = ({ status }) => {
  const [showSyncDialog, setShowSyncDialog]: [
    boolean,
    React.Dispatch<React.SetStateAction<boolean>>
  ] = useState<boolean>(false);

  const handleButtonClick: () => void = () => {
    setShowSyncDialog(true); // Show the component
  };

  const handleCloseDialog: () => void = () => {
    setShowSyncDialog(false);
    status("true");
  };

  const handleDelete: () => void = () => {
    handleCloseDialog();
  };

  return (
    <>
      <GridItem sm={12}>
        <p className="label-height">
          Data sync will be completed by {1} time tomorrow
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
        <ConfirmDialog
          isOpen={showSyncDialog}
          confirmActionButtonText="Close"
          title="Data Sync in progress"
          onCloseHandle={handleCloseDialog}
          onSubmitHandle={handleDelete}
          description="SIMS7 data is currently syncing with Next Gen database. This process can't be stopped once started."
        />
      </GridItem>
    </>
  );
};
export default SyncDataView;
