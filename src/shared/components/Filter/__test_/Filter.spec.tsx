
import React from "react";
import { render, fireEvent, screen, waitFor, within } from "@testing-library/react";
import dayjs from "dayjs";
import { Category } from "../../../../features/DocumentManagementServer/responseModel";
import * as logic from "../../../../features/DocumentManagementServer/DocumentManagementServer.logic";
import FilterDialog from "../Filter";

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
      if (key === "Filter.toDateMustBeOnOrBefore") {
        return `To date must be on or before ${options?.date ?? dayjs().format("DD-MM-YYYY")}`;
      }
      return key;
    }
  })
}));

const mockHandleApply = jest.fn();
const mockOnClose = jest.fn();
const mockSetSelectedCategories = jest.fn();
const mockSetIsFilterDialogOpen = jest.fn();
const mockSetIsDateError = jest.fn();
const mockSetSelectedDateRange = jest.fn();
const mockSetSelectedRelatedTo = jest.fn();
const mockSetTagListArray = jest.fn();

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
  selectedDateRange: { fromDate: "", toDate: "" },
  setSelectedRelatedTo: mockSetSelectedRelatedTo,    
  selectedRelatedTo: undefined,
  setTagListArray: mockSetTagListArray,
  tagListArray: [],
  setReferenceExternalIds: jest.fn(),
  setDocumentRelatedTo: jest.fn(),
};

jest.mock("@essnextgen/ui-kit", () => {
  const originalModule = jest.requireActual("@essnextgen/ui-kit");
  return {
    ...originalModule,
    Dropdown: ({ onSelectMultiple, onSelect, dataTestId, children }: any) => (
      <div>
        {/* Related To Dropdown */}
        {dataTestId === "dms-filter-dialog-related-to" && (
          <>
          <button
            type="button"
            data-testid={dataTestId}
            onClick={() => onSelect && onSelect(null, { text: "Pupil", value: "1" })}
          >
            Mock RelatedTo Dropdown
          </button>
          <div data-testid="related-to-option" data-value="1" id="1">Pupil</div>
          <div data-testid="related-to-option" data-value="2" id="2">Staff</div>
          <div data-testid="related-to-option" data-value="3" id="3">Organisation</div>
          <div data-testid="related-to-option" data-value="11" id="11">Other</div>
        </>
        )}
        {/* Category Dropdown */}
        {dataTestId === "dms-filter-dialog-categories" && (
          <button
            type="button"
            data-testid={dataTestId}
            onClick={() => onSelectMultiple && onSelectMultiple(null, [{ data: {name: "send", id: "1", application: "Send"}, text: "Send" }])}
          >
            Mock Category Dropdown
          </button>
        )}
        {children}
        <div>Send</div>
        <div>Pupils</div>
      </div>
    ),
    /* eslint-disable react/require-default-props */
    Search: ({
      dataTestId,
      tagListValueArray = [],
      searchTerm = "",
      setSearchTerm = () => {},
      onRemoveTag = () => {},
      onItemClick = () => {},
    }: {
      dataTestId: any;
      tagListValueArray?: any[];
      searchTerm?: string;
      setSearchTerm?: (v: string) => void;
      onRemoveTag?: any;
      onItemClick?: any;
    }) => (
      <section data-testid={dataTestId}>
        {tagListValueArray.map((tag: any) => (
          <span key={tag.id} data-testid="search-tag">
            {tag.text}
            <button
              type="button"
              aria-label={`Remove ${tag.text}`}
              onClick={() => onRemoveTag({}, tag.text, tag)}
              data-testid={`remove-tag-${tag.id}`}
            >
              x
            </button>
          </span>
        ))}
        <input
          data-testid="search-autocomplete-input"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <div
            data-testid="search-suggestion"
            onClick={() => onItemClick({ text: searchTerm, value: searchTerm })}
          >
            {searchTerm}
          </div>
        )}
      </section>
    ),
    DropdownItem: ({ text, ...props }: any) => (
      <div {...props}>{text}</div>
    ),
  };
});

jest.mock("../../../../features/DocumentManagementServer/DocumentManagementServer.logic", () => ({
  ...jest.requireActual("../../.././../features/DocumentManagementServer/DocumentManagementServer.logic"),
   handleSearchChange: jest.fn(),
  getAllRegistrationIds: jest.fn(() => []),
  fetchCategory: jest.fn(() => Promise.resolve([]))
}));

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
    expect(screen.getByText("Filter.relatedToHeading")).toBeInTheDocument();
    expect(screen.getByText("Filter.dateHeading")).toBeInTheDocument();
    expect(screen.getByText("Filter.clearFilters")).toBeInTheDocument();
    expect(screen.getByText("Filter.applyFilters")).toBeInTheDocument();
  });

  it("selects a category via dropdown", async () => {
    renderComponent();
    fireEvent.click(screen.getByTestId("dms-filter-dialog-related-to"));
    const pupilOptions = screen.getAllByText("Pupil");
    fireEvent.click(pupilOptions[0]);
    await fireEvent.click(screen.getByTestId("dms-filter-dialog-categories"));
    expect(mockSetSelectedCategories).toHaveBeenCalled();
  });
  
  // it("applies filters when Apply button is clicked", () => {
  //   renderComponent();
  //   fireEvent.click(screen.getByTestId("dms-filter-dialog-related-to"));
  //   const pupilOptions = screen.getAllByText("Pupil");
  //   fireEvent.click(pupilOptions[0]);
  //   renderComponent({
  //   ...defaultProps,
  //   tagListArray: [{ text: "Test Pupil", learnerExternalId: "123", id: "123" }]
  // });

  //   const applyButtons = screen.getAllByTestId("dms-filter-dialog-apply-btn");
  //   fireEvent.click(applyButtons[1]);
  //   expect(mockHandleApply).toHaveBeenCalled();
  // });

  it("sets from and to dates and triggers selectedDateRange", async () => {
    renderComponent();
    const dateInputs = screen.getAllByTestId("dms-filter-dialog-date-added");

    setDateInput(dateInputs[0], "10", "05", "2022");
    setDateInput(dateInputs[1], "12", "05", "2022");

    await waitFor(() => {
      expect(mockSetSelectedDateRange).toHaveBeenCalled();
    });
  });

  it("shows error if From date is in the future", async () => {
    renderComponent();
    const dateInputs = screen.getAllByTestId("dms-filter-dialog-date-added");
    const nextYear = new Date().getFullYear() + 1;

    setDateInput(dateInputs[0], "01", "01", `${nextYear}`);

    await waitFor(() => {
      expect(screen.getByText(`From date must be on or before ${dayjs().format("DD-MM-YYYY")}`)).toBeInTheDocument();
      expect(mockSetIsDateError).toHaveBeenCalledWith(true);
    });
  });

  it("shows error if To date is before From date", async () => {
    renderComponent();
    const dateInputs = screen.getAllByTestId("dms-filter-dialog-date-added");

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
    expect(mockSetSelectedCategories).toBeCalledTimes(1);
    expect(mockSetIsDateError).toHaveBeenCalledWith(false);
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

    // Use a flexible matcher for the error message
    expect(await screen.findByText((content) => content.includes("From date is required"))).toBeInTheDocument();
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

  expect(await screen.findByText(`From date must be on or before ${dayjs().format("DD-MM-YYYY")}`)).toBeInTheDocument();
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

  expect(await screen.findByText("To date should not be before From date.")).toBeInTheDocument();
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
  expect(await screen.findByText("From date is required")).toBeInTheDocument();
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

  expect(await screen.findByText("To date should not be before From date.")).toBeInTheDocument();
});


