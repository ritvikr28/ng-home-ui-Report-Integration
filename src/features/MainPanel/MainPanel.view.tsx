import { MatchPermissions, Permission, authService } from "@essnextgen/auth-ui";
import {  Grid, GridItem} from "@essnextgen/ui-kit";
import { hasFeaturePermission } from "@essnextgen/ui-flagr";
import WelcomeUser from "./WelcomeUser/WelcomeUser.logic";
import StaffTimeTableView from "./StaffTimeTable/StaffTimeTable.view";
import TakeRegisterView from "./TakeRegisters/TakeRegister.view";
import SIMSupdatesView from "./SIMSUpdates/SIMSupdates.view";
import "./style.scss";
// import SwitchViewLogic from "./SwitchView/SwitchView.logic";
import { IMainPanelProps } from "./MainPanelProps";
import Search from "./PupilProfileSearch/Search.logic";
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


const requiredSLTPermissions: Permission[] = [
  {
    Securable: 'NG.Homepage.SLT',

    Operation: 'View'
  }
]

const requiredAdminPermissions: Permission[] = [
  {
    Securable: "NG.Homepage.Admin",

    Operation: "View",
  }
];


const requiredPupilProfilePermissions: Permission[] = [
  {
    Securable: "Learner.Personal",

    Operation: 'View'
  },
  {
    Securable: "Learner.Registration",

    Operation: 'View'
  },
  {
    Securable: "Learner.Identifier",

    Operation: 'View'
  },
  {
    Securable: "NG.Homepage.PupilProfile",
    Operation: "View"
  }
]


const MainPanelView:(props: IMainPanelProps) => JSX.Element = (
  props: IMainPanelProps
) => {
  const {
    schoolName,
    isError,
    isSchoolPrimary,
    isOpen,
    setIsOpen
  }: IMainPanelProps = props;

  const hasAdminFlagrPermission: boolean =
    hasFeaturePermission(`${envConfig.APPLICATION}`, "AdminView") &&
    isOrganisationInVariant("AdminView");

  return (
    <div className={isOpen ? " " : "welcome-user-fixed-dertfsg11463f"}>
      <Grid dataTestId="mainPanelView">
        <GridItem className="teacher-panel-container-dertfsg11463f">
          <WelcomeUser
            isApiError={isError}
            organisationName={schoolName}
            isOpen={isOpen}
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

          {(authService.isAuthorised(
            requiredSLTPermissions,
            MatchPermissions.all
          ) ||
            (hasAdminFlagrPermission &&
              authService.isAuthorised(
                requiredAdminPermissions,
                MatchPermissions.all
              ))) &&
            authService.isAuthorised(
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
