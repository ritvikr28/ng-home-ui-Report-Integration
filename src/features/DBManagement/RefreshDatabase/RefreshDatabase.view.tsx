import { Tag, TagSize, TagColor, Card, CardType } from "@essnextgen/ui-kit";
import "../style.scss";
import { useState } from "react";
import DetachDatabaseView from "./DetachDatabase.view";
import RefreshDatabase from "./RefreshDatabase";
// import DeleteNGDataView  from "./DeleteNGData.view";
// import AttachDatabaseView from "./AttachDatabase.view";
// import SyncDataView from "./SyncData.view";

const items = [
  { title: "Detach SIMS7 database", component: DetachDatabaseView }
  // { title: "Delete Next Gen data", component: DeleteNGDataView },
  // { title: "Attach SIMS7 database", component: AttachDatabaseView },
  // { title: "Sync SIMS7 data with Next Gen database", component: SyncDataView }
];

export const handleComplete = (
  index: number,
  value: string,
  flagValues: string[],
  setFlagValues: Function,
  setActiveIndex: Function
) => {
  // Update the flag for the completed step
  const updatedFlags = [...flagValues];
  updatedFlags[index] = value; // Set the flag value for the completed step
  setFlagValues(updatedFlags);

  if (index < items.length - 1) {
    setActiveIndex(index + 1);
  }
  return updatedFlags[index];
};

const RefreshDatabaseView = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [flagValues, setFlagValues] = useState<string[]>(
    new Array(items.length)
  );
  const updatedFlags = [...flagValues];

  return (
    <>
      <RefreshDatabase />
      <div className="list-item" style={{ width: "700px" }}>
        <Card id="test-card" type={CardType.Default}>
          {/* <GridItem sm={12}> */}
          <div className="module-block">
            {items.map((item, index) => {
              const CurrentComponent = item.component;
              const isActive = index === activeIndex;

              return (
                <div
                  key={index}
                  style={{
                    opacity: isActive ? 1 : 0.5,
                    pointerEvents: isActive ? "auto" : "none"
                  }}
                >
                  <div className="list-item" style={{ marginBottom: "20px" }}>
                    <div className="item-content">
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <h2
                          style={{ marginBottom: "0px", fontWeight: "normal" }}
                        >{`${index + 1}. ${item.title}`}</h2>
                        {flagValues[index] != null && (
                          <span style={{ marginLeft: "10px" }}>
                            <Tag
                              size={TagSize.Small}
                              color={TagColor.Success}
                              text={flagValues[index]}
                            />
                          </span>
                        )}
                      </div>

                      {/* <GridItem sm={12}> */}
                      {/* Render the active component and pass the onComplete prop */}
                      {isActive && (
                        <CurrentComponent
                          status={(value) =>
                            handleComplete(
                              index,
                              value,
                              updatedFlags,
                              setFlagValues,
                              setActiveIndex
                            )
                          }
                        />
                      )}
                      {/* </GridItem> */}
                    </div>
                  </div>
                  <div className="item-separator" />
                </div>
              );
            })}
          </div>
          {/* </GridItem> */}
        </Card>
      </div>
      {/* 
    {ShowSyncSuccess && 
        <ConfirmDialog
              cancelActionButtonText='Close'
              title={"Data Sync successfully"}
              onCloseHandle={() => setSyncSuccess(false)}
              onSubmitHandle={() => setSyncSuccess(false)}
              description={"SIMS7 data synced successfully with Next Gen database."}
            />
    }

    {ShowSyncFailure && 
        <ConfirmDialog
              cancelActionButtonText='Close'
              title={"Data Sync in progress"}
              onCloseHandle={() => setSyncFailure(false)}
              onSubmitHandle={() => setSyncFailure(false)}
              description={"SIMS7 data sync with Next Gen database failed. We apologise for any inconvenience. Please try again"}
            />
    } */}
    </>
  );
};

export default RefreshDatabaseView;