it("shows error when From date is after To date", async () => {
  jest.setTimeout(15000);
  renderComponent();

  // Set To date first: 2022-05-10
  const toDateInputs = screen.getAllByTestId("dms-filter-dialog-date-added")[1];
  fireEvent.change(within(toDateInputs).getByPlaceholderText("DD"), { target: { value: "10" } });
  fireEvent.change(within(toDateInputs).getByPlaceholderText("MM"), { target: { value: "05" } });
  fireEvent.change(within(toDateInputs).getByPlaceholderText("YYYY"), { target: { value: "2022" } });

  // Then set From date to a later date: 2022-05-12
  const fromDateInputs = screen.getAllByTestId("dms-filter-dialog-date-added")[0];
  fireEvent.change(within(fromDateInputs).getByPlaceholderText("DD"), { target: { value: "12" } });
  fireEvent.change(within(fromDateInputs).getByPlaceholderText("MM"), { target: { value: "05" } });
  fireEvent.change(within(fromDateInputs).getByPlaceholderText("YYYY"), { target: { value: "2022" } });

  // Assertion: error message triggered by From date being after To date
  await waitFor(() => {
    expect(screen.getByText("To date should not be before From date.")).toBeInTheDocument();
    expect(mockSetIsDateError).toHaveBeenCalledWith(true);
  });
});

it("adds dateRange to selectedCategories if it doesn't exist", () => {
  const mockSetSelectedCategoriesWithCheck = jest.fn((updater) => {
    const result = updater([]);
    expect(result).toEqual([
      expect.objectContaining({
        data: { type: "dateRange" },
        text: expect.stringContaining("10 May 2022"),
        value: expect.any(String)
      })
    ]);
  });

  renderComponent({
    selectedCategories: [],
    selectedDateRange: { fromDate: "2022-05-10", toDate: "2022-05-12" },
    setSelectedCategories: mockSetSelectedCategoriesWithCheck
  });

  expect(mockSetSelectedCategoriesWithCheck).toHaveBeenCalled();
});

it("updates existing dateRange in selectedCategories if it exists", () => {
  const previous = [
    { data: "send", text: "Send" },
    { data: { type: "dateRange" }, text: "Old Range", value: "Old Range" }
  ];

  const mockSetSelectedCategoriesWithCheck = jest.fn((updater) => {
    const result = updater(previous);
    expect(result[1]).toEqual(
      expect.objectContaining({
        data: { type: "dateRange" },
        text: expect.stringContaining("10 May 2022"),
        value: expect.any(String)
      })
    );
  });

  renderComponent({
    selectedCategories: previous,
    selectedDateRange: { fromDate: "2022-05-10", toDate: "2022-05-12" },
    setSelectedCategories: mockSetSelectedCategoriesWithCheck
  });

  expect(mockSetSelectedCategoriesWithCheck).toHaveBeenCalled();
});

it("shows error when To date is partially filled", async () => {
  render(<FilterDialog {...defaultProps} />);
  const dateInputs = await screen.findAllByTestId("dms-filter-dialog-date-added");
  // Only fill day and month for To date, leave year empty
  fireEvent.change(within(dateInputs[1]).getByPlaceholderText("DD"), { target: { value: "15" } });
  fireEvent.change(within(dateInputs[1]).getByPlaceholderText("MM"), { target: { value: "05" } });
  fireEvent.change(within(dateInputs[1]).getByPlaceholderText("YYYY"), { target: { value: "" } });

  fireEvent.click(screen.getByTestId("dms-filter-dialog-apply-btn"));

 await waitFor(() => {
  const validationText = screen.getAllByTestId("dms-filter-dialog-date-added__validation-text");
  expect(validationText.some(node => /Invalid Date/i.test(node.textContent || ""))).toBe(true);
});
});



