import { render } from "@testing-library/react";
import UnAuthorisedAccess from "../AdminConsoleNoAccess.view";

describe("UnAuthorisedAccess component", () => {
  it("renders error page with correct title and text", () => {
    const { getByText } = render(<UnAuthorisedAccess />);
    expect(getByText("unAuthorisedAccess.headingTitle")).toBeInTheDocument();
    expect(getByText("unAuthorisedAccess.bodyText.text")).toBeInTheDocument();
  });
});
