import { LocalisedMenu } from "@essnextgen/ui-application-kit";
import {
  Grid,
  GridItem,
  Button,
  ButtonColor,
  IconColor,
  ButtonSize,
  Breadcrumbs,
  ControlledList,
  DialogTemplate,
  NotificationStatus,
  useMediaQuery,
  ValidationTextLevel
} from "@essnextgen/ui-kit";
import React, { useState, useEffect } from "react";
import {
  breadcrumbActions,
  editSelectedOptions,
  filterOptions,
  getTableHeadersData,
  InviteUserProps,
  pageSize
} from "./InviteUsersProps";
import "./style.scss";
import gtmAnalytics from "../../shared/utils/analytics";
import { envConfig } from "../../shared/utils";
import {
  fetchInviteUserDetails,
  handleCheckBoxSelection,
  handleSelectedUserData,
  handleSendInvite,
  inviteUsersSorting
} from "./InviteUsersUtils";
import InviteUsersDialog from "./InviteUsersDialog";

const InviteUserView: React.FC<InviteUserProps> = (props) => {
  const {
    usersTableData,
    setUsersTableData,
    totalPage,
    setTotalPage,
    currentPage,
    handlePageChange,
    isLoader,
    setLoader,
    showInvitationConflictBanner,
    setshowInvitationConflictBanner
  } = props;
  const isMobileView: boolean = useMediaQuery(
    "(min-width:320px) and (max-width: 1023.9px)"
  );
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
  const [sortBy, setSortBy] = useState<string>("Forename");
  const [sortDirection, setSortDirection] = useState<boolean>(true);
  const [showConfirmDialog, setShowConfirmDialog]: [
    boolean,
    React.Dispatch<React.SetStateAction<boolean>>
  ] = useState<boolean>(false);
  const [selectedRowItem, setSelectedRowItem] = useState<any>(null);
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
      setTotalPage,
      setShowErrorBanner,
      setshowInvitationConflictBanner
    }).then((res) => {
      setLoader(false);
      setUsersTableData(res);
      setDataUpdated(false);
    });
  }, [currentPage, isDataUpdated]);

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

  return (
    <Grid className="admin-mobile-rwaf92428">
      {showDialog && <InviteUsersDialog setShowDialog={setShowDialog} />}

      <GridItem className={isSidebarOpen ? "side-width" : "no-side-width"}>
        <LocalisedMenu
          customHeight={100}
          menuHeading="Admin Console"
          onCloseSideNavigationPanel={closeSidebar}
          isOpenSideNavigation={isSidebarOpen}
          defaultSelectedMenu={{
            text: "Invite Users",
            value: `${window.location.origin}/inviteusers`
          }}
        />
      </GridItem>
      <GridItem
        className={isSidebarOpen ? "clc-dms-isopen" : "clc-dms-isclose"}
      >
        <div style={{ display: "flex" }}>
          {!isSidebarOpen && (
            <Button
              className="base-class"
              color={ButtonColor.Utility}
              dataTestId="btn-collapse"
              iconColor={IconColor.Neutral800}
              iconName="open-panel--left--filled"
              onClick={toggleSidebar}
              size={ButtonSize.Small}
            />
          )}
          <Breadcrumbs
            breadcrumbActions={breadcrumbActions}
            className="essui-Breadcrumbs"
            dataTestId="breadcrumb-test-id"
            id="element-id"
            onItemClick={onBreadcrumbClick}
          />
        </div>
        <ControlledList
          className="invite-users-table"
          dataTestId="invite-list-test-id"
          isShowFirstElement
          isBreadCrumbEnable={false}
          resultNotFoundMessage="No data to display"
          dynamictableIconName={
            showErrorBanner ? "warning--alt" : "information"
          }
          sortingAlign="left"
          sortingOnClickEvent={(
            e: React.SyntheticEvent,
            columnName: string
          ) => {
            setshowInvitationConflictBanner(false);
            const apiColumnName =
              columnName === "Name" ? "Forename" : "EmailId";
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
              setshowInvitationConflictBanner
            );
          }}
          dynamictableNoMsgColor={ValidationTextLevel.Warning}
          isShowdynamictableNoMsg={showErrorBanner}
          isAddEventBtnShow={false}
          dynamicTableLoader={isLoader}
          filterDDLOptions={filterOptions}
          editSelectedBtnTitle="Edit selected"
          headingText="Invite Users"
          subHeadingText="Invite SIMS 7 users to access SIMS Next Gen"
          id="Inviteusers-list"
          filterDDLuseAutoWidth
          filterDDLisSelected
          filterDDLlabel="Invitation status"
          filterDDLplaceholder="Select"
          filterDDLselectedItem={{ text: "All", value: "All" }}
          filterDDLdisabled={false}
          isOnCloseSidepnl
          isPagination
          paginationCount={totalPage}
          paginationOnChange={handlePageChange}
          paginationPage={currentPage}
          paginationMinCountToHideNextPreviousBtn={0}
          searchHeadingText="Search user"
          searchPlaceholderText="Text"
          searchTerm=""
          secondaryButtonTitle="Cancel"
          showConfirmDialog
          tableBodyData={usersTableData || []}
          isShowEditSelectedBtn
          isShowSearch
          tableFirstColumnWidth="56px"
          tableHeadersData={getTableHeadersData}
          tableLastColumnWidth="10px"
          editSelectedOptions={editSelectedOptions}
          onEditSelectedBtnClick={() => {}}
          onEditSelectedOverFlowMenu={(e: any) => {
            if (e.target?.innerHTML === "Send invite") {
              if (selectedCheckBoxIds.length === 0) {
                setShowDialog(true);
              }
            }
          }}
          handleCloseDialogConfirmation={() => {
            setShowConfirmDialog(false);
          }}
          templatePropsConfirmation={{
            cancelText: "Cancel",
            contentText:
              "This user will be sent an invite to access the system.",
            isNotificationanner: false,
            notificationStatus: NotificationStatus.SUCCESS,
            okText: "Save",
            onCancel: (): void => {
              setShowConfirmDialog(false);
            },
            onConfirm: (): void => {
              setShowConfirmDialog(false);
              handleSendInvite({
                selectedRowItem,
                setLoader,
                setShowInviteErrBanner,
                setDataUpdated
              });
            },
            template: DialogTemplate.Confirmation
          }}
          titleConfirmation="Invite user?"
          toastNotificationStatus={NotificationStatus.SUCCESS}
          toastNotificationTitle=""
          isOpenConfirmationDialog={showConfirmDialog}
          isShowOverflowMenuCol
          globalNotificationBannerOnClickClose={() => {
            setShowErrorBanner(false);
            setShowInviteErrBanner(false);
            setshowInvitationConflictBanner(false);
          }}
          globalNotificationMsgBannerObject={[
            {
              autoclose: false,
              isShow: true,
              message:
                "To manage user email name and role, please access SIMS7.",
              title: "User details are managed in SIMS7",
              variant: "highlight",
              hideCloseButton: true
            },
            {
              isShow: !!showErrorBanner,
              variant: "warning",
              title: "Information unavailable",
              message:
                "A technical issue at our end has stopped us from displaying all information. Please try again later. If the issue persists, please get in touch with our support team.",
              autoclose: true
            },
            {
              isShow: !!showInvitationConflictBanner,
              variant: "warning",
              title: "Invitation conflict",
              message:
                "There is an invitation conflict with some users on this list because they are associated with more than one SIMS ID account. Please contact our Service Desk team for assistance in resolving this issue.",
              autoclose: true
            },
            {
              isShow: !!showInviteErrBanner,
              variant: "warning",
              title: "Unable to save",
              message:
                "A technical issue at our end has stopped us from saving the changes. Please try again. If the issue persists, please get in touch with our support team. We appreciate your patience and understanding during this time.",
              autoclose: true
            }
          ]}
          onClickOverflowItem={(e: any, selectedRow: any) => {
            if (e.target?.innerHTML === "Send Invite") {
              setShowConfirmDialog(true);
              setSelectedRowItem(selectedRow);
            }
          }}
          onChangeListCheckBox={(index: number, id: string) => {
            handleCheckBoxSelection({
              id,
              selectedCheckBoxIds,
              setSelectedCheckBoxIds
            });
          }}
          selectedCheckboxIds={(ids: string[]) => {
            setSelectedCheckBoxIds(ids);
          }}
        />
      </GridItem>
    </Grid>
  );
};

export default InviteUserView;
