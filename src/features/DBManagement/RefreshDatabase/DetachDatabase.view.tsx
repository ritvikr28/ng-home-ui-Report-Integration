import React, { SyntheticEvent, useState } from "react";
import { useHistory } from "react-router-dom";
import {
  ButtonSize,
  ReactionButtonGroup,
  ReactionButton,
  FormLabel
} from "@essnextgen/ui-kit";
import { useTranslation, UseTranslationResponse } from "@essnextgen/ui-intl-kit";
import { AxiosResponse } from "axios";
import { authService } from "@essnextgen/auth-ui";
import { envConfig, service, getUserOrganisation } from "../../../shared/utils";
import { errorHandler } from "../../../shared/utils/errorHandler";
import "../style.scss";
import { ISchoolNameDataResponse } from "../../../shared/model/SchoolDomain/responsemodels";
import { useFetchSchoolNameData } from "../../../shared/services/schoolDomain/schoolServices";
import { ISchoolDetailsDRApiResponse } from "../../../shared/model/RefreshDatabase/responsemodel";

export const FetchIsDetached = async (
  handleException: () => void,
  history: ReturnType<typeof useHistory> // Accept history to handle redirects
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
        operationIndicator: "D",
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
      if (err.response) {
        const statusCode = err.response.status;
        console.log(`API call failed with status code: ${statusCode}`);
        if (statusCode === 401) {
          errorHandler.handle401Error(statusCode, history);
        } else {
          handleException();
        }
      } 
      else if (err.message && err.message.includes("Invalid token")) {
        console.log("Invalid token detected. Redirecting...");
        history.replace("/unauthorized");
      }
      else {
        console.log("Failed to fetch data, API call failed without a response from the server.");
        handleException();
      }
        return null;
    }
  };

export interface DetachDatabaseViewProps {
  status: (value: string) => string;
  handleException: () => void; 
}

const DetachDatabaseView: React.FC<DetachDatabaseViewProps> = ({
  status,
  handleException
}) => {
  const [selectedOption, setSelectedValue]: [
    string,
    React.Dispatch<React.SetStateAction<string>>
  ] = useState<string>("No");

  const { t }: UseTranslationResponse<"translation", undefined> =
    useTranslation();

  const history = useHistory(); // Initialize useHistory
    
  const handleSetIsDetached = async () => {
    // Get detached status
    const response: ISchoolDetailsDRApiResponse | null =
      await FetchIsDetached(handleException, history);

      if (response != null) {
        if (response.statusCode === 200) {
          status(response.uiStatus as string);
        } else {
          handleException(); // Trigger exception handling in parent
        }
      } else {
        handleException(); // Trigger exception handling in parent
      }
  };

  const handleSelectionChange = async (value: string) => {
    setSelectedValue(value as string);
    const isDetached = value === "Yes";
    if (isDetached) {
      await handleSetIsDetached();
    }
  };

  return (
    <>
    <div id='detach-container'>
      <FormLabel dataTestId="detachDBtitle" id="default-control-label">
        {t("RefreshDB_T.moduleBlock.detachDB.content")}
      </FormLabel>
      <FormLabel dataTestId="attachDBbutton" id="default-label">
        {t("RefreshDB_T.moduleBlock.detachDB.content1")}
      </FormLabel>
      
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
        <ReactionButton dataTestId="Yes" id="reaction-button" label={t("RefreshDB_T.moduleBlock.modal.button2")} value="Yes" />
        <ReactionButton dataTestId="No" id="reaction-button" label={t("RefreshDB_T.moduleBlock.modal.button3")} value="No" />
      </ReactionButtonGroup>
      </div>
    </>
  );
};

export default DetachDatabaseView;
