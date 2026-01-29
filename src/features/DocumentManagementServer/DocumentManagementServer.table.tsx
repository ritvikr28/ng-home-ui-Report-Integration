import React from "react";
import {
  ControlledList,
  Button,
  ButtonColor,
  ButtonSize,
  NotificationStatus,
  ShowActionAs,
  ResponseCode,
  TableRowType,
  ISelectedItem,
  SelectedItem,
} from "@essnextgen/ui-kit";
import FilterDialog from "../../shared/components/Filter/Filter";
import { getTableHeadersData } from "./DocumentManagementServer.logic";

interface Props {
  t: any;
  tableKey: number;
  tableData: any[];
  totalPage: number;
  currentPage: number;
  isInitialLoad: boolean;
  searchInput: string;
  searchTerm: string;
  filteredSuggestions: any[];
  isSearchLoading: boolean;
  issearchDataLoading: boolean;
  showErrorBanner: boolean;
  showSearchError: boolean;
  isSearchTriggered: boolean;
  NotificationMsgBannerObject: any;
  resultNotFoundMSG: string;
  searchTagListRaw: any[];
  onPageChange: (event: React.ChangeEvent<unknown>, page: number) => void;
  handleSorting: (columnName: string) => void;
  isClearSelectedCheckbox: boolean;
  setSelectedCheckBoxIds: (ids: string[]) => void;
  setExcludedCheckBoxIds: (ids: string[]) => void;
  onChangeAllCheckBox?: (event: React.ChangeEvent<unknown>) => void;
  onChangeListCheckBox: (...args: any[]) => void;
  onEditSelectedOverFlowMenu: (e: React.SyntheticEvent, selectedItem: any) => void;
  handleSearchClose: () => void;
  handleTagClose: (...args: any[]) => void;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSuggestionClick: (...args: any[]) => void;
  isFilterDialogOpen: boolean;
  setIsFilterDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isFilterLoading: boolean;
  selectedCategories: any[];
  setSelectedCategories: React.Dispatch<React.SetStateAction<ISelectedItem[]>>;
  selectedDateRange: any;
  setSelectedDateRange: (range: any) => void;
  isDateError: boolean;
  setIsDateError: React.Dispatch<React.SetStateAction<boolean>>;
  setDocumentRelatedTo: React.Dispatch<React.SetStateAction<number>>;
  selectedRelatedTo: any;
  setSelectedRelatedTo: (v: any) => void;
  tagListArray: any[];
  setTagListArray: React.Dispatch<React.SetStateAction<SelectedItem[]>>;
  handleApplyWrapper: (...args: any[]) => void;
  handleFilterOnClick: () => void;
  isSidePanelOpen: boolean;
  isSidePanelLoader: boolean;
  hasFetchedViewDownload: boolean;
  isViewDownloadError: boolean;
  viewData: any[];
  failedFileName: string[];
  clearAllError: boolean;
  prepareDownloadError: boolean;
  prepareDownloadAbortBanner: boolean;
  downloadError: boolean;
  showEmailNotification: boolean;
  showToastNotification: boolean;
  availableFileCount: number;
  setClearAllError: (v: boolean) => void;
  setPrepareDownloadError: (v: boolean) => void;
  setPrepareDownloadAbortBanner: (v: boolean) => void;
  setDownloadError: (v: boolean) => void;
  setShowEmailNotification: (v: boolean) => void;
  setShowToastNotification: (v: boolean) => void;
  setFailedFileName: (v: string[]) => void;
  handleCloseSidePanel: () => void;
  isDialogLoading: boolean;
  isGlobalLoaderModel: boolean;
  fileDownload: (...args: any[]) => Promise<any>;
  getTitleConfirmation: (...args: any[]) => string;
  dialogConfig: any;
  dialogType: string;
  docData: any;
  hasDMSDeletePermissions: boolean;
  hasCompletedFiles: boolean;
  setShowConfirmDialog: (v: boolean) => void;
  setDialogType: (v: string) => void;
  setIsSidePanelOpen: (v: boolean) => void;
  showConfirmDialog: boolean;
  setIsHeaderBoxChecked: (v: boolean) => void;
  setAllSelectedDocs: (v: any[]) => void;
  setTableKey: (fn: (prev: number) => number) => void;
  setIsInitialLoad: (v: boolean) => void;
  setSelectedFormats: (arr: any[]) => void;
  setSelectedEntities: (arr: any[]) => void;
  setSearchTerm: (v: string) => void;
  setSearchText: (v: string) => void;
  setSearchRefExternalId: (ids: string[]) => void;
  setIsSearchTriggered: (v: boolean) => void;
  setPrevSelectedDocs: (ids: string[]) => void;
  prevSelectedDocs: string[];
  setIsClearSelectedCheckbox: (v: boolean) => void;
  searchText: string;
  setDateRange: React.Dispatch<React.SetStateAction<any>>;
}

