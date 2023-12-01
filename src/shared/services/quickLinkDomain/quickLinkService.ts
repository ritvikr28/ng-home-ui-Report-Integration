import { buildApplicationUrl } from "@essnextgen/ui-application-kit";

import { AxiosResponse } from "axios";
import { service } from "../../utils/api-service";

import apiUrls from "../../hook/ApiConfig.json";

import { IQuickLinkApiResponse } from "../../model/quickLink/responsemodels";
import { envConfig } from "../../utils";

export const FetchQuickLinkData = async (role: string) => {
    try {
        const responseData: AxiosResponse<IQuickLinkApiResponse[]> = await service.get(
          `v1/quicklink?role=${role}`,
          buildApplicationUrl(apiUrls)
        );
        const {status} = responseData;
        const response = responseData.data;
        return { status, response };
       
    }
        catch (error) {
   
    throw new Error("Failed to fetch quick link details");
  }
};

export const FetchQuickLinkpost = async (id: number, operation: boolean) => {
  try {
    const requestData = {
      quickLinkId: id,
      operation,
    };
    console.log(requestData);
    const response: any = await service.post(
          `${envConfig.BASE_URL}/v1/quicklink`,
          requestData
        );
        console.log(response);
        return response.data;
  } catch (error) {
    throw new Error("Failed to fetch quick link details");
  }
};
console.log(`Called${FetchQuickLinkpost}`);
