import React, { useEffect } from "react"
import { useLocation } from "react-router-dom";
import { Grid, useMediaQuery, ISelectedItem } from "@essnextgen/ui-kit"
import { buildSelectedDocs, buildValidationPayload, fetchGetDocumentDetailsLogic, fetchViewDownloadData, getTitleConfirmation, prepareDownload } from "../logic/DocumentManagementServer.logic"
import "../style.scss"
import { pageSizeNumber } from "../../../../public/Constants"
import { viewDownload, clearAllFiles, deleteFiles, validation } from "../api/ApiService";
import gtmAnalytics from "../../../shared/utils/analytics";
import { handlePageChange, handleEditSelectedOverFlowMenu, handleTagCloseLogic, handleBulkDeleteLogic, handleApply, handleClearAllConfirm, closeSidePanel, handleSuggestionClick, getNotificationMsgBannerObject, handleSearchChange } from "../logic/DocumentManagementServer.handler";
import { getCategoryArr, getDateTag, getVisibleTagsWithSummary, getAllRegistrationIds, getResultNotFoundMsg, filterNonEmptySuggestions, getCompletedPartitionKeys, getDeleteDialogMessages, mapTableData, mapPrivateTableData, hasDMSDeletePermission, refreshAfterClose } from "../logic/DocumentManagementServer.utils";
import { useApplySummaryTagClassOnDocDataChange, useBodyNoScroll, useOpenSidePanelOnViewDownload, usePrivateDocumentFetchingEffect, useResetOnManagePanelOpen, useScrollToTopOnPageChange, useSearchTermEffect, useSetFailedFileNameOnCancelled, useSetTotalPageOnDocData, useSidePanelViewDownloadEffect, useSummaryTagMutationObserver, useTotalSelectedCountEffect } from "../hooks/useDocumentManagementEffects";
import { DmsDialogs } from "../components/DocumentManagementServer.dialog";
import DmsControlledList from "../components/DocumentManagementServer.table";
import { DmsSidePanel } from "../components/DMSSidePanel/DocumentManagement.sidepanel";
import { getDialogConfig, handleOnChangeAllCheckBox, handleOnChangeCheckBox, handleSorting } from "../logic/DocumentManagementServer.dialog.config";
import { DeleteSuccessToast, MainContent, SideNavigation } from "./DMSLayout";
import { useDocumentManagementState } from "../hooks/useDocumentManagementState";
import { DialogType, ViewDownloadItem } from "../responseModel";

const DocumentManagementServerView: () => JSX.Element = () => {
  const {
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
    setPrevSelectedDocs,
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
  }: ReturnType<typeof useDocumentManagementState> = useDocumentManagementState();

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
  const privateDocData: any[] = mapPrivateTableData(privateData);
  

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
      page, categories, sortByCol, sortOrder, dateRange, refExternalId, relatedTo, documentStatusIds, setDocData, setCurrentPage, setTotalPage, setShowSearchError,
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
    setShowDeleteAbortBanner,
    privateData,
    isPrivateDocError,
    isPrivateGridError,
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
      documentStatusIds,
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

  const handleApplyWrapper: (referenceExternalIds: string[], categories?: ISelectedItem[], selectedEntity?: any[]) => void = (referenceExternalIds: string[], categories?: ISelectedItem[], selectedEntity?: any[], documentStatusId?: number[]) => {
    handleApply({
      referenceExternalIds, categories, selectedCategories: categories ?? [], selectedDateRange, isDateError, selectedEntity, documentStatusIds: documentStatusId, setDocumentStatusIds, setIsDateError, setIsFilterLoading, setDateRange, setSelectedFormats,
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
    fetchGetDocumentDetails, gtmAnalytics, allRegistrationIds, referenceExternalId: searchRefExternalId,
    documentStatusIds
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
      pageNumber: sidePanelCurrentPage,
      pageSize: pageSizeNumber,
      userId: "",
      sortBy: sidePanelSortBy,
      sortDirection: sidePanelSortDirection,
      refreshKey: sidePanelRefreshKey
    },
    setPrivateData,
    setIsPrivateDocError,
    setIsPrivateLoading,
    setIsPrivateGridError
  )

  useResetOnManagePanelOpen(isSidePanelOpen, sidePanelOpenReason, setSidePanelCurrentPage, setSidePanelRefreshKey);

  const handleSidePanelSortChange: (columnName: string) => void = (columnName: string): void => {
    handleSorting(columnName, sidePanelSortBy, setSidePanelSortBy, sidePanelSortDirection, setSidePanelSortDirection, t);
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
              selectedPrivacyFilter,
              setSelectedPrivacyFilter,
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
                  privateTotalRecords={privateData?.totalRecords ?? 0}
                  onSidePanelPageChange={setSidePanelCurrentPage}
                  isPrivateLoading={isPrivateLoading}
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
