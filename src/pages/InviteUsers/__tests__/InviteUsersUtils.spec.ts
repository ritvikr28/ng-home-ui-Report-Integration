import * as InviteUsersUtils from "../InviteUsersUtils";
import { service } from "../../../shared/utils/api-service";

jest.mock("../../../shared/utils/api-service", () => ({
  service: {
    get: jest.fn()
  }
}));

describe("InviteUsersUtils", () => {
  describe("getUsersData", () => {
    it("should fetch user data with correct API call", async () => {
      const mockResponse = { data: { users: [] } };
      (service.get as jest.Mock).mockResolvedValue(mockResponse);

      const props = { pageNumber: 1, pageSize: 10 };
      const result = await InviteUsersUtils.getUsersData(props);

      expect(service.get).toHaveBeenCalledWith(
        "/InviteUser/Users?PageNumber=1&PageSize=10"
      );
      expect(result).toEqual(mockResponse.data);
    });

    it("should handle API errors gracefully", async () => {
      (service.get as jest.Mock).mockRejectedValue(new Error("API Error"));

      const props = { pageNumber: 1, pageSize: 10 };
      await expect(InviteUsersUtils.getUsersData(props)).rejects.toThrow(
        "API Error"
      );
    });
  });

  describe("fetchInviteUserDetails", () => {
    it("should process and return table data correctly", async () => {
      const mockResponse = {
        data: [
          {
            total: 20,
            payload: [
              {
                externalId: "1",
                forename: "John",
                surname: "Doe",
                emailId: "john.doe@example.com",
                userType: "Admin",
                invitationStatus: "Pending"
              }
            ]
          }
        ]
      };
      (service.get as jest.Mock).mockResolvedValue(mockResponse);

      const setTotalPage = jest.fn();
      const setShowErrorBanner = jest.fn();
      const setshowInvitationConflictBanner = jest.fn();

      const props = {
        pageNumber: 1,
        pageSize: 10,
        setTotalPage,
        setShowErrorBanner,
        setshowInvitationConflictBanner
      };

      const result = await InviteUsersUtils.fetchInviteUserDetails(props);

      expect(setTotalPage).toHaveBeenCalledWith(2);
      expect(setshowInvitationConflictBanner).toHaveBeenCalledWith(false);
      expect(result).toEqual([
        {
          id: "1",
          name: "John Doe",
          emailId: "john.doe@example.com",
          userType: "Admin",
          invitationStatus: "Pending",
          actions: {
            options: [
              {
                disabled: false,
                isSelected: false,
                text: "Send Invite",
                value: "SendInvite"
              }
            ]
          },
          isShowActionBtn: true
        }
      ]);
    });

    it("should handle errors and show error banner", async () => {
      (service.get as jest.Mock).mockRejectedValue(new Error("API Error"));

      const setTotalPage = jest.fn();
      const setShowErrorBanner = jest.fn();
      const setshowInvitationConflictBanner = jest.fn();

      const props = {
        pageNumber: 1,
        pageSize: 5,
        setTotalPage,
        setShowErrorBanner,
        setshowInvitationConflictBanner
      };

      const result = await InviteUsersUtils.fetchInviteUserDetails(props);

      expect(setShowErrorBanner).toHaveBeenCalledWith(true);
      expect(result).toEqual([]);
    });
  });
});
describe("fetchInviteUserDetails", () => {
  it("should handle invitation conflict correctly", async () => {
    const mockResponse = {
      data: [
        {
          total: 10,
          payload: [
            {
              externalId: "2",
              forename: "Jane",
              surname: "Smith",
              emailId: "jane.smith@example.com",
              userType: "User",
              invitationStatus: "Invitation conflict"
            }
          ]
        }
      ]
    };
    (service.get as jest.Mock).mockResolvedValue(mockResponse);

    const setTotalPage = jest.fn();
    const setShowErrorBanner = jest.fn();
    const setshowInvitationConflictBanner = jest.fn();

    const props = {
      pageNumber: 1,
      pageSize: 5,
      setTotalPage,
      setShowErrorBanner,
      setshowInvitationConflictBanner
    };

    const result = await InviteUsersUtils.fetchInviteUserDetails(props);

    expect(setTotalPage).toHaveBeenCalledWith(2);
    expect(setshowInvitationConflictBanner).toHaveBeenCalledWith(true);
    expect(result).toEqual([
      {
        id: "2",
        name: "Jane Smith",
        emailId: "jane.smith@example.com",
        userType: "User",
        invitationStatus: "Invitation conflict",
        actions: {
          options: [
            {
              disabled: false,
              isSelected: false,
              text: "Send Invite",
              value: "SendInvite"
            }
          ]
        },
        isShowActionBtn: false
      }
    ]);
  });

  it("should return an empty array if no payload is present", async () => {
    const mockResponse = {
      data: [
        {
          total: 0,
          payload: []
        }
      ]
    };
    (service.get as jest.Mock).mockResolvedValue(mockResponse);

    const setTotalPage = jest.fn();
    const setShowErrorBanner = jest.fn();
    const setshowInvitationConflictBanner = jest.fn();

    const props = {
      pageNumber: 1,
      pageSize: 5,
      setTotalPage,
      setShowErrorBanner,
      setshowInvitationConflictBanner
    };

    const result = await InviteUsersUtils.fetchInviteUserDetails(props);

    expect(setTotalPage).toHaveBeenCalledWith(0);
    expect(setshowInvitationConflictBanner).toHaveBeenCalledWith(false);
    expect(result).toEqual([]);
  });

  it("should handle missing forename or invalid email gracefully", async () => {
    const mockResponse = {
      data: [
        {
          total: 10,
          payload: [
            {
              externalId: "3",
              forename: "",
              surname: "",
              emailId: "Work main email address is missing",
              userType: "User",
              invitationStatus: "Pending"
            }
          ]
        }
      ]
    };
    (service.get as jest.Mock).mockResolvedValue(mockResponse);

    const setTotalPage = jest.fn();
    const setShowErrorBanner = jest.fn();
    const setshowInvitationConflictBanner = jest.fn();

    const props = {
      pageNumber: 1,
      pageSize: 5,
      setTotalPage,
      setShowErrorBanner,
      setshowInvitationConflictBanner
    };

    const result = await InviteUsersUtils.fetchInviteUserDetails(props);

    expect(setTotalPage).toHaveBeenCalledWith(2);
    expect(setshowInvitationConflictBanner).toHaveBeenCalledWith(false);
    expect(result).toEqual([]);
  });
});

