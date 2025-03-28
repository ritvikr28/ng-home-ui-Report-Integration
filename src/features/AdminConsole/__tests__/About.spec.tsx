import { render, screen } from "@testing-library/react";
import About from "../About";

describe("About component", () => {
  it("renders heading and subheading text", () => {
    render(<About />);

    expect(screen.getByText("breadcrumbsadminconsole")).toBeInTheDocument();
    expect(
      screen.getByText(
        "adminconsole.abouttext"
      )
    ).toBeInTheDocument();
  });

  it("renders HeadingSubHeading component with correct props", () => {
    render(<About />);

    const headingElement = screen.getByText("breadcrumbsadminconsole");
    const subHeadingElement = screen.getByText(
      "adminconsole.abouttext"
    );

    expect(headingElement).toBeInTheDocument();
    expect(subHeadingElement).toBeInTheDocument();
  });
  it("renders HeadingSubHeading component with correct props", () => {
    render(<About />);

    const textElements = screen.getAllByText(
      /breadcrumbsadminconsole|adminconsole.abouttext/
    );

    expect(textElements).toHaveLength(2);
  });
});
