/* eslint-disable @typescript-eslint/no-unused-vars */
import { Breadcrumbs, ControlledList, NotificationStatus, DialogTemplate, ResponseCode, Button, ButtonColor, ButtonSize, IconColor, ButtonIconPosition, ISelectedItem } from "@essnextgen/ui-kit";
import React, { useEffect } from "react";
import "./style.scss";
import { getNotificationTableHeadersData } from "./helper";
import FilterDialogLogic from "./components/FilterDialogComponent/FilterDialog.logic";
import { useNotification } from "./useNotification";
import NotificationSidePanelView from "./components/NotificationSidePanelComponent/NotificationSidePanel.view";
import DeleteConfirmationModalLogic from "./components/DeleteConfirmationModal/DeleteConfirmationModal.logic";

const NotificationView = () => {
    const {
        filterBtnClicked,
        setFilterBtnClicked,
        currentPage,
        totalPages,
        paginatedNotifications,
        totalNotifications,
        totalOriginalNotifications,
        handlePageChange,
        searchTerm,
        handleSearchChange,
        handleClearSearch,
        isSearching,
        noResults,
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
        handleRemoveFilter,
        handleClearAllFilters,
        searchTagList,
        sortBy,
        sortDirection,
        handleSort
    } = useNotification();
    const [sideIsOpen, setSideIsOpen] = React.useState(false);
    const [selectedItem, setSelectedItem] = React.useState<any>(null);
    const tableWrapperRef = React.useRef<HTMLDivElement>(null);
    const getNotificationId = React.useCallback((notification: any) => notification?.id ?? notification?.Id, []);

    const tableHeadersData = React.useMemo(
        () => getNotificationTableHeadersData(setSideIsOpen, setSelectedItem, sortBy, sortDirection),
        [setSideIsOpen, setSelectedItem, sortBy, sortDirection]
    );

    const hasActiveFilters = React.useMemo(() => 
        (filters.status && filters.status.length > 0) || 
        (filters.priority && filters.priority.length > 0) || 
        filters.startDate || 
        filters.endDate
    , [filters]);

    const hasSearch = React.useMemo(() => searchTerm.trim().length > 0, [searchTerm]);

    const tableRows = React.useMemo(
        () =>
            paginatedNotifications.map((notification: any, index: number) => {
                const existingId = getNotificationId(notification);
                return {
                    ...notification,
                    id: existingId ?? `notification-${currentPage}-${index}`
                };
            }),
        [currentPage, getNotificationId, paginatedNotifications]
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

    const shouldShowPagination = totalPages > 1 && paginatedNotifications.length > 0 && !noResults;

    const getEmptyStateMessage = () => {
        if (totalOriginalNotifications === 0 && !isSearching) {
            return "No data to display";
        }
        if (totalNotifications === 0 && !isSearching && hasSearch) {
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
                                    null
                                }
                                isAddEventBtnShow={false}
                                dataTestId="controlled-list-test-id"
                                filterDDLOptions={[]}
                                isShowSearch={true}
                                searchTerm={searchTerm}
                                searchOnChange={(e) => handleSearchChange(e.target.value)}
                                searchOnClickClose={(e: React.SyntheticEvent, text?: string, closeObj?: { name?: string; id?: string | number; value?: string }) => {
                                    if (closeObj) {
                                        if (closeObj.id === 1) {
                                            handleRemoveFilter('status', closeObj.value);
                                        } else if (closeObj.id === 2) {
                                            handleRemoveFilter('priority', closeObj.value);
                                        } else if (closeObj.id === 3 || closeObj.name === 'Date') {
                                            handleRemoveFilter('startDate');
                                        }
                                    } else {
                                        handleClearSearch();
                                    }
                                }}
                                searchOnCloseHandle={handleClearSearch}
                                isShowFirstElement={true}
                                isShowFourthElement={true}
                                filterCustumeElem2={
                                    <div className="notification-controls">
                                        <Button
                                            className="base-class"
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
                            searchHeadingText="Search by notification title"
                            isSearchHideClearIcon={searchTerm ? searchTerm.length !== 2 : false}
                            dynamicTableLoader={false}
                            onClickSidePnlSecondaryBtn={() => { setSideIsOpen(false) }}
                            handleCloseSidePanel={() => { setSideIsOpen(false) }}
                            sidePanelTitle="View"
                            sidePanelSubTitle=""
                            addEditTemplateChild={() =>
                                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                                    <div style={{ fontSize: "20px", fontWeight: 400, lineHeight: "24px" }}>{selectedItem ? selectedItem[0].notification : null}</div>
                                    <div style={{ fontSize: "16px", fontWeight: 400, lineHeight: "24px" }}>The role Headteacher has been updated by the Trust and is now ready for use. Historical data will not be affected.Historical data will not be affected.</div>
                                </div>
                            }
                            onClickOverflowItem={() => { }}
                            secondaryButtonTitle="Close"
                            isShowCheckboxCol={true}
                            isShowThirdElement={true}
                            isShowdynamictableNoMsg={(totalNotifications === 0 || noResults) && !isSearching}
                            emptyRowResponseMessage={getEmptyStateMessage()}
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
                        />
                        </div>
                        <NotificationSidePanelView
                            sideIsOpen={sideIsOpen}
                            setSideIsOpen={setSideIsOpen}
                            selectedItem={selectedItem}
                        />
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