import { buildApplicationUrl } from "@essnextgen/ui-application-kit";
import { service } from "../../utils/api-service";

import apiUrls from "../../hook/ApiConfig.json";


export const useFetchSchoolNameData = async () => {
    const response = await service.get(`School/SchoolName`, buildApplicationUrl(apiUrls));
    return response.data;
  };
