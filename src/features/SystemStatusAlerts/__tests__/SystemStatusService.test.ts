import { History } from "history";
import { activateEmailAlert, fetchEmailAlertStatus, handleCloseMenuOnOutsideClick, systemStatusOverflowMenuOutSideClickHandler } from "../SystemStatusAlerts/SystemStatusService";
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
      (service.post as jest.Mock).mockResolvedValueOnce({ status: 200 });

      await activateEmailAlert("alert123", true, mockOnSuccess, mockOnError);

      expect(service.post).toHaveBeenCalledWith(
        "http://mock-base-url.com/TrainingDB/SystemStatusAlertEmail",
        {
          orgId: "cd0e52dd-8331-44dd-bea4-cf1e99d6e1f",
          toEmailId: "suraj.bawankar@test.com",
          orgName: "string test school",
          indicator: "D"
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
          indicator: "A", 
        }
      );
      expect(mockOnSuccess).not.toHaveBeenCalled();
      expect(mockOnError).toHaveBeenCalledWith("A Technical issue at our end has stopped us from action.");
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
          indicator: "A", 
        }
      );
      expect(mockOnSuccess).not.toHaveBeenCalled();
      expect(mockOnError).toHaveBeenCalledWith("A Technical issue at our end has stopped us from action.");
    });
  });
});
});
 

describe("handleCloseMenuOnOutsideClick", () => {
  let setActiveRow: jest.Mock;

  beforeEach(() => {
    setActiveRow = jest.fn();

    // Set up DOM elements
    document.body.innerHTML = `
      <div>
        <div class="system-status-overflow-menu" id="menu"></div>
        <button class="system-status-overflow-btn-active" id="button"></button>
        <div id="outside"></div>
      </div>
    `;
  });

  afterEach(() => {
    document.body.innerHTML = "";
    jest.clearAllMocks();
  });

  it("should add and remove event listener", () => {
    const addSpy = jest.spyOn(document, "addEventListener");
    const removeSpy = jest.spyOn(document, "removeEventListener");
    const cleanup = handleCloseMenuOnOutsideClick("1", setActiveRow);
    expect(addSpy).toHaveBeenCalledWith("mousedown", expect.any(Function));
    if (cleanup) cleanup();
    expect(removeSpy).toHaveBeenCalledWith("mousedown", expect.any(Function));
  });

  it("should call setActiveRow(null) when clicking outside menu and button", () => {
    handleCloseMenuOnOutsideClick("1", setActiveRow);

    const outside = document.getElementById("outside")!;
    outside.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));

    expect(setActiveRow).toHaveBeenCalledWith(null);
  });

  it("should NOT call setActiveRow(null) when clicking inside menu", () => {
    handleCloseMenuOnOutsideClick("1", setActiveRow);

    const menu = document.getElementById("menu")!;
    menu.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));

    expect(setActiveRow).not.toHaveBeenCalled();
  });

  it("should NOT call setActiveRow(null) when clicking the button", () => {
    handleCloseMenuOnOutsideClick("1", setActiveRow);

    const button = document.getElementById("button")!;
    button.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));

    expect(setActiveRow).not.toHaveBeenCalled();
  });

  it("should do nothing if activeRow is null", () => {
    const addSpy = jest.spyOn(document, "addEventListener");
    handleCloseMenuOnOutsideClick(null, setActiveRow);
    expect(addSpy).not.toHaveBeenCalled();
  });
});



const mockCleanup = jest.fn();


describe("systemStatusOverflowMenuOutSideClickHandler", () => {
  let setOverflowMenuIndex: jest.Mock;
  jest.mock("../SystemStatusAlerts/SystemStatusService", () => {
    const original = jest.requireActual(
      "../SystemStatusAlerts/SystemStatusService"
    );
    return {
      ...original,
      handleCloseMenuOnOutsideClick: jest.fn(() => mockCleanup)
    };
  });

  beforeEach(() => {
    setOverflowMenuIndex = jest.fn();
    mockCleanup.mockClear();
    jest.clearAllMocks();
    // Remove all scroll listeners if needed
  });



  it('should call setOverflowMenuIndex("") when scroll event is triggered', () => {
    // Spy before calling the handler
    const addSpy = jest.spyOn(window, "addEventListener");
    const removeSpy = jest.spyOn(window, "removeEventListener");

    const cleanup = systemStatusOverflowMenuOutSideClickHandler(
      "1",
      setOverflowMenuIndex
    );

    // Find the scroll handler added
    let scrollHandler: ((event: Event) => void) | undefined;
    addSpy.mock.calls.forEach((call) => {
      if (call[0] === "scroll")
        scrollHandler = call[1] as (event: Event) => void;
    });

    // Simulate scroll event using the handler directly (if found)
    if (scrollHandler) {
      scrollHandler(new Event("scroll"));
      expect(setOverflowMenuIndex).toHaveBeenCalledWith("");
    } else {
      // Fallback: dispatch a real scroll event on window
      window.dispatchEvent(new Event("scroll"));
      expect(setOverflowMenuIndex).toHaveBeenCalledWith("");
    }

    if (cleanup) cleanup();

    addSpy.mockRestore();
    removeSpy.mockRestore();
  });

  it("should return undefined and not add listeners if overflowMenuIndex is falsy", () => {
    const addSpy = jest.spyOn(window, "addEventListener");
    const cleanup = systemStatusOverflowMenuOutSideClickHandler(
      "",
      setOverflowMenuIndex
    );
    expect(addSpy).not.toHaveBeenCalled();
    expect(cleanup).toBeUndefined();
  });
});
