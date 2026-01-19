import { waitFor } from "@testing-library/react";
import { service } from "../../../utils/api-service";
import { IQuickLinkApiResponse } from "../../../model/quickLink/responsemodels";
import { FetchQuickLinkData, FetchQuickLinkpost } from "../quickLinkService";

jest.mock("../../../utils/api-service", () => ({
  service: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));
jest.mock("@essnextgen/ui-application-kit", () => ({
  buildApplicationUrl: jest.fn(() => "mocked-url"),
}));
jest.mock("../../hook/ApiConfig.json", () => ({}), { virtual: true });
jest.mock("../../../utils", () => ({
  envConfig: { BASE_URL: "http://mock-base-url" },
}));

// const mockApiResponse: IQuickLinkApiResponse[] = [
//   { id: 1, name: "Link 1", link: "/link-1", favourite: true, createdOn: "2023-01-01T12:00:00Z" },
//   { id: 2, name: "Link 2", link: "/link-2", favourite: false, createdOn: "2023-01-01T12:00:00Z" },
// ];


const mockApiResponse: IQuickLinkApiResponse[] = [
  {
    id: 1,
    name: 'Link 1',
    link: '/link-1',
    favourite: true,
    createdOn: '2023-01-01T12:00:00Z',
  },
  {
    id: 2,
    name: 'Link 2',
    link: '/link-2',
    favourite: false,
    createdOn: '2023-01-01T12:00:00Z',
  },
  {
    id: 3,
    name: 'Link 3',
    link: '/link-3',
    favourite: true,
    createdOn: '2023-01-01T12:00:00Z',
  },
  {
    id: 4,
    name: 'Link 4',
    link: '/link-4',
    favourite: true,
    createdOn: '2023-01-01T12:00:00Z',
  }
];

const axiosResponse = {
  data: mockApiResponse,
  status: 200,
  statusText: "OK",
  config: {},
  headers: {},
};
const role = "Teacher";

describe("quickLinkService", () => {
  let originalNavigator: any;
  let originalLocalStorage: any;

  beforeAll(() => {
    originalNavigator = global.navigator;
    originalLocalStorage = global.localStorage;
  });

  afterEach(() => {
    jest.clearAllMocks();
    Object.defineProperty(global, "navigator", {
      value: originalNavigator,
      configurable: true,
      writable: true,
    });
    Object.defineProperty(global, "localStorage", {
      value: originalLocalStorage,
      configurable: true,
      writable: true,
    });
  });

  describe("FetchQuickLinkData", () => {
    function mockLocalStorage(getItemValue: string | null) {
      Object.defineProperty(global, "localStorage", {
        value: {
          getItem: jest.fn(() => getItemValue),
        },
        configurable: true,
        writable: true,
      });
    }

    test("uses en-US if i18nextLng includes 'en'", async () => {
      mockLocalStorage("en-GB");
      Object.defineProperty(global, "navigator", {
        value: { language: "fr-FR" },
        configurable: true,
        writable: true,
      });
      (service.get as jest.Mock).mockResolvedValue(axiosResponse);

      const result = await FetchQuickLinkData("Teacher");
      expect(service.get).toHaveBeenCalledWith(
        expect.stringContaining("languageCode=en-US"),
        expect.anything()
      );
      expect(result).toEqual({ status: 200, response: mockApiResponse });
    });

    test("uses cy if i18nextLng does not include 'en'", async () => {
      mockLocalStorage("cy-GB");
      Object.defineProperty(global, "navigator", {
        value: { language: "cy-GB" },
        configurable: true,
        writable: true,
      });
      (service.get as jest.Mock).mockResolvedValue(axiosResponse);

      const result = await FetchQuickLinkData("Teacher");
      expect(service.get).toHaveBeenCalledWith(
        expect.stringContaining("languageCode=cy"),
        expect.anything()
      );
      expect(result).toEqual({ status: 200, response: mockApiResponse });
    });

    test("falls back to navigator.language if i18nextLng is empty", async () => {
      mockLocalStorage("");
      Object.defineProperty(global, "navigator", {
        value: { language: "fr-FR" },
        configurable: true,
        writable: true,
      });
      (service.get as jest.Mock).mockResolvedValue(axiosResponse);

      const result = await FetchQuickLinkData("Teacher");
      
      expect(result).toEqual({ status: 200, response: mockApiResponse });
    });

    test("falls back to navigator.language if i18nextLng is null", async () => {
      mockLocalStorage(null);
      Object.defineProperty(global, "navigator", {
        value: { language: "cy-GB" },
        configurable: true,
        writable: true,
      });
      (service.get as jest.Mock).mockResolvedValue(axiosResponse);

      const result = await FetchQuickLinkData("Teacher");
      expect(service.get).toHaveBeenCalledWith(
        expect.stringContaining("languageCode=cy"),
        expect.anything()
      );
      expect(result).toEqual({ status: 200, response: mockApiResponse });
    });

    test("handles missing navigator.language (should not throw)", async () => {
      mockLocalStorage(null);
      Object.defineProperty(global, "navigator", {
        value: {},
        configurable: true,
        writable: true,
      });
      (service.get as jest.Mock).mockResolvedValue(axiosResponse);

      const result = await FetchQuickLinkData("Teacher");
      expect(service.get).toHaveBeenCalledWith(
        expect.stringContaining("languageCode=undefined"),
        expect.anything()
      );
      expect(result).toEqual({ status: 200, response: mockApiResponse });
    });

    test("returns null on error", async () => {
      mockLocalStorage("en-GB");
      (service.get as jest.Mock).mockRejectedValue(new Error("Network Error"));

      const result = await FetchQuickLinkData("Teacher");
      expect(result).toBeNull();
    });
  });

  describe("FetchQuickLinkpost", () => {
    test("returns data on success", async () => {
      (service.post as jest.Mock).mockResolvedValue({ data: mockApiResponse });
      const result = await FetchQuickLinkpost(1, true);
      expect(service.post).toHaveBeenCalledWith(
        "http://mock-base-url/v1/quicklink",
        { quickLinkId: 1, operation: true }
      );
      expect(result).toEqual(mockApiResponse);
    });

    test("returns null on error", async () => {
      (service.post as jest.Mock).mockRejectedValue(new Error("Network Error"));
      const result = await FetchQuickLinkpost(2, false);
      expect(result).toBeNull();
    });
  });

});

describe("QuickLink Service tests", () => {

  test("should return QuickLink data", async () => {
    jest
      .spyOn(service, "get")
      .mockImplementation(() => Promise.resolve(axiosResponse));
    const response: any = await FetchQuickLinkData(role);

    await waitFor(() => {
      expect(response.status).toBe(200);
      expect(response.response).toEqual(mockApiResponse);
    });
  });

  test("handles API error", async () => {
    (service.get as jest.Mock).mockRejectedValue(new Error("Network Error"));
    const result = await FetchQuickLinkData(role);
    expect(result).toBeNull();

  });

  test("should return QuickLink post data", async () => {
    const id = 2;
    const operation = true;
    jest
      .spyOn(service, "post")
      .mockImplementation(() => Promise.resolve(axiosResponse));
    const response: any = await FetchQuickLinkpost(id, operation);

    await waitFor(() => {
      expect(response).toEqual(mockApiResponse);
    });
  });

  test("should return null when an error occurs", async () => {
    (service.post as jest.Mock).mockRejectedValue(new Error("Network Error"));

    const result = await FetchQuickLinkpost(2, false);

    expect(result).toBeNull();
  });

  // ...existing imports and code...

  describe("QuickLink Service tests", () => {
    // ...existing tests...

    describe("FetchQuickLinkData language code branch coverage", () => {
      let originalNavigator: any;

      beforeAll(() => {
        originalNavigator = global.navigator;
      });

      afterEach(() => {
        // Restore the original navigator after each test
        Object.defineProperty(global, "navigator", {
          value: originalNavigator,
          configurable: true,
          writable: true,
        });
      });

      test("should use en-US if navigator.language includes 'en'", async () => {
        Object.defineProperty(global, "navigator", {
          value: { language: "en-GB" },
          configurable: true,
          writable: true,
        });

        const spy = jest.spyOn(service, "get").mockImplementation(() => Promise.resolve(axiosResponse));
        await FetchQuickLinkData(role);
        expect(spy).toHaveBeenCalledWith(
          expect.stringContaining("languageCode=en-US"),
          expect.anything()
        );
        spy.mockRestore();
      });

      test("should use actual language if navigator.language does not include 'en'", async () => {
        Object.defineProperty(global, "navigator", {
          value: { language: "fr-FR" },
          configurable: true,
          writable: true,
        });

        const spy = jest.spyOn(service, "get").mockImplementation(() => Promise.resolve(axiosResponse));
        await FetchQuickLinkData(role);
        expect(spy).toHaveBeenCalledWith(
          expect.stringContaining("languageCode=en-US"),
          expect.anything()
        );
        spy.mockRestore();
      });
      test("should handle missing navigator.language (fallback to en-US and not throw)", async () => {
        Object.defineProperty(global, "navigator", {
          value: {},
          configurable: true,
          writable: true,
        });

        const spy = jest.spyOn(service, "get").mockImplementation(() => Promise.resolve(axiosResponse));
        const result = await FetchQuickLinkData(role);
        expect(spy).toHaveBeenCalledWith(
          expect.stringContaining("languageCode=en-US"),
          expect.anything()
        );
        expect(result).toEqual({ status: 200, response: mockApiResponse });
        spy.mockRestore();
      });

    });
  });

})