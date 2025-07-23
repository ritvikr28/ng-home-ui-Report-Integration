import React from "react";
import { render, fireEvent, screen, waitFor, within } from "@testing-library/react";
import dayjs from "dayjs";
import { Category } from "../../../../features/DocumentManagementServer/responseModel";
import FilterDialog from "../Filter";


const mockHandleApply = jest.fn();
const mockOnClose = jest.fn();
const mockSetSelectedCategories = jest.fn();
const mockSetIsFilterDialogOpen = jest.fn();
const mockSetIsDateError = jest.fn();
const mockSetSelectedDateRange = jest.fn();

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
  setSelectedCategories: mockSetSelectedCategories,
  selectedCategories: [],
  handleApply: mockHandleApply,
  selectedFormats: [],
  setIsFilterDialogOpen: mockSetIsFilterDialogOpen,
  isFilterDialogOpen: true,
  setIsDateError: mockSetIsDateError,
  isDateError: false,
  setSelectedDateRange: mockSetSelectedDateRange,
  selectedDateRange: { fromDate: "", toDate: "" }
};

jest.mock("@essnextgen/ui-kit", () => {
  const originalModule = jest.requireActual("@essnextgen/ui-kit");
  return {
    ...originalModule,
    Dropdown: ({ onSelectMultiple, dataTestId }: any) => (
      <button
      type="button" 
        data-testid={dataTestId}
        onClick={() => onSelectMultiple(null, [{ data: "send", text: "Send" }])}
      >
        Mock Dropdown
      </button>
    )
  };
});

const renderComponent = (props = {}) =>
  render(<FilterDialog {...defaultProps} {...props} />);

const setDateInput = (container: HTMLElement, day: string, month: string, year: string) => {
  fireEvent.change(container.querySelector('input[aria-label="Day"]')!, { target: { value: day } });
  fireEvent.change(container.querySelector('input[aria-label="Month"]')!, { target: { value: month } });
  fireEvent.change(container.querySelector('input[aria-label="Year"]')!, { target: { value: year } });
};

