import React from "react";
import { Notification, NotificationStatus } from "@essnextgen/ui-kit";
import { ViewDownloadContent } from "./ViewDownloadContent";

interface DmsSidePanelProps {
  t: any;
  isSidePanelLoader: boolean;
  hasFetchedViewDownload: boolean;
  isViewDownloadError: boolean;

  viewData: any[];
  failedFileName: string[];

  clearAllError: boolean;
  prepareDownloadError: boolean;
  prepareDownloadAbortBanner: boolean;
  downloadError: boolean;
  showEmailNotification: boolean;
  showToastNotification: boolean;

  availableFileCount: number;

  setClearAllError: (v: boolean) => void;
  setPrepareDownloadError: (v: boolean) => void;
  setPrepareDownloadAbortBanner: (v: boolean) => void;
  setDownloadError: (v: boolean) => void;
  setShowEmailNotification: (v: boolean) => void;
  setShowToastNotification: (v: boolean) => void;
  setFailedFileName: (v: string[]) => void;

  fileDownload: (...args: any[]) => Promise<any>;
  gtmAnalytics: any;
}

export const DmsSidePanel: React.FC<DmsSidePanelProps> = ({
  t,
  isSidePanelLoader,
  hasFetchedViewDownload,
  isViewDownloadError,
  viewData,
  failedFileName,
  clearAllError,
  prepareDownloadError,
  prepareDownloadAbortBanner,
  downloadError,
  showEmailNotification,
  showToastNotification,
  availableFileCount,
  setClearAllError,
  setPrepareDownloadError,
  setPrepareDownloadAbortBanner,
  setDownloadError,
  setShowEmailNotification,
  setShowToastNotification,
  setFailedFileName,
  fileDownload,
  gtmAnalytics
}) => 
    <>
      {clearAllError && (
        <Notification
          status={NotificationStatus.WARNING}
          title={t("DocumentManagementServer.clearAllErrorTitle")}
          message={t("DocumentManagementServer.clearAllErrorMessage")}
          autoclose
          onClickClose={() => setClearAllError(false)}
        />
      )}

      {prepareDownloadError && (
        <Notification
          status={NotificationStatus.WARNING}
          title={t("DocumentManagementServer.prepareDownloadErrorTitle", {
            type: availableFileCount === 1 ? "document" : "documents"
          })}
          message={t("DocumentManagementServer.prepareDownloadErrorMessage", {
            type: availableFileCount === 1 ? "document" : "documents"
          })}
          autoclose
          onClickClose={() => setPrepareDownloadError(false)}
        />
      )}

      {prepareDownloadAbortBanner && (
        <Notification
          status={NotificationStatus.WARNING}
          title={t("DocumentManagementServer.prepareDownloadErrorTitle")}
          message={t(
            "DocumentManagementServer.oneOrMoreSelectedDocumentsCannotBeDownloaded"
          )}
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

      {failedFileName.length > 0 && (
        <Notification
          status={NotificationStatus.WARNING}
          title={t("DocumentManagementServer.failedDownloadTitle")}
          message={t("DocumentManagementServer.failedDownloadMessage", {
            files: failedFileName.join(", ")
          })}
          autoclose
          onClickClose={() => {
            setPrepareDownloadError(false);
            setFailedFileName([]);
          }}
        />
      )}

      {showToastNotification && (
        <Notification
          status={NotificationStatus.SUCCESSTOAST}
          title={t("DocumentManagementServer.downloadsCleared")}
          autoclose
          onClickClose={() => setShowToastNotification(false)}
        />
      )}

      <div className="viewDownloadWrap">
        <ViewDownloadContent
          t={t}
          isViewDownloadError={isViewDownloadError}
          isSidePanelLoader={isSidePanelLoader}
          hasFetchedViewDownload={hasFetchedViewDownload}
          viewData={viewData}
          fileDownload={fileDownload}
          setDownloadError={setDownloadError}
          gtmAnalytics={gtmAnalytics}
        />
      </div>
    </>
  

