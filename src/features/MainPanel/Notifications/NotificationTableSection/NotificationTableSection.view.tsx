import React, { useEffect, useRef } from "react";
import { Button, ButtonColor, ButtonIconPosition, ButtonSize, ControlledList, DialogTemplate, IconColor, NotificationStatus, ResponseCode, ValidationTextLevel } from "@essnextgen/ui-kit";
import { handleSearchKeyPressed as handleSearchKeyPressedUtil, handleSearchChangeWithAutoSuggest as handleSearchChangeWithAutoSuggestUtil } from "./notificationTableHandlers";
import { fetchNotificationTableData, fetchSearchAutoSuggestData, isShowdynamictableNoMsg, shouldFetchTableData } from "./notificationTableApiHelpers";
import { getEmptyStateMessage } from "../hooks/useNotificationHook";
import { UseNotificationReturnType } from "../Notifications.props";
import { useNotification } from "../useNotification";
import NotificationSidePanelView from "../components/NotificationSidePanelComponent/NotificationSidePanel.view";
import { NotificationTableSectionProps } from "./NotificationTableSection.props";

function renderSidePanel(props: {
    sideIsOpen: boolean;
    setSideIsOpen: (isOpen: boolean) => void;
    selectedItem: any;
    setSelectedItem: (item: any) => void;
    notificationIdSelected: string | null;
}): JSX.Element | null {
    return props.sideIsOpen ? <NotificationSidePanelView {...props} notificationIdSelected={props.notificationIdSelected ?? undefined} /> : null;
}

