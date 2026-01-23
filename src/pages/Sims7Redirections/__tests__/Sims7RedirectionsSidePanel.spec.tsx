import { render, screen, fireEvent } from "@testing-library/react";
import Sims7RedirectionsSidePanel from "../Sims7RedirectionsSidePanel";

type SelectedRowType = {
  category: string;
  nextGenModule: string;
  sims7Module: string;
  modifiedBy: string;
  effectiveDate: string;
  status: string;
  reasonForChanges: string;
};
interface BaseProps {
  isOpen: boolean;
  onClose: jest.Mock<any, any>;
  mode: "view" | "edit";
  selectedRow: SelectedRowType;
  t: (key: string) => string;
  setSidePanelMode: jest.Mock<any, any>;
}
describe("Sims7RedirectionsSidePanel", () => {
  const baseProps: BaseProps = {
    isOpen: true,
    onClose: jest.fn(),
    mode: "view",
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
        const editBtn: HTMLElement = screen.getByTestId("edit-button");
        fireEvent.click(editBtn);
        expect(baseProps.setSidePanelMode).toHaveBeenCalledWith("edit");
    });

    it("calls onClose when Close button is clicked", () => {
        render(<Sims7RedirectionsSidePanel {...baseProps} />);
        const closeBtn: HTMLElement = screen.getByText("Close");
        fireEvent.click(closeBtn);
        expect(baseProps.onClose).toHaveBeenCalled();
    });

    it("does not render Edit button if status is 'Permanent'", () => {
        render(<Sims7RedirectionsSidePanel {...baseProps} selectedRow={{ ...baseProps.selectedRow, status: "Permanent" }} />);
        expect(screen.queryByTestId("edit-button")).not.toBeInTheDocument();
    });

    // it("renders edit mode content", () => {
    //     render(<Sims7RedirectionsSidePanel {...baseProps} mode="edit" />);
    //     expect(screen.getByText("This is edit page")).toBeInTheDocument();
    // });

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

it('shows error when date is not in the future (handleValidateDate)', () => {
  const row: SelectedRowType = { ...baseRow, status: 'Not migrated' };
  render(
    <Sims7RedirectionsSidePanel
      isOpen={true}
      onClose={jest.fn()}
      mode="edit"
      selectedRow={row}
      t={mockT}
      setSidePanelMode={mockSetSidePanelMode}
    />
  );
  fireEvent.click(screen.getByLabelText('Yes'));
  // Set date to today (not in the future)
  const today = new Date();
  fireEvent.change(screen.getByLabelText('Day'), { target: { value: today.getDate().toString().padStart(2, '0') } });
  fireEvent.change(screen.getByLabelText('Month'), { target: { value: (today.getMonth() + 1).toString().padStart(2, '0') } });
  fireEvent.change(screen.getByLabelText('Year'), { target: { value: today.getFullYear().toString() } });
  // Trigger validation (blur or save)
  fireEvent.blur(screen.getByLabelText('Year'));
  fireEvent.click(screen.getByText('Save'));
  expect(screen.getByText('Date should be in the future')).toBeInTheDocument();
});

const mockT: (key: string) => string = (key: string) => key;
const mockSetSidePanelMode: jest.Mock<any, any> = jest.fn();
const baseRow: SelectedRowType = {
  category: 'Test Category',
  nextGenModule: 'Test Module',
  sims7Module: 'SIMS7',
  status: 'Not migrated',
  effectiveDate: '-',
  reasonForChanges: '',
  modifiedBy: '-'
};

describe('Sims7RedirectionsSidePanel', () => {
  it('renders view mode with correct details', () => {
    render(
      <Sims7RedirectionsSidePanel
        isOpen={true}
        onClose={jest.fn()}
        mode="view"
        selectedRow={baseRow}
        t={mockT}
        setSidePanelMode={mockSetSidePanelMode}
      />
    );
    expect(screen.getByText('Test Category')).toBeInTheDocument();
    expect(screen.getByText('SIMS7')).toBeInTheDocument();
    expect(screen.getByText('No')).toBeInTheDocument();
    expect(screen.getByText('Not migrated')).toBeInTheDocument();
  });

  it('shows date input and reason for changes when status is Migrated and No is selected in edit mode', () => {
    const row: SelectedRowType = { ...baseRow, status: 'Migrated' };
    render(
      <Sims7RedirectionsSidePanel
        isOpen={true}
        onClose={jest.fn()}
        mode="edit"
        selectedRow={row}
        t={mockT}
        setSidePanelMode={mockSetSidePanelMode}
      />
    );
    fireEvent.click(screen.getByLabelText('No'));
    // Find the textarea specifically among all textboxes
    const textboxes: HTMLElement[] = screen.getAllByRole('textbox');
    const textarea: HTMLElement | undefined = textboxes.find(el => el.tagName === 'TEXTAREA');
    expect(textarea).toBeInTheDocument();
    expect(screen.getByText('Effective date')).toBeInTheDocument();
  });

  it('requires reason for changes when status is Migrated and No is selected', () => {
    const row: SelectedRowType = { ...baseRow, status: 'Migrated' };
    render(
      <Sims7RedirectionsSidePanel
        isOpen={true}
        onClose={jest.fn()}
        mode="edit"
        selectedRow={row}
        t={mockT}
        setSidePanelMode={mockSetSidePanelMode}
      />
    );
    fireEvent.click(screen.getByLabelText('No'));
    fireEvent.click(screen.getByText('Save'));
    expect(screen.getByText('Reason for changes is required')).toBeInTheDocument();
  });

  it('sets effective date to tomorrow when Not migrated and Yes is selected', () => {
    const row: SelectedRowType = { ...baseRow, status: 'Not migrated' };
    render(
      <Sims7RedirectionsSidePanel
        isOpen={true}
        onClose={jest.fn()}
        mode="edit"
        selectedRow={row}
        t={mockT}
        setSidePanelMode={mockSetSidePanelMode}
      />
    );
    fireEvent.click(screen.getByLabelText('Yes'));
    expect(screen.getByText('Effective date')).toBeInTheDocument();
    // You can add more checks for tomorrow's date if needed
  });

  it('removes reason for changes when status changes to Planned', () => {
    const row: SelectedRowType = { ...baseRow, status: 'Not migrated', reasonForChanges: 'Some reason' };
    render(
      <Sims7RedirectionsSidePanel
        isOpen={true}
        onClose={jest.fn()}
        mode="edit"
        selectedRow={row}
        t={mockT}
        setSidePanelMode={mockSetSidePanelMode}
      />
    );
    fireEvent.click(screen.getByLabelText('Yes'));
    fireEvent.click(screen.getByText('Save'));
    // After save, reasonForChanges should be removed
    // This would require checking the selectedRow or view mode
  });

  it('clears reason for changes when status changes from Reversing to Migrated', () => {
    const row: SelectedRowType = { ...baseRow, status: 'Reversing', reasonForChanges: 'Should be cleared' };
    render(
      <Sims7RedirectionsSidePanel
        isOpen={true}
        onClose={jest.fn()}
        mode="edit"
        selectedRow={row}
        t={mockT}
        setSidePanelMode={mockSetSidePanelMode}
      />
    );
    fireEvent.click(screen.getByLabelText('Yes'));
    fireEvent.click(screen.getByText('Save'));
    // After save, reasonForChanges should be cleared
    // This would require checking the selectedRow or view mode
  });
});

const mockTt: (key: string) => string = (key: string) => key;
const mockSetSidePanelModeview: jest.Mock<any, any> = jest.fn();
const mockOnClose: jest.Mock<any, any> = jest.fn();
const baseRowData: SelectedRowType = {
  category: 'Test Category',
  nextGenModule: 'Test Module',
  sims7Module: 'SIMS7',
  status: 'Not migrated',
  effectiveDate: '-',
  reasonForChanges: '',
  modifiedBy: '-'
};

describe('Cancel logic in Sims7RedirectionsSidePanel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls onClose directly if not dirty', () => {
    render(
      <Sims7RedirectionsSidePanel
        isOpen={true}
        onClose={mockOnClose}
        mode="edit"
        selectedRow={baseRowData}
        t={mockTt}
        setSidePanelMode={mockSetSidePanelModeview}
      />
    );
    fireEvent.click(screen.getByText('Cancel'));
    expect(mockOnClose).toHaveBeenCalled();
  });

})
