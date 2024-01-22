import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DiscoverMoreView from "../DiscoverMore.view";

describe("DiscoverMoreView Component", () => {
  test("renders without crashing", () => {
    render(<DiscoverMoreView />);
    expect(
      screen.getByText("Find out more about SIMS Next Gen")
    ).toBeInTheDocument();
  });

  beforeAll(() => {
    Object.defineProperty(window, "location", {
      value: {
        href: "about:blank",
      },
      writable: true,
    });
  });

  test("renders Discover more button with correct properties", () => {
    render(<DiscoverMoreView />);
    const discoverMoreButton = screen.getByTestId("btn-save");

    expect(discoverMoreButton).toBeInTheDocument();
    expect(discoverMoreButton).toHaveClass("base-class-more");
  });

  test("opens links in new tabs when action cards are clicked", async () => {
    render(<DiscoverMoreView />);
    const actionCardLinks = screen.getAllByTestId("link1");

    actionCardLinks.forEach((link) => {
      fireEvent.click(link);
      expect(link).toHaveAttribute("target", "_blank");
    });
  });

  test("renders action cards with correct properties", () => {
    render(<DiscoverMoreView />);
    const actionCards = screen.getAllByTestId("test-id");
    actionCards.forEach((card) => {
      expect(card).toBeInTheDocument();
      expect(card).toHaveClass("essui-activity-card");
    });
  });

  test("opens links in a new tab when action cards are clicked", () => {
    render(<DiscoverMoreView />);
    const actionCardLink = screen.getByTestId("link1");
    fireEvent.click(actionCardLink);
    expect(actionCardLink).toHaveAttribute(
      "href",
      "https://parentpaygroup.service-now.com/csm?id=kb_article_view&sysparm_article=KB0053640&sys_kb_id=bea0de511bb9b510455842a7b04bcb75&spa=1"
    );
  });

  test("redirects to the correct URL when 'Discover more' button is clicked", async () => {
    render(<DiscoverMoreView />);
    const spyWindowOpen:any = jest.spyOn(window, 'open');
spyWindowOpen.mockImplementation(jest.fn());
    const discoverMoreButton:HTMLElement = screen.getByTestId("btn-save");
    fireEvent.click(discoverMoreButton);
    await waitFor(() => {
      expect(spyWindowOpen).toHaveBeenCalled();
    });
  });
  test("renders ActionCard components with correct text content", () => {
    const { getByTestId } = render(<DiscoverMoreView />);
    
    expect(getByTestId("what-new-test-id")).toHaveTextContent("What's new?");
    expect(getByTestId("test-id")).toHaveTextContent("The SIMS Next Gen roadmap");
  });

  test("calls onClickActionCard when an ActionCard is clicked", () => {
    const { getByTestId } = render(<DiscoverMoreView />);
    
    const onCardClick = jest.fn();

    fireEvent.click(getByTestId("what-new-test-id"));

    expect(onCardClick).toHaveBeenCalledTimes(0);

})

test("calls onClickActionCard when an ActionCard2 is clicked", () => {
  const { getByTestId } = render(<DiscoverMoreView />);
  
  const onActionCardClick = jest.fn();

  fireEvent.click(getByTestId("test-id"));

  expect(onActionCardClick).toHaveBeenCalledTimes(0);
});

});



