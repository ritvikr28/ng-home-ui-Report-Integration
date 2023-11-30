
import {  render } from "@testing-library/react";
import BreadcrumbWrapper from "../BreadcrumbWrapper";


describe("BreadcrumbWrapper Component", () => {
  test("renders breadcrumbs with correct Home link names and paths", () => {
    
  const {getByRole}  =  render(<BreadcrumbWrapper  />);
    const homeBreadcrumb = getByRole("link", { name: /Home/i });
    expect(homeBreadcrumb).toBeInTheDocument();
    expect(homeBreadcrumb.getAttribute("href")).toBe("/new-home");
   

  });
  
  test("renders breadcrumbs with correct Quick links  names", () => {
    const {getByText}  =  render(<BreadcrumbWrapper    />);
    expect(getByText("Quick links")).toBeInTheDocument();
    expect(getByText("Quick links")).not.toHaveClass("active");
    });

    
});
