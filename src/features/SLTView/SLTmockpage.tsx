/* istanbul ignore file */
import { Grid, GridItem } from "@essnextgen/ui-kit";
import React,{  useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import SIMSupdatesView from "../MainPanel/SIMSUpdates/SIMSupdates.view";
import WelcomeUser from "../MainPanel/WelcomeUser/WelcomeUser.logic";
import SidePanelView from "../SidePanel/SidePanel.view";
import {
  IFetchQuickLinkDetailsFunctionResponse,
  IQuickLinkApiResponse
} from "../../shared/model/quickLink/responsemodels";
import { fetchQuickLinkDetails } from "../../shared/components/QuickLink/Quicklinkresponse";
import "../SidePanel/style.scss";
import "./style.scss";
import QuickLinkLogic from "../../pages/QuickLinks";
import { useFetchSchoolNameData } from "../../shared/services/schoolDomain/schoolServices";
import { ISchoolNameDataResponse } from "../../shared/model/SchoolDomain/responsemodels";

import PupilSVG from "./SVGcomponents/PupilSVG";
import WholeSchoolOverviewSVG from "./SVGcomponents/WholeSchoolOverviewSVG";
import BehaviourOverviewSVG from "./SVGcomponents/BehaviourOverviewSVG";
import AttendanceOverviewSVG from "./SVGcomponents/AttendanceOverviewSVG";
import SchoolCalendarSVG from "./SVGcomponents/SchoolCalendarSVG";
import FinanceReportingSVG from "./SVGcomponents/FinanceReportingSVG";
import SwitchView from "../MainPanel/SwitchView/SwitchView.view";


const SLTmockpage: () => JSX.Element = () => {
   const location: Location = useLocation(); 
  const currentPath: string = location.pathname;
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
  const [schoolName, setSchoolName]: [
    string,
    React.Dispatch<React.SetStateAction<string>>
  ] = useState<string>("");
  useEffect(() => {
    const fetchSchoolNames: () => Promise<void> = async () => {
      setIsError(false);
      try {
        const schoolData: ISchoolNameDataResponse | null =
          await useFetchSchoolNameData();

        const schoolNames: string =
          schoolData == null ? "" : schoolData.schoolName;

        setSchoolName(schoolNames);
        setIsError(false);
      } catch (error) {
        setSchoolName("");
        setIsError(true);
      }
    };

    fetchSchoolNames();
  }, [setSchoolName, setIsError]);

  const fetchAndSetQuickLinkData : () => Promise<void>= async (
   
  ) => {
    try {
      const responseapidata:
        | IFetchQuickLinkDetailsFunctionResponse
        | null
        | undefined = await fetchQuickLinkDetails();
      if (responseapidata != null) {
        setQuickLinkData(responseapidata.response);
        setIsError(responseapidata.status);
      }
    } catch (error) {
      console.error(error);
    }
  };
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
      await fetchAndSetQuickLinkData();
    })();
  }, []);

  const svgpath: () => JSX.Element = () => (
     <>
     <div className="pupil-svg">
     <PupilSVG />
     </div>
    
     <div className="wholeschool-svg">
     <WholeSchoolOverviewSVG />
     </div>

     <div className="attendance-svg">
      <AttendanceOverviewSVG/>
     </div>      
         
    <div className="behaviour-svg">
      <BehaviourOverviewSVG/>
    </div> 

    <div className="calendar-svg">
      <SchoolCalendarSVG/>
      </div>
  
  <div className="finance-svg">
     <FinanceReportingSVG/>
  </div>
    
     </>
    );
  const renderContent: () => JSX.Element = () => {
    if (showQuickLink) {
      return (
        <div className={isOpen? "":"sltquicklink"}>
        <QuickLinkLogic
          setQuickLinkData={setQuickLinkData}
          apiQuickLinkData={
            isError ? [] : /* istanbul ignore next */ quickLinkData
          }
          isOpen={isOpen}
        />
        </div>
      );
    }
    return (
      <>
      <div className="welcome-wid">
        <WelcomeUser
         isApiError={isError} organisationName={schoolName} />
         </div>
        {svgpath()}
        <div className="slt-sims">
          <SIMSupdatesView />
        </div>
        <div className="slt-mar">          
        <SwitchView
          path={currentPath}
          organisationName={schoolName}
          isApiError={isError} 
        />
        </div>
      </>
    );
  };
  return (
    <Grid>
      <GridItem lg={2}>
        <SidePanelView
          isOpen={isOpen}
          togglePanel={togglePanel}
          closePanel={closePanel}
          showQuickLinkView={showQuickLinkView}
          showMainPanelView={showMainPanelView}
          setQuickLinkData={setQuickLinkData}
          quicklinkData={isError ? [] : quickLinkData}
          data-testid="btn-show-quick-link"
          isSIMSIDAdmin={false}
        />
      </GridItem>
      <GridItem className="sltview">
        {renderContent()}
      </GridItem>
    </Grid>
  );
};

export default SLTmockpage;
