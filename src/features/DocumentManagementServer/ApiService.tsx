
import { buildApplicationUrl } from "@essnextgen/ui-application-kit";
import axios, { AxiosInstance, AxiosResponse } from "axios";
import { authService } from "@essnextgen/auth-ui";
import { service } from "../../shared/utils";
import { deleteDocumentRequest, DocumentBasicDetails, DocumentManagementServerProps, DocumentPrepareDownload } from "./responseModel";
import {PLATFORM_BASEURLS, STAFFPROFILE_BASEURLS} from "../../ApiConfig.json"

export const fetchDocumentDetails = async ({
  pageNumber,
  pageSize,
  categoryId = [],
  fromDate = '',
  toDate = '',
  sortBy = 'DateAdded',
  sortDirection = 'Desc',
  referenceExternalId = [],
  documentRealatedTo = 0
}: DocumentManagementServerProps): Promise<DocumentBasicDetails | null> => {
  try {
    const url = `validation/api/v1/file/getdocumentdetails`;
    const baseUrl = buildApplicationUrl(PLATFORM_BASEURLS);

    const payload = {
      documentsRequest: {
        pageNumber,
        pageSize,
        categoryId,
        fromDate,
        toDate,
        sortBy,
        sortDirection,
        referenceExternalId,
        documentRealatedTo
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
  categoryId: number[] | null,
  documentRelatedTo?: number | string
): Promise<any> => {
  try {
    const baseUrl = buildApplicationUrl(PLATFORM_BASEURLS);

    const params = [
      `AutoCompleteRequest.SearchText=${encodeURIComponent(searchText)}`,
      ...(categoryId && categoryId.length > 0
        ? categoryId.map(id => `AutoCompleteRequest.CategoryId=${encodeURIComponent(id)}`)
        : []),
      fromDate ? `AutoCompleteRequest.FromDate=${encodeURIComponent(fromDate)}` : "",
      toDate ? `AutoCompleteRequest.ToDate=${encodeURIComponent(toDate)}` : "",
      documentRelatedTo !== undefined && documentRelatedTo !== null
        ? `AutoCompleteRequest.DocumentRelatedTo=${encodeURIComponent(documentRelatedTo)}`
        : ""
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

export const fetchFilterCategory = async (documentRealatedTo: number | null): Promise<any> => {
  try {
    const baseUrl = buildApplicationUrl(PLATFORM_BASEURLS);
    const param = documentRealatedTo !== null ? `?DocumentRealatedTo=${encodeURIComponent(documentRealatedTo)}` : '';
    const url = `/validation/api/v1/applicationregistration${param}`;
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

    return responseData?.status; 
  } catch (error: any) {
   
    if (error?.response?.status) {
      return error.response.status;
    }
  }
  return payload?.request?.status; 
};

export const deleteFiles = async (payload: { request: any }) => {
  try {
    const baseUrl = buildApplicationUrl(PLATFORM_BASEURLS);
    const url = `/validation/api/v1/file/bulkdelete`;
    const responseData: AxiosResponse<deleteDocumentRequest> = await axios.delete(
  `${baseUrl}${url}`,
  {
    data: payload,
    headers: {
      "Content-Type": "application/json-patch+json",
      Authorization: `Bearer ${authService.getAuthTokens()}`
    }
  }
);

    return responseData?.status;
  } catch (error: any) {
    if (error?.response?.status) {
      return error.response.status;
    }
  }
  return payload?.request?.status;
};

export const bulkDownload = async (blobName: string, fileName: string): Promise<any> => {
  try {
    const baseUrl = buildApplicationUrl(PLATFORM_BASEURLS);
    const url = `/validation/api/v1/file/bulkdownload?BulkDownloadRequest.BlobName=${encodeURIComponent(blobName)}${fileName ? `&BulkDownloadRequest.FileName=${encodeURIComponent(fileName)}` : ""}`;
    const response: AxiosResponse = await service.get(url, baseUrl);
    return response.data;
  } catch (err) {
    console.error("Error in bulk download:", err);
    return null;
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

export const validation = async (payload: { request: any }): Promise<any> => {
  try {
    const baseUrl = buildApplicationUrl(PLATFORM_BASEURLS);
    const url = `/validation/api/v1/file/getfilevalidation`;
    const response: AxiosResponse = await service.post(url, payload, { baseURL: baseUrl });
    return response;
  } catch (err) {
    console.error("Error fetching view downloads data:", err);
    return {};
  }
};

export const clearAllFiles = async (payload: { request: { partitionKey: string[] } }): Promise<any> => {
  try {
    const baseUrl = buildApplicationUrl(PLATFORM_BASEURLS);
    const url = `validation/api/v1/file/clearall`;
    const responseData: AxiosResponse = await service.post(url, payload, { baseURL: baseUrl });
    console.log("clearAllFiles response status:", responseData?.status);
    return responseData?.status;
  } catch (error: any) {
    console.error("clearAllFiles error:", error);
    if (error?.response?.status) {
      return error.response.status;
    }
  }
  return payload?.request?.partitionKey;
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


export const fileDownloadInstance: AxiosInstance = axios.create({ 
  baseURL: buildApplicationUrl(PLATFORM_BASEURLS),
  responseType: "blob",
  headers: {
    Authorization: `Bearer ${authService.getAuthTokens()}`
  }
});

export const downloadFile: (
  isApplication?: string,
  isSection?: string,
  fileId?: string
) => Promise<Blob> = async (
  isApplication?: string,
  isSection?: string,
  fileId?: string
) => {
  const url = `validation/api/v1/file?FileId=${fileId}&Application=${isApplication}&Section=${isSection}`;
  const response = await fileDownloadInstance.get(url);
  return response.data;
};

