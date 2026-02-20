import React from "react";
import NoSelectionDialog from "../../../shared/components/NoSelectionDialog/NoSelectionDialog";
import { getDialogTitle } from "../logic/DocumentManagementServer.utils";

interface DmsDialogsProps {
  t: any;

  showDialog: boolean;
  setShowDialog: React.Dispatch<React.SetStateAction<boolean>>;

  showRestrictedDeleteDialog: boolean;
  setShowRestrictedDeleteDialog: React.Dispatch<React.SetStateAction<boolean>>;

  showRestrictedPrepareDialog: boolean;
  setShowRestrictedPrepareDialog: React.Dispatch<React.SetStateAction<boolean>>;

  restrictedFileCount: number;
  alreadyDeletedFileCount: number;
  availableFileCount: number;
  totalSelectedCount: number;
  isHeaderBoxChecked: boolean;
  isPreDialogLoading: boolean;
  totalRecords: number;
  onRefreshAfterClose: () => void;
}

function getRestrictedDeleteNotificationTitle(
  restrictedFileCount: number,
  alreadyDeletedFileCount: number,
  availableFileCount: number,
  totalSelectedCount: number,
  totalRecords: number,
  isHeaderBoxChecked: boolean,
  t: any
): string {
  if (restrictedFileCount > 0) {
    return getRestrictedDeleteNotificationForRestricted(restrictedFileCount, totalRecords, t);
  }
  if (
    alreadyDeletedFileCount > 0 ||
    (totalSelectedCount !== alreadyDeletedFileCount + restrictedFileCount + availableFileCount && isHeaderBoxChecked)
  ) {
    return getRestrictedDeleteNotificationForDeleted(
      alreadyDeletedFileCount,
      restrictedFileCount,
      availableFileCount,
      totalSelectedCount,
      totalRecords,
      isHeaderBoxChecked,
      t
    );
  }
  return "";
}

function getRestrictedDeleteNotificationForRestricted(
  restrictedFileCount: number,
  totalRecords: number,
  t: any
): string {
  return restrictedFileCount === 1
    ? t("DocumentManagementServer.documentCannotBeDeletedNotification")
    : t("DocumentManagementServer.documentsCannotBeDeletedNotification", {
        all: restrictedFileCount === totalRecords ? t("DocumentManagementServer.All") : "",
        count: restrictedFileCount
      });
}

function getRestrictedDeleteNotificationForDeleted(
  alreadyDeletedFileCount: number,
  restrictedFileCount: number,
  availableFileCount: number,
  totalSelectedCount: number,
  totalRecords: number,
  isHeaderBoxChecked: boolean,
  t: any
): string {
  const deletedCount: number =
    totalSelectedCount > alreadyDeletedFileCount + restrictedFileCount + availableFileCount && isHeaderBoxChecked
      ? totalSelectedCount - (alreadyDeletedFileCount + restrictedFileCount + availableFileCount)
      : alreadyDeletedFileCount;

  if ((alreadyDeletedFileCount === totalSelectedCount && totalSelectedCount > 1) || deletedCount > 1) {
    return t("DocumentManagementServer.allSelectedDocumentsAlreadyDeleted");
  }
  if (deletedCount === totalSelectedCount && totalSelectedCount === 1) {
    return t("DocumentManagementServer.documentAlreadyDeletedMsg");
  }
  return (alreadyDeletedFileCount === 1 && availableFileCount > 0) || deletedCount === 1
    ? t("DocumentManagementServer.singleDocumentAlreadyDeletedMsg", { count: alreadyDeletedFileCount })
    : t("DocumentManagementServer.documentsAlreadyDeletedMsg", {
        all: alreadyDeletedFileCount === totalRecords ? t("DocumentManagementServer.All") : "",
        count: alreadyDeletedFileCount
      });
}

