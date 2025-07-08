import { AxiosResponse } from "axios";
import { buildApplicationUrl } from "@essnextgen/ui-application-kit";
import { service } from "../../shared/utils";
import {
  DocumentBasicDetails,
  DocumentManagementServerProps,
} from "./responseModel";
import { PLATFORM_BASEURLS } from "../../ApiConfig.json";

export const fetchDocumentDetails: ({
  pageNumber,
  pageSize,
}: DocumentManagementServerProps) => Promise<DocumentBasicDetails | null> = async ({
  pageNumber,
  pageSize,
}: DocumentManagementServerProps) => {
  try {
    const url = `/validation/api/v1/file/getdocumentdetails?DocumentsRequest.PageNumber=${pageNumber}&DocumentsRequest.PageSize=${pageSize}`;
    const baseUrl = buildApplicationUrl(PLATFORM_BASEURLS);
    const responseData: AxiosResponse<DocumentBasicDetails> = await service.get(
      url,
      baseUrl
    );
    if (responseData?.status === 200) {
      return responseData?.data;
    }
    return null;
  } catch (err: any) {
    return null;
  }
};
