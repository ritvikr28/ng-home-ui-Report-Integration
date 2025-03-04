
import {  render } from "@testing-library/react";
import BreadcrumbWrapper from "../BreadcrumbWrapper";


describe("BreadcrumbWrapper Component", () => {
  test("renders breadcrumbs with correct Home link names and paths", () => {
    
  const {getByRole}  =  render(<BreadcrumbWrapper  />);
    const homeBreadcrumb = getByRole("link", { name: /Home/i });
    expect(homeBreadcrumb).toBeInTheDocument();
    expect(homeBreadcrumb.getAttribute("href")).toBe("/");
   

  });
  
  test("renders breadcrumbs with correct Quick links  names", () => {
    const {getByText}  =  render(<BreadcrumbWrapper    />);
    expect(getByText("Quick Links")).toBeInTheDocument();
    expect(getByText("Quick Links")).not.toHaveClass("active");
    });

    
});
