import { render, screen } from "@testing-library/react";
import About from "../About";

describe("About component", () => {
  it("renders heading and subheading text", () => {
    render(<About />);

    expect(screen.getByText("Admin console")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Manage all the MIS background processes and modules settings centrally from the Admin console."
      )
    ).toBeInTheDocument();
  });

  it("renders HeadingSubHeading component with correct props", () => {
    render(<About />);

    const headingElement = screen.getByText("Admin console");
    const subHeadingElement = screen.getByText(
      "Manage all the MIS background processes and modules settings centrally from the Admin console."
    );

    expect(headingElement).toBeInTheDocument();
    expect(subHeadingElement).toBeInTheDocument();
  });
  it("renders HeadingSubHeading component with correct props", () => {
    render(<About />);

    const textElements = screen.getAllByText(
      /Admin console|Manage all the MIS background processes and modules settings centrally from the Admin console./
    );

    expect(textElements).toHaveLength(2);
  });
});
