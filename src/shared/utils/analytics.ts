import TagManager from "react-gtm-module";
import { getUser, getUserOrganisation } from "./auth-helper";

declare global {
  interface Window {
    dataLayer: Record<string, any>[];
  }
}

type gtmAnalyticsType = {
  init: (trackingId: string) => void;
  pushPageViewEvent: () => void;
  pushLogInEvent: () => void;
  pushEvent: (events: object) => void;
};

window.dataLayer = window.dataLayer || [];

const gtmAnalytics: gtmAnalyticsType = {
  init: (trackingId: string) => {
    if (trackingId === null || trackingId === "") {
      return;
    }

    const tagManagerArgs: {
      gtmId: string;
    } = {
      gtmId: trackingId
    };
    
    TagManager.initialize(tagManagerArgs);
  },

  pushPageViewEvent: () => {
    window.dataLayer.push({
      event: "page_view",
      pageLocation: document.URL,
      pageTitle: document.title,
      pageReferrer: document.referrer,
      pageType: "Home"
    });
  },

  pushLogInEvent: () => {
    gtmAnalytics.pushEvent({
      event: "identify_user",
      userId: getUser()
    });
    gtmAnalytics.pushEvent({
      event: "identify_group",
      userId: getUserOrganisation()
    });
  },

  pushEvent: (events: object) => {
    if (window.dataLayer !== null) {
      window.dataLayer.push(events);
    }
  }
};

export default gtmAnalytics;