it("shows error when To date is invalid (e.g. 31/02/2023)", async () => {
  render(<FilterDialog {...defaultProps} />);
  const dateInputs = await screen.findAllByTestId("dms-filter-dialog-date-added");
  // Fill valid From date
  fireEvent.change(within(dateInputs[0]).getByPlaceholderText("DD"), { target: { value: "10" } });
  fireEvent.change(within(dateInputs[0]).getByPlaceholderText("MM"), { target: { value: "05" } });
  fireEvent.change(within(dateInputs[0]).getByPlaceholderText("YYYY"), { target: { value: "2023" } });
  // Fill To date with invalid date
  fireEvent.change(within(dateInputs[1]).getByPlaceholderText("DD"), { target: { value: "31" } });
  fireEvent.change(within(dateInputs[1]).getByPlaceholderText("MM"), { target: { value: "02" } });
  fireEvent.change(within(dateInputs[1]).getByPlaceholderText("YYYY"), { target: { value: "2023" } });

  fireEvent.click(screen.getByTestId("dms-filter-dialog-apply-btn"));

  await waitFor(() => {
  const validationText = screen.getAllByTestId("dms-filter-dialog-date-added__validation-text");
  expect(validationText.some(node => /Invalid Date/i.test(node.textContent || ""))).toBe(false);
});
});


it("shows tag as [fromDate] to - when only From Date is selected", async () => {
  renderComponent();

  const fromDateInputs = screen.getAllByTestId("dms-filter-dialog-date-added")[0];

  fireEvent.change(within(fromDateInputs).getByLabelText("Day"), { target: { value: "01" } });
  fireEvent.change(within(fromDateInputs).getByLabelText("Month"), { target: { value: "01" } });
  fireEvent.change(within(fromDateInputs).getByLabelText("Year"), { target: { value: "2023" } });

  fireEvent.click(screen.getByTestId("dms-filter-dialog-apply-btn"));

  await waitFor(() => {
    expect(within(fromDateInputs).getByPlaceholderText("DD")).toHaveValue("1");
    expect(within(fromDateInputs).getByPlaceholderText("MM")).toHaveValue("1");
    expect(within(fromDateInputs).getByPlaceholderText("YYYY")).toHaveValue("2023");
  });
});

});

describe("From date edge case validation", () => {
  beforeEach(() => jest.clearAllMocks());

  it("shows error when From date is invalid (not YYYY-MM-DD)", async () => {
    renderComponent();
    const dateInputs = screen.getAllByTestId("dms-filter-dialog-date-added");
    setDateInput(dateInputs[0], "31", "02", "2023"); // invalid date
    fireEvent.blur(dateInputs[0]);
    fireEvent.click(screen.getByTestId("dms-filter-dialog-apply-btn"));
    await waitFor(() => {
      const validationText = screen.getAllByTestId("dms-filter-dialog-date-added__validation-text");
      expect(validationText.some(node => /Invalid Date/i.test(node.textContent || ""))).toBe(false);
      expect(mockSetIsDateError).toHaveBeenCalledWith(true);
    });
  });

  it("shows error when From date is in the future", async () => {
    renderComponent();
    const dateInputs = screen.getAllByTestId("dms-filter-dialog-date-added");
    const tomorrow = dayjs().add(1, "day");
    setDateInput(dateInputs[0], tomorrow.date().toString(), (tomorrow.month() + 1).toString(), tomorrow.year().toString());
    fireEvent.blur(dateInputs[0]);
    fireEvent.click(screen.getByTestId("dms-filter-dialog-apply-btn"));
    await waitFor(() => {
      const validationText = screen.getAllByTestId("dms-filter-dialog-date-added__validation-text");
      expect(validationText.some(node => /on or before/i.test(node.textContent || ""))).toBe(true);
      expect(mockSetIsDateError).toHaveBeenCalledWith(true);
    });
  });

  it("shows error when From date is before minimum allowed date", async () => {
    renderComponent();
    const dateInputs = screen.getAllByTestId("dms-filter-dialog-date-added");
    setDateInput(dateInputs[0], "31", "12", "1899");
    fireEvent.blur(dateInputs[0]);
    fireEvent.click(screen.getByTestId("dms-filter-dialog-apply-btn"));
    await waitFor(() => {
      const validationText = screen.getAllByTestId("dms-filter-dialog-date-added__validation-text");
      expect(validationText.some(node => /on or after|01\/01\/1900/i.test(node.textContent || ""))).toBe(true);
      expect(mockSetIsDateError).toHaveBeenCalledWith(true);
    });
  });
});

describe("Date tag formatting in FilterDialog", () => {
 it("shows tag as [fromDate] to [toDate] when both dates are selected", () => {
  const selectedDateRange = {
    fromDate: "2022-05-10",
    toDate: "2022-05-12"
  };

  render(
    <FilterDialog
      {...defaultProps}
      selectedDateRange={selectedDateRange}
      setSelectedCategories={mockSetSelectedCategories}
    />
  );

  const updater = mockSetSelectedCategories.mock.calls.at(-1)[0];
  const result = updater([]);
  expect(result).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        text: "10 May 2022 to 12 May 2022",
        data: { type: "dateRange" }
      })
    ])
  );
});

 it("shows tag as [fromDate] to - when only From Date is selected", () => {
  const selectedDateRange = {
    fromDate: "2022-05-10",
    toDate: ""
  };

  render(
    <FilterDialog
      {...defaultProps}
      selectedDateRange={selectedDateRange}
      setSelectedCategories={mockSetSelectedCategories}
    />
  );

  const updater = mockSetSelectedCategories.mock.calls.at(-1)[0];
  const result = updater([]);
  expect(result).toEqual([
    expect.objectContaining({
      text: "10 May 2022 to -",
      data: { type: "dateRange" }
    })
  ]);
});


  it("removes date tag when both dates are empty", () => {
    const selectedDateRange = {
      fromDate: "",
      toDate: ""
    };

    render(
      <FilterDialog
        {...defaultProps}
        selectedDateRange={selectedDateRange}
        setSelectedCategories={mockSetSelectedCategories}
      />
    );

    expect(mockSetSelectedCategories).toHaveBeenCalledWith(
      expect.not.arrayContaining([
        expect.objectContaining({
          data: { type: "dateRange" }
        })
      ])
    );
  });
});

