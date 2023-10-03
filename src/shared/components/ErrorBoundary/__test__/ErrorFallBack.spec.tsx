import { render, screen } from "@testing-library/react";
import ErrorFallBack from "../ErrorFallBack";

describe("Given ErrorMsg", () => {
  test("WHEN title and description is given THEN title and description should be rendered", () => {
    render(<ErrorFallBack />);
    expect(screen.getByText("Loading failed")).toBeInTheDocument();
    expect(screen.getByText("Something went wrong.")).toBeInTheDocument();
  });
});
