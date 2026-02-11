/* eslint-disable @typescript-eslint/no-unused-vars */
import { Breadcrumbs, ControlledList, NotificationStatus, DialogTemplate, ResponseCode, Button, ButtonColor, ButtonSize, IconColor, ButtonIconPosition, ISelectedItem, ValidationTextLevel } from "@essnextgen/ui-kit";
import React, { useEffect } from "react";
import "./style.scss";
import { getNotificationTableHeadersData } from "./helper";
import FilterDialogLogic from "./components/FilterDialogComponent/FilterDialog.logic";
import { formattedDate, getValues, PAGE_SIZE, useNotification } from "./useNotification";
import NotificationSidePanelView from "./components/NotificationSidePanelComponent/NotificationSidePanel.view";
import DeleteConfirmationModalLogic from "./components/DeleteConfirmationModal/DeleteConfirmationModal.logic";
import { getNotificationTableData, getSearchAutoSuggestData } from "../../../shared/services/notification/api";
import { PriorityType, TableNotificationProps } from "./Notifications.props";



const NotificationView = () => {
    const [tableData, setTableData] = React.useState<any>(null);
    const [totalTableData, setTotalTableData] = React.useState<any>(null);
    const [notificationState, setNotificationState] = React.useState<{ searchCleared: boolean }>({ searchCleared: false });

    const {
        filterBtnClicked,
        setFilterBtnClicked,
        currentPage,
        totalPages,
        // paginatedNotifications,
        totalNotifications,
        // totalOriginalNotifications,
        handlePageChange,
        searchTerm,
        setSearchTerm,
        handleSearchChange,
        isSearching,
        noResults,
        setNoResults,
        handleListCheckboxChange,
        handleSelectAllChange,
        handleSelectedCheckboxIds,
        handleBulkAction,
        isDeleteDialogOpen,
        closeDeleteDialog,
        confirmDelete,
        isDeleteLoading,
        showDeleteToast,
        isClearSelectedCheckbox,
        selectedCount,
        isNoSelectionMode,
        filters,
        handleFilterChange,
        // handleRemoveFilter,
        handleClearAllFilters,
        searchTagList,
        sortBy,
        sortDirection,
        handleSort,
        searchSuggestions, setSearchSuggestions
    } = useNotification({ tableData, totalTableData });

    const handleSearchChangeWithAutoSuggest = (value: string) => {
        setSearchTerm(value);

        const trimmed = value.trim();
        if (trimmed === "") {
            setIsAutoSuggestVisible(false);
            handleSearchKeyPressed("");
            return;
        }
        if (trimmed.length >= 2) {
            setIsAutoSuggestVisible(true);
            handleSearchChange(value);
            return;
        }
        setIsAutoSuggestVisible(false);
    };
    const [sideIsOpen, setSideIsOpen] = React.useState(false);
    const [selectedItem, setSelectedItem] = React.useState<any>("");
    const [isTableBodyLoading, setIsTableBodyLoading] = React.useState(false);
    const [tableDataError, setTableDataError] = React.useState<any>(false);
    const [notificationIdSelected, setNotificationIdSelected] = React.useState<string | undefined>(undefined);
    const [suggestionLoader, setSuggestionLoader] = React.useState(false);
    const tableWrapperRef = React.useRef<HTMLDivElement>(null);
    const getNotificationId = React.useCallback((notification: any) => notification?.id ?? notification?.Id, []);
    const [isAutoSuggestVisible, setIsAutoSuggestVisible] = React.useState(false);

    const handleSearchKeyPressed = (inputValue: string) => {
        setIsTableBodyLoading(true);
        getNotificationTableData({ PageSize: PAGE_SIZE, PageNumber: currentPage, SearchTerm: inputValue.toLowerCase(), SortBy: sortBy, SortDirection: sortDirection })
            .then((data) => {
                if (!data.error) {
                    setTableData(data.payload);
                    setTotalTableData(data.total);
                    setTableDataError(false);
                    if (data.payload.length === 0) {
                        setNoResults(true);
                    } else {
                        setNoResults(false);
                    }
                } else {
                    setNoResults(true);
                    setTableDataError(true);
                    setTableData([]);
                }
            })
            .finally(() => setIsTableBodyLoading(false));
    };

    const tableHeadersData = React.useMemo(
        () => getNotificationTableHeadersData(setSideIsOpen, setSelectedItem, sortBy, sortDirection, setNotificationIdSelected),
        [setSideIsOpen, setSelectedItem, sortBy, sortDirection]
    );

    const hasActiveFilters = React.useMemo(() =>
        (filters.status && filters.status.length > 0) ||
        (filters.priority && filters.priority.length > 0) ||
        filters.startDate ||
        filters.endDate
        , [filters]);

    const hasSearch = React.useMemo(() => searchTerm.trim().length >= 2, [searchTerm]);

    useEffect(() => {
        if (!sideIsOpen || hasSearch || notificationState.searchCleared) {
            setIsTableBodyLoading(true);
            getNotificationTableData({ PageSize: PAGE_SIZE, PageNumber: currentPage, SearchTerm: searchTerm.toLowerCase(), SortBy: sortBy, SortDirection: sortDirection })
                .then((data) => {
                    if (!data.error) {
                        setTableData(data.payload);
                        setTotalTableData(data.total);
                        setTableDataError(false);
                        if (data.payload.length === 0) {
                            setNoResults(true);
                        }
                    } else {
                        setNoResults(true);
                        setTableDataError(true);
                        setTableData([]);
                    }
                })
                .finally(() => setIsTableBodyLoading(false));
        }
    }, [notificationState, currentPage, sideIsOpen,sortBy, sortDirection]);

    useEffect(() => {
        if (!(searchTerm && hasSearch && isAutoSuggestVisible)) {
            setIsAutoSuggestVisible(false);
            return;
        }
        setSuggestionLoader(true);
        getSearchAutoSuggestData({ SearchTerm: searchTerm.toLowerCase() }).then((data: any) => {
            const suggestionList = data.payload.length && [
                {
                    name: "",
                    values: getValues(data.payload)
                }
            ];
            setSuggestionLoader(false);
            setSearchSuggestions(suggestionList);
        });
    }, [searchTerm, isAutoSuggestVisible, sideIsOpen, hasSearch])

    const tableRows =
        React.useMemo(
            () =>
                Array.isArray(tableData)
                    ? tableData.map((notification: TableNotificationProps) => ({
                        id: `${notification.id}`,
                        Status: notification.status === false ? 'Unread' : 'Read',
                        Notification: notification.title,
                        Priority: PriorityType[notification.priority] || "Unknown",
                        "Date received": notification.receivedDate
                            ? formattedDate(notification.receivedDate)
                            : "",
                        doc: JSON.stringify({
                            id: `${notification.id}`,
                            Status: notification.status === false ? 'Unread' : 'Read',
                            Notification: notification.title,
                            title: "View"
                        }),
                    }))
                    : [],
            [tableData, currentPage, getNotificationId]
        );

    const visibleNotificationIds = React.useMemo(() => tableRows.map((notification: any) => notification.id).filter(Boolean), [tableRows]);

    const handleBulkDeleteSelection = (_event: React.SyntheticEvent, selectedItemOption: ISelectedItem) => {
        handleBulkAction(selectedItemOption, visibleNotificationIds);
    };

    const handleCloseDeleteDialog = () => {
        closeDeleteDialog();
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }
    };

    const handleConfirmDelete = async () => {
        await confirmDelete();
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }
    };

    const shouldShowPagination = !tableDataError && totalTableData !== 0 && !isTableBodyLoading
    // > 1 && tableData.length > 0 && !noResults;

    const getEmptyStateMessage = () => {
        if (tableDataError) {
            return "No data to display";
        }
        // if (!totalNotifications && !isSearching) {
        //     return "No data to display";
        // }
        if (totalNotifications === 0 && !isSearching && hasSearch && !searchSuggestions.length) {
            return `Your search - ${searchTerm} - did not match any results. Make sure that all words are spelled correctly.`;
        }
        if (totalNotifications === 0 && !isSearching && hasActiveFilters) {
            return "No notifications found for selected filters.";
        }
        return "";
    };

    useEffect(() => {
        document.body.classList.add('no-scroll')
    }, [])

    return (
        <div className="notification-layout" data-testid="notification-layout">
            <div style={{ marginBottom: 16, width: "100%" }}>
                <div className="notification-layout-header">
                    <Breadcrumbs
                        breadcrumbActions={[
                            { active: false, linkName: "Home", path: window.location.origin },
                            { active: false, linkName: "Notification Centre", path: "#" }
                        ]}
                        className="essui-Breadcrumbs"
                        dataTestId="breadcrumb-test-id"
                        id="element-id"
                        onItemClick={(path: string) => {
                            window.location.href = path;
                        }}
                    />
                    <div
                        className="notification-controlledlist-width"
                        ref={tableWrapperRef}
                        tabIndex={-1}
                        aria-label="Notifications table"
                    >
                        <div className="notification-filters-wrapper">
                            <ControlledList
                                tooltipBottomAligned={true}
                                data-testid="controlled-list"
                                globalNotificationMsgBannerObject={
                                    [
                                        {
                                            "isShow": tableDataError,
                                            "variant": "warning",
                                            "title": "Information unavailable",
                                            "message": "A technical issue at our end has stopped us from displaying some information. Please try again later. If the issue persists, please get in touch with our support team.",
                                            "autoclose": false,
                                            "hideCloseButton": false
                                        }
                                    ]
                                }
                                isAddEventBtnShow={false}
                                dataTestId="controlled-list-test-id"
                                filterDDLOptions={[]}
                                isShowSearch={true}
                                searchTerm={searchTerm}
                                searchOnChange={(e) => handleSearchChangeWithAutoSuggest(e.target.value)}
                                searchSuggestions={searchSuggestions}
                                onSearchSuggestionItemClick={(props: any | null) => {
                                    if (props) {
                                        // eslint-disable-next-line react/prop-types
                                        setSearchTerm(props.name);
                                        // eslint-disable-next-line react/prop-types
                                        handleSearchKeyPressed(props.name);
                                        setIsAutoSuggestVisible(false);
                                    }
                                }}
                                isSearchHideClearIcon={searchTerm.length === 0}
                                onSearchKeyDown={(e: React.KeyboardEvent) => {
                                    setSearchTerm((e.target as HTMLInputElement).value);
                                    if (e.key === "Enter") {
                                        handleSearchKeyPressed((e.target as HTMLInputElement).value);
                                        setIsAutoSuggestVisible(false);
                                    }
                                }}
                                searchValue={searchTerm}
                                isShowAutoSuggest={isAutoSuggestVisible}
                                onKeyUpLenght={2}
                                isShowFirstElement={true}
                                isShowFourthElement={true}
                                filterCustumeElem2={
                                    <div className="notification-controls">
                                        <Button
                                            className="filter-btn-clc"
                                            color={ButtonColor.Utility}
                                            data-testid="filter"
                                            onClick={() => {
                                                setFilterBtnClicked(true)
                                            }}
                                            size={ButtonSize.Small}
                                            iconName="filter"
                                            iconColor={IconColor.Neutral800}
                                            iconPosition={ButtonIconPosition.Right}
                                        >
                                            Filter
                                        </Button>
                                    </div>
                                }
                                editSelectedBtnTitle="Edit selected"
                                editSelectedOptions={[
                                    {
                                        "disabled": false,
                                        "isSelected": false,
                                        "text": "Delete",
                                        "value": "Delete"
                                    }
                                ]}
                                onEditSelectedOverFlowMenu={handleBulkDeleteSelection}
                                onEditSelectedBtnClick={() => { }}
                                emptyStateMsg={getEmptyStateMessage()}
                                onAddEventBtnClick={() => { }}
                                groupTagsEnabled
                                headingText="Notification Centre"
                                id="controlled-list"
                                isBreadCrumbEnable={false}
                                isOnCloseSidepnl
                                lastColContentAlign="center"
                                lastColHeaderAlign="center"

                                paginationMinCountToHideNextPreviousBtn={0}
                                isShowPrimaryBtn={false}
                                resultNotFoundMessage={noResults && searchTerm.trim() ? `Your search - ${searchTerm} - did not match any results. Make sure that all words are spelled correctly.` : ""}
                                showConfirmDialog
                                subHeadingText=""
                                tableBodyData={tableRows as any}
                                tableFirstColumnWidth="10px"
                                tableHeadersData={tableHeadersData as any}
                                tableLastColumnWidth="10px"
                                isSorting={false}
                                sortByDefault={false}
                                sortAscFirst={false}
                                sortingOnClickEvent={(e: React.SyntheticEvent, columnName: string) => {
                                    handleSort(columnName);
                                }}
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
                                isShowOverflowMenuCol={false}
                                searchOnCloseHandle={() => {
                                    setSearchTerm("");
                                    setNotificationState({ searchCleared: true });
                                }}
                                searchHeadingText="Search by notification title"
                                dynamicTableLoader={isTableBodyLoading}
                                onClickSidePnlSecondaryBtn={() => { setSideIsOpen(false) }}
                                handleCloseSidePanel={() => {
                                    setSideIsOpen(false)
                                }}
                                emptyRowResponseMessage={getEmptyStateMessage()}
                                searchIsLoader={suggestionLoader}
                                onClickOverflowItem={() => { }}
                                secondaryButtonTitle="Close"
                                isShowCheckboxCol={true}
                                isShowThirdElement={true}
                                isShowdynamictableNoMsg={
                                    (totalNotifications === 0 || !noResults) || !isSearching || tableDataError
                                }
                                emptyRowResponseCode={ResponseCode.Info}
                                isPagination={shouldShowPagination}
                                paginationCount={totalPages}
                                paginationOnChange={handlePageChange}
                                paginationPage={currentPage}
                                onChangeListCheckBox={(index: number, id: string) => handleListCheckboxChange(index, id)}
                                onChangeAllCheckBox={(event: any) => handleSelectAllChange(event, visibleNotificationIds)}
                                selectedCheckboxIds={handleSelectedCheckboxIds}
                                isClearSelectedCheckbox={isClearSelectedCheckbox}
                                showToastNotification={showDeleteToast}
                                toastNotificationStatus={NotificationStatus.SUCCESSTOAST}
                                toastNotificationTitle="Notification deleted"
                                searchTagList={searchTagList}
                                dynamictableNoMsgColor={ValidationTextLevel.Warning}
                            />
                        </div>
                        {sideIsOpen && (
                            <NotificationSidePanelView
                                sideIsOpen={sideIsOpen}
                                setSideIsOpen={setSideIsOpen}
                                selectedItem={selectedItem}
                                setSelectedItem={setSelectedItem}
                                notificationIdSelected={notificationIdSelected}

                            />
                        )}
                    </div>
                    {filterBtnClicked && (
                        <FilterDialogLogic
                            setFilterBtnClicked={setFilterBtnClicked}
                            filters={filters}
                            onApply={handleFilterChange}
                            onClear={handleClearAllFilters}
                        />
                    )}

                    <DeleteConfirmationModalLogic
                        isOpen={isDeleteDialogOpen}
                        onClose={handleCloseDeleteDialog}
                        onConfirm={isNoSelectionMode ? handleCloseDeleteDialog : handleConfirmDelete}
                        selectedCount={selectedCount}
                        isLoading={isDeleteLoading}
                        isNoSelection={isNoSelectionMode}
                    />

                </div>
            </div>
        </div>
    )
}

export default NotificationView;