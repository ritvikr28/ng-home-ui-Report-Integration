import {
  Button,
  ButtonColor,
  ButtonSize,
  Grid,
  GridItem,
  IconColor,
  useMediaQuery
} from "@essnextgen/ui-kit";
import React,{ useEffect, useState } from "react";
import { LocalisedMenu } from "@essnextgen/ui-application-kit";
import { UserManagement } from "@essnextgen/ui-user-access-management-kit";
import { envConfig } from "../../shared/utils";



const UAM:()=>JSX.Element = () => {
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
const homeurl=`${envConfig.HOME_UI_BASEURL}/AdminConsole`
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
              text: "About",
              value: `${window.location.origin}/adminconsole`
            }}
          />
        </GridItem>
        <GridItem style={{ marginTop: "24px" }} lg={isOpen?9:12} md={isOpen?8:8} xl ={isOpen?10:12}>
         
          <UserManagement breadcrumbData={    [

{

  active: false,

  linkName: "Home",

  path: "/"

},

{

  active: false,

  linkName: "Admin Console",

  path: homeurl,
  isExternalLink:true

},

{

  active: false,

  linkName: "Users",

  path: "/"


}

]} headingLayoutText="Users" subHeadingLayoutText="Create, assign and invite users to give access to the MIS"/>
        </GridItem>
      </Grid>
    </>
  );
};

export default UAM;
