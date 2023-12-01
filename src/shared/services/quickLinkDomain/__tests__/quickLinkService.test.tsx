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

  const axiosResponsesstatus: AxiosResponse = {
    data: mockApiResponse,
    status: 500,
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
        jest
          .spyOn(service, "get")
          .mockImplementation(() => Promise.resolve(axiosResponsesstatus));
          
          try {
            await FetchQuickLinkData(role);
          } catch (error: any) {
            expect(error.message).toBe('Failed to fetch quick link details');
          }
      });

      test("should promise failed", async () => {
        jest
          .spyOn(service, "get")
          .mockImplementation(() => Promise.reject(new Error("Failed to fetch quick link details")));
    
        await expect(FetchQuickLinkData(role)).rejects.toThrow(new Error("Failed to fetch quick link details"));
        
      });
    
      test("should return QuickLink post data", async () => {
        const id= 1;
        const operation = true;
        jest
          .spyOn(service, "get")
          .mockImplementation(() => Promise.resolve(axiosResponse));
          const response: any = await FetchQuickLinkpost(id,operation);
      
        await waitFor(() => {
          expect(response.status).toBe(200);
          expect(response.response).toEqual(mockApiResponse);
        });
      });

})