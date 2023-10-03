import { render, queryByAttribute } from "@testing-library/react";
import NoAccess from "../index";

describe("No Access page", () => {
  const getById: any = queryByAttribute.bind(null, "id");

  test("should render the component", () => {
    const renderResult = render(<NoAccess />);
    const container: any = getById(renderResult.container, "no-access-wrapper");

    expect(container).toBeInTheDocument();
  });
});
