import React, { useState } from "react";
import { MatchPermissions, Permission, authService } from "@essnextgen/auth-ui";
import { Divider, Grid, GridItem } from "@essnextgen/ui-kit";
import { WistiaPlayer } from "@wistia/wistia-player-react";
import { useVideoPlayStatus } from "../../shared/hook/useVideoPlayStatus";
import WelcomeUser from "./WelcomeUser/WelcomeUser.logic";
import StaffTimeTableView from "./StaffTimeTable/StaffTimeTable.view";
import TakeRegisterView from "./TakeRegisters/TakeRegister.view";
import { StaffTimetableAndRegisterDetailsProvider } from "../../shared/context/StaffTimetableAndRegisterDetailsContext";
import "./style.scss";
import { IMainPanelProps } from "./MainPanelProps";
import Search from "./PupilProfileSearch/Search.logic";
import SltViewBett from "./SltViewBETT/SltViewBett.view";
import { SIMSupdatesView } from "../../shared/components/SIMSUpdates/SIMSupdates.view";
import { FilledLeftPanelIcon } from "../../shared/components/CommonElement/FilledButton";
import gtmAnalytics from '../../shared/utils/analytics';
import { saveVideoPlayStatus } from '../../shared/services/videoPlayStatusSave';

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

const canViewTimetable: boolean = authService.isAuthorised(
  [
    { Securable: "NG.Homepage.Timetable", Operation: "View" }
  ],
  MatchPermissions.all
);
const canViewRegisters: boolean = authService.isAuthorised(
  [
    { Securable: "NG.Homepage.Registers", Operation: "View" }
  ],
  MatchPermissions.all
);
const hasTimetableOrRegisterAccess = canViewTimetable || canViewRegisters;

const requiredSchoolOverviewPermissions: Permission[] = [
  {
    Securable: "NG.Homepage.SchoolOverview",
    Operation: "View"
  }
];

function canShowStaffTimetable(isSchoolPrimary: boolean): boolean {

  return (
    authService.isAuthorised(requiredStaffTimeTablePermissions, MatchPermissions.all) &&
    isSchoolPrimary === false
  );
}

function canShowRegister(): boolean {

  return authService.isAuthorised(requiredRegisterPermissions, MatchPermissions.all);
}

function canShowPupilProfile(): boolean {
  return authService.isAuthorised(requiredPupilProfilePermissions, MatchPermissions.all);
}

function canShowSLTviewBETT(): boolean {
  return (
    authService.isAuthorised(
      requiredSchoolOverviewPermissions,
      MatchPermissions.all
    )
  );
}

// async function handlePlay(videoStatusSaved: boolean, setVideoStatusSaved: (v: boolean) => void): Promise<void> {
//   gtmAnalytics.pushEvent({ event: "playVideo" });
//   if (!videoStatusSaved) {
//     try {
//       await saveVideoPlayStatus();
//       setVideoStatusSaved(true);
//     } catch (e) {
//       console.error("Video Played");
//     }
//   }
// }

function handlePercentWatchedChange(event: { detail: { percentWatched: number; lastPercentWatched: number; }; }): void {
  const { detail: { percentWatched, lastPercentWatched } }: { detail: { percentWatched: number; lastPercentWatched: number; }; } = event
  const percentage = percentWatched * 100;
  const lastPercentage = lastPercentWatched * 100;
  const milestones = [5, 25, 50, 75, 95];
  milestones.forEach((milestone) => {
    if (percentage >= milestone && lastPercentage < milestone) {
      gtmAnalytics.pushVideoEvent(milestone);
    }
  });
}

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

  const handlePlay: (videoStatusSaved: boolean, setVideoStatusSaved: (v: boolean) => void) => Promise<void> = React.useCallback(async (videoStatusSaved: boolean, setVideoStatusSaved: (v: boolean) => void) => {
    gtmAnalytics.pushEvent({ event: "playVideo" });
    if (!videoStatusSaved) {
      try {
        await saveVideoPlayStatus();
        setVideoStatusSaved(true);
      } catch (e) {
        console.error("Video Played");
      }
    }
  }, []);

  // const SLTviewBETT: boolean = hasFeaturePermission(
  //   `${envConfig.APPLICATION}`,
  //   "SLTviewBETT"
  // );

  // const homepageVideoOrgViewIncluded: boolean =
  //   isOrganisationInVariant("HomePageVideoFlag");

  // const hasSLTviewOrgPermission: boolean =
  //   isOrganisationInVariant("SLTviewBETTORG");

  const togglePanel: () => void = () => {
    setIsOpen(!isOpen);
  };

  const { isPlayed, apiError }: { isPlayed: boolean; apiError: boolean } = useVideoPlayStatus();
  const [videoStatusSaved, setVideoStatusSaved]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);


  const shouldShowVideo =
    !apiError &&
    isPlayed === false;

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

      <StaffTimetableAndRegisterDetailsProvider hasAccess={hasTimetableOrRegisterAccess}>
        {isSchoolPrimary !== undefined && canShowStaffTimetable(isSchoolPrimary) && <StaffTimeTableView isOpen={isOpen} />}
        {canShowRegister() && (
          <>
            <TakeRegisterView isOpen={isOpen} setIsOpen={setIsOpen} />
            <div className="new-divider-spacing">
              <Divider />
            </div>
          </>
        )}
      </StaffTimetableAndRegisterDetailsProvider>
      {canShowPupilProfile() && (
        <>
          <Search isOpen={isOpen} />
          <div className={!isPlayed ? "wistia-class new-divider-spacing" : "new-divider-spacing"}>
            <Divider />
          </div>
        </>
      )}

      {
        canShowSLTviewBETT() && (
          <>
            <SltViewBett />
            <div className={!isPlayed ? "wistia-class new-divider-spacing" : "new-divider-spacing"}>
              <Divider />
            </div>
          </>
        )}

      {shouldShowVideo && (
        <div className="wistia-palyer-video-class">
          <WistiaPlayer mediaId="w9mg776ol6"
            onPlay={() => handlePlay(videoStatusSaved, setVideoStatusSaved)}
            onEnded={() => gtmAnalytics.pushVideoEvent(100)}
            onPause={() => { }}
            onPercentWatchedChange={handlePercentWatchedChange}
          />
        </div>
      )}

      <div className="sims-section-footer c-clear-padding">
        <SIMSupdatesView isOpen={isOpen} />
      </div>
    </div>
  );
};

export default MainPanelView;
