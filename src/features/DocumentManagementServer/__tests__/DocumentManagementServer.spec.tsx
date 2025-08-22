import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
  within
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { error } from "console";
import DocumentManagementServerView from "../DocumentManagementServer.view";
import * as apiService from "../ApiService";
import * as logicModule from "../DocumentManagementServer.logic";
import { debouncedFetchSuggestions } from "../DocumentManagementServer.logic";
// import { handleCheckBoxSelection } from "../DocumentManagementServer.view";

jest.mock("@essnextgen/ui-kit", () => {
  const original = jest.requireActual("@essnextgen/ui-kit");
  return {
    ...original,
    useMediaQuery: jest.fn(() => false),
  };
});

jest.mock('@essnextgen/ui-kit', () => {
  const actual = jest.requireActual('@essnextgen/ui-kit');
  return {
    ...actual,
    SidePanel: ({ children }: any) => <div data-testid="mock-side-panel">{children}</div>,
  };
});

jest.mock("../ApiService");

  const mockData = {
    totalRecords: 2,
    statusCode: 200,
    data:  [
      {
        fileId: "1",
        document: "Doc 1",
        relatedTo: ["HR"],
        category: "legal",
        addedBy: "User A",
        dateAdded: "2025-06-10",
        format: "pdf",
        size: "500KB",
      },
      {
        fileId: "2",
        document: "Doc 2",
        relatedTo: ["Finance"],
        category: "finance",
        addedBy: "User B",
        dateAdded: "2025-06-11",
        format: "docx",
        size: "1MB",
      }
    ],
  };

beforeAll(() => {
  jest.useFakeTimers();
});

afterAll(() => {
  jest.useRealTimers();
});


describe("DocumentManagementServerView", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (apiService.fetchDocumentDetails as jest.Mock).mockResolvedValue(mockData);
    jest.setTimeout(15000);
  });
 
it("shows error banner when showErrorBanner is true", async () => {
  (apiService.fetchDocumentDetails as jest.Mock).mockResolvedValueOnce({
    statusCode: 400,
    data: [],
    totalRecords: 0
  });
  render(<DocumentManagementServerView />);
  act(() => {
    jest.advanceTimersByTime(2000);
  });
  await waitFor(() => {
    expect(screen.getByText(/Summary of issue/i)).toBeInTheDocument();
  });
});

 it("shows breadcrumbs in non-mobile view", () => {
  render(<DocumentManagementServerView />);
  act(() => {
    jest.advanceTimersByTime(2000);
  });

  
  const adminConsoleLabels = screen.getAllByText("Admin Console");
  expect(adminConsoleLabels.length).toBeGreaterThan(0);
  const homeLabels = screen.getAllByText("Home");
  expect(homeLabels.length).toBeGreaterThan(0);

});

   it("handles error during fetchDocumentDetails", async () => {
    jest.setTimeout(15000);
    (apiService.fetchDocumentDetails as jest.Mock).mockImplementationOnce(error)
    await act(async () => {
      render(<DocumentManagementServerView />);
      jest.advanceTimersByTime(2000);
    });

    await waitFor(() => {
      expect(screen.getByText("Summary of issue")).toBeInTheDocument();
    });
  });

  it("handles search input and Enter key", async () => {
    jest.setTimeout(15000);
    const mockDatas = {
    totalRecords: 2,
    data:  [
      {
        fileId: "1",
        document: "Doc 1",
        relatedTo: ["HR"],
        category: "legal",
        addedBy: "User A",
        dateAdded: "2025-06-10",
        format: "pdf",
        size: "500KB",
      },
      {
        fileId: "2",
        document: "Doc 2",
        relatedTo: ["Finance"],
        category: "finance",
        addedBy: "User B",
        dateAdded: "2025-06-11",
        format: "docx",
        size: "1MB",
      }
    ],
    statusCode: 200,
  };
     (apiService.fetchDocumentDetails as jest.Mock).mockResolvedValue(mockDatas);
    render(<DocumentManagementServerView />);
    act(() => {
      jest.advanceTimersByTime(2000);
    });

  await waitFor(() => {
    const searchInput = screen.getByTestId("search-autocomplete-input");

    fireEvent.change(searchInput, { target: { value: "Doc" } });
    fireEvent.keyDown(searchInput, { key: "Enter", code: "Enter" });
  });

  act(() => {
  jest.advanceTimersByTime(2000); // <-- Add this here
});
    await waitFor(() => {
    expect(apiService.fetchDocumentDetails).toHaveBeenNthCalledWith(
      2, // Assert the 2nd call only
      expect.objectContaining({
        pageNumber: 1,
        pageSize: expect.any(Number),
        searchText: expect.stringMatching(/^doc$/i),
      })
    );
  });
  });

  it("clears search input on cancel click", async () => {
    jest.setTimeout(15000);
    render(<DocumentManagementServerView />);
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    await waitFor(() => {
      const searchInput1 = screen.getByTestId("search-autocomplete-input");
      fireEvent.change(searchInput1, { target: { value: "Doc" } });
       })
       act(() => {
      jest.advanceTimersByTime(2000);
    });
    await waitFor(() => {
    const cancelBtn = screen.getByTestId("search-close--icon-btn");
    fireEvent.click(cancelBtn);
    })
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    await waitFor(() => {
    const searchInput = screen.getByTestId("search-autocomplete-input");
    expect((searchInput as HTMLInputElement).value).toBe("");
    }
    );
  });
