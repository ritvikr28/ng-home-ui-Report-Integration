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
  useMediaQuery
} from "@essnextgen/ui-kit";
import React, { useState, useEffect } from "react";
import {
  breadcrumbActions,
  editSelectedOptions,
  getDefaultControlledListProps,
  getTableHeadersData,
  InviteUserProps,
  tableDataObj
} from "./InviteUsersProps";
import "./style.scss";

const InviteUserView: React.FC<InviteUserProps> = () => {
  const isMobileView: boolean = useMediaQuery(
    "(min-width:320px) and (max-width: 1023.9px)"
  );

  const [isSidebarOpen, setIsSidebarOpen]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(!isMobileView);

  useEffect(() => {
    setIsSidebarOpen(!isMobileView);
  }, [isMobileView]);

  const toggleSidebar: () => void = (): void => {
    setIsSidebarOpen((prev: boolean): boolean => !prev); 
  };

  const closeSidebar: () => void = (): void => {
    setIsSidebarOpen(false); 
  };
  

  const onBreadcrumbClick: (breadcrumb: string) => void = () => {};

  return (
    <Grid className="dms-layout" style={{ display: "flex" }}>
      <GridItem className={isSidebarOpen ? "side-width" : "no-side-width"}>
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
        <LocalisedMenu
          customHeight={100}
          menuHeading="Admin Console"
          onCloseSideNavigationPanel={closeSidebar}
          isOpenSideNavigation={isSidebarOpen}
          defaultSelectedMenu={{
            text: "Invite users",
            value: `${window.location.origin}/inviteusers`
          }}
        />
      </GridItem>
      <GridItem className={isSidebarOpen ? "clc-dms-isopen" : "clc-dms-isclose"}>
        <div className="invite-users-table-align" style={{ marginBottom: 16, width: "100%" }}>
          <Breadcrumbs
            breadcrumbActions={breadcrumbActions}
            className="essui-Breadcrumbs"
            dataTestId="breadcrumb-test-id"
            id="element-id"
            onItemClick={onBreadcrumbClick}
          />
          <ControlledList
            {...getDefaultControlledListProps()}
            isAddEventBtnShow={false}
            dataTestId="invite-user-list-test-id"
            filterDDLOptions={[{ id: "1", text: "All", value: "All" }]}
            editSelectedBtnTitle="Edit selected"
            headingText="Invite users"
            subHeadingText="Invite SIMS 7 users to access SIMS Next Gen"
            id="Inviteusers-list"
            filterDDLuseAutoWidth={true}
            filterDDLisSelected={true}
            filterDDLlabel="Invitation status"
            filterDDLplaceholder="Select"
            filterDDLselectedItem={{ text: "All", value: "All" }}
            filterDDLdisabled={false}
            isOnCloseSidepnl
            sortingAlign="left"
            paginationCount={4}
            paginationMinCountToHideNextPreviousBtn={0}
            resultNotFoundMessage=""
            searchHeadingText="Search user"
            searchPlaceholderText="Text"
            searchTerm=""
            secondaryButtonTitle="Cancel"
            showConfirmDialog
            tableBodyData={tableDataObj}
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
            isPagination
            globalNotificationMsgBannerObject={[
              {
                autoclose: false,
                isShow: true,
                message: "To manage user email name and role, please access SIMS7.",
                title: "User details are managed in SIMS7",
                variant: "highlight",
                hideCloseButton: true
              }
            ]}
          />
        </div>
      </GridItem>
    </Grid>
  );
};

export default InviteUserView;
