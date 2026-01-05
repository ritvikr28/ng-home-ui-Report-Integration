import React, { ChangeEvent, useEffect, useState } from "react";
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
    IBreadcrumbLink,
    Dropdown,
    DropdownItem,
    ISelectedItem,
    FormLabel,
    Dialog,
    DialogContent,
    DialogFooter
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

interface DropdownItemType {
    id: string;
    text: string;
    value: string;
}
const dropdownItems: DropdownItemType[] = [
    { id: "1", text: "Migrated", value: "migrated" },
    { id: "2", text: "Not migrated", value: "not_migrated" },
    { id: "3", text: "Planned", value: "planned" },
    { id: "4", text: "Permanent", value: "permanent" },
    { id: "5", text: "Reversing", value: "reversing" }
];

export const Sims7RedirectionsPage = () => {
    const isMobileView: boolean = useMediaQuery(
        "(min-width:320px) and (max-width: 1023.9px)"
    );
    const originalTableData = sims7RedirectionsTableData;
    const [selectedItems, setSelectedItems] = React.useState<ISelectedItem[]>([]);
    const [searchTagList, setSearchTagList] = React.useState<ISelectedItem[]>([]);
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [isDropDownOpen, setIsDropDownOpen] = React.useState(false);
    const [isSidePanelOpen, setIsSidePanelOpen] = React.useState(false);
    const [sidePanelMode, setSidePanelMode] = React.useState<'view' | 'edit'>('view');
    const [selectedRow, setSelectedRow] = React.useState<any>(null);
    // const [dropdownResetKey, setDropdownResetKey] = React.useState(0);
    const [isSidebarOpen, setIsSidebarOpen]: [
        boolean,
        React.Dispatch<React.SetStateAction<boolean>>
    ] = useState<boolean>(!isMobileView);

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

    const handleOpenDialog = () => {
        setSelectedItems(searchTagList);
        setIsDialogOpen(true);
    }
    const handleCloseDialog = () => setIsDialogOpen(false);
    const handleClearAll = () => {
        setIsDropDownOpen(false);
        setIsDialogOpen(true);
        setSelectedItems([]);
        // setDropdownResetKey(prev => prev + 1); // force Dropdown to remount/close
    };

    const handleApplyDialog = () => {
        setSearchTagList(
            selectedItems.map(item => ({
                ...item,
                text: item.text ?? ""
            }))
        );
        setIsDropDownOpen(false);
        setIsDialogOpen(false);
    };

    const filteredTableData = React.useMemo(() => {
        if (!searchTagList.length) {
            return originalTableData;
        }

        const valueToDisplay: Record<string, string> = {
            migrated: "Migrated",
            not_migrated: "Not migrated",
            planned: "Planned",
            permanent: "Permanent",
            reversing: "Reversing"
        };
        const selectedDisplayValues = searchTagList.map(item => valueToDisplay[item.value ?? ""]);

        return originalTableData.filter(row =>
            selectedDisplayValues.includes(row.status)
        );
    }, [searchTagList, originalTableData]);

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

    const [currentPage, setCurrentPage] = useState<number>(1);
    const pageSize = 5; // same as paginationCount
    const paginatedTableData = React.useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        return filteredTableData.slice(startIndex, endIndex);
    }, [filteredTableData, currentPage]);
    const handlePaginationChange = (
        _event: ChangeEvent<unknown>,
        page: number
    ) => {
        setCurrentPage(page);
    };
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTagList]);

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
                            ariaLabel="side-panel-open-button"
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
                                onClick={handleOpenDialog}
                                size={ButtonSize.Small}
                                iconName="filter"
                                iconColor={IconColor.Neutral800}
                                iconPosition={ButtonIconPosition.Right}
                            >
                                Filter
                            </Button>
                        </div>
                    }
                    searchTagList={searchTagList.map(item => ({
                        ...item,
                        text: item.text ?? ""
                    }))}
                    emptyStateMsg={t("SIMS7Redirects.emptyStateMsg")
                    }
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
                    emptyRowResponseMessage={
                        t("SIMS7Redirects.emptyRowResponseMessage")
                    }
                    showConfirmDialog
                    tableBodyData={paginatedTableData}
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
                    isPagination={true}
                    paginationCount={Math.ceil(filteredTableData.length / pageSize)}
                    paginationOnChange={handlePaginationChange}
                    hideCloseBtn

                />

                <Dialog isOpen={isDialogOpen} onClose={handleCloseDialog} escapeExits={true}>
                    <DialogContent className={isDropDownOpen ? "dialog-with-dropdown" : "dialog-content"}>
                        <>
                            <FormLabel>Status</FormLabel>
                            <Dropdown
                                //  key={dropdownResetKey}
                                multiSelect={true}
                                selectedItems={selectedItems}
                                onSelectMultiple={(e: React.SyntheticEvent, selected: ISelectedItem[]) =>
                                    setSelectedItems(selected)
                                }
                                isFixedMultiSelect={true}
                                onClick={() => { setIsDropDownOpen(!isDropDownOpen) }}
                            >
                                {dropdownItems.map(item => (
                                    <DropdownItem
                                        key={item.id}
                                        id={item.id}
                                        text={item.text}
                                        value={item.value}
                                    >
                                        {item.text}
                                    </DropdownItem>
                                ))}
                            </Dropdown>
                        </>
                    </DialogContent>
                    <DialogFooter className="dialog-actions">
                        <Button dataTestId="close-btn" onClick={handleClearAll} color={ButtonColor.Secondary}>
                            clear All
                        </Button>
                        <Button dataTestId="close-btn" onClick={handleApplyDialog}>
                            Apply
                        </Button>
                    </DialogFooter>
                </Dialog>
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