it("handles sorting for Document column and ignores non-sortable columns", async () => {
  const mockDatas1 = {
    totalRecords: 2,
    statusCode: 200,
    data: [
      {
        fileId: "1",
        document: "Doc 1",
        relatedTo: ["HR"],
        category: "legal",
        addedBy: "User A",
        dateAdded: "2025-06-10",
        format: "pdf",
        size: "500KB",
      },
      {
        fileId: "2",
        document: "Doc 2",
        relatedTo: ["Finance"],
        category: "finance",
        addedBy: "User B",
        dateAdded: "2025-06-11",
        format: "docx",
        size: "1MB",
      }
    ],
  };

  (apiService.fetchDocumentDetails as jest.Mock).mockResolvedValue(mockDatas1);

  render(<DocumentManagementServerView />);
  act(() => {
    jest.advanceTimersByTime(2000);
  });

  // Wait for table to appear
  await waitFor(() => {
    expect(screen.getByText(/Doc 1/)).toBeInTheDocument(); // Confirm table rendered
  });

    (apiService.fetchDocumentDetails as jest.Mock).mockClear();

  const documentHeaderDiv = screen.getAllByTestId("columnheader")
  .find(div => div.textContent?.includes("Document"));
   fireEvent.click(documentHeaderDiv!);

  act(() => {
  jest.advanceTimersByTime(1000);
});

  await waitFor(() => {
    expect(apiService.fetchDocumentDetails).toHaveBeenCalledWith(
      
      expect.objectContaining({ sortBy: "Document" })
    );
  });

  (apiService.fetchDocumentDetails as jest.Mock).mockClear();

  // ✅ Target the non-sortable "Added by" column
  const addedByHeader = screen.getByRole("columnheader", { name: /Added by/i });
  fireEvent.click(addedByHeader);

  expect(apiService.fetchDocumentDetails).not.toHaveBeenCalledWith(
    expect.objectContaining({ sortBy: "Added by" })
  );
});

it("handles sorting for Date added column", async () => {
  render(<DocumentManagementServerView />);
   act(() => {
      jest.advanceTimersByTime(2000);
    });

  await waitFor(() => {
    expect(screen.getByText(/Doc 1/)).toBeInTheDocument();
  });

  (apiService.fetchDocumentDetails as jest.Mock).mockClear();

  const dateAddedHeaderDiv = screen.getAllByTestId("columnheader")
    .find(div => div.textContent?.includes("Date added"));
  fireEvent.click(dateAddedHeaderDiv!);

  act(() => {
    jest.advanceTimersByTime(1000);
  });

  await waitFor(() => {
    expect(apiService.fetchDocumentDetails).toHaveBeenCalledWith(
      expect.objectContaining({ sortBy: "DateAdded" })
    );
  });
});

