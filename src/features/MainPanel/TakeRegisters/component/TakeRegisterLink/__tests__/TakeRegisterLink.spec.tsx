import { render, fireEvent } from "@testing-library/react";
import TakeRegistersLinkview from "../TakeRegisterLink.view";

import gtmAnalytics from "../../../../../../shared/utils/analytics";

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
        event: "interact_click",
        elementType: "link",
        elementTextOrLabel: "View all registers",
        elementLocation: "Take register section",
      });
    });
});
