/// <reference types="node" />
import React, { useState, useEffect } from "react"
import { useTranslation,UseTranslationResponse } from "@essnextgen/ui-intl-kit";
import { useLocation } from "react-router-dom";
import { LocalisedMenu } from "@essnextgen/ui-application-kit"
import { Grid, GridItem, Button,ButtonColor,Notification, IconColor,ButtonSize, Breadcrumbs, ControlledList, DialogTemplate, NotificationStatus, ShowActionAs, ButtonIconPosition, useMediaQuery, Suggestion, ValidationTextLevel, ResponseCode, TableRowType, ISelectedItem, Loader, LoaderType } from "@essnextgen/ui-kit"
import dayjs from "dayjs"
import { fetchCategory, getAllRegistrationIds, getCategoryArr, getResultNotFoundMsg, getTableHeadersData, getVisibleTagsWithSummary, handlePageChange, handleSearchChange, handleSuggestionClick, handleTagCloseLogic, onBreadcrumbClick, mapRelatedArr, filterNonEmptySuggestions, prepareDownload, fetchViewDownloadData, reduceCategories, validateAndApplyFilter, closeSidePanel, buildSelectedDocs, fetchGetDocumentDetailsLogic, handleClearAllConfirm, getCompletedPartitionKeys, fileDownload, handleBulkDeleteLogic, buildValidationPayload, getTitleConfirmation } from "./DocumentManagementServer.logic"
import "./style.scss"
import { Category, tableDataProps, ViewDownloadItem } from "./responseModel"
import { homeurl, pageSizeNumber } from "../../../public/Constants"
import { CapitalizeFirstLetter } from "../../shared/utils/commonFunctions"
import { viewDownload ,clearAllFiles, deleteFiles, validation} from "./ApiService"
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
    const [dialogType, setDialogType] = useState<string>("");
    const [currentPage, setCurrentPage]: [number, React.Dispatch<React.SetStateAction<number>>] = useState(1);
    const [totalPage, setTotalPage]: [number, React.Dispatch<React.SetStateAction<number>>] = useState(0);
    const [searchInput, setSearchInput] = useState<string>("");
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [isSearchLoading, setIsSearchLoading] = useState<boolean>(false);
    const [showSearchError, setShowSearchError] = useState<boolean>(false);
    const [docData, setDocData] = useState<any>(null);
    const [isSearchTriggered, setIsSearchTriggered] = useState<boolean>(false);
    const [searchText, setSearchText] = useState<string>("");
    const [issearchDataLoading, setIsSearchDataLoading] = useState<boolean>(false);
    const [isFilterDialogOpen, setIsFilterDialogOpen] = useState<boolean>(true);
    const [selectedCategories, setSelectedCategories] = useState<ISelectedItem[]>([]);
    const [selectedFormats, setSelectedFormats] = useState<ISelectedItem[]>([]);
    const [showErrorBanner, setShowErrorBanner] = useState<boolean>(false);
    const [sortBy, setSortBy] = useState<string>("DateAdded");
    const [sortDirection, setSortDirection] = useState<string>("Desc");
    const [visibleBreadcrumbs, setVisibleBreadcrumbs] =useState(breadcrumbActionsList);
    const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
    const [dateRange, setDateRange] = useState({ fromDate: "", toDate: "" })
    const [selectedDateRange, setSelectedDateRange] = useState({ fromDate: "", toDate: "" })
    const [isDateError, setIsDateError] = useState(false);
    const [isFilterLoading, setIsFilterLoading] = useState<boolean>(false);
    const [isClearSelectedCheckbox, setIsClearSelectedCheckbox] = useState<boolean>(false);
    const [isSidePanelLoader, setIsSidePanelLoader] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
    const [selectedCheckBoxIds, setSelectedCheckBoxIds] = useState<string[]>([]);
    const [excludedCheckBoxIds, setExcludedCheckBoxIds] = useState<string[]>([]);
    const [isHeaderBoxChecked, setIsHeaderBoxChecked] = useState<boolean>(false);
    const [viewData, setViewData] = useState<ViewDownloadItem[]>([]);
    const [sidePanelOpenReason, setSidePanelOpenReason] = useState<"prepare" | "view" | null>(null);
    const [prepareDownloadError, setPrepareDownloadError] = useState(false);
    const [clearAllError, setClearAllError] = useState(false);
    const [showEmailNotification, setShowEmailNotification] = useState(false);
    const [showToastNotification, setShowToastNotification] = useState(false);
    const [downloadError, setDownloadError] = useState<boolean>(false);
    const [failedFileName, setFailedFileName] = useState<string[]>([]);
    const [allSelectedDocs, setAllSelectedDocs] = useState<{ fileId: string, registrationId: number, externalId: string }[]>([]);
    const [hasFetchedViewDownload, setHasFetchedViewDownload] = useState(false);
    const [showDeleteErrorBanner, setShowDeleteErrorBanner] = useState(false);
    const downloadPollingIntervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null);
    const [documentRealatedTo, setDocumentRelatedTo] = useState<number>(0)
    const [searchRefExternalId, setSearchRefExternalId] = useState<string[]>([]);
    const [showDeleteSuccessToast, setShowDeleteSuccessToast] = useState(false);
     const [restrictedFileCount, setRestrictedFileCount] = useState(0); 
    const [alreadyDeletedFileCount, setAlreadyDeletedFileCount] = useState(0);
    const [availableFileCount, setAvailableFileCount] = useState(0);
    const [showRestrictedDeleteDialog, setShowRestrictedDeleteDialog] = useState(false);
    const [showRestrictedPrepareDialog, setShowRestrictedPrepareDialog] = useState(false);
    const [isPreDialogLoading, setIsPreDialogLoading] = useState(false);
    const [isDialogLoading, setIsDialogLoading] = useState(false);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [tableKey, setTableKey] = useState(0);
    const [totalSelectedCount, setTotalSelectedCount] = useState<number>(0);
    const [isGlobalLoaderModel, setIsGlobalLoaderModel] = useState<boolean>(false);

    const categoryArr = getCategoryArr(selectedFormats);
    const searchTagListRaw = [
    ...categoryArr
    ];


        const messages = [];
 
        if (restrictedFileCount > 0) {
        messages.push(
            `${restrictedFileCount === docData?.totalRecords ? 'All ' : ''} ${restrictedFileCount} document${restrictedFileCount !== 1 ? "s" : ""} cannot be deleted as ${restrictedFileCount !== 1 ? "they are" : "it is"} currently being prepared for download. Please try again later.`
        );
        
        }
        
        if (alreadyDeletedFileCount > 0) {
        messages.push(
            `${alreadyDeletedFileCount === docData?.totalRecords ? 'All ' : ''}  ${alreadyDeletedFileCount} document${alreadyDeletedFileCount !== 1 ? "s" : ""} have already been deleted.`
        );
        }
        const contentText = <div style={{ whiteSpace: "pre-line" }}>{messages.join("\n")}</div>;
 

    const { t }: UseTranslationResponse<"translation", undefined> =
        useTranslation();

    const location = useLocation();
    
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (params.get("isViewDownload") === "true") {
            setSidePanelOpenReason("view");
            setIsSidePanelOpen(true);
        }
    }, [location.search]);

    const searchTagList = getVisibleTagsWithSummary(searchTagListRaw, 3);
    
    const allRegistrationIds = getAllRegistrationIds(selectedFormats);

    const onPageChange = (event: any, page: number) =>
        handlePageChange(event, page, setCurrentPage, setIsSearchDataLoading);
 
    let tableData: tableDataProps[] = [];

        if (showSearchError || !docData?.data?.length) {
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

    const isMobileView: boolean = useMediaQuery(
        "(min-width:320px) and (max-width: 1023.9px)"
    );
 
    const [isOpen, setIsOpen]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);

    useEffect(() => {
    // Try desktop main panel first
        let scrolled = false;
        const mainPanel = document.querySelector('.clc-dms-isopen') as HTMLElement | null;
        if (mainPanel && typeof mainPanel.scrollTo === "function" && mainPanel.offsetParent !== null) {
            mainPanel.scrollTo({ top: 0, behavior: 'smooth' });
            scrolled = true;
        }
        // If not desktop, try mobile grid wrapper
        if (!scrolled) {
            const grid = document.querySelector('.grid-wrapper') as HTMLElement | null;
            if (grid && typeof grid.scrollIntoView === "function" && grid.offsetParent !== null) {
                grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
                scrolled = true;
            }
        }
        // Fallback to window scroll
        if (!scrolled) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [currentPage]);

    useEffect(() => {
        if (!isMobileView) {
            document.body.classList.add("no-scroll");
            return () => document.body.classList.remove("no-scroll");
        }
        return () => {};
    }, [isMobileView]);
 

 
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

      fetchCategory().then((res) => {
        const map: Record<string, number> = {};
        res.forEach((cat: any) => {
        map[cat.application] = cat.registrationId;
        });
    });
    }, []);


    useEffect(() => {
  if (isSearchTriggered && searchText) {
    const allRegistrationId = getAllRegistrationIds(selectedFormats);
    setIsInitialLoad(true);
    fetchGetDocumentDetails(currentPage, allRegistrationId, sortBy, sortDirection);
    setIsInitialLoad(false);
  }
}, [currentPage, searchText, dateRange?.fromDate, dateRange?.toDate, selectedFormats, sortBy, sortDirection, searchRefExternalId, documentRealatedTo, isSearchTriggered]);

    useEffect(() => {
        // Only run when opening the side panel for "prepare"
        if (isSidePanelOpen && sidePanelOpenReason === "prepare") {
            setShowToastNotification(false); 
            setIsSidePanelLoader(true); 

            // Wait for 2 seconds before calling view download API
            const timer = setTimeout(() => {
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
    }, 2000);

    return () => clearTimeout(timer);
  }
  if (isSidePanelOpen && sidePanelOpenReason === "view" ) {
    setShowToastNotification(false);
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
    refExternalId: string[] = searchRefExternalId,
    relatedTo: number = documentRealatedTo
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
        setIsSearchLoading,
        setIsSearchDataLoading,
    });
    };

     useEffect(() => {
        const excludedCount = excludedCheckBoxIds.length || 0;
        const computedTotalSelectedCount = (() => {
            if (!docData?.totalRecords) return 0;
            if(docData?.totalRecords === excludedCount) {
                setIsHeaderBoxChecked(false);
                setAllSelectedDocs([]);
                setExcludedCheckBoxIds([]);
                return 0;
            }
            if (isHeaderBoxChecked) return docData.totalRecords - excludedCount;
            return allSelectedDocs?.length || 0;
        })();
        setTotalSelectedCount(computedTotalSelectedCount);
    }, [isHeaderBoxChecked, excludedCheckBoxIds, docData, allSelectedDocs]);


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
 