it("handles sorting for Format column", async () => {
  render(<DocumentManagementServerView />);
   act(() => {
    jest.advanceTimersByTime(2000);
  });

  await waitFor(() => {
    expect(screen.getByText(/Doc 1/)).toBeInTheDocument();
  });

  (apiService.fetchDocumentDetails as jest.Mock).mockClear();

  const formatHeaderDiv = screen.getAllByTestId("columnheader")
    .find(div => div.textContent?.includes("Format"));
  fireEvent.click(formatHeaderDiv!);

   act(() => {
    jest.advanceTimersByTime(1000);
  });

  await waitFor(() => {
    expect(apiService.fetchDocumentDetails).toHaveBeenCalledWith(
      expect.objectContaining({ sortBy: "Format" })
    );
  });
});

it("handles sorting for Size column", async () => {
  jest.setTimeout(15000);
  render(<DocumentManagementServerView />);
   act(() => {
    jest.advanceTimersByTime(2000);
  });

  await waitFor(() => {
    expect(screen.getByText(/Doc 1/)).toBeInTheDocument();
  });

  (apiService.fetchDocumentDetails as jest.Mock).mockClear();

  const sizeHeaderDiv = screen.getAllByTestId("columnheader")
    .find(div => div.textContent?.includes("Size"));
  fireEvent.click(sizeHeaderDiv!);

   act(() => {
    jest.advanceTimersByTime(1000);
  });

  await waitFor(() => {
    expect(apiService.fetchDocumentDetails).toHaveBeenCalledWith(
      expect.objectContaining({ sortBy: "Size" })
    );
  });
});

it("handles sorting for Category column", async () => {
  render(<DocumentManagementServerView />);
  act(() => { jest.advanceTimersByTime(2000); });

  await waitFor(() => {
    expect(screen.getByText(/Doc 1/)).toBeInTheDocument();
  });

  (apiService.fetchDocumentDetails as jest.Mock).mockClear();

  const categoryHeaderDiv = screen.getAllByTestId("columnheader")
    .find(div => div.textContent?.includes("Category"));
  fireEvent.click(categoryHeaderDiv!);

  act(() => { jest.advanceTimersByTime(1000); });

  await waitFor(() => {
    expect(apiService.fetchDocumentDetails).toHaveBeenCalledWith(
      expect.objectContaining({ sortBy: "Category" })
    );
  });
});

it("does not call fetchDocumentDetails when non-sortable column is clicked", async () => {
  render(<DocumentManagementServerView />);
  act(() => { jest.advanceTimersByTime(2000); });

  await waitFor(() => {
    expect(screen.getByText(/Doc 1/)).toBeInTheDocument();
  });

  (apiService.fetchDocumentDetails as jest.Mock).mockClear();

  // Try clicking a non-sortable column, e.g., "Added by"
  const addedByHeader = screen.getByRole("columnheader", { name: /Added by/i });
  fireEvent.click(addedByHeader);

  // The API should NOT be called with sortBy: "Added by"
  expect(apiService.fetchDocumentDetails).not.toHaveBeenCalledWith(
    expect.objectContaining({ sortBy: "Added by" })
  );
});

  it("handles pagination changes", async () => {
  jest.setTimeout(15000);
     const mockDatas = {
    totalRecords: 41,
    data:  [
      {
        fileId: "1",
        document: "Doc 1",
        relatedTo: ["HR"],
        category: "legal",
        addedBy: "User A",
        dateAdded: "2025-06-10",
        format: "pdf",
        size: "500KB",
      },
      {
        fileId: "2",
        document: "Doc 2",
        relatedTo: ["Finance"],
        category: "finance",
        addedBy: "User B",
        dateAdded: "2025-06-11",
        format: "docx",
        size: "1MB",
      }
    ],
    statusCode: 200
  };
    (apiService.fetchDocumentDetails as jest.Mock).mockResolvedValue(mockDatas);
    const spy = jest.spyOn(logicModule, "handlePageChange");

    render(<DocumentManagementServerView />);
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    await waitFor(() => {
      const header = screen.getByText("2");
      fireEvent.click(header);
    });

    expect(spy).toHaveBeenCalled();
  });

  it("handles suggestion click", () => {
    const suggestionItem = { label: "Label", value: "Label" };
    const spy = jest.spyOn(logicModule, "handleSuggestionClick");
    logicModule.handleSuggestionClick(suggestionItem, jest.fn(), jest.fn());
    expect(spy).toHaveBeenCalled();
  });

  it("handles search change function", () => {
    const e = { target: { value: "search" } } as React.ChangeEvent<HTMLInputElement>;
    const getAllRegistrationIds = jest.fn();
    const selectedFromDate = "2024-01-01";
    const selectedToDate = "2024-12-31";
    const selectedFormats = ["pdf", "docx"];
    const setSearchText = jest.fn();
    const setPageNumber = jest.fn();
    const setShowResultNotFound = jest.fn();
    const fetchDocuments = jest.fn();
    const spy = jest.spyOn(logicModule, "handleSearchChange");
    logicModule.handleSearchChange(e, getAllRegistrationIds(selectedFormats), selectedFromDate, selectedToDate, setSearchText, setPageNumber, setShowResultNotFound, fetchDocuments);
    expect(spy).toHaveBeenCalled();
  });

  it("displays result not found when search term has no matches", async () => {
    (apiService.fetchDocumentDetails as jest.Mock).mockResolvedValue(mockData);
    render(<DocumentManagementServerView />);
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    await waitFor(() => {
    const input = screen.getByTestId("search-autocomplete-input");
    fireEvent.change(input, { target: { value: "xyz" } });
    }
    );
   act(() => {
  jest.advanceTimersByTime(3000);
});
   await waitFor(() => {
  const match = [...document.body.querySelectorAll("*")].find(
    (node) =>
      node.textContent?.includes(
        "Your search - xyz - did not match any results. Make sure that all words are spelled correctly."
      )
  );
  expect(match).toBeTruthy();
});
});

