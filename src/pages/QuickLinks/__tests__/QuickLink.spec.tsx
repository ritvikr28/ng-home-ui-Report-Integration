import { render } from "@testing-library/react";
import QuickLink from "../QuickLink.view";

test("renders QuickLink component", () => {
  const { getByText } = render(<QuickLink />);
  const linkElement = getByText(/QuickLink is under development/i);
  expect(linkElement).toBeInTheDocument();
});
