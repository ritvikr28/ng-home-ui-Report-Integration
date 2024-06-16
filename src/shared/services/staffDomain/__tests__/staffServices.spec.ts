import { waitFor } from "@testing-library/react";
import { AxiosResponse } from "axios";
import { service } from "../../../utils";
import fetchStaffDetails from "../staffServices";
import { IStaffBasicDetails } from "../../../model/StaffDomain/responseModels";
import { logger } from "../../../components/AppInsights";

const mockStaffDetailsResponse: IStaffBasicDetails[] = [
  {
    externalId: "1a2b3c",
    forename: "John",
    surname: "Doe",
    preferredForename: "Johnny",
    preferredSurname: "Doe",
  },
  {
    externalId: "4d5e6f",
    forename: "Jane",
    surname: "Smith",
    preferredForename: "Janie",
    preferredSurname: "Smith",
  }
];

const axiosResponse: AxiosResponse = {
  data: {
    status: 200,
    error: "",
    payload: mockStaffDetailsResponse,
  },
  status: 200,
  statusText: "OK",
  config: {},
  headers: {},
};

const mockErrorResponse = new Error("Failed to fetch cover staff details");

describe("fetchStaffDetails tests", () => {
  test("should return staff details successfully", async () => {
    jest
      .spyOn(service, "post")
      .mockImplementation(() => Promise.resolve(axiosResponse));

    const staffExternalIds = ["1a2b3c", "4d5e6f"];
    const response = await fetchStaffDetails(staffExternalIds);

    await waitFor(() => {
      expect(response).toEqual({
        status: 200,
        error: "",
        payload: mockStaffDetailsResponse,
      });
    });
  });

  test("should log error and return null on failure", async () => {
    jest
      .spyOn(service, "post")
      .mockImplementation(() => Promise.reject(mockErrorResponse));
    const loggerSpy = jest.spyOn(logger, "error").mockImplementation(() => {});

    const staffExternalIds = ["invalidId"];
    const response = await fetchStaffDetails(staffExternalIds);

    await waitFor(() => {
      expect(response).toBeNull();
      expect(loggerSpy).toHaveBeenCalledWith({
        error: "Failed to fetch cover staff details",
        code: mockErrorResponse.name,
      });
    });

    loggerSpy.mockRestore();
  });
});
