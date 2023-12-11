import { render, fireEvent } from "@testing-library/react";

import gtmAnalytics from "../../../../../../shared/utils/analytics";
import StaffTimeTableLinkview from "../StaffTimeTableLink.view";
import { envConfig } from "../../../../../../shared/utils";

  jest.mock('../../../../../../shared/utils', () => ({
    envConfig: {
        REGISTER_BASE_URL: "https://example.com",
        SCHOOL_BASE_URL: "https://example.com"
    },
  }));

describe("staffTimeTableLink component", () => {
    test("should render the component with the correct link", () => {
        const gtmAnalyticsPushSpy: jest.SpyInstance<void, [events: object]> =
      jest.spyOn(gtmAnalytics, "pushEvent");
      const { getByText,getByTestId } = render(<StaffTimeTableLinkview />);
  
      
      expect(getByText("Your upcoming schedule")).toBeInTheDocument();
  
      const link = getByTestId("link-staffid"); 
    
     
      fireEvent.click(link);
      expect(gtmAnalyticsPushSpy).toHaveBeenCalledTimes(1);
      expect(gtmAnalyticsPushSpy).toHaveBeenCalledWith({
        event: "click",
        linkText: "View full timetable",
        linkUrl: `${envConfig.SCHOOL_BASE_URL}/staff-timetable`,
        linkType: "link",
        linkLocation: "body"
      });
    });
});
