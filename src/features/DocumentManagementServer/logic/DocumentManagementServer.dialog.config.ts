import React from "react";
import { TFunction } from "@essnextgen/ui-intl-kit";
import { DialogTemplate, NotificationStatus } from "@essnextgen/ui-kit";
import { GetDialogConfigParams, DialogConfig, SelectedDocument } from "../responseModel";
import { getDeleteDialogMessages, getAllRegistrationIds, getCompletedPartitionKeys } from "./DocumentManagementServer.utils";
import gtmAnalytics from "../../../shared/utils/analytics";

export function getDeleteDialogConfig(params: GetDialogConfigParams, t: TFunction<"translation", undefined>): DialogConfig {
  const {
    restrictedFileCount,
    availableFileCount,
    docData,
    alreadyDeletedFileCount,
    excludedCheckBoxIds,
    isHeaderBoxChecked,
    setShowConfirmDialog,
    fetchGetDocumentDetails,
    currentPage,
    selectedFormats,
    sortBy,
    sortDirection,
    referenceExternalId,
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
    totalSelectedCount
  }: GetDialogConfigParams = params;

  const messages: string[] = getDeleteDialogMessages({
    t,
    restrictedFileCount,
    availableFileCount,
    docData,
    alreadyDeletedFileCount,
    excludedCheckBoxIds,
    isHeaderBoxChecked
  });

  return {
    cancelText: t("DocumentManagementServer.keepIt"),
    okText: t("DocumentManagementServer.Delete"),
    contentText: messages.join("\n"),
    isNotificationanner: true,
    notificationTitle: t(
      availableFileCount === 1
        ? "DocumentManagementServer.documentWillBeGoneForever"
        : "DocumentManagementServer.documentsWillBeGoneForever",
      {
        all: availableFileCount === docData?.totalRecords || (totalSelectedCount > 0 && availableFileCount === 0 && alreadyDeletedFileCount === 0 && restrictedFileCount === 0) ? t("DocumentManagementServer.All") : "",
        count: (totalSelectedCount > 0 && availableFileCount === 0 && alreadyDeletedFileCount === 0 && restrictedFileCount === 0) ? totalSelectedCount : availableFileCount
      }
    ),
    notificationStatus: NotificationStatus.WARNING,
    onCancel: () => {
      setShowConfirmDialog(false);
      if (alreadyDeletedFileCount > 0) {
        fetchGetDocumentDetails(
          currentPage,
          getAllRegistrationIds(Array.isArray(selectedFormats) ? selectedFormats : [selectedFormats]),
          sortBy,
          sortDirection,
          referenceExternalId,
          documentRelatedTo
        );
        setSelectedCheckBoxIds([]);
        setAllSelectedDocs([]);
        setIsClearSelectedCheckbox(true);
        setIsHeaderBoxChecked(false);
        setPrevSelectedDocs([]);
        setExcludedCheckBoxIds([]);
        setTableKey((v: number) => v + 1);
      }
    },
    onConfirm: async () => {
      setIsDialogLoading(true);
      setIsGlobalLoaderModel(true);
      await handleBulkDelete();
      setIsDialogLoading(false);
      setShowConfirmDialog(false);
      setSelectedCheckBoxIds([]);
      setAllSelectedDocs([]);
      setIsClearSelectedCheckbox(true);
    },
    template: DialogTemplate.Confirmation
  };
}

export const getDownloadDialogContentText = (
  alreadyDeletedFileCount: number,
  restrictedFileCount: number,
  availableFileCount: number,
  excludedCheckBoxIds: any[],
  docData: any,
  isHeaderBoxChecked: boolean,
  t: TFunction
): string => {

  if (alreadyDeletedFileCount > 0) {
    return alreadyDeletedFileCount === 1
      ? t("DocumentManagementServer.documentCannotBeDownloaded", { count: alreadyDeletedFileCount })
      : t("DocumentManagementServer.documentsCannotBeDownloaded", { count: alreadyDeletedFileCount });
  }

  const totalRecords: number = docData?.totalRecords ?? 0;

  const sum =
    alreadyDeletedFileCount +
    restrictedFileCount +
    availableFileCount +
    (excludedCheckBoxIds?.length || 0);

  if (totalRecords !== sum && isHeaderBoxChecked) {

    const deletedCount = totalRecords - sum;

    if (deletedCount > 0) {
      return deletedCount === 1
        ? t("DocumentManagementServer.documentCannotBeDownloaded", { count: deletedCount })
        : t("DocumentManagementServer.documentsCannotBeDownloaded", { count: deletedCount });
    }
  }

  return "";
};

