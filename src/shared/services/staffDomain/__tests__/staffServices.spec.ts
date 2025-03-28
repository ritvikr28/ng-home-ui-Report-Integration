import { waitFor } from "@testing-library/react";
import { AxiosResponse } from "axios";
import { service } from "../../../utils";
import { fetchStaffDetails } from "../staffServices";
import { IStaffBasicDetails } from "../../../model/StaffDomain/responseModels";

const mockStaffDetailsResponse: IStaffBasicDetails[] = [
  {
    externalId: "1a2b3c",
    forename: "John",
    surname: "Doe",
    preferredForename: "Johnny",
    preferredSurname: "Doe"
  },
  {
    externalId: "4d5e6f",
    forename: "Jane",
    surname: "Smith",
    preferredForename: "Janie",
    preferredSurname: "Smith"
  }
];

const axiosResponse: AxiosResponse = {
  data: {
    status: 200,
    error: "",
    payload: mockStaffDetailsResponse
  },
  status: 200,
  statusText: "OK",
  config: {},
  headers: {}
};

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
        payload: mockStaffDetailsResponse
      });
    });
  });

  test("should return null when an error occurs", async () => {
    (service.post as jest.Mock).mockRejectedValue(new Error("Network Error"));

    const staffExternalIds = ["1a2b3c", "4d5e6f"];
    const response = await fetchStaffDetails(staffExternalIds);

    expect(response).toBeNull();
  });
});
