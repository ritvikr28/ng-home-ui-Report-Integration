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
import {
  useTranslation,
  UseTranslationResponse
} from "@essnextgen/ui-intl-kit";
import About from "./About";


const AdminConsole: React.FC = () => {
  const isMobileView: boolean = useMediaQuery(
    "(min-width:320px) and (max-width: 1023.9px)"
  );
  const { t }: UseTranslationResponse<"translation", undefined> =
  useTranslation();

  const [isOpen, setIsOpen]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(!isMobileView);

  const handleButtonClick: () => void = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    setIsOpen(!isMobileView);
  }, [!isMobileView]);
  useEffect(() => {
    document.body.classList.remove('no-scroll');
  }, [])

  type LayoutValues = {
    grid1: { lg: number; md: number; xl: number; xxl: number };
    grid2: { lg: number; md: number; xl: number; xxl: number };
  };

  const layoutValues: LayoutValues = {
    grid1: isOpen ? { lg: 3, md: 2, xl: 2, xxl: 1 } : { lg: 0, md: 0, xl: 0, xxl: 1 },
    grid2: isOpen ? { lg: 9, md: 8, xl: 9, xxl: 10 } : { lg: 12, md: 8, xl: 12, xxl: 10 }
  };
  return (
    <>
      <Grid
        className={!isOpen ? "new-adminconsole-container" : "new-adminconsole-container-grid"}
      >
        <GridItem
          lg={layoutValues.grid1.lg} md={layoutValues.grid1.md} xl={layoutValues.grid1.xl} xxl={2}
          className="new-adminconsole-sidepanel"
        >
          <LocalisedMenu
            customHeight={100}
            menuHeading="Admin Console"
            onCloseSideNavigationPanel={() => setIsOpen(false)}
            isOpenSideNavigation={isOpen}
            defaultSelectedMenu={{
              text: "About",
              value: `${window.location.origin}/adminconsole`
            }}
          />
        </GridItem>
        <GridItem
          lg={layoutValues.grid2.lg} md={layoutValues.grid2.md} xl={layoutValues.grid2.xl} xxl={9}

        >
          <div className="new-adminconsole-breadcrumb">
            {isMobileView && !isOpen && (
              <Button
                color={ButtonColor.Utility}
                dataTestId="btn-collapse"
                iconColor={IconColor.Neutral800}
                iconName="open-panel--left--filled"
                onClick={handleButtonClick}
                size={ButtonSize.Small}
              />
            )}
            <Breadcrumbs
              breadcrumbActions={[
                {
                  active: true,
                  linkName: t("breadcrumbshome"),
                  path: window.location.origin
                },
                {
                  active: false,
                  linkName: t("breadcrumbsadminconsole"),
                  path: "#"
                }
              ]}
              dataTestId="breadcrumb-test-id"
              id="element-id"
              onItemClick={() => { }}
            />
          </div>
          <About />
        </GridItem>
      </Grid>
    </>
  );
};

export default AdminConsole;
