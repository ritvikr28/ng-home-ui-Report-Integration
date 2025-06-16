import { renderHook } from "@testing-library/react-hooks";
import { hasFeaturePermission } from "@essnextgen/ui-flagr";
import { service } from "../../shared/utils/api-service";
import { useSIMSNextGenLinks } from "../../shared/hooks/useSIMSNextGenLinks";

jest.mock("../../shared/utils/api-service", () => ({
  service: {
    get: jest.fn()
  }
}));

jest.mock("@essnextgen/ui-flagr", () => ({
  hasFeaturePermission: jest.fn()
}));

describe("useSIMSNextGenLinks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should initialize with loading state", () => {
    const { result } = renderHook(() => useSIMSNextGenLinks());

    expect(result.current).toEqual({
      isLoading: true,
      hasConnectedLauncher: false,
      error: false
    });
  });

  it("should handle successful API call with launcher present", async () => {
    const mockResponse = {
      data: [
        {
          name: "SIMS Connected Launcher",
          code: "SIMSConnectedLauncher",
          link: "https://example.com",
          organisationId: "123"
        }
      ]
    };

    (service.get as jest.Mock).mockResolvedValueOnce(mockResponse);
    (hasFeaturePermission as jest.Mock).mockReturnValue(false);

    const { result, waitForNextUpdate } = renderHook(() => useSIMSNextGenLinks());

    await waitForNextUpdate();

    expect(result.current).toEqual({
      isLoading: false,
      hasConnectedLauncher: true,
      error: false
    });
    expect(service.get).toHaveBeenCalledWith("v1/SIMSConnected/simsnextgenlinks");
  });

  it("should handle successful API call with no launcher present", async () => {
    const mockResponse = {
      data: [
        {
          name: "Other App",
          code: "OtherApp",
          link: "https://example.com",
          organisationId: "123"
        }
      ]
    };

    (service.get as jest.Mock).mockResolvedValueOnce(mockResponse);

    const { result, waitForNextUpdate } = renderHook(() => useSIMSNextGenLinks());

    await waitForNextUpdate();

    expect(result.current).toEqual({
      isLoading: false,
      hasConnectedLauncher: false,
      error: false
    });
  });

  it("should handle launcher with empty link", async () => {
    const mockResponse = {
      data: [
        {
          name: "SIMS Connected Launcher",
          code: "SIMSConnectedLauncher",
          link: "",
          organisationId: "123"
        }
      ]
    };

    (service.get as jest.Mock).mockResolvedValueOnce(mockResponse);

    const { result, waitForNextUpdate } = renderHook(() => useSIMSNextGenLinks());

    await waitForNextUpdate();

    expect(result.current).toEqual({
      isLoading: false,
      hasConnectedLauncher: false,
      error: false
    });
  });

  it("should handle launcher with whitespace-only link", async () => {
    const mockResponse = {
      data: [
        {
          name: "SIMS Connected Launcher",
          code: "SIMSConnectedLauncher",
          link: "   ",
          organisationId: "123"
        }
      ]
    };

    (service.get as jest.Mock).mockResolvedValueOnce(mockResponse);

    const { result, waitForNextUpdate } = renderHook(() => useSIMSNextGenLinks());

    await waitForNextUpdate();

    expect(result.current).toEqual({
      isLoading: false,
      hasConnectedLauncher: false,
      error: false
    });
  });

  it("should handle excluded launcher", async () => {
    const mockResponse = {
      data: [
        {
          name: "SIMS Connected Launcher",
          code: "SIMSConnectedLauncher",
          link: "https://example.com",
          organisationId: "123"
        }
      ]
    };

    (service.get as jest.Mock).mockResolvedValueOnce(mockResponse);
    (hasFeaturePermission as jest.Mock).mockReturnValue(true);

    const { result, waitForNextUpdate } = renderHook(() => useSIMSNextGenLinks());

    await waitForNextUpdate();

    expect(result.current).toEqual({
      isLoading: false,
      hasConnectedLauncher: false,
      error: false
    });
    expect(hasFeaturePermission).toHaveBeenCalledWith(
      "ExcludedSIMSNextGenLinks",
      "SIMSConnectedLauncher"
    );
  });

  it("should handle API error", async () => {
    const error = new Error("API Error");
    (service.get as jest.Mock).mockRejectedValueOnce(error);

    const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => { });

    const { result, waitForNextUpdate } = renderHook(() => useSIMSNextGenLinks());

    await waitForNextUpdate();

    expect(result.current).toEqual({
      isLoading: false,
      hasConnectedLauncher: false,
      error: true
    });
    expect(consoleSpy).toHaveBeenCalledWith(
      "[useSIMSNextGenLinks] Error fetching links:",
      error
    );

    consoleSpy.mockRestore();
  });

  it("should not refetch if already loaded", async () => {
    const mockResponse = {
      data: [
        {
          name: "SIMS Connected Launcher",
          code: "SIMSConnectedLauncher",
          link: "https://example.com",
          organisationId: "123"
        }
      ]
    };

    (service.get as jest.Mock).mockResolvedValueOnce(mockResponse);

    const { waitForNextUpdate, rerender } = renderHook(() => useSIMSNextGenLinks());

    await waitForNextUpdate();

    rerender();

    expect(service.get).toHaveBeenCalledTimes(1);
  });
}); 