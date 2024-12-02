import React, { SyntheticEvent, useState } from "react";
import {
  ButtonSize,
  ReactionButtonGroup,
  ReactionButton
} from "@essnextgen/ui-kit";
import { AxiosResponse } from "axios";
import { authService } from "@essnextgen/auth-ui";
import { envConfig, service, getUserOrganisation } from "../../../shared/utils";
import "../style.scss";
import { ISchoolNameDataResponse } from "../../../shared/model/SchoolDomain/responsemodels";
import { useFetchSchoolNameData } from "../../../shared/services/schoolDomain/schoolServices";
import { ISchoolDetailsDRApiResponse } from "../../../shared/model/RefreshDatabase/responsemodel";

export const FetchIsAttached = async (
  handleException: () => void
): Promise<ISchoolDetailsDRApiResponse | null> => {
    try {
      const schoolData: ISchoolNameDataResponse | null =
        await useFetchSchoolNameData();
      const orgName: string = schoolData == null ? "" : schoolData.schoolName;

      const requestData: {
        operationIndicator: string;
        orgId: string;
        orgName: string;
        tableFlagValue: string;
        actorName: string;
      } = {
        operationIndicator: "R",
        orgId: getUserOrganisation(),
        orgName,
        tableFlagValue: "Y",
        actorName: authService.getUsername()
      };
      const response: AxiosResponse<ISchoolDetailsDRApiResponse> =
        await service.post(
          `${envConfig.BASE_URL}/TrainingDB/SchoolDetailsDR`,
          requestData
        );
      return response.data;
    } catch (err: any) {
      handleException();
      console.error("Failed to fetch data");
      return null;
    }
  };

export interface AttachDatabaseViewProps {
  status: (value: string) => string;
  handleException: () => void; 
}

const AttachDatabaseView: React.FC<AttachDatabaseViewProps> = ({
  status,
  handleException
}) => {
  const [selectedOption, setSelectedValue]: [
    string,
    React.Dispatch<React.SetStateAction<string>>
  ] = useState<string>("No");


  const handleSetIsAttached = async () => {
    // Get Re-attached status
    const response: ISchoolDetailsDRApiResponse | null =
      await FetchIsAttached(handleException);

      if (response != null) {
        if (response.statusCode === 200) {
          status(response.uiStatus as string);
        } else {
          handleException(); 
        }
      } else {
        handleException(); 
      }
  };

  const handleSelectionChange = async (value: string) => {
    setSelectedValue(value as string);
    const isAttached = value === "Yes";
    if (isAttached) {
      await handleSetIsAttached();
    }
  };

  return (
    <>
    <div id='detach-container'>
      <p id="default-control-label">
        Is the SIMS7 database attached?
      </p>
      <p id="default-label">
        Please click on Yes to attach
      </p>
      
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
        <ReactionButton id="reaction-button" label="Yes" value="Yes" />
        <ReactionButton id="reaction-button" label="No" value="No" />
      </ReactionButtonGroup>
      </div>
    </>
  );
};

export default AttachDatabaseView;
