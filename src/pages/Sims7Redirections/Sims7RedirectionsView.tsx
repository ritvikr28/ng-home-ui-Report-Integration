import React from "react";
import {
    Tag,
    TagSize,
    SidePanelContent
} from "@essnextgen/ui-kit";
import { getStatusTagColor, ModifiedByField, EffectiveDateField, ReasonForChangesField, EditButton } from "./Sims7RedirectionsViewHelpers";
import { Sims7RedirectionsViewProps } from "./Sims7RedirectionsInterfaces";

const Sims7RedirectionsView: React.FC<Sims7RedirectionsViewProps> = ({ selectedRow, t, setSidePanelMode }) => (
    <SidePanelContent>
        <div className="view-mode-with-edit-button">
            <div className="view-mode-content">
                <div>
                    <div className="heading-category">Category</div>
                    <div className="details-category">{selectedRow.category}</div>
                </div>
                <div>
                    <div className="heading-category">Next Gen module</div> {selectedRow.nextGenModule ? (
                        <a
                            href={`https://example.com/module/${encodeURIComponent(selectedRow.nextGenModule)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {selectedRow.nextGenModule}
                        </a>
                    ) : null}
                </div>
                <div>
                    <div className="heading-category">SIMS 7 module</div>
                    <div className="details-category">{selectedRow.sims7Module}</div>
                </div>
                <div>
                    <div className="heading-category">Redirect to open in Next Gen</div>
                    <div className="details-category">{(selectedRow.status === 'Not migrated' || selectedRow.status === 'Reversing') ? 'No' : 'Yes'}</div>
                </div>
                <ModifiedByField modifiedBy={selectedRow.modifiedBy} />
                <EffectiveDateField status={selectedRow.status} effectiveDate={selectedRow.effectiveDate} />
                <ReasonForChangesField reasonForChanges={selectedRow.reasonForChanges} />
                <div>
                    <div className="heading-category">Status</div>
                    <div className="details-category">
                        <Tag
                            text={selectedRow.status}
                            size={TagSize.Large}
                            color={getStatusTagColor(selectedRow.status)}
                        />
                    </div>
                </div>
            </div>
            <EditButton status={selectedRow.status} t={t} setSidePanelMode={setSidePanelMode} />
        </div>
    </SidePanelContent>
);

export default Sims7RedirectionsView;
