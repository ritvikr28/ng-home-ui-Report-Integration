import { Breadcrumbs, Grid, GridItem, useMediaQuery } from "@essnextgen/ui-kit";
 import { useState } from "react";
import { LocalisedMenu } from "@essnextgen/ui-application-kit";
import About from "./About";

export interface IAdminConsoleProps {
  baseRouteName: string;
}

const AdminConsole = () => {
  const isMobileView: boolean = useMediaQuery(
    "(min-width:320px) and (max-width: 1023.9px)"
  );

  const [isOpen, setIsOpen] = useState<boolean>(!isMobileView);

  return (
    <>
      <Grid>
        <GridItem>
            <LocalisedMenu
              menuHeading="Admin Console"
              onCloseSideNavigationPanel={() => setIsOpen(false)}
              isOpenSideNavigation={isOpen}
              onMenuItemClick={(e, item) => console.log(item)}
              defaultSelectedMenu={{
                text: "Conduct",
                value: "https://dev.cdn.sims.co.uk/settings",
              }}              
            />
        </GridItem>
        <GridItem style={{ marginTop: "24px" }}>
        <div>
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
            className="essui-Breadcrumbs "
            dataTestId="breadcrumb-test-id"
            id="element-id"
            onItemClick={() => {}}
          />
          </div>
          <div>
          <About/>
          </div>
        </GridItem>
       </Grid>
    </>
  );
};

export default AdminConsole;