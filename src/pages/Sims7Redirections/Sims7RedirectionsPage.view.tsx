import React, { useEffect, useState } from "react";
import { LocalisedMenu } from "@essnextgen/ui-application-kit";
import {
    Button,
    ButtonColor,
    ButtonIconPosition,
    ButtonSize,
    ControlledList,
    DialogTemplate,
    IconColor,
    NotificationStatus,
    ResponseCode,
    Link,
    Breadcrumbs,
    useMediaQuery,
    IBreadcrumbLink
} from "@essnextgen/ui-kit";
import {
    useTranslation,
    UseTranslationResponse
} from "@essnextgen/ui-intl-kit";
import Sims7RedirectionsSidePanel from "./Sims7RedirectionsSidePanel";
import { homeurl } from "../InviteUsers/InviteUsersProps";
import {
    sims7RedirectionsTableHeaders,
    sims7RedirectionsTableData
} from "./Sims7RedirectionsPage.data";

export const Sims7RedirectionsPage = () => {
    const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
    const [sidePanelMode, setSidePanelMode] = useState<'view' | 'edit'>('view');
    const [selectedRow, setSelectedRow] = useState<any>(null);

    const handleCloseSidePanel = () => {
        setIsSidePanelOpen(false);
        setSelectedRow(null);
    };

    const handleViewClick = (rowData: any) => {
        setSelectedRow(rowData);
        setSidePanelMode('view');
        setIsSidePanelOpen(true);
    };

    const handleEditClick = (rowData: any) => {
        setSelectedRow(rowData);
        setSidePanelMode('edit');
        setIsSidePanelOpen(true);
    };

    const isMobileView: boolean = useMediaQuery(
        "(min-width:320px) and (max-width: 1023.9px)"
    );

    const [isSidebarOpen, setIsSidebarOpen]: [
        boolean,
        React.Dispatch<React.SetStateAction<boolean>>
    ] = useState<boolean>(!isMobileView);

    const closeSidebar: () => void = (): void => {
        setIsSidebarOpen(false);
    };

    const { t }: UseTranslationResponse<"translation", undefined> =
        useTranslation();

    useEffect(() => {
        document.body.classList.add("no-scroll");
    }, []);

    const toggleSidebar: () => void = (): void => {
        setIsSidebarOpen((prev: boolean): boolean => !prev);
    };

    const sims7RedirectionsBreadcrumbs: IBreadcrumbLink[] = [
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
            linkName: `${t("SIMS7Redirects.title")}`,
            path: "/"
        }
    ];

    return (
        <div className="invite-user-container admin-mobile-rwaf92428 admin-console-grid-invite-users sims7-redirections">
            <div className="new-side-panel-invite-users">
                <LocalisedMenu
                    customHeight={100}
                    menuHeading="Admin Console"
                    onCloseSideNavigationPanel={closeSidebar}
                    isOpenSideNavigation={isSidebarOpen}
                    defaultSelectedMenu={{
                        text: `${t("SIMS7Redirects.title")}`,
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
                            breadcrumbActions={sims7RedirectionsBreadcrumbs}
                            dataTestId="breadcrumb-test-id"
                            id="element-id"
                            onItemClick={(path: string) => {
                                window.location.href = path;
                            }}
                        />
                    </div>
                </div>

                <ControlledList
                    tooltipBottomAligned={true}
                    data-testid="controlled-list"
                    globalNotificationMsgBannerObject={null}
                    isAddEventBtnShow={false}
                    dataTestId="controlled-list-test-id"
                    filterDDLOptions={[]}
                    isShowSearch={true}
                    isShowFirstElement
                    isShowEditSelectedBtn={false}
                    isShowFourthElement={false}
                    filterCustumeElem2={
                        <div className="notification-controls">
                            <Button
                                className="base-class"
                                color={ButtonColor.Utility}
                                data-testid="filter"
                                onClick={() => { }}
                                size={ButtonSize.Small}
                                iconName="filter"
                                iconColor={IconColor.Neutral800}
                                iconPosition={ButtonIconPosition.Right}
                            >
                                Filter
                            </Button>
                        </div>
                    }
                    emptyStateMsg={t("SIMS7Redirects.emptyStateMsg")}
                    isShowEmptyAddBtn={false}
                    onAddEventBtnClick={() => { }}
                    groupTagsEnabled
                    headingText={t("SIMS7Redirects.title")}
                    isShowSubHeading
                    subHeadingText={`${t("SIMS7Redirects.subTitle")}`}
                    isShowSecondSubheadingWithLink
                    isFullWidthForSecondSubHeading
                    secondSubheadingwithLink={
                        <Link href="https://example.com" target="_blank" >
                            {`${t("SIMS7Redirects.secondSubheadingwithLink")}`}
                        </Link>
                    }
                    id="controlled-list"
                    isBreadCrumbEnable={false}
                    isOnCloseSidepnl
                    lastColContentAlign="center"
                    lastColHeaderAlign="center"
                    paginationMinCountToHideNextPreviousBtn={0}
                    isShowPrimaryBtn={false}
                    isShowdynamictableNoMsg
                    emptyRowResponseMessage={`${t("SIMS7Redirects.emptyRowResponseMessage")}`}
                    showConfirmDialog
                    tableBodyData={sims7RedirectionsTableData}
                    tableFirstColumnWidth="10px"
                    tableHeadersData={sims7RedirectionsTableHeaders}
                    tableLastColumnWidth="10px"
                    isSorting={true}
                    sortByDefault={false}
                    sortAscFirst={false}
                    sortingOnClickEvent={() => { }}
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
                    isOpenConfirmationDialog={false}
                    isIconRightAligned={true}
                    isShowOverflowMenuCol={true}
                    onClickOverflowItem={(e, rowData) => {
                        const text = (e.target as HTMLElement).innerText.trim();
                        if (text === "View") {
                            handleViewClick(rowData);
                        } else if (text === "Edit") {
                            handleEditClick(rowData);
                        }
                    }}
                    searchHeadingText={`${t("SIMS7Redirects.searchHeadingText")}`}
                    isSearchHideClearIcon={true}
                    dynamicTableLoader={false}
                    onClickSidePnlSecondaryBtn={() => { }}
                    handleCloseSidePanel={() => { }}
                    sidePanelTitle="View"
                    sidePanelSubTitle=""
                    addEditTemplateChild={() =>
                        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                            <div style={{ fontSize: "20px", fontWeight: 400, lineHeight: "24px" }}>{null}</div>
                            <div style={{ fontSize: "16px", fontWeight: 400, lineHeight: "24px" }}>
                                The role Headteacher has been updated by the Trust and is now ready for use.
                                Historical data will not be affected.Historical data will not be affected.
                            </div>
                        </div>
                    }
                    secondaryButtonTitle="Close"
                    isShowCheckboxCol={false}
                    isShowThirdElement={true}
                    emptyRowResponseCode={ResponseCode.Info}
                    isPagination={false}
                    paginationCount={5}
                    paginationOnChange={() => { }}
                />

                <Sims7RedirectionsSidePanel
                    isOpen={isSidePanelOpen}
                    onClose={handleCloseSidePanel}
                    mode={sidePanelMode}
                    selectedRow={selectedRow}
                    t={t}
                    setSidePanelMode={setSidePanelMode}
                />
            </div>
        </div>
    );
}
export default Sims7RedirectionsPage;