export const handleDownloadCancel: (params: GetDialogConfigParams) => void = (
  params: GetDialogConfigParams
) => {

  params.setShowConfirmDialog(false);

  if (params.alreadyDeletedFileCount > 0) {

    params.fetchGetDocumentDetails(
      params.currentPage,
      getAllRegistrationIds(params.selectedFormats),
      params.sortBy,
      params.sortDirection,
      params.referenceExternalId,
      params.documentRelatedTo
    );

    params.setSelectedCheckBoxIds([]);
    params.setAllSelectedDocs([]);
    params.setIsClearSelectedCheckbox(true);
    params.setIsHeaderBoxChecked(false);
    params.setPrevSelectedDocs([]);
    params.setExcludedCheckBoxIds([]);
  }
};

export const handleDownloadConfirm: (params: GetDialogConfigParams) => Promise<void> = async (
  params: GetDialogConfigParams
) => {

  params.setPrepareDownloadError(false);
  params.setPrepareDownloadAbortBanner(false);
  params.setIsSidePanelLoader(true);
  params.setSidePanelOpenReason("prepare");
  params.setIsSidePanelOpen(true);

  const selectedDocs: SelectedDocument[] = params.buildSelectedDocs(
    params.selectedCheckBoxIds,
    params.docData,
    params.allRegistrationIds,
    params.searchRefExternalId,
    params.documentRelatedTo,
    params.excludedCheckBoxIds,
    params.isHeaderBoxChecked,
    params.allSelectedDocs,
    params.dateRange,
    params.selectedEntities,
    params.availableFileIds
  );

  try {

    const statuses: number[] = await params.prepareDownload(selectedDocs);

    if (statuses.some((s: number) => s !== 204 && s !== 409)) {
      params.setPrepareDownloadError(true);
    }
    else if (statuses.some((s: number) => s === 409)) {
      params.setPrepareDownloadAbortBanner(true);
    }
    else if (params.totalSelectedCount > 1) {
      params.setShowEmailNotification(true);
    }

  } catch {

    params.setIsSidePanelLoader(false);
    params.setPrepareDownloadError(true);
    params.setPrepareDownloadAbortBanner(false);
  }
};

export function getDefaultDialogConfig(
  params: GetDialogConfigParams,
  t: TFunction<"translation", undefined>
): DialogConfig {

  return {
    cancelText: t("DocumentManagementServer.Cancel"),

    contentText: getDownloadDialogContentText(
      params.alreadyDeletedFileCount,
      params.restrictedFileCount,
      params.availableFileCount,
      params.excludedCheckBoxIds,
      params.docData,
      params.isHeaderBoxChecked,
      t
    ),

    isNotificationanner: true,

    notificationTitle:
      params.availableFileCount === 1
        ? t("DocumentManagementServer.prepareSingleDocument", { count: params.availableFileCount })
        : t("DocumentManagementServer.prepareMultipleDocuments", {
            all:
              params.availableFileCount === params.docData?.totalRecords
                ? t("DocumentManagementServer.All")
                : "",
            count: params.availableFileCount
          }),

    notificationStatus: NotificationStatus.WARNING,

    okText: t("DocumentManagementServer.PrepareDownload"),

    onCancel: () => handleDownloadCancel(params),

    onConfirm: () => handleDownloadConfirm(params),

    template: DialogTemplate.Confirmation
  };
}

