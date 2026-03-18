import React from "react";
import dayjs from "dayjs";
import { Suggestion, ValidationTextLevel, SelectedItem, ISelectedItem, ISearchItemProp } from "@essnextgen/ui-kit";
import { TFunction } from "@essnextgen/ui-intl-kit";
import { authService, MatchPermissions } from "@essnextgen/auth-ui";
import { Category, SidePanelReason } from "../responseModel";
import { homeurl } from "../../../../public/Constants";
import { CapitalizeFirstLetter } from "../../../shared/utils/commonFunctions";

// Define types for related entities
interface RelatedPupil {
  type: "pupil";
  name: string;
  year: string;
  reg: string;
  referenceExternalId: string;
  isLeaver: string;
}

interface RelatedStaff {
  type: "staff";
  name: string;
  staffCode: string;
  referenceExternalId: string;
  isLeaver: string;
}

interface RelatedSchool {
  type: "school";
  name: string;
  referenceExternalId: string;
}

type RelatedEntity = RelatedPupil | RelatedStaff | RelatedSchool;

// Optionally, define a minimal doc type for this function

 interface RefreshAfterCloseParams {
  alreadyDeletedFileCount: number;
  restrictedFileCount: number;
  availableFileCount: number;
  totalSelectedCount: number;
  paramPage: number;
  selectedFormats: any;
  paramSortField: string;
  paramSortOrder: string;
  paramRefExternalIds: string[];
  paramRelatedTo: number;
  setSelectedCheckBoxIds: React.Dispatch<React.SetStateAction<string[]>>;
  setAllSelectedDocs: React.Dispatch<React.SetStateAction<any[]>>;
  setIsClearSelectedCheckbox: React.Dispatch<React.SetStateAction<boolean>>;
  fetchGetDocumentDetails: (
    page: number,
    registrationIds: number[],
    sortField: string,
    sortOrder: string,
    refExternalIds: string[],
    relatedTo: number
  ) => void;
  setTableKey: React.Dispatch<React.SetStateAction<number>>
}

interface DocumentRow {
  fileId: string;
  document?: string;
  category?: string;
  addedBy?: string;
  dateAdded?: string;
  format?: string;
  size?: string;
  relatedTo?: any[];
  documentRelatedTo?: number;
  registrationId?: number;
  externalId?: string;
  ngStatus: string;
}
export function mapRelatedArr(doc: DocumentRow): RelatedEntity[] {
  let relatedArr: RelatedEntity[] = [];
  if (Array.isArray(doc.relatedTo) && doc.relatedTo.length > 0) {
    if (doc.documentRelatedTo === 1) {
      // Pupils
      relatedArr = doc.relatedTo.map((pupil: any) => ({
        type: "pupil",
        name: `${pupil.preferredForename} ${pupil.preferredSurname}`.trim(),
        year: pupil.currentYearGroup || "",
        reg: pupil.currentPrimaryClass || "",
        referenceExternalId: pupil.learnerExternalId || "",
        isLeaver: pupil?.onRollState || ""
      }));
    } else if (doc.documentRelatedTo === 3) {
      // Staff
      relatedArr = doc.relatedTo.map((staff: any) => ({
        type: "staff",
        name: `${staff.preferredForename} ${staff.preferredSurname}`.trim(),
        staffCode: staff.staffCode || "",
        referenceExternalId: staff.externalId || "",
        isLeaver: staff?.onRollState || ""
      }));
    } else if (doc.documentRelatedTo === 2) {
      // School
      relatedArr = doc.relatedTo.map((school: any) => ({
        type: "school",
        name: school.schoolName || "",
        referenceExternalId: school.organisationId || ""
      }));
    }
  }
  return relatedArr;
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

export const getAllRegistrationIds: (selectedFormats: any) => any[] = (selectedFormats: any): any[] => {
  if (!Array.isArray(selectedFormats)) return [];
  return selectedFormats.flatMap(item => {
    const regId: string | string[] | undefined = item?.data?.categoryId;
    if (Array.isArray(regId)) {
      return regId;
    }
    if (regId) {
      return [regId];
    }
    return [];
  });
};


export function getCompletedPartitionKeys(viewData: Array<{ status?: string; partitionKey?: string }>): string[] {
  return viewData
    .filter(item => item.status?.toLowerCase() === 'complete')
    .map(item => item.partitionKey ?? "")
}

export const getVisibleTagsWithSummary: (tags: any[], maxVisible: number) => any[] = (tags, maxVisible = 3) => {
  if (tags.length <= maxVisible) return tags;
  const visibleTags: any[] = tags.slice(0, maxVisible);
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
      id: cat?.data?.categoryId
    }
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
      closeObj: { name: "Date", id: "dateRange" }
    }
  ];
};

