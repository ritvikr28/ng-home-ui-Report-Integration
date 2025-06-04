import * as InviteUsersUtils from "../InviteUsersUtils";
import { service } from "../../../shared/utils/api-service";
import { getValues } from "../InviteUsers.view";
import { debouncedAutosuggest } from "../InviteUsersUtils";

jest.mock("../../../shared/utils/api-service", () => ({
  service: {
    get: jest.fn()
  }
}));

jest.mock("../InviteUsers.view", () => ({
  getValues: jest.fn(() => ["mocked values"])
}));

describe("InviteUsersUtils", () => {
  describe("getUsersData", () => {
    it("should fetch user data with correct API call", async () => {
      const mockResponse = { data: { users: [] } };
      (service.get as jest.Mock).mockResolvedValue(mockResponse);

      const props = { pageNumber: 1, pageSize: 10 };
      const result = await InviteUsersUtils.getUsersData(props);

      expect(service.get).toHaveBeenCalledWith(
        "/InviteUser/Users?PageNumber=1&PageSize=10&SearchTerm=undefined&InvitationStatus=undefined"
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
          isShowActionBtn: true,
          isShowCheckBox: true,
          forename: "John",
          surname: "Doe"
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
        isShowActionBtn: false,
        isShowCheckBox: false,
        forename: "Jane",
        surname: "Smith"
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
describe("fetchInviteUserDetails - tableDataObj mapping", () => {
  let setTotalPage: jest.Mock;
  let setShowErrorBanner: jest.Mock;
  let setshowInvitationConflictBanner: jest.Mock;

  beforeEach(() => {
    setTotalPage = jest.fn();
    setShowErrorBanner = jest.fn();
    setshowInvitationConflictBanner = jest.fn();
    jest.spyOn(InviteUsersUtils, "getUsersData");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should filter out users with empty forename, surname and missing email", async () => {
    (InviteUsersUtils.getUsersData as jest.Mock).mockResolvedValue([
      {
        total: 2,
        payload: [
          {
            externalId: "1",
            forename: "",
            surname: "",
            emailId: "Work main email address is missing",
            userType: "User",
            invitationStatus: "Pending"
          },
          {
            externalId: "2",
            forename: "Jane",
            surname: "Smith",
            emailId: "jane.smith@example.com",
            userType: "User",
            invitationStatus: "Pending"
          }
        ]
      }
    ]);
    const props = {
      pageNumber: 1,
      pageSize: 2,
      setTotalPage,
      setShowErrorBanner,
      setshowInvitationConflictBanner
    };
    const result = await InviteUsersUtils.fetchInviteUserDetails(props);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("2");
  });

  it("should replace missing emailId with 'Primary email unavailable'", async () => {
    (InviteUsersUtils.getUsersData as jest.Mock).mockResolvedValue([
      {
        total: 1,
        payload: [
          {
            externalId: "3",
            forename: "No",
            surname: "Email",
            emailId: "Work main email address is missing",
            userType: "User",
            invitationStatus: "Pending"
          }
        ]
      }
    ]);
    const props = {
      pageNumber: 1,
      pageSize: 1,
      setTotalPage,
      setShowErrorBanner,
      setshowInvitationConflictBanner
    };
    const result = await InviteUsersUtils.fetchInviteUserDetails(props);
    expect(result[0].emailId).toBe("Main work email unavailable");
  });

  it("should set isShowCheckBox and isShowActionBtn to false for 'Accepted' status", async () => {
    (InviteUsersUtils.getUsersData as jest.Mock).mockResolvedValue([
      {
        total: 1,
        payload: [
          {
            externalId: "4",
            forename: "Accepted",
            surname: "User",
            emailId: "accepted@example.com",
            userType: "User",
            invitationStatus: "Accepted"
          }
        ]
      }
    ]);
    const props = {
      pageNumber: 1,
      pageSize: 1,
      setTotalPage,
      setShowErrorBanner,
      setshowInvitationConflictBanner
    };
    const result = await InviteUsersUtils.fetchInviteUserDetails(props);
    expect(result[0].isShowCheckBox).toBe(false);
    expect(result[0].isShowActionBtn).toBe(false);
  });

  it("should set isShowCheckBox and isShowActionBtn to false for 'Invitation conflict' status", async () => {
    (InviteUsersUtils.getUsersData as jest.Mock).mockResolvedValue([
      {
        total: 1,
        payload: [
          {
            externalId: "5",
            forename: "Conflict",
            surname: "User",
            emailId: "conflict@example.com",
            userType: "User",
            invitationStatus: "Invitation conflict"
          }
        ]
      }
    ]);
    const props = {
      pageNumber: 1,
      pageSize: 1,
      setTotalPage,
      setShowErrorBanner,
      setshowInvitationConflictBanner
    };
    const result = await InviteUsersUtils.fetchInviteUserDetails(props);
    expect(result[0].isShowCheckBox).toBe(false);
    expect(result[0].isShowActionBtn).toBe(false);
  });

  it("should set isShowCheckBox and isShowActionBtn to false if emailId is missing", async () => {
    (InviteUsersUtils.getUsersData as jest.Mock).mockResolvedValue([
      {
        total: 1,
        payload: [
          {
            externalId: "6",
            forename: "No",
            surname: "Email",
            emailId: "Work main email address is missing",
            userType: "User",
            invitationStatus: "Pending"
          }
        ]
      }
    ]);
    const props = {
      pageNumber: 1,
      pageSize: 1,
      setTotalPage,
      setShowErrorBanner,
      setshowInvitationConflictBanner
    };
    const result = await InviteUsersUtils.fetchInviteUserDetails(props);
    expect(result[0].isShowCheckBox).toBe(false);
    expect(result[0].isShowActionBtn).toBe(false);
  });

  it("should map forename and surname correctly", async () => {
    (InviteUsersUtils.getUsersData as jest.Mock).mockResolvedValue([
      {
        total: 1,
        payload: [
          {
            externalId: "7",
            forename: "First",
            surname: "Last",
            emailId: "first.last@example.com",
            userType: "User",
            invitationStatus: "Pending"
          }
        ]
      }
    ]);
    const props = {
      pageNumber: 1,
      pageSize: 1,
      setTotalPage,
      setShowErrorBanner,
      setshowInvitationConflictBanner
    };
    const result = await InviteUsersUtils.fetchInviteUserDetails(props);
    expect(result[0].forename).toBe("First");
    expect(result[0].surname).toBe("Last");
    expect(result[0].name).toBe("First Last");
  });

  it("should handle null and undefined fields gracefully", async () => {
    (InviteUsersUtils.getUsersData as jest.Mock).mockResolvedValue([
      {
        total: 1,
        payload: [
          {
            externalId: null,
            forename: undefined,
            surname: undefined,
            emailId: undefined,
            userType: undefined,
            invitationStatus: undefined
          }
        ]
      }
    ]);
    const props = {
      pageNumber: 1,
      pageSize: 1,
      setTotalPage,
      setShowErrorBanner,
      setshowInvitationConflictBanner
    };
    const result = await InviteUsersUtils.fetchInviteUserDetails(props);
    expect(result[0].id).toBe(null);
    expect(result[0].forename).toBeUndefined();
    expect(result[0].surname).toBeUndefined();
    expect(result[0].emailId).toBeUndefined();
    expect(result[0].userType).toBeUndefined();
    expect(result[0].invitationStatus).toBeUndefined();
  });

  it("should map actions.options correctly", async () => {
    (InviteUsersUtils.getUsersData as jest.Mock).mockResolvedValue([
      {
        total: 1,
        payload: [
          {
            externalId: "8",
            forename: "Action",
            surname: "Test",
            emailId: "action.test@example.com",
            userType: "User",
            invitationStatus: "Pending"
          }
        ]
      }
    ]);
    const props = {
      pageNumber: 1,
      pageSize: 1,
      setTotalPage,
      setShowErrorBanner,
      setshowInvitationConflictBanner
    };
    const result = await InviteUsersUtils.fetchInviteUserDetails(props);
    expect(result[0].actions).toEqual({
      options: [
        {
          disabled: false,
          isSelected: false,
          text: "Send Invite",
          value: "SendInvite"
        }
      ]
    });
  });

  it("should return empty array if payload is undefined", async () => {
    (InviteUsersUtils.getUsersData as jest.Mock).mockResolvedValue([
      {
        total: 0,
        payload: undefined
      }
    ]);
    const props = {
      pageNumber: 1,
      pageSize: 1,
      setTotalPage,
      setShowErrorBanner,
      setshowInvitationConflictBanner
    };
    const result = await InviteUsersUtils.fetchInviteUserDetails(props);
    expect(result).toEqual([]);
  });

  it("should return empty array if payload is null", async () => {
    (InviteUsersUtils.getUsersData as jest.Mock).mockResolvedValue([
      {
        total: 0,
        payload: null
      }
    ]);
    const props = {
      pageNumber: 1,
      pageSize: 1,
      setTotalPage,
      setShowErrorBanner,
      setshowInvitationConflictBanner
    };
    const result = await InviteUsersUtils.fetchInviteUserDetails(props);
    expect(result).toEqual([]);
  });
});

describe("handleSendInvite", () => {
  it("should call postSendInvitation and setDataUpdated on success", async () => {
    const setLoader = jest.fn();
    const setShowInviteErrBanner = jest.fn();
    const setDataUpdated = jest.fn();
    const selectedRowItem = {
      id: "1",
      emailId: "test@example.com",
      forename: "Test",
      surname: "User"
    };
    jest.spyOn(InviteUsersUtils, "postSendInvitation").mockResolvedValue({});

    await InviteUsersUtils.handleSendInvite({
      requestBody: [
        {
          emailId: selectedRowItem.emailId,
          externalId: selectedRowItem.id,
          forename: selectedRowItem.forename,
          surname: selectedRowItem.surname
        }
      ],
      setLoader,
      setShowInviteErrBanner,
      setDataUpdated
    });

    expect(setLoader).toHaveBeenCalledWith(true);
    expect(InviteUsersUtils.postSendInvitation).toHaveBeenCalledWith({
      requestBody: [
        {
          emailId: "test@example.com",
          externalId: "1",
          forename: "Test",
          surname: "User"
        }
      ],
      setShowInviteErrBanner
    });
    expect(setDataUpdated).toHaveBeenCalledWith(true);
  });

  it("should call postSendInvitation and setDataUpdated on success with array of selectedRowItems", async () => {
    const setLoader = jest.fn();
    const setShowInviteErrBanner = jest.fn();
    const setDataUpdated = jest.fn();
    const selectedRowItem = [
      {
        id: "1",
        emailId: "test@example.com",
        forename: "Test",
        surname: "User"
      },
      {
        id: "2",
        emailId: "another@example.com",
        forename: "Another",
        surname: "Person"
      }
    ];
    jest.spyOn(InviteUsersUtils, "postSendInvitation").mockResolvedValue({});

    await InviteUsersUtils.handleSendInvite({
      requestBody: selectedRowItem.map((item) => ({
        emailId: item.emailId,
        externalId: item.id,
        forename: item.forename,
        surname: item.surname
      })),
      setLoader,
      setShowInviteErrBanner,
      setDataUpdated
    });

    expect(setLoader).toHaveBeenCalledWith(true);
    expect(InviteUsersUtils.postSendInvitation).toHaveBeenCalledWith({
      requestBody: [
        {
          emailId: "test@example.com",
          externalId: "1",
          forename: "Test",
          surname: "User"
        },
        {
          emailId: "another@example.com",
          externalId: "2",
          forename: "Another",
          surname: "Person"
        }
      ],
      setShowInviteErrBanner
    });
    expect(setDataUpdated).toHaveBeenCalledWith(true);
  });

  it("should setLoader(true)", async () => {
    const setLoader = jest.fn();
    const setShowInviteErrBanner = jest.fn();
    const setDataUpdated = jest.fn();
    const selectedRowItem = [
      {
        id: "1",
        emailId: "test@example.com",
        forename: "Test",
        surname: "User"
      }
    ];

    await InviteUsersUtils.handleSendInvite({
      requestBody: selectedRowItem.map((item) => ({
        emailId: item.emailId,
        externalId: item.id,
        forename: item.forename,
        surname: item.surname
      })),
      setLoader,
      setShowInviteErrBanner,
      setDataUpdated
    });

    expect(setLoader).toHaveBeenCalledWith(true);
  });
});

describe("handleCheckBoxSelection", () => {
  it("should add id if not present", () => {
    const setSelectedCheckBoxIds = jest.fn();
    InviteUsersUtils.handleCheckBoxSelection({
      id: "2",
      selectedCheckBoxIds: ["1"],
      setSelectedCheckBoxIds
    });
    expect(setSelectedCheckBoxIds).toHaveBeenCalledWith(["1", "2"]);
  });

  it("should remove id if already present", () => {
    const setSelectedCheckBoxIds = jest.fn();
    InviteUsersUtils.handleCheckBoxSelection({
      id: "1",
      selectedCheckBoxIds: ["1", "2"],
      setSelectedCheckBoxIds
    });
    expect(setSelectedCheckBoxIds).toHaveBeenCalledWith(["2"]);
  });
});

describe("handleSelectedUserData", () => {
  it("should update usersTableData with isCheckboxSelected true for selected ids", () => {
    const setUsersTableData = jest.fn();
    const usersTableData = [
      {
        id: "1",
        name: "A",
        emailId: "a@example.com",
        externalId: "1",
        forename: "A",
        surname: "Test",
        userType: "User",
        invitationStatus: "Pending",
        actions: { options: [] },
        isShowActionBtn: true,
        isShowCheckBox: true
      },
      {
        id: "2",
        name: "B",
        emailId: "b@example.com",
        externalId: "2",
        forename: "B",
        surname: "Test",
        userType: "User",
        invitationStatus: "Pending",
        actions: { options: [] },
        isShowActionBtn: true,
        isShowCheckBox: true
      }
    ];
    InviteUsersUtils.handleSelectedUserData({
      selectedCheckBoxIds: ["2"],
      usersTableData,
      setUsersTableData
    });
    expect(setUsersTableData).toHaveBeenCalledWith([
      {
        ...usersTableData[0],
        isCheckboxSelected: false
      },
      {
        ...usersTableData[1],
        isCheckboxSelected: true
      }
    ]);
  });

  it("should do nothing if usersTableData is empty", () => {
    const setUsersTableData = jest.fn();
    InviteUsersUtils.handleSelectedUserData({
      selectedCheckBoxIds: ["1"],
      usersTableData: [],
      setUsersTableData
    });
    expect(setUsersTableData).not.toHaveBeenCalled();
  });
});

describe("handleSearch", () => {
  let setSearchLoader: jest.Mock;
  let setSearchSuggestions: jest.Mock;
  let setSearchAndStatusFilter: jest.Mock;
  let setShowSearchError: jest.Mock;
  let event: any;

  beforeEach(() => {
    setSearchLoader = jest.fn();
    setSearchSuggestions = jest.fn();
    setSearchAndStatusFilter = jest.fn();
    setShowSearchError = jest.fn();
    event = { target: { value: "" } };
    (getValues as jest.Mock).mockClear();
    (service.get as jest.Mock).mockClear();
  });

  it("returns undefined and disables loader if input is empty", async () => {
    const result = await InviteUsersUtils.handleSearch(
      event,
      setSearchLoader,
      setSearchSuggestions,
      setSearchAndStatusFilter,
      setShowSearchError,
      { selectedStatus: { value: "All" } }
    );
    expect(setSearchLoader).toHaveBeenCalledWith(false);
    expect(result).toBeUndefined();
  });

  it("returns undefined if input is less than 2 characters", async () => {
    event.target.value = "a";
    const result = await InviteUsersUtils.handleSearch(
      event,
      setSearchLoader,
      setSearchSuggestions,
      setSearchAndStatusFilter,
      setShowSearchError,
      { selectedStatus: { value: "All" } }
    );
    expect(result).toBeUndefined();
  });
});
describe("debouncedAutosuggest", () => {
  let setSearchLoader: jest.Mock;
  let setSearchSuggestions: jest.Mock;
  let setShowSearchError: jest.Mock;
  let searchAndStatusFilter: any;
  let event: any;

  beforeEach(() => {
    jest.useFakeTimers();
    setSearchLoader = jest.fn();
    setSearchSuggestions = jest.fn();
    setShowSearchError = jest.fn();
    searchAndStatusFilter = { selectedStatus: { value: "All" } };
    event = { target: { value: "test" } };
    (service.get as jest.Mock).mockClear();
    (getValues as jest.Mock).mockClear();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it("should not call API immediately", async () => {
    debouncedAutosuggest(
      event,
      setSearchLoader,
      setSearchSuggestions,
      setShowSearchError,
      searchAndStatusFilter
    );
    expect(service.get).not.toHaveBeenCalled();
  });

  it("should call API after debounce delay", async () => {
    (service.get as jest.Mock).mockResolvedValue({ data: ["suggestion"] });
    (getValues as jest.Mock).mockReturnValue(["suggestion"]);
    debouncedAutosuggest(
      event,
      setSearchLoader,
      setSearchSuggestions,
      setShowSearchError,
      searchAndStatusFilter
    );
    jest.advanceTimersByTime(1000);
    // Wait for async
    await Promise.resolve();
    expect(service.get).toHaveBeenCalled();
    expect(setSearchLoader).toHaveBeenCalledWith(true);
  });

  it("should cancel previous call if new event comes in before delay", async () => {
    debouncedAutosuggest(
      event,
      setSearchLoader,
      setSearchSuggestions,
      setShowSearchError,
      searchAndStatusFilter
    );
    event.target.value = "test2";
    debouncedAutosuggest(
      event,
      setSearchLoader,
      setSearchSuggestions,
      setShowSearchError,
      searchAndStatusFilter
    );
    jest.advanceTimersByTime(1000);
    await Promise.resolve();
    expect(service.get).toHaveBeenCalledTimes(1);
  });

  it("should not call API if input is empty or whitespace", async () => {
    event.target.value = " ";
    debouncedAutosuggest(
      event,
      setSearchLoader,
      setSearchSuggestions,
      setShowSearchError,
      searchAndStatusFilter
    );
    jest.advanceTimersByTime(1000);
    await Promise.resolve();
    expect(service.get).not.toHaveBeenCalled();
    expect(setSearchLoader).toHaveBeenCalledWith(false);
  });

  it("should handle API errors and set error state", async () => {
    (service.get as jest.Mock).mockRejectedValue(new Error("API Error"));
    debouncedAutosuggest(
      event,
      setSearchLoader,
      setSearchSuggestions,
      setShowSearchError,
      searchAndStatusFilter
    );
    jest.advanceTimersByTime(1000);
    await Promise.resolve();
    expect(setShowSearchError).toHaveBeenCalledWith(false);
    expect(setSearchLoader).toHaveBeenCalledWith(true);
  });
});
