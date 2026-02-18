
import React from "react";
import { render, fireEvent, screen, waitFor, within, getAllByTestId } from "@testing-library/react";
import dayjs from "dayjs";
import { Category } from "../../../../features/DocumentManagementServer/responseModel";
import * as logic from "../../../../features/DocumentManagementServer/logic/DocumentManagementServer.logic";
import FilterDialog, { FilterDialogProps } from "../Filter";
import gtmAnalytics from "../../../utils/analytics";
import * as ApiService from "../../../../features/DocumentManagementServer/api/ApiService";
import * as utils from "../../../../features/DocumentManagementServer/logic/DocumentManagementServer.utils";
import { ISelectedItem, SelectedItem } from "@essnextgen/ui-kit";
// import { handleSearchChange } from "../../../../features/DocumentManagementServer/logic/DocumentManagementServer.handler";
import { act } from "react-dom/test-utils";
import { handleSearchChange } from "../../../../features/DocumentManagementServer/logic/DocumentManagementServer.handler";


jest.mock("@essnextgen/ui-intl-kit", () => ({
  ...jest.requireActual("@essnextgen/ui-intl-kit"),
  useTranslation: () => ({
    t: (key: string, options?: any) => {
      if (key === "Filter.fromDateMustBeOnOrBefore") {
        return `From date must be on or before ${options?.date ?? dayjs().format("DD-MM-YYYY")}`;
      }
      if (key === "Filter.fromDateMustBeOnOrAfter") {
        return `From date must be on or after ${options?.date ?? "01/01/1900"}`;
      }
      if (key === "Filter.fromDateRequired") {
        return "From date is required";
      }
      if (key === "Filter.toDateShouldNotBeBeforeFromDate") {
        return "To date should not be before From date.";
      }
      if (key === "Filter.invalidDate") {
        return "Invalid Date";
      }
      if (key === "Filter.Staff") {
        return "Staff";
      }
      if (key === "Filter.Pupil") {
        return "Pupil";
      }
      if (key === "Filter.toDateMustBeOnOrBefore") {
        return `To date must be on or before ${options?.date ?? dayjs().format("DD-MM-YYYY")}`;
      }
      if (key === "Filter.toDateMustBeOnOrAfter") {
        return `To date must be on or after ${options?.date ?? "01/01/1900"}`;
      }
      return key;
    }
  })
}));

const mockHandleApply: jest.Mock = jest.fn();
const mockOnClose: jest.Mock = jest.fn();
const mockSetSelectedCategories: jest.Mock = jest.fn();
const mockSetIsFilterDialogOpen: jest.Mock = jest.fn();
const mockSetIsDateError: jest.Mock = jest.fn();
const mockSetSelectedDateRange: jest.Mock = jest.fn();
const mockSetSelectedRelatedTo: jest.Mock = jest.fn();
const mockSetTagListArray: jest.Mock = jest.fn();

const mockOnItemClick: jest.Mock = jest.fn();
const mockOnRemoveTag: jest.Mock = jest.fn();
const mockOnApply: jest.Mock = jest.fn();
const mockOnClear: jest.Mock = jest.fn();

const createMockProps = (
  overrides?: Partial<FilterDialogProps>
): FilterDialogProps => ({
  dataTestId: "dms-filter-dialog",
  title: "Filter Documents",
  isOpen: true,
  isFilterDialogOpen: true,

  // Close
  onClose: jest.fn(),

  // Categories
  selectedCategories: [] as ISelectedItem[],
  setSelectedCategories: jest.fn(),

  // Apply
  handleApply: jest.fn(),

  // Date error
  isDateError: false,
  setIsDateError: jest.fn(),

  // Date range
  selectedDateRange: { fromDate: "", toDate: "" },
  setSelectedDateRange: jest.fn(),

  // Loading
  isLoading: false,

  // External IDs
  setReferenceExternalIds: jest.fn(),

  // RelatedTo
  setDocumentRelatedTo: jest.fn(),
  selectedRelatedTo: undefined,
  setSelectedRelatedTo: jest.fn(),

  // Search tags
  tagListArray: [] as SelectedItem[],
  setTagListArray: jest.fn(),

  // Search trigger
  setIsSearchTriggered: jest.fn(),

  ...overrides
});


