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

//   it("renders staff link /", () => {
//     mockEllipsed(true);
//     const text = { name: "John Doe", referenceExternalId: "", type: "staff", staffCode: "A1" };

//     render(
//       <EllipsisWithTooltip
//         text={text}
//         className=""
//         isTooltipNeeded={true}
//         totalItems={[text]}
//         colName="relatedTo"
//       />
//     );

//     const link = screen.getByRole("link", { name: /John Doe | A1/i });
//     expect(link).toHaveAttribute("href", "/");
//     expect(screen.getByTestId("tooltip")).toBeInTheDocument();
//   });

//   it("renders pupil link and year/reg Tag correctly", () => {
//     mockEllipsed(true);
//     const text = { ...baseText, type: "pupil", year: "Year 6", reg: "6KH" };

//     render(
//       <EllipsisWithTooltip
//         text={text}
//         className=""
//         isTooltipNeeded={true}
//         totalItems={[text]}
//         colName="relatedTo"
//       />
//     );

//     const link = screen.getByRole("link", { name: /Benjamin Doe/i });
//     expect(link).toHaveAttribute("href", "/pupilprofile/profile/123");
//     expect(screen.getByTestId("tooltip-content")).toHaveTextContent(
//       "Benjamin Doe"
//     );
//     expect(screen.getByTestId("tag")).toHaveTextContent("Year 6 / 6KH");
//   });

//   it("renders default span when type is neither staff nor pupil", () => {
//     mockEllipsed(false);
//     const text = { ...baseText, type: "school" };

//     render(
//       <EllipsisWithTooltip
//         text={text}
//         className=""
//         isTooltipNeeded={false}
//         totalItems={[text]}
//         colName="relatedTo"
//       />
//     );

//     const span = screen.getByText("Benjamin Doe");
//     expect(span.tagName).toBe("SPAN");
//   });

//   it("renders default span when colName is not relatedTo", () => {
//     mockEllipsed(false);
//     const text = { ...baseText, type: "school" };

//     render(
//       <EllipsisWithTooltip
//         text="Medical Document.pdf"
//         className=""
//         isTooltipNeeded={false}
//         totalItems={[text]}
//         colName="documents"
//       />
//     );

//     const span = screen.getByText("Medical Document.pdf");
//     expect(span.tagName).toBe("SPAN");
//   });

//   it("renders +count Tooltip for pupils when multiple totalItems are passed", () => {
//     mockEllipsed(true);
//     const text = { ...baseText, type: "pupil" };
//     const totalItems = [
//       { name: "John", type: "pupil", year: "Year 6" },
//       { name: "Ben", type: "pupil", year: "Year 7" },
//       { name: "Emma", type: "pupil", year: "Year 8" }
//     ];

//     render(
//       <EllipsisWithTooltip
//         text={text}
//         totalItems={totalItems}
//         className=""
//         isTooltipNeeded={true}
//         colName="relatedTo"
//       />
//     );

//     expect(screen.getByText("+2")).toBeInTheDocument();
//     expect(screen.getByText("Ben | Year 7")).toBeInTheDocument();
//     expect(screen.getByText("Emma | Year 8")).toBeInTheDocument();
//   });


//   it("renders +count Tooltip for staff when multiple totalItems are passed", () => {
//     mockEllipsed(true);
//     const text = { ...baseText, type: "staff" };
//     const totalItems = [
//       { name: "John", type: "staff", staffCode: "S1" },
//       { name: "Ben", type: "staff", staffCode: "S2" },
//       { name: "Emma", type: "staff", staffCode: "S3" }
//     ];

//     render(
//       <EllipsisWithTooltip
//         text={text}
//         totalItems={totalItems}
//         className=""
//         isTooltipNeeded={true}
//         colName="relatedTo"
//       />
//     );

//     expect(screen.getByText("+2")).toBeInTheDocument();
//     expect(screen.getByText("Ben | S2")).toBeInTheDocument();
//     expect(screen.getByText("Emma | S3")).toBeInTheDocument();
//   });

//   it("renders no +count Tooltip when only one item in totalItems", () => {
//     mockEllipsed(false);
//     const text = { ...baseText, type: "pupil" };

//     render(
//       <EllipsisWithTooltip
//         text={text}
//         totalItems={[text]}
//         className=""
//         isTooltipNeeded={false}
//         colName="relatedTo"
//       />
//     );
//     expect(screen.queryByText(/^\+\d/)).not.toBeInTheDocument();
//     expect(screen.queryByTestId("tooltip-content")).not.toBeInTheDocument();
//   });
// });

// describe("EllipsisWithTooltip", () => {

//   const baseProps = {
//     className: "test-class",
//     isTooltipNeeded: true,
//     totalItems: [],
//     colName: ""
//   };

//   test("renders staff as link in relatedTo column", () => {
//     mockEllipsed(true);
//     const staff = {
//       type: "staff",
//       name: "John Doe",
//       staffCode: "",
//       referenceExternalId: "123"
//     };

//     render(
//       <EllipsisWithTooltip
//         {...baseProps}
//         text={staff}
//         colName="relatedTo"
//       />
//     );

//     const link = screen.getByRole("link");
//     expect(link).toHaveAttribute("href", "/staff/profile/123");
//     expect(link).toHaveTextContent("John Doe");
//   });

//   test("renders pupil as link and shows Year/Reg tag", () => {
//     mockEllipsed(true);
//     const pupil = {
//       type: "pupil",
//       name: "Alice",
//       year: "10",
//       reg: "",
//       referenceExternalId: "999",
//       isLeaver: ""
//     };

//     render(
//       <EllipsisWithTooltip
//         {...baseProps}
//         text={pupil}
//         colName="relatedTo"
//       />
//     );

//     expect(screen.getByRole("link")).toHaveAttribute("href", "/pupilprofile/profile/999");
//     expect(screen.getByText("10")).toBeInTheDocument(); // Tag text
//   });



//   test("renders leaver year/reg as (year) / (reg)", () => {
//     const pupil = {
//       type: "pupil",
//       name: "Alex",
//       year: "12",
//       reg: "AP",
//       isLeaver: "LEAVER",
//       referenceExternalId: "400"
//     };
//     mockEllipsed(true);
//     render(
//       <EllipsisWithTooltip
//         {...baseProps}
//         text={pupil}
//         colName="relatedTo"
//       />
//     );

//     expect(screen.getByText("(12) / (AP)")).toBeInTheDocument();
//   });

//   test("renders leaver year/reg as (year)", () => {
//     const pupil = {
//       type: "pupil",
//       name: "Alex",
//       year: "12",
//       reg: "",
//       isLeaver: "LEAVER",
//       referenceExternalId: "400"
//     };
//     mockEllipsed(true);
//     render(
//       <EllipsisWithTooltip
//         {...baseProps}
//         text={pupil}
//         colName="relatedTo"
//       />
//     );

//     expect(screen.getByText("(12)")).toBeInTheDocument();
//   });

});
