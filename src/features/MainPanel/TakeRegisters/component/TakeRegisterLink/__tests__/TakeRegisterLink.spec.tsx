import { render, fireEvent } from "@testing-library/react";
import TakeRegistersLinkview from "../TakeRegisterLink.view";

import gtmAnalytics from "../../../../../../shared/utils/analytics";
import { envConfig } from "../../../../../../shared/utils";

  jest.mock('../../../../../../shared/utils', () => ({
    envConfig: {
        REGISTER_BASE_URL: "https://example.com"
    },
  }));

describe("TakeRegistersLinkview component", () => {
    test("should render the component with the correct link", () => {
        const gtmAnalyticsPushSpy: jest.SpyInstance<void, [events: object]> =
      jest.spyOn(gtmAnalytics, "pushEvent");
      const { getByText,getByTestId } = render(<TakeRegistersLinkview />);
  
      
      expect(getByText("Your registers")).toBeInTheDocument();
  
      const link = getByTestId("link-id"); 
    
      fireEvent.click(link);
      expect(gtmAnalyticsPushSpy).toHaveBeenCalledTimes(1);
      expect(gtmAnalyticsPushSpy).toHaveBeenCalledWith({
        event: "click",
        linkText: "View all registers",
        linkUrl: envConfig.REGISTER_BASE_URL,
        linkType: "link",
        linkLocation: "body"
      });
    });
});
