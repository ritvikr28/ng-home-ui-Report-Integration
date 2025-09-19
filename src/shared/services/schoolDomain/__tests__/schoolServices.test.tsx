import { waitFor } from "@testing-library/react";
import { AxiosResponse } from "axios";
import { service } from "../../../utils";
import { FetchGroupMemberDetailsData, FetchStaffTimeTableEventsData, useFetchSchoolNameData } from "../schoolServices";
import { ISchoolName } from "../../../../features/MainPanel/WelcomeUser/model";
import { IGroupMemberDetailsResponse } from "../../../model/SchoolDomain/responsemodels";
 
const mockApiResponse: ISchoolName = {
    externalId: "822cd4b0-a50b-4e58-bf67-262835cfb4b5",
    schoolName: "test",
  };
const axiosResponse: AxiosResponse = {
    data: mockApiResponse,
    status: 200,
    statusText: "OK",
    config: {},
    headers: {}
  };
 
  const mockListofGroupExternalId: IGroupMemberDetailsResponse[] = [
    {
      membershipId: "20be3c01-76c0-4cbe-ba1a-59d91ede62fe",
      pupilExternalId: "f77d8422-c3c4-4cfc-b64b-dffd3e38a9c1",
      startDate: "2023-09-04T00:00:00",
      endDate: "2024-07-19T00:00:00",
      yearGroup: {
        externalId: "2b459f51-407d-4a52-ab4a-341f89259fb1",
        name: "Year  7",
      },
      regGroup: {
        externalId: "d846ee5e-3486-4727-b0a1-bc9389b4c3ac",
        name: "7A",
      },
      personalInfo: {
        preferredForename: "Borris",
        preferredSurname: "Becker",
        preferredName: "Borris Becker",
        legalForename: "Borris",
        legalSurname: "Becker",
        legalName: "Borris Becker",
      },
      personImage: null,
    },
    {
      membershipId: "7607fe8b-7063-423f-a5c2-26fff7c36c2d",
      pupilExternalId: "a0818c4a-cb7c-442d-9329-346505160794",
      startDate: "2023-09-04T00:00:00",
      endDate: "2024-07-19T00:00:00",
      yearGroup: {
        externalId: "2b459f51-407d-4a52-ab4a-341f89259fb1",
        name: "Year  7",
      },
      regGroup: {
        externalId: "ab4d38b5-ad43-488e-8977-7edf527db780",
        name: "7C",
      },
      personalInfo: {
        preferredForename: "Harvey",
        preferredSurname: "Anderson",
        preferredName: "Harvey Anderson",
        legalForename: "Harvey",
        legalSurname: "Anderson",
        legalName: "Harvey Anderson",
      },
      personImage: null,
    }
  ];
 
  const data: any = {
    data: mockListofGroupExternalId
  }
 
  const mockGroupResponse: AxiosResponse = {
    data,
    status: 200,
    statusText: "OK",
    config: {},
    headers: {}
  };
 
describe("School Service tests", () => {
 
 
    test("should return school Name", async () => {
        jest
          .spyOn(service, "get")
          .mockImplementation(() => Promise.resolve(axiosResponse));
          const schoolData: any = await useFetchSchoolNameData();
     
        await waitFor(() => {
          expect(schoolData.schoolName).toBe("test");
         
        });
      });
     
      test("should return null when an error occurs", async () => {
        (service.get as jest.Mock).mockRejectedValue(new Error("Network Error"));
    
        const result = await useFetchSchoolNameData();
    
        expect(result).toBeNull();
      });
})
 
describe("Fetch group member details tests", () => {
  test("should return group member details", async () => {
    jest
          .spyOn(service, "get")
          .mockImplementation(() => Promise.resolve(mockGroupResponse));
          const groupDataResponse:any = await FetchGroupMemberDetailsData('822cd4b0-a50b-4e58-bf67-262835cfb4b5', Date.UTC.toString(), Date.UTC.toString());
     
        await waitFor(() => {
          expect(groupDataResponse.length).toBe(2);      
        });
    });
 
 
    test("should return null when an error occurs", async () => {
      (service.get as jest.Mock).mockRejectedValue(new Error("Network Error"));
  
      const result = await FetchGroupMemberDetailsData('822cd4b0-a50b-4e58-bf67-262835cfb4b5', Date.UTC.toString(), Date.UTC.toString());
  
      expect(result).toBeNull();
    });
})


describe("FetchStaffTimeTableEventsData", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns status and responseData on success", async () => {
    const mockData = [{ externalId: "1" }];
    (service.get as jest.Mock) = jest.fn().mockResolvedValue({
      status: 200,
      data: mockData
    });
    const result = await FetchStaffTimeTableEventsData();
    expect(result).toEqual({ status: 200, responseData: mockData });
  });

  it("returns null on error", async () => {
    (service.get as jest.Mock) = jest.fn().mockRejectedValue(new Error("fail"));
    const result = await FetchStaffTimeTableEventsData();
    expect(result).toBeNull();
  });
});
