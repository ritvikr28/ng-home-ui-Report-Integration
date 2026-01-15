/* istanbul ignore file */
import { LocalisedMenu } from "@essnextgen/ui-application-kit";
import {
  Button,
  ButtonColor,
  IconColor,
  ButtonSize,
  Breadcrumbs,
  ControlledList,
  DialogTemplate,
  NotificationStatus,
  useMediaQuery,
  ValidationTextLevel,
  Suggestion,
  ISearchItemProp,
  ISelectedItem,
  TableRowType,
  ResponseCode,
  TableHeader,
  ShowValAs,
  ValidationText,
  IBreadcrumbLink,
  OptionsEntity
} from "@essnextgen/ui-kit";
import React, { useState, useEffect, useRef } from "react";
import {
  useTranslation,
  UseTranslationResponse
} from "@essnextgen/ui-intl-kit";
import {
  BulkInviteErrBanner,
  filterOptions,
  homeurl,
  IInviteUserDetails,
  InvitationStatusFilterOptions,
  InviteUserProps,
  IRequestBodyType,
  pageSize
} from "./InviteUsersProps";
import "./style.scss";
import gtmAnalytics from "../../shared/utils/analytics";
import { envConfig } from "../../shared/utils";
import {
  fetchInviteUserDetails,
  handleCheckBoxSelection,
  handleSearch,
  handleSelectedUserData,
  handleSendInvite,
  inviteUsersSorting
} from "./InviteUsersUtils";
import InviteUsersDialog from "./InviteUsersDialog";

