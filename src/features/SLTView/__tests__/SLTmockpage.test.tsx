import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import SLTmockpage from "../SLTmockpage";

jest.mock("react-router-dom", () => ({
  useLocation: jest.fn(() => ({ pathname: "/mockPath" })),
}));

jest.mock("../../../shared/services/schoolDomain/schoolServices", () => ({
  useFetchSchoolNameData: jest.fn(() =>
    Promise.resolve({ schoolName: "Mock School" })
  ),
}));

jest.mock("../../../shared/components/QuickLink/Quicklinkresponse", () => {
  const mockFetchQuickLinkDetails = jest.fn(() =>
    Promise.resolve({
      status: false,
      response: [
        { id: 1, name: "Link 1" },
        { id: 2, name: "Link 2" }
      ],
    })
  );

  return {
    fetchQuickLinkDetails: mockFetchQuickLinkDetails,
  };
});



describe("SLTmockpage Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders SLTmockpage component correctly", async () => {
    render(<SLTmockpage />);
  });

  //   test.only("toggles the panel when the button is clicked", async () => {
  //     const { getByTestId } = render(<SLTmockpage />);
  //     const toggleButton = getByTestId("btn-show-quick-link");

  //     expect(toggleButton).toBeInTheDocument();

  //     await act(async () => {
  //       fireEvent.click(toggleButton);
  //     });
  //   });

  test("fetches school names and sets state accordingly", async () => {
    render(<SLTmockpage />);
  });

  test("fetches and sets quick link data", async () => {
    render(<SLTmockpage />);
  });
});
