import React from "react";
import dayjs from "dayjs";
import { ISearchItemProp, ISelectedItem, SelectedItem, Suggestion } from "@essnextgen/ui-kit";
import { debouncedFetchSuggestions, mapToBulkDeletePayload } from "./DocumentManagementServer.logic";
import { relatedToEnum } from "../../../public/Constants";
import gtmAnalytics from "../../shared/utils/analytics";
import { isValidDate } from "../../shared/utils/commonFunctions";

export const handlePageChange = (
  _event: any,
  page: number,
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>,
  setIsSearchDataLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  setIsSearchDataLoading(true);
  setCurrentPage(page);
};

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
  setSortBy,
  setSortDirection,
  setIsInitialLoad
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
  setSelectedEntities: (v: any[]) => void,
  setSortBy: (v: string) => void,
  setSortDirection: (v: "Asc" | "Desc") => void,
  setIsInitialLoad: (v: boolean) => void
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
    setSortBy("DateAdded");
    setSortDirection("Desc");
    setIsInitialLoad(true);
  }
  if (setSelectedEntities) {
    setSelectedEntities(selectedEntity || []);
  }
  setIsSearchTriggered(true);
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

export const handleBulkDeleteLogic = async ({
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
}: {
  allSelectedDocs: { fileId: string; registrationId: number, externalId: string }[],
  docData: any,
  allRegistrationIds: any[],
  dateRange: { fromDate: string; toDate: string },
  searchRefExternalId: string[],
  documentRelatedTo: number,
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
    documentRelatedTo,
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
    fetchGetDocumentDetails(currentPage, allRegistrationIds, sortBy, sortDirection);
  
    } 
    else if (status === 409) {
      setShowDeleteAbortBanner(true);
      setIsSearchDataLoading(false);
      gtmAnalytics.pushEvent({
        event: "error_message",
        messageText: "Unable to delete"
      });
    } else {
      setShowDeleteErrorBanner(true);
      setIsSearchDataLoading(false);
      gtmAnalytics.pushEvent({
        event: "error_message",
        messageText: "Unable to delete"
      });
    }
  } catch (err) {
    setShowDeleteErrorBanner(true);
    setIsSearchDataLoading(false);
    gtmAnalytics.pushEvent({
      event: "error_message",
      messageText: "Unable to delete"
    });
  }
};


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
  setShowErrorBanner,
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
      const excludedFileDetails = isHeaderBoxChecked ? allSelectedDocs : [];
      const fileDetails = isHeaderBoxChecked ? [] : allSelectedDocs || [];
      const validationPayload = buildValidationPayloadFn({
        isSelectAll: !!isHeaderBoxChecked,
        userActivity: selectedItem.value === "Prepare download" ? "PrepareDownload" : "BulkDelete",
        categoryIds: allRegistrationIds,
        fromDate: dateRange.fromDate,
        toDate: dateRange.toDate,
        referenceExternalIds: searchRefExternalId,
        documentRelatedTo,
        fileDetails,
        excludedFileDetails,
      });

      const result = await validation(validationPayload);
      if (result?.status !== 200 && result?.status !== 204) {
        setIsPreDialogLoading(false);
        setShowRestrictedDeleteDialog(false);
        setShowDialog(false);
        setShowErrorBanner(true);
        gtmAnalytics.pushEvent({
          event: "error_message",
          messageText: "Information unavailable"
        });
      } else {
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
          selectedItem.value === "Prepare download" && (
            (available === 0 && alreadyDeleted > 0)
            || (totalSelectedCount > 0 && available === 0 && alreadyDeleted === 0 && restricted === 0)
          )
        ) {
          setShowRestrictedPrepareDialog(true);
          setShowConfirmDialog(false);
          return;
        }

        if (selectedItem.value === "Delete") {
          if (available === 0 && ((restricted > 0 || alreadyDeleted > 0) || (totalSelectedCount > 0 && alreadyDeleted === 0 && restricted === 0))) {
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
  setIsViewDownloadError,
  setShowEmailNotification
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
  setShowEmailNotification: (v: boolean) => void
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
        setShowEmailNotification
      });
      setIsSidePanelLoader(false);
    } else {
      setClearAllError(true);
      setIsSidePanelLoader(false);
      gtmAnalytics.pushEvent({
      event: "error_message",
      messageText: "Unable to clear downloads"
    });
    }
  } catch (error) {
    setClearAllError(true);
    setShowToastNotification(false);
    setIsSidePanelLoader(false);
    gtmAnalytics.pushEvent({
      event: "error_message",
      messageText: "Unable to clear downloads"
    });
  }
  setShowConfirmDialog(false);
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

export function getNotificationMsgBannerObject(
  t: (key: string, options?: any) => string,
  showErrorBanner: boolean,
  showSearchError: boolean,
  showDeleteErrorBanner: boolean,
  showDeleteAbortBanner: boolean,
  availableFileCount: number,
  setShowDeleteErrorBanner: (v: boolean) => void,
  setShowDeleteAbortBanner: (v: boolean) => void
) {
  return [
    {
      isShow: showErrorBanner || showSearchError,
      variant: "warning",
      title: t("DocumentManagementServer.informationUnavailable"),
      message: t("DocumentManagementServer.technicalIssueMessage"),
      autoclose: true
    },
    {
      isShow: showDeleteErrorBanner,
      variant: "warning",
      title: t("DocumentManagementServer.unableToDelete"),
      message: t("DocumentManagementServer.unableToDeleteDocumentMsg", {
        type: availableFileCount === 1 ? "document" : "documents"
      }),
      autoclose: false,
      onClickClose: () => setShowDeleteErrorBanner(false)
    },
    {
      isShow: showDeleteAbortBanner,
      variant: "warning",
      title: t("DocumentManagementServer.unableToDelete"),
      message: t("DocumentManagementServer.oneOrMoreSelectedDocumentsCannotBeDeleted"),
      autoclose: true,
      onClickClose: () => setShowDeleteAbortBanner(false)
    }
  ];
}

export async function handlePrepareDownload({
  selectedDocs,
  prepareDownload,
  setPrepareDownloadAbortBanner,
  setPrepareDownloadError,
  setShowEmailNotification,
  setIsSidePanelLoader,
  totalSelectedCount,
}: {
  selectedDocs: any[];
  prepareDownload: (docs: any[]) => Promise<number[]>;
  setPrepareDownloadAbortBanner: (v: boolean) => void;
  setPrepareDownloadError: (v: boolean) => void;
  setShowEmailNotification: (v: boolean) => void;
  setIsSidePanelLoader: (v: boolean) => void;
  totalSelectedCount: number;
}) {
  try {
    const statuses = await prepareDownload(selectedDocs);
    gtmAnalytics.pushEvent({
      event: "key_action",
      actionType: "prepare_download",
    });
    setPrepareDownloadAbortBanner(false);
    if (statuses.some((status: number) => status !== 204 && status !== 409)) {
      setPrepareDownloadError(true);
      gtmAnalytics.pushEvent({
        event: "error_message",
        messageText: "Unable to prepare for download",
      });
    } else if (statuses.some((status: number) => status === 409)) {
      setPrepareDownloadAbortBanner(true);
      gtmAnalytics.pushEvent({
        event: "error_message",
        messageText: "Unable to prepare for download",
      });
    } else if (totalSelectedCount > 1) {
      setShowEmailNotification(true);
    }
  } catch {
    setIsSidePanelLoader(false);
    setPrepareDownloadError(true);
    setPrepareDownloadAbortBanner(false);
    gtmAnalytics.pushEvent({
      event: "error_message",
      messageText: "Unable to prepare for download",
    });
  }
}