const handleEditSelectedOverFlowMenu = async (e:React.SyntheticEvent, selectedItem: ISelectedItem) => {
    setShowConfirmDialog(false);
    setShowRestrictedDeleteDialog(false);
    setShowRestrictedPrepareDialog(false);
    if (selectedItem.value === "Prepare download" || selectedItem.value === "Delete") {
        if (totalSelectedCount === 0) {
            setShowDialog(true);
        } else {
            setShowRestrictedDeleteDialog(true);
            setIsPreDialogLoading(true);
            const excludedFileDetails = isHeaderBoxChecked ? allSelectedDocs : [];
            const fileDetails = isHeaderBoxChecked ? [] : allSelectedDocs || []
            const validationPayload = buildValidationPayload({
                isSelectAll: !!isHeaderBoxChecked,
                userActivity: selectedItem.value === "Prepare download" ? "PrepareDownload" : "BulkDelete",
                categoryIds: allRegistrationIds,
                fromDate: dateRange.fromDate,
                toDate: dateRange.toDate,
                referenceExternalIds: searchRefExternalId,
                documentRelatedTo: documentRealatedTo,
                fileDetails,
                excludedFileDetails
            });

      const result = await validation(validationPayload);

      const restricted = result?.data?.restrictedFileCount ?? 0;
      const alreadyDeleted = result?.data?.alreadyDeletedFileCount ?? 0;
      const available = result?.data?.availableFileCount ?? 0;

            setRestrictedFileCount(restricted);
            setAlreadyDeletedFileCount(alreadyDeleted);
            setAvailableFileCount(available);

            setDialogType(selectedItem.value === "Prepare download" ? "prepareDownload" : "delete");  
            setIsPreDialogLoading(false); 
            setShowRestrictedDeleteDialog(false);  
            if (
            selectedItem.value === "Prepare download" &&
            available === 0 &&
            alreadyDeleted > 0
            ) { 
            setShowRestrictedPrepareDialog(true);
            setShowConfirmDialog(false);
            return;
            }
            
            if (selectedItem.value === "Delete") {
        if (available === 0 && (restricted > 0 || alreadyDeleted > 0)) {
            setIsDialogLoading(false);
            setShowRestrictedDeleteDialog(true);
            setShowConfirmDialog(false);
            return;
        }

        if (available > 0) {
            setIsDialogLoading(false);
            setShowConfirmDialog(true);
            setShowRestrictedDeleteDialog(false);
            return;
        }
    }

        setShowConfirmDialog(true);
        }
    } else if ((selectedItem?.value?.toLowerCase() === "view download")) {
        setSidePanelOpenReason("view");
        setIsSidePanelOpen(true);
    }
};
 
    const getEmptyStateMsg = () => {
  if (showErrorBanner) return "Information unavailable.";
  if (issearchDataLoading || isSearchLoading) return undefined;

  // Initial state: no search yet
  if (!isSearchTriggered && !searchText) {
    return "Use the search bar to search pupil, staff or organisation.";
  }

  // After search, no results
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
            setCurrentPage(1);
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
        },
        {
            isShow: showDeleteErrorBanner,
            variant: "warning",
            title: `Unable to delete [document/documents]`,
            message:
            `A technical issue has stopped us from deleting the ${availableFileCount === 1 ? "document" : "documents"}. Please try again later. If the issue persists, please get in touch with our support team.`,
            autoclose: false,
            onClickClose: () => setShowDeleteErrorBanner(false)
    }
    ];

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

    const resultNotFoundMSG = getResultNotFoundMsg(searchText, docData, searchTerm, showErrorBanner, isSearchTriggered);
    const filteredSuggestions = filterNonEmptySuggestions(suggestions);
     

    const handleBulkDelete = () =>
        handleBulkDeleteLogic({
            allSelectedDocs,
            docData,
            allRegistrationIds,
            dateRange,
            searchRefExternalId,
            documentRealatedTo,
            currentPage,
            sortBy,
            sortDirection,
            setShowToastNotification,
            setShowConfirmDialog,
            setSelectedCheckBoxIds,
            setAllSelectedDocs,
            setIsClearSelectedCheckbox,
            setShowDeleteErrorBanner,
            setShowDeleteSuccessToast,
            fetchGetDocumentDetails,
            deleteFiles,
            excludedCheckBoxIds,
            isHeaderBoxChecked
        });

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
    setCurrentPage,
    searchRefExternalId,
    setSearchRefExternalId,
  });
};

 
let dialogConfig;

