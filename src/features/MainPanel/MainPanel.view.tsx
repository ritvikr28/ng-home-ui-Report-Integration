import { MatchPermissions, Permission, authService } from "@essnextgen/auth-ui";
import { hasFeaturePermission } from "@essnextgen/ui-flagr";
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

const requiredTeacherPermissions: Permission[] = [
  {
    Securable: 'NG.Homepage.Teacher',

    Operation: 'View'
  }
]

const requiredSLTPermissions: Permission[] = [
  {
    Securable: 'NG.Homepage.SLT',

    Operation: 'View'
  }
]


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
  const hasSltViewPermission:boolean=hasFeaturePermission('SLTView');
  console.log(hasSltViewPermission);
  return(
  <Grid dataTestId="mainPanelView">
    <GridItem className="teacher-panel-container">
      <WelcomeUser
      isApiError={isError} 
      organisationName={schoolName}
      isOpen={isOpen}
      />      
      {authService.isAuthorised(
      requiredStaffTimeTablePermissions,
      MatchPermissions.all
    ) &&isSchoolPrimary===false && authService.isAuthorised(
      requiredTeacherPermissions,
      MatchPermissions.all
    ) &&<StaffTimeTableView  isOpen={isOpen} />}
     {authService.isAuthorised(
      requiredTeacherPermissions,
      MatchPermissions.all
    ) && <TakeRegisterView  isOpen={isOpen} setIsOpen={setIsOpen} />}
      
        {hasSltViewPermission &&  authService.isAuthorised(
      requiredSLTPermissions,
      MatchPermissions.all
    ) &&  authService.isAuthorised(
      requiredPupilProfilePermissions,
      MatchPermissions.all
    ) &&
        <><div className={isOpen ? "divider-container open-divider" : "divider-container"} /><Search isOpen={isOpen} /></>}  
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