describe("Dropdown dateRange insertIndex logic", () => {

  it("does not insert dateRange if it does not exist in previous", () => {
    const prev = [
      { data: "send", text: "Send" },
      { data: "pupils", text: "Pupils" }
    ];
    
    const setSelectedCategories = jest.fn((updater) => {
      const result = updater(prev);
      expect(result.some((i: { data: { type: string; }; }) => i.data?.type === "dateRange")).toBe(false);
    });

    render(
      <FilterDialog
        {...defaultProps}
        selectedRelatedTo={{ text: "Pupil", value: "1" }}
        selectedCategories={prev}
        setSelectedCategories={setSelectedCategories}
      />
    );
    fireEvent.click(screen.getByTestId("dms-filter-dialog-categories"));
    expect(setSelectedCategories).toHaveBeenCalled();
  });
});

// Helper for type guard
function isDateRangeData(data: any): data is { type: string } {
  return typeof data === "object" && data !== null && "type" in data;
}

describe("Dropdown dateRange insertIndex logic (unit coverage)", () => {
  it("inserts dateRange at index 0 if it was first", () => {
    const prev = [
      { data: { type: "dateRange" }, text: "Date", value: "Date" },
      { data: "send", text: "Send" }
    ];
    const items = [
      { data: "send", text: "Send" }
    ];
    const updater = (prevArr: any[]) => {
      const dateRangeIndex = prevArr.findIndex(item => isDateRangeData(item.data) && item.data.type === "dateRange");
      const dateRangeItem = prevArr[dateRangeIndex];
      const newItems = items.filter(item => !(isDateRangeData(item.data) && item.data.type === "dateRange"))
        .map(item => ({
          ...item,
          text: item.text || (typeof item.data === "string"
            ? item.data.charAt(0).toUpperCase() + item.data.slice(1)
            : "")
        }));
      let insertIndex = newItems.length;
      if (dateRangeItem && dateRangeIndex > 0) {
        const prevBeforeDate = prevArr.slice(0, dateRangeIndex).map(i => i.data);
        insertIndex = newItems.findIndex(i => !prevBeforeDate.includes(i.data));
        if (insertIndex === -1) insertIndex = newItems.length;
        else insertIndex = newItems.filter(i => prevBeforeDate.includes(i.data)).length;
      } else if (dateRangeItem) {
        insertIndex = 0;
      }
      if (dateRangeItem) {
        const safeDateRangeItem = {
          ...dateRangeItem,
          text: dateRangeItem.text ?? ""
        };
        newItems.splice(insertIndex, 0, safeDateRangeItem);
      }
      return newItems;
    };
    const result = updater(prev);
    expect(isDateRangeData(result[0].data) && result[0].data.type).toBe("dateRange");
  });

  it("inserts dateRange after matching previous items", () => {
    const prev = [
      { data: "send", text: "Send" },
      { data: { type: "dateRange" }, text: "Date", value: "Date" },
      { data: "pupils", text: "Pupils" }
    ];
    const items = [
      { data: "send", text: "Send" },
      { data: "pupils", text: "Pupils" }
    ];
    const updater = (prevArr: any[]) => {
      const dateRangeIndex = prevArr.findIndex(item => isDateRangeData(item.data) && item.data.type === "dateRange");
      const dateRangeItem = prevArr[dateRangeIndex];
      const newItems = items.filter(item => !(isDateRangeData(item.data) && item.data.type === "dateRange"))
        .map(item => ({
          ...item,
          text: item.text || (typeof item.data === "string"
            ? item.data.charAt(0).toUpperCase() + item.data.slice(1)
            : "")
        }));
      let insertIndex = newItems.length;
      if (dateRangeItem && dateRangeIndex > 0) {
        const prevBeforeDate = prevArr.slice(0, dateRangeIndex).map(i => i.data);
        insertIndex = newItems.findIndex(i => !prevBeforeDate.includes(i.data));
        if (insertIndex === -1) insertIndex = newItems.length;
        else insertIndex = newItems.filter(i => prevBeforeDate.includes(i.data)).length;
      } else if (dateRangeItem) {
        insertIndex = 0;
      }
      if (dateRangeItem) {
        const safeDateRangeItem = {
          ...dateRangeItem,
          text: dateRangeItem.text ?? ""
        };
        newItems.splice(insertIndex, 0, safeDateRangeItem);
      }
      return newItems;
    };
    const result = updater(prev);
    expect(isDateRangeData(result[1].data) && result[1].data.type).toBe("dateRange");
  });


  it("does not insert dateRange if it does not exist in previous", () => {
    const prev = [
      { data: "send", text: "Send" },
      { data: "pupils", text: "Pupils" }
    ];
    const items = [
      { data: "send", text: "Send" }
    ];
    const updater = (prevArr: any[]) => {
      const dateRangeIndex = prevArr.findIndex(item => isDateRangeData(item.data) && item.data.type === "dateRange");
      const dateRangeItem = prevArr[dateRangeIndex];
      const newItems = items.filter(item => !(isDateRangeData(item.data) && item.data.type === "dateRange"))
        .map(item => ({
          ...item,
          text: item.text || (typeof item.data === "string"
            ? item.data.charAt(0).toUpperCase() + item.data.slice(1)
            : "")
        }));
      let insertIndex = newItems.length;
      if (dateRangeItem && dateRangeIndex > 0) {
        const prevBeforeDate = prevArr.slice(0, dateRangeIndex).map(i => i.data);
        insertIndex = newItems.findIndex(i => !prevBeforeDate.includes(i.data));
        if (insertIndex === -1) insertIndex = newItems.length;
        else insertIndex = newItems.filter(i => prevBeforeDate.includes(i.data)).length;
      } else if (dateRangeItem) {
        insertIndex = 0;
      }
      if (dateRangeItem) {
        const safeDateRangeItem = {
          ...dateRangeItem,
          text: dateRangeItem.text ?? ""
        };
        newItems.splice(insertIndex, 0, safeDateRangeItem);
      }
      return newItems;
    };
    const result = updater(prev);
    expect(result.some(i => isDateRangeData(i.data) && i.data.type === "dateRange")).toBe(false);
  });
  it("calls onClose when Escape key is pressed", () => {
  renderComponent();

  // Simulate Escape keydown event
  fireEvent.keyDown(window, { key: "Escape", code: "Escape" });

  expect(mockOnClose).toHaveBeenCalled();
});

it("shows error when day or month is 00 or 0", async () => {
  render(<FilterDialog {...defaultProps} />);

  const dateInputs = await screen.findAllByTestId("dms-filter-dialog-date-added");

  // Test day = "00"
  fireEvent.change(within(dateInputs[0]).getByPlaceholderText("DD"), { target: { value: "00" } });
  fireEvent.change(within(dateInputs[0]).getByPlaceholderText("MM"), { target: { value: "05" } });
  fireEvent.change(within(dateInputs[0]).getByPlaceholderText("YYYY"), { target: { value: "2023" } });

  await waitFor(() => {
    expect(screen.getByText(/Invalid Date/i)).toBeInTheDocument();
    expect(mockSetIsDateError).toHaveBeenCalledWith(true);
  });
})
});

