/// <reference types="node" />
import React, { useState, useEffect } from "react"
import { LocalisedMenu } from "@essnextgen/ui-application-kit"
import { Grid, GridItem, Button,ButtonColor,Notification, IconColor, ButtonSize, Breadcrumbs, ControlledList, DialogTemplate, NotificationStatus, ShowActionAs, ButtonIconPosition, useMediaQuery, Suggestion, ValidationTextLevel, ResponseCode, TableRowType, ISelectedItem, Loader, LoaderType } from "@essnextgen/ui-kit"
import dayjs from "dayjs"
import { fetchCategory, getAllRegistrationIds, getCategoryArr, getResultNotFoundMsg, getTableHeadersData, getVisibleTagsWithSummary, handlePageChange, handleSearchChange, handleSuggestionClick, handleTagCloseLogic, onBreadcrumbClick, mapRelatedArr, filterNonEmptySuggestions, prepareDownload, fetchViewDownloadData, reduceCategories, validateAndApplyFilter, closeSidePanel, buildSelectedDocs, fetchGetDocumentDetailsLogic } from "./DocumentManagementServer.logic"
import "./style.scss"
import { Category, tableDataProps, ViewDownloadItem } from "./responseModel"
import { homeurl, pageSizeNumber } from "../../../public/Constants"
import { CapitalizeFirstLetter } from "../../shared/utils/commonFunctions"
import { viewDownload } from "./ApiService"
import FilterDialog from "../../shared/components/Filter/Filter"
import NoSelectionDialog from "../../shared/components/NoSelectionDialog/NoSelectionDialog"


export const breadcrumbActionsList = [
    {
        active: false,
        linkName: 'Home',
        path: window.location.origin
    },
    {
        active: false,
        linkName: 'Admin Console',
        path: homeurl
    },
    {
        active: false,
        linkName: 'Document Management Server',
        path: '#'
    },
    {
        active: false,
        linkName: 'Documents',
        path: ''
    }
]

