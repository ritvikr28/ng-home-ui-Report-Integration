import React from "react";
import { Tooltip, TooltipAlign, TooltipPosition, ShowValAs, Tag, Suggestion, ISearchItemProp, ISelectedItem, Icon, IconColor, IconSize, TagColor, TagSize } from "@essnextgen/ui-kit";
import dayjs from "dayjs";
import { fetchDMSSuggestions, fetchDocumentDetails, fetchFilterCategory, fetchStaffProfilePhoto, prepareAndDownloadFile } from "./ApiService";
import gtmAnalytics from "../../shared/utils/analytics";
import {isValidDate, truncatedString} from "../../shared/utils/commonFunctions";
 import { Category, FetchViewDownloadDataParams } from "./responseModel";
import { pageSizeNumber, relatedToEnum } from "../../../public/Constants";

export function renderRelatedToItem(item: any) {
  if (item.type === "staff") {
     const href = item?.staffId ? `/staff/profile/${item.staffId}` : "/";
    return (
      <>
        <a href={href} className="relatedto-link" target="_blank" rel="noopener noreferrer">
           {item?.name}
           {item?.staffCode ? ` | ${item?.staffCode}` : ""}
        </a>
      </>
    );
  }
  if (item.type === "pupil") {
     const href = item?.pupilId ? `/pupilprofile/profile/${item.pupilId}` : "/";
    const pupilYear = item?.isLeaver?.toLowerCase() === "leaver" ? `(${item?.year || "-"}) ${item?.reg ? ` / (${item.reg})` : ""}`
     : `${item.year}${item.reg ? ` / ${item.reg}` : ""}`;
    return (
      <>
        <a href={href} className="relatedto-link" target="_blank" rel="noopener noreferrer">
          {item.name}
        </a>
       
        {(item?.year || item?.reg) && <Tag
          dataTestId="name"
          id="name"
          className="relatedto-tag"
          text={pupilYear || ""}
        />}
      </>
    );
  }
  // School or other types
  return <span>{item.name}</span>;
};
 
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
        pupilId: pupil.learnerExternalId || "",
        isLeaver:pupil?.onRollState || ""
      }));
    } else if (doc.documentRealatedTo === 3) {
      // Staff
      relatedArr = doc.relatedTo.map((staff: any) => ({
        type: "staff",
        name: `${staff.preferredForename} ${staff.preferredSurname}`.trim(),
        staffCode: staff.staffCode || "",
        staffId: staff.externalId || "",
      }));
    } else if (doc.documentRealatedTo === 2) {
      // School
      relatedArr = doc.relatedTo.map((school: any) => ({
        type: "school",
        name: school.schoolName || "",
      }));
    }
  }
  return relatedArr;
}
 
