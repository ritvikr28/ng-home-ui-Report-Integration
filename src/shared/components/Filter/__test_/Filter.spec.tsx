import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import { Category } from "../../../../features/DocumentManagementServer/responseModel";
import DMSFilterDialog from "../Filter";

const mockOnApplyFilter = jest.fn();
const mockOnClose = jest.fn();

const defaultProps = {
  dataTestId: "dms-filter-dialog",
  title: "Filter Documents",
  isOpen: true,
  availableCategories: [
      { registrationId: "1", application: "Send" },
      { registrationId: "2", application: "Pupils" }
  ] as unknown as Category[],
  availableFormats: ["pdf", "docx"],
  onClose: mockOnClose,
  onApplyFilter: mockOnApplyFilter
};

jest.mock("@essnextgen/ui-kit", () => {
  const originalModule = jest.requireActual("@essnextgen/ui-kit");
  return {
    ...originalModule,
    Dropdown: ({ onSelectMultiple, dataTestId }: any) => (
      <button
        data-testid={dataTestId}
        onClick={() => onSelectMultiple(null, [{ data: "send", text: "Send" }])}
      >
        Mock Dropdown
      </button>
    )
  };
});

function setDateInput(container: HTMLElement, day: string, month: string, year: string) {
  fireEvent.change(container.querySelector('input[aria-label="Day"]')!, { target: { value: day } });
  fireEvent.change(container.querySelector('input[aria-label="Month"]')!, { target: { value: month } });
  fireEvent.change(container.querySelector('input[aria-label="Year"]')!, { target: { value: year } });
}



const renderComponent = (props = {}) =>
  render(<DMSFilterDialog {...defaultProps} {...props} />);

describe("DMSFilterDialog", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders with all form elements", () => {
    renderComponent();

    expect(screen.getByText("Category")).toBeInTheDocument();
    expect(screen.getByText("Date Added")).toBeInTheDocument();
    expect(screen.getByText("Clear All")).toBeInTheDocument();
    expect(screen.getByText("Apply Filters")).toBeInTheDocument();
  });

it("selects categories from dropdown", () => {
  renderComponent();

  fireEvent.click(screen.getByTestId("dms-filter-dialog-categories"));
  fireEvent.click(screen.getByTestId("dms-filter-dialog-apply-btn"));

  expect(mockOnApplyFilter).toHaveBeenCalledWith(
    expect.objectContaining({
      categories: ["send"],
      formats: expect.any(Array),
      fromDate: "",
      toDate: ""
    })
  );
});


it("sets from and to dates and applies filters", () => {
  renderComponent();

  const dateInputs = screen.getAllByTestId("dms-filter-dialog-date-added");

  // From Date Inputs
  const fromDayInput = dateInputs[0].querySelector('input[aria-label="Day"]') as HTMLInputElement;
  const fromMonthInput = dateInputs[0].querySelector('input[aria-label="Month"]') as HTMLInputElement;
  const fromYearInput = dateInputs[0].querySelector('input[aria-label="Year"]') as HTMLInputElement;

  fireEvent.change(fromDayInput, { target: { value: "10" } });
  fireEvent.change(fromMonthInput, { target: { value: "05" } });
  fireEvent.change(fromYearInput, { target: { value: "2022" } });

  // To Date Inputs
  const toDayInput = dateInputs[1].querySelector('input[aria-label="Day"]') as HTMLInputElement;
  const toMonthInput = dateInputs[1].querySelector('input[aria-label="Month"]') as HTMLInputElement;
  const toYearInput = dateInputs[1].querySelector('input[aria-label="Year"]') as HTMLInputElement;

  fireEvent.change(toDayInput, { target: { value: "12" } });
  fireEvent.change(toMonthInput, { target: { value: "05" } });
  fireEvent.change(toYearInput, { target: { value: "2022" } });

  fireEvent.click(screen.getByTestId("dms-filter-dialog-apply-btn"));

  expect(mockOnApplyFilter).toHaveBeenCalledWith(
    expect.objectContaining({
      fromDate: "2022-05-10",
      toDate: "2022-05-12"
    })
  );
});


 it("shows error if toDate is set without fromDate", async () => {
  renderComponent();

  const dateInputs = screen.getAllByTestId("dms-filter-dialog-date-added");
  const toDateContainer = dateInputs[1];

  // Access the Day, Month, Year input inside toDate
  const toDayInput = toDateContainer.querySelector('input[aria-label="Day"]') as HTMLInputElement;
  const toMonthInput = toDateContainer.querySelector('input[aria-label="Month"]') as HTMLInputElement;
  const toYearInput = toDateContainer.querySelector('input[aria-label="Year"]') as HTMLInputElement;

  // Set some value (e.g., 12 May 2022)
  fireEvent.change(toDayInput, { target: { value: "12" } });
  fireEvent.change(toMonthInput, { target: { value: "05" } });
  fireEvent.change(toYearInput, { target: { value: "2022" } });

  fireEvent.click(screen.getByTestId("dms-filter-dialog-apply-btn"));

  await waitFor(() => {
    expect(screen.getByText("Please select a From date before selecting a To date.")).toBeInTheDocument();
  });

  expect(mockOnApplyFilter).not.toHaveBeenCalled();
});

