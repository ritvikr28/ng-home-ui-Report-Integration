import { waitFor } from "@testing-library/react";
import { AxiosResponse } from "axios";
import { service } from "../../../utils";
import { useFetchSchoolNameData } from "../schoolServices";
import { ISchoolName } from "../../../../features/MainPanel/WelcomeUser/model";

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
})