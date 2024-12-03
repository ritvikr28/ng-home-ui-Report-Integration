import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DeleteNGDataView from "../DeleteNGData.view";
import { service } from "../../../../shared/utils";
import axios from "axios";

jest.mock("../../../shared/services/schoolDomain/schoolServices", () => ({
  useFetchSchoolNameData: jest.fn().mockResolvedValue({ schoolName: "Test School" }),
}));
jest.mock("../../../shared/utils", () => ({
  envConfig: { BASE_URL: "https://test-api.com" },
  getUserOrganisation: jest.fn().mockReturnValue("123"),
  service: { post: jest.fn(), get: jest.fn() },
}));
jest.mock("@essnextgen/auth-ui", () => ({
  authService: { getUsername: jest.fn().mockReturnValue("TestUser") },
}));

describe("DeleteNGDataView Component", () => {
  const mockStatus = jest.fn();

  beforeEach(() => {
    mockStatus.mockClear();
  });

  it("should open the confirmation dialog on 'Proceed' button click", () => {
    render(<DeleteNGDataView status={mockStatus} />);
    const proceedButton = screen.getByText("Proceed");
    fireEvent.click(proceedButton);
    expect(screen.getByText("Delete Next Gen Data?")).toBeInTheDocument();
  });

  it("should close the dialog on cancel", () => {
    render(<DeleteNGDataView status={mockStatus} />);
    fireEvent.click(screen.getByText("Proceed"));
    fireEvent.click(screen.getByText("Cancel"));
    expect(screen.queryByText("Delete Next Gen Data?")).not.toBeInTheDocument();
  });

  it("should call API and update status to 'In Progress' on success", async () => {
    (axios.post as jest.Mock).mockResolvedValueOnce({ status: 200 });
    render(<DeleteNGDataView status={mockStatus} />);
    fireEvent.click(screen.getByText("Proceed"));
    fireEvent.click(screen.getByText("Delete"));
    await waitFor(() => expect(mockStatus).toHaveBeenCalledWith("In Progress"));
  });

  it("should update status to 'Failed' on non-200 API response", async () => {
    (axios.post as jest.Mock).mockResolvedValueOnce({ status: 500 });
    render(<DeleteNGDataView status={mockStatus} />);
    fireEvent.click(screen.getByText("Proceed"));
    fireEvent.click(screen.getByText("Delete"));
    await waitFor(() => expect(mockStatus).toHaveBeenCalledWith("Failed"));
  });

  it("should handle API errors gracefully", async () => {
    (axios.post as jest.Mock).mockRejectedValueOnce(new Error("API error"));
    render(<DeleteNGDataView status={mockStatus} />);
    fireEvent.click(screen.getByText("Proceed"));
    fireEvent.click(screen.getByText("Delete"));
    await waitFor(() => expect(mockStatus).not.toHaveBeenCalledWith("In Progress"));
  });

  it("should construct requestData correctly", async () => {
    render(<DeleteNGDataView status={mockStatus} />);
    fireEvent.click(screen.getByText("Proceed"));
    fireEvent.click(screen.getByText("Delete"));
    await waitFor(() =>
      expect(service.post).toHaveBeenCalledWith(
        "https://test-api.com/TrainingDB/ProcessNGDeletion",
        expect.objectContaining({
          orgId: "123",
          orgName: "Test School",
          dataDeletedStatus: "N",
          ngDomainDataDeletedBy: "TestUser",
        })
      )
    );
  });
});
