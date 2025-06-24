import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import { authService, MatchPermissions, Permission } from "@essnextgen/auth-ui";
import "./style.scss";
import { hasFeaturePermission } from "@essnextgen/ui-flagr";

import { useMediaQuery } from "@essnextgen/ui-kit";
import QuickLinkLogic from "../QuickLinks";
import { fetchQuickLinkDetails } from "../../shared/components/QuickLink/Quicklinkresponse";
import {
  IFetchQuickLinkDetailsFunctionResponse,
  IQuickLinkApiResponse
} from "../../shared/model/quickLink/responsemodels";
import { logger } from "../../shared/components/AppInsights";
import MainPanel from "../../features/MainPanel/MainPanel.logic";
import { envConfig, getUserOrganisation } from "../../shared/utils";
import gtmAnalytics from "../../shared/utils/analytics";
import WhatsNewBanner from "../../shared/components/Notification-menu/ClassViewWhatsNewBanner";
import SidePanelView from "../../features/SidePanel/SidePanel.view";
import { useSIMSNextGenLinks } from "../../shared/hooks/useSIMSNextGenLinks";

const requiredPermissions: Permission[] = [
  {
    Securable: "NG.Homepage",
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
  const isPermission: boolean = authService.isAuthorised(
    requiredPermissions,
    MatchPermissions.all
  );

  const isMobileView: boolean = useMediaQuery(
    "(min-width:320px) and (max-width: 1023.9px)"
  );
  const [isOpen, setIsOpen]: [
    boolean,
    React.Dispatch<React.SetStateAction<boolean>>
  ] = useState<boolean>(!isMobileView);
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

  // const isMiniMobileView = useMediaQuery('(min-width:390px) and (max-width: 767.9px)');
  const [isLoader, setLoader]: [
    boolean,
    React.Dispatch<React.SetStateAction<boolean>>
  ] = useState<boolean>(true);

  const ClassViewNotificationBanner: boolean = hasFeaturePermission(
    `${envConfig.APPLICATION}`,
    "ClassViewNotificationBanner"
  );

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
    document.body.classList.add('no-scroll')
  }, [])

  useEffect(() => {
    (async () => {
      try {
        logger.info(`Displayed new Home Page, orgId: ${getUserOrganisation()}`);
        gtmAnalytics.pushPageViewEvent();
        const responseapidata:
          | IFetchQuickLinkDetailsFunctionResponse
          | null
          | undefined = await fetchQuickLinkDetails();
        /* istanbul ignore next */
        if (responseapidata != null) {
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

  console.log('UI-Application kit (Home):^1.1.5');
  console.log('UI-kit(Home):^0.24.0');
  
  const renderContent: () => JSX.Element = () => {
    /* istanbul ignore next */        
    const { hasConnectedLauncher } = useSIMSNextGenLinks();
    const shouldShowWhatsNew = !hasConnectedLauncher; 

    if (showQuickLink && isPermission) {
      return (
        <QuickLinkLogic
          setQuickLinkData={setQuickLinkData}
          apiQuickLinkData={
            isError ? [] : /* istanbul ignore next */ quickLinkData
          }
          isOpen={isOpen}
          togglePanel={togglePanel}
        />
      );
    }

    return <>
      {(ClassViewNotificationBanner && shouldShowWhatsNew) && (
        <div data-testid="whats-new-banner">
          <WhatsNewBanner />
        </div>
      )}
     <MainPanel isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  };

  return isPermission ? (
    <div className="new-container">
       
      {isOpen &&
      <div className="new-side-panel">
        <SidePanelView
          isOpen={isOpen}
          togglePanel={togglePanel}
          closePanel={closePanel}
          showQuickLinkView={showQuickLinkView}
          showMainPanelView={showMainPanelView}
          setQuickLinkData={setQuickLinkData}
          quicklinkData={isError ? [] : quickLinkData}
          data-testid="btn-show-quick-link"
          isLoader={isLoader}
          isSIMSIDAdmin={false}
        />
      </div>
}
      <div className={showQuickLink ? "new-main-panel-quicklink" : "new-main-panel"}>

        {renderContent()}
      </div>
    </div>
  ) : (
    <Redirect to="/noAccess" />
  );
};

export default NewHomepageView;
