import { MatchPermissions, Permission, authService } from "@essnextgen/auth-ui";
import { Grid, GridItem } from "@essnextgen/ui-kit";
import WelcomeUser from "./WelcomeUser/WelcomeUser.logic";
import StaffTimeTableView from "./StaffTimeTable/StaffTimeTable.view";
import TakeRegisterView from "./TakeRegisters/TakeRegister.view";
import SIMSupdatesView from "./SIMSUpdates/SIMSupdates.view";
import "./style.scss";
import SwitchViewLogic from "./SwitchView/SwitchView.logic";
import { IMainPanelProps } from "./MainPanelProps";

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

const MainPanelView:(props: IMainPanelProps) => JSX.Element = (
  props: IMainPanelProps
) => {
  const {
    schoolName,
    isError,
    isSchoolPrimary
  }: IMainPanelProps = props;

  return(
  <Grid>
    <GridItem className="teacher-panel-container">
      <WelcomeUser
      isApiError={isError} 
      organisationName={schoolName}
      />
      {authService.isAuthorised(
      requiredStaffTimeTablePermissions,
      MatchPermissions.all
    ) &&isSchoolPrimary===false &&<StaffTimeTableView />}
      <TakeRegisterView />
      <div className="divider-container"/>            
      <SIMSupdatesView/>
      <SwitchViewLogic
            organisationName={schoolName}
            isApiError={isError} 
      />
    </GridItem>
  </Grid>
  )
};


export default MainPanelView;
