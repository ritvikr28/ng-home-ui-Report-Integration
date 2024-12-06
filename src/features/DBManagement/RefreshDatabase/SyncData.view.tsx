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
        `${envConfig.BASE_URL}/TrainingDB/GetSyncStatus/${orgId}?orgName=${orgName}`
    );
    return response.data;
  } catch (err: any) {
    handleException();
    console.log("Failed to fetch the Sync status");
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
  showSyncDialog: boolean,
  setClicked: React.Dispatch<React.SetStateAction<boolean>>, 
  inProgressStatus: (value: string) => void,
  setShowSyncFailedDialog: React.Dispatch<React.SetStateAction<boolean>> 
) => {
  const response: ISchoolDetailsDRApiResponse | null = await FetchSyncStatus(handleException);
    if (response !== null && response.statusCode === 200) {
        
      if(clicked && (response.uiStatus === "Completed")) {
        setShowSyncCompleteDialog(true);
        inProgressStatus("In Progress")
      }
     
      if(clicked && (response.uiStatus === "Error")) {
        setShowSyncFailedDialog(true);
      }

      // If clicked second time
      if(clicked) {
        setShowSyncDialog(true)
        if(showSyncDialog) {
          inProgressStatus("In Progress");
          setSyncStatus("In Progress");
        }
      }
      setClicked(true);
      inProgressStatus("In Progress")

    } else {
      handleException();
      setShowSyncFailedDialog(true);
    }
};

const SyncDataView: React.FC<SyncDataViewProps> = ({
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
          onClick={() => handleButtonClick(
            handleException,
            setSyncStatus,
            setShowSyncCompleteDialog,
            setShowSyncDialog,
            clicked,
            showSyncDialog,
            setClicked,
            inProgressStatus,
            setShowSyncFailedDialog)}
          disabled={syncStatus === "Completed"}
        >
          Sync
        </Button>
        <ConfirmDialog
          isOpen={showSyncDialog}
          confirmActionButtonText="Close"
          title="Data Sync in progress"
          onCloseHandle={() => setShowSyncDialog(false)}
          onSubmitHandle={() => setShowSyncDialog(false)}
          description="SIMS7 data is currently syncing with Next Gen database. This process can't be stopped once started."
        />
        <ConfirmDialog
          isOpen={showSyncCompleteDialog}
          confirmActionButtonText="Close"
          title="Data Sync successfully"
          onCloseHandle={() => setShowSyncCompleteDialog(false)}
          onSubmitHandle={() => setShowSyncCompleteDialog(false)}
          description="SIMS7 data synced successfully with Next Gen database."
        />
        <ConfirmDialog
          isOpen={showSyncFailedDialog}
          confirmActionButtonText="Close"
          title="Data Sync failed"
          onCloseHandle={() => setShowSyncFailedDialog(false)}
          onSubmitHandle={() => setShowSyncFailedDialog(false)}
          description="SIMS7 data sync with Next Gen database failed. We apologize for any inconvenience. Please try again."
        />
    </>
  );
};

export default SyncDataView;