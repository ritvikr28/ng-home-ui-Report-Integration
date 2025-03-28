import { render } from "@testing-library/react";
import BreadcrumbWrapper from "../BreadcrumbWrapper";

describe("BreadcrumbWrapper Component", () => {
  test("renders breadcrumbs with correct Home link names and paths", () => {
    const { getByRole } = render(<BreadcrumbWrapper />);
    const homeBreadcrumb = getByRole("link", { name: /breadcrumbshome/i });
    expect(homeBreadcrumb).toBeInTheDocument();
    expect(homeBreadcrumb.getAttribute("href")).toBe("/");
  });

  test("renders breadcrumbs with correct Quick links  names", () => {
    const { getByText } = render(<BreadcrumbWrapper />);
    expect(getByText("quickLink.headingTitle")).toBeInTheDocument();
    expect(getByText("quickLink.headingTitle")).not.toHaveClass("active");
  });
});
