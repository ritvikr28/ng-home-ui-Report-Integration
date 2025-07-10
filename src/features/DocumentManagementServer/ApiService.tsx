import axios, { AxiosResponse } from "axios";
import { buildApplicationUrl } from "@essnextgen/ui-application-kit";
import { service } from "../../shared/utils";
import {
  DocumentBasicDetails,
  DocumentManagementServerProps,
  DocumentSuggestion,
} from "./responseModel";
import { PLATFORM_BASEURLS } from "../../ApiConfig.json";

/**
 * Fetch full document details (for table display)
 */
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

    const responseData: AxiosResponse<DocumentBasicDetails> = await service.post(url, payload, {
      baseURL: baseUrl,
    });

    if (responseData?.status === 200) {
      return responseData.data;
    }

    return null;
  } catch (err: any) {
    console.error("Error fetching document details:", err);
    return null;
  }
};

/**
 * Fetch document name suggestions (for auto-suggest input)
 */
export const fetchDocumentSuggestions = async (
  text: string
): Promise<DocumentSuggestion[]> => {
  try {
    const baseUrl = buildApplicationUrl(PLATFORM_BASEURLS);
    const url = `validation/api/v1/file/suggestions?text=${encodeURIComponent(text)}`; // ✅ Replace with correct endpoint if needed

    const response: AxiosResponse<DocumentSuggestion[]> = await service.get(url, baseUrl);

    if (response?.status === 200) {
      return response.data;
    }

    return [];
  } catch (error) {
    console.error("Error fetching document suggestions:", error);
    return [];
  }
};



// import axios, { AxiosResponse } from "axios";
// import { buildApplicationUrl } from "@essnextgen/ui-application-kit";
// import { service } from "../../shared/utils";
// import {
//   DocumentBasicDetails,
//   DocumentManagementServerProps
// } from "./responseModel";
// import { PLATFORM_BASEURLS } from "../../ApiConfig.json";

// export const fetchDocumentDetails = async ({
//   pageNumber,
//   pageSize,
//   searchText = '',
//   categoryId = [],
//   fromDate = '',
//   toDate = '',
//   sortBy = 'DateAdded',
//   sortDirection = 'Desc',
// }: DocumentManagementServerProps): Promise<DocumentBasicDetails | null> => {
//   try {
//     const url = `validation/api/v1/file/getdocumentdetails`;
//     const baseUrl = buildApplicationUrl(PLATFORM_BASEURLS);
 
//     const payload = {
//       documentsRequest: {
//         pageNumber,
//         pageSize,
//         searchText,
//         categoryId,
//         fromDate,
//         toDate,
//         sortBy,
//         sortDirection,
//       },
//     };
 
//     const responseData: AxiosResponse<DocumentBasicDetails> =
//       await service.post(url, payload, { baseURL: baseUrl });
//     if (responseData?.status === 200) {
//       return responseData?.data;
//     }
//     return null;
//   } catch (err: any) {
//     return null;
//   }
// };
// export const fetchDocumentSuggestions = async (text: string): Promise<DocumentSuggestion[]> => {
//   const response = await axios.get(`/api/documents/suggestions`, {
//     params: { text },
//   });
//   return response.data;
// };