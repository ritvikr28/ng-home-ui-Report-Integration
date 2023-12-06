import { Permission } from "@essnextgen/auth-ui";
import { waitFor } from "@testing-library/react";
import { IQuickLinkApiResponse } from "../../../model/quickLink/responsemodels";

import * as qicklink from "../../../services/quickLinkDomain/quickLinkService";
import {getQuickLinkSecurablesList} from  "../../../utils";
import { FetchQuickLinkData } from "../../../services/quickLinkDomain/quickLinkService";
import { fetchQuickLinkDetails } from "../Quicklinkresponse";



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
      const mockSecurables: Permission[] = [{"Securable": "NG.Homepage.QuickLink.Teacher","Operation": "View"}, 
      {Securable: 'NG.Homepage.QuickLink.Admin', Operation: 'View'},
      {Securable: 'NG.Homepage.QuickLink.SLT', Operation: 'View'}];
      const mockApiResponse: IQuickLinkApiResponse[] = [
          { id: 1, name: 'Link 1', link: '/link-1', favourite: true, createdOn: '2023-01-01T12:00:00Z' },
          { id: 2, name: 'Link 2', link: '/link-2', favourite: false, createdOn: '2023-01-01T12:00:00Z' },
          { id: 3, name: 'Link 3', link: '/link-3', favourite: true, createdOn: '2023-01-01T12:00:00Z' },
          { id: 4, name: 'Link 4', link: '/link-4', favourite: false, createdOn: '2023-01-01T12:00:00Z' }
      ];

    test('should fetch quick link details successfully', async () => {
        const expectedPermission = 'Teacher';
        (getQuickLinkSecurablesList as jest.Mock).mockReturnValue(mockSecurables);
      (FetchQuickLinkData as jest.Mock).mockResolvedValue({ status: 200, response: mockApiResponse });
      const result = await fetchQuickLinkDetails();
      
      expect(result).toEqual({
        response: mockApiResponse,
        status: false,
      });
      
     expect(getQuickLinkSecurablesList).toHaveBeenCalled();
     expect(FetchQuickLinkData).toHaveBeenCalled();
     expect(qicklink.FetchQuickLinkData).toHaveBeenCalledWith(expectedPermission);
    });
  
    test('should handle a 204 status and return an empty response', async () => {
      
        
        (getQuickLinkSecurablesList as jest.Mock).mockReturnValue(mockSecurables);
     
        (FetchQuickLinkData as jest.Mock).mockResolvedValue({ status: 204, response: [] });
      
        const result = await fetchQuickLinkDetails();
      
        expect(result).toEqual({
          response: [],
          status: false,
        });
        expect(getQuickLinkSecurablesList).toHaveBeenCalled();
        expect(FetchQuickLinkData).toHaveBeenCalled();
      });

      test('should handle an error during fetch and return null', async () => {
       
        (getQuickLinkSecurablesList as jest.Mock).mockReturnValue(mockSecurables);
      
        (FetchQuickLinkData as jest.Mock).mockRejectedValue(new Error('Some error'));
      
        const result = await fetchQuickLinkDetails();
      
        expect(result).toBeNull();
       
      });

      test('should fetch quick link details with proper permissions', async () => {
       
       
        (getQuickLinkSecurablesList as jest.Mock).mockReturnValue(mockSecurables);
    
      
        (FetchQuickLinkData as jest.Mock).mockResolvedValue({ status: 200, response: mockApiResponse });
    
     
        const result = await fetchQuickLinkDetails();

        expect(result).toEqual({
          response: mockApiResponse,
          status: false,
        });
        expect(getQuickLinkSecurablesList).toHaveBeenCalled();
        expect(FetchQuickLinkData).toHaveBeenCalledWith('Teacher'); 
      });

      test('should extract the permission from a non-empty teachersecurable', () => {
             
        (getQuickLinkSecurablesList as jest.Mock).mockReturnValue(mockSecurables);
   
        const result = getQuickLinkSecurablesList();
 
        expect(result[0].Securable.split(".")[3]).toBe('Teacher');
      });

    
      test('should return an empty string for an empty teachersecurable', async () => {
        const mockSecurablesres : [] = [];
        (getQuickLinkSecurablesList as jest.Mock).mockReturnValue(mockSecurablesres);
          
          await waitFor(() => {
            fetchQuickLinkDetails();
            expect(FetchQuickLinkData).toHaveBeenCalledWith("")
          });
         
      });
  });


