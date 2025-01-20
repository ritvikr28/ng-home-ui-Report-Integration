import { FetchSchoolInsights } from "../schoolInsightsService";
import { service } from "../../../utils/api-service";
import { ISchoolInsightsResponse } from "../../../model/SchoolInsightsDomain/responseModels";

jest.mock("../../../utils/api-service", () => ({
  service: {
    get: jest.fn(),
  },
}));

describe("FetchSchoolInsights", () => {
  const mockResponse: ISchoolInsightsResponse = {
    errors: "",
    payload: {
      pupilOnRoll: 449,
      pupilPremiumPercentage: 0,
      totalPupilPremium: 0,
      fsmePercentage: 24.28,
      totalPupilFsme: 109,
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
    status: 200,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should fetch school insights successfully", async () => {
    (service.get as jest.Mock).mockResolvedValueOnce({ data: mockResponse });

    const result = await FetchSchoolInsights(true);

    expect(service.get).toHaveBeenCalledWith(
      `${process.env.BASE_URL}/v1/schoolinsights?IsCompulsoryAgeView=true`
    );
    expect(result).toEqual(mockResponse);
  });

  test("should return null when there is an error", async () => {
    (service.get as jest.Mock).mockRejectedValueOnce(
      new Error("Network Error")
    );

    const result = await FetchSchoolInsights(false);

    expect(service.get).toHaveBeenCalledWith(
      `${process.env.BASE_URL}/v1/schoolinsights?IsCompulsoryAgeView=false`
    );
    expect(result).toBeNull();
  });
});
