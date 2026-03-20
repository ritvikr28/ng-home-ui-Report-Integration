import React from "react";
import {
    ReactionButtonGroup,
    ReactionButton,
    SidePanelContent,
    ButtonSize
} from "@essnextgen/ui-kit";
import { Sims7RedirectionsEditProps } from "./Sims7RedirectionsInterfaces";
import { renderEditFields } from "./Sims7RedirectionsEditFields";

const Sims7RedirectionsEdit: React.FC<Sims7RedirectionsEditProps> = (props) => {
    const {
        t,
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
                    <div className="heading-category">{t("SIMS7Redirects.category")}</div>
                    <div className="details-category">{selectedRow.category}</div>
                </div>
                <div>
                    <div className="heading-category">{t("SIMS7Redirects.nextGenModule")}</div> {selectedRow.nextGenModule ? (
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
                    <div className="heading-category">{t("SIMS7Redirects.sims7Module")}</div>
                    <div className="details-category">{selectedRow.sims7Module}</div>
                </div>
                <div>
                    <div className="heading-category">{t("SIMS7Redirects.redirectToNextGen")}</div>
                    <div className="details-category">
                        <ReactionButtonGroup
                            dataTestId="edit-redirect-nextgen"
                            id="edit-redirect-nextgen"
                            selectedValue={redirectToNextGen}
                            onChange={handleRedirectToNextGenChange}
                            size={ButtonSize.Small}
                        >
                            <ReactionButton
                                label={t("SIMS7Redirects.yes")}
                                value="yes"
                                className="reaction-yes"
                            />
                            <ReactionButton
                                label={t("SIMS7Redirects.no")}
                                value="no"
                                className="reaction-no"
                            />
                        </ReactionButtonGroup>
                    </div>
                </div>
                {renderEditFields({
                    t,
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
