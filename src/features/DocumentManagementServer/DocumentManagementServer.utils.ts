import dayjs from "dayjs";
import { Category } from "./responseModel";
import { Suggestion, ValidationTextLevel } from "@essnextgen/ui-kit";
import { TFunction } from "@essnextgen/ui-intl-kit";
import gtmAnalytics from "../../shared/utils/analytics";
import { homeurl } from "../../../public/Constants";

export function mapRelatedArr(doc: any): any[] {
  let relatedArr: any[] = [];
  if (Array.isArray(doc.relatedTo) && doc.relatedTo.length > 0) {
    if (doc.documentRelatedTo === 1) {
      // Pupils
      relatedArr = doc.relatedTo.map((pupil: any) => ({
        type: "pupil",
        name: `${pupil.preferredForename} ${pupil.preferredSurname}`.trim(),
        year: pupil.currentYearGroup || "",
        reg: pupil.currentPrimaryClass || "",
        referenceExternalId: pupil.learnerExternalId || "",
        isLeaver:pupil?.onRollState || ""
      }));
    } else if (doc.documentRelatedTo === 3) {
      // Staff
      relatedArr = doc.relatedTo.map((staff: any) => ({
        type: "staff",
        name: `${staff.preferredForename} ${staff.preferredSurname}`.trim(),
        staffCode: staff.staffCode || "",
        referenceExternalId: staff.externalId || "",
        isLeaver: staff?.onRollState || ""
      }));
    } else if (doc.documentRelatedTo === 2) {
      // School
      relatedArr = doc.relatedTo.map((school: any) => ({
        type: "school",
        name: school.schoolName || "",
        referenceExternalId: school.organisationId || "",
      }));
    }
  }
  return relatedArr;
}

export function reduceCategories(res: any[]): Category[] {
  return Object.values(
    res?.reduce((acc: any, curr: any) => {
      if (!acc[curr.application]) {
        acc[curr.application] = { application: curr.application, registrationId: [], section: [] };
      }
      acc[curr.application].registrationId.push(curr.registrationId);
      acc[curr.application].section.push(curr.section);
      return acc;
    }, {})
  ) as Category[];
}

export const getAllRegistrationIds = (selectedFormats: any[]): any[] =>
     selectedFormats?.flatMap(item => {
        const regId = item?.data?.categoryId;
        if (Array.isArray(regId)) {
            return regId;
        }
        if (regId) {
            return [regId];
        }
        return [];
    }) || [];

export function getCompletedPartitionKeys(viewData: Array<{ status?: string; partitionKey?: string }>): string[] {
  return viewData
    .filter(item => item.status?.toLowerCase() === 'complete')
    .map(item => item.partitionKey ?? "")
}

export const getVisibleTagsWithSummary = (tags: any[], maxVisible: number = 3) => {
  if (tags.length <= maxVisible) return tags;
  const visibleTags = tags.slice(0, maxVisible);
  const remainingCount = tags.length - maxVisible;
  visibleTags.push({
    text: `+${remainingCount}`,
    categoryName: "Summary",
    closeObj: null
  });
  return visibleTags;
};

export const getCategoryArr = (selectedFormats: any[]) =>
  selectedFormats?.map((cat: any) => ({
    text: cat?.text,
    categoryName: cat?.value,
    closeObj: {
      name: cat?.text,
      id: cat?.data?.categoryId,
    },
  })) || [];

  
   export const getDateTag = (dateRange: { fromDate: string; toDate: string }) => {
   if (!dateRange.fromDate && !dateRange.toDate) return [];
  
   let text = "";
   if (dateRange.fromDate && dateRange.toDate) {
     text = `${dayjs(dateRange.fromDate).format("DD MMM YYYY")} to ${dayjs(dateRange.toDate).format("DD MMM YYYY")}`;
   } else if (dateRange.fromDate) {
     text = `${dayjs(dateRange.fromDate).format("DD MMM YYYY")} to -`;
   } else if (dateRange.toDate) {
     text = `- to ${dayjs(dateRange.toDate).format("DD MMM YYYY")}`;
   }
  
   return [
     {
       text,
       categoryName: "Date",
       closeObj: { name: "Date", id: "dateRange" },
     }
   ];
 };
  

 export const getResultNotFoundMsg = (
   t:any,
   searchText: string,
   docData: any,
   searchTerm: string,
   showErrorBanner: boolean,
   isSearchTriggered: boolean,
   showSearchError: boolean
 ): string | undefined => {
   if (showSearchError || showErrorBanner) {
     return "Information unavailable.";
   }
   // Show "No data to display" only if searching and no data
   if ((searchText || isSearchTriggered ) && docData?.statusCode === 200 && Array.isArray(docData?.data) && docData?.data.length === 0) {
     return t("DocumentManagementServer.noDataToDisplay");
   }
   if (!isSearchTriggered && !searchText) {
     return t("DocumentManagementServer.searchBarText");
   }
   return undefined;
 };
  