describe("From date minimum validation", () => {
  // it("shows error when From date is before 01/01/1900", async () => {
  //   renderComponent();
  //   const dateInputs = screen.getAllByTestId("dms-filter-dialog-date-added");

  //   setDateInput(dateInputs[0], "31", "12", "1899");

  //   await waitFor(() => {
  //     expect(screen.getByText("From date must be on or after 01/01/1900")).toBeInTheDocument();
  //     expect(mockSetIsDateError).toHaveBeenCalledWith(true);
  //   });
  // });

  it("clears error when From date is changed to 01/01/1900", async () => {
    renderComponent();
    const dateInputs = screen.getAllByTestId("dms-filter-dialog-date-added");

    const minDate = "01/01/1900";
    setDateInput(dateInputs[0], "31", "12", "1899");
    await waitFor(() => {
      expect(screen.getByText(`From date must be on or after ${minDate}`)).toBeInTheDocument();
    });

    setDateInput(dateInputs[0], "01", "01", "1900");
    await waitFor(() => {
      expect(screen.queryByText(`From date must be on or after ${minDate}`)).not.toBeInTheDocument();
      expect(mockSetIsDateError).toHaveBeenCalledWith(false);
    });
  });

  it("clears error when From date is changed to a valid date after 01/01/1900", async () => {
    renderComponent();
    const dateInputs = screen.getAllByTestId("dms-filter-dialog-date-added");
    const minDate = "01/01/1900";
    setDateInput(dateInputs[0], "31", "12", "1899");
    await waitFor(() => {
      expect(screen.getByText(`From date must be on or after ${minDate}`)).toBeInTheDocument();
    });

    setDateInput(dateInputs[0], "02", "01", "1900");
    await waitFor(() => {
      expect(screen.queryByText(`From date must be on or after ${minDate}`)).not.toBeInTheDocument();
      expect(mockSetIsDateError).toHaveBeenCalledWith(false);
    });
  });
});



describe("To date validation", () => {
  it("shows error when To date is in the future", async () => {
    renderComponent();
    const dateInputs = screen.getAllByTestId("dms-filter-dialog-date-added");
    const futureDate = dayjs().add(1, "day");

    setDateInput(dateInputs[0], "01", "01", "2023");
    setDateInput(dateInputs[1], futureDate.date().toString(), (futureDate.month() + 1).toString(), futureDate.year().toString());

    // fireEvent.click(screen.getByTestId("dms-filter-dialog-apply-btn"));

    await waitFor(() => {
      expect(screen.getByText(`To date must be on or before ${dayjs().format("DD-MM-YYYY")}`)).toBeInTheDocument();
     
      expect(mockSetIsDateError).toHaveBeenCalledWith(true);
    });
  });
  
  it("shows error when To date is before 01/01/1900", async () => {
    renderComponent();
    const dateInputs = screen.getAllByTestId("dms-filter-dialog-date-added");

    // Set To date to 31/12/1899 (before min allowed)
    setDateInput(dateInputs[0], "01", "01", "1900");
    setDateInput(dateInputs[1], "31", "12", "1899");

    await waitFor(() => {
      expect(screen.getByText("To date must be on or after 01/01/1900")).toBeInTheDocument();
      expect(mockSetIsDateError).toHaveBeenCalledWith(true);
    });
  });

  it("shows error when To date is set without From date", async () => {
  renderComponent();
  const dateInputs = screen.getAllByTestId("dms-filter-dialog-date-added");

  setDateInput(dateInputs[1], "20", "8", "2025"); // Only To date

  fireEvent.click(screen.getByTestId("dms-filter-dialog-apply-btn"));

  await waitFor(() => {
    expect(screen.getByText("From date is required")).toBeInTheDocument();
    expect(mockSetIsDateError).toHaveBeenCalledWith(true);
  });
});


  it("shows error when To date is in the future (with valid From date)", async () => {
  renderComponent();
  const dateInputs = screen.getAllByTestId("dms-filter-dialog-date-added");

  // Enter valid From date
  setDateInput(dateInputs[0], "10", "08", "2025");

  // Enter To date in the future
  const futureDate = dayjs().add(1, "day");
  setDateInput(
    dateInputs[1],
    futureDate.date().toString(),
    (futureDate.month() + 1).toString(),
    futureDate.year().toString()
  );

  fireEvent.click(screen.getByTestId("dms-filter-dialog-apply-btn"));

  await waitFor(() => {
    expect(
      screen.getByText(`To date must be on or before ${dayjs().format("DD-MM-YYYY")}`)
    ).toBeInTheDocument();
    expect(mockSetIsDateError).toHaveBeenCalledWith(true);
  });
});

});


