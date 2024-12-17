import React, { useState } from "react";
import { ButtonSize, Button, ButtonColor } from "@essnextgen/ui-kit";
import { useTranslation, UseTranslationResponse } from "@essnextgen/ui-intl-kit";
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
import { handle401Error } from "../../../shared/utils/errorHandler";

export interface DeleteNGDataViewProps {
  status: (value: string) => void;
  inProgressStatus: (value: string) => void;
  handleException: () => void;
}

const DeleteNGDataView: React.FC<DeleteNGDataViewProps> = ({
  status,
  inProgressStatus,
  handleException
}) => {
  const [showDeleteDialog, setShowDeleteDialog]: [
    boolean,
    React.Dispatch<React.SetStateAction<boolean>>
  ] = useState<boolean>(false);
  const { t }: UseTranslationResponse<"translation", undefined> =
    useTranslation();
  const [showInProgressDialog, setShowInProgressDialog]: [
    boolean,
    React.Dispatch<React.SetStateAction<boolean>>
  ] = useState<boolean>(false);
  const [isProceedDisabled, setIsProceedDisabled]: [
    boolean,
    React.Dispatch<React.SetStateAction<boolean>>
  ] = useState<boolean>(false);// New state for button disabling

  const FetchPreCheckStatus : () => Promise<IPrecheckStatusApiResponse|null> = async () => {
    try {
      const schoolData: ISchoolNameDataResponse | null = await useFetchSchoolNameData();
      const orgName: string = schoolData?.schoolName ?? "";
      const orgId: string = getUserOrganisation();

      const response: AxiosResponse<IPrecheckStatusApiResponse> = await service.get(
        `${envConfig.BASE_URL}/TrainingDB/PreCheckStatus/${orgId}?orgName=${orgName}`
      );
      return response.data;
    } catch (err: any) {
      if (err.response) {
        const statusCode = err.response.status;
        console.log(`API call failed with status code: ${statusCode}`);
        if (statusCode === 401) {
          handle401Error(statusCode);
        } else {
          handleException();
        }
      } else {
        console.log("Failed to fetch data, API call failed without a response from the server.");
        handleException();
      }
        return null;
    }      
  };

  const handleButtonClick :() => Promise<void> = async () => {
    try {
      const precheckStatus :IPrecheckStatusApiResponse|null = await FetchPreCheckStatus();

      if (precheckStatus?.deleteNGDataStatus === "In Progress") {
        inProgressStatus("In Progress");
        setShowInProgressDialog(true);
      } else if (precheckStatus?.deleteNGDataStatus !== "Deleted") {
        setShowDeleteDialog(true);
        setShowInProgressDialog(false);
      } else if (precheckStatus?.deleteNGDataStatus === "Deleted") {
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
      }
      else if(response.data.statusCode === 401) {
        handle401Error(response.data.statusCode);
      } 
      else {
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
        dataTestId="Proceed"
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
        confirmActionButtonText={t("RefreshDB_T.moduleBlock.DeleteNGData.button2")}
        cancelActionButtonText={t("RefreshDB_T.moduleBlock.modal.button1")}
        optionalButton={true}
        title={t("RefreshDB_T.moduleBlock.DeleteNGData.title")}
        onCloseHandle={handleCloseDialog}
        onSubmitHandle={handleDelete}
        description={t("RefreshDB_T.moduleBlock.DeleteNGData.description")}
      />
      <ConfirmDialog
        isOpen={showInProgressDialog}
        confirmActionButtonText={t("RefreshDB_T.moduleBlock.modal.button1")}
        title="Deletion of NG Data in Progress"
        onCloseHandle={handleCloseDialog}
        onSubmitHandle={handleCloseDialog}
        description="The Next Gen database is being deleted. This process can't be stopped once started."
      />
    </div>
  );
};

export default DeleteNGDataView;