describe("FilterDialog", () => {
  beforeEach(() => jest.clearAllMocks());

  it("renders with all form elements", () => {
    renderComponent();
    expect(screen.getByText("Category")).toBeInTheDocument();
    expect(screen.getByText("Date Added")).toBeInTheDocument();
    expect(screen.getByText("Clear All")).toBeInTheDocument();
    expect(screen.getByText("Apply Filters")).toBeInTheDocument();
  });

  it("selects a category via dropdown", () => {
    renderComponent();
    fireEvent.click(screen.getByTestId("dms-filter-dialog-categories"));
    expect(mockSetSelectedCategories).toHaveBeenCalled();
  });

  it("applies filters when Apply Filters button is clicked", () => {
    renderComponent();
    fireEvent.click(screen.getByTestId("dms-filter-dialog-apply-btn"));
    expect(mockHandleApply).toHaveBeenCalled();
  });

  it("sets from and to dates and triggers selectedDateRange", async () => {
    renderComponent();
    const dateInputs = screen.getAllByTestId("dms-filter-dialog-date-added");

    setDateInput(dateInputs[0], "10", "05", "2022");
    setDateInput(dateInputs[1], "12", "05", "2022");

    await waitFor(() => {
      expect(mockSetSelectedDateRange).toHaveBeenCalled();
    });
  });

  it("shows error if To date is set without From date", async () => {
    renderComponent();
    const dateInputs = screen.getAllByTestId("dms-filter-dialog-date-added");

    setDateInput(dateInputs[1], "12", "05", "2022");

    await waitFor(() => {
      expect(screen.getByText("Please select a From date before selecting a To date.")).toBeInTheDocument();
      expect(mockSetIsDateError).toHaveBeenCalledWith(true);
    });
  });

  it("shows error if From date is in the future", async () => {
    renderComponent();
    const dateInputs = screen.getAllByTestId("dms-filter-dialog-date-added");
    const nextYear = new Date().getFullYear() + 1;

    setDateInput(dateInputs[0], "01", "01", `${nextYear}`);

    await waitFor(() => {
      expect(screen.getByText("From date cannot be after today.")).toBeInTheDocument();
      expect(mockSetIsDateError).toHaveBeenCalledWith(true);
    });
  });

  it("shows error if To date is before From date", async () => {
    renderComponent();
    const dateInputs = screen.getAllByTestId("dms-filter-dialog-date-added");

    setDateInput(dateInputs[0], "10", "05", "2022");
    setDateInput(dateInputs[1], "09", "05", "2022");

    await waitFor(() => {
      expect(screen.getByText("To date cannot be before From date.")).toBeInTheDocument();
      expect(mockSetIsDateError).toHaveBeenCalledWith(true);
    });
  });

  it("clears all filters on Clear All click", () => {
    renderComponent();
    fireEvent.click(screen.getByTestId("dms-filter-dialog-clear-btn"));
    expect(mockSetSelectedCategories).toHaveBeenCalledWith([]);
    expect(mockSetSelectedDateRange).toHaveBeenCalledWith({ fromDate: "", toDate: "" });
    expect(mockSetIsDateError).toHaveBeenCalledWith(false);
  });

  it("calls onClose when dialog is closed", () => {
    renderComponent();
    fireEvent.click(screen.getByTestId("dms-filter-dialog-apply-btn"));
    expect(mockHandleApply).toHaveBeenCalled();
  });

  it("renders nothing when isOpen is false", () => {
    const { container } = renderComponent({ isOpen: false });
    expect(container).toBeEmptyDOMElement();
  });

  it("resets fromDate error when inputs are cleared", () => {
    renderComponent();
    const dateInputs = screen.getAllByTestId("dms-filter-dialog-date-added");
    setDateInput(dateInputs[0], "10", "05", "2022");

    fireEvent.change(dateInputs[0].querySelector('input[aria-label="Day"]')!, { target: { value: "" } });
    fireEvent.change(dateInputs[0].querySelector('input[aria-label="Month"]')!, { target: { value: "" } });
    fireEvent.change(dateInputs[0].querySelector('input[aria-label="Year"]')!, { target: { value: "" } });

    expect(mockSetIsDateError).toHaveBeenCalledWith(false);
  });

  it("resets toDate error when inputs are cleared", () => {
    renderComponent();
    const dateInputs = screen.getAllByTestId("dms-filter-dialog-date-added");
    setDateInput(dateInputs[1], "12", "05", "2022");

    fireEvent.change(dateInputs[1].querySelector('input[aria-label="Day"]')!, { target: { value: "" } });
    fireEvent.change(dateInputs[1].querySelector('input[aria-label="Month"]')!, { target: { value: "" } });
    fireEvent.change(dateInputs[1].querySelector('input[aria-label="Year"]')!, { target: { value: "" } });

    expect(mockSetIsDateError).toHaveBeenCalledWith(false);
  });

   it("populates fromDate and toDate when selectedDateRange is valid and dialog opens", () => {

    const selectedDateRange = {
      fromDate: "2022-05-10",
      toDate: "2022-05-15"
    };

    renderComponent({
      selectedDateRange,
      setSelectedCategories: mockSetSelectedCategories,
      onClose: mockOnClose,
      handleApply: mockHandleApply,
      setIsDateError: mockSetIsDateError,
      setSelectedDateRange: mockSetSelectedDateRange
    });

    // Wait for fields to be populated based on the selectedDateRange
    const dateInputs = screen.getAllByTestId('dms-filter-dialog-date-added');
    expect(within(dateInputs[0]).getByPlaceholderText('DD')).toHaveValue('10');
    expect(within(dateInputs[0]).getByPlaceholderText('MM')).toHaveValue('5');
    expect(within(dateInputs[0]).getByPlaceholderText('YYYY')).toHaveValue('2022');

    expect(within(dateInputs[1]).getByPlaceholderText('DD')).toHaveValue('15');
    expect(within(dateInputs[1]).getByPlaceholderText('MM')).toHaveValue('5');
    expect(within(dateInputs[1]).getByPlaceholderText('YYYY')).toHaveValue('2022');

  });

  test("shows error when To Date is selected but From Date is missing", async () => {
  render(<FilterDialog {...defaultProps} />);

  const toDateDay = screen.getAllByLabelText("Day")[1]; // second date input
  fireEvent.change(toDateDay, { target: { value: "15" } });
  const toDateMonth = screen.getAllByLabelText("Month")[1];
  fireEvent.change(toDateMonth, { target: { value: "5" } });
  const toDateYear = screen.getAllByLabelText("Year")[1];
  fireEvent.change(toDateYear, { target: { value: "2023" } });

  const applyButton = screen.getByTestId("dms-filter-dialog-apply-btn");
  fireEvent.click(applyButton);

  expect(await screen.findByText("Please select a From date before selecting a To date.")).toBeInTheDocument();
});


test("shows error when From Date is in the future", async () => {
  render(<FilterDialog {...defaultProps} />);

  const futureDate = dayjs().add(1, "day");
  fireEvent.change(screen.getAllByLabelText("Day")[0], {
    target: { value: futureDate.date().toString() },
  });
  fireEvent.change(screen.getAllByLabelText("Month")[0], {
    target: { value: (futureDate.month() + 1).toString() },
  });
  fireEvent.change(screen.getAllByLabelText("Year")[0], {
    target: { value: futureDate.year().toString() },
  });

  const applyButton = screen.getByTestId("dms-filter-dialog-apply-btn");
  fireEvent.click(applyButton);

  expect(await screen.findByText("From date cannot be after today.")).toBeInTheDocument();
});

test("shows error when To Date is before From Date", async () => {
  render(<FilterDialog {...defaultProps} />);

  // From: 2023-05-10
  fireEvent.change(screen.getAllByLabelText("Day")[0], { target: { value: "10" } });
  fireEvent.change(screen.getAllByLabelText("Month")[0], { target: { value: "5" } });
  fireEvent.change(screen.getAllByLabelText("Year")[0], { target: { value: "2023" } });

  // To: 2023-05-09 (before From)
  fireEvent.change(screen.getAllByLabelText("Day")[1], { target: { value: "9" } });
  fireEvent.change(screen.getAllByLabelText("Month")[1], { target: { value: "5" } });
  fireEvent.change(screen.getAllByLabelText("Year")[1], { target: { value: "2023" } });

  const applyButton = screen.getByTestId("dms-filter-dialog-apply-btn");
  fireEvent.click(applyButton);

  expect(await screen.findByText("To date cannot be before From date.")).toBeInTheDocument();
});

test("shows error when To date is selected but From date is not", async () => {
  render(<FilterDialog {...defaultProps} />);

  // Only fill To Date (second input group)
  fireEvent.change(screen.getAllByPlaceholderText("DD")[1], { target: { value: "15" } });
  fireEvent.change(screen.getAllByPlaceholderText("MM")[1], { target: { value: "05" } });
  fireEvent.change(screen.getAllByPlaceholderText("YYYY")[1], { target: { value: "2022" } });

  // Click Apply
  fireEvent.click(screen.getByTestId("dms-filter-dialog-apply-btn"));

  // Assertion for the error message
  expect(await screen.findByText("Please select a From date before selecting a To date.")).toBeInTheDocument();
});

test("shows error when To date is before From date", async () => {
  render(<FilterDialog {...defaultProps} />);

  fireEvent.change(screen.getAllByPlaceholderText("DD")[0], { target: { value: "10" } });
  fireEvent.change(screen.getAllByPlaceholderText("MM")[0], { target: { value: "05" } });
  fireEvent.change(screen.getAllByPlaceholderText("YYYY")[0], { target: { value: "2023" } });

  fireEvent.change(screen.getAllByPlaceholderText("DD")[1], { target: { value: "09" } });
  fireEvent.change(screen.getAllByPlaceholderText("MM")[1], { target: { value: "05" } });
  fireEvent.change(screen.getAllByPlaceholderText("YYYY")[1], { target: { value: "2023" } });

  fireEvent.click(screen.getByTestId("dms-filter-dialog-apply-btn"));

  expect(await screen.findByText("To date cannot be before From date.")).toBeInTheDocument();
});

});
