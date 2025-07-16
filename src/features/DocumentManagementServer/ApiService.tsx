import { buildApplicationUrl } from "@essnextgen/ui-application-kit";
import { AxiosResponse } from "axios";
import { service } from "../../shared/utils";
import { DocumentBasicDetails, DocumentManagementServerProps } from "./responseModel";
import {PLATFORM_BASEURLS} from "../../ApiConfig.json"

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
    return err?.response?.data ;
  }
};

export const fetchDMSSuggestions = async (searchText: string): Promise<any> => {
  try {
    const baseUrl = buildApplicationUrl(PLATFORM_BASEURLS);
    const url = `/validation/api/v1/file/search/autocomplete?AutoCompleteRequest.SearchText=${encodeURIComponent(
      searchText
    )}`;
    const response: AxiosResponse = await service.get(url, baseUrl);
    return response?.data;
  } catch (err) {
    console.error("Error fetching DMS suggestions:", err);
    return {};
  }
};