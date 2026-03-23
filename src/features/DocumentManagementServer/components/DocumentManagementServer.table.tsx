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
  SelectedItem
} from "@essnextgen/ui-kit";
import FilterDialog from "../../../shared/components/Filter/Filter";
import { getTableHeadersData } from "../logic/DocumentManagementServer.logic";
import { SidePanelReason } from "../responseModel";
import { getSecondaryButtonTitle } from "../logic/DocumentManagementServer.utils";

interface Props {
  t: any;
  searchNoDataTemplate: string;
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
  availableFileCount: number;
  handleCloseSidePanel: () => void;
  isDialogLoading: boolean;
  isGlobalLoaderModel: boolean;
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
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
  setSearchRefExternalId: (ids: string[]) => void;
  setIsSearchTriggered: React.Dispatch<React.SetStateAction<boolean>>;
  setPrevSelectedDocs: (ids: string[]) => void;
  setIsClearSelectedCheckbox: (v: boolean) => void;
  searchText: string;
  setDateRange: React.Dispatch<React.SetStateAction<any>>;
  isSidePanelLoader: boolean;
  addEditTemplateChild: any;
  setSortBy: React.Dispatch<React.SetStateAction<string>>;
  setSortDirection: React.Dispatch<React.SetStateAction<string>>;
  setSearchInput: React.Dispatch<React.SetStateAction<string>>;
  globalNotificationBannerOnClickAction: () => void;
  sidePanelOpenReason: SidePanelReason | null;
  selectedPrivacyFilter?: string;
  setSelectedPrivacyFilter?: React.Dispatch<React.SetStateAction<string>>;
}

function handleSuggestionItemClick(
  item: any,
  {
    setTagListArray,
    setSelectedCategories,
    setDateRange,
    setSelectedCheckBoxIds,
    setAllSelectedDocs,
    setIsClearSelectedCheckbox,
    setIsHeaderBoxChecked,
    setExcludedCheckBoxIds,
    setPrevSelectedDocs,
    setTableKey,
    setIsInitialLoad,
    handleSuggestionClick,
    setIsSearchTriggered,
    setSelectedFormats,
    setSelectedRelatedTo,
    setSelectedEntities,
    setSearchTerm,
    setSearchText,
    setDocumentRelatedTo,
    setSearchRefExternalId,
    setSortBy,
    setSortDirection
  }: any
): void {
  setTagListArray([]);
  setSelectedCategories([]);
  setDateRange({ fromDate: "", toDate: "" });
  setSelectedCheckBoxIds([]);
  setAllSelectedDocs([]);
  setIsClearSelectedCheckbox(true);
  setIsHeaderBoxChecked(false);
  setExcludedCheckBoxIds([]);
  setPrevSelectedDocs([]);
  setTableKey((prev: number) => prev + 1);
  setIsInitialLoad(true);
  handleSuggestionClick(item, setSearchTerm, setSearchText, setDocumentRelatedTo, setSearchRefExternalId, setSortBy, setSortDirection);
  if(typeof setIsSearchTriggered === "function")
    setIsSearchTriggered(true);

  setSelectedFormats([]);
  setSelectedCategories([]);
  setSelectedRelatedTo(undefined);
  if (item) {
    setSelectedEntities([item]);
  }
}

function getEditSelectedOptions(t: any, hasDMSDeletePermissions: boolean): { text: string; value: string; disabled: boolean }[] {
  const baseOptions: { text: string; value: string; disabled: boolean }[] = [
    {
      disabled: false,
      text: t("DocumentManagementServer.PrepareDownload"),
      value: "Prepare download"
    },
    {
      disabled: false,
      text: t("DocumentManagementServer.ViewDownload"),
      value: "View download"
    }
  ];
  if (hasDMSDeletePermissions) {
    baseOptions.push({
      disabled: false,
      text: t("DocumentManagementServer.Delete"),
      value: "Delete"
    });
  }
  return baseOptions;
}

