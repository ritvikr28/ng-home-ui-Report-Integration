import { History } from "history";
import { activateEmailAlert, fetchEmailAlertStatus } from "../SystemStatusAlerts/SystemStatusService";
import { getUserEmail, getUserOrganisation ,envConfig, service} from "../../../shared/utils";
import { useFetchSchoolNameData } from "../../../shared/services/schoolDomain/schoolServices";

beforeEach(() => {
  (getUserEmail as jest.Mock).mockReturnValue("suraj.bawankar@test.com");
  (getUserOrganisation as jest.Mock).mockReturnValue("cd0e52dd-8331-44dd-bea4-cf1e99d6e1f");
  (useFetchSchoolNameData as jest.Mock).mockReturnValue({ schoolName: "string test school" });
});
jest.mock("../../../shared/utils", () => ({
  ...jest.requireActual("../../../shared/utils"),
  envConfig: {
    BASE_URL: "http://mock-base-url.com", 
  },
  service: {
    post: jest.fn(),
  },
  getUserEmail: jest.fn(() => "suraj.bawankar@test.com"),
  getUserOrganisation: jest.fn(() => "cd0e52dd-8331-44dd-bea4-cf1e99d6e1f"),
}));

jest.mock("../../../shared/services/schoolDomain/schoolServices", () => ({
  useFetchSchoolNameData: jest.fn(() => ({
    schoolName: "string test school",
  })),
}));