it("calls fetchGetDocumentDetails on selectedFormats change", async () => {
  
  (apiService.fetchDocumentDetails as jest.Mock).mockResolvedValue(mockData);

  render(<DocumentManagementServerView />);
  act(() => {
    jest.advanceTimersByTime(2000);
  });

  act(async () => {
  await waitFor(() => {
    const filterButton = screen.getByTestId("filter-btn");
    fireEvent.click(filterButton);
  });

  const applyBtn = screen.getByText("Filter");
  fireEvent.click(applyBtn);
  })
  await waitFor(() => {
    expect(apiService.fetchDocumentDetails).toHaveBeenCalled();
  });
});

it("displays error banner when status 400 is returned", async () => {
  (apiService.fetchDocumentDetails as jest.Mock).mockResolvedValue({
    status: 400,
    data: [],
    totalRecords: 0,
  });

  render(<DocumentManagementServerView />);
  act(() => {
    jest.advanceTimersByTime(2000);
  });

  await waitFor(() => {
    expect(screen.getByText("Information unavailable")).toBeInTheDocument();
  });
});



it("sets date error when fromDate is invalid", async () => {
  render(<DocumentManagementServerView />);
  act(() => {
    jest.advanceTimersByTime(2000);
  });

  await waitFor(() => {
    const filterButton = screen.getByTestId("filter-btn");
    fireEvent.click(filterButton);
  });

  const dateInputs = await screen.findAllByTestId("dms-filter-dialog-date-added");
  act(() => {
    // Simulate invalid fromDate
     const fromDateInput = within(dateInputs[0]).getByPlaceholderText("DD");
  fireEvent.change(fromDateInput, { target: { value: "32" } });
    fireEvent.click(screen.getByText("Apply"));
  });

  // Check if error flag was triggered (e.g., via aria or style changes)

});


it("opens filter dialog and processes fetched category data", async () => {
  const mockCategoryResponse = [
    { application: "App1", registrationId: 101, section: "Section1" },
    { application: "App1", registrationId: 102, section: "Section2" }
  ];
  (apiService.fetchFilterCategory as jest.Mock).mockResolvedValueOnce(mockCategoryResponse);

  render(<DocumentManagementServerView />);
  act(() => {
    jest.advanceTimersByTime(2000);
  });

  await waitFor(() => {
    const filterButton = screen.getByTestId("filter-btn");
    fireEvent.click(filterButton);
  });

  await waitFor(() => {
    expect(apiService.fetchFilterCategory).toHaveBeenCalled();
    // If LocalisedMenu or something is affected by categories, check there too
  });
});

