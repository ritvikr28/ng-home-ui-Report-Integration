import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import { authService, MatchPermissions, Permission } from "@essnextgen/auth-ui";
import "./style.scss";
import { Grid, GridItem, useMediaQuery } from "@essnextgen/ui-kit";
import SidePanelView from "../../features/SidePanel/SidePanel.view";
import QuickLinkLogic from "../QuickLinks";
import { fetchQuickLinkDetails } from "../../shared/components/QuickLink/Quicklinkresponse";
import { IFetchQuickLinkDetailsFunctionResponse, IQuickLinkApiResponse } from "../../shared/model/quickLink/responsemodels";
import { logger } from "../../shared/components/AppInsights";
import MainPanel from "../../features/MainPanel/MainPanel.logic";
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

// const fetchAndSetQuickLinkData = async (
//   setQuickLinkData: Dispatch<SetStateAction<IQuickLinkApiResponse[] | null>>,
//   setIsError: Dispatch<SetStateAction<boolean>>
// ) => {
//   try {
//     logger.info(`Displayed new Home Page, orgId: ${getUserOrganisation()}`);
//     const responseapidata: IFetchQuickLinkDetailsFunctionResponse | null | undefined = await fetchQuickLinkDetails();
//     if (responseapidata != null) {
//       setQuickLinkData(responseapidata.response);
//       setIsError(responseapidata.status);
//     }
//   } catch (error) {
//     console.error(error);
//   }
// };

const NewHomepageView: React.FC = () => {
  const isPermission: boolean = authService.isAuthorised(requiredPermissions, MatchPermissions.all);
  const isPermissionquicklink: boolean = authService.isAuthorised(requiredPermissionsforquicklink, MatchPermissions.all);

  const [isOpen, setIsOpen]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(true);
  const [showQuickLink, setShowQuickLink]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);

  const [quickLinkData, setQuickLinkData]: [
    IQuickLinkApiResponse[] | null,
    React.Dispatch<React.SetStateAction<IQuickLinkApiResponse[] | null>>
  ] = useState<IQuickLinkApiResponse[] | null>(null);
  const [isError, setIsError]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);

  const isTabletView: boolean = useMediaQuery('(min-width:320px) and (max-width: 1023.9px)');
  // const isMiniMobileView = useMediaQuery('(min-width:390px) and (max-width: 767.9px)');
  const [isLoader, setLoader]:[boolean,React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(true);

  const showQuickLinkView: () => void = () => {
    setShowQuickLink(true);
  };

  const showMainPanelView: () => void = () => {
    setShowQuickLink(false);
  };

  const togglePanel: () => void = () => {
    setIsOpen(!isOpen);
  };

  const closePanel: () => void = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    (async () => {
      try {   
        logger.info(`Displayed new Home Page, orgId: ${getUserOrganisation()}`)
        gtmAnalytics.pushPageViewEvent(); 
        const responseapidata: IFetchQuickLinkDetailsFunctionResponse| null | undefined  = await fetchQuickLinkDetails(); 
       /* istanbul ignore next */
        if( responseapidata !=null )
       { 
        setQuickLinkData(responseapidata.response);
        setIsError(responseapidata.status);
        setLoader(false);     
       }
       
      } catch (error) { 
        setLoader(false); 
        console.log(error);       
      }      
    })();
  }, []);

  const renderContent = () => {
    if (showQuickLink && isPermissionquicklink) {
      return (
        <QuickLinkLogic
          setQuickLinkData={setQuickLinkData}
          apiQuickLinkData={isError ? [] : /* istanbul ignore next */ quickLinkData}
          isOpen={isOpen}
        />
      );
    }
    return <MainPanel isOpen={isOpen} setIsOpen={setIsOpen} />;
  };

  return isPermission ? (
    <>
    <Grid className="app" dataTestId="NewHomePage">
      <GridItem className={isOpen ? "side-margin" : "side-margin-closed"} lg={isOpen ? 3 : 0} md={isOpen ? 0 : 0} sm={isOpen ? 1 : 0}>
        <SidePanelView
          isOpen={isOpen}
          togglePanel={togglePanel}
          closePanel={closePanel}
          showQuickLinkView={showQuickLinkView}
          showMainPanelView={showMainPanelView}
          setQuickLinkData={setQuickLinkData}
          quicklinkData={isError ? [] : quickLinkData}
          data-testid="btn-show-quick-link"
            isLoader ={isLoader}
        />
      </GridItem>
      {/* eslint-disable */}
      <GridItem className={!isTabletView ? (isOpen ? "body-open-panel" : "body-panel res-body" ):
         (isOpen ? "body-panel-mobile-open" : "body-panel-mobile")}
        lg={isOpen ? 9 : 10} md={isOpen ? 6 : 7} sm={isOpen ? 3 : 4}>
        {renderContent()}
      </GridItem>
      {/* eslint-enable */}
    </Grid>
    </>
  ) : (
    <Redirect to="/noAccess" />
  );
};

export default NewHomepageView;