function getFilterDDLOptions(): { id: string; text: string; value: string }[] {
  return [
    { id: "1", text: "All", value: "All" },
    { id: "2", text: "Active", value: "Active" },
    { id: "3", text: "Inactive", value: "Inactive" }
  ];
}

function handleSidePanelSecondaryBtn(
  hasCompletedFiles: boolean,
  setDialogType: (v: string) => void,
  setShowConfirmDialog: (v: boolean) => void,
  setIsSidePanelOpen: (v: boolean) => void,
  sidePanelOpenReason: SidePanelReason | null
): void {
  if (hasCompletedFiles && sidePanelOpenReason !== "manage") {
    setDialogType("clearAll");
    setShowConfirmDialog(true);
  } else {
    setIsSidePanelOpen(false);
  }
}

function getErrorActionList(): { action: string; iconName: string; id: string; showActionAs?: ShowActionAs; title: string }[] {
  return [
    {
      action: "Our team is attempting to fix the issue. Please wait for a few minutes and try again",
      iconName: "information",
      id: "1",
      title: "Try again after a while"
    },
    {
      action: "Click here to go back to home page",
      iconName: "home",
      id: "2",
      showActionAs: ShowActionAs.Link,
      title: "Go back to home page"
    }
  ];
}

function getErrorReasonList(): { id: string; reason: string }[] {
  return [
    { id: "1", reason: "One of our servers could be down" },
    { id: "2", reason: "Our service could have been disrupted by unforeseen interruptions" }
  ];
}

function getDynamicTableIconName(showSearchError: boolean, docData: any, searchText: string): string {
  return showSearchError && docData?.data?.length === 0 && searchText
    ? "warning--alt"
    : "information";
}

function getEmptyRowType(showErrorBanner: boolean, showSearchError: boolean): TableRowType {
  return showErrorBanner || showSearchError ? TableRowType.Error : TableRowType.Info;
}

function getEmptyRowResponseCode(showErrorBanner: boolean, showSearchError: boolean): ResponseCode {
  return showErrorBanner || showSearchError ? ResponseCode.Error : ResponseCode.Info;
}

function shouldShowDynamicTableNoMsg(showSearchError: boolean, isSearchTriggered: boolean, searchText: string, docData: any): boolean {
  return (
    showSearchError ||
    (!isSearchTriggered && !searchText) ||
    (isSearchTriggered && docData?.statusCode === 200 && Array.isArray(docData?.data) && docData?.data.length === 0)
  );
}

function getFilterCustomElem2(props: Props): React.ReactNode {
  const {
    t,
    handleFilterOnClick,
    isFilterDialogOpen,
    isFilterLoading,
    setIsFilterDialogOpen,
    setSelectedCategories,
    selectedCategories,
    handleApplyWrapper,
    setIsDateError,
    isDateError,
    setSelectedDateRange,
    selectedDateRange,
    setDocumentRelatedTo,
    selectedRelatedTo,
    setSelectedRelatedTo,
    tagListArray,
    setTagListArray,
    selectedPrivacyFilter,
    setSelectedPrivacyFilter
  }: Props = props;

  return (
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
        selectedPrivacyFilter={selectedPrivacyFilter}
        setSelectedPrivacyFilter={setSelectedPrivacyFilter}
      />
    </>
  );
}

