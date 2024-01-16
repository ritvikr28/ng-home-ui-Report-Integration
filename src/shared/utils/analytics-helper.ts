export const trackEvent = (trackerKey: string, trackerFunction: () => void) => {
    if (!window.sessionStorage.getItem(trackerKey)) {
      trackerFunction();
      window.sessionStorage.setItem(trackerKey, "true");
    }
};