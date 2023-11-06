import { buildApplicationUrl } from "@essnextgen/ui-application-kit";
import { AxiosResponse } from "axios";
import { service } from "../../utils/api-service";
import apiUrls from "../../hook/ApiConfig.json";
import { IRegistersDetails } from "../../../features/MainPanel/TakeRegisters/model";


export const FetchRegisterEventData = async () => {
  const response: AxiosResponse<IRegistersDetails[]> = await service.get(
    `RegisterDetails/LessonAndClassDetails`,
    buildApplicationUrl(apiUrls)
  );

  if (response.status === 200) {
    return response.data;
  }
  if (response.status === 204) {
    return null;
  }

  throw new Error(`Unexpected status code: ${response.status}`);
};