export const filterNonEmptySuggestions = (suggestions: Suggestion[]) =>
  suggestions.filter(s => s?.values.length > 0);

// Has items check
export const hasItems = (suggestions: Suggestion[]): boolean =>
  suggestions?.some(({ values }) => values?.length > 0);

export function applySummaryTagClass() {
  document.querySelectorAll('#taglist-id .search-tagList').forEach(tag => {
    const span = tag.querySelector('.essui-tag span');
    if (span && span.textContent && span.textContent.trim().startsWith('+')) {
      tag.classList.add('summary-tag');
    } else {
      tag.classList.remove('summary-tag');
    }
  });
}


export function getValidationState(
  searchSelectionError: string,
  showSearchError: boolean,
  t: (key: string) => string
) {
  let validationText = "";
  if (searchSelectionError) {
    validationText = searchSelectionError;
  } else if (showSearchError) {
    validationText = t("Filter.informationUnavailable");
  }

  let validationTextLevel: ValidationTextLevel | undefined;
  if (searchSelectionError) {
    validationTextLevel = ValidationTextLevel.Error;
  } else if (showSearchError) {
    validationTextLevel = ValidationTextLevel.Warning;
  } else {
    validationTextLevel = undefined;
  }

  return { validationText, validationTextLevel };
}

export function debounce<T extends (...args: any[]) => void>(func: T, wait: number) {
  let timeout: ReturnType<typeof setTimeout>;
  return function (this: any, ...args: Parameters<T>) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}
 

