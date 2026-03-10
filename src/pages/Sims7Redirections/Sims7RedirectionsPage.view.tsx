import React, { useEffect, useState } from "react";
import { LocalisedMenu } from "@essnextgen/ui-application-kit";
import {
    Button,
    ButtonColor,
    ButtonIconPosition,
    ButtonSize,
    ControlledList,
    IconColor,
    ResponseCode,
    Breadcrumbs,
    useMediaQuery,
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
import { getBreadcrumbs, getNotificationMsgBannerObject, getDialogTemplateProps } from "./Sims7RedirectionsPage.uihelpers";
import { homeurl } from "../InviteUsers/InviteUsersProps";
import {
    sims7RedirectionsTableHeaders,
    Sims7RedirectionsTableRow
} from "./Sims7RedirectionsPage.data";
import { mapSims7RedirectionsItem } from "./Sims7RedirectionsMapper";
import { fetchSims7Redirections } from "./Sims7RedirectionsPage.api";
import { handleOverflowAction } from "./Sims7RedirectionsPage.handlers";
import { setLoadingTrue, setLoadingFalse, fetchRedirections, handleApiSuccess, handleApiFailure } from './Sims7RedirectionsPage.view.helpers';
import {
    handleSorting as handleSortingHelper,
    handleViewClick as handleViewClickHelper,
    handleEditClick as handleEditClickHelper,
    handleOpenDialog as handleOpenDialogHelper,
    handleCloseDialog as handleCloseDialogHelper,
    handleClearAll as handleClearAllHelper,
    handleApplyDialog as handleApplyDialogHelper,
    handlePaginationChange as handlePaginationChangeHelper
} from "./Sims7RedirectionsPage.helpers";

interface DropdownItemType {
    id: string;
    text: string;
    value: string;
}
const dropdownItems: DropdownItemType[] = [
    { id: "1", text: "Migrated", value: "Migrated" },
    { id: "2", text: "Not migrated", value: "NotMigrated" },
    { id: "3", text: "Planned", value: "Planned" },
    { id: "4", text: "Permanent", value: "Permanent" },
    { id: "5", text: "Reversing", value: "Reversing" }
];

export interface LoadSims7RedirectionsDataArgs {
    sortColumn: string;
    sortOrder: "asc" | "desc";
    currentPage: number;
    pageSize: number;
    searchTagList: ISelectedItem[];
    setApiFailed: React.Dispatch<React.SetStateAction<boolean>>;
    setOriginalTableData: React.Dispatch<React.SetStateAction<any[]>>;
    setTotalItems: React.Dispatch<React.SetStateAction<number>>;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    t: (key: string) => string;
}

export const loadSims7RedirectionsData = async (args: LoadSims7RedirectionsDataArgs): Promise<void> => {
    setLoadingTrue(args.setLoading);
    try {
        const payload = await fetchRedirections(args);
        handleApiSuccess(payload, args);
    } catch (error) {
        handleApiFailure(args, error);
    } finally {
        setLoadingFalse(args.setLoading);
    }
};


export const Sims7RedirectionsPage: React.FC = () => {
    // Column mapping: frontend to backend
    const columnMapping: Record<string, string> = {
        "Category": "ngModule",
        "Next Gen module": "ngComponent",
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
    const handleSorting = (_event: React.SyntheticEvent, columnName: string) => {
        handleSortingHelper({
            columnMapping,
            sortColumn,
            sortOrder,
            setSortColumn,
            setSortOrder
        }, _event, columnName);
    };
    const [apiFailed, setApiFailed]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState(false);
    const [loading, setLoading]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState(false);

    const [currentPage, setCurrentPage]: [number, React.Dispatch<React.SetStateAction<number>>] = useState<number>(1);
    const pageSize = 40;
    const [selectedItems, setSelectedItems]: [ISelectedItem[], React.Dispatch<React.SetStateAction<ISelectedItem[]>>] = React.useState<ISelectedItem[]>([]);
    const [searchTagList, setSearchTagList]: [ISelectedItem[], React.Dispatch<React.SetStateAction<ISelectedItem[]>>] = React.useState<ISelectedItem[]>([]);

    useEffect(() => {
        loadSims7RedirectionsData({
            sortColumn,
            sortOrder,
            currentPage,
            pageSize,
            searchTagList,
            setApiFailed,
            setOriginalTableData,
            setTotalItems,
            setLoading,
            t
        });
    }, [sortColumn, sortOrder, currentPage, searchTagList, pageSize]);

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

    const handleCloseSidePanel = () => {
        setIsSidePanelOpen(false);
        setSelectedRow(null);
    };

    const handleViewClick = (rowData: Sims7RedirectionsTableRow) => {
        handleViewClickHelper({
            setSelectedRow,
            setSidePanelMode,
            setIsSidePanelOpen
        }, rowData);
    };

    const handleEditClick = (rowData: Sims7RedirectionsTableRow) => {
        handleEditClickHelper({
            setSelectedRow,
            setSidePanelMode,
            setIsSidePanelOpen
        }, rowData);
    };

    const handleOpenDialog = () => {
        handleOpenDialogHelper({
            setSelectedItems,
            searchTagList,
            setIsDialogOpen
        });
    };
    const handleCloseDialog = () => {
        handleCloseDialogHelper({
            setIsDialogOpen
        });
    };

    const handleClearAll = () => {
        handleClearAllHelper({
            setIsDialogOpen,
            setSelectedItems
        });
    };

    const handleApplyDialog = () => {
        handleApplyDialogHelper({
            setSearchTagList,
            selectedItems,
            setIsDialogOpen
        });
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

    const sims7RedirectionsBreadcrumbs = getBreadcrumbs(t, homeurl);

    // Backend pagination: no slicing needed
    const paginatedTableData: Sims7RedirectionsTableRow[] = filteredTableData;
    const handlePaginationChange = (_event: React.ChangeEvent<unknown>, page: number) => {
        handlePaginationChangeHelper({ setCurrentPage }, _event, page);
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTagList]);

    const NotificationMsgBannerObject = getNotificationMsgBannerObject(t);

    const dialogTemplateProps = getDialogTemplateProps(t);
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

                {!loading && !paginatedTableData.length && (
                    <div data-testid="empty-state">
                        {t("SIMS7Redirects.emptyStateMsg")}
                    </div>
                )}

                <ControlledList
                    sortingOnClickEvent={handleSorting}
                    tooltipBottomAligned
                    data-testid="controlled-list"
                    globalNotificationMsgBannerObject={
                        apiFailed && !paginatedTableData.length
                            ? NotificationMsgBannerObject
                            : null
                    }
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
                                 {t("SIMS7Redirects.filter")}
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
                    sortByDefault={false}
                    sortAscFirst={false}
                    templatePropsConfirmation={dialogTemplateProps}
                    titleConfirmation="Discard changes?"
                    isOpenConfirmationDialog={false}
                    isIconRightAligned
                    isShowOverflowMenuCol
                    onClickOverflowItem={(e, rowData) => {
                        const text: string = (e.target as HTMLElement).innerText.trim();
                        handleOverflowAction(text, rowData, handleViewClick, handleEditClick);
                    }}
                    // Helper to handle overflow actions (reduces complexity)
                    searchHeadingText={`${t("SIMS7Redirects.searchHeadingText")}`}
                    isSearchHideClearIcon
                    dynamicTableLoader={loading}
                    onClickSidePnlSecondaryBtn={() => { }}
                    handleCloseSidePanel={() => { }}
                     sidePanelTitle={t("SIMS7Redirects.sidePanelTitle")}
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


                 <Dialog isOpen={isDialogOpen} onClose={handleCloseDialog} escapeExits title={t("SIMS7Redirects.filterBy")}>
                    <DialogContent className="dialog-with-dropdown">
                        <>
                            <FormLabel>{t("SIMS7Redirects.status")}</FormLabel>
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
                            {t("SIMS7Redirects.clearAll")}
                        </Button>
                        <Button dataTestId="close-btn" onClick={handleApplyDialog}>
                            {t("SIMS7Redirects.apply")}
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
                    onSaveSuccess={async () => {
                        setLoading(true);
                        const payload = await fetchSims7Redirections({
                            SortColumnName: sortColumn,
                            SortOrder: sortOrder ? sortOrder.toUpperCase() as 'ASC' | 'DESC' : undefined,
                            PageNumber: currentPage,
                            PageSize: pageSize,
                            SearchFilter: searchTagList.map(item => item.value).filter((v): v is string => typeof v === 'string')
                        });
                        setOriginalTableData((payload.items || []).map(mapSims7RedirectionsItem));
                        setTotalItems(payload.totalItems || (payload.items ? payload.items.length : 0));
                        setLoading(false);
                    }}
                />
            </div>
        </div>
    );
}
export default Sims7RedirectionsPage;
