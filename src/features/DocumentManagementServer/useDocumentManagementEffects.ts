import React , { useEffect } from "react";
import { Suggestion } from "@essnextgen/ui-kit";
import { applySummaryTagClass, getAllRegistrationIds } from "./DocumentManagementServer.utils";


export function useOpenSidePanelOnViewDownload(location: Location, setSidePanelOpenReason: (reason: "view" | "prepare" | null) => void, setIsSidePanelOpen: (open: boolean) => void) {
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("isViewDownload") === "true") {
      setSidePanelOpenReason("view");
      setIsSidePanelOpen(true);
    }
  }, [location.search, setSidePanelOpenReason, setIsSidePanelOpen]);
}


export function useScrollToTopOnPageChange(currentPage: number) {
  useEffect(() => {
    let scrolled = false;
    const mainPanel = document.querySelector('.clc-dms-isopen') as HTMLElement | null;
    if (mainPanel && typeof mainPanel.scrollTo === "function" && mainPanel.offsetParent !== null) {
      mainPanel.scrollTo({ top: 0, behavior: 'smooth' });
      scrolled = true;
    }
    if (!scrolled) {
      const grid = document.querySelector('.grid-wrapper') as HTMLElement | null;
      if (grid && typeof grid.scrollIntoView === "function" && grid.offsetParent !== null) {
        grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
        scrolled = true;
      }
    }
    if (!scrolled) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentPage]);
}

export function useBodyNoScroll(isMobileView: boolean) {
  useEffect(() => {
    if (!isMobileView) {
      document.body.classList.add("no-scroll");
      return () => document.body.classList.remove("no-scroll");
    }
    return () => {};
  }, [isMobileView]);
}

export function useSummaryTagMutationObserver(
  deps: any[]
) {
  useEffect(() => {
    const tagListNode = document.getElementById("taglist-id");
    if (!tagListNode) {
      return () => {};
    }

    // Initial run
    // You may need to import applySummaryTagClass if not already
    // import { applySummaryTagClass } from "./DocumentManagementServer.utils";
    applySummaryTagClass();

    // Set up MutationObserver
    const observer = new MutationObserver(() => {
      applySummaryTagClass();
    });

    observer.observe(tagListNode, { childList: true, subtree: true });

    return () => observer.disconnect();
   
  }, deps);
}

export function useSetTotalPageOnDocData(docData: any, setTotalPage: (n: number) => void, pageSizeNumber: number) {
  useEffect(() => {
    if (docData && docData?.totalRecords) {
      const totalPages = Math.ceil(docData.totalRecords / pageSizeNumber);
      setTotalPage(totalPages);
    }
  }, [docData, setTotalPage, pageSizeNumber]);
}

interface UseFetchDocsEffectParams {
  currentPage: number;
  searchText: string;
  dateRange: { fromDate: string; toDate: string };
  selectedFormats: any[];
  sortBy: string;
  sortDirection: string;
  searchRefExternalId: string[];
  documentRelatedTo: number;
  isSearchTriggered: boolean;
  isFilterDialogOpen: boolean;
  allRegistrationIds: number[];
  fetchGetDocumentDetails: (
    page: number,
    categories: number[],
    sortByCol: string,
    sortOrder: string,
    refExternalId: string[],
    relatedTo: number
  ) => void;
  setIsInitialLoad: (v: boolean) => void;
}

