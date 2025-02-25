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

const InviteUserView : React.FC<InviteUserProps> = ({
  
}) => {
  const isMobileView: boolean = useMediaQuery(
    "(min-width:320px) and (max-width: 1023.9px)"
  );

  const [isOpen, setIsOpen] = useState<boolean>(!isMobileView);

  const handleButtonClick = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    setIsOpen(!isMobileView);
  }, [isMobileView]);

  return (
    <Grid className="dms-layout" style={{ display: "flex" }} >
      <GridItem className={isOpen ? "side-width" : "no-side-width"}>
        {!isOpen && (
          <Button
            className="base-class"
            color={ButtonColor.Utility}
            dataTestId="btn-collapse"
            iconColor={IconColor.Neutral800}
            iconName="open-panel--left--filled"
            onClick={handleButtonClick}
            size={ButtonSize.Small}
          />
        )}
        <LocalisedMenu
          customHeight={100}
          menuHeading="Admin Console"
          onCloseSideNavigationPanel={() => setIsOpen(false)}
          isOpenSideNavigation={isOpen}
          defaultSelectedMenu={{
            text: "Invite users",
            value: `${window.location.origin}/inviteusers`,
          }}
        />
      </GridItem>
      <GridItem className={isOpen ? "clc-dms-isopen" : "clc-dms-isclose"}>
        <div style={{ marginBottom: 16, width: "100%" }}>
          <Breadcrumbs
            breadcrumbActions={breadcrumbActions}
            className="essui-Breadcrumbs"
            dataTestId="breadcrumb-test-id"
            id="element-id"
            onItemClick={() => {}}
          />
          <ControlledList
            {...getDefaultControlledListProps()}
            isAddEventBtnShow={false}
            dataTestId="invite-user-list-test-id"
            filterDDLOptions={[
              { id: "1", text: "All", value: "All" }
            ]}
            editSelectedBtnTitle="Edit selected"
            headingText="Invite users"
            subHeadingText="Invite SIMS 7 users to access SIMS Next Gen"
            id="Inviteusers-list"
            filterDDLuseAutoWidth={true}
            filterDDLisSelected={true}
            filterDDLlabel="Invitation Status"
            filterDDLplaceholder="Select"
            filterDDLselectedItem={{ text: "All", value: "All" }}
            filterDDLdisabled={false}
            isOnCloseSidepnl
            sortingAlign="left"
            paginationCount={4}
            paginationMinCountToHideNextPreviousBtn={0}
            resultNotFoundMessage=""
            searchHeadingText="Search Users"
            searchPlaceholderText="Text"
            searchTerm=""
            secondaryButtonTitle="Cancel"
            showConfirmDialog
            tableBodyData={tableDataObj}
            isShowEditSelectedBtn={true}
            isShowSearch={true}
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
              onCancel: function noRefCheck() {},
              onConfirm: function noRefCheck() {},
              template: DialogTemplate.Confirmation,
            }}
            titleConfirmation="Discard changes?"
            toastNotificationStatus={NotificationStatus.SUCCESS}
            toastNotificationTitle=""
            isOpenConfirmationDialog={false}
            isShowOverflowMenuCol={true}
            isPagination={true}
            globalNotificationMsgBannerObject={[
              {
                autoclose: false,
                isShow: true,
                message: 'To manage user email name and role, please access SIMS7.',
                title: 'User details are managed in SIMS7',
                variant: 'highlight',
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
