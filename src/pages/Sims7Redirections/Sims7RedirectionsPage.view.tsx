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

export const Sims7RedirectionsPage: React.FC = () => {
    const isMobileView: boolean = useMediaQuery(
        "(min-width:320px) and (max-width: 1023.9px)"
    );
    const [originalTableData, setOriginalTableData]: [Sims7RedirectionsTableRow[], React.Dispatch<React.SetStateAction<Sims7RedirectionsTableRow[]>>] = useState<Sims7RedirectionsTableRow[]>([]);
    const [apiFailed, setApiFailed]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState(false);
    const [loading, setLoading]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState(false);

    useEffect(() => {
        setLoading(true);
        fetchSims7Redirections()
            .then(data => {
                setApiFailed(false);
                const mapped: Sims7RedirectionsTableRow[] = (data || []).map(mapSims7RedirectionsItem);
                setOriginalTableData(mapped);
            })
            .catch((err) => {
                setApiFailed(true);
                setOriginalTableData([]);
                console.error('Sims7Redirections API failed:', err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const [selectedItems, setSelectedItems]: [ISelectedItem[], React.Dispatch<React.SetStateAction<ISelectedItem[]>>] = React.useState<ISelectedItem[]>([]);
    const [searchTagList, setSearchTagList]: [ISelectedItem[], React.Dispatch<React.SetStateAction<ISelectedItem[]>>] = React.useState<ISelectedItem[]>([]);
    const [isDialogOpen, setIsDialogOpen]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = React.useState<boolean>(false);
    // const [isDropDownOpen, setIsDropDownOpen] = React.useState(false);
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

    const filteredTableData: Sims7RedirectionsTableRow[] = React.useMemo(() => {
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
        const selectedDisplayValues: string[] = searchTagList.map(item => valueToDisplay[item.value ?? ""]);

        return originalTableData.filter(row =>
            selectedDisplayValues.includes(row.status)
        );
    }, [searchTagList, originalTableData]);

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

    const [currentPage, setCurrentPage]: [number, React.Dispatch<React.SetStateAction<number>>] = useState<number>(1);
    const pageSize = 40; // same as paginationCount
    const paginatedTableData: Sims7RedirectionsTableRow[] = React.useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        return filteredTableData.slice(startIndex, endIndex);
    }, [filteredTableData, currentPage]);
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
                    titleConfirmation="Discard changes?"
                    isOpenConfirmationDialog={false}
                    isIconRightAligned
                    isShowOverflowMenuCol
                    onClickOverflowItem={(e, rowData) => {
                        const text: string = (e.target as HTMLElement).innerText.trim();
                        if (text === "View") {
                            handleViewClick(rowData);
                        } else if (text === "Edit") {
                            handleEditClick(rowData);
                        }
                    }}
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
                    paginationCount={Math.ceil(filteredTableData.length / pageSize)}
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
