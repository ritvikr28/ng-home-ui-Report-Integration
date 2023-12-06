import { Permission } from "@essnextgen/auth-ui";
import { IQuickLinkApiResponse } from "../../../model/quickLink/responsemodels";

import * as qicklink from "../../../services/quickLinkDomain/quickLinkService";
import {getQuickLinkSecurablesList} from  "../../../utils";
import { FetchQuickLinkData } from "../../../services/quickLinkDomain/quickLinkService";


jest.mock("../../../utils", () => ({
    getQuickLinkSecurablesList: jest.fn()
  }));

  jest.mock(
    "../../../../shared/services/quickLinkDomain/quickLinkService",
    () => ({
      FetchQuickLinkData: jest.fn(),
    })
  );

 
describe('fetchQuickLinkDetails', () => {
   
    beforeEach(() => {
        jest.clearAllMocks();
      });

    const mockSecurables: Permission[] = [{ Securable: 'NG.Homepage.QuickLink.Teacher', Operation: "View" }];
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
    const mockres:any={
        status: 200,
        responseData:mockApiResponse
      }
    
    test('should fetch quick link details successfully', async () => {
        const expectedPermission = 'Teacher';
        (getQuickLinkSecurablesList as jest.Mock).mockReturnValue(mockSecurables);

      jest
      .spyOn(qicklink, "FetchQuickLinkData")
      .mockResolvedValue(mockres);
      (FetchQuickLinkData as jest.Mock).mockReturnValue(mockres);
      const quickLinkDetails = await FetchQuickLinkData("Teacher");
      console.log("quickLinkDetails",quickLinkDetails);

     expect(quickLinkDetails).toEqual({ responseData: mockApiResponse, status: 200 });
      
      expect(qicklink.FetchQuickLinkData).toHaveBeenCalledWith(expectedPermission);
    });
  
  });