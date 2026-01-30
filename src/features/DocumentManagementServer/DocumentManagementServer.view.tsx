import React, { useState, useEffect } from "react"
import { useLocation } from "react-router-dom";
import { useTranslation,UseTranslationResponse } from "@essnextgen/ui-intl-kit";
import { LocalisedMenu } from "@essnextgen/ui-application-kit"
import { authService, MatchPermissions } from "@essnextgen/auth-ui";
import { Grid, GridItem, Button,ButtonColor,Notification, IconColor,ButtonSize, Breadcrumbs, NotificationStatus, useMediaQuery, ISelectedItem } from "@essnextgen/ui-kit"
import dayjs from "dayjs"
import { buildSelectedDocs, buildValidationPayload, fetchGetDocumentDetailsLogic, fetchViewDownloadData,  getTitleConfirmation, handleSearchChange, onBreadcrumbClick, prepareDownload } from "./DocumentManagementServer.logic"
import "./style.scss"
import { DocumentRow } from "./responseModel"
import { pageSizeNumber } from "../../../public/Constants"
import { CapitalizeFirstLetter } from "../../shared/utils/commonFunctions"
import { viewDownload ,clearAllFiles, deleteFiles, validation} from "./ApiService"
import gtmAnalytics from "../../shared/utils/analytics";
import { handlePageChange, handleEditSelectedOverFlowMenu, handleTagCloseLogic, handleBulkDeleteLogic, handleApply, handleClearAllConfirm, closeSidePanel, handleSuggestionClick, getNotificationMsgBannerObject } from "./DocumentManagementServer.handler";
import { getCategoryArr, getDateTag, getVisibleTagsWithSummary, getAllRegistrationIds, mapRelatedArr, getResultNotFoundMsg, filterNonEmptySuggestions, getCompletedPartitionKeys,  handleSorting, handleOnChangeAllCheckBox, handleOnChangeCheckBox, getDeleteDialogMessages, getDialogConfig } from "./DocumentManagementServer.utils";
import { useBodyNoScroll, useFetchDocsEffect, useOpenSidePanelOnViewDownload, useScrollToTopOnPageChange, useSearchTermEffect, useSetFailedFileNameOnCancelled, useSetTotalPageOnDocData, useSidePanelViewDownloadEffect, useSummaryTagMutationObserver, useTotalSelectedCountEffect } from "./useDocumentManagementEffects";
import { DmsDialogs } from "./DocumentManagementServer.dialog";
import DmsControlledList from "./DocumentManagementServer.table";
import { useDocumentManagementState } from "./useDocumentManagementState";


