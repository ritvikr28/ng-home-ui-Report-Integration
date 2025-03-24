import React, { useState, useEffect } from 'react';
import {
  Notification as NotificationBanner,
  NotificationStatus
} from '@essnextgen/ui-kit';
import { useTranslation, UseTranslationResponse } from "@essnextgen/ui-intl-kit";
import './style.scss';
import { envConfig } from '../../utils';

export const WhatsNewBanner: () => JSX.Element = () => {
  const [isBannerVisible, setIsBannerVisible]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(true);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isBannerClosed = window.localStorage.getItem("isBannerClosed");
      setIsBannerVisible(isBannerClosed !== "true");
    }
  }, []);

  const handleExit = () => {
    try {
      window.localStorage.setItem("isBannerClosed", "true");
    } catch (error) {
      console.error("Failed to set localStorage:", error);
    }
    setIsBannerVisible(false);
  };

  const { t }: UseTranslationResponse<"translation", undefined> =
    useTranslation();

  return (
    <>
      {isBannerVisible && (
        <div>
          <NotificationBanner
            id='notification-banner-class-view'
            className="notification-banner-class-view"
            dataTestId="whatsnew-banner"
            title={t("classviewbanner.title")}
            message={
              <>
                <p>
                {t("classviewbanner.classviewtext")}
                </p>
                <div>
                  <a className='link-data' href={`${envConfig.CLASSVIEW_BASE_URL}`} target="_blank" rel="noopener noreferrer">
                  {t("classviewbanner.classviewlinktext")}
                  </a>
                  <span>
                    <a className='link-data' 
                        href=' https://www.ess-sims.co.uk/trial-sims-class-view?utm_source=website&utm_medium=organic&utm_campaign=sngclassviewhp&utm_content=maintestlp'
                        target="_blank" rel="noopener noreferrer">
                        {t("classviewbanner.learnmorelinktext")}
                    </a>
                  </span>
                </div>
              </>
            }
            status={NotificationStatus.HIGHLIGHT}
            onClickClose={handleExit}
          />
        </div>
      )}
    </>
  );
};
export default WhatsNewBanner;