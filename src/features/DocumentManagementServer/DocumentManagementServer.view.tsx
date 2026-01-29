import React, { useState, useEffect } from "react"
import { useTranslation,UseTranslationResponse } from "@essnextgen/ui-intl-kit";
import { useLocation } from "react-router-dom";
import { LocalisedMenu } from "@essnextgen/ui-application-kit"
import { authService, MatchPermissions } from "@essnextgen/auth-ui";
import { Grid, GridItem, Button,ButtonColor,Notification, IconColor,ButtonSize, Breadcrumbs, ControlledList, DialogTemplate, NotificationStatus, ShowActionAs, useMediaQuery, Suggestion, ResponseCode, TableRowType, ISelectedItem, Loader, LoaderType, SelectedItem } from "@essnextgen/ui-kit"
import dayjs from "dayjs"
import { buildSelectedDocs, buildValidationPayload, fetchGetDocumentDetailsLogic, fetchViewDownloadData, fileDownload, getTableHeadersData, getTitleConfirmation, handleSearchChange, onBreadcrumbClick, prepareDownload } from "./DocumentManagementServer.logic"
import "./style.scss"
import { tableDataProps, ViewDownloadItem } from "./responseModel"
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

interface DateRange {
fromDate: string;
toDate: string;
}


interface DocumentRow {
fileId: string;
document?: string;
category?: string;
addedBy?: string;
dateAdded?: string;
format?: string;
size?: string;
}


interface DocumentData {
data?: DocumentRow[];
totalCount?: number;
}


interface SelectedDocument {
fileId: string;
registrationId: number;
externalId: string;
}


