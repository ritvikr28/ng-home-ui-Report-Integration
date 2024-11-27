import { render, screen, fireEvent } from "@testing-library/react";
import NotifyExceptionView from "../NotifyException.view";

jest.mock("@essnextgen/ui-kit", () => ({
  Notification: jest.fn(({ onClickClose, ...props }) => (
    <div {...props}>
      <button onClick={onClickClose} type="submit">
        Close
      </button>
    </div>
  )),
  NotificationStatus: {
    HIGHLIGHT: "highlight"
  }
}));

describe("NotificationView", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders Notification component with correct props", () => {
    const setDisableNotification = jest.fn();

    const { container } = render(
      <NotifyExceptionView setDisableNotification={setDisableNotification} />
    );
    expect(
      container.querySelector(".notification-id-sims")
    ).toBeInTheDocument();
    expect(container.querySelector("#element-id")).toBeInTheDocument();
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
