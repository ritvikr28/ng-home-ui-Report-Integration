
import React from "react";
import { ShowValAs, Tag, Suggestion, ISearchItemProp, Icon, IconColor, IconSize, TagColor, TagSize, TableHeader } from "@essnextgen/ui-kit";
import { fetchDMSSuggestions, fetchDocumentDetails, fetchStaffProfilePhoto, prepareAndDownloadFile, downloadFile, bulkDownload, fetchDocumentCategory } from "./ApiService";
import gtmAnalytics from "../../shared/utils/analytics";
 import { BuildValidationPayloadParams, FetchDocumentCategoryDataParams, FetchViewDownloadDataParams } from "./responseModel";
import { pageSizeNumber } from "../../../public/Constants";
import { EllipsisWithTooltip } from "./EllipsisWithTooltip";
import { debounce } from "./DocumentManagementServer.utils";

export const getTableHeadersData = (t: any): TableHeader[] => [
  {
    text: "Id",
    isShow: false,
    showValAs: ShowValAs.Text,
    isTextTruncate: false,
    columnWidth: "16px"
  },
  {
    text: t("DocumentManagementServer.documentColumn"),
    isShow: true,
    showValAs: ShowValAs.CustomeComponent,
    isTextTruncate: false,
    isHeaderTextTruncate: false,
    columnWidth: "267px",
    headerTxtTrunctLength: 50,
    isSimpleText: true,
    isColumnSorting: true,
    txtTrunctLength: 26,
    anyComponent: (e: any) => (
      <>
      <EllipsisWithTooltip
        text={e}
        className=" relatedto-main"
        isTooltipNeeded={!!(e && e.length === 1)}
        totalItems={[e]}
        colName="document"
      />
      </>
    )
  },
  {
    text: t("DocumentManagementServer.relatedColumn"),
    isShow: true,
    showValAs: ShowValAs.CustomeComponent,
    isTextTruncate: true,
    isHeaderTextTruncate: false,
    headerTxtTrunctLength: 17,
    columnWidth: "261px",
    txtTrunctLength: 35,
    isColumnSorting: false,
    anyComponent: (e: any) =>(
      <>
        {(!e || !Array.isArray(e) || !e.length) ? null : (
          <EllipsisWithTooltip
            text={e[0]}
            className=" relatedto-main"
            isTooltipNeeded={!!(e.length === 1)}
            totalItems={e}
            colName="relatedTo"
          />
        )}
      </>
      )
  },
  {
    text: t("DocumentManagementServer.categoryColumn"),
    isShow: true,
    showValAs: ShowValAs.CustomeComponent,
    isHeaderTextTruncate: false,
    headerTxtTrunctLength: 20,
    isColumnSorting: true,
    columnWidth: "144px",
    isTextTruncate: false,
    anyComponent: (e: any) => (
      <>
        {typeof e === 'undefined' ? null : (
          <EllipsisWithTooltip
            text={e}
            className=" relatedto-main"
            isTooltipNeeded={!!(e && e.length === 1)}
            totalItems={[e]}
            colName="category"
          />
        )}
      </>
    )
  },
  {
    text: t("DocumentManagementServer.addedByColumn"),
    isShow: true,
    showValAs: ShowValAs.CustomeComponent,
    headerTxtTrunctLength: 50,
    columnWidth: "180px",
    isColumnSorting: false,
    isHeaderTextTruncate: false,
    isTextTruncate: false,
    isSimpleText: true,
    anyComponent: (e: any) => (
      <>
        <EllipsisWithTooltip
          text={e}
          className=" relatedto-main"
          isTooltipNeeded={!!(e && e.length === 1)}
          totalItems={[e]}
          colName="addedBy"
        />
      </>
    )
  },
  {
    text: t("DocumentManagementServer.dateAddedColumn"),
    isShow: true,
    columnWidth: "140px",
    showValAs: ShowValAs.Text,
    isTextTruncate: false,
    isColumnSorting: true,
    isColumnSortByDefault: true,
  },
  {
    text: t("DocumentManagementServer.formatColumn"),
    isShow: true,
    showValAs: ShowValAs.CustomeComponent,
    txtTrunctLength: 12,
    isColumnSorting: true,
    isTextTruncate: false,
    isHeaderTextTruncate: false,
    headerTxtTrunctLength: 50,
    columnWidth: "120px",
    anyComponent: (e: any) => (
      <>
        <EllipsisWithTooltip
          text={e}
          className=" relatedto-main"
          isTooltipNeeded={!!(e && e.length === 1)}
          totalItems={[e]}
          colName="format"
        />
      </>
    )
  },
  {
    text: t("DocumentManagementServer.sizeColumn"),
    isShow: true,
    showValAs: ShowValAs.CustomeComponent,
    txtTrunctLength: 12,
    isColumnSorting: true,
    isTextTruncate: false,
    isHeaderTextTruncate: false,
    headerTxtTrunctLength: 50,
    columnWidth: "129px",
    anyComponent: (e: any) => {
          if (
      typeof e === "undefined" ||
      e === null ||
      (Array.isArray(e) && (e.length === 0 || !e[0] || e[0] === "" || typeof e[0] === "undefined" || e[0] === null))
    ) {
      return null;
    }
    // If array, use first value
    const value = Array.isArray(e) ? e[0] : e;
    return (
      <EllipsisWithTooltip
        text={value}
        className=" relatedto-main"
        isTooltipNeeded={!!(value && value.length === 1)}
        totalItems={[value]}
        colName="category"
      />
    );
  }
}
];


 
// Breadcrumb logic
export const onBreadcrumbClick = (path: string) => {
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
export const handleSearchChange = (
  t: (key: string) => string,
  e: React.ChangeEvent<HTMLInputElement>,
  categoryId: number[] | null,
  fromDate: string,
  toDate: string,
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>,
  setSuggestions: React.Dispatch<React.SetStateAction<Suggestion[]>>,
  setShowSearchError: React.Dispatch<React.SetStateAction<boolean>>,
  setIsSearchLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setShowErrorBanner: React.Dispatch<React.SetStateAction<boolean>>,
  documentRelatedTo?: number,
  setResetFilterSearch?: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const { value } = e.target;
  setSearchTerm(value);

  if (value?.trim().length > 0 && typeof setResetFilterSearch === "function") {
    setResetFilterSearch(true);
  }

   if (value.trim().length === 0 && value.length > 0) {
    setSuggestions([]);
    setIsSearchLoading(false);
    return;
  }

  if (value?.length < 3) {
    setSuggestions([]);
    setShowSearchError(false);
    setIsSearchLoading(false);
    return;
  }
 
  setIsSearchLoading(true);
  setSuggestions([]);
  setShowSearchError(false);
  if (typeof setResetFilterSearch === "function") {
    setShowErrorBanner(false);
  }
 
  debouncedFetchSuggestions(
    t,
    value,
    categoryId,
    fromDate,
    toDate,
    setIsSearchLoading,
    setSuggestions,
    setShowSearchError,
    setShowErrorBanner,
    documentRelatedTo
  );
};
 
export const loadSuggestions = async (
  text: string,
  fromDate: string,
  toDate: string,
  categoryId: number[] | null,
  setSuggestions: React.Dispatch<React.SetStateAction<Suggestion[]>>,
  setSuggestionsLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  try {
    setSuggestionsLoading(true);
    const result = await fetchDMSSuggestions(text, fromDate, toDate, categoryId);
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
}: {
  page: number;
  categories: number[];
  sortByCol: string;
  sortOrder: string; 
  dateRange: { fromDate?: string; toDate?: string };
  refExternalId: string[];
  relatedTo: number;
  setDocData: (v: any) => void;
  setCurrentPage: (v: number) => void;
  setTotalPage: (v: number) => void;
  setShowSearchError: (v: boolean) => void;
  setIsSearchLoading: (v: boolean) => void;
  setIsSearchDataLoading: (v: boolean) => void;
  setPrepareDownloadAbortBanner: (v: boolean) => void;
  setShowDeleteAbortBanner: (v: boolean) => void;
  setShowDeleteErrorBanner: (v: boolean) => void;
  setSuggestions: (v: Suggestion[]) => void;
}) {
  setIsSearchDataLoading(true);
  setPrepareDownloadAbortBanner(false);
  setShowDeleteAbortBanner(false);
  setShowDeleteErrorBanner(false);

  try {
    const result = await fetchDocumentDetails({
      pageNumber: page,
      pageSize: pageSizeNumber,
      fromDate: dateRange?.fromDate,
      toDate: dateRange?.toDate,
      categoryId: categories || [],
      sortBy: sortByCol,
      sortDirection: sortOrder,
      referenceExternalId: refExternalId,
      documentRelatedTo: relatedTo || 0
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



 







export const fetchViewDownloadData = async ({
  showLoader = true,
  setIsSidePanelLoader,
  setViewData,
  viewDownload,
  downloadPollingIntervalRef,
  setIsViewDownloadError,
  setShowEmailNotification
}: FetchViewDownloadDataParams) => {
  const pollingRef = downloadPollingIntervalRef;
  if (showLoader) setIsSidePanelLoader(true);
  setIsViewDownloadError(false); 
  try {
    const result = await viewDownload();
    if (result?.data && result?.status === 200) {
      setViewData(result.data);
      setIsViewDownloadError(false);

      const hasInProgress = result.data.some(
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


export const fetchDocumentCategoryData = async ({
  payload,
  setCategoryError,
  setAvailableCategories,
  setLocalSelectedCategories,
  localSelectedCategories,
}: FetchDocumentCategoryDataParams) => {
  try {
    const response = await fetchDocumentCategory(payload);
    setCategoryError(false);
    const isSuccess = response?.status === 200;
    /* eslint-disable */
    if (isSuccess) {
      const data = (response && 'payload' in response) ? (response as { payload: any[] }).payload : [];
      setAvailableCategories(data || []);
      const categoryIds = data.map(cat => cat.categoryId);

      const filteredFormats = localSelectedCategories?.filter(
        item => categoryIds?.includes(item?.data?.categoryId)
      );
      setLocalSelectedCategories(filteredFormats || []);
      return data;
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
  const response = await fetchStaffProfilePhoto(staffId);
  if (response && 'data' in response) {
    return response.data ?? "";
  }
  return "";
}
export const formatSuggestions = async (payload: any[], t: (key: string) => string): Promise<Suggestion[]> => {
  if (!payload) return [];
  return Promise.all(
    payload.map(async (category: any) => {
      const values = await Promise.all(
        (category?.values || []).map(async (item: any) => {
          let text = "";
          let props: ISearchItemProp = {};
          let icon: JSX.Element | undefined;
          let value: JSX.Element | string | undefined;
 
          switch (category?.name) {
            case "Pupil":
              text = `${item?.preferredForename ?? ""} ${item?.preferredSurname ?? ""} (${item?.legalName ?? ""})`;
              icon = (
                <>
                  {(item.imagePath === "") ? (
                    <Icon
                      name="user--filled"
                      size={IconSize.Medium}
                      color={IconColor.Neutral400}
                    />
                  ) : (
                    <img src={item.imagePath} alt={pupilImgString} className="dms-search__profile-icon" />
                  )}
                </>
              );
              value = ((item?.currentYearGroup || item?.currentRegistration) && (
                <Tag
                  text={
                    [item?.currentYearGroup, item?.currentPrimaryClass]
                      .filter(Boolean)
                      .join(" / ")
                  }
                  color={TagColor.Warning}
                  size={TagSize.Small}
                />
              ));
              props = {
                name: text,
                id: item?.learnerExternalId,
                value,
                categoryName: category.name,
                ...item
              };
              break;
            case "Staff": {
              text = [
                `${item?.preferredForename ?? ""} ${item?.preferredSurname ?? ""}`.trim(),
                item?.staffCode
              ]
                .filter(Boolean)
                .join(" | ") || item?.name || "";
              const data = await getStaffProfilePhoto((item?.externalId).toLowerCase());
              icon = (
                <>
                  {(data?.imagePath === "") ? (
                    <Icon
                      name="user--filled"
                      size={IconSize.Medium}
                      color={IconColor.Neutral400}
                    />
                  ) : (
                    <img src={data?.imagePath} alt={staffImgString} className="dms-search__profile-icon" />
                  )}
                </>
              );
              props = {
                name: text,
                id: item?.externalId,
                categoryName: category.name,
                ...item
              };
              break;
            }
            case "Organisation":
              text = item?.schoolName || item?.name || "";
              props = {
                name: text,
                id: item?.orgId,
                categoryName: category.name,
                ...item
              };
              break;
            default:
              text = item?.name || "";
              props = {
                name: item?.name,
                id: item?.id,
                categoryName: category.name,
                ...item
              };
          }
          return {
            text,
            icon,
            props,
            value,
          };
        })
      );
      return {
        // name: t(category?.name || ""),
        name: t(`Filter.${category?.name || ""}`),
        values,
      };
    })
  );
};
 

export const prepareDownload = async (payload: { request: any }[]) => {
  const statuses = await Promise.all(
    payload.map(item => prepareAndDownloadFile(item))
  );
  return statuses;
};

 

export function buildSelectedDocs(
  selectedCheckBoxIds: string[],
  docData: any,
  categoryId: number[],
  searchRefExternalId: string[],
  documentRelatedTo: number,
  excludedCheckBoxIds: string[],
  isHeaderBoxChecked: boolean,
  allSelectedDocs: { fileId: string; registrationId: number; externalId: string }[],
  dateRange: { fromDate: string; toDate: string },
  selectedEntities: any[],
  availableFileIds: string[]
) {
  if (!Array.isArray(selectedCheckBoxIds) || !Array.isArray(docData?.data)) return [];
  if (!Array.isArray(excludedCheckBoxIds) || !Array.isArray(docData?.data)) return [];

  const selectedDocs = docData.data.filter(
    (d: any) => selectedCheckBoxIds?.includes(d.fileId) && d.registrationId !== undefined
  );

  const fileDetails = !isHeaderBoxChecked && allSelectedDocs.length > 0 ? allSelectedDocs.filter(doc => availableFileIds?.includes(doc.fileId)) : [];
  const excludedIdDetails =
    isHeaderBoxChecked && allSelectedDocs?.length > 0 ? allSelectedDocs : [];

  let referenceMappingDetails: any[] = [];

  // Build mapping from selectedEntities if available
  if (searchRefExternalId.length > 0 && selectedEntities.length > 0) {
    referenceMappingDetails = selectedEntities.map(entity => ({
      referenceExternalId:
        entity.learnerExternalId || entity.externalId || entity.organisationId,
      relatedTo: entity,
      documentRelatedTo,
    }));

    // Deduplicate by referenceExternalId
    referenceMappingDetails = Array.from(
      new Map(referenceMappingDetails.map((item) => [item.referenceExternalId, item])).values()
    );
  }

  // Filter mappings to only those present in selectedDocs
  if (selectedDocs.length > 0 && referenceMappingDetails.length > 0) {
    const validIds = new Set(
      selectedDocs.map((d: { externalId: any; learnerExternalId: any; }) => d.externalId || d.learnerExternalId)
    );
    referenceMappingDetails = referenceMappingDetails.filter((m) =>
      validIds.has(m.referenceExternalId)
    );
  }

  // Final deduplication
  referenceMappingDetails = Array.from(
    new Map(referenceMappingDetails.map((item) => [item.referenceExternalId, item])).values()
  );

  const fromDate = dateRange?.fromDate ?? "";
  const toDate = dateRange?.toDate ?? "";
  const currentDateTime = new Date().toLocaleString("sv-SE").replace(" ", "T");

  return [
    {
      request: {
        selectAll: !!isHeaderBoxChecked,
        currentDateTime,
        downloadCriteria: {
          referenceMappingDetails,
          documentRelatedTo,
          categoryId,
          fromDate,
          toDate,
        },
        fileDetails,
        excludedFileDetails:
          isHeaderBoxChecked &&
          excludedIdDetails.length > 0 &&
          excludedIdDetails.length < (docData?.totalRecords ?? 0)
            ? excludedIdDetails
            : [],
      },
    }
  ];
}

export function mapToBulkDeletePayload({
  isSelectAll = false,
  categoryIds = [],
  fromDate = "",
  toDate = "",
  referenceExternalIds = [],
  documentRelatedTo = 0,
  fileDetails = [],
  excludedFileDetails = []
}: {
  isSelectAll?: boolean;
  categoryIds?: number[];
  fromDate?: string;
  toDate?: string;
  referenceExternalIds?: string[];
  documentRelatedTo?: number;
  fileDetails?: { fileId: string; registrationId: number; externalId: string }[];
  excludedFileDetails?: { fileId: string; externalId: string }[];
}) {
  return {
    request: {
      isSelectAll,
      bulkDeleteCriteria: {
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
  };
}



export const debouncedFetchSuggestions = debounce(
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
  ) => {
    setSearchLoading(true);
    setShowError(false);
    try {
      const response = await fetchDMSSuggestions(searchText, fromDate, toDate, categoryId, documentRelatedTo);
      if (!response || response?.statusCode !== 200) {
        setShowErrorBanner(true);
        setSuggestions([]);
        gtmAnalytics.pushEvent({
          event: "error_message",
          messageText: "Information unavailable"
        });
      } else {
        const values = response?.payload ?? [];
        const suggestions = await formatSuggestions(values , t);
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

export const getTitleConfirmation = (t: any, dialogType: string, availableFileCount: number, totalRecords: number): string => {
  if (dialogType === "clearAll") return t("DocumentManagementServer.clearAllDownloadsTitle");
  if (dialogType === "delete") {
    return availableFileCount === 1 ? t("DocumentManagementServer.deleteDocumentTitle") : t("DocumentManagementServer.deleteDocumentsTitle");
  }
  return availableFileCount === totalRecords && availableFileCount > 1 ? t("DocumentManagementServer.prepareAllDocumentsTitle") : t("DocumentManagementServer.prepareDownloadTitle");
};

export const fileDownload = async (
  fileId: string,
  fileName: string,
  application: string,
  sectionName: string,
  blobName?: string
) => {
  const isZipFile = (!application && !sectionName && blobName);
  try {
    if (isZipFile) {
        const response: any = await bulkDownload(blobName!, fileName);
        if (response?.payload && blobName) { 
          const url = response.payload;
          const link = document.createElement("a");
          link.href = url;
          link.download = `${fileName}`;
          document.getElementById(`file-download-${fileId}`)?.parentElement?.appendChild(link);
          link.click();
          document.getElementById(`file-download-${fileId}`)?.parentElement?.removeChild(link);
        } else {
          throw new Error("Bulk download failed: No file URL returned.");
      }
    } else {
      const blob = await downloadFile(application, sectionName, fileId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
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



