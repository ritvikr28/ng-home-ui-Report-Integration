import React, { useEffect, useState } from "react";
import { ButtonSize, Button, ButtonColor, FormLabel } from "@essnextgen/ui-kit";
import {
  useTranslation,
  UseTranslationResponse
} from "@essnextgen/ui-intl-kit";
import { authService } from "@essnextgen/auth-ui";
import "../style.scss";
import { AxiosResponse } from "axios";
import { useHistory } from "react-router-dom";
import ConfirmDialog from "./ConfirmationDialog.logic";
import {
  IPrecheckStatusApiResponse,
  ISchoolDetailsDRApiResponse,
  ISyncCompletedSeenStatusResponse
} from "../../../shared/model/RefreshDatabase/responsemodel";
import { ISchoolNameDataResponse } from "../../../shared/model/SchoolDomain/responsemodels";
import { useFetchSchoolNameData } from "../../../shared/services/schoolDomain/schoolServices";
import { envConfig, getUserOrganisation, service } from "../../../shared/utils";
import { errorHandler } from "../../../shared/utils/errorHandler";
import { FetchPreCheckStatus } from "./RefreshDatabase.view";

export interface SyncDataViewProps {
  inProgressStatus: (value: string) => void;
  handleException: () => void;
  status: (value: string) => void;
  syncDataStatus: string; // Receive the status as a prop
}

export const FetchSyncStatus = async (
  handleException: () => void,
  history: ReturnType<typeof useHistory>
): Promise<ISchoolDetailsDRApiResponse | null> => {
  try {
    const schoolData: ISchoolNameDataResponse | null =
      await useFetchSchoolNameData();
    const orgName: string = schoolData == null ? "" : schoolData.schoolName;
    const orgId = getUserOrganisation();

    const response: AxiosResponse<ISchoolDetailsDRApiResponse> =
      await service.get(
        `${envConfig.BASE_URL}/TrainingDB/GetSyncStatus/${orgId}?orgName=${orgName}`
      );
    return response.data;
  } catch (err: any) {
    if (err.response) {
      const statusCode = err.response.status;
      console.log(`API call failed with status code: ${statusCode}`);
      if (statusCode === 401) {
        errorHandler.handle401Error(statusCode, history);
      } else {
        handleException();
      }
    } else if (err.message && err.message.includes("Invalid token")) {
      console.log("Invalid token detected. Redirecting...");
      history.replace("/unauthorized");
    } else {
      console.log(
        "Failed to fetch data, API call failed without a response from the server."
      );
      handleException();
    }
    return null;
  }
};

// precheck status
export const FetchPrecheckStatus = async (
  handleException: () => void,
  history: ReturnType<typeof useHistory>
): Promise<IPrecheckStatusApiResponse | null> => {
  try {
    const schoolData: ISchoolNameDataResponse | null =
      await useFetchSchoolNameData();
    const orgName: string = schoolData == null ? "" : schoolData.schoolName;
    const orgId = getUserOrganisation();

    const response: AxiosResponse<IPrecheckStatusApiResponse> =
      await service.get(
        `${envConfig.BASE_URL}/TrainingDB/PreCheckStatus/${orgId}?orgName=${orgName}`
      );
    return response.data;
  } catch (err: any) {
    if (err.response) {
      const statusCode = err.response.status;
      console.log(`API call failed with status code: ${statusCode}`);
      if (statusCode === 401) {
        errorHandler.handle401Error(statusCode, history);
      } else {
        handleException();
      }
    } else if (err.message && err.message.includes("Invalid token")) {
      console.log("Invalid token detected. Redirecting...");
      history.replace("/unauthorized");
    } else {
      console.log(
        "Failed to fetch data, API call failed without a response from the server."
      );
      handleException();
    }
    return null;
  }
};

export const TriggerSync = async (
  handleException: () => void,
  history: ReturnType<typeof useHistory>
): Promise<ISchoolDetailsDRApiResponse | null> => {
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
    if (err.response) {
      const statusCode = err.response.status;
      console.log(`API call failed with status code: ${statusCode}`);
      if (statusCode === 401) {
        errorHandler.handle401Error(statusCode, history);
      } else {
        handleException();
      }
    } else if (err.message && err.message.includes("Invalid token")) {
      console.log("Invalid token detected. Redirecting...");
      history.replace("/unauthorized");
    } else {
      console.log(
        "Failed to fetch data, API call failed without a response from the server."
      );
      handleException();
    }
    return null;
  }
};

