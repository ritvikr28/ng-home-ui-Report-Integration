import {
  Breadcrumbs,
  Button,
  ButtonColor,
  ButtonSize,
  Grid,
  GridItem,
  IconColor,
  useMediaQuery
} from "@essnextgen/ui-kit";
import React, { useEffect, useState } from "react";
import { LocalisedMenu } from "@essnextgen/ui-application-kit";
// import RefreshDatabase from "./RefreshDatabase/RefreshDatabase";
// import RefreshDatabaseView from "./RefreshDatabase/RefreshDatabase.view";
// import { envConfig } from "../../shared/utils";


const DBManagement: React.FC = () => {
  const isMobileView: boolean = useMediaQuery(
    "(min-width:320px) and (max-width: 1023.9px)"
  );

  const [isOpen, setIsOpen]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(!isMobileView);

  const handleButtonClick: () => void = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    setIsOpen(!isMobileView);
  }, [!isMobileView]);

  return (
    <>
      <Grid className="admin-mobile-rwaf92428">
        <GridItem lg={isOpen?3:0} md={isOpen?2:0} xl ={isOpen?2:0} className="side-width">
          {isMobileView && !isOpen && (
            <Button
              className="base-class"
              color={ButtonColor.Utility}
              dataTestId="btn-collapse"
              iconColor={IconColor.Neutral800}
              iconName="open-panel--left--filled"
              onClick={handleButtonClick}
              size={ButtonSize.Small}
            />
          )}
          <LocalisedMenu 
            customHeight={100}
            menuHeading="Admin console"
            onCloseSideNavigationPanel={() => setIsOpen(false)}
            isOpenSideNavigation={isOpen}
            defaultSelectedMenu={{
              text: "Refresh Database",
              value: `${window.location.origin}/dbmanagement`
            }}
          />
        </GridItem>
        <GridItem style={{ marginTop: "24px" }} lg={isOpen?9:12} md={isOpen?8:8} xl ={isOpen?10:12}>
          <div
            className={
              isOpen ? "adminConsole-sidepanelopen" : "adminconsole-breadcrumb"
            }
          >
            <Breadcrumbs
              breadcrumbActions={[
                {
                  active: true,
                  linkName: "Home",
                  path: window.location.origin
                },
                {
                  active: false,
                  linkName: "Admin console",
                  path: `${window.location.origin}/AdminConsole`
                },
                {
                  active: false,
                  linkName: "Refresh Database",
                  path: "#"
                }
              ]}
              className="essui-Breadcrumbs"
              dataTestId="breadcrumb-test-id"
              id="element-id"
              onItemClick={() => {}}
            />
          </div>
          {/* <RefreshDatabase />
          <RefreshDatabaseView /> */}
        </GridItem>
      </Grid>
    </>
  );
};

export default DBManagement;
