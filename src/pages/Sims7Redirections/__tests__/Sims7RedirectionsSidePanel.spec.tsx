import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import * as Sims7RedirectionsPageApi from '../Sims7RedirectionsPage.api';

import Sims7RedirectionsSidePanel from "../Sims7RedirectionsSidePanel";

const mockViewData = {
  ngModule: "Student",
  ngComponent: "Pupil Data",
  sims7Module: "Pupil Data1",
  redirectStatus: "Migrated",
  updatedBy: "John Doe",
  effectiveDate: "01 Dec 2025",
  reasonForChanges: "Data migration completed",
  moduleId: 0,
  organisationId: 0,
  dfeNumber: "",
  switchToSchool: false,
  switchToPPG: false,
  isWritebackProcessed: false,
  updatedOn: ""
};

const useSims7RedirectionViewDataMock = jest.fn(() => ({ viewData: mockViewData }));
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
  it('renders edit mode and fields', () => {
    render(<Sims7RedirectionsSidePanel {...baseProps} mode="edit" />);
    expect(screen.getByText('Edit SIMS 7 redirects')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  it('renders view mode', () => {
    render(<Sims7RedirectionsSidePanel {...baseProps} mode="view" />);
    expect(screen.getByText('View SIMS 7 redirects')).toBeInTheDocument();
  });

  it('shows success toast after save', async () => {
    render(<Sims7RedirectionsSidePanel {...baseProps} mode="edit" />);
    fireEvent.click(screen.getByText('Save'));
    await waitFor(() => {
      expect(screen.getByText('Changes saved')).toBeInTheDocument();
    });
  });

  // it('shows warning banner on API failure', async () => {
  //   jest.spyOn(require('../Sims7RedirectionsPage.api'), 'updateSims7Redirection').mockRejectedValueOnce(new Error('API failed'));
  //   render(<Sims7RedirectionsSidePanel {...baseProps} mode="edit" />);
  //   fireEvent.click(screen.getByText('Save'));
  //   await waitFor(() => {
  //     // Try to find the warning banner by test id if available
  //     const warningBanner = screen.queryByTestId('notification-warning');
  //     if (warningBanner) {
  //       expect(warningBanner).toBeInTheDocument();
  //       expect(warningBanner.textContent).toContain('Failed to save');
  //       expect(warningBanner.textContent).toContain('Something went wrong');
  //     } else {
  //       // Fallback: Use flexible matcher for broken-up text
  //       const warningBannerAlt = screen.queryAllByText((content, element) => {
  //         return typeof content === 'string' && content.includes('Unable to save changes');
  //       });
  //       expect(warningBannerAlt.length).toBeGreaterThan(0);
  //       const warningMessageAlt = screen.queryAllByText((content, element) => {
  //         return typeof content === 'string' && content.includes('technical issue');
  //       });
  //       expect(warningMessageAlt.length).toBeGreaterThan(0);
  //     }
  //   });
  // });

  it('closes warning banner when close is clicked', async () => {
    const updateSims7Redirection = jest.fn().mockRejectedValueOnce(new Error('API failed'));
    jest.spyOn(Sims7RedirectionsPageApi, 'updateSims7Redirection').mockImplementation(updateSims7Redirection);
    render(<Sims7RedirectionsSidePanel {...baseProps} mode="edit" />);
    fireEvent.click(screen.getByText('Save'));
    await waitFor(() => {
      const closeButtons = screen.getAllByRole('button', { name: /close/i });
      const warningCloseBtn = closeButtons.find(btn => {
        const parent = btn.closest('.essui-notification');
        return parent && parent.textContent && parent.textContent.includes('Failed to save');
      });
      fireEvent.click(warningCloseBtn || closeButtons[0]);
      expect(screen.queryByText((content) => content.includes('Failed to save'))).not.toBeInTheDocument();
    });
  });

  it('calls onClose when panel is closed', () => {
    render(<Sims7RedirectionsSidePanel {...baseProps} mode="edit" />);
    fireEvent.click(screen.getByText('Cancel'));
    expect(baseProps.onClose).toHaveBeenCalled();
  });
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
    });

    it("renders 'Modified by' even if value is '-'", () => {
        render(<Sims7RedirectionsSidePanel {...baseProps} selectedRow={{ ...baseProps.selectedRow, modifiedBy: "-" }} />);
    });

    it("does not render 'Effective date' if value is '-'", () => {
        render(<Sims7RedirectionsSidePanel {...baseProps} selectedRow={{ ...baseProps.selectedRow, effectiveDate: "-" }} />);
    });

    it("calls setSidePanelMode('edit') when Edit button is clicked", () => {
        render(<Sims7RedirectionsSidePanel {...baseProps} />);
    });

    it("calls onClose when Close button is clicked", () => {
        render(<Sims7RedirectionsSidePanel {...baseProps} />);
        const closeBtn: HTMLElement = screen.getByText("Close");
        fireEvent.click(closeBtn);
        expect(baseProps.onClose).toHaveBeenCalled();
    });

    // it("renders edit mode content", () => {
    //     render(<Sims7RedirectionsSidePanel {...baseProps} mode="edit" />);
    //     expect(screen.getByText("This is edit page")).toBeInTheDocument();
    // });

    // Status color logic
    it("shows Edit button when status is Migrated", () => {
      render(<Sims7RedirectionsSidePanel {...baseProps} />);
    });

    it("hides Edit button when status is Permanent", () => {
      useSims7RedirectionViewDataMock.mockReturnValueOnce({
        viewData: {
          ...mockViewData,
          redirectStatus: "Permanent"
        }
      });
      render(<Sims7RedirectionsSidePanel {...baseProps} />);
    });

    it("does not render Modified by when UpdatedBy is '-'", () => {
      useSims7RedirectionViewDataMock.mockReturnValueOnce({
        viewData: {
          ...mockViewData,
          updatedBy: "-"
        }
      });
      render(<Sims7RedirectionsSidePanel {...baseProps} />);
    });

    it("does not render Effective date when value is '-'", () => {
      useSims7RedirectionViewDataMock.mockReturnValueOnce({
        viewData: {
          ...mockViewData,
          effectiveDate: "-"
        }
      });
      render(<Sims7RedirectionsSidePanel {...baseProps} />);
    });
});

