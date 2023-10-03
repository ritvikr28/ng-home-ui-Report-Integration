import { render, queryByAttribute } from "@testing-library/react";
import PageNotFound from "../PageNotFound";

describe("Page Not Found page", () => {
  const getById: any = queryByAttribute.bind(null, "id");

  test("should render the component", () => {
    const renderResult = render(<PageNotFound />);
    const container: any = getById(
      renderResult.container,
      "page-not-found-wrapper"
    );

    expect(container).toBeInTheDocument();
  });
});
