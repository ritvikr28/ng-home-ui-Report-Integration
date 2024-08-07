import { AxiosResponse } from "axios";
import { envConfig, service } from "../../utils";
import { IStaffBasicDetails } from "../../model/StaffDomain/responseModels";

export const fetchStaffDetails: (staffExternalIds: string[]) => Promise<IStaffDetailsByIdsResponse | null> = async (staffExternalIds: string[]) => {
    try {
      const requestData:{
        staffIds: string[];
    } = {
      staffIds : staffExternalIds
      }; 
      const response: AxiosResponse<IStaffDetailsByIdsResponse> = await service.post(
        `${envConfig.BASE_URL}/v1/staff/staffByIds`, 
        requestData
      );
      return response.data;
    } catch (err: any) {
      
      return null;
    }
  };
  
  export interface IStaffDetailsByIdsResponse{
    status: number;
    error: string;
    payload: IStaffBasicDetails[] | null;
  }
  