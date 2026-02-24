import { buildApplicationUrl } from "@essnextgen/ui-application-kit";

import { AxiosResponse } from "axios";
import { service } from "../../utils/api-service";

import apiUrls from "../../hook/ApiConfig.json";

import { IQuickLinkApiResponse } from "../../model/quickLink/responsemodels";
import { envConfig } from "../../utils";
import { flagrWithModueCheckAndOrgCheck } from "../../utils/flagr-helper";


export const FetchQuickLinkData:(role: string) => Promise<{ 
  status: number;
  response: IQuickLinkApiResponse[] } | null> = async () => {
    try {
      let userLanguage: string;
        const languageCode = localStorage.getItem("i18nextLng") || navigator.language;
        if (languageCode == null || languageCode === undefined || languageCode === "") {
          userLanguage = navigator.language;
        }
        else {
          userLanguage = languageCode.includes("en") ? "en-US" : "cy";
        }
        const responseData: AxiosResponse<IQuickLinkApiResponse[]> = await service.get(
           `v2/quicklink?languageCode=${userLanguage}`,
          buildApplicationUrl(apiUrls)
        );
        const {status}: { status: number } = responseData;
        const response:IQuickLinkApiResponse[]= responseData.data;
        
        if (status === 200 && response.length > 0) {
          const result:IQuickLinkApiResponse[] = response.filter(x=>{
          const flagresult:boolean = flagrWithModueCheckAndOrgCheck("ExcludedQuickLinks", "ExcludedModules", x.id.toString(), envConfig.APPLICATION);
                if (!flagresult) {
                  return false;
                }
                return true;
          })          
           
           return { status, response:result };
         
        }        
        return { status, response };
       
    }
    catch (error) {
    return null;
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
    return null;
  }
};
