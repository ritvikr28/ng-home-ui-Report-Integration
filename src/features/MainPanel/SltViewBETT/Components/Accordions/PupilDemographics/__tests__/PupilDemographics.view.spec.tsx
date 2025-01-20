import { render, screen } from "@testing-library/react";
import PupilDemographicsView from "../PupilDemographics.view";
import * as PupilDemographics from "../PupilDemographics.logic";

jest.mock("../PupilDemographics.logic", () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe("PupilDemographicsView", () => {
  const mockData = {
    payload: {
      pupilOnRoll: 449,
      pupilPremiumPercentage: 0,
      totalPupilPremium: 0,
      fsmePercentage: 24.28,
      totalPupilFsme: 109,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders loading state", () => {
    (PupilDemographics.default as jest.Mock).mockReturnValue({
      data: null,
      loading: true,
      error: null,
    });

    render(<PupilDemographicsView />);

    const loaders = screen.getAllByText(/please wait.../i);
    expect(loaders.length).toBeGreaterThan(0);
  });

  test("renders error state for pupils on roll", () => {
    (PupilDemographics.default as jest.Mock).mockReturnValue({
      data: null,
      loading: false,
      error: "Failed to fetch data",
    });

    render(<PupilDemographicsView />);
    expect(
      screen.getByText(/pupils on roll insights unavailable/i)
    ).toBeInTheDocument();
  });

  test("renders data for pupils on roll", () => {
    (PupilDemographics.default as jest.Mock).mockReturnValue({
      data: mockData,
      loading: false,
      error: null,
    });

    render(<PupilDemographicsView />);
    expect(screen.getByText(/pupils on roll/i)).toBeInTheDocument();
    expect(screen.getByText(/449/i)).toBeInTheDocument();
  });

  test("renders error state for pupil premium", () => {
    (PupilDemographics.default as jest.Mock).mockReturnValue({
      data: { payload: { pupilOnRoll: null } },
      loading: false,
      error: "Failed to fetch data",
    });

    render(<PupilDemographicsView />);
    expect(
      screen.getByText(/pupil premium insight unavailable/i)
    ).toBeInTheDocument();
  });

  test("renders data for pupil premium", () => {
    (PupilDemographics.default as jest.Mock).mockReturnValue({
      data: mockData,
      loading: false,
      error: null,
    });

    render(<PupilDemographicsView />);
    expect(screen.getByText(/pupil premium \(pp\)/i)).toBeInTheDocument();
    expect(screen.getByText(/0% \(0\)/i)).toBeInTheDocument();
  });

  test("renders error state for FSM", () => {
    (PupilDemographics.default as jest.Mock).mockReturnValue({
      data: { payload: { pupilOnRoll: null, pupilPremiumPercentage: null } },
      loading: false,
      error: "Failed to fetch data",
    });

    render(<PupilDemographicsView />);
    expect(screen.getByText(/fsm insight unavailable/i)).toBeInTheDocument();
  });

  test("renders data for FSM", () => {
    (PupilDemographics.default as jest.Mock).mockReturnValue({
      data: mockData,
      loading: false,
      error: null,
    });

    render(<PupilDemographicsView />);
    expect(screen.getByText(/free school meals \(fsm\)/i)).toBeInTheDocument();
    expect(screen.getByText(/24.28% \(109\)/i)).toBeInTheDocument();
  });

  test("renders null for pupils on roll when data is undefined", () => {
    (PupilDemographics.default as jest.Mock).mockReturnValue({
      data: { payload: { pupilOnRoll: null } },
      loading: false,
      error: null,
    });

    render(<PupilDemographicsView />);
    expect(screen.queryByText(/pupils on roll/i)).not.toBeInTheDocument();
  });
});