export const getDialogTitle = (restrictedFileCount: number, alreadyDeletedFileCount: number, availableFileCount: number, totalSelectedCount: number, isHeaderBoxChecked: boolean, t: TFunction<"translation", undefined>) => {
  if (restrictedFileCount > 0) {
    return restrictedFileCount === 1
      ? t("DocumentManagementServer.documentCannotBeDeleted")
      : t("DocumentManagementServer.documentsCannotBeDeleted");
  }

  if (
    alreadyDeletedFileCount > 0 ||
    (totalSelectedCount !==
      alreadyDeletedFileCount + restrictedFileCount + availableFileCount &&
      isHeaderBoxChecked)
  ) {
    const deletedCount =
      totalSelectedCount >
        alreadyDeletedFileCount + restrictedFileCount + availableFileCount &&
      isHeaderBoxChecked
        ? totalSelectedCount -
          (alreadyDeletedFileCount + restrictedFileCount + availableFileCount)
        : alreadyDeletedFileCount;
    return (alreadyDeletedFileCount === 1 && availableFileCount > 0) ||
      deletedCount === 1
      ? t("DocumentManagementServer.documentAlreadyDeleted")
      : t("DocumentManagementServer.documentsAlreadyDeleted");
  }

  return "";
};


  export const getEmptyStateMsg = (showErrorBanner: boolean, searchText: string, isSearchTriggered: boolean, showSearchError: boolean, issearchDataLoading: boolean, isSearchLoading: boolean, t: TFunction<"translation", undefined>) => {
        if (showErrorBanner ||  ((searchText || !isSearchTriggered) && showSearchError)) return t("DocumentManagementServer.informationUnavailable");
        if (issearchDataLoading || isSearchLoading) return undefined;

        // Initial state: no search yet
        if (!isSearchTriggered && !searchText) {
            return "Use the search bar to search pupil, staff or organisation.";
        }

        return t("DocumentManagementServer.documentsAppearAfterUploadMsg");
    };

  export const handleSorting = (columnName: string, sortBy: string, setSortBy: React.Dispatch<React.SetStateAction<string>>, sortDirection: string, setSortDirection: React.Dispatch<React.SetStateAction<string>>, t: TFunction<"translation", undefined>) => {
            let apiColumnName = columnName;
            switch (columnName) {
                case t("DocumentManagementServer.dateAddedColumn"):
                    apiColumnName = "DateAdded";
                    break;
                case t("DocumentManagementServer.documentColumn"):
                    apiColumnName = "Document";
                    break;
                case t("DocumentManagementServer.formatColumn"):
                    apiColumnName = "Format";
                    break;
                case t("DocumentManagementServer.sizeColumn"):
                    apiColumnName = "Size";
                    break;
                case t("DocumentManagementServer.categoryColumn"):
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
    
            gtmAnalytics.pushEvent({
                event: "interact_click",
                elementType: "sort",
                elementTextOrLabel: apiColumnName?.toLowerCase() === "dateadded" ? "Date added" : apiColumnName,
                elementLocation: "body"
            });
        };

  export const handleOnChangeAllCheckBox = (e: any, setIsHeaderBoxChecked: React.Dispatch<React.SetStateAction<boolean>>, setSelectedCheckBoxIds: React.Dispatch<React.SetStateAction<string[]>>, setExcludedCheckBoxIds: React.Dispatch<React.SetStateAction<string[]>>, setPrevSelectedDocs: React.Dispatch<React.SetStateAction<string[]>>, setAllSelectedDocs: React.Dispatch<React.SetStateAction<{ fileId: string; registrationId: number; externalId: string;}[]>>) => {
        const isChecked = e.target.checked;
        setIsHeaderBoxChecked(isChecked);
        if (!isChecked) {
            setSelectedCheckBoxIds([]);
            setExcludedCheckBoxIds([]);

        }
        setPrevSelectedDocs([])
        setAllSelectedDocs([]);

    }

   export const handleOnChangeCheckBox = (index: number, id: string, docData: any, selectedCheckBoxIds: string[], setSelectedCheckBoxIds: React.Dispatch<React.SetStateAction<string[]>>, setAllSelectedDocs: React.Dispatch<React.SetStateAction<{ fileId: string; registrationId: number; externalId: string; }[]>>) => {
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



    import { DialogTemplate, NotificationStatus } from "@essnextgen/ui-kit";

export function getDialogConfig({
  dialogType,
  t,
  availableFileCount,
  docData,
  isHeaderBoxChecked,
  setShowConfirmDialog,
  setClearAllError,
  handleClearAllConfirm,
  viewData,
  clearAllFiles,
  setShowToastNotification,
  fetchViewDownloadData,
  setViewData,
  setHasFetchedViewDownload,
  viewDownload,
  downloadPollingIntervalRef,
  getCompletedPartitionKeys,
  setIsViewDownloadError,
  setShowEmailNotification,
  contentText,
  alreadyDeletedFileCount,
  currentPage,
  getAllRegistrationIds,
  selectedFormats,
  sortBy,
  sortDirection,
  searchRefExternalId,
  documentRelatedTo,
  setSelectedCheckBoxIds,
  setAllSelectedDocs,
  setIsClearSelectedCheckbox,
  setIsHeaderBoxChecked,
  setPrevSelectedDocs,
  setExcludedCheckBoxIds,
  setTableKey,
  setIsDialogLoading,
  setIsGlobalLoaderModel,
  handleBulkDelete,
  setPrepareDownloadError,
  setPrepareDownloadAbortBanner,
  setIsSidePanelLoader,
  setSidePanelOpenReason,
  setIsSidePanelOpen,
  buildSelectedDocs,
  selectedCheckBoxIds,
  allSelectedDocs,
  dateRange,
  selectedEntities,
  prepareDownload,
  totalSelectedCount,
  restrictedFileCount,
  excludedCheckBoxIds,
  availableFileIds,
  ...rest
}: any) {
  switch (dialogType) {
    case "clearAll":
      return {
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
            setIsViewDownloadError,
            setShowEmailNotification
          });
        },
        template: DialogTemplate.Confirmation,
      };

    case "delete":
      return {
        cancelText: t("DocumentManagementServer.keepIt"),
        okText: t("DocumentManagementServer.Delete"),
        contentText,
        isNotificationanner: true,
        notificationTitle: availableFileCount === 1
          ? t("DocumentManagementServer.documentWillBeGoneForever", { count: availableFileCount })
          : t("DocumentManagementServer.documentsWillBeGoneForever", {
            all: availableFileCount === docData?.totalRecords || (totalSelectedCount > 0 && availableFileCount === 0 && alreadyDeletedFileCount === 0 && restrictedFileCount === 0) ? t("DocumentManagementServer.All") : "",
            count: (totalSelectedCount > 0 && availableFileCount === 0 && alreadyDeletedFileCount === 0 && restrictedFileCount === 0) ? totalSelectedCount : availableFileCount
          }),
        notificationStatus: NotificationStatus.WARNING,
        onCancel: (): void => {
          setShowConfirmDialog(false);
          if (alreadyDeletedFileCount > 0) {
            rest.fetchGetDocumentDetails(
              currentPage,
              getAllRegistrationIds(selectedFormats),
              sortBy,
              sortDirection,
              searchRefExternalId,
              documentRelatedTo
            );
            setSelectedCheckBoxIds([]);
            setAllSelectedDocs([]);
            setIsClearSelectedCheckbox(true);
            setIsHeaderBoxChecked(false);
            setPrevSelectedDocs([]);
            setExcludedCheckBoxIds([]);
            setTableKey((prev: number) => prev + 1);
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

    default:
      return {
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
        onCancel: (): void => {
          setShowConfirmDialog(false);
          if (alreadyDeletedFileCount > 0) {
            rest.fetchGetDocumentDetails(
              currentPage,
              getAllRegistrationIds(selectedFormats),
              sortBy,
              sortDirection,
              searchRefExternalId,
              documentRelatedTo
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
            rest.allRegistrationIds,
            searchRefExternalId,
            documentRelatedTo,
            excludedCheckBoxIds,
            isHeaderBoxChecked,
            allSelectedDocs,
            dateRange,
            selectedEntities,
            availableFileIds
          );

          prepareDownload(selectedDocs)
            .then((statuses: number[]) => {
              rest.gtmAnalytics.pushEvent({
                event: "key_action",
                actionType: "prepare_download"
              });
              setPrepareDownloadAbortBanner(false);
              if (statuses.some((status: number) => status !== 204 && status !== 409)) {
                setPrepareDownloadError(true);
                rest.gtmAnalytics.pushEvent({
                  event: "error_message",
                  messageText: "Unable to prepare for download"
                });
              } else if (statuses.some((status: number) => status === 409)) {
                setPrepareDownloadAbortBanner(true);
                rest.gtmAnalytics.pushEvent({
                  event: "error_message",
                  messageText: "Unable to prepare for download"
                });
              } else if (totalSelectedCount > 1) {
                setShowEmailNotification(true);
              }
            })
            .catch(() => {
              setIsSidePanelLoader(false);
              setPrepareDownloadError(true);
              setPrepareDownloadAbortBanner(false);
              rest.gtmAnalytics.pushEvent({
                event: "error_message",
                messageText: "Unable to prepare for download"
              });
            });
        },
        template: DialogTemplate.Confirmation,
      };
  }
}


export function getDeleteDialogMessages({
  t,
  restrictedFileCount,
  availableFileCount,
  docData,
  alreadyDeletedFileCount,
  excludedCheckBoxIds,
  isHeaderBoxChecked
}: {
  t: (key: string, options?: any) => string,
  restrictedFileCount: number,
  availableFileCount: number,
  docData: any,
  alreadyDeletedFileCount: number,
  excludedCheckBoxIds: any[],
  isHeaderBoxChecked: boolean
}) {
  const messages: string[] = [];

  if (restrictedFileCount > 0) {
    messages.push(
      restrictedFileCount === 1 && availableFileCount > 0
        ? t("DocumentManagementServer.singleDocumentCannotBeDeletedNotification", { count: restrictedFileCount })
        : t("DocumentManagementServer.documentsCannotBeDeletedNotification", {
            all: restrictedFileCount === docData?.totalRecords ? "All " : "",
            count: restrictedFileCount
          })
    );
  }

  if (alreadyDeletedFileCount > 0) {
    messages.push(
      alreadyDeletedFileCount === 1
        ? t("DocumentManagementServer.singleDocumentAlreadyDeletedMsg", { count: alreadyDeletedFileCount })
        : t("DocumentManagementServer.documentsAlreadyDeletedMsg", {
            all: alreadyDeletedFileCount === docData?.totalRecords ? t("DocumentManagementServer.All") : "",
            count: alreadyDeletedFileCount
          })
    );
  }

  if (
    docData?.totalRecords !==
      (alreadyDeletedFileCount +
        restrictedFileCount +
        availableFileCount +
        (excludedCheckBoxIds?.length || 0)) &&
    isHeaderBoxChecked
  ) {
    const deletedCount =
      docData?.totalRecords >
        alreadyDeletedFileCount +
          restrictedFileCount +
          availableFileCount +
          (excludedCheckBoxIds?.length || 0) && isHeaderBoxChecked
        ? docData?.totalRecords -
          (alreadyDeletedFileCount +
            restrictedFileCount +
            availableFileCount +
            (excludedCheckBoxIds?.length || 0))
        : alreadyDeletedFileCount;
    if (deletedCount === 1) {
      messages.push(
        t("DocumentManagementServer.singleDocumentAlreadyDeletedMsg", { count: deletedCount })
      );
    } else if (deletedCount > 1) {
      messages.push(
        t("DocumentManagementServer.documentsAlreadyDeletedMsg", {
          all:
            alreadyDeletedFileCount === 0 &&
            restrictedFileCount === 0 &&
            availableFileCount === 0
              ? t("DocumentManagementServer.All")
              : "",
          count: deletedCount
        })
      );
    }
  }

  return messages;
}