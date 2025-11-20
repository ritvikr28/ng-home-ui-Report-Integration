
import React from "react";
import { Tooltip, TooltipAlign, TooltipPosition, ShowValAs, Tag, Suggestion, ISearchItemProp, ISelectedItem, Icon, IconColor, IconSize, TagColor, TagSize, SelectedItem, TableHeader } from "@essnextgen/ui-kit";
import dayjs from "dayjs";
import { fetchDMSSuggestions, fetchDocumentDetails, fetchFilterCategory, fetchStaffProfilePhoto, prepareAndDownloadFile, downloadFile, bulkDownload } from "./ApiService";
import gtmAnalytics from "../../shared/utils/analytics";
import {isValidDate, truncatedString} from "../../shared/utils/commonFunctions";
 import { BuildValidationPayloadParams, Category, FetchViewDownloadDataParams } from "./responseModel";
import { pageSizeNumber, relatedToEnum } from "../../../public/Constants";
import { EllipsisWithTooltip } from "./EllipsisWithTooltip";

export function mapRelatedArr(doc: any): any[] {
  let relatedArr: any[] = [];
  if (Array.isArray(doc.relatedTo) && doc.relatedTo.length > 0) {
    if (doc.documentRealatedTo === 1) {
      // Pupils
      relatedArr = doc.relatedTo.map((pupil: any) => ({
        type: "pupil",
        name: `${pupil.preferredForename} ${pupil.preferredSurname}`.trim(),
        year: pupil.currentYearGroup || "",
        reg: pupil.currentPrimaryClass || "",
        referenceExternalId: pupil.learnerExternalId || "",
        isLeaver:pupil?.onRollState || ""
      }));
    } else if (doc.documentRealatedTo === 3) {
      // Staff
      relatedArr = doc.relatedTo.map((staff: any) => ({
        type: "staff",
        name: `${staff.preferredForename} ${staff.preferredSurname}`.trim(),
        staffCode: staff.staffCode || "",
        referenceExternalId: staff.externalId || "",
        isLeaver: staff?.onRollState || ""
      }));
    } else if (doc.documentRealatedTo === 2) {
      // School
      relatedArr = doc.relatedTo.map((school: any) => ({
        type: "school",
        name: school.schoolName || "",
        referenceExternalId: school.organisationId || "",
      }));
    }
  }
  return relatedArr;
}

export const getTableHeadersData =(t:any):TableHeader[] => [
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
      isHeaderTextTruncate: true,
      columnWidth: "267px",
      headerTxtTrunctLength: 50,
      isSimpleText: true,
      txtTrunctLength: 35,
      isColumnSorting: true,
      anyComponent: (e: any) =>{
        const value = e?.length > 25 ? truncatedString(e, 25)?.truncated : "";
        if (!value) return <div style={{ display: "flex" }}><span className="document-text document-column">{e}</span></div>;
        return (
          <>
          <div style={{ display: "flex" }}>
            <Tooltip
              dataTestId="tooltip-eventtime"
              content={<span>{e}</span>}
              align={TooltipAlign.Center}
              position={TooltipPosition.Bottom}
            >
              <div className="tooltip-content document-text">
                <span>{value}</span>
              </div>
            </Tooltip>
          </div>
          </>
        );
      }
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
    anyComponent: (e: any) => (
      <>
        {(!e || !Array.isArray(e) || !e.length) ? null : (
              <EllipsisWithTooltip
                text={e[0]}
                className=" relatedto-main"
                isTooltipNeeded={!!(e.length === 1)}
                totalItems={e}
              />
        )}
      </>
    )
  },
    {
      text: t("DocumentManagementServer.categoryColumn"),
      isShow: true,
      showValAs: ShowValAs.CustomeComponent,
      isHeaderTextTruncate: true,
      headerTxtTrunctLength: 20,
 
      isColumnSorting: true,
      columnWidth: "144px",
      anyComponent: (e: any) => {
        const value = e?.length > 10 ? truncatedString(e, 10)?.truncated : "";
        if (!value) return <span className="document-text document-column">{e}</span>;
        return (
          <>
            <Tooltip
              dataTestId="tooltip-eventtime"
              content={<span>{e}</span>}
              align={TooltipAlign.Center}
              position={TooltipPosition.Bottom}
            >
              <div className="tooltip-content document-text">
                <span>{value}</span>
              </div>
            </Tooltip>
          </>
        );
      }
    },
   {
  text: t("DocumentManagementServer.addedByColumn"),
  isShow: true,
  showValAs: ShowValAs.CustomeComponent,
  headerTxtTrunctLength: 50,
  columnWidth: "180px",
  isColumnSorting: false,
  anyComponent: (e: any) => {
    // const shouldTruncate = 12;
    const value = e?.length > 12 ? truncatedString(e, 12)?.truncated : "";
    if (!value) return (
      <div style={{ display: "flex" }}>
        <span className="document-text document-column">{e}</span>
      </div>
    );
    return (
      <div style={{ display: "flex" }}>
        <Tooltip
          dataTestId="tooltip-addedby"
          content={<span>{e}</span>}
          align={TooltipAlign.Center}
          position={TooltipPosition.Bottom}
        >
          <div className="tooltip-content document-text">
            <span>{value}</span>
          </div>
        </Tooltip>
      </div>
    );
  }
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
      isHeaderTextTruncate: true,
      headerTxtTrunctLength: 50,
      columnWidth: "120px",
      anyComponent: (e: any) => {
        const value = e?.length > 25 ? truncatedString(e, 25)?.truncated : "";
        if (!value) return <div style={{ display: "flex" }}><span className="document-text document-column">{e}</span></div>;
        return (
          <>
            <Tooltip
              dataTestId="tooltip-eventtime"
              content={<span>{e}</span>}
              align={TooltipAlign.Center}
              position={TooltipPosition.Bottom}
            >
              <div className="tooltip-content document-text">
                <span>{value}</span>
              </div>
            </Tooltip>
          </>
        );
      }
    },
    {
      text: t("DocumentManagementServer.sizeColumn"),
      isShow: true,
      showValAs: ShowValAs.CustomeComponent,
      txtTrunctLength: 12,
      isColumnSorting: true,
      isTextTruncate: false,
      isHeaderTextTruncate: true,
      headerTxtTrunctLength: 50,
      columnWidth: "129px",
      anyComponent: (e: any) => {
        const value = Array.isArray(e) ? e[0] : e;
        const sizeVal = value?.length > 10 ? truncatedString(value, 10)?.truncated : "";
        if (!value) return <></>;
        if (!sizeVal) return <span className="document-text document-column">{value}</span>;
        return (
          <div style={{ display: "flex" }}>
            <Tooltip
              dataTestId="tooltip-eventtime"
              content={<span>{value}</span>}
              align={TooltipAlign.Center}
              position={TooltipPosition.Bottom}
            >
              <div className="tooltip-content document-text">
                <span>{sizeVal}</span>
              </div>
            </Tooltip>
          </div>
        );
      },
    }
  ];


