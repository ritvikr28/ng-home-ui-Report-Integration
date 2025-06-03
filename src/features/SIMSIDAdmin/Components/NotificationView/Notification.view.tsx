import React from "react";
import {
  Grid,
  GridItem,
  Notification,
  NotificationStatus
} from "@essnextgen/ui-kit";
import {
  useTranslation,
  UseTranslationResponse
} from "@essnextgen/ui-intl-kit";
import { INotificationProps } from "./NotificationProps";
import "./style.scss";
import SIMSConnectedLauncher from "../../../../shared/components/Notification-menu/SIMSConnectedLauncherBanner";

const NotificationView: React.FC<INotificationProps> = ({
  setDisableNotification
}) => {
  const { t }: UseTranslationResponse<"translation", undefined> =
    useTranslation();

 

  return (
    <>
    <SIMSConnectedLauncher/>
    <Notification
      className="notification-id-sims"
      dataTestId="notification-test-id"
      escapeExits
      id="element-id"
      message={
        <div className="secondary-text-simsid">
          <br />
          <div className="secondary-text-simsid-admin-sec-heading">
          {t("initialadmin.whattodonext")}
          </div>

          <Grid>
            <GridItem className="secondary-text-span-simsid-admin">
              <span>{t("initialadmin.invitestaffmembers")} - </span>
              <div className="secondary-text-simsid-admin">
              {t("initialadmin.invitestaffdescription")}
              </div>
            </GridItem>

            <GridItem className="secondary-text-second-para">
              <span>{t("initialadmin.contactsimsmanager")} - </span>
              <div className="secondary-text-simsid-admin">
              {t("initialadmin.contactsimsdescription")}
              </div>
            </GridItem>
          </Grid>
        </div>
      }
      onClickClose={() => setDisableNotification(false)}
      status={NotificationStatus.HIGHLIGHT}
      title="You have limited access to SIMS Next Gen"
    />
    </>
  );
};

export default NotificationView;
