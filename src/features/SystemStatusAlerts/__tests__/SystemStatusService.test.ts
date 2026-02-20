import { History, Action } from "history";
import { activateEmailAlert, fetchEmailAlertStatus, handleCloseMenuOnOutsideClick, systemStatusOverflowMenuOutSideClickHandler } from "../SystemStatusAlerts/SystemStatusService";
import { getUserEmail, getUserOrganisation ,envConfig, service} from "../../../shared/utils";
import { useFetchSchoolNameData } from "../../../shared/services/schoolDomain/schoolServices";
import { ISystemStatusAlertResponse } from "../../../shared/model/SystemStatus/responsemodel";

// Provide global type declarations for test environment if missing
// @ts-ignore
type EventListener = (...args: any[]) => void;
// @ts-ignore
interface EventListenerObject {
  handleEvent(evt: Event): void;
}
type EventListenerOrEventListenerObject = EventListener | EventListenerObject;
// @ts-ignore
type AddEventListenerOptions = {
  capture?: boolean;
  once?: boolean;
  passive?: boolean;
  signal?: AbortSignal;
};
// @ts-ignore
type EventListenerOptions = {
  capture?: boolean;
  passive?: boolean;
};

beforeEach(() => {
  (getUserEmail as jest.Mock).mockReturnValue("suraj.bawankar@test.com");
  (getUserOrganisation as jest.Mock).mockReturnValue("cd0e52dd-8331-44dd-bea4-cf1e99d6e1f");
  (useFetchSchoolNameData as jest.Mock).mockReturnValue({ schoolName: "string test school" });
});
jest.mock("../../../shared/utils", () => ({
  ...jest.requireActual("../../../shared/utils"),
  envConfig: {
    BASE_URL: "http://mock-base-url.com"
  },
  service: {
    post: jest.fn()
  },
  getUserEmail: jest.fn(() => "suraj.bawankar@test.com"),
  getUserOrganisation: jest.fn(() => "cd0e52dd-8331-44dd-bea4-cf1e99d6e1f")
}));

jest.mock("../../../shared/services/schoolDomain/schoolServices", () => ({
  useFetchSchoolNameData: jest.fn(() => ({
    schoolName: "string test school"
  }))
}));