interface GetResultNotFoundMsgParams {
  t: any;
  searchText: string;
  docData: any;
  searchTerm: string;
  showErrorBanner: boolean;
  isSearchTriggered: boolean;
  showSearchError: boolean;
  selectedFormats?: any[];
  dateRange?: { fromDate: string; toDate: string };
}

export const getResultNotFoundMsg: (params: GetResultNotFoundMsgParams) => string | undefined = ({
  t,
  searchText,
  docData,
  showErrorBanner,
  isSearchTriggered,
  showSearchError,
  selectedFormats = [],
  dateRange = { fromDate: "", toDate: "" }
}: GetResultNotFoundMsgParams): string | undefined => {
    if (showSearchError || showErrorBanner) {
      return "Information unavailable.";
    }
    // If any filter is applied or search is triggered, and no data, show "No data to display"
    const isFilterActive =
      (Array.isArray(selectedFormats) && selectedFormats.length > 0) ||
      (dateRange?.fromDate || dateRange?.toDate);

    if (
      (searchText || isSearchTriggered || isFilterActive) &&
      docData?.statusCode === 200 &&
      Array.isArray(docData?.data) &&
      docData?.data.length === 0
    ) {
      return t("DocumentManagementServer.noDataToDisplay");
    }
    if (!isSearchTriggered && !searchText && !isFilterActive) {
      return t("DocumentManagementServer.searchBarText");
    }
    return undefined;
  };

export const filterNonEmptySuggestions: (suggestions: Suggestion[]) => Suggestion[] = (suggestions) =>
  suggestions.filter(s => s?.values.length > 0);

// Has items check
export const hasItems: (suggestions: Suggestion[]) => boolean = (suggestions) =>
  suggestions?.some(({ values }) => values?.length > 0);

export function applySummaryTagClass(): void {
  document.querySelectorAll('#taglist-id .search-tagList').forEach(tag => {
    const span: HTMLSpanElement | null = tag.querySelector('.essui-tag span');
    if (span && span.textContent && span.textContent.trim().startsWith('+')) {
      tag.classList.add('summary-tag');
    } else {
      tag.classList.remove('summary-tag');
    }
  });
}


export function getValidationState(
  searchSelectionError: string,
  showSearchError: boolean,
  t: (key: string) => string
): { validationText: string; validationTextLevel: ValidationTextLevel | null } {
  let validationText = "";
  if (searchSelectionError) {
    validationText = searchSelectionError;
  } else if (showSearchError) {
    validationText = t("Filter.informationUnavailable");
  }

  let validationTextLevel: ValidationTextLevel | null = null;
  if (searchSelectionError) {
    validationTextLevel = ValidationTextLevel.Error;
  } else if (showSearchError) {
    validationTextLevel = ValidationTextLevel.Warning;
  } else {
    validationTextLevel = null;
  }

  return { validationText, validationTextLevel };
}

export function debounce<T extends (...args: any[]) => void>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return function (this: any, ...args: Parameters<T>): void {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}


export const getDialogTitle = (restrictedFileCount: number, alreadyDeletedFileCount: number, availableFileCount: number, totalSelectedCount: number, isHeaderBoxChecked: boolean, t: TFunction<"translation", undefined>) => {
  if (restrictedFileCount > 0) {
    return restrictedFileCount === 1
      ? t("DocumentManagementServer.documentCannotBeDeleted")
      : t("DocumentManagementServer.documentsCannotBeDeleted");
  }

  if (
    alreadyDeletedFileCount > 0 ||
    (totalSelectedCount !==
      alreadyDeletedFileCount + restrictedFileCount + availableFileCount &&
      isHeaderBoxChecked)
  ) {
    const deletedCount: number =
      totalSelectedCount >
        alreadyDeletedFileCount + restrictedFileCount + availableFileCount &&
        isHeaderBoxChecked
        ? totalSelectedCount -
        (alreadyDeletedFileCount + restrictedFileCount + availableFileCount)
        : alreadyDeletedFileCount;
    return (alreadyDeletedFileCount === 1 && availableFileCount > 0) ||
      deletedCount === 1
      ? t("DocumentManagementServer.documentAlreadyDeleted")
      : t("DocumentManagementServer.documentsAlreadyDeleted");
  }

  return "";
};


