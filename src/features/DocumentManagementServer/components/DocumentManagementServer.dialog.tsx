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

  onRefreshAfterClose: () => void;
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
  onRefreshAfterClose
}) =>
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
          loading={isPreDialogLoading}
          onClose={onRefreshAfterClose}
        />
      )}
    </>

