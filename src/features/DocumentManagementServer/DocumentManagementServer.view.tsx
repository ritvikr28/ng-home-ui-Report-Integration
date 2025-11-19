/// <reference types="node" />
import React, { useState, useEffect } from "react"
import { useTranslation,UseTranslationResponse } from "@essnextgen/ui-intl-kit";
import { useLocation } from "react-router-dom";
import { LocalisedMenu } from "@essnextgen/ui-application-kit"
import { authService, MatchPermissions } from "@essnextgen/auth-ui";
import { Grid, GridItem, Button,ButtonColor,Notification, IconColor,ButtonSize, Breadcrumbs, ControlledList, DialogTemplate, NotificationStatus, ShowActionAs, useMediaQuery, Suggestion, ValidationTextLevel, ResponseCode, TableRowType, ISelectedItem, Loader, LoaderType, SelectedItem } from "@essnextgen/ui-kit"
import dayjs from "dayjs"
import { fetchCategory, getAllRegistrationIds, getCategoryArr, getResultNotFoundMsg, getTableHeadersData, getVisibleTagsWithSummary, handlePageChange, handleSearchChange, handleSuggestionClick, handleTagCloseLogic, onBreadcrumbClick, mapRelatedArr, filterNonEmptySuggestions, prepareDownload, fetchViewDownloadData, closeSidePanel, buildSelectedDocs, fetchGetDocumentDetailsLogic, handleClearAllConfirm, getCompletedPartitionKeys, fileDownload, handleBulkDeleteLogic, buildValidationPayload, getTitleConfirmation, getDateTag, handleApply, handleEditSelectedOverFlowMenu } from "./DocumentManagementServer.logic"
import "./style.scss"
import { tableDataProps, ViewDownloadItem } from "./responseModel"
import { homeurl, pageSizeNumber } from "../../../public/Constants"
import { CapitalizeFirstLetter } from "../../shared/utils/commonFunctions"
import { viewDownload ,clearAllFiles, deleteFiles, validation} from "./ApiService"
import FilterDialog from "../../shared/components/Filter/Filter"
import NoSelectionDialog from "../../shared/components/NoSelectionDialog/NoSelectionDialog"
import gtmAnalytics from "../../shared/utils/analytics";
 

export const breadcrumbActionsList = (t: (key: string) => string) => [
    {
        active: false,
        linkName: t("DocumentManagementServer.Home"),
        path: window.location.origin
    },
    {
        active: false,
        linkName: t("DocumentManagementServer.adminconsole"),
        path: homeurl
    },
    {
        active: false,
        linkName: t("DocumentManagementServer.headingText"),
        path: ''
    }
]
 