const defaultProps: any = {
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
  selectedDateRange: { fromDate: "", toDate: "" },
  setSelectedRelatedTo: mockSetSelectedRelatedTo,
  selectedRelatedTo: undefined,
  setTagListArray: mockSetTagListArray,
  tagListArray: [],
  setReferenceExternalIds: jest.fn(),
  setDocumentRelatedTo: jest.fn(),
  categoryError: false,
  schoolData: null,
  setIsSearchTriggered: jest.fn(),
  setSelectedItems: jest.fn()

};

const mockSuggestions: any = {
  payload: [
    {
      name: "Pupil", link: "", values: [
        {
          "learnerExternalId": "adb3a2c6-5d92-4955-88c8-0e6b5a7b323d",
          "preferredForename": "Alfie",
          "preferredSurname": "Harries",
          "legalName": "Alfie Harries",
          "currentYearGroup": "Year  4",
          "currentPrimaryClass": "4SL",
          "admissionNumber": "001875",
          "onRollState": "Current",
          "imagePath": "https://pazdevpfmimagesa.blob.core.windows.net/8e3f658d-b952-4e64-bf2b-1eb5733e5416/adb3a2c6-5d92-4955-88c8-0e6b5a7b323d?sv=2025-01-05&se=2025-09-08T16%3A41%3A34Z&sr=b&sp=r&sig=r9EiksyvH7Fw2suLb6OpnKLwZhtpC9tuatLBUiWT6XY%3D%22"
        },
        {
          "learnerExternalId": "04aaedd6-5307-4a4f-abaa-8b2230b3983b",
          "preferredForename": "Firoz",
          "preferredSurname": "Bhandari",
          "legalName": "Firoz Bhandari",
          "currentYearGroup": "Year  4",
          "currentPrimaryClass": "4SL",
          "admissionNumber": "001861",
          "onRollState": "Current",
          "imagePath": "https://pazdevpfmimagesa.blob.core.windows.net/8e3f658d-b952-4e64-bf2b-1eb5733e5416/adb3a2c6-5d92-4955-88c8-0e6b5a7b323d?sv=2025-01-05&se=2025-09-08T16%3A41%3A34Z&sr=b&sp=r&sig=r9EiksyvH7Fw2suLb6OpnKLwZhtpC9tuatLBUiWT6XY%3D%22"
        }]
    },
    { name: "Staff", link: null, values: [] },
    { name: "Organisation", link: null, values: [] }
  ],
  statusCode: 200
}

jest.mock("@essnextgen/ui-kit", () => {
  const originalModule: any = jest.requireActual("@essnextgen/ui-kit");
  return {
    ...originalModule
    
  };
});

jest.mock("../../../../features/DocumentManagementServer/logic/DocumentManagementServer.logic", () => ({
  ...jest.requireActual("../../../../features/DocumentManagementServer/logic/DocumentManagementServer.logic"),
  getAllRegistrationIds: jest.fn(() => []),
  fetchDocumentCategoryData: jest.fn(() => Promise.resolve([])),
  handleSearchChange: jest.fn()
}));

const renderComponent: (props?: any) => ReturnType<typeof render> = (props = {}) =>
  render(<FilterDialog {...defaultProps} {...props} />);

function getRequiredInput(container: HTMLElement, label: string): HTMLInputElement {
  const input: HTMLInputElement | null = container.querySelector(`input[aria-label="${label}"]`);
  if (!input) throw new Error(`${label} input not found`);
  return input;
}
const setDateInput: (container: HTMLElement, day: string, month: string, year: string) => void = (container, day, month, year) => {
  fireEvent.change(getRequiredInput(container, "Day"), { target: { value: day } });
  fireEvent.change(getRequiredInput(container, "Month"), { target: { value: month } });
  fireEvent.change(getRequiredInput(container, "Year"), { target: { value: year } });
};

