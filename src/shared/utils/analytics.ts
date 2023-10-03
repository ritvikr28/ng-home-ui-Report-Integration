import TagManager from "react-gtm-module";

declare global {
  interface Window {
    dataLayer: Record<string, any>[];
  }
}

type gtmAnalyticsType = {
  init: (trackingId: string) => void;
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

  pushEvent: (events: object) => {
    if (window.dataLayer !== null) {
      window.dataLayer.push(events);
    }
  }
};

export default gtmAnalytics;
