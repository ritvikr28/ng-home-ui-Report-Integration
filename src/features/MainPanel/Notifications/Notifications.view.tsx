import React, { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from "react";
import {
    Breadcrumbs
} from "@essnextgen/ui-kit";
import { useTranslation, UseTranslationResponse } from "@essnextgen/ui-intl-kit";
import "./style.scss";
import { getNotificationTableHeadersData } from "./helper";
import FilterDialogLogic from "./components/FilterDialogComponent/FilterDialog.logic";
import { useNotification } from "./useNotification";
import { NotificationTableData, NotificationTableRow, UseNotificationReturnType } from "./Notifications.props";
import { useTableRows } from "./hooks/useNotificationHook";
import NotificationTableSection from "./NotificationTableSection/NotificationTableSection.view";

const NotificationView: React.FC = () => {
    const { t }: UseTranslationResponse<"translation", undefined> = useTranslation();
    const [tableData, setTableData]: [any[], Dispatch<SetStateAction<any[]>>] = useState<any[]>([]);
    const [totalTableData, setTotalTableData]: [number, Dispatch<SetStateAction<number>>] = useState<number>(0);
    const [currentPage, setCurrentPage]: [number, Dispatch<SetStateAction<number>>] = useState(1);
    const [notificationState, setNotificationState]: [{ searchCleared: boolean }, React.Dispatch<React.SetStateAction<{ searchCleared: boolean }>>] = React.useState<{ searchCleared: boolean }>({ searchCleared: false });
    const [isTableBodyLoading, setIsTableBodyLoading]: [boolean, Dispatch<SetStateAction<boolean>>] = useState(false);
    const [tableDataError, setTableDataError]: [any, Dispatch<SetStateAction<any>>] = useState<any>(false);
    const [notificationIdSelected, setNotificationIdSelected]: [string | undefined, Dispatch<SetStateAction<string | undefined>>] = useState<string | undefined>(undefined);
    const [filterBtnClicked, setFilterBtnClicked]: [
        boolean,
        Dispatch<SetStateAction<boolean>>
    ] = useState<boolean>(false);

    const {
        searchTerm,
        setNoResults,
        isDeleteDialogOpen,
        closeDeleteDialog,
        isDeleteLoading,
        selectedCount,
        isNoSelectionMode,
        filters,
        setFilters,
        handleFilterChange,
        handleClearAllFilters,
        sortBy,
        sortDirection,
        confirmDelete,
        handleBulkAction,
        handleSelectAllChange,
        handleSelectedCheckboxIds,
        handleListCheckboxChange,
        showDeleteToast,
        isClearSelectedCheckbox,
        handleSort,
        isAutoSuggestVisible,
        setIsAutoSuggestVisible,
        suggestionLoader,
        setSuggestionLoader,
        setSearchSuggestions,
        searchSuggestions,
        setSearchTerm,
        // isdeleted,
        // setIsDeleted,
        isSearching,
        noResults,
        totalNotifications,
        totalPages
    }: UseNotificationReturnType = useNotification({ tableData, totalTableData, currentPage, setCurrentPage, setIsTableBodyLoading, setTotalTableData, setTableDataError });

    const [sideIsOpen, setSideIsOpen]: [boolean, Dispatch<SetStateAction<boolean>>] = useState(false);
    const [selectedItem, setSelectedItem]: [any, Dispatch<SetStateAction<any>>] = useState<any>("");

    const tableHeadersData: NotificationTableData = useMemo(
        () => getNotificationTableHeadersData({ sortBy, sortDirection, setNotificationIdSelected, setSideIsOpen, setSelectedItem, t }),
        [setSideIsOpen, setSelectedItem, sortBy, sortDirection, t]
    );

    const hasActiveFilters: any = useMemo(
        () =>
            (filters.status && filters.status.length > 0) ||
            (filters.priority && filters.priority.length > 0) ||
            filters.startDate ||
            filters.endDate,
        [filters]
    ) ?? "";

    const hasSearch: boolean = useMemo(() => searchTerm.trim().length > 0, [searchTerm]);

    // useNotificationTableData(currentPage, sideIsOpen, setTableData, setTotalTableData, setNoResults, setTableDataError, setIsTableBodyLoading, searchTerm, sortBy, sortDirection);

    const tableRows: NotificationTableRow[] = useTableRows(tableData, currentPage);

    const handleConfirmDelete: () => Promise<void> = async () => {
        const deletConfirmed:void = await confirmDelete();
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }
        return deletConfirmed
    };

    const handleCloseDeleteDialog: () => void = useCallback(() => {
        closeDeleteDialog();
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }
    }, [closeDeleteDialog]);

    // const handleConfirmDelete = useCallback(async () => {
    //     await confirmDelete();
    //     if (document.activeElement instanceof HTMLElement) {
    //         document.activeElement.blur();
    //     }
    // }, [confirmDelete]);

    // const shouldShowPagination = !tableDataError && totalTableData !== 0;

    useEffect(() => {
        document.body.classList.add('no-scroll');
    }, []);


    return (
        <div className="notification-layout" data-testid="notification-layout">
            <div style={{ marginBottom: 16, width: "100%" }}>
                <div className="notification-layout-header">
                    <Breadcrumbs
                        breadcrumbActions={[
                            { active: false, linkName: t("NotificationCenter_T.breadcrumbHome"), path: window.location.origin },
                            { active: false, linkName: t("NotificationCenter_T.breadcrumbNotificationCentre"), path: "#" }
                        ]}
                        className="essui-Breadcrumbs"
                        dataTestId="breadcrumb-test-id"
                        id="element-id"
                        onItemClick={(path: string) => {
                            window.location.href = path;
                        }}
                    />
                    <NotificationTableSection
                        tableData={tableData}
                        totalTableData={totalTableData}
                        hasSearch={hasSearch}
                        hasActiveFilters={hasActiveFilters}
                        sideIsOpen={sideIsOpen}
                        selectedItem={selectedItem}
                        tableDataError={tableDataError}
                        tableRows={tableRows}
                        tableHeadersData={tableHeadersData}
                        isTableBodyLoading={isTableBodyLoading}
                        notificationIdSelected={notificationIdSelected}
                        setSideIsOpen={setSideIsOpen}
                        setSelectedItem={setSelectedItem}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        setTableData={setTableData}
                        setTotalTableData={setTotalTableData}
                        setNoResults={setNoResults}
                        setTableDataError={setTableDataError}
                        setIsTableBodyLoading={setIsTableBodyLoading}
                        notificationState={notificationState}
                        setNotificationState={setNotificationState}
                        filterBtnClicked={filterBtnClicked}
                        setFilterBtnClicked={setFilterBtnClicked}
                        filters={filters}
                        setFilters={setFilters}
                        isDeleteDialogOpen={isDeleteDialogOpen}
                        handleCloseDeleteDialog={handleCloseDeleteDialog}
                        handleConfirmDelete={handleConfirmDelete}
                        selectedCount={selectedCount}
                        isDeleteLoading={isDeleteLoading}
                        isNoSelectionMode={isNoSelectionMode}
                        handleBulkAction={(item, ids) => handleBulkAction(item, ids ?? [])}
                        handleSelectAllChange={handleSelectAllChange}
                        handleSelectedCheckboxIds={handleSelectedCheckboxIds}
                        handleListCheckboxChange={handleListCheckboxChange}
                        showDeleteToast={showDeleteToast}
                        isClearSelectedCheckbox={isClearSelectedCheckbox}
                        sortBy={sortBy}
                        sortDirection={sortDirection}
                        handleSort={handleSort}
                        isAutoSuggestVisible={isAutoSuggestVisible}
                        setIsAutoSuggestVisible={setIsAutoSuggestVisible}
                        suggestionLoader={suggestionLoader}
                        setSuggestionLoader={setSuggestionLoader}
                        setSearchSuggestions={setSearchSuggestions}
                        searchSuggestions={searchSuggestions}
                        setSearchTerm={setSearchTerm}
                        // isdeleted={isdeleted}
                        // setIsDeleted={setIsDeleted}
                        searchTerm={searchTerm}
                        isSearching={isSearching}
                        noResults={noResults}
                        totalNotifications={totalNotifications}
                        totalPages={totalPages}
                    />
                    {filterBtnClicked && (
                        <FilterDialogLogic
                            setFilterBtnClicked={setFilterBtnClicked}
                            filters={filters}
                            onApply={handleFilterChange}
                            onClear={handleClearAllFilters}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default NotificationView;