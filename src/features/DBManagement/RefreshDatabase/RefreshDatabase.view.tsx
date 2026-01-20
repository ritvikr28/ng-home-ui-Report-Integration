import { Tag, TagSize, TagColor, Card, CardType, FormLabel } from "@essnextgen/ui-kit";
import { useTranslation, UseTranslationResponse } from "@essnextgen/ui-intl-kit";
import "../style.scss";
import React, { useState, ComponentType, useEffect } from "react";
import { useHistory } from "react-router-dom";
import RefreshDatabase from "./RefreshDatabase";
import DetachDatabaseView from "./DetachDatabase.view";
import DeleteNGDataView from "./DeleteNGData.view";
import AttachDatabaseView from "./AttachDatabase.view";
import SyncDataView from "./SyncData.view";
import NotifyExceptionView from "./NotifyException.view";
import { IPrecheckStatusApiResponse } from "../../../shared/model/RefreshDatabase/responsemodel";
import { FetchPreCheckStatus, handleComplete, Item } from "./RefreshDatabaseUtils";


let items: Item[];

const RefreshDatabaseView: () => JSX.Element = () => {

  const history : any = useHistory();

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
  const handleException : () => void = () => {
    setEnableNotification(true); // Enable notification on exception
  };

  useEffect(() => {
    const initializeSteps : () => Promise<void> = async () => {
      try {
        const precheckStatus: IPrecheckStatusApiResponse | null =
          await FetchPreCheckStatus(handleException, history);

        if (precheckStatus && precheckStatus?.statusCode === 200) {
          const statuses : string[] = [
            precheckStatus?.dbDetachedStatus || "",
            precheckStatus?.deleteNGDataStatus || "",
            precheckStatus?.dbReAttachedStatus || "",
            precheckStatus?.syncDataStatus || "",
            precheckStatus?.syncCompletedSeenStatus || ""
          ];

          // Map statuses to corresponding step labels
          const initialFlags : string[] = statuses?.map((status, index) => {
            if (index === 3) { // Assuming syncDataStatus is at index 3
              if (status === "Active") return "";
              if (status === "Completed" && precheckStatus?.syncCompletedSeenStatus === "Seen")
                return "";
              if (status === "Completed") {
                clearInterval(intervalId); // Stop auto-refresh
                return "Completed";
              }

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
          let activeStep : number = initialFlags?.findIndex((flag) => flag === "In Progress" || flag === "Completed"); // Find the first step that is in progress or not started
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
    const intervalId :any = setInterval(() => {
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
            const syncDataStatus : string = flagValues[3];
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
                          setActiveIndex,
                          items
                        })
                      }
                      inProgressStatus={(value: string) => {
                        const updatedFlags : string[] = [...flagValues];
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
