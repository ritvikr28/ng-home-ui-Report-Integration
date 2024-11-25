import { Tag, TagSize, TagColor, Card, CardType } from "@essnextgen/ui-kit";
import "../style.scss";
import React, { useState, ComponentType } from "react";
import DetachDatabaseView from "./DetachDatabase.view";
import RefreshDatabase from "./RefreshDatabase";
import DeleteNGDataView  from "./DeleteNGData.view";
import AttachDatabaseView from "./AttachDatabase.view";
import SyncDataView from "./SyncData.view";

// Define the interface for each item in the items array
interface Item {
  title: string;
  component: ComponentType<any>;
}

// Define items with the components to be rendered
const items: Item[] = [
  { title: "Detach SIMS7 database", component: DetachDatabaseView },
  { title: "Delete Next Gen data", component: DeleteNGDataView },
  { title: "Attach SIMS7 database", component: AttachDatabaseView },
  { title: "Sync SIMS7 data with Next Gen database", component: SyncDataView }
];

interface IHandleCompleteProps {
  index: number;
  value: string;
  flagValues: string[];
  setFlagValues: React.Dispatch<React.SetStateAction<string[]>>;
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
}

// The function now uses the HandleCompleteParams interface for its parameters
export const handleComplete = (props: IHandleCompleteProps): string => {
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

  // Move to the next step if there are more steps
  if (index < items.length - 1) {
    setActiveIndex(index + 1);
  }
  return updatedFlags[index];
};

const RefreshDatabaseView: () => JSX.Element = () => {
  const [activeIndex, setActiveIndex]: [
    number,
    React.Dispatch<React.SetStateAction<number>>
  ] = useState<number>(0);
  const [flagValues, setFlagValues]: [
    string[],
    React.Dispatch<React.SetStateAction<string[]>>
  ] = useState<string[]>(new Array(items.length).fill(""));

  return (
    <>
      <RefreshDatabase />
      <div className="list-item" style={{ width: "700px" }}>
        <Card id="test-card" type={CardType.Default}>
          <div className="module-block">
            {items.map((item, index) => {
              const CurrentComponent: ComponentType<any> = item.component;
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
                        >
                          {`${index + 1}. ${item.title}`}
                        </h2>
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
                        />
                      )}
                    </div>
                  </div>
                  <div className="item-separator" />
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </>
  );
};

export default RefreshDatabaseView;
