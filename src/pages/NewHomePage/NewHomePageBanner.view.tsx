/* eslint-disable import/no-duplicates */
import React from "react";
import WhatsNewBanner from "../../shared/components/Notification-menu/ClassViewWhatsNewBanner";
import SIMSConnectedLauncher from "../../shared/components/Notification-menu/SIMSConnectedLauncherBanner";
import { useSimsConnectedBanner } from "../../shared/hooks/useSimsConnectedBanner";

export const NewHomePageBanner: React.FC = () => {
    const [hasConnectedLauncher]:[boolean] = useSimsConnectedBanner();  
    if (hasConnectedLauncher) {
        return (
            <div data-testid="sims-launcher">
                <SIMSConnectedLauncher />
            </div>
        );
    }
    else  {  
        return (
            <div data-testid="whats-new-banner">
                <WhatsNewBanner />
            </div>
        );
    }    
};

export default NewHomePageBanner;