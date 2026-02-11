import React from "react";
import { Notification, NotificationStatus, Loader, LoaderType, Button } from "@essnextgen/ui-kit";
import { ViewDownloadItem } from "../responseModel";

interface Props {
  t: (key: string, options?: any) => string;
  isViewDownloadError: boolean;
  isSidePanelLoader: boolean;
  hasFetchedViewDownload: boolean;
  viewData: ViewDownloadItem[];
  fileDownload: (...args: any[]) => Promise<any>;
  setDownloadError: (v: boolean) => void;
  gtmAnalytics: any;
}

export const ViewDownloadContent: React.FC<Props> = ({
  t,
  isViewDownloadError,
  isSidePanelLoader,
  hasFetchedViewDownload,
  viewData,
  fileDownload,
  setDownloadError,
  gtmAnalytics
}) => {
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
  if (hasFetchedViewDownload && viewData?.length === 0) {
    return <p>{t("DocumentManagementServer.downloadsAppearHere")}</p>;
  }
  if (viewData?.length > 0) {
    return (
      <>
        <p>{t("DocumentManagementServer.preparedDownloadsExpireMsg")}</p>
        {viewData.map((item, index) => {
          const isComplete = item?.status?.toLowerCase() === "complete";
          const isInProgress = item?.status?.toLowerCase() === "inprogress";
          const isInitiated = item?.status?.toLowerCase() === "initiated";
          return (
            <div className="viewDownloadDetails" key={index}>
              <div className="fileDetails">
                <p>{item?.name}</p>
                {isComplete && item?.fileExpiryDays !== undefined && (() => {
                  if (item.fileExpiryDays > 0) {
                    return (
                      <span>
                        {t("DocumentManagementServer.ExpiresInDays", {
                          days: item.fileExpiryDays
                        })}
                      </span>
                    );
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
                        fileExtension: item?.name?.split(".").pop() || "",
                        fileName: "[RemovedFileName]",
                        linkText: "Download",
                        linkUrl: "[RemovedLinkUrl]"
                      });
                    } catch (error) {
                      setDownloadError(true);
                      gtmAnalytics.pushEvent({
                        event: "error_message",
                        messageText: "Unable to download"
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