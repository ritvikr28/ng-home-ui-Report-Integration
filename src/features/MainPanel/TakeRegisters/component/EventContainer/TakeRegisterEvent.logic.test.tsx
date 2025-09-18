import { render, screen, waitFor } from "@testing-library/react";
import TakeRegisterEvent from "./TakeRegisterEvent.logic";
import * as registerService from "../../../../../shared/services/registersDomain/registerEventsDetails";

jest.mock("../../../../../shared/services/registersDomain/registerEventsDetails");

const mockRegisterDetails = [
  { id: 1, name: "Register 1" },
  { id: 2, name: "Register 2" }
];

describe("TakeRegisterEvent", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders loader initially", () => {
    render(<TakeRegisterEvent isOpen={true} />);
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  it("renders TakeRegisterEventView with data on success", async () => {
    (registerService.FetchStaffTimetableAndRegisterDetails as jest.Mock).mockResolvedValue({
      payload: { registerDetailResponse: mockRegisterDetails }
    });
    render(<TakeRegisterEvent isOpen={true} />);
    await waitFor(() => {
      expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument();
    });
  });

  it("renders error state when API fails", async () => {
    (registerService.FetchStaffTimetableAndRegisterDetails as jest.Mock).mockRejectedValue(new Error("API Error"));
    render(<TakeRegisterEvent isOpen={true} />);
    await waitFor(() => {
      expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument();
    });
  });

  it("renders error state when API returns invalid data", async () => {
    (registerService.FetchStaffTimetableAndRegisterDetails as jest.Mock).mockResolvedValue({ payload: {} });
    render(<TakeRegisterEvent isOpen={true} />);
    await waitFor(() => {
      expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument();
    });
  });
});
