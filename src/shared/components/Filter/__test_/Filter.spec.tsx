import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import { Category } from "../../../../features/DocumentManagementServer/responseModel";
import DMSFilterDialog from "../Filter";

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
        data-testid={dataTestId}
        onClick={() => onSelectMultiple(null, [{ data: "send", text: "Send" }])}
      >
        Mock Dropdown
      </button>
    )
  };
});

const renderComponent = (props = {}) =>
  render(<DMSFilterDialog {...defaultProps} {...props} />);

const setDateInput = (container: HTMLElement, day: string, month: string, year: string) => {
  fireEvent.change(container.querySelector('input[aria-label="Day"]')!, { target: { value: day } });
  fireEvent.change(container.querySelector('input[aria-label="Month"]')!, { target: { value: month } });
  fireEvent.change(container.querySelector('input[aria-label="Year"]')!, { target: { value: year } });
};

describe("DMSFilterDialog", () => {
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
});
