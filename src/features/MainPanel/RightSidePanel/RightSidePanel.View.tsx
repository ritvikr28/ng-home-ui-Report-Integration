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
import { IRightSidePanelViewProps } from "./RightSidePanelViewProps";
import { envConfig } from "../../../shared/utils/constants";

export const RightSidePanelView: (
  props: IRightSidePanelViewProps
) => JSX.Element = (props: IRightSidePanelViewProps) => {
  const {
    SchoolEventexternalId,
    EventTitle,
    EventTime,
    StaffName,
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
    EventPeriodNo
  }: IRightSidePanelViewProps = props;

  const handlePanelClose = () => {
    togglePanel(SchoolEventexternalId);
  };

  const onTRButtonClick = () => {
    const url = (EventTypeCode === "AttendanceSession")
      ? `${envConfig.REGISTER_BASE_URL}/take-register/${EventPeriodNo}/${BaseGroupId}/${EventInstanceExternalId}`
      : `${envConfig.REGISTER_BASE_URL}/take-register/${ClassPeriodExternalId}/${BaseGroupId}/${EventInstanceExternalId}`;
    window.open(url, "_blank");
  };

  
  return (
    <div
      data-testid="side-panel"
      className="side-panel"
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
          <div className="side-panel-main-container">
            <div
              className="essui-global-typography-default-control-label margin-bottom-label"
              data-testid="time-label"
            >
              Time:
            </div>
            <div
              className="essui-global-typography-default-body margin-bottom"
              data-testid="time-value"
            >
              {EventTime}
            </div>
            <div
              className="essui-global-typography-default-control-label margin-bottom-label"
              data-testid="staff-label"
            >
              Staff:
            </div>
            <div
              className="essui-global-typography-default-body margin-bottom"
              data-testid="staff-value"
            >
              {StaffName}
            </div>
            <div
              className="essui-global-typography-default-control-label margin-bottom-label"
              data-testid="location-label"
            >
              Location:
            </div>
            <div
              className="essui-global-typography-default-body margin-bottom"
              data-testid="location-value"
            >
              {Location}
            </div>

            <div data-testid="horizontal-panel-divider" className="divider">
              <Divider
                as="li"
                dataTestId="panel-divider"
                id="panel-divider"
                orientation={Orientation.HORIZONTAL}
                role="separator"
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
                register
              </span>

              <span data-testid="take-reg">
                <Button
                  dataTestId="take-reg-button"
                  size={ButtonSize.Small}
                  color={ButtonColor.Secondary}
                  onClick={onTRButtonClick}
                >                  
                  Take register
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
                    data-testid="error-loader"
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
                  <div className="margin-24">
                    <div className="parent">
                      {GroupMembersData?.map((pupil, index) => (
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
                            href={`${envConfig.LEARNER_UI_URL}/${pupil.pupilExternalId}`}
                          >
                            {pupil.personalInfo.preferredForename}{" "}
                            {pupil.personalInfo.preferredSurname}
                          </Link>
                        </span>
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </SidePanelContent>

        <SidePanelFooter>
          <Button
            size={ButtonSize.Medium}
            className="btn-full-width cancel-btn"
            onClick={() => handlePanelClose()}
            id="close-button-id"
            dataTestId="close-button"
          >
            Close
          </Button>
        </SidePanelFooter>
      </SidePanel>
    </div>
  );
};