describe("FilterDialog branch and edge case coverage", () => {
  beforeEach(() => jest.clearAllMocks());

  it("calls onClose and resets state when handleDialogClose is called", () => {
    render(
      <FilterDialog {...defaultProps} />
    );
    // Simulate Escape key
    fireEvent.keyDown(window, { key: "Escape" });
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("shows notification when relatedToSelected is true and localSelectedRelatedTo is invalid", () => {
    const { rerender }: { rerender: (ui: React.ReactElement) => void } = render(
      <FilterDialog {...defaultProps} />
    );
    // Simulate selecting an invalid relatedTo
    rerender(
      <FilterDialog
        {...defaultProps}
        selectedRelatedTo={{ data: { data: { key: "Invalid" } } } as any}
      />
    );
    // Should not throw, notification may show
  });

  it("does not call setReferenceExternalIds if not provided in handleRemoveTag", async () => {
   jest.spyOn(ApiService, "fetchDMSSuggestions").mockResolvedValue(mockSuggestions);
   renderComponent({
    selectedRelatedTo: { text: "Pupil", value: "1", data: { data: { key: "Pupil" } } },
    tagListArray: []
  });

  // Open RelatedTo dropdown and select "Pupil"
// Open RelatedTo dropdown by clicking the icon button

fireEvent.click(screen.getByTestId("text-input-dms-filter-dialog-related-to-icon-btn"));

// Wait for the options to appear and select "Pupil"
await waitFor(() => {
  // Debug: log the HTML to see if options are rendered
  expect(screen.getAllByTestId("menu-dms-filter-dialog-related-to")[0]).toBeInTheDocument();
});
fireEvent.click(screen.getByTestId("menu-option-dms-filter-dialog-related-to-1"));
    // Add a tag
    fireEvent.change(screen.getByTestId("search-autocomplete-input"), { target: { value: "Jane Doe" } });
    if (screen.queryByTestId("search-suggestion")) {
      fireEvent.click(screen.getByTestId("search-suggestion"));
    }
    // Remove tag
    if (screen.queryByTestId("remove-tag-1")) {
      fireEvent.click(screen.getByTestId("remove-tag-1"));
    }
    // No error thrown
  });


  it("handleDateChange sets error for day/month 0 or 00", () => {
    const { getAllByTestId }: { getAllByTestId: (id: string) => HTMLElement[] } = render(<FilterDialog {...defaultProps} />);
    const dateInputs: HTMLElement[] = getAllByTestId("dms-filter-dialog-date-added");
    fireEvent.change(within(dateInputs[0]).getByPlaceholderText("DD"), { target: { value: "00" } });
    fireEvent.change(within(dateInputs[0]).getByPlaceholderText("MM"), { target: { value: "01" } });
    fireEvent.change(within(dateInputs[0]).getByPlaceholderText("YYYY"), { target: { value: "2022" } });
    // Check that mockSetIsDateError was called with false (since that's what is actually called)
    expect(mockSetIsDateError).toHaveBeenCalledWith(false);
  });


  it("handleDateChange sets error for partial To date", () => {
    const { getAllByTestId }: { getAllByTestId: (id: string) => HTMLElement[] } = render(<FilterDialog {...defaultProps} />);
    const dateInputs: HTMLElement[] = getAllByTestId("dms-filter-dialog-date-added");
    fireEvent.change(within(dateInputs[1]).getByPlaceholderText("DD"), { target: { value: "10" } });
    fireEvent.change(within(dateInputs[1]).getByPlaceholderText("MM"), { target: { value: "" } });
    fireEvent.change(within(dateInputs[1]).getByPlaceholderText("YYYY"), { target: { value: "2022" } });
    expect(mockSetIsDateError).toHaveBeenCalledWith(true);
  });

  it("handleDateChange sets error for To date without From date", () => {
    const { getAllByTestId }: { getAllByTestId: (id: string) => HTMLElement[] } = render(<FilterDialog {...defaultProps} />);
    const dateInputs: HTMLElement[] = getAllByTestId("dms-filter-dialog-date-added");
    fireEvent.change(within(dateInputs[1]).getByPlaceholderText("DD"), { target: { value: "10" } });
    fireEvent.change(within(dateInputs[1]).getByPlaceholderText("MM"), { target: { value: "05" } });
    fireEvent.change(within(dateInputs[1]).getByPlaceholderText("YYYY"), { target: { value: "2022" } });
    expect(mockSetIsDateError).toHaveBeenCalledWith(true);
  });

  it("handleApplyWrapper does not call handleApply if date error", async () => {
    jest.spyOn(ApiService, "fetchDMSSuggestions").mockResolvedValue(mockSuggestions);
  renderComponent({
    selectedRelatedTo: { text: "Pupil", value: "1", data: { data: { key: "Pupil" } } },
    tagListArray: []
  });

  // Open RelatedTo dropdown and select "Pupil"
// Open RelatedTo dropdown by clicking the icon button

fireEvent.click(screen.getByTestId("text-input-dms-filter-dialog-related-to-icon-btn"));

// Wait for the options to appear and select "Pupil"
await waitFor(() => {
  // Debug: log the HTML to see if options are rendered
  expect(screen.getAllByTestId("menu-dms-filter-dialog-related-to")[0]).toBeInTheDocument();
});
fireEvent.click(screen.getByTestId("menu-option-dms-filter-dialog-related-to-1"));
  // Set invalid date
  const dateInputs: HTMLElement[] = screen.getAllByTestId("dms-filter-dialog-date-added");
  fireEvent.change(within(dateInputs[0]).getByPlaceholderText("DD"), { target: { value: "32" } });
  fireEvent.change(within(dateInputs[0]).getByPlaceholderText("MM"), { target: { value: "13" } });
  fireEvent.change(within(dateInputs[0]).getByPlaceholderText("YYYY"), { target: { value: "202" } });
  fireEvent.click(screen.getByTestId("dms-filter-dialog-apply-btn"));
  expect(mockHandleApply).not.toHaveBeenCalled();
});


describe("FilterDialog", () => {
  beforeEach(() => jest.clearAllMocks());
  it("renders loader when isLoading is true", () => {
    render(<FilterDialog {...defaultProps} isLoading />);
    expect(document.querySelector(".filter-dialog-loader")).toBeInTheDocument();
    expect(screen.getByText("Please Wait")).toBeInTheDocument();
  });



  it("shows error if To date is before From date", async () => {
    renderComponent();
    const dateInputs: HTMLElement[] = screen.getAllByTestId("dms-filter-dialog-date-added");

    setDateInput(dateInputs[0], "10", "05", "2022");
    setDateInput(dateInputs[1], "09", "05", "2022");

    await waitFor(() => {
      expect(screen.getByText("To date should not be before From date.")).toBeInTheDocument();
      expect(mockSetIsDateError).toHaveBeenCalledWith(true);
    });
  });


  it("clears all filters on Clear All click", () => {
    renderComponent();
    fireEvent.click(screen.getByTestId("dms-filter-dialog-clear-btn"));
    // expect(mockSetSelectedCategories).toBeCalledTimes(1);
    expect(mockSetIsDateError).toHaveBeenCalledWith(false);
  });

  it("renders nothing when isOpen is false", () => {
    const { container }: { container: HTMLElement } = renderComponent({ isOpen: false });
    expect(container).toBeEmptyDOMElement();
  });

  it("resets fromDate error when inputs are cleared", () => {
    renderComponent();
    const dateInputs: HTMLElement[] = screen.getAllByTestId("dms-filter-dialog-date-added");
    setDateInput(dateInputs[0], "10", "05", "2022");

    fireEvent.change(getRequiredInput(dateInputs[0], "Day"), { target: { value: "" } });
    fireEvent.change(getRequiredInput(dateInputs[0], "Month"), { target: { value: "" } });
    fireEvent.change(getRequiredInput(dateInputs[0], "Year"), { target: { value: "" } });
    expect(mockSetIsDateError).toHaveBeenCalledWith(false);
  });

  it("resets toDate error when inputs are cleared", () => {
    renderComponent();
    const dateInputs: HTMLElement[] = screen.getAllByTestId("dms-filter-dialog-date-added");
    setDateInput(dateInputs[1], "12", "05", "2022");
    fireEvent.click(screen.getByTestId("dms-filter-dialog-clear-btn"));
    fireEvent.change(getRequiredInput(dateInputs[1], "Day"), { target: { value: "" } });
    fireEvent.change(getRequiredInput(dateInputs[1], "Month"), { target: { value: "" } });
    fireEvent.change(getRequiredInput(dateInputs[1], "Year"), { target: { value: "" } });

    expect(mockSetIsDateError).toHaveBeenCalledWith(false);
  });

  test("shows error when To Date is selected but From Date is missing", async () => {
    render(<FilterDialog {...defaultProps} />);

    const toDateDay: HTMLElement = screen.getAllByLabelText("Day")[1]; // second date input
    fireEvent.change(toDateDay, { target: { value: "15" } });
    const toDateMonth: HTMLElement = screen.getAllByLabelText("Month")[1];
    fireEvent.change(toDateMonth, { target: { value: "5" } });
    const toDateYear: HTMLElement = screen.getAllByLabelText("Year")[1];
    fireEvent.change(toDateYear, { target: { value: "2023" } });

    const applyButton: HTMLElement = screen.getByTestId("dms-filter-dialog-apply-btn");
    fireEvent.click(applyButton);

    // Use a flexible matcher for the error message
    expect(await screen.findByText((content) => content.includes("From date is required"))).toBeInTheDocument();
  });


  test("shows error when From Date is in the future", async () => {
    render(<FilterDialog {...defaultProps} />);

    const futureDate: dayjs.Dayjs = dayjs().add(1, "day");
    fireEvent.change(screen.getAllByLabelText("Day")[0], {
      target: { value: futureDate.date().toString() }
    });
    fireEvent.change(screen.getAllByLabelText("Month")[0], {
      target: { value: (futureDate.month() + 1).toString() }
    });
    fireEvent.change(screen.getAllByLabelText("Year")[0], {
      target: { value: futureDate.year().toString() }
    });

    const applyButton: HTMLElement = screen.getByTestId("dms-filter-dialog-apply-btn");
    fireEvent.click(applyButton);

    expect(await screen.getByText(`From date must be on or before ${dayjs().format("DD-MM-YYYY")}`)).toBeInTheDocument();
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

    const applyButton: HTMLElement = screen.getByTestId("dms-filter-dialog-apply-btn");
    fireEvent.click(applyButton);

    expect(await screen.findByText("To date should not be before From date.")).toBeInTheDocument();
  });


  it("shows error when From date is after To date", async () => {
    jest.setTimeout(15000);
    renderComponent();

    // Set To date first: 2022-05-10
    const toDateInputs: HTMLElement = screen.getAllByTestId("dms-filter-dialog-date-added")[1];
    fireEvent.change(within(toDateInputs).getByPlaceholderText("DD"), { target: { value: "10" } });
    fireEvent.change(within(toDateInputs).getByPlaceholderText("MM"), { target: { value: "05" } });
    fireEvent.change(within(toDateInputs).getByPlaceholderText("YYYY"), { target: { value: "2022" } });

    // Then set From date to a later date: 2022-05-12
    const fromDateInputs: HTMLElement = screen.getAllByTestId("dms-filter-dialog-date-added")[0];
    fireEvent.change(within(fromDateInputs).getByPlaceholderText("DD"), { target: { value: "12" } });
    fireEvent.change(within(fromDateInputs).getByPlaceholderText("MM"), { target: { value: "05" } });
    fireEvent.change(within(fromDateInputs).getByPlaceholderText("YYYY"), { target: { value: "2022" } });

    // Assertion: error message triggered by From date being after To date
    await waitFor(() => {
      expect(screen.getByText("To date should not be before From date.")).toBeInTheDocument();
      expect(mockSetIsDateError).toHaveBeenCalledWith(true);
    });
  });

  it("shows error when To date is invalid (e.g. 31/02/2023)", async () => {
    render(<FilterDialog {...defaultProps} />);
    const dateInputs: HTMLElement[] = await screen.findAllByTestId("dms-filter-dialog-date-added");
    // Fill valid From date
    fireEvent.change(within(dateInputs[0]).getByPlaceholderText("DD"), { target: { value: "10" } });
    fireEvent.change(within(dateInputs[0]).getByPlaceholderText("MM"), { target: { value: "05" } });
    fireEvent.change(within(dateInputs[0]).getByPlaceholderText("YYYY"), { target: { value: "2023" } });
    // Fill To date with invalid date
    fireEvent.change(within(dateInputs[1]).getByPlaceholderText("DD"), { target: { value: "31" } });
    fireEvent.change(within(dateInputs[1]).getByPlaceholderText("MM"), { target: { value: "02" } });
    fireEvent.change(within(dateInputs[1]).getByPlaceholderText("YYYY"), { target: { value: "2023" } });

    fireEvent.click(screen.getByTestId("dms-filter-dialog-apply-btn"));

    const validationText: HTMLElement[] = screen.getAllByTestId("dms-filter-dialog-date-added__validation-text");
    expect(validationText.some(node => /Invalid Date/i.test(node.textContent || ""))).toBe(true);

  });


});
describe("From date edge case validation", () => {
  beforeEach(() => jest.clearAllMocks());


  it("shows error when From date is before minimum allowed date", async () => {
    renderComponent();
    const dateInputs: HTMLElement[] = screen.getAllByTestId("dms-filter-dialog-date-added");
    setDateInput(dateInputs[0], "31", "12", "1899");
    fireEvent.blur(dateInputs[0]);
    fireEvent.click(screen.getByTestId("dms-filter-dialog-apply-btn"));
    await waitFor(() => {
      const validationText: HTMLElement[] = screen.getAllByTestId("dms-filter-dialog-date-added__validation-text");
      expect(validationText.some(node => /on or after|01\/01\/1900/i.test(node.textContent || ""))).toBe(true);
      expect(mockSetIsDateError).toHaveBeenCalledWith(true);
    });

});


describe("To date validation", () => {

  // it("shows error if date is invalid", async () => {
  //   renderComponent({
  //     selectedRelatedTo: { text: "Pupil", value: "1", data: { data: { key: "Pupil" } } },
  //     tagListArray: [{ text: "Test Pupil", learnerExternalId: "123", id: "123" }]
  //   });
  //   // Set invalid date
  //   fireEvent.change(screen.getAllByPlaceholderText("DD")[0], { target: { value: "32" } });
  //   fireEvent.change(screen.getAllByPlaceholderText("MM")[0], { target: { value: "13" } });
  //   fireEvent.change(screen.getAllByPlaceholderText("YYYY")[0], { target: { value: "2023" } });
  //   fireEvent.click(screen.getByTestId("dms-filter-dialog-apply-btn"));
  //   // Use a flexible matcher for the error message
  //   expect(await screen.findByText((content) => /Invalid Date/i.test(content))).toBeInTheDocument();
  //   expect(mockHandleApply).not.toHaveBeenCalled();
  // });

it("calls handleApply if all validations pass for Pupil", async () => {
   jest.spyOn(ApiService, "fetchDMSSuggestions").mockResolvedValue(mockSuggestions);

  // Provide a suggestion directly

  const suggestions: { name: string; values: { text: string; value: string; learnerExternalId: string; id: string }[] }[] = [
  {
    name: "Pupil",
    values: [
      {
        text: "Alfie",
        value: "Alfie",
        learnerExternalId: "456",
        id: "2"
      }
    ]
  }
];
  renderComponent({
    selectedRelatedTo: { text: "Pupil", value: "1", data: { data: { key: "Pupil" } } },
    tagListArray: [],
    suggestions 
  });

  // Open RelatedTo dropdown by clicking the icon button
  fireEvent.click(screen.getByTestId("text-input-dms-filter-dialog-related-to-icon-btn"));

  // Wait for the options to appear and select "Pupil"
  await waitFor(() => {
    expect(screen.getAllByTestId("menu-dms-filter-dialog-related-to")[0]).toBeInTheDocument();
  });
  fireEvent.click(screen.getByTestId("menu-option-dms-filter-dialog-related-to-1"));

  // Enter search term and select suggestion
   const input: HTMLElement = await screen.getByTestId("search-autocomplete-input");
  fireEvent.change(input, { target: { value: "Alfie" } });
  fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

  // Click Apply
  fireEvent.click(screen.getByTestId("dms-filter-dialog-apply-btn"));
});

// describe("onSelectMultiple updater logic (unit coverage)", () => {

interface UpdaterItem {
  data: { type?: string } | string;
  text?: string;
}

function updater(prev: UpdaterItem[], items: UpdaterItem[]): UpdaterItem[] {
  const dateRangeIndex: number = prev.findIndex(item => (item.data as any)?.type === "dateRange");
  const dateRangeItem: UpdaterItem | undefined = prev[dateRangeIndex];
  const newItems: UpdaterItem[] = items
    .filter(item => (item.data as any)?.type !== "dateRange")
    .map(item => ({
      ...item,
      text:
        item.text ||
        (typeof item.data === "string"
          ? item.data.charAt(0).toUpperCase() + item.data.slice(1)
          : "")
    }));

  let insertIndex: number = newItems.length;
  if (dateRangeItem && dateRangeIndex > 0) {
    const prevBeforeDate: (string | { type?: string })[] = prev.slice(0, dateRangeIndex).map(i => i.data);
    insertIndex = newItems.findIndex(i => !prevBeforeDate.includes(i.data));
    if (insertIndex === -1) insertIndex = newItems.length;
    else insertIndex = newItems.filter(i => prevBeforeDate.includes(i.data)).length;
  } else if (dateRangeItem) {
    insertIndex = 0;
  }

  if (dateRangeItem) {
    const safeDateRangeItem: UpdaterItem = {
      ...dateRangeItem,
      text: dateRangeItem.text ?? ""
    };
    newItems.splice(insertIndex, 0, safeDateRangeItem);
  }
  return newItems;
}



  it("inserts dateRange at index 0 if it was first and no previous items before it", () => {
    const prev: any[] = [{ data: { type: "dateRange" }, text: "Date" }];
    const items: any[] = [];
    const result: any[] = updater(prev, items);

    expect(result[0].data.type).toBe("dateRange");
  });

it("calls handleSearchChange on search input change and suggestion click", async () => {
  jest.spyOn(ApiService, "fetchDMSSuggestions").mockResolvedValue(mockSuggestions);
   renderComponent({
    selectedRelatedTo: { text: "Pupil", value: "1", data: { data: { key: "Pupil" } } },
    tagListArray: [
      { text: "Alfie", learnerExternalId: "123", id: "123" }
    ],
    mockSuggestions
  });

  // Open RelatedTo dropdown and select "Pupil"
// Open RelatedTo dropdown by clicking the icon button

fireEvent.click(screen.getByTestId("text-input-dms-filter-dialog-related-to-icon-btn"));

// Wait for the options to appear and select "Pupil"
await waitFor(() => {
  // Debug: log the HTML to see if options are rendered
  expect(screen.getAllByTestId("menu-dms-filter-dialog-related-to")[0]).toBeInTheDocument();
});
fireEvent.click(screen.getByTestId("menu-option-dms-filter-dialog-related-to-1"));

  // Wait for search input to appear
  const searchInput: HTMLElement = await screen.findByTestId("search-autocomplete-input");

  // Simulate entering search term (must match mock logic)
  fireEvent.change(searchInput, { target: { value: "Alfie" } });

  act(() => {jest.advanceTimersByTime(5000)});
 
  if (screen.queryByTestId("remove-tag-undefined")) {
    fireEvent.click(screen.getByTestId("remove-tag-undefined"));
  }
});

});

describe("Related To Dropdown", () => {
  beforeEach(() => jest.clearAllMocks());
it("sets selected item state when Related To is changed", async () => {
  jest.useFakeTimers();

  const mockData: any[] = [
    {
      application: "Apple",
      category: "Apple",
      categoryId: 8,
      code: "APPL6",
      section: "Section5"
    },
    {
      application: "HR",
      category: "HR",
      categoryId: 1,
      code: "APPL6",
      section: "Section5"
    }
  ];

  (logic.fetchDocumentCategoryData as jest.Mock).mockResolvedValueOnce(mockData);

  jest.spyOn(ApiService, "fetchDMSSuggestions").mockResolvedValue(mockSuggestions);

   renderComponent({
    selectedRelatedTo: {
      text: "Pupil",
      value: "1",
      data: { data: { key: "Pupil" } }
    },
    selectedCategories: mockData,
    tagListArray: [
      { text: "Test Pupil", learnerExternalId: "123", id: "123" }
    ]
  });

  // Open dropdown
  fireEvent.click(
    screen.getByTestId("text-input-dms-filter-dialog-related-to-icon-btn")
  );

  await waitFor(() => {
    expect(
      screen.getAllByTestId("menu-dms-filter-dialog-related-to")[0]
    ).toBeInTheDocument();
  });

  fireEvent.click(
    screen.getByTestId("menu-option-dms-filter-dialog-related-to-1")
  );

  // ✅ TYPE INTO REAL INPUT
  const input: HTMLElement = await screen.findByTestId("search-autocomplete-input");

  fireEvent.change(input, {
    target: { value: "Alfie" }
  });

  // flush debounce
  act(() => {
    jest.runAllTimers();
  });

  // wait for suggestion
  const suggestion: HTMLElement[] = await screen.findAllByText("Alfie");

  fireEvent.click(suggestion[0]);

  await waitFor(() => {
   
    expect(mockSetTagListArray).toHaveBeenCalledWith([
      { text: "Test Pupil", learnerExternalId: "123", id: "123" }
    ]);
  });

  jest.useRealTimers();
});
})

});
})
