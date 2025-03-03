import { useState } from 'react';
import {
  Notification as NotificationBanner,
  NotificationStatus
} from '@essnextgen/ui-kit';
import './style.scss';
import { envConfig } from '../../utils';

export const WhatsNewBanner: () => JSX.Element = () => {
  const [isBannerVisible, setIsBannerVisible] = useState(true);

  const handleExit: () => void = () => {
    localStorage.setItem('isBannerClosed', 'true');
    setIsBannerVisible(false);
  };

  return (
    <>
      {isBannerVisible && (
        <div >
          <NotificationBanner
            id='notification-banner-class-view'
            className="notification-banner-class-view"
            dataTestId="whatsnew-banner"
            title="Spot issues early. Support students better."
            message={
              <>
                <p>
                  Class view makes it easier to intervene early and improve student outcomes.
                </p>
                <div>
                  <a className='link-data' href={envConfig.CLASSVIEW_BASE_URL} target="_blank" rel="noopener noreferrer">
                    Open class view
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
            onClickClose={() => handleExit()}
          />
        </div>
      )}
    </>
  );
};

export default WhatsNewBanner;