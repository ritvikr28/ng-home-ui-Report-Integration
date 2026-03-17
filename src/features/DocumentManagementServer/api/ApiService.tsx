import { buildApplicationUrl } from "@essnextgen/ui-application-kit";
import axios, { AxiosInstance, AxiosResponse } from "axios";
import { authService } from "@essnextgen/auth-ui";
import { service } from "../../../shared/utils";
import {
  deleteDocumentRequest,
  DocumentBasicDetails,
  DocumentCategoryResponse,
  DocumentManagementServerProps,
  DocumentPrepareDownload,
  PrivateDocumentBasicDetails,
  PrivateDocumentManagementServerProps
} from "../responseModel";
import { PLATFORM_BASEURLS, STAFFPROFILE_BASEURLS } from "../../../ApiConfig.json";

// Helper type for error responses
type ErrorResponse = { status?: number; detail?: string; error?: string };

export const fetchDocumentDetails: (props: DocumentManagementServerProps) => Promise<DocumentBasicDetails | null> = async ({
  pageNumber,
  pageSize,
  categoryId = [],
  fromDate = "",
  toDate = "",
  sortBy = "DateAdded",
  sortDirection = "Desc",
  referenceExternalId = [],
  documentRelatedTo = 0
}: DocumentManagementServerProps): Promise<DocumentBasicDetails | null> => {
  try {
    const url = `validation/api/v1/file/getdocumentdetails`;
    const baseUrl: string = buildApplicationUrl(PLATFORM_BASEURLS);

    const payload: any = {
      documentsRequest: {
        pageNumber,
        pageSize,
        categoryId,
        fromDate,
        toDate,
        sortBy,
        sortDirection,
        referenceExternalId,
        documentRelatedTo
      }
    };

    const responseData: AxiosResponse<DocumentBasicDetails> =
      await service.post(url, payload, { baseURL: baseUrl });
    if (responseData?.status === 200) {
      return responseData?.data;
    }
    return null;
  } catch (err: any) {
    return err?.response?.data ?? { status: 500, detail: "Unknown server error" };
  }
};