switch (dialogType) {
  case "clearAll":
    dialogConfig = {
      cancelText: "Keep all",
      contentText: "This action will remove all files 'Completed' from the Downloads panel.",
      isNotificationanner: false,
      notificationTitle: "",
      notificationStatus: NotificationStatus.WARNING,
      okText: "Clear all",
      onCancel: (): void => { setShowConfirmDialog(false); },
      onConfirm: async (): Promise<void> => {
        setClearAllError(false);
        await handleClearAllConfirm({
          viewData,
          clearAllFiles,
          setShowToastNotification,
          fetchViewDownloadData,
          setIsSidePanelLoader,
          setViewData,
          setHasFetchedViewDownload,
          viewDownload,
          downloadPollingIntervalRef,
          setClearAllError,
          setShowConfirmDialog,
          getCompletedPartitionKeys,
        });
      },
      template: DialogTemplate.Confirmation,
    };
    break;

  case "delete":
    dialogConfig = {
      cancelText: "Keep it",
      okText: "Delete",
      contentText,
      isNotificationanner: true,
      notificationTitle: `${availableFileCount === docData?.totalRecords ? 'All ' : ''}  ${availableFileCount} document${availableFileCount > 1 ? "s" : ""} will be gone forever once deleted.`,
      notificationStatus: NotificationStatus.WARNING,
      onCancel: (): void => { setShowConfirmDialog(false);
         if (alreadyDeletedFileCount > 0) {
            fetchGetDocumentDetails(
                currentPage,
                getAllRegistrationIds(selectedFormats),
                sortBy,
                sortDirection,
                searchRefExternalId,
                documentRealatedTo
            );
            setSelectedCheckBoxIds([]);
            setAllSelectedDocs([]);
            setIsClearSelectedCheckbox(true);
        }
       },
      onConfirm: async (): Promise<void> => {
        setIsDialogLoading(true);
        setIsGlobalLoaderModel(true);
        await handleBulkDelete();
        setIsDialogLoading(false);
        setShowConfirmDialog(false);
        setSelectedCheckBoxIds([]);
        setAllSelectedDocs([]);
        setIsClearSelectedCheckbox(true);
      },
      template: DialogTemplate.Confirmation,
    };
    break;

  default:
    dialogConfig = {
      cancelText: "Cancel",
      contentText: (() => {
            if (alreadyDeletedFileCount > 0) {
                return alreadyDeletedFileCount === 1
                ? `${alreadyDeletedFileCount} document cannot be downloaded as it has been deleted.`
                : `${alreadyDeletedFileCount} documents cannot be downloaded as they have already been deleted.`;
            }
            return "";
            })(),
      isNotificationanner: true,
      notificationTitle:
        availableFileCount === 1
          ? `${availableFileCount} document is about to be prepared for downloading.`
          : `${availableFileCount === docData?.totalRecords ? 'All ' : ''}  ${availableFileCount} documents are about to be prepared for downloading.`,
      notificationStatus: NotificationStatus.WARNING,
      okText: "Prepare download",
      onCancel: (): void => { setShowConfirmDialog(false); 
         if (alreadyDeletedFileCount > 0) {
            fetchGetDocumentDetails(
                currentPage,
                getAllRegistrationIds(selectedFormats),
                sortBy,
                sortDirection,
                searchRefExternalId,
                documentRealatedTo
            );
            setSelectedCheckBoxIds([]);
            setAllSelectedDocs([]);
            setIsClearSelectedCheckbox(true);
        }
      },
      onConfirm: (): void => {
        setPrepareDownloadError(false);
        setIsSidePanelLoader(true);
        setSidePanelOpenReason("prepare");
        setIsSidePanelOpen(true);
        const selectedDocs = buildSelectedDocs(
          selectedCheckBoxIds,
          docData,
          allRegistrationIds,
          searchRefExternalId,
          documentRealatedTo,
          excludedCheckBoxIds,
          isHeaderBoxChecked
        );

        prepareDownload(selectedDocs)
          .then((statuses) => {
            if (statuses.some((status: number) => status !== 204)) {
              setPrepareDownloadError(true);
            } else if (totalSelectedCount > 1) {
              setShowEmailNotification(true);
            }
          })
          .catch(() => {
            setIsSidePanelLoader(false);
            setPrepareDownloadError(true);
          });
      },
      template: DialogTemplate.Confirmation,
    };
}


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
        const cancelledFiles = viewData.filter(item => item.status?.toLowerCase() === 'cancel');
        if (cancelledFiles.length > 0) {
        setFailedFileName(cancelledFiles.map(file => file.name).filter(Boolean) as string[]);
        }
    }
    }, [viewData]);

    const handleCloseSidePanel = () => {
        closeSidePanel(setIsSidePanelOpen, downloadPollingIntervalRef);
    };

   const handleOnChangeAllCheckBox = (e: any) => {
        const isChecked = e.target.checked;
        setIsHeaderBoxChecked(isChecked);
        if (!isChecked) {
            setSelectedCheckBoxIds([]);
            setExcludedCheckBoxIds([]);
            setAllSelectedDocs([]);
        }
    }
    
