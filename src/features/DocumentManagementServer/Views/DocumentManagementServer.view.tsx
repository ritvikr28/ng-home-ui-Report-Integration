import React, { useState, useEffect } from "react"
import { useLocation } from "react-router-dom";
import { useTranslation, UseTranslationResponse } from "@essnextgen/ui-intl-kit";
import { Grid, useMediaQuery, ISelectedItem, SelectedItem, Suggestion } from "@essnextgen/ui-kit"
import { buildSelectedDocs, buildValidationPayload, fetchGetDocumentDetailsLogic, fetchViewDownloadData, getTitleConfirmation, prepareDownload } from "../logic/DocumentManagementServer.logic"
import "../style.scss"
import { BreadcrumbAction, DateRange, DialogType, DocumentData, SelectedDocument, SidePanelReason, ViewDownloadItem } from "../responseModel"
import { pageSizeNumber } from "../../../../public/Constants"
import { viewDownload, clearAllFiles, deleteFiles, validation } from "../api/ApiService";
import gtmAnalytics from "../../../shared/utils/analytics";
import { handlePageChange, handleEditSelectedOverFlowMenu, handleTagCloseLogic, handleBulkDeleteLogic, handleApply, handleClearAllConfirm, closeSidePanel, handleSuggestionClick, getNotificationMsgBannerObject, handleSearchChange } from "../logic/DocumentManagementServer.handler";
import { getCategoryArr, getDateTag, getVisibleTagsWithSummary, getAllRegistrationIds, getResultNotFoundMsg, filterNonEmptySuggestions, getCompletedPartitionKeys, getDeleteDialogMessages, breadcrumbActionsList, mapTableData, mapPrivateTableData, hasDMSDeletePermission, refreshAfterClose } from "../logic/DocumentManagementServer.utils";
import { useApplySummaryTagClassOnDocDataChange, useBodyNoScroll, useOpenSidePanelOnViewDownload, usePrivateDocumentFetchingEffect, useScrollToTopOnPageChange, useSearchTermEffect, useSetFailedFileNameOnCancelled, useSetTotalPageOnDocData, useSidePanelViewDownloadEffect, useSummaryTagMutationObserver, useTotalSelectedCountEffect } from "../hooks/useDocumentManagementEffects";
import { DmsDialogs } from "../components/DocumentManagementServer.dialog";
import DmsControlledList from "../components/DocumentManagementServer.table";
import { DmsSidePanel } from "../components/DMSSidePanel/DocumentManagement.sidepanel";
import { getDialogConfig, handleOnChangeAllCheckBox, handleOnChangeCheckBox, handleSorting, handleSidePanelSorting } from "../logic/DocumentManagementServer.dialog.config";
import { DeleteSuccessToast, MainContent, SideNavigation } from "./DMSLayout";


