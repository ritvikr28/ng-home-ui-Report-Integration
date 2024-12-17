import React, { SyntheticEvent, useState } from "react";
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
import "../style.scss";
import { ISchoolNameDataResponse } from "../../../shared/model/SchoolDomain/responsemodels";
import { useFetchSchoolNameData } from "../../../shared/services/schoolDomain/schoolServices";
import { ISchoolDetailsDRApiResponse } from "../../../shared/model/RefreshDatabase/responsemodel";
import { errorHandler } from "../../../shared/utils/errorHandler";

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
      if (err.response) {
        const statusCode = err.response.status;
        console.log(`API call failed with status code: ${statusCode}`);
        if (statusCode === 401) {
          errorHandler.handle401Error(statusCode);
        } else {
          handleException();
        }
      } else {
        console.log("Failed to fetch data, API call failed without a response from the server.");
        handleException();
      }
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

  const { t }: UseTranslationResponse<"translation", undefined> =
    useTranslation();

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
      <FormLabel dataTestId="attachDbTitle" id="default-control-label">
        {t("RefreshDB_T.moduleBlock.attachDB.title")}
      </FormLabel>
      <FormLabel dataTestId="attachDbButton" id="default-label">
        {t("RefreshDB_T.moduleBlock.attachDB.button")}
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

export default AttachDatabaseView;
