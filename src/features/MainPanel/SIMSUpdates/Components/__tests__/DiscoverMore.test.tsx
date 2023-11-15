import { render, screen, fireEvent } from "@testing-library/react";
import DiscoverMoreView from "../DiscoverMore.view";

describe("DiscoverMoreView Component", () => {
  it("renders without crashing", () => {
    render(<DiscoverMoreView />);
    expect(screen.getByText("SIMS Next Gen updates")).toBeInTheDocument();
  });

  it("renders Discover more button with correct properties", () => {
    render(<DiscoverMoreView />);
    const discoverMoreButton = screen.getByTestId("btn-save");

    expect(discoverMoreButton).toBeInTheDocument();
    expect(discoverMoreButton).toHaveClass("base-class");
  });

  it("opens link in a new tab when Discover more button is clicked", () => {
    const spyWindowOpen = jest.spyOn(window, "open");
    spyWindowOpen.mockImplementation(jest.fn());
    render(<DiscoverMoreView />);
    const discoverMoreButton = screen.getByTestId("btn-save");
    fireEvent.click(discoverMoreButton);
    expect(spyWindowOpen).toHaveBeenCalled();
  });

  it("renders action cards with correct properties", () => {
    
    render(<DiscoverMoreView />);
    const actionCards = screen.getAllByTestId("test-id");
    actionCards.forEach((card) => {
      expect(card).toBeInTheDocument();
      expect(card).toHaveClass("essui-activity-card");      
    });    
  });

  it("opens links in a new tab when action cards are clicked", () => {    
    render(<DiscoverMoreView />);
    const actionCardLinks = screen.getByTestId("link1");  
      fireEvent.click(actionCardLinks);    
      expect(actionCardLinks).toHaveAttribute('href',"https://parentpaygroup.service-now.com/csm?id=kb_article_view&sysparm_article=KB0053640&sys_kb_id=bea0de511bb9b510455842a7b04bcb75&spa=1");
  });
  
  // it.only("Check action card click have been called", () => {
  //   const actionclick=jest.fn();
  //   const mockcard=<ActionCard
  //   className="primary-text"
  //     dataTestId="test-1"
  //     id="action-card"
  //     onClickActionCard={actionclick}
  //     primaryText="The SIMS Next Gen roadmap"
  //     secondaryText="Discover what's on the horizon and how we are enhancing SIMS on the Next Gen roadmap"
  //   ></ActionCard>
  
  //   jest.mock('@essnextgen/ui-kit', () => ({
  //     ActionCard: jest.fn((props) => (
  //        mockcard
  //       // <div onClick={actionclick} data-testid="mocked-action-card">
  //       //   Mocked ActionCard
  //       // </div>
  //     )),
  //   }));    
    
  //   const{getByTestId}=render(<DiscoverMoreView/>);
  //   userEvent.click(getByTestId("test-1"));
  //   expect(actionclick).toHaveBeenCalled();
  // });
});
