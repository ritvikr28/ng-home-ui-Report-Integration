import React from "react";
import { Tag, TagSize, SidePanelContent } from "@essnextgen/ui-kit";
import { getStatusTagColor, EditButton, getRedirectToNextGenText } from "./Sims7RedirectionsViewHelpers";

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
              href={`https://example.com/module/${encodeURIComponent(
                viewData?.payload?.ngModule
              )}`}
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

        {viewData?.payload?.updatedBy && viewData?.payload?.updatedBy !== "-" && (
          <div>
            <div className="heading-category">Modified by</div>
            <div className="details-category">{viewData?.payload?.updatedBy}</div>
          </div>
        )}
        {viewData?.payload?.effectiveDate &&
          viewData?.payload?.effectiveDate !== "-" && (
            <div>
              <div className="heading-category">Effective date</div>
              <div className="details-category">
                {viewData?.payload?.effectiveDate
                  ? new Date(viewData?.payload?.effectiveDate).toLocaleDateString(
                      "en-GB",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                      }
                    )
                  : ""}
              </div>
            </div>
          )}
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
