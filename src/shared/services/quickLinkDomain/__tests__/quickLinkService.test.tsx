import { AxiosResponse } from "axios";
import { waitFor } from "@testing-library/react";
import { service } from "../../../utils";
import { IQuickLinkApiResponse } from "../../../model/quickLink/responsemodels";
import { FetchQuickLinkData, FetchQuickLinkpost } from "../quickLinkService";


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


const axiosResponse: AxiosResponse = {
  data: mockApiResponse,
  status: 200,
  statusText: "OK",
  config: {},
  headers: {}
};

const role = "Teacher";
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
          expect.stringContaining("languageCode=fr-FR"),
          expect.anything()
        );
        spy.mockRestore();
      });

      test("should handle missing navigator.language (fallback to en-US and not throw)", async () => {
        // Remove navigator.language
        Object.defineProperty(global, "navigator", {
          value: {},
          configurable: true,
          writable: true,
        });

        const spy = jest.spyOn(service, "get").mockImplementation(() => Promise.resolve(axiosResponse));
        const result = await FetchQuickLinkData(role);
        expect(result).toBeNull();
        expect(spy).not.toHaveBeenCalled();
        spy.mockRestore();
      });
    });
  });

})