export const getTableHeadersData: {
  text: string;
  isShow: boolean;
  showValAs: ShowValAs;
  isTextTruncate?: boolean;
  columnWidth: string;
  isHeaderTextTruncate?: boolean;
  headerTxtTrunctLength?: number;
  isSimpleText?: boolean;
  txtTrunctLength?: number;
  isColumnSorting?: boolean;
  isColumnSortByDefault?: boolean;
  anyComponent?: (e: any) => JSX.Element;
}[] = [
    {
      text: "Id",
      isShow: false,
      showValAs: ShowValAs.Text,
      isTextTruncate: false,
      columnWidth: "16px"
    },
    {
      text: "Document",
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
      text: "Related to",
      isShow: true,
      showValAs: ShowValAs.CustomeComponent,
      isTextTruncate: true,
      isHeaderTextTruncate: false,
      headerTxtTrunctLength: 17,
      columnWidth: "261px",
      txtTrunctLength: 35,
      isColumnSorting: true,
anyComponent: (e: any) => (
  <>
    {(!e || !Array.isArray(e) || !e.length) ? null : (
      <div className="relatedto-main">
        {renderRelatedToItem(e[0])}
        {e.length > 1 ? (
          <Tooltip
            dataTestId='tooltip-eventtime'
              content={
              <div className="relatedto-tooltip">
                {e.map((item: any, idx: number) => {
                    if (item.type === "staff") {
                      return (
                        <div key={item.name + idx}>
                          <span>{item.name} | {item.staffCode}</span>
                        </div>
                      );
                    }
                    if (item.type === "pupil") {
                      return (
                        <div key={item.name + idx}>
                          <span>{item.name} | {item.year} {item.reg ? `| ${item.reg}` : ""}</span>
                        </div>
                      );
                    }
                    // School or other types
                    return (
                      <div key={item.name + idx}>
                        <span>{item.name}</span>
                      </div>
                    );
                  })}
              </div>
}
            align={TooltipAlign.Center}
            position={TooltipPosition.Bottom}
          >
            <div className="tooltip-content">
              <span>{`+${e.length}`}</span>
            </div>
          </Tooltip>
        ) : null}
      </div>
    )}
  </>
)
    },
    {
      text: "Category",
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
  text: "Added by",
  isShow: true,
  showValAs: ShowValAs.CustomeComponent,
  headerTxtTrunctLength: 50,
  columnWidth: "180px",
  isColumnSorting: true,
  anyComponent: (e: any) => {
    const shouldTruncate = 12;
    const value = e?.length > shouldTruncate ? truncatedString(e, shouldTruncate)?.truncated : "";
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
      text: "Date added",
      isShow: true,
      columnWidth: "140px",
      showValAs: ShowValAs.Text,
      isTextTruncate: false,
      isColumnSorting: true,
      isColumnSortByDefault: true,
    },
    {
      text: "Format",
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
      text: "Size",
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
  setSearchRefExternalId: React.Dispatch<React.SetStateAction<string>>
) => {
   if (!item || !item.name) return;
  setSearchTerm(item.name);
  setSearchText(item.name);
  setDocumentRelatedTo(relatedToEnum[item.categoryName as keyof typeof relatedToEnum] || 0);

  let refExternalId = "";
  if (item.categoryName === "Pupil") {
    refExternalId = item?.learnerExternalId;
  } else if (item.categoryName === "Staff") {
    refExternalId = item?.externalId;
  } else if (item.categoryName === "Organisation") {
    refExternalId = item?.organisationId;
  }
  setSearchRefExternalId(refExternalId || "");
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
  setIsSearchLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const { value } = e.target;
  setSearchTerm(value);
 
  if (value?.length < 2) {
    setSuggestions([]);
    setShowSearchError(false);
    setIsSearchLoading(false);
    return;
  }
 
  setIsSearchLoading(true);
  setSuggestions([]);
 
  debouncedFetchSuggestions(
    value,
    categoryId,
    fromDate,
    toDate,
    setIsSearchLoading,
    setSuggestions,
    setShowSearchError
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
  sortOrder: string; // <-- Add type here
  dateRange: { fromDate?: string; toDate?: string };
  refExternalId: string;
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
    typeof closeObj.name === "string" &&
    (closeObj.name.match(/^\d{2} \w{3} \d{4} to -$/) ||
      closeObj.name.match(/^\d{2} \w{3} \d{4} to \d{2} \w{3} \d{4}$/))
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

export function getReferenceExternalId(relatedTo: any): string {
  if (!relatedTo) return "";
  if (relatedTo.organisationId) return relatedTo.organisationId;
  if (relatedTo.externalId) return relatedTo.externalId;
  if (relatedTo.learnerExternalId) return relatedTo.learnerExternalId;
  return "";
}

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
}: FetchViewDownloadDataParams) => {
  const pollingRef = downloadPollingIntervalRef;
  if (showLoader) setIsSidePanelLoader(true);
  try {
    const result = await viewDownload();
    if (result?.data && result?.status === 200) {
      setViewData(result.data);

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
          });
        }, 300000);
      }

      if (!hasInProgress && pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    }
    if (!(result?.data && result?.status === 200) && pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  } catch (err) {
    console.error("Error fetching view download details:", err);
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  } finally {
    setIsSidePanelLoader(false);
  }
};
 
