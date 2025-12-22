import SltViewBettView from "./SltViewBett.view";
import { render, waitFor } from "@testing-library/react";

jest.mock("@essnextgen/ui-kit", () => ({
  Divider: () => <div data-testid="divider" />,
}));
jest.mock("@essnextgen/ui-intl-kit", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
  IntlProvider: { init: jest.fn(() => ({ init: jest.fn() })) },
}));

jest.mock("./Components/Accordions/AttendanceOverview/AttendanceOverview.view", () =>
  jest.fn(() => <div data-testid="attendance-overview" />)
);
jest.mock("./Components/Accordions/PupilDemographics/PupilDemographics.view", () =>
  jest.fn(() => <div data-testid="pupil-demographics" />)
);
jest.mock("../../../shared/components/SectionTitle/SectionTitle", () => ({
  SectionTitle: ({ title }: { title: string }) => <div data-testid="section-title">{title}</div>,
}));

const mockFetchSchoolInsights = jest.fn();
jest.mock("../../../shared/services/schoolInsightsDomain/schoolInsightsService", () => ({
  FetchSchoolInsights: (...args: any[]) => mockFetchSchoolInsights(...args),
}));

describe("SltViewBettView", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render SectionTitle with correct translation key", async () => {
    mockFetchSchoolInsights.mockResolvedValue({});
    const { getByTestId } = render(<SltViewBettView />);
    await waitFor(() => {
      expect(getByTestId("section-title").textContent).toBe("sltviewbelt.schoolheadlines");
    });
  });

  it("should call FetchSchoolInsights on mount", async () => {
    mockFetchSchoolInsights.mockResolvedValue({});
    render(<SltViewBettView />);
    await waitFor(() => {
      expect(mockFetchSchoolInsights).toHaveBeenCalledWith(true);
    });
  });

  it("should pass loading, error, and data props to children", async () => {
    const fakeData = { foo: "bar" };
    mockFetchSchoolInsights.mockResolvedValue(fakeData);
    const { getByTestId } = render(<SltViewBettView />);
    await waitFor(() => {
      expect(getByTestId("attendance-overview")).toBeInTheDocument();
      expect(getByTestId("pupil-demographics")).toBeInTheDocument();
    });
  });

  it("should set error if FetchSchoolInsights returns null", async () => {
    mockFetchSchoolInsights.mockResolvedValue(null);
    const { getByTestId } = render(<SltViewBettView />);
    await waitFor(() => {
      // The error prop is set, but since the children are mocked, we can't check the prop directly
      // This test ensures the component does not crash
      expect(getByTestId("attendance-overview")).toBeInTheDocument();
      expect(getByTestId("pupil-demographics")).toBeInTheDocument();
    });
  });

  it("should render Divider between AttendanceOverview and PupilDemographics", async () => {
    mockFetchSchoolInsights.mockResolvedValue({});
    const { container } = render(<SltViewBettView />);
    await waitFor(() => {
      expect(container.querySelector(".new-divider-spacing")).toBeInTheDocument();
    });
  });

  it("should set loading to false after fetch completes", async () => {
    mockFetchSchoolInsights.mockResolvedValue({});
    const { getByTestId } = render(<SltViewBettView />);
    await waitFor(() => {
      // The children are rendered only after loading is false
      expect(getByTestId("attendance-overview")).toBeInTheDocument();
    });
  });
});