describe("SystemStatusService", () => {
  const mockHandleException: jest.Mock<any, any> = jest.fn();
  let mockHistory: jest.Mocked<History>;

  beforeEach(() => {
    mockHistory = {
      push: jest.fn(),
      replace: jest.fn(),
      location: { pathname: '', search: '', state: undefined, hash: '', key: '' },
      action: Action.Pop,
      listen: jest.fn(),
      block: jest.fn(),
      go: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      createHref: jest.fn()
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("fetchEmailAlertStatus", () => {

it("should return data when API call is successful", async () => {
  const mockResponse: {
    data: {
        responseCode: number;
        listenerData: {
            listenerStatus: string;
            eMailAlert: boolean;
        };
        ssmHostData: {
            ssmHostStatus: string;
            eMailAlert: boolean;
        };
    };
} = {
    data: {
      responseCode: 200,
      listenerData: { listenerStatus: "Live", eMailAlert: true },
      ssmHostData: { ssmHostStatus: "Not Live", eMailAlert: false }
    }
  };
  (service.post as jest.Mock).mockResolvedValueOnce(mockResponse);

  const result: ISystemStatusAlertResponse | null = await fetchEmailAlertStatus(mockHandleException, mockHistory);

  expect(result).toEqual(mockResponse.data);
expect(service.post).toHaveBeenCalledWith(
  `${envConfig.BASE_URL}/TrainingDB/SystemStatusAlert`,
  {
    orgId: "cd0e52dd-8331-44dd-bea4-cf1e99d6e1f",
    toEmailId: "suraj.bawankar@test.com"
  }
);
  expect(mockHandleException).not.toHaveBeenCalled();
});
    it("should handle API errors and call handleException", async () => {
      (service.post as jest.Mock).mockRejectedValueOnce(new Error("API Error"));

      const result: ISystemStatusAlertResponse | null = await fetchEmailAlertStatus(mockHandleException, mockHistory);

      expect(result).toBeNull();
      expect(mockHandleException).toHaveBeenCalled();
    });

   it("should replace history on invalid token error", async () => {
  (service.post as jest.Mock).mockRejectedValueOnce({
    message: "Invalid token"
  });

  const result: ISystemStatusAlertResponse | null = await fetchEmailAlertStatus(mockHandleException, mockHistory);

  expect(result).toBeNull();
  expect(mockHistory.replace).toHaveBeenCalledWith("/unauthorized");
});

    it("should handle unknown errors and call handleException", async () => {
      (service.post as jest.Mock).mockRejectedValueOnce(new Error("Unknown Error"));

      const result: ISystemStatusAlertResponse | null = await fetchEmailAlertStatus(mockHandleException, mockHistory);

      expect(result).toBeNull();
      expect(mockHandleException).toHaveBeenCalled();
    });
  });
it("should return null and call handleException when orgId or toEmailId is missing", async () => {
  (getUserOrganisation as jest.Mock).mockReturnValueOnce(null);
  (getUserEmail as jest.Mock).mockReturnValueOnce(null);

  const result: ISystemStatusAlertResponse | null = await fetchEmailAlertStatus(mockHandleException, mockHistory);

  expect(result).toBeNull();
  expect(mockHandleException).toHaveBeenCalled();
});
it("should call handleException when response code is not 200", async () => {
  const mockResponse: { data: { responseCode: number; };} = {
    data: {
      responseCode: 500
    }
  };
  (service.post as jest.Mock).mockResolvedValueOnce(mockResponse);

  const result: ISystemStatusAlertResponse | null = await fetchEmailAlertStatus(mockHandleException, mockHistory);

  expect(result).toBeNull();
  expect(mockHandleException).toHaveBeenCalled();
});
it("should redirect to /unauthorized if status code is 401", async () => {
  (service.post as jest.Mock).mockRejectedValueOnce({
    response: {
      status: 401
    }
  });

  const result: ISystemStatusAlertResponse | null = await fetchEmailAlertStatus(mockHandleException, mockHistory);

  expect(result).toBeNull();
  expect(mockHistory.push).toHaveBeenCalledWith("/unauthorized");
});
it("should handle errors without response or invalid token and call handleException", async () => {
  (service.post as jest.Mock).mockRejectedValueOnce({
    message: "Some unknown error"
  });

  const result: ISystemStatusAlertResponse | null = await fetchEmailAlertStatus(mockHandleException, mockHistory);

  expect(result).toBeNull();
  expect(mockHandleException).toHaveBeenCalled();
});
it("should replace history if error message includes 'Invalid token'", async () => {
  (service.post as jest.Mock).mockRejectedValueOnce({
    message: "Invalid token provided"
  });

  const result: ISystemStatusAlertResponse | null = await fetchEmailAlertStatus(mockHandleException, mockHistory);

  expect(result).toBeNull();
  expect(mockHistory.replace).toHaveBeenCalledWith("/unauthorized");
});
 
  describe("SystemStatusService", () => {
  describe("activateEmailAlert", () => {

    it("should call onError when API call fails with non-204 status", async () => {
      const mockOnSuccess = jest.fn();
      const mockOnError = jest.fn();
      (service.post as jest.Mock).mockResolvedValueOnce({ status: 400 });

      await activateEmailAlert("alert123", false, mockOnSuccess, mockOnError,"SSM");

      expect(service.post).toHaveBeenCalledWith(
        "http://mock-base-url.com/TrainingDB/SystemStatusAlertEmail",
        {
          orgId: "cd0e52dd-8331-44dd-bea4-cf1e99d6e1f",
          toEmailId: "suraj.bawankar@test.com",
          orgName: "string test school",
          indicator: "A",
          emailType: "SSM"
        }
      );
      expect(mockOnSuccess).not.toHaveBeenCalled();
      expect(mockOnError).toHaveBeenCalledWith("A technical issue at our end has stopped us from activating email alert.");
    });

    it("should call onError when API call throws an error", async () => {
      const mockOnSuccess = jest.fn();
      const mockOnError = jest.fn();
      (service.post as jest.Mock).mockRejectedValueOnce(new Error("Network Error"));

      await activateEmailAlert("alert123", false, mockOnSuccess, mockOnError,"SSM");

      expect(service.post).toHaveBeenCalledWith(
        "http://mock-base-url.com/TrainingDB/SystemStatusAlertEmail",
        {
          orgId: "cd0e52dd-8331-44dd-bea4-cf1e99d6e1f",
          toEmailId: "suraj.bawankar@test.com",
          orgName: "string test school",
          indicator: "A",
          emailType: "SSM"
        }
      );
      expect(mockOnSuccess).not.toHaveBeenCalled();
      expect(mockOnError).toHaveBeenCalledWith("A technical issue at our end has stopped us from activating email alert.");
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
    const addSpy: jest.SpyInstance<void, [type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions | undefined]> = jest.spyOn(document, "addEventListener");
    const removeSpy: jest.SpyInstance<void, [type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions | undefined]> = jest.spyOn(document, "removeEventListener");
    const cleanup: () => void = handleCloseMenuOnOutsideClick("1", setActiveRow);
    expect(addSpy).toHaveBeenCalledWith("mousedown", expect.any(Function));
    if (cleanup) cleanup();
    expect(removeSpy).toHaveBeenCalledWith("mousedown", expect.any(Function));
  });

  it("should call setActiveRow(null) when clicking outside menu and button", () => {
    handleCloseMenuOnOutsideClick("1", setActiveRow);

    const outside: HTMLElement | null = document.getElementById("outside");
    if (outside) {
      outside.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
      expect(setActiveRow).toHaveBeenCalledWith(null);
    } else {
      throw new Error('Test setup failed: #outside element not found');
    }
  });

  it("should NOT call setActiveRow(null) when clicking inside menu", () => {
    handleCloseMenuOnOutsideClick("1", setActiveRow);

    const menu: HTMLElement | null = document.getElementById("menu");
    if (menu) {
      menu.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
      expect(setActiveRow).not.toHaveBeenCalled();
    } else {
      throw new Error('Test setup failed: #menu element not found');
    }
  });

  it("should NOT call setActiveRow(null) when clicking the button", () => {
    handleCloseMenuOnOutsideClick("1", setActiveRow);

    const button: HTMLElement | null = document.getElementById("button");
    if (button) {
      button.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
      expect(setActiveRow).not.toHaveBeenCalled();
    } else {
      throw new Error('Test setup failed: #button element not found');
    }
  });

  it("should do nothing if activeRow is null", () => {
    const addSpy: jest.SpyInstance<void, [type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions | undefined]> = jest.spyOn(document, "addEventListener");
    handleCloseMenuOnOutsideClick(null, setActiveRow);
    expect(addSpy).not.toHaveBeenCalled();
  });
});



const mockCleanup: jest.Mock<any, any> = jest.fn();


describe("systemStatusOverflowMenuOutSideClickHandler", () => {
  let setOverflowMenuIndex: jest.Mock;
  jest.mock("../SystemStatusAlerts/SystemStatusService", () => {
    const original:any = jest.requireActual(
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
    const addSpy: jest.SpyInstance<void, [type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions | undefined]> = jest.spyOn(window, "addEventListener");
    const removeSpy: jest.SpyInstance<void, [type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions | undefined]> = jest.spyOn(window, "removeEventListener");

    const cleanup: () => void = systemStatusOverflowMenuOutSideClickHandler(
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
    const addSpy: jest.SpyInstance<void, [type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions | undefined]> = jest.spyOn(window, "addEventListener");
    const cleanup: () => void = systemStatusOverflowMenuOutSideClickHandler(
      "",
      setOverflowMenuIndex
    );
    expect(addSpy).not.toHaveBeenCalled();
    expect(cleanup).toBeUndefined();
  });
  it("should call onSuccess when API call is successful with responseCode 200", async () => {
  const mockOnSuccess: jest.Mock<any, any> = jest.fn();
  const mockOnError: jest.Mock<any, any> = jest.fn();

  (service.post as jest.Mock).mockResolvedValueOnce({
    status: 200,
    data: {
      responseCode: 200
    }
  });

  await activateEmailAlert("alert123", false, mockOnSuccess, mockOnError, "SSM");

  expect(mockOnSuccess).toHaveBeenCalled();
  expect(mockOnError).not.toHaveBeenCalled();
});
it("should return a no-op function if activeRow is null", () => {
  const result: () => void = handleCloseMenuOnOutsideClick(null, jest.fn());
  expect(typeof result).toBe("function");
  result(); // Ensure no error is thrown
});


});