export const handlePageChange = (
  _event: any,
  page: number,
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>,
  setIsSearchDataLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  setIsSearchDataLoading(true);
  setCurrentPage(page);
};
 
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
 
 
export const handleSuggestionClick = async (
  item: ISearchItemProp | null,
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>,
  setSearchText: React.Dispatch<React.SetStateAction<string>>,
  setDocumentRelatedTo: React.Dispatch<React.SetStateAction<number>>,
  setSearchRefExternalId: React.Dispatch<React.SetStateAction<string[]>>
) => {
   if (!item || !item.name) return;
  setSearchTerm(item.name);
  setSearchText(item.name);
  setDocumentRelatedTo(relatedToEnum[item.categoryName as keyof typeof relatedToEnum] || 0);

  let refExternalId: string[] = [];
  if (item.categoryName === "Pupil") {
    refExternalId = [item?.learnerExternalId];
  } else if (item.categoryName === "Staff") {
    refExternalId = [item?.externalId];
  } else if (item.categoryName === "Organisation") {
    refExternalId = [item?.organisationId];
  }
  setSearchRefExternalId(refExternalId || []);
  gtmAnalytics.pushEvent({
      event: "interact_click",
      elementType: "search_option",
      elementTextOrLabel: item.categoryName === "Organisation" ? "School" : item.categoryName ?? "",
      elementLocation: "search_suggestions"
    });
};
 
// Has items check
export const hasItems = (suggestions: Suggestion[]): boolean =>
  suggestions?.some(({ values }) => values?.length > 0);
 
