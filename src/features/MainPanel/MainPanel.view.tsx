import { MatchPermissions, Permission, authService } from "@essnextgen/auth-ui";
import {  Grid, GridItem} from "@essnextgen/ui-kit";
import WelcomeUser from "./WelcomeUser/WelcomeUser.logic";
import StaffTimeTableView from "./StaffTimeTable/StaffTimeTable.view";
import TakeRegisterView from "./TakeRegisters/TakeRegister.view";
import SIMSupdatesView from "./SIMSUpdates/SIMSupdates.view";
import "./style.scss";
import SwitchViewLogic from "./SwitchView/SwitchView.logic";
import { IMainPanelProps } from "./MainPanelProps";
import Search from "./PupilProfileSearch/Search.logic";

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
    isSchoolPrimary,
    isOpen,
    setIsOpen
  }: IMainPanelProps = props;
  
  return(
  <Grid dataTestId="mainPanelView">
    <GridItem className="teacher-panel-container">
      <WelcomeUser
      isApiError={isError} 
      organisationName={schoolName}
      isOpen={isOpen}
      />
       <Search/>        
      {authService.isAuthorised(
      requiredStaffTimeTablePermissions,
      MatchPermissions.all
    ) &&isSchoolPrimary===false &&<StaffTimeTableView  isOpen={isOpen} />}
      <TakeRegisterView  isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className={isOpen?"divider-container open-divider":"divider-container"}/>            
    
      <SIMSupdatesView isOpen={isOpen}/>
      <SwitchViewLogic
            organisationName={schoolName}
            isApiError={isError} 
      />
    </GridItem>
  </Grid>
  )
};


export default MainPanelView;
