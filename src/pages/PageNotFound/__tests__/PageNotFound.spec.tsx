import { render } from "@testing-library/react";
import PageNotFound from "../PageNotFound";

describe("Page Not Found page", () => {
  

  test("should render the component", () => {
    const {getByTestId} = render(<PageNotFound />);
    const container: any = getByTestId(      
      "page-not-found-1144534sdw"
    );

    expect(container).toBeInTheDocument();
  });
});