export const InviteUserView: React.FC<InviteUserProps> = (props) => {
  const { t }: UseTranslationResponse<"translation", undefined> =
    useTranslation();

    const editSelectedOptions: OptionsEntity[] = [
    {
      disabled: false,
      text: `${t("inviteUsers.sendInvite")}`, 
      value: "SendInvite",
      isShowDivider: false,
      isSelected: false
    }
  ];

  const getTableDataArry = (data:any)=>{
    let tdata = data
    if(data.length > 0){
      tdata = data.map((item:any)=>({
          ...item,
          actions: {
          options: [
            {
              disabled: false,
              isSelected: false,
              text: `${t("inviteUsers.sendInvite")}`,
              value: "SendInvite"
            }
          ]
        }
        }))
    }
    return tdata
  }

  const {
    usersTableData,
    setUsersTableData,
    totalPage,
    setTotalPage,
    currentPage,
    setCurrentPage,
    handlePageChange,
    isLoader,
    setLoader,
    showInvitationConflictBanner,
    setshowInvitationConflictBanner,
    isSearchLoader,
    setSearchLoader
  } = props;
  const isMobileView: boolean = useMediaQuery(
    "(min-width:320px) and (max-width: 1023.9px)"
  );
  const smallScreen: boolean = useMediaQuery(
    "(min-width:320px) and (max-width: 767px)"
  );

  const breadcrumbActions: IBreadcrumbLink[] = [
    {
      active: true,
      linkName: `${t("homePage.appTitle")}`,
      path: "/"
    },
    {
      active: false,
      linkName: `${t("breadcrumbsadminconsole")}`,
      path: homeurl
    },
    {
      active: false,
      linkName: `${t("inviteUsers.title")}`,
      path: "/"
    }
  ];

  const getTableHeadersData: TableHeader[] = [
    {
      text: "Id",
      isShow: false,
      showValAs: ShowValAs.Text,
      isTextTruncate: false,
      columnWidth: "10px"
    },
    {
      text: `${t("inviteUsers.name")}`,
      isShow: true,
      showValAs: ShowValAs.Text,
      isTextTruncate: false,
      isHeaderTextTruncate: false,
      columnWidth: "285px",
      headerTxtTrunctLength: 50,
      isSimpleText: true,
      isColumnSorting: true,
      isColumnSortByDefault: true
    },
    {
      text: `${t("inviteUsers.email")}`,
      isShow: true,
      showValAs: ShowValAs.Text,
      isTextTruncate: false,
      isHeaderTextTruncate: false,
      headerTxtTrunctLength: 17,
      isSimpleText: true,
      isColumnSorting: true,
      columnWidth: "325px"
    },
    {
      text: `${t("inviteUsers.userType")}`,
      isShow: true,
      showValAs: ShowValAs.Text,
      isTextTruncate: false,
      isHeaderTextTruncate: false,
      headerTxtTrunctLength: 50,
      isColumnSorting: false,
      columnWidth: "165px"
    },
    {
      text: `${t("inviteUsers.invitationStatus")}`,
      isShow: true,
      showValAs: ShowValAs.CustomeComponent,
      anyComponent: (propsI: any) => {
        if (propsI === "Invitation conflict") {
          return (
            <ValidationText
              className="invite-user-status"
              text="Invitation conflict"
              textLevel={ValidationTextLevel.Warning}
            />
          );
        }
        return propsI;
      },

      isTextTruncate: false,
      isHeaderTextTruncate: false,
      headerTxtTrunctLength: 50,
      isColumnSorting: false,
      columnWidth: "206px"
    },
    {
      text: `${t("inviteUsers.inviteRequestDate")}`,
      isShow: true,
      showValAs: ShowValAs.Text,
      isTextTruncate: false,
      isHeaderTextTruncate: false,
      headerTxtTrunctLength: 50,
      isColumnSorting: true,
      columnWidth: "165px"
    }
  ];

  const [isSidebarOpen, setIsSidebarOpen]: [
    boolean,
    React.Dispatch<React.SetStateAction<boolean>>
  ] = useState<boolean>(!isMobileView);
  const [showErrorBanner, setShowErrorBanner]: [
    boolean,
    React.Dispatch<React.SetStateAction<boolean>>
  ] = useState<boolean>(false);
  const [showInviteErrBanner, setShowInviteErrBanner]: [
    boolean,
    React.Dispatch<React.SetStateAction<boolean>>
  ] = useState<boolean>(false);
  const [showSearchError, setShowSearchError]: [
    boolean,
    React.Dispatch<React.SetStateAction<boolean>>
  ] = useState<boolean>(false);
  const [source, setSource]: [
    string,
    React.Dispatch<React.SetStateAction<string>>
  ] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("Forename");
  const [sortDirection, setSortDirection] = useState<boolean>(true);
  const [showConfirmDialog, setShowConfirmDialog]: [
    boolean,
    React.Dispatch<React.SetStateAction<boolean>>
  ] = useState<boolean>(false);
  const [selectedRowItems, setSelectedRowItems] = useState<any[]>([]);
  const [isDataUpdated, setDataUpdated]: [
    boolean,
    React.Dispatch<React.SetStateAction<boolean>>
  ] = useState<boolean>(false);
  const [selectedCheckBoxIds, setSelectedCheckBoxIds]: [
    string[],
    React.Dispatch<React.SetStateAction<string[]>>
  ] = useState<string[]>([]);
  const [showDialog, setShowDialog]: [
    boolean,
    React.Dispatch<React.SetStateAction<boolean>>
  ] = useState<boolean>(false);
  const [toastMessage, setToastMessage]: [
    string,
    React.Dispatch<React.SetStateAction<string>>
  ] = useState<string>("");
  const [showToast, setShowToast]: [
    boolean,
    React.Dispatch<React.SetStateAction<boolean>>
  ] = useState<boolean>(false);
  const [searchSuggestions, setSearchSuggestions] = React.useState<
    Suggestion[]
  >([]);
  const [searchTerm, setSearchTerm]: [
    string,
    React.Dispatch<React.SetStateAction<string>>
  ] = React.useState<string>("");
  const [searchAndStatusFilter, setSearchAndStatusFilter] = React.useState<{
    searchText: string;
    selectedStatus: ISelectedItem;
  }>({
    searchText: "",
    selectedStatus: {
      text: InvitationStatusFilterOptions.All,
      value: "All"
    }
  });
  const [noDataTextToDisplay, setNoDataTextToDisplay]: [
    string,
    React.Dispatch<React.SetStateAction<string>>
  ] = useState<string>(`${t("inviteUsers.noDataToDisplay")}`);
  const statusFilterRef = useRef<ISelectedItem>({
    text: InvitationStatusFilterOptions.All,
    value: "All"
  });

  useEffect(() => {
    setSearchAndStatusFilter((prev) => ({
      ...prev,
      selectedStatus: statusFilterRef?.current as ISelectedItem
    }));
  }, [statusFilterRef?.current]);

  const hasItems: boolean = searchSuggestions.some(
    (x: Suggestion) => x.values.length > 0
  );

  useEffect(() => {
    document.body.classList.add("no-scroll");
  }, []);

  useEffect(() => {
    setIsSidebarOpen(!isMobileView);
  }, [isMobileView]);

  useEffect(() => {
    setLoader(true);
    fetchInviteUserDetails({
      pageNumber: currentPage,
      pageSize,
      columnName: sortBy,
      sortDirection,
      searchAndStatusFilter,
      setTotalPage,
      setShowErrorBanner,
      setshowInvitationConflictBanner,
      setNoDataTextToDisplay
    }).then((res) => {
      setLoader(false);
      setUsersTableData(res);
      setDataUpdated(false);
    });
  }, [
    currentPage,
    searchAndStatusFilter?.searchText,
    searchAndStatusFilter.selectedStatus?.value
  ]);

  useEffect(() => {
    if (isDataUpdated) {
      if (source === "Bulk") {
        setSelectedCheckBoxIds([]);
        setSelectedRowItems([]);
      }
      setLoader(true);
      fetchInviteUserDetails({
        pageNumber: currentPage,
        pageSize,
        columnName: sortBy,
        sortDirection,
        searchAndStatusFilter,
        setTotalPage,
        setShowErrorBanner,
        setshowInvitationConflictBanner
      }).then((res) => {
        setLoader(false);
        setUsersTableData(res);
        setDataUpdated(false);
        setShowToast(true);
        setSelectedRowItems([]);
        setToastMessage(`${t("inviteUsers.changesSaved")}`);
      });
      setTimeout(() => setShowToast(false), 9000);
    }
  }, [isDataUpdated]);

  const handleClearSearch: () => void = () => {
    setShowErrorBanner(false);
    setNoDataTextToDisplay(`${t("inviteUsers.noDataToDisplay")}`);
    setSearchTerm("");
    setSearchAndStatusFilter((prev) => ({
      ...prev,
      searchText: "",
      selectedStatus: searchAndStatusFilter.selectedStatus
    }));
    setSearchLoader(false);
    setLoader(true);
    fetchInviteUserDetails({
      pageNumber: currentPage,
      pageSize,
      columnName: sortBy,
      sortDirection,
      searchAndStatusFilter: {
        searchText: "",
        selectedStatus: searchAndStatusFilter.selectedStatus
      },
      setTotalPage,
      setShowErrorBanner,
      setshowInvitationConflictBanner,
      setNoDataTextToDisplay
    }).then((res) => {
      setLoader(false);
      setUsersTableData(res);
      setDataUpdated(false);
    });
  };
  useEffect(() => {
    handleSelectedUserData({
      selectedCheckBoxIds,
      usersTableData,
      setUsersTableData
    });
  }, [selectedCheckBoxIds]);

  const toggleSidebar: () => void = (): void => {
    gtmAnalytics.pushEvent({
      event: "click",
      action: "Sidebar Toggled",
      category: "Navigation",
      label: isSidebarOpen ? "Sidebar Closed" : "Sidebar Opened"
    });
    setIsSidebarOpen((prev: boolean): boolean => !prev);
  };

  const closeSidebar: () => void = (): void => {
    gtmAnalytics.pushEvent({
      event: "click",
      action: "Sidebar Closed",
      category: "Navigation",
      label: "Admin Console Sidebar"
    });
    setIsSidebarOpen(false);
  };

  const onBreadcrumbClick = (path: string) => {
    window.location.assign(path);
    gtmAnalytics.pushEvent({
      event: "click",
      linkText: "View Invite users",
      linkUrl: `${envConfig.INVITE_STAFF_URL}`,
      clickType: "link",
      clickLocation: "breadcrumb"
    });
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e?.target?.value?.length === 0) {
      handleClearSearch();
    } else {
      setSearchTerm(e.target.value);
      handleSearch(
        e,
        setSearchLoader,
        setSearchSuggestions,
        setSearchTerm,
        setShowSearchError,
        {
          searchText: e.target.value,
          selectedStatus: statusFilterRef.current
        }
      );
    }
  };

  const [visibleBreadcrumbs, setVisibleBreadcrumbs] =
    useState(breadcrumbActions);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        // md and below
        if (breadcrumbActions.length > 1) {
          setVisibleBreadcrumbs(breadcrumbActions.slice(-2, -1));
        } else {
          setVisibleBreadcrumbs(breadcrumbActions);
        }
      } else {
        setVisibleBreadcrumbs(breadcrumbActions);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="invite-user-container admin-mobile-rwaf92428 admin-console-grid-invite-users">
      {showDialog && <InviteUsersDialog setShowDialog={setShowDialog} />}

      <div className="new-side-panel-invite-users">
        {/* {isMobileView && !isSidebarOpen && (
          <Button
            className="base-class"
            color={ButtonColor.Utility}
            dataTestId="btn-collapse"
            iconColor={IconColor.Neutral800}
            iconName="open-panel--left--filled"
            onClick={toggleSidebar}
            size={ButtonSize.Small}
          />
        )} */}
        <LocalisedMenu
          customHeight={100}
          menuHeading="Admin Console"
          onCloseSideNavigationPanel={closeSidebar}
          isOpenSideNavigation={isSidebarOpen}
          defaultSelectedMenu={{
            text: `${t("inviteUsers.title")}`,
            value: window.location.href
          }}
        />
      </div>

      <div className="new-main-panel-invite-users">
        <div className="flex-row">
          {isMobileView && !isSidebarOpen && (
            <Button
              className="sidepanel-toggle-button"
              color={ButtonColor.Utility}
              dataTestId="btn-collapse"
              iconColor={IconColor.Neutral800}
              iconName="open-panel--left--filled"
              onClick={toggleSidebar}
              size={ButtonSize.Small}
            />
          )}
          <div className="invite-users-breadcrumb">
            <Breadcrumbs
              breadcrumbActions={visibleBreadcrumbs}
              dataTestId="breadcrumb-test-id"
              id="element-id"
              onItemClick={onBreadcrumbClick}
            />
          </div>
        </div>
        <div className="invite-users-table">
          <ControlledList
            className="invite-users-table"
            dataTestId="invite-list-test-id"
            isShowFirstElement
            isBreadCrumbEnable={false}
            isMessageCenterAligned={false}
            isShowAutoSuggest
            isMobileViewBreadcrumb 
            onChangeAllCheckBox={() => null}
            isShowFourthElement={false}
            dynamictableIconName={
              showErrorBanner ? "warning--alt" : "information"
            }
            sortingAlign="left"
            sortingOnClickEvent={(
              e: React.SyntheticEvent,
              columnName: string
            ) => {
              if (
                columnName === `${t("inviteUsers.email")}` ||
                columnName === `${t("inviteUsers.name")}` ||
                columnName === `${t("inviteUsers.inviteRequestDate")}`
              ) {
                setshowInvitationConflictBanner(false);
                let apiColumnName = "EmailId";
                if (columnName === `${t("inviteUsers.name")}`) {
                    apiColumnName = "Forename";
                }
                else if (columnName === `${t("inviteUsers.inviteRequestDate")}`) {
                    apiColumnName = "RequestDate";
                }
                let newDirection = true;

                if (sortBy === apiColumnName) {
                  newDirection = !sortDirection;
                } else {
                  newDirection = true;
                  setSortBy(apiColumnName);
                }

                setSortBy(apiColumnName);
                setSortDirection(newDirection);

                inviteUsersSorting(
                  columnName,
                  newDirection,
                  setSortDirection,
                  setSortBy,
                  currentPage,
                  pageSize,
                  setUsersTableData,
                  setLoader,
                  setShowErrorBanner,
                  setshowInvitationConflictBanner,
                  searchAndStatusFilter
                );
              }
            }}
            dynamictableNoMsgColor={ValidationTextLevel.Warning}
            isShowdynamictableNoMsg={
              showErrorBanner || usersTableData.length === 0
            }
            isAddEventBtnShow={false}
            dynamicTableLoader={isLoader}
            filterDDLOptions={filterOptions}
            isIconRightAligned
            editSelectedBtnTitle={`${t("inviteUsers.editSelected")}`}
            headingText={`${t("inviteUsers.title")}`}
            subHeadingText={`${t("inviteUsers.subTitle")}`}
            id="Inviteusers-list"
            filterDDLuseAutoWidth
            filterDDLisSelected
            filterDDLonSelect={(e, selectedItem) => {
              statusFilterRef.current = selectedItem;
              setSearchAndStatusFilter((prev: any) => ({
                ...prev,
                selectedStatus: selectedItem
              }));
              setCurrentPage(1);
            }}
            filterDDLlabel={`${t("inviteUsers.invitationStatus")}`}
            filterDDLplaceholder="Select"
            filterDDLselectedItem={
              searchAndStatusFilter?.selectedStatus || {
                text: InvitationStatusFilterOptions.All,
                value: "All"
              }
            }
            filterDDLdisabled={false}
            isOnCloseSidepnl
            isPagination={totalPage > 1 && usersTableData.length !== 0}
            lastColContentAlign="center"
            paginationCount={totalPage}
            paginationOnChange={handlePageChange}
            paginationPage={currentPage}
            paginationMinCountToHideNextPreviousBtn={0}
            searchHeadingText={`${t("inviteUsers.searchUser")}`}
            searchPlaceholderText={`${t("inviteUsers.searchByName")}`}
            firstColHeaderAlign="center"
            searchIsLoader={isSearchLoader}
            isSearchHideClearIcon={
              searchAndStatusFilter?.searchText.length === 0
            }
            searchDebouncerTreshold={1000}
            searchValue={searchTerm || ""}
            onKeyUpLenght={2}
            searchOnChange={(e: any) => handleOnChange(e)}
            searchValidationText={
              showSearchError
                ? "Search unavailable. Please try again after sometime"
                : undefined
            }
            searchValidationTextLevel={
              showSearchError ? ValidationTextLevel.Warning : undefined
            }
            setSearchTerm={searchTerm}
            onSearchKeyDown={(e: any) => {
              if (e.key === "Enter") {
                setSearchAndStatusFilter((prev: any) => ({
                  ...prev,
                  searchText: searchTerm
                }));
                setCurrentPage(1);
              }
            }}
            onSearchSuggestionItemClick={(item: ISearchItemProp | null) => {
              setCurrentPage(1);
              setSearchTerm(item?.name || "");
              setSearchAndStatusFilter((prev: any) => ({
                ...prev,
                searchText: item?.name || ""
              }));
            }}
            searchOnCloseHandle={() => {
              handleClearSearch();
            }}
            searchSuggestions={hasItems ? searchSuggestions : []}
            searchTerm=""
            isTruncateInputText
            emptyRowType={TableRowType.Info}
            emptyRowResponseCode={ResponseCode.Info}
            emptyRowResponseMessage={noDataTextToDisplay}
            secondaryButtonTitle={`${t("inviteUsers.cancel")}`}
            showConfirmDialog
            ellipsisAfterBoundaryOnly={smallScreen}
            tableBodyData={ getTableDataArry(usersTableData) || [] }
            isShowEditSelectedBtn
            isShowSearch
            tableFirstColumnWidth="56px"
            tableHeadersData={getTableHeadersData}
            tableLastColumnWidth="10px"
            editSelectedOptions={editSelectedOptions}
            onEditSelectedBtnClick={() => {}}
            onEditSelectedOverFlowMenu={(e: any) => {
              if (e.target?.innerHTML === `${t("inviteUsers.sendInvite")}`) {
                if (selectedCheckBoxIds.length === 0) {
                  setShowDialog(true);
                } else {
                  setSource("Bulk");
                  setSelectedRowItems(
                    usersTableData.filter((user) => user.isCheckboxSelected)
                  );
                  setShowConfirmDialog(true);
                }
              }
            }}
            handleCloseDialogConfirmation={() => {
              setShowConfirmDialog(false);
            }}
            templatePropsConfirmation={{
              cancelText: `${t("inviteUsers.cancel")}`,
              contentText:
                source === "Bulk"
                  ? ""
                  : `${t("inviteUsers.inviteUser?Description")}`,
              isNotificationanner: source === "Bulk",
              notificationTitle: `${t("inviteUsers.sendInviteDescription", {
                NoOfusers: selectedCheckBoxIds.length
              })}`,
              notificationStatus: NotificationStatus.WARNING,
              okText: `${t("inviteUsers.save")}`,
              onCancel: (): void => {
                setShowConfirmDialog(false);
              },
              onConfirm: (): void => {
                setShowConfirmDialog(false);
                const requestBody: IRequestBodyType = {
                  externalId: selectedRowItems.map((item) => item?.id)
                };
                
                gtmAnalytics.pushEvent({
                  event: "change_saved",
                  changeType: "Invite Users",
                  changeValue: selectedRowItems.length.toString()
                });
                                
                handleSendInvite({
                  requestBody,
                  setLoader,
                  setShowInviteErrBanner,
                  setDataUpdated
                });
              },
              template: DialogTemplate.Confirmation
            }}
            titleConfirmation={`${t("inviteUsers.inviteUser?")}`}
            dynamicTableLoaderText={`${t("inviteUsers.pleaseWaitLoader")}`}
            toastNotificationStatus={NotificationStatus.SUCCESSTOAST}
            toastNotificationTitle={toastMessage}
            showToastNotification={showToast}
            toastNotificationAutoclose
            isOpenConfirmationDialog={showConfirmDialog}
            isShowOverflowMenuCol
            globalNotificationBannerOnClickClose={(e, index) => {
              if (index === 0) {
                setShowErrorBanner(false);
              }
              if (index === 1) {
                setshowInvitationConflictBanner(false);
              }
              if (index === 2 || index === 3) {
                setShowInviteErrBanner(false);
              }
            }}
            globalNotificationMsgBannerObject={[
              {
                isShow: !!showErrorBanner,
                variant: "warning",
                title: `${t("inviteUsers.informationUnavailable")}`,
                message: `${t("inviteUsers.technicalIssue")}`,
                autoclose: true
              },
              {
                isShow: !!showInvitationConflictBanner,
                variant: "warning",
                title: `${t("inviteUsers.invitationConflict")}`,
                message: `${t("inviteUsers.invitationConflictDescription")}`,
                autoclose: true
              },
              {
                isShow: !!showInviteErrBanner && source !== "Bulk",
                variant: "warning",
                title: `${t("inviteUsers.unableToSave")}`,
                message: `${t("inviteUsers.unableToSaveDescription")}`,
                autoclose: true
              },
              {
                isShow: !!showInviteErrBanner && source === "Bulk",
                variant: "warning",
                title: `${t("inviteUsers.unableToInvite")}`,
                message: BulkInviteErrBanner({ selectedRowItems }),
                autoclose: true
              }
            ]}
            onClickOverflowItem={(e: any, selectedRow: any) => {
              if (e.target?.innerHTML === `${t("inviteUsers.sendInvite")}`) {
                setSource("Overflow");
                setShowConfirmDialog(true);
                setSelectedRowItems([selectedRow]);
              }
            }}
            onChangeListCheckBox={(index: number, id: string) => {
              handleCheckBoxSelection({
                id,
                selectedCheckBoxIds,
                setSelectedCheckBoxIds
              });
            }}
            isClearSelectedCheckbox={selectedCheckBoxIds.length === 0}
            selectedCheckboxIds={(ids: string[]) => {
              setSelectedCheckBoxIds(ids);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export const NoDataMessage = {
  noDataOnSearch: (keyword: string) =>
    `Your search - ${keyword} - did not match any results. Make sure that all the words are spelled correctly.`,
  noDataToDisplay: "No data to display"
};

export const getValues = (
  data: IInviteUserDetails[]
): Array<{
  text: string;
  props: {
    externalId: string;
    name: string;
  };
  value: JSX.Element;
}> =>
  data
    .filter(
      (record: IInviteUserDetails) =>
        record?.externalId && record?.externalId !== undefined
    )
    .map((record: IInviteUserDetails) => ({
      text: `${record?.forename} ${record?.surname} `,
      props: {
        externalId: record?.externalId,
        name: `${record?.forename} ${record?.surname}`
      },
      value: <></>
    }));
