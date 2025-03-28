import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { createMemoryHistory, History } from "history";
import { Router } from "react-router-dom";
import DetachDatabaseView from "../DetachDatabase.view";
import { ISchoolDetailsDRApiResponse } from "../../../../shared/model/RefreshDatabase/responsemodel";
import { useFetchSchoolNameData } from "../../../../shared/services/schoolDomain/schoolServices";
import { service } from "../../../../shared/utils";
import { errorHandler } from "../../../../shared/utils/errorHandler";

jest.mock("../../../../shared/utils", () => ({
  service: {
    post: jest.fn()
  },
  getUserOrganisation: jest.fn().mockReturnValue("test-org-id"),
  envConfig: {
    BASE_URL: "https://example.com"
  }
}));

jest.mock("@essnextgen/auth-ui", () => ({
  authService: {
    getUsername: jest.fn().mockReturnValue("test-user")
  }
}));

jest.mock("../../../../shared/services/schoolDomain/schoolServices", () => ({
  useFetchSchoolNameData: jest.fn()
}));

jest.mock("../../../../shared/utils/errorHandler", () => ({
  errorHandler: {
    handle401Error: jest.fn()
  }
}));

describe("DetachDatabaseView Component", () => {
  const handleExceptionMock = jest.fn();
  const statusMock = jest.fn();
  let history: History;

  beforeEach(() => {
    history = createMemoryHistory();
    jest.clearAllMocks();
  });

  it("should render the component", () => {
    render(
      <Router history={history}>
        <DetachDatabaseView
          handleException={handleExceptionMock}
          status={statusMock}
        />
      </Router>
    );

    expect(screen.getByTestId("detachDBtitle")).toBeInTheDocument();
    expect(screen.getByTestId("detachDBbutton")).toBeInTheDocument();
    expect(screen.getByTestId("Yes")).toBeInTheDocument();
    expect(screen.getByTestId("No")).toBeInTheDocument();
  });

  it("should call FetchIsDetached and handle success response", async () => {
    const mockResponse: ISchoolDetailsDRApiResponse = {
      statusCode: 200,
      uiStatus: "Completed"
    };

    (useFetchSchoolNameData as jest.Mock).mockResolvedValue({
      schoolName: "Test School"
    });
    (service.post as jest.Mock).mockResolvedValue({
      data: mockResponse
    });

    render(
      <Router history={history}>
        <DetachDatabaseView
          handleException={handleExceptionMock}
          status={statusMock}
        />
      </Router>
    );

    const yesButton = screen.getByTestId("Yes");
    fireEvent.click(yesButton);

    await waitFor(() => {
      expect(statusMock).toHaveBeenCalledWith("Completed");
    });
  });

  it("should call handleException on API failure with response", async () => {
    (useFetchSchoolNameData as jest.Mock).mockResolvedValue({
      schoolName: "Test School"
    });
    (service.post as jest.Mock).mockRejectedValue({
      response: { status: 500, data: "Internal Server Error" }
    });

    render(
      <Router history={history}>
        <DetachDatabaseView
          handleException={handleExceptionMock}
          status={statusMock}
        />
      </Router>
    );

    const yesButton = screen.getByTestId("Yes");
    fireEvent.click(yesButton);

    await waitFor(() => {
      expect(handleExceptionMock).toHaveBeenCalled();
    });
  });

  it("should call handle401Error on API failure with 401 status", async () => {
    (useFetchSchoolNameData as jest.Mock).mockResolvedValue({
      schoolName: "Test School"
    });
    (service.post as jest.Mock).mockRejectedValue({
      response: { status: 401 }
    });

    render(
      <Router history={history}>
        <DetachDatabaseView
          handleException={handleExceptionMock}
          status={statusMock}
        />
      </Router>
    );

    const yesButton = screen.getByTestId("Yes");
    fireEvent.click(yesButton);

    await waitFor(() => {
      expect(errorHandler.handle401Error).toHaveBeenCalledWith(401, history);
    });
  });

  it("should call handleException on API failure without response", async () => {
    (useFetchSchoolNameData as jest.Mock).mockResolvedValue({
      schoolName: "Test School"
    });
    (service.post as jest.Mock).mockRejectedValue(new Error("Network Error"));

    render(
      <Router history={history}>
        <DetachDatabaseView
          handleException={handleExceptionMock}
          status={statusMock}
        />
      </Router>
    );

    const yesButton = screen.getByTestId("Yes");
    fireEvent.click(yesButton);

    await waitFor(() => {
      expect(handleExceptionMock).toHaveBeenCalled();
    });
  });

  it("should not call handleSetIsDetached when 'No' is selected", async () => {
    render(
      <Router history={history}>
        <DetachDatabaseView
          handleException={handleExceptionMock}
          status={statusMock}
        />
      </Router>
    );

    const noButton = screen.getByTestId("No");
    fireEvent.click(noButton);

    await waitFor(() => {
      expect(statusMock).not.toHaveBeenCalled();
      expect(handleExceptionMock).not.toHaveBeenCalled();
    });
  });
});
