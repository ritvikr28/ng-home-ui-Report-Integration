import { Redirect } from "react-router-dom";
import { authService, MatchPermissions, Permission } from "@essnextgen/auth-ui";
import "./style.scss";
import { Grid, GridItem } from "@essnextgen/ui-kit";
import { useEffect, useState } from "react";
import { envConfig } from "../../shared/utils";
import MainPanelView from "../../features/MainPanel/MainPanel.view";
import SidePanelView from "../../features/SidePanel/SidePanel.view";
import QuickLinkLogic from "../QuickLinks";
import { fetchQuickLinkDetails } from "../../shared/components/QuickLink/Quicklinkresponse";
import { IQuickLinkApiResponse } from "../../shared/model/quickLink/responsemodels";

const requiredPermissions: Permission[] = [
  {
    Securable: "NG.Homepage",

    Operation: "View",
  }
];

export const NewHomepageView = () => {
  const isPermission =
    authService.isAuthorised(requiredPermissions, MatchPermissions.all) &&
    envConfig.IS_NEWHOMEPAGE_ACCESSIBLE === "True";
  const [isOpen, setIsOpen] = useState(true);
  const [showQuickLink, setShowQuickLink] = useState(false);
  const [quickLinkData, setQuickLinkData] = useState<IQuickLinkApiResponse[] | null>(null);
   const [isError, setIsError] = useState<boolean>(false);
  const showQuickLinkView = () => {
    setShowQuickLink(true);
  };

  const showMainPanelView = () => {
    setShowQuickLink(false);
  };
  const togglePanel = () => {
    setIsOpen(!isOpen);
  };

  const closePanel = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    (async () => {
      try {          
        const responseapidata  = await fetchQuickLinkDetails(); 
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
        <GridItem lg={isOpen ? 2 : 1} sm={isOpen ? 3 : 2}>
          <SidePanelView
            isOpen={isOpen}
            togglePanel={togglePanel}
            closePanel={closePanel}
            showQuickLinkView={showQuickLinkView}
            showMainPanelView={showMainPanelView}
            setQuickLinkData = {setQuickLinkData}
            quicklinkData = {isError?[]:quickLinkData}
            data-testid="btn-show-quick-link"
          />
        </GridItem>
        <GridItem
          className="body-panel"
          lg={isOpen ? 10 : 11}
          sm={isOpen ? 3 : 2}
        >
          {showQuickLink ? <QuickLinkLogic  setQuickLinkData = {setQuickLinkData}  apiQuickLinkData={isError?[]:quickLinkData}/> : <MainPanelView />}
          
        </GridItem>
      </Grid>
    </>
  ) : (
    <Redirect to="/noAccess" />
  );
};
