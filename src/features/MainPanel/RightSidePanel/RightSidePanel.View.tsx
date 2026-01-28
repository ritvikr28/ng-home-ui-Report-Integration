import {
  Avatar,
  Button,
  ButtonColor,
  ButtonSize,
  Divider,
  Link,
  Loader,
  LoaderType,
  Orientation,
  SidePanel,
  SidePanelContent,
  SidePanelFooter
} from "@essnextgen/ui-kit";
import "./style.scss";
import {
  useTranslation,
  UseTranslationResponse
} from "@essnextgen/ui-intl-kit";
import { IRightSidePanelViewProps } from "./RightSidePanelViewProps";
import { envConfig } from "../../../shared/utils/constants";
import gtmAnalytics from "../../../shared/utils/analytics";
import { logger } from "../../../shared/components/AppInsights";
import { getUser, getUserOrganisation } from "../../../shared/utils";



export const RightSidePanelView: (
  props: IRightSidePanelViewProps
) => JSX.Element = (props: IRightSidePanelViewProps) => {
  const {
    SchoolEventexternalId,
    EventTitle,
    EventTime,
    StaffName,
    CoverStaffName,
    Location,
    GroupMembersData,
    togglePanel,
    isOpen,
    GroupDescription,
    isLoader,
    errCodeMessage,
    pupilDetailErrorCodeMessage,
    isPupilSectionEnable,
    EventTypeCode,
    BaseGroupId,
    ClassPeriodExternalId,
    EventInstanceExternalId,
    EventPeriodNo,
    handleClassViewClick,
    classViewURL
  }: IRightSidePanelViewProps = props;

  const { t }: UseTranslationResponse<"translation", undefined> =
  useTranslation();

  const handlePanelClose:()=>void = () => {
    togglePanel(SchoolEventexternalId);
  };
 
  const onTRButtonClick: () => void = () => {
    const url: string = (EventTypeCode === "AttendanceSession")
      ? `${envConfig.REGISTER_BASE_URL}/take-register/${EventPeriodNo}/${BaseGroupId}/${EventInstanceExternalId}`
      : `${envConfig.REGISTER_BASE_URL}/take-register/${ClassPeriodExternalId}/${BaseGroupId}/${EventInstanceExternalId}`;

    logger.info(`Click on registers -${url} organisationId- ${getUserOrganisation()} userId- ${getUser()}`)

    gtmAnalytics.pushEvent({
      event: "click",
      linkText: "Take register",
      linkUrl: url,
      clickType: "button",
      clickLocation: "right_bar"
    });
    window.location.href = url
  };


  return (
    <div
      data-testid="side-panel"
      className="new-right-side-panel"
      key={SchoolEventexternalId}
    >
      <SidePanel
        dataTestId="right-panel-sidepanel"
        title={EventTitle}
        isOpen={isOpen}
        onClose={handlePanelClose}
        initialFocusElementId="close-button-id"
      >
        <SidePanelContent>
          <div>
            <div
              className="essui-global-typography-default-control-label"
              data-testid="time-label"
            >
              {t("homeStaffTimeTableEventTiles.time")}:
            </div>
            <div
              className="essui-global-typography-default-body margin-bottom"
              data-testid="time-value"
            >
              {EventTime}
            </div>
            <div
              className="essui-global-typography-default-control-label"
              data-testid="staff-label"
            >
              {t("homeStaffTimeTableEventTiles.staff")}:
            </div>
            <div
              className="essui-global-typography-default-body margin-bottom"
              data-testid="staff-value"
            >
              {StaffName}
            </div>
            {CoverStaffName && (
              <>
                <div
                  className="essui-global-typography-default-control-label"
                  data-testid="staff-label"
                >
                  {t("homeStaffTimeTableEventTiles.coverstaff")}:
                </div>
                <div
                  className="essui-global-typography-default-body margin-bottom"
                  data-testid="staff-value"
                >
                  {CoverStaffName}
                </div>
              </>
            )}
            <div
              className="essui-global-typography-default-control-label"
              data-testid="location-label"
            >
              {t("homeStaffTimeTableEventTiles.location")}:
            </div>
            <div
              className="essui-global-typography-default-body margin-bottom"
              data-testid="location-value"
            >
              {Location}
            </div>

            <div>
              { EventTypeCode !== 'TTNTPer' && BaseGroupId !== '00000000-0000-0000-0000-000000000000' && (
                    <div data-testid="class-view">
                      <Link
                        dataTestId="class-view-button"
                        id="class-view-button"
                        href={classViewURL}
                        onClick={handleClassViewClick}
                      >
                       {t("homeStaffTimeTableEventTiles.classview")}
                      </Link>
                    </div>
                  )
              }
            </div>

            <div data-testid="horizontal-panel-divider" className="divider-right-panel">
              <Divider
                as="li"
                dataTestId="panel-divider"
                id="panel-divider"
                orientation={Orientation.HORIZONTAL}
                role="separator"
                className="divider-right-panel"
              />
            </div>

            {isPupilSectionEnable &&
            <div
              data-testid="register-label"
              className="essui-global-typography-default-subtitle margin-24 div-container"
            >
              <span data-testid="register-text">
                {GroupDescription === null || GroupDescription === undefined
                  ? ""
                  : GroupDescription}{" "}
                {t("homeStaffTimeTableEventTiles.register")}
              </span>

              <span data-testid="take-reg">
                <Button
                  dataTestId="take-reg-button"
                  size={ButtonSize.Small}
                  color={ButtonColor.Secondary}
                  onClick={onTRButtonClick}
                >
                   {t("homeStaffTimeTableEventTiles.takeregister")}
                </Button>
              </span>
            </div>
}

            <div>
              {errCodeMessage ? (
                <div
                  data-testid="error-label"
                  className="essui-global-typography-default-body"
                >
                  {pupilDetailErrorCodeMessage}
                </div>
              ) : (
                isLoader && (
                  <Loader
                    dataTestId="error-loader"
                    className="loader-wrapper"
                    loaderText="Loading..."
                    loaderType={LoaderType.Circular}
                  />
                )
              )}

              {isLoader ? (
                <Loader
                  data-testid="data-loader"
                  className="loader-wrapper"
                  loaderText="Loading..."
                  loaderType={LoaderType.Circular}
                />
              ) : (
                GroupMembersData &&
                GroupMembersData.length > 0 && (
                  <>
                    <div className="parent">
                      {GroupMembersData.map((pupil, index) => (
                        <span className="child">
                          <Avatar
                            imagePath={
                              pupil.personImage && pupil.personImage.imagePath
                                ? pupil.personImage.imagePath
                                : ""
                            }
                            showDefaultAvatar={false}
                            dataTestId={`avtar-${index}`}
                          />
                          <Link
                            dataTestId={`link-${index}`}
                            href={`${envConfig.LEARNER_UI_URL}/profile/${pupil.pupilExternalId}`}
                            target="_self"
                          >
                            <span data-testId={`link-click-${index}`} onClick={() => gtmAnalytics.pushEvent({
                              event: "click",
                              linkText: "[RemovedPupilName]",
                              linkUrl: `${envConfig.LEARNER_UI_URL}/profile/${pupil.pupilExternalId}`,
                              clickType: "link",
                              clickLocation: "right_bar"
                            })}>
                              {pupil.personalInfo.preferredForename}{" "}
                              {pupil.personalInfo.preferredSurname}
                            </span>
                          </Link>
                        </span>
                      ))}
                    </div>
                  </>
                )
              )}
            </div>
          </div>
        </SidePanelContent>

        <SidePanelFooter>
          <Button
            size={ButtonSize.Medium}
            className="btn-full-width"
            onClick={() => handlePanelClose()}
            id="close-button-id"
            dataTestId="close-button"
          >
            {t("homeStaffTimeTableEventTiles.close")}
          </Button>
        </SidePanelFooter>
      </SidePanel>
    </div>
  );
};
