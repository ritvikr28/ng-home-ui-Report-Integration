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
    Breadcrumbs,
    useMediaQuery,
    IBreadcrumbLink,
    Dropdown,
    DropdownItem,
    ISelectedItem,
    FormLabel,
    Dialog,
    DialogContent,
    DialogFooter,
    TableRowType
} from "@essnextgen/ui-kit";
import {
    useTranslation,
    UseTranslationResponse
} from "@essnextgen/ui-intl-kit";
import Sims7RedirectionsSidePanel from "./Sims7RedirectionsSidePanel";
import { homeurl } from "../InviteUsers/InviteUsersProps";
import {
    sims7RedirectionsTableHeaders,
    Sims7RedirectionsTableRow
} from "./Sims7RedirectionsPage.data";
import { mapSims7RedirectionsItem } from "./Sims7RedirectionsMapper";
import { fetchSims7Redirections } from "./Sims7RedirectionsPage.api";
import { handleOverflowAction, getNextSortOrder } from "./Sims7RedirectionsPage.handlers";

interface DropdownItemType {
    id: string;
    text: string;
    value: string;
}
const dropdownItems: DropdownItemType[] = [
    { id: "1", text: "Migrated", value: "Migrated" },
    { id: "2", text: "Not Migrated", value: "NotMigrated" },
    { id: "3", text: "Planned", value: "Planned" },
    { id: "4", text: "Permanent", value: "Permanent" },
    { id: "5", text: "Reversing", value: "Reversing" },
    { id: "6", text: "Pending", value: "Pending" },
    { id: "7", text: "Cancelled", value: "Cancelled" }
];

