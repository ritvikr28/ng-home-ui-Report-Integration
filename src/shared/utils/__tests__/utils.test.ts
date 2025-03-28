import { authService } from "@essnextgen/auth-ui";
import * as uiKit from "@essnextgen/ui-kit";
import {
  getQuickLinkSecurablesList,
  getUserOrganisation,
  isUserAdmin
} from "../auth-helper";

jest.mock("@essnextgen/ui-kit", () => ({
  ...jest.requireActual("@essnextgen/ui-kit"),
  isEmpty: jest.fn()
}));

jest.mock("@essnextgen/auth-ui");

describe("isUserAdmin", () => {
  it("returns true for an admin user", () => {
    jest
      .spyOn(authService, "getIdToken")
      .mockReturnValue(
        "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IldIVmVvZVBuZk5qZnUxZE9HTlFkSWhSN2FCdyIsImtpZCI6IldIVmVvZVBuZk5qZnUxZE9HTlFkSWhSN2FCdyJ9.eyJpc3MiOiJodHRwczovL3NpbXNpZC1wYXJ0bmVyLXN0c3NlcnZlci5henVyZXdlYnNpdGVzLm5ldC8iLCJhdWQiOiJwbS1zc28tZWRjNGE3ZWMtNjI0Zi00OWQ0LTkxODEtNTU1YjczMDFlMzNmIiwiZXhwIjoxNjcyMDU2NTk5LCJuYmYiOjE2NzIwNTYyOTksImlhdCI6MTY3MjA1NjI5OSwic2lkIjoiNzMyNzAzZWQ3NzQ5ZTZhZWE3ZjJlN2U0OTdlMDM5ZjQiLCJzdWIiOiIxNDk5MDZ8RjZDMTdBMDItRkVCMC00OUFELTg4MjQtRTZBOTQxOTUwQkFDfEluaXRpYWwuQWRtaW4zMEBzaW1zaWQucGxhY2Vob2xkZXIuaWRlbnRpdHlmb3IuY28udWt8U0lNUyBJRHw2NTNhNDVjZi1hOGY3LTQyM2EtYjEzNC1jOGVjMmE0NGE1OGQiLCJhdXRoX3RpbWUiOjE2NzIwNTYyOTcsImlkcCI6Imlkc3J2IiwiTGFzdExvZ2luVGltZXN0YW1wIjoiRGVjIDI2LCAyMDIyIDEwOjE5OjEzIiwiUGFzc3dvcmRDaGFuZ2VkVGltZXN0YW1wIjoiRGVjIDA4LCAyMDIxIDE3OjAyOjQwIiwic2l0ZSI6IkI0MUJCMkFCIiwibGF1bmNoZXIiOiJ3ZWItYWNjZXNzIiwiU2l0ZVJvbGUiOiJBZG1pbiIsImhvbWVvcmdhbmlzYXRpb25pZGVudGlmaWVyIjoiQjQxQkIyQUItMzk3QS00RkNGLUJBNTktNjE1NkY0NTUzMjY5IiwibXVsdGlwbGVvcmdhbmlzYXRpb25zIjoiZmFsc2UiLCJuYW1lIjoiSW5pdGlhbCBBZG1pbiIsInJvbGUiOiJhZG1pbkBiNDFiYjJhYi0zOTdhLTRmY2YtYmE1OS02MTU2ZjQ1NTMyNjkiLCJhZGRpdGlvbmFscm9sZXNwcmVzZW50IjoiZmFsc2UiLCJ1c2Vyb3JnYW5pc2F0aW9uaWRlbnRpZmllciI6IjlGMEU2RTUyLTVGMjItNDYxRi05RjNCLTYwNEJFRDQxMEU5Q3xCNDFCQjJBQi0zOTdBLTRGQ0YtQkE1OS02MTU2RjQ1NTMyNjl8UyIsInByb3ZpZGVyIjoiU0lNUyBJRCIsInByb3ZpZGVyaWQiOiIxNDk5MDYiLCJwcm92aWRlcm5hbWUiOiJJbml0aWFsIEFkbWluIiwidmVuZG9yaWQiOiIyODYxQTAwMC03OTM0LTQ0QkYtOUY2RS05NkE5MjIyNjZGMzkiLCJhcHBsaWNhdGlvbmlkIjoiMUEyQjMyQzctOUMzOS00Q0NGLUE1ODEtRTI1M0E5RkEwN0E0IiwiYXBwbGljYXRpb25uYW1lIjoiRVNTLVNhdGVsbGl0ZXMtRGV2ZWxvcG1lbnQtU3RhZmYgJiBBZG1pbiIsImFtciI6WyJwYXNzd29yZCJdfQ.0dhbAIzNyXm5oJ679cOuiqwT8RgqcBhEGACfvxfGBLKHSNxvlBKqwmtRNxySYIc4MgH3w2sT4SLpo8yaEihjk9AXzfSPshHKbfAigb82834xnfMAEDnyc0hMT9jaxvfYVw8ZORPsVw68mxAwt4-WTVoUxLy4IK7tpI-Pzc_aFpW-BbMHr9Ctt_ls8EPH8NxJ22LnNbxJPSx3iBn8OwvcCIf2TeJL0fs30_VAm-XMLnF4w2SMbOC5O8CNd-ii6dmDLDriYYVzp-mQ4NiARohGJyDl6IwdgX6wXsSJB78Yy6AmCxUIXPQk4TYg_8wI9a_XNgilY5iMmEV6GXoLtm4e0A"
      );

    jest.mock("jwt-decode", () => ({
      __esModule: true,
      default: () => "",
      jwtDecode: jest.fn(() => ({
        name: "",
        sub: "",
        userorganisationidentifier: "",
        SiteRole: "Admin"
      }))
    }));

    // Expect the isUserAdmin function to return true
    expect(isUserAdmin()).toBe(true);
  });

  it("returns false for a regular user", () => {
    jest.spyOn(authService, "getIdToken").mockReturnValue("");

    jest.mock("jwt-decode", () => ({
      __esModule: true,
      default: () => "",
      jwtDecode: jest.fn(() => ({
        name: "",
        sub: "",
        userorganisationidentifier: "",
        role: "user@d1ac710d-a8a4-4097-b30d-622c311dc535"
      }))
    }));

    // Expect the isUserAdmin function to return false
    expect(isUserAdmin()).toBe(false);
  });

  it("returns false if the ID token is not set", () => {
    jest.spyOn(authService, "getIdToken").mockReturnValue("");

    jest.mock("jwt-decode", () => ({
      __esModule: true,
      default: () => "",
      jwtDecode: jest.fn(() => ({
        name: "",
        sub: "",
        userorganisationidentifier: ""
      }))
    }));

    // Expect the isUserAdmin function to return false
    expect(isUserAdmin()).toBe(false);
  });
  it("returns false if the ID token has no empty role", () => {
    jest
      .spyOn(authService, "getIdToken")
      .mockReturnValue(
        "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsIng1dCI6IldIVmVvZVBuZk5qZnUxZE9HTlFkSWhSN2FCdyIsImtpZCI6IldIVmVvZVBuZk5qZnUxZE9HTlFkSWhSN2FCdyJ9.eyJpc3MiOiJodHRwczovL3NpbXNpZC1wYXJ0bmVyLXN0c3NlcnZlci5henVyZXdlYnNpdGVzLm5ldC8iLCJhdWQiOiJodHRwczovL3NpbXNpZC1wYXJ0bmVyLXN0c3NlcnZlci5henVyZXdlYnNpdGVzLm5ldC9yZXNvdXJjZXMiLCJleHAiOjE2NzU4OTcwODEsIm5iZiI6MTY3NTg5MzQ4MSwiY2xpZW50X2lkIjoicG0tc3NvLWVkYzRhN2VjLTYyNGYtNDlkNC05MTgxLTU1NWI3MzAxZTMzZiIsInNjb3BlIjpbIm9wZW5pZCIsInJvbGVzIiwicGFydG5lcm1hbmFnZW1lbnRhcHBsaWNhdGlvbiJdLCJzdWIiOiIxNDk5MDZ8RjZDMTdBMDItRkVCMC00OUFELTg4MjQtRTZBOTQxOTUwQkFDfEluaXRpYWwuQWRtaW4zMEBzaW1zaWQucGxhY2Vob2xkZXIuaWRlbnRpdHlmb3IuY28udWt8U0lNUyBJRHw4YTJkYTRhZC05YmIzLTRmYjAtOWQ5NC02YjZhZTUwOTBiOTgiLCJhdXRoX3RpbWUiOjE2NzU4OTM0NzksImlkcCI6Imlkc3J2IiwidXNlcm9yZ2FuaXNhdGlvbmlkZW50aWZpZXIiOiI5RjBFNkU1Mi01RjIyLTQ2MUYtOUYzQi02MDRCRUQ0MTBFOUN8QjQxQkIyQUItMzk3QS00RkNGLUJBNTktNjE1NkY0NTUzMjY5fFMiLCJ2ZW5kb3JpZCI6IjI4NjFBMDAwLTc5MzQtNDRCRi05RjZFLTk2QTkyMjI2NkYzOSIsImFwcGxpY2F0aW9uaWQiOiIxQTJCMzJDNy05QzM5LTRDQ0YtQTU4MS1FMjUzQTlGQTA3QTQiLCJhcHBsaWNhdGlvbm5hbWUiOiJFU1MtU2F0ZWxsaXRlcy1EZXZlbG9wbWVudC1TdGFmZiAmIEFkbWluIiwicm9sZSI6W10sImFkZGl0aW9uYWxyb2xlc3ByZXNlbnQiOiJmYWxzZSIsImFtciI6WyJwYXNzd29yZCJdfQ.oyKMu51Z2vedqmK40OhY8FQJ9MtQdvoiHYI0aknvC0I"
      );

    jest.mock("jwt-decode", () => ({
      __esModule: true,
      default: () => "",
      jwtDecode: jest.fn(() => ({
        name: "",
        sub: "",
        userorganisationidentifier: "",
        role: []
      }))
    }));

    expect(isUserAdmin()).toBe(false);
  });
  it("returns false if the ID token has no role claim", () => {
    jest
      .spyOn(authService, "getIdToken")
      .mockReturnValue(
        "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsIng1dCI6IldIVmVvZVBuZk5qZnUxZE9HTlFkSWhSN2FCdyIsImtpZCI6IldIVmVvZVBuZk5qZnUxZE9HTlFkSWhSN2FCdyJ9.eyJpc3MiOiJodHRwczovL3NpbXNpZC1wYXJ0bmVyLXN0c3NlcnZlci5henVyZXdlYnNpdGVzLm5ldC8iLCJhdWQiOiJodHRwczovL3NpbXNpZC1wYXJ0bmVyLXN0c3NlcnZlci5henVyZXdlYnNpdGVzLm5ldC9yZXNvdXJjZXMiLCJleHAiOjE2NzU4OTcwODEsIm5iZiI6MTY3NTg5MzQ4MSwiY2xpZW50X2lkIjoicG0tc3NvLWVkYzRhN2VjLTYyNGYtNDlkNC05MTgxLTU1NWI3MzAxZTMzZiIsInNjb3BlIjpbIm9wZW5pZCIsInJvbGVzIiwicGFydG5lcm1hbmFnZW1lbnRhcHBsaWNhdGlvbiJdLCJzdWIiOiIxNDk5MDZ8RjZDMTdBMDItRkVCMC00OUFELTg4MjQtRTZBOTQxOTUwQkFDfEluaXRpYWwuQWRtaW4zMEBzaW1zaWQucGxhY2Vob2xkZXIuaWRlbnRpdHlmb3IuY28udWt8U0lNUyBJRHw4YTJkYTRhZC05YmIzLTRmYjAtOWQ5NC02YjZhZTUwOTBiOTgiLCJhdXRoX3RpbWUiOjE2NzU4OTM0NzksImlkcCI6Imlkc3J2IiwidXNlcm9yZ2FuaXNhdGlvbmlkZW50aWZpZXIiOiI5RjBFNkU1Mi01RjIyLTQ2MUYtOUYzQi02MDRCRUQ0MTBFOUN8QjQxQkIyQUItMzk3QS00RkNGLUJBNTktNjE1NkY0NTUzMjY5fFMiLCJ2ZW5kb3JpZCI6IjI4NjFBMDAwLTc5MzQtNDRCRi05RjZFLTk2QTkyMjI2NkYzOSIsImFwcGxpY2F0aW9uaWQiOiIxQTJCMzJDNy05QzM5LTRDQ0YtQTU4MS1FMjUzQTlGQTA3QTQiLCJhcHBsaWNhdGlvbm5hbWUiOiJFU1MtU2F0ZWxsaXRlcy1EZXZlbG9wbWVudC1TdGFmZiAmIEFkbWluIiwiYWRkaXRpb25hbHJvbGVzcHJlc2VudCI6ImZhbHNlIiwiYW1yIjpbInBhc3N3b3JkIl19.DcBsTwkgzGWh8dCaT2rATRNes1mgvdifF2HGndN-QqE"
      );

    jest.mock("jwt-decode", () => ({
      __esModule: true,
      default: () => "",
      jwtDecode: jest.fn(() => ({
        name: "",
        sub: "",
        userorganisationidentifier: ""
      }))
    }));

    expect(isUserAdmin()).toBe(undefined);
  });
  it("returns true if the ID token has multiple role having any one as admin", () => {
    jest
      .spyOn(authService, "getIdToken")
      .mockReturnValue(
        "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IldIVmVvZVBuZk5qZnUxZE9HTlFkSWhSN2FCdyIsImtpZCI6IldIVmVvZVBuZk5qZnUxZE9HTlFkSWhSN2FCdyJ9.eyJpc3MiOiJodHRwczovL3NpbXNpZC1wYXJ0bmVyLXN0c3NlcnZlci5henVyZXdlYnNpdGVzLm5ldC8iLCJhdWQiOiJodHRwczovL3NpbXNpZC1wYXJ0bmVyLXN0c3NlcnZlci5henVyZXdlYnNpdGVzLm5ldC9yZXNvdXJjZXMiLCJleHAiOjE2NzU4OTcwODEsIm5iZiI6MTY3NTg5MzQ4MSwiY2xpZW50X2lkIjoicG0tc3NvLWVkYzRhN2VjLTYyNGYtNDlkNC05MTgxLTU1NWI3MzAxZTMzZiIsInNjb3BlIjpbIm9wZW5pZCIsInJvbGVzIiwicGFydG5lcm1hbmFnZW1lbnRhcHBsaWNhdGlvbiJdLCJzdWIiOiIxNDk5MDZ8RjZDMTdBMDItRkVCMC00OUFELTg4MjQtRTZBOTQxOTUwQkFDfEluaXRpYWwuQWRtaW4zMEBzaW1zaWQucGxhY2Vob2xkZXIuaWRlbnRpdHlmb3IuY28udWt8U0lNUyBJRHw4YTJkYTRhZC05YmIzLTRmYjAtOWQ5NC02YjZhZTUwOTBiOTgiLCJhdXRoX3RpbWUiOjE2NzU4OTM0NzksImlkcCI6Imlkc3J2IiwidXNlcm9yZ2FuaXNhdGlvbmlkZW50aWZpZXIiOiI5RjBFNkU1Mi01RjIyLTQ2MUYtOUYzQi02MDRCRUQ0MTBFOUN8QjQxQkIyQUItMzk3QS00RkNGLUJBNTktNjE1NkY0NTUzMjY5fFMiLCJ2ZW5kb3JpZCI6IjI4NjFBMDAwLTc5MzQtNDRCRi05RjZFLTk2QTkyMjI2NkYzOSIsImFwcGxpY2F0aW9uaWQiOiIxQTJCMzJDNy05QzM5LTRDQ0YtQTU4MS1FMjUzQTlGQTA3QTQiLCJhcHBsaWNhdGlvbm5hbWUiOiJFU1MtU2F0ZWxsaXRlcy1EZXZlbG9wbWVudC1TdGFmZiAmIEFkbWluIiwicm9sZSI6WyJhZG1pbkBiNDFiYjJhYi0zOTdhLTRmY2YtYmE1OS02MTU2ZjQ1NTMyNjkiLCJ1c2VyQGI0MWJiMmFiLTM5N2EtNGZjZi1iYTU5LTYxNTZmNDU1MzI2OSJdLCJhZGRpdGlvbmFscm9sZXNwcmVzZW50IjoiZmFsc2UiLCJhbXIiOlsicGFzc3dvcmQiXX0.enqkbQ6W-pno3iDs78AMmeIIDs1cB6zU8KONcNQ4Dgp9qNgrrJZfATsQs1G4f45z18kuuk_9OLtsyEIdoKMbzVyVB2qebHo6hjseYW1oy12lgyT8S01a5bhIEudJryHpuRaG_FXvtW6CdZ-UWXcQaZO-p3x2ShaVAjscmp6drHaRJxstJClM39J6du35M1G1kct9hYL0pMPdv9f4-93mlVzNbN6K_cgaUGwnVswuYbE-Qec9Dj4AZviWeqC9KFFDAvc8wjDzQARlw0u4ai-MJh9qpJbVnkUhij1_neybXKSJpgJ0VYgM0bPfDFpGwRbfs8ZlLqV__8dLKMHZjp_2SQ"
      );

    jest.mock("jwt-decode", () => ({
      __esModule: true,
      default: () => "",
      jwtDecode: jest.fn(() => ({
        name: "",
        sub: "",
        userorganisationidentifier: "",
        role: [
          "user@d1ac710d-a8a4-4097-b30d-622c311dc535",
          "admin@d1ac710d-a8a4-4097-b30d-622c311dc535"
        ]
      }))
    }));

    expect(isUserAdmin()).toBe(true);
  });
});

