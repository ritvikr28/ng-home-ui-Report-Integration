import { buildApplicationUrl } from "@essnextgen/ui-application-kit";

import { AxiosResponse } from "axios";
import { service } from "../../utils/api-service";

import apiUrls from "../../hook/ApiConfig.json";

import { IQuickLinkApiResponse } from "../../model/quickLink/responsemodels";
import { envConfig } from "../../utils";
import { logger } from "../../components/AppInsights";

export const FetchQuickLinkData:(role: string) => Promise<{
  status: number;
  response: IQuickLinkApiResponse[];
}> = async (role: string) => {
    try {
        const responseData: AxiosResponse<IQuickLinkApiResponse[]> = await service.get(
          `v1/quicklink?role=${role}`,
          buildApplicationUrl(apiUrls)
        );
        const {status}: { status: number } = responseData;
        const response:IQuickLinkApiResponse[]= responseData.data;
        return { status, response };
       
    }
        catch (err:any) {
          logger.error({
            error:"Failed to fetch quick link details",
            code: err.name
          });
   
    throw new Error("Failed to fetch quick link details");
  }
};

export const FetchQuickLinkpost:(id: number, operation: boolean) => Promise<AxiosResponse> = async (id: number, operation: boolean) => {
  try {
    const requestData:{
      quickLinkId: number;
      operation: boolean;
  } = {
      quickLinkId: id,
      operation
    };
    const response: any = await service.post(
          `${envConfig.BASE_URL}/v1/quicklink`,
          requestData
        ); 
        return response.data;
  } catch (err:any) {
    logger.error({
      error:"Failed to mark Favourite/Unfavourite",
      code: err.name
    });
    throw new Error("Failed to mark Favourite/Unfavourite");
  }
};
