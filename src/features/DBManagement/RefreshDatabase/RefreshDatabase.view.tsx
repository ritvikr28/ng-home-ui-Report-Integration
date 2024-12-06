import { Tag, TagSize, TagColor, Card, CardType, FormLabel } from "@essnextgen/ui-kit";
import "../style.scss";
import React, { useState, ComponentType, useEffect } from "react";
import { AxiosResponse } from "axios";
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

export const FetchPreCheckStatus= async (
  handleException: () => void
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
      handleException();
      console.log("Failed to fetch the status");
      return null;
    }
  };

// Define items with the components to be rendered
const items: Item[] = [
  { title: "Detach SIMS7 database", component: DetachDatabaseView },
  { title: "Delete Next Gen data", component: DeleteNGDataView },
  { title: "Attach SIMS7 database", component: AttachDatabaseView },
  { title: "Sync SIMS7 data with Next Gen database", component: SyncDataView }
];

export interface IHandleCompleteProps {
  index: number;
  value: string;
  flagValues: string[];
  setFlagValues: React.Dispatch<React.SetStateAction<string[]>>;
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
}

// The function now uses the HandleCompleteParams interface for its parameters
export const handleComplete: (props: IHandleCompleteProps) => string = (
  props : IHandleCompleteProps
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
  const [activeIndex, setActiveIndex]: [
    number,
    React.Dispatch<React.SetStateAction<number>>
  ] = useState<number>(0);

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
          await FetchPreCheckStatus(handleException);

        if (precheckStatus && precheckStatus.statusCode === 200) {
          const statuses = [
            precheckStatus.dbDetachedStatus || "",
            precheckStatus.deleteNGDataStatus || "",
            precheckStatus.dbReAttachedStatus || "",
            precheckStatus.syncDataStatus || ""
          ];

        // Map statuses to corresponding step labels
          const initialFlags = statuses.map((status) => {
            if (status === "Detached") return "Detached";
            if (status === "Deleted") return "Deleted";
            if (status === "Attached") return "Attached";
            if (status === "Completed") return "Completed";
            if (status === "In Progress") return "In Progress"; 
            return ""; // Default to empty if unrecognized
          });
          setFlagValues(initialFlags);

          const firstIncompleteIndex = initialFlags.findIndex(
            (flag) => flag === "" || flag === "In Progress"
          );

          // If any step is "In Progress," keep it as the active step
          setActiveIndex(
            initialFlags.includes("In Progress")
              ? initialFlags.findIndex((flag) => flag === "In Progress")
              : firstIncompleteIndex === -1
              ? items.length - 1
              : firstIncompleteIndex
          );
        }
      } catch (error) {
        console.error("Error fetching precheck status:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeSteps();
  }, []);

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

              return (
                <div key={index} style={{ pointerEvents: isActive ? "auto" : "none" }} >
                  <div className="list-item" style={{ marginBottom: "20px",  marginTop: "20px", marginLeft:'0px'}}>
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
