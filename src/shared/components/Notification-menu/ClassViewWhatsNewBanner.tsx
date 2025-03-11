import React, { useState, useEffect } from 'react';
import {
  Notification as NotificationBanner,
  NotificationStatus
} from '@essnextgen/ui-kit';
import './style.scss';
import { envConfig } from '../../utils';

export const WhatsNewBanner: () => JSX.Element = () => {
  const [isBannerVisible, setIsBannerVisible]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(true);
  useEffect(() => {
    const isBannerClosed: string | null = sessionStorage.getItem('isBannerClosed');
    if (isBannerClosed === 'true') {
      setIsBannerVisible(false);
    }
  }, []);

  const handleExit: () => void = () => {
    sessionStorage.setItem('isBannerClosed', 'true');
    setIsBannerVisible(false);
  };

  return (
    <>
      {isBannerVisible && (
        <div>
          <NotificationBanner
            id='notification-banner-class-view'
            className="notification-banner-class-view"
            dataTestId="whatsnew-banner"
            title="Want more time to teach?"
            message={
              <>
                <p>
                Key pupil information and essential classroom tasks are now all in one place.
                </p>
                <div>
                  <a className='link-data' href={`${envConfig.CLASSVIEW_BASE_URL}`} target="_blank" rel="noopener noreferrer">
                    Open Class View
                  </a>
                  <span>
                    <a className='link-data' 
                        href=' https://www.ess-sims.co.uk/trial-sims-class-view?utm_source=website&utm_medium=organic&utm_campaign=sngclassviewhp&utm_content=maintestlp'
                        target="_blank" rel="noopener noreferrer">
                        Learn more
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