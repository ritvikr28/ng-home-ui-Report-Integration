import { render, screen } from "@testing-library/react";
import LoaderWrapper from "../LoaderWrapper";

describe("LoaderWrapper", () => {
  test("renders LoaderWrapper with provided loaderText", () => {
    const loaderText = "Loading data, please wait...";
    render(<LoaderWrapper loaderText={loaderText} />);

    const loaderElement: HTMLElement = screen.getByText(loaderText);
    expect(loaderElement).toBeInTheDocument();
  });

  test("renders LoaderWrapper with correct className and dataTestId", () => {
    const loaderText = "Loading data, please wait...";
    render(<LoaderWrapper loaderText={loaderText} />);

    const loaderElement: HTMLElement = screen.getByTestId("staff-data-loader");
    expect(loaderElement).toHaveClass("reg-loader loader-margin loader-size reg-loader-margin");
  });

  test("renders LoaderWrapper with default loaderText when loaderText is null or undefined", () => {
    render(<LoaderWrapper loaderText={undefined as any} />);

    const loaderElement: HTMLElement = screen.getByText("Loading...");
    expect(loaderElement).toBeInTheDocument();
  });

});