export const fetchCategory = async (): Promise<any[]> => {
  try {
    const response = await fetchFilterCategory();
    return response ?? [];
  } catch (err) {
    console.error("Error fetching categories:", err);
    return [];
  }
}
 
export const getResultNotFoundMsg = (
  searchText: string,
  docData: any,
  searchTerm: string,
  showErrorBanner: boolean,
  isSearchTriggered: boolean
  
): string | undefined => {
  if (showErrorBanner) {
    return "Information unavailable.";
  }

  if (isSearchTriggered && searchTerm && docData?.statusCode === 200 && Array.isArray(docData?.data) && docData?.data.length === 0) {
    return `Your search - ${searchTerm} - did not match any results. Make sure that all words are spelled correctly.`;
  }

  if (!searchText && docData?.statusCode === 200 && Array.isArray(docData?.data) && docData?.data.length === 0) {
    return "Use the search bar to find and select a pupil, staff member, or school to view, download, or delete related documents.";
  }
  
  return undefined;
};
 
 
 
 
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
                id: item?.pupilId,
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
  categoryRegistrationMap: Record<string, number>
) {
  if (!Array.isArray(selectedCheckBoxIds) || !Array.isArray(docData?.data)) return [];

  // Gather all valid docs
  const selectedDocs = docData.data.filter(
    (d: any) => selectedCheckBoxIds.includes(d.fileId) && d.registrationId !== undefined
  );

  // If no valid docs, return empty array
  if (selectedDocs.length === 0) return [];

  // Merge fileDetails
  const fileDetails = selectedDocs.map((doc: any) => ({
    fileId: doc.fileId,
    registrationId: doc.registrationId,
  }));

  // Merge referenceMappingDetails
  const referenceMappingDetails = selectedDocs.map((doc: any) => {
    let relatedToArr: any[] = [];
    if (Array.isArray(doc?.relatedTo)) {
      relatedToArr = doc.relatedTo;
    } else if (doc?.relatedTo) {
      relatedToArr = [doc.relatedTo];
    }

    return {
      referenceExternalId:
        Array.isArray(doc?.relatedTo) && doc?.relatedTo[0]?.learnerExternalId
          ? doc.relatedTo[0].learnerExternalId
          : "",
      documentRealatedTo: Array.isArray(doc?.documentRealatedTo)
        ? doc.documentRealatedTo.join(", ")
        : doc?.documentRealatedTo || "",
      relatedTo: relatedToArr,
    };
  });

  // Use categoryId from the first doc (or merge if needed)
  const categoryId =
    selectedDocs.length > 0 && categoryRegistrationMap[selectedDocs[0]?.category]
      ? [categoryRegistrationMap[selectedDocs[0]?.category]]
      : [];

  // Use fromDate/toDate from the first doc (or merge if needed)
  const fromDate = selectedDocs[0]?.fromDate ?? "";
  const toDate = selectedDocs[0]?.toDate ?? "";

  return [
    {
      request: {
        selectAll: false,
        downloadCriteria: {
          referenceMappingDetails,
          categoryId,
          fromDate,
          toDate,
        },
        fileDetails,
      },
    }
  ];
}

export function validateAndApplyFilter({
  selectedDateRange,
  isDateError,
  setIsDateError,
  setIsFilterLoading,
  setDateRange,
  setSelectedFormats,
  selectedCategories,
  setIsFilterDialogOpen,
  setCurrentPage
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
    setTimeout(() => {
      setSelectedFormats(selectedCategories);
      setIsFilterDialogOpen(false);
      setIsFilterLoading(false);
    }, 500);
  }
  setCurrentPage(1);
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
    setShowError: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    try {
      const response = await fetchDMSSuggestions(searchText, fromDate, toDate, categoryId);
      const values = response?.payload ?? [];
      const suggestions = await formatSuggestions(values);
      setSuggestions(suggestions);
    } catch (err) {
      console.error("Autosuggest error:", err);
      setShowError(true);
      setSuggestions([]);
    } finally {
      setSearchLoading(false);
    }
  },
  5
);


