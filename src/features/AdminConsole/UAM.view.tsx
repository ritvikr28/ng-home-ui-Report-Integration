import {
  Button,
  ButtonColor,
  ButtonSize,
  Grid,
  GridItem,
  IconColor,
  useMediaQuery
} from "@essnextgen/ui-kit";
import React, { useEffect, useRef, useState } from "react";
import { LocalisedMenu } from "@essnextgen/ui-application-kit";
import { UserManagement } from "@essnextgen/ui-user-access-management-kit";
import { envConfig } from "../../shared/utils";
import "./uamStyle.scss";

const UAM: () => JSX.Element = () => {
  const userManagementRef :React.RefObject<HTMLDivElement> = useRef<HTMLDivElement | null>(null);
  const isMobileView: boolean = useMediaQuery(
    "(min-width:320px) and (max-width: 1023.9px)"
  );
  const isAdminconsoleView :boolean = useMediaQuery(
    "(min-width:320px) and (max-width: 1024px)"
  );
 
  const [isOpen, setIsOpen]: [
    boolean,
    React.Dispatch<React.SetStateAction<boolean>>
  ] = useState<boolean>(!isMobileView);
  const [hasData, setHasData]: [
    boolean,
    React.Dispatch<React.SetStateAction<boolean>>
  ] = useState(false);
  const handleButtonClick: () => void = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    setIsOpen(!isMobileView);
  }, [!isMobileView]);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      if (userManagementRef.current) {
       
        const textContent = userManagementRef.current.innerText || "";
        setHasData(!textContent.includes("No data to display"));
      }
    });

   
    if (userManagementRef.current) {
      observer.observe(userManagementRef.current, {
        childList: true,
        subtree: true,
        characterData: true
      });
    }

    return () => {
      observer.disconnect(); 
    };
  }, []);
  useEffect(() => {
    document.body.style.overflowY = hasData ? "auto" : "hidden";
    return () => {
      document.body.style.overflowY = "auto"; 
    };
  }, [hasData]);

  const homeurl = `${envConfig.HOME_UI_BASEURL}/AdminConsole`;
  return (
    <>
      <Grid className="admin-mobile-rwaf92428">
        <GridItem
          lg={isOpen ? 3 : 0}
          md={isOpen ? 2 : 0}
          xl={isOpen ? 2 : 0}
          className="side-width"
        >
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
            customHeight={(isAdminconsoleView)? 370 : 170}
            menuHeading="Admin console"
            onCloseSideNavigationPanel={() => setIsOpen(false)}
            isOpenSideNavigation={isOpen}
            defaultSelectedMenu={{
              text: "About",
              value: `${window.location.origin}/adminconsole`
            }}
          />
        </GridItem>
        <GridItem
          className="uam-table-align"
          style={{ marginTop: "24px" }}
          lg={isOpen ? 9 : 12}
          md={isOpen ? 8 : 8}
          xl={isOpen ? 10 : 12}
        >
          <div ref={userManagementRef}>
            <UserManagement
              breadcrumbData={[
                {
                  active: false,

                  linkName: "Home",

                  path: "/"
                },

                {
                  active: false,

                  linkName: "Admin Console",

                  path: homeurl,
                  isExternalLink: true
                },

                {
                  active: false,

                  linkName: "Users",

                  path: "/"
                }
              ]}
              heading="Users"
              subHeading="Create, assign and invite users to give access to the MIS"
            />
          </div>
        </GridItem>
      </Grid>
    </>
  );
};

export default UAM;
