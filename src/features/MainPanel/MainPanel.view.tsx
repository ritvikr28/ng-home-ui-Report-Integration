import { MatchPermissions, Permission, authService } from "@essnextgen/auth-ui";
import {
  Divider,
  Grid,
  GridItem
} from "@essnextgen/ui-kit";
import { hasFeaturePermission } from "@essnextgen/ui-flagr";
import WelcomeUser from "./WelcomeUser/WelcomeUser.logic";
import StaffTimeTableView from "./StaffTimeTable/StaffTimeTable.view";
import TakeRegisterView from "./TakeRegisters/TakeRegister.view";
import "./style.scss";
import { IMainPanelProps } from "./MainPanelProps";
import Search from "./PupilProfileSearch/Search.logic";
import SltViewBett from "./SltViewBETT/SltViewBett.view";
import { envConfig } from "../../shared/utils";
import { isOrganisationInVariant } from "../../shared/utils/flagr-utils";
import { SIMSupdatesView } from "../../shared/components/SIMSUpdates/SIMSupdates.view";
import { FilledLeftPanelIcon } from "../../shared/components/CommonElement/FilledButton";
import { TestingComponent } from "../../TestingComponent";

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
  const hasSignOutFlagEnabled: boolean = hasFeaturePermission(
    `${envConfig.APPLICATION}`,
    "SignOutFlag"
  );
  console.log("hasSignOutFlagEnabled homepage", hasSignOutFlagEnabled);


  return (
    <div>
      <Grid className="new-margin-b-container">
        {!isOpen && (
          <GridItem className="c-clear-padding">
            <button
              type="button"
              className="new-sidepanel-toggle-btn"
              onClick={togglePanel}
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
      {authService.isAuthorised(
        requiredPupilProfilePermissions,
        MatchPermissions.all
      ) && (
        <>
          <Search isOpen={isOpen} />
          <div className="new-divider-spacing">
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
            <div className="new-divider-spacing">
              <Divider />
            </div>
          </>
        )}
      <div className="sims-section-footer c-clear-padding">
        <SIMSupdatesView isOpen={isOpen} />
      </div>

      {hasSignOutFlagEnabled && <TestingComponent />}
    </div>
  );
};

export default MainPanelView;
