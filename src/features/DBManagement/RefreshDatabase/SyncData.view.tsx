import React, { useState } from "react";
import { ButtonSize, Button, ButtonColor, FormLabel } from "@essnextgen/ui-kit";
import { authService } from "@essnextgen/auth-ui";
import "../style.scss";
import { AxiosResponse } from "axios";
import ConfirmDialog from "./ConfirmationDialog.logic";
import { ISchoolDetailsDRApiResponse } from "../../../shared/model/RefreshDatabase/responsemodel";
import { ISchoolNameDataResponse } from "../../../shared/model/SchoolDomain/responsemodels";
import { useFetchSchoolNameData } from "../../../shared/services/schoolDomain/schoolServices";
import { envConfig, getUserOrganisation, service } from "../../../shared/utils";
import { useTranslation, UseTranslationResponse } from "@essnextgen/ui-intl-kit";

export interface SyncDataViewProps {
  inProgressStatus: (value: string) => void;
  handleException: () => void; 
  status: (value: string) => void;
}

// Fetch sync status
export const FetchSyncStatus = async (handleException: () => void): Promise<ISchoolDetailsDRApiResponse | null> => {
  try {
    const schoolData: ISchoolNameDataResponse | null =
        await useFetchSchoolNameData();
    const orgName: string = schoolData == null ? "" : schoolData.schoolName;
    const orgId = getUserOrganisation();

    const response: AxiosResponse<ISchoolDetailsDRApiResponse> = await service.get(
        `${envConfig.BASE_URL}/TrainingDB/GetSyncStatus/${orgId}?orgName=${orgName}`
    );
    return response.data;
  } catch (err: any) {
    handleException();
    console.log("Failed to fetch the Sync status");
    return null;
  }
};

export const TriggerSync = async(handleException : () => void): Promise<ISchoolDetailsDRApiResponse | null> => {
  try {
    const schoolData: ISchoolNameDataResponse | null =
      await useFetchSchoolNameData();
    const orgName: string = schoolData == null ? "" : schoolData.schoolName;

    const requestData: {
      operationIndicator: string;
      orgId: string;
      orgName: string;
      tableFlagValue: string;
      actorName: string;
    } = {
      operationIndicator: "S",
      orgId: getUserOrganisation(),
      orgName,
      tableFlagValue: "Y",
      actorName: authService.getUsername()
    };
    const response: AxiosResponse<ISchoolDetailsDRApiResponse> =
      await service.post(
        `${envConfig.BASE_URL}/TrainingDB/SchoolDetailsDR`,
        requestData
      );
    return response.data;
  } catch (err: any) {
    handleException();
    console.error("Failed to fetch data");
    return null;
  }
}

// Handle button click
export const handleButtonClick = async (
  handleException: () => void, 
  setSyncStatus: React.Dispatch<React.SetStateAction<string>>, 
  setShowSyncCompleteDialog: React.Dispatch<React.SetStateAction<boolean>>, 
  setShowSyncDialog: React.Dispatch<React.SetStateAction<boolean>>, 
  clicked: boolean,
  setClicked: React.Dispatch<React.SetStateAction<boolean>>, 
  inProgressStatus: (value: string) => void,
  setShowSyncFailedDialog: React.Dispatch<React.SetStateAction<boolean>>
) => {
  if(!clicked) {
    const response: ISchoolDetailsDRApiResponse | null = await TriggerSync(handleException);
    if (response?.statusCode === 200) {
      setClicked(true);
      inProgressStatus("In Progress")
    } else {
      handleException();
      setShowSyncFailedDialog(true);
      return;
    }
  }

  if(clicked) {
    const response: ISchoolDetailsDRApiResponse | null = await FetchSyncStatus(handleException);
    if(response?.statusCode === 200) {
      if (response.uiStatus === "Completed") {
        setShowSyncCompleteDialog(true);
        setSyncStatus("Completed");
        setClicked(false);
      } else if (response.uiStatus === "Error") {
        setShowSyncFailedDialog(true);
      } else {
        setShowSyncDialog(true);
        inProgressStatus("In Progress")
      }
    } else {
      handleException();
      setShowSyncFailedDialog(true);
    }
  }
};

const SyncDataView: React.FC<SyncDataViewProps> = ({
  inProgressStatus,
  handleException,
  status
}) => {
  const [syncStatus, setSyncStatus]: [
    string,
    React.Dispatch<React.SetStateAction<string>>
  ] = useState<string>("Not Started");
  const [showSyncDialog, setShowSyncDialog]: [
    boolean,
    React.Dispatch<React.SetStateAction<boolean>>
  ] = useState<boolean>(false);
  const [showSyncCompleteDialog, setShowSyncCompleteDialog]: [
    boolean,
    React.Dispatch<React.SetStateAction<boolean>>
  ] = useState<boolean>(false);
  const [showSyncFailedDialog, setShowSyncFailedDialog]: [
    boolean,
    React.Dispatch<React.SetStateAction<boolean>>
  ] = useState<boolean>(false);
  const [clicked, setClicked]: [
    boolean,
    React.Dispatch<React.SetStateAction<boolean>>
  ] = useState<boolean>(false);

  const { t }: UseTranslationResponse<"translation", undefined> =
    useTranslation();

  return (
    <>
        <div style={{marginTop:'16px'}}>
          <FormLabel id='sync-body-text'>
            {t("RefreshDB_T.moduleBlock.syncProcess.title")}
          </FormLabel>
        </div>
        <Button
          id="btn-sync"
          className="btn-full-width"
          size={ButtonSize.Small}
          color={ButtonColor.Utility}
          onClick={() => handleButtonClick(
            handleException,
            setSyncStatus,
            setShowSyncCompleteDialog,
            setShowSyncDialog,
            clicked,
            setClicked,
            inProgressStatus,
            setShowSyncFailedDialog
            )}
          disabled={syncStatus === "Active"}
        >
          Sync
        </Button>
        <ConfirmDialog
          isOpen={showSyncDialog}
          confirmActionButtonText={t("RefreshDB_T.moduleBlock.modal.button1")}
          title={t("RefreshDB_T.moduleBlock.modal.content2")}
          onCloseHandle={() => setShowSyncDialog(false)}
          onSubmitHandle={() => setShowSyncDialog(false)}
          description={t("RefreshDB_T.moduleBlock.modal.content4")}
        />
        <ConfirmDialog
          isOpen={showSyncCompleteDialog}
          confirmActionButtonText={t("RefreshDB_T.moduleBlock.modal.button1")}
          title={t("RefreshDB_T.moduleBlock.modal.content")}
          onCloseHandle={() => {
            setShowSyncCompleteDialog(false);
            status("Completed"); // Update completion status
          }}
          onSubmitHandle={() => {
            setShowSyncCompleteDialog(false);
            status("Completed"); // Update completion status
          }}
          description={t("RefreshDB_T.moduleBlock.modal.content5")}
        />
        <ConfirmDialog
          isOpen={showSyncFailedDialog}
          confirmActionButtonText={t("RefreshDB_T.moduleBlock.modal.button1")}
          title={t("RefreshDB_T.moduleBlock.modal.content1")}
          onCloseHandle={() => setShowSyncFailedDialog(false)}
          onSubmitHandle={() => setShowSyncFailedDialog(false)}
          description={t("RefreshDB_T.moduleBlock.modal.content6")}
        />
    </>
  );
};

export default SyncDataView;