describe("inviteUsersSorting", () => {
  let setSortDirection: jest.Mock;
  let setSortBy: jest.Mock;
  let setUsersTableData: jest.Mock;
  let setLoader: jest.Mock;
  let setShowErrorBanner: jest.Mock;
  let setshowInvitationConflictBanner: jest.Mock;
  let fetchInviteUserDetailsSpy: jest.SpyInstance;

  beforeEach(() => {
    setSortDirection = jest.fn();
    setSortBy = jest.fn();
    setUsersTableData = jest.fn();
    setLoader = jest.fn();
    setShowErrorBanner = jest.fn();
    setshowInvitationConflictBanner = jest.fn();

    fetchInviteUserDetailsSpy = jest.spyOn(
      InviteUsersUtils,
      "fetchInviteUserDetails"
    );
    fetchInviteUserDetailsSpy.mockResolvedValue([{ id: "mock" }]);
  });

  afterEach(() => {
    fetchInviteUserDetailsSpy.mockRestore();
  });

  it("should call fetchInviteUserDetails with correct params and update state for 'Name' column", async () => {
    await InviteUsersUtils.inviteUsersSorting(
      "Name",
      true,
      setSortDirection,
      setSortBy,
      2,
      20,
      setUsersTableData,
      setLoader,
      setShowErrorBanner,
      setshowInvitationConflictBanner
    );

    expect(setSortBy).toHaveBeenCalledWith("Forename");
    expect(setSortDirection).toHaveBeenCalledWith(true);
    expect(setLoader).toHaveBeenCalledWith(true);
    expect(fetchInviteUserDetailsSpy).toHaveBeenCalledWith({
      pageNumber: 2,
      pageSize: 20,
      columnName: "Forename",
      sortDirection: true,
      setShowErrorBanner,
      setshowInvitationConflictBanner
    });
    // Wait for the .then() in inviteUsersSorting to resolve
    await Promise.resolve();
    expect(setLoader).toHaveBeenCalledWith(false);
    expect(setUsersTableData).toHaveBeenCalledWith([{ id: "mock" }]);
  });

  it("should call fetchInviteUserDetails with correct params for 'Email' column", async () => {
    await InviteUsersUtils.inviteUsersSorting(
      "Email",
      false,
      setSortDirection,
      setSortBy,
      1,
      10,
      setUsersTableData,
      setLoader,
      setShowErrorBanner,
      setshowInvitationConflictBanner
    );

    expect(setSortBy).toHaveBeenCalledWith("EmailId");
    expect(setSortDirection).toHaveBeenCalledWith(false);
    expect(setLoader).toHaveBeenCalledWith(true);
    expect(fetchInviteUserDetailsSpy).toHaveBeenCalledWith({
      pageNumber: 1,
      pageSize: 10,
      columnName: "EmailId",
      sortDirection: false,
      setShowErrorBanner,
      setshowInvitationConflictBanner
    });
    await Promise.resolve();
    expect(setLoader).toHaveBeenCalledWith(false);
    expect(setUsersTableData).toHaveBeenCalledWith([{ id: "mock" }]);
  });

  it("should call fetchInviteUserDetails with correct params for a custom column", async () => {
    await InviteUsersUtils.inviteUsersSorting(
      "userType",
      true,
      setSortDirection,
      setSortBy,
      3,
      5,
      setUsersTableData,
      setLoader,
      setShowErrorBanner,
      setshowInvitationConflictBanner
    );

    expect(setSortBy).toHaveBeenCalledWith("userType");
    expect(setSortDirection).toHaveBeenCalledWith(true);
    expect(setLoader).toHaveBeenCalledWith(true);
    expect(fetchInviteUserDetailsSpy).toHaveBeenCalledWith({
      pageNumber: 3,
      pageSize: 5,
      columnName: "userType",
      sortDirection: true,
      setShowErrorBanner,
      setshowInvitationConflictBanner
    });
    await Promise.resolve();
    expect(setLoader).toHaveBeenCalledWith(false);
    expect(setUsersTableData).toHaveBeenCalledWith([{ id: "mock" }]);
  });

  it("should handle missing optional callbacks gracefully", async () => {
    await InviteUsersUtils.inviteUsersSorting(
      "Name",
      false,
      setSortDirection,
      setSortBy,
      1,
      1,
      setUsersTableData,
      setLoader
    );

    expect(setSortBy).toHaveBeenCalledWith("Forename");
    expect(setSortDirection).toHaveBeenCalledWith(false);
    expect(setLoader).toHaveBeenCalledWith(true);
    expect(fetchInviteUserDetailsSpy).toHaveBeenCalledWith({
      pageNumber: 1,
      pageSize: 1,
      columnName: "Forename",
      sortDirection: false,
      setShowErrorBanner: undefined,
      setshowInvitationConflictBanner: undefined
    });
    await Promise.resolve();
    expect(setLoader).toHaveBeenCalledWith(false);
    expect(setUsersTableData).toHaveBeenCalledWith([{ id: "mock" }]);
  });
});
