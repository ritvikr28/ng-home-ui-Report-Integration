import React from "react";
import {
    ReactionButtonGroup,
    ReactionButton,
    SidePanelContent
} from "@essnextgen/ui-kit";
import { Sims7RedirectionsEditProps } from "./Sims7RedirectionsInterfaces";
import { renderEditFields } from "./Sims7RedirectionsEditFields";

const Sims7RedirectionsEdit: React.FC<Sims7RedirectionsEditProps> = (props) => {
    const {
        selectedRow,
        redirectToNextGen,
        effectiveDate,
        reasonForChanges,
        dateError,
        reasonError,
        getDateParts,
        handleRedirectToNextGenChange,
        handleDateChange,
        handleValidateDate,
        setReasonForChanges,
        setIsDirty,
        isFormDirty
    }: Sims7RedirectionsEditProps = props;


    return (
        <SidePanelContent>
            <div className="edit-mode-content">
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
                    <div className="details-category">
                        <ReactionButtonGroup
                            dataTestId="edit-redirect-nextgen"
                            id="edit-redirect-nextgen"
                            selectedValue={redirectToNextGen}
                            onChange={handleRedirectToNextGenChange}
                        >
                            <ReactionButton
                                label="Yes"
                                value="yes"
                                className="reaction-yes"
                            />
                            <ReactionButton
                                label="No"
                                value="no"
                                className="reaction-no"
                            />
                        </ReactionButtonGroup>
                    </div>
                </div>
                {renderEditFields({
                    selectedRow,
                    redirectToNextGen,
                    effectiveDate,
                    reasonForChanges,
                    dateError,
                    reasonError,
                    getDateParts,
                    handleDateChange,
                    handleValidateDate,
                    setReasonForChanges,
                    setIsDirty,
                    isFormDirty
                })}
            </div>
        </SidePanelContent>
    );
};

export default Sims7RedirectionsEdit;