describe("SystemStatusService", () => {
  const mockHandleException = jest.fn();
  const mockHistory = {
    push: jest.fn(),
    replace: jest.fn(),
  } as unknown as History;

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("fetchEmailAlertStatus", () => {

it("should return data when API call is successful", async () => {
  const mockResponse = {
    data: {
      responseCode: 200,
      listenerData: { listenerStatus: "Live", eMailAlert: true },
      ssmHostData: { ssmHostStatus: "Not Live", eMailAlert: false },
    },
  };
  (service.post as jest.Mock).mockResolvedValueOnce(mockResponse);

  const result = await fetchEmailAlertStatus(mockHandleException, mockHistory);

  expect(result).toEqual(mockResponse.data);
expect(service.post).toHaveBeenCalledWith(
  `${envConfig.BASE_URL}/TrainingDB/SystemStatusAlert`,
  {
    orgId: "cd0e52dd-8331-44dd-bea4-cf1e99d6e1f",
    toEmailId: "suraj.bawankar@test.com",
  }
);
  expect(mockHandleException).not.toHaveBeenCalled();
});
    it("should handle API errors and call handleException", async () => {
      (service.post as jest.Mock).mockRejectedValueOnce(new Error("API Error"));

      const result = await fetchEmailAlertStatus(mockHandleException, mockHistory);

      expect(result).toBeNull();
      expect(mockHandleException).toHaveBeenCalled();
    });

   it("should replace history on invalid token error", async () => {
  (service.post as jest.Mock).mockRejectedValueOnce({
    message: "Invalid token",
  });

  const result = await fetchEmailAlertStatus(mockHandleException, mockHistory);

  expect(result).toBeNull();
  expect(mockHistory.replace).toHaveBeenCalledWith("/unauthorized");
});

    it("should handle unknown errors and call handleException", async () => {
      (service.post as jest.Mock).mockRejectedValueOnce(new Error("Unknown Error"));

      const result = await fetchEmailAlertStatus(mockHandleException, mockHistory);

      expect(result).toBeNull();
      expect(mockHandleException).toHaveBeenCalled();
    });
  });
it("should return null and call handleException when orgId or toEmailId is missing", async () => {
  (getUserOrganisation as jest.Mock).mockReturnValueOnce(null);
  (getUserEmail as jest.Mock).mockReturnValueOnce(null);

  const result = await fetchEmailAlertStatus(mockHandleException, mockHistory);

  expect(result).toBeNull();
  expect(mockHandleException).toHaveBeenCalled();
});
it("should call handleException when response code is not 200", async () => {
  const mockResponse = {
    data: {
      responseCode: 500,
    },
  };
  (service.post as jest.Mock).mockResolvedValueOnce(mockResponse);

  const result = await fetchEmailAlertStatus(mockHandleException, mockHistory);

  expect(result).toBeNull();
  expect(mockHandleException).toHaveBeenCalled();
});
it("should redirect to /unauthorized if status code is 401", async () => {
  (service.post as jest.Mock).mockRejectedValueOnce({
    response: {
      status: 401,
    },
  });

  const result = await fetchEmailAlertStatus(mockHandleException, mockHistory);

  expect(result).toBeNull();
  expect(mockHistory.push).toHaveBeenCalledWith("/unauthorized");
});
it("should handle errors without response or invalid token and call handleException", async () => {
  (service.post as jest.Mock).mockRejectedValueOnce({
    message: "Some unknown error",
  });

  const result = await fetchEmailAlertStatus(mockHandleException, mockHistory);

  expect(result).toBeNull();
  expect(mockHandleException).toHaveBeenCalled();
});
it("should replace history if error message includes 'Invalid token'", async () => {
  (service.post as jest.Mock).mockRejectedValueOnce({
    message: "Invalid token provided",
  });

  const result = await fetchEmailAlertStatus(mockHandleException, mockHistory);

  expect(result).toBeNull();
  expect(mockHistory.replace).toHaveBeenCalledWith("/unauthorized");
});
 
  describe("SystemStatusService", () => {
  describe("activateEmailAlert", () => {
    it("should call onSuccess when API call is successful", async () => {
      const mockOnSuccess = jest.fn();
      const mockOnError = jest.fn();
      (service.post as jest.Mock).mockResolvedValueOnce({ status: 204 });

      await activateEmailAlert("alert123", true, mockOnSuccess, mockOnError);

      expect(service.post).toHaveBeenCalledWith(
        "http://mock-base-url.com/TrainingDB/SystemStatusAlertEmail",
        {
          orgId: "cd0e52dd-8331-44dd-bea4-cf1e99d6e1f",
          toEmailId: "suraj.bawankar@test.com",
          orgName: "string test school",
          indicator: "D", // Matches emailSubscribed = true
        }
      );
      expect(mockOnSuccess).toHaveBeenCalled();
      expect(mockOnError).not.toHaveBeenCalled();
    });

    it("should call onError when API call fails with non-204 status", async () => {
      const mockOnSuccess = jest.fn();
      const mockOnError = jest.fn();
      (service.post as jest.Mock).mockResolvedValueOnce({ status: 400 });

      await activateEmailAlert("alert123", false, mockOnSuccess, mockOnError);

      expect(service.post).toHaveBeenCalledWith(
        "http://mock-base-url.com/TrainingDB/SystemStatusAlertEmail",
        {
          orgId: "cd0e52dd-8331-44dd-bea4-cf1e99d6e1f",
          toEmailId: "suraj.bawankar@test.com",
          orgName: "string test school",
          indicator: "A", // Matches emailSubscribed = false
        }
      );
      expect(mockOnSuccess).not.toHaveBeenCalled();
      expect(mockOnError).toHaveBeenCalledWith("Failed to update email alert status.");
    });

    it("should call onError when API call throws an error", async () => {
      const mockOnSuccess = jest.fn();
      const mockOnError = jest.fn();
      (service.post as jest.Mock).mockRejectedValueOnce(new Error("Network Error"));

      await activateEmailAlert("alert123", false, mockOnSuccess, mockOnError);

      expect(service.post).toHaveBeenCalledWith(
        "http://mock-base-url.com/TrainingDB/SystemStatusAlertEmail",
        {
          orgId: "cd0e52dd-8331-44dd-bea4-cf1e99d6e1f",
          toEmailId: "suraj.bawankar@test.com",
          orgName: "string test school",
          indicator: "A", // Matches emailSubscribed = false
        }
      );
      expect(mockOnSuccess).not.toHaveBeenCalled();
      expect(mockOnError).toHaveBeenCalledWith("Failed to update email alert status.");
    });
  });
});
});
 