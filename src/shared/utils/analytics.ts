import TagManager from "react-gtm-module";
import { getUser, getUserOrganisation } from "./auth-helper";

declare global {
  interface Window {
    dataLayer: Record<string, any>[];
  }
}

type gtmAnalyticsType = {
  init: (trackingId: string) => void;
  pushPageViewEvent: (pageType?: string) => void;
  pushLogInEvent: () => void;
  showVideoEvent: () => void;
  pushEvent: (events: object) => void;
  pushVideoEvent: (videoEngagement: number) => void;
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

  pushPageViewEvent: (pageType = "Home") => {
    window.dataLayer.push({
      event: "page_view",
      pageLocation: document.URL,
      pageTitle: document.title,
      pageReferrer: document.referrer,
      pageType
    });
  },

  pushLogInEvent: () => {
    gtmAnalytics.pushEvent({
      event: "identify_user",
      userId: getUser()
    });
    gtmAnalytics.pushEvent({
      event: "identify_group",
      groupId: getUserOrganisation()
    });
  },

  showVideoEvent: () => {
    gtmAnalytics.pushEvent({ event: "showVideo" })
  },

  pushEvent: (events: object) => {
    if (window.dataLayer !== null) {
      window.dataLayer.push(events);
    }
  },

  pushVideoEvent: (percent: number) => {
    window.dataLayer.push({
      event: "stopVideo",
      videoEngagement: percent
    });
  },
};

export default gtmAnalytics;
