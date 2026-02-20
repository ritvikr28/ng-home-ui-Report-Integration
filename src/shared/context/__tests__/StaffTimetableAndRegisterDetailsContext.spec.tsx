import React from "react";
import { render, waitFor, screen, act } from "@testing-library/react";
import { StaffTimetableAndRegisterDetailsProvider, useStaffTimetableAndRegisterDetails } from "../StaffTimetableAndRegisterDetailsContext";

jest.mock("../../services/registersDomain/registerEventsDetails", () => ({
  FetchStaffTimetableAndRegisterDetails: jest.fn()
}));

const { FetchStaffTimetableAndRegisterDetails } = require("../../services/registersDomain/registerEventsDetails");

function ConsumerComponent() {
  const { data, isLoading, isError, refetch } = useStaffTimetableAndRegisterDetails();
  return (
    <div>
      <span data-testid="data">{data ? "yes" : "no"}</span>
      <span data-testid="loading">{isLoading ? "yes" : "no"}</span>
      <span data-testid="error">{isError ? "yes" : "no"}</span>
      <button onClick={refetch} type="button">Refetch</button>
    </div>
  );
}

describe("StaffTimetableAndRegisterDetailsContext", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("fetches data when hasAccess is true and provides context", async () => {
    FetchStaffTimetableAndRegisterDetails.mockResolvedValue({ foo: "bar" });
    render(
      <StaffTimetableAndRegisterDetailsProvider hasAccess>
        <ConsumerComponent />
      </StaffTimetableAndRegisterDetailsProvider>
    );
    expect(screen.getByTestId("loading").textContent).toBe("yes");
    await waitFor(() => expect(screen.getByTestId("data").textContent).toBe("yes"));
    expect(screen.getByTestId("error").textContent).toBe("no");
  });

  it("sets error if fetch returns falsy", async () => {
    FetchStaffTimetableAndRegisterDetails.mockResolvedValue(null);
    render(
      <StaffTimetableAndRegisterDetailsProvider hasAccess>
        <ConsumerComponent />
      </StaffTimetableAndRegisterDetailsProvider>
    );
    await waitFor(() => expect(screen.getByTestId("error").textContent).toBe("yes"));
  });

  it("sets error if fetch throws", async () => {
    FetchStaffTimetableAndRegisterDetails.mockRejectedValue(new Error("fail"));
    render(
      <StaffTimetableAndRegisterDetailsProvider hasAccess>
        <ConsumerComponent />
      </StaffTimetableAndRegisterDetailsProvider>
    );
    await waitFor(() => expect(screen.getByTestId("error").textContent).toBe("yes"));
    expect(screen.getByTestId("data").textContent).toBe("no");
  });

  it("does not fetch if hasAccess is false", async () => {
    render(
      <StaffTimetableAndRegisterDetailsProvider hasAccess={false}>
        <ConsumerComponent />
      </StaffTimetableAndRegisterDetailsProvider>
    );
    expect(screen.getByTestId("data").textContent).toBe("no");
    expect(screen.getByTestId("loading").textContent).toBe("no");
    expect(screen.getByTestId("error").textContent).toBe("no");
  });

  it("refetch triggers fetchData", async () => {
    FetchStaffTimetableAndRegisterDetails.mockResolvedValueOnce({ foo: "bar" });
    render(
      <StaffTimetableAndRegisterDetailsProvider hasAccess>
        <ConsumerComponent />
      </StaffTimetableAndRegisterDetailsProvider>
    );
    await waitFor(() => expect(screen.getByTestId("data").textContent).toBe("yes"));
    FetchStaffTimetableAndRegisterDetails.mockResolvedValueOnce({ foo: "baz" });
    act(() => {
      screen.getByText("Refetch").click();
    });
    await waitFor(() => expect(FetchStaffTimetableAndRegisterDetails).toHaveBeenCalledTimes(2));
  });

  it("changing hasAccess from false to true triggers fetch", async () => {
    const { rerender } = render(
      <StaffTimetableAndRegisterDetailsProvider hasAccess={false}>
        <ConsumerComponent />
      </StaffTimetableAndRegisterDetailsProvider>
    );
    expect(screen.getByTestId("data").textContent).toBe("no");
    FetchStaffTimetableAndRegisterDetails.mockResolvedValueOnce({ foo: "bar" });
    rerender(
      <StaffTimetableAndRegisterDetailsProvider hasAccess>
        <ConsumerComponent />
      </StaffTimetableAndRegisterDetailsProvider>
    );
    await waitFor(() => expect(screen.getByTestId("data").textContent).toBe("yes"));
  });

  it("throws if hook used outside provider", () => {
    const Broken = () => {
      useStaffTimetableAndRegisterDetails();
      return null;
    };
    expect(() => render(<Broken />)).toThrow();
  });
});

function Consumer() {
  const { refetch } = useStaffTimetableAndRegisterDetails();
  return <button onClick={refetch} type="button">Refetch</button>;
}

describe("fetchData early return when hasAccess is false", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should not call FetchStaffTimetableAndRegisterDetails if hasAccess is false (initial)", () => {
    render(
      <StaffTimetableAndRegisterDetailsProvider hasAccess={false}>
        <Consumer />
      </StaffTimetableAndRegisterDetailsProvider>
    );
    expect(FetchStaffTimetableAndRegisterDetails).not.toHaveBeenCalled();
  });

  it("should not call FetchStaffTimetableAndRegisterDetails if refetch is called and hasAccess is false", () => {
    render(
      <StaffTimetableAndRegisterDetailsProvider hasAccess={false}>
        <Consumer />
      </StaffTimetableAndRegisterDetailsProvider>
    );
    act(() => {
      screen.getByText("Refetch").click();
    });
    expect(FetchStaffTimetableAndRegisterDetails).not.toHaveBeenCalled();
  });

  it("should call FetchStaffTimetableAndRegisterDetails if hasAccess is true", async () => {
    FetchStaffTimetableAndRegisterDetails.mockResolvedValue({});
    render(
      <StaffTimetableAndRegisterDetailsProvider hasAccess>
        <Consumer />
      </StaffTimetableAndRegisterDetailsProvider>
    );
    // Wait for effect
    await act(async () => {});
    expect(FetchStaffTimetableAndRegisterDetails).toHaveBeenCalled();
  });
});