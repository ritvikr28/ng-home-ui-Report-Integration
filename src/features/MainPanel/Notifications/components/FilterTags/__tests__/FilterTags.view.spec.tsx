import { render, screen, fireEvent } from "@testing-library/react";
import * as UIKit from "@essnextgen/ui-kit";
import FilterTags from "../FilterTags.view";

jest.mock("@essnextgen/ui-kit", () => ({
    Tag: jest.fn(({ id, text, color, size }: any) => (
        <div data-testid={`tag-${id}`} data-color={color} data-size={size}>
            {text}
        </div>
    )),
    TagColor: {
        Neutral: "neutral",
        Success: "success",
        Outstanding: "outstanding",
    },
    TagSize: {
        Small: "small",
        Medium: "medium",
        Large: "large",
    },
}));

describe("FilterTags", () => {
    const mockOnRemove = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("when tags array is empty", () => {
        it("should return null", () => {
            const { container } = render(<FilterTags tags={[]} onRemove={mockOnRemove} />);
            expect(container.firstChild).toBeNull();
        });
    });

    describe("when tags array has items", () => {
        const mockTags = [
            {
                id: "tag-1",
                label: "Status: Active",
                type: "status" as const,
            },
            {
                id: "tag-2",
                label: "Priority: High",
                type: "priority" as const,
            },
            {
                id: "tag-3",
                label: "Date: Today",
                type: "date" as const,
            }
        ];

        it("should render the filter tags container", () => {
            render(<FilterTags tags={mockTags} onRemove={mockOnRemove} />);
            expect(screen.getByTestId("filter-tags-container")).toBeInTheDocument();
        });

        it("should render all tags", () => {
            render(<FilterTags tags={mockTags} onRemove={mockOnRemove} />);
            expect(screen.getByTestId("tag-tag-1")).toBeInTheDocument();
            expect(screen.getByTestId("tag-tag-2")).toBeInTheDocument();
            expect(screen.getByTestId("tag-tag-3")).toBeInTheDocument();
        });

        it("should render tags with correct text", () => {
            render(<FilterTags tags={mockTags} onRemove={mockOnRemove} />);
            expect(screen.getByText("Status: Active")).toBeInTheDocument();
            expect(screen.getByText("Priority: High")).toBeInTheDocument();
            expect(screen.getByText("Date: Today")).toBeInTheDocument();
        });

        it("should pass correct props to Tag component", () => {
            render(<FilterTags tags={mockTags} onRemove={mockOnRemove} />);
            
            const tagComponent = UIKit.Tag as unknown as jest.Mock;
            expect(tagComponent).toHaveBeenCalledTimes(3);
            
            expect(tagComponent).toHaveBeenNthCalledWith(
                1,
                expect.objectContaining({
                    id: "tag-1",
                    text: "Status: Active",
                    color: "neutral",
                    size: "small",
                }),
                {}
            );

            expect(tagComponent).toHaveBeenNthCalledWith(
                2,
                expect.objectContaining({
                    id: "tag-2",
                    text: "Priority: High",
                    color: "neutral",
                    size: "small",
                }),
                {}
            );

            expect(tagComponent).toHaveBeenNthCalledWith(
                3,
                expect.objectContaining({
                    id: "tag-3",
                    text: "Date: Today",
                    color: "neutral",
                    size: "small",
                }),
                {}
            );
        });

        it("should render close button for each tag", () => {
            render(<FilterTags tags={mockTags} onRemove={mockOnRemove} />);
            expect(screen.getByTestId("remove-filter-tag-1")).toBeInTheDocument();
            expect(screen.getByTestId("remove-filter-tag-2")).toBeInTheDocument();
            expect(screen.getByTestId("remove-filter-tag-3")).toBeInTheDocument();
        });

        it("should render close button with correct aria-label", () => {
            render(<FilterTags tags={mockTags} onRemove={mockOnRemove} />);
            expect(screen.getByLabelText("Remove Status: Active filter")).toBeInTheDocument();
            expect(screen.getByLabelText("Remove Priority: High filter")).toBeInTheDocument();
            expect(screen.getByLabelText("Remove Date: Today filter")).toBeInTheDocument();
        });

        it("should render close button with × symbol", () => {
            render(<FilterTags tags={mockTags} onRemove={mockOnRemove} />);
            const closeButtons = screen.getAllByText("×");
            expect(closeButtons).toHaveLength(3);
        });

        it("should call onRemove with correct type when status tag close button is clicked", () => {
            render(<FilterTags tags={mockTags} onRemove={mockOnRemove} />);
            const closeButton = screen.getByTestId("remove-filter-tag-1");
            fireEvent.click(closeButton);
            expect(mockOnRemove).toHaveBeenCalledTimes(1);
            expect(mockOnRemove).toHaveBeenCalledWith("status");
        });

        it("should call onRemove with correct type when priority tag close button is clicked", () => {
            render(<FilterTags tags={mockTags} onRemove={mockOnRemove} />);
            const closeButton = screen.getByTestId("remove-filter-tag-2");
            fireEvent.click(closeButton);
            expect(mockOnRemove).toHaveBeenCalledTimes(1);
            expect(mockOnRemove).toHaveBeenCalledWith("priority");
        });

        it("should call onRemove with correct type when date tag close button is clicked", () => {
            render(<FilterTags tags={mockTags} onRemove={mockOnRemove} />);
            const closeButton = screen.getByTestId("remove-filter-tag-3");
            fireEvent.click(closeButton);
            expect(mockOnRemove).toHaveBeenCalledTimes(1);
            expect(mockOnRemove).toHaveBeenCalledWith("date");
        });

        it("should call onRemove multiple times when multiple close buttons are clicked", () => {
            render(<FilterTags tags={mockTags} onRemove={mockOnRemove} />);
            
            fireEvent.click(screen.getByTestId("remove-filter-tag-1"));
            expect(mockOnRemove).toHaveBeenCalledWith("status");
            
            fireEvent.click(screen.getByTestId("remove-filter-tag-2"));
            expect(mockOnRemove).toHaveBeenCalledWith("priority");
            
            fireEvent.click(screen.getByTestId("remove-filter-tag-3"));
            expect(mockOnRemove).toHaveBeenCalledWith("date");
            
            expect(mockOnRemove).toHaveBeenCalledTimes(3);
        });

        it("should render tags in correct wrapper structure", () => {
            const { container } = render(<FilterTags tags={mockTags} onRemove={mockOnRemove} />);
            const filterTagsContainer = screen.getByTestId("filter-tags-container");
            expect(filterTagsContainer).toBeInTheDocument();
            
            const tagWrappers = container.querySelectorAll(".filter-tag-wrapper");
            expect(tagWrappers).toHaveLength(3);
        });

        it("should render single tag correctly", () => {
            const singleTag = [mockTags[0]];
            render(<FilterTags tags={singleTag} onRemove={mockOnRemove} />);
            
            expect(screen.getByTestId("filter-tags-container")).toBeInTheDocument();
            expect(screen.getByTestId("tag-tag-1")).toBeInTheDocument();
            expect(screen.getByTestId("remove-filter-tag-1")).toBeInTheDocument();
            expect(screen.queryByTestId("tag-tag-2")).not.toBeInTheDocument();
        });
    });
});

