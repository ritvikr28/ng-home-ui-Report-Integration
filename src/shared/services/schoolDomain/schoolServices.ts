import { buildApplicationUrl } from "@essnextgen/ui-application-kit";
import { AxiosResponse } from "axios";
import { service } from "../../utils/api-service";
import { IStaffTimeTableEventsResponse,IGroupMemberDetailsResponse,ISchoolNameDataResponse} from "../../model/SchoolDomain/responsemodels"
import apiUrls from "../../hook/ApiConfig.json";
import { logger } from "../../components/AppInsights";

export interface IStaffTimeTableEventsDataResponse {
  status: number;
  responseData: IStaffTimeTableEventsResponse[] | null;
}


export interface IGroupMemberDetailsDataResponse {
  total: number;
  data: IGroupMemberDetailsResponse[];
}

export const useFetchSchoolNameData:() =>Promise<ISchoolNameDataResponse | null>= async () => {
  try
  {
    const response:AxiosResponse<ISchoolNameDataResponse> = await service.get(`School/SchoolName`);
    return response.data;
  }
  catch (error) {
    throw new Error('Failed to fetch school name');  }
};


export const FetchStaffTimeTableEventsData:() =>Promise<IStaffTimeTableEventsDataResponse |null>= async () => {
  try {

    const response: AxiosResponse<IStaffTimeTableEventsResponse[] | null>= await service.get(
      `StaffTimetable/StaffTimetableEvents`,
      buildApplicationUrl(apiUrls)
    );
    const {status}: { status: number } = response;
    const responseData:IStaffTimeTableEventsResponse[] | null = response.data;
    return { status, responseData };
  } catch (err:any) {
    logger.error({
      error:"Failed to fetch staff timetable details",
      code: err.name
    });
    throw new Error('Failed to fetch staff timetable details');
  }
};


export const FetchGroupMemberDetailsData:(
  groupExternalId:string,
  startDate: string,
  endDate: string
)=>Promise<IGroupMemberDetailsResponse[] | null> = async (
  groupExternalId:string,
  startDate: string,
  endDate: string
) =>{
  try {

    const responseData: AxiosResponse<IGroupMemberDetailsDataResponse> =await service.get(
      `School/GroupMemberDetails?groupExternalId=${groupExternalId}&startDate=${startDate}&endDate=${endDate}`,
      buildApplicationUrl(apiUrls)
    );
    return responseData.data.data;
  } catch (error) {
    throw new Error('Failed to fetch group member details');
  }
};

