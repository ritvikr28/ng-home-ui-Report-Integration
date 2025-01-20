import { renderHook } from "@testing-library/react-hooks";
import AttendanceOverview from "../AttendanceOverview.logic";
import { FetchSchoolInsights } from "../../../../../../../shared/services/schoolInsightsDomain/schoolInsightsService";

jest.mock(
  "../../../../../../../shared/services/schoolInsightsDomain/schoolInsightsService"
);

describe("AttendanceOverview", () => {
  test("should set loading to true initially", () => {
    const { result } = renderHook(() => AttendanceOverview());
    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
  });

  test("should fetch data successfully", async () => {
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

    (FetchSchoolInsights as jest.Mock).mockResolvedValueOnce(mockData);

    const { result, waitForNextUpdate } = renderHook(() =>
      AttendanceOverview()
    );

    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBeNull();
  });

  test("should handle fetch error", async () => {
    (FetchSchoolInsights as jest.Mock).mockResolvedValueOnce(null);

    const { result, waitForNextUpdate } = renderHook(() =>
      AttendanceOverview()
    );

    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBe("Failed to fetch data");
  });
});
