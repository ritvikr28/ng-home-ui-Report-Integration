import { buildApplicationUrl } from "@essnextgen/ui-application-kit";
import { AxiosResponse } from "axios";
import { service } from "../../utils/api-service";
import {IStaffTimeTableEventsResponse} from "../../model/SchoolDomain/responsemodels"

import apiUrls from "../../hook/ApiConfig.json";


export const useFetchSchoolNameData = async () => {
    const response = await service.get(`School/SchoolName`, buildApplicationUrl(apiUrls));
    return response.data;
};

export const FetchStaffTimeTableEventsData = async () => {
  const response: AxiosResponse<IStaffTimeTableEventsResponse[]> = await service.get(`StaffTimetable/StaffTimetableEvents`, buildApplicationUrl(apiUrls));
  return response.data;
};
