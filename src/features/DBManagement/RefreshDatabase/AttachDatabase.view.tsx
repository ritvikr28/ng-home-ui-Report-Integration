import React, { SyntheticEvent, useState } from "react";
import {
  ButtonSize,
  ReactionButtonGroup,
  ReactionButton
} from "@essnextgen/ui-kit";
import { service } from "../../../shared/utils";
import "../style.scss";

export const FetchIsAttached: (
  selectedValue: boolean
) => Promise<string> = async (selectedValue: boolean) => {
  try {
    const requestData: {
      selectedValue: boolean;
    } = {
      selectedValue
    };
    const response: any = await service.get(
      "http://localhost:5010/api/v1/quicklink/IsDetached?isDetached=false"
    );
    console.log(requestData);
    return response.data;
  } catch (err: any) {
    return null;
  }
};

export interface AttachDatabaseViewProps {
  status: (value: string) => string;
}

const AttachDatabaseView: React.FC<AttachDatabaseViewProps> = ({ status }) => {
  const [selectedOption, setSelectedValue] = useState<string>("No");
  const [attachedFlag, setIsAttached] = useState<string>("");

  const handleSetIsAttached = async (value: boolean) => {
    const responseData = await FetchIsAttached(value);

    if (responseData != null) {
      setIsAttached(responseData as string);
      status(responseData as string);
    } else {
      console.error("Failed to fetch data");
    }
  };

  const handleSelectionChange = async (value: string) => {
    setSelectedValue(value as string);
    const isAttached = value === "Yes";
    console.log(attachedFlag);
    await handleSetIsAttached(isAttached);
  };

  return (
    <>
      {/* <div style={{ display: "flex", alignItems: "center", marginTop: "4px" }}> */}
      <h4 style={{ marginTop: "10px", marginBottom: "5px" }}>
        Is the SIMS7 database attached?
      </h4>
      {/* </div> */}
      Please click on Yes to attach
      <ReactionButtonGroup
        id="add-side-panel-types"
        dataTestId="type-test-id"
        size={ButtonSize.Small}
        selectedValue={selectedOption}
        onChange={(
          e: SyntheticEvent<Element, Event>,
          selectedValue: string | number
        ) => {
          handleSelectionChange(selectedValue as string);
        }}
      >
        <ReactionButton label="Yes" value="Yes" className="reaction-Button" />
        <ReactionButton label="No" value="No" className="reaction-Button" />
      </ReactionButtonGroup>
    </>
  );
};

export default AttachDatabaseView;
