import React from "react";
import { Notification, NotificationStatus } from "@essnextgen/ui-kit";


const InformationUnavailableBanner: React.FC = () => (
    <Notification
        data-testid="warning-banner"
        className="information-unavailable-banner"
        title="Information unavailable"
        status={NotificationStatus.WARNING}
        message="A technical issue at our end has stopped us from displaying some information. Please try again later. If the issue persists, please get in touch with our support team."
    />
);

export default InformationUnavailableBanner;