function getRestrictedDeleteMessage(
  restrictedFileCount: number,
  alreadyDeletedFileCount: number,
  totalRecords: number
): string {
  if (restrictedFileCount > 0 && alreadyDeletedFileCount > 0) {
    return `${alreadyDeletedFileCount === totalRecords && alreadyDeletedFileCount !== 1 ? "All " : ""} ${alreadyDeletedFileCount} file${alreadyDeletedFileCount !== 1 ? "s" : ""} are already deleted.`;
  }
  return "";
}

function getRestrictedPrepareNotificationTitle(
  alreadyDeletedFileCount: number,
  restrictedFileCount: number,
  availableFileCount: number,
  totalSelectedCount: number,
  isHeaderBoxChecked: boolean,
  t: any
): string {
  const deletedCount: number =
    totalSelectedCount > alreadyDeletedFileCount + restrictedFileCount + availableFileCount && isHeaderBoxChecked
      ? totalSelectedCount - (alreadyDeletedFileCount + restrictedFileCount + availableFileCount)
      : alreadyDeletedFileCount;
  return deletedCount === 1
    ? t("DocumentManagementServer.documentCannotBeDownloadedMsg", { count: deletedCount })
    : t("DocumentManagementServer.documentsCannotBeDownloadedMsg", {
        all:
          alreadyDeletedFileCount === totalSelectedCount ||
          (alreadyDeletedFileCount === 0 && restrictedFileCount === 0 && availableFileCount === 0)
            ? t("DocumentManagementServer.All")
            : "",
        count: deletedCount
      });
}
export const DmsDialogs: React.FC<DmsDialogsProps> = ({
  t,
  showDialog,
  setShowDialog,
  showRestrictedDeleteDialog,
  setShowRestrictedDeleteDialog,
  showRestrictedPrepareDialog,
  setShowRestrictedPrepareDialog,
  restrictedFileCount,
  alreadyDeletedFileCount,
  availableFileCount,
  totalSelectedCount,
  isHeaderBoxChecked,
  isPreDialogLoading,
  totalRecords,
  onRefreshAfterClose
}) => (
  <>
    {showDialog && (
      <NoSelectionDialog
        setShowDialog={setShowDialog}
        title={t("DocumentManagementServer.noItemsSelectedTitle")}
        message={t("DocumentManagementServer.noItemsSelectedMessage")}
        onClose={() => {}}
      />
    )}

    {showRestrictedDeleteDialog && (
      <NoSelectionDialog
        setShowDialog={setShowRestrictedDeleteDialog}
        title={getDialogTitle(
          restrictedFileCount,
          alreadyDeletedFileCount,
          availableFileCount,
          totalSelectedCount,
          isHeaderBoxChecked,
          t
        )}
        notificationTitle={getRestrictedDeleteNotificationTitle(
          restrictedFileCount,
          alreadyDeletedFileCount,
          availableFileCount,
          totalSelectedCount,
          totalRecords,
          isHeaderBoxChecked,
          t
        )}
        message={getRestrictedDeleteMessage(
          restrictedFileCount,
          alreadyDeletedFileCount,
          totalRecords
        )}
        loading={isPreDialogLoading}
        onClose={onRefreshAfterClose}
      />
    )}

    {showRestrictedPrepareDialog && (
      <NoSelectionDialog
        setShowDialog={setShowRestrictedPrepareDialog}
        title={
          alreadyDeletedFileCount === 1
            ? t("DocumentManagementServer.documentCannotBeDownloadedTitle", {
                count: alreadyDeletedFileCount
              })
            : t("DocumentManagementServer.documentsCannotBeDownloadedTitle", {
                count: alreadyDeletedFileCount
              })
        }
        notificationTitle={getRestrictedPrepareNotificationTitle(
          alreadyDeletedFileCount,
          restrictedFileCount,
          availableFileCount,
          totalSelectedCount,
          isHeaderBoxChecked,
          t
        )}
        loading={isPreDialogLoading}
        onClose={onRefreshAfterClose}
      />
    )}
  </>
);

