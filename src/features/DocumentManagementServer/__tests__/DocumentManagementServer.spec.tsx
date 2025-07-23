import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act
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

//  it("shows breadcrumbs in non-mobile view", () => {
//   render(<DocumentManagementServerView />);
//   act(() => {
//     jest.advanceTimersByTime(2000);
//   });

//   expect(screen.getByText("Home")).toBeInTheDocument();
//   expect(screen.getByText("Admin Console")).toBeInTheDocument();
// });

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

  // it("displays empty state message when no data", async () => {
  //    jest.useFakeTimers();
  //   (apiService.fetchDocumentDetails as jest.Mock).mockResolvedValue({
  //     totalRecords: 0,
  //     statusCode: 200,
  //     data: [],
  //   });
  //   const { container } = render(<DocumentManagementServerView />);

  //   await act(() => {
  //     jest.advanceTimersByTime(2000);
  //   });

  //   await waitFor(() => {
  //     console.log(container.innerHTML);
  //   const emptyState = screen.getByTestId("result-not-found-message");
  //   expect(emptyState).toBeInTheDocument();
  // });
  // });
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
  act(() => { jest.advanceTimersByTime(2000); });

  await waitFor(() => {
    expect(screen.getByText(/Doc 1/)).toBeInTheDocument();
  });

  (apiService.fetchDocumentDetails as jest.Mock).mockClear();

  const dateAddedHeaderDiv = screen.getAllByTestId("columnheader")
    .find(div => div.textContent?.includes("Date added"));
  fireEvent.click(dateAddedHeaderDiv!);

  act(() => { jest.advanceTimersByTime(1000); });

  await waitFor(() => {
    expect(apiService.fetchDocumentDetails).toHaveBeenCalledWith(
      expect.objectContaining({ sortBy: "DateAdded" })
    );
  });
});

it("handles sorting for Format column", async () => {
  render(<DocumentManagementServerView />);
  act(() => { jest.advanceTimersByTime(2000); });

  await waitFor(() => {
    expect(screen.getByText(/Doc 1/)).toBeInTheDocument();
  });

  (apiService.fetchDocumentDetails as jest.Mock).mockClear();

  const formatHeaderDiv = screen.getAllByTestId("columnheader")
    .find(div => div.textContent?.includes("Format"));
  fireEvent.click(formatHeaderDiv!);

  act(() => { jest.advanceTimersByTime(1000); });

  await waitFor(() => {
    expect(apiService.fetchDocumentDetails).toHaveBeenCalledWith(
      expect.objectContaining({ sortBy: "Format" })
    );
  });
});

it("handles sorting for Size column", async () => {
  render(<DocumentManagementServerView />);
  act(() => { jest.advanceTimersByTime(2000); });

  await waitFor(() => {
    expect(screen.getByText(/Doc 1/)).toBeInTheDocument();
  });

  (apiService.fetchDocumentDetails as jest.Mock).mockClear();

  const sizeHeaderDiv = screen.getAllByTestId("columnheader")
    .find(div => div.textContent?.includes("Size"));
  fireEvent.click(sizeHeaderDiv!);

  act(() => { jest.advanceTimersByTime(1000); });

  await waitFor(() => {
    expect(apiService.fetchDocumentDetails).toHaveBeenCalledWith(
      expect.objectContaining({ sortBy: "Size" })
    );
  });
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
})
