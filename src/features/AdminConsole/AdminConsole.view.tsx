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
import { useEffect, useState } from "react";
import { LocalisedMenu } from "@essnextgen/ui-application-kit";
import About from "./About";

export interface IAdminConsoleProps {
  baseRouteName: string;
  togglePanel: any;
}

const AdminConsole = () => {
  const isMobileView: boolean = useMediaQuery(
    "(min-width:320px) and (max-width: 1023.9px)"
  );

  const [isOpen, setIsOpen] = useState<boolean>(!isMobileView);

  const handleButtonClick = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    setIsOpen(!isMobileView);
  }, [!isMobileView]);

  console.log("isOpen", isOpen);

  return (
    <>
      <Grid className="admin-mobile-1234567">
        <GridItem lg={2} md={3}>
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
            menuHeading="Admin Console"
            onCloseSideNavigationPanel={() => setIsOpen(false)}
            isOpenSideNavigation={isOpen}
            defaultSelectedMenu={{
              text: "About",
              value: `${window.location.origin}/adminconsole`,
            }}
          />
        </GridItem>
        <GridItem style={{ marginTop: "24px" }} lg={10} md={5}>
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
                  path: window.location.origin,
                },
                {
                  active: false,
                  linkName: "Admin Console",
                  path: "#",
                }
              ]}
              className="essui-Breadcrumbs"
              dataTestId="breadcrumb-test-id"
              id="element-id"
              onItemClick={() => {}}
            />
          </div>
          <About />
        </GridItem>
      </Grid>
    </>
  );
};

export default AdminConsole;
