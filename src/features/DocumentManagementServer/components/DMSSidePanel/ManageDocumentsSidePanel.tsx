import { Button, ButtonSize } from "@essnextgen/ui-kit";
import React, { useState } from "react";
import { SidePanelTable } from "./SidePanelTable";
import { PrivateDocErrorNotification, DownloadErrorNotification } from "./sidePanelTable.logic";

interface ManageDocumentsSidePanelProps {
  t: any;
  privateDocData: any[];
  isPrivateDocError: boolean;
  onSortChange: (columnName: string) => void;
  totalRecords: number;
  onPageChange: (page: number) => void;
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

export const ManageDocumentsSidePanel: React.FC<ManageDocumentsSidePanelProps> = ({ t, privateDocData = [], isPrivateDocError = false, onSortChange, totalRecords, onPageChange }) => {
  const [isDownloadError, setIsDownloadError]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState(false);
  return (
    <div className="manage-documents-side-panel">
      {isPrivateDocError && <PrivateDocErrorNotification t={t} />}
      {isDownloadError && <DownloadErrorNotification t={t} />}
      <Description t={t} />
      <Highlight t={t} />
      <TotalCount count={totalRecords} />
      <HelpText t={t} />
      <ConvertDocButton t={t} />
      <div className="manage-documents-table">
        <SidePanelTable tableBodyData={privateDocData} onSortChange={onSortChange} onDownloadError={setIsDownloadError} totalRecords={totalRecords} onPageChange={onPageChange} />
      </div>
    </div>
);
};