// Handle button click
export const handleButtonClick = async (
  handleException: () => void,
  setSyncStatus: React.Dispatch<React.SetStateAction<string>>,
  setShowSyncCompleteDialog: React.Dispatch<React.SetStateAction<boolean>>,
  setShowSyncDialog: React.Dispatch<React.SetStateAction<boolean>>,
  clicked: boolean,
  setClicked: React.Dispatch<React.SetStateAction<boolean>>,
  inProgressStatus: (value: string) => void,
  setShowSyncFailedDialog: React.Dispatch<React.SetStateAction<boolean>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  history: ReturnType<typeof useHistory>, // Pass the history object
  syncDataStatus: string
) => {
  try {
    setIsLoading(true);
    if (syncDataStatus === "Completed") {
      setShowSyncCompleteDialog(true);
      return;
    }
    if (syncDataStatus === "In Progress") {
      setShowSyncDialog(true);
      inProgressStatus("In Progress");
      return;
    }
    if (!clicked) {
      const response: ISchoolDetailsDRApiResponse | null = await TriggerSync(
        handleException,
        history
      );
      if (response?.statusCode === 200) {
        setClicked(true);
        inProgressStatus("In Progress");
      } else {
        handleException();
        setShowSyncFailedDialog(true);
        return;
      }
    } else {
      // Second click: show "Sync in Progress" dialog
      setShowSyncDialog(true);
    }

    setSyncStatus("In Progress");

    if (clicked) {
      const response: ISchoolDetailsDRApiResponse | null =
        await FetchSyncStatus(handleException, history);
      if (response?.statusCode === 200) {
        if (response.uiStatus === "Completed") {
          setShowSyncCompleteDialog(true);
          setSyncStatus("Completed");
          setClicked(false);
        } else if (response.uiStatus === "Error") {
          setShowSyncFailedDialog(true);
        } else {
          setShowSyncDialog(true);
          inProgressStatus("In Progress");
        }
      } else {
        handleException();
        setShowSyncFailedDialog(true);
      }
    }
    setSyncStatus("In Progress");
  } catch (error) {
    console.log("Error while checking status:");
    handleException();
  } finally {
    setIsLoading(false);
  }
};

const SyncDataView: React.FC<SyncDataViewProps> = ({
  inProgressStatus,
  handleException,
  status,
  syncDataStatus
}) => {
  const history = useHistory(); // Initialize history
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
  const [isLoading, setIsLoading]: [
    boolean,
    React.Dispatch<React.SetStateAction<boolean>>
  ] = useState<boolean>(false);

  const { t }: UseTranslationResponse<"translation", undefined> =
    useTranslation();

  const initializeSteps = async (): Promise<void> => {
    try {
      const precheckResponse = await FetchPreCheckStatus(
        handleException,
        history
      );
      const response = await FetchSyncStatus(handleException, history);
      if (
        response?.uiStatus === "Completed" &&
        precheckResponse?.syncCompletedSeenStatus === "Not Seen"
      ) {
        setSyncStatus("Completed");

        if (!showSyncCompleteDialog) {
          setShowSyncCompleteDialog(true); // Show the dialog only if not already displayed
        }
      } else if (response?.uiStatus === "Error") {
        setSyncStatus("Error");
        setShowSyncFailedDialog(true);
      } else {
        setSyncStatus("In Progress");
      }
    } catch (error) {
      console.log("Error initializing steps:");
      handleException();
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      initializeSteps();
    }, window.REFRESH_INTERVAL || 60000); // Refresh every 10 seconds

    return () => clearInterval(intervalId);
  }, [syncStatus, showSyncCompleteDialog, history, handleException]);

  return (
    <>
      <div style={{ marginTop: "16px" }}>
        <FormLabel id="sync-body-text" dataTestId="modelSyncComplete">
          {t("RefreshDB_T.moduleBlock.modal.content3")}
        </FormLabel>
      </div>
      <Button
        id="btn-sync"
        className="btn-full-width"
        size={ButtonSize.Small}
        color={ButtonColor.Utility}
        onClick={() =>
          handleButtonClick(
            handleException,
            setSyncStatus,
            setShowSyncCompleteDialog,
            setShowSyncDialog,
            clicked,
            setClicked,
            inProgressStatus,
            setShowSyncFailedDialog,
            setIsLoading,
            history,
            syncDataStatus
          )
        }
        disabled={isLoading || showSyncCompleteDialog}
      >
        {isLoading ? "Loading.." : "Sync"}
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
        onCloseHandle={async () => {
          try {
            // Prepare request data
            const requestData: {
              orgId: string;
              tableFlagValue: string;
              status: string;
            } = {
              orgId: getUserOrganisation(),
              tableFlagValue: "S",
              status: "Seen"
            };

            const response: AxiosResponse<ISyncCompletedSeenStatusResponse> =
              await service.post(
                `${envConfig.BASE_URL}/TrainingDB/SyncCompletedSeenStatusUpdate`,
                requestData
              );
            return response.data;
          } catch (err: any) {
            if (err.response) {
              const statusCode = err.response.status;
              console.log(`API call failed with status code: ${statusCode}`);
              if (statusCode === 401) {
                errorHandler.handle401Error(statusCode, history);
              } else {
                handleException();
              }
            } else if (err.message && err.message.includes("Invalid token")) {
              console.log("Invalid token detected. Redirecting...");
              history.replace("/unauthorized");
            } else {
              console.log(
                "Failed to fetch data, API call failed without a response from the server."
              );
              handleException();
            }
            return null;
          }
          // need to call getsync status
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
