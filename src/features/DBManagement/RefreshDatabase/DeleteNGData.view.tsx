import React, { useState } from "react";
import { ButtonSize, Button, ButtonColor } from "@essnextgen/ui-kit";
import "../style.scss";
import ConfirmDialog from "./ConfirmationDialog.logic";
import { ISchoolNameDataResponse } from "../../../shared/model/SchoolDomain/responsemodels";
import { useFetchSchoolNameData } from "../../../shared/services/schoolDomain/schoolServices";
import { envConfig, getUserOrganisation, service } from "../../../shared/utils";
import { IPrecheckStatusApiResponse, IProcessNGDeletionApiResponse } from "../../../shared/model/RefreshDatabase/responsemodel";
import { AxiosResponse } from "axios";
import { authService } from "@essnextgen/auth-ui";

export interface DeleteNGDataViewProps {
  status: (value: string) => string; // Add status prop
}

const DeleteNGDataView: React.FC<DeleteNGDataViewProps> = ({ status }) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  const [isActive, setActive] = useState<boolean>(false);

  const handleButtonClick = () => {
    setShowDeleteDialog(true);
    setActive(true);
  };

  const handleCloseDialog = () => {
    setShowDeleteDialog(false);
    setActive(false); // Reset active state
  };

  const handleDelete = async () => {
    try {
      // Fetch school name
      const schoolData: ISchoolNameDataResponse | null = await useFetchSchoolNameData();
      const orgName: string = schoolData == null ? "" : schoolData.schoolName;

      // Fetch precheck status
      const orgId = getUserOrganisation();
      // const precheckResponse: AxiosResponse<IPrecheckStatusApiResponse> = await service.get(
      //   `${envConfig.BASE_URL}/TrainingDB/PreCheckStatus/${orgId}/${orgName}`
      // );

      // const precheckData = precheckResponse.data;

      // Prepare request data
      const requestData = {
        orgId,
        orgName,
        dataDeletedStatus: "N",
        ngDomainDataDeletedBy: authService.getUsername(),
        appCode: "",
        statusMessage: "",
      };

      // Submit deletion request
      const response: AxiosResponse<IProcessNGDeletionApiResponse> = await service.post(
        `${envConfig.BASE_URL}/TrainingDB/ProcessNGDeletion`,
        requestData
      );

      if (response.status === 200) {
        status("In Progress"); // Update status only on successful response
        setActive(false);
      } else {
        status("Failed");
        setActive(true);
      }
    } catch (error) {
     
    } finally {
      
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
          onClick={handleButtonClick}
        >
          Proceed
        </Button>
        <ConfirmDialog
          isOpen={showDeleteDialog}
          confirmActionButtonText="Delete"
          cancelActionButtonText="Cancel"
          optionalButton={true}
          title="Delete Next Gen Data?"
          onCloseHandle={handleCloseDialog}
          onSubmitHandle={handleDelete}
          description="Deleting the Next gen data will clear all records and all related data will be gone forever once deleted."
        />
      </div>
    </>
  );
};

export default DeleteNGDataView;