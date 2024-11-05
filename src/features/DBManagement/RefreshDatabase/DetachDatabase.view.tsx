import React, { SyntheticEvent, useState, useEffect } from "react";
import {
  ButtonSize,
  ReactionButtonGroup,
  ReactionButton,
} from "@essnextgen/ui-kit";
import axios, { AxiosResponse } from "axios";
import { envConfig, service } from "../../../shared/utils";
import "../style.scss";

export enum BinaryResponse {
  Yes = "yes",
  No = "no",
}

export const FetchIsDetached :(selectedValue: boolean) => Promise<string> = async (selectedValue: boolean) => {
  try {
    const requestData:{
      selectedValue: boolean;
  } = {
    selectedValue
    };
    const response: any = await service.get(
      'http://localhost:5010/api/v1/quicklink/IsDetached?isDetached=false'
      ); 
        return response.data;
  } catch (err:any) {
    return null;
  }
};


export interface DetachDatabaseViewProps {
  status: (value : string) => string 
}

const DetachDatabaseView: React.FC<DetachDatabaseViewProps> = ({ status }) => {
  const [selectedValue, setSelectedValue] = useState<BinaryResponse>(BinaryResponse.No);
  const [detachedFlag, setIsDetached] = useState<string>("");
  
  const handleSetIsDetached = async (value: boolean) => {
    const responseData = await FetchIsDetached(value);

    if (responseData != null) {
      setIsDetached(responseData as string); 
      status(responseData as string);
    } else {
      console.error("Failed to fetch data");
    }
  };

  const handleSelectionChange = async (value : BinaryResponse) => {
    setSelectedValue(value as BinaryResponse);
    const isDetached = value === BinaryResponse.Yes ? true : false;
    await handleSetIsDetached(isDetached);
  };

  return (
    <>
      {/* <div style={{ display: "flex", alignItems: "center", marginTop: "4px" }}> */}
      <h4 style={{marginTop:'10px', marginBottom:'5px'}}>Is the SIMS7 database detached?</h4>
      {/* </div> */}
      Please click on Yes to detach
      <ReactionButtonGroup
        id="add-side-panel-types"
        dataTestId="type-test-id"
        size={ButtonSize.Small}
        selectedValue={selectedValue} // Update this to bind the selected value
        onChange={(e: SyntheticEvent<Element, Event>, selectedValue: string | number) => {
          handleSelectionChange(selectedValue as BinaryResponse);
        }}
      >
        <ReactionButton
          label="Yes"
          value={BinaryResponse.Yes}
          className="reaction-Button"
        />
        <ReactionButton
          label="No"
          value={BinaryResponse.No}
          className="reaction-Button"
        />
      </ReactionButtonGroup>
    </>
  );
};

export default DetachDatabaseView;
