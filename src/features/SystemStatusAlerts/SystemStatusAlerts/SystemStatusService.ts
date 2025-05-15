import { AxiosResponse } from "axios";
import { History } from "history";
import { ISystemStatusAlertResponse } from "../../../shared/model/SystemStatus/responsemodel";
import { ISchoolNameDataResponse } from "../../../shared/model/SchoolDomain/responsemodels";
import { envConfig, getUserEmail, getUserOrganisation, service } from "../../../shared/utils";
import { useFetchSchoolNameData } from "../../../shared/services/schoolDomain/schoolServices";


export const fetchEmailAlertStatus = async (
  handleException: () => void,
  history: History
): Promise<ISystemStatusAlertResponse | null> => {

  const orgId = getUserOrganisation();
  const toEmailId = getUserEmail();

  if (!orgId || !toEmailId) {
    handleException();
    return null;
  }

  const requestBody = {
    orgId,
    toEmailId,
  };

  try {
    const response: AxiosResponse<ISystemStatusAlertResponse> = await service.post(
      `${envConfig.BASE_URL}/TrainingDB/SystemStatusAlert`,
      requestBody
    );

    if (response.data.responseCode === 200) {
      return response.data;
    } 
    
    console.error(`API call failed with response code: ${response.data.responseCode}`);
    handleException();

  } catch (err: any) {
    if (err.response) {
      const statusCode = err.response.status;
      console.error(`API call failed with status code: ${statusCode}`);
      if (statusCode === 401) {
        history.push("/unauthorized");
      } else {
        handleException();
      }
    } else if (err.message && err.message.includes("Invalid token")) {
      console.error("Invalid token detected. Redirecting...");
      history.replace("/unauthorized");
    } else {
      console.error("API call failed without a response from the server.");
    }
    handleException();
    return null;
  }

  return null;
};

export const activateEmailAlert = async (

  alertId: string,
  emailSubscribed: boolean,
  onSuccess: () => void,
  onError: (message: string) => void
): Promise<void> => {
  const schoolData: ISchoolNameDataResponse | null = await useFetchSchoolNameData();
  const orgName: string = schoolData == null ? "" : schoolData.schoolName;
  const requestBody = {
    orgId: getUserOrganisation(),
    toEmailId: getUserEmail(),
    orgName,
    indicator: emailSubscribed ? "D" : "A",
  };

  try {
    const response = await service.post(
      `${envConfig.BASE_URL}/TrainingDB/SystemStatusAlertEmail`,
      requestBody
    );

    if (response.status === 200) {
      onSuccess();
    } else {
      onError("A Technical issue at our end has stopped us from action.");
    }
  } catch (error) {
    console.error("Error updating email alert:", error);
    onError("A Technical issue at our end has stopped us from action.");
  }
};
