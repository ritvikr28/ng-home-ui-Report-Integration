import React, { SyntheticEvent, useState } from "react";
import {
  ButtonSize,
  ReactionButtonGroup,
  ReactionButton,
  FormLabel
} from "@essnextgen/ui-kit";
import { AxiosResponse } from "axios";
import { authService } from "@essnextgen/auth-ui";
import { envConfig, service, getUserOrganisation } from "../../../shared/utils";
import "../style.scss";
import { ISchoolNameDataResponse } from "../../../shared/model/SchoolDomain/responsemodels";
import { useFetchSchoolNameData } from "../../../shared/services/schoolDomain/schoolServices";
import { ISchoolDetailsDRApiResponse } from "../../../shared/model/RefreshDatabase/responsemodel";
import { useTranslation, UseTranslationResponse } from "@essnextgen/ui-intl-kit";

export const FetchIsDetached = async (
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
      handleException();
      console.error("Failed to fetch data");
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

  const handleSetIsDetached = async () => {
    // Get detached status
    const response: ISchoolDetailsDRApiResponse | null =
      await FetchIsDetached(handleException);

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
      <FormLabel id="default-control-label">
        {t("RefreshDB_T.moduleBlock.attachDB.title")}
      </FormLabel>
      <FormLabel id="default-label">
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
        <ReactionButton id="reaction-button" label={t("RefreshDB_T.moduleBlock.modal.button2")} value="Yes" />
        <ReactionButton id="reaction-button" label={t("RefreshDB_T.moduleBlock.modal.button3")} value="No" />
      </ReactionButtonGroup>
      </div>
    </>
  );
};

export default DetachDatabaseView;
