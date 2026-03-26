
import React from "react";
import { ShowValAs, Tag, Suggestion, Icon, IconColor, IconSize, TagColor, TagSize, TableHeader, SuggestionItem } from "@essnextgen/ui-kit";
import { fetchDMSSuggestions, fetchDocumentDetails, fetchStaffProfilePhoto, prepareAndDownloadFile, bulkDownload, streamDownloadFile, fetchDocumentCategory, downloadFile } from "../api/ApiService";
import gtmAnalytics from "../../../shared/utils/analytics";
 import { BuildValidationPayloadParams, FetchDocumentCategoryDataParams, FetchGetDocumentDetailsLogicParams, FetchViewDownloadDataParams } from "../responseModel";
import { pageSizeNumber } from "../../../../public/Constants";
import { EllipsisWithTooltip } from "../components/EllipsisWithTooltip";
import { debounce } from "./DocumentManagementServer.utils";
import { isOrganisationInVariantForAnyOrAll } from "../../../shared/utils/flagr-utils";

const renderSingleValue = (
  value: string | undefined,
  colName: string
) => {
  if (!value) return null;

  return (
    <EllipsisWithTooltip
      text={value}
      className="relatedto-main"
      isTooltipNeeded={value.length === 1}
      totalItems={[value]}
      colName={colName}
    />
  );
};

export const renderArrayValue = (
  value: unknown,
  colName: string
) => {
  if (!Array.isArray(value) || value.length === 0 || !value[0]) {
    return null;
  }

  const firstValue = value[0];
  return (
    <EllipsisWithTooltip
      text={firstValue}
      className="relatedto-main"
      isTooltipNeeded={value.length === 1}
      totalItems={value}
      colName={colName}
    />
  );
};

const renderSizeValue = (value: unknown) => {
  if (typeof value === "undefined" || value === null) return null;

  const resolvedValue = Array.isArray(value) ? value[0] : value;
  if (!resolvedValue) return null;

  return (
    <EllipsisWithTooltip
      text={resolvedValue}
      className="relatedto-main"
      isTooltipNeeded={resolvedValue.length === 1}
      totalItems={[resolvedValue]}
      colName="category"
    />
  );
};

export const getTableHeadersData = (t: any): TableHeader[] => [
  {
    text: "Id",
    isShow: false,
    showValAs: ShowValAs.Text,
    isTextTruncate: false,
    columnWidth: "16px",
  },
  {
    text: t("DocumentManagementServer.documentColumn"),
    isShow: true,
    showValAs: ShowValAs.CustomeComponent,
    columnWidth: "267px",
    isColumnSorting: true,
    anyComponent: (e: string) => renderSingleValue(e, "document"),
  },
  {
    text: t("DocumentManagementServer.relatedColumn"),
    isShow: true,
    showValAs: ShowValAs.CustomeComponent,
    columnWidth: "261px",
    isColumnSorting: false,
    anyComponent: (e: unknown) => renderArrayValue(e, "relatedTo"),
  },
  {
    text: t("DocumentManagementServer.categoryColumn"),
    isShow: true,
    showValAs: ShowValAs.CustomeComponent,
    columnWidth: "144px",
    isColumnSorting: true,
    anyComponent: (e: string | undefined) =>
      renderSingleValue(e, "category"),
  },
  {
    text: t("DocumentManagementServer.privacyColumn"),
    isShow: DMSPrivateDocument ?? false,
    showValAs: ShowValAs.CustomeComponent,
    columnWidth: "180px",
    isColumnSorting: true,
    anyComponent: (e: string) =>
      renderSingleValue(e, "ngStatus"),
  },
  {
    text: t("DocumentManagementServer.addedByColumn"),
    isShow: true,
    showValAs: ShowValAs.CustomeComponent,
    columnWidth: "180px",
    isColumnSorting: true,
    anyComponent: (e: string) =>
      renderSingleValue(e, "addedBy"),
  },
  {
    text: t("DocumentManagementServer.dateAddedColumn"),
    isShow: true,
    columnWidth: "140px",
    showValAs: ShowValAs.Text,
    isColumnSorting: true,
    isColumnSortByDefault: true,
  },
  {
    text: t("DocumentManagementServer.formatColumn"),
    isShow: true,
    showValAs: ShowValAs.CustomeComponent,
    columnWidth: "120px",
    isColumnSorting: true,
    anyComponent: (e: string) =>
      renderSingleValue(e, "format"),
  },
  {
    text: t("DocumentManagementServer.sizeColumn"),
    isShow: true,
    showValAs: ShowValAs.CustomeComponent,
    columnWidth: "129px",
    isColumnSorting: true,
    anyComponent: renderSizeValue,
  }
];



 
// Breadcrumb logic
export const onBreadcrumbClick: (path: string) => void = (path: string) => {
  window.location.assign(path);
  gtmAnalytics.pushEvent({
    event: "click",
    linkText: "Documents",
    linkUrl: "",
    clickType: "link",
    clickLocation: "breadcrumb"
  });
};
 
 
// Search input change logic


