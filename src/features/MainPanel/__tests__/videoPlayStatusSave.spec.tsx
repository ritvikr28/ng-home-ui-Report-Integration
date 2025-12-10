import { AxiosResponse } from "axios";
import { saveVideoPlayStatus } from "../../../shared/services/videoPlayStatusSave";
import { service } from "../../../shared/utils/api-service";

jest.mock("../../../shared/utils/api-service");

describe("saveVideoPlayStatus", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns null when API returns a non-200 status", async () => {
    const mockResponse: AxiosResponse = {
      data: { success: false },
      status: 400,
      statusText: "Bad Request",
      headers: {},
      config: {}
    };

    (service.post as jest.Mock).mockResolvedValue(mockResponse);

    const result = await saveVideoPlayStatus();
    expect(result).toBeNull();
  });

  test("returns null when API throws an error", async () => {
    (service.post as jest.Mock).mockRejectedValue(new Error("Network error"));

    const result = await saveVideoPlayStatus();
    expect(result).toBeNull();
  });
});
