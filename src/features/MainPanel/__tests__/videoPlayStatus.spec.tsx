import { buildApplicationUrl } from "@essnextgen/ui-application-kit";
import { AxiosResponse } from "axios";
import apiUrls from "../../../shared/hook/ApiConfig.json";
import { service } from "../../../shared/utils/api-service";
import { fetchVideoPlayStatus } from "../../../shared/services/videoPlayStatus";


jest.mock("../../../shared/utils/api-service", () => ({
  service: {
    get: jest.fn()
  }
}));

jest.mock("@essnextgen/ui-application-kit", () => ({
  buildApplicationUrl: jest.fn()
}));

jest.mock("../../../shared/hook/ApiConfig.json", () => ({
  video: "/mock-video-url"
}));

describe("fetchVideoPlayStatus", () => {
  const mockBuiltUrl = "https://mock.built.url";

  beforeEach(() => {
    jest.clearAllMocks();
    (buildApplicationUrl as jest.Mock).mockReturnValue(mockBuiltUrl);
  });

  test("returns response data when API returns status 200", async () => {
    const mockResponse: AxiosResponse = {
      data: {
        errors: null,
        payload: { isPlayed: true },
        status: 200
      },
      status: 200,
      statusText: "OK",
      headers: {},
      config: {}
    };

    (service.get as jest.Mock).mockResolvedValue(mockResponse);

    const result = await fetchVideoPlayStatus();

    expect(buildApplicationUrl).toHaveBeenCalledWith(apiUrls);
    expect(service.get).toHaveBeenCalledWith("VideoPlayStatus", mockBuiltUrl);
    expect(result).toEqual(mockResponse.data);
  });

  test("returns null when API returns a non-200 status", async () => {
    const mockResponse: AxiosResponse = {
      data: {
        errors: null,
        payload: { isPlayed: false },
        status: 400
      },
      status: 400,
      statusText: "Bad Request",
      headers: {},
      config: {}
    };

    (service.get as jest.Mock).mockResolvedValue(mockResponse);

    const result = await fetchVideoPlayStatus();

    expect(result).toBeNull();
  });

  test("returns null when service.get throws an error", async () => {
    (service.get as jest.Mock).mockRejectedValue(new Error("Network Error"));

    const result = await fetchVideoPlayStatus();

    expect(result).toBeNull();
  });

  test("calls service.get with correct arguments", async () => {
    const mockResponse: AxiosResponse = {
      data: {
        errors: null,
        payload: { isPlayed: "Played" },
        status: 200
      },
      status: 200,
      statusText: "OK",
      headers: {},
      config: {}
    };

    (service.get as jest.Mock).mockResolvedValue(mockResponse);

    await fetchVideoPlayStatus();

    expect(service.get).toHaveBeenCalledWith("VideoPlayStatus", mockBuiltUrl);
  });
});
