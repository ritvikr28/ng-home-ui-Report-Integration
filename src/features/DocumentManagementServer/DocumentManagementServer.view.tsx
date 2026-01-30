import React, { useState, useEffect } from "react"
import { useTranslation,UseTranslationResponse } from "@essnextgen/ui-intl-kit";
import { useLocation } from "react-router-dom";
import { LocalisedMenu } from "@essnextgen/ui-application-kit"
import { authService, MatchPermissions } from "@essnextgen/auth-ui";
import { Grid, GridItem, Button,ButtonColor,Notification, IconColor,ButtonSize, Breadcrumbs, ControlledList, DialogTemplate, NotificationStatus, ShowActionAs, useMediaQuery, Suggestion, ResponseCode, TableRowType, ISelectedItem, Loader, LoaderType, SelectedItem } from "@essnextgen/ui-kit"
import dayjs from "dayjs"
import { buildSelectedDocs, buildValidationPayload, fetchGetDocumentDetailsLogic, fetchViewDownloadData, fileDownload, getTableHeadersData, getTitleConfirmation, handleSearchChange, onBreadcrumbClick, prepareDownload } from "./DocumentManagementServer.logic"
import "./style.scss"
import { BreadcrumbAction, DateRange, DocumentData, DocumentRow, SelectedDocument, SidePanelReason, tableDataProps, ViewDownloadItem } from "./responseModel"
import { homeurl, pageSizeNumber } from "../../../public/Constants"
import { CapitalizeFirstLetter } from "../../shared/utils/commonFunctions"
import { viewDownload ,clearAllFiles, deleteFiles, validation} from "./ApiService"
import FilterDialog from "../../shared/components/Filter/Filter"
import NoSelectionDialog from "../../shared/components/NoSelectionDialog/NoSelectionDialog"
import gtmAnalytics from "../../shared/utils/analytics";
import { handlePageChange, handleEditSelectedOverFlowMenu, handleTagCloseLogic, handleBulkDeleteLogic, handleApply, handleClearAllConfirm, closeSidePanel, handleSuggestionClick, getNotificationMsgBannerObject, handlePrepareDownload } from "./DocumentManagementServer.handler";
import { getCategoryArr, getDateTag, getVisibleTagsWithSummary, getAllRegistrationIds, mapRelatedArr, applySummaryTagClass, getResultNotFoundMsg, filterNonEmptySuggestions, getCompletedPartitionKeys, getDialogTitle, getEmptyStateMsg, handleSorting, handleOnChangeAllCheckBox, handleOnChangeCheckBox, breadcrumbActionsList, getDeleteDialogMessages, getDialogConfig } from "./DocumentManagementServer.utils";
import { useBodyNoScroll, useFetchDocsEffect, useOpenSidePanelOnViewDownload, useScrollToTopOnPageChange, useSearchTermEffect, useSetFailedFileNameOnCancelled, useSetTotalPageOnDocData, useSidePanelViewDownloadEffect, useSummaryTagMutationObserver, useTotalSelectedCountEffect } from "./useDocumentManagementEffects";
import { ViewDownloadContent } from "./ViewDownloadContent";
import { DmsDialogs } from "./DocumentManagementServer.dialog";
import { DmsSidePanel } from "./DocumentManagement.sidepanel";
import DmsControlledList from "./DocumentManagementServer.table";