describe("getSecurablesList", () => {
  beforeEach(() => {
    window.sessionStorage.clear();
    jest.restoreAllMocks();
  });

  const mockWindowProperty = (property: any, value: any) => {
    const { [property]: originalProperty } = window;
    delete window[property];
    beforeAll(() => {
      Object.defineProperty(window, property, {
        configurable: true,
        writable: true,
        value
      });
    });
    afterAll(() => {
      window[property] = originalProperty;
    });
  };
  mockWindowProperty("sessionStorage", {
    setItem: jest.fn(),
    getItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn()
  });
  test("should return empty array of permissions if token do not have Quick Links related permissions", () => {
    window.sessionStorage.setItem(
      "PERMISSIONS",
      "W3siU2VjdXJhYmxlIjogIkxlYXJuZXIuUmVnaXN0cmF0aW9uIiwgIk9wZXJhdGlvbiI6ICJVcGRhdGUifSx7IlNlY3VyYWJsZSI6ICJMb29rdXAuVHJhbnNwb3J0IiwiT3BlcmF0aW9uIjogIkRlbGV0ZSJ9LHsiU2VjdXJhYmxlIjogIkdTUy5UZWFjaGVyNiIsIk9wZXJhdGlvbiI6ICJEZWxldGUifV0="
    );

    const getItemSpy = jest.spyOn(window.sessionStorage, "getItem");

    const actualvalue = getQuickLinkSecurablesList();

    expect(actualvalue).toEqual([]);
    expect(getItemSpy).toHaveBeenCalled();
  });
  test("getQuickLinkSecurablesList returns an empty array when sessionStorage is empty", () => {
    window.sessionStorage.setItem("PERMISSIONS", "abcdefg");
    const getItemSpy = jest
      .spyOn(window.sessionStorage, "getItem")
      .mockImplementationOnce(() => "PERMISSIONS");
    const spy = jest.spyOn(JSON, "parse").mockReturnValueOnce([]);

    getQuickLinkSecurablesList();

    expect(getItemSpy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalled();
  });

  test("getQuickLinkSecurablesList returns an permissions array when sessionStorage is not empty", () => {
    window.sessionStorage.setItem("PERMISSIONS", "abcdefg");
    const getItemSpy = jest
      .spyOn(window.sessionStorage, "getItem")
      .mockImplementationOnce(() => "PERMISSIONS");
    const spy = jest.spyOn(JSON, "parse").mockImplementationOnce(() => [
      {
        Securable: "NG.Homepage.QuickLink.Teacher",
        Operation: "View"
      },
      {
        Securable: "NG.Homepage.QuickLink.SLT",
        Operation: "View"
      },
      {
        Securable: "NG.Homepage.QuickLink.Admin",
        Operation: "View"
      }
    ]);
    const result = getQuickLinkSecurablesList();
    expect(result).toEqual([
      {
        Securable: "NG.Homepage.QuickLink.Teacher",
        Operation: "View"
      },
      {
        Securable: "NG.Homepage.QuickLink.SLT",
        Operation: "View"
      },
      {
        Securable: "NG.Homepage.QuickLink.Admin",
        Operation: "View"
      }
    ]);
    expect(getItemSpy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalled();
  });

  test("test getUserOrganization to return orgId", () => {
    jest
      .spyOn(authService, "getAuthTokens")
      .mockReturnValue(
        "eyJhbGciOiJSUzI1NiIsImtpZCI6IkFBNDhENDA2QThCNDVFOUYyQTY4RjZGM0M2MzgwM0Y5N0M0NzU4NDFSUzI1NiIsIng1dCI6InFralVCcWkwWHA4cWFQYnp4amdELVh4SFdFRSIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2NvcmUtZGV2LnNpbXMuY28udWsiLCJuYmYiOjE2OTA4MDQ5MTUsImlhdCI6MTY5MDgwNDkxNSwiZXhwIjoxNjkwODA4NTE1LCJhdWQiOlsib2RhdGFhcGkiLCJodHRwczovL2NvcmUtZGV2LnNpbXMuY28udWsvcmVzb3VyY2VzIl0sInNjb3BlIjpbIkFjdGl2ZUNsaWVudCIsIm9mZmxpbmVfYWNjZXNzIl0sImFtciI6WyJjdXN0b20iXSwiY2xpZW50X2lkIjoiSW50ZXJuYWxBY3RpdmVDbGllbnQiLCJzdWIiOiIxNDk3Njh8MzM0NURBMDktRDA5Ni00RjRCLTg1RkMtMzlEMkNFMkE0NTg4fEluaXRpYWwuQWRtaW42ODdAaWRlbnRpdHlmb3Iuc2ltc2lkLnBsYWNlaG9sZGVyLmNvLnVrfFNJTVMgSUR8ODYyZDZkZTktYzY1Yi00NmVkLTg2YjItMDYxNzVhNzJkNzYwIiwiYXV0aF90aW1lIjoxNjkwODA0OTE1LCJpZHAiOiJsb2NhbCIsIm5hbWUiOiIxNDk3Njh8MzM0NURBMDktRDA5Ni00RjRCLTg1RkMtMzlEMkNFMkE0NTg4fEluaXRpYWwuQWRtaW42ODdAaWRlbnRpdHlmb3Iuc2ltc2lkLnBsYWNlaG9sZGVyLmNvLnVrfFNJTVMgSUR8ODYyZDZkZTktYzY1Yi00NmVkLTg2YjItMDYxNzVhNzJkNzYwIiwiU0lNU0lEL2lzc3Vlcm5hbWUiOiJFbnRlcnByaXNlIiwidmVuZG9yaWQiOiIyODYxQTAwMC03OTM0LTQ0QkYtOUY2RS05NkE5MjIyNjZGMzkiLCJhcHBsaWNhdGlvbmlkIjoiQ0E5MUMwMjEtRjA0RC00RkU1LUE0NUMtRTFCQTlCRUVFNDFBIiwiYXBwbGljYXRpb25uYW1lIjoiRVNTLVNhdGVsbGl0ZXMtRGV2ZWxvcG1lbnQtU0lNUyBOZXh0IEdlbiIsIlNJTVNDWC9VU0QiOiJUcnVlIiwiU0lNU0NYL0RvbWFpbiI6IjAwMDAwMDAwLTAwMDAtMDAwMC0wMDAwLTAwMDAwMDAwMDAwMCIsIlNJTVNDWC9SZWdpb25JZGVudGlmaWVyIjoiIiwiU0lNU0NYL1ZhcmlhbnRDb2RlIjoiIiwiU0lNU0NYL0ludGVudHMiOiIiLCJTSU1TQ1gvT3JnYW5pc2F0aW9uSUQiOiI2NmY0ZjVkMC1iNmFhLTQ5NTktYjlkMy1mYTZlNjliZjI1MGEiLCJTSU1TQ1gvUm9sZSI6ImFkbWluQDY2ZjRmNWQwLWI2YWEtNDk1OS1iOWQzLWZhNmU2OWJmMjUwYSIsIlNJTVNDWC9UZW5hbnRJRCI6IjQxMiIsIlNJTVNDWC9FeHRlcm5hbElEIjoiZjRhY2I2ZjAtOGVkMC00NmJkLTg0ZGItMDMxZTQ1OWE4ZjE1IiwiU0lNU0NYL1VzZXJUeXBlIjoiU3RhZmYiLCJqdGkiOiJBOTgxNjIxRDQ4QjZFRjgyNTUzMDFFNTAwQkJFRTMwRiJ9.XaLsTcNLh1ZYum1vAOT213TfGulMJ1ETzS4UX7mve2lXChsPXiATlCYYeM9K6KXYeq96h5Jhq9_yhlQCodfsVRKDU0IXmBasZbtLKnELaWmiSXbgzjCsxPXCSO9UVyH4hjhAaFPOKrTET-dn-cv44u6FCS2UTEwWr9yr-crgWqZuHt7972ZtkuqUjzv1jVDkjFeQ_6awlmjd-22DXK5jmN9AydwNUfZm6_GJ7aQD2pL3Npzu7CFWgQhBnjwwZdBzH8ujvn6xbO5r6eipBEqM4T0N0bj-sYlxT0VzEQs5Qbn_zJv2cAPZthutcCQHlAQtKpQgkg4Rx1orJiPS44c-Ju8u7b-N652us1MCDSaBd2ybBAlyhaXwWTRmT7xiGBTEzWDUxme-1PQ9uvYpAhcYAoE3-Q0UvxLzFieSsML7svG4TgDJuPSPxMRnrvcnblztdj2GqJGyNCOSY7bocJVGa4epeI_68M1xskf4ivxuPwHRc5iq38fIIp3Bo2fLz5A17W3VqQVeWrIrERG1xu5ULUlM0yBRJhmzK0Q2WkUWNLcnbn-EKmQOdhc4BId5hmmBpo6SACYP-cDO0ew1OcX3qobBho9wwB5DndQY2MhT5dGGbEzhXC3F25PsppTszXugKDTJ0y9BnLStRJByrepXiM7E7f1pbNsez4w3omNjFcA"
      );
    jest.mock("jwt-decode", () => ({
      __esModule: true,
      default: () => "",
      jwtDecode: jest.fn(() => ({
        "SIMSCX/OrganisationID": "66f4f5d0-b6aa-4959-b9d3-fa6e69bf250a"
      }))
    }));

    const orgId = getUserOrganisation();

    expect(orgId).toBe("66f4f5d0-b6aa-4959-b9d3-fa6e69bf250a");
  });
  test("test getUserOrganization to return empty string", () => {
    jest
      .spyOn(authService, "getAuthTokens")
      .mockReturnValue(
        "eyJhbGciOiJSUzI1NiIsImtpZCI6IkFBNDhENDA2QThCNDVFOUYyQTY4RjZGM0M2MzgwM0Y5N0M0NzU4NDFSUzI1NiIsIng1dCI6InFralVCcWkwWHA4cWFQYnp4amdELVh4SFdFRSIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2NvcmUtZGV2LnNpbXMuY28udWsiLCJuYmYiOjE2OTA4MDQ5MTUsImlhdCI6MTY5MDgwNDkxNSwiZXhwIjoxNjkwODA4NTE1LCJhdWQiOlsib2RhdGFhcGkiLCJodHRwczovL2NvcmUtZGV2LnNpbXMuY28udWsvcmVzb3VyY2VzIl0sInNjb3BlIjpbIkFjdGl2ZUNsaWVudCIsIm9mZmxpbmVfYWNjZXNzIl0sImFtciI6WyJjdXN0b20iXSwiY2xpZW50X2lkIjoiSW50ZXJuYWxBY3RpdmVDbGllbnQiLCJzdWIiOiIxNDk3Njh8MzM0NURBMDktRDA5Ni00RjRCLTg1RkMtMzlEMkNFMkE0NTg4fEluaXRpYWwuQWRtaW42ODdAaWRlbnRpdHlmb3Iuc2ltc2lkLnBsYWNlaG9sZGVyLmNvLnVrfFNJTVMgSUR8ODYyZDZkZTktYzY1Yi00NmVkLTg2YjItMDYxNzVhNzJkNzYwIiwiYXV0aF90aW1lIjoxNjkwODA0OTE1LCJpZHAiOiJsb2NhbCIsIm5hbWUiOiIxNDk3Njh8MzM0NURBMDktRDA5Ni00RjRCLTg1RkMtMzlEMkNFMkE0NTg4fEluaXRpYWwuQWRtaW42ODdAaWRlbnRpdHlmb3Iuc2ltc2lkLnBsYWNlaG9sZGVyLmNvLnVrfFNJTVMgSUR8ODYyZDZkZTktYzY1Yi00NmVkLTg2YjItMDYxNzVhNzJkNzYwIiwiU0lNU0lEL2lzc3Vlcm5hbWUiOiJFbnRlcnByaXNlIiwidmVuZG9yaWQiOiIyODYxQTAwMC03OTM0LTQ0QkYtOUY2RS05NkE5MjIyNjZGMzkiLCJhcHBsaWNhdGlvbmlkIjoiQ0E5MUMwMjEtRjA0RC00RkU1LUE0NUMtRTFCQTlCRUVFNDFBIiwiYXBwbGljYXRpb25uYW1lIjoiRVNTLVNhdGVsbGl0ZXMtRGV2ZWxvcG1lbnQtU0lNUyBOZXh0IEdlbiIsIlNJTVNDWC9VU0QiOiJUcnVlIiwiU0lNU0NYL0RvbWFpbiI6IjAwMDAwMDAwLTAwMDAtMDAwMC0wMDAwLTAwMDAwMDAwMDAwMCIsIlNJTVNDWC9SZWdpb25JZGVudGlmaWVyIjoiIiwiU0lNU0NYL1ZhcmlhbnRDb2RlIjoiIiwiU0lNU0NYL0ludGVudHMiOiIiLCJTSU1TQ1gvT3JnYW5pc2F0aW9uSUQiOiI2NmY0ZjVkMC1iNmFhLTQ5NTktYjlkMy1mYTZlNjliZjI1MGEiLCJTSU1TQ1gvUm9sZSI6ImFkbWluQDY2ZjRmNWQwLWI2YWEtNDk1OS1iOWQzLWZhNmU2OWJmMjUwYSIsIlNJTVNDWC9UZW5hbnRJRCI6IjQxMiIsIlNJTVNDWC9FeHRlcm5hbElEIjoiZjRhY2I2ZjAtOGVkMC00NmJkLTg0ZGItMDMxZTQ1OWE4ZjE1IiwiU0lNU0NYL1VzZXJUeXBlIjoiU3RhZmYiLCJqdGkiOiJBOTgxNjIxRDQ4QjZFRjgyNTUzMDFFNTAwQkJFRTMwRiJ9.XaLsTcNLh1ZYum1vAOT213TfGulMJ1ETzS4UX7mve2lXChsPXiATlCYYeM9K6KXYeq96h5Jhq9_yhlQCodfsVRKDU0IXmBasZbtLKnELaWmiSXbgzjCsxPXCSO9UVyH4hjhAaFPOKrTET-dn-cv44u6FCS2UTEwWr9yr-crgWqZuHt7972ZtkuqUjzv1jVDkjFeQ_6awlmjd-22DXK5jmN9AydwNUfZm6_GJ7aQD2pL3Npzu7CFWgQhBnjwwZdBzH8ujvn6xbO5r6eipBEqM4T0N0bj-sYlxT0VzEQs5Qbn_zJv2cAPZthutcCQHlAQtKpQgkg4Rx1orJiPS44c-Ju8u7b-N652us1MCDSaBd2ybBAlyhaXwWTRmT7xiGBTEzWDUxme-1PQ9uvYpAhcYAoE3-Q0UvxLzFieSsML7svG4TgDJuPSPxMRnrvcnblztdj2GqJGyNCOSY7bocJVGa4epeI_68M1xskf4ivxuPwHRc5iq38fIIp3Bo2fLz5A17W3VqQVeWrIrERG1xu5ULUlM0yBRJhmzK0Q2WkUWNLcnbn-EKmQOdhc4BId5hmmBpo6SACYP-cDO0ew1OcX3qobBho9wwB5DndQY2MhT5dGGbEzhXC3F25PsppTszXugKDTJ0y9BnLStRJByrepXiM7E7f1pbNsez4w3omNjFcA"
      );
    jest.mock("jwt-decode", () => ({
      __esModule: true,
      default: () => "",
      jwtDecode: jest.fn(() => ({
        "SIMSCX/OrganisationID": ""
      }))
    }));
    jest.spyOn(uiKit, "isEmpty").mockReturnValue(true);
    const orgId = getUserOrganisation();

    expect(orgId).toBe("");
  });
});
