import { MatchPermissions, Permission, authService } from "@essnextgen/auth-ui";
import { Grid, GridItem } from "@essnextgen/ui-kit";
import { hasFeaturePermission } from "@essnextgen/ui-flagr";
import WelcomeUser from "./WelcomeUser/WelcomeUser.logic";
import StaffTimeTableView from "./StaffTimeTable/StaffTimeTable.view";
import TakeRegisterView from "./TakeRegisters/TakeRegister.view";
import SIMSupdatesView from "./SIMSUpdates/SIMSupdates.view";
import "./style.scss";
// import SwitchViewLogic from "./SwitchView/SwitchView.logic";
import { IMainPanelProps } from "./MainPanelProps";
import Search from "./PupilProfileSearch/Search.logic";
import SltViewBett from "./SltViewBETT/SltViewBett.view";
import { envConfig } from "../../shared/utils";
import { isOrganisationInVariant } from "../../shared/utils/flagr-utils";

const requiredStaffTimeTablePermissions: Permission[] = [
  {
    Securable: 'NG.Calendar.Staff.Timetable',

    Operation: 'View'
  },
  {
    Securable: 'NG.Staff',

    Operation: 'View'
  },
  {
    Securable: 'NG.Homepage.Timetable',

    Operation: 'View'
  }
];

const requiredRegisterPermissions: Permission[] = [
  {
    Securable: 'NG.Homepage.Registers',

    Operation: 'View'
  }  
];

const requiredPupilProfilePermissions: Permission[] = [
  {
    Securable: "NG.Learner.Personal",
    Operation: 'View'
  },
  {
    Securable: "NG.Learner.Registration",
    Operation: 'View'
  },
  {
    Securable: "NG.Learner.Identifier",
    Operation: 'View'
  },
  {
    Securable: "NG.Homepage.PupilProfile",
    Operation: "View"
  }
];

const requiredSLTviewPermissions: Permission[] = [
  {
    Securable: "NG.Homepage.SLT",

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
  // //  ------------------Needed if sidepanel needs to be closed-----------------
  // const isClosedSidePanel: boolean = useMediaQuery(
  //   "(max-width: 1023.9px)"
  // );
  const hasSLTviewOrgPermission: boolean =
    isOrganisationInVariant("SLTviewBETTORG");

  //  -----------------To close sidepanel------------------------
  // useEffect(() => {
  //   SLTviewBETT &&
  //   hasSLTviewOrgPermission &&
  //   authService.isAuthorised(
  //     requiredSLTviewPermissions,
  //     MatchPermissions.all
  //   ) && isClosedSidePanel && setIsOpen ? setIsOpen(false) : setIsOpen && setIsOpen(true)

  // }, [isClosedSidePanel])



  return (
    <div className={isOpen ? " " : "welcome-user-fixed-dertfsg11463f"}>
      <Grid dataTestId="mainPanelView">
        <GridItem className="teacher-panel-container-dertfsg11463f">
          <WelcomeUser
            isApiError={isError}
            organisationName={schoolName}
            isOpen={isOpen}
            isSchoolNameToBeDisplayed={true}
          />
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
                <div
                  className={
                    isOpen
                      ? "divider-container-dertfsg11463f open-divider-dertfsg11463f"
                      : "divider-container-dertfsg11463f"
                  }
                />
              </>
            )}

          {authService.isAuthorised(
            requiredPupilProfilePermissions,
            MatchPermissions.all
          ) && (
              <>
                <Search isOpen={isOpen} />
                <div
                  className={
                    isOpen
                      ? "divider-container-dertfsg11463f open-divider-dertfsg11463f"
                      : "divider-container-dertfsg11463f"
                  }
                />
              </>
            )}
          {
            SLTviewBETT &&
            hasSLTviewOrgPermission &&
            authService.isAuthorised(
              requiredSLTviewPermissions,
              MatchPermissions.all
            ) &&
            (
              <>
                <SltViewBett isOpen={isOpen} />
                <div
                  className={
                    isOpen
                      ? "divider-container-dertfsg11463f open-divider-dertfsg11463f"
                      : "divider-container-dertfsg11463f"
                  }
                />
              </>
            )}

          <SIMSupdatesView isOpen={isOpen} />
          {/* <SwitchViewLogic
            organisationName={schoolName}
            isApiError={isError} 
      /> */}
        </GridItem>
      </Grid>
    </div>
  );
};


export default MainPanelView;
