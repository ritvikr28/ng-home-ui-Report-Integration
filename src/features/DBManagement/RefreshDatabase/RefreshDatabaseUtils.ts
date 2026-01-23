import React, { ComponentType } from "react";
import { useHistory } from "react-router-dom";
import { AxiosResponse } from "axios";
import { IPrecheckStatusApiResponse } from "../../../shared/model/RefreshDatabase/responsemodel";
import { ISchoolNameDataResponse } from "../../../shared/model/SchoolDomain/responsemodels";
import { useFetchSchoolNameData } from "../../../shared/services/schoolDomain/schoolServices";
import { envConfig, getUserOrganisation, service } from "../../../shared/utils";
 
export interface Item {
  title: string;
  component: ComponentType<any>;
}



export const FetchPreCheckStatus : (handleException: () => void, history: any) => Promise<IPrecheckStatusApiResponse | null> = async (
  handleException: () => void,
  history: ReturnType<typeof useHistory>
): Promise<IPrecheckStatusApiResponse | null> => {
  const schoolData: ISchoolNameDataResponse | null = await useFetchSchoolNameData();
  const orgName: string = schoolData == null ? "" : schoolData.schoolName;
  const orgId : string = getUserOrganisation();

  try {
    const response: AxiosResponse<IPrecheckStatusApiResponse> =
      await service.get(
        `${envConfig.BASE_URL}/TrainingDB/PreCheckStatus/${orgId}?orgName=${orgName}`
      );
    return response.data;
  } catch (err: any) {
    if (err.response) {
      const statusCode : number = err.response.status;
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
    items: Item[];
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
    setActiveIndex,
    items
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