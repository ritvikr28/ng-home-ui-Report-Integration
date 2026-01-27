import React, { useRef } from "react";
import { Button, ButtonColor, ButtonIconPosition, ButtonSize, ControlledList, DialogTemplate, IconColor, NotificationStatus, ResponseCode, ValidationTextLevel } from "@essnextgen/ui-kit";
import { getEmptyStateMessage } from "../hooks/useNotificationHook";
import { UseNotificationReturnType } from "../Notifications.props";
import { useNotification } from "../useNotification";
import NotificationSidePanelView from "../components/NotificationSidePanelComponent/NotificationSidePanel.view";

interface NotificationTableSectionProps {
    // tableWrapperRef: React.RefObject<HTMLDivElement>;
    tableDataError: boolean;
    tableRows: any[];
    tableHeadersData: any[];
    isTableBodyLoading: boolean;
    sideIsOpen: boolean;
    setSideIsOpen: (open: boolean) => void;
    selectedItem: any;
    setSelectedItem: (item: any) => void;
    notificationIdSelected: string | undefined;
    tableData: any[]; // Add tableData to the props
    totalTableData: number; // Add totalTableData to the props
    hasSearch: boolean; // Add hasSearch to the props
    hasActiveFilters: boolean; // Add hasActiveFilters to the props
    currentPage: number; // Add currentPage to the props
    setCurrentPage: (page: number) => void; // Add setCurrentPage to the props
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
    setCurrentPage
}) => {
    const {
        // filterBtnClicked,
        setFilterBtnClicked,
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
        isClearSelectedCheckbox
        // selectedCount,
        // isNoSelectionMode,
        // filters,
        // handleFilterChange
        // handleClearAllFilters,
        // searchTagList,
        // sortBy,
        // sortDirection,
        // handleSort
    }: UseNotificationReturnType = useNotification({
        tableData,
        totalTableData,
        currentPage,
        setCurrentPage: (value) => setCurrentPage(typeof value === "function" ? value(currentPage) : value)
    });
    const tableWrapperRef: React.RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
    
    const shouldShowPagination = !tableDataError && totalTableData !== 0;

    return (
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
                    isShowSearch={true}
                    isShowFirstElement={true}
                    isShowFourthElement={true}
                    filterCustumeElem2={
                        <div className="notification-controls">
                            <Button
                                className="filter-btn-clc"
                                color={ButtonColor.Utility}
                                data-testid="filter"
                                onClick={() => setFilterBtnClicked(true)}
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
                    emptyStateMsg={getEmptyStateMessage(tableDataError, totalNotifications, isSearching, hasSearch, hasActiveFilters, searchTerm)}
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
                    // sortingOnClickEvent={(e: React.SyntheticEvent, columnName: string) => {
                    //     handleSort(columnName);
                    // }}
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
                    searchHeadingText="Search by notification title"
                    isSearchHideClearIcon={searchTerm ? searchTerm.length !== 2 : false}
                    dynamicTableLoader={isTableBodyLoading}
                    onClickSidePnlSecondaryBtn={() => setSideIsOpen(false)}
                    handleCloseSidePanel={() => setSideIsOpen(false)}
                    onClickOverflowItem={() => { }}
                    secondaryButtonTitle="Close"
                    isShowCheckboxCol={true}
                    isShowThirdElement={true}
                    isShowdynamictableNoMsg={
                        (totalNotifications === 0 || !noResults) || !isSearching || tableDataError
                    }
                    emptyRowResponseMessage={getEmptyStateMessage(tableDataError, totalNotifications, isSearching, hasSearch, hasActiveFilters, searchTerm)}
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
    )
};

export default NotificationTableSection;