const DocumentManagementServerView: () => JSX.Element = () => {
   const { t }: UseTranslationResponse<"translation", undefined> = useTranslation();
    const {
        dialogType, setDialogType,
    currentPage, setCurrentPage,
    totalPage, setTotalPage,
    searchInput, setSearchInput,
    searchTerm, setSearchTerm,
    searchText, setSearchText,
    suggestions, setSuggestions,
    isSearchLoading, setIsSearchLoading,
    isSearchTriggered, setIsSearchTriggered,
    showSearchError, setShowSearchError,
    docData, setDocData,
    issearchDataLoading, setIsSearchDataLoading,
    showErrorBanner, setShowErrorBanner,
    sortBy, setSortBy,
    sortDirection, setSortDirection,
    visibleBreadcrumbs,
    dateRange, setDateRange,
    selectedDateRange, setSelectedDateRange,
    isDateError, setIsDateError,
    selectedCategories, setSelectedCategories,
    selectedFormats, setSelectedFormats,
    allSelectedDocs, setAllSelectedDocs,
    selectedEntities, setSelectedEntities,
    tagListArray, setTagListArray,
    viewData, setViewData,
    downloadPollingIntervalRef,
    isFilterDialogOpen, setIsFilterDialogOpen,
    isFilterLoading, setIsFilterLoading,
    isClearSelectedCheckbox, setIsClearSelectedCheckbox,
    isSidePanelOpen, setIsSidePanelOpen,
    sidePanelOpenReason, setSidePanelOpenReason,
    isSidePanelLoader, setIsSidePanelLoader,
    showDialog, setShowDialog,
    showConfirmDialog, setShowConfirmDialog,
    selectedCheckBoxIds, setSelectedCheckBoxIds,
    excludedCheckBoxIds, setExcludedCheckBoxIds,
    // prevSelectedDocs, setPrevSelectedDocs,
    isHeaderBoxChecked, setIsHeaderBoxChecked,
    documentRelatedTo, setDocumentRelatedTo,
    searchRefExternalId, setSearchRefExternalId,
    showDeleteSuccessToast, setShowDeleteSuccessToast,
    showDeleteAbortBanner, setShowDeleteAbortBanner,
    restrictedFileCount, setRestrictedFileCount,
    alreadyDeletedFileCount, setAlreadyDeletedFileCount,
    availableFileCount, setAvailableFileCount,
    availableFileIds, setAvailableFileIds,
    showRestrictedDeleteDialog, setShowRestrictedDeleteDialog,
    showRestrictedPrepareDialog, setShowRestrictedPrepareDialog,
    isPreDialogLoading, setIsPreDialogLoading,
    isDialogLoading, setIsDialogLoading,
    isInitialLoad, setIsInitialLoad,
    tableKey, setTableKey,
    totalSelectedCount, setTotalSelectedCount,
    isGlobalLoaderModel, setIsGlobalLoaderModel,
    // prepareDownloadError, setPrepareDownloadError,
    // PrepareDownloadAbortBanner, setPrepareDownloadAbortBanner,
    // clearAllError, setClearAllError,
    // showEmailNotification, setShowEmailNotification,
    // showToastNotification, setShowToastNotification,
    // downloadError, setDownloadError,
    // failedFileName, setFailedFileName,
    // hasFetchedViewDownload, setHasFetchedViewDownload,
    // isViewDownloadError, setIsViewDownloadError,
    selectedRelatedTo, setSelectedRelatedTo,
    showDeleteErrorBanner, setShowDeleteErrorBanner,
    setPrepareDownloadError,
    setPrepareDownloadAbortBanner,
    setClearAllError,
    setShowEmailNotification,
    setShowToastNotification,
    setFailedFileName,
    setHasFetchedViewDownload,
    setIsViewDownloadError,
    setPrevSelectedDocs,
    
    } = useDocumentManagementState(t); // <-- Add this custom hook or state provider
   
    const hasDMSDeletePermissions: boolean = authService.isAuthorised(
    [{ Securable: "NG.DocumentManagementServer.Documents", Operation: "Delete" }],
    MatchPermissions.all
    );

    const location = useLocation();
    
    const categoryArr: any[] = getCategoryArr(selectedFormats);
    const dateTagArr: any[] = getDateTag(dateRange);
    const searchTagListRaw: any[] = [
    ...categoryArr,
    ...dateTagArr
    ];

    const messages: string[] = getDeleteDialogMessages({
        t, restrictedFileCount, availableFileCount, docData, alreadyDeletedFileCount, excludedCheckBoxIds, isHeaderBoxChecked
    });

    const contentText: JSX.Element = <div style={{ whiteSpace: "pre-line" }}>{messages.join("\n")}</div>;

    
    useOpenSidePanelOnViewDownload(location, setSidePanelOpenReason, setIsSidePanelOpen);

    const searchTagList: any[] = getVisibleTagsWithSummary(searchTagListRaw, 3);

    const allRegistrationIds: number[] = getAllRegistrationIds(selectedFormats);

    let tableData: any[] = [];

        if (showSearchError || !docData?.data?.length) {
        tableData = [];
        } else if (docData?.data) {
        tableData = docData?.data.map((doc: DocumentRow) => ({
            id: doc?.fileId,
            Document: doc?.document,
            Relatedto: mapRelatedArr(doc) || "",
            Category: (doc?.category && CapitalizeFirstLetter(doc?.category)) || "",
            Addedby: doc?.addedBy || "",
            "Date added": doc?.dateAdded && dayjs(doc?.dateAdded).format("DD MMM YYYY") || "",
            Format: doc?.format,
            Size: doc?.size,
            isShowCheckBox: true
        }));
        }

        const onPageChange: (event: unknown, page: number) => void = (event: unknown, page: number): void =>
        handlePageChange(event, page, setCurrentPage, setIsSearchDataLoading);

    const fetchGetDocumentDetails = (
    page: number,
    categories: number[],
    sortByCol: string = sortBy,
    sortOrder = sortDirection,
    refExternalId: string[] = searchRefExternalId,
    relatedTo: number = documentRelatedTo
    ): void => {
    fetchGetDocumentDetailsLogic({
        page, categories, sortByCol, sortOrder, dateRange, refExternalId, relatedTo, setDocData, setCurrentPage, setTotalPage, setShowSearchError, 
        setIsSearchLoading, setIsSearchDataLoading,  setPrepareDownloadAbortBanner, setShowDeleteAbortBanner, setShowDeleteErrorBanner, setSuggestions
    });
    };

   useFetchDocsEffect({currentPage, searchText, dateRange, selectedFormats, sortBy, sortDirection, searchRefExternalId,
        documentRelatedTo, isSearchTriggered, isFilterDialogOpen, allRegistrationIds, fetchGetDocumentDetails, setIsInitialLoad });  

    useSidePanelViewDownloadEffect({isSidePanelOpen, sidePanelOpenReason, setShowToastNotification, setIsSidePanelLoader,
    fetchViewDownloadData, setViewData, setHasFetchedViewDownload, viewDownload, downloadPollingIntervalRef, setIsViewDownloadError, setShowEmailNotification,
    });


const onEditSelectedOverFlowMenu: (e: React.SyntheticEvent, selectedItem: ISelectedItem) => void = (e: React.SyntheticEvent, selectedItem: ISelectedItem) => {
  handleEditSelectedOverFlowMenu({
    e, selectedItem, totalSelectedCount, setShowDialog, setShowConfirmDialog, setShowRestrictedDeleteDialog, setShowRestrictedPrepareDialog, setIsPreDialogLoading, isHeaderBoxChecked, allSelectedDocs, buildValidationPayload,
    allRegistrationIds, dateRange, searchRefExternalId, documentRelatedTo, validation, setRestrictedFileCount, setAlreadyDeletedFileCount, setAvailableFileCount, setDialogType, setIsDialogLoading, setSidePanelOpenReason,
    setIsSidePanelOpen, setAvailableFileIds, setShowErrorBanner
  });
};

const hasCompletedFiles: boolean = viewData.some(item => item.status?.toLowerCase() === 'complete');

    const handleSearchClose = () => {
        setSearchInput("");
        setSearchTerm("");
        setSearchText("");
        setIsSearchTriggered(false);
        setShowSearchError(false);
        setIsSearchLoading(false);
        setDocData(null);
        setSelectedCategories([]);
        setSelectedFormats([]);
        setDateRange({ fromDate: "", toDate: "" });
        setSelectedDateRange({ fromDate: "", toDate: "" });
        setSortBy("DateAdded");
        setSortDirection("Desc");
        setCurrentPage(1);
        setIsFilterDialogOpen(false);
        setTotalPage(0);
        setSelectedCheckBoxIds([]);
        setAllSelectedDocs([]);
        setIsClearSelectedCheckbox(true);
        setIsInitialLoad(true);
        setTableKey(prev => prev + 1);
        setIsHeaderBoxChecked(false);
        setExcludedCheckBoxIds([]);
        setPrevSelectedDocs([]);
        setSelectedRelatedTo(undefined);
        setShowDeleteAbortBanner(false);
        setPrepareDownloadAbortBanner(false);
        setShowDeleteErrorBanner(false);
        setShowErrorBanner(false);
        };

        useEffect(() => {
            if (isClearSelectedCheckbox) {
                setIsClearSelectedCheckbox(false);
            }
        }, [isClearSelectedCheckbox]);

    const handleTagClose: (e: React.SyntheticEvent, text: string, closeObj: { name?: string; id?: string | number }) => void = (
        e: React.SyntheticEvent,
        text: string,
        closeObj: { name?: string; id?: string | number }
            ) => {
            handleTagCloseLogic( e, text, closeObj, setSelectedDateRange, setDateRange, setIsDateError,
                setSelectedCategories, setSelectedFormats
            );
            setCurrentPage(1);
    };
        useTotalSelectedCountEffect({isHeaderBoxChecked, excludedCheckBoxIds, docData, allSelectedDocs,
             setIsHeaderBoxChecked, setAllSelectedDocs, setExcludedCheckBoxIds, setTotalSelectedCount});

    const NotificationMsgBannerObject: any = getNotificationMsgBannerObject(
        t, showErrorBanner, showSearchError, showDeleteErrorBanner, showDeleteAbortBanner, availableFileCount, setShowDeleteErrorBanner, setShowDeleteAbortBanner);

    useSearchTermEffect({  searchTerm, selectedFormats, selectedDateRange, showSearchError, isSearchTriggered, handleSearchChange,
        t, setSearchTerm, setSuggestions, setShowSearchError, setIsSearchLoading, setShowErrorBanner
    });

    const resultNotFoundMSG: string | undefined = getResultNotFoundMsg(t,searchText, docData, searchTerm, showErrorBanner, isSearchTriggered, showSearchError);
    const filteredSuggestions: any[] = filterNonEmptySuggestions(suggestions);

    const handleBulkDelete: () => void = () =>
        handleBulkDeleteLogic({ allSelectedDocs, docData, allRegistrationIds, dateRange, searchRefExternalId, documentRelatedTo, currentPage,
            sortBy, sortDirection, setShowToastNotification, setShowConfirmDialog, setSelectedCheckBoxIds, setAllSelectedDocs, setIsClearSelectedCheckbox, setShowDeleteErrorBanner, 
            setShowDeleteSuccessToast, setShowDeleteAbortBanner, fetchGetDocumentDetails, deleteFiles, excludedCheckBoxIds, isHeaderBoxChecked, setIsSearchDataLoading, availableFileIds
        });

    const handleApplyWrapper: (referenceExternalIds: string[], categories?: ISelectedItem[], selectedEntity?: any[]) => void = (referenceExternalIds: string[], categories?: ISelectedItem[], selectedEntity?: any[]) => {
    handleApply({ referenceExternalIds, categories, selectedCategories, selectedDateRange, isDateError, selectedEntity, setIsDateError, setIsFilterLoading, setDateRange, setSelectedFormats,
        setIsFilterDialogOpen, setCurrentPage, setExcludedCheckBoxIds, setAllSelectedDocs, setSearchInput, setSearchTerm, setSearchText, setTableKey, setIsSearchTriggered, setSelectedCategories, setSearchRefExternalId,
        setIsHeaderBoxChecked, setSelectedCheckBoxIds,  setPrevSelectedDocs,  setSelectedEntities, setSortBy, setSortDirection, setIsInitialLoad
    });
    };

    const dialogConfig: any = getDialogConfig({
    dialogType, t, availableFileCount, docData, isHeaderBoxChecked, setShowConfirmDialog, setClearAllError,
    handleClearAllConfirm, viewData, clearAllFiles, setShowToastNotification, fetchViewDownloadData, setIsSidePanelLoader,
    setViewData, setHasFetchedViewDownload, viewDownload, downloadPollingIntervalRef, getCompletedPartitionKeys, setIsViewDownloadError,
    setShowEmailNotification, contentText, alreadyDeletedFileCount, currentPage, getAllRegistrationIds, selectedFormats, sortBy,
    sortDirection, searchRefExternalId, documentRelatedTo, setSelectedCheckBoxIds, setAllSelectedDocs, setIsClearSelectedCheckbox,
    setIsHeaderBoxChecked, setPrevSelectedDocs, setExcludedCheckBoxIds, setTableKey, setIsDialogLoading, setIsGlobalLoaderModel,
    handleBulkDelete, setPrepareDownloadError, setPrepareDownloadAbortBanner, setSidePanelOpenReason, setIsSidePanelOpen,
    buildSelectedDocs, selectedCheckBoxIds, allSelectedDocs, dateRange, selectedEntities, prepareDownload,
    totalSelectedCount, restrictedFileCount, excludedCheckBoxIds, availableFileIds,
    });

    const handleFilterOnClick: () => void = () => {
        setIsFilterDialogOpen(true);
        setSelectedDateRange({ fromDate: dateRange?.fromDate || "", toDate: dateRange?.toDate || "" });
        setTagListArray(tagListArray)
    };

    useSetFailedFileNameOnCancelled(viewData, setFailedFileName);


    useEffect(() => {
        gtmAnalytics.pushPageViewEvent("Admin Console");
    }, []);


    const handleCloseSidePanel: () => void = () => {
        closeSidePanel(setIsSidePanelOpen, downloadPollingIntervalRef);
    };
        const isMobileView: boolean = useMediaQuery(
        "(min-width:320px) and (max-width: 1023.9px)"
    );
 
    const isMobileViewSmall: boolean = useMediaQuery(
        "(min-width:400px) and (max-width: 896px)"
    );
    const [isOpen, setIsOpen]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);

    /* istanbul ignore next */
    useScrollToTopOnPageChange(currentPage);

    /* istanbul ignore next */
    useBodyNoScroll(isMobileView);

 /* istanbul ignore next */
    useSummaryTagMutationObserver([searchTagList,isMobileView,isMobileViewSmall,tableKey,searchInput,selectedCategories]);
    const handleButtonClick: () => void = () => {
        setIsOpen(!isOpen);
    };
 
    useEffect(() => {
        setIsOpen(!isMobileView);
    }, [!isMobileView]);

    useSetTotalPageOnDocData(docData, setTotalPage, pageSizeNumber);

    return (<>
        <>
            <div className="clc-dms-delete-toast">
                {showDeleteSuccessToast && (
                    <Notification
                        status={NotificationStatus.SUCCESSTOAST}
                        title={
                          availableFileCount === 1
                            ? t("DocumentManagementServer.documentDeleted")
                            : t("DocumentManagementServer.documentsDeleted")
                        }
                        autoclose
                        hideCloseButton
                    />
                )}
            </div>
            <Grid className="dms-layout">
              <DmsDialogs
                    t={t}
                    showDialog={showDialog}
                    setShowDialog={setShowDialog}
                    showRestrictedDeleteDialog={showRestrictedDeleteDialog}
                    setShowRestrictedDeleteDialog={setShowRestrictedDeleteDialog}
                    showRestrictedPrepareDialog={showRestrictedPrepareDialog}
                    setShowRestrictedPrepareDialog={setShowRestrictedPrepareDialog}
                    restrictedFileCount={restrictedFileCount}
                    alreadyDeletedFileCount={alreadyDeletedFileCount}
                    availableFileCount={availableFileCount}
                    totalSelectedCount={totalSelectedCount}
                    isHeaderBoxChecked={isHeaderBoxChecked}
                    isPreDialogLoading={isPreDialogLoading}
                    onRefreshAfterClose={() => {
                        setSelectedCheckBoxIds([]);
                        setAllSelectedDocs([]);
                        setIsClearSelectedCheckbox(true);
                        setTableKey(prev => prev + 1);
                    }}
                    />
                <GridItem className={(!isMobileView) ? "side-width" : "no-side-width"}>
                    {!isOpen && (
                        <Button
                            className="base-class"
                            color={ButtonColor.Utility}
                            dataTestId="btn-collapse"
                            iconColor={IconColor.Neutral800}
                            iconName="open-panel--left--filled"
                            onClick={handleButtonClick}
                            size={ButtonSize.Small}
                        />
                    )}
                    <LocalisedMenu
                        customHeight={100}
                        menuHeading={t("DocumentManagementServer.adminconsole")}
                        onCloseSideNavigationPanel={() => setIsOpen(false)}
                        isOpenSideNavigation={isOpen}
                        defaultSelectedMenu={{
                            text: "Documents",
                            value: window.location.href,
                        }}
                    />
 
                    {isMobileView && <Breadcrumbs
                        breadcrumbActions={visibleBreadcrumbs}
                        className="essui-Breadcrumbs"
                        dataTestId="breadcrumb-test-id"
                        id="element-id"
                        onItemClick={onBreadcrumbClick}
                    />}
                </GridItem>
                <GridItem className={isOpen ? "clc-dms-isopen" : "clc-dms-isclose"}>
                    <div
                        style={{
                            marginBottom: 16,
                            width: "100%"
                        }}
 
                    >
                        {!isMobileView && <div>
                            <Breadcrumbs
                                breadcrumbActions={visibleBreadcrumbs}
                                className="essui-Breadcrumbs"
                                dataTestId="breadcrumb-test-id"
                                id="element-id"
                                onItemClick={onBreadcrumbClick}
                            />
                        </div>
                        }
                 
                   <div className="grid-wrapper">
                          <DmsControlledList
                                t={t}
                                tableKey={tableKey}
                                tableData={tableData}
                                totalPage={totalPage}
                                currentPage={currentPage}
                                isInitialLoad={isInitialLoad}
                                searchInput={searchInput}
                                searchTerm={searchTerm}
                                filteredSuggestions={filteredSuggestions}
                                isSearchLoading={isSearchLoading}
                                issearchDataLoading={issearchDataLoading}
                                showErrorBanner={showErrorBanner}
                                showSearchError={showSearchError}
                                isSearchTriggered={isSearchTriggered}
                                NotificationMsgBannerObject={NotificationMsgBannerObject}
                                resultNotFoundMSG={resultNotFoundMSG ?? ""}
                                searchTagListRaw={searchTagListRaw}
                                onPageChange={onPageChange}
                                handleSorting={(columnName: string) => handleSorting(columnName, sortBy, setSortBy, sortDirection, setSortDirection, t)}
                                isClearSelectedCheckbox={isClearSelectedCheckbox}
                                setSelectedCheckBoxIds={setSelectedCheckBoxIds}
                                setExcludedCheckBoxIds={setExcludedCheckBoxIds}
                                onChangeAllCheckBox={(e) => handleOnChangeAllCheckBox(e, setIsHeaderBoxChecked, setSelectedCheckBoxIds, setExcludedCheckBoxIds,
                                    setPrevSelectedDocs, setAllSelectedDocs)}
                                onChangeListCheckBox={handleOnChangeCheckBox}
                                onEditSelectedOverFlowMenu={onEditSelectedOverFlowMenu}
                                handleSearchClose={handleSearchClose}
                                handleTagClose={handleTagClose}
                                handleSearchChange={(e: any) => handleSearchChange(t, e, getAllRegistrationIds(selectedCategories), selectedDateRange?.fromDate, selectedDateRange?.toDate, setSearchTerm, setSuggestions, setShowSearchError, setIsSearchLoading, setShowErrorBanner)}
                                handleSuggestionClick={handleSuggestionClick}
                                isFilterDialogOpen={isFilterDialogOpen}
                                setIsFilterDialogOpen={setIsFilterDialogOpen}
                                isFilterLoading={isFilterLoading}
                                selectedCategories={selectedCategories}
                                setSelectedCategories={setSelectedCategories}
                                selectedDateRange={selectedDateRange}
                                setSelectedDateRange={setSelectedDateRange}
                                isDateError={isDateError}
                                setIsDateError={setIsDateError}
                                setDocumentRelatedTo={setDocumentRelatedTo}
                                selectedRelatedTo={selectedRelatedTo}
                                setSelectedRelatedTo={setSelectedRelatedTo}
                                tagListArray={tagListArray}
                                setTagListArray={setTagListArray}
                                handleApplyWrapper={handleApplyWrapper}
                                handleFilterOnClick={handleFilterOnClick}
                                isSidePanelOpen={isSidePanelOpen}
                                isSidePanelLoader={isSidePanelLoader}
                                availableFileCount={availableFileCount}
                                handleCloseSidePanel={handleCloseSidePanel}
                                isDialogLoading={isDialogLoading}
                                isGlobalLoaderModel={isGlobalLoaderModel}
                                getTitleConfirmation={getTitleConfirmation}
                                dialogConfig={dialogConfig}
                                dialogType={dialogType}
                                docData={docData}
                                hasDMSDeletePermissions={hasDMSDeletePermissions}
                                hasCompletedFiles={hasCompletedFiles}
                                setShowConfirmDialog={setShowConfirmDialog}
                                setDialogType={setDialogType}
                                setIsSidePanelOpen={setIsSidePanelOpen}
                                showConfirmDialog={showConfirmDialog}
                                setIsHeaderBoxChecked={setIsHeaderBoxChecked}
                                setAllSelectedDocs={setAllSelectedDocs}
                                setTableKey={setTableKey}
                                setIsInitialLoad={setIsInitialLoad}
                                setSelectedFormats={setSelectedFormats}
                                setSelectedEntities={setSelectedEntities}
                                setSearchTerm={setSearchTerm}
                                setSearchText={setSearchText}
                                setSearchRefExternalId={setSearchRefExternalId}
                                setIsSearchTriggered={setIsSearchTriggered}
                                setPrevSelectedDocs={setPrevSelectedDocs}
                                setIsClearSelectedCheckbox={setIsClearSelectedCheckbox} 
                                searchText={searchText} 
                                setDateRange={setDateRange} />
                        </div>
                    </div>
                </GridItem>
            </Grid>
        </>
    </>)
}
export default DocumentManagementServerView
