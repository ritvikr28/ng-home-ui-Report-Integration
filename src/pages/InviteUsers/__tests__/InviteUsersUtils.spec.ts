import { getUsersData, fetchInviteUserDetails } from "../InviteUsersUtils";
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
      const result = await getUsersData(props);

      expect(service.get).toHaveBeenCalledWith(
        "/InviteUser/Users?PageNumber=1&PageSize=10"
      );
      expect(result).toEqual(mockResponse.data);
    });

    it("should handle API errors gracefully", async () => {
      (service.get as jest.Mock).mockRejectedValue(new Error("API Error"));

      const props = { pageNumber: 1, pageSize: 10 };
      await expect(getUsersData(props)).rejects.toThrow("API Error");
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

      const result = await fetchInviteUserDetails(props);

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

      const result = await fetchInviteUserDetails(props);

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

    const result = await fetchInviteUserDetails(props);

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

    const result = await fetchInviteUserDetails(props);

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

    const result = await fetchInviteUserDetails(props);

    expect(setTotalPage).toHaveBeenCalledWith(2);
    expect(setshowInvitationConflictBanner).toHaveBeenCalledWith(false);
    expect(result).toEqual([]);
  });
});
