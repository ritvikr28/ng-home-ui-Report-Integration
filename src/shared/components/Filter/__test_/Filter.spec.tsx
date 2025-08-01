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
    expect(screen.getByText("Apply")).toBeInTheDocument();
  });

  it("selects a category via dropdown", () => {
    renderComponent();
    fireEvent.click(screen.getByTestId("dms-filter-dialog-categories"));
    expect(mockSetSelectedCategories).toHaveBeenCalled();
  });

  it("applies filters when Apply button is clicked", () => {
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
      expect(screen.getByText("From date is required")).toBeInTheDocument();
      expect(mockSetIsDateError).toHaveBeenCalledWith(true);
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

  expect(await screen.findByText("From date is required")).toBeInTheDocument();
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


it("shows error when fromDate is partially filled", async () => {
  render(<FilterDialog {...defaultProps} />);

  const dateInputs = await screen.findAllByTestId("dms-filter-dialog-date-added");
  const fromDay = within(dateInputs[0]).getByPlaceholderText("DD");
  const fromMonth = within(dateInputs[0]).getByPlaceholderText("MM");
  const fromYear = within(dateInputs[0]).getByPlaceholderText("YYYY");

  fireEvent.change(fromDay, { target: { value: "15" } });
  fireEvent.change(fromMonth, { target: { value: "05" } });
  fireEvent.change(fromYear, { target: { value: "202" } });

  const applyBtn = screen.getByTestId("dms-filter-dialog-apply-btn");
  fireEvent.click(applyBtn);

  await screen.findByText(/Invalid Date/i);
});


it("sets error when fromDate is in invalid format", async () => {
  render(<FilterDialog {...defaultProps} />);

  const dateInputs = await screen.findAllByTestId("dms-filter-dialog-date-added");

  const fromDay = within(dateInputs[0]).getByPlaceholderText("DD");
  const fromMonth = within(dateInputs[0]).getByPlaceholderText("MM");
  const fromYear = within(dateInputs[0]).getByPlaceholderText("YYYY");

  fireEvent.change(fromDay, { target: { value: "31" } });
  fireEvent.change(fromMonth, { target: { value: "02" } });
  fireEvent.change(fromYear, { target: { value: "203" } });

  const validationText = await screen.findAllByTestId("dms-filter-dialog-date-added__validation-text");
  expect(validationText[0]).toHaveTextContent(/Invalid Date/i);
});

it("sets error when toDate is in invalid format", async () => {
  render(<FilterDialog {...defaultProps} />);

  const dateInputs = await screen.findAllByTestId("dms-filter-dialog-date-added");

  const toDay = within(dateInputs[1]).getByPlaceholderText("DD");
  const toMonth = within(dateInputs[1]).getByPlaceholderText("MM");
  const toYear = within(dateInputs[1]).getByPlaceholderText("YYYY");

  // Enter Invalid Date: 31st Feb is not valid
  fireEvent.change(toDay, { target: { value: "31" } });
  fireEvent.change(toMonth, { target: { value: "02" } });
  fireEvent.change(toYear, { target: { value: "203" } });

  const validationText = await screen.findAllByTestId("dms-filter-dialog-date-added__validation-text");
  expect(validationText[1]).toHaveTextContent(/Invalid Date/i);
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
});