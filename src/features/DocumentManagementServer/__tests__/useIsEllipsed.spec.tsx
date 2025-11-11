import React from "react";
import { render, screen } from "@testing-library/react";
import { EllipsisWithTooltip } from "../EllipsisWithTooltip";
import { useIsEllipsed } from "../useIsEllipsed";

// Mock the useIsEllipsed hook
jest.mock("../useIsEllipsed");
const mockUseIsEllipsed = useIsEllipsed as jest.Mock;

// Mock Tooltip and Tag from @essnextgen/ui-kit
jest.mock("@essnextgen/ui-kit", () => ({
  Tooltip: ({ children, content }: any) => (
    <div data-testid="tooltip">
      {children}
      {content && <div data-testid="tooltip-content">{content}</div>}
    </div>
  ),
  TooltipAlign: { Center: "center" },
  TooltipPosition: { Bottom: "bottom" },
  Tag: ({ text }: any) => <span data-testid="tag">{text}</span>,
}));

describe("EllipsisWithTooltip Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const baseText = { name: "John Doe", referenceExternalId: "123" };

  const mockEllipsed = (value: boolean) => {
    mockUseIsEllipsed.mockReturnValue({
      ref: { current: document.createElement("div") },
      isEllipsed: value,
    });
  };

  it("renders staff link correctly", () => {
    mockEllipsed(true);
    const text = { ...baseText, type: "staff", staffCode: "A1" };

    render(
      <EllipsisWithTooltip
        text={text}
        className=""
        isTooltipNeeded={true}
        totalItems={[text]}
      />
    );

    const link = screen.getByRole("link", { name: /John Doe/i });
    expect(link).toHaveAttribute("href", "/staff/profile/123");
    expect(screen.getByTestId("tooltip")).toBeInTheDocument();
  });

  it("renders pupil link and year/reg Tag correctly", () => {
    mockEllipsed(true);
    const text = { ...baseText, type: "pupil", year: "Year 6", reg: "6KH" };

    render(
      <EllipsisWithTooltip
        text={text}
        className=""
        isTooltipNeeded={true}
        totalItems={[text]}
      />
    );

    const link = screen.getByRole("link", { name: /John Doe/i });
    expect(link).toHaveAttribute("href", "/pupilprofile/profile/123");
    expect(screen.getByTestId("tag")).toHaveTextContent("Year 6 / 6KH");
  });

  it("renders default span when type is neither staff nor pupil", () => {
    mockEllipsed(false);
    const text = { ...baseText, type: "school" };

    render(
      <EllipsisWithTooltip
        text={text}
        className=""
        isTooltipNeeded={false}
        totalItems={[text]}
      />
    );

    const span = screen.getByText("John Doe");
    expect(span.tagName).toBe("SPAN");
  });

  it("renders +count Tooltip when multiple totalItems are passed", () => {
    mockEllipsed(true);
    const text = { ...baseText, type: "pupil" };
    const totalItems = [
      { name: "John", type: "pupil", year: "Year 6" },
      { name: "Ben", type: "pupil", year: "Year 7" },
      { name: "Emma", type: "pupil", year: "Year 8" }
    ];

    render(
      <EllipsisWithTooltip
        text={text}
        totalItems={totalItems}
        className=""
        isTooltipNeeded={true}
      />
    );

    expect(screen.getByText("+2")).toBeInTheDocument();
    expect(screen.getByText("Ben | Year 7")).toBeInTheDocument();
    expect(screen.getByText("Emma | Year 8")).toBeInTheDocument();
  });

  it("renders no +count Tooltip when only one item in totalItems", () => {
    mockEllipsed(false);
    const text = { ...baseText, type: "pupil" };

    render(
      <EllipsisWithTooltip
        text={text}
        totalItems={[text]}
        className=""
        isTooltipNeeded={false}
      />
    );
    expect(screen.queryByText(/^\+\d/)).not.toBeInTheDocument();
  });
});
