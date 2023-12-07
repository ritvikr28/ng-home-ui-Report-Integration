import { buildApplicationUrl } from "@essnextgen/ui-application-kit";
import { AxiosResponse } from "axios";
import { service } from "../../utils/api-service";
import apiUrls from "../../hook/ApiConfig.json";
import { IRegistersDetails } from "../../model/RegisterDomain/responsemodels";
import { logger } from "../../components/AppInsights";


export const FetchRegisterEventData: () => Promise<IRegistersDetails[] | null> = async () => {
  try {
    const response: AxiosResponse<IRegistersDetails[]> = await service.get(
      `RegisterDetails/LessonAndClassDetails`,
      buildApplicationUrl(apiUrls)
    );

    if (response.status === 200 && response !== null) {
      return response.data;
    } 
      return null;
    
  } catch (err:any) {
    logger.error({
      error:"Failed to fetch registers details",
      code: err.name
    });
    throw new Error("Failed to fetch registers details");
  }
};

