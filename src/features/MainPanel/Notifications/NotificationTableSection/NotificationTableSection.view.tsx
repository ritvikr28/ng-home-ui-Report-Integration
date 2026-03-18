import React, { SyntheticEvent, useEffect, useMemo, useRef } from "react";
import { Button, ButtonColor, ButtonIconPosition, ButtonSize, ControlledList, DialogTemplate, IconColor, ISelectedItem, NotificationStatus, ResponseCode, SelectedItem, ValidationTextLevel } from "@essnextgen/ui-kit";
import { useTranslation, UseTranslationResponse } from "@essnextgen/ui-intl-kit";
import { handleSearchKeyPressed as handleSearchKeyPressedUtil, handleSearchChangeWithAutoSuggest as handleSearchChangeWithAutoSuggestUtil } from "./notificationTableHandlers";
import { fetchNotificationTableData, fetchSearchAutoSuggestData, isShowdynamictableNoMsg, shouldFetchTableData } from "./notificationTableApiHelpers";
import { getEmptyStateMessage } from "../hooks/useNotificationHook";
import NotificationSidePanelView from "../components/NotificationSidePanelComponent/NotificationSidePanel.view";
import { NotificationTableSectionFullProps, NotificationTableSectionProps, SearchTag } from "./NotificationTableSection.props";
import { buildTags } from "./NotificationTableSectionHelper";
import { getSearchOnClickClose } from "./notificationTableHandlers.view";
import DeleteConfirmationModalLogic from "../components/DeleteConfirmationModal/DeleteConfirmationModal.logic";

function renderSidePanel(props: {
    sideIsOpen: boolean;
    setSideIsOpen: (isOpen: boolean) => void;
    selectedItem: any;
    setSelectedItem: (item: any) => void;
    notificationIdSelected: string | null;
}): JSX.Element | null {
    return props.sideIsOpen ? <NotificationSidePanelView {...props} notificationIdSelected={props.notificationIdSelected ?? undefined} /> : null;
}



