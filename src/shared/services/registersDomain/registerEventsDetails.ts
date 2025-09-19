import { buildApplicationUrl } from "@essnextgen/ui-application-kit";
import { AxiosResponse } from "axios";
import { service } from "../../utils/api-service";
import apiUrls from "../../hook/ApiConfig.json";
import { IRegistersDetails } from "../../model/RegisterDomain/responsemodels";
import { IStaffTimeTableEventsResponse } from "../../model/SchoolDomain/responsemodels";

export interface IStaffTimetableAndRegisterDetailsResponse {
  errors: any;
  payload: {
    registerDetailResponse: IRegistersDetails[] | null;
    staffTimetableEventsResponse: IStaffTimeTableEventsResponse[] | null;
  };
  status: number;
}

// Fetches both register and staff timetable details
export const FetchStaffTimetableAndRegisterDetails: () => Promise<IStaffTimetableAndRegisterDetailsResponse | null> = async () => {
  try {
    const response: AxiosResponse<IStaffTimetableAndRegisterDetailsResponse> = await service.get(
      `RegisterDetails/StaffTimetableAndRegisterDetails`,
      buildApplicationUrl(apiUrls)
    );

    if (response.status === 200 && response !== null) {
      return response.data;
    }
    return null;
  } catch (err: any) {
    return null;
  }
};
