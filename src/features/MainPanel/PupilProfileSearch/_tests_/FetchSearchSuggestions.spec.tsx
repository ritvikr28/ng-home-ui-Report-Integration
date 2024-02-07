import { waitFor } from "@testing-library/react";
import { AxiosResponse } from "axios";
import { service } from "../../../../shared/utils";
import { ISearchSuggestionsResultsApiResponse } from "../../../../shared/model/SearchSuggestions/SearchResultsApiResponse";
import fetchSearchSuggestions from "../utils/FetchSearchSuggestions";

const suggestionresponse:ISearchSuggestionsResultsApiResponse={
    organizationExternalId: "cd0e52dd-8331-44dd-bea4-cf1e99d6e1fe",
    schoolNumber: "1",
    learnerExternalId: "77a766a4-54ca-487d-86a0-4ea89f8a0af5",
    admissionNumber: "001659",
    preferredForename: "Ben",
    preferredSurname: "Pineton",
    preferredName: "Ben Pineton",
    legalForename: "Benjamin",
    legalSurname: "Pinetondsds",
    legalName: "Benjamin Pinetondsds",
    yearGroup: "5",
    classGroup: "(PINE)",
    imagePath: "https://stimagecoredevuksouth.blob.core.windows.net/cd0e52dd-8331-44dd-bea4-cf1e99d6e1fe/77a766a4-54ca-487d-86a0-4ea89f8a0af5?sv=2023-08-03&se=2024-02-07T06%3A11%3A33Z&sr=b&sp=r&sig=buaYi1xDKYpt6S6WenVpsotePBKj3sSZ7tBXXXsZOEs%3D",
    dateOfBirth: "2015-07-30T00:00:00"      
};

const axiosResponse: AxiosResponse = {
    data: {"payload":suggestionresponse},
    status: 200,
    statusText: "OK",
    config: {},
    headers: {},
  };
describe("FeatchSearchSuggestoins test", () => {

    test("fetches suggestions results data successfully", async () => {
        jest
          .spyOn(service, "get")
          .mockImplementation(() => Promise.resolve(axiosResponse));
        const searchResults: any = await fetchSearchSuggestions("ben",8); 
        await waitFor(() => {
          expect(searchResults).toBe(suggestionresponse);
        });
      });
      test("should promise failed", async () => {
        jest
          .spyOn(service, "get")
          .mockImplementation(() => Promise.reject(new Error("error message")));
    
        await expect(fetchSearchSuggestions("ben",8)).rejects.toThrow(new Error("error message"));        
      });
})