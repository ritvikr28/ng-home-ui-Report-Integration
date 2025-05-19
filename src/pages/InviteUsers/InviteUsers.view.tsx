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
import { fetchInviteUserDetails } from "./InviteUsersUtils";

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

  useEffect(() => {
    setIsSidebarOpen(!isMobileView);
  }, [isMobileView]);
  useEffect(() => {
    setLoader(true);
    fetchInviteUserDetails({
      pageNumber: currentPage,
      pageSize,
      setTotalPage,
      setShowErrorBanner,
      setshowInvitationConflictBanner
    }).then((res) => {
      setLoader(false);
      setUsersTableData(res);
    });
  }, [currentPage]);

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

  const onBreadcrumbClick: (breadcrumb: string) => void = () => {
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
          sortingAlign="left"
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
          templatePropsConfirmation={{
            cancelText: "Cancel",
            contentText: "You have unsaved changes that will be lost.",
            isNotificationanner: false,
            notificationStatus: NotificationStatus.SUCCESS,
            okText: "Discard",
            onCancel: (): void => {},
            onConfirm: (): void => {},
            template: DialogTemplate.Confirmation
          }}
          titleConfirmation="Discard changes?"
          toastNotificationStatus={NotificationStatus.SUCCESS}
          toastNotificationTitle=""
          isOpenConfirmationDialog={false}
          isShowOverflowMenuCol
          globalNotificationBannerOnClickClose={() => {
            setShowErrorBanner(false);
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
            }
          ]}
        />
      </GridItem>
    </Grid>
  );
};

export default InviteUserView;
