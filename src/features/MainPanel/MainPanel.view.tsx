// import { useState, useEffect } from "react";
import { MatchPermissions, Permission, authService } from "@essnextgen/auth-ui";
import {
  Divider,
  Grid,
  GridItem
} from "@essnextgen/ui-kit";
import { hasFeaturePermission } from "@essnextgen/ui-flagr";
import { WistiaPlayer } from "@wistia/wistia-player-react";
import WelcomeUser from "./WelcomeUser/WelcomeUser.logic";
import StaffTimeTableView from "./StaffTimeTable/StaffTimeTable.view";
import TakeRegisterView from "./TakeRegisters/TakeRegister.view";
import { StaffTimetableAndRegisterDetailsProvider } from "../../shared/context/StaffTimetableAndRegisterDetailsContext";
import "./style.scss";
import { IMainPanelProps } from "./MainPanelProps";
import Search from "./PupilProfileSearch/Search.logic";
import SltViewBett from "./SltViewBETT/SltViewBett.view";
import { envConfig } from "../../shared/utils";
import { isOrganisationInVariant } from "../../shared/utils/flagr-utils";
import { SIMSupdatesView } from "../../shared/components/SIMSUpdates/SIMSupdates.view";
import { FilledLeftPanelIcon } from "../../shared/components/CommonElement/FilledButton";
import { homepageVideoOrgViewExcluded } from "../../Layout";
import gtmAnalytics from '../../shared/utils/analytics';
// import { saveVideoPlayStatus } from '../../shared/services/videoPlayStatusSave';
// import { fetchVideoPlayStatus } from "../../shared/services/videoPlayStatus";

const requiredStaffTimeTablePermissions: Permission[] = [
  {
    Securable: "NG.Calendar.Staff.Timetable",
    Operation: "View"
  },
  {
    Securable: "NG.Staff",
    Operation: "View"
  },
  {
    Securable: "NG.Homepage.Timetable",
    Operation: "View"
  }
];

const requiredRegisterPermissions: Permission[] = [
  {
    Securable: "NG.Homepage.Registers",
    Operation: "View"
  }
];

const requiredPupilProfilePermissions: Permission[] = [
  {
    Securable: "NG.Learner.Personal",
    Operation: "View"
  },
  {
    Securable: "NG.Learner.Registration",
    Operation: "View"
  },
  {
    Securable: "NG.Learner.Identifier",
    Operation: "View"
  },
  {
    Securable: "NG.Homepage.PupilProfile",
    Operation: "View"
  }
];

const requiredSchoolOverviewPermissions: Permission[] = [
  {
    Securable: "NG.Homepage.SchoolOverview",
    Operation: "View"
  }
];

const MainPanelView: (props: IMainPanelProps) => JSX.Element = (
  props: IMainPanelProps
) => {
  const {
    schoolName,
    isError,
    isSchoolPrimary,
    isOpen,
    setIsOpen
  }: IMainPanelProps = props;

  const SLTviewBETT: boolean = hasFeaturePermission(
    `${envConfig.APPLICATION}`,
    "SLTviewBETT"
  );

  const hasSLTviewOrgPermission: boolean =
    isOrganisationInVariant("SLTviewBETTORG");

  const togglePanel: () => void = () => {
    setIsOpen(!isOpen);
  };

  // const [isPlayed, setIsPlayed] = useState(false);

  // useEffect(() => {
  //   async function loadPlayStatus() {
  //     const result = await fetchVideoPlayStatus();

  //     if (result?.status === 200 && result.payload) {
  //       const playedValue =
  //         String(result.payload.isPlayed).toLowerCase() === "true";

  //       console.log("Converted isPlayed =", playedValue);
  //       setIsPlayed(playedValue);
  //     } else {
  //       setIsPlayed(false);
  //     }
  //   }

  //   loadPlayStatus();
  // }, []);

  async function handlePlay() {
    gtmAnalytics.pushEvent({ event: "playVideo" });
    // await saveVideoPlayStatus();
    console.log("The video has played.");
  }


  function handleOnEnded() {
    gtmAnalytics.pushVideoEvent(100);
    console.log("The video has ended!");
  };

  function handleOnPause() {
    console.log("the video has paused.");
  }

  // console.log("isPlayed value:", isPlayed);
  return (
    <div>
      <Grid className="new-margin-b-container">
        {!isOpen && (
          <GridItem className="c-clear-padding">
            <button
              type="button"
              className="new-sidepanel-toggle-btn"
              onClick={togglePanel}
              aria-label="toggle-button"
            >
              <FilledLeftPanelIcon />
            </button>
          </GridItem>
        )}
        <GridItem sm md lg xl xxl className="c-clear-padding">
          <WelcomeUser
            isApiError={isError}
            organisationName={schoolName}
            isOpen={isOpen}
            isSchoolNameToBeDisplayed
          />
        </GridItem>
      </Grid>

      <StaffTimetableAndRegisterDetailsProvider>
        {authService.isAuthorised(
          requiredStaffTimeTablePermissions,
          MatchPermissions.all
        ) &&
          isSchoolPrimary === false && <StaffTimeTableView isOpen={isOpen} />}
        {authService.isAuthorised(
          requiredRegisterPermissions,
          MatchPermissions.all
        ) && (
            <>
              <TakeRegisterView isOpen={isOpen} setIsOpen={setIsOpen} />
              <div className="new-divider-spacing">
                <Divider />
              </div>
            </>
          )}
      </StaffTimetableAndRegisterDetailsProvider>
      {authService.isAuthorised(
        requiredPupilProfilePermissions,
        MatchPermissions.all
      ) && (
          <>
            <Search isOpen={isOpen} />
            <div className="new-divider-spacing">
              {/* <div className={!isPlayed ? "wistia-class new-divider-spacing" : "new-divider-spacing"}> */}
              <Divider />
            </div>
          </>
        )}

      {SLTviewBETT &&
        hasSLTviewOrgPermission &&
        authService.isAuthorised(
          requiredSchoolOverviewPermissions,
          MatchPermissions.all
        ) && (
          <>
            <SltViewBett />
            {/* <div className={!isPlayed ? "wistia-class new-divider-spacing" : "new-divider-spacing"}> */}
            <div className="new-divider-spacing">
              <Divider />
            </div>
          </>
        )}

      {(homepageVideoOrgViewExcluded) ? (
        <div className="wistia-palyer-video-class">
          <WistiaPlayer mediaId="w9mg776ol6"
            onPlay={() => handlePlay()}
            onEnded={() => handleOnEnded()}
            onPause={() => handleOnPause()} />
        </div>
      ) : null}

      <div className="sims-section-footer c-clear-padding">
        <SIMSupdatesView isOpen={isOpen} />
      </div>
    </div>
  );
};

export default MainPanelView;
