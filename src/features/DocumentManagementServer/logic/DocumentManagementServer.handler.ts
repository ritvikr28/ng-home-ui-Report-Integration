import React from "react";
import dayjs from "dayjs";
import {
  ISearchItemProp,
  ISelectedItem,
  SelectedItem,
  Suggestion
} from "@essnextgen/ui-kit";
import {
  debouncedFetchSuggestions,
  mapToBulkDeletePayload
} from "./DocumentManagementServer.logic";
import { relatedToEnum } from "../../../../public/Constants";
import gtmAnalytics from "../../../shared/utils/analytics";
import { isValidDate } from "../../../shared/utils/commonFunctions";
import { HandleSearchChangeParams, HandleTagCloseLogicParams } from "../responseModel";

/* ------------------------------------------------------------------ */
/* Page & Search                                                       */
/* ------------------------------------------------------------------ */

export const handlePageChange: (_: unknown, page: number, setCurrentPage: React.Dispatch<React.SetStateAction<number>>, setIsSearchDataLoading: React.Dispatch<React.SetStateAction<boolean>>) => void = (
  _: unknown,
  page: number,
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>,
  setIsSearchDataLoading: React.Dispatch<React.SetStateAction<boolean>>
): void => {
  setIsSearchDataLoading(true);
  setCurrentPage(page);
};

const shouldIgnoreSearch = (value: string): boolean =>
  value.trim().length === 0 || value.length < 3;

