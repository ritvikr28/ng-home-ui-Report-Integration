import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import "@testing-library/jest-dom";
 
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
 
  test.skip("toggles the panel when the button is clicked", async () => {
    const { getByTestId } = render(<SLTmockpage />);
    const toggleButton = getByTestId("btn-90-btn");
 
    expect(toggleButton).toBeInTheDocument();
 
    await act(async () => {
      fireEvent.click(toggleButton);
    });
  });
 
  test("fetches school names and sets state accordingly", async () => {
    render(<SLTmockpage />);
  });
 
  test("fetches and sets quick link data", async () => {
    render(<SLTmockpage />);
  });
  test("renders without errors", () => {
    render(<SLTmockpage />);
 
    expect(screen.getByTestId("btn-90")).toBeInTheDocument();
  });
 
  test.skip("toggles panel when button is clicked", () => {
    render(<SLTmockpage />);
    const toggleButton = screen.getByTestId("btn-90");
 
    fireEvent.click(toggleButton);
    expect(screen.getByTestId("btn-collapse")).toHaveClass(
      "essui-button essui-button--utility essui-button-icon-only--small base-class"
    );
  });
  test("fetches and displays school names correctly", async () => {
    await act(async () => {
      render(<SLTmockpage />);
    });
 
    expect(screen.getByText("Mock School")).toBeInTheDocument();
  });
});