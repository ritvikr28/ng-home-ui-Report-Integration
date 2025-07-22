import { authService } from "@essnextgen/auth-ui";
import * as uiKit from "@essnextgen/ui-kit";
import jwtDecode from "jwt-decode";
import {
    getUserEmail,
    getUser,
    isAuthzUserAdmin
} from "../auth-helper";

jest.mock("@essnextgen/auth-ui");
jest.mock("@essnextgen/ui-kit", () => ({
    ...jest.requireActual("@essnextgen/ui-kit"),
    isEmpty: jest.fn(),
}));
jest.mock("jwt-decode");

describe("getUserEmail", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("returns email when sub field is present and valid", () => {
        jest.spyOn(authService, "getAuthTokens").mockReturnValue("token");
        (jwtDecode as jest.Mock).mockReturnValue({
            sub: "part1|part2|user@email.com",
        });
        (uiKit.isEmpty as jest.Mock).mockReturnValue(false);
        expect(getUserEmail()).toBe("user@email.com");
    });

    it("returns empty string if sub field is missing", () => {
        jest.spyOn(authService, "getAuthTokens").mockReturnValue("token");
        (jwtDecode as jest.Mock).mockReturnValue({});
        (uiKit.isEmpty as jest.Mock).mockReturnValue(false);
        expect(getUserEmail()).toBe("");
    });

    it("returns empty string if token is missing", () => {
        jest.spyOn(authService, "getAuthTokens").mockReturnValue(null);
        expect(getUserEmail()).toBe("");
    });

    it("returns empty string if decoded token is empty", () => {
        jest.spyOn(authService, "getAuthTokens").mockReturnValue("token");
        (jwtDecode as jest.Mock).mockReturnValue({});
        (uiKit.isEmpty as jest.Mock).mockReturnValue(true);
        expect(getUserEmail()).toBe("");
    });
});

describe("getUser", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("returns SIMSCX/ExternalID if present", () => {
        jest.spyOn(authService, "getAuthTokens").mockReturnValue("token");
        (jwtDecode as jest.Mock).mockReturnValue({
            "SIMSCX/ExternalID": "external-id",
        });
        expect(getUser()).toBe("external-id");
    });

    it("returns userorganisationidentifier split if SIMSCX/ExternalID is undefined", () => {
        jest.spyOn(authService, "getAuthTokens").mockReturnValue("token");
        (jwtDecode as jest.Mock).mockReturnValue({
            userorganisationidentifier: "orgid|somethingelse",
        });
        expect(getUser()).toBe("orgid");
    });

    it("returns empty string if both fields are undefined", () => {
        jest.spyOn(authService, "getAuthTokens").mockReturnValue("token");
        (jwtDecode as jest.Mock).mockReturnValue({});
        expect(getUser()).toBe("");
    });

    it("returns empty string if token is missing", () => {
        jest.spyOn(authService, "getAuthTokens").mockReturnValue(null);
        expect(getUser()).toBe("");
    });
});

describe("isAuthzUserAdmin", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("returns true if SIMSCX/Role contains admin", () => {
        jest.spyOn(authService, "getAuthTokens").mockReturnValue("token");
        (jwtDecode as jest.Mock).mockReturnValue({
            "SIMSCX/Role": "admin@something",
        });
        expect(isAuthzUserAdmin()).toBe(true);
    });

    it("returns false if SIMSCX/Role does not contain admin", () => {
        jest.spyOn(authService, "getAuthTokens").mockReturnValue("token");
        (jwtDecode as jest.Mock).mockReturnValue({
            "SIMSCX/Role": "user@something",
        });
        expect(isAuthzUserAdmin()).toBe(false);
    });

    it("returns false if SIMSCX/Role is empty string", () => {
        jest.spyOn(authService, "getAuthTokens").mockReturnValue("token");
        (jwtDecode as jest.Mock).mockReturnValue({
            "SIMSCX/Role": "",
        });
        expect(isAuthzUserAdmin()).toBe(false);
    });

    it("returns false if token is missing", () => {
        jest.spyOn(authService, "getAuthTokens").mockReturnValue(null);
        expect(isAuthzUserAdmin()).toBe(false);
    });

    it("returns false if decodedToken is null", () => {
        jest.spyOn(authService, "getAuthTokens").mockReturnValue("token");
        (jwtDecode as jest.Mock).mockReturnValue(null);
        expect(isAuthzUserAdmin()).toBe(false);
    });
});