const handleOnChangeCheckBox = (index: number, id: string) => {
    const doc = docData?.data?.find((d: any) => d.fileId === id);

    setSelectedCheckBoxIds((prevSelectedIds) => {
        const updatedCheckBoxIds = [...prevSelectedIds];
        if (updatedCheckBoxIds.includes(id)) {
            return updatedCheckBoxIds.filter((selectedId) => selectedId !== id);
        }
        return [...updatedCheckBoxIds, id];
    });

    setAllSelectedDocs((prevSelectedDocs) => {
        if (doc) {
            const isAlreadySelected = prevSelectedDocs.some((item) => item.fileId === id);
            if (isAlreadySelected) {
                
                return prevSelectedDocs.filter((item) => item.fileId !== id);
            }
            return [
                ...prevSelectedDocs,
                {
                    fileId: id,
                    registrationId: Number(doc.registrationId),
                    externalId: doc.externalId,
                }
            ];
        }
        return prevSelectedDocs;
    });
};

const getDialogTitle = () => {
    if (restrictedFileCount > 0) {
        return restrictedFileCount === 1
            ? "Document cannot be deleted"
            : "Documents cannot be deleted";
    }

    if (alreadyDeletedFileCount > 0) {
        return alreadyDeletedFileCount === 1
            ? "Document already deleted"
            : "Documents already deleted";
    }

    return "";
};

    const renderViewDownloadContent = () => {
    if (isSidePanelLoader) {
        return <Loader loaderType={LoaderType.Circular} />;
    }
    if (hasFetchedViewDownload && viewData?.length === 0 && !showToastNotification && !showToastNotification) {
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
                            return <span>{t("DocumentManagementServer.ExpiresInDays", { days: item.fileExpiryDays })}</span>;
                        }
                        if (item.fileExpiryDays === 0) {
                            return <span>{t("DocumentManagementServer.ExpiresToday")}</span>;
                        }
                        return null;
                        })()}
                </div>
               {isComplete && (
                   <Button
                       className="viewDownloadBtn"
                       id={`file-download-${item.fileId}`}
                       onClick={async () => {
                           try {
                               await fileDownload(
                                   item.fileId?.toUpperCase(),
                                   item.name ?? "",
                                   item.application,
                                   item.section,
                                   item.sasUrl
                               );
                           } catch (error) {
                               setDownloadError(true);
                           }
                       }}
                   >
                       Download
                   </Button>
               )}
                {(isInProgress || isInitiated) && (
                    <span className="inProgressLoader">
                        <Loader loaderType={LoaderType.Circular} />
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
            <div className="clc-dms-delete-toast">
                {showDeleteSuccessToast && (
                    <Notification
                        status={NotificationStatus.SUCCESSTOAST}
                        title={availableFileCount === 1 ? "Document deleted" : "Documents deleted"}
                        autoclose
                        hideCloseButton
                    />
                )}
            </div>
            <Grid className="dms-layout">
                {showDialog && 
                <NoSelectionDialog setShowDialog={setShowDialog}
                title="No items selected"
                message="Please select at least one item from the search results to perform the action." 
                onClose={() => {} }/>}

                {showRestrictedDeleteDialog && (
                    <NoSelectionDialog
                        setShowDialog={setShowRestrictedDeleteDialog}
                        title={getDialogTitle()}
                        notificationTitle={
                            (() => {
                                if (restrictedFileCount > 0) {
                                return restrictedFileCount === 1
                                    ? `This document cannot be deleted as it is currently being prepared for download . Please try again later.`
                                    : `${restrictedFileCount === docData?.totalRecords ? 'All ' : ''} ${restrictedFileCount} documents cannot be deleted as they are being prepared for download. Please try again later.`;
                                }
                                if (alreadyDeletedFileCount > 0) {
                                return alreadyDeletedFileCount === 1
                                    ? `This document has already been deleted.`
                                    : `${alreadyDeletedFileCount === docData?.totalRecords ? 'All ' : ''} ${alreadyDeletedFileCount} documents have already been deleted.`;
                                }
                                return "";
                            })()
                            }
                        message={
                            (() => {
                                if (restrictedFileCount > 0 && alreadyDeletedFileCount > 0) {
                                return `${alreadyDeletedFileCount === docData?.totalRecords ? 'All ' : ''} ${alreadyDeletedFileCount} file${alreadyDeletedFileCount !== 1 ? "s" : ""} are already deleted.`;
                                }
                                return "";
                            })()
                        }
                        loading={isPreDialogLoading}
                        onClose={() => {
                            if (alreadyDeletedFileCount > 0) {
                                fetchGetDocumentDetails(
                                    currentPage,
                                    getAllRegistrationIds(selectedFormats),
                                    sortBy,
                                    sortDirection,
                                    searchRefExternalId,
                                    documentRealatedTo
                                );
                                 setSelectedCheckBoxIds([]);
                                setAllSelectedDocs([]);
                                setIsClearSelectedCheckbox(true);
                            }
                        }}
                    />
                    )}

                {showRestrictedPrepareDialog && (
                    <NoSelectionDialog
                        setShowDialog={setShowRestrictedPrepareDialog}
                        title={alreadyDeletedFileCount === 1 ? "Document cannot be downloaded" : "Documents cannot be downloaded"}
                        notificationTitle={
                        alreadyDeletedFileCount === 1
                            ? `This document cannot be downloaded as it has been deleted.`
                            : `${alreadyDeletedFileCount === docData?.totalRecords ? 'All ' : ''} ${alreadyDeletedFileCount} documents cannot be downloaded as they have been deleted.`
                        }
                        loading={isPreDialogLoading}
                        onClose={() => {
                            if (alreadyDeletedFileCount > 0) {
                                fetchGetDocumentDetails(
                                    currentPage,
                                    getAllRegistrationIds(selectedFormats),
                                    sortBy,
                                    sortDirection,
                                    searchRefExternalId,
                                    documentRealatedTo
                                );
                                setSelectedCheckBoxIds([]);
                                setAllSelectedDocs([]);
                                setIsClearSelectedCheckbox(true);
                            }
                        }}
                    />
                )}

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
                 
                   <div className="grid-wrapper">
                            <ControlledList
                                key={tableKey}
                                isMobileViewBreadcrumb
                                globalNotificationMsgBannerObject={NotificationMsgBannerObject}
                                isShowHeading
                                isShowSubHeading
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
                                isClearSelectedCheckbox={isClearSelectedCheckbox}
                                isAllSelectedAcrossPagination={false}
                                totalRecords={docData?.totalRecords || 0}
                                selectedCheckboxIds={(ids: string[]) => {
                                    setSelectedCheckBoxIds(ids);
                                }}
                                setExcludedCheckBoxIds={(ids: string[]) => {
                                        setExcludedCheckBoxIds(ids);
                                }}
                                onChangeAllCheckBox={(e: any) => handleOnChangeAllCheckBox(e)}
                                onChangeListCheckBox={handleOnChangeCheckBox}
                                
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
                                headingText={t("DocumentManagementServer.headingText")}
                                id="controlled-list"
                                isBreadCrumbEnable={false}
                                isOnCloseSidepnl
                                lastColContentAlign="center"
                                lastColHeaderAlign="center"
                                paginationCount={totalPage || 0}
                                paginationDefaultPage={1}
                                paginationPage={currentPage}
                                paginationOnChange={onPageChange}
                                isPagination={tableData.length > 0}
                                paginationMinCountToHideNextPreviousBtn={0}
                                emptyRowType={showErrorBanner ? TableRowType.Error : TableRowType.Info}
                                emptyRowResponseCode={showErrorBanner ? ResponseCode.Error : ResponseCode.Info}
                                emptyRowResponseMessage={resultNotFoundMSG}
                                isShowdynamictableNoMsg={
                                    (!isSearchTriggered && !searchText) ||
                                    (isSearchTriggered && docData?.statusCode === 200 && Array.isArray(docData?.data) && docData?.data.length === 0)
                                }
                                isMessageCenterAligned={false}
                                dynamictableIconName={showSearchError && docData?.data?.length === 0 && searchText ? "warning--alt" : "information"}
                                searchHeadingText="Search by pupil, staff or school name"
                                searchTerm={searchInput}
                                isShowSearch
                                searchPlaceholderText=" "
                                searchValue={searchTerm}
                                searchIsLoader={isSearchLoading}
                                isSearchHideClearIcon={searchTerm.length === 0}
                                onKeyUpLenght={2}
                                searchDebouncerTreshold={0}
                                searchSuggestions={filteredSuggestions}
                                onSearchSuggestionItemClick={(item) =>{
                                    handleSuggestionClick(item, setSearchTerm, setSearchText, setDocumentRelatedTo, setSearchRefExternalId)
                                    setIsSearchTriggered(true);
                                }}
                                searchOnChange={(e: any) => handleSearchChange(e, getAllRegistrationIds(selectedCategories), selectedDateRange?.fromDate, selectedDateRange?.toDate, setSearchTerm, setSuggestions, setShowSearchError, setIsSearchLoading)}
                                searchValidationText={
                                    showSearchError ? "Search unavailable. Please try again later." : undefined
                                }
                                searchValidationTextLevel={
                                    showSearchError ? ValidationTextLevel.Warning : undefined
                                }

                                searchOnCloseHandle={handleSearchClose}
                                isGlobalLoader={isDialogLoading}
                                globalLoaderText="Please wait..."
                                isGlobalLoaderModel={isGlobalLoaderModel}
                                secondaryButtonTitle={hasCompletedFiles ? "Clear all" : "Close"}
                                onClickSidePnlSecondaryBtn={() => {
                                    if (hasCompletedFiles) {
                                        setDialogType("clearAll");
                                        setShowConfirmDialog(true);
                                    } else {
                                        setIsSidePanelOpen(false);

                                    }
                                }}
                                isShowSecondaryBtn
                                isShowPrimaryBtn={false}
                                showConfirmDialog={showConfirmDialog}
                                sidePanelShowNotification={false}
                                sidePanelNotificationMessage="A technical issue at our end has stopped us from [action].
                                    Please try again. If the issue persists please get in touch with our support team.
                                    We appreciate your patience and understanding during this time."
                                sidePanelNotificationStatus={NotificationStatus.SUCCESSTOAST}
                                sidePanelNotificationTitle="Unable to Download"
                                 addEditTemplateChild={
                                    <>
                                        {clearAllError && (
                                            <Notification
                                                status={NotificationStatus.WARNING}
                                                title="Unable to clear downloads"
                                                message="A technical issue has prevented us from clearing the downloads. Please try again later. If the issue persists please get in touch with our support team."
                                                autoclose
                                                onClickClose={() => setClearAllError(false)}
                                            />
                                        )}
                                        {prepareDownloadError && (
                                            <Notification
                                                status={NotificationStatus.WARNING}
                                                title="Unable to prepare [document/documents] for download"
                                                message="A technical issue has prevented us from preparing the [document/documents] for download. Please try again later. If the issue persists please get in touch with our support team."
                                                autoclose
                                                onClickClose={() => setPrepareDownloadError(false)}
                                            />
                                        )}
                                        {downloadError && (
                                            <Notification
                                                status={NotificationStatus.WARNING}
                                                title="Unable to download"
                                                message="A technical issue has stopped us from completing the download. The file could not be downloaded. Please try again later. If the issue persists please get in touch with our support team."
                                                autoclose
                                                onClickClose={() => setDownloadError(false)}
                                            />
                                        )}
                                        {showEmailNotification && (
                                            <Notification
                                                status={NotificationStatus.HIGHLIGHT}
                                                title="You'll get an email when your downloads are ready"
                                                message="We'll send you an email when your download is ready. Please check your spam folder if you don't see it in your inbox."
                                                onClickClose={() => setShowEmailNotification(false)}
                                            />
                                        )}
                                        { failedFileName.length > 0 && (
                                        <Notification
                                            status={NotificationStatus.WARNING}
                                            title="Unable to prepare [document/documents] for download"
                                            message={`A technical issue has prevented us from preparing ${failedFileName.join(", ")} for download. Please try again later. If the issue persists please get in touch with our support team.`}
                                            autoclose
                                            onClickClose={() => {
                                            setPrepareDownloadError(false);
                                            setFailedFileName([]);
                                            }}
                                        />
                                        )}
                                         { showToastNotification && (
                                            <Notification
                                                status={NotificationStatus.SUCCESSTOAST}
                                                title="Downloads cleared"
                                                autoclose
                                                onClickClose={() => setShowToastNotification(false)}
                                            />
                                        )}
                                        <div className="viewDownloadWrap">
                                           {renderViewDownloadContent()}
                                        </div>
                                    </>
                                }
                                 
                                isSidePanelLoader={isSidePanelLoader}
                                sidePanelSubTitle=""
                                sidePanelTitle={t("DocumentManagementServer.sidePanelTitle")}
                                subHeadingText={t("DocumentManagementServer.subHeadingText")}
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
                                                onClick={() => {
                                                    if (isSearchTriggered) {
                                                    handleFilterOnClick();
                                                    }
                                                }}> Filter</Button>

                                            <FilterDialog
                                            availableCategories={availableCategories}
                                            isOpen={isFilterDialogOpen}
                                            title={t("Filter.heading")}
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
                                tableHeadersData={getTableHeadersData}
                                sortingOnClickEvent={(e, columnName) => handleSorting(columnName)}
                                templatePropsConfirmation={dialogConfig}
                                titleConfirmation={getTitleConfirmation(dialogType, availableFileCount)}
                                isOpenConfirmationDialog={showConfirmDialog}
                                showToastNotification={false}
                                toastNotificationStatus={NotificationStatus.SUCCESS}
                                toastNotificationAutoclose
                                toastNotificationTitle="Downloads cleared successfully!"
                                isShowOverflowMenuCol={false}
                                isShowFirstElement
                                isSidePanelOpen={isSidePanelOpen}
                                handleCloseSidePanel={handleCloseSidePanel}
                                isShowAutoSuggest
                                isLoaderForFilterandTable={false}
                                loaderFilterText="Please Wait..."
                                isShowErrorPage={!!showSearchError}
                                isSearchShowLoading={false}
                                dynamicTableLoader={issearchDataLoading}
                                className="grid_wrapper"
                                searchTagList = { searchTagList}
                                onOverflowTagClose ={()=>{}}
                                isShowFourthElement={false}
                            />
                        </div>
                    </div>
                </GridItem>
            </Grid>
        </>
    </>)
}
export default DocumentManagementServerView
