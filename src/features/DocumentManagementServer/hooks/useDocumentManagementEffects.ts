import React, { useEffect } from "react";
import { Suggestion } from "@essnextgen/ui-kit";
import { applySummaryTagClass, getAllRegistrationIds } from "../logic/DocumentManagementServer.utils";
import { DocumentData, PrivateDocumentManagementServerProps } from "../responseModel";
import { fetchPrivateDocumentDetails } from "../api/ApiService";



export function useOpenSidePanelOnViewDownload(location: Location, setSidePanelOpenReason: (reason: "view" | "prepare" | null) => void, setIsSidePanelOpen: (open: boolean) => void): void {
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("isViewDownload") === "true") {
      setSidePanelOpenReason("view");
      setIsSidePanelOpen(true);
    }
  }, [location.search, setSidePanelOpenReason, setIsSidePanelOpen]);
}


export function useScrollToTopOnPageChange(currentPage: number, containerClass?: string): void {
  useEffect(() => {
    if (containerClass) {
      const container = document.querySelector(containerClass) as HTMLElement | null;
      if (container && typeof container.scrollTo === "function") {
        container.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }
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

export function useBodyNoScroll(isMobileView: boolean): void {
  useEffect(() => {
    if (!isMobileView) {
      document.body.classList.add("no-scroll");
      return () => document.body.classList.remove("no-scroll");
    }
    return () => { };
  }, [isMobileView]);
}

export function useSummaryTagMutationObserver(
  deps: any[]
): void {
  useEffect(() => {
    const tagListNode: HTMLElement | null = document.getElementById("taglist-id");
    if (!tagListNode) {
      return () => { };
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

export function useSetTotalPageOnDocData(docData: any, setTotalPage: (n: number) => void, pageSizeNumber: number): void {
  useEffect(() => {
    if (docData && docData?.totalRecords) {
      const totalPages = Math.ceil(docData.totalRecords / pageSizeNumber);
      setTotalPage(totalPages);
    }
  }, [docData, setTotalPage, pageSizeNumber]);
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
}: UseSidePanelViewDownloadEffectParams): void {
  useEffect(() => {
    // Only run when opening the side panel for "prepare"
    if (isSidePanelOpen && sidePanelOpenReason === "prepare") {
      setShowToastNotification(false);
      setIsSidePanelLoader(true);

      // Wait for 2 seconds before calling view download API
      const timer: any = setTimeout(() => {
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
  }, [isSidePanelOpen, sidePanelOpenReason]);
}

interface UseTotalSelectedCountEffectParams {
  isHeaderBoxChecked: boolean;
  excludedCheckBoxIds: string[];
  docData: DocumentData | null;
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
}: UseTotalSelectedCountEffectParams): void {
  useEffect(() => {
    const excludedCount = excludedCheckBoxIds.length || 0;
    const computedTotalSelectedCount: number = (() => {
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
    e: { target: { value: string } },
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

export function useSearchTermEffect(params: UseSearchTermEffectParams): void {
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
  }: UseSearchTermEffectParams = params;

  // Define a minimal type for your use case
  type MinimalInputChangeEvent = { target: { value: string } };

  function createInputChangeEvent(value: string): MinimalInputChangeEvent {
    return { target: { value } };
  }
  useEffect(() => {
    if (searchTerm?.length > 1 && !showSearchError && !isSearchTriggered) {
      handleSearchChange(
        t,
        createInputChangeEvent(searchTerm),
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

export function useSetFailedFileNameOnCancelled(viewData: any[], setFailedFileName: (names: string[]) => void): void {
  useEffect(() => {
    if (viewData && viewData.length > 0) {
      const cancelledFiles: any[] = viewData.filter(item => item.status?.toLowerCase() === 'cancel');
      if (cancelledFiles.length > 0) {
        setFailedFileName(cancelledFiles.map(file => file.name).filter(Boolean) as string[]);
      }
    }
  }, [viewData, setFailedFileName]);
}

interface UseApplySummaryTagClassOnDocDataChangeParams {
  selectedFormats: any[],
  isFilterDialogOpen: boolean,
  isSearchTriggered: boolean,
  searchText: string,
  currentPage: number,
  sortBy: string,
  sortDirection: string,
  searchRefExternalId: string[],
  documentRelatedTo: number,
  setIsInitialLoad: (v: boolean) => void,
  dateRange: { fromDate: any; toDate: any } | null,
  allRegistrationIds: any[],
  fetchGetDocumentDetails: (
    currentPage: number,
    registrationIds: any[],
    sortBy: string,
    sortDirection: string,
    searchRefExternalId: string[],
    documentRelatedTo: number
  ) => void
}

export function useApplySummaryTagClassOnDocDataChange(
  params: UseApplySummaryTagClassOnDocDataChangeParams
): void {
    const {
      selectedFormats,
      isFilterDialogOpen,
      isSearchTriggered,
      searchText,
      currentPage,
      sortBy,
      sortDirection,
      searchRefExternalId,
      documentRelatedTo,
      setIsInitialLoad,
      dateRange,
      allRegistrationIds,
      fetchGetDocumentDetails
    }: UseApplySummaryTagClassOnDocDataChangeParams = params;

    useEffect(() => {
      const allRegistrationId: any[] = getAllRegistrationIds(selectedFormats);
  
      if (!isFilterDialogOpen && isSearchTriggered && searchText) {
        setIsInitialLoad(true);
        fetchGetDocumentDetails(currentPage, allRegistrationId, sortBy, sortDirection, searchRefExternalId, documentRelatedTo);
  
        setIsInitialLoad(false);
      }
      if (!isFilterDialogOpen && isSearchTriggered && !searchText) {
        setIsInitialLoad(true);
        fetchGetDocumentDetails(currentPage, allRegistrationIds, sortBy, sortDirection, searchRefExternalId, documentRelatedTo)
        setIsInitialLoad(false);
      }
      applySummaryTagClass();
    }, [currentPage, searchText, dateRange?.fromDate, dateRange?.toDate, selectedFormats, sortBy, sortDirection, searchRefExternalId, documentRelatedTo, isSearchTriggered]);
  
}

export function useResetOnManagePanelOpen(
  isSidePanelOpen: boolean,
  sidePanelOpenReason: string | null,
  setSidePanelCurrentPage: (page: number) => void,
  setSidePanelRefreshKey: (updater: (prev: number) => number) => void
): void {
  useEffect(() => {
    if (isSidePanelOpen && sidePanelOpenReason === "manage") {
      setSidePanelCurrentPage(1);
      setSidePanelRefreshKey((prev: number) => prev + 1);
    }
  }, [isSidePanelOpen, sidePanelOpenReason]);
}

export function usePrivateDocumentFetchingEffect(
  props: PrivateDocumentManagementServerProps,
  setPrivateData: (data: any) => void,
  setIsPrivateDocError: (error: boolean) => void,
  setIsPrivateLoading: (loading: boolean) => void,
  setIsPrivateGridError: (error: boolean) => void
): void {
  useEffect(() => {
    const isInitialLoad = (props.refreshKey ?? 0) === 0;

    const handleError = (): void => {
      setPrivateData([]);
      setIsPrivateGridError(false);
      setIsPrivateDocError(!isInitialLoad);
    };

    async function fetchData(): Promise<void> {
      setIsPrivateLoading(true);
      try {
        const response: any = await fetchPrivateDocumentDetails(props);
        const isError = !response || (response as any)?.status === 500 || !(response as any)?.data;
        if (isError) {
          handleError();
        } else {
          setPrivateData(response);
          setIsPrivateDocError(false);
          setIsPrivateGridError(false);
        }
      } catch {
        handleError();
      } finally {
        setIsPrivateLoading(false);
      }
    }
    fetchData();
  }, [props.pageNumber, props.sortBy, props.sortDirection, props.refreshKey]);
}
  