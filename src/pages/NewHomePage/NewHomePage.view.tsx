import { Redirect } from "react-router-dom";
import { authService, MatchPermissions, Permission } from "@essnextgen/auth-ui";
import "./style.scss";
import { Grid, GridItem } from "@essnextgen/ui-kit";
import React, { useEffect, useState } from "react";
import MainPanelView from "../../features/MainPanel/MainPanel.view";
import SidePanelView from "../../features/SidePanel/SidePanel.view";
import QuickLinkLogic from "../QuickLinks";
import { fetchQuickLinkDetails } from "../../shared/components/QuickLink/Quicklinkresponse";
import { IFetchQuickLinkDetailsFunctionResponse, IQuickLinkApiResponse } from "../../shared/model/quickLink/responsemodels";
import { logger } from "../../shared/components/AppInsights";
import { getUserOrganisation } from "../../shared/utils";
import gtmAnalytics from "../../shared/utils/analytics";

const requiredPermissions: Permission[] = [
  {
    Securable: "NG.Homepage",
    Operation: "View"
  }
];

const requiredPermissionsforquicklink: Permission[] = [
  {
    Securable: "NG.Homepage.QuickLink",
    Operation: "View"
  }
];


 const NewHomepageView: () => JSX.Element = () => {
  const isPermission: boolean  = authService.isAuthorised(requiredPermissions, MatchPermissions.all)

    const isPermissionquicklink: boolean = authService.isAuthorised(requiredPermissionsforquicklink, MatchPermissions.all)

  const [isOpen, setIsOpen]: [
    boolean,
    React.Dispatch<React.SetStateAction<boolean>>
  ] = useState<boolean>(true);
  const [showQuickLink, setShowQuickLink]: [
    boolean,
    React.Dispatch<React.SetStateAction<boolean>>
  ] = useState<boolean>(false);

  const [quickLinkData, setQuickLinkData]: [
    IQuickLinkApiResponse[] | null,
    React.Dispatch<React.SetStateAction<IQuickLinkApiResponse[] | null>>
  ] = useState<IQuickLinkApiResponse[] | null>(null);
  const [isError, setIsError]: [
    boolean,
    React.Dispatch<React.SetStateAction<boolean>>
  ] = useState<boolean>(false);
  const showQuickLinkView: () => void = () => {
    setShowQuickLink(true);
    gtmAnalytics.pushEvent({
      event: "click",
      elementType: "link",
      elementTextOrLabel: "See all",
      elementLocation: "Left side panel"
    });
  };

  const showMainPanelView: () => void = () => {
    setShowQuickLink(false);
  };
  const togglePanel: () => void = () => {
    setIsOpen(!isOpen);
  };

  const closePanel: () => void = () => {
    setIsOpen(false);
    gtmAnalytics.pushEvent({
      event: "click",
      elementType: "icon",
      elementTextOrLabel: "close",
      elementLocation: "left side panel"
    })
  };

  useEffect(() => {
    (async () => {
      try {   
        logger.info(`Displayed new Home Page, orgId: ${getUserOrganisation()}`)       
        const responseapidata: IFetchQuickLinkDetailsFunctionResponse| null | undefined  = await fetchQuickLinkDetails(); 
       if( responseapidata !=null )
       { 
        setQuickLinkData(responseapidata?.response);
        setIsError(responseapidata.status);        
       }
       
      } catch (error) { 
        console.log(error);       
      }      
    })();
  }, []);
  
  return isPermission ? (
    <>
      <Grid className="app">
        <GridItem
          className={isOpen ? "side-margin" : "side-margin-closed"}
          lg={isOpen ? 3 : 2}
          md={isOpen ? 2 : 1}
          sm={isOpen ? 1 : 0} children={undefined}        >
          <SidePanelView
            isOpen={isOpen}
            togglePanel={togglePanel}
            closePanel={closePanel}
            showQuickLinkView={showQuickLinkView}
            showMainPanelView={showMainPanelView}
            setQuickLinkData={setQuickLinkData}
            quicklinkData={isError ? [] : quickLinkData}
            data-testid="btn-show-quick-link"
          />
        </GridItem>
        <GridItem
          className="body-panel"
          lg={isOpen ? 9 : 10}
          md={isOpen ? 6 : 7}
          sm={isOpen ? 3 : 4} children={undefined}        >
          {showQuickLink ? (
            isPermissionquicklink &&
            <QuickLinkLogic
              setQuickLinkData={setQuickLinkData}
              apiQuickLinkData={isError ? [] : quickLinkData}
              isOpen ={isOpen}
            />
          ) : (
            <MainPanelView />
          )}
        </GridItem>
      </Grid>
    </>
  ) : (
    <Redirect to="/noAccess" />
  );
};

export default NewHomepageView;