const DocumentManagementServerView: () => JSX.Element = () => {
    const [currentPage, setCurrentPage]: [number, React.Dispatch<React.SetStateAction<number>>] = useState(1);
    const [totalPage, setTotalPage]: [number, React.Dispatch<React.SetStateAction<number>>] = useState(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [searchInput, setSearchInput] = useState<string>("");
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [isSearchLoading, setIsSearchLoading] = useState<boolean>(false);
    const [showSearchError, setShowSearchError] = useState<boolean>(false);
    const [docData, setDocData] = useState<any>(null);
    const [isSearchTriggered, setIsSearchTriggered] = useState<boolean>(false);
    const [hasFetched, setHasFetched] = useState(false);
    const [searchText, setSearchText] = useState<string>("");
    const [issearchDataLoading, setIsSearchDataLoading] = useState<boolean>(false);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [isFilterDialogOpen, setIsFilterDialogOpen] = useState<boolean>(false);
    const [selectedCategories, setSelectedCategories] = useState<ISelectedItem[]>([]);
    const [selectedFormats, setSelectedFormats] = useState<ISelectedItem[]>([]);
    const [showErrorBanner, setShowErrorBanner] = useState<boolean>(false);
    const [sortBy, setSortBy] = useState<string>("DateAdded");
    const [sortDirection, setSortDirection] = useState<string>("Desc");
    const [visibleBreadcrumbs, setVisibleBreadcrumbs] =
        useState(breadcrumbActionsList);
    const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
    const [dateRange, setDateRange] = useState({ fromDate: "", toDate: "" })
    const [selectedDateRange, setSelectedDateRange] = useState({ fromDate: "", toDate: "" })
    const [isDateError, setIsDateError] = useState(false);
    const [isFilterLoading, setIsFilterLoading] = useState<boolean>(false);

    const [isSidePanelLoader, setIsSidePanelLoader] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
        const [selectedCheckBoxIds, setSelectedCheckBoxIds] = useState<string[]>([]);
    const [viewData, setViewData] = useState<ViewDownloadItem[]>([]);
    const [sidePanelOpenReason, setSidePanelOpenReason] = useState<"prepare" | "view" | null>(null);
     const [prepareDownloadError, setPrepareDownloadError] = useState(false);
    const [categoryRegistrationMap, setCategoryRegistrationMap] = useState<Record<string, number>>({});
    const [showEmailNotification, setShowEmailNotification] = useState(false);
    const [failedFileName, setFailedFileName] = useState<string | null>(null);
    const [allSelectedDocs, setAllSelectedDocs] = useState<{ fileId: string, registrationId: number }[]>([]);
    const [hasFetchedViewDownload, setHasFetchedViewDownload] = useState(false);
    const categoryArr = getCategoryArr(selectedFormats);
    const downloadPollingIntervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null);
    const [documentRelatedTo, setDocumentRelatedTo] = useState<number>(0)
    const [searchRefExternalId, setSearchRefExternalId] = useState<string>("");


const searchTagListRaw = [
  ...categoryArr
];

const searchTagList = getVisibleTagsWithSummary(searchTagListRaw, 3);

    const [isShowAutoSuggest, setIsShowAutoSuggest] = useState(true);   

    const onPageChange = (event: any, page: number) =>
        handlePageChange(event, page, setCurrentPage, setIsSearchDataLoading);

    let tableData: tableDataProps[] = [];

        if (showErrorBanner) {
        tableData = [];
        } else if (showSearchError || !docData?.data?.length) {
        tableData = [];
        } else if (docData?.data) {
        tableData = docData?.data.map((doc: any) => ({
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
// const isSelectionCleared = selectedCheckBoxIds.length === 0;

    const isMobileView: boolean = useMediaQuery(
        "(min-width:320px) and (max-width: 1023.9px)"
    );

    const [isOpen, setIsOpen]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);

    useEffect(() => {
        if (!isMobileView) {
            document.body.classList.add("no-scroll");
            return () => {
                document.body.classList.remove("no-scroll");
            };
        }
        return () => { };
    }, [isMobileView]);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentPage]);

    const handleButtonClick: () => void = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        setIsOpen(!isMobileView);
    }, [!isMobileView]);


    useEffect(() => {
        if (docData && docData?.totalRecords) {
            const totalPages = Math.ceil(docData.totalRecords / pageSizeNumber);
            setTotalPage(totalPages);
        }
    }, [docData]);

    useEffect(() => {
    const fetchInitialData = async () => {
        setIsLoading(true);
        const minLoaderTime = new Promise((resolve) => setTimeout(resolve, 1000));
        const dataFetch = fetchGetDocumentDetails(currentPage, [], sortBy, sortDirection);
        // Fetch categories
        
        await Promise.all([minLoaderTime, dataFetch]);
        setIsLoading(false);
        setIsInitialLoad(false);
    };

    fetchInitialData();

      fetchCategory().then((res) => {
    const map: Record<string, number> = {};
    res.forEach((cat: any) => {
      map[cat.application] = cat.registrationId;
    });
    setCategoryRegistrationMap(map);
  });
}, []);


    useEffect(() => {
   
        if (!isInitialLoad) {
            const allRegistrationIds = getAllRegistrationIds(selectedFormats);
            fetchGetDocumentDetails(currentPage, allRegistrationIds, sortBy, sortDirection);
        }
        setIsSearchTriggered(false)
    }, [currentPage,searchText, dateRange?.fromDate, dateRange?.toDate, selectedFormats, sortBy, sortDirection, searchRefExternalId, documentRelatedTo]);

useEffect(() => {
  // Only run when opening the side panel for "prepare"
  if (isSidePanelOpen && sidePanelOpenReason === "prepare") {
    setIsSidePanelLoader(true); // Show loader immediately

    // Wait for 2 seconds before calling view download API
    const timer = setTimeout(() => {
      fetchViewDownloadData({
        showLoader: false, // Loader already shown
        setIsSidePanelLoader,
        setViewData: (data) => {
    setViewData(data);
    setHasFetchedViewDownload(true);
  },
        viewDownload,
        downloadPollingIntervalRef,
      });
    }, 2000);

    return () => clearTimeout(timer);
  }
  // For "view", call immediately
  if (isSidePanelOpen && sidePanelOpenReason === "view") {
    setIsSidePanelLoader(true);
    fetchViewDownloadData({
      showLoader: false,
      setIsSidePanelLoader,
      setViewData: (data) => {
        setViewData(data);
        setHasFetchedViewDownload(true);
    },
      viewDownload,
      downloadPollingIntervalRef,
    });
  }
  return undefined;
}, [isSidePanelOpen, sidePanelOpenReason]);

    const fetchGetDocumentDetails = (
  page: number,
  categories: number[],
  sortByCol: string = sortBy,
  sortOrder = sortDirection,
  refExternalId: string = searchRefExternalId,
  relatedTo: number = documentRelatedTo
) => {
  fetchGetDocumentDetailsLogic({
    page,
    categories,
    sortByCol,
    sortOrder,
    dateRange,
    refExternalId,
    relatedTo,
    setDocData,
    setCurrentPage,
    setTotalPage,
    setShowSearchError,
    setShowErrorBanner,
    setHasFetched,
    setIsSearchLoading,
    setIsSearchDataLoading,
  });
};