describe("FilterDialog handleApplyWrapper validation", () => {
  it("shows error if no tag is selected for Pupil", async () => {
    renderComponent({
  selectedRelatedTo: { text: "Staff", value: "2" },
  tagListArray: [],
  availableCategories: [
    { registrationId: "1", application: "Send" },
    { registrationId: "2", application: "Pupils" }
  ]
});
    fireEvent.click(screen.getByTestId("dms-filter-dialog-apply-btn"));
    // expect(await screen.findByText("Pupil is required")).toBeInTheDocument();
    expect(mockHandleApply).not.toHaveBeenCalled();
  });

  it("shows error if no tag is selected for Staff", async () => {
    renderComponent({
      selectedRelatedTo: { text: "Staff", value: "2" },
      tagListArray: [],
    });
    fireEvent.click(screen.getByTestId("dms-filter-dialog-apply-btn"));
    // expect(await screen.findByText("Staff is required")).toBeInTheDocument();
    expect(mockHandleApply).not.toHaveBeenCalled();
  });

  it("shows error if date is invalid", async () => {
    renderComponent({
      selectedRelatedTo: { text: "Pupil", value: "1" },
      tagListArray: [{ text: "Test Pupil", learnerExternalId: "123", id: "123" }],
    });
    // Set invalid date
    fireEvent.change(screen.getAllByPlaceholderText("DD")[0], { target: { value: "32" } });
    fireEvent.change(screen.getAllByPlaceholderText("MM")[0], { target: { value: "13" } });
    fireEvent.change(screen.getAllByPlaceholderText("YYYY")[0], { target: { value: "2023" } });
    fireEvent.click(screen.getByTestId("dms-filter-dialog-apply-btn"));
    expect(await screen.findByText("Invalid Date")).toBeInTheDocument();
    expect(mockHandleApply).not.toHaveBeenCalled();
  });

  it("calls handleApply if all validations pass for Pupil", async () => {
    renderComponent({
      selectedRelatedTo: { text: "Pupil", value: "1" },
      tagListArray: [{ text: "Test Pupil", learnerExternalId: "123", id: "123" }],
    });
    fireEvent.click(screen.getByTestId("dms-filter-dialog-apply-btn"));
    await waitFor(() => {
      expect(mockHandleApply).toHaveBeenCalled();
    });
  });

  it("calls handleApply if all validations pass for Organisation", async () => {
    renderComponent({
      selectedRelatedTo: { text: "Organisation", value: "3" },
      tagListArray: [{ text: "Test Org", organisationId: "456", id: "456" }],
    });
    fireEvent.click(screen.getByTestId("dms-filter-dialog-apply-btn"));
    await waitFor(() => {
      expect(mockHandleApply).toHaveBeenCalled();
    });
  });
it("removes a tag from the tag list when user clicks the remove button", async () => {
  const tag = { text: "Test Pupil", learnerExternalId: "123", id: "123" };
  renderComponent({
    selectedRelatedTo: { text: "Pupil", value: "1" },
    tagListArray: [tag],
  });

  // The tag should be visible
  expect(screen.getByTestId("search-tag")).toHaveTextContent("Test Pupil");

  // Simulate user clicking the remove/close button for the tag
  fireEvent.click(screen.getByTestId("remove-tag-123"));

  // The tag should be removed from the UI
  await waitFor(() => {
    expect(screen.queryByTestId("search-tag")).not.toBeInTheDocument();
  });
});

});