export const getEmptyStateMsg: any = (showErrorBanner: boolean, searchText: string, isSearchTriggered: boolean, showSearchError: boolean, issearchDataLoading: boolean, isSearchLoading: boolean, t: TFunction<"translation", undefined>) => {
  if (showErrorBanner || ((searchText || !isSearchTriggered) && showSearchError)) return t("DocumentManagementServer.informationUnavailable");
  if (issearchDataLoading || isSearchLoading) return undefined;

  // Initial state: no search yet
  if (!isSearchTriggered && !searchText) {
    return "Use the search bar to search pupil, staff or organisation.";
  }

  return t("DocumentManagementServer.documentsAppearAfterUploadMsg");
};







export const breadcrumbActionsList = (t: (key: string) => string) => [
  {
    active: false,
    linkName: t("DocumentManagementServer.Home"),
    path: window.location.origin
  },
  {
    active: false,
    linkName: t("DocumentManagementServer.adminconsole"),
    path: homeurl
  },
  {
    active: false,
    linkName: t("DocumentManagementServer.headingText"),
    path: ''
  }
]






function getRestrictedMessage(
  t: (key: string, options?: any) => string,
  restrictedFileCount: number,
  availableFileCount: number,
  docData: any
): string | null {
  if (restrictedFileCount > 0) {
    return restrictedFileCount === 1 && availableFileCount > 0
      ? t("DocumentManagementServer.singleDocumentCannotBeDeletedNotification", { count: restrictedFileCount })
      : t("DocumentManagementServer.documentsCannotBeDeletedNotification", {
        all: restrictedFileCount === docData?.totalRecords ? "All " : "",
        count: restrictedFileCount
      });
  }
  return null;
}

function getAlreadyDeletedMessage(
  t: (key: string, options?: any) => string,
  alreadyDeletedFileCount: number,
  docData: any
): string | null {
  if (alreadyDeletedFileCount > 0) {
    return alreadyDeletedFileCount === 1
      ? t("DocumentManagementServer.singleDocumentAlreadyDeletedMsg", { count: alreadyDeletedFileCount })
      : t("DocumentManagementServer.documentsAlreadyDeletedMsg", {
        all: alreadyDeletedFileCount === docData?.totalRecords ? t("DocumentManagementServer.All") : "",
        count: alreadyDeletedFileCount
      });
  }
  return null;
}

export function getExtraDeletedMessage(
  t: (key: string, options?: any) => string,
  docData: any,
  alreadyDeletedFileCount: number,
  restrictedFileCount: number,
  availableFileCount: number,
  excludedCheckBoxIds: any[],
  isHeaderBoxChecked: boolean
): string | null {
  const totalRecords: number = docData?.totalRecords ?? 0;
  const excludedCount = excludedCheckBoxIds?.length || 0;
  const sum = alreadyDeletedFileCount + restrictedFileCount + availableFileCount + excludedCount;

  if (totalRecords !== sum && isHeaderBoxChecked) {
    const deletedCount: number =
      totalRecords > sum && isHeaderBoxChecked
        ? totalRecords - sum
        : alreadyDeletedFileCount;

    if (deletedCount === 1) {
      return t("DocumentManagementServer.singleDocumentAlreadyDeletedMsg", { count: deletedCount });
      }
      if (deletedCount > 1) {
        return t("DocumentManagementServer.documentsAlreadyDeletedMsg", {
          all:
            alreadyDeletedFileCount === 0 &&
            restrictedFileCount === 0 &&
            availableFileCount === 0
              ? t("DocumentManagementServer.All")
              : "",
          count: deletedCount
        });
      }
  }
  return null;
}

