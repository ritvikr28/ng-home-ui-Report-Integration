import React, { useState, useEffect, useRef } from "react"
import { LocalisedMenu } from "@essnextgen/ui-application-kit"
import { Grid, GridItem, Button,ButtonColor,Notification, IconColor, ButtonSize, Breadcrumbs, ControlledList, DialogTemplate, NotificationStatus, ShowActionAs, ButtonIconPosition, useMediaQuery, Suggestion, ValidationTextLevel, ResponseCode, TableRowType, ISelectedItem, Loader, LoaderType } from "@essnextgen/ui-kit"
import dayjs from "dayjs"
import { fetchCategory, getAllRegistrationIds, getCategoryArr, getResultNotFoundMsg, getTableHeadersData, getVisibleTagsWithSummary, handlePageChange, handleSearchChange, handleSuggestionClick, handleTagCloseLogic, onBreadcrumbClick, mapRelatedArr, filterNonEmptySuggestions, prepareDownload, getReferenceExternalId, fetchViewDownloadData, reduceCategories, validateAndApplyFilter, closeSidePanel } from "./DocumentManagementServer.logic"
import "./style.scss"
import { Category, DocumentPrepareDownload, PrepareDownloadRequest, tableDataProps, ViewDownloadItem } from "./responseModel"
import { homeurl, pageSizeNumber } from "../../../public/Constants"
import { CapitalizeFirstLetter, isValidDate } from "../../shared/utils/commonFunctions"
import { fetchDocumentDetails, viewDownload } from "./ApiService"
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

const categoryArr = getCategoryArr(selectedFormats);
    const downloadPollingIntervalRef = React.useRef<NodeJS.Timeout | null>(null) as React.MutableRefObject<NodeJS.Timeout | null>;

const searchTagListRaw = [
  ...categoryArr
];