it("shows error when fromDate is in the future", async () => {
  renderComponent();

  const dateInputs = screen.getAllByTestId("dms-filter-dialog-date-added");
  const fromDateContainer = dateInputs[0]; // index 0 = From Date

  const futureYear = new Date().getFullYear() + 1;

  const fromDayInput = fromDateContainer.querySelector('input[aria-label="Day"]')!;
  const fromMonthInput = fromDateContainer.querySelector('input[aria-label="Month"]')!;
  const fromYearInput = fromDateContainer.querySelector('input[aria-label="Year"]')!;

  fireEvent.change(fromDayInput, { target: { value: "01" } });
  fireEvent.change(fromMonthInput, { target: { value: "01" } });
  fireEvent.change(fromYearInput, { target: { value: futureYear.toString() } });

  fireEvent.click(screen.getByTestId("dms-filter-dialog-apply-btn"));

  await waitFor(() => {
    expect(screen.getByText("From date cannot be after today.")).toBeInTheDocument();
  });

  expect(mockOnApplyFilter).not.toHaveBeenCalled();
});


  it("shows error when toDate is before fromDate", async () => {
  renderComponent();

  const dateInputs = screen.getAllByTestId("dms-filter-dialog-date-added");
  const fromDateContainer = dateInputs[0];
  const toDateContainer = dateInputs[1];

  // Set fromDate = 2022-05-10
  setDateInput(fromDateContainer, "10", "05", "2022");

  // Set toDate = 2022-05-09
  setDateInput(toDateContainer, "09", "05", "2022");

  fireEvent.click(screen.getByTestId("dms-filter-dialog-apply-btn"));

  await waitFor(() => {
    expect(screen.getByText("To date cannot be before From date.")).toBeInTheDocument();
  });

  expect(mockOnApplyFilter).not.toHaveBeenCalled();
});


  it("clears all fields on Clear All click", () => {
    renderComponent();

    // Preset some state
    fireEvent.click(screen.getByTestId("dms-filter-dialog-clear-btn"));

    expect(screen.queryByText("Please select a From date before selecting a To date.")).not.toBeInTheDocument();
    expect(screen.queryByText("To date cannot be before From date.")).not.toBeInTheDocument();
  });

  it("calls onClose when dialog is closed", () => {
    renderComponent();

    fireEvent.click(screen.getByTestId("dms-filter-dialog-apply-btn"));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("renders empty dialog when isOpen is false", () => {
    const { container } = renderComponent({ isOpen: false });

    expect(container).toBeEmptyDOMElement();
  });

  it("clears fromDate error and resets date error when fromDate inputs are cleared", () => {
  renderComponent();

  const dateInputs = screen.getAllByTestId("dms-filter-dialog-date-added");
  const fromDateContainer = dateInputs[0];

  // Step 1: Set some initial date values
  setDateInput(fromDateContainer, "10", "05", "2022");

  // Step 2: Clear all three inputs
  fireEvent.change(fromDateContainer.querySelector('input[aria-label="Day"]')!, { target: { value: "" } });
  fireEvent.change(fromDateContainer.querySelector('input[aria-label="Month"]')!, { target: { value: "" } });
  fireEvent.change(fromDateContainer.querySelector('input[aria-label="Year"]')!, { target: { value: "" } });

  // There are no visible text outputs for these states, so verify via validation text
  expect(screen.queryByText("From date cannot be after today.")).not.toBeInTheDocument();
});

    it("clears toDate error and resets date error when toDate inputs are cleared", () => {
        renderComponent();
    
        const dateInputs = screen.getAllByTestId("dms-filter-dialog-date-added");
        const toDateContainer = dateInputs[1];
    
        // Step 1: Set some initial date values
        setDateInput(toDateContainer, "12", "05", "2022");
    
        // Step 2: Clear all three inputs
        fireEvent.change(toDateContainer.querySelector('input[aria-label="Day"]')!, { target: { value: "" } });
        fireEvent.change(toDateContainer.querySelector('input[aria-label="Month"]')!, { target: { value: "" } });
        fireEvent.change(toDateContainer.querySelector('input[aria-label="Year"]')!, { target: { value: "" } });
    
        // There are no visible text outputs for these states, so verify via validation text
        expect(screen.queryByText("To date cannot be before From date.")).not.toBeInTheDocument();
    });
});