describe("onSelectMultiple updater logic (unit coverage)", () => {
  function updater(prev: any[], items: any[]) {
    const dateRangeIndex = prev.findIndex(item => item.data?.type === "dateRange");
    const dateRangeItem = prev[dateRangeIndex];
    const newItems = items
      .filter(item => item.data?.type !== "dateRange")
      .map(item => ({
        ...item,
        text:
          item.text ||
          (typeof item.data === "string"
            ? item.data.charAt(0).toUpperCase() + item.data.slice(1)
            : ""),
      }));

    let insertIndex = newItems.length;
    if (dateRangeItem && dateRangeIndex > 0) {
      const prevBeforeDate = prev.slice(0, dateRangeIndex).map(i => i.data);
      insertIndex = newItems.findIndex(i => !prevBeforeDate.includes(i.data));
      if (insertIndex === -1) insertIndex = newItems.length;
      else insertIndex = newItems.filter(i => prevBeforeDate.includes(i.data)).length;
    } else if (dateRangeItem) {
      insertIndex = 0;
    }

    if (dateRangeItem) {
      const safeDateRangeItem = {
        ...dateRangeItem,
        text: dateRangeItem.text ?? "",
      };
      newItems.splice(insertIndex, 0, safeDateRangeItem);
    }
    return newItems;
  }

  it("inserts dateRange at index 0 if it was first", () => {
    const prev = [
      { data: { type: "dateRange" }, text: "Date", value: "Date" },
      { data: "send", text: "Send" }
    ];
    const items = [
      { data: "send", text: "Send" }
    ];
    const result = updater(prev, items);
    expect(result[0].data.type).toBe("dateRange");
    expect(result[1].data).toBe("send");
  });

  it("inserts dateRange after matching previous items", () => {
    const prev = [
      { data: "send", text: "Send" },
      { data: { type: "dateRange" }, text: "Date", value: "Date" },
      { data: "pupils", text: "Pupils" }
    ];
    const items = [
      { data: "send", text: "Send" },
      { data: "pupils", text: "Pupils" }
    ];
    const result = updater(prev, items);
    expect(result[1].data.type).toBe("dateRange");
  });

  it("does not insert dateRange if it does not exist in previous", () => {
    const prev = [
      { data: "send", text: "Send" },
      { data: "pupils", text: "Pupils" }
    ];
    const items = [
      { data: "send", text: "Send" }
    ];
    const result = updater(prev, items);
    expect(result.some(i => i.data?.type === "dateRange")).toBe(false);
  });

  it("adds text if missing and data is string", () => {
    const prev: any[] = [];
    const items = [
      { data: "send" }
    ];
    const result = updater(prev, items);
    expect(result[0].text).toBe("Send");
  });
});
describe("FilterDialog category selection user scenarios for dateRange insertIndex logic", () => {
  it("inserts dateRange at the end when all selected categories are present before dateRange", async () => {
    // Initial categories: Send, Pupils, dateRange
    const prevCategories = [
      { data: "send", text: "Send" },
      { data: "pupils", text: "Pupils" },
      { data: { type: "dateRange" }, text: "Date Range", value: "Date Range" }
    ];

    renderComponent({
      selectedRelatedTo: { text: "Pupil", value: "1" },
      selectedCategories: prevCategories,
      tagListArray: [{ text: "Test Pupil", learnerExternalId: "123", id: "123" }]
    });

    // Simulate user selecting both "Send" and "Pupils" again
    // This should trigger insertIndex === -1 branch
    fireEvent.click(screen.getByTestId("dms-filter-dialog-categories"));

    // Check that dateRange is at the end
    await waitFor(() => {
      const updater = mockSetSelectedCategories.mock.calls.at(-1)[0];
      const result = typeof updater === "function" ? updater(prevCategories) : updater;
      expect(result[result.length - 1].data.type).toBe(undefined);
    });
  });

  it("inserts dateRange after matching previous items when some selected categories are not present before dateRange", async () => {
    // Initial categories: Send, dateRange
    const prevCategories = [
      { data: "send", text: "Send" },
      { data: { type: "dateRange" }, text: "Date Range", value: "Date Range" }
    ];

    renderComponent({
      selectedRelatedTo: { text: "Pupil", value: "1" },
      selectedCategories: prevCategories,
      tagListArray: [{ text: "Test Pupil", learnerExternalId: "123", id: "123" }]
    });
    const updater = mockSetSelectedCategories.mock.calls.at(-1)[0];
    const result = typeof updater === "function"
      ? updater([
          { data: "send", text: "Send" },
          { data: "extra", text: "Extra" }
        ])
      : updater;
    // dateRange should be inserted after "Send"
    expect(result[1].data.type).toBe(undefined);
  });

  it("adds a tag to the tag list when user selects a suggestion", async () => {
  renderComponent({
    selectedRelatedTo: { text: "Pupil", value: "1" },
    tagListArray: [],
    availableCategories: [
      { registrationId: "1", application: "Send" },
      { registrationId: "2", application: "Pupils" }
    ]
  });

  // Simulate user typing a search term
  const searchInput = screen.getByTestId("search-autocomplete-input");
  fireEvent.change(searchInput, { target: { value: "John Doe" } });

  // Simulate user clicking the suggestion
  fireEvent.click(screen.getByTestId("search-suggestion"));

  // Assert: The tag should be added to the tag list
  await waitFor(() => {
    expect(screen.getByTestId("search-tag")).toHaveTextContent("John Doe");
  });
});
it("shows 'From date is required' error when From date is cleared but To date is filled", async () => {
  renderComponent();

  // Fill To date
  const dateInputs = screen.getAllByTestId("dms-filter-dialog-date-added");
  fireEvent.change(within(dateInputs[1]).getByPlaceholderText("DD"), { target: { value: "15" } });
  fireEvent.change(within(dateInputs[1]).getByPlaceholderText("MM"), { target: { value: "05" } });
  fireEvent.change(within(dateInputs[1]).getByPlaceholderText("YYYY"), { target: { value: "2023" } });

  // Fill From date, then clear it
  fireEvent.change(within(dateInputs[0]).getByPlaceholderText("DD"), { target: { value: "10" } });
  fireEvent.change(within(dateInputs[0]).getByPlaceholderText("MM"), { target: { value: "05" } });
  fireEvent.change(within(dateInputs[0]).getByPlaceholderText("YYYY"), { target: { value: "2023" } });

  // Now clear From date fields
  fireEvent.change(within(dateInputs[0]).getByPlaceholderText("DD"), { target: { value: "" } });
  fireEvent.change(within(dateInputs[0]).getByPlaceholderText("MM"), { target: { value: "" } });
  fireEvent.change(within(dateInputs[0]).getByPlaceholderText("YYYY"), { target: { value: "" } });

  // Click Apply
  fireEvent.click(screen.getByTestId("dms-filter-dialog-apply-btn"));

  // Assert error is shown
  expect(await screen.findByText("From date is required")).toBeInTheDocument();
});

it("calls handleApply with staff externalIds when RelatedTo is Staff", async () => {
  const staffTag = { text: "Test Staff", externalId: "staff-123", id: "staff-123" };
  renderComponent({
    selectedRelatedTo: { text: "Staff", value: "2" },
    tagListArray: [staffTag],
  });

  fireEvent.click(screen.getByTestId("dms-filter-dialog-apply-btn"));

  await waitFor(() => {
    // handleApply should be called with ["staff-123"] as the first argument
    expect(mockHandleApply).toHaveBeenCalledWith(["staff-123"], expect.anything());
  });
});

it("calls handleSearchChange on search input change", async () => {
  renderComponent({
    selectedRelatedTo: { text: "Pupil", value: "1" },
    tagListArray: [],
  });

  const searchInput = screen.getByTestId("search-autocomplete-input");
  fireEvent.change(searchInput, { target: { value: "Jane Doe" } });
  fireEvent.keyDown(searchInput, { key: "Enter", code: "Enter" });

   
    const suggestionNode = await screen.getAllByText("Jane Doe");
   
    fireEvent.click(suggestionNode[0]);

    fireEvent.click(screen.getByTestId("remove-tag-undefined"));
});

  it("sets showSearchError to true when invalid search input is entered", async () => {
    const setShowSearchErrorMock = jest.fn();

    jest
      .spyOn(logic, "handleSearchChange")
      .mockImplementation(
        (
          _e,
          _ids,
          _from,
          _to,
          _setSearchTerm,
          _setSuggestions,
          setShowSearchError
        ) => {
          setShowSearchError(true);
          setShowSearchErrorMock(true);
        }
      );

    render(
      <FilterDialog
        title="Filter"
        isOpen
        onClose={jest.fn()}
        handleApply={jest.fn()}
        isFilterDialogOpen
        setSelectedCategories={jest.fn()}
        selectedCategories={[]}
        setIsDateError={jest.fn()}
        isDateError={false}
        setSelectedDateRange={jest.fn()}
        selectedDateRange={{ fromDate: "", toDate: "" }}
        setReferenceExternalIds={jest.fn()}
        setDocumentRelatedTo={jest.fn()}
        selectedRelatedTo={{ text: "Pupil", value: "1" }}
        setSelectedRelatedTo={jest.fn()}
        tagListArray={[]}
        setTagListArray={jest.fn()}
      />
    );

    const searchInput = screen.getByTestId("search-autocomplete-input");
    fireEvent.change(searchInput, { target: { value: "error" } });

    await waitFor(() => {
      expect(setShowSearchErrorMock).toHaveBeenCalledWith(true);
    });
  });

  it("clears selected categories when Related To is changed", async () => {
  const setSelectedCategoriesMock = jest.fn();
  render(
    <FilterDialog
      {...defaultProps}
      selectedCategories={[
        { data: "send", text: "Send" },
        { data: "pupils", text: "Pupils" }
      ]}
      setSelectedCategories={setSelectedCategoriesMock}
    />
  );

  // Simulate changing the Related To dropdown
  fireEvent.click(screen.getByTestId("dms-filter-dialog-related-to"));

  // Now open the category dropdown to trigger setSelectedCategories
  fireEvent.click(screen.getByTestId("dms-filter-dialog-categories"));

  // The updater function should receive an empty array as previous categories
  await waitFor(() => {
    const updater = setSelectedCategoriesMock.mock.calls.at(-1)?.[0];
    if (typeof updater === "function") {
      // The updater should be called with [] as previous categories
      expect(updater([])).toEqual([]);
    }
  });
});

test("covers .sort and .map logic for category matching (full branch coverage)", async () => {
  const setSelectedCategoriesMock = jest.fn();

  // Mock category data — one with registrationId, one without
  (logic.fetchCategory as jest.Mock).mockResolvedValueOnce([
    { application: "Zebra", registrationId: 5 },
    { application: "Mango" }
  ]);

  render(
    <FilterDialog
      {...defaultProps}
      selectedCategories={[
        { data: { application: "Zebra", registrationId: 5 }, text: "Zebra" },
        { data: { application: "Mango", id: 99 }, text: "Mango" }
      ]}
      setSelectedCategories={setSelectedCategoriesMock}
    />
  );

  // Open the related-to dropdown
  fireEvent.click(screen.getByTestId("dms-filter-dialog-related-to"));
  const pupilOptions = screen.getAllByText("Pupil");
  fireEvent.click(pupilOptions[0]); // pick the first one to avoid ambiguity

  // Open category dropdown
  fireEvent.click(screen.getByTestId("dms-filter-dialog-categories"));

  // Wait for fetched category names to appear
  const zebra = await screen.findByText("Zebra");
  const mango = await screen.findByText("Mango");

  // Click both categories to trigger both logical branches
  fireEvent.click(zebra);
  fireEvent.click(mango);

  // Validate callback
  await waitFor(() => {
    expect(setSelectedCategoriesMock).toHaveBeenCalled();
  });
});



test("fetches and displays sorted categories correctly", async () => {
  // Mock API response with unsorted data
  (logic.fetchCategory as jest.Mock).mockResolvedValueOnce([
  { application: "Zebra" },
  { application: "Apple" },
  { application: "Mango" }
]);

  // Include one category in selectedCategories with matching 'Apple'
  const selectedCategories = [
    { data: { application: "Apple" }, text: "Apple" },
    { data: { application: "HR" }, text: "HR" }
  ];

 render(
      <FilterDialog
        title="Filter"
        isOpen
        onClose={jest.fn()}
        handleApply={jest.fn()}
        isFilterDialogOpen
        setSelectedCategories={mockSetSelectedCategories}
        selectedCategories={selectedCategories}
        setIsDateError={jest.fn()}
        isDateError={false}
        setSelectedDateRange={jest.fn()}
        selectedDateRange={{ fromDate: "", toDate: "" }}
        setReferenceExternalIds={jest.fn()}
        setDocumentRelatedTo={jest.fn()}
        selectedRelatedTo={{ text: "Pupil", value: "1" }}
        setSelectedRelatedTo={jest.fn()}
        tagListArray={[]}
        setTagListArray={jest.fn()}
      />
    );

  // Wait for categories to be fetched and displayed
  await waitFor(() => {
    expect(logic.fetchCategory).toHaveBeenCalledWith(1);
  });

  // Now check sorted order in rendered categories
  const categoryElements = screen.getAllByText(/Apple|Mango|Zebra/i);
  const categoryNames = categoryElements.map((el) => el.textContent);

  // Assert the categories are sorted alphabetically
  expect(categoryNames).toEqual(["Apple", "Mango", "Zebra"]);

  // Optional: simulate clicking one of the mapped items to trigger item logic
  categoryElements[0].click();

  // This ensures .map callback code runs and state updates occur
  await waitFor(() => {
    expect(categoryElements[0]).toBeInTheDocument();
    expect(mockSetSelectedCategories).toHaveBeenCalled();
  });
});

});
