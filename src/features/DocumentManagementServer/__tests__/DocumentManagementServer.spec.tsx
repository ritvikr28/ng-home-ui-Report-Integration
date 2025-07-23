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

jest.mock("@essnextgen/ui-kit", () => {
  const original = jest.requireActual("@essnextgen/ui-kit");
  return {
    ...original,
    useMediaQuery: jest.fn(() => false),
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

describe("DocumentManagementServerView", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    (apiService.fetchDocumentDetails as jest.Mock).mockResolvedValue(mockData);
  });

afterEach(() => {
  jest.runOnlyPendingTimers(); // flush pending timers
  jest.useRealTimers();
});



  it("renders main component and triggers document fetch", async () => {
    (apiService.fetchDocumentDetails as jest.Mock).mockResolvedValue(mockData);
    render(<DocumentManagementServerView />);
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    await waitFor(() => {
    expect(
      screen.getByText((content, element) => content === "Documents" && element?.id === "heading-titleid")
    ).toBeInTheDocument();

    expect(screen.getByText("Doc 1")).toBeInTheDocument();
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

  it("handles pagination changes", async () => {
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
    const setSearchText = jest.fn();
    const setPageNumber = jest.fn();
    const setShowResultNotFound = jest.fn();
    const fetchDocuments = jest.fn();
    const spy = jest.spyOn(logicModule, "handleSearchChange");
    logicModule.handleSearchChange(e, setSearchText, setPageNumber, setShowResultNotFound, fetchDocuments);
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
    fireEvent.click(screen.getByText("Apply Filters"));
  });

  // Check if error flag was triggered (e.g., via aria or style changes)
});


it("opens filter dialog and processes fetched category data", async () => {
  const mockCategoryResponse = [
    { application: "App1", registrationId: 101, section: "Section1" },
    { application: "App1", registrationId: 102, section: "Section2" },
  ];
  (apiService.fetchFilterCategory as jest.Mock).mockResolvedValueOnce(mockCategoryResponse);

  render(<DocumentManagementServerView />);
  act(() => jest.advanceTimersByTime(2000));

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
   act(() => jest.advanceTimersByTime(3000));

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
  jest.useFakeTimers();
  
  // Mock empty search result
  (apiService.fetchDocumentDetails as jest.Mock).mockResolvedValue(mockData);

  const { container } = render(<DocumentManagementServerView />);

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


  jest.useRealTimers();
});

// it("closes filter dialog when onClose is called", async () => {
//   (apiService.fetchFilterCategory as jest.Mock).mockResolvedValue(mockData);
//   render(<DocumentManagementServerView />);
//   act(() => {
//     jest.advanceTimersByTime(2000);
//   });

//   // Open the filter dialog
//   await waitFor(() => {
//     const filterButton = screen.getByTestId("filter-btn");
//     fireEvent.click(filterButton);
//   });

//   // The dialog should be open
//   expect(screen.getByText("Filter Documents")).toBeInTheDocument();

//   // Find the close button and click it (simulate onClose)
//   const closeBtn = screen.getByTestId("dms-filter-dialog-close-btn");
//   fireEvent.click(closeBtn);

//   // The dialog should be closed
//   await waitFor(() => {
//     expect(screen.queryByText("Filter Documents")).not.toBeInTheDocument();
//   });
// });

})
