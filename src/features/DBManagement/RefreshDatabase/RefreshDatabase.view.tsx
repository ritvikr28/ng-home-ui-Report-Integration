import { Tag, TagSize, TagColor, Card, CardType, FormLabel } from "@essnextgen/ui-kit";
import { useTranslation, UseTranslationResponse } from "@essnextgen/ui-intl-kit";
import "../style.scss";
import React, { useState, ComponentType, useEffect } from "react";
import { AxiosResponse } from "axios";
import { useHistory } from "react-router-dom";
import RefreshDatabase from "./RefreshDatabase";
import DetachDatabaseView from "./DetachDatabase.view";
import DeleteNGDataView from "./DeleteNGData.view";
import AttachDatabaseView from "./AttachDatabase.view";
import SyncDataView from "./SyncData.view";
import NotifyExceptionView from "./NotifyException.view";
import { envConfig, getUserOrganisation, service } from "../../../shared/utils";
import { IPrecheckStatusApiResponse } from "../../../shared/model/RefreshDatabase/responsemodel";
import { useFetchSchoolNameData } from "../../../shared/services/schoolDomain/schoolServices";
import { ISchoolNameDataResponse } from "../../../shared/model/SchoolDomain/responsemodels";

interface Item {
  title: string;
  component: ComponentType<any>;
}

let items: Item[];

export const FetchPreCheckStatus = async (
  handleException: () => void,
  history: ReturnType<typeof useHistory>
): Promise<IPrecheckStatusApiResponse | null> => {
  const schoolData: ISchoolNameDataResponse | null = await useFetchSchoolNameData();
  const orgName: string = schoolData == null ? "" : schoolData.schoolName;
  const orgId = getUserOrganisation();

  try {
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
        history.push("/unauthorized"); // Use the passed history object
      } else {
        handleException();
      }
    }
    else if (err.message && err.message.includes("Invalid token")) {
      console.log("Invalid token detected. Redirecting...");
      history.replace("/unauthorized");
    }
    else {
      console.log("API call failed without a response from the server.");
    }
    console.log("Failed to fetch the status");
    return null;
  }
};

export interface IHandleCompleteProps {
  index: number;
  value: string;
  flagValues: string[];
  setFlagValues: React.Dispatch<React.SetStateAction<string[]>>;
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
}

// The function now uses the HandleCompleteParams interface for its parameters
export const handleComplete: (props: IHandleCompleteProps) => string = (
  props: IHandleCompleteProps
) => {
  const {
    index,
    value,
    flagValues,
    setFlagValues,
    setActiveIndex
  }: IHandleCompleteProps = props;

  // Update the flag for the completed step
  const updatedFlags: string[] = [...flagValues];
  updatedFlags[index] = value; // Set the flag value for the completed step
  setFlagValues(updatedFlags);

  // Check if all steps are completed
  if (index === items.length - 1) {
    // Reset to step 1
    setActiveIndex(0);
    setFlagValues(new Array(items.length).fill(""));
  } else {
    // Move to the next step
    setActiveIndex(index + 1);
  }
  return updatedFlags[index];
}

