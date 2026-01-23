import dayjs from "dayjs";
import { Category } from "./responseModel";
import { Suggestion, ValidationTextLevel } from "@essnextgen/ui-kit";

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

export const getAllRegistrationIds = (selectedFormats: any[]): any[] =>
     selectedFormats?.flatMap(item => {
        const regId = item?.data?.categoryId;
        if (Array.isArray(regId)) {
            return regId;
        }
        if (regId) {
            return [regId];
        }
        return [];
    }) || [];

export function getCompletedPartitionKeys(viewData: Array<{ status?: string; partitionKey?: string }>): string[] {
  return viewData
    .filter(item => item.status?.toLowerCase() === 'complete')
    .map(item => item.partitionKey ?? "")
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
      id: cat?.data?.categoryId,
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
  

 export const getResultNotFoundMsg = (
   t:any,
   searchText: string,
   docData: any,
   searchTerm: string,
   showErrorBanner: boolean,
   isSearchTriggered: boolean,
   showSearchError: boolean
 ): string | undefined => {
   if (showSearchError || showErrorBanner) {
     return "Information unavailable.";
   }
   // Show "No data to display" only if searching and no data
   if ((searchText || isSearchTriggered ) && docData?.statusCode === 200 && Array.isArray(docData?.data) && docData?.data.length === 0) {
     return t("DocumentManagementServer.noDataToDisplay");
   }
   if (!isSearchTriggered && !searchText) {
     return t("DocumentManagementServer.searchBarText");
   }
   return undefined;
 };
  
export const filterNonEmptySuggestions = (suggestions: Suggestion[]) =>
  suggestions.filter(s => s?.values.length > 0);

// Has items check
export const hasItems = (suggestions: Suggestion[]): boolean =>
  suggestions?.some(({ values }) => values?.length > 0);

export function applySummaryTagClass() {
  document.querySelectorAll('#taglist-id .search-tagList').forEach(tag => {
    const span = tag.querySelector('.essui-tag span');
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
) {
  let validationText = "";
  if (searchSelectionError) {
    validationText = searchSelectionError;
  } else if (showSearchError) {
    validationText = t("Filter.informationUnavailable");
  }

  let validationTextLevel: ValidationTextLevel | undefined;
  if (searchSelectionError) {
    validationTextLevel = ValidationTextLevel.Error;
  } else if (showSearchError) {
    validationTextLevel = ValidationTextLevel.Warning;
  } else {
    validationTextLevel = undefined;
  }

  return { validationText, validationTextLevel };
}

export function debounce<T extends (...args: any[]) => void>(func: T, wait: number) {
  let timeout: ReturnType<typeof setTimeout>;
  return function (this: any, ...args: Parameters<T>) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}
 