const DmsControlledList: React.FC<Props> = (props) => {
  const {
    t,
    tableKey,
    tableData,
    totalPage,
    currentPage,
    isInitialLoad,
    isSearchLoading,
    issearchDataLoading,
    searchInput,
    searchTerm,
    filteredSuggestions,
    NotificationMsgBannerObject,
    resultNotFoundMSG,
    searchTagListRaw,
    showErrorBanner,
    showSearchError,
    onPageChange,
    onEditSelectedOverFlowMenu,
    handleSearchClose,
    handleTagClose,
    handleFilterOnClick,
    handleSearchChange,
    handleSuggestionClick,
    handleSorting,
    handleCloseSidePanel,
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
    isSidePanelOpen,
    isSidePanelLoader,
    hasFetchedViewDownload,
    isViewDownloadError,
    viewData,
    failedFileName,
    clearAllError,
    prepareDownloadError,
    prepareDownloadAbortBanner,
    downloadError,
    showEmailNotification,
    showToastNotification,
    availableFileCount,
    setClearAllError,
    setPrepareDownloadError,
    setPrepareDownloadAbortBanner,
    setDownloadError,
    setShowEmailNotification,
    setShowToastNotification,
    setFailedFileName,
    isDialogLoading,
    isGlobalLoaderModel,
    fileDownload,
    getTitleConfirmation,
    dialogConfig,
    dialogType,
    docData,
    onChangeAllCheckBox,
    onChangeListCheckBox,
    hasDMSDeletePermissions,
    hasCompletedFiles,
    setShowConfirmDialog,
    setDialogType,
    setIsSidePanelOpen,
    showConfirmDialog,
    prevSelectedDocs,
    setPrevSelectedDocs,
    isSearchTriggered,
    searchText
    // ...other props
  } = props;

  return (
    <ControlledList
      key={tableKey}
      isMobileViewBreadcrumb
      globalNotificationMsgBannerObject={NotificationMsgBannerObject}
      isShowHeading
      isShowSubHeading
      isSorting={false}
      sortByDefault={false}
      sortAscFirst={!isInitialLoad}
      isIconRightAligned
      isAddEventBtnShow={false}
      dataTestId="controlled-list-test-id"
      filterDDLOptions={[
        { id: "1", text: "All", value: "All" },
        { id: "2", text: "Active", value: "Active" },
        { id: "3", text: "Inactive", value: "Inactive" },
      ]}
      isShowCheckboxCol
      editSelectedBtnTitle={t("DocumentManagementServer.editSelectedBtnTitle")}
      editSelectedOptions={[
        {
          disabled: false,
          text: t("DocumentManagementServer.PrepareDownload"),
          value: "Prepare download",
        },
        {
          disabled: false,
          text: t("DocumentManagementServer.ViewDownload"),
          value: "View download",
        },
        ...(hasDMSDeletePermissions
          ? [
              {
                disabled: false,
                isSelected: false,
                isShowDivider: true,
                text: t("DocumentManagementServer.Delete"),
                value: "Delete",
              },
            ]
          : []),
      ]}
      onEditSelectedOverFlowMenu={onEditSelectedOverFlowMenu}
      onEditSelectedBtnClick={() => {}}
      handleCloseDialogConfirmation={() => setShowConfirmDialog(false)}
      isClearSelectedCheckbox={props.isClearSelectedCheckbox}
      isAllSelectedAcrossPagination={true}
      totalRecords={docData?.totalRecords || 0}
      selectedCheckboxIds={props.setSelectedCheckBoxIds}
      prevselectedCheckboxIds={props.setPrevSelectedDocs}
      setExcludedCheckBoxIds={props.setExcludedCheckBoxIds}
      onChangeAllCheckBox={onChangeAllCheckBox}
      onChangeListCheckBox={onChangeListCheckBox}
      emptyStateMsg={resultNotFoundMSG}
      emptybtnTitle="Add Type"
      isShowEmptyAddBtn={false}
      errorActionListItem={[
        {
          action: "Our team is attempting to fix the issue. Please wait for a few minutes and try again",
          iconName: "information",
          id: "1",
          title: "Try again after a while",
        },
        {
          action: "Click here to go back to home page",
          iconName: "home",
          id: "2",
          showActionAs: ShowActionAs.Link,
          title: "Go back to home page",
        },
      ]}
      errorPageActionListDescription="Things to try"
      errorPageReasonListDescription="Sorry, We are having trouble connecting."
      errorPageTitle="Service Unavailable"
      errorReasonListItem={[
        { id: "1", reason: "One of our servers could be down" },
        { id: "2", reason: "Our service could have been disrupted by unforeseen interruptions" },
      ]}
      groupTagsEnabled
      headingText={t("DocumentManagementServer.headingText")}
      id="controlled-list"
      isBreadCrumbEnable={false}
      isOnCloseSidepnl
      lastColContentAlign="center"
      lastColHeaderAlign="center"
      paginationCount={totalPage || 0}
      paginationDefaultPage={1}
      paginationPage={currentPage}
      paginationOnChange={onPageChange}
      isPagination={tableData.length > 0}
      paginationMinCountToHideNextPreviousBtn={0}
      emptyRowType={showErrorBanner || showSearchError ? TableRowType.Error : TableRowType.Info}
      emptyRowResponseCode={showErrorBanner || showSearchError ? ResponseCode.Error : ResponseCode.Info}
      emptyRowResponseMessage={resultNotFoundMSG}
      isShowdynamictableNoMsg={
        showSearchError ||
        (!isSearchTriggered && !props.searchText) ||
        (isSearchTriggered && docData?.statusCode === 200 && Array.isArray(docData?.data) && docData?.data.length === 0)
      }
      isMessageCenterAligned={false}
      dynamictableIconName={
        showSearchError && docData?.data?.length === 0 && props.searchText
          ? "warning--alt"
          : "information"
      }
      searchHeadingText={t("DocumentManagementServer.searchHeadingText")}
      searchTerm={searchInput}
      isShowSearch
      searchPlaceholderText=" "
      searchValue={searchTerm}
      searchIsLoader={isSearchLoading}
      isSearchHideClearIcon={searchTerm.length === 0}
      onKeyUpLenght={3}
      searchDebouncerTreshold={1000}
      searchSuggestions={filteredSuggestions}
      onSearchSuggestionItemClick={(item) => {
        props.setTagListArray([]);
        props.setSelectedCategories([]);
        props.setDateRange({ fromDate: "", toDate: "" });
        props.setSelectedCheckBoxIds([]);
        props.setAllSelectedDocs([]);
        props.setIsClearSelectedCheckbox(true);
        props.setIsHeaderBoxChecked(false);
        props.setExcludedCheckBoxIds([]);
        props.setPrevSelectedDocs([]);
        props.setTableKey((prev) => prev + 1);
        props.setIsInitialLoad(true);
        handleSuggestionClick(item, props.setSearchTerm, props.setSearchText, props.setDocumentRelatedTo, props.setSearchRefExternalId);
        props.setIsSearchTriggered(true);
        props.setSelectedFormats([]);
        props.setSelectedCategories([]);
        props.setSelectedRelatedTo(undefined);
        if (item) {
          props.setSelectedEntities([item]);
        }
      }}
      searchOnChange={handleSearchChange}
      searchOnCloseHandle={handleSearchClose}
      isGlobalLoader={isDialogLoading}
      globalLoaderText="Please wait..."
      isGlobalLoaderModel={isGlobalLoaderModel}
      secondaryButtonTitle={
        hasCompletedFiles
          ? t("DocumentManagementServer.ClearAll")
          : t("DocumentManagementServer.Close")
      }
      onClickSidePnlSecondaryBtn={() => {
        if (hasCompletedFiles) {
          setDialogType("clearAll");
          setShowConfirmDialog(true);
        } else {
          setIsSidePanelOpen(false);
        }
      }}
      isShowSecondaryBtn
      isShowPrimaryBtn={false}
      showConfirmDialog={showConfirmDialog}
      sidePanelShowNotification={false}
      sidePanelNotificationMessage="A technical issue at our end has stopped us from [action].
        Please try again. If the issue persists please get in touch with our support team.
        We appreciate your patience and understanding during this time."
      sidePanelNotificationStatus={NotificationStatus.SUCCESSTOAST}
      sidePanelNotificationTitle="Unable to Download"
      templatePropsConfirmation={dialogConfig}
      titleConfirmation={getTitleConfirmation(t, dialogType, availableFileCount, docData?.totalRecords || 0)}
      isOpenConfirmationDialog={showConfirmDialog}
      showToastNotification={false}
      toastNotificationStatus={NotificationStatus.SUCCESS}
      toastNotificationAutoclose
      toastNotificationTitle="Downloads cleared successfully!"
      isShowOverflowMenuCol={false}
      isShowFirstElement
      isSidePanelOpen={isSidePanelOpen}
      handleCloseSidePanel={handleCloseSidePanel}
      isShowAutoSuggest
      isLoaderForFilterandTable={false}
      loaderFilterText="Please Wait..."
      isShowErrorPage={false}
      isSearchShowLoading={false}
      dynamicTableLoader={issearchDataLoading}
      className="grid_wrapper"
      searchTagList={searchTagListRaw}
      onOverflowTagClose={() => {}}
      isShowFourthElement={false}
      tableBodyData={tableData?.length > 0 ? tableData : []}
      filterCustumeElem2={
        <>
          <Button
            className="filter-btn"
            dataTestId="filter-btn"
            color={ButtonColor.Utility}
            size={ButtonSize.Small}
            onClick={handleFilterOnClick}
          >
            {t("Filter.heading")}
          </Button>
          <FilterDialog
            isOpen={isFilterDialogOpen}
            title={t("Filter.heading")}
            isLoading={isFilterLoading}
            onClose={() => setIsFilterDialogOpen(false)}
            setSelectedCategories={setSelectedCategories}
            selectedCategories={selectedCategories}
            handleApply={handleApplyWrapper}
            isFilterDialogOpen={isFilterDialogOpen}
            setIsDateError={setIsDateError}
            isDateError={isDateError}
            setSelectedDateRange={setSelectedDateRange}
            selectedDateRange={selectedDateRange}
            setDocumentRelatedTo={setDocumentRelatedTo}
            selectedRelatedTo={selectedRelatedTo}
            setSelectedRelatedTo={setSelectedRelatedTo}
            tagListArray={tagListArray}
            setTagListArray={setTagListArray}
          />
        </>
      }
      searchOnClickClose={handleTagClose}
      tableFirstColumnWidth="10px"
      tableHeadersData={getTableHeadersData(t)}
      sortingOnClickEvent={(e, columnName) => handleSorting(columnName)}
    />
  );
};

export default DmsControlledList;