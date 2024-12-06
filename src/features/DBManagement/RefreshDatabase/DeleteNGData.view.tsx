import React, { useState } from "react";
import { ButtonSize, Button, ButtonColor } from "@essnextgen/ui-kit";
import "../style.scss";
import { AxiosResponse } from "axios";
import { authService } from "@essnextgen/auth-ui";
import ConfirmDialog from "./ConfirmationDialog.logic";
import { ISchoolNameDataResponse } from "../../../shared/model/SchoolDomain/responsemodels";
import { useFetchSchoolNameData } from "../../../shared/services/schoolDomain/schoolServices";
import { envConfig, getUserOrganisation, service } from "../../../shared/utils";
import {
  IPrecheckStatusApiResponse,
  IProcessNGDeletionApiResponse
} from "../../../shared/model/RefreshDatabase/responsemodel";

export interface DeleteNGDataViewProps {
  status: (value: string) => void;
  inProgressStatus: (value: string) => void;
  handleException: () => void;
}

const DeleteNGDataView: React.FC<DeleteNGDataViewProps> = ({
  status,
  inProgressStatus,
  handleException,
}) => {
  const [showDeleteDialog, setShowDeleteDialog]: [
    boolean,
    React.Dispatch<React.SetStateAction<boolean>>
  ] = useState<boolean>(false);
  const [showInProgressDialog, setShowInProgressDialog]: [
    boolean,
    React.Dispatch<React.SetStateAction<boolean>>
  ] = useState<boolean>(false);
  const [isProceedDisabled, setIsProceedDisabled]: [
    boolean,
    React.Dispatch<React.SetStateAction<boolean>>
  ] = useState<boolean>(false);// New state for button disabling

  const FetchPreCheckStatus : () => Promise<string|null> = async () => {
    try {
      const schoolData: ISchoolNameDataResponse | null = await useFetchSchoolNameData();
      const orgName: string = schoolData?.schoolName ?? "";
      const orgId: string = getUserOrganisation();

      const response: AxiosResponse<IPrecheckStatusApiResponse> = await service.get(
        `${envConfig.BASE_URL}/TrainingDB/PreCheckStatus/${orgId}?orgName=${orgName}`
      );
      return response?.data?.deleteNGDataStatus?? "";
    } catch (error) {
      console.error("Failed to fetch the status:", error);
      handleException();
      return null;
    }
  };

  const handleButtonClick :() => Promise<void> = async () => {
    try {
      const precheckStatus = await FetchPreCheckStatus();

      if (precheckStatus === "In Progress") {
        inProgressStatus("In Progress");
        setShowInProgressDialog(true);
      } else if (precheckStatus !== "Deleted") {
        setShowDeleteDialog(true);
        setShowInProgressDialog(false);
      } else if (precheckStatus === "Deleted") {
        setShowDeleteDialog(false);
        setShowInProgressDialog(false);
        setIsProceedDisabled(true); // Disable the button
        status("Deleted");

      } else {
        console.warn("Unexpected precheck status:", precheckStatus);
      }
    } catch (error) {
      console.error("Error while checking status:", error);
      handleException();
    }
  };

  const handleCloseDialog :() => void = () => {
    setShowDeleteDialog(false);
    setShowInProgressDialog(false);
  };

  const handleDelete :() => Promise<void> = async ()  => {
    try {
      const schoolData: ISchoolNameDataResponse | null = await useFetchSchoolNameData();
     // Prepare request data
     const requestData: {
      orgId: string,
      orgName: string,
      dataDeletedStatus:string,
      ngDomainDataDeletedBy: string,
      appCode:string,
      statusMessage: string
    } = {
      orgId: getUserOrganisation(),
        orgName: schoolData == null ? "" : schoolData.schoolName,
        dataDeletedStatus: "N",
        ngDomainDataDeletedBy: authService.getUsername(),
        appCode: "",
        statusMessage: ""
    };

      const response: AxiosResponse<IProcessNGDeletionApiResponse> = await service.post(
        `${envConfig.BASE_URL}/TrainingDB/ProcessNGDeletion`,
        requestData
      );

      if (response.data.statusCode === 200) {
        inProgressStatus("In Progress");
      } else {
        console.error("Unexpected response during deletion:", response.data);
        handleException();
      }
    } catch (error) {
      console.error("Error during deletion:", error);
      handleException();
    } finally {
      handleCloseDialog();
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "center", marginTop: "8px" }}>
      <Button
        id="btn-proceed"
        className="btn-full-width"
        size={ButtonSize.Small}
        color={ButtonColor.Utility}
        onClick={handleButtonClick}
        disabled={isProceedDisabled} // Button disabled condition
      >
        Proceed
      </Button>
      <ConfirmDialog
        isOpen={showDeleteDialog}
        confirmActionButtonText="Delete"
        cancelActionButtonText="Close"
        optionalButton={true}
        title="Delete Next Gen Data?"
        onCloseHandle={handleCloseDialog}
        onSubmitHandle={handleDelete}
        description="Deleting the Next Gen data will clear all records and all related data will be gone forever once deleted."
      />
      <ConfirmDialog
        isOpen={showInProgressDialog}
        confirmActionButtonText="Close"
        title="Deletion of NG Data in Progress"
        onCloseHandle={handleCloseDialog}
        onSubmitHandle={handleCloseDialog}
        description="The Next Gen database is being deleted. This process can't be stopped once started."
      />
    </div>
  );
};

export default DeleteNGDataView;
