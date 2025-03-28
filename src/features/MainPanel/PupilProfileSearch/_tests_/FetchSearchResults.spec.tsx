import { waitFor } from "@testing-library/react";
import { AxiosResponse } from "axios";
import { service } from "../../../../shared/utils";
import fetchSearchResults from "../utils/FetchSearchResults";

import { ISearchResultsApiResponse } from "../../../../shared/model/SearchSuggestions/SearchResultsApiResponse";

const searchresponse: ISearchResultsApiResponse = {
  organizationExternalId: "cd0e52dd-8331-44dd-bea4-cf1e99d6e1fe",
  schoolNumber: "1",
  learnerExternalId: "77a766a4-54ca-487d-86a0-4ea89f8a0af5",
  admissionNumber: "001659",
  learnerPreferredForename: "Ben",
  learnerPreferredSurname: "Pineton",
  learnerPreferredName: "Ben Pineton",
  learnerLegalForename: "Benjamin",
  learnerLegalSurname: "Pinetondsds",
  learnerLegalName: "Benjamin Pinetondsds",
  currentYearGroup: "5",
  currentPrimaryClass: "(PINE)",
  learnerPhotograph:
    "https://stimagecoredevuksouth.blob.core.windows.net/cd0e52dd-8331-44dd-bea4-cf1e99d6e1fe/77a766a4-54ca-487d-86a0-4ea89f8a0af5?sv=2023-08-03&se=2024-02-07T06%3A11%3A33Z&sr=b&sp=r&sig=buaYi1xDKYpt6S6WenVpsotePBKj3sSZ7tBXXXsZOEs%3D",
  learnerDateOfBirth: "2015-07-30T00:00:00",
  learnerContactExternalId: "0ae7c4ff-ef5e-4a09-8a02-9c5ec937a7d6",
  contactForename: "Carlie",
  contactSurname: "Pineton",
  contactPriority: 1,
  hasCourtOrder: false,
  hasCourtOrderFavour: false,
  canPickUp: false,
  hasParentalResponsibility: true,
  contactRelationshipType: "Social Worker",
  contactTitle: "Mrs",
  contactEmailExternalId: "cbd1d7dc-4a13-4f6b-b53a-98c4ebb0c6ec",
  contactEmailAddress: "longemailtestPineton@youlogdoaminexample.com",
  emailLocationType: "Home",
  contactTelephoneExternalId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  contactTelephoneNumber: "string",
  telephoneLocationType: "",
  personalPronoun: "He / Him / His"
};

const axiosResponse: AxiosResponse = {
  data: { payload: searchresponse },
  status: 200,
  statusText: "OK",
  config: {},
  headers: {}
};
describe("FeatchSearchResults test", () => {
  test("fetches search results data successfully", async () => {
    jest
      .spyOn(service, "get")
      .mockImplementation(() => Promise.resolve(axiosResponse));
    const searchResults: any = await fetchSearchResults("ben", "Current");
    await waitFor(() => {
      expect(searchResults).toBe(searchresponse);
    });
  });
  test("should promise failed", async () => {
    jest
      .spyOn(service, "get")
      .mockImplementation(() => Promise.reject(new Error("error message")));

    await expect(fetchSearchResults("ben", "Current")).rejects.toThrow(
      new Error("error message")
    );
  });
});
