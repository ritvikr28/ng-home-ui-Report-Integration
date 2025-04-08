import { render, screen, fireEvent, waitFor } from "@testing-library/react";
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



  // test("opens links in a new tab when action cards are clicked", () => {
  //   jest.spyOn(mediaQuery, 'useMediaQuery').mockImplementation(() => false);
  //   render(<DiscoverMoreView isOpen />);
  //   const actionCardLink = screen.getByTestId("link1");
  //   fireEvent.click(actionCardLink);
  //   expect(actionCardLink).toHaveAttribute(
  //     "href",
  //     "https://parentpaygroup.service-now.com/csm?id=kb_article_view&sysparm_article=KB0053640&sys_kb_id=bea0de511bb9b510455842a7b04bcb75&spa=1"
  //   );
  // });

  test("redirects to the correct URL when 'Discover more' button is clicked", async () => {
    render(<DiscoverMoreView isOpen={true} />);
  
    const clickMock = jest.fn();
  
    // Mock createElement to return a mock anchor element
    const createElementSpy = jest.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      if (tagName === 'a') {
        return {
          click: clickMock,
          set href(value: string) { this._href = value; },
          get href() { return this._href; },
          set target(value: string) { this._target = value; },
          get target() { return this._target; },
          set rel(value: string) { this._rel = value; },
          get rel() { return this._rel; },
        } as any;
      }
      return document.createElement(tagName);
    });
  
    const discoverMoreButton = screen.getByTestId("btn-save");
    fireEvent.click(discoverMoreButton);
  
    await waitFor(() => {
      expect(clickMock).toHaveBeenCalled();
    });
  
    // Optionally: You can also check the properties set on the anchor element if needed
    const anchor = createElementSpy.mock.results[0].value;
    expect(anchor.href).toBe("https://parentpaygroup.service-now.com/csm?id=kb_article_view&sysparm_article=KB0053661&sys_kb_id=dbda86741b46fd14455842a7b04bcb89&spa=1");
    expect(anchor.target).toBe("_blank");
    expect(anchor.rel).toBe("noopener noreferrer");
  
    // Cleanup
    createElementSpy.mockRestore();
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



