import React, { useEffect, useState } from "react";
import {
  ButtonSize,
  GridItem,
  Button,
  ButtonColor
} from "@essnextgen/ui-kit";
import "../style.scss";

import ConfirmDialog from "./ConfirmationDialog.logic";
import { service } from "../../../shared/utils";

export const FetchIsDeleted: () => Promise<string> = async () =>
  (await service.get("http://localhost:5010/api/v1/quicklink/IsDeleted?isDeleted=false")).data;

interface DeleteNGDataViewProps {
  status: (value: string) => string; // Status prop with return type string
}

const DeleteNGDataView: React.FC<DeleteNGDataViewProps> = ({ status }) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isActive, setActive] = useState(false);

  const handleButtonClick = () => {
    setShowDeleteDialog(true);
    setActive(true);
  };

  const handleCloseDialog = () => {
    setShowDeleteDialog(false);
    setActive(true);
    if (!isActive) {
      status("In Progress");
    }
  };

  const handleDelete = async () => {
    setActive(false);
    handleCloseDialog();
    try {
      const response = await FetchIsDeleted();
      if (response) {
        status(response);
      } else {
        console.error("Failed to fetch data");
      }
    } catch (error) {
      console.error("Failed to fetch deleted status:", error);
    }
  };

  useEffect(() => {
    if (showDeleteDialog) {
      status("syncing");
    }
  }, [showDeleteDialog, status]);

  return (
    <>
      <GridItem sm={12}>
        <div style={{ display: "flex", alignItems: "center", marginTop: "8px" }}>
          <Button
            id="btn-sync"
            // type="button" // Added type attribute
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
