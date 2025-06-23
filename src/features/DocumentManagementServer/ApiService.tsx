import { AxiosResponse } from "axios";
import { service } from "../../shared/utils";
import { DocumentBasicDetailsResponse } from "./responseModel";
import { buildApplicationUrl } from "@essnextgen/ui-application-kit";
import {PLATFORM_BASEURLS} from "../../ApiConfig.json"

export const fetchDocumentDetails: (PageNumber: number, PageSize: number) => Promise<DocumentBasicDetailsResponse | null> = async (PageNumber: number, PageSize: number) => {
  try {
    const responseData: AxiosResponse<DocumentBasicDetailsResponse> =
      await service.get(
        `file/getdocumentdetails?DocumentsRequest.PageNumber=${PageNumber}&DocumentsRequest.PageSize=${PageSize}`,
        buildApplicationUrl(PLATFORM_BASEURLS)

      );
    if (responseData.status === 200 && responseData !== null) {
      return responseData.data;
    }
    return null;

  } catch (err: any) {
    return null;
  }
};