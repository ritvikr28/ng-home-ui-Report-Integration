
import { buildApplicationUrl } from "@essnextgen/ui-application-kit";
import { getNotificationTableData, getViewData, markAsRead, getSearchAutoSuggestData } from "../api";
import { service } from "../../../utils/api-service";
import { getUserOrganisation } from "../../../utils";

jest.mock("@essnextgen/auth-ui", () => {
    const actual = jest.requireActual("@essnextgen/auth-ui");
    return {
        ...actual,
        authService: {
            getUserId: jest.fn(),
            getUsername: jest.fn(),
            getAuthTokens: jest.fn(),
            getOrgId: jest.fn(),
        },
    };
});

jest.mock("@essnextgen/ui-application-kit");
jest.mock("../../../utils/api-service", () => ({
    service: {
        get: jest.fn(),
        put: jest.fn(),
    },
}));
jest.mock("../../../utils", () => ({
    buildApplicationUrl: jest.fn(),
    getUserOrganisation: jest.fn(),
}));


describe("getViewData", () => {
    const mockOrgId = "org-123";
    const mockBaseUrl = "http://api-url";
    const mockNotificationId = "notif-456";
    const mockResponseData = { foo: "bar" };

    beforeEach(() => {
        jest.clearAllMocks();
        (getUserOrganisation as jest.Mock).mockReturnValue(mockOrgId);
        (buildApplicationUrl as jest.Mock).mockReturnValue(mockBaseUrl);
    });

    it("calls dependencies with correct params", async () => {
        (service.get as jest.Mock).mockResolvedValue({ data: mockResponseData });
        await getViewData(mockNotificationId);
        expect(getUserOrganisation).toHaveBeenCalled();
        expect(buildApplicationUrl).toHaveBeenCalled();
        expect(service.get).toHaveBeenCalledWith(
            `/v1/notification/notification-by-id?NotificationId=${mockNotificationId}&OrganisationId=${mockOrgId}`,
            mockBaseUrl
        );
    });

    it("returns response data on success", async () => {
        (service.get as jest.Mock).mockResolvedValue({ data: mockResponseData });
        const result = await getViewData(mockNotificationId);
        expect(result).toEqual(mockResponseData);
    });

    it("returns error object on failure", async () => {
        const error = { response: { status: 500 } };
        (service.get as jest.Mock).mockRejectedValue(error);
        const result = await getViewData(mockNotificationId);
        expect(result).toEqual({ error: true, status: 500 });
    });

    it("handles undefined notificationId", async () => {
        (service.get as jest.Mock).mockResolvedValue({ data: mockResponseData });
        await getViewData(undefined);
        expect(service.get).toHaveBeenCalledWith(
            `/v1/notification/notification-by-id?NotificationId=undefined&OrganisationId=${mockOrgId}`,
            mockBaseUrl
        );
    });

    it("returns error object with correct status when error thrown", async () => {
        const error = { response: { status: 401 } };
        (service.get as jest.Mock).mockRejectedValue(error);
        const result = await getViewData("any-id");
        expect(result).toEqual({ error: true, status: 401 });
    });
});

// --- Add tests for getNotificationTableData to cover all branches ---
describe("getNotificationTableData", () => {
    const mockOrgId = "org-123";
    const mockBaseUrl = "http://api-url";
    const mockUserId = "user-456";
    const mockUsername = "testuser";
    const mockResponseData = { data: { foo: "bar" } };

    beforeEach(() => {
        jest.clearAllMocks();
        (getUserOrganisation as jest.Mock).mockReturnValue(mockOrgId);
        (buildApplicationUrl as jest.Mock).mockReturnValue(mockBaseUrl);
        // Patch: ensure authService mocks are always defined
        const { authService } = jest.requireMock("@essnextgen/auth-ui");
        authService.getUserId.mockReturnValue(mockUserId);
        authService.getUsername.mockReturnValue(mockUsername);
    });

    it("returns data on success", async () => {
        (service.get as jest.Mock).mockResolvedValue(mockResponseData);
        const result = await getNotificationTableData({ PageSize: 10, PageNumber: 1, SearchTerm: "test" });
        expect(result).toEqual(mockResponseData.data);
    });

    it("returns error object on failure (non-401)", async () => {
        const error = { response: { status: 500 } };
        (service.get as jest.Mock).mockRejectedValue(error);
        const result = await getNotificationTableData({ PageSize: 10, PageNumber: 1, SearchTerm: "test" });
        expect(result).toEqual({ error: true, status: 500 });
    });

    it("handles 401 error branch", async () => {
        const error = { response: { status: 401 } };
        (service.get as jest.Mock).mockRejectedValue(error);
        const result = await getNotificationTableData({ PageSize: 10, PageNumber: 1, SearchTerm: "test" });
        expect(result).toEqual({ error: true, status: 401 });
    });
});

describe("markAsRead", () => {
    const mockOrgId = "org-123";
    const mockBaseUrl = "http://api-url";
    const mockNotificationId = "notif-456";
    const mockResponseData = { data: { payload: "ok" } };

    beforeEach(() => {
        jest.clearAllMocks();
        (getUserOrganisation as jest.Mock).mockReturnValue(mockOrgId);
        (buildApplicationUrl as jest.Mock).mockReturnValue(mockBaseUrl);
    });

    it("returns response data on success", async () => {
        (service.put as jest.Mock).mockResolvedValue(mockResponseData);
        const result = await markAsRead(mockNotificationId);
        expect(result).toEqual(mockResponseData.data);
    });

    it("returns empty array on error", async () => {
        (service.put as jest.Mock).mockRejectedValue(new Error("fail"));
        const result = await markAsRead(mockNotificationId);
        expect(result).toEqual([]);
    });
});


describe("getSearchAutoSuggestData", () => {
    const mockBaseUrl = "http://api-url";
    const mockOrgId = "org-123";
    const mockResponseData = { data: { suggestions: ["foo", "bar"] } };

    const authService = (jest.mocked({
        getOrgId: jest.fn(),
        getUserId: jest.fn(),
        getUsername: jest.fn(),
        getAuthTokens: jest.fn(),
    }) as unknown) as {
        getOrgId: jest.Mock;
        getUserId: jest.Mock;
        getUsername: jest.Mock;
        getAuthTokens: jest.Mock;
    };
    beforeEach(() => {
        jest.clearAllMocks();
        (buildApplicationUrl as jest.Mock).mockReturnValue(mockBaseUrl);
        authService.getOrgId.mockReturnValue(mockOrgId);
    });

    it("returns suggestions on success", async () => {
        (service.get as jest.Mock).mockResolvedValue(mockResponseData);
        const result = await getSearchAutoSuggestData({ SearchTerm: "baz" });
        expect(result).toEqual(mockResponseData.data);
    });

    it("returns error object on failure (non-401)", async () => {
        const error = { response: { status: 500 } };
        (service.get as jest.Mock).mockRejectedValue(error);
        const result = await getSearchAutoSuggestData({ SearchTerm: "baz" });
        expect(result).toEqual({ error: true, status: 500 });
    });

    it("handles 401 error branch", async () => {
        const error = { response: { status: 401 } };
        (service.get as jest.Mock).mockRejectedValue(error);
        const result = await getSearchAutoSuggestData({ SearchTerm: "baz" });
        expect(result).toEqual({ error: true, status: 401 });
    });
});