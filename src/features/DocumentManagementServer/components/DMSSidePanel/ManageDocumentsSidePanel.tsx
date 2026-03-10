import { Button, ButtonSize } from "@essnextgen/ui-kit";
import React from "react";
import { SidePanelTable } from "./SidePanelTable";

interface ManageDocumentsSidePanelProps {
  t: any;
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

export const ManageDocumentsSidePanel: React.FC<ManageDocumentsSidePanelProps> = ({ t }) => (

    <div className="manage-documents-side-panel">
      <Description t={t} />
      <Highlight t={t} />
      <TotalCount count={444} />
      <HelpText t={t} />
      <ConvertDocButton t={t} />
      <div className="manage-documents-table">
        <SidePanelTable />
      </div>
    </div>
)