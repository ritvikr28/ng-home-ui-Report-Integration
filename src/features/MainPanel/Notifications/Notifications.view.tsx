/* eslint-disable @typescript-eslint/no-unused-vars */
import { Breadcrumbs, ControlledList, NotificationStatus, DialogTemplate, ResponseCode, Button, ButtonColor, ButtonSize, IconColor, ButtonIconPosition } from "@essnextgen/ui-kit";
import React from "react";
import "./style.scss";
import { getNotificationTableHeadersData, notificationTableRows } from "./helper";
import FilterDialogLogic from "./components/FilterDialogComponent/FilterDialog.logic";
import { useNotification } from "./useNotification";

const NotificationView = () => {
    const { filterBtnClicked, setFilterBtnClicked } = useNotification();
    const [sideIsOpen, setSideIsOpen] = React.useState(false);
    return (
        <div className="ctf-layout" data-testid="ctf-layout">
            <div style={{ marginBottom: 16, width: "100%" }}>
                <div className="notification-layout-header">
                    <Breadcrumbs
                        breadcrumbActions={[
                            { active: false, linkName: "Home", path: window.location.origin },
                            { active: false, linkName: "Notification Center", path: "#" }
                        ]}
                        className="essui-Breadcrumbs"
                        dataTestId="breadcrumb-test-id"
                        id="element-id"
                        onItemClick={(path: string) => {
                            window.location.href = path;
                        }}
                    />
                    <div className="notification-controlledlist-width">
                        <ControlledList
                            tooltipBottomAligned={true}
                            data-testid="controlled-list"
                            globalNotificationMsgBannerObject={
                                null
                            }
                            // addEventBtnTitle="Generate CTF export"
                            isAddEventBtnShow={false}
                            dataTestId="controlled-list-test-id"
                            filterDDLOptions={[]}
                            isShowSearch={true}
                            isShowFirstElement={true}
                            isShowFourthElement={true}
                            filterCustumeElem2={<>
                                <Button
                                    className="base-class"
                                    color={ButtonColor.Utility}
                                    dataTestId="btn-save"
                                    onClick={() => {
                                        console.log("Filter Clicked")
                                        setFilterBtnClicked(true)
                                    }}
                                    size={ButtonSize.Small}
                                    iconName="filter"
                                    iconColor={IconColor.Neutral800}
                                    iconPosition={ButtonIconPosition.Right}
                                >
                                    Filter
                                </Button>
                            </>}
                            editSelectedBtnTitle="Edit Selected"
                            editSelectedOptions={[
                                {
                                    "disabled": false,
                                    "text": "Make active",
                                    "value": "Active"
                                },
                                {
                                    "disabled": false,
                                    "text": "Make inactive",
                                    "value": "Inactive"
                                },
                                {
                                    "disabled": false,
                                    "isSelected": false,
                                    "text": "Delete",
                                    "value": "Delete",
                                    "isShowDivider": true
                                }
                            ]}
                            emptyStateMsg="CTF will appear here once they are generated"
                            onAddEventBtnClick={() => { }}
                            groupTagsEnabled
                            headingText="Notification Centre"
                            secondSubheading={[
                                ""
                            ]}
                            id="controlled-list"
                            isBreadCrumbEnable={false}
                            isOnCloseSidepnl
                            lastColContentAlign="center"
                            lastColHeaderAlign="center"

                            paginationMinCountToHideNextPreviousBtn={0}
                            isShowPrimaryBtn={false}
                            resultNotFoundMessage=""
                            showConfirmDialog
                            subHeadingText=""
                            tableBodyData={notificationTableRows as any}
                            tableFirstColumnWidth="10px"
                            tableHeadersData={getNotificationTableHeadersData(setSideIsOpen) as any}
                            tableLastColumnWidth="10px"
                            templatePropsConfirmation={{
                                cancelText: "Cancel",
                                contentText: "You have unsaved changes that will be lost.",
                                isNotificationanner: false,
                                notificationStatus: NotificationStatus.SUCCESS,
                                okText: "Discard",
                                onCancel: () => { },
                                onConfirm: () => { },
                                template: DialogTemplate.Confirmation
                            }}
                            titleConfirmation="Discard changes disduasi?"
                            toastNotificationStatus={NotificationStatus.SUCCESS}
                            toastNotificationTitle=""
                            isOpenConfirmationDialog={false}
                            isIconRightAligned={true}
                            isShowOverflowMenuCol={false}
                            searchHeadingText="Search by"
                            isSidePanelOpen={sideIsOpen}
                            dynamicTableLoader={false}
                            onClickSidePnlSecondaryBtn={() => { setSideIsOpen(false) }}
                            handleCloseSidePanel={() => { setSideIsOpen(false) }}
                            addEditTemplateChild={() => { }}
                            sidePanelTitle="View"
                            sidePanelSubTitle=""
                            onClickOverflowItem={() => { }}
                            secondaryButtonTitle="Close"
                            isShowCheckboxCol={true}
                            isShowThirdElement={true}
                            isShowdynamictableNoMsg={false}
                            emptyRowResponseMessage="No data retrieved"
                            emptyRowResponseCode={ResponseCode.Error}
                            isPagination
                            paginationCount={
                                5
                            }
                            paginationOnChange={() => { }}
                            paginationPage={1}
                        />
                    </div>
                    {filterBtnClicked && <FilterDialogLogic setFilterBtnClicked={setFilterBtnClicked} />}

                </div>
            </div>
        </div>
    )
}

export default NotificationView;