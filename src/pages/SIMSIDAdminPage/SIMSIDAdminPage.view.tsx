import React, { useState } from "react";
import { Grid, GridItem, useMediaQuery } from "@essnextgen/ui-kit";
import "../NewHomePage/style.scss";
import SidePanelView from "../../features/SidePanel/SidePanel.view";

const SIMSIDAdminPageView: React.FC = () => {
    const isMobileView: boolean = useMediaQuery(
        "(min-width:320px) and (max-width: 1023.9px)"
    );
    const [isOpen, setIsOpen]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(!isMobileView);
    const togglePanel: () => void = () => { setIsOpen(!isOpen); };

    const closePanel: () => void = () => {
        setIsOpen(false);
    };

    return (
        <Grid className="app-dertfsg11463f" dataTestId="SIMSIDAdminPage">
            <GridItem
                className={
                    isOpen
                        ? "side-margin-dertfsg11463f side-margin-quicklink-dertfsg11463f"
                        : "side-margin-closed-dertfsg11463f"
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
                            ? "body-open-panel-dertfsg11463f"
                            : "body-panel-dertfsg11463f res-body-dertfsg11463f"
                        : isOpen
                            ? "body-panel-mobile-open-dertfsg11463f"
                            : "body-panel-mobile-dertfsg11463f"
                }
            >
                {/* eslint-enable */}
                <h2>Coming Soon.....</h2>
            </GridItem>
        </Grid>
    );
};

export default SIMSIDAdminPageView;