function getControlledListProps(props: Props): React.ComponentProps<typeof ControlledList> {
  const {
    t,
    tableKey,
    tableData,
    totalPage,
    currentPage,
    isInitialLoad,
    isSearchLoading,
    issearchDataLoading,
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
    handleSearchChange,
    handleSuggestionClick,
    setIsSearchTriggered,
    handleSorting,
    handleCloseSidePanel,
    setSelectedCategories,
    setDocumentRelatedTo,
    setSelectedRelatedTo,
    setTagListArray,
    isSidePanelOpen,
    availableFileCount,
    isDialogLoading,
    isGlobalLoaderModel,
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
    isSearchTriggered,
    isSidePanelLoader,
    isClearSelectedCheckbox,
    setSelectedCheckBoxIds,
    setExcludedCheckBoxIds,
    setPrevSelectedDocs,
    setAllSelectedDocs,
    setTableKey,
    setIsInitialLoad,
    setSelectedFormats,
    setSelectedEntities,
    setSearchTerm,
    setDateRange,
    setSearchText,
    setSearchRefExternalId,
    setIsHeaderBoxChecked,
    searchText,
    setIsClearSelectedCheckbox,
    addEditTemplateChild,
    setSortBy,
    setSortDirection,
    globalNotificationBannerOnClickAction,
    sidePanelOpenReason
    // ...other props
  }: Props = props;

  const editSelectedOptions: any = getEditSelectedOptions(t, hasDMSDeletePermissions);
  const filterDDLOptions: any = getFilterDDLOptions();
  return {
    key: tableKey,
    isMobileViewBreadcrumb: true,
    globalNotificationMsgBannerObject: NotificationMsgBannerObject,
    isShowHeading: true,
    isShowSubHeading: true,
    isSorting: false,
    sortByDefault: false,
    sortAscFirst: !isInitialLoad,
    isIconRightAligned: true,
    isAddEventBtnShow: false,
    dataTestId: "controlled-list-test-id",
    filterDDLOptions,
    isShowCheckboxCol: true,
    editSelectedBtnTitle: t("DocumentManagementServer.editSelectedBtnTitle"),
    editSelectedOptions,
    onEditSelectedOverFlowMenu,
    onEditSelectedBtnClick: () => { },
    handleCloseDialogConfirmation: () => setShowConfirmDialog(false),
    isClearSelectedCheckbox,
    isAllSelectedAcrossPagination: true,
    totalRecords: docData?.totalRecords || 0,
    selectedCheckboxIds: setSelectedCheckBoxIds,
    prevselectedCheckboxIds: setPrevSelectedDocs,
    setExcludedCheckBoxIds,
    onChangeAllCheckBox,
    onChangeListCheckBox,
    emptyStateMsg: resultNotFoundMSG,
    emptybtnTitle: "Add Type",
    isShowEmptyAddBtn: false,
    errorActionListItem: getErrorActionList(),
    errorPageActionListDescription: "Things to try",
    errorPageReasonListDescription: "Sorry, We are having trouble connecting.",
    errorPageTitle: "Service Unavailable",
    errorReasonListItem: getErrorReasonList(),
    groupTagsEnabled: true,
    headingText: t("DocumentManagementServer.headingText"),
    id: "controlled-list",
    isBreadCrumbEnable: false,
    isOnCloseSidepnl: true,
    lastColContentAlign: "center" as "center",
    lastColHeaderAlign: "center" as "center",
    paginationCount: totalPage || 0,
    paginationDefaultPage: 1,
    paginationPage: currentPage,
    paginationOnChange: onPageChange,
    isPagination: tableData.length > 0,
    paginationMinCountToHideNextPreviousBtn: 0,
    emptyRowType: getEmptyRowType(showErrorBanner, showSearchError),
    emptyRowResponseCode: getEmptyRowResponseCode(showErrorBanner, showSearchError),
    emptyRowResponseMessage: resultNotFoundMSG,
    isShowdynamictableNoMsg: shouldShowDynamicTableNoMsg(showSearchError, isSearchTriggered, searchText, docData),
    isMessageCenterAligned: false,
    dynamictableIconName: getDynamicTableIconName(showSearchError, docData, searchText),
    searchHeadingText: t("DocumentManagementServer.searchHeadingText"),
    searchTerm: searchText,
    isShowSearch: true,
    searchPlaceholderText: " ",
    searchValue: searchText,
    searchIsLoader: isSearchLoading,
    isSearchHideClearIcon: searchText.length === 0,
    onKeyUpLenght: 3,
    searchDebouncerTreshold: 1000,
    searchSuggestions: filteredSuggestions,
    onSearchSuggestionItemClick: (item: any) =>
      handleSuggestionItemClick(item, {
        setTagListArray,
        setSelectedCategories,
        setDateRange,
        setSelectedCheckBoxIds,
        setAllSelectedDocs,
        setIsClearSelectedCheckbox,
        setIsHeaderBoxChecked,
        setExcludedCheckBoxIds,
        setPrevSelectedDocs,
        setTableKey,
        setIsInitialLoad,
        handleSuggestionClick,
        setIsSearchTriggered,
        setSelectedFormats,
        setSelectedRelatedTo,
        setSelectedEntities,
        setSearchTerm,
        setSearchText,
        setDocumentRelatedTo,
        setSearchRefExternalId,
        setSortBy,
        setSortDirection
      }),
    searchOnChange: handleSearchChange,
    searchOnCloseHandle: handleSearchClose,
    isGlobalLoader: isDialogLoading,
    globalLoaderText: "Please wait...",
    isGlobalLoaderModel,
    secondaryButtonTitle: getSecondaryButtonTitle(sidePanelOpenReason, hasCompletedFiles, t),
    onClickSidePnlSecondaryBtn: () =>
      sidePanelOpenReason === "manage"
        ? setIsSidePanelOpen(false)
        : handleSidePanelSecondaryBtn(
            hasCompletedFiles,
            setDialogType,
            setShowConfirmDialog,
            setIsSidePanelOpen,
            sidePanelOpenReason
          ),
    isShowSecondaryBtn: true,
    isShowPrimaryBtn: false,
    showConfirmDialog,
    sidePanelShowNotification: false,
    sidePanelNotificationMessage:
      "A technical issue at our end has stopped us from [action].\n" +
      "Please try again. If the issue persists please get in touch with our support team.\n" +
      "We appreciate your patience and understanding during this time.",
    sidePanelNotificationStatus: NotificationStatus.SUCCESSTOAST,
    sidePanelNotificationTitle: "Unable to Download",
    templatePropsConfirmation: dialogConfig,
    titleConfirmation: getTitleConfirmation(t, dialogType, availableFileCount, docData?.totalRecords || 0),
    isOpenConfirmationDialog: showConfirmDialog,
    showToastNotification: false,
    toastNotificationStatus: NotificationStatus.SUCCESS,
    toastNotificationAutoclose: true,
    toastNotificationTitle: "Downloads cleared successfully!",
    isShowOverflowMenuCol: false,
    isShowFirstElement: true,
    isSidePanelOpen,
    handleCloseSidePanel,
    isShowAutoSuggest: true,
    isLoaderForFilterandTable: false,
    loaderFilterText: "Please Wait...",
    isShowErrorPage: false,
    isSearchShowLoading: false,
    dynamicTableLoader: issearchDataLoading,
    addEditTemplateChild,
    className: "grid_wrapper",
    searchTagList: searchTagListRaw,
    onOverflowTagClose: () => { },
    isShowFourthElement: false,
    tableBodyData: tableData?.length > 0 ? tableData : [],
    filterCustumeElem2: getFilterCustomElem2(props),
    searchOnClickClose: handleTagClose,
    tableFirstColumnWidth: "10px",
    tableHeadersData: getTableHeadersData(t),
    sortingOnClickEvent: (e: any, columnName: string) => handleSorting(columnName),
    isSidePanelLoader,
    sidePanelTitle: (sidePanelOpenReason === "manage" ? t("DocumentManagementServer.managePrivateSidePanelTitle") : t("DocumentManagementServer.sidePanelTitle")),
    subHeadingText: t("DocumentManagementServer.subHeadingText"),
    searchNoDataTemplate: `${t("DocumentManagementServer.FirstPart")} - {value} - ${t("DocumentManagementServer.SecondPart")}`,
    globalNotificationBannerOnClickAction
  };
}
const DmsControlledList: React.FC<Props> = (props) =>
  <ControlledList {...getControlledListProps(props)} />;

DmsControlledList.defaultProps = {
  onChangeAllCheckBox: undefined
};

export default DmsControlledList;