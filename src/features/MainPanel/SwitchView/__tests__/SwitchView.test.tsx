import { render, screen } from "@testing-library/react";
import SwitchView from "../SwitchView.view";
 
 
describe("SwitchView Component", () => {
  test("renders correctly when isApiError is false", () => {
    const mockProps = {
      organisationName: "My School",
      isApiError: false,
    };
 
    render(<SwitchView
      organisationName={mockProps.organisationName}
      isApiError={mockProps.isApiError}
    />);
 
 
    const expectedText = `You are viewing ${mockProps.organisationName} as a Teacher.`;
    expect(screen.getByText(expectedText)).toBeInTheDocument();
 
 
    expect(screen.getByText("Switch view here")).toBeInTheDocument();
  });
 
  test("renders correctly when isApiError is true", () => {
    const mockProps = {
      organisationName: "My School",
      isApiError: true,
    };
 
    render(<SwitchView
      organisationName={mockProps.organisationName}
      isApiError={mockProps.isApiError}
    />);
 
 
    const expectedTextRegex = new RegExp(`You are viewing\\s+as a Teacher\\.`);
    expect(screen.getByText(expectedTextRegex)).toBeInTheDocument();
 
 
    expect(screen.getByText("Switch view here")).toBeInTheDocument();
  });
 
});