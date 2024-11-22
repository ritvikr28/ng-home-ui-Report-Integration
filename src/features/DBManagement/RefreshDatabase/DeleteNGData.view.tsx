import React, { useState } from "react";
import { ButtonSize, GridItem, Button, ButtonColor } from "@essnextgen/ui-kit";
import "../style.scss";
import ConfirmDialog from "./ConfirmationDialog.logic";

export interface DeleteNGDataViewProps {
  status: (value: string) => string; // Add status prop
}

const DeleteNGDataView: React.FC<DeleteNGDataViewProps> = ({ status }) => {
  const [showDeleteDialog, setShowDeleteDialog]: [
    boolean,
    React.Dispatch<React.SetStateAction<boolean>>
  ] = useState<boolean>(false);

  const [isActive, setActive]: [
    boolean,
    React.Dispatch<React.SetStateAction<boolean>>
  ] = useState<boolean>(false);

  const handleButtonClick: () => void = () => {
    setShowDeleteDialog(true);
    setActive(true); // Show the component
  };

  const handleCloseDialog: () => void = () => {
    setShowDeleteDialog(false);
    setActive(true);
    if (!isActive) {
      status("In Progress");
    }
  };

  const handleDelete: () => void = () => {
    setActive(false);
    handleCloseDialog();
  };

  return (
    <>
      <GridItem sm={12}>
        <div
          style={{ display: "flex", alignItems: "center", marginTop: "8px" }}
        >
          <Button
            id="btn-sync"
            className="btn-full-width"
            size={ButtonSize.Small}
            color={ButtonColor.Utility}
            onClick={handleButtonClick}
          >
            Proceed
          </Button>
          {showDeleteDialog && (
            <ConfirmDialog
              confirmActionButtonText="Delete"
              cancelActionButtonText="Cancel"
              optionalButton={true}
              title="Delete Next Gen Data?"
              onCloseHandle={handleCloseDialog}
              onSubmitHandle={handleDelete}
              description="Deleting the Next gen data will clear all records and all related data will be gone forever once deleted."
            />
          )}
        </div>
      </GridItem>
    </>
  );
};

export default DeleteNGDataView;
