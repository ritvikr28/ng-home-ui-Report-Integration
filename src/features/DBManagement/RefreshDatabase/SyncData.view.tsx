import React, { useState } from "react";
import { ButtonSize, Button, ButtonColor, FormLabel } from "@essnextgen/ui-kit";
import "../style.scss";
import { AxiosResponse } from "axios";
import ConfirmDialog from "./ConfirmationDialog.logic";
import { ISchoolDetailsDRApiResponse } from "../../../shared/model/RefreshDatabase/responsemodel";
import { ISchoolNameDataResponse } from "../../../shared/model/SchoolDomain/responsemodels";
import { useFetchSchoolNameData } from "../../../shared/services/schoolDomain/schoolServices";
import { envConfig, getUserOrganisation, service } from "../../../shared/utils";

export interface SyncDataViewProps {
  status: (value: string) => void; // Function to update the status
  inProgressStatus: (value: string) => void; // Function to update the status
  handleException: () => void; // Function to handle exception cases
}

// Fetch sync status
export const FetchSyncStatus = async (handleException: () => void): Promise<ISchoolDetailsDRApiResponse | null> => {
  try {
    const schoolData: ISchoolNameDataResponse | null =
        await useFetchSchoolNameData();
    const orgName: string = schoolData == null ? "" : schoolData.schoolName;
    const orgId = getUserOrganisation();

    const response: AxiosResponse<ISchoolDetailsDRApiResponse> = await service.get(
      `${envConfig.BASE_URL}/TrainingDB/PreCheckStatus/${orgId}/${orgName}`
    );
    return response.data;
  } catch (err: any) {
    handleException();
    console.log("Failed to fetch the Sync status");
    return null;
  }
};

  // Function to check sync status
export const CheckSyncStatus = async (
  handleException: () => void, 
  setSyncStatus: React.Dispatch<React.SetStateAction<string>>, 
  setShowSyncCompleteDialog: React.Dispatch<React.SetStateAction<boolean>>, 
  setShowSyncFailedDialog: React.Dispatch<React.SetStateAction<boolean>>, 
  setClicked: React.Dispatch<React.SetStateAction<boolean>>, 
  syncStatus: string, 
  status: (value: string) => void 
): Promise<string> => {
     const response: ISchoolDetailsDRApiResponse | null = await FetchSyncStatus(handleException);
      if (response !== null && response.statusCode === 200) {
        switch (response.uiStatus) {
          case "Completed":
            setShowSyncCompleteDialog(true);
            setSyncStatus("Completed");
            status("completed")
            break;
          case "Error":
            setShowSyncFailedDialog(true);
            setSyncStatus("Failed");
            break;
          default:
            setSyncStatus(""); 
            setClicked(false); // Reset 'clicked' state
        }
        return syncStatus
      }
    return "Error"
};

const SyncDataView: React.FC<SyncDataViewProps> = ({
  status,
  inProgressStatus,
  handleException,
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
  
  // Handle button click
  const handleButtonClick = async () => {
    // If clicked second time
    if(clicked){
      setShowSyncDialog(true)
      if(showSyncDialog) {
        inProgressStatus("In Progress");
        await CheckSyncStatus(
          handleException,setSyncStatus, setShowSyncCompleteDialog,
           setShowSyncFailedDialog, setClicked, syncStatus, status);
      }
    }
    if (syncStatus === "In Progress" || syncStatus === "Not Started" ) {
      inProgressStatus("In Progress");
      setClicked(true);
      return;
    }
    setClicked(true);
    inProgressStatus("In Progress")
  };

  // Handle closing the dialogs
  const handleCloseDialog = () => {
    setShowSyncDialog(false);
    setShowSyncCompleteDialog(false);
    setShowSyncFailedDialog(false);
    setSyncStatus(""); // Reset sync status
  };


  return (
    <>
        <div style={{marginTop:'16px'}}>
          <FormLabel id='sync-body-text'>
          The data synchronization is expected to be completed within 24 hours.
          </FormLabel>
        </div>
        <Button
          id="btn-sync"
          className="btn-full-width"
          size={ButtonSize.Small}
          color={ButtonColor.Utility}
          onClick={handleButtonClick}
          disabled={syncStatus === "Completed"}
        >
          Sync
        </Button>
        <ConfirmDialog
          isOpen={showSyncDialog}
          confirmActionButtonText="Cancel"
          title="Data Sync in progress"
          onCloseHandle={handleCloseDialog}
          onSubmitHandle={handleButtonClick}
          description="SIMS7 data is currently syncing with Next Gen database. This process can't be stopped once started."
        />
        <ConfirmDialog
          isOpen={showSyncCompleteDialog}
          confirmActionButtonText="Close"
          title="Data Sync successfully"
          onCloseHandle={handleCloseDialog}
          onSubmitHandle={handleCloseDialog}
          description="SIMS7 data synced successfully with Next Gen database."
        />
        <ConfirmDialog
          isOpen={showSyncFailedDialog}
          confirmActionButtonText="Close"
          title="Data Sync failed"
          onCloseHandle={handleCloseDialog}
          onSubmitHandle={handleCloseDialog}
          description="SIMS7 data sync with Next Gen database failed. We apologize for any inconvenience. Please try again."
        />
    </>
  );
};

export default SyncDataView;