const DocumentManagementServerView: () => JSX.Element = () => {
    const { t }: UseTranslationResponse<"translation", undefined> = useTranslation();
    const location: Location = useLocation();
    const [dialogType, setDialogType]: [string, React.Dispatch<React.SetStateAction<string>>] = useState<string>("");
    const [currentPage, setCurrentPage]: [number, React.Dispatch<React.SetStateAction<number>>] = useState<number>(1);
    const [totalPage, setTotalPage]: [number, React.Dispatch<React.SetStateAction<number>>] = useState<number>(0);
    const [searchInput, setSearchInput]: [string, React.Dispatch<React.SetStateAction<string>>] = useState<string>("");
    const [searchTerm, setSearchTerm]: [string, React.Dispatch<React.SetStateAction<string>>] = useState<string>("");
    const [searchText, setSearchText]: [string, React.Dispatch<React.SetStateAction<string>>] = useState<string>("");
    const [suggestions, setSuggestions]: [Suggestion[], React.Dispatch<React.SetStateAction<Suggestion[]>>] = useState<Suggestion[]>([]);
    const [isSearchLoading, setIsSearchLoading]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);
    const [isSearchTriggered, setIsSearchTriggered]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);
    const [showSearchError, setShowSearchError]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);
    const [docData, setDocData]: [DocumentData | null, React.Dispatch<React.SetStateAction<DocumentData | null>>] = useState<DocumentData | null>(null);
    const [issearchDataLoading, setIsSearchDataLoading]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);
    const [showErrorBanner, setShowErrorBanner]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);
    const [sortBy, setSortBy]: [string, React.Dispatch<React.SetStateAction<string>>] = useState<string>("DateAdded");
    const [sortDirection, setSortDirection]: [string, React.Dispatch<React.SetStateAction<string>>] = useState<string>("Desc");
    const [visibleBreadcrumbs, setVisibleBreadcrumbs]: [BreadcrumbAction[], React.Dispatch<React.SetStateAction<BreadcrumbAction[]>>] = useState(breadcrumbActionsList(t));
    const [dateRange, setDateRange]: [DateRange, React.Dispatch<React.SetStateAction<DateRange>>] = useState<DateRange>({ fromDate: "", toDate: "" });
    const [selectedDateRange, setSelectedDateRange]: [DateRange, React.Dispatch<React.SetStateAction<DateRange>>] = useState<DateRange>({ fromDate: "", toDate: "" });
    const [isDateError, setIsDateError]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);
    const [selectedCategories, setSelectedCategories]: [ISelectedItem[], React.Dispatch<React.SetStateAction<ISelectedItem[]>>] = useState<ISelectedItem[]>([]);
    const [selectedFormats, setSelectedFormats]: [ISelectedItem[], React.Dispatch<React.SetStateAction<ISelectedItem[]>>] = useState<ISelectedItem[]>([]);
    const [isFilterDialogOpen, setIsFilterDialogOpen]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);
    const [isFilterLoading, setIsFilterLoading]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);
    const [isClearSelectedCheckbox, setIsClearSelectedCheckbox]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);
    const [isSidePanelOpen, setIsSidePanelOpen]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);
    const [sidePanelOpenReason, setSidePanelOpenReason]: [SidePanelReason | null, React.Dispatch<React.SetStateAction<SidePanelReason | null>>] = useState<SidePanelReason | null>(null);
    const [isSidePanelLoader, setIsSidePanelLoader]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);
    const [showDialog, setShowDialog]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);
    const [showConfirmDialog, setShowConfirmDialog]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);
    const [selectedCheckBoxIds, setSelectedCheckBoxIds]: [string[], React.Dispatch<React.SetStateAction<string[]>>] = useState<string[]>([]);
    const [excludedCheckBoxIds, setExcludedCheckBoxIds]: [string[], React.Dispatch<React.SetStateAction<string[]>>] = useState<string[]>([]);
    const [prevSelectedDocs, setPrevSelectedDocs]: [string[], React.Dispatch<React.SetStateAction<string[]>>] = useState<string[]>([]);
    const [isHeaderBoxChecked, setIsHeaderBoxChecked]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);
    const [viewData, setViewData]: [ViewDownloadItem[], React.Dispatch<React.SetStateAction<ViewDownloadItem[]>>] = useState<ViewDownloadItem[]>([]);
    const [prepareDownloadError, setPrepareDownloadError]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);
    const [PrepareDownloadAbortBanner, setPrepareDownloadAbortBanner]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);
    const [clearAllError, setClearAllError]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);
    const [showEmailNotification, setShowEmailNotification]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);
    const [showToastNotification, setShowToastNotification]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);
    const [downloadError, setDownloadError]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);
    const [failedFileName, setFailedFileName]: [string[], React.Dispatch<React.SetStateAction<string[]>>] = useState<string[]>([]);
    const [allSelectedDocs, setAllSelectedDocs]: [SelectedDocument[], React.Dispatch<React.SetStateAction<SelectedDocument[]>>] = useState<SelectedDocument[]>([]);
    const [selectedEntities, setSelectedEntities]: [ISelectedItem[], React.Dispatch<React.SetStateAction<ISelectedItem[]>>] = useState<ISelectedItem[]>([]);
    const [hasFetchedViewDownload, setHasFetchedViewDownload]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);
    const [showDeleteErrorBanner, setShowDeleteErrorBanner]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);
    const downloadPollingIntervalRef: React.MutableRefObject<ReturnType<typeof setInterval> | null> = React.useRef<ReturnType<typeof setInterval> | null>(null);
    const [documentRelatedTo, setDocumentRelatedTo]: [number, React.Dispatch<React.SetStateAction<number>>] = useState<number>(0);
    const [searchRefExternalId, setSearchRefExternalId]: [string[], React.Dispatch<React.SetStateAction<string[]>>] = useState<string[]>([]);
    const [showDeleteSuccessToast, setShowDeleteSuccessToast]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);
    const [showDeleteAbortBanner, setShowDeleteAbortBanner]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);
    const [restrictedFileCount, setRestrictedFileCount]: [number, React.Dispatch<React.SetStateAction<number>>] = useState<number>(0);
    const [alreadyDeletedFileCount, setAlreadyDeletedFileCount]: [number, React.Dispatch<React.SetStateAction<number>>] = useState<number>(0);
    const [availableFileCount, setAvailableFileCount]: [number, React.Dispatch<React.SetStateAction<number>>] = useState<number>(0);
    const [availableFileIds, setAvailableFileIds]: [string[], React.Dispatch<React.SetStateAction<string[]>>] = useState<string[]>([]);
    const [showRestrictedDeleteDialog, setShowRestrictedDeleteDialog]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);
    const [showRestrictedPrepareDialog, setShowRestrictedPrepareDialog]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);
    const [isPreDialogLoading, setIsPreDialogLoading]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);
    const [isDialogLoading, setIsDialogLoading]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);
    const [isInitialLoad, setIsInitialLoad]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(true);
    const [tableKey, setTableKey]: [number, React.Dispatch<React.SetStateAction<number>>] = useState<number>(0);
    const [totalSelectedCount, setTotalSelectedCount]: [number, React.Dispatch<React.SetStateAction<number>>] = useState<number>(0);
    const [isGlobalLoaderModel, setIsGlobalLoaderModel]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);
    const [selectedRelatedTo, setSelectedRelatedTo]: [ISelectedItem | undefined, React.Dispatch<React.SetStateAction<ISelectedItem | undefined>>] = useState<ISelectedItem | undefined>(undefined);
    const [tagListArray, setTagListArray]: [SelectedItem[], React.Dispatch<React.SetStateAction<SelectedItem[]>>] = useState<SelectedItem[]>([]);
    const [isViewDownloadError, setIsViewDownloadError]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);

    const hasDMSDeletePermissions: boolean = authService.isAuthorised(
    [{ Securable: "NG.DocumentManagementServer.Documents", Operation: "Delete" }],
    MatchPermissions.all
    );

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

        const onPageChange: (event: unknown, page: number) => void = (_event: unknown, page: number): void =>
        handlePageChange(event, page, setCurrentPage, setIsSearchDataLoading);
 


       const fetchGetDocumentDetails = (
    page: number,
    categories: number[],
    sortByCol: string = sortBy,
    sortOrder = sortDirection,
    refExternalId: string[] = searchRefExternalId,
    relatedTo: number = documentRelatedTo
    ) => {
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


const onEditSelectedOverFlowMenu = (e: React.SyntheticEvent, selectedItem: ISelectedItem) => {
  handleEditSelectedOverFlowMenu({
    e, selectedItem, totalSelectedCount, setShowDialog, setShowConfirmDialog, setShowRestrictedDeleteDialog, setShowRestrictedPrepareDialog, setIsPreDialogLoading, isHeaderBoxChecked, allSelectedDocs, buildValidationPayload,
    allRegistrationIds, dateRange, searchRefExternalId, documentRelatedTo, validation, setRestrictedFileCount, setAlreadyDeletedFileCount, setAvailableFileCount, setDialogType, setIsDialogLoading, setSidePanelOpenReason,
    setIsSidePanelOpen, setAvailableFileIds, setShowErrorBanner
  });
};

const hasCompletedFiles = viewData.some(item => item.status?.toLowerCase() === 'complete');

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

    const handleTagClose = (
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

    const NotificationMsgBannerObject = getNotificationMsgBannerObject(
        t, showErrorBanner, showSearchError, showDeleteErrorBanner, showDeleteAbortBanner, availableFileCount, setShowDeleteErrorBanner, setShowDeleteAbortBanner);

    useSearchTermEffect({  searchTerm, selectedFormats, selectedDateRange, showSearchError, isSearchTriggered, handleSearchChange,
        t, setSearchTerm, setSuggestions, setShowSearchError, setIsSearchLoading, setShowErrorBanner,  getAllRegistrationIds
    });

    const resultNotFoundMSG = getResultNotFoundMsg(t,searchText, docData, searchTerm, showErrorBanner, isSearchTriggered, showSearchError);
    const filteredSuggestions = filterNonEmptySuggestions(suggestions);

    const handleBulkDelete = () =>
        handleBulkDeleteLogic({ allSelectedDocs, docData, allRegistrationIds, dateRange, searchRefExternalId, documentRelatedTo, currentPage,
            sortBy, sortDirection, setShowToastNotification, setShowConfirmDialog, setSelectedCheckBoxIds, setAllSelectedDocs, setIsClearSelectedCheckbox, setShowDeleteErrorBanner, 
            setShowDeleteSuccessToast, setShowDeleteAbortBanner, fetchGetDocumentDetails, deleteFiles, excludedCheckBoxIds, isHeaderBoxChecked, setIsSearchDataLoading, availableFileIds
        });

    const handleApplyWrapper = (referenceExternalIds: string[], categories?: ISelectedItem[], selectedEntity?: any[]) => {
    handleApply({ referenceExternalIds, categories, selectedCategories, selectedDateRange, isDateError, selectedEntity, setIsDateError, setIsFilterLoading, setDateRange, setSelectedFormats,
        setIsFilterDialogOpen, setCurrentPage, setExcludedCheckBoxIds, setAllSelectedDocs, setSearchInput, setSearchTerm, setSearchText, setTableKey, setIsSearchTriggered, setSelectedCategories, setSearchRefExternalId,
        setIsHeaderBoxChecked, setSelectedCheckBoxIds,  setPrevSelectedDocs,  setSelectedEntities, setSortBy, setSortDirection, setIsInitialLoad
    });
    };

    const dialogConfig = getDialogConfig({
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


    const handleFilterOnClick = () => {
        setIsFilterDialogOpen(true);
        setSelectedDateRange({ fromDate: dateRange?.fromDate || "", toDate: dateRange?.toDate || "" });
        setTagListArray(tagListArray)
    };

    useSetFailedFileNameOnCancelled(viewData, setFailedFileName);


    useEffect(() => {
        gtmAnalytics.pushPageViewEvent("Admin Console");
    }, []);


    const handleCloseSidePanel = () => {
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
                    docData={docData}
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
                                hasFetchedViewDownload={hasFetchedViewDownload}
                                isViewDownloadError={isViewDownloadError}
                                viewData={viewData}
                                failedFileName={failedFileName}
                                clearAllError={clearAllError}
                                prepareDownloadError={prepareDownloadError}
                                prepareDownloadAbortBanner={PrepareDownloadAbortBanner}
                                downloadError={downloadError}
                                showEmailNotification={showEmailNotification}
                                showToastNotification={showToastNotification}
                                availableFileCount={availableFileCount}
                                setClearAllError={setClearAllError}
                                setPrepareDownloadError={setPrepareDownloadError}
                                setPrepareDownloadAbortBanner={setPrepareDownloadAbortBanner}
                                setDownloadError={setDownloadError}
                                setShowEmailNotification={setShowEmailNotification}
                                setShowToastNotification={setShowToastNotification}
                                setFailedFileName={setFailedFileName}
                                handleCloseSidePanel={handleCloseSidePanel}
                                isDialogLoading={isDialogLoading}
                                isGlobalLoaderModel={isGlobalLoaderModel}
                                fileDownload={fileDownload}
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
                                prevSelectedDocs={prevSelectedDocs} 
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
