import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DiscoverMoreView from "../DiscoverMore.view";
import gtmAnalytics from "../../../../../shared/utils/analytics";

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
    expect(discoverMoreButton).toHaveClass("base-class");
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
    const gtmAnalyticsPushSpy: jest.SpyInstance<void, [events: object]> =
      jest.spyOn(gtmAnalytics, "pushEvent");
    render(<DiscoverMoreView />);
    const discoverMoreButton = screen.getByTestId("btn-save");
    fireEvent.click(discoverMoreButton);
    await waitFor(() => {
      expect(window.location.href).toBe(
        "https://parentpaygroup.service-now.com/csm?id=kb_article_view&sysparm_article=KB0053661&sys_kb_id=dbda86741b46fd14455842a7b04bcb89&spa=1"
      );
      expect(gtmAnalyticsPushSpy).toHaveBeenCalledTimes(1);
      expect(gtmAnalyticsPushSpy).toHaveBeenCalledWith({
        event: "interact_click",
        elementType: "button",
        elementTextOrLabel: "Discover more with SIMS Next Gen",
        elementLocation: "Find out more about SIMS Next Gen section"
      });
    });
  });

  test("Fire GA events on click of 'What new", async () => {
    jest.clearAllMocks();
    const gtmAnalyticsPushSpy: jest.SpyInstance<void, [events: object]> =
      jest.spyOn(gtmAnalytics, "pushEvent");
    render(<DiscoverMoreView />);
    const whatsNewTile = screen.getByTestId("what-new-test-id");
    fireEvent.click(whatsNewTile);
    await waitFor(() => {
      expect(gtmAnalyticsPushSpy).toHaveBeenCalledTimes(1);
      expect(gtmAnalyticsPushSpy).toHaveBeenCalledWith({
        event: "interact_click",
        elementType: "tile",
        elementTextOrLabel: "What's new",
        elementLocation: "Find out more about SIMS Next Gen section"
      });
    });
  });

  test("Fire GA events on click of 'The SIMS Next Gen roadmap", async () => {
    jest.clearAllMocks();
    const gtmAnalyticsPushSpy: jest.SpyInstance<void, [events: object]> =
      jest.spyOn(gtmAnalytics, "pushEvent");
      const {getByTestId} = render(<DiscoverMoreView />);
    const discoverMoreButton = getByTestId("test-id");
    fireEvent.click(discoverMoreButton);
    await waitFor(() => {
      expect(gtmAnalyticsPushSpy).toHaveBeenCalledTimes(1);
      expect(gtmAnalyticsPushSpy).toHaveBeenCalledWith({
        event: "interact_click",
        elementType: "tile",
        elementTextOrLabel: "The SIMS Next Gen roadmap",
        elementLocation: "Find out more about SIMS Next Gen section"
      });
    });
  });
});