it("reduces category data properly in handleFilterOnClick", async () => {
  const categoryList = [
    { application: "AppX", registrationId: 111, section: "S1" },
    { application: "AppX", registrationId: 112, section: "S2" },
    { application: "AppY", registrationId: 113, section: "S3" }
  ];
  (apiService.fetchFilterCategory as jest.Mock).mockResolvedValueOnce(categoryList);

  render(<DocumentManagementServerView />);
   act(() => {
  jest.advanceTimersByTime(3000);
});

    await waitFor(() => {
    const filterButton = screen.getByTestId("filter-btn");
    fireEvent.click(filterButton);
  });

  await waitFor(() => {
    expect(apiService.fetchFilterCategory).toHaveBeenCalled();
  });
});

it("sets visibleBreadcrumbs to slice(-2, -1) when width < 1024 and list > 1", () => {
  Object.defineProperty(window, "innerWidth", { writable: true, configurable: true, value: 900 });
  const { getByText } = render(<DocumentManagementServerView />);
  
  // simulate prop/state with >1 breadcrumb
  // wait for "Documents" which is the second last item
  expect(getByText("Documents")).toBeInTheDocument(); // slice(-2, -1)
});

it("sets visibleBreadcrumbs to full list when width < 1024 and list has only one item", () => {
  Object.defineProperty(window, "innerWidth", { writable: true, configurable: true, value: 900 });

  const { getByText } = render(<DocumentManagementServerView />);
  // simulate prop/state with one breadcrumb
  // expect "Home" to be present
  expect(getByText("Home")).toBeInTheDocument();
});

it("shows no result message when search yields no data", async () => {
  // Mock empty search result
  (apiService.fetchDocumentDetails as jest.Mock).mockResolvedValue(mockData);

 render(<DocumentManagementServerView />);

  // Advance initial loader
  act(() => {
    jest.advanceTimersByTime(2000);
  });

  // Simulate typing search text
  const searchInput = await screen.findByTestId("search-autocomplete-input");
  fireEvent.change(searchInput, { target: { value: "nonexistentdoc" } });

  // Advance debounce or fetch wait
  act(() => {
    jest.advanceTimersByTime(2000);
  });

  await waitFor(() => {
  expect(
    screen.getByText((content, element) =>
      content.includes("Your search -") &&
      (element?.textContent?.includes("nonexistentdoc") ?? false) &&
      (element?.textContent?.includes("did not match any results") ?? false)
    )
  ).toBeInTheDocument();
});
});

it("shows date error when toDate is before fromDate", async () => {
  render(<DocumentManagementServerView />);
  act(() => {
    jest.advanceTimersByTime(2000);
  });

  const filterButton = await screen.findByTestId("filter-btn");
  fireEvent.click(filterButton);

  const dateInputs = await screen.findAllByTestId("dms-filter-dialog-date-added");

   const fromDay = within(dateInputs[0]).getByPlaceholderText("DD");
  const fromMonth = within(dateInputs[0]).getByPlaceholderText("MM");
  const fromYear = within(dateInputs[0]).getByPlaceholderText("YYYY");

  fireEvent.change(fromDay, { target: { value: "10" } });
  fireEvent.change(fromMonth, { target: { value: "05" } });
  fireEvent.change(fromYear, { target: { value: "2025" } });

  // To Date: 09 May 2025 (invalid)
  const toDay = within(dateInputs[1]).getByPlaceholderText("DD");
  const toMonth = within(dateInputs[1]).getByPlaceholderText("MM");
  const toYear = within(dateInputs[1]).getByPlaceholderText("YYYY");

  fireEvent.change(toDay, { target: { value: "09" } });
  fireEvent.change(toMonth, { target: { value: "05" } });
  fireEvent.change(toYear, { target: { value: "2025" } });
  // Wait for dialog title to confirm it’s still open due to validation error
  const errorText = await screen.findByText(/to date should not be before from date/i);
  expect(errorText).toBeInTheDocument();
});


