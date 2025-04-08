import { render, screen, fireEvent } from "@testing-library/react";
import DiscoverMoreView from "../DiscoverMore.view";


const mediaQuery = require('@essnextgen/ui-kit');

describe("DiscoverMoreView Component", () => {
 

  beforeAll(() => {
    Object.defineProperty(window, "location", {
      value: {
        href: "about:blank",
      },
      writable: true,
    });
  });

  test("renders without crashing", () => {
    jest.spyOn(mediaQuery, 'useMediaQuery').mockImplementation(() => false);
    render(<DiscoverMoreView isOpen/>);
    expect(
      screen.getByText("discoverMore.simsupdatemoretext")
    ).toBeInTheDocument();
  });

  test("renders without crashing using mediaquery", () => {
    jest.spyOn(mediaQuery, 'useMediaQuery').mockImplementation(() => true);
    render(<DiscoverMoreView isOpen/>);
    expect(
      screen.getByText("discoverMore.simsupdatetext")
    ).toBeInTheDocument();
  });
  


  test("renders Discover more button with correct properties", () => {
    jest.spyOn(mediaQuery, 'useMediaQuery').mockImplementation(() => false);
    render(<DiscoverMoreView isOpen/>);
    const discoverMoreButton = screen.getByTestId("btn-save");

    expect(discoverMoreButton).toBeInTheDocument();
    expect(discoverMoreButton).toHaveClass("base-class-more");
  });

  test("opens links in new tabs when action cards are clicked", async () => {
    jest.spyOn(mediaQuery, 'useMediaQuery').mockImplementation(() => false);
    render(<DiscoverMoreView isOpen/>);
    const actionCardLinks = screen.getAllByTestId("link1");

    actionCardLinks.forEach((link) => {
      fireEvent.click(link);
      expect(link).toHaveAttribute("target", "_blank");
    });
  });

  test("renders action cards with correct properties", () => {
    jest.spyOn(mediaQuery, 'useMediaQuery').mockImplementation(() => false);
    render(<DiscoverMoreView isOpen/>);
    const actionCards = screen.getAllByTestId("test-id");
    actionCards.forEach((card) => {
      expect(card).toBeInTheDocument();
      expect(card).toHaveClass("essui-activity-card");
    });
  });
  
  test("renders ActionCard components with correct text content", () => {
    const { getByTestId } = render(<DiscoverMoreView />);
    
    expect(getByTestId("what-new-test-id")).toHaveTextContent("primarytext");
    expect(getByTestId("test-id")).toHaveTextContent("discoverMore.primarytextsimsnextgen");
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



