import { render } from "@testing-library/react";
import { useTranslation } from "@essnextgen/ui-intl-kit";
import SystemStatusAlerts from "../SystemStatusAlerts/SystemStatusAlerts";

jest.mock("@essnextgen/ui-intl-kit", () => ({
  useTranslation: jest.fn(),
}));

jest.mock("@essnextgen/ui-kit", () => ({
  HeadingSubHeading: ({ headingText, subHeadingText }: any) => (
    <div data-testid="heading-subheading">
      <h1>{headingText}</h1>
      <p>{subHeadingText}</p>
    </div>
  ),
}));

describe("SystemStatusAlerts Component", () => {
  beforeEach(() => {
    (useTranslation as jest.Mock).mockReturnValue({
      t: (key: string) => key,
    });
  });

  it("should render the component with heading and subheading", () => {
    const { getByTestId, getByText } = render(<SystemStatusAlerts />);

    const headingSubheading = getByTestId("heading-subheading");
    expect(headingSubheading).toBeInTheDocument();

    expect(getByText("SystemStatus_T.headingTitle")).toBeInTheDocument();

    expect(getByText("SystemStatus_T.description")).toBeInTheDocument();
  });

  it("should apply the correct class to the container", () => {
    const { container } = render(<SystemStatusAlerts />);

    const divElement = container.querySelector(
      ".admin-heading.heading-text-up.admin-heading-psas1334f"
    );
    expect(divElement).toBeInTheDocument();
  });
});