// Search input change logic
export const handleSearchChange = (
  e: React.ChangeEvent<HTMLInputElement>,
  categoryId: number[] | null,
  fromDate: string,
  toDate: string,
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>,
  setSuggestions: React.Dispatch<React.SetStateAction<Suggestion[]>>,
  setShowSearchError: React.Dispatch<React.SetStateAction<boolean>>,
  setIsSearchLoading: React.Dispatch<React.SetStateAction<boolean>>,
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

  if (value?.length < 2) {
    setSuggestions([]);
    setShowSearchError(false);
    setIsSearchLoading(false);
    return;
  }
 
  setIsSearchLoading(true);
  setSuggestions([]);
  setShowSearchError(false);
 
  debouncedFetchSuggestions(
    value,
    categoryId,
    fromDate,
    toDate,
    setIsSearchLoading,
    setSuggestions,
    setShowSearchError,
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
  setShowErrorBanner,
  setIsSearchLoading,
  setIsSearchDataLoading
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
  setShowErrorBanner: (v: boolean) => void;
  setIsSearchLoading: (v: boolean) => void;
  setIsSearchDataLoading: (v: boolean) => void;
}) {
  setIsSearchDataLoading(true);
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
      documentRealatedTo: relatedTo || 0
    });
    if (result && result?.statusCode === 200) {
      setDocData(result);
      setCurrentPage(page);
      setTotalPage(Math.ceil(result?.totalRecords / pageSizeNumber));
      setShowSearchError(false);
      setShowErrorBanner(false);
    } else if (result && result?.status === 400) {
      setShowErrorBanner(true);
      
      gtmAnalytics.pushEvent({
        event: "error_message",
        actionType: "Information unavailable"
      });
    } else {
      setShowSearchError(true);
    }
  } catch (err) {
    console.error("Error fetching document details:", err);
    setShowSearchError(true);
  }
  setIsSearchLoading(false);
  setIsSearchDataLoading(false);
}


export const getVisibleTagsWithSummary = (tags: any[], maxVisible: number = 3) => {
  if (tags.length <= maxVisible) return tags;
  const visibleTags = tags.slice(0, maxVisible);
  const remainingCount = tags.length - maxVisible;
  visibleTags.push({
    text: `+${remainingCount}`,
    categoryName: "Summary",
    closeObj: null
  });
  return visibleTags;
};
 
export const getCategoryArr = (selectedFormats: any[]) =>
  selectedFormats?.map((cat: any) => ({
    text: cat?.text,
    categoryName: cat?.value,
    closeObj: {
      name: cat?.text,
      id: cat?.data?.registrationId,
    },
  })) || [];
 
  export const getDateTag = (dateRange: { fromDate: string; toDate: string }) => {
  if (!dateRange.fromDate && !dateRange.toDate) return [];
 
  let text = "";
  if (dateRange.fromDate && dateRange.toDate) {
    text = `${dayjs(dateRange.fromDate).format("DD MMM YYYY")} to ${dayjs(dateRange.toDate).format("DD MMM YYYY")}`;
  } else if (dateRange.fromDate) {
    text = `${dayjs(dateRange.fromDate).format("DD MMM YYYY")} to -`;
  } else if (dateRange.toDate) {
    text = `- to ${dayjs(dateRange.toDate).format("DD MMM YYYY")}`;
  }
 
  return [
    {
      text,
      categoryName: "Date",
      closeObj: { name: "Date", id: "dateRange" },
    }
  ];
};
 
export const handleTagCloseLogic = (
  e: React.SyntheticEvent,
  text: string,
  closeObj: { name?: string; id?: string | number },
  setSelectedDateRange: React.Dispatch<React.SetStateAction<{ fromDate: string; toDate: string }>>,
  setDateRange: React.Dispatch<React.SetStateAction<{ fromDate: string; toDate: string }>>,
  setIsDateError: React.Dispatch<React.SetStateAction<boolean>>,
  setSelectedCategories: React.Dispatch<React.SetStateAction<ISelectedItem[]>>,
  setSelectedFormats: React.Dispatch<React.SetStateAction<ISelectedItem[]>>
) => {
  // Detect date range tag by its name format
  if (
  closeObj.id === "dateRange" ||
  (typeof closeObj.name === "string" &&
    (closeObj.name.match(/^\d{2} \w{3} \d{4} to -$/) ||
      closeObj.name.match(/^\d{2} \w{3} \d{4} to \d{2} \w{3} \d{4}$/))
  )
) {
  setSelectedDateRange({ fromDate: "", toDate: "" });
  setDateRange({ fromDate: "", toDate: "" });
  setIsDateError(false);
}
 
  // Remove category/format tag
  setSelectedCategories(prev =>
    prev.filter(item => item.text !== closeObj.name && item.data !== closeObj.name)
  );
  setSelectedFormats(prev =>
    prev.filter(item => item.text !== closeObj.name && item.data !== closeObj.name)
  );
};


export function reduceCategories(res: any[]): Category[] {
  return Object.values(
    res?.reduce((acc: any, curr: any) => {
      if (!acc[curr.application]) {
        acc[curr.application] = { application: curr.application, registrationId: [], section: [] };
      }
      acc[curr.application].registrationId.push(curr.registrationId);
      acc[curr.application].section.push(curr.section);
      return acc;
    }, {})
  ) as Category[];
}