const NotificationTableSection: React.FC<NotificationTableSectionProps> = ({
    tableData,
    totalTableData,
    tableDataError,
    hasSearch,
    hasActiveFilters,
    tableRows,
    tableHeadersData,
    isTableBodyLoading,
    setSideIsOpen,
    sideIsOpen,
    selectedItem,
    setSelectedItem,
    notificationIdSelected,
    // totalPages,
    currentPage,
    setCurrentPage,
    setNoResults,
    setTableData,
    setTotalTableData,
    setTableDataError,
    setIsTableBodyLoading,
    notificationState,
    setNotificationState,
    setFilterBtnClicked
}) => {
    const {
        totalNotifications,
        totalPages,
        // handlePageChange,
        searchTerm,
        isSearching,
        noResults,
        // setNoResults,
        // handleListCheckboxChange,
        // handleSelectAllChange,
        handleSelectedCheckboxIds,
        // handleBulkAction,
        // isDeleteDialogOpen,
        // closeDeleteDialog,
        // confirmDelete,
        // isDeleteLoading,
        showDeleteToast,
        isClearSelectedCheckbox,
        // selectedCount,
        // isNoSelectionMode,
        // filters,
        // handleFilterChange
        // handleClearAllFilters,
        // searchTagList,
        sortBy,
        sortDirection,
        handleSort,
        isAutoSuggestVisible,
        setIsAutoSuggestVisible,
        suggestionLoader,
        setSuggestionLoader,
        setSearchSuggestions,
        searchSuggestions,
        setSearchTerm
        // handleSearchChangeWithAutoSuggest,
        // handleSearchKeyPressed,
    }: UseNotificationReturnType = useNotification({
        tableData,
        totalTableData,
        currentPage,
        setCurrentPage: (value) => setCurrentPage(typeof value === "function" ? value(currentPage) : value)
    });



    const handleSearchKeyPressed: (inputValue: string) => void = (inputValue: string) => {
        handleSearchKeyPressedUtil({
            inputValue,
            currentPage,
            sortBy: String(sortBy),
            sortDirection,
            setIsTableBodyLoading,
            setTableData,
            setTotalTableData,
            setTableDataError,
            setNoResults
        });
    };

    const handleSearchChangeWithAutoSuggest: (value: string) => void = (value: string) => {
        handleSearchChangeWithAutoSuggestUtil(
            value,
            setSearchTerm,
            setIsAutoSuggestVisible
        );
    };

    const tableWrapperRef: React.RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);

    const shouldShowPagination = !tableDataError && totalTableData !== 0 && !isTableBodyLoading;

    useEffect(() => {
        if (shouldFetchTableData({ sideIsOpen, hasSearch, searchCleared: notificationState.searchCleared })) {
            fetchNotificationTableData({
                currentPage,
                searchTerm,
                sortBy: String(sortBy),
                sortDirection,
                setIsTableBodyLoading,
                setTableData,
                setTotalTableData,
                setTableDataError,
                setNoResults
            });
        }
    }, [notificationState, currentPage, sideIsOpen, sortBy, sortDirection]);

    useEffect(() => {
        console.log({ searchTerm, hasSearch, isAutoSuggestVisible, cond: !(searchTerm && hasSearch && isAutoSuggestVisible) })
        // if (!(searchTerm && hasSearch && isAutoSuggestVisible)) {
        //     // setIsAutoSuggestVisible(false);
        //     return undefined;
        // }
        if (searchTerm.length >= 2) {
            fetchSearchAutoSuggestData({
                searchTerm,
                setSuggestionLoader,
                setSearchSuggestions
            });
        }
    }, [searchTerm, isAutoSuggestVisible, sideIsOpen, hasSearch])

    console.log("NotificationTableSection render", { currentPage, sideIsOpen, sortBy, sortDirection, tableData, totalTableData, tableDataError, isTableBodyLoading });

    return (
        <div
            className="notification-controlledlist-width"
            ref={tableWrapperRef}
            tabIndex={-1}
            aria-label="Notifications table"
        >
            <div className="notification-filters-wrapper">
                <ControlledList
                    tooltipBottomAligned
                    data-testid="controlled-list"
                    globalNotificationMsgBannerObject={[
                        {
                            "isShow": tableDataError,
                            "variant": "warning",
                            "title": "Information unavailable",
                            "message": "A technical issue at our end has stopped us from displaying some information. Please try again later. If the issue persists, please get in touch with our support team.",
                            "autoclose": false,
                            "hideCloseButton": false
                        }
                    ]}
                    isAddEventBtnShow={false}
                    dataTestId="controlled-list-test-id"
                    filterDDLOptions={[]}
                    isShowSearch
                    isShowFirstElement
                    isShowFourthElement
                    filterCustumeElem2={
                        <div className="notification-controls">
                            <Button
                                className="filter-btn-clc"
                                color={ButtonColor.Utility}
                                data-testid="filter"
                                onClick={() => {
                                    console.log("Filter button clicked");
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
                    // onEditSelectedOverFlowMenu={handleBulkDeleteSelection}
                    onEditSelectedBtnClick={() => { }}
                    emptyStateMsg={getEmptyStateMessage(tableDataError, totalNotifications, isSearching, hasSearch, hasActiveFilters, searchTerm, searchSuggestions)}
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
                    resultNotFoundMessage={!suggestionLoader && noResults && searchTerm.trim() ? `Your search - ${searchTerm} - did not match any results. Make sure that all words are spelled correctly.` : ""}
                    searchOnFocus={() => setIsAutoSuggestVisible(true)}
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
                    isIconRightAligned
                    isShowOverflowMenuCol={false}
                    searchHeadingText="Search by notification title"
                    dynamicTableLoader={isTableBodyLoading}
                    onClickSidePnlSecondaryBtn={() => setSideIsOpen(false)}
                    handleCloseSidePanel={() => setSideIsOpen(false)}
                    onClickOverflowItem={() => { }}
                    secondaryButtonTitle="Close"
                    isShowCheckboxCol
                    isShowThirdElement
                    isShowdynamictableNoMsg={
                        isShowdynamictableNoMsg({
                            totalNotifications,
                            noResults,
                            isSearching,
                            tableDataError
                        })
                    }
                    emptyRowResponseMessage={getEmptyStateMessage(tableDataError, totalNotifications, isSearching, hasSearch, hasActiveFilters, searchTerm, searchSuggestions)}
                    searchIsLoader={suggestionLoader}
                    emptyRowResponseCode={ResponseCode.Info}
                    isPagination={shouldShowPagination}
                    paginationCount={totalPages}
                    paginationOnChange={(e, page) => setCurrentPage(page)}
                    paginationPage={currentPage}
                    // onChangeListCheckBox={(index: number, id: string) => handleListCheckboxChange(index, id)}
                    // onChangeAllCheckBox={(event: any) => handleSelectAllChange(event, visibleNotificationIds)}
                    selectedCheckboxIds={handleSelectedCheckboxIds}
                    isClearSelectedCheckbox={isClearSelectedCheckbox}
                    showToastNotification={showDeleteToast}
                    toastNotificationStatus={NotificationStatus.SUCCESSTOAST}
                    toastNotificationTitle="Notification deleted"
                    // searchTagList={searchTagList}
                    dynamictableNoMsgColor={ValidationTextLevel.Warning}
                    searchTerm={searchTerm}
                    searchOnChange={(e) => {
                        if (e.target.value.length === 0) {
                            setNotificationState({ searchCleared: true });
                        }
                        handleSearchChangeWithAutoSuggest(e.target.value)
                    }}
                    searchSuggestions={searchSuggestions}
                    searchOnCloseHandle={() => {
                        console.log("Search cleared");
                        setSearchTerm("");
                        setIsAutoSuggestVisible(false);
                        setNotificationState({ searchCleared: true });

                        handleSearchKeyPressed("");
                    }}
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
            {renderSidePanel({ sideIsOpen, setSideIsOpen, selectedItem, setSelectedItem, notificationIdSelected: notificationIdSelected ?? null })}
        </div>
    )
};

export default NotificationTableSection;