const DocumentManagementServerView: () => JSX.Element = () => {
    const { t }: UseTranslationResponse<"translation", undefined> =
        useTranslation();
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
    const [isFilterDialogOpen, setIsFilterDialogOpen] = useState<boolean>(false);
    const [selectedCategories, setSelectedCategories] = useState<ISelectedItem[]>([]);
    const [selectedFormats, setSelectedFormats] = useState<ISelectedItem[]>([]);
    const [showErrorBanner, setShowErrorBanner] = useState<boolean>(false);
    const [sortBy, setSortBy] = useState<string>("DateAdded");
    const [sortDirection, setSortDirection] = useState<string>("Desc");
    const [visibleBreadcrumbs, setVisibleBreadcrumbs] =useState(breadcrumbActionsList(t));
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
    const [prevSelectedDocs, setPrevSelectedDocs] = useState<string[]>([]);
    const [isHeaderBoxChecked, setIsHeaderBoxChecked] = useState<boolean>(false);
    const [viewData, setViewData] = useState<ViewDownloadItem[]>([]);
    const [sidePanelOpenReason, setSidePanelOpenReason] = useState<"prepare" | "view" | null>(null);
    const [prepareDownloadError, setPrepareDownloadError] = useState(false);
    const [PrepareDownloadAbortBanner, setPrepareDownloadAbortBanner] = useState(false);
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
    const [selectedEntities, setSelectedEntities] = useState<any[]>([]);
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

        const messages = [];

    if (restrictedFileCount > 0) {
        messages.push(
            restrictedFileCount === 1
                ? t("DocumentManagementServer.documentCannotBeDeletedNotification", { count: restrictedFileCount })
                : t("DocumentManagementServer.documentsCannotBeDeletedNotification", {
                    all: restrictedFileCount === docData?.totalRecords ? "All " : "",
                    count: restrictedFileCount
                })
        );

    }

    if (alreadyDeletedFileCount > 0) {
        messages.push(
            alreadyDeletedFileCount === 1
                ? t("DocumentManagementServer.documentAlreadyDeletedMsg", { count: alreadyDeletedFileCount })
                : t("DocumentManagementServer.documentsAlreadyDeletedMsg", {
                    all: alreadyDeletedFileCount === docData?.totalRecords ? t("DocumentManagementServer.All") : "",
                    count: alreadyDeletedFileCount
                })
        );
    }
    const contentText = <div style={{ whiteSpace: "pre-line" }}>{messages.join("\n")}</div>;

    
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

      fetchCategory(null).then((res) => {
        const map: Record<string, number> = {};
        res.forEach((cat: any) => {
        map[cat.application] = cat.registrationId;
        });
    });
    }, []);


    useEffect(() => {
        const allRegistrationId = getAllRegistrationIds(selectedFormats);
 
        if (!isFilterDialogOpen && isSearchTriggered && searchText) {
            setIsInitialLoad(true);
            fetchGetDocumentDetails(currentPage, allRegistrationId, sortBy, sortDirection, searchRefExternalId, documentRealatedTo);
 
            setIsInitialLoad(false);
        }
        if (!isFilterDialogOpen && isSearchTriggered && !searchText) {
            fetchGetDocumentDetails(currentPage, allRegistrationIds, sortBy, sortDirection, searchRefExternalId, documentRealatedTo);
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
        setIsViewDownloadError,
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
        setIsViewDownloadError,
      
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
 


const onEditSelectedOverFlowMenu = (e: React.SyntheticEvent, selectedItem: ISelectedItem) => {
  handleEditSelectedOverFlowMenu({
    e,
    selectedItem,
    totalSelectedCount,
    setShowDialog,
    setShowConfirmDialog,
    setShowRestrictedDeleteDialog,
    setShowRestrictedPrepareDialog,
    setIsPreDialogLoading,
    isHeaderBoxChecked,
    allSelectedDocs,
    buildValidationPayload,
    allRegistrationIds,
    dateRange,
    searchRefExternalId,
    documentRealatedTo,
    validation,
    setRestrictedFileCount,
    setAlreadyDeletedFileCount,
    setAvailableFileCount,
    setDialogType,
    setIsDialogLoading,
    setSidePanelOpenReason,
    setIsSidePanelOpen,
    setAvailableFileIds
  });
};
 
    const getEmptyStateMsg = () => {
  if (showErrorBanner) return t("DocumentManagementServer.informationUnavailable");
  if (issearchDataLoading || isSearchLoading) return undefined;

  // Initial state: no search yet
  if (!isSearchTriggered && !searchText) {
    return "Use the search bar to search pupil, staff or organisation.";
  }

  // After search, no results
//   if (
//     isSearchTriggered &&
//     docData &&
//     docData?.statusCode === 200 &&
//     Array.isArray(docData?.data) &&
//     docData?.data.length === 0
//   ) {
//     return "No data to display.";
//   }

  if (!isSearchTriggered && showSearchError) return t("DocumentManagementServer.informationUnavailable");
  return t("DocumentManagementServer.documentsAppearAfterUploadMsg");
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
                    setVisibleBreadcrumbs(breadcrumbActionsList(t).slice(-1));
                } else {
                    setVisibleBreadcrumbs(breadcrumbActionsList(t));
                }
            } else {
                setVisibleBreadcrumbs(breadcrumbActionsList(t));
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
            message: t("DocumentManagementServer.technicalIssueMessage"),
            autoclose: true
        },
        {
            isShow: showDeleteErrorBanner,
            variant: "warning",
            title: t("DocumentManagementServer.unableToDelete"),
            message:
           t("DocumentManagementServer.unableToDeleteDocumentMsg", {
            type: availableFileCount === 1 ? "document" : "documents"
            }),
            autoclose: false,
            onClickClose: () => setShowDeleteErrorBanner(false)
    },
    {
            isShow: showDeleteAbortBanner,
            variant: "warning",
            title: `Unable to delete [document/documents]`,
            message:
            `This document cannot be deleted as it is currently being prepared for download. Please try again later.`,
            autoclose: true,
            onClickClose: () => setShowDeleteAbortBanner(false)
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

    const resultNotFoundMSG = getResultNotFoundMsg(t,searchText, docData, searchTerm, showErrorBanner, isSearchTriggered);
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
            setShowDeleteAbortBanner,
            fetchGetDocumentDetails,
            deleteFiles,
            excludedCheckBoxIds,
            isHeaderBoxChecked,
            availableFileIds
        });

const handleApplyWrapper = (referenceExternalIds: string[], categories?: ISelectedItem[], selectedEntity?: any[]) => {
  handleApply({
    referenceExternalIds,
    categories,
    selectedCategories,
    selectedDateRange,
    isDateError,
    selectedEntity,
    setIsDateError,
    setIsFilterLoading,
    setDateRange,
    setSelectedFormats,
    setIsFilterDialogOpen,
    setCurrentPage,
    setExcludedCheckBoxIds,
    setAllSelectedDocs,
    setSearchInput,
    setSearchTerm,
    setSearchText,
    setTableKey,
    setIsSearchTriggered,
    setSelectedCategories,
    setSearchRefExternalId,
    setIsHeaderBoxChecked,
    setSelectedCheckBoxIds,
    setPrevSelectedDocs,
    setSelectedEntities
  });
};

let dialogConfig;

switch (dialogType) {
  case "clearAll":
    dialogConfig = {
    cancelText: t("DocumentManagementServer.keepAll"),
    contentText: t("DocumentManagementServer.clearAllDescription"),
      isNotificationanner: false,
      notificationTitle: "",
      notificationStatus: NotificationStatus.WARNING,
      okText: t("DocumentManagementServer.ClearAll"),
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
          setIsViewDownloadError
        });
      },
      template: DialogTemplate.Confirmation,
    };
    break;

  case "delete":
    dialogConfig = {
      cancelText: t("DocumentManagementServer.keepIt"),
      okText: t("DocumentManagementServer.Delete"),
      contentText,
      isNotificationanner: true,
      notificationTitle: availableFileCount === 1
        ? t("DocumentManagementServer.documentWillBeGoneForever", { count: availableFileCount })
        : t("DocumentManagementServer.documentsWillBeGoneForever", {
            all: availableFileCount === docData?.totalRecords ? t("DocumentManagementServer.All") : "",
            count: availableFileCount
            }),
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
      cancelText: t("DocumentManagementServer.Cancel"),
      contentText: (() => {
          if (alreadyDeletedFileCount > 0) {
              return alreadyDeletedFileCount === 1
                  ? t("DocumentManagementServer.documentCannotBeDownloaded", { count: alreadyDeletedFileCount })
                  : t("DocumentManagementServer.documentsCannotBeDownloaded", { count: alreadyDeletedFileCount });
          }
          if (docData?.totalRecords !== (alreadyDeletedFileCount + restrictedFileCount + availableFileCount + excludedCheckBoxIds?.length) && isHeaderBoxChecked) {
              const deletedCount = (docData?.totalRecords > (alreadyDeletedFileCount + restrictedFileCount + availableFileCount + excludedCheckBoxIds?.length) && isHeaderBoxChecked) ? (docData?.totalRecords - (alreadyDeletedFileCount + restrictedFileCount + availableFileCount + excludedCheckBoxIds?.length)) : alreadyDeletedFileCount;
              if (deletedCount === 1) {
                  return t("DocumentManagementServer.documentCannotBeDownloaded", { count: deletedCount });
              }
              if (deletedCount > 1) {
                  return t("DocumentManagementServer.documentsCannotBeDownloaded", { count: deletedCount });
              }
              return "";
          }
          return "";
        })(),
      isNotificationanner: true,
            notificationTitle:
                availableFileCount === 1
                    ? t("DocumentManagementServer.prepareSingleDocument", { count: availableFileCount })
                    : t("DocumentManagementServer.prepareMultipleDocuments", { all: availableFileCount === docData?.totalRecords ? t("DocumentManagementServer.All") : "", count: availableFileCount }),
      notificationStatus: NotificationStatus.WARNING,
      okText: t("DocumentManagementServer.PrepareDownload"),
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
            setIsHeaderBoxChecked(false);
            setPrevSelectedDocs([]);
            setExcludedCheckBoxIds([]);
        }
      },
      onConfirm: (): void => {
        setPrepareDownloadError(false);
        setPrepareDownloadAbortBanner(false);
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
          isHeaderBoxChecked,
          allSelectedDocs,
          dateRange,
          selectedEntities,
          availableFileIds
        );

        prepareDownload(selectedDocs)
          .then((statuses) => {
             gtmAnalytics.pushEvent({
                event: "key_action",
                actionType: "prepare_download"
            });
            if (statuses.some((status: number) => status !== 204 && status !== 409)) {
              setPrepareDownloadError(true);
              gtmAnalytics.pushEvent({
                event: "error_message",
                actionType: "Unable to prepare for download"
            });
            }else if (statuses.some((status: number) => status === 409)) {
              setPrepareDownloadAbortBanner(true);
              gtmAnalytics.pushEvent({
                event: "error_message",
                actionType: "Unable to prepare for download"
            });
            } else if (totalSelectedCount > 1) {
              setShowEmailNotification(true);
            }            
            
          })
          .catch(() => {
            setIsSidePanelLoader(false);
            setPrepareDownloadError(true);
            gtmAnalytics.pushEvent({
                event: "error_message",
                actionType: "Unable to prepare for download"
            });
          });
      },
      template: DialogTemplate.Confirmation,
    };
}


    const handleFilterOnClick = () => {
        setIsFilterDialogOpen(true);
        setSelectedDateRange({ fromDate: dateRange?.fromDate || "", toDate: dateRange?.toDate || "" });
        setTagListArray(tagListArray)
    };

    useEffect(() => {
    if (viewData && viewData.length > 0) {
        const cancelledFiles = viewData.filter(item => item.status?.toLowerCase() === 'cancel');
        if (cancelledFiles.length > 0) {
        setFailedFileName(cancelledFiles.map(file => file.name).filter(Boolean) as string[]);
        }
    }
    }, [viewData]);


    useEffect(() => {
        gtmAnalytics.pushPageViewEvent();
    }, []);

    useEffect(() => {
        if (!isInitialLoad && sortBy) {
            gtmAnalytics.pushEvent({
                event: "interact_click",
                elementType: "sort",
                elementTextOrLabel: sortBy?.toLowerCase() === "dateadded" ? "Date added" : sortBy,
                elementLocation: "body"
            });
        }
    }, [sortBy, isInitialLoad]);

    const handleCloseSidePanel = () => {
        closeSidePanel(setIsSidePanelOpen, downloadPollingIntervalRef);
    };

   const handleOnChangeAllCheckBox = (e: any) => {
        const isChecked = e.target.checked;
        setIsHeaderBoxChecked(isChecked);
        if (!isChecked) {
            setSelectedCheckBoxIds([]);
                    setExcludedCheckBoxIds([]);

        }
        setPrevSelectedDocs([])
        setAllSelectedDocs([]);

    }
    
    const handleOnChangeCheckBox = (index: number, id: string) => {
        const isAlreadySelectedIds = selectedCheckBoxIds?.includes(id);
        if (isAlreadySelectedIds) {
            setSelectedCheckBoxIds(selectedCheckBoxIds?.filter(exId => exId !== id));
        } else {
            setSelectedCheckBoxIds([...selectedCheckBoxIds, id]);
        }

    const doc = docData?.data?.find((d: any) => d.fileId === id);

    setSelectedCheckBoxIds((prevSelectedIds) => {
        const updatedCheckBoxIds = [...prevSelectedIds];
        if (updatedCheckBoxIds?.includes(id)) {
            return updatedCheckBoxIds?.filter((selectedId) => selectedId !== id);
        }
        return [...updatedCheckBoxIds, id];
    });

    setAllSelectedDocs((prevDocs) => {
        if (doc) {
            const isAlreadySelected = prevDocs?.some((item) => item.fileId === id);
            if (isAlreadySelected) {
                
                return prevDocs?.filter((item) => item.fileId !== id);
            }
            return [
                ...prevDocs,
                {
                    fileId: id,
                    registrationId: Number(doc.registrationId),
                    externalId: doc.externalId,
                }
            ];
        }
        return prevDocs;
    });
};

