/* eslint-disable import/no-duplicates */
import React from "react";
import WhatsNewBanner from "../../shared/components/Notification-menu/ClassViewWhatsNewBanner";
import SIMSConnectedLauncher from "../../shared/components/Notification-menu/SIMSConnectedLauncherBanner";
import { useSimsConnectedBanner } from "../../shared/hooks/useSimsConnectedBanner";
import { useEffect } from "react";
import { BannerProps } from "./NewHomePage.props";

export const NewHomePageBanner: React.FC<BannerProps> = ({
    showClassViewNotification,
    setShowClassViewNotification
}) => {
    const [hasConnectedLauncher, isLoading] = useSimsConnectedBanner();

    // Restore previous behavior: hide class view notification immediately after loading completes
    useEffect(() => {
        if (!isLoading) {
            setShowClassViewNotification(false);
        }
    }, [isLoading, setShowClassViewNotification]);

    if (hasConnectedLauncher && !isLoading) {
        return (
            <div data-testid="sims-launcher">
                <SIMSConnectedLauncher />
            </div>
        );
    }
    if (showClassViewNotification && !isLoading) {
        return (
            <div data-testid="whats-new-banner">
                <WhatsNewBanner />
            </div>
        );
    }
    return null;
};

export default NewHomePageBanner;