export function getDialogConfig(params: GetDialogConfigParams): DialogConfig | null {
  if (!params.dialogType) return null;
  const t: (key: string, options?: Record<string, any>) => string = params.t as unknown as (key: string, options?: Record<string, any>) => string;

  switch (params.dialogType) {
    case "clearAll":
      return {
        cancelText: t("DocumentManagementServer.keepAll"),
        okText: t("DocumentManagementServer.ClearAll"),
        contentText: t("DocumentManagementServer.clearAllDescription"),
        isNotificationanner: false,
        notificationTitle: "",
        notificationStatus: NotificationStatus.WARNING,
        onCancel: () => params.setShowConfirmDialog(false),
        onConfirm: async () => {
          params.setClearAllError(false);
          await params.handleClearAllConfirm({
            viewData: params.viewData,
            clearAllFiles: params.clearAllFiles,
            setShowToastNotification: params.setShowToastNotification,
            fetchViewDownloadData: params.fetchViewDownloadData,
            setViewData: params.setViewData,
            setHasFetchedViewDownload: params.setHasFetchedViewDownload,
            viewDownload: params.viewDownload,
            downloadPollingIntervalRef: params.downloadPollingIntervalRef,
            setClearAllError: params.setClearAllError,
            setShowConfirmDialog: params.setShowConfirmDialog,
            getCompletedPartitionKeys,
            setIsViewDownloadError: params.setIsViewDownloadError,
            setShowEmailNotification: params.setShowEmailNotification,
            setIsSidePanelLoader: params.setIsSidePanelLoader
          });
        },
        template: DialogTemplate.Confirmation
      };
    case "delete":
      return getDeleteDialogConfig(params, t as TFunction<"translation", undefined>);
    default:
      return getDefaultDialogConfig(params, t as TFunction<"translation", undefined>);
  }
}

export const handleSorting: any = (columnName: string, sortBy: string, setSortBy: React.Dispatch<React.SetStateAction<string>>, sortDirection: string, setSortDirection: React.Dispatch<React.SetStateAction<string>>, t: TFunction<"translation", undefined>) => {
  let apiColumnName: string = columnName;
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
    case t("DocumentManagementServer.privacyColumn"):
      apiColumnName = "PrivacyStatus";
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

export const handleOnChangeCheckBox: any = (
  index: number,
  id: string,
  docData: any,
  selectedCheckBoxIds: string[],
  setSelectedCheckBoxIds: React.Dispatch<React.SetStateAction<string[]>>,
  setAllSelectedDocs: React.Dispatch<React.SetStateAction<{ fileId: string; registrationId: number; externalId: string; }[]>>
) => {
  // Defensive: ensure selectedCheckBoxIds is an array
  const checkBoxIds: string[] = Array.isArray(selectedCheckBoxIds) ? selectedCheckBoxIds : [];

  const isAlreadySelectedIds: boolean = checkBoxIds.includes(id);
  if (isAlreadySelectedIds) {
    setSelectedCheckBoxIds(checkBoxIds.filter(exId => exId !== id));
  } else {
    setSelectedCheckBoxIds([...checkBoxIds, id]);
  }

  const doc: any = docData?.data?.find((d: any) => d.fileId === id);

  setSelectedCheckBoxIds((prevSelectedIds) => {
    const updatedCheckBoxIds: string[] = Array.isArray(prevSelectedIds) ? [...prevSelectedIds] : [];
    if (updatedCheckBoxIds.includes(id)) {
      return updatedCheckBoxIds.filter((selectedId) => selectedId !== id);
    }
    return [...updatedCheckBoxIds, id];
  });

  setAllSelectedDocs((prevDocs) => {
    if (doc) {
      const isAlreadySelected: boolean = prevDocs?.some((item) => item.fileId === id);
      if (isAlreadySelected) {
        return prevDocs?.filter((item) => item.fileId !== id);
      }
      return [
        ...prevDocs,
        {
          fileId: id,
          registrationId: doc.registrationId,
          externalId: doc.externalId
        }
      ];
    }
    return prevDocs;
  });
};

export const handleOnChangeAllCheckBox: any = (e: any, setIsHeaderBoxChecked: React.Dispatch<React.SetStateAction<boolean>>, setSelectedCheckBoxIds: React.Dispatch<React.SetStateAction<string[]>>, setExcludedCheckBoxIds: React.Dispatch<React.SetStateAction<string[]>>, setPrevSelectedDocs: React.Dispatch<React.SetStateAction<string[]>>, setAllSelectedDocs: React.Dispatch<React.SetStateAction<{ fileId: string; registrationId: number; externalId: string; }[]>>) => {
  const isChecked: boolean = e.target.checked;
  setIsHeaderBoxChecked(isChecked);
  if (!isChecked) {
    setSelectedCheckBoxIds([]);
    setExcludedCheckBoxIds([]);

  }
  setPrevSelectedDocs([])
  setAllSelectedDocs([]);

}