const NotificationTableSection: React.FC<NotificationTableSectionProps & {
    isDeleteDialogOpen: boolean;
    handleCloseDeleteDialog: () => void;
    handleConfirmDelete: () => void;
    selectedCount: number;
    isDeleteLoading: boolean;
    isNoSelectionMode: boolean;
    handleBulkAction: (selectedItem: { value?: string } | null, visibleIds?: string[]) => void;
    handleSelectAllChange: (event: any, visibleIds: string[]) => void;
    handleSelectedCheckboxIds: (ids: string[]) => void;
    handleListCheckboxChange: (index: number, id: string) => void;
    showDeleteToast: boolean;
    isClearSelectedCheckbox: boolean;
    sortBy: string;
    sortDirection: boolean;
    handleSort: (columnName: string) => void;
    isAutoSuggestVisible: boolean;
    setIsAutoSuggestVisible: React.Dispatch<React.SetStateAction<boolean>>;
    suggestionLoader: boolean;
    setSuggestionLoader: React.Dispatch<React.SetStateAction<boolean>>;
    setSearchSuggestions: React.Dispatch<React.SetStateAction<any[]>>;
    searchSuggestions: any[];
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
    // isdeleted: boolean;
    // setIsDeleted: React.Dispatch<React.SetStateAction<boolean>>;
    searchTerm: string;
    isSearching: boolean;
    noResults: boolean;
    totalNotifications: number;
    totalPages: number;
}> = (props) => {
    // Destructure all props
    const {
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
        currentPage,
        setCurrentPage,
        setNoResults,
        setTableData,
        setTotalTableData,
        setTableDataError,
        setIsTableBodyLoading,
        notificationState,
        setNotificationState,
        setFilterBtnClicked,
        filters,
        setFilters,
        isDeleteDialogOpen,
        handleCloseDeleteDialog,
        handleConfirmDelete,
        selectedCount,
        isDeleteLoading,
        isNoSelectionMode,
        handleBulkAction,
        handleSelectAllChange,
        handleSelectedCheckboxIds,
        handleListCheckboxChange,
        showDeleteToast,
        isClearSelectedCheckbox,
        sortBy,
        sortDirection,
        handleSort,
        isAutoSuggestVisible,
        setIsAutoSuggestVisible,
        suggestionLoader,
        setSuggestionLoader,
        setSearchSuggestions,
        searchSuggestions,
        setSearchTerm,
        searchTerm,
        isSearching,
        noResults,
        totalNotifications,
        totalPages
    }: NotificationTableSectionFullProps = props;


    const searchTagList: SearchTag = useMemo(() => buildTags(filters), [filters]);

    const { t }: UseTranslationResponse<"translation", undefined> = useTranslation();

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

    const handleBulkDeleteSelection: (_event: React.SyntheticEvent<Element, Event>, selectedItemOption: ISelectedItem) => void = (_event: React.SyntheticEvent, selectedItemOption: ISelectedItem) => {
        console.log("Selected bulk action:", selectedItemOption);
        handleBulkAction(selectedItemOption, visibleNotificationIds);
    };

    const tableWrapperRef: React.RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);

    const shouldShowPagination = !tableDataError && totalTableData !== 0 && !isTableBodyLoading;

    useEffect(() => {
        if (shouldFetchTableData({ sideIsOpen, hasSearch, searchCleared: notificationState.searchCleared })) {
            if (!isDeleteLoading) {
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
        }
    }, [notificationState, currentPage, sideIsOpen, sortBy, sortDirection, isDeleteLoading]);

    useEffect(() => {
        if (searchTerm.length >= 2) {
            fetchSearchAutoSuggestData({
                searchTerm,
                setSuggestionLoader,
                setSearchSuggestions
            });
        }
    }, [searchTerm, isAutoSuggestVisible, sideIsOpen, hasSearch]);

    const visibleNotificationIds: string[] = React.useMemo(() => tableRows.map((notification: any) => notification.id).filter(Boolean), [tableRows]);

    const searchOnClickClose: (e: React.SyntheticEvent<Element, Event>, text: string, closeObj: SelectedItem, id?: string | number) => void = getSearchOnClickClose(filters, setFilters, searchTagList);
    console.log("tableDataError----------------->>>>>>>", tableDataError, "==================", t("NotificationCenter_T.informationUnavailableTitle"))
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
                            "title": t("NotificationCenter_T.informationUnavailableTitle"),
                            "message": t("NotificationCenter_T.informationUnavailableMessage"),
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
                    searchOnClickClose={searchOnClickClose}
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
                                {t("NotificationCenter_T.filterBtn")}
                            </Button>
                        </div>
                    }
                    editSelectedBtnTitle={t("NotificationCenter_T.editSelected")}
                    editSelectedOptions={[
                        {
                            "disabled": false,
                            "isSelected": false,
                            "text": t("NotificationCenter_T.editSelectedDelete"),
                            "value": "Delete"
                        }
                    ]}
                    onEditSelectedOverFlowMenu={handleBulkDeleteSelection}
                    onEditSelectedBtnClick={() => { }}
                    emptyStateMsg={getEmptyStateMessage({ tableDataError, totalNotifications, isSearching, hasSearch, hasActiveFilters, searchTerm, searchSuggestions, t })}
                    onAddEventBtnClick={() => { }}
                    groupTagsEnabled
                    headingText={t("NotificationCenter_T.headingText")}
                    id="controlled-list"
                    isBreadCrumbEnable={false}
                    isOnCloseSidepnl
                    lastColContentAlign="center"
                    lastColHeaderAlign="center"
                    paginationMinCountToHideNextPreviousBtn={0}
                    isShowPrimaryBtn={false}
                    resultNotFoundMessage={!suggestionLoader && noResults && searchTerm.trim() ? t("NotificationCenter_T.resultNotFoundMessage", { searchTerm }) : ""}
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
                    searchHeadingText={t("NotificationCenter_T.searchHeadingText")}
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
                    emptyRowResponseMessage={getEmptyStateMessage({ tableDataError, totalNotifications, isSearching, hasSearch, hasActiveFilters, searchTerm, searchSuggestions, t })}
                    searchIsLoader={suggestionLoader}
                    emptyRowResponseCode={ResponseCode.Info}
                    isPagination={shouldShowPagination}
                    paginationCount={totalPages}
                    paginationOnChange={(e, page) => setCurrentPage(page)}
                    paginationPage={currentPage}
                    onChangeListCheckBox={handleListCheckboxChange}
                    onChangeAllCheckBox={(event: any) => handleSelectAllChange(event, visibleNotificationIds)}
                    selectedCheckboxIds={handleSelectedCheckboxIds}
                    isClearSelectedCheckbox={isClearSelectedCheckbox}
                    showToastNotification={showDeleteToast}
                    toastNotificationStatus={NotificationStatus.SUCCESSTOAST}
                    toastNotificationTitle="Notification deleted"
                    searchTagList={searchTagList}
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
                        setSearchTerm("");
                        setIsAutoSuggestVisible(false);
                        setNotificationState({ searchCleared: true });
                        handleSearchKeyPressed("");
                    }}
                    onSearchSuggestionItemClick={(prop: any | null) => {
                        const { name } = prop;
                        if (props) {
                            // eslint-disable-next-line react/prop-types
                            setSearchTerm(name);
                            // eslint-disable-next-line react/prop-types
                            handleSearchKeyPressed(name);
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
            {renderSidePanel({ sideIsOpen, setSideIsOpen, selectedItem, setSelectedItem, notificationIdSelected: notificationIdSelected ?? null })}

            {/* Delete Confirmation Modal Logic */}
            <DeleteConfirmationModalLogic
                isOpen={isDeleteDialogOpen}
                onClose={handleCloseDeleteDialog}
                onConfirm={isNoSelectionMode ? handleCloseDeleteDialog : handleConfirmDelete}
                selectedCount={selectedCount}
                isLoading={isDeleteLoading}
                isNoSelection={isNoSelectionMode}
            />
        </div>
    )
};

export default NotificationTableSection;