export function getDeleteDialogMessages({
  t,
  restrictedFileCount,
  availableFileCount,
  docData,
  alreadyDeletedFileCount,
  excludedCheckBoxIds,
  isHeaderBoxChecked
}: {
  t: (key: string, options?: any) => string,
  restrictedFileCount: number,
  availableFileCount: number,
  docData: any,
  alreadyDeletedFileCount: number,
  excludedCheckBoxIds: any[],
  isHeaderBoxChecked: boolean
}): string[] {
  const messages: string[] = [];

  const restrictedMsg: string | null = getRestrictedMessage(t, restrictedFileCount, availableFileCount, docData);
  if (restrictedMsg) messages.push(restrictedMsg);

  const alreadyDeletedMsg: string | null = getAlreadyDeletedMessage(t, alreadyDeletedFileCount, docData);
  if (alreadyDeletedMsg) messages.push(alreadyDeletedMsg);

  const extraDeletedMsg: string | null = getExtraDeletedMessage(
    t,
    docData,
    alreadyDeletedFileCount,
    restrictedFileCount,
    availableFileCount,
    excludedCheckBoxIds,
    isHeaderBoxChecked
  );
  if (extraDeletedMsg) messages.push(extraDeletedMsg);

  return messages;
}

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
  const newId: string = (item as any)[idKey]?.toString().toLowerCase() ?? item.text?.toString().toLowerCase();

  const alreadyExists: boolean = tagListArray.some(
    (tag) => {
      const tagId: string = (tag as any)[idKey]?.toString().toLowerCase() ?? tag.id?.toString().toLowerCase();
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

export const hasDMSDeletePermission: () => boolean = (): boolean =>
  authService.isAuthorised(
    [{ Securable: "NG.DocumentManagementServer.Documents", Operation: "Delete" }],
    MatchPermissions.all
  );

  export const mapTableData: (docData: any, showSearchError: boolean) => any[] = (
  docData: any,
  showSearchError: boolean
): any[] => {

  if (showSearchError || !docData?.data?.length) {
    return [];
  }

  return docData.data.map((doc: DocumentRow) => ({
    id: doc?.fileId,
    Document: doc?.document,
    Relatedto: mapRelatedArr(doc) || "",
    Category: doc?.category
      ? CapitalizeFirstLetter(doc.category)
      : "",
    documentStatus: doc?.ngStatus
      ? doc.ngStatus.charAt(0).toUpperCase() + doc.ngStatus.slice(1).toLowerCase()
      : "",
    Addedby: doc?.addedBy || "",
    "Date added":
      doc?.dateAdded
        ? dayjs(doc.dateAdded).format("DD MMM YYYY")
        : "",
    Format: doc?.format,
    Size: doc?.size,
    isShowCheckBox: true
  }));
};

export function getSecondaryButtonTitle(
  sidePanelOpenReason: SidePanelReason | null,
  hasCompletedFiles: boolean,
  t: any
): string {
  if (sidePanelOpenReason === "manage") {
    return t("DocumentManagementServer.Close");
  }
  if (hasCompletedFiles) {
    return t("DocumentManagementServer.ClearAll");
  }
  return t("DocumentManagementServer.Close");
}


export const refreshAfterClose: any = (params: RefreshAfterCloseParams): void => {
  const {
    alreadyDeletedFileCount,
    restrictedFileCount,
    availableFileCount,
    totalSelectedCount,
    paramPage,
    selectedFormats,
    paramSortField,
    paramSortOrder,
    paramRefExternalIds,
    paramRelatedTo,
    setSelectedCheckBoxIds,
    setAllSelectedDocs,
    setIsClearSelectedCheckbox,
    fetchGetDocumentDetails,
    setTableKey
  }: RefreshAfterCloseParams = params;
  setSelectedCheckBoxIds([]);
  setAllSelectedDocs([]);
  setIsClearSelectedCheckbox(true);
  if (
    alreadyDeletedFileCount > 0 ||
    totalSelectedCount -
      (alreadyDeletedFileCount + restrictedFileCount + availableFileCount) >
      0
  ) {
    fetchGetDocumentDetails(
      paramPage,
      getAllRegistrationIds(
        Array.isArray(selectedFormats) ? selectedFormats : [selectedFormats]
      ),
      paramSortField,
      paramSortOrder,
      paramRefExternalIds,
      paramRelatedTo
    );
  }
  setTableKey((prev: number) => prev + 1);
};