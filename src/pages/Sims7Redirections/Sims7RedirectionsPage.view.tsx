import React, { useEffect, useState } from "react";
import { LocalisedMenu } from "@essnextgen/ui-application-kit";
import {
    Button,
    ButtonColor,
    ButtonIconPosition,
    ButtonSize,
    ControlledList,
    IconColor,
    Breadcrumbs,
    useMediaQuery,
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
import { getBreadcrumbs, getNotificationMsgBannerObject, getDialogTemplateProps } from "./Sims7RedirectionsPage.uihelpers";
import { homeurl } from "../InviteUsers/InviteUsersProps";
import {
    Sims7RedirectionsTableHeader,
    sims7RedirectionsTableHeaders,
    Sims7RedirectionsTableRow
} from "./Sims7RedirectionsPage.data";
import { handleOverflowAction } from "./Sims7RedirectionsPage.handlers";
import { setLoadingTrue, setLoadingFalse, fetchRedirections, handleApiSuccess, handleApiFailure, fetchSuggestionsForSearch, SuggestionGroup } from './Sims7RedirectionsPage.view.helpers';
import {
    handleSorting as handleSortingHelper,
    handleViewClick as handleViewClickHelper,
    handleEditClick as handleEditClickHelper,
    handleOpenDialog as handleOpenDialogHelper,
    handleCloseDialog as handleCloseDialogHelper,
    handleClearAll as handleClearAllHelper,
    handleApplyDialog as handleApplyDialogHelper,
    handlePaginationChange as handlePaginationChangeHelper,
    handleSuggestionItemClick,
    getEmptyRowProps,
    handleSaveSuccess
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

export const loadSims7RedirectionsData: (args: LoadSims7RedirectionsDataArgs) => Promise<void> = async (args: LoadSims7RedirectionsDataArgs): Promise<void> => {
    setLoadingTrue(args.setLoading);
    try {
        const payload: unknown = await fetchRedirections(args);
        handleApiSuccess(payload, args);
    } catch (error: unknown) {
        handleApiFailure(args, error);
    } finally {
        setLoadingFalse(args.setLoading);
    }
};


export const Sims7RedirectionsPage: React.FC = () => {
    const { t }: UseTranslationResponse<"translation", undefined> = useTranslation();

    const isMobileView: boolean = useMediaQuery("(min-width:320px) and (max-width: 1023.9px)");

    // State declarations
    const [searchTerm, setSearchTerm]: [string, React.Dispatch<React.SetStateAction<string>>] = useState("");
    const [suggestionItems, setSuggestionItems]: [SuggestionGroup[], React.Dispatch<React.SetStateAction<SuggestionGroup[]>>] = useState<SuggestionGroup[]>([]);
    const [originalTableData, setOriginalTableData]: [Sims7RedirectionsTableRow[], React.Dispatch<React.SetStateAction<Sims7RedirectionsTableRow[]>>] = useState<Sims7RedirectionsTableRow[]>([]);
    const [filteredData, setFilteredData]: [Sims7RedirectionsTableRow[], React.Dispatch<React.SetStateAction<Sims7RedirectionsTableRow[]>>] = useState<Sims7RedirectionsTableRow[]>([]);
    const [totalItems, setTotalItems]: [number, React.Dispatch<React.SetStateAction<number>>] = useState<number>(0);
    const [sortColumn, setSortColumn]: [string, React.Dispatch<React.SetStateAction<string>>] = useState<string>("");
    const [sortOrder, setSortOrder]: ["asc" | "desc", React.Dispatch<React.SetStateAction<"asc" | "desc">>] = useState<"asc" | "desc">("asc");
    const [apiFailed, setApiFailed]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState(false);
    const [loading, setLoading]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState(false);
    const [currentPage, setCurrentPage]: [number, React.Dispatch<React.SetStateAction<number>>] = useState<number>(1);
    const pageSize = 40;
    const [selectedItems, setSelectedItems]: [ISelectedItem[], React.Dispatch<React.SetStateAction<ISelectedItem[]>>] = React.useState<ISelectedItem[]>([]);
    const [searchTagList, setSearchTagList]: [ISelectedItem[], React.Dispatch<React.SetStateAction<ISelectedItem[]>>] = React.useState<ISelectedItem[]>([]);
    const [isDialogOpen, setIsDialogOpen]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = React.useState<boolean>(false);
    const [isSidePanelOpen, setIsSidePanelOpen]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = React.useState<boolean>(false);
    const [sidePanelMode, setSidePanelMode]: ['view' | 'edit', React.Dispatch<React.SetStateAction<'view' | 'edit'>>] = React.useState<'view' | 'edit'>('view');
    const [selectedRow, setSelectedRow]: [Sims7RedirectionsTableRow | null, React.Dispatch<React.SetStateAction<Sims7RedirectionsTableRow | null>>] = React.useState<Sims7RedirectionsTableRow | null>(null);
    const [isSidebarOpen, setIsSidebarOpen]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(!isMobileView);
    const [searchIsLoading, setSearchIsLoading]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);

    // Column mapping: frontend to backend
    // const columnMapping: Record<string, string> = {
    //     "Category": "ngModule",
    //     "Next Gen module": "ngComponent",
    //     "SIMS 7 module": "sims7Module",
    //     "Modified by": "updatedBy",
    //     "Effective date": "effectiveDate",
    //     "Status": "redirectStatus"
    // };

    // Column mapping: frontend to backend (keys use translated labels to support all languages)
    const columnMapping: Record<string, string> = {
        [t("SIMS7Redirects.category")]: "ngModule",
        [t("SIMS7Redirects.nextGenModule")]: "ngComponent",
        [t("SIMS7Redirects.sims7Module")]: "sims7Module",
        [t("SIMS7Redirects.modifiedBy")]: "updatedBy",
        [t("SIMS7Redirects.effectiveDate")]: "effectiveDate",
        [t("SIMS7Redirects.status")]: "redirectStatus"
    };
    const translatedTableHeaders: Sims7RedirectionsTableHeader[] = React.useMemo(() => {
        const headerKeyMap: Record<string, string> = {
            "Category": "SIMS7Redirects.category",
            "Next Gen module": "SIMS7Redirects.nextGenModule",
            "SIMS 7 module": "SIMS7Redirects.sims7Module",
            "Modified by": "SIMS7Redirects.modifiedBy",
            "Effective date": "SIMS7Redirects.effectiveDate",
            "Status": "SIMS7Redirects.status"
        };
        return sims7RedirectionsTableHeaders.map(header => {
            const translationKey = headerKeyMap[header.text];
            return translationKey ? { ...header, text: t(translationKey) } : header;
        });
    }, [t]);

    // Effects
    useEffect(() => {
        document.body.classList.add("no-scroll");
    }, []);

    useEffect(() => {
        const ignoreRef: { current: boolean } = { current: false };
        fetchSuggestionsForSearch({ searchTerm, setSuggestionItems, setFilteredData, setApiFailed, t, ignoreRef, setSearchIsLoading, originalTableData });
        return () => { ignoreRef.current = true; };
    }, [searchTerm]);

    useEffect(() => {
        setFilteredData(originalTableData);
    }, [originalTableData]);

    useEffect(() => {
        loadSims7RedirectionsData({ sortColumn, sortOrder, currentPage, pageSize, searchTagList, setApiFailed, setOriginalTableData, setTotalItems, setLoading, t });
    }, [sortColumn, sortOrder, currentPage, searchTagList, pageSize]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTagList]);

    // Handlers
    const handleSorting: (_event: React.SyntheticEvent, columnName: string) => void = (_event, columnName) => {
        handleSortingHelper({ columnMapping, sortColumn, sortOrder, setSortColumn, setSortOrder }, _event, columnName);
    };

    const handleCloseSidePanel: () => void = () => {
        setIsSidePanelOpen(false);
        setSelectedRow(null);
    };

    const handleViewClick: (rowData: Sims7RedirectionsTableRow) => void = (rowData) => {
        handleViewClickHelper({ setSelectedRow, setSidePanelMode, setIsSidePanelOpen }, rowData);
    };

    const handleEditClick: (rowData: Sims7RedirectionsTableRow) => void = (rowData) => {
        handleEditClickHelper({ setSelectedRow, setSidePanelMode, setIsSidePanelOpen }, rowData);
    };

    const handleOpenDialog: () => void = () => {
        handleOpenDialogHelper({ setSelectedItems, searchTagList, setIsDialogOpen });
    };

    const handleCloseDialog: () => void = () => {
        handleCloseDialogHelper({ setIsDialogOpen });
    };

    const handleClearAll: () => void = () => {
        handleClearAllHelper({ setIsDialogOpen, setSelectedItems });
    };

    const handleApplyDialog: () => void = () => {
        handleApplyDialogHelper({ setSearchTagList, selectedItems, setIsDialogOpen });
    };

    const handleOverflowItemClick: (e: React.SyntheticEvent, rowData: Sims7RedirectionsTableRow) => void = (e, rowData) => {
        const clickedText: string = (e.target as HTMLElement).innerText.trim();
        const matchedOption = rowData.actions?.options?.find(
            (opt: { text: string; value: string }) => opt.text.trim() === clickedText
        );
        const action: string = matchedOption ? matchedOption.value : clickedText;
        handleOverflowAction(action, rowData, handleViewClick, handleEditClick);
    };

    const handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSuggestionClick: (item: { text?: string; id?: string } | null) => void = (item) => {
        handleSuggestionItemClick(item, originalTableData, setFilteredData);
    };

    const handleSearchClose: () => void = () => {
        setSearchTerm("");
        setFilteredData(originalTableData);
    };

    const handleOnSaveSuccess: () => Promise<void> = async () => {
        await handleSaveSuccess({ setLoading, sortColumn, sortOrder, currentPage, pageSize, searchTagList, setOriginalTableData, setTotalItems });
    };

    const handlePaginationChange: (_event: React.ChangeEvent<unknown>, page: number) => void = (_event, page) => {
        handlePaginationChangeHelper({ setCurrentPage }, _event, page);
    };

    const closeSidebar: () => void = () => { setIsSidebarOpen(false); };
    const toggleSidebar: () => void = () => { setIsSidebarOpen((prev: boolean): boolean => !prev); };

    // Derived values
    const filteredTableData: Sims7RedirectionsTableRow[] = React.useMemo(() => filteredData, [filteredData]);
    const paginatedTableData: Sims7RedirectionsTableRow[] = filteredTableData;
    const sims7RedirectionsBreadcrumbs: any = getBreadcrumbs(t, homeurl);
    const NotificationMsgBannerObject: any = getNotificationMsgBannerObject(t);
    const globalBannerObject: any = apiFailed && !paginatedTableData.length ? NotificationMsgBannerObject : null;
    const mappedSearchTagList = searchTagList.map(item => ({ ...item, text: item.text ?? "" }));
    const dialogTemplateProps: any = getDialogTemplateProps(t);
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
                    globalNotificationMsgBannerObject={globalBannerObject}
                    isAddEventBtnShow={false}
                    dataTestId="controlled-list-test-id"
                    filterDDLOptions={[]}
                    isShowSearch
                    isShowFirstElement
                    isShowEditSelectedBtn={false}
                    isShowFourthElement={false}
                    filterCustumeElem2={
                        <div className="filter-container">
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
                    searchTagList={mappedSearchTagList}
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
                        <a href="https://ppgsl.service-now.com/csm?id=csm_kb_article_view&sysparm_article=KB0015525" target="_blank" rel="noopener noreferrer">
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
                    {...getEmptyRowProps(apiFailed, paginatedTableData, suggestionItems, t)}
                    showConfirmDialog
                    tableBodyData={paginatedTableData}
                    tableFirstColumnWidth="10px"
                    // tableHeadersData={sims7RedirectionsTableHeaders}
                     tableHeadersData={translatedTableHeaders}
                    tableLastColumnWidth="10px"
                    sortByDefault={false}
                    sortAscFirst={false}
                    templatePropsConfirmation={dialogTemplateProps}
                    titleConfirmation="Discard changes?"
                    isOpenConfirmationDialog={false}
                    isIconRightAligned
                    isShowOverflowMenuCol
                    onClickOverflowItem={handleOverflowItemClick}
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
                    // Show suggestions from API if searchTerm has 3 or more characters
                    isShowAutoSuggest={true}
                    searchSuggestions={suggestionItems}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    searchOnChange={handleSearchChange}
                    isGroupSuggestionOnItemClick={true}
                    onSearchSuggestionItemClick={handleSuggestionClick}
                    searchOnClickClose={handleSearchClose}
                    searchIsLoader={searchIsLoading}
                    isNotClearSearchTermOnItemClick = {true}
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
                    onSaveSuccess={handleOnSaveSuccess}
                />
            </div>
        </div>
    );
}
export default Sims7RedirectionsPage;
