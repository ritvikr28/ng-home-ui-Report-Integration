import React from "react";
import { Tag, TagSize, SidePanelContent } from "@essnextgen/ui-kit";
import { getStatusTagColor, EditButton, getRedirectToNextGenText } from "./Sims7RedirectionsViewHelpers";

function formatDate(dateVal: string | undefined): string {
  if (!dateVal) return "";
  const date = new Date(dateVal);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

function renderEffectiveDate(payload: any): React.ReactNode {
  const show = ((payload.effectiveDate && payload.effectiveDate !== "-") || (payload.previousDate && payload.previousDate !== "-"));
  if (!show) return null;
  const dateVal = payload.effectiveDate == null || payload.effectiveDate === "" ? payload.previousDate : payload.effectiveDate;
  return (
    <div>
      <div className="heading-category">Effective date</div>
      <div className="details-category">{formatDate(dateVal)}</div>
    </div>
  );
}

function renderReasonForChanges(payload: any): React.ReactNode {
  if (!["NotMigrated", "Reversing"].includes(payload.redirectStatus)) return null;
  // Show '-' if null, undefined, or empty string
  const reason = payload.reasonForChange == null || payload.reasonForChange === "" ? "-" : payload.reasonForChange;
  return (
    <div>
      <div className="heading-category">Reason for changes</div>
      <div className="details-category">{reason}</div>
    </div>
  );
}

function renderReverseMigrationMessage(payload: any): React.ReactNode {
  if (payload.currentStatus === "P" && payload.plannedStatus === "N") {
    const dateVal = payload.effectiveDate == null || payload.effectiveDate === "" ? payload.previousDate : payload.effectiveDate;
    return (
      <div className="reverse-migration-message">
        Request have made to reverse the permanent migration on {formatDate(dateVal) || "-"}
      </div>
    );
  }
  return null;
}

function renderApplyMigrationMessage(payload: any): React.ReactNode {
  if ((payload.currentStatus === "Y" && payload.plannedStatus === "P") ||
      (payload.currentStatus === "N" && payload.plannedStatus === "P")) {
    const dateVal = payload.effectiveDate == null || payload.effectiveDate === "" ? payload.previousDate : payload.effectiveDate;
    return (
      <div className="apply-migration-message">
        Request have made to apply permanent migration on {formatDate(dateVal) || "-"}
      </div>
    );
  }
  return null;
}

export interface Sims7RedirectionsViewProps {
  viewData: any;
  t: (key: string) => string;
  setSidePanelMode: (mode: "view" | "edit") => void;
}

const Sims7RedirectionsView: React.FC<Sims7RedirectionsViewProps> = ({
  viewData,
  t,
  setSidePanelMode
}) => (
  <SidePanelContent>
    <div className="view-mode-with-edit-button">
      <div className="view-mode-content">
        <div>
          <div className="heading-category">Category</div>
          <div className="details-category">
            {" "}
            {viewData?.payload?.ngComponent}
          </div>
        </div>
        <div>
          <div className="heading-category">Next Gen module</div>
          <div className="details-category">
            <a
              href={viewData?.payload?.nextGenComponentUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {viewData?.payload?.ngModule}
            </a>
          </div>
        </div>
        <div>
          <div className="heading-category">SIMS 7 module</div>
          <div className="details-category">{viewData?.payload?.sims7Module}</div>
        </div>
        <div>
          <div className="heading-category">Redirect to open in Next Gen</div>
          <div className="details-category">
            {" "}
            {getRedirectToNextGenText(viewData?.payload?.redirectStatus)}
          </div>
        </div>

        {viewData?.payload?.updatedByUserName && viewData?.payload?.updatedByUserName !== "-" && (
          <div>
            <div className="heading-category">Modified by</div>
            <div className="details-category">{viewData?.payload?.updatedByUserName}</div>
          </div>
        )}
        {/* Effective date: use previousDate if effectiveDate is null/empty */}
        {renderEffectiveDate(viewData?.payload)}
        {renderReasonForChanges(viewData?.payload)}
        <div>
          <div className="heading-category">Status</div>
          <div className="details-category">
            <Tag
              text={viewData?.payload?.redirectStatus}
              size={TagSize.Large}
              color={getStatusTagColor(viewData?.payload?.redirectStatus)}
            />
          </div>
        </div>

        {renderReverseMigrationMessage(viewData?.payload)}
        {renderApplyMigrationMessage(viewData?.payload)}

      </div>
      <EditButton
        status={viewData?.payload?.redirectStatus}
        t={t}
        setSidePanelMode={setSidePanelMode}
      />
    </div>
  </SidePanelContent>
);
export default Sims7RedirectionsView;
