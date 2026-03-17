import React from "react";
import { Notification, NotificationStatus } from "@essnextgen/ui-kit";
import { useTranslation, UseTranslationResponse } from "@essnextgen/ui-intl-kit";


const InformationUnavailableBanner: React.FC = () => {
    const { t }: UseTranslationResponse<"translation", undefined> = useTranslation();
    return (
        <Notification
            data-testid="warning-banner"
            className="information-unavailable-banner"
            title={t("NotificationCenter_T.informationUnavailableTitle")}
            status={NotificationStatus.WARNING}
            message={t("NotificationCenter_T.informationUnavailableMessage")}
        />
    );
};

export default InformationUnavailableBanner;