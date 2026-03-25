import React, { useState } from "react";
import { useTranslation, UseTranslationResponse } from "@essnextgen/ui-intl-kit";
import { ISelectedItem, SelectedItem, Suggestion } from "@essnextgen/ui-kit";
import { BreadcrumbAction, DateRange, DialogType, DocumentData, SelectedDocument, SidePanelReason, ViewDownloadItem } from "../responseModel";
import { breadcrumbActionsList } from "../logic/DocumentManagementServer.utils";

export function useDocumentManagementState() {
  const { t }: UseTranslationResponse<"translation", undefined> = useTranslation();

  const [dialogType, setDialogType]: [DialogType | null, React.Dispatch<React.SetStateAction<DialogType | null>>] = useState<DialogType | null>(null);
  const [currentPage, setCurrentPage]: [number, React.Dispatch<React.SetStateAction<number>>] = useState<number>(1);
  const [totalPage, setTotalPage]: [number, React.Dispatch<React.SetStateAction<number>>] = useState<number>(0);
  const [searchInput, setSearchInput]: [string, React.Dispatch<React.SetStateAction<string>>] = useState<string>("");
  const [searchTerm, setSearchTerm]: [string, React.Dispatch<React.SetStateAction<string>>] = useState<string>("");
  const [searchText, setSearchText]: [string, React.Dispatch<React.SetStateAction<string>>] = useState<string>("");
  const [suggestions, setSuggestions]: [Suggestion[], React.Dispatch<React.SetStateAction<Suggestion[]>>] = useState<Suggestion[]>([]);
  const [isSearchLoading, setIsSearchLoading]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);
  const [isSearchTriggered, setIsSearchTriggered]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);
  const [showSearchError, setShowSearchError]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);
  const [docData, setDocData]: [DocumentData | null, React.Dispatch<React.SetStateAction<DocumentData | null>>] = useState<DocumentData | null>(null);
  const [issearchDataLoading, setIsSearchDataLoading]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);
  const [showErrorBanner, setShowErrorBanner]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);
  const [sortBy, setSortBy]: [string, React.Dispatch<React.SetStateAction<string>>] = useState<string>("DateAdded");
  const [sortDirection, setSortDirection]: [string, React.Dispatch<React.SetStateAction<string>>] = useState<string>("Desc");
  const [visibleBreadcrumbs]: [BreadcrumbAction[], React.Dispatch<React.SetStateAction<BreadcrumbAction[]>>] = useState(breadcrumbActionsList(t));
  const [dateRange, setDateRange]: [DateRange, React.Dispatch<React.SetStateAction<DateRange>>] = useState<DateRange>({ fromDate: "", toDate: "" });
  const [selectedDateRange, setSelectedDateRange]: [DateRange, React.Dispatch<React.SetStateAction<DateRange>>] = useState<DateRange>({ fromDate: "", toDate: "" });
  const [isDateError, setIsDateError]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);
  const [selectedCategories, setSelectedCategories]: [ISelectedItem[], React.Dispatch<React.SetStateAction<ISelectedItem[]>>] = useState<ISelectedItem[]>([]);
  const [selectedFormats, setSelectedFormats]: [ISelectedItem[], React.Dispatch<React.SetStateAction<ISelectedItem[]>>] = useState<ISelectedItem[]>([]);
  const [isFilterDialogOpen, setIsFilterDialogOpen]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);
  const [isFilterLoading, setIsFilterLoading]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);
  const [isClearSelectedCheckbox, setIsClearSelectedCheckbox]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);
  const [isSidePanelOpen, setIsSidePanelOpen]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);
  const [sidePanelOpenReason, setSidePanelOpenReason]: [SidePanelReason | null, React.Dispatch<React.SetStateAction<SidePanelReason | null>>] = useState<SidePanelReason | null>(null);
  const [isSidePanelLoader, setIsSidePanelLoader]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);
  const [showDialog, setShowDialog]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);
  const [showConfirmDialog, setShowConfirmDialog]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);
  const [selectedCheckBoxIds, setSelectedCheckBoxIds]: [string[], React.Dispatch<React.SetStateAction<string[]>>] = useState<string[]>([]);
  const [excludedCheckBoxIds, setExcludedCheckBoxIds]: [string[], React.Dispatch<React.SetStateAction<string[]>>] = useState<string[]>([]);
  const [prevSelectedDocs, setPrevSelectedDocs]: [string[], React.Dispatch<React.SetStateAction<string[]>>] = useState<string[]>([]);
  const [isHeaderBoxChecked, setIsHeaderBoxChecked]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);
  const [viewData, setViewData]: [ViewDownloadItem[], React.Dispatch<React.SetStateAction<ViewDownloadItem[]>>] = useState<ViewDownloadItem[]>([]);
  const [prepareDownloadError, setPrepareDownloadError]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);
  const [PrepareDownloadAbortBanner, setPrepareDownloadAbortBanner]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);
  const [clearAllError, setClearAllError]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);
  const [showEmailNotification, setShowEmailNotification]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);
  const [showToastNotification, setShowToastNotification]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);
  const [downloadError, setDownloadError]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);
  const [failedFileName, setFailedFileName]: [string[], React.Dispatch<React.SetStateAction<string[]>>] = useState<string[]>([]);
  const [allSelectedDocs, setAllSelectedDocs]: [SelectedDocument[], React.Dispatch<React.SetStateAction<SelectedDocument[]>>] = useState<SelectedDocument[]>([]);
  const [selectedEntities, setSelectedEntities]: [ISelectedItem[], React.Dispatch<React.SetStateAction<ISelectedItem[]>>] = useState<ISelectedItem[]>([]);
  const [hasFetchedViewDownload, setHasFetchedViewDownload]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);
  const [showDeleteErrorBanner, setShowDeleteErrorBanner]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);
  const downloadPollingIntervalRef: React.MutableRefObject<ReturnType<typeof setInterval> | null> = React.useRef<ReturnType<typeof setInterval> | null>(null);
  const [documentRelatedTo, setDocumentRelatedTo]: [number, React.Dispatch<React.SetStateAction<number>>] = useState<number>(0);
  const [searchRefExternalId, setSearchRefExternalId]: [string[], React.Dispatch<React.SetStateAction<string[]>>] = useState<string[]>([]);
  const [showDeleteSuccessToast, setShowDeleteSuccessToast]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);
  const [showDeleteAbortBanner, setShowDeleteAbortBanner]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);
  const [restrictedFileCount, setRestrictedFileCount]: [number, React.Dispatch<React.SetStateAction<number>>] = useState<number>(0);
  const [alreadyDeletedFileCount, setAlreadyDeletedFileCount]: [number, React.Dispatch<React.SetStateAction<number>>] = useState<number>(0);
  const [availableFileCount, setAvailableFileCount]: [number, React.Dispatch<React.SetStateAction<number>>] = useState<number>(0);
  const [availableFileIds, setAvailableFileIds]: [string[], React.Dispatch<React.SetStateAction<string[]>>] = useState<string[]>([]);
  const [showRestrictedDeleteDialog, setShowRestrictedDeleteDialog]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);
  const [showRestrictedPrepareDialog, setShowRestrictedPrepareDialog]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);
  const [isPreDialogLoading, setIsPreDialogLoading]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);
  const [isDialogLoading, setIsDialogLoading]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);
  const [isInitialLoad, setIsInitialLoad]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(true);
  const [tableKey, setTableKey]: [number, React.Dispatch<React.SetStateAction<number>>] = useState<number>(0);
  const [totalSelectedCount, setTotalSelectedCount]: [number, React.Dispatch<React.SetStateAction<number>>] = useState<number>(0);
  const [isGlobalLoaderModel, setIsGlobalLoaderModel]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);
  const [selectedRelatedTo, setSelectedRelatedTo]: [ISelectedItem | undefined, React.Dispatch<React.SetStateAction<ISelectedItem | undefined>>] = useState<ISelectedItem | undefined>(undefined);
  const [tagListArray, setTagListArray]: [SelectedItem[], React.Dispatch<React.SetStateAction<SelectedItem[]>>] = useState<SelectedItem[]>([]);
  const [isViewDownloadError, setIsViewDownloadError]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);
  const [privateData, setPrivateData]: [any, React.Dispatch<React.SetStateAction<any>>] = useState<any>(null);
  const [isPrivateDocError, setIsPrivateDocError]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);
  const [isPrivateGridError, setIsPrivateGridError]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);
  const [isPrivateLoading, setIsPrivateLoading]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);
  const [sidePanelSortBy, setSidePanelSortBy]: [string, React.Dispatch<React.SetStateAction<string>>] = useState<string>("DateAdded");
  const [sidePanelSortDirection, setSidePanelSortDirection]: [string, React.Dispatch<React.SetStateAction<string>>] = useState<string>("Desc");
  const [sidePanelCurrentPage, setSidePanelCurrentPage]: [number, React.Dispatch<React.SetStateAction<number>>] = useState<number>(1);
  const [sidePanelRefreshKey, setSidePanelRefreshKey]: [number, React.Dispatch<React.SetStateAction<number>>] = useState<number>(0);
  const [isOpen, setIsOpen]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);
  const [documentStatusIds, setDocumentStatusIds]: [number[], React.Dispatch<React.SetStateAction<number[]>>] = useState<number[]>([]);
  const [selectedPrivacyFilter, setSelectedPrivacyFilter]: [string, React.Dispatch<React.SetStateAction<string>>] = useState<string>("all");

  return {
    t,
    dialogType, setDialogType,
    currentPage, setCurrentPage,
    totalPage, setTotalPage,
    searchInput, setSearchInput,
    searchTerm, setSearchTerm,
    searchText, setSearchText,
    suggestions, setSuggestions,
    isSearchLoading, setIsSearchLoading,
    isSearchTriggered, setIsSearchTriggered,
    showSearchError, setShowSearchError,
    docData, setDocData,
    issearchDataLoading, setIsSearchDataLoading,
    showErrorBanner, setShowErrorBanner,
    sortBy, setSortBy,
    sortDirection, setSortDirection,
    visibleBreadcrumbs,
    dateRange, setDateRange,
    selectedDateRange, setSelectedDateRange,
    isDateError, setIsDateError,
    selectedCategories, setSelectedCategories,
    selectedFormats, setSelectedFormats,
    isFilterDialogOpen, setIsFilterDialogOpen,
    isFilterLoading, setIsFilterLoading,
    isClearSelectedCheckbox, setIsClearSelectedCheckbox,
    isSidePanelOpen, setIsSidePanelOpen,
    sidePanelOpenReason, setSidePanelOpenReason,
    isSidePanelLoader, setIsSidePanelLoader,
    showDialog, setShowDialog,
    showConfirmDialog, setShowConfirmDialog,
    selectedCheckBoxIds, setSelectedCheckBoxIds,
    excludedCheckBoxIds, setExcludedCheckBoxIds,
    prevSelectedDocs, setPrevSelectedDocs,
    isHeaderBoxChecked, setIsHeaderBoxChecked,
    viewData, setViewData,
    prepareDownloadError, setPrepareDownloadError,
    PrepareDownloadAbortBanner, setPrepareDownloadAbortBanner,
    clearAllError, setClearAllError,
    showEmailNotification, setShowEmailNotification,
    showToastNotification, setShowToastNotification,
    downloadError, setDownloadError,
    failedFileName, setFailedFileName,
    allSelectedDocs, setAllSelectedDocs,
    selectedEntities, setSelectedEntities,
    hasFetchedViewDownload, setHasFetchedViewDownload,
    showDeleteErrorBanner, setShowDeleteErrorBanner,
    downloadPollingIntervalRef,
    documentRelatedTo, setDocumentRelatedTo,
    searchRefExternalId, setSearchRefExternalId,
    showDeleteSuccessToast, setShowDeleteSuccessToast,
    showDeleteAbortBanner, setShowDeleteAbortBanner,
    restrictedFileCount, setRestrictedFileCount,
    alreadyDeletedFileCount, setAlreadyDeletedFileCount,
    availableFileCount, setAvailableFileCount,
    availableFileIds, setAvailableFileIds,
    showRestrictedDeleteDialog, setShowRestrictedDeleteDialog,
    showRestrictedPrepareDialog, setShowRestrictedPrepareDialog,
    isPreDialogLoading, setIsPreDialogLoading,
    isDialogLoading, setIsDialogLoading,
    isInitialLoad, setIsInitialLoad,
    tableKey, setTableKey,
    totalSelectedCount, setTotalSelectedCount,
    isGlobalLoaderModel, setIsGlobalLoaderModel,
    selectedRelatedTo, setSelectedRelatedTo,
    tagListArray, setTagListArray,
    isViewDownloadError, setIsViewDownloadError,
    privateData, setPrivateData,
    isPrivateDocError, setIsPrivateDocError,
    isPrivateGridError, setIsPrivateGridError,
    isPrivateLoading, setIsPrivateLoading,
    sidePanelSortBy, setSidePanelSortBy,
    sidePanelSortDirection, setSidePanelSortDirection,
    sidePanelCurrentPage, setSidePanelCurrentPage,
    sidePanelRefreshKey, setSidePanelRefreshKey,
    isOpen, setIsOpen,
    documentStatusIds, setDocumentStatusIds,
    selectedPrivacyFilter, setSelectedPrivacyFilter
  };
}
