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
  const history: any = useHistory();
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const { t }: UseTranslationResponse<"translation", undefined> = useTranslation();
  items = [
    { title: t("RefreshDB_T.moduleBlock.detachDB.content2"), component: DetachDatabaseView },
    { title: t("RefreshDB_T.moduleBlock.DeleteNGData.title"), component: DeleteNGDataView },
    { title: t("RefreshDB_T.moduleBlock.attachDB.content"), component: AttachDatabaseView },
    { title: t("RefreshDB_T.moduleBlock.syncProcess.title"), component: SyncDataView }
  ];
  const [flagValues, setFlagValues] = useState<string[]>(new Array(items.length).fill(""));
  const [loading, setLoading] = useState<boolean>(true);
  const [enableNotification, setEnableNotification] = useState<boolean>(false);
  const handleException = () => setEnableNotification(true);

  useEffect(() => {
    let intervalId: any;
    const initializeSteps = async () => {
      try {
        const precheckStatus: IPrecheckStatusApiResponse | null = await FetchPreCheckStatus(handleException, history);
        if (precheckStatus && precheckStatus?.statusCode === 200) {
          const statuses: string[] = [
            precheckStatus?.dbDetachedStatus || "",
            precheckStatus?.deleteNGDataStatus || "",
            precheckStatus?.dbReAttachedStatus || "",
            precheckStatus?.syncDataStatus || "",
            precheckStatus?.syncCompletedSeenStatus || ""
          ];
          const initialFlags = mapStatusesToFlags(statuses, precheckStatus, t, intervalId);
          setFlagValues(initialFlags);
          const activeStep = getActiveStep(initialFlags, items.length);
          setActiveIndex(activeStep);
        }
      } catch (error) {
        console.log("Error fetching precheck status:");
      } finally {
        setLoading(false);
      }
    };
    initializeSteps();
    intervalId = setInterval(() => {
      initializeSteps();
    }, window.REFRESH_INTERVAL || 60000);
    return () => clearInterval(intervalId);
  }, [history]);

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
          {items.map((item, index) => (
            <ListItem
              key={index}
              item={item}
              index={index}
              isActive={index === activeIndex}
              flagValues={flagValues}
              setFlagValues={setFlagValues}
              setActiveIndex={setActiveIndex}
              stepItems={items}
              handleException={handleException}
              syncDataStatus={flagValues[3]}
            />
          ))}
        </Card>
      </div>
    </>
  );
};

function mapStatusesToFlags(statuses: string[], precheckStatus: IPrecheckStatusApiResponse, t: any, intervalId: any) {
  return statuses.map((status, index) => {
    if (index === 3) { // syncDataStatus
      if (status === "Active") return "";
      if (status === "Completed" && precheckStatus?.syncCompletedSeenStatus === "Seen") return "";
      if (status === "Completed") {
        clearInterval(intervalId);
        return "Completed";
      }
      if (status === "Not Started" || status === "In Progress") return "In Progress";
      return "";
    }
    if (status === "Detached") return t("RefreshDB_T.moduleBlock.status.content3");
    if (status === "Deleted") return t("RefreshDB_T.moduleBlock.status.content");
    if (status === "Attached") return t("RefreshDB_T.moduleBlock.status.content1");
    if (status === "In Progress") return t("RefreshDB_T.moduleBlock.status.content2");
    return "";
  });
}

function getActiveStep(initialFlags: string[], itemsLength: number) {
  let activeStep = initialFlags.findIndex((flag) => flag === "In Progress" || flag === "Completed");
  if (activeStep === -1) {
    activeStep = initialFlags.findIndex((flag) => flag === "");
  }
  if (activeStep === -1) {
    activeStep = itemsLength - 1;
  }
  return activeStep;
}

const ListItem = ({ item, index, isActive, flagValues, setFlagValues, setActiveIndex, stepItems, handleException, syncDataStatus }: any) => {
  const CurrentComponent: ComponentType<any> = item.component;
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
                items: stepItems
              })
            }
            inProgressStatus={(value: string) => {
              const updatedFlags: string[] = [...flagValues];
              updatedFlags[index] = value;
              setFlagValues(updatedFlags);
            }}
            handleException={handleException}
            syncDataStatus={syncDataStatus}
          />
        )}
      </div>
      <div className="item-separator" />
    </div>
  );
};

export default RefreshDatabaseView;
