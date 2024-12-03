import React, { useState } from "react";
import { ButtonSize, Button, ButtonColor } from "@essnextgen/ui-kit";
import "../style.scss";
import { AxiosResponse } from "axios";
import { authService } from "@essnextgen/auth-ui";
import ConfirmDialog from "./ConfirmationDialog.logic";
import { ISchoolNameDataResponse } from "../../../shared/model/SchoolDomain/responsemodels";
import { useFetchSchoolNameData } from "../../../shared/services/schoolDomain/schoolServices";
import { envConfig, getUserOrganisation, service } from "../../../shared/utils";
import { IProcessNGDeletionApiResponse } from "../../../shared/model/RefreshDatabase/responsemodel";

export interface DeleteNGDataViewProps {
  status: (value: string) => string;
  inProgressStatus: (value: string) => string;
  handleException: () => void;  // Handle exception passed from parent
}

const DeleteNGDataView: React.FC<DeleteNGDataViewProps> = ({ status, handleException }) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);

  // Triggering the display of the confirmation dialog
  const handleButtonClick = () => {
    setShowDeleteDialog(true);
  };

  // Closing the confirmation dialog
  const handleCloseDialog = () => {
    setShowDeleteDialog(false);
  };

  // Handling the delete request and updating status accordingly
  const handleDelete = async () => {
    try {
      // Fetch school name
      const schoolData: ISchoolNameDataResponse | null = await useFetchSchoolNameData();
      const orgName: string = schoolData == null ? "" : schoolData.schoolName;

      // Fetch organization ID
      const orgId = getUserOrganisation();

      // Prepare request data
      const requestData = {
        orgId,
        orgName,
        dataDeletedStatus: "N",
        ngDomainDataDeletedBy: authService.getUsername(),
        appCode: "",
        statusMessage: "",
      };

      // Make API call to delete data
      const response: AxiosResponse<IProcessNGDeletionApiResponse> = await service.post(
        `${envConfig.BASE_URL}/TrainingDB/ProcessNGDeletion`,
        requestData
      );

      // Check if the deletion was successful
      if (response.data.statusCode === 200) {
        status("In Progress"); // Update status to 'In Progress'
      } else {
        handleException(); // Call handleException in case of failure
      }
    } catch (error) {
      console.error("Error during deletion", error);
      handleException(); // Trigger exception handling in parent
    } finally {
      // Close the dialog after the action
      handleCloseDialog();
    }
  };

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", marginTop: "8px" }}>
        <Button
          id="btn-proceed"
          className="btn-full-width"
          size={ButtonSize.Small}
          color={ButtonColor.Utility}
          onClick={handleButtonClick} // Show confirmation dialog on button click
        >
          Proceed
        </Button>

        <ConfirmDialog
          isOpen={showDeleteDialog}
          confirmActionButtonText="Delete"
          cancelActionButtonText="Cancel"
          optionalButton={true}
          title="Delete Next Gen Data?"
          onCloseHandle={handleCloseDialog} // Close dialog when cancel button is clicked
          onSubmitHandle={handleDelete} // Trigger deletion when "Delete" is clicked
          description="Deleting the Next gen data will clear all records, and all related data will be gone forever once deleted."
        />
      </div>
    </>
  );
};

export default DeleteNGDataView;