export const fetchDMSSuggestions: (searchText: string, fromDate: string, toDate: string, categoryId: number[] | null, documentRelatedTo?: number | string) => Promise<any> = async (
  searchText: string,
  fromDate: string,
  toDate: string,
  categoryId: number[] | null,
  documentRelatedTo?: number | string
): Promise<any> => {
  try {
    const baseUrl: string = buildApplicationUrl(PLATFORM_BASEURLS);

    const params: string = [
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
  } catch (err: any) {
    console.error("Error fetching DMS suggestions:", err);
    return {};
  }
};

export const fetchDocumentCategory: (payload: { CategoryRequest: any }) => Promise<DocumentCategoryResponse | ErrorResponse> = async (
  payload: { CategoryRequest: any }
): Promise<DocumentCategoryResponse | ErrorResponse> => {
  try {
    const baseUrl: string = buildApplicationUrl(PLATFORM_BASEURLS);
    const url = `/validation/api/v1/data-export/get-linked-files-category-by-id`;
    const responseData: AxiosResponse<DocumentCategoryResponse> = await service.post(url, payload, { baseURL: baseUrl });
    return responseData?.data;
  } catch (err: any) {
    console.error("Error fetching document categories:", err);
    if (err?.response?.data) {
      return err.response.data;
    }
    return { status: 500, detail: "Unknown server error" };
  }
};

export const prepareAndDownloadFile: (payload: { request: any }) => Promise<number | undefined> = async (
  payload: { request: any }
): Promise<number | undefined> => {
  try {
    const baseUrl: string = buildApplicationUrl(PLATFORM_BASEURLS);
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

export const deleteFiles: (payload: { request: any }) => Promise<number> = async (
  payload: { request: any }
): Promise<number> => {
  try {
    const baseUrl: string = buildApplicationUrl(PLATFORM_BASEURLS);
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

export const bulkDownload: (blobName: string, fileName: string) => Promise<any> = async (
  blobName: string,
  fileName: string
): Promise<any> => {
  try {
    const baseUrl: string = buildApplicationUrl(PLATFORM_BASEURLS);
    const url = `/validation/api/v1/file/bulkdownload?BulkDownloadRequest.BlobName=${encodeURIComponent(blobName)}${fileName ? `&BulkDownloadRequest.FileName=${encodeURIComponent(fileName)}` : ""}`;
    const response: AxiosResponse = await service.get(url, baseUrl);
    return response.data;
  } catch (err: any) {
    console.error("Error in bulk download:", err);
    return null;
  }
};

export const viewDownload: () => Promise<AxiosResponse | ErrorResponse> = async (): Promise<AxiosResponse | ErrorResponse> => {
  try {
    const baseUrl: string = buildApplicationUrl(PLATFORM_BASEURLS);
    const url = `/validation/api/v1/file/viewDownload`;
    const response: AxiosResponse = await service.get(url, baseUrl);
    return response;
  } catch (err: any) {
    console.error("Error fetching view downloads data:", err);
    return { status: 500, detail: "Unknown server error" };
  }
};

export const validation: (payload: { request: any }) => Promise<AxiosResponse | ErrorResponse> = async (
  payload: { request: any }
): Promise<AxiosResponse | ErrorResponse> => {
  try {
    const baseUrl: string = buildApplicationUrl(PLATFORM_BASEURLS);
    const url = `/validation/api/v1/file/getfilevalidation`;
    const response: AxiosResponse = await service.post(url, payload, { baseURL: baseUrl });
    return response;
  } catch (err: any) {
    console.error("Error fetching view downloads data:", err);
    return { status: 500, detail: "Unknown server error" };
  }
};

export const clearAllFiles: (payload: { request: { partitionKey: string[] } }) => Promise<number | string[] | ErrorResponse> = async (
  payload: { request: { partitionKey: string[] } }
): Promise<number | string[] | ErrorResponse> => {
  try {
    const baseUrl: string = buildApplicationUrl(PLATFORM_BASEURLS);
    const url = `validation/api/v1/file/clearall`;
    const responseData: AxiosResponse = await service.post(url, payload, { baseURL: baseUrl });
    return responseData?.status;
  } catch (error: any) {
    console.error("clearAllFiles error:", error);
    if (error?.response?.status) {
      return error.response.status;
    }
  }
  return payload?.request?.partitionKey;
};

export const fetchStaffProfilePhoto: (externalId: string) => Promise<AxiosResponse | ErrorResponse> = async (
  externalId: string
): Promise<AxiosResponse | ErrorResponse> => {
  try {
    const baseUrl: string = buildApplicationUrl(STAFFPROFILE_BASEURLS);
    const url = `/api/v1/personThumbnailImage/${externalId}`;
    const response: AxiosResponse = await service.get(url, baseUrl);
    return response;
  } catch (err: any) {
    console.error("Error fetching staff profile photo:", err);
    return { status: 500, detail: "Unknown server error" };
  }
};

export const fileDownloadInstance: AxiosInstance = axios.create({
  baseURL: buildApplicationUrl(PLATFORM_BASEURLS),
  responseType: "blob",
  headers: {
    Authorization: `Bearer ${authService.getAuthTokens()}`
  }
});

export const downloadFile: (isApplication?: string, isSection?: string, fileId?: string) => Promise<Blob> = async (
  isApplication?: string,
  isSection?: string,
  fileId?: string
): Promise<Blob> => {
  const url = `validation/api/v1/file?FileId=${fileId}&Application=${isApplication}&Section=${isSection}`;
  const response: AxiosResponse<Blob> = await fileDownloadInstance.get(url);
  return response.data;
};

export const streamDownloadFile: (fileId: string) => Promise<string> = async (
  fileId: string
): Promise<string> => {
  const baseUrl: string = buildApplicationUrl(PLATFORM_BASEURLS);
  const url = `/validation/api/v2/file/download?request.FileId=${encodeURIComponent(fileId)}`;
  const response: AxiosResponse<string> = await service.get(url, baseUrl);
  return response.data;
};

export const fetchPrivateDocumentDetails: (props: PrivateDocumentManagementServerProps) => Promise<PrivateDocumentBasicDetails | null> = async ({
  pageNumber,
  pageSize,
  userId,
  sortBy = "DateAdded",
  sortDirection = "Desc"
}: PrivateDocumentManagementServerProps): Promise<PrivateDocumentBasicDetails | null> => {
  try {
    const url = `validation/api/v1/file/getprivatedocumentdetails`;
    const baseUrl: string = buildApplicationUrl(PLATFORM_BASEURLS);

    const payload: any = {
      documentsRequest: {
        pageNumber,
        pageSize,
        userId,
        sortBy,
        sortDirection
      }
    };

    const responseData: AxiosResponse<PrivateDocumentBasicDetails> =
      await service.post(url, payload, { baseURL: baseUrl });
    if (responseData?.status === 200) {
      return responseData?.data;
    }
    return null;
  } catch (err: any) {
    return err?.response?.data ?? { status: 500, detail: "Unknown server error" };
  }
};