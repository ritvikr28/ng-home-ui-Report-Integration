import { Button, ButtonSize, Notification, NotificationStatus } from "@essnextgen/ui-kit";
import React, { useState } from "react";
import { SidePanelTable } from "./SidePanelTable";
import { getBannerMessageWithLink } from "../../Views/DMSLayout";

interface ManageDocumentsSidePanelProps {
  t: any;
  privateDocData: any[];
  isPrivateDocError: boolean;
  onSortChange: (columnName: string) => void;
}

const Description: React.FC<{ t: any }> = ({ t }) => (
  <div className="description">
    <span>{t("DocumentManagementServer.privateFilesDescription")}</span>
  </div>
);

const Highlight: React.FC<{ t: any }> = ({ t }) => (
  <div className="highlight">
    <span>{t("DocumentManagementServer.privateDocuments")}</span>
    <br />
  </div>
);

const TotalCount: React.FC<{ count: number }> = ({ count }) => (
  <span className="total-count">{count}</span>
);

const HelpText: React.FC<{ t: any }> = ({ t }) => (
  <div className="help-text">
    <span>{t("DocumentManagementServer.privateDocHelpText")}</span>
  </div>
);

const ConvertDocButton: React.FC<{ t: any }> = ({ t }) => (
  <Button
    className="convert-doc-button"
    type="button"
    size={ButtonSize.Small}
    onClick={() => {}}
  >
    {t("DocumentManagementServer.privateDocButtonText")}
  </Button>
);

const PrivateDocErrorNotification: React.FC<{ t: any }> = ({ t }) => (
  <Notification
    status={NotificationStatus.WARNING}
    title={t("DocumentManagementServer.informationUnavailable")}
    message={getBannerMessageWithLink(t("DocumentManagementServer.privateDocTechnicalIssue"), t("DocumentManagementServer.contactSupport"))}
    autoclose={false}
    hideCloseButton={true}
  />
);

const DownloadErrorNotification: React.FC<{ t: any }> = ({ t }) => (
  <Notification
    status={NotificationStatus.WARNING}
    title={t("DocumentManagementServer.privateDocDownloadFailureTitle")}
    message={getBannerMessageWithLink(t("DocumentManagementServer.privateDocDownloadFailureMessage"), t("DocumentManagementServer.contactSupport"))}
    autoclose={false}
    hideCloseButton={true}
  />
);

export const ManageDocumentsSidePanel: React.FC<ManageDocumentsSidePanelProps> = ({ t, privateDocData = [], isPrivateDocError = false, onSortChange }) => {
  const [isDownloadError, setIsDownloadError]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState(false);
  return (
    <div className="manage-documents-side-panel">
      {isPrivateDocError && <PrivateDocErrorNotification t={t} />}
      {isDownloadError && <DownloadErrorNotification t={t} />}
      <Description t={t} />
      <Highlight t={t} />
      <TotalCount count={privateDocData.length} />
      <HelpText t={t} />
      <ConvertDocButton t={t} />
      <div className="manage-documents-table">
        <SidePanelTable tableBodyData={privateDocData} onSortChange={onSortChange} onDownloadError={setIsDownloadError} />
      </div>
    </div>
);
};