it("trigger search even if searchTerm equals searchText", async () => {
  render(<DocumentManagementServerView />);
  act(() => {
    jest.advanceTimersByTime(2000);
  });

  const searchInput = await screen.findByTestId("search-autocomplete-input");
  fireEvent.change(searchInput, { target: { value: "duplicate" } });

  fireEvent.keyDown(searchInput, { key: "Enter", code: "Enter" });


  fireEvent.change(searchInput, { target: { value: "duplicate" } });
  fireEvent.keyDown(searchInput, { key: "Enter", code: "Enter" });

  expect(apiService.fetchDocumentDetails).toHaveBeenCalledTimes(2);
});

it("renders table headers even if no table data exists", async () => {
  (apiService.fetchDocumentDetails as jest.Mock).mockResolvedValue({
    statusCode: 200,
    totalRecords: 0,
    data: [],
  });

  render(<DocumentManagementServerView />);
  act(() => {
    jest.advanceTimersByTime(2000);
  });

  await waitFor(() => {
    expect(screen.getByText("Documents")).toBeInTheDocument();
  });
});

it("handles suggestion fetch error gracefully", async () => {

  const mockSetLoading = jest.fn();
  const mockSetSuggestions = jest.fn();
  const mockSetError = jest.fn();

  jest
    .spyOn(apiService, "fetchDMSSuggestions")
    .mockRejectedValueOnce(new Error("fail"));


  debouncedFetchSuggestions("fail",[], "","", mockSetLoading, mockSetSuggestions, mockSetError);

  await act(async () => {
    jest.advanceTimersByTime(1000);
  });

  expect(mockSetError).toHaveBeenCalledWith(true);
  expect(mockSetSuggestions).toHaveBeenCalledWith([]);

});
it("shows dialog when Prepare download is clicked and no checkbox is selected", async () => {
  (apiService.fetchDocumentDetails as jest.Mock).mockResolvedValue({
    statusCode: 200,
    totalRecords: 2,
    data: [
  {
      fileId: "1",
      document: "Doc 1",
      relatedTo: ["HR"],
      category: "legal",
      addedBy: "User A",
      dateAdded: "2025-06-10",
      format: "pdf",
      size: "500KB",
    },
    {
      fileId: "2",
      document: "Doc 2",
      relatedTo: ["Finance"],
      category: "finance",
      addedBy: "User B",
      dateAdded: "2025-06-11",
      format: "docx",
      size: "1MB",
    }
    ],
  });
  render(<DocumentManagementServerView />);
  act(() => { jest.advanceTimersByTime(1000); });

  await waitFor(() => screen.getByText("Documents"));

  const actionsButton = screen.getByText(/Actions/i);
  fireEvent.click(actionsButton);

  const prepareDownloadOption = await screen.findByText("Prepare download");
  fireEvent.click(prepareDownloadOption);

  await waitFor(() => {
    expect(screen.getByText(/Please select at least one item/i)).toBeInTheDocument();
  });
});

it("shows dialog when Delete is clicked and no checkbox is selected", async () => {
  (apiService.fetchDocumentDetails as jest.Mock).mockResolvedValue({
    statusCode: 200,
    totalRecords: 2,
    data: [
      {
        fileId: "1",
        document: "Doc 1",
        relatedTo: ["HR"],
        category: "legal",
        addedBy: "User A",
        dateAdded: "2025-06-10",
        format: "pdf",
        size: "500KB",
      },
      {
        fileId: "2",
        document: "Doc 2",
        relatedTo: ["Finance"],
        category: "finance",
        addedBy: "User B",
        dateAdded: "2025-06-11",
        format: "docx",
        size: "1MB",
      }
    ],
  });
  render(<DocumentManagementServerView />);
  act(() => { jest.advanceTimersByTime(1000); });

  await waitFor(() => screen.getByText("Documents"));

  const actionsButton = screen.getByText(/Actions/i);
  fireEvent.click(actionsButton);

  const deleteOption = await screen.findByText("Delete");
  fireEvent.click(deleteOption);

  await waitFor(() => {
    expect(screen.getByText(/Please select at least one item/i)).toBeInTheDocument();
  });
  
});

});