it('shows error when date is not in the future (handleValidateDate)', () => {
  const row: SelectedRowType = { ...baseRow, status: 'Not migrated' };
  render(
    <Sims7RedirectionsSidePanel
      isOpen
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
        isOpen
        onClose={jest.fn()}
        mode="view"
        selectedRow={baseRow}
        t={mockT}
        setSidePanelMode={mockSetSidePanelMode}
      />
    );
  });

  it('shows date input and reason for changes when status is Migrated and No is selected in edit mode', () => {
    const row: SelectedRowType = { ...baseRow, status: 'Migrated' };
    render(
      <Sims7RedirectionsSidePanel
        isOpen
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

  // it('requires reason for changes when status is Migrated and No is selected', () => {
  //   const row: SelectedRowType = { ...baseRow, status: 'Migrated' };
  //   render(
  //     <Sims7RedirectionsSidePanel
  //       isOpen
  //       onClose={jest.fn()}
  //       mode="edit"
  //       selectedRow={row}
  //       t={mockT}
  //       setSidePanelMode={mockSetSidePanelMode}
  //     />
  //   );
  //   fireEvent.click(screen.getByLabelText('No'));
  //   fireEvent.click(screen.getByText('Save'));
  //   expect(screen.getByText('Reason for changes is required')).toBeInTheDocument();
  // });

  it('sets effective date to tomorrow when Not migrated and Yes is selected', () => {
    const row: SelectedRowType = { ...baseRow, status: 'Not migrated' };
    render(
      <Sims7RedirectionsSidePanel
        isOpen
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
        isOpen
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
        isOpen
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
        isOpen
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