export const loadSuggestions: (
  text: string,
  fromDate: string,
  toDate: string,
  categoryId: number[] | null,
  setSuggestions: React.Dispatch<React.SetStateAction<Suggestion[]>>,
  setSuggestionsLoading: React.Dispatch<React.SetStateAction<boolean>>
) => Promise<void> = async (
  text: string,
  fromDate: string,
  toDate: string,
  categoryId: number[] | null,
  setSuggestions: React.Dispatch<React.SetStateAction<Suggestion[]>>,
  setSuggestionsLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  try {
    setSuggestionsLoading(true);
    const result: Suggestion[] = await fetchDMSSuggestions(text, fromDate, toDate, categoryId);
    setSuggestions(result);
  } catch (err) {
    console.error("Suggestion fetch failed:", err);
    setSuggestions([]);
  } finally {
    setSuggestionsLoading(false);
  }
};

export async function fetchGetDocumentDetailsLogic({
  page,
  categories,
  sortByCol,
  sortOrder,
  dateRange,
  refExternalId,
  relatedTo,
  documentStatusIds,
  setDocData,
  setCurrentPage,
  setTotalPage,
  setShowSearchError,
  setIsSearchLoading,
  setIsSearchDataLoading,
  setPrepareDownloadAbortBanner,
  setShowDeleteAbortBanner,
  setShowDeleteErrorBanner,
  setSuggestions
}: FetchGetDocumentDetailsLogicParams): Promise<void> {
  setIsSearchDataLoading(true);
  setPrepareDownloadAbortBanner(false);
  setShowDeleteAbortBanner(false);
  setShowDeleteErrorBanner(false);

  try {
    const result: any = await fetchDocumentDetails({
      pageNumber: page,
      pageSize: pageSizeNumber,
      fromDate: dateRange?.fromDate,
      toDate: dateRange?.toDate,
      categoryId: categories || [],
      sortBy: sortByCol,
      sortDirection: sortOrder,
      referenceExternalId: refExternalId,
      documentRelatedTo: relatedTo || 0,
      documentStatusId: documentStatusIds || []
    });
    if (result && typeof (result as any).statusCode === "number" && (result as any).statusCode === 200) {
      setDocData(result);
      setCurrentPage(page);
      setTotalPage(Math.ceil((result as any)?.totalRecords / pageSizeNumber));
      setShowSearchError(false);
    } else {
      setShowSearchError(true);
      
      gtmAnalytics.pushEvent({
        event: "error_message",
        messageText: "Information unavailable"
      });
    }
  } catch (err) {
    console.error("Error fetching document details:", err);
    setShowSearchError(true);
    gtmAnalytics.pushEvent({
        event: "error_message",
        messageText: "Information unavailable"
      });
  }
  setSuggestions([]);
  setIsSearchLoading(false);
  setIsSearchDataLoading(false);
}

