import React, { useState, useEffect } from 'react';
import { Notification as NotificationBanner, NotificationStatus } from '@essnextgen/ui-kit';
import { useTranslation, UseTranslationResponse } from "@essnextgen/ui-intl-kit";
import './style.scss';
import { envConfig, getUserOrganisation } from '../../utils';

interface Banner {
  orgId: string;
  isClosed: boolean;
}
export const WhatsNewBanner: () => JSX.Element = () => {
  const [isBannerVisible, setIsBannerVisible]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);
  const orgId: string | undefined = getUserOrganisation();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedBanners: Banner[] = JSON.parse(localStorage.getItem("classViewBannerClosed") || "[]");

      const isClosed: boolean = storedBanners.some((item:Banner) => item.orgId === orgId && item.isClosed);

      setIsBannerVisible(!isClosed);
    }
  }, [orgId]);

  const handleExit = (): void => {
    try {
        const storedBanners: Banner[] = JSON.parse(localStorage.getItem("classViewBannerClosed") || "[]");
        const updatedBanners: Banner[] = storedBanners.filter((item: Banner) => item.orgId !== orgId);

        updatedBanners.push({ orgId: orgId || "", isClosed: true });

        localStorage.setItem("classViewBannerClosed", JSON.stringify(updatedBanners));
        setIsBannerVisible(false);

    } catch (error: unknown) { 
        console.error("Failed to update localStorage:", error);
    }
};

  const { t }: UseTranslationResponse<"translation", undefined> = useTranslation();

  return (
    <>
      {isBannerVisible && (
        <div>
          <NotificationBanner
            id="notification-banner-class-view"
            className="notification-banner-class-view"
            dataTestId="whatsnew-banner"
            title={t("classviewbanner.title")}
            message={
              <>
                <p>{t("classviewbanner.classviewtext")}</p>
                <div>
                  <a className="link-data" href={`${envConfig.CLASSVIEW_BANNER_URL}`} target="_blank" rel="noopener noreferrer">
                    {t("classviewbanner.classviewlinktext")}
                  </a>
                  <span>
                    <a
                      className="link-data"
                      href="https://www.ess-sims.co.uk/trial-sims-class-view?utm_source=website&utm_medium=organic&utm_campaign=sngclassviewhp&utm_content=maintestlp"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
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
