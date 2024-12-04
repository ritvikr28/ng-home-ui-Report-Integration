import React from "react";
import {
  Notification,
  NotificationStatus,
  useMediaQuery
} from "@essnextgen/ui-kit";
import { INotificationProps } from "../../SIMSIDAdmin/Components/NotificationView/NotificationProps";
import "../style.scss";

const NotifyExceptionView: React.FC<INotificationProps> = ({ setDisableNotification }) => {
  const isMobileView: boolean = useMediaQuery(
    "(min-width:319.9px)"
  );
  return (
    <>
    <div className="admin-heading heading-text-up admin-heading-psas1334f">
    {isMobileView && <Notification
        id="notification-open-panel"
        dataTestId="notification-test-id"
        escapeExits
        message={
        <div className="secondary-text-simsid">
            <br />
            <div className="secondary-text-simsid-admin-sec-heading">
            A technical issue at our end has stopped us from completing your request. Please try again later. If the issue persists please get in touch with our support team.
            </div>
        </div>
        }
        onClickClose={() => setDisableNotification(false)}
        status={NotificationStatus.WARNING}
        title="Unable to process the request."
    />}
  </div>
  </>
)};

export default NotifyExceptionView;
