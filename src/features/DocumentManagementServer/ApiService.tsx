import { buildApplicationUrl } from "@essnextgen/ui-application-kit";
import { AxiosResponse } from "axios";
import { service } from "../../shared/utils";
import { DocumentBasicDetails, DocumentManagementServerProps, DocumentPrepareDownload, PrepareDownloadRequest } from "./responseModel";
import {PLATFORM_BASEURLS, STAFFPROFILE_BASEURLS} from "../../ApiConfig.json"
import { Doc } from "prettier";

export const fetchDocumentDetails = async ({
  pageNumber,
  pageSize,
  searchText = '',
  categoryId = [],
  fromDate = '',
  toDate = '',
  sortBy = 'DateAdded',
  sortDirection = 'Desc',
  isSearchTextExactMatch = false,
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
        isSearchTextExactMatch
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

export const fetchDMSSuggestions = async (
  searchText: string,
  fromDate: string,
  toDate: string,
  categoryId: number[] | null
): Promise<any> => {
  try {
    const baseUrl = buildApplicationUrl(PLATFORM_BASEURLS);

    // Build query params
    const params = [
      `AutoCompleteRequest.SearchText=${encodeURIComponent(searchText)}`,
      ...(categoryId && categoryId.length > 0
        ? categoryId.map(id => `AutoCompleteRequest.CategoryId=${encodeURIComponent(id)}`)
        : []),
      fromDate ? `AutoCompleteRequest.FromDate=${encodeURIComponent(fromDate)}` : "",
      toDate ? `AutoCompleteRequest.ToDate=${encodeURIComponent(toDate)}` : ""
    ]
      .filter(Boolean)
      .join("&");

    const url = `/validation/api/v1/file/search/autocomplete?${params}`;
    const response: AxiosResponse = await service.get(url, baseUrl);
    return response?.data;
  } catch (err) {
    console.error("Error fetching DMS suggestions:", err);
    return {};
  }
};

export const fetchFilterCategory = async (): Promise<any> => {
  try {
    const baseUrl = buildApplicationUrl(PLATFORM_BASEURLS);
    const url = `/validation/api/v1/applicationregistration`;
    const response: AxiosResponse = await service.get(url, baseUrl);
    return response?.data;
  } catch (err) {
    console.error("Error fetching DMS suggestions:", err);
    return {};
  }
}

export const prepareAndDownloadFile = async (payload: { request: any }) => {
  try {
    const baseUrl = buildApplicationUrl(PLATFORM_BASEURLS);
    const url = `/validation/api/v1/file/preparedownload`;
    const responseData: AxiosResponse<DocumentPrepareDownload> = await service.post(url, payload, { baseURL: baseUrl });

    return responseData?.status; // Return status code directly
  } catch (error: any) {
    // If error response exists, return its status
    if (error?.response?.status) {
      return error.response.status;
    }
    return 400; // Default to error status
  }
};

export const viewDownload = async (): Promise<any> => {
  try {
    const baseUrl = buildApplicationUrl(PLATFORM_BASEURLS);
    const url = `/validation/api/v1/file/viewDownload`;
    const response: AxiosResponse = await service.get(url, baseUrl);
    return response;
  } catch (err) {
    console.error("Error fetching view downloads data:", err);
    return {};
  }
};

export const fetchStaffProfilePhoto = async (externalId: string): Promise<any> => {
  try {
    const baseUrl = buildApplicationUrl(STAFFPROFILE_BASEURLS);
    const url = `/api/v1/personThumbnailImage/${externalId}`;
    const response: AxiosResponse = await service.get(url, baseUrl);
    return response;
  } catch (err) {
    console.error("Error fetching staff profile photo:", err);
    return {};
  }
};