export function useFetchDocsEffect({
  currentPage,
  searchText,
  dateRange,
  selectedFormats,
  sortBy,
  sortDirection,
  searchRefExternalId,
  documentRelatedTo,
  isSearchTriggered,
  isFilterDialogOpen,
  allRegistrationIds,
  fetchGetDocumentDetails,
  setIsInitialLoad,
}: UseFetchDocsEffectParams) {
  useEffect(() => {
    const allRegistrationId = getAllRegistrationIds(selectedFormats);

    if (!isFilterDialogOpen && isSearchTriggered && searchText) {
      setIsInitialLoad(true);
      fetchGetDocumentDetails(
        currentPage,
        allRegistrationId,
        sortBy,
        sortDirection,
        searchRefExternalId,
        documentRelatedTo
      );
      setIsInitialLoad(false);
    }
    if (!isFilterDialogOpen && isSearchTriggered && !searchText) {
      setIsInitialLoad(true);
      fetchGetDocumentDetails(
        currentPage,
        allRegistrationIds,
        sortBy,
        sortDirection,
        searchRefExternalId,
        documentRelatedTo
      );
      setIsInitialLoad(false);
    }
    applySummaryTagClass();
  }, [
    currentPage,
    searchText,
    dateRange?.fromDate,
    dateRange?.toDate,
    selectedFormats,
    sortBy,
    sortDirection,
    searchRefExternalId,
    documentRelatedTo,
    isSearchTriggered,
    isFilterDialogOpen,
    allRegistrationIds,
    fetchGetDocumentDetails,
    setIsInitialLoad
  ]);
}


interface UseSidePanelViewDownloadEffectParams {
  isSidePanelOpen: boolean;
  sidePanelOpenReason: "prepare" | "view" | null;
  setShowToastNotification: (v: boolean) => void;
  setIsSidePanelLoader: (v: boolean) => void;
  fetchViewDownloadData: (args: any) => void;
  setViewData: (data: any) => void;
  setHasFetchedViewDownload: (v: boolean) => void;
  viewDownload: any;
  downloadPollingIntervalRef: React.MutableRefObject<any>;
  setIsViewDownloadError: (v: boolean) => void;
  setShowEmailNotification: (v: boolean) => void;
}

export function useSidePanelViewDownloadEffect({
  isSidePanelOpen,
  sidePanelOpenReason,
  setShowToastNotification,
  setIsSidePanelLoader,
  fetchViewDownloadData,
  setViewData,
  setHasFetchedViewDownload,
  viewDownload,
  downloadPollingIntervalRef,
  setIsViewDownloadError,
  setShowEmailNotification
}: UseSidePanelViewDownloadEffectParams) {
  useEffect(() => {
    // Only run when opening the side panel for "prepare"
    if (isSidePanelOpen && sidePanelOpenReason === "prepare") {
      setShowToastNotification(false);
      setIsSidePanelLoader(true);

      // Wait for 2 seconds before calling view download API
      const timer = setTimeout(() => {
        fetchViewDownloadData({
          showLoader: false,
          setIsSidePanelLoader,
          setViewData: (data: any) => {
            setViewData(data);
            setHasFetchedViewDownload(true);
          },
          viewDownload,
          downloadPollingIntervalRef,
          setIsViewDownloadError,
          setShowEmailNotification,
        });
      }, 2000);

      return () => clearTimeout(timer);
    }
    if (isSidePanelOpen && sidePanelOpenReason === "view") {
      setShowToastNotification(false);
      setIsSidePanelLoader(true);
      fetchViewDownloadData({
        showLoader: false,
        setIsSidePanelLoader,
        setViewData: (data: any) => {
          setViewData(data);
          setHasFetchedViewDownload(true);
        },
        viewDownload,
        downloadPollingIntervalRef,
        setIsViewDownloadError,
        setShowEmailNotification
      });
    }
    return undefined;
  }, [
    isSidePanelOpen,
    sidePanelOpenReason,
    setShowToastNotification,
    setIsSidePanelLoader,
    fetchViewDownloadData,
    setViewData,
    setHasFetchedViewDownload,
    viewDownload,
    downloadPollingIntervalRef,
    setIsViewDownloadError,
    setShowEmailNotification
  ]);
}

interface UseTotalSelectedCountEffectParams {
  isHeaderBoxChecked: boolean;
  excludedCheckBoxIds: string[];
  docData: any;
  allSelectedDocs: { fileId: string; registrationId: number; externalId: string }[];
  setIsHeaderBoxChecked: (v: boolean) => void;
  setAllSelectedDocs: (v: any[]) => void;
  setExcludedCheckBoxIds: (v: string[]) => void;
  setTotalSelectedCount: (v: number) => void;
}

export function useTotalSelectedCountEffect({
  isHeaderBoxChecked,
  excludedCheckBoxIds,
  docData,
  allSelectedDocs,
  setIsHeaderBoxChecked,
  setAllSelectedDocs,
  setExcludedCheckBoxIds,
  setTotalSelectedCount
}: UseTotalSelectedCountEffectParams) {
  useEffect(() => {
    const excludedCount = excludedCheckBoxIds.length || 0;
    const computedTotalSelectedCount = (() => {
      if (!docData?.totalRecords) return 0;
      if (docData?.totalRecords === excludedCount) {
        setIsHeaderBoxChecked(false);
        setAllSelectedDocs([]);
        setExcludedCheckBoxIds([]);
        return 0;
      }
      if (isHeaderBoxChecked) return docData.totalRecords - excludedCount;
      return allSelectedDocs?.length || 0;
    })();
    setTotalSelectedCount(computedTotalSelectedCount);
  }, [
    isHeaderBoxChecked,
    excludedCheckBoxIds,
    docData,
    allSelectedDocs,
    setIsHeaderBoxChecked,
    setAllSelectedDocs,
    setExcludedCheckBoxIds,
    setTotalSelectedCount
  ]);
}

export interface UseSearchTermEffectParams {
  searchTerm: string;
  selectedFormats: any[];
  selectedDateRange: { fromDate: any; toDate: any };
  showSearchError: boolean;
  isSearchTriggered: boolean;
  handleSearchChange: (
    t: any,
    e: React.ChangeEvent<HTMLInputElement>,
    registrationIds: any,
    fromDate: any,
    toDate: any,
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>,
    setSuggestions: React.Dispatch<React.SetStateAction<Suggestion[]>>,
    setShowSearchError: React.Dispatch<React.SetStateAction<boolean>>,
    setIsSearchLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setShowErrorBanner: React.Dispatch<React.SetStateAction<boolean>>
  ) => void;
  t: any;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  setSuggestions: React.Dispatch<React.SetStateAction<Suggestion[]>>;
  setShowSearchError: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSearchLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setShowErrorBanner: React.Dispatch<React.SetStateAction<boolean>>;
}

export function useSearchTermEffect(params: UseSearchTermEffectParams) {
  const {
    searchTerm,
    selectedFormats,
    selectedDateRange,
    showSearchError,
    isSearchTriggered,
    handleSearchChange,
    t,
    setSearchTerm,
    setSuggestions,
    setShowSearchError,
    setIsSearchLoading,
    setShowErrorBanner
  } = params;

  useEffect(() => {
    if (searchTerm?.length > 1 && !showSearchError && !isSearchTriggered) {
      handleSearchChange(
        t,
        { target: { value: searchTerm } } as React.ChangeEvent<HTMLInputElement>,
        getAllRegistrationIds(selectedFormats),
        selectedDateRange?.fromDate,
        selectedDateRange?.toDate,
        setSearchTerm,
        setSuggestions,
        setShowSearchError,
        setIsSearchLoading,
        setShowErrorBanner
      );
    }
  }, [
    searchTerm,
    selectedFormats,
    selectedDateRange,
    showSearchError,
    isSearchTriggered,
    handleSearchChange,
    t,
    setSearchTerm,
    setSuggestions,
    setShowSearchError,
    setIsSearchLoading,
    setShowErrorBanner,
    getAllRegistrationIds
  ]);
}

export function useSetFailedFileNameOnCancelled(viewData: any[], setFailedFileName: (names: string[]) => void) {
  useEffect(() => {
    if (viewData && viewData.length > 0) {
      const cancelledFiles = viewData.filter(item => item.status?.toLowerCase() === 'cancel');
      if (cancelledFiles.length > 0) {
        setFailedFileName(cancelledFiles.map(file => file.name).filter(Boolean) as string[]);
      }
    }
  }, [viewData, setFailedFileName]);
}