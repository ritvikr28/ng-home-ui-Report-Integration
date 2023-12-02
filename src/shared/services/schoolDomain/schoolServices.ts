import { buildApplicationUrl } from "@essnextgen/ui-application-kit";
import { AxiosResponse } from "axios";
import { service } from "../../utils/api-service";
import { IStaffTimeTableEventsResponse,IGroupMemberDetailsResponse,ISchoolNameDataResponse} from "../../model/SchoolDomain/responsemodels"
import apiUrls from "../../hook/ApiConfig.json";

export interface IStaffTimeTableEventsDataResponse {
  status: number;
  responseData: IStaffTimeTableEventsResponse[];
}


export interface IGroupMemberDetailsDataResponse {
  total: number;
  data: IGroupMemberDetailsResponse[];
}

export const useFetchSchoolNameData:() =>Promise<ISchoolNameDataResponse>= async () => {
  try
  {
    const response:AxiosResponse<ISchoolNameDataResponse> = await service.get(`School/SchoolName`);
    return response.data;
  }
  catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }

};


export const FetchStaffTimeTableEventsData:() =>Promise<IStaffTimeTableEventsDataResponse>= async () => {
  try {

    const response: AxiosResponse<IStaffTimeTableEventsResponse[]>= await service.get(
      `StaffTimetable/StaffTimetableEvents`,
      buildApplicationUrl(apiUrls)
    );
    const {status}: { status: number } = response;
    const responseData:IStaffTimeTableEventsResponse[] = response.data;
    return { status, responseData };
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};


export const FetchGroupMemberDetailsData:(
  groupExternalId:string,
  startDate: string,
  endDate: string
)=>Promise<IGroupMemberDetailsResponse[]> = async (
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
    console.error('Error fetching group member details:', error);
    throw new Error('Failed to fetch group member details');
  }
};