export const fetchViewDownloadData = async ({
  showLoader = true,
  setIsSidePanelLoader,
  setViewData,
  viewDownload,
  downloadPollingIntervalRef,
  setIsViewDownloadError,
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
      if (hasInProgress && !pollingRef.current) {
        pollingRef.current = setInterval(() => {
          fetchViewDownloadData({
            showLoader: false,
            setIsSidePanelLoader,
            setViewData,
            viewDownload,
            downloadPollingIntervalRef: pollingRef,
            setIsViewDownloadError,
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

export const fetchCategory = async (documentRealatedTo: number | null): Promise<any[]> => {
  try {
    const response = await fetchFilterCategory(documentRealatedTo);
    return response ?? [];
  } catch (err) {
    console.error("Error fetching categories:", err);
    return [];
  }
}
 
export const getResultNotFoundMsg = (
  t:any,
  searchText: string,
  docData: any,
  searchTerm: string,
  showErrorBanner: boolean,
  isSearchTriggered: boolean
): string | undefined => {
  if (showErrorBanner) {
    return "Information unavailable.";
  }
  // Show "No data to display" only if searching and no data
  if (searchText && docData?.statusCode === 200 && Array.isArray(docData?.data) && docData?.data.length === 0) {
    return "No data to display.";
  }
  if (!isSearchTriggered && !searchText) {
    return t("DocumentManagementServer.searchBarText");
  }
  return undefined;
};
 
 export function getCompletedPartitionKeys(viewData: Array<{ status?: string; partitionKey?: string }>): string[] {
  return viewData
    .filter(item => item.status?.toLowerCase() === 'complete')
    .map(item => item.partitionKey ?? "")
}
 
 
export const getAllRegistrationIds = (selectedFormats: any[]): any[] =>
     selectedFormats?.flatMap(item => {
        const regId = item?.data?.registrationId;
        if (Array.isArray(regId)) {
            return regId;
        }
        if (regId) {
            return [regId];
        }
        return [];
    }) || [];

const staffImgString = 'Staff Photo';
const pupilImgString = 'Pupil Photo';

export const getStaffProfilePhoto = async (staffId: string) => {
  const response = await fetchStaffProfilePhoto(staffId);
  return response?.data ?? "";
}
export const formatSuggestions = async (payload: any[]): Promise<Suggestion[]> => {
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
        name: category?.name || "",
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
  export const filterNonEmptySuggestions = (suggestions: Suggestion[]) =>
  suggestions.filter(s => s?.values.length > 0);
 
function debounce<T extends (...args: any[]) => void>(func: T, wait: number) {
  let timeout: ReturnType<typeof setTimeout>;
  return function (this: any, ...args: Parameters<T>) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}
 
export function buildSelectedDocs(
  selectedCheckBoxIds: string[],
  docData: any,
  categoryId: number[],
  searchRefExternalId: string[],
  documentRealatedTo: number,
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
      documentRealatedTo,
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
          documentRealatedTo,
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

export const handleBulkDeleteLogic = async ({
  allSelectedDocs,
  docData,
  allRegistrationIds,
  dateRange,
  searchRefExternalId,
  documentRealatedTo,
  currentPage,
  sortBy,
  sortDirection,
  setShowToastNotification,
  setShowConfirmDialog,
  setSelectedCheckBoxIds,
  setAllSelectedDocs,
  setIsClearSelectedCheckbox,
  setShowDeleteErrorBanner,
  setShowDeleteSuccessToast,
  setShowDeleteAbortBanner,
  fetchGetDocumentDetails,
  deleteFiles,
  excludedCheckBoxIds,
  isHeaderBoxChecked,
  availableFileIds,
  setIsSearchDataLoading
}: {
  allSelectedDocs: { fileId: string; registrationId: number, externalId: string }[],
  docData: any,
  allRegistrationIds: any[],
  dateRange: { fromDate: string; toDate: string },
  searchRefExternalId: string[],
  documentRealatedTo: number,
  currentPage: number,
  sortBy: string,
  sortDirection: string,
  setShowToastNotification: (v: boolean) => void,
  setShowConfirmDialog: (v: boolean) => void,
  setSelectedCheckBoxIds: (v: string[]) => void,
  setAllSelectedDocs: (v: any[]) => void,
  setIsClearSelectedCheckbox: (v: boolean) => void,
  setShowDeleteErrorBanner: (v: boolean) => void,
  setShowDeleteSuccessToast: (v: boolean) => void,
  setShowDeleteAbortBanner : (v: boolean) => void,
  fetchGetDocumentDetails: (page: number, categories: number[], sortByCol: string, sortOrder: string) => void,
  deleteFiles: (payload: any) => Promise<number>,
  excludedCheckBoxIds: string[],
  isHeaderBoxChecked: boolean,
  setIsSearchDataLoading: (v: boolean) => void,
  availableFileIds: string[]
}) => {

  setShowDeleteSuccessToast(false);
  if (setIsSearchDataLoading) setIsSearchDataLoading(true);
  setShowDeleteAbortBanner(false);
  const payload = mapToBulkDeletePayload({
    isSelectAll: !!isHeaderBoxChecked,
    categoryIds: allRegistrationIds,
    fromDate: dateRange.fromDate,
    toDate: dateRange.toDate,
    referenceExternalIds: searchRefExternalId,
    documentRelatedTo: documentRealatedTo,
    fileDetails: isHeaderBoxChecked || !allSelectedDocs.length
  ? []
      : allSelectedDocs
        .filter(doc => availableFileIds?.includes(doc.fileId))
        ?.map(doc => ({
          fileId: doc.fileId,
          registrationId: doc.registrationId,
          externalId: doc.externalId
        })),
    excludedFileDetails:
      isHeaderBoxChecked && excludedCheckBoxIds?.length > 0 && excludedCheckBoxIds?.length < (docData?.totalRecords ?? 0)
        ? excludedCheckBoxIds.map(fileId => {
          const matchingDoc = allSelectedDocs.find((doc) => doc.fileId === fileId);
          return {
            fileId,
            externalId: matchingDoc?.externalId ?? "",
            registrationId: matchingDoc?.registrationId ?? 0
          };
        })
        : []
  });
  try {
    const status = await deleteFiles(payload);
    if (status === 204) {
      setShowToastNotification(true);
      setShowConfirmDialog(false);
      setSelectedCheckBoxIds([]);
      setAllSelectedDocs([]);
      setIsClearSelectedCheckbox(true);
      setShowDeleteErrorBanner(false);
      setShowDeleteSuccessToast(true);
      gtmAnalytics.pushEvent({
        event: "key_action",
        actionType: "delete"
      });
    if(isHeaderBoxChecked === true){
    setTimeout(() => {
        fetchGetDocumentDetails(currentPage, allRegistrationIds, sortBy, sortDirection);
      }, 3500);
    }
    else{
        fetchGetDocumentDetails(currentPage, allRegistrationIds, sortBy, sortDirection);
      }
    } 
    else if(status === 409){
     setShowDeleteAbortBanner(true);
      gtmAnalytics.pushEvent({
      event: "error_message",
      actionType: "Unable to delete"
    });
    }else {
      setShowDeleteErrorBanner(true);
      gtmAnalytics.pushEvent({
      event: "error_message",
      actionType: "Unable to delete"
    });
    }
  } catch (err) {
    setShowDeleteErrorBanner(true);
    gtmAnalytics.pushEvent({
      event: "error_message",
      actionType: "Unable to delete"
    });
  }
};

export function validateAndApplyFilter({
  selectedDateRange,
  isDateError,
  setIsDateError,
  setIsFilterLoading,
  setDateRange,
  setSelectedFormats,
  selectedCategories,
  setIsFilterDialogOpen,
  setCurrentPage,
  setExcludedCheckBoxIds,
  setAllSelectedDocs,
  referenceExternalIds,
  setReferenceExternalIds,
  setIsHeaderBoxChecked,
  setSelectedCheckBoxIds,
  setPrevSelectedDocs
}: {
  selectedDateRange: { fromDate?: string; toDate?: string };
  isDateError: boolean;
  setIsDateError: (v: boolean) => void;
  setIsFilterLoading: (v: boolean) => void;
  setDateRange: (v: { fromDate: string; toDate: string }) => void;
  setSelectedFormats: (v: any) => void;
  selectedCategories: any;
  setIsFilterDialogOpen: (v: boolean) => void;
  setCurrentPage: (v: number) => void;
  setExcludedCheckBoxIds: (v: string[]) => void;
  setAllSelectedDocs: (v: any[]) => void;
  referenceExternalIds: string[];
  setReferenceExternalIds: (v: string[]) => void;
  setIsHeaderBoxChecked: (v: boolean) => void;
  setSelectedCheckBoxIds: (v: string[]) => void;
  setPrevSelectedDocs: (v: any[]) => void;
}) {
  if (
    (selectedDateRange?.fromDate && !isValidDate(selectedDateRange?.fromDate)) ||
    (selectedDateRange?.toDate && !isValidDate(selectedDateRange?.toDate))
  ) {
    setIsDateError(true);
    return;
  }

  if (isDateError) {
    setIsDateError(true);
    return;
  }

  if (
    isDateError ||
    (selectedDateRange?.fromDate && !dayjs(selectedDateRange?.fromDate, "YYYY-MM-DD").isValid()) ||
    (!selectedDateRange?.fromDate && selectedDateRange?.toDate && dayjs(selectedDateRange?.toDate, "YYYY-MM-DD").isValid()) ||
    (selectedDateRange?.toDate && !dayjs(selectedDateRange?.toDate, "YYYY-MM-DD").isValid())
  ) {
    setIsDateError(true);
  } else {
    setIsFilterLoading(true);
     setDateRange({
      fromDate: selectedDateRange?.fromDate ?? "",
      toDate: selectedDateRange?.toDate ?? ""
    });
      setSelectedFormats(selectedCategories);
      setIsFilterDialogOpen(false);
      setIsFilterLoading(false);
      setReferenceExternalIds(referenceExternalIds ?? []);
  
  }
  setCurrentPage(1);
  setExcludedCheckBoxIds([]);
  setAllSelectedDocs([]);
  setIsHeaderBoxChecked(false);
  setSelectedCheckBoxIds([]);
  setPrevSelectedDocs([]);
}

export function closeSidePanel(
  setIsSidePanelOpen: (v: boolean) => void,
  downloadPollingIntervalRef: React.MutableRefObject<ReturnType<typeof setInterval> | null>
) {
  setIsSidePanelOpen(false);
  if (downloadPollingIntervalRef.current) {
    clearInterval(downloadPollingIntervalRef.current);
    
  // eslint-disable-next-line 
    downloadPollingIntervalRef.current = null;
  }
}

export const debouncedFetchSuggestions = debounce(
  async (
    searchText: string,
    categoryId: number[] | null,
    fromDate: string,
    toDate: string,
    setSearchLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setSuggestions: React.Dispatch<React.SetStateAction<Suggestion[]>>,
    setShowError: React.Dispatch<React.SetStateAction<boolean>>,
    documentRelatedTo?: number | string
  ) => {
    setSearchLoading(true);
    setShowError(false);
    try {
      const response = await fetchDMSSuggestions(searchText, fromDate, toDate, categoryId, documentRelatedTo);
      const values = response?.payload ?? [];
      const suggestions = await formatSuggestions(values);
      setSuggestions(suggestions);
      setShowError(suggestions?.length === 0);
    } catch (err) {
      console.error("Autosuggest error:", err);
      setShowError(true);
      setSuggestions([]);
    } finally {
      setSearchLoading(false);
    }
  },
  3000
);

export async function handleClearAllConfirm({
  viewData: clearAllViewData,
  clearAllFiles,
  setShowToastNotification,
  fetchViewDownloadData: clearAllFetchViewDownloadData,
  setIsSidePanelLoader,
  setViewData,
  viewDownload: clearAllViewDownload,
  downloadPollingIntervalRef: clearAllDownloadPollingIntervalRef,
  setClearAllError,
  setShowConfirmDialog,
  getCompletedPartitionKeys: clearAllGetCompletedPartitionKeys,
  setIsViewDownloadError
}: {
  viewData: any[],
  clearAllFiles: (payload: { request: { partitionKey: string[] } }) => Promise<number>,
  setShowToastNotification: (v: boolean) => void,
  fetchViewDownloadData: (args: any) => void,
  setIsSidePanelLoader: (v: boolean) => void,
  setViewData: (v: any) => void,
  setHasFetchedViewDownload: (v: boolean) => void,
  viewDownload: any,
  downloadPollingIntervalRef: any,
  setClearAllError: (v: boolean) => void,
  setShowConfirmDialog: (v: boolean) => void,
  getCompletedPartitionKeys: (viewData: any[]) => string[],
  setIsViewDownloadError: (v: boolean) => void,
}) {
  const completedPartitionKeys = clearAllGetCompletedPartitionKeys(clearAllViewData);
  setIsSidePanelLoader(true);
  try {
    const response = await clearAllFiles({ request: { partitionKey: completedPartitionKeys } });

    if (response === 204) {
      setViewData([]);
      setShowToastNotification(true);
      await clearAllFetchViewDownloadData({
        showLoader: false,
        setIsSidePanelLoader,
        setViewData,
        viewDownload: clearAllViewDownload,
        downloadPollingIntervalRef: clearAllDownloadPollingIntervalRef,
        setIsViewDownloadError,
      });
      setIsSidePanelLoader(false);
    } else {
      setClearAllError(true);
      setIsSidePanelLoader(false);
      gtmAnalytics.pushEvent({
      event: "error_message",
      actionType: "Unable to clear downloads"
    });
    }
  } catch (error) {
    setClearAllError(true);
    setShowToastNotification(false);
    setIsSidePanelLoader(false);
    gtmAnalytics.pushEvent({
      event: "error_message",
      actionType: "Unable to clear downloads"
    });
  }
  setShowConfirmDialog(false);
}

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
        const response = await bulkDownload(blobName!, fileName);
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

export function addUniqueTagItem({
  item,
  selectedRelatedTo,
  tagListArray,
  setTagListArray,
  setReferenceExternalIds,
  maxLimit = 5,
  setAlreadyExistingTags
}: {
  item: ISearchItemProp | null;
  selectedRelatedTo: ISelectedItem | undefined;
  tagListArray: SelectedItem[];
  setTagListArray: React.Dispatch<React.SetStateAction<SelectedItem[]>>;
  setReferenceExternalIds?: React.Dispatch<React.SetStateAction<string[]>>;
  maxLimit?: number;
  setAlreadyExistingTags?: React.Dispatch<React.SetStateAction<boolean>>;
}): void {
  if (!item) return;

  let idKey = "organisationId";
  if (selectedRelatedTo?.data?.data.key === "Pupil") {
    idKey = "learnerExternalId";
  } else if (selectedRelatedTo?.data?.data.key === "Staff") {
    idKey = "externalId";
  }

  // Always normalize the ID for comparison
  const newId = (item as any)[idKey]?.toString().toLowerCase() ?? item.text?.toString().toLowerCase();
  
  const alreadyExists = tagListArray.some(
    (tag) => {
      const tagId = (tag as any)[idKey]?.toString().toLowerCase() ?? tag.id?.toString().toLowerCase();
      return tagId === newId;
    }
  );

  if (alreadyExists) {
    if (setAlreadyExistingTags) setAlreadyExistingTags(true);
    return;
  }
  if (tagListArray.length < maxLimit) {
    setTagListArray([...tagListArray, item as SelectedItem]);
    if (setReferenceExternalIds && newId) {
      setReferenceExternalIds((prev) =>
        prev.includes(newId) ? prev : [...prev, newId]
      );
    }
  }
}

export function handleApply({
  referenceExternalIds,
  categories,
  selectedCategories,
  selectedDateRange,
  isDateError,
  selectedEntity,
  setIsDateError,
  setIsFilterLoading,
  setDateRange,
  setIsFilterDialogOpen,
  setCurrentPage,
  setExcludedCheckBoxIds,
  setAllSelectedDocs,
  setSearchInput,
  setSearchTerm,
  setSearchText,
  setTableKey,
  setIsSearchTriggered,
  setSelectedCategories,
  setSelectedFormats,
  setSearchRefExternalId,
  setIsHeaderBoxChecked,
  setSelectedCheckBoxIds,
  setPrevSelectedDocs,
  setSelectedEntities,
}: {
  referenceExternalIds: string[],
  categories?: any[],
  selectedCategories: any[],
  selectedDateRange: any,
  isDateError: boolean,
  selectedEntity?: any[],
  setIsDateError: (v: boolean) => void,
  setIsFilterLoading: (v: boolean) => void,
  setDateRange: (v: any) => void,
  setIsFilterDialogOpen: (v: boolean) => void,
  setCurrentPage: (v: number) => void,
  setExcludedCheckBoxIds: (v: string[]) => void,
  setAllSelectedDocs: (v: any[]) => void,
  setSearchInput: (v: string) => void,
  setSearchTerm: (v: string) => void,
  setSearchText: (v: string) => void,
  setTableKey: (v: (prev: number) => number) => void,
  setIsSearchTriggered: (v: boolean) => void,
  setSelectedCategories: (v: any[]) => void,
  setSelectedFormats: (v: any[]) => void,
  setSearchRefExternalId: (v: string[]) => void,
  setIsHeaderBoxChecked: (v: boolean) => void,
  setSelectedCheckBoxIds: (v: string[]) => void,
  setPrevSelectedDocs: (v: any[]) => void,
  setSelectedEntities: (v: any[]) => void
}) {
  const appliedCategories = categories ?? selectedCategories;
  validateAndApplyFilter({
    selectedDateRange,
    isDateError,
    setIsDateError,
    setIsFilterLoading,
    setDateRange,
    setSelectedFormats,
    selectedCategories: appliedCategories,
    setIsFilterDialogOpen,
    setCurrentPage,
    setExcludedCheckBoxIds,
    setAllSelectedDocs,
    referenceExternalIds,
    setReferenceExternalIds: setSearchRefExternalId,
    setIsHeaderBoxChecked,
    setSelectedCheckBoxIds,
    setPrevSelectedDocs
  });
  setSelectedCategories(appliedCategories);
  setSelectedFormats(appliedCategories);
  if (referenceExternalIds.length > 0) {
    setSearchInput("");
    setSearchTerm("");
    setSearchText("");
    setTableKey((prev) => prev + 1);
  }
  if (setSelectedEntities) {
    setSelectedEntities(selectedEntity || []);
  }
  setIsSearchTriggered(true);
}

export const handleEditSelectedOverFlowMenu = async ({
  selectedItem,
  totalSelectedCount,
  setShowDialog,
  setShowConfirmDialog,
  setShowRestrictedDeleteDialog,
  setShowRestrictedPrepareDialog,
  setIsPreDialogLoading,
  isHeaderBoxChecked,
  allSelectedDocs,
  buildValidationPayload: buildValidationPayloadFn,
  allRegistrationIds,
  dateRange,
  searchRefExternalId,
  documentRealatedTo,
  validation,
  setRestrictedFileCount,
  setAlreadyDeletedFileCount,
  setAvailableFileCount,
  setDialogType,
  setIsDialogLoading,
  setSidePanelOpenReason,
  setIsSidePanelOpen,
  setAvailableFileIds
}: {
  e: React.SyntheticEvent,
  selectedItem: ISelectedItem,
  totalSelectedCount: number,
  setShowDialog: (v: boolean) => void,
  setShowConfirmDialog: (v: boolean) => void,
  setShowRestrictedDeleteDialog: (v: boolean) => void,
  setShowRestrictedPrepareDialog: (v: boolean) => void,
  setIsPreDialogLoading: (v: boolean) => void,
  isHeaderBoxChecked: boolean,
  allSelectedDocs: any[],
  buildValidationPayload: (args: any) => any,
  allRegistrationIds: any[],
  dateRange: { fromDate: string; toDate: string },
  searchRefExternalId: string[],
  documentRealatedTo: number,
  validation: (payload: any) => Promise<any>,
  setRestrictedFileCount: (v: number) => void,
  setAlreadyDeletedFileCount: (v: number) => void,
  setAvailableFileCount: (v: number) => void,
  setDialogType: (v: string) => void,
  setIsDialogLoading: (v: boolean) => void,
  setSidePanelOpenReason: React.Dispatch<React.SetStateAction<"view" | "prepare" | null>>,
  setIsSidePanelOpen: (v: boolean) => void,
  setAvailableFileIds: (v: string[]) => void
}) => {
  setShowConfirmDialog(false);
  setShowRestrictedDeleteDialog(false);
  setShowRestrictedPrepareDialog(false);

  if (selectedItem.value === "Prepare download" || selectedItem.value === "Delete") {
    if (totalSelectedCount === 0) {
      setShowDialog(true);
    } else {
      setShowRestrictedDeleteDialog(true);
      setIsPreDialogLoading(true);
      const excludedFileDetails = isHeaderBoxChecked ? allSelectedDocs : [];
      const fileDetails = isHeaderBoxChecked ? [] : allSelectedDocs || [];
      const validationPayload = buildValidationPayloadFn({
        isSelectAll: !!isHeaderBoxChecked,
        userActivity: selectedItem.value === "Prepare download" ? "PrepareDownload" : "BulkDelete",
        categoryIds: allRegistrationIds,
        fromDate: dateRange.fromDate,
        toDate: dateRange.toDate,
        referenceExternalIds: searchRefExternalId,
        documentRelatedTo: documentRealatedTo,
        fileDetails,
        excludedFileDetails,
      });

      const result = await validation(validationPayload);

      const restricted = result?.data?.restrictedFileCount ?? 0;
      const alreadyDeleted = result?.data?.alreadyDeletedFileCount ?? 0;
      const available = result?.data?.availableFileCount ?? 0;
      const availableFileIds = result?.data?.availableFileIds ?? [];

      setRestrictedFileCount(restricted);
      setAlreadyDeletedFileCount(alreadyDeleted);
      setAvailableFileCount(available);
      setAvailableFileIds(availableFileIds);

      setDialogType(selectedItem.value === "Prepare download" ? "prepareDownload" : "delete");
      setIsPreDialogLoading(false);
      setShowRestrictedDeleteDialog(false);

      if (
        selectedItem.value === "Prepare download" &&
        available === 0 &&
        alreadyDeleted > 0
      ) {
        setShowRestrictedPrepareDialog(true);
        setShowConfirmDialog(false);
        return;
      }

      if (selectedItem.value === "Delete") {
        if (available === 0 && (restricted > 0 || alreadyDeleted > 0)) {
          setIsDialogLoading(false);
          setShowRestrictedDeleteDialog(true);
          setShowConfirmDialog(false);
          return;
        }

        if (available > 0) {
          setIsDialogLoading(false);
          setShowConfirmDialog(true);
          setShowRestrictedDeleteDialog(false);
          return;
        }
      }

      setShowConfirmDialog(true);
    }
  } else if ((selectedItem?.value?.toLowerCase() === "view download")) {
    setSidePanelOpenReason("view");
    setIsSidePanelOpen(true);
    gtmAnalytics.pushEvent({
      event: "key_action",
      actionType: "view_download"
    });
  }
};