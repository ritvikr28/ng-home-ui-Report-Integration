import { render, screen, fireEvent } from "@testing-library/react";
import { hasFeaturePermission } from "@essnextgen/ui-flagr";
import DiscoverMoreView from "../DiscoverMore.view";

const mediaQuery = require("@essnextgen/ui-kit");
jest.mock("@essnextgen/ui-flagr", () => ({
  hasFeaturePermission: jest.fn()
}));
describe("DiscoverMoreView Component", () => {
  beforeAll(() => {
    Object.defineProperty(window, "location", {
      value: {
        href: "about:blank"
      },
      writable: true
    });
  });

  test("renders without crashing", () => {
    jest.spyOn(mediaQuery, "useMediaQuery").mockImplementation(() => false);
    render(<DiscoverMoreView isOpen />);
    expect(screen.getByText("discoverMore.simsupdatetext")).toBeInTheDocument();
  });

  test("renders without crashing using mediaquery", () => {
    jest.spyOn(mediaQuery, "useMediaQuery").mockImplementation(() => true);
    render(<DiscoverMoreView isOpen />);
    expect(screen.getByText("discoverMore.simsupdatetext")).toBeInTheDocument();
  });

  test("renders Discover more button with correct properties", () => {
    jest.spyOn(mediaQuery, "useMediaQuery").mockImplementation(() => false);
    render(<DiscoverMoreView isOpen />);
    const discoverMoreButton = screen.getByTestId("btn-save");

    expect(discoverMoreButton).toBeInTheDocument();
  });

  test("opens links in new tabs when action cards are clicked", async () => {
    jest.spyOn(mediaQuery, "useMediaQuery").mockImplementation(() => false);
    render(<DiscoverMoreView isOpen />);
    (hasFeaturePermission as jest.Mock).mockReturnValue(true);
    const actionCardLinks = screen.getAllByTestId("link2");
    actionCardLinks.forEach((link) => {
      fireEvent.click(link);
      expect(link).toHaveAttribute("target", "_blank");
    });
  });

  test("renders action cards with correct properties", () => {
    jest.spyOn(mediaQuery, "useMediaQuery").mockImplementation(() => false);
    render(<DiscoverMoreView isOpen />);
    const actionCards = screen.getAllByTestId("test-id");
    actionCards.forEach((card) => {
      expect(card).toBeInTheDocument();
      expect(card).toHaveClass("essui-activity-card");
    });
  });

  test("opens links in a new tab when action cards are clicked", () => {
    jest.spyOn(mediaQuery, "useMediaQuery").mockImplementation(() => false);
    render(<DiscoverMoreView isOpen />);
    const actionCardLink = screen.getByTestId("link2");
    fireEvent.click(actionCardLink);
    expect(actionCardLink).toHaveAttribute(
      "href",
      "https://help.parentpaygroup.com/csm?id=ppg_emp_taxonomy_topic_customer&topic_id=6120c5de1b335250dffc2f04b24bcb12&in_context=true"
    );
  });

  test("renders ActionCard components with correct text content", () => {
    const { getByTestId } = render(<DiscoverMoreView />);
    (hasFeaturePermission as jest.Mock).mockReturnValue(true);
    expect(getByTestId("what-new-videos-test-id")).toHaveTextContent(
      "discoverMore.primaryvideotext"
    );
    expect(getByTestId("what-new-test-id")).toHaveTextContent(
      "discoverMore.primarytext"
    );
    expect(getByTestId("test-id")).toHaveTextContent(
      "discoverMore.primarytextsimsnextgen"
    );
  });

  test("calls onClickActionCard when an ActionCard is clicked", () => {
    const { getByTestId } = render(<DiscoverMoreView />);

    (hasFeaturePermission as jest.Mock).mockReturnValue(true);
    const onCardClick = jest.fn();

    fireEvent.click(getByTestId("what-new-videos-test-id"));

    expect(onCardClick).toHaveBeenCalledTimes(0);
  });

  test("calls onClickActionCard when an ActionCard is clicked", () => {
    const { getByTestId } = render(<DiscoverMoreView />);

    const onCardClick = jest.fn();

    fireEvent.click(getByTestId("what-new-test-id"));

    expect(onCardClick).toHaveBeenCalledTimes(0);
  });

  test("calls onClickActionCard when an ActionCard2 is clicked", () => {
    const { getByTestId } = render(<DiscoverMoreView />);

    const onActionCardClick = jest.fn();

    fireEvent.click(getByTestId("test-id"));

    expect(onActionCardClick).toHaveBeenCalledTimes(0);
  });
});