const getDialogTitle = () => {
    if (restrictedFileCount > 0) {
        return restrictedFileCount === 1
            ? t("DocumentManagementServer.documentCannotBeDeleted", { count: restrictedFileCount })
            : t("DocumentManagementServer.documentsCannotBeDeleted", { count: restrictedFileCount });
    }

    if (alreadyDeletedFileCount > 0) {
        return alreadyDeletedFileCount === 1
            ? t("DocumentManagementServer.documentAlreadyDeleted", { count: alreadyDeletedFileCount })
            : t("DocumentManagementServer.documentsAlreadyDeleted", { count: alreadyDeletedFileCount });
    }

    return "";
};
    const renderViewDownloadContent = () => {
          if (isViewDownloadError) {
    return (
      <Notification
        status={NotificationStatus.WARNING}
        title={t("DocumentManagementServer.informationUnavailable")}
        message={t("DocumentManagementServer.technicalIssueMessage")}
        autoclose={false}
      />
    );
  }
    if (isSidePanelLoader) {
        return <Loader loaderType={LoaderType.Circular} />;
    }
    if (hasFetchedViewDownload && viewData?.length === 0 ) {
        return <p>{t("DocumentManagementServer.downloadsAppearHere")}</p>;
    }
    if (viewData?.length > 0) {
        return (
        <>
            <p>{t("DocumentManagementServer.preparedDownloadsExpireMsg")}</p>
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
                                   item.blobName
                               );
                               gtmAnalytics.pushEvent({
                                   event: "file_download",
                                   fileExtension: item?.name?.split('.').pop() || "",
                                   fileName: "[DownloadFileName]",
                                   linkText: "Download",
                                   linkUrl: "[DownloadLinkUrl]"
                               });
                           } catch (error) {
                               setDownloadError(true);
                               gtmAnalytics.pushEvent({
                                   event: "error_message",
                                   actionType: "Unable to download"
                               });
                           }
                       }}
                   >
                       {t("DocumentManagementServer.download")}
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
                {showDialog && 
                <NoSelectionDialog setShowDialog={setShowDialog}
                title={t("DocumentManagementServer.noItemsSelectedTitle")}
                message={t("DocumentManagementServer.noItemsSelectedMessage")} 
                onClose={() => {} }/>}

                {showRestrictedDeleteDialog && (
                    <NoSelectionDialog
                        setShowDialog={setShowRestrictedDeleteDialog}
                        title={getDialogTitle()}
                        notificationTitle={
                            (() => {
                                if (restrictedFileCount > 0) {
                                return restrictedFileCount === 1
                                ? t("DocumentManagementServer.documentCannotBeDeletedNotification")
                                : t("DocumentManagementServer.documentsCannotBeDeletedNotification", {
                                    all: restrictedFileCount === docData?.totalRecords ? t("DocumentManagementServer.All") : "",
                                    count: restrictedFileCount
                                    });
                                }
                                if (alreadyDeletedFileCount > 0) {
                                    if (alreadyDeletedFileCount === totalSelectedCount && totalSelectedCount > 1) {
                                        return t("DocumentManagementServer.allSelectedDocumentsAlreadyDeleted");
                                    }
                                return alreadyDeletedFileCount === 1
                                    ? t("DocumentManagementServer.documentAlreadyDeletedMsg", { count: alreadyDeletedFileCount })
                                    : t("DocumentManagementServer.documentsAlreadyDeletedMsg", { all: alreadyDeletedFileCount === docData?.totalRecords ? t("DocumentManagementServer.All") : "", count: alreadyDeletedFileCount });
                                }
                                return "";
                            })()
                            }
                        message={
                            (() => {
                                if (restrictedFileCount > 0 && alreadyDeletedFileCount > 0) {
                                return `${alreadyDeletedFileCount === docData?.totalRecords && alreadyDeletedFileCount !== 1 ? 'All ' : ''} ${alreadyDeletedFileCount} file${alreadyDeletedFileCount !== 1 ? "s" : ""} are already deleted.`;
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
                            ? t("DocumentManagementServer.documentCannotBeDownloadedMsg", { count: alreadyDeletedFileCount })
                            : t("DocumentManagementServer.documentsCannotBeDownloadedMsg", { all: alreadyDeletedFileCount === docData?.totalRecords ? t("DocumentManagementServer.All") : "", count: alreadyDeletedFileCount })
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
                            <ControlledList
                                key={tableKey}
                                isMobileViewBreadcrumb
                                globalNotificationMsgBannerObject={NotificationMsgBannerObject}
                                isShowHeading
                                isShowSubHeading
                                isSorting={false}
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
                                editSelectedBtnTitle={t("DocumentManagementServer.editSelectedBtnTitle")}
                                editSelectedOptions={[
                                    {
                                        disabled: false,
                                        text: t("DocumentManagementServer.PrepareDownload"),
                                        value: 'Prepare download'
                                    },
                                    {
                                        disabled: false,
                                        text: t("DocumentManagementServer.ViewDownload"),
                                        value: 'View download'
                                    },
                                    ...(hasDMSDeletePermissions
                                        ? [{
                                            disabled: false,
                                            isSelected: false,
                                            isShowDivider: true,
                                            text: t("DocumentManagementServer.Delete"),
                                            value: 'Delete'
                                        }]
                                        : [])
                                ]}
                                onEditSelectedOverFlowMenu={onEditSelectedOverFlowMenu}
                                onEditSelectedBtnClick={() => {}}
                                handleCloseDialogConfirmation={() => setShowConfirmDialog(false)}
                                isClearSelectedCheckbox={isClearSelectedCheckbox}
                                isAllSelectedAcrossPagination={true}
                                totalRecords={docData?.totalRecords || 0}
                                selectedCheckboxIds={(ids: string[]) => {
                                    setSelectedCheckBoxIds(ids);
                                }}
                                prevselectedCheckboxIds={(ids: string[]) => {
                                    const uniqueNewIds = ids.filter(id => !prevSelectedDocs.includes(id));
                                    setPrevSelectedDocs([...prevSelectedDocs, ...uniqueNewIds]);
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
                                        action: 'Our team is attempting to fix the issue. Please wait for a few minutes and try again',
                                        iconName: 'information',
                                        id: '1',
                                        title: 'Try again after a while'
                                    },
                                    {
                                        action: 'Click here to go back to home page',
                                        iconName: 'home',
                                        id: '2',
                                        showActionAs: ShowActionAs.Link,
                                        title: 'Go back to home page'
                                    }
                                ]}
                                errorPageActionListDescription="Things to try"
                                errorPageReasonListDescription="Sorry, We are having trouble connecting."
                                errorPageTitle="Service Unavailable"
                                errorReasonListItem={[
                                    {
                                        id: '1',
                                        reason: 'One of our servers could be down'
                                    },
                                    {
                                        id: '2',
                                        reason: 'Our service could have been disrupted by unforeseen interruptions'
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
                                searchHeadingText={t("DocumentManagementServer.searchHeadingText")}
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
                                    setTagListArray([]);
                                    setSelectedCategories([]);
                                    setDateRange({ fromDate: "", toDate: "" });
                                    setSelectedCheckBoxIds([]);
                                    setAllSelectedDocs([]);
                                    setIsClearSelectedCheckbox(true);
                                    setIsHeaderBoxChecked(false);
                                    setExcludedCheckBoxIds([]);
                                    setTableKey(prev => prev + 1);
                                    handleSuggestionClick(item, setSearchTerm, setSearchText, setDocumentRelatedTo, setSearchRefExternalId)
                                    setIsSearchTriggered(true);
                                    setSelectedFormats([]);
                                    setSelectedCategories([]);
                                    setSelectedRelatedTo(undefined);
                                   if (item) {
                                     setSelectedEntities([item]);
                                   }
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
                                secondaryButtonTitle={hasCompletedFiles ? t("DocumentManagementServer.ClearAll") : t("DocumentManagementServer.Close")}
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
                                                title={t("DocumentManagementServer.prepareDownloadErrorTitle", { type: availableFileCount === 1 ? "document" : "documents" })}
                                                message={t("DocumentManagementServer.prepareDownloadErrorMessage", { type: availableFileCount === 1 ? "document" : "documents" })}
                                                autoclose
                                                onClickClose={() => setPrepareDownloadError(false)}
                                            />
                                        )}
                                        {PrepareDownloadAbortBanner && (
                                            <Notification
                                                status={NotificationStatus.WARNING}
                                                title="Unable to prepare [document/documents] for download"
                                                message="This document cannot be downloaded as it has been deleted already."
                                                autoclose
                                                onClickClose={() => setPrepareDownloadAbortBanner(false)}
                                            />
                                        )}
                                        {downloadError && (
                                            <Notification
                                                status={NotificationStatus.WARNING}
                                                title={t("DocumentManagementServer.downloadErrorTitle")}
                                                message={t("DocumentManagementServer.downloadErrorMessage")}
                                                autoclose
                                                onClickClose={() => setDownloadError(false)}
                                            />
                                        )}
                                        {showEmailNotification && !isViewDownloadError && (
                                            <Notification
                                                status={NotificationStatus.HIGHLIGHT}
                                                title={t("DocumentManagementServer.emailNotificationTitle")}
                                                message={t("DocumentManagementServer.emailNotificationMessage")}
                                                onClickClose={() => setShowEmailNotification(false)}
                                            />
                                        )}
                                        { failedFileName.length > 0 && (
                                        <Notification
                                            status={NotificationStatus.WARNING}
                                            title={t("DocumentManagementServer.failedDownloadTitle")}
                                            message={t("DocumentManagementServer.failedDownloadMessage", { files: failedFileName.join(", ") })}
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
                                                title={t("DocumentManagementServer.downloadsCleared")}
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
                                                onClick={() => {
                                                    handleFilterOnClick();
                                                }}> {t("Filter.heading")}</Button>

                                            <FilterDialog
                                            isOpen={isFilterDialogOpen}
                                            title={t("Filter.heading")}
                                            isLoading={isFilterLoading}
                                            onClose={() => setIsFilterDialogOpen(false)}
                                            setSelectedCategories={setSelectedCategories}
                                            selectedCategories={selectedCategories}
                                            handleApply={handleApplyWrapper}
                                            isFilterDialogOpen={isFilterDialogOpen}
                                            setIsDateError={setIsDateError}
                                            isDateError={isDateError}
                                            setSelectedDateRange={setSelectedDateRange}
                                            selectedDateRange={selectedDateRange}
                                            setDocumentRelatedTo={setDocumentRelatedTo}
                                            selectedRelatedTo={selectedRelatedTo}
                                            setSelectedRelatedTo={setSelectedRelatedTo}
                                            tagListArray={tagListArray}
                                            setTagListArray={setTagListArray}
                                        />
                                    </>
                                }
                                searchOnClickClose={handleTagClose}
                                tableFirstColumnWidth="10px"
                                tableHeadersData={getTableHeadersData(t)}
                                sortingOnClickEvent={(e, columnName) => handleSorting(columnName)}
                                templatePropsConfirmation={dialogConfig}
                                titleConfirmation={getTitleConfirmation(t,dialogType, availableFileCount, docData?.totalRecords || 0)}
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
