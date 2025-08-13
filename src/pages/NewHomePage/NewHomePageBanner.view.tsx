/* eslint-disable import/no-duplicates */
import { useState, useEffect } from "react";
import React from "react";
import WhatsNewBanner from "../../shared/components/Notification-menu/ClassViewWhatsNewBanner";
import SIMSConnectedLauncher from "../../shared/components/Notification-menu/SIMSConnectedLauncherBanner";
import { fetchLinks } from "../../shared/hooks/useSIMSNextGenLinks";
import { BannerProps } from "./NewHomePage.props";

export const NewHomePageBanner: React.FC<BannerProps> = ({
    showClassViewNotification,
    setShowClassViewNotification
}) => {
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [hasConnectedLauncher, sethasConnectedLauncher]: [
        boolean,
        React.Dispatch<React.SetStateAction<boolean>>
    ] = useState<boolean>(false);

    const fetchSimsConnectedLink: () => Promise<void> = async () => {
        setIsLoading(true);
        try {
                    const responseapidata = await fetchLinks();
                    sethasConnectedLauncher(responseapidata);
                    setIsLoading(false);
                    // showClassViewNotification = false;
                    setShowClassViewNotification(false);

        } catch (error) {
            setIsLoading(false);
            console.log(error);
        }
    };

    useEffect(() => {
        (async () => {
            await fetchSimsConnectedLink();
        })();
    }, []);

    const renderBanner = () => {
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

    return renderBanner();
};

export default NewHomePageBanner;