export const handleSearchChange: (params: HandleSearchChangeParams) => void = ({
  t,
  e,
  categoryId,
  fromDate,
  toDate,
  setSearchTerm,
  setSuggestions,
  setShowSearchError,
  setIsSearchLoading,
  setShowErrorBanner,
  documentRelatedTo,
  setResetFilterSearch
}: HandleSearchChangeParams): void => {
  // Accept both event and string
  let value = "";
  if (typeof e === "string") {
    value = e;
  } else if (e && typeof e.target?.value === "string") {
    value = e.target.value;
  } else {
    if(typeof setSuggestions === "function")
    setSuggestions([]);
    if(typeof setIsSearchLoading === "function")
    setIsSearchLoading(false);
    return;
  }

  setSearchTerm(value);

  if (value.trim() && setResetFilterSearch) {
    setResetFilterSearch(true);
  }

  if (value.trim().length === 0 || value.length < 3) {
    setSuggestions([]);
    setShowSearchError(false);
    setIsSearchLoading(false);
    return;
  }

  setIsSearchLoading(true);
  setSuggestions([]);
  setShowSearchError(false);
  setShowErrorBanner(false);

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
/* ------------------------------------------------------------------ */
/* Suggestions                                                         */
/* ------------------------------------------------------------------ */

const getReferenceExternalId: (item: ISearchItemProp) => string[] = (item: ISearchItemProp): string[] => {
  switch (item.categoryName) {
    case "Pupil":
      return [item.learnerExternalId];
    case "Staff":
      return [item.externalId];
    case "Organisation":
      return [item.organisationId];
    default:
      return [];
  }
};

export const handleSuggestionClick: (item: ISearchItemProp | null, setSearchTerm: React.Dispatch<React.SetStateAction<string>>, setSearchText: React.Dispatch<React.SetStateAction<string>>, setDocumentRelatedTo: React.Dispatch<React.SetStateAction<number>>, setSearchRefExternalId: React.Dispatch<React.SetStateAction<string[]>>) => Promise<void> = async (
  item: ISearchItemProp | null,
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>,
  setSearchText: React.Dispatch<React.SetStateAction<string>>,
  setDocumentRelatedTo: React.Dispatch<React.SetStateAction<number>>,
  setSearchRefExternalId: React.Dispatch<React.SetStateAction<string[]>>
): Promise<void> => {
  if (!item?.name) return;

  setSearchTerm(item.name);
  setSearchText(item.name);
  setDocumentRelatedTo(
    relatedToEnum[item.categoryName as keyof typeof relatedToEnum] || 0
  );
  setSearchRefExternalId(getReferenceExternalId(item));

  gtmAnalytics.pushEvent({
    event: "interact_click",
    elementType: "search_option",
    elementTextOrLabel:
      item.categoryName === "Organisation" ? "School" : item.categoryName,
    elementLocation: "search_suggestions"
  });
};

/* ------------------------------------------------------------------ */
/* Tags                                                                */
/* ------------------------------------------------------------------ */

const isDateRangeTag = (name?: string, id?: string | number): boolean =>
  id === "dateRange" ||
  !!name?.match(
    /^\d{2} \w{3} \d{4} to (-|\d{2} \w{3} \d{4})$/
  );

export const handleTagCloseLogic: (params: HandleTagCloseLogicParams) => void = ({
  event,
  tagName,
  closeObj,
  setSelectedDateRange,
  setDateRange,
  setIsDateError,
  setSelectedCategories,
  setSelectedFormats
}: HandleTagCloseLogicParams): void => {
  if (isDateRangeTag(closeObj.name, closeObj.id)) {
    setSelectedDateRange({ fromDate: "", toDate: "" });
    setDateRange({ fromDate: "", toDate: "" });
    setIsDateError(false);
  }

  setSelectedCategories(prev =>
    prev.filter(i => i.text !== closeObj.name && i.data !== closeObj.name)
  );
  setSelectedFormats(prev =>
    prev.filter(i => i.text !== closeObj.name && i.data !== closeObj.name)
  );
};

/* ------------------------------------------------------------------ */
/* Filter Validation                                                   */
/* ------------------------------------------------------------------ */

const isInvalidDateRange = (
  from?: string,
  to?: string
): boolean => {
  const fromInvalid = typeof from === "string" && from !== "" && (!isValidDate(from) || !dayjs(from).isValid());
  const toInvalid = typeof to === "string" && to !== "" && (!isValidDate(to) || !dayjs(to).isValid());
  return !!fromInvalid || !!toInvalid;
};

export const validateAndApplyFilter: (selectedDateRange: { fromDate: string; toDate: string }, isDateError: boolean, setIsDateError: React.Dispatch<React.SetStateAction<boolean>>, setIsFilterLoading: React.Dispatch<React.SetStateAction<boolean>>, setDateRange: React.Dispatch<React.SetStateAction<{ fromDate: string; toDate: string }>>) => void = ({
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
}: any): void => {
  if (isDateError || isInvalidDateRange(
    selectedDateRange?.fromDate,
    selectedDateRange?.toDate
  )) {
    setIsDateError(true);
    return;
  }

  setIsFilterLoading(true);
  setDateRange({
    fromDate: selectedDateRange?.fromDate ?? "",
    toDate: selectedDateRange?.toDate ?? ""
  });
  setSelectedFormats(selectedCategories);
  setReferenceExternalIds(referenceExternalIds ?? []);
  setIsFilterDialogOpen(false);
  setIsFilterLoading(false);

  setCurrentPage(1);
  setExcludedCheckBoxIds([]);
  setAllSelectedDocs([]);
  setIsHeaderBoxChecked(false);
  setSelectedCheckBoxIds([]);
  setPrevSelectedDocs([]);
};

/* ------------------------------------------------------------------ */
/* Bulk Delete                                                         */
/* ------------------------------------------------------------------ */

export const handleBulkDeleteLogic: (allSelectedDocs: any[], docData: any, allRegistrationIds: any[], dateRange: any, searchRefExternalId: any) => Promise<void> = async ({
  allSelectedDocs,
  docData,
  allRegistrationIds,
  dateRange,
  searchRefExternalId,
  documentRelatedTo,
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
}: any): Promise<void> => {
  setShowDeleteSuccessToast(false);
  setIsSearchDataLoading(true);
  setShowDeleteAbortBanner(false);

  const payload: any = mapToBulkDeletePayload({
    isSelectAll: isHeaderBoxChecked,
    categoryIds: allRegistrationIds,
    fromDate: dateRange.fromDate,
    toDate: dateRange.toDate,
    referenceExternalIds: searchRefExternalId,
    documentRelatedTo,
    fileDetails: isHeaderBoxChecked
      ? []
      : allSelectedDocs.filter((d: { fileId: any; }) => availableFileIds.includes(d.fileId)),
    excludedFileDetails:
      isHeaderBoxChecked && excludedCheckBoxIds.length
        ? excludedCheckBoxIds.map((id: any) => ({ fileId: id }))
        : []
  });

  try {
    const status: number = await deleteFiles(payload);

    if (status === 204) {
      setShowToastNotification(true);
      setShowConfirmDialog(false);
      setSelectedCheckBoxIds([]);
      setAllSelectedDocs([]);
      setIsClearSelectedCheckbox(true);
      setShowDeleteSuccessToast(true);
      fetchGetDocumentDetails(currentPage, allRegistrationIds, sortBy, sortDirection);
      return;
    }

    setShowDeleteAbortBanner(status === 409);
    setShowDeleteErrorBanner(status !== 409);
  } catch {
    setShowDeleteErrorBanner(true);
  } finally {
    setIsSearchDataLoading(false);
  }
};

function isPrepareDownloadRestricted(available: number, alreadyDeleted: number, totalSelectedCount: number, restricted: number): boolean {
  return (
    (available === 0 && alreadyDeleted > 0) ||
    (totalSelectedCount > 0 && available === 0 && alreadyDeleted === 0 && restricted === 0)
  );
}

function isDeleteRestricted(available: number, restricted: number, alreadyDeleted: number, totalSelectedCount: number): boolean {
  return (
    available === 0 &&
    ((restricted > 0 || alreadyDeleted > 0) ||
      (totalSelectedCount > 0 && alreadyDeleted === 0 && restricted === 0))
  );
}

function isDeleteAvailable(available: number): boolean {
  return available > 0;
}

interface ValidationResultHandlers {
  setIsPreDialogLoading: (v: boolean) => void;
  setShowRestrictedDeleteDialog: (v: boolean) => void;
  setShowDialog: (v: boolean) => void;
  setShowErrorBanner: (v: boolean) => void;
  setRestrictedFileCount: (v: number) => void;
  setAlreadyDeletedFileCount: (v: number) => void;
  setAvailableFileCount: (v: number) => void;
  setAvailableFileIds: (v: string[]) => void;
  setDialogType: (v: string) => void;
  setIsDialogLoading: (v: boolean) => void;
  setShowConfirmDialog: (v: boolean) => void;
  setShowRestrictedPrepareDialog: (v: boolean) => void;
}
function handleValidationResult(
  result: any,
  selectedItem: ISelectedItem,
  totalSelectedCount: number,
  handlers: ValidationResultHandlers
): void {
  const {
    setIsPreDialogLoading,
    setShowRestrictedDeleteDialog,
    setShowDialog,
    setShowErrorBanner,
    setRestrictedFileCount,
    setAlreadyDeletedFileCount,
    setAvailableFileCount,
    setAvailableFileIds,
    setDialogType,
    setIsDialogLoading,
    setShowConfirmDialog,
    setShowRestrictedPrepareDialog
  } : ValidationResultHandlers = handlers; {
  if (result?.status !== 200 && result?.status !== 204) {
    setIsPreDialogLoading(false);
    setShowRestrictedDeleteDialog(false);
    setShowDialog(false);
    setShowErrorBanner(true);
    gtmAnalytics.pushEvent({
      event: "error_message",
      messageText: "Information unavailable"
    });
    return;
  }
  }

  const restricted: number = result?.data?.restrictedFileCount ?? 0;
  const alreadyDeleted: number = result?.data?.alreadyDeletedFileCount ?? 0;
  const available: number = result?.data?.availableFileCount ?? 0;
  const availableFileIds: string[] = result?.data?.availableFileIds ?? [];

  setRestrictedFileCount(restricted);
  setAlreadyDeletedFileCount(alreadyDeleted);
  setAvailableFileCount(available);
  setAvailableFileIds(availableFileIds);

  setDialogType(selectedItem.value === "Prepare download" ? "prepareDownload" : "delete");
  setIsPreDialogLoading(false);
  setShowRestrictedDeleteDialog(false);

  if (selectedItem.value === "Prepare download" && isPrepareDownloadRestricted(available, alreadyDeleted, totalSelectedCount, restricted)) {
    setShowRestrictedPrepareDialog(true);
    setShowConfirmDialog(false);
    return;
  }

  if (selectedItem.value === "Delete") {
    if (isDeleteRestricted(available, restricted, alreadyDeleted, totalSelectedCount)) {
      setIsDialogLoading(false);
      setShowRestrictedDeleteDialog(true);
      setShowConfirmDialog(false);
      return;
    }
    if (isDeleteAvailable(available)) {
      setIsDialogLoading(false);
      setShowConfirmDialog(true);
      setShowRestrictedDeleteDialog(false);
      return;
    }
  }

  setShowConfirmDialog(true);
}

export const handleEditSelectedOverFlowMenu: any = async ({
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
  documentRelatedTo,
  validation,
  setRestrictedFileCount,
  setAlreadyDeletedFileCount,
  setAvailableFileCount,
  setDialogType,
  setIsDialogLoading,
  setSidePanelOpenReason,
  setIsSidePanelOpen,
  setAvailableFileIds,
  setShowErrorBanner
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
  documentRelatedTo: number,
  validation: (payload: any) => Promise<any>,
  setRestrictedFileCount: (v: number) => void,
  setAlreadyDeletedFileCount: (v: number) => void,
  setAvailableFileCount: (v: number) => void,
  setDialogType: (v: string) => void,
  setIsDialogLoading: (v: boolean) => void,
  setSidePanelOpenReason: React.Dispatch<React.SetStateAction<"view" | "prepare" | null>>,
  setIsSidePanelOpen: (v: boolean) => void,
  setAvailableFileIds: (v: string[]) => void,
  setShowErrorBanner: (v: boolean) => void,
}) => {
  setShowConfirmDialog(false);
  setShowRestrictedDeleteDialog(false);
  setShowRestrictedPrepareDialog(false);
  setShowErrorBanner(false);

  if (selectedItem.value === "Prepare download" || selectedItem.value === "Delete") {
    if (totalSelectedCount === 0) {
      setShowDialog(true);
    } else {
      setShowRestrictedDeleteDialog(true);
      setIsPreDialogLoading(true);
      const excludedFileDetails: any[] = isHeaderBoxChecked ? allSelectedDocs : [];
      const fileDetails: any[] = isHeaderBoxChecked ? [] : allSelectedDocs || [];
      const validationPayload: any = buildValidationPayloadFn({
        isSelectAll: !!isHeaderBoxChecked,
        userActivity: selectedItem.value === "Prepare download" ? "PrepareDownload" : "BulkDelete",
        categoryIds: allRegistrationIds,
        fromDate: dateRange.fromDate,
        toDate: dateRange.toDate,
        referenceExternalIds: searchRefExternalId,
        documentRelatedTo,
        fileDetails,
        excludedFileDetails
      });

      const result: any = await validation(validationPayload);

      handleValidationResult(
        result,
        selectedItem,
        totalSelectedCount,
        {
          setIsPreDialogLoading,
          setShowRestrictedDeleteDialog,
          setShowDialog,
          setShowErrorBanner,
          setRestrictedFileCount,
          setAlreadyDeletedFileCount,
          setAvailableFileCount,
          setAvailableFileIds,
          setDialogType,
          setIsDialogLoading,
          setShowConfirmDialog,
          setShowRestrictedPrepareDialog
        }
      );
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


export async function handleClearAllConfirm({ viewData: clearAllViewData, clearAllFiles, setShowToastNotification, fetchViewDownloadData: clearAllFetchViewDownloadData, setIsSidePanelLoader, setViewData, viewDownload: clearAllViewDownload, downloadPollingIntervalRef: clearAllDownloadPollingIntervalRef, setClearAllError, setShowConfirmDialog, getCompletedPartitionKeys: clearAllGetCompletedPartitionKeys, setIsViewDownloadError, setShowEmailNotification }: { viewData: any[], clearAllFiles: (payload: { request: { partitionKey: string[] } }) => Promise<number>, setShowToastNotification: (v: boolean) => void, fetchViewDownloadData: (args: any) => void, setIsSidePanelLoader: (v: boolean) => void, setViewData: (v: any) => void, setHasFetchedViewDownload: (v: boolean) => void, viewDownload: any, downloadPollingIntervalRef: any, setClearAllError: (v: boolean) => void, setShowConfirmDialog: (v: boolean) => void, getCompletedPartitionKeys: (viewData: any[]) => string[], setIsViewDownloadError: (v: boolean) => void, setShowEmailNotification: (v: boolean) => void }): Promise<void> { const completedPartitionKeys: string[] = clearAllGetCompletedPartitionKeys(clearAllViewData); setIsSidePanelLoader(true); try { const response: number = await clearAllFiles({ request: { partitionKey: completedPartitionKeys } }); if (response === 204) { setViewData([]); setShowToastNotification(true); await clearAllFetchViewDownloadData({ showLoader: false, setIsSidePanelLoader, setViewData, viewDownload: clearAllViewDownload, downloadPollingIntervalRef: clearAllDownloadPollingIntervalRef, setIsViewDownloadError, setShowEmailNotification }); setIsSidePanelLoader(false); } else { setClearAllError(true); setIsSidePanelLoader(false); gtmAnalytics.pushEvent({ event: "error_message", messageText: "Unable to clear downloads" }); } } catch (error) { setClearAllError(true); setShowToastNotification(false); setIsSidePanelLoader(false); gtmAnalytics.pushEvent({ event: "error_message", messageText: "Unable to clear downloads" }); } setShowConfirmDialog(false); }

export function handleApply({
  referenceExternalIds,
  selectedCategories,
  selectedDateRange,
  isDateError,
  setIsDateError,
  setIsFilterLoading,
  setDateRange,
  setIsFilterDialogOpen,
  setCurrentPage,
  setExcludedCheckBoxIds,
  setAllSelectedDocs,
  setSelectedFormats,
  setIsHeaderBoxChecked,
  setSelectedCheckBoxIds,
  setPrevSelectedDocs,
  setReferenceExternalIds
}: {
  referenceExternalIds: string[],
  categories?: any[],
  selectedCategories: ISelectedItem[],
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
  setSelectedEntities: (v: any[]) => void,
  setSortBy: (v: string) => void,
  setSortDirection: (v: "Asc" | "Desc") => void,
  setIsInitialLoad: (v: boolean) => void,
  setReferenceExternalIds: (v: string[]) => void
}): void {
  if (
    isDateError ||
    isInvalidDateRange(
      selectedDateRange?.fromDate,
      selectedDateRange?.toDate
    )
  ) {
    setIsDateError(true);
    return;
  }

  setIsFilterLoading(true);

  setDateRange({
    fromDate: selectedDateRange?.fromDate ?? "",
    toDate: selectedDateRange?.toDate ?? ""
  });

  setSelectedFormats(selectedCategories);
  setReferenceExternalIds(referenceExternalIds ?? []);

  setIsFilterDialogOpen(false);
  setIsFilterLoading(false);

  setCurrentPage(1);
  setExcludedCheckBoxIds([]);
  setAllSelectedDocs([]);
  setIsHeaderBoxChecked(false);
  setSelectedCheckBoxIds([]);
  setPrevSelectedDocs([]);
};

export function closeSidePanel( setIsSidePanelOpen: (v: boolean) => void, downloadPollingIntervalRef: React.MutableRefObject<ReturnType<typeof setInterval> | null> ): void { setIsSidePanelOpen(false); if (downloadPollingIntervalRef.current) { clearInterval(downloadPollingIntervalRef.current); 
  // eslint-disable-next-line 
downloadPollingIntervalRef.current = null; } }

interface NotificationMsgBannerParams {
  t: (key: string, options?: any) => string;
  showErrorBanner: boolean;
  showSearchError: boolean;
  showDeleteErrorBanner: boolean;
  showDeleteAbortBanner: boolean;
  availableFileCount: number;
  setShowDeleteErrorBanner: (v: boolean) => void;
  setShowDeleteAbortBanner: (v: boolean) => void;
}

interface NotificationMsgBanner {
  isShow: boolean;
  variant: string;
  title: string;
  message: string;
  autoclose: boolean;
  onClickClose?: () => void;
}


export function getNotificationMsgBannerObject(params: NotificationMsgBannerParams): NotificationMsgBanner[] {
  const {
    t,
    showErrorBanner,
    showSearchError,
    showDeleteErrorBanner,
    showDeleteAbortBanner,
    availableFileCount,
    setShowDeleteErrorBanner,
    setShowDeleteAbortBanner
  }: NotificationMsgBannerParams = params;
  return [ 
    { 
      isShow: showErrorBanner || showSearchError, 
      variant: "warning", 
      title: t("DocumentManagementServer.informationUnavailable"), 
      message: t("DocumentManagementServer.technicalIssueMessage"), 
      autoclose: true }, 
      { isShow: showDeleteErrorBanner, 
        variant: "warning", 
        title: t("DocumentManagementServer.unableToDelete"), 
        message: t("DocumentManagementServer.unableToDeleteDocumentMsg", 
          { type: availableFileCount === 1 ? "document" : "documents" }), 
          autoclose: false, 
          onClickClose: () => setShowDeleteErrorBanner(false) }, 
          { isShow: showDeleteAbortBanner, 
            variant: "warning", 
            title: t("DocumentManagementServer.unableToDelete"), 
            message: t("DocumentManagementServer.oneOrMoreSelectedDocumentsCannotBeDeleted"), 
            autoclose: true, onClickClose: () => setShowDeleteAbortBanner(false) } ]; }

