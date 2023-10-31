import { buildApplicationUrl } from "@essnextgen/ui-application-kit";
import { service } from "../../utils/api-service";
import apiUrls from "../../hook/ApiConfig.json";


export const useFetchRegisterEventData = async () => {
    const response = await service.get(`RegisterDetails/LessonAndClassDetails`, buildApplicationUrl(apiUrls));
    return response.data;
  };
