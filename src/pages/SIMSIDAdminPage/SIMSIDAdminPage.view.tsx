import React, { useState } from "react";
import { Grid, GridItem, useMediaQuery } from "@essnextgen/ui-kit";
import "../NewHomePage/style.scss";
import SidePanelView from "../../features/SidePanel/SidePanel.view";
import SIMSIDAdminMainPanel from "../../features/SIMSAdmin/Components/SIMSIDAdminMainPanelView/SIMSIDAdminMainPanel.logic";
import "./style.scss";

const SIMSIDAdminPageView: React.FC = () => {
    const isMobileView: boolean = useMediaQuery(
        "(min-width:320px) and (max-width: 1023.9px)"
    );
    const [isOpen, setIsOpen]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(!isMobileView);
    const togglePanel: () => void = () => { setIsOpen(!isOpen); };

    const closePanel: () => void = () => {
        setIsOpen(false);
    };

    const renderContent: () => JSX.Element = () => <SIMSIDAdminMainPanel
        isOpen={isOpen}
        setIsOpen={setIsOpen}
    />


    return (
        <Grid className="app-simsid-admin" dataTestId="SIMSIDAdminPage">
            <GridItem
                className={
                    isOpen
                        ? "side-margin-simsid-admin side-margin-quicklink-simsid-admin"
                        : "side-margin-closed-simsid-admin"
                }
                lg={isOpen ? 3 : 0}
            >
                <SidePanelView
                    isOpen={isOpen}
                    togglePanel={togglePanel}
                    closePanel={closePanel}
                    setQuickLinkData={() => { }}
                    isSIMSIDAdmin={true}
                />
            </GridItem>
            {/* eslint-disable */}
            <GridItem
                className={
                    !isMobileView
                        ? isOpen
                            ? "body-open-panel-simsid-admin"
                            : "body-panel-simsid-admin res-body-dertfsg11463f"
                        : isOpen
                            ? "body-panel-mobile-open-simsid-admin"
                            : "body-panel-mobile-simsid-admin"
                }
            >
                {/* eslint-enable */}
                {renderContent()}
            </GridItem>
        </Grid>
    );
};

export default SIMSIDAdminPageView;