const searchTagList = getVisibleTagsWithSummary(searchTagListRaw, 3);

    const [isSearchTrue, setIsSearchTrue] = useState(false); 
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
}));
}

    let registrationId = Array.isArray(selectedCheckBoxIds) && Array.isArray(docData?.data)
    ? selectedCheckBoxIds.flatMap((id) => 
        docData?.data.find((doc: any) => doc.fileId === id)?.registrationIds || []
      )
    : [];
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
        const dataFetch = fetchGetDocumentDetails(searchText, currentPage, [], sortBy, sortDirection);
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
            fetchGetDocumentDetails(searchText, currentPage, allRegistrationIds, sortBy, sortDirection);
        }
        setIsSearchTriggered(false)
    }, [currentPage, searchText, dateRange?.fromDate, dateRange?.toDate, selectedFormats, sortBy, sortDirection ]);

  useEffect(() => {
  if (isSidePanelOpen) {
    if (sidePanelOpenReason === "prepare") {
      const timer = setTimeout(() => {
        fetchViewDownloadData({
        showLoader: true,
        setIsSidePanelLoader,
        setViewData,
        viewDownload,
        downloadPollingIntervalRef,
        }); // Show loader on initial fetch
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      fetchViewDownloadData({
        showLoader: true,
        setIsSidePanelLoader,
        setViewData,
        viewDownload,
        downloadPollingIntervalRef,
        }); // Show loader on initial fetch
    }
  }
}, [isSidePanelOpen, sidePanelOpenReason]);

    const fetchGetDocumentDetails = async (searchTexts: string, page: number, categories: number[], sortByCol: string = sortBy, sortOrder= sortDirection) => {
        setIsSearchDataLoading(true);
        try {
            const result = await fetchDocumentDetails({
                pageNumber: page,
                pageSize: pageSizeNumber,
                searchText: searchTexts,
                fromDate: dateRange?.fromDate,
                toDate: dateRange?.toDate,
                categoryId: categories || [],
                isSearchTextExactMatch: isSearchTrue,
                sortBy: sortByCol,
                sortDirection : sortOrder,
            });
            if (result && result?.statusCode === 200) {
                setDocData(result);
                setCurrentPage(page);
                setTotalPage(Math.ceil(result?.totalRecords / pageSizeNumber));
                setShowSearchError(false);
                setShowErrorBanner(false)
            } else if (result && result?.status === 400) {
                setShowErrorBanner(true);
            }
            else {
                setShowSearchError(true);
            }
            setHasFetched(true);
        } catch (err) {
            console.error("Error fetching document ddocDataetails:", err);
            setShowSearchError(true);
        }
     
        setIsSearchLoading(false);
        setIsSearchDataLoading(false);
        
    }

const selectedDocs = Array.isArray(selectedCheckBoxIds) && Array.isArray(docData?.data)
  ? selectedCheckBoxIds
      .map(id => {
        const doc = docData?.data.find((d: any) => d?.fileId === id);
        if (doc && doc.registrationId !== undefined) {
          return {
            request: {
              selectAll: false,
              downloadCriteria: {
                referenceMappingDetails: [
                  {
                    referenceExternalId: Array.isArray(doc?.relatedTo) && doc?.relatedTo[0]?.learnerExternalId
                      ? doc.relatedTo[0].learnerExternalId
                      : "",
                    documentRealatedTo: Array.isArray(doc?.documentRealatedTo)
                      ? doc.documentRealatedTo.join(", ")
                      : (doc?.documentRealatedTo || ""),
                    relatedTo: doc?.relatedTo
                  },
                ],
                categoryId: categoryRegistrationMap[doc?.category]
                  ? [categoryRegistrationMap[doc?.category]]
                  : [],
                fromDate: doc?.fromDate ?? "",
                toDate: doc?.toDate ?? ""
              },
              fileDetails: [{
                fileId: id,
                registrationId: doc?.registrationId,
              }]
            }
          };
        }
        return undefined;
      })
      .filter((item): item is { request: any } => item !== undefined)
  : [];

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
            setIsSearchTrue(false);
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

const handleCloseSidePanel = () => {
  closeSidePanel(setIsSidePanelOpen, downloadPollingIntervalRef);
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
                                isShowCheckboxCol
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
                                        if (updatedCheckBoxIds?.includes(id)) {
                                            updatedCheckBoxIds?.splice(updatedCheckBoxIds.indexOf(id), 1);
                                        } else {
                                            updatedCheckBoxIds?.push(id);
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
                                    setIsSearchTrue(true);
                                    handleSuggestionClick(item, setSearchTerm, setSearchText)
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
                                        <div className="viewDownloadWrap">
                                            {viewData?.length > 0 ? (
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
                                                                    {isComplete && (
                                                                        <span>Expires in {item?.fileExpiryDays} days</span>
                                                                    )}
                                                                </div>
                                                                {isComplete && (
                                                                    <Button className="viewDownloadBtn">Download</Button>
                                                                )}
                                                                {(isInProgress || isInitiated) && (
                                                                <span className="inProgressLoader">
                                                                    <Loader
                                                                        loaderType={LoaderType.Circular}
                                                                       
                                                                    />
                                                                </span>
                                                            )}
                                                        </div>
                                                        );
                                                    })}
                                                </>
                                            ) : (
                                                <p>Files you download will appear here.</p>
                                            )}
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
                                                notificationTitle: `${selectedCheckBoxIds?.length} document is about to be prepared for downloading.`,
                                                notificationStatus: NotificationStatus.WARNING,
                                        okText: 'Prepare download',
                                        onCancel: (): void => {setShowConfirmDialog(false)},
                                       onConfirm: (): void => {
                                        setPrepareDownloadError(false);
                                        setIsSidePanelLoader(true);
                                        setSidePanelOpenReason("prepare"); // <-- set reason
                                        setIsSidePanelOpen(true);

                                        prepareDownload(selectedDocs)
                                            .then((status) => {
                                            setIsSidePanelLoader(false);
                                            if (status !== 204) {
                                                setPrepareDownloadError(true);
                                            }
                                            setSelectedCheckBoxIds([]);
                                            })
                                            .catch(() => {
                                            setIsSidePanelLoader(false);
                                            setPrepareDownloadError(true);
                                            setSelectedCheckBoxIds([]);
                                            });

                                        setTimeout(() => {
                                            setIsSidePanelLoader(false);
                                        }, 1000);
                                        },
                                                template: DialogTemplate.Confirmation
                                    }
                                }
                                titleConfirmation="Prepare download?"
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


