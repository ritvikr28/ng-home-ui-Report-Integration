import React from "react";
import { SidePanelReason } from "../../responseModel";
import { ManageDocumentsSidePanel } from "./ManageDocumentsSidePanel";
import { ViewDownloadSidePanel } from "./ViewDownloadSidePanel";

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
  sidePanelOpenReason: SidePanelReason | null;
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
  sidePanelOpenReason,
  gtmAnalytics
}) => {
  if (sidePanelOpenReason === "manage") {
    return (<ManageDocumentsSidePanel t={t} />);
  }
  // Default to view
  return (
    <ViewDownloadSidePanel
      t={t}
      isSidePanelLoader={isSidePanelLoader}
      hasFetchedViewDownload={hasFetchedViewDownload}
      isViewDownloadError={isViewDownloadError}
      viewData={viewData}
      failedFileName={failedFileName}
      clearAllError={clearAllError}
      prepareDownloadError={prepareDownloadError}
      prepareDownloadAbortBanner={prepareDownloadAbortBanner}
      downloadError={downloadError}
      showEmailNotification={showEmailNotification}
      showToastNotification={showToastNotification}
      availableFileCount={availableFileCount}
      setClearAllError={setClearAllError}
      setPrepareDownloadError={setPrepareDownloadError}
      setPrepareDownloadAbortBanner={setPrepareDownloadAbortBanner}
      setDownloadError={setDownloadError}
      setShowEmailNotification={setShowEmailNotification}
      setShowToastNotification={setShowToastNotification}
      setFailedFileName={setFailedFileName}
      gtmAnalytics={gtmAnalytics}
    />
  );
};