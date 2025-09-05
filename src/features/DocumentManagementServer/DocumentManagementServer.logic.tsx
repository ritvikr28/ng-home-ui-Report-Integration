import React from "react";
import { Tooltip, TooltipAlign, TooltipPosition, ShowValAs, Tag, Suggestion, ISearchItemProp, ISelectedItem, Icon, IconColor, IconSize, TagColor, TagSize } from "@essnextgen/ui-kit";
import dayjs from "dayjs";
import { fetchDMSSuggestions, fetchFilterCategory, fetchStaffProfilePhoto } from "./ApiService";
import gtmAnalytics from "../../shared/utils/analytics";
import {truncatedString} from "../../shared/utils/commonFunctions";

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
    return (
      <>
        <a href={href} className="relatedto-link" target="_blank" rel="noopener noreferrer">
          {item.name}
        </a>
        <Tag
          dataTestId="name"
          id="name"
          className="relatedto-tag"
          text={`${item.year}${item.reg ? ` / ${item.reg}` : ""}`}
        />
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
      showValAs: ShowValAs.Text,
      headerTxtTrunctLength: 50,
      columnWidth: "180px",
      isColumnSorting: true,
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

export const viewData: {
  batchId: string;
  organisationId: string;
  totalNoOfFiles: number;
  name: string;
  userIdCreatedBy: string;
  status: string;
  size: number;
  application: string | null;
  section: string | null;
  partitionKey: string;
  rowKey: string;
  timestamp: string;
  eTag: {};
  fileExpiryDays: number | null;
  groupBatchId: string;
  shouldNotifyByEmail: boolean;
  userEmailId: string | null;
  fileId: string;
  blobName: string;
  batchStatus: string;
  totalSourceFilesSize: number;
}[] = [
    
   {
    "partitionKey": "8cf6afc7-20c3-4b26-9727-f74500b5cf2e",
    "rowKey": "91531fb6-f3a4-443a-8ada-508f066a2e89",
    "timestamp": "2025-09-05T05:51:22.798441+00:00",
    "eTag": {},
    "groupBatchId": "f789b742-cf35-4f08-a0fc-aef2f0a195f6",
    "batchId": "a0710298-a922-419e-9221-baff311b41e8",
    "shouldNotifyByEmail": true,
    "userEmailId": "Hirani@example.com",
    "userIdCreatedBy": "364d9798-1869-4661-94af-8e8a421c1678",
    "organisationId": "8e3f658d-b952-4e64-bf2b-1eb5733e5416",
    "application": "",
    "section": "",
    "fileId": "00000000-0000-0000-0000-000000000000",
    "blobName": "SIMS_5-9-2025-5-51-22-566-8cf6afc7-20c3-4b26-9727-f74500b5cf2e.zip",
    "name": "SIMS_5-9-2025-5-51-22-566-1of1.zip",
    "totalNoOfFiles": 2,
    "totalSourceFilesSize": 6480232,
    "size": 6480232,
    "status": "Initiated",
    "batchStatus": "Initiated",
    "fileExpiryDays": 4
  },
  {
    "partitionKey": "91ecb0a3-9cae-472d-9aa4-8847848aacd5",
    "rowKey": "b9673196-1ebe-47df-b761-0b67d31bee1b",
    "timestamp": "2025-09-04T15:51:15.0940255+00:00",
    "eTag": {},
    "groupBatchId": "2a2d475c-2d7f-477c-9e72-917d41fc2dd6",
    "batchId": "fc1b7132-e05a-4e69-9398-39b5384d0766",
    "shouldNotifyByEmail": true,
    "userEmailId": "Hirani@example.com",
    "userIdCreatedBy": "364d9798-1869-4661-94af-8e8a421c1678",
    "organisationId": "8e3f658d-b952-4e64-bf2b-1eb5733e5416",
    "application": "",
    "section": "",
    "fileId": "00000000-0000-0000-0000-000000000000",
    "blobName": "SIMS_4-9-2025-15-51-14-258-91ecb0a3-9cae-472d-9aa4-8847848aacd5.zip",
    "name": "SIMS_4-9-2025-15-51-14-258-1of1.zip",
    "totalNoOfFiles": 2,
    "totalSourceFilesSize": 6480232,
    "size": 6480232,
    "status": "Initiated",
    "batchStatus": "Initiated",
    "fileExpiryDays": 4
  },
  {
    "partitionKey": "974ce6a4-f45a-48bc-9e4a-83ad260f479f",
    "rowKey": "d6b29f56-ed47-47c9-9d21-79fcc59ff2d9",
    "timestamp": "2025-09-05T05:55:38.6729585+00:00",
    "eTag": {},
    "groupBatchId": "00000000-0000-0000-0000-000000000000",
    "batchId": "00000000-0000-0000-0000-000000000000",
    "shouldNotifyByEmail": false,
    "userEmailId": null,
    "userIdCreatedBy": "364d9798-1869-4661-94af-8e8a421c1678",
    "organisationId": "8e3f658d-b952-4e64-bf2b-1eb5733e5416",
    "application": "Application6",
    "section": "Section5",
    "fileId": "ebeb18e3-f3ba-4688-9d01-83594fe6238c",
    "blobName": "Application6_EBEB18E3-F3BA-4688-9D01-83594FE6238C_sample_file_5.pdf",
    "name": "sample_file_5.pdf",
    "totalNoOfFiles": 1,
    "totalSourceFilesSize": 0,
    "size": 1233244,
    "status": "Complete",
    "batchStatus": "Complete",
    "fileExpiryDays": 4
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

// Suggestion item click logic
export const handleSuggestionClick = async (
  item: ISearchItemProp | null,
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>,
  setSearchText: React.Dispatch<React.SetStateAction<string>>
) => {
  if (!item || !item.name) return;
  setSearchTerm(item.name);
  setSearchText(item.name);
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
  showErrorBanner: boolean
): string | undefined => {
  if (showErrorBanner) {
    return "Information unavailable.";
  }
  // Show search message if search is performed and no results
  if (searchText && docData?.statusCode === 200 && Array.isArray(docData?.data) && docData?.data.length === 0) {
    return `Your search - ${searchTerm} - did not match any results. Make sure that all words are spelled correctly.`;
  }
  // Show "No data to display" only if not searching and no data
  if (!searchText && docData?.statusCode === 200 && Array.isArray(docData?.data) && docData?.data.length === 0) {
    return "No data to display.";
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
            case "Document":
              text = item?.fileName || "";
              props = {
                name: item?.fileName,
                id: item?.fileId,
                ...item
              };
              break;
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
                ...item
              };
              break;
            }
            case "Organisation":
              text = item?.schoolName || item?.name || "";
              props = {
                name: text,
                id: item?.orgId,
                ...item
              };
              break;
            default:
              text = item?.name || "";
              props = {
                name: item?.name,
                id: item?.id,
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

  export const filterNonEmptySuggestions = (suggestions: Suggestion[]) =>
  suggestions.filter(s => s?.values.length > 0);

function debounce<T extends (...args: any[]) => void>(func: T, wait: number) {
  let timeout: ReturnType<typeof setTimeout>;
  return function (this: any, ...args: Parameters<T>) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
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

// function renderRelatedToItem(arg0: any) {
//   throw new Error("Function not implemented.");
// }