const DocumentManagementServerView: () => JSX.Element = () => {
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
  const [privateRawData, setPrivateRawData]: [any, React.Dispatch<React.SetStateAction<any>>] = useState<any>(null);
  const [isPrivateDocError, setIsPrivateDocError]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);
  const [sidePanelSortBy, setSidePanelSortBy]: [string, React.Dispatch<React.SetStateAction<string>>] = useState<string>("DateAdded");
  const [sidePanelSortDirection, setSidePanelSortDirection]: [string, React.Dispatch<React.SetStateAction<string>>] = useState<string>("Desc");
  // const [sidePanelTableKey, setSidePanelTableKey] = useState<number>(0);
  // eslint-disable-next-line no-unused-expressions
  prevSelectedDocs

  const hasDMSDeletePermissions: boolean = hasDMSDeletePermission();

  const location: Location = useLocation();

  const categoryArr: any[] = getCategoryArr(selectedFormats);
  const dateTagArr: any[] = getDateTag(dateRange);
  const searchTagListRaw: any[] = [
    ...categoryArr,
    ...dateTagArr
  ];

  const messages: string[] = getDeleteDialogMessages({
    t, restrictedFileCount, availableFileCount, docData, alreadyDeletedFileCount, excludedCheckBoxIds, isHeaderBoxChecked
  });

  const contentText: JSX.Element = <div style={{ whiteSpace: "pre-line" }}>{messages.join("\n")}</div>;


  useOpenSidePanelOnViewDownload(location, setSidePanelOpenReason, setIsSidePanelOpen);

  const searchTagList: any[] = getVisibleTagsWithSummary(searchTagListRaw, 3);

  const allRegistrationIds: number[] = getAllRegistrationIds(selectedFormats);

 const tableData: any[] = mapTableData(docData, showSearchError);
  const privateDocData: any[] = mapPrivateTableData(privateRawData);
  

  const onPageChange: (event: unknown, page: number) => void = (event: unknown, page: number): void =>
    handlePageChange(event, page, setCurrentPage, setIsSearchDataLoading, setIsSearchTriggered);

  const fetchGetDocumentDetails: (page: number, categories: number[], sortByCol?: string, sortOrder?: string, refExternalId?: string[], relatedTo?: number) => void = (
    page: number,
    categories: number[],
    sortByCol: string = sortBy,
    sortOrder = sortDirection,
    refExternalId: string[] = searchRefExternalId,
    relatedTo: number = documentRelatedTo
  ): void => {
    fetchGetDocumentDetailsLogic({
      page, categories, sortByCol, sortOrder, dateRange, refExternalId, relatedTo, setDocData, setCurrentPage, setTotalPage, setShowSearchError,
      setIsSearchLoading, setIsSearchDataLoading, setPrepareDownloadAbortBanner, setShowDeleteAbortBanner, setShowDeleteErrorBanner, setSuggestions
    });
  };


  useSidePanelViewDownloadEffect({
    isSidePanelOpen,
    sidePanelOpenReason: sidePanelOpenReason as "prepare" | "view" | null,
    setShowToastNotification,
    setIsSidePanelLoader,
    fetchViewDownloadData,
    setViewData,
    setHasFetchedViewDownload,
    viewDownload,
    downloadPollingIntervalRef,
    setIsViewDownloadError,
    setShowEmailNotification
  });


  const onEditSelectedOverFlowMenu: (e: React.SyntheticEvent, selectedItem: ISelectedItem) => void = (e: React.SyntheticEvent, selectedItem: ISelectedItem) => {
    handleEditSelectedOverFlowMenu({
      e, selectedItem, totalSelectedCount, setShowDialog, setShowConfirmDialog, setShowRestrictedDeleteDialog, setShowRestrictedPrepareDialog, setIsPreDialogLoading, isHeaderBoxChecked, allSelectedDocs, buildValidationPayload,
      allRegistrationIds, dateRange, searchRefExternalId, documentRelatedTo, validation, setRestrictedFileCount, setAlreadyDeletedFileCount, setAvailableFileCount, setDialogType, setIsDialogLoading, setSidePanelOpenReason,
      setIsSidePanelOpen, setAvailableFileIds, setShowErrorBanner, selectedCheckBoxIds
    });
  };

  const hasCompletedFiles: boolean = viewData.some((item: ViewDownloadItem) => item.status?.toLowerCase() === 'complete');

  const handleSearchClose: () => void = () => {
    setSearchInput("");
    setSearchTerm("");
    setSearchText("");
    setIsSearchTriggered(false);
    setShowSearchError(false);
    setIsSearchLoading(false);
    setDocData(null);
    setSelectedCategories([]);
    setSelectedFormats([]);
    setDateRange({ fromDate: "", toDate: "" });
    setSelectedDateRange({ fromDate: "", toDate: "" });
    setSortBy("DateAdded");
    setSortDirection("Desc");
    setCurrentPage(1);
    setIsFilterDialogOpen(false);
    setTotalPage(0);
    setSelectedCheckBoxIds([]);
    setAllSelectedDocs([]);
    setIsClearSelectedCheckbox(true);
    setIsInitialLoad(true);
    setTableKey((prev: number) => prev + 1);
    setIsHeaderBoxChecked(false);
    setExcludedCheckBoxIds([]);
    setPrevSelectedDocs([]);
    setSelectedRelatedTo(undefined);
    setShowDeleteAbortBanner(false);
    setPrepareDownloadAbortBanner(false);
    setShowDeleteErrorBanner(false);
    setShowErrorBanner(false);
  };

  useApplySummaryTagClassOnDocDataChange({
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
    });

  useEffect(() => {
    if (isClearSelectedCheckbox) {
      setIsClearSelectedCheckbox(false);
    }
  }, [isClearSelectedCheckbox]);

  const handleTagClose: (e: React.SyntheticEvent, text: string, closeObj: { name?: string; id?: string | number }) => void = (
    e: React.SyntheticEvent,
    text: string,
    closeObj: { name?: string; id?: string | number }
  ) => {
    handleTagCloseLogic({
      event: e,
      tagName: text,
      closeObj,
      setSelectedDateRange,
      setDateRange,
      setIsDateError,
      setSelectedCategories,
      setSelectedFormats
    });
    setCurrentPage(1);
  };
  useTotalSelectedCountEffect({
    isHeaderBoxChecked,
    excludedCheckBoxIds,
    docData,
    allSelectedDocs,
    setIsHeaderBoxChecked,
    setAllSelectedDocs,
    setExcludedCheckBoxIds,
    setTotalSelectedCount
  });


  const NotificationMsgBannerObject: any = getNotificationMsgBannerObject({
    t,
    showErrorBanner,
    showSearchError,
    showDeleteErrorBanner,
    showDeleteAbortBanner,
    availableFileCount,
    setShowDeleteErrorBanner,
    setShowDeleteAbortBanner
  });
  useSearchTermEffect({
    searchTerm, selectedFormats, selectedDateRange, showSearchError, isSearchTriggered, handleSearchChange,
    t, setSearchTerm, setSuggestions, setShowSearchError, setIsSearchLoading, setShowErrorBanner
  });

  const resultNotFoundMSG: string | undefined = getResultNotFoundMsg({t, searchText, docData, searchTerm, showErrorBanner, isSearchTriggered, showSearchError, selectedFormats, dateRange});
  const filteredSuggestions: any[] = filterNonEmptySuggestions(suggestions);

  const handleBulkDelete: () => Promise<void> = () =>
    handleBulkDeleteLogic({
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
      setIsSearchDataLoading,
      availableFileIds
    });

  const handleApplyWrapper: (referenceExternalIds: string[], categories?: ISelectedItem[], selectedEntity?: any[]) => void = (referenceExternalIds: string[], categories?: ISelectedItem[], selectedEntity?: any[]) => {
    handleApply({
      referenceExternalIds, categories, selectedCategories: categories ?? [], selectedDateRange, isDateError, selectedEntity, setIsDateError, setIsFilterLoading, setDateRange, setSelectedFormats,
      setIsFilterDialogOpen, setCurrentPage, setExcludedCheckBoxIds, setAllSelectedDocs, setSearchInput, setSearchTerm, setSearchText, setTableKey, setIsSearchTriggered, setSelectedCategories, setSearchRefExternalId,
      setIsHeaderBoxChecked, setSelectedCheckBoxIds, setPrevSelectedDocs, setSelectedEntities, setSortBy, setSortDirection, setIsInitialLoad, setReferenceExternalIds: setSearchRefExternalId
    });
    setIsSearchTriggered(true);
  };

  const dialogConfig: any = getDialogConfig({
    dialogType, t, availableFileCount, docData: docData ?? undefined, isHeaderBoxChecked, setShowConfirmDialog, setClearAllError,
    handleClearAllConfirm, viewData, clearAllFiles, setShowToastNotification, fetchViewDownloadData, setIsSidePanelLoader,
    setViewData, setHasFetchedViewDownload, viewDownload, downloadPollingIntervalRef, getCompletedPartitionKeys, setIsViewDownloadError,
    setShowEmailNotification, contentText, alreadyDeletedFileCount, currentPage, getAllRegistrationIds, selectedFormats, sortBy,
    sortDirection, searchRefExternalId, documentRelatedTo, setSelectedCheckBoxIds, setAllSelectedDocs, setIsClearSelectedCheckbox,
    setIsHeaderBoxChecked, setPrevSelectedDocs, setExcludedCheckBoxIds, setTableKey, setIsDialogLoading, setIsGlobalLoaderModel,
    handleBulkDelete, setPrepareDownloadError, setPrepareDownloadAbortBanner, setSidePanelOpenReason, setIsSidePanelOpen,
    buildSelectedDocs, selectedCheckBoxIds, allSelectedDocs, dateRange, selectedEntities, prepareDownload,
    totalSelectedCount, restrictedFileCount, excludedCheckBoxIds, availableFileIds,
    fetchGetDocumentDetails, gtmAnalytics, allRegistrationIds, referenceExternalId: searchRefExternalId
  });

  const handleFilterOnClick: () => void = () => {
    setIsFilterDialogOpen(true);
    setSelectedDateRange({ fromDate: dateRange?.fromDate || "", toDate: dateRange?.toDate || "" });
    setTagListArray(tagListArray)
  };

  useSetFailedFileNameOnCancelled(viewData, setFailedFileName);

  useEffect(() => {
    gtmAnalytics.pushPageViewEvent("Admin Console");
  }, []);

  const handleCloseSidePanel: () => void = () => {
    closeSidePanel(setIsSidePanelOpen, downloadPollingIntervalRef);
  };
  const isMobileView: boolean = useMediaQuery(
    "(min-width:320px) and (max-width: 1023.9px)"
  );

  const isMobileViewSmall: boolean = useMediaQuery(
    "(min-width:400px) and (max-width: 896px)"
  );
  const [isOpen, setIsOpen]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);

  /* istanbul ignore next */
  useScrollToTopOnPageChange(currentPage);

  /* istanbul ignore next */
  useBodyNoScroll(isMobileView);

  /* istanbul ignore next */
  useSummaryTagMutationObserver([searchTagList, isMobileView, isMobileViewSmall, tableKey, searchInput, selectedCategories]);
  const handleButtonClick: () => void = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    setIsOpen(!isMobileView);
  }, [!isMobileView]);

  useSetTotalPageOnDocData(docData, setTotalPage, pageSizeNumber);

  usePrivateDocumentFetchingEffect(
    {
      pageNumber: currentPage,
      pageSize: pageSizeNumber,
      userId: "",
      sortBy: sidePanelSortBy,
      sortDirection: sidePanelSortDirection
    },
    setPrivateRawData,
    setIsPrivateDocError
  )

  const handleSidePanelSortChange: (columnName: string) => void = (columnName: string): void => {
    handleSidePanelSorting(columnName, sidePanelSortBy, setSidePanelSortBy, sidePanelSortDirection, setSidePanelSortDirection, t);
  };
  return (
    <>
      <DeleteSuccessToast
        show={showDeleteSuccessToast}
        availableFileCount={availableFileCount}
        t={t}
      />
      <Grid className="dms-layout">
        <DmsDialogs
          t={t}
          showDialog={showDialog}
          setShowDialog={setShowDialog}
          showRestrictedDeleteDialog={showRestrictedDeleteDialog}
          setShowRestrictedDeleteDialog={setShowRestrictedDeleteDialog}
          showRestrictedPrepareDialog={showRestrictedPrepareDialog}
          setShowRestrictedPrepareDialog={setShowRestrictedPrepareDialog}
          restrictedFileCount={restrictedFileCount}
          alreadyDeletedFileCount={alreadyDeletedFileCount}
          availableFileCount={availableFileCount}
          totalSelectedCount={totalSelectedCount}
          isHeaderBoxChecked={isHeaderBoxChecked}
          isPreDialogLoading={isPreDialogLoading}
          totalRecords={docData?.totalRecords || 0}
          onRefreshAfterClose={() =>
          refreshAfterClose({
            alreadyDeletedFileCount,
            restrictedFileCount,
            availableFileCount,
            totalSelectedCount,
            paramPage: currentPage,
            selectedFormats,
            paramSortField: sortBy,
            paramSortOrder: sortDirection,
            paramRefExternalIds: searchRefExternalId,
            paramRelatedTo: documentRelatedTo,
            setSelectedCheckBoxIds,
            setAllSelectedDocs,
            setIsClearSelectedCheckbox,
            fetchGetDocumentDetails,
            setTableKey
          })
        }
        />

        <SideNavigation
          isOpen={isOpen}
          isMobileView={isMobileView}
          visibleBreadcrumbs={visibleBreadcrumbs}
          handleButtonClick={handleButtonClick}
          setIsOpen={setIsOpen}
          t={t}
        />

        <MainContent
          isMobileView={isMobileView}
          isOpen={isOpen}
          visibleBreadcrumbs={visibleBreadcrumbs}
        >
          <DmsControlledList
            {...{
              t,
              tableKey,
              tableData,
              totalPage,
              currentPage,
              isInitialLoad,
              searchInput,
              setSearchInput,
              searchTerm,
              filteredSuggestions,
              isSearchLoading,
              issearchDataLoading,
              searchNoDataTemplate: "",
              showErrorBanner,
              showSearchError,
              isSearchTriggered,
              NotificationMsgBannerObject,
              resultNotFoundMSG: resultNotFoundMSG ?? "",
              searchTagListRaw,
              onPageChange,
              handleSorting: (columnName: string) => {
                handleSorting(
                  columnName,
                  sortBy,
                  setSortBy,
                  sortDirection,
                  setSortDirection,
                  t
                );
                // setIsSearchTriggered(true);
              },
              isClearSelectedCheckbox,
              setSelectedCheckBoxIds,
              setExcludedCheckBoxIds,
              onChangeAllCheckBox: (e: any) =>
                handleOnChangeAllCheckBox(
                  e,
                  setIsHeaderBoxChecked,
                  setSelectedCheckBoxIds,
                  setExcludedCheckBoxIds,
                  setPrevSelectedDocs,
                  setAllSelectedDocs
                ),
              onChangeListCheckBox: (index: number, id: string) =>
                handleOnChangeCheckBox(
                  index,
                  id,
                  docData,
                  selectedCheckBoxIds, // <-- use the current state value here!
                  setSelectedCheckBoxIds,
                  setAllSelectedDocs
                ),
              onEditSelectedOverFlowMenu,
              handleSearchClose,
              handleTagClose,
              handleSearchChange: (e: any) => {
                handleSearchChange({
                  t,
                  e,
                  categoryId: getAllRegistrationIds(selectedCategories), // <-- Use categoryId, not getAllRegistrationIds
                  fromDate: selectedDateRange?.fromDate,
                  toDate: selectedDateRange?.toDate,
                  setSearchTerm,
                  setSuggestions,
                  setShowSearchError,
                  setIsSearchLoading,
                  setShowErrorBanner,
                  documentRelatedTo: undefined,
                  setResetFilterSearch: undefined
                });
              },
              handleSuggestionClick,
              isFilterDialogOpen,
              setIsFilterDialogOpen,
              isFilterLoading,
              selectedCategories,
              setSelectedCategories,
              selectedDateRange,
              setSelectedDateRange,
              isDateError,
              setIsDateError,
              setDocumentRelatedTo,
              selectedRelatedTo,
              setSelectedRelatedTo,
              tagListArray,
              setTagListArray,
              handleApplyWrapper,
              handleFilterOnClick,
              isSidePanelOpen,
              isSidePanelLoader,
              availableFileCount,
              handleCloseSidePanel,
              isDialogLoading,
              isGlobalLoaderModel,
              getTitleConfirmation,
              dialogConfig,
              dialogType: dialogType ?? "",
              docData,
              hasDMSDeletePermissions,
              hasCompletedFiles,
              setShowConfirmDialog,
              setDialogType: (v: string) => setDialogType(v as DialogType),
              setIsSidePanelOpen,
              showConfirmDialog,
              setIsHeaderBoxChecked,
              setAllSelectedDocs,
              setTableKey,
              setIsInitialLoad,
              setSelectedFormats,
              setSelectedEntities,
              setSearchTerm,
              setSearchText,
              setSearchRefExternalId,
              setIsSearchTriggered,
              setPrevSelectedDocs,
              setIsClearSelectedCheckbox,
              searchText,
              setDateRange,
              setSortBy,
              setSortDirection,
              globalNotificationBannerOnClickAction(): void {
                setSidePanelOpenReason("manage");
                setIsSidePanelOpen(true);
              },
              sidePanelOpenReason,
              addEditTemplateChild: (
                <DmsSidePanel
                  t={t}
                  isSidePanelLoader={isSidePanelLoader}
                  hasFetchedViewDownload={hasFetchedViewDownload}
                  isViewDownloadError={isViewDownloadError}
                  viewData={viewData}
                  failedFileName={failedFileName}
                  clearAllError={clearAllError}
                  prepareDownloadError={prepareDownloadError}
                  prepareDownloadAbortBanner={PrepareDownloadAbortBanner}
                  downloadError={downloadError}
                  showEmailNotification={showEmailNotification}
                  showToastNotification={showToastNotification}
                  availableFileCount={availableFileCount}
                  setClearAllError={setClearAllError}
                  setPrepareDownloadError={setPrepareDownloadError}
                  setPrepareDownloadAbortBanner={setPrepareDownloadAbortBanner}
                  setDownloadError={setDownloadError}
                  setShowEmailNotification={setShowEmailNotification}
                  setShowToastNotification={setShowToastNotification}
                  setFailedFileName={setFailedFileName}
                  gtmAnalytics={gtmAnalytics}
                  sidePanelOpenReason={sidePanelOpenReason}
                  privateDocData={privateDocData}
                  isPrivateDocError={isPrivateDocError}
                  onSidePanelSortChange={handleSidePanelSortChange}
                  // sidePanelTableKey={sidePanelTableKey}
                />
              )
            }}
          />
        </MainContent>
      </Grid>
    </>
  );
}
export default DocumentManagementServerView
