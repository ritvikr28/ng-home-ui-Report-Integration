import React , { useState } from "react";
import { Suggestion, ISelectedItem, SelectedItem } from "@essnextgen/ui-kit";
import { useLocation } from "react-router-dom";
import {
  BreadcrumbAction,
  DateRange,
  DocumentData,
  SelectedDocument,
  SidePanelReason,
  ViewDownloadItem
} from "./responseModel";
import { breadcrumbActionsList } from "./DocumentManagementServer.utils";

export const useDocumentManagementState = (t: any) => {
    const location: Location = useLocation();
    const [dialogType, setDialogType]: [string, React.Dispatch<React.SetStateAction<string>>] = useState<string>("");
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
    // const [prevSelectedDocs, setPrevSelectedDocs]: [string[], React.Dispatch<React.SetStateAction<string[]>>] = useState<string[]>([]);
    const [isHeaderBoxChecked, setIsHeaderBoxChecked]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);
    const [viewData, setViewData]: [ViewDownloadItem[], React.Dispatch<React.SetStateAction<ViewDownloadItem[]>>] = useState<ViewDownloadItem[]>([]);
    // const [prepareDownloadError, setPrepareDownloadError]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);
    // const [PrepareDownloadAbortBanner, setPrepareDownloadAbortBanner]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);
    // const [clearAllError, setClearAllError]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);
    // const [showEmailNotification, setShowEmailNotification]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);
    // const [showToastNotification, setShowToastNotification]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);
    // const [downloadError, setDownloadError]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);
    // const [failedFileName, setFailedFileName]: [string[], React.Dispatch<React.SetStateAction<string[]>>] = useState<string[]>([]);
    const [allSelectedDocs, setAllSelectedDocs]: [SelectedDocument[], React.Dispatch<React.SetStateAction<SelectedDocument[]>>] = useState<SelectedDocument[]>([]);
    const [selectedEntities, setSelectedEntities]: [ISelectedItem[], React.Dispatch<React.SetStateAction<ISelectedItem[]>>] = useState<ISelectedItem[]>([]);
    // const [hasFetchedViewDownload, setHasFetchedViewDownload]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);
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
    // const [isViewDownloadError, setIsViewDownloadError]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);
    
    // Just for time being we are using this. Will remove later.Kiwan Fix WIP
    const setPrepareDownloadError: React.Dispatch<React.SetStateAction<boolean>> = () => {};
    const setPrepareDownloadAbortBanner: React.Dispatch<React.SetStateAction<boolean>> = () => {};
    const setClearAllError: React.Dispatch<React.SetStateAction<boolean>> = () => {};
    const setShowEmailNotification: React.Dispatch<React.SetStateAction<boolean>> = () => {};
    const setShowToastNotification: React.Dispatch<React.SetStateAction<boolean>> = () => {};
    const setFailedFileName: React.Dispatch<React.SetStateAction<string[]>> = () => {};  
    const setHasFetchedViewDownload: React.Dispatch<React.SetStateAction<boolean>> = () => {};
    const setIsViewDownloadError: React.Dispatch<React.SetStateAction<boolean>> = () => {};
    const setPrevSelectedDocs: React.Dispatch<React.SetStateAction<string[]>> = () => {};

  return {
    location,
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
    allSelectedDocs, setAllSelectedDocs,
    selectedEntities, setSelectedEntities,
    tagListArray, setTagListArray,
    viewData, setViewData,
    downloadPollingIntervalRef,
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
    // prevSelectedDocs, setPrevSelectedDocs,
    isHeaderBoxChecked, setIsHeaderBoxChecked,
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
    // prepareDownloadError, setPrepareDownloadError,
    // PrepareDownloadAbortBanner, setPrepareDownloadAbortBanner,
    // clearAllError, setClearAllError,
    // showEmailNotification, setShowEmailNotification,
    // showToastNotification, setShowToastNotification,
    // downloadError, setDownloadError,
    // failedFileName, setFailedFileName,
    // hasFetchedViewDownload, setHasFetchedViewDownload,
    // isViewDownloadError, setIsViewDownloadError,
    selectedRelatedTo, setSelectedRelatedTo,
    showDeleteErrorBanner, setShowDeleteErrorBanner ,
    setPrepareDownloadError,
    setPrepareDownloadAbortBanner,
    setClearAllError,
    setShowEmailNotification,
    setShowToastNotification,
    setFailedFileName,
    setHasFetchedViewDownload,
    setIsViewDownloadError,
    setPrevSelectedDocs,
    
  };
};
