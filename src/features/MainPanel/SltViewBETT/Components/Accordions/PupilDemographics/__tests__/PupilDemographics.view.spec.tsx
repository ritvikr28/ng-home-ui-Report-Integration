
import { render, screen } from "@testing-library/react";
import PupilDemographicsView from "../PupilDemographics.view";

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




  test("renders loading state", () => {
    render(<PupilDemographicsView data={null} loading error={null} />);
    const loaders = screen.getAllByText(/please wait.../i);
    expect(loaders.length).toBeGreaterThan(0);
  });


  test("renders error state for pupils on roll", () => {
    render(
      <PupilDemographicsView data={null} loading={false} error="Failed to fetch data" />
    );
    expect(
      screen.getByText(/pupils on roll insights unavailable/i)
    ).toBeInTheDocument();
  });


  test("renders data for pupils on roll", () => {
    render(
      <PupilDemographicsView data={mockData} loading={false} error={null} />
    );
    expect(screen.getByText(/pupildemographics.pupilsonroll/i)).toBeInTheDocument();
    expect(screen.getByText(449)).toBeInTheDocument();
  });


  test("renders error state for pupil premium", () => {
    render(
      <PupilDemographicsView data={{ payload: { pupilOnRoll: null } }} loading={false} error="Failed to fetch data" />
    );
    expect(
      screen.getByText(/pupil premium insight unavailable/i)
    ).toBeInTheDocument();
  });


  test("renders data for pupil premium", () => {
    render(
      <PupilDemographicsView data={mockData} loading={false} error={null} />
    );
    expect(screen.getByText(/pupildemographics.pupilpremium/i)).toBeInTheDocument();
    expect(screen.getByText("0% (0)")).toBeInTheDocument();
  });


  test("renders error state for FSM", () => {
    render(
      <PupilDemographicsView data={{ payload: { pupilOnRoll: null, pupilPremiumPercentage: null } }} loading={false} error="Failed to fetch data" />
    );
    expect(screen.getByText(/fsm insight unavailable/i)).toBeInTheDocument();
  });


  test("renders data for FSM", () => {
    render(
      <PupilDemographicsView data={mockData} loading={false} error={null} />
    );
    expect(screen.getByText(/pupildemographics.freeschoolmeals/i)).toBeInTheDocument();
    expect(screen.getByText("24.28% (109)")).toBeInTheDocument();
  });


  test("renders null for pupils on roll when data is undefined", () => {
    render(
      <PupilDemographicsView data={{ payload: { pupilOnRoll: null } }} loading={false} error={null} />
    );
    expect(screen.queryByText(/pupildemographics.pupilsonroll/i)).not.toBeInTheDocument();
  });

});