const RefreshDatabaseView: () => JSX.Element = () => {

  const history = useHistory();

  const [activeIndex, setActiveIndex]: [
    number,
    React.Dispatch<React.SetStateAction<number>>
  ] = useState<number>(0);

  const { t }: UseTranslationResponse<"translation", undefined> =
    useTranslation();

  // Define items with the components to be rendered
  items = [
    { title: t("RefreshDB_T.moduleBlock.detachDB.content2"), component: DetachDatabaseView },
    { title: t("RefreshDB_T.moduleBlock.DeleteNGData.title"), component: DeleteNGDataView },
    { title: t("RefreshDB_T.moduleBlock.attachDB.content"), component: AttachDatabaseView },
    { title: t("RefreshDB_T.moduleBlock.syncProcess.title"), component: SyncDataView }
  ];

  const [flagValues, setFlagValues]: [
    string[],
    React.Dispatch<React.SetStateAction<string[]>>
  ] = useState<string[]>(new Array(items.length).fill(""));

  const [loading, setLoading]: [
    boolean,
    React.Dispatch<React.SetStateAction<boolean>>
  ] = useState<boolean>(true);

  const [enableNotification, setEnableNotification]: [
    boolean,
    React.Dispatch<React.SetStateAction<boolean>>
  ] = useState<boolean>(false);

  // Function to handle setting the notification state when an exception occurs
  const handleException = () => {
    setEnableNotification(true); // Enable notification on exception
  };

  useEffect(() => {
    const initializeSteps = async () => {
      try {
        const precheckStatus: IPrecheckStatusApiResponse | null =
          await FetchPreCheckStatus(handleException, history);

        if (precheckStatus && precheckStatus.statusCode === 200) {
          const statuses = [
            precheckStatus.dbDetachedStatus || "",
            precheckStatus.deleteNGDataStatus || "",
            precheckStatus.dbReAttachedStatus || "",
            precheckStatus.syncDataStatus || ""
          ];

          // Map statuses to corresponding step labels
          const initialFlags = statuses.map((status, index) => {
            if (index === 3) { // Assuming syncDataStatus is at index 3
              if(status === "Active") return "";
              if (status === "Completed" ) {
                clearInterval(intervalId); // Stop auto-refresh
                return "Completed";}
             
              if (status === "Not Started" || status === "In Progress") return "In Progress";
              return ""; // Default to empty if unrecognized
            }
            if (status === "Detached") return t("RefreshDB_T.moduleBlock.status.content3");
            if (status === "Deleted") return t("RefreshDB_T.moduleBlock.status.content");
            if (status === "Attached") return t("RefreshDB_T.moduleBlock.status.content1");
            if (status === "In Progress") return t("RefreshDB_T.moduleBlock.status.content2");
            
            return ""; // Default to empty if unrecognized
          });
          setFlagValues(initialFlags);

          // Determine the active step
          let activeStep = initialFlags.findIndex((flag) => flag === "In Progress");
          if (activeStep === -1) {
            activeStep = initialFlags.findIndex((flag) => flag === "");
          }
          if (activeStep === -1) {
              activeStep = items.length - 1; // Default to the last step if all are complete
          
          }
          setActiveIndex(activeStep);
           // Stop auto-refresh if specific conditions are met
      
        }
      } catch (error) {
        console.log("Error fetching precheck status:");
      } finally {
        setLoading(false);
      }
    };
    // Initial fetch
    initializeSteps();
    // Set up interval for auto-refresh
    const intervalId = setInterval(() => {
      initializeSteps();
    }, window.REFRESH_INTERVAL || 60000); // Refresh every 10 seconds

    return () => clearInterval(intervalId);
  }, [history]); // Add history as a dependency


  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <RefreshDatabase />
      {enableNotification && (
        <div id="notification-open-panel">
          <NotifyExceptionView setDisableNotification={setEnableNotification} />
        </div>
      )}
      <div id="list-item">
        <Card id='refreshDB-card' type={CardType.Default}>
          {items.map((item, index) => {
            const CurrentComponent: ComponentType<any> = item.component;
            const isActive = index === activeIndex;
            const syncDataStatus = flagValues[3];
            return (
              <div key={index} style={{ pointerEvents: isActive ? "auto" : "none" }} >
                <div className="list-item" style={{ padding: "16px" }}>
                  <div style={{ display: "flex" }}>
                    <FormLabel id='default-list-item' >
                      {`${index + 1}. ${item.title}`}
                    </FormLabel>
                    {flagValues[index].trim() !== "" && (
                      <span style={{ marginLeft: "10px" }} >
                        <Tag
                          size={TagSize.Small}
                          color={TagColor.Success}
                          text={flagValues[index]}
                        />
                      </span>
                    )}
                  </div>

                  {isActive && (
                    <CurrentComponent
                      status={(value: string) =>
                        handleComplete({
                          index,
                          value,
                          flagValues,
                          setFlagValues,
                          setActiveIndex
                        })
                      }
                      inProgressStatus={(value: string) => {
                        const updatedFlags = [...flagValues];
                        updatedFlags[index] = value; // Update "In progress" status
                        setFlagValues(updatedFlags);
                      }}
                      // Pass handleException to trigger notification in case of exception
                      handleException={handleException}
                     syncDataStatus={syncDataStatus}
                    />
                  )}
                </div>
                <div className="item-separator" />
              </div>
            );
          })}
        </Card>
      </div>
    </>
  );
};

export default RefreshDatabaseView;