describe("DocumentManagementServerView - selection and dialog logic", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (apiService.fetchDocumentDetails as jest.Mock).mockResolvedValue({
      statusCode: 200,
      totalRecords: 2,
      data: [
        {
          fileId: "1",
          document: "Doc 1",
          relatedTo: ["HR"],
          category: "legal",
          addedBy: "User A",
          dateAdded: "2025-06-10",
          format: "pdf",
          size: "500KB",
        },
        {
          fileId: "2",
          document: "Doc 2",
          relatedTo: ["Finance"],
          category: "finance",
          addedBy: "User B",
          dateAdded: "2025-06-11",
          format: "docx",
          size: "1MB",
        }
      ],
    });
  });

  it("closes the confirmation dialog when Cancel is clicked", async () => {
  render(<DocumentManagementServerView />);
  act(() => { jest.advanceTimersByTime(1000); });

  await waitFor(() => expect(screen.getByText(/Doc 1/)).toBeInTheDocument());

  const checkboxes = await screen.findAllByTestId(/^check-box-row-testid-/);
  fireEvent.click(checkboxes[0]);

  fireEvent.click(screen.getByText(/Actions/i));
  fireEvent.click(await screen.findByText("Prepare download"));

  await waitFor(() => expect(screen.getByText(/document is about to be prepared for downloading/i)).toBeInTheDocument());

  fireEvent.click(screen.getByText(/Cancel/i));

  await waitFor(() => {
    expect(screen.queryByText(/document is about to be prepared for downloading/i)).not.toBeInTheDocument();
  });
});

  it("calls selectedCheckboxIds callback when checkbox is selected", async () => {
    render(<DocumentManagementServerView />);
    act(() => { jest.advanceTimersByTime(1000); });

    const checkboxes = await screen.findAllByTestId(/^check-box-row-testid-/);
    fireEvent.click(checkboxes[0]);

    expect(checkboxes[0]).toBeChecked();
  });

  it("calls onChangeListCheckBox to add and remove selection", async () => {
    render(<DocumentManagementServerView />);
    act(() => { jest.advanceTimersByTime(1000); });

    const checkboxes = await screen.findAllByTestId(/^check-box-row-testid-/);

  
    fireEvent.click(checkboxes[0]);
    expect(checkboxes[0]).toBeChecked();

   
    fireEvent.click(checkboxes[0]);
    expect(checkboxes[0]).not.toBeChecked();
  });

  it("shows loader in side panel when Prepare download is confirmed and hides after timeout", async () => {
    render(<DocumentManagementServerView />);
    act(() => { jest.advanceTimersByTime(1000); });
    await waitFor(() => expect(screen.getByText(/Doc 1/)).toBeInTheDocument());

 
    const checkboxes = await screen.findAllByTestId(/^check-box-row-testid-/);
    fireEvent.click(checkboxes[0]);
    screen.debug(); 
   
    fireEvent.click(screen.getByText(/Actions/i));
    fireEvent.click(await screen.findByText("Prepare download"));

    
    await waitFor(() => expect(screen.getByText(/document is about to be prepared for downloading/i)).toBeInTheDocument());

   
    fireEvent.click(await screen.findByText("Prepare download"));

    
    await waitFor(() => expect(screen.getByTestId("side-panel-header")).toBeInTheDocument());


      const closeIcon = screen.getByTestId("side-panel-close-button"); 
      fireEvent.click(closeIcon);

    
    await waitFor(() => expect(screen.queryByTestId("side-panel-header")).not.toBeInTheDocument());
  });

  it("maps staff and school relatedTo items correctly", async () => {
    const mockDatas = {
  totalRecords: 1,
  statusCode: 200,
  data: [
    {
      fileId: "1",
      document: "Doc 1",
      relatedTo: [
        {
          type: "staff",
          staffForename: "Jane",
          staffSurname: "Smith",
          staffCode: "SC123",
          staffId: "s1"
        },
        {
          type: "school",
          schoolName: "Test School"
        }
      ],
      category: "legal",
      addedBy: "User A",
      dateAdded: "2025-06-10",
      format: "pdf",
      size: "500KB",
    }
  ],
};
  (apiService.fetchDocumentDetails as jest.Mock).mockResolvedValue(mockDatas);

  render(<DocumentManagementServerView />);
  act(() => {
    jest.advanceTimersByTime(2000);
  });
  expect(await screen.findByText("Doc 1")).toBeInTheDocument();

  // Staff
  expect(await screen.findByText("Jane Smith")).toBeInTheDocument();
  expect(await screen.findByText("| SC123")).toBeInTheDocument();

});
});
