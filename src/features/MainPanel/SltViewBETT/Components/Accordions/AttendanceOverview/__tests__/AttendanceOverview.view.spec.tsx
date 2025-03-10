import { render, screen, waitFor } from "@testing-library/react";
import AttendanceOverviewView from "../AttendanceOverview.view";
import AttendanceOverview from "../AttendanceOverview.logic";

jest.mock("../AttendanceOverview.logic");

interface BargraphsProps {
  title: string;
}

jest.mock("@essnextgen/ui-kit", () => ({
  ...jest.requireActual("@essnextgen/ui-kit"),
  Bargraphs: ({ title }: BargraphsProps) => <div>{title}</div>,
}));

describe("AttendanceOverviewView", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should display loading state", () => {
    (AttendanceOverview as jest.Mock).mockReturnValue({
      data: null,
      loading: true,
      error: null,
    });

    render(<AttendanceOverviewView />);

    expect(screen.getByText(/please wait.../i)).toBeInTheDocument();
  });

  test("should display error notification", async () => {
    (AttendanceOverview as jest.Mock).mockReturnValue({
      data: null,
      loading: false,
      error: "Failed to fetch data",
    });

    render(<AttendanceOverviewView />);

    expect(screen.getByText(/data fetch error/i)).toBeInTheDocument();
    expect(
      screen.getByText(/there was an error fetching the attendance data/i)
    ).toBeInTheDocument();
  });

  test("should display attendance data", async () => {
    const mockData = {
      payload: {
        attendanceInsights: {
          attendanceCurrentYear: 0,
          attendancePreviousYear: 59.4,
          attendanceNationalAverage: 92.6,
          persistentAbsenteeCurrentYear: 0,
          persistentAbsenteePreviousYear: 9.8,
          persistentAbsenteesNationalAverage: 21.2,
          authorisedAbsentCurrentYear: 0,
          authorisedAbsentPreviousYear: 0.2,
          authorisedAbsentNationalAverage: 5,
          unauthorisedAbsentCurrentYear: 0,
          unauthorisedAbsentPreviousYear: 1.3,
          unauthorisedAbsentNationalAverage: 2.4,
        },
      },
    };

    (AttendanceOverview as jest.Mock).mockReturnValue({
      data: mockData,
      loading: false,
      error: null,
    });

    render(<AttendanceOverviewView />);

    await waitFor(() => {
      expect(screen.getByText(/overall attendance/i)).toBeInTheDocument();
    });

    const authorisedAbsences = screen.getAllByText(/attendanceoverview.authorisedabsence/i);
    expect(authorisedAbsences).toHaveLength(1);

    const unauthorisedAbsences = screen.getAllByText(/attendanceoverview.unauthorisedabsence/i);
    expect(unauthorisedAbsences).toHaveLength(1);

    const persistentAbsences = screen.getAllByText(/attendanceoverview.persistentabsence/i);
    expect(persistentAbsences).toHaveLength(1);
  });

  test("should redirect to insights page on button click", () => {
    (AttendanceOverview as jest.Mock).mockReturnValue({
      data: null,
      loading: false,
      error: null,
    });

    const originalLocation = window.location;

    const mockLocation = {
      href: "",
      origin: "http://localhost",
      assign: jest.fn(),
      replace: jest.fn(),
      reload: jest.fn(),
    };
    Object.defineProperty(window, "location", {
      value: mockLocation,
      writable: true,
    });

    render(<AttendanceOverviewView />);

    const button = screen.getByTestId("insights-button");
    expect(button).toBeInTheDocument();
    button.click();
    mockLocation.href = `${mockLocation.origin}/reporting`;

    expect(mockLocation.href).toBe(`${mockLocation.origin}/reporting`);

    Object.defineProperty(window, "location", {
      value: originalLocation,
      writable: true,
    });
  });
});
