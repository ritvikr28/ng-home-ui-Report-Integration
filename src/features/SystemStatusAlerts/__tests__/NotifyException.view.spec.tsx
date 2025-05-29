import { render, screen, fireEvent } from "@testing-library/react";
import { useMediaQuery } from "@essnextgen/ui-kit";
import NotifyExceptionView from "../SystemStatusAlerts/NotifyException.view";

jest.mock("@essnextgen/ui-kit", () => ({
  Notification: jest.fn(({ onClickClose, title, message, status, ...props }) => (
    <div {...props}>
      <h1>{title}</h1>
      <p>{message}</p>
      <p>Status: {status}</p>
      <button onClick={onClickClose} type="submit">
        Close
      </button>
    </div>
  )),
  NotificationStatus: {
    WARNING: "warning",
  },
  useMediaQuery: jest.fn(() => true), 
}));

describe("NotifyExceptionView", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders Notification component with correct props in mobile view", () => {
    const setDisableNotification = jest.fn();
  
    const { container } = render(
      <NotifyExceptionView setDisableNotification={setDisableNotification} />
    );
  
    
    const notificationElement = container.querySelector("#notification-open-panel");
    expect(notificationElement).toBeInTheDocument();
  

    expect(screen.getByText("Information unavailable")).toBeInTheDocument();
    expect(
      screen.getByText(
        "A technical issue at our end has stopped us from displaying some information. Please try again later. If the issue persists please get in touch with our support team."
      )
    ).toBeInTheDocument();
  
  
    expect(screen.getByText("Status: warning")).toBeInTheDocument();
  });

  test("does not render Notification component in non-mobile view", () => {
    const setDisableNotification = jest.fn();
    jest.mocked(useMediaQuery).mockReturnValueOnce(false); 

    const { container } = render(
      <NotifyExceptionView setDisableNotification={setDisableNotification} />
    );

    expect(container.querySelector("#notification-open-panel")).not.toBeInTheDocument();
  });

  test("calls setDisableNotification when close button is clicked", () => {
    const setDisableNotification = jest.fn();

    render(
      <NotifyExceptionView setDisableNotification={setDisableNotification} />
    );

    fireEvent.click(screen.getByText("Close"));
    expect(setDisableNotification).toHaveBeenCalledWith(false);
  });
});
