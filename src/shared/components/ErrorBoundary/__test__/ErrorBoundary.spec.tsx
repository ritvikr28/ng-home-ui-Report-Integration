import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ErrorBoundary from "../Index";

const ErrorComponent = () => {
  const [error, setError] = useState(false);
  if (error) {
    throw new Error("Error");
  }

  return <div onClick={() => setError(true)}>Hello World</div>;
};

describe("Given ErrorBoundary", () => {
  test("SHOULD render Fallback UI WHEN error is thrown in its children component", () => {
    jest.spyOn(console, "error").mockImplementation(() => "");

    render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    );

    const DOM = screen.getByText("Hello World");

    expect(DOM).toBeInTheDocument();
    userEvent.click(DOM);
  });
});
