import { AxiosResponse } from "axios";
import { buildApplicationUrl } from "@essnextgen/ui-application-kit";
import { service } from "../../shared/utils";
import {
  DocumentBasicDetails,
  DocumentManagementServerProps
} from "./responseModel";
import { PLATFORM_BASEURLS } from "../../ApiConfig.json";

export const fetchDocumentDetails = async ({
  pageNumber,
  pageSize,
  searchText = '',
  categoryId = [],
  fromDate = '',
  toDate = '',
  sortBy = 'DateAdded',
  sortDirection = 'Desc',
}: DocumentManagementServerProps): Promise<DocumentBasicDetails | null> => {
  try {
    const url = `validation/api/v1/file/getdocumentdetails`;
    const baseUrl = buildApplicationUrl(PLATFORM_BASEURLS);
 
    const payload = {
      documentsRequest: {
        pageNumber,
        pageSize,
        searchText,
        categoryId,
        fromDate,
        toDate,
        sortBy,
        sortDirection,
      },
    };
 
    const responseData: AxiosResponse<DocumentBasicDetails> =
      await service.post(url, payload, { baseURL: baseUrl });
    if (responseData?.status === 200) {
      return responseData?.data;
    }
    return null;
  } catch (err: any) {
    return null;
  }
};
