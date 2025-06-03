import { useState, useEffect } from 'react';
import { Notification as NotificationBanner, NotificationStatus } from '@essnextgen/ui-kit';
import { useTranslation, UseTranslationResponse } from '@essnextgen/ui-intl-kit';
import './style.scss';
import { getUserOrganisation } from '../../utils';

interface Banner {
  orgId: string;
  isClosed: boolean;
}

export const SIMSConnectedLauncher: () => JSX.Element = () => {
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
            id="notification-banner-connected-launcher"
            className="notification-banner-class-view"
            dataTestId="connected-launcher-banner"
            title={t('simsNextGenLinksBanner.heading')}
            message={<p>{t('simsNextGenLinksBanner.subHeading')}</p>}
            status={NotificationStatus.HIGHLIGHT}
            onClickClose={handleExit}
          />
        </div>
      )}
    </>
  );
};

export default SIMSConnectedLauncher; 