import { AxiosResponse } from "axios";
import { service } from "../../shared/utils";
import { DocumentBasicDetailsResponse, DocumentManagementServerProps } from "./responseModel";
import { buildApplicationUrl } from "@essnextgen/ui-application-kit";
import {PLATFORM_BASEURLS} from "../../ApiConfig.json"

export const fetchDocumentDetails: ({pageNumber, pageSize}: DocumentManagementServerProps) => Promise<DocumentBasicDetailsResponse | null> = async ({pageNumber, pageSize}:DocumentManagementServerProps) => {
 
  try {
    const url =`file/getdocumentdetails?DocumentsRequest.PageNumber=${pageNumber}&DocumentsRequest.PageSize=${pageSize}`;
    const baseUrl = buildApplicationUrl(PLATFORM_BASEURLS);
    const responseData: AxiosResponse<DocumentBasicDetailsResponse> =
      await service.get(url, baseUrl);
      if (responseData.status === 200) {
      return responseData.data;
    }
    return null;

  } catch (err: any) {
    return null;
  }
};