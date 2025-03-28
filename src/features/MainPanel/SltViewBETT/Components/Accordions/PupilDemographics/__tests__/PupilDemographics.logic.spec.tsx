import { renderHook } from "@testing-library/react-hooks";
import PupilDemographics from "../PupilDemographics.logic";
import { FetchSchoolInsights } from "../../../../../../../shared/services/schoolInsightsDomain/schoolInsightsService";

jest.mock(
  "../../../../../../../shared/services/schoolInsightsDomain/schoolInsightsService"
);

describe("PupilDemographics", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("fetches data successfully", async () => {
    const mockResponse = {
      errors: null,
      payload: {
        pupilOnRoll: 449,
        pupilPremiumPercentage: 0,
        totalPupilPremium: 0,
        fsmePercentage: 24.28,
        totalPupilFsme: 109
      },
      status: 200
    };

    (FetchSchoolInsights as jest.Mock).mockResolvedValue(mockResponse);

    const { result, waitForNextUpdate } = renderHook(() => PupilDemographics());

    await waitForNextUpdate();

    expect(result.current.data).toEqual(mockResponse);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  test("handles fetch error", async () => {
    (FetchSchoolInsights as jest.Mock).mockResolvedValue(null);

    const { result, waitForNextUpdate } = renderHook(() => PupilDemographics());

    await waitForNextUpdate();

    expect(result.current.data).toBe(null);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe("Failed to fetch data");
  });

  test("initial loading state", () => {
    const { result } = renderHook(() => PupilDemographics());

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBe(null);
    expect(result.current.error).toBe(null);
  });
});
