import React from "react";
import {
  Notification,
  NotificationStatus,
  useMediaQuery
} from "@essnextgen/ui-kit";
import { useTranslation, UseTranslationResponse } from "@essnextgen/ui-intl-kit";
import { INotificationProps } from "../../SIMSIDAdmin/Components/NotificationView/NotificationProps";
import "../style.scss";

const NotifyExceptionView: React.FC<INotificationProps> = ({ setDisableNotification }) => {
  const { t }: UseTranslationResponse<"translation", undefined> =
    useTranslation();

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
              {t("RefreshDB_T.moduleBlock.notifyException.title")}
            </div>
        </div>
        }
        onClickClose={() => setDisableNotification(false)}
        status={NotificationStatus.WARNING}
        title={t("RefreshDB_T.moduleBlock.notifyException.content")}
    />}
  </div>
  </>
)};

export default NotifyExceptionView;
