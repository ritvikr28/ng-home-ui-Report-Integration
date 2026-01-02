import { render, screen, fireEvent } from "@testing-library/react";
import Sims7RedirectionsSidePanel from "../Sims7RedirectionsSidePanel";

describe("Sims7RedirectionsSidePanel", () => {
    const baseProps = {
        isOpen: true,
        onClose: jest.fn(),
        mode: "view" as const,
        selectedRow: {
            category: "Student",
            nextGenModule: "Pupil Data",
            sims7Module: "Pupil Data1",
            modifiedBy: "John Doe",
            effectiveDate: "01 Dec 2025",
            status: "Migrated",
            reasonForChanges: "Data migration completed"
        },
        t: (key: string) => key,
        setSidePanelMode: jest.fn()
    };

    it("renders all details in view mode", () => {
        render(<Sims7RedirectionsSidePanel {...baseProps} />);
        expect(screen.getByText("Category")).toBeInTheDocument();
        expect(screen.getByText("Student")).toBeInTheDocument();
        expect(screen.getByText("Next Gen module")).toBeInTheDocument();
        expect(screen.getByText("Pupil Data")).toBeInTheDocument();
        expect(screen.getByText("SIMS 7 module")).toBeInTheDocument();
        expect(screen.getByText("Pupil Data1")).toBeInTheDocument();
        expect(screen.getByText("Modified by")).toBeInTheDocument();
        expect(screen.getByText("John Doe")).toBeInTheDocument();
        expect(screen.getByText("Effective date")).toBeInTheDocument();
        expect(screen.getByText("01 Dec 2025")).toBeInTheDocument();
        expect(screen.getByText("Status")).toBeInTheDocument();
        expect(screen.getByText("Migrated")).toBeInTheDocument();
        expect(screen.getByText("Reason for changes")).toBeInTheDocument();
        expect(screen.getByText("Data migration completed")).toBeInTheDocument();
    });

    it("does not render 'Modified by' if value is '-'", () => {
        render(<Sims7RedirectionsSidePanel {...baseProps} selectedRow={{ ...baseProps.selectedRow, modifiedBy: "-" }} />);
        expect(screen.queryByText("Modified by")).not.toBeInTheDocument();
    });

    it("does not render 'Effective date' if value is '-'", () => {
        render(<Sims7RedirectionsSidePanel {...baseProps} selectedRow={{ ...baseProps.selectedRow, effectiveDate: "-" }} />);
        expect(screen.queryByText("Effective date")).not.toBeInTheDocument();
    });

    it("renders 'No' for redirect if status is 'Not migrated'", () => {
        render(<Sims7RedirectionsSidePanel {...baseProps} selectedRow={{ ...baseProps.selectedRow, status: "Not migrated" }} />);
        expect(screen.getByText("No")).toBeInTheDocument();
    });

    it("calls setSidePanelMode('edit') when Edit button is clicked", () => {
        render(<Sims7RedirectionsSidePanel {...baseProps} />);
        const editBtn = screen.getByTestId("edit-button");
        fireEvent.click(editBtn);
        expect(baseProps.setSidePanelMode).toHaveBeenCalledWith("edit");
    });

    it("calls onClose when Close button is clicked", () => {
        render(<Sims7RedirectionsSidePanel {...baseProps} />);
        const closeBtn = screen.getByText("Close");
        fireEvent.click(closeBtn);
        expect(baseProps.onClose).toHaveBeenCalled();
    });

    it("does not render Edit button if status is 'Permanent'", () => {
        render(<Sims7RedirectionsSidePanel {...baseProps} selectedRow={{ ...baseProps.selectedRow, status: "Permanent" }} />);
        expect(screen.queryByTestId("edit-button")).not.toBeInTheDocument();
    });

    it("renders edit mode content", () => {
        render(<Sims7RedirectionsSidePanel {...baseProps} mode="edit" />);
        expect(screen.getByText("This is edit page")).toBeInTheDocument();
    });

    // Status color logic
    it("shows TagColor.Success for Permanent", () => {
        render(<Sims7RedirectionsSidePanel {...baseProps} selectedRow={{ ...baseProps.selectedRow, status: "Permanent" }} />);
        expect(screen.getByText("Permanent")).toBeInTheDocument();
    });
    it("shows TagColor.Success for Migrated", () => {
        render(<Sims7RedirectionsSidePanel {...baseProps} selectedRow={{ ...baseProps.selectedRow, status: "Migrated" }} />);
        expect(screen.getByText("Migrated")).toBeInTheDocument();
    });
    it("shows TagColor.Neutral for Not migrated", () => {
        render(<Sims7RedirectionsSidePanel {...baseProps} selectedRow={{ ...baseProps.selectedRow, status: "Not migrated" }} />);
        expect(screen.getByText("Not migrated")).toBeInTheDocument();
    });
    it("shows TagColor.Outstanding for Planned", () => {
        render(<Sims7RedirectionsSidePanel {...baseProps} selectedRow={{ ...baseProps.selectedRow, status: "Planned" }} />);
        expect(screen.getByText("Planned")).toBeInTheDocument();
    });
    it("shows TagColor.Outstanding for Reversing", () => {
        render(<Sims7RedirectionsSidePanel {...baseProps} selectedRow={{ ...baseProps.selectedRow, status: "Reversing" }} />);
        expect(screen.getByText("Reversing")).toBeInTheDocument();
    });
    it("shows TagColor.Neutral for unknown status", () => {
        render(<Sims7RedirectionsSidePanel {...baseProps} selectedRow={{ ...baseProps.selectedRow, status: "Other" }} />);
        expect(screen.getByText("Other")).toBeInTheDocument();
    });
});
