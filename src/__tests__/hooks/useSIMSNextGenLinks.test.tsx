import { hasFeaturePermission } from "@essnextgen/ui-flagr";
import { fetchLinks } from "../../shared/hooks/useSIMSNextGenLinks";
import { service } from "../../shared/utils/api-service";

jest.mock("../../shared/utils/api-service", () => ({
  service: {
    get: jest.fn()
  }
}));

jest.mock("@essnextgen/ui-flagr", () => ({
  hasFeaturePermission: jest.fn()
}));

describe("fetchLinks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns true when launcher is present, has valid link, and not excluded", async () => {
    (service.get as jest.Mock).mockResolvedValueOnce({
      data: [
        {
          name: "SIMS Connected Launcher",
          code: "SIMSConnectedLauncher",
          link: "https://example.com",
          organisationId: "123"
        }
      ]
    });
    (hasFeaturePermission as jest.Mock).mockReturnValue(false);
    const result = await fetchLinks();
    expect(result).toBe(true);
    expect(service.get).toHaveBeenCalledWith('v1/SIMSConnected/simsnextgenlinks');
    expect(hasFeaturePermission).toHaveBeenCalledWith("ExcludedSIMSNextGenLinks", "SIMSConnectedLauncher");
  });

  it("returns false when launcher is not present", async () => {
    (service.get as jest.Mock).mockResolvedValueOnce({
      data: [
        {
          name: "Other App",
          code: "OtherApp",
          link: "https://example.com",
          organisationId: "123"
        }
      ]
    });
    const result = await fetchLinks();
    expect(result).toBe(false);
  });

  it("returns false when launcher has empty link", async () => {
    (service.get as jest.Mock).mockResolvedValueOnce({
      data: [
        {
          name: "SIMS Connected Launcher",
          code: "SIMSConnectedLauncher",
          link: "",
          organisationId: "123"
        }
      ]
    });
    (hasFeaturePermission as jest.Mock).mockReturnValue(false);
    const result = await fetchLinks();
    expect(result).toBe(false);
  });

  it("returns false when launcher has whitespace-only link", async () => {
    (service.get as jest.Mock).mockResolvedValueOnce({
      data: [
        {
          name: "SIMS Connected Launcher",
          code: "SIMSConnectedLauncher",
          link: "   ",
          organisationId: "123"
        }
      ]
    });
    (hasFeaturePermission as jest.Mock).mockReturnValue(false);
    const result = await fetchLinks();
    expect(result).toBe(false);
  });

  it("returns false when launcher is excluded", async () => {
    (service.get as jest.Mock).mockResolvedValueOnce({
      data: [
        {
          name: "SIMS Connected Launcher",
          code: "SIMSConnectedLauncher",
          link: "https://example.com",
          organisationId: "123"
        }
      ]
    });
    (hasFeaturePermission as jest.Mock).mockReturnValue(true);
    const result = await fetchLinks();
    expect(result).toBe(false);
  });

  it("returns false on API error", async () => {
    (service.get as jest.Mock).mockRejectedValueOnce(new Error("API Error"));
    const result = await fetchLinks();
    expect(result).toBe(false);
  });
});