type SidePanelReason = "prepare" | "view";
const DocumentManagementServerView: () => JSX.Element = () => {
    const { t }: UseTranslationResponse<"translation", undefined> = useTranslation();
    const location = useLocation();
    const [dialogType, setDialogType] = useState<string>("");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPage, setTotalPage] = useState<number>(0);
    const [searchInput, setSearchInput] = useState<string>("");
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [searchText, setSearchText] = useState<string>("");
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [isSearchLoading, setIsSearchLoading] = useState<boolean>(false);
    const [isSearchTriggered, setIsSearchTriggered] = useState<boolean>(false);
    const [showSearchError, setShowSearchError] = useState<boolean>(false);
    const [docData, setDocData] = useState<DocumentData | null>(null);
    const [issearchDataLoading, setIsSearchDataLoading] = useState<boolean>(false);
   const [showErrorBanner, setShowErrorBanner] = useState<boolean>(false);
    const [sortBy, setSortBy] = useState<string>("DateAdded");
    const [sortDirection, setSortDirection] = useState<string>("Desc");
    const [visibleBreadcrumbs, setVisibleBreadcrumbs] =useState(breadcrumbActionsList(t));
    const [dateRange, setDateRange] = useState<DateRange>({ fromDate: "", toDate: "" });
    const [selectedDateRange, setSelectedDateRange] = useState<DateRange>({ fromDate: "", toDate: "" });
    const [isDateError, setIsDateError] = useState<boolean>(false);
    const [selectedCategories, setSelectedCategories] = useState<ISelectedItem[]>([]);
    const [selectedFormats, setSelectedFormats] = useState<ISelectedItem[]>([]);
    const [isFilterDialogOpen, setIsFilterDialogOpen] = useState<boolean>(false);
    const [isFilterLoading, setIsFilterLoading] = useState<boolean>(false);
    const [isClearSelectedCheckbox, setIsClearSelectedCheckbox] = useState<boolean>(false);
    const [isSidePanelOpen, setIsSidePanelOpen] = useState<boolean>(false);
    const [sidePanelOpenReason, setSidePanelOpenReason] = useState<SidePanelReason | null>(null);
    const [isSidePanelLoader, setIsSidePanelLoader] = useState<boolean>(false);
    const [showDialog, setShowDialog] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [selectedCheckBoxIds, setSelectedCheckBoxIds] = useState<string[]>([]);
    const [excludedCheckBoxIds, setExcludedCheckBoxIds] = useState<string[]>([]);
    const [prevSelectedDocs, setPrevSelectedDocs] = useState<string[]>([]);
    const [isHeaderBoxChecked, setIsHeaderBoxChecked] = useState<boolean>(false);
    const [viewData, setViewData] = useState<ViewDownloadItem[]>([]);
    const [prepareDownloadError, setPrepareDownloadError] = useState(false);
    const [PrepareDownloadAbortBanner, setPrepareDownloadAbortBanner] = useState(false);
    const [clearAllError, setClearAllError] = useState(false);
    const [showEmailNotification, setShowEmailNotification] = useState(false);
    const [showToastNotification, setShowToastNotification] = useState(false);
    const [downloadError, setDownloadError] = useState<boolean>(false);
    const [failedFileName, setFailedFileName] = useState<string[]>([]);
    const [allSelectedDocs, setAllSelectedDocs] = useState<SelectedDocument[]>([]);
    const [selectedEntities, setSelectedEntities] = useState<ISelectedItem[]>([]);
    const [hasFetchedViewDownload, setHasFetchedViewDownload] = useState(false);
    const [showDeleteErrorBanner, setShowDeleteErrorBanner] = useState(false);
    const downloadPollingIntervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null);
    const [documentRealatedTo, setDocumentRelatedTo] = useState<number>(0)
    const [searchRefExternalId, setSearchRefExternalId] = useState<string[]>([]);
    const [showDeleteSuccessToast, setShowDeleteSuccessToast] = useState(false);
    const [showDeleteAbortBanner, setShowDeleteAbortBanner] = useState(false);
     const [restrictedFileCount, setRestrictedFileCount] = useState(0); 
    const [alreadyDeletedFileCount, setAlreadyDeletedFileCount] = useState(0);
    const [availableFileCount, setAvailableFileCount] = useState(0);
    const [availableFileIds, setAvailableFileIds] = useState<string[]>([]);
    const [showRestrictedDeleteDialog, setShowRestrictedDeleteDialog] = useState(false);
    const [showRestrictedPrepareDialog, setShowRestrictedPrepareDialog] = useState(false);
    const [isPreDialogLoading, setIsPreDialogLoading] = useState(false);
    const [isDialogLoading, setIsDialogLoading] = useState(false);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [tableKey, setTableKey] = useState(0);
    const [totalSelectedCount, setTotalSelectedCount] = useState<number>(0);
    const [isGlobalLoaderModel, setIsGlobalLoaderModel] = useState<boolean>(false);
    const [selectedRelatedTo, setSelectedRelatedTo] = useState<ISelectedItem | undefined>(undefined);
    const [tagListArray, setTagListArray] = useState<SelectedItem[]>([]);
    const [isViewDownloadError, setIsViewDownloadError] = useState(false);

    const hasDMSDeletePermissions: boolean = authService.isAuthorised(
    [{ Securable: "NG.DocumentManagementServer.Documents", Operation: "Delete" }],
    MatchPermissions.all
    );

    const categoryArr = getCategoryArr(selectedFormats);
    const dateTagArr = getDateTag(dateRange);
    const searchTagListRaw = [
    ...categoryArr,
    ...dateTagArr
    ];

    const messages = getDeleteDialogMessages({
        t, restrictedFileCount, availableFileCount, docData, alreadyDeletedFileCount, excludedCheckBoxIds, isHeaderBoxChecked
    });

    const contentText = <div style={{ whiteSpace: "pre-line" }}>{messages.join("\n")}</div>;

    
    useOpenSidePanelOnViewDownload(location, setSidePanelOpenReason, setIsSidePanelOpen);

    const searchTagList = getVisibleTagsWithSummary(searchTagListRaw, 3);
    
    const allRegistrationIds = getAllRegistrationIds(selectedFormats);

   
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

        const onPageChange = (_event: unknown, page: number): void =>
        handlePageChange(event, page, setCurrentPage, setIsSearchDataLoading);
 


       const fetchGetDocumentDetails = (
    page: number,
    categories: number[],
    sortByCol: string = sortBy,
    sortOrder = sortDirection,
    refExternalId: string[] = searchRefExternalId,
    relatedTo: number = documentRealatedTo
    ) => {
    fetchGetDocumentDetailsLogic({
        page, categories, sortByCol, sortOrder, dateRange, refExternalId, relatedTo, setDocData, setCurrentPage, setTotalPage, setShowSearchError, 
        setIsSearchLoading, setIsSearchDataLoading,  setPrepareDownloadAbortBanner, setShowDeleteAbortBanner, setShowDeleteErrorBanner, setSuggestions
    });
    };

   useFetchDocsEffect({currentPage, searchText, dateRange, selectedFormats, sortBy, sortDirection, searchRefExternalId,
        documentRealatedTo, isSearchTriggered, isFilterDialogOpen, allRegistrationIds, fetchGetDocumentDetails, setIsInitialLoad });  

    useSidePanelViewDownloadEffect({isSidePanelOpen, sidePanelOpenReason, setShowToastNotification, setIsSidePanelLoader,
    fetchViewDownloadData, setViewData, setHasFetchedViewDownload, viewDownload, downloadPollingIntervalRef, setIsViewDownloadError, setShowEmailNotification,
    });


const onEditSelectedOverFlowMenu = (e: React.SyntheticEvent, selectedItem: ISelectedItem) => {
  handleEditSelectedOverFlowMenu({
    e, selectedItem, totalSelectedCount, setShowDialog, setShowConfirmDialog, setShowRestrictedDeleteDialog, setShowRestrictedPrepareDialog, setIsPreDialogLoading, isHeaderBoxChecked, allSelectedDocs, buildValidationPayload,
    allRegistrationIds, dateRange, searchRefExternalId, documentRealatedTo, validation, setRestrictedFileCount, setAlreadyDeletedFileCount, setAvailableFileCount, setDialogType, setIsDialogLoading, setSidePanelOpenReason,
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
        handleBulkDeleteLogic({ allSelectedDocs, docData, allRegistrationIds, dateRange, searchRefExternalId, documentRealatedTo, currentPage,
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
    sortDirection, searchRefExternalId, documentRealatedTo, setSelectedCheckBoxIds, setAllSelectedDocs, setIsClearSelectedCheckbox,
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
