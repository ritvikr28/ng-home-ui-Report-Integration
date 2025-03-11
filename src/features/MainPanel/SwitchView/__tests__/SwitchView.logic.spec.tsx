import { render, screen } from "@testing-library/react";
import { ISwitchViewProps } from "../SwitchView.props";
import SwitchViewLogic from "../SwitchView.logic";


jest.mock("../SwitchView.view", () => ({ organisationName, isApiError, path }: ISwitchViewProps) => (
    <div data-testid="switch-view">
      <span data-testid="organisation-name">{organisationName}</span>
      <span data-testid="api-error">{isApiError ? "Error" : "No Error"}</span>
      <span data-testid="path">{path}</span>
    </div>
  ));
  
describe("SwitchViewLogic Component", () => { 
    test("renders SwitchView with correct props", () => {
        const props: ISwitchViewProps = {
          organisationName: "Test Organisation",
          isApiError: false,
          path: "/dashboard",
        };
    
        render(<SwitchViewLogic {...props} />);
        expect(screen.getByTestId("switch-view")).toBeInTheDocument();
        expect(screen.getByTestId("organisation-name")).toHaveTextContent("Test Organisation");
        expect(screen.getByTestId("api-error")).toHaveTextContent("No Error");
        expect(screen.getByTestId("path")).toHaveTextContent("/dashboard");
      });

      test("displays error message when isApiError is true", () => {
        const props: ISwitchViewProps = {
          organisationName: "Error Organisation",
          isApiError: true,
          path: "/error",
        };
    
        render(<SwitchViewLogic {...props} />);
    
        expect(screen.getByTestId("organisation-name")).toHaveTextContent("Error Organisation");
        expect(screen.getByTestId("api-error")).toHaveTextContent("Error");
        expect(screen.getByTestId("path")).toHaveTextContent("/error");
      });

});