export const fetchViewDownloadData: any = async ({
  showLoader = true,
  setIsSidePanelLoader,
  setViewData,
  viewDownload,
  downloadPollingIntervalRef,
  setIsViewDownloadError,
  setShowEmailNotification
}: FetchViewDownloadDataParams) => {
  const pollingRef: React.MutableRefObject<ReturnType<typeof setInterval> | null> = downloadPollingIntervalRef;
  if (showLoader) setIsSidePanelLoader(true);
  setIsViewDownloadError(false); 
  try {
    const result: any = await viewDownload();
    if (result?.data && result?.status === 200) {
      setViewData(result.data);
      setIsViewDownloadError(false);

      const hasInProgress: boolean = result.data.some(
        (item: { status: string }) =>
          item?.status?.toLowerCase() === "inprogress" ||
          item?.status?.toLowerCase() === "initiated"
      );
      setShowEmailNotification(!!hasInProgress);
      if (hasInProgress && !pollingRef.current) {
        pollingRef.current = setInterval(() => {
          fetchViewDownloadData({
            showLoader: false,
            setIsSidePanelLoader,
            setViewData,
            viewDownload,
            downloadPollingIntervalRef: pollingRef,
            setIsViewDownloadError,
            setShowEmailNotification
          });
        }, 10000);
      }

      if (!hasInProgress && pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    } else {
      setIsViewDownloadError(true);
      setViewData([]); 
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
      return; 
    }
  } catch (err) {
    console.error("Error fetching view download details:", err);
    setIsViewDownloadError(true);
    setViewData([]);  // 🟢 Clear stale data
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
    return; 
  } finally {
    setIsSidePanelLoader(false);
  }
};


export const fetchDocumentCategoryData: any = async ({
  payload,
  setCategoryError,
  setAvailableCategories,
  setLocalSelectedCategories,
  localSelectedCategories,
}: FetchDocumentCategoryDataParams) => {
  try {
    const response: any = await fetchDocumentCategory(payload);
    setCategoryError(false);
    const isSuccess = response?.status === 200;
    const isNotFound = response?.status === 404;
    /* eslint-disable */
    if (isSuccess) {
      const data: any[] = (response && 'payload' in response) ? (response as { payload: any[] }).payload : [];
      setAvailableCategories(data || []);
      const categoryIds: number[] = data.map(cat => cat.categoryId);

      const filteredFormats: any[] = localSelectedCategories?.filter(
        item => categoryIds?.includes(item?.data?.categoryId)
      );
      setLocalSelectedCategories(filteredFormats || []);
      return data;
      } else if (isNotFound) {
      setCategoryError(false);
      setAvailableCategories([]);
      setLocalSelectedCategories([]);
      return [];
      } else {
      setCategoryError(true);
      setAvailableCategories([]);
      return [];
    }
    /* eslint-enable */
  } catch (err) {
    console.error("Error fetching document categories:", err);
    setCategoryError(true);
    setAvailableCategories([]);
    return [];
  }
}


// export const fetchCategory = async (documentRelatedTo: number | null): Promise<any[]> => {
//   try {
//     const response = await fetchFilterCategory(documentRelatedTo);
//     return response ?? [];
//   } catch (err) {
//     console.error("Error fetching categories:", err);
//     return [];
//   }
// }
 

 
const staffImgString = 'Staff Photo';
const pupilImgString = 'Pupil Photo';

export const getStaffProfilePhoto = async (staffId: string) => {
  const response: any = await fetchStaffProfilePhoto(staffId);
  if (response && 'data' in response) {
    return response.data ?? "";
  }
  return "";
}

const buildPupilSuggestion = async (item: any, categoryName: string) => {
  const text = `${item?.preferredForename ?? ""} ${item?.preferredSurname ?? ""} (${item?.legalName ?? ""})`;

  const icon =
    item?.imagePath === "" ? (
      <Icon
        name="user--filled"
        size={IconSize.Medium}
        color={IconColor.Neutral400}
      />
    ) : (
      <img
        src={item.imagePath}
        alt={pupilImgString}
        className="dms-search__profile-icon"
      />
    );

  const value =
    (item?.currentYearGroup || item?.currentPrimaryClass) && (
      <Tag
        text={[item?.currentYearGroup, item?.currentPrimaryClass]
          .filter(Boolean)
          .join(" / ")}
        color={TagColor.Warning}
        size={TagSize.Small}
      />
    );

  return {
    text,
    icon,
    value,
    props: {
      name: text,
      id: item?.learnerExternalId,
      categoryName,
      ...item,
    },
  };
};

const buildStaffSuggestion = async (item: any, categoryName: string) => {
  const text =
    [
      `${item?.preferredForename ?? ""} ${item?.preferredSurname ?? ""}`.trim(),
      item?.staffCode
    ]
      .filter(Boolean)
      .join(" | ") ||
    item?.name ||
    "";

  const data = await getStaffProfilePhoto(
    (item?.externalId ?? "").toLowerCase()
  );

  const icon =
    data?.imagePath === "" ? (
      <Icon
        name="user--filled"
        size={IconSize.Medium}
        color={IconColor.Neutral400}
      />
    ) : (
      <img
        src={data?.imagePath}
        alt={staffImgString}
        className="dms-search__profile-icon"
      />
    );

  return {
    text,
    icon,
    value: undefined,
    props: {
      name: text,
      id: item?.externalId,
      categoryName,
      ...item,
    },
  };
};

const buildOrganisationSuggestion = (item: any, categoryName: string) => {
  const text = item?.schoolName || item?.name || "";

  return {
    text,
    icon: undefined,
    value: undefined,
    props: {
      name: text,
      id: item?.orgId,
      categoryName,
      ...item,
    },
  };
};

const buildDefaultSuggestion = (item: any, categoryName: string) => ({
  text: item?.name || "",
  icon: undefined,
  value: undefined,
  props: {
    name: item?.name,
    id: item?.id,
    categoryName,
    ...item,
  },
});

const suggestionBuilders: Record<
  string,
  (item: any, categoryName: string) => SuggestionItem | Promise<SuggestionItem>
> = {
  Pupil: buildPupilSuggestion,
  Staff: buildStaffSuggestion,
  Organisation: buildOrganisationSuggestion,
};



export const formatSuggestions = async (
  payload: any[],
  t: (key: string) => string
): Promise<Suggestion[]> => {
  if (!payload) return [];

  return Promise.all(
    payload.map(async (category: any) => {
      const values = await Promise.all(
        (category?.values || []).map((item: any) => {
          const builder =
            suggestionBuilders[category?.name] ?? buildDefaultSuggestion;

          return builder(item, category?.name);
        })
      );

      return {
        name: t(`Filter.${category?.name || ""}`),
        values,
      };
    })
  );
};


 

export const prepareDownload: (payload: { request: any }[]) => Promise<any[]> = async (payload: { request: any }[]) => {
  const statuses: any[] = await Promise.all(
    payload.map(item => prepareAndDownloadFile(item))
  );
  return statuses;
};


type SelectedDoc = {
  fileId: string;
  registrationId: number;
  externalId: string;
};

type ReferenceMapping = {
  referenceExternalId: string;
  relatedTo: any;
  documentRelatedTo: number;
};

const isValidArray = (arr: unknown): arr is any[] => Array.isArray(arr);

const dedupeByKey = <T, K extends keyof T>(arr: T[], key: K): T[] =>
  Array.from(new Map(arr.map(item => [item[key], item])).values());

const buildReferenceMappings = (
  selectedEntities: any[],
  searchRefExternalId: string[],
  documentRelatedTo: number
): ReferenceMapping[] => {
  if (!isValidArray(searchRefExternalId) || !isValidArray(selectedEntities)) {
    return [];
  }

  return dedupeByKey(
    selectedEntities.map(entity => ({
      referenceExternalId:
        entity.learnerExternalId ||
        entity.externalId ||
        entity.organisationId,
      relatedTo: entity,
      documentRelatedTo
    })),
    "referenceExternalId"
  );
};

const filterValidReferenceMappings = (
  mappings: ReferenceMapping[],
  selectedDocs: any[]
): ReferenceMapping[] => {
  if (!mappings.length || !selectedDocs.length) return mappings;

  const validIds = new Set(
    selectedDocs.map(d => d.externalId || d.learnerExternalId)
  );

  return mappings.filter(m => validIds.has(m.referenceExternalId));
};


export function buildSelectedDocs(
  selectedCheckBoxIds: string[],
  docData: any,
  categoryId: number[],
  searchRefExternalId: string[],
  documentRelatedTo: number,
  excludedCheckBoxIds: string[],
  isHeaderBoxChecked: boolean,
  allSelectedDocs: SelectedDoc[],
  dateRange: { fromDate: string; toDate: string },
  selectedEntities: any[],
  availableFileIds: string[],
  documentStatusIds: number[] = []
): { request: any }[] {
  if (
    !isValidArray(selectedCheckBoxIds) ||
    !isValidArray(excludedCheckBoxIds) ||
    !isValidArray(docData?.data)
  ) {
    return [];
  }

  const selectedDocs = docData.data.filter(
    (d: any) =>
      selectedCheckBoxIds.includes(d.fileId) &&
      d.registrationId !== undefined
  );

  const fileDetails =
    !isHeaderBoxChecked && allSelectedDocs.length > 0
      ? allSelectedDocs.filter(doc =>
          availableFileIds?.includes(doc.fileId)
        )
      : [];

  const excludedFileDetails =
    isHeaderBoxChecked &&
    allSelectedDocs.length > 0 &&
    allSelectedDocs.length < (docData?.totalRecords ?? 0)
      ? allSelectedDocs
      : [];

  let referenceMappingDetails = buildReferenceMappings(
    selectedEntities,
    searchRefExternalId,
    documentRelatedTo
  );

  referenceMappingDetails = filterValidReferenceMappings(
    referenceMappingDetails,
    selectedDocs
  );

  const fromDate = dateRange?.fromDate ?? "";
  const toDate = dateRange?.toDate ?? "";
  const currentDateTime = new Date()
    .toLocaleString("sv-SE")
    .replace(" ", "T");

  return [
    {
      request: {
        selectAll: Boolean(isHeaderBoxChecked),
        currentDateTime,
        downloadCriteria: {
          referenceMappingDetails,
          documentRelatedTo,
          categoryId,
          fromDate,
          toDate,
          documentStatusIds
        },
        fileDetails,
        excludedFileDetails
      }
    }
  ];
}


export function mapToBulkDeletePayload({
  isSelectAll = false,
  categoryIds = [],
  fromDate = "",
  toDate = "",
  documentStatusIds = [],
  referenceExternalIds = [],
  documentRelatedTo = 0,
  fileDetails = [],
  excludedFileDetails = []
}: {
  isSelectAll?: boolean;
  categoryIds?: number[];
  fromDate?: string;
  toDate?: string;
  documentStatusIds?: number[];
  referenceExternalIds?: string[];
  documentRelatedTo?: number;
  fileDetails?: { fileId: string; registrationId: number; externalId: string }[];
  excludedFileDetails?: { fileId: string; externalId: string }[];
}): { request: any } {
  return {
    request: {
      isSelectAll,
      bulkDeleteCriteria: {
        categoryIds,
        fromDate,
        toDate,
        documentStatusIds,
        referenceDetails: {
          referenceExternalIds,
          documentRelatedTo
        }
      },
      fileDetails,
      excludedFileDetails
    }
  };
}



export const debouncedFetchSuggestions: any = debounce(
  async (
    t: (key: string) => string,
    searchText: string,
    categoryId: number[] | null,
    fromDate: string,
    toDate: string,
    setSearchLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setSuggestions: React.Dispatch<React.SetStateAction<Suggestion[]>>,
    setShowError: React.Dispatch<React.SetStateAction<boolean>>,
    setShowErrorBanner: React.Dispatch<React.SetStateAction<boolean>>,
    documentRelatedTo?: number | string
  ): Promise<void> => {
    setSearchLoading(true);
    setShowError(false);
    try {
      const response: any = await fetchDMSSuggestions(searchText, fromDate, toDate, categoryId, documentRelatedTo);
      if (!response || response?.statusCode !== 200) {
        setShowErrorBanner(true);
        setSuggestions([]);
        gtmAnalytics.pushEvent({
          event: "error_message",
          messageText: "Information unavailable"
        });
      } else {
        const values: any[] = response?.payload ?? [];
        const suggestions: any[] = await formatSuggestions(values , t);
        setSuggestions(suggestions);
        setShowErrorBanner(suggestions?.length === 0);
      }
    } catch (err) {
      console.error("Autosuggest error:", err);
      setShowErrorBanner(true);
      setSuggestions([]);
      gtmAnalytics.pushEvent({
        event: "error_message",
        messageText: "Information unavailable"
      });
    } finally {
      setSearchLoading(false);
    }
  },
  3000
);


export const buildValidationPayload = ({
  isSelectAll = false,
  userActivity = "bulkdelete",
  categoryIds = [],
  fromDate = "",
  toDate = "",
  referenceExternalIds = [],
  documentRelatedTo = 0,
  fileDetails = [],
  excludedFileDetails = []
}: BuildValidationPayloadParams) => ({
  
    request: {
      isSelectAll,
      userActivity,
      validationCriteria: {
        categoryIds,
        fromDate,
        toDate,
        referenceDetails: {
          referenceExternalIds,
          documentRelatedTo
        }
      },
      fileDetails,
      excludedFileDetails
    }
  
});

export const getTitleConfirmation: (t: any, dialogType: string, availableFileCount: number, totalRecords: number) => string = (t, dialogType, availableFileCount, totalRecords) => {
  if (dialogType === "clearAll") return t("DocumentManagementServer.clearAllDownloadsTitle");
  if (dialogType === "delete") {
    return availableFileCount === 1 ? t("DocumentManagementServer.deleteDocumentTitle") : t("DocumentManagementServer.deleteDocumentsTitle");
  }
  return availableFileCount === totalRecords && availableFileCount > 1 ? t("DocumentManagementServer.prepareAllDocumentsTitle") : t("DocumentManagementServer.prepareDownloadTitle");
};

export const fileDownload: (fileId: string, fileName: string, application: string, sectionName: string, blobName?: string) => Promise<void> = async (
  fileId: string,
  fileName: string,
  application: string,
  sectionName: string,
  blobName?: string
) => {
  const isZipFile: string | boolean | undefined = (!application && !sectionName && blobName);
  try {
    if (isZipFile) {
        const response: any = await bulkDownload(blobName!, fileName);
        if (response?.payload && blobName) {
          const url: string = response.payload;
          const link: HTMLAnchorElement = document.createElement("a");
          link.href = url;
          link.download = `${fileName}`;
          document.getElementById(`file-download-${fileId}`)?.parentElement?.appendChild(link);
          link.click();
          document.getElementById(`file-download-${fileId}`)?.parentElement?.removeChild(link);
        } else {
          throw new Error("Bulk download failed: No file URL returned.");
      }
    } else {
      const blob: Blob = await downloadFile(application, sectionName, fileId);
      const url: string = window.URL.createObjectURL(blob);
      const link: HTMLAnchorElement = document.createElement("a");
      link.href = url;
      link.download = `${fileName}`;
      document.getElementById(`file-download-${fileId}`)?.parentElement?.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      document.getElementById(`file-download-${fileId}`)?.parentElement?.removeChild(link);
    }
  } catch (error) {
    console.error("Error downloading file:", error);
    throw error;
  }
};

export const fileDownloadById: (fileId: string, fileName: string) => Promise<void> = async (
  fileId: string,
  fileName: string
) => {
  try {
    const sasUrl: string = await streamDownloadFile(fileId);
    const link: HTMLAnchorElement = document.createElement("a");
    link.href = sasUrl;
    link.download = fileName;
    document.getElementById(`file-download-${fileId}`)?.parentElement?.appendChild(link);
    link.click();
    document.getElementById(`file-download-${fileId}`)?.parentElement?.removeChild(link);
  } catch (error) {
    console.error("Error downloading file:", error);
    throw error;
  }
};

export const DMSPrivateDocument: boolean = isOrganisationInVariantForAnyOrAll(
  "DmsManagePrivateDocument"
);