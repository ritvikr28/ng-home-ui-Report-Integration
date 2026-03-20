import React from "react";
import { render, screen } from "@testing-library/react";
import { EllipsisWithTooltip } from "../components/EllipsisWithTooltip";
import { useIsEllipsed } from "../hooks/useIsEllipsed";

// Mock the useIsEllipsed hook
jest.mock("../hooks/useIsEllipsed");
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
  Tag: ({ text }: any) => <span data-testid="tag">{text}</span>
}));

const mockEllipsed: (value: boolean) => void = (value: boolean) => {
  mockUseIsEllipsed.mockReturnValue({
    ref: { current: document.createElement("span") },
    isEllipsed: value
  });
};

describe("EllipsisWithTooltip Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const baseText: { name: string; referenceExternalId: string } = { name: "Benjamin Doe", referenceExternalId: "123" };


  it("renders staff link correctly", () => {
    mockEllipsed(true);
    const text: { name: string; referenceExternalId: string; type: string; staffCode: string } = { ...baseText, type: "staff", staffCode: "A1" };

    render(
      <EllipsisWithTooltip
        text={text}
        className=""
        isTooltipNeeded={true}
        totalItems={[text]}
        colName="relatedTo"
      />
    );

    const link: HTMLElement = screen.getByRole("link", { name: /Benjamin Doe/i });
    expect(link).toHaveAttribute("href", "/staff/profile/123");
    expect(screen.getByTestId("tooltip")).toBeInTheDocument();
  });

  it("covers text?.type null branch — text is null with colName=relatedTo", () => {
    mockEllipsed(false);
    render(
      <EllipsisWithTooltip
        text={null}
        className=""
        isTooltipNeeded={false}
        totalItems={[]}
        colName="relatedTo"
      />
    );
    // text?.type → undefined → no link rendered, no crash
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("covers text?.type undefined branch — text is undefined with colName=relatedTo", () => {
    mockEllipsed(false);
    render(
      <EllipsisWithTooltip
        text={undefined}
        className=""
        isTooltipNeeded={false}
        totalItems={[]}
        colName="relatedTo"
      />
    );
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("covers text?.isLeaver, text?.year, text?.reg null branches — pupil with no leaver/year/reg", () => {
    mockEllipsed(false);
    const text: any = { name: "Sam Smith", referenceExternalId: "456", type: "pupil" };
    // isLeaver, year, reg are all undefined → text?.isLeaver, text?.year, text?.reg all short-circuit
    render(
      <EllipsisWithTooltip
        text={text}
        className=""
        isTooltipNeeded={false}
        totalItems={[text]}
        colName="relatedTo"
      />
    );
    expect(screen.getByRole("link")).toBeInTheDocument();
    // yearRegTag is "" → Tag not rendered
    expect(screen.queryByTestId("name")).not.toBeInTheDocument();
  });





  it("covers text?.referenceExternalId null branch — referenceExternalId is undefined → href='/'", () => {
    mockEllipsed(false);
    const text: any = { name: "No Id", type: "staff" }; // referenceExternalId missing
    render(
      <EllipsisWithTooltip
        text={text}
        className=""
        isTooltipNeeded={false}
        totalItems={[text]}
        colName="relatedTo"
      />
    );
    const link: HTMLElement = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/");
  });
});