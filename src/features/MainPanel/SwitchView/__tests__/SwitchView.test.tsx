import { render, fireEvent, waitFor } from "@testing-library/react";
import { getUserOrganisation } from "../../../../shared/utils";
import SwitchView from "../SwitchView.view";

const mockedGetUserOrganisation = getUserOrganisation as jest.Mock;

jest.mock("../../../../shared/utils", () => ({
  getUserOrganisation: jest.fn(),
}));

describe("SwitchView Component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders SwitchView component with Teacher role", () => {
    const props = {
      organisationName: "School A",
      isApiError: false,
      path: "/teachers-view",
    };

    const { getByText } = render(<SwitchView {...props} />);

    expect(
      getByText("You are viewing School A as a Teacher.")
    ).toBeInTheDocument();
  });

  test("renders SwitchView component with Head Teacher role", async () => {
    const props = {
      organisationName: "School B",
      isApiError: false,
      path: "/slt-view",
    };

    const { getByText } = render(<SwitchView {...props} />);
    await waitFor(() => {
      expect(
        getByText("You are viewing School B as a Head Teacher.")
      ).toBeInTheDocument();
    });
  });

  test("renders Switch view link for specific organisation ID", () => {
    mockedGetUserOrganisation.mockReturnValue(
      "29a88689-e51f-4928-aead-1a92402c1a09"
    );

    const props = {
      organisationName: "School C",
      isApiError: false,
      path: "/teachers-view",
    };

    const { getByText } = render(<SwitchView {...props} />);

    expect(getByText("Switch view here")).toBeInTheDocument();
  });

  test("handles Switch view click correctly for path /", () => {
    const props = {
      organisationName: "School D",
      isApiError: false,
      path: "/",
    };

    const { getByText } = render(<SwitchView {...props} />);
    const switchViewLink = getByText("Switch view here");

    fireEvent.click(switchViewLink);

    expect(window.location.href).toBe("http://localhost/");
  });

  test("handles Switch view click correctly for path /slt-view", () => {
    const props = {
      organisationName: "School E",
      isApiError: false,
      path: "/slt-view",
    };

    const { getByText } = render(<SwitchView {...props} />);
    const switchViewLink = getByText("Switch view here");

    fireEvent.click(switchViewLink);

    expect(window.location.href).toBe("http://localhost/");
  });

  test("handles Switch view click correctly for other paths", () => {
    const props = {
      organisationName: "School F",
      isApiError: false,
      path: "/some-other-view",
    };

    const { getByText } = render(<SwitchView {...props} />);
    const switchViewLink = getByText("Switch view here");

    fireEvent.click(switchViewLink);

    expect(window.location.href).toBe("http://localhost/");
  });
});
