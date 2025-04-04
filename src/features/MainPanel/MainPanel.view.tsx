import { MatchPermissions, Permission, authService } from "@essnextgen/auth-ui";
import {
  Button,
  ButtonColor,
  ButtonSize,
  Divider,
  Grid,
  GridItem,
  IconColor,
  useMediaQuery
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
import WhatsNewBanner from "../../shared/components/Notification-menu/ClassViewWhatsNewBanner";

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

  const hasSLTviewOrgPermission: boolean =
    isOrganisationInVariant("SLTviewBETTORG");

  const togglePanel: () => void = () => {
    setIsOpen(!isOpen);
  };
  const isMobileView: boolean = useMediaQuery(
    "(min-width:320px) and (max-width: 1023.9px)"
  );

  const ClassViewNotificationBanner: boolean = hasFeaturePermission(
    `${envConfig.APPLICATION}`,
    "ClassViewNotificationBanner"
  );
  return (
    <div>
        {(!isMobileView && ClassViewNotificationBanner) && (<WhatsNewBanner />)}
      <Grid className="new-margin-b-container">
        {!isOpen && (
          <GridItem className="c-clear-padding">
            <Button
              className="new-sidepanel-toggle-btn"
              color={ButtonColor.Utility}
              dataTestId="btn-collapse"
              iconColor={IconColor.Neutral800}
              iconName="open-panel--left--filled"
              onClick={togglePanel}
              size={ButtonSize.Small}
              ariaLabel="new-sidepanel-toggle-btn"
            />
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
          requiredSLTviewPermissions,
          MatchPermissions.all
        ) && (
          <>
            <SltViewBett />
            <div className="new-divider-spacing">
              <Divider />
            </div>
          </>
        )}
      <div className="new-margin-b-container">
        <SIMSupdatesView isOpen={isOpen} />
      </div>
    </div>
  );
};

export default MainPanelView;