const selectedDocs = buildSelectedDocs(selectedCheckBoxIds, docData, categoryRegistrationMap);

   const handleSorting = (columnName: string) => {
  let apiColumnName = columnName;
  switch (columnName) {
    case "Date added":
      apiColumnName = "DateAdded";
      break;
    case "Document":
      apiColumnName = "Document";
      break;
    case "Format":
      apiColumnName = "Format";
      break;
      case "Size":
      apiColumnName = "Size";
      break;
      case "Category":
      apiColumnName = "Category";   
        break;
    default:
        return;
    }
        let newDirection = "Asc";
        if (sortBy === apiColumnName) {
            newDirection = sortDirection === "Desc" ? "Asc" : "Desc";
            }

        setSortBy(apiColumnName);
        setSortDirection(newDirection);
      };

      const handleEditSelectedOverFlowMenu = (e:React.SyntheticEvent, selectedItem: ISelectedItem)=>{
        if (selectedItem.value === "Prepare download") {
            if(selectedCheckBoxIds?.length === 0){
                setShowDialog(true);
            }else{
                setShowConfirmDialog(true);
            }
        } 
        
        else if (selectedItem.value === "Delete") {
            if(selectedCheckBoxIds?.length === 0){
                setShowDialog(true);
            }
        }
        else if ((selectedItem?.value?.toLowerCase() === "view download")) {
            setSidePanelOpenReason("view");
            setIsSidePanelOpen(true);
        }
      }

    const getEmptyStateMsg = () => {
    if (showErrorBanner) return "Information unavailable.";
    if (isLoading || issearchDataLoading || isSearchLoading) return undefined; // Hide banner while loading

    // Show "No data to display." only if search is triggered and no data
    if (
        isSearchTriggered &&
        docData &&
        docData?.statusCode === 200 &&
        Array.isArray(docData?.data) &&
        docData?.data.length === 0
    ) {
        return "No data to display.";
    }

    if (!isSearchTriggered && showSearchError) return "Information unavailable.";
    return "Documents will appear here once they are uploaded.";
};

    const getTableHeaders = () => {
        if (tableData?.length > 0 || showErrorBanner) {
            return getTableHeadersData;
        }
        if ((isSearchTriggered || searchText || docData)) {

            return getTableHeadersData;
        }
        return [];
    };

    const handleSearchClose = () => {
        setSearchInput("");
        setSearchTerm("");
        setIsSearchTriggered(true);
        setCurrentPage(1);
        setShowSearchError(false);
        setIsSearchLoading(false);
        setSearchText("");
};

    const handleSearchEnter = (event: React.KeyboardEvent<Element>) => {
        if (event.key === "Enter") {
            const keyword = searchTerm?.trim()?.toLowerCase();
            if(keyword !== searchText) {
            setSearchTerm(keyword);
            setSearchText(keyword);
            setIsSearchTriggered(true);
            setIsSearchDataLoading(true);
        }
        setIsSearchLoading(false);
        setIsShowAutoSuggest(false); 
        // setSuggestions([]);
    }
    }

    const handleTagClose = (
  e: React.SyntheticEvent,
  text: string,
  closeObj: { name?: string; id?: string | number }
) => {
  handleTagCloseLogic(
    e,
    text,
    closeObj,
    setSelectedDateRange,
    setDateRange,
    setIsDateError,
    setSelectedCategories,
    setSelectedFormats
  );
};
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1024) {
                // md and below
                if (breadcrumbActionsList.length > 1) {
                    setVisibleBreadcrumbs(breadcrumbActionsList.slice(-2, -1));
                } else {
                    setVisibleBreadcrumbs(breadcrumbActionsList);
                }
            } else {
                setVisibleBreadcrumbs(breadcrumbActionsList);
            }
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [breadcrumbActionsList]);



    const NotificationMsgBannerObject = [
        {
            isShow: showErrorBanner,
            variant: "warning",
            title: "Information unavailable",
            message:
                "A technical issue at our end has stopped us from displaying all information. Please try again later. If the issue persists, please get in touch with our support team.",
            autoclose: true
        }
    ]

    useEffect(() => {
    if (searchTerm?.length > 1) {
        handleSearchChange(
        { target: { value: searchTerm } } as React.ChangeEvent<HTMLInputElement>,
        getAllRegistrationIds(selectedFormats),
        selectedDateRange?.fromDate,
        selectedDateRange?.toDate,
        setSearchTerm,
        setSuggestions,
        setShowSearchError,
        setIsSearchLoading
        );
    }
}, [searchTerm, selectedFormats, selectedDateRange]);

    const resultNotFoundMSG = getResultNotFoundMsg(searchText, docData, searchTerm, showErrorBanner);
    const filteredSuggestions = filterNonEmptySuggestions(suggestions);
     