export const Sims7RedirectionsPage: React.FC = () => {
    // Column mapping: frontend to backend
    const columnMapping: Record<string, string> = {
        "Category": "ngComponent",
        "Next Gen module": "ngModule",
        "SIMS 7 module": "sims7Module",
        "Modified by": "updatedBy",
        "Effective date": "effectiveDate",
        "Status": "redirectStatus"
    };
    const isMobileView: boolean = useMediaQuery(
        "(min-width:320px) and (max-width: 1023.9px)"
    );
    const [originalTableData, setOriginalTableData]: [Sims7RedirectionsTableRow[], React.Dispatch<React.SetStateAction<Sims7RedirectionsTableRow[]>>] = useState<Sims7RedirectionsTableRow[]>([]);
    const [totalItems, setTotalItems]: [number, React.Dispatch<React.SetStateAction<number>>] = useState<number>(0);
    // Sorting state
    const [sortColumn, setSortColumn]: [string, React.Dispatch<React.SetStateAction<string>>] = useState<string>("");
    const [sortOrder, setSortOrder]: ["asc" | "desc", React.Dispatch<React.SetStateAction<"asc" | "desc">>] = useState<"asc" | "desc">("asc");
    // Sorting handler
    // Sorting handler for ControlledList (reduced complexity)
    const handleSorting: (event: React.SyntheticEvent, columnName: string) => void = (_event, columnName) => {
        const backendColumn = columnMapping[columnName] || columnName;
        setSortOrder(sortColumn === backendColumn ? getNextSortOrder(sortOrder) : "desc");
        if (sortColumn !== backendColumn) setSortColumn(backendColumn);
    };
    const [apiFailed, setApiFailed]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState(false);
    const [loading, setLoading]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState(false);

    const [currentPage, setCurrentPage]: [number, React.Dispatch<React.SetStateAction<number>>] = useState<number>(1);
    const pageSize = 10;
    const [selectedItems, setSelectedItems]: [ISelectedItem[], React.Dispatch<React.SetStateAction<ISelectedItem[]>>] = React.useState<ISelectedItem[]>([]);
    const [searchTagList, setSearchTagList]: [ISelectedItem[], React.Dispatch<React.SetStateAction<ISelectedItem[]>>] = React.useState<ISelectedItem[]>([]);
    useEffect(() => {
        setLoading(true);
        fetchSims7Redirections({
            SortColumnName: sortColumn,
            SortOrder: sortOrder ? sortOrder.toUpperCase() as 'ASC' | 'DESC' : undefined,
            PageNumber: currentPage,
            PageSize: pageSize,
            SearchFilter: searchTagList.map(item => item.value).filter((v): v is string => typeof v === 'string')
        })
            .then((payload: any) => {
                setApiFailed(false);
                setOriginalTableData((payload.items || []).map(mapSims7RedirectionsItem));
                setTotalItems(payload.totalItems || (payload.items ? payload.items.length : 0));
            })
            .catch((err: any) => {
                setApiFailed(true);
                setOriginalTableData([]);
                setTotalItems(0);
                console.error('Sims7Redirections API failed:', err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [sortColumn, sortOrder, currentPage, searchTagList]);

    const [isDialogOpen, setIsDialogOpen]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = React.useState<boolean>(false);
    // Removed unused isDropDownOpen state to resolve Kiuwan warning
    const [isSidePanelOpen, setIsSidePanelOpen]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = React.useState<boolean>(false);
    const [sidePanelMode, setSidePanelMode]: ['view' | 'edit', React.Dispatch<React.SetStateAction<'view' | 'edit'>>] = React.useState<'view' | 'edit'>('view');
    const [selectedRow, setSelectedRow]: [Sims7RedirectionsTableRow | null, React.Dispatch<React.SetStateAction<Sims7RedirectionsTableRow | null>>] = React.useState<Sims7RedirectionsTableRow | null>(null);
    // const [dropdownResetKey, setDropdownResetKey] = React.useState(0);
    const [isSidebarOpen, setIsSidebarOpen]: [
        boolean,
        React.Dispatch<React.SetStateAction<boolean>>
    ] = useState<boolean>(!isMobileView);

    const handleCloseSidePanel: () => void = () => {
        setIsSidePanelOpen(false);
        setSelectedRow(null);
    };

    const handleViewClick: (rowData: Sims7RedirectionsTableRow) => void = (rowData: Sims7RedirectionsTableRow) => {
        setSelectedRow(rowData);
        setSidePanelMode('view');
        setIsSidePanelOpen(true);
    };

    const handleEditClick: (rowData: Sims7RedirectionsTableRow) => void = (rowData: Sims7RedirectionsTableRow) => {
        setSelectedRow(rowData);
        setSidePanelMode('edit');
        setIsSidePanelOpen(true);
    };

    const handleOpenDialog: () => void = () => {
        setSelectedItems(searchTagList);
        setIsDialogOpen(true);
    }
    const handleCloseDialog: () => void = () => {
        setIsDialogOpen(false);
    };

    const handleClearAll: () => void = () => {
        // setIsDropDownOpen(false);
        setIsDialogOpen(true);
        setSelectedItems([]);
        // setDropdownResetKey(prev => prev + 1); // force Dropdown to remount/close
    };

    const handleApplyDialog: () => void = () => {
        setSearchTagList(
            selectedItems.map(item => ({
                ...item,
                text: item.text ?? ""
            }))
        );
        // setIsDropDownOpen(false);
        setIsDialogOpen(false);
    };

    // Backend pagination: table data is already paginated from API
    const filteredTableData: Sims7RedirectionsTableRow[] = React.useMemo(() => originalTableData, [originalTableData]);

    const closeSidebar: () => void = () => {
        setIsSidebarOpen(false);
    };

    const { t }: UseTranslationResponse<"translation", undefined> =
        useTranslation();

    useEffect(() => {
        document.body.classList.add("no-scroll");
    }, []);

    const toggleSidebar: () => void = () => {
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

    // Backend pagination: no slicing needed
    const paginatedTableData: Sims7RedirectionsTableRow[] = filteredTableData;
    const handlePaginationChange: (_event: React.ChangeEvent<unknown>, page: number) => void = (
        _event: React.ChangeEvent<unknown>,
        page: number
    ): void => {
        setCurrentPage(page);
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTagList]);

    const NotificationMsgBannerObject: { isShow: boolean; variant: string; title: string; message: string; autoclose: boolean }[] = [
        {
            isShow: true,
            variant: "warning",
            title: t("SIMS7Redirects.apiFailureMessage"),
            message: t("SIMS7Redirects.apiFailureDescription"),
            autoclose: true
        }
    ]

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
                    sortingOnClickEvent={handleSorting}
                    tooltipBottomAligned
                    data-testid="controlled-list"
                    globalNotificationMsgBannerObject={apiFailed && !paginatedTableData.length ? NotificationMsgBannerObject : null}
                    isAddEventBtnShow={false}
                    dataTestId="controlled-list-test-id"
                    filterDDLOptions={[]}
                    isShowSearch
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
                        <a href="https://example.com" target="_blank" rel="noopener noreferrer">
                            {`${t("SIMS7Redirects.secondSubheadingwithLink")}`}
                        </a>
                    }
                    id="controlled-list"
                    isBreadCrumbEnable={false}
                    isOnCloseSidepnl
                    lastColContentAlign="center"
                    lastColHeaderAlign="center"
                    paginationMinCountToHideNextPreviousBtn={0}
                    isShowPrimaryBtn={false}
                    isShowdynamictableNoMsg
                    {...(apiFailed && !paginatedTableData.length ? {
                        emptyRowType: TableRowType.Error,
                        emptyRowResponseCode: ResponseCode.Error,
                        emptyRowResponseMessage: t("SIMS7Redirects.apiFailureEmptyRowResponseMessage")
                    } : {
                        emptyRowResponseMessage: t("SIMS7Redirects.emptyRowResponseMessage")
                    })}
                    showConfirmDialog
                    tableBodyData={paginatedTableData}
                    tableFirstColumnWidth="10px"
                    tableHeadersData={sims7RedirectionsTableHeaders}
                    tableLastColumnWidth="10px"
                    isSorting
                    sortByDefault={false}
                    sortAscFirst={false}
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
                    titleConfirmation="Discard changes?"
                    isOpenConfirmationDialog={false}
                    isIconRightAligned
                    isShowOverflowMenuCol
                    onClickOverflowItem={(e, rowData) => {
                        const text: string = (e.target as HTMLElement).innerText.trim();
                        handleOverflowAction(text, rowData, handleViewClick, handleEditClick);
                    }}
                    // ...existing code...
// Helper to handle overflow actions (reduces complexity)
                    searchHeadingText={`${t("SIMS7Redirects.searchHeadingText")}`}
                    isSearchHideClearIcon
                    dynamicTableLoader={loading}
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
                    isShowThirdElement
                    isPagination
                    paginationCount={Math.ceil(totalItems / pageSize)}
                    paginationOnChange={handlePaginationChange}
                    hideCloseBtn

                />


                <Dialog isOpen={isDialogOpen} onClose={handleCloseDialog} escapeExits title="Filter by">
                    <DialogContent className="dialog-with-dropdown">
                        <>
                            <FormLabel>Status</FormLabel>
                            <Dropdown
                                //  key={dropdownResetKey}
                                multiSelect
                                selectedItems={selectedItems}
                                onSelectMultiple={(e: React.SyntheticEvent, selected: ISelectedItem[]) =>
                                    setSelectedItems(selected)
                                }
                                isFixedMultiSelect
                            // onClick={() => { setIsDropDownOpen(!isDropDownOpen) }}
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
                            Clear all
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
