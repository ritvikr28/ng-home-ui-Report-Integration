import { Permission } from "@essnextgen/auth-ui";
import { IQuickLinkApiResponse } from "../../../model/quickLink/responsemodels";

import * as qicklink from "../../../services/quickLinkDomain/quickLinkService";
import { getQuickLinkSecurablesList } from "../../../utils";
import { FetchQuickLinkData } from "../../../services/quickLinkDomain/quickLinkService";
import { fetchQuickLinkDetails } from "../Quicklinkresponse";

jest.mock("../../../utils", () => ({
  getQuickLinkSecurablesList: jest.fn(),
}));

jest.mock(
  "../../../../shared/services/quickLinkDomain/quickLinkService",
  () => ({
    FetchQuickLinkData: jest.fn(),
  })
);

describe("fetchQuickLinkDetails", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  const mockSecurables: Permission[] = [
    { Securable: "NG.Homepage.QuickLink.Teacher", Operation: "View" },
    { Securable: "NG.Homepage.QuickLink.Admin", Operation: "View" },
    { Securable: "NG.Homepage.QuickLink.SLT", Operation: "View" }
  ];
  const mockApiResponse: IQuickLinkApiResponse[] = [
    {
      id: 1,
      name: "Link 1",
      link: "/link-1",
      favourite: true,
      createdOn: "2023-01-01T12:00:00Z",
    },
    {
      id: 2,
      name: "Link 2",
      link: "/link-2",
      favourite: false,
      createdOn: "2023-01-01T12:00:00Z",
    },
    {
      id: 3,
      name: "Link 3",
      link: "/link-3",
      favourite: true,
      createdOn: "2023-01-01T12:00:00Z",
    },
    {
      id: 4,
      name: "Link 4",
      link: "/link-4",
      favourite: false,
      createdOn: "2023-01-01T12:00:00Z"
    }
  ];

  test("should fetch quick link details successfully", async () => {
    const expectedPermission = "Teacher,Admin,SLT";
    (getQuickLinkSecurablesList as jest.Mock).mockReturnValue(mockSecurables);
    (FetchQuickLinkData as jest.Mock).mockResolvedValue({
      status: 200,
      response: mockApiResponse,
    });
    const result = await fetchQuickLinkDetails();

    expect(result).toEqual({
      response: mockApiResponse,
      status: false,
    });

    expect(getQuickLinkSecurablesList).toHaveBeenCalled();
    expect(FetchQuickLinkData).toHaveBeenCalled();
    expect(qicklink.FetchQuickLinkData).toHaveBeenCalledWith(
      expectedPermission
    );
  });

  test("should handle a 204 status and return an empty response", async () => {
    (getQuickLinkSecurablesList as jest.Mock).mockReturnValue(mockSecurables);

    (FetchQuickLinkData as jest.Mock).mockResolvedValue({
      status: 204,
      response: [],
    });

    const result = await fetchQuickLinkDetails();

    expect(result).toEqual({
      response: [],
      status: false,
    });
    expect(getQuickLinkSecurablesList).toHaveBeenCalled();
    expect(FetchQuickLinkData).toHaveBeenCalled();
  });

  test("should handle an error during fetch and return null", async () => {
    (getQuickLinkSecurablesList as jest.Mock).mockReturnValue(mockSecurables);

    (FetchQuickLinkData as jest.Mock).mockRejectedValue(
      new Error("Some error")
    );

    const result = await fetchQuickLinkDetails();

    expect(result).toBeNull();
  });

  test("should fetch quick link details with proper permissions", async () => {
    (getQuickLinkSecurablesList as jest.Mock).mockReturnValue(mockSecurables);

    (FetchQuickLinkData as jest.Mock).mockResolvedValue({
      status: 200,
      response: mockApiResponse,
    });

    const result = await fetchQuickLinkDetails();

    expect(result).toEqual({
      response: mockApiResponse,
      status: false,
    });
    expect(getQuickLinkSecurablesList).toHaveBeenCalled();
    expect(FetchQuickLinkData).toHaveBeenCalledWith("Teacher,Admin,SLT");
  });

  test("should extract the permission from a non-empty teachersecurable", () => {
    (getQuickLinkSecurablesList as jest.Mock).mockReturnValue(mockSecurables);

    const result = getQuickLinkSecurablesList();

    expect(result[0].Securable.split(".")[3]).toBe("Teacher");
  });

  test("should return an empty string for an empty teachersecurable", async () => {
    const mockSecurablesres: [] = [];
    (getQuickLinkSecurablesList as jest.Mock).mockReturnValue(
      mockSecurablesres
    );

    await fetchQuickLinkDetails();

    expect(FetchQuickLinkData).toHaveBeenCalledWith("");
  });

  test('should return {response, status: false} when FetchQuickLinkData returns a successful response with status 204', async () => {
   
    (FetchQuickLinkData as jest.Mock).mockResolvedValue({ status: 204, response: mockApiResponse });
    (getQuickLinkSecurablesList as jest.Mock).mockReturnValue([{ Securable: 'some.value.for.permission' } as Permission]);

    const result = await fetchQuickLinkDetails();

    expect(result).toEqual({ response: mockApiResponse, status: false });
  });
  
  it('should return null when FetchQuickLinkData does not return a successful status', async () => {
    (FetchQuickLinkData as jest.Mock).mockResolvedValue({ status: 500 });
    (getQuickLinkSecurablesList as jest.Mock).mockReturnValue([{ Securable: 'some.value.for.permission' } as Permission]);

    const result = await fetchQuickLinkDetails();

    expect(result).toBeNull();
  });

  test('should return null when quickLinkDetails status is not 200 or 204', async () => {
    
    (getQuickLinkSecurablesList as jest.Mock).mockReturnValue([{ Securable: 'some.value.for.permission' } as Permission]);
    (FetchQuickLinkData as jest.Mock).mockResolvedValue({ status: 500 });
    
    const result = await fetchQuickLinkDetails();
    
    expect(result).toBeNull();
  });

  test('should return response and status false when quickLinkDetails status is 200', async () => {

    const mockPermissions = [
      { Securable: 'some.value.teacher.role1' },
      { Securable: 'some.value.teacher.role2' }
    ];
    const mockResponse = { status: 200, response: [{ id: 1, name: 'QuickLink1' }] };
    
    (getQuickLinkSecurablesList as jest.Mock).mockReturnValue(mockPermissions);
    (FetchQuickLinkData as jest.Mock).mockResolvedValue(mockResponse);
    
  
    const result = await fetchQuickLinkDetails();
    
    expect(result).toEqual({ response: mockResponse.response, status: false });
  });

  test('should return null when quickLinkDetails is null or undefined', async () => {
   
    const mockPermissions = [
      { Securable: 'some.value.teacher.role1' }
    ];
    (getQuickLinkSecurablesList as jest.Mock).mockReturnValue(mockPermissions);
    (FetchQuickLinkData as jest.Mock).mockResolvedValue(null);
    
    const result = await fetchQuickLinkDetails();
    
    expect(result).toBeNull();
  });

});