const handleApply = () => {
  validateAndApplyFilter({
    selectedDateRange,
    isDateError,
    setIsDateError,
    setIsFilterLoading,
    setDateRange,
    setSelectedFormats,
    selectedCategories,
    setIsFilterDialogOpen,
  });
};

   const handleFilterOnClick = () => {
        setIsFilterDialogOpen(true);
        fetchCategory()
            .then((res) => {
            const categories = reduceCategories(res);
            setAvailableCategories(categories);
            });
        if (selectedFormats) {
            setSelectedCategories(selectedFormats);
        }
        setSelectedDateRange({ fromDate: dateRange?.fromDate || "", toDate: dateRange?.toDate || "" });
};

useEffect(() => {
  if (viewData && viewData.length > 0) {
    const cancelledFile = viewData.find(item => item.status?.toLowerCase() === 'cancel');
    if (cancelledFile) {
      setPrepareDownloadError(true);
      setFailedFileName(cancelledFile.name || null);
    }
  }
}, [viewData]);

const handleCloseSidePanel = () => {
  closeSidePanel(setIsSidePanelOpen, downloadPollingIntervalRef);
};

const renderViewDownloadContent = () => {
  if (isSidePanelLoader) {
    return <Loader loaderType={LoaderType.Circular} />;
  }
  if (hasFetchedViewDownload && viewData?.length === 0) {
    return <p>Files you download will appear here.</p>;
  }
  if (viewData?.length > 0) {
    return (
      <>
        <p>Prepared downloads will expire after 5 days</p>
        {viewData.map((item, index) => {
          const isComplete = item?.status?.toLowerCase() === 'complete';
          const isInProgress = item?.status?.toLowerCase() === 'inprogress';
          const isInitiated = item?.status?.toLowerCase() === 'initiated';
          return (
            <div className="viewDownloadDetails" key={index}>
              <div className="fileDetails">
                <p>{item?.name}</p>
                {isComplete && item?.fileExpiryDays !== undefined && (() => {
                    if (item.fileExpiryDays > 0) {
                        return <span>Expires in {item.fileExpiryDays} days.</span>;
                    }
                    if (item.fileExpiryDays === 0) {
                        return <span>Expires today.</span>;
                    }
                    return null;
                    })()}
              </div>
              {isComplete && (
                <Button className="viewDownloadBtn">Download</Button>
              )}
              {(isInProgress || isInitiated) && (
                <span className="inProgressLoader">
                  <Loader loaderType={LoaderType.Circular} loaderText="Please wait..." />
                </span>
              )}
            </div>
          );
        })}
      </>
    );
  }
  return <Loader loaderType={LoaderType.Circular} loaderText="Please wait..." />;
};
    return (<>
        <>
            <Grid className="dms-layout">
                {showDialog && <NoSelectionDialog setShowDialog={setShowDialog} 
                message="Please select at least one item from the search results to perform the action."/>}
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
                        menuHeading="Admin Console"
                        onCloseSideNavigationPanel={() => setIsOpen(false)}
                        isOpenSideNavigation={isOpen}
                        defaultSelectedMenu={{
                            text: "Documents",
                            value: `${window.location.href}/documents`,
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
                 
                        {hasFetched && <div className="grid-wrapper">
                            <ControlledList
                                isMobileViewBreadcrumb
                                globalNotificationMsgBannerObject={NotificationMsgBannerObject}
                                isShowHeading
                                isShowSubHeading={false}
                                isSorting
                                sortByDefault={false}
                                sortAscFirst={!isInitialLoad}
                                isIconRightAligned
                                isAddEventBtnShow={false}
                                dataTestId="controlled-list-test-id"
                                filterDDLOptions={[
                                    {
                                        id: "1",
                                        text: "All",
                                        value: "All"
                                    },
                                    {
                                        id: "2",
                                        text: "Active",
                                        value: "Active"
                                    }
                                    , {
                                        id: "3",
                                        text: "Inactive",
                                        value: "Inactive"
                                    }
                                ]}
                                isShowCheckboxCol = {true}
                                editSelectedBtnTitle="Actions"
                                editSelectedOptions={[
                                    {
                                        disabled: false,
                                        text: 'Prepare download',
                                        value: 'Prepare download'
                                    },
                                    {
                                        disabled: false,
                                        text: 'View download',
                                        value: 'View download'
                                    },
                                    {
                                        disabled: false,
                                        isSelected: false,
                                        isShowDivider: true,
                                        text: 'Delete',
                                        value: 'Delete'
                                    }
                                ]}
                                onEditSelectedOverFlowMenu={handleEditSelectedOverFlowMenu}
                                onEditSelectedBtnClick={() => {}}
                                handleCloseDialogConfirmation={() => setShowConfirmDialog(false)}
                                selectedCheckboxIds={(ids: string[]) => {
                                    setSelectedCheckBoxIds(ids);
                                    }}

                                onChangeListCheckBox={(index: number, id: string) => {
                                        const updatedCheckBoxIds = [...selectedCheckBoxIds];
                                        const doc = docData?.data?.find((d: any) => d.fileId === id);

                                        if (updatedCheckBoxIds.includes(id)) {
                                            updatedCheckBoxIds.splice(updatedCheckBoxIds.indexOf(id), 1);
                                            setAllSelectedDocs(prev => prev.filter(item => item.fileId !== id));
                                        } else {
                                            updatedCheckBoxIds.push(id);
                                            if (doc && doc.registrationId !== undefined) {
                                                setAllSelectedDocs(prev => {
                                                    if (!prev.some(item => item.fileId === id)) {
                                                        return [
                                                            ...prev,
                                                            { fileId: id, registrationId: Number(doc.registrationId) } // Ensure number type
                                                        ];
                                                    }
                                                    return prev;
                                                });
                                            }
                                        }
                                        setSelectedCheckBoxIds(updatedCheckBoxIds);
                                    }}
                                emptyStateMsg={getEmptyStateMsg()}
                                emptybtnTitle="Add Type"
                                isShowEmptyAddBtn={false}
                                errorActionListItem={[
                                    {
                                        action: 'Secondary Text',
                                        iconName: 'home',
                                        id: '1',
                                        showActionAs: ShowActionAs.Text,
                                        title: 'Primary Text'
                                    },
                                    {
                                        action: 'Secondary Text',
                                        iconName: 'information',
                                        id: '2',
                                        title: 'Primary Text'
                                    },
                                    {
                                        action: 'Secondary Text',
                                        iconName: 'view',
                                        id: '3',
                                        showActionAs: ShowActionAs.Link,
                                        title: 'Primary Text'
                                    }
                                ]}
                                errorPageActionListDescription="Things to try"
                                errorPageReasonListDescription="This may be due to one of the reasons below"
                                errorPageTitle="Summary of issue"
                                errorReasonListItem={[
                                    {
                                        id: '1',
                                        reason: 'Wrong link or address.'
                                    },
                                    {
                                        id: '2',
                                        reason: 'The page may have been removed.'
                                    },
                                    {
                                        id: '3',
                                        reason: 'Wrong link or address.'
                                    }
                                ]}
                                groupTagsEnabled
                                headingText="Documents"
                                id="controlled-list"
                                isBreadCrumbEnable={false}
                                isOnCloseSidepnl
                                lastColContentAlign="center"
                                lastColHeaderAlign="center"
                                paginationCount={totalPage || 0}
                                paginationDefaultPage={1}
                                paginationPage={currentPage}
                                paginationOnChange={onPageChange}
                                isPagination
                                paginationMinCountToHideNextPreviousBtn={0}
                                emptyRowType={showErrorBanner ? TableRowType.Error : TableRowType.Info}
                                emptyRowResponseCode={showErrorBanner ? ResponseCode.Error : ResponseCode.Info}
                                emptyRowResponseMessage={resultNotFoundMSG}
                                isShowdynamictableNoMsg={Boolean((searchText && !docData?.data?.length) || showErrorBanner || (docData?.statusCode === 200 && Array.isArray(docData?.data) && docData?.data.length === 0) && !isSearchTriggered)}
                                isMessageCenterAligned={false}
                                dynamictableIconName={showSearchError && docData?.data?.length === 0 && searchText ? "warning--alt" : "information"}
                                searchHeadingText="Search by document or related to name"
                                searchTerm={searchInput}
                                isShowSearch
                                searchPlaceholderText=" "
                                searchValue={searchTerm}
                                searchIsLoader={isSearchLoading}
                                isSearchHideClearIcon={searchTerm.length === 0}
                                onKeyUpLenght={2}
                                searchDebouncerTreshold={1000}
                                searchSuggestions={filteredSuggestions}
                                onSearchSuggestionItemClick={(item) =>{
                                    handleSuggestionClick(item, setSearchTerm, setSearchText, setDocumentRelatedTo, setSearchRefExternalId)
                                }}
                                searchOnChange={(e: any) => handleSearchChange(e, getAllRegistrationIds(selectedCategories), selectedDateRange?.fromDate, selectedDateRange?.toDate, setSearchTerm, setSuggestions, setShowSearchError, setIsSearchLoading)}
                                searchValidationText={
                                    showSearchError ? "Search unavailable. Please try again later." : undefined
                                }
                                searchValidationTextLevel={
                                    showSearchError ? ValidationTextLevel.Warning : undefined
                                }


                                onSearchKeyDown={handleSearchEnter}
                                searchOnCloseHandle={handleSearchClose}
                                secondaryButtonTitle={viewData?.length ? "Clear all" : "Close"}
                                onClickSidePnlSecondaryBtn={() => !viewData?.length && setIsSidePanelOpen(false)}
                                isShowSecondaryBtn={true}
                                isShowPrimaryBtn={false}
                                showConfirmDialog={showConfirmDialog}
                                sidePanelShowNotification={false}
                                sidePanelNotificationMessage="A technical issue at our end has stopped us from [action].
                                    Please try again. If the issue persists, please get in touch with our support team.
                                    We appreciate your patience and understanding during this time."
                                sidePanelNotificationStatus={NotificationStatus.WARNING}
                                sidePanelNotificationTitle="Unable to Download"
                                addEditTemplateChild={
                                    <>
                                        {prepareDownloadError && <Notification
                                            status={NotificationStatus.WARNING}
                                            title="Unable to prepare [document/documents] for download"
                                            message="A technical issue has prevented us from preparing the [document/documents] for download. Please try again later. If the issue persists please get in touch with our support team."
                                            autoclose
                                            onClickClose={() => setPrepareDownloadError(false)}
                                        />} 
                                        {showEmailNotification && (
                                            <Notification
                                                status={NotificationStatus.HIGHLIGHT}
                                                title="Download notification email"
                                                message="We'll send you an email when your download is ready. Please check your spam folder if you don't see it in your inbox."
                                                onClickClose={() => setShowEmailNotification(false)}
                                            />
                                        )}
                                        { failedFileName && (
                                        <Notification
                                            status={NotificationStatus.WARNING}
                                            title="Unable to prepare for download"
                                            message={`A technical issue has prevented us from preparing '${failedFileName}' for download. Please try again later. If the issue persists please get in touch with our support team.`}
                                            autoclose
                                            onClickClose={() => {
                                            setPrepareDownloadError(false);
                                            setFailedFileName(null);
                                            }}
                                        />
                                        )}
                                        <div className="viewDownloadWrap">
                                           {renderViewDownloadContent()}
                                            </div>
                                    </>
                                }

                                isSidePanelLoader={isSidePanelLoader}
                                sidePanelSubTitle=""
                                sidePanelTitle="Downloads"
                                subHeadingText=""
                                tableBodyData={tableData?.length > 0 ? tableData : []}
                                filterCustumeElem2={
                                    <>
                                        <Button
                                            className="filter-btn"
                                            dataTestId="filter-btn"
                                            color={ButtonColor.Utility}
                                            size={ButtonSize.Small}
                                            iconPosition={ButtonIconPosition.Right}
                                            iconName="filter"
                                            onClick={handleFilterOnClick}
                                        > Filter</Button>

                                        <FilterDialog
                                            availableCategories={availableCategories}
                                            isOpen={isFilterDialogOpen}
                                            title="Filter by"
                                            isLoading={isFilterLoading}
                                            onClose={() => setIsFilterDialogOpen(false)}
                                            setSelectedCategories={setSelectedCategories}
                                            selectedCategories={selectedCategories}
                                            handleApply={handleApply}
                                            isFilterDialogOpen={isFilterDialogOpen}
                                            setIsDateError={setIsDateError}
                                            isDateError={isDateError}
                                            setSelectedDateRange={setSelectedDateRange}
                                            selectedDateRange={selectedDateRange}
                                        />
                                    </>
                                }
                                searchOnClickClose={handleTagClose}
                                tableFirstColumnWidth="10px"
                                tableHeadersData={getTableHeaders()}
                                sortingOnClickEvent={(e, columnName) => handleSorting(columnName)}
                                templatePropsConfirmation={
                                    {
                                        cancelText: "Cancel",
                                        contentText: "",
                                                isNotificationanner: true,
                                                notificationTitle: `${allSelectedDocs?.length} ${allSelectedDocs?.length > 1 ? "documents are " : "document is "} about to be prepared for downloading.`,
                                                notificationStatus: NotificationStatus.WARNING,
                                        okText: 'Prepare download',
                                        onCancel: (): void => {setShowConfirmDialog(false)},
                                       onConfirm: (): void => {
                                        setPrepareDownloadError(false);
                                        setIsSidePanelLoader(true);
                                        setSidePanelOpenReason("prepare");
                                        setIsSidePanelOpen(true);

                                        prepareDownload(selectedDocs)
                                            .then((statuses) => {
                                            setIsSidePanelLoader(false);
                                            if (statuses.some((status: number) => status !== 204)) {
                                                setPrepareDownloadError(true);
                                            } else if (selectedCheckBoxIds.length > 1) {
                                                setShowEmailNotification(true);
                                                 }
                                            })
                                            .catch(() => {
                                            setIsSidePanelLoader(false);
                                            setPrepareDownloadError(true);
                                            });

                                        setTimeout(() => {
                                            setIsSidePanelLoader(false);
                                        }, 1000);
                                        },
                                                template: DialogTemplate.Confirmation
                                    }
                                }
                                // isClearSelectedCheckbox={isSelectionCleared ? true : false}
                                titleConfirmation="Prepare Download?"
                                isOpenConfirmationDialog={showConfirmDialog}
                                showToastNotification={false}
                                toastNotificationStatus={NotificationStatus.SUCCESS}
                                toastNotificationTitle=""
                                isShowOverflowMenuCol={false}
                                isShowFirstElement
                                isSidePanelOpen={isSidePanelOpen}
                                handleCloseSidePanel={handleCloseSidePanel}
                                isShowAutoSuggest={isShowAutoSuggest}
                                isLoaderForFilterandTable={isLoading}
                                loaderFilterText="Please Wait..."
                                isShowErrorPage={!!showSearchError}
                                isSearchShowLoading={isLoading}
                                dynamicTableLoader={issearchDataLoading}
                                className="grid_wrapper"
                                searchTagList = { searchTagList}
                                onOverflowTagClose ={()=>{}}
                                isShowFourthElement={false}
                            />
                        </div>}
                    </div>
                </GridItem>
            </Grid>
        </>
    </>)
}
export default DocumentManagementServerView


