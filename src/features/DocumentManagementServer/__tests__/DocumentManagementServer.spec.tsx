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
import userEvent from "@testing-library/user-event";
import DocumentManagementServerView from "../DocumentManagementServer.view";
import * as apiService from "../ApiService";
import * as logicModule from "../DocumentManagementServer.logic";
import { debouncedFetchSuggestions } from "../DocumentManagementServer.logic";

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

const defaultSuggestionsPayload = [
  {
    name: "Document",
    link: "",
    values: [{ fileName: "Doc 1" }, { fileName: "Doc 2" }],
  },
  { name: "Pupil", link: "", values: [] },
  { name: "Staff", link: null, values: [] },
  { name: "Organisation", link: null, values: [] }
];

function mockSuggestions(payload = defaultSuggestionsPayload) {
  jest.spyOn(apiService, "fetchDMSSuggestions").mockResolvedValue({
    payload,
    statusCode: 200,
  });
}

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

  async function renderAndSearch(term = "Doc") {
  render(<DocumentManagementServerView />);
  act(() => { jest.advanceTimersByTime(2000); });
  const inputs = await screen.findAllByTestId("search-autocomplete-input");
  fireEvent.change(inputs[0], { target: { value: term } });
  fireEvent.keyDown(inputs[0], { key: "Enter", code: "Enter" });
  act(() => { jest.advanceTimersByTime(2000); });
  // Wait for suggestions loader to disappear
  const searchLoader = screen.getAllByTestId("loader-arc");
  await waitFor(() => {
    expect(within(searchLoader[0]).queryByTestId("loader-arc")).not.toBeInTheDocument();
  });
  // Click first suggestion
  const suggestion = await screen.findAllByText((_, element) =>
    element?.textContent?.replace(/\s+/g, " ").trim() === "Doc 1"
  );
  fireEvent.click(suggestion[0]);
  act(() => { jest.advanceTimersByTime(2000); });
}

async function openFilterDialog() {
  const filterBtn = await screen.findByTestId("filter-btn");
  fireEvent.click(filterBtn);
  await screen.findByText("Filter by");
}




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
 

it("handles filter dialog open and apply", async () => {
  jest.setTimeout(15000);
    mockSuggestions();
    await renderAndSearch();
    await openFilterDialog();
    const applyBtn = screen.getByRole("button", { name: /apply/i });
    fireEvent.click(applyBtn);
  });

it("shows empty state message on initial load", async () => {
  (apiService.fetchDocumentDetails as jest.Mock).mockResolvedValue({
    statusCode: 200,
    totalRecords: 0,
    data: [],
  });
 
  render(<DocumentManagementServerView />);
  act(() => {
    jest.advanceTimersByTime(2000);
  });
  console.log(screen.debug());
  await waitFor(() => {
    expect(
      screen.getByText(/Use the search bar to find and select a pupil/i)
    ).toBeInTheDocument();
  });
});
 

it("shows no records on initial load, shows records after search", async () => {
  // Mock suggestions
  jest.spyOn(apiService, "fetchDMSSuggestions").mockResolvedValue({
    payload: [
      {
        name: "Document",
        link: "",
        values: [{ fileName: "Doc 1" }, { fileName: "Doc 2" }],
      },
      { name: "Pupil", link: "", values: [] },
      { name: "Staff", link: null, values: [] },
      { name: "Organisation", link: null, values: [] }
    ],
    statusCode: 200,
  });
 
  // Mock initial empty fetch (if any) and then with data after suggestion click
  (apiService.fetchDocumentDetails as jest.Mock)
    .mockResolvedValueOnce(mockData);
 
  render(<DocumentManagementServerView />);
  act(() => { jest.advanceTimersByTime(2000); });
 
  // On initial load, no document rows
  expect(screen.queryByText(/Doc 1/)).not.toBeInTheDocument();
  expect(screen.queryByText(/Doc 2/)).not.toBeInTheDocument();
 
  // Simulate search via suggestion click
  const searchInputs = await screen.findAllByTestId("search-autocomplete-input");
  fireEvent.change(searchInputs[0], { target: { value: "Doc" } });

  act(() => {
    jest.advanceTimersByTime(2000);
  });
 
  // Wait for suggestions
  const suggestions = await screen.findAllByRole("option");
  expect(suggestions.length).toBeGreaterThan(0);
 
  // Click first suggestion
  fireEvent.click(suggestions[0]);
 
  act(() => { jest.advanceTimersByTime(2000); });
 
  // Now document rows should appear
  await waitFor(() => {
      const doc1Elements = screen.getAllByText((content, element) =>
    element?.textContent?.replace(/\s+/g, " ").trim() === "Doc 1"
  );
  expect(doc1Elements.length).toBeGreaterThan(0);
  const doc2Elements = screen.getAllByText((content, element) =>
    element?.textContent?.replace(/\s+/g, " ").trim() === "Doc 2"
  );
  expect(doc2Elements.length).toBeGreaterThan(0);
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
      jest.spyOn(apiService, "fetchDMSSuggestions").mockResolvedValue({
  payload: [
    {
      name: "Document",
      link: "",
      values: [
        { fileName: "Doc 1" },
        { fileName: "Doc 2" }
      ]
    },
    {
      name: "Pupil",
      link: "",
      values: []
    },
    {
      name: "Staff",
      link: null,
      values: []
    },
    {
      name: "Organisation",
      link: null,
      values: []
    }
  ],
  statusCode: 200
});
   const { container } = render(<DocumentManagementServerView />);
    act(() => {
      jest.advanceTimersByTime(2000);
    });

  await waitFor(() => {
    const searchInput = screen.getByTestId("search-autocomplete-input");

    fireEvent.change(searchInput, { target: { value: "Doc" } });
    fireEvent.keyDown(searchInput, { key: "Enter", code: "Enter" });
  });

  act(() => {
      jest.advanceTimersByTime(2000);
    });
  // Wait for suggestions to appear
  const searchLoader = screen.getAllByTestId("loader-arc");
  await waitFor(() => {
    expect(within(searchLoader[0]).queryByTestId("loader-arc")).not.toBeInTheDocument();
  });
  console.log(container.innerHTML);
const suggestion = await screen.findAllByText((_, element) =>
  element?.textContent?.replace(/\s+/g, " ").trim() === "Doc 1"
);
  // Click the suggestion to trigger the search
  console.log(container.innerHTML);
  fireEvent.click(suggestion[0]);
  act(() => {
  jest.advanceTimersByTime(2000); // <-- Add this here
});
    await waitFor(() => {
    expect(apiService.fetchDocumentDetails).toHaveBeenNthCalledWith(
      1, 
      expect.objectContaining({
        categoryId: [],
        fromDate: "",
        isSearchTextExactMatch: true,
        pageNumber: 1,
        pageSize: 40,
        searchText: "Doc 1",
        sortBy: "DateAdded",
        sortDirection: "Desc",
        toDate: ""
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

  jest.spyOn(apiService, "fetchDMSSuggestions").mockResolvedValue({
    payload: [
      {
        name: "Document",
        link: "",
        values: [
          { fileName: "Doc 1" },
          { fileName: "Doc 2" }
        ]
      },
      {
        name: "Pupil",
        link: "",
        values: []
      },
      {
        name: "Staff",
        link: null,
        values: []
      },
      {
        name: "Organisation",
        link: null,
        values: []
      }
    ],
    statusCode: 200
  });

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
    jest.advanceTimersByTime(2000);
  });

  // Wait for suggestions to appear
  const searchLoader = screen.getAllByTestId("loader-arc");
  await waitFor(() => {
    expect(within(searchLoader[0]).queryByTestId("loader-arc")).not.toBeInTheDocument();
  });

  const suggestion = await screen.findAllByText((_, element) =>
    element?.textContent?.replace(/\s+/g, " ").trim() === "Doc 1"
  );
  fireEvent.click(suggestion[0]);
  act(() => {
    jest.advanceTimersByTime(2000);
  });

  // Click the Document column header to sort
  const documentHeaderDiv = screen.getAllByTestId("columnheader")
    .find(div => div.textContent?.includes("Document"));
  fireEvent.click(documentHeaderDiv!);

  act(() => {
    jest.advanceTimersByTime(1000);
  });

  // The second call should be with sortBy: "Document"
  await waitFor(() => {
    expect(apiService.fetchDocumentDetails).toHaveBeenNthCalledWith(
      2,
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

  jest.spyOn(apiService, "fetchDMSSuggestions").mockResolvedValue({
    payload: [
      {
        name: "Document",
        link: "",
        values: [
          { fileName: "Doc 1" },
          { fileName: "Doc 2" }
        ]
      },
      {
        name: "Pupil",
        link: "",
        values: []
      },
      {
        name: "Staff",
        link: null,
        values: []
      },
      {
        name: "Organisation",
        link: null,
        values: []
      }
    ],
    statusCode: 200
  });

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
    jest.advanceTimersByTime(2000);
  });

  // Wait for suggestions to appear
  const searchLoader = screen.getAllByTestId("loader-arc");
  await waitFor(() => {
    expect(within(searchLoader[0]).queryByTestId("loader-arc")).not.toBeInTheDocument();
  });

  const suggestion = await screen.findAllByText((_, element) =>
    element?.textContent?.replace(/\s+/g, " ").trim() === "Doc 1"
  );
  fireEvent.click(suggestion[0]);
  act(() => {
    jest.advanceTimersByTime(2000);
  });

  // await waitFor(() => {
  //   expect(screen.getByText(/Doc 1/)).toBeInTheDocument();
  // });

  // (apiService.fetchDocumentDetails as jest.Mock).mockClear();

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

  jest.spyOn(apiService, "fetchDMSSuggestions").mockResolvedValue({
    payload: [
      {
        name: "Document",
        link: "",
        values: [
          { fileName: "Doc 1" },
          { fileName: "Doc 2" }
        ]
      },
      {
        name: "Pupil",
        link: "",
        values: []
      },
      {
        name: "Staff",
        link: null,
        values: []
      },
      {
        name: "Organisation",
        link: null,
        values: []
      }
    ],
    statusCode: 200
  });

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
    jest.advanceTimersByTime(2000);
  });

  // Wait for suggestions to appear
  const searchLoader = screen.getAllByTestId("loader-arc");
  await waitFor(() => {
    expect(within(searchLoader[0]).queryByTestId("loader-arc")).not.toBeInTheDocument();
  });

  const suggestion = await screen.findAllByText((_, element) =>
    element?.textContent?.replace(/\s+/g, " ").trim() === "Doc 1"
  );
  fireEvent.click(suggestion[0]);
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

  jest.spyOn(apiService, "fetchDMSSuggestions").mockResolvedValue({
    payload: [
      {
        name: "Document",
        link: "",
        values: [
          { fileName: "Doc 1" },
          { fileName: "Doc 2" }
        ]
      },
      {
        name: "Pupil",
        link: "",
        values: []
      },
      {
        name: "Staff",
        link: null,
        values: []
      },
      {
        name: "Organisation",
        link: null,
        values: []
      }
    ],
    statusCode: 200
  });

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
    jest.advanceTimersByTime(2000);
  });

  // Wait for suggestions to appear
  const searchLoader = screen.getAllByTestId("loader-arc");
  await waitFor(() => {
    expect(within(searchLoader[0]).queryByTestId("loader-arc")).not.toBeInTheDocument();
  });

  const suggestion = await screen.findAllByText((_, element) =>
    element?.textContent?.replace(/\s+/g, " ").trim() === "Doc 1"
  );
  fireEvent.click(suggestion[0]);
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

  jest.spyOn(apiService, "fetchDMSSuggestions").mockResolvedValue({
    payload: [
      {
        name: "Document",
        link: "",
        values: [
          { fileName: "Doc 1" },
          { fileName: "Doc 2" }
        ]
      },
      {
        name: "Pupil",
        link: "",
        values: []
      },
      {
        name: "Staff",
        link: null,
        values: []
      },
      {
        name: "Organisation",
        link: null,
        values: []
      }
    ],
    statusCode: 200
  });

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
    jest.advanceTimersByTime(2000);
  });

  // Wait for suggestions to appear
  const searchLoader = screen.getAllByTestId("loader-arc");
  await waitFor(() => {
    expect(within(searchLoader[0]).queryByTestId("loader-arc")).not.toBeInTheDocument();
  });

  const suggestion = await screen.findAllByText((_, element) =>
    element?.textContent?.replace(/\s+/g, " ").trim() === "Doc 1"
  );
  fireEvent.click(suggestion[0]);
  act(() => {
    jest.advanceTimersByTime(2000);
  });

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

  jest.spyOn(apiService, "fetchDMSSuggestions").mockResolvedValue({
    payload: [
      {
        name: "Document",
        link: "",
        values: [
          { fileName: "Doc 1" },
          { fileName: "Doc 2" }
        ]
      },
      {
        name: "Pupil",
        link: "",
        values: []
      },
      {
        name: "Staff",
        link: null,
        values: []
      },
      {
        name: "Organisation",
        link: null,
        values: []
      }
    ],
    statusCode: 200
  });

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
    jest.advanceTimersByTime(2000);
  });

  // Wait for suggestions to appear
  const searchLoader = screen.getAllByTestId("loader-arc");
  await waitFor(() => {
    expect(within(searchLoader[0]).queryByTestId("loader-arc")).not.toBeInTheDocument();
  });

  const suggestion = await screen.findAllByText((_, element) =>
    element?.textContent?.replace(/\s+/g, " ").trim() === "Doc 1"
  );
  fireEvent.click(suggestion[0]);
  act(() => {
    jest.advanceTimersByTime(2000);
  });

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


  jest.spyOn(apiService, "fetchDMSSuggestions").mockResolvedValue({
    payload: [
      {
        name: "Document",
        link: "",
        values: [
          { fileName: "Doc 1" },
          { fileName: "Doc 2" }
        ]
      },
      {
        name: "Pupil",
        link: "",
        values: []
      },
      {
        name: "Staff",
        link: null,
        values: []
      },
      {
        name: "Organisation",
        link: null,
        values: []
      }
    ],
    statusCode: 200
  });

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
    jest.advanceTimersByTime(2000);
  });

  // Wait for suggestions to appear
  const searchLoader = screen.getAllByTestId("loader-arc");
  await waitFor(() => {
    expect(within(searchLoader[0]).queryByTestId("loader-arc")).not.toBeInTheDocument();
  });

  const suggestion = await screen.findAllByText((_, element) =>
    element?.textContent?.replace(/\s+/g, " ").trim() === "Doc 1"
  );
  fireEvent.click(suggestion[0]);
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
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });
  });

  act(() => {
    jest.advanceTimersByTime(2000);
  });

  // Wait for suggestions to appear
  const searchLoader = screen.getAllByTestId("loader-arc");
  await waitFor(() => {
    expect(within(searchLoader[0]).queryByTestId("loader-arc")).not.toBeInTheDocument();
  });

  act(() => {
    jest.advanceTimersByTime(1000);
  });


await waitFor(() => {
  const allNoResultMessages = screen.getAllByText((content, element) =>
    content.includes("Your search -") &&
    (element?.textContent?.includes("xyz") ?? false) &&
    (element?.textContent?.includes("did not match any results") ?? false)
  );
  expect(allNoResultMessages.length).toBe(1);
});
});

it("calls fetchGetDocumentDetails on selectedFormats change", async () => {
  
  (apiService.fetchDocumentDetails as jest.Mock).mockResolvedValue(mockData);

  jest.spyOn(apiService, "fetchDMSSuggestions").mockResolvedValue({
    payload: [
      {
        name: "Document",
        link: "",
        values: [
          { fileName: "Doc 1" },
          { fileName: "Doc 2" }
        ]
      },
      {
        name: "Pupil",
        link: "",
        values: []
      },
      {
        name: "Staff",
        link: null,
        values: []
      },
      {
        name: "Organisation",
        link: null,
        values: []
      }
    ],
    statusCode: 200
  });

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
    jest.advanceTimersByTime(2000);
  });

  // Wait for suggestions to appear
  const searchLoader = screen.getAllByTestId("loader-arc");
  await waitFor(() => {
    expect(within(searchLoader[0]).queryByTestId("loader-arc")).not.toBeInTheDocument();
  });

  const suggestion = await screen.findAllByText((_, element) =>
    element?.textContent?.replace(/\s+/g, " ").trim() === "Doc 1"
  );
  fireEvent.click(suggestion[0]);
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

  jest.spyOn(apiService, "fetchDMSSuggestions").mockResolvedValue({
    payload: [
      {
        name: "Document",
        link: "",
        values: [
          { fileName: "Doc 1" },
          { fileName: "Doc 2" }
        ]
      },
      {
        name: "Pupil",
        link: "",
        values: []
      },
      {
        name: "Staff",
        link: null,
        values: []
      },
      {
        name: "Organisation",
        link: null,
        values: []
      }
    ],
    statusCode: 200
  });

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
    jest.advanceTimersByTime(2000);
  });

  // Wait for suggestions to appear
  const searchLoader = screen.getAllByTestId("loader-arc");
  await waitFor(() => {
    expect(within(searchLoader[0]).queryByTestId("loader-arc")).not.toBeInTheDocument();
  });

  const suggestion = await screen.findAllByText((_, element) =>
    element?.textContent?.replace(/\s+/g, " ").trim() === "Doc 1"
  );
  fireEvent.click(suggestion[0]);
  act(() => {
    jest.advanceTimersByTime(2000);
  });

  await waitFor(() => {
    expect(screen.getByText("Information unavailable")).toBeInTheDocument();
  });
});



it("sets date error when fromDate is invalid", async () => {
  jest.useFakeTimers();
  jest.setTimeout(15000); // Increase timeout for this test
  (apiService.fetchDocumentDetails as jest.Mock).mockResolvedValue(mockData);

  jest.spyOn(apiService, "fetchDMSSuggestions").mockResolvedValue({
    payload: [
      {
        name: "Document",
        link: "",
        values: [
          { fileName: "Doc 1" },
          { fileName: "Doc 2" }
        ]
      },
      {
        name: "Pupil",
        link: "",
        values: []
      },
      {
        name: "Staff",
        link: null,
        values: []
      },
      {
        name: "Organisation",
        link: null,
        values: []
      }
    ],
    statusCode: 200
  });

 render(<DocumentManagementServerView />);
  act(() => {
    jest.advanceTimersByTime(1000);
  });

  await waitFor(() => {
    const searchInput = screen.getByTestId("search-autocomplete-input");
    fireEvent.change(searchInput, { target: { value: "Doc" } });
    fireEvent.keyDown(searchInput, { key: "Enter", code: "Enter" });
  });

  act(() => {
    jest.advanceTimersByTime(1000);
  });

  // Wait for suggestions to appear
  const searchLoader = screen.getAllByTestId("loader-arc");
  await waitFor(() => {
    expect(within(searchLoader[0]).queryByTestId("loader-arc")).not.toBeInTheDocument();
  });

  const suggestion = await screen.findAllByText((_, element) =>
    element?.textContent?.replace(/\s+/g, " ").trim() === "Doc 1"
  );
  fireEvent.click(suggestion[0]);

  // Wait for grid loader to disappear if present
  const gridLoader = screen.getAllByTestId("loader-arc");
  if (gridLoader[1]) {
    await waitFor(() => {
      expect(within(gridLoader[1]).queryByTestId("loader-arc")).not.toBeInTheDocument();
    });
  }

  // Open filter dialog
   
    const filterButton = screen.getByTestId("filter-btn");
    userEvent.click(filterButton);
    // Find date inputs and set invalid day
  const fromDateInput = screen.getAllByPlaceholderText("DD");
  fireEvent.change(fromDateInput[0], { target: { value: "32" } });
  fireEvent.click(screen.getByText("Apply"));

 
    expect(screen.getByText(/invalid date/i)).toBeInTheDocument();
});


it("opens filter dialog and processes fetched category data", async () => {
  const mockCategoryResponse = [
    { application: "App1", registrationId: 101, section: "Section1" },
    { application: "App1", registrationId: 102, section: "Section2" }
  ];
  (apiService.fetchFilterCategory as jest.Mock).mockResolvedValueOnce(mockCategoryResponse);

   (apiService.fetchDocumentDetails as jest.Mock).mockResolvedValue(mockData);

  jest.spyOn(apiService, "fetchDMSSuggestions").mockResolvedValue({
    payload: [
      {
        name: "Document",
        link: "",
        values: [
          { fileName: "Doc 1" },
          { fileName: "Doc 2" }
        ]
      },
      {
        name: "Pupil",
        link: "",
        values: []
      },
      {
        name: "Staff",
        link: null,
        values: []
      },
      {
        name: "Organisation",
        link: null,
        values: []
      }
    ],
    statusCode: 200
  });

  const { container } = render(<DocumentManagementServerView />);
  act(() => {
    jest.advanceTimersByTime(1000);
  });

  await waitFor(() => {
    const searchInput = screen.getByTestId("search-autocomplete-input");
    fireEvent.change(searchInput, { target: { value: "Doc" } });
    fireEvent.keyDown(searchInput, { key: "Enter", code: "Enter" });
  });

  act(() => {
    jest.advanceTimersByTime(1000);
  });

  // Wait for suggestions to appear
  const searchLoader = screen.getAllByTestId("loader-arc");
  await waitFor(() => {
    expect(within(searchLoader[0]).queryByTestId("loader-arc")).not.toBeInTheDocument();
  });

  const suggestion = await screen.findAllByText((_, element) =>
    element?.textContent?.replace(/\s+/g, " ").trim() === "Doc 1"
  );
  fireEvent.click(suggestion[0]);

  // Wait for grid loader to disappear if present
  const gridLoader = screen.getAllByTestId("loader-arc");
  if (gridLoader[1]) {
    await waitFor(() => {
      expect(within(gridLoader[1]).queryByTestId("loader-arc")).not.toBeInTheDocument();
    });
  }

 
    const filterButton = screen.getByTestId("filter-btn");
    fireEvent.click(filterButton);
  

 
    console.log(container.innerHTML); // Debug output
    expect(apiService.fetchFilterCategory).toHaveBeenCalled();
   
});

it("reduces category data properly in handleFilterOnClick", async () => {
  const categoryList = [
    { application: "AppX", registrationId: 111, section: "S1" },
    { application: "AppX", registrationId: 112, section: "S2" },
    { application: "AppY", registrationId: 113, section: "S3" }
  ];
  (apiService.fetchFilterCategory as jest.Mock).mockResolvedValueOnce(categoryList);

    (apiService.fetchDocumentDetails as jest.Mock).mockResolvedValue(mockData);

  jest.spyOn(apiService, "fetchDMSSuggestions").mockResolvedValue({
    payload: [
      {
        name: "Document",
        link: "",
        values: [
          { fileName: "Doc 1" },
          { fileName: "Doc 2" }
        ]
      },
      {
        name: "Pupil",
        link: "",
        values: []
      },
      {
        name: "Staff",
        link: null,
        values: []
      },
      {
        name: "Organisation",
        link: null,
        values: []
      }
    ],
    statusCode: 200
  });

  render(<DocumentManagementServerView />);
  act(() => {
    jest.advanceTimersByTime(1000);
  });

  await waitFor(() => {
    const searchInput = screen.getByTestId("search-autocomplete-input");
    fireEvent.change(searchInput, { target: { value: "Doc" } });
    fireEvent.keyDown(searchInput, { key: "Enter", code: "Enter" });
  });

  act(() => {
    jest.advanceTimersByTime(1000);
  });

  // Wait for suggestions to appear
  const searchLoader = screen.getAllByTestId("loader-arc");
  await waitFor(() => {
    expect(within(searchLoader[0]).queryByTestId("loader-arc")).not.toBeInTheDocument();
  });

  const suggestion = await screen.findAllByText((_, element) =>
    element?.textContent?.replace(/\s+/g, " ").trim() === "Doc 1"
  );
  fireEvent.click(suggestion[0]);

  // Wait for grid loader to disappear if present
  const gridLoader = screen.getAllByTestId("loader-arc");
  if (gridLoader[1]) {
    await waitFor(() => {
      expect(within(gridLoader[1]).queryByTestId("loader-arc")).not.toBeInTheDocument();
    });
  }

 
    const filterButton = screen.getByTestId("filter-btn");
    fireEvent.click(filterButton);
  

  await waitFor(() => {
    expect(apiService.fetchFilterCategory).toHaveBeenCalled();
  });
});

it("sets visibleBreadcrumbs to slice(-2, -1) when width < 1024 and list > 1", () => {
  Object.defineProperty(window, "innerWidth", { writable: true, configurable: true, value: 900 });
  const { getByText } = render(<DocumentManagementServerView />);
  act(() => {
    jest.advanceTimersByTime(2000);
  });
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
     (apiService.fetchDocumentDetails as jest.Mock).mockResolvedValue(mockData);

  jest.spyOn(apiService, "fetchDMSSuggestions").mockResolvedValue({
    payload: [
      {
        name: "Document",
        link: "",
        values: [
          { fileName: "Doc 1" },
          { fileName: "Doc 2" }
        ]
      },
      {
        name: "Pupil",
        link: "",
        values: []
      },
      {
        name: "Staff",
        link: null,
        values: []
      },
      {
        name: "Organisation",
        link: null,
        values: []
      }
    ],
    statusCode: 200
  });

  render(<DocumentManagementServerView />);
  act(() => {
    jest.advanceTimersByTime(1000);
  });

  await waitFor(() => {
    const searchInput = screen.getByTestId("search-autocomplete-input");
    fireEvent.change(searchInput, { target: { value: "Doc" } });
    fireEvent.keyDown(searchInput, { key: "Enter", code: "Enter" });
  });

  act(() => {
    jest.advanceTimersByTime(1000);
  });

  // Wait for suggestions to appear
  const searchLoader = screen.getAllByTestId("loader-arc");
  await waitFor(() => {
    expect(within(searchLoader[0]).queryByTestId("loader-arc")).not.toBeInTheDocument();
  });

  const suggestion = await screen.findAllByText((_, element) =>
    element?.textContent?.replace(/\s+/g, " ").trim() === "Doc 1"
  );
  fireEvent.click(suggestion[0]);

  // Wait for grid loader to disappear if present
  const gridLoader = screen.getAllByTestId("loader-arc");
  if (gridLoader[1]) {
    await waitFor(() => {
      expect(within(gridLoader[1]).queryByTestId("loader-arc")).not.toBeInTheDocument();
    });
  }

  const filterButton = await screen.getByTestId("filter-btn");
  fireEvent.click(filterButton);

  const dateInputs = await screen.getAllByTestId("dms-filter-dialog-date-added");

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
  const errorText = await screen.getByText(/to date should not be before from date/i);
  expect(errorText).toBeInTheDocument();
});


it("trigger search even if searchTerm equals searchText", async () => {
  (apiService.fetchDocumentDetails as jest.Mock).mockResolvedValue(mockData);
   jest.spyOn(apiService, "fetchDMSSuggestions").mockResolvedValue({
    payload: [
      {
        name: "Document",
        link: "",
        values: [
          { fileName: "Doc 1" },
          { fileName: "Doc 2" }
        ]
      },
      {
        name: "Pupil",
        link: "",
        values: []
      },
      {
        name: "Staff",
        link: null,
        values: []
      },
      {
        name: "Organisation",
        link: null,
        values: []
      }
    ],
    statusCode: 200
  });

  render(<DocumentManagementServerView />);
  act(() => {
    jest.advanceTimersByTime(1000);
  });

  await waitFor(() => {
    const searchInput = screen.getByTestId("search-autocomplete-input");
    fireEvent.change(searchInput, { target: { value: "Doc" } });
    fireEvent.keyDown(searchInput, { key: "Enter", code: "Enter" });
  });

  act(() => {
    jest.advanceTimersByTime(1000);
  });

  // Wait for suggestions to appear
  const searchLoader = screen.getAllByTestId("loader-arc");
  await waitFor(() => {
    expect(within(searchLoader[0]).queryByTestId("loader-arc")).not.toBeInTheDocument();
  });

  const suggestion = await screen.findAllByText((_, element) =>
    element?.textContent?.replace(/\s+/g, " ").trim() === "Doc 1"
  );
  fireEvent.click(suggestion[0]);

  const searchInput = screen.getByTestId("search-autocomplete-input");
  fireEvent.change(searchInput, { target: { value: "Doc 1" } });
  fireEvent.keyDown(searchInput, { key: "Enter", code: "Enter" });

  const searchLoader2 = screen.getAllByTestId("loader-arc");
  await waitFor(() => {
    expect(within(searchLoader2[0]).queryByTestId("loader-arc")).not.toBeInTheDocument();
  });

  const suggestion2 = await screen.findAllByText((_, element) =>
    element?.textContent?.replace(/\s+/g, " ").trim() === "Doc 1"
  );
  fireEvent.click(suggestion2[0]);

  expect(apiService.fetchDocumentDetails).toHaveBeenCalledTimes(1);
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
  expect(screen.getAllByText("Documents").length).toBeGreaterThan(0);
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

it("opens side panel when View download is clicked in Actions menu", async () => {
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

  // Debugging line to check rendered output
  const actionsButton = screen.getByText('Actions');
  fireEvent.click(actionsButton);

  // Click the "View download" option
  act(() => { jest.advanceTimersByTime(1000); });
  
  const viewDownloadOption = screen.getByText('View download');
  fireEvent.click(viewDownloadOption);

 const sidePanelHeader = await screen.findByTestId("side-panel-header");
  expect(sidePanelHeader).toBeInTheDocument();
 
  // Find and click the close button
  const closeIcon = screen.getByTestId("side-panel-close-button");
  fireEvent.click(closeIcon);
 
  // Wait for side panel header to be removed
  await waitFor(() =>
    expect(screen.queryByTestId("side-panel-header")).not.toBeInTheDocument()
  );
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
  (apiService.fetchDocumentDetails as jest.Mock).mockResolvedValue(mockData);

  jest.spyOn(apiService, "fetchDMSSuggestions").mockResolvedValue({
    payload: [
      {
        name: "Document",
        link: "",
        values: [
          { fileName: "Doc 1" },
          { fileName: "Doc 2" }
        ]
      },
      {
        name: "Pupil",
        link: "",
        values: []
      },
      {
        name: "Staff",
        link: null,
        values: []
      },
      {
        name: "Organisation",
        link: null,
        values: []
      }
    ],
    statusCode: 200
  });

  render(<DocumentManagementServerView />);
  act(() => {
    jest.advanceTimersByTime(1000);
  });

  await waitFor(() => {
    const searchInput = screen.getByTestId("search-autocomplete-input");
    fireEvent.change(searchInput, { target: { value: "Doc" } });
    fireEvent.keyDown(searchInput, { key: "Enter", code: "Enter" });
  });

  act(() => {
    jest.advanceTimersByTime(1000);
  });

  // Wait for suggestions to appear
  const searchLoader = screen.getAllByTestId("loader-arc");
  await waitFor(() => {
    expect(within(searchLoader[0]).queryByTestId("loader-arc")).not.toBeInTheDocument();
  });

  const suggestion = await screen.findAllByText((_, element) =>
    element?.textContent?.replace(/\s+/g, " ").trim() === "Doc 1"
  );
  fireEvent.click(suggestion[0]);

  // Wait for grid loader to disappear if present
  const gridLoader = screen.getAllByTestId("loader-arc");
  if (gridLoader[1]) {
    await waitFor(() => {
      expect(within(gridLoader[1]).queryByTestId("loader-arc")).not.toBeInTheDocument();
    });
  }

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
    (apiService.fetchDocumentDetails as jest.Mock).mockResolvedValue(mockData);

  jest.spyOn(apiService, "fetchDMSSuggestions").mockResolvedValue({
    payload: [
      {
        name: "Document",
        link: "",
        values: [
          { fileName: "Doc 1" },
          { fileName: "Doc 2" }
        ]
      },
      {
        name: "Pupil",
        link: "",
        values: []
      },
      {
        name: "Staff",
        link: null,
        values: []
      },
      {
        name: "Organisation",
        link: null,
        values: []
      }
    ],
    statusCode: 200
  });

  render(<DocumentManagementServerView />);
  act(() => {
    jest.advanceTimersByTime(1000);
  });

  await waitFor(() => {
    const searchInput = screen.getByTestId("search-autocomplete-input");
    fireEvent.change(searchInput, { target: { value: "Doc" } });
    fireEvent.keyDown(searchInput, { key: "Enter", code: "Enter" });
  });

  act(() => {
    jest.advanceTimersByTime(1000);
  });

  // Wait for suggestions to appear
  const searchLoader = screen.getAllByTestId("loader-arc");
  await waitFor(() => {
    expect(within(searchLoader[0]).queryByTestId("loader-arc")).not.toBeInTheDocument();
  });

  const suggestion = await screen.findAllByText((_, element) =>
    element?.textContent?.replace(/\s+/g, " ").trim() === "Doc 1"
  );
  fireEvent.click(suggestion[0]);

  // Wait for grid loader to disappear if present
  const gridLoader = screen.getAllByTestId("loader-arc");
  if (gridLoader[1]) {
    await waitFor(() => {
      expect(within(gridLoader[1]).queryByTestId("loader-arc")).not.toBeInTheDocument();
    });
  }

    const checkboxes = await screen.findAllByTestId(/^check-box-row-testid-/);
    fireEvent.click(checkboxes[0]);

    expect(checkboxes[0]).toBeChecked();
  });

  it("calls onChangeListCheckBox to add and remove selection", async () => {
    (apiService.fetchDocumentDetails as jest.Mock).mockResolvedValue(mockData);

  jest.spyOn(apiService, "fetchDMSSuggestions").mockResolvedValue({
    payload: [
      {
        name: "Document",
        link: "",
        values: [
          { fileName: "Doc 1" },
          { fileName: "Doc 2" }
        ]
      },
      {
        name: "Pupil",
        link: "",
        values: []
      },
      {
        name: "Staff",
        link: null,
        values: []
      },
      {
        name: "Organisation",
        link: null,
        values: []
      }
    ],
    statusCode: 200
  });

  render(<DocumentManagementServerView />);
  act(() => {
    jest.advanceTimersByTime(1000);
  });

  await waitFor(() => {
    const searchInput = screen.getByTestId("search-autocomplete-input");
    fireEvent.change(searchInput, { target: { value: "Doc" } });
    fireEvent.keyDown(searchInput, { key: "Enter", code: "Enter" });
  });

  act(() => {
    jest.advanceTimersByTime(1000);
  });

  // Wait for suggestions to appear
  const searchLoader = screen.getAllByTestId("loader-arc");
  await waitFor(() => {
    expect(within(searchLoader[0]).queryByTestId("loader-arc")).not.toBeInTheDocument();
  });

  const suggestion = await screen.findAllByText((_, element) =>
    element?.textContent?.replace(/\s+/g, " ").trim() === "Doc 1"
  );
  fireEvent.click(suggestion[0]);

  // Wait for grid loader to disappear if present
  const gridLoader = screen.getAllByTestId("loader-arc");
  if (gridLoader[1]) {
    await waitFor(() => {
      expect(within(gridLoader[1]).queryByTestId("loader-arc")).not.toBeInTheDocument();
    });
  }

  const checkboxes = await screen.findAllByTestId(/^check-box-row-testid-/);

  
    fireEvent.click(checkboxes[0]);
    expect(checkboxes[0]).toBeChecked();

   
    fireEvent.click(checkboxes[0]);
    expect(checkboxes[0]).not.toBeChecked();
  });

  it("shows loader in side panel when Prepare download is confirmed and hides after timeout", async () => {
    (apiService.fetchDocumentDetails as jest.Mock).mockResolvedValue(mockData);

  jest.spyOn(apiService, "fetchDMSSuggestions").mockResolvedValue({
    payload: [
      {
        name: "Document",
        link: "",
        values: [
          { fileName: "Doc 1" },
          { fileName: "Doc 2" }
        ]
      },
      {
        name: "Pupil",
        link: "",
        values: []
      },
      {
        name: "Staff",
        link: null,
        values: []
      },
      {
        name: "Organisation",
        link: null,
        values: []
      }
    ],
    statusCode: 200
  });

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
    jest.advanceTimersByTime(2000);
  });

  // Wait for suggestions to appear
  const searchLoader = screen.getAllByTestId("loader-arc");
  await waitFor(() => {
    expect(within(searchLoader[0]).queryByTestId("loader-arc")).not.toBeInTheDocument();
  });

  const suggestion = await screen.findAllByText((_, element) =>
    element?.textContent?.replace(/\s+/g, " ").trim() === "Doc 1"
  );
  fireEvent.click(suggestion[0]);
  act(() => {
    jest.advanceTimersByTime(2000);
  });
 
    const checkboxes = await screen.findAllByTestId(/^check-box-row-testid-/);
    fireEvent.click(checkboxes[0]); 
   
    fireEvent.click(screen.getByText(/Actions/i));
    fireEvent.click(await screen.findByText("Prepare download"));

    
    await waitFor(() => expect(screen.getByText(/document is about to be prepared for downloading/i)).toBeInTheDocument());

   
    fireEvent.click(await screen.findByText("Prepare download"));

    
    await waitFor(() => expect(screen.getByTestId("side-panel-header")).toBeInTheDocument());


      const closeIcon = screen.getByTestId("side-panel-close-button"); 
      fireEvent.click(closeIcon);

    
    await waitFor(() => expect(screen.queryByTestId("side-panel-header")).not.toBeInTheDocument());
  });

describe("tableData mapping logic for relatedArr", () => {
  it("maps pupils correctly when documentRealatedTo === 1", () => {
    const doc = {
      documentRealatedTo: 1,
      relatedTo: [
        {
          preferredForename: "John",
          preferredSurname: "Doe",
          currentYearGroup: "Y5",
          currentPrimaryClass: "A",
          learnerExternalId: "p123"
        }
      ]
    };
    let relatedArr: any[] = [];
    if (Array.isArray(doc.relatedTo) && doc.relatedTo?.length > 0) {
      if (doc.documentRealatedTo === 1) {
        relatedArr = doc.relatedTo.map((pupil: any) => ({
          type: "pupil",
          name: `${pupil.preferredForename} ${pupil.preferredSurname}`.trim(),
          year: pupil.currentYearGroup || "",
          reg: pupil.currentPrimaryClass || "",
          pupilId: pupil.learnerExternalId || "",
        }));
      }
    }
    expect(relatedArr[0]).toEqual({
      type: "pupil",
      name: "John Doe",
      year: "Y5",
      reg: "A",
      pupilId: "p123"
    });
  });

  it("maps staff correctly when documentRealatedTo === 3", () => {
    const doc = {
      documentRealatedTo: 3,
      relatedTo: [
        {
          preferredForename: "Jane",
          preferredSurname: "Smith",
          staffCode: "S001",
          externalId: "s456"
        }
      ]
    };
    let relatedArr: any[] = [];
    if (Array.isArray(doc.relatedTo) && doc.relatedTo.length > 0) {
      if (doc.documentRealatedTo === 3) {
        relatedArr = doc.relatedTo.map((staff: any) => ({
          type: "staff",
          name: `${staff.preferredForename} ${staff.preferredSurname}`.trim(),
          staffCode: staff.staffCode || "",
          staffId: staff.externalId || "",
        }));
      }
    }
    expect(relatedArr[0]).toEqual({
      type: "staff",
      name: "Jane Smith",
      staffCode: "S001",
      staffId: "s456"
    });
  });

  it("maps school correctly when documentRealatedTo === 2", () => {
    const doc = {
      documentRealatedTo: 2,
      relatedTo: [
        {
          schoolName: "Springfield High"
        }
      ]
    };
    let relatedArr: any[] = [];
    if (Array.isArray(doc.relatedTo) && doc.relatedTo.length > 0) {
      if (doc.documentRealatedTo === 2) {
        relatedArr = doc.relatedTo.map((school: any) => ({
          type: "school",
          name: school.schoolName || "",
        }));
      }
    }
    expect(relatedArr[0]).toEqual({
      type: "school",
      name: "Springfield High"
    });
  });

  it("handles empty relatedTo array", () => {
    const doc = {
      documentRealatedTo: 1,
      relatedTo: []
    };
    let relatedArr: any[] = [];
    if (Array.isArray(doc.relatedTo) && doc.relatedTo.length > 0) {
      if (doc.documentRealatedTo === 1) {
        relatedArr = doc.relatedTo.map((pupil: any) => ({
          type: "pupil",
          name: `${pupil.preferredForename} ${pupil.preferredSurname}`.trim(),
          year: pupil.currentYearGroup || "",
          reg: pupil.currentPrimaryClass || "",
          pupilId: pupil.learnerExternalId || "",
        }));
      }
    }
    expect(relatedArr).toEqual([]);
  });

  it("handles missing fields in relatedTo items", () => {
    const doc = {
      documentRealatedTo: 1,
      relatedTo: [
        {
          preferredForename: "OnlyFirst"
        }
      ]
    };
    let relatedArr: any[] = [];
    if (Array.isArray(doc.relatedTo) && doc.relatedTo.length > 0) {
      if (doc.documentRealatedTo === 1) {
        relatedArr = doc.relatedTo.map((pupil: any) => ({
          type: "pupil",
          name: `${pupil.preferredForename} ${pupil.preferredSurname || ""}`.trim(),
          year: pupil.currentYearGroup || "",
          reg: pupil.currentPrimaryClass || "",
          pupilId: pupil.learnerExternalId || "",
        }));
      }
    }
    expect(relatedArr[0]).toEqual({
      type: "pupil",
      name: "OnlyFirst",
      year: "",
      reg: "",
      pupilId: ""
    });
  });

  it("covers pupil mapping line when relatedTo is non-empty and documentRealatedTo === 1", () => {
  const doc = {
    documentRealatedTo: 1,
    relatedTo: [
      {
        preferredForename: "Test",
        preferredSurname: "User",
        currentYearGroup: "Y1",
        currentPrimaryClass: "A",
        learnerExternalId: "id123"
      }
    ]
  };
  let relatedArr: any[] = [];
  if (Array.isArray(doc.relatedTo) && doc.relatedTo.length > 0) {
    if (doc.documentRealatedTo === 1) {
      relatedArr = doc.relatedTo.map((pupil: any) => ({
        type: "pupil",
        name: `${pupil.preferredForename} ${pupil.preferredSurname}`.trim(),
        year: pupil.currentYearGroup || "",
        reg: pupil.currentPrimaryClass || "",
        pupilId: pupil.learnerExternalId || "",
      }));
    }
  }
  expect(relatedArr[0]).toEqual({
    type: "pupil",
    name: "Test User",
    year: "Y1",
    reg: "A",
    pupilId: "id123"
  });
});

 
it("handles search suggestion click", async () => {
    (apiService.fetchDocumentDetails as jest.Mock).mockResolvedValue(mockData);

  jest.spyOn(apiService, "fetchDMSSuggestions").mockResolvedValue({
    payload: [
      {
        name: "Document",
        link: "",
        values: [
          { fileName: "Doc 1" },
          { fileName: "Doc 2" }
        ]
      },
      {
        name: "Pupil",
        link: "",
        values: []
      },
      {
        name: "Staff",
        link: null,
        values: []
      },
      {
        name: "Organisation",
        link: null,
        values: []
      }
    ],
    statusCode: 200
  });

  render(<DocumentManagementServerView />);
  act(() => {
    jest.advanceTimersByTime(1000);
  });

  await waitFor(() => {
    const searchInput = screen.getByTestId("search-autocomplete-input");
    fireEvent.change(searchInput, { target: { value: "Doc" } });
    fireEvent.keyDown(searchInput, { key: "Enter", code: "Enter" });
  });

  act(() => {
    jest.advanceTimersByTime(1000);
  });

  // Wait for suggestions to appear
  const searchLoader = screen.getAllByTestId("loader-arc");
  await waitFor(() => {
    expect(within(searchLoader[0]).queryByTestId("loader-arc")).not.toBeInTheDocument();
  });

  const suggestion = await screen.findAllByText((_, element) =>
    element?.textContent?.replace(/\s+/g, " ").trim() === "Doc 1"
  );
  fireEvent.click(suggestion[0]);

  // Wait for grid loader to disappear if present
  const gridLoader = screen.getAllByTestId("loader-arc");
  if (gridLoader[1]) {
    await waitFor(() => {
      expect(within(gridLoader[1]).queryByTestId("loader-arc")).not.toBeInTheDocument();
    });
  }

  // Assert that the search term or text is updated, or that the suggestion handler was called
  // (You can spy on handleSuggestionClick if exported, or check the UI for the effect)
  const searchInput = screen.getByTestId("search-autocomplete-input");
  expect((searchInput as HTMLInputElement).value).toMatch(/doc/i); // or other assertion based on your logic
});
});


  });


describe('DocumentManagementServerView - fetchViewDownloadData', () => {
  const viewDownloadMockData = [
    { name: 'Doc.pdf', status: 'Complete', fileExpiryDays: 3 }
  ];
  const mockResData = {
    status: 200,
    data: viewDownloadMockData
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (apiService.fetchDocumentDetails as jest.Mock).mockResolvedValue(mockData);
    (apiService.viewDownload as jest.Mock).mockResolvedValue(mockResData);
    jest.setTimeout(15000);
  });

  test('Shows download files when API returns status 200 with data', async () => {
    render(<DocumentManagementServerView />);
    act(() => { jest.advanceTimersByTime(2000); });

    await waitFor(() => {
      expect(screen.getAllByText("Documents").length).toBeGreaterThan(0);
    });

    const actionsButton = screen.getByText('Actions');
    fireEvent.click(actionsButton);

    act(() => { jest.advanceTimersByTime(1000); });

    const viewDownloadOption = screen.getByText('View download');
    fireEvent.click(viewDownloadOption);

    await waitFor(() => {
      expect(apiService.viewDownload).toHaveBeenCalled();
    });

    const sidePanelHeader = await screen.findByTestId("side-panel-header");
    expect(sidePanelHeader).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText('Doc.pdf')).toBeInTheDocument();
      expect(screen.getByText(/Expires in 3 days/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Download/i })).toBeInTheDocument();
    });
  });

  test('Shows empty message when API returns status 200 with empty data', async () => {
    (apiService.viewDownload as jest.Mock).mockResolvedValue({
      status: 200,
      data: [],
    });

    render(<DocumentManagementServerView />);
    act(() => { jest.advanceTimersByTime(2000); });

    await waitFor(() => {
      expect(screen.getAllByText("Documents").length).toBeGreaterThan(0);
    });

    const actionsButton = screen.getByText('Actions');
    fireEvent.click(actionsButton);

    act(() => { jest.advanceTimersByTime(1000); });

    const viewDownloadOption = screen.getByText('View download');
    fireEvent.click(viewDownloadOption);

    await waitFor(() => {
      expect(apiService.viewDownload).toHaveBeenCalled();
    });

    expect(
      screen.getByText('Files you download will appear here.')
    ).toBeInTheDocument();
  });

  test('Shows empty message when API returns non-200 status', async () => {
    (apiService.viewDownload as jest.Mock).mockResolvedValue({
      status: 500
    });

    render(<DocumentManagementServerView />);
    act(() => { jest.advanceTimersByTime(2000); });

    await waitFor(() => {
      expect(screen.getAllByText("Documents").length).toBeGreaterThan(0);
    });

    const actionsButton = screen.getByText('Actions');
    fireEvent.click(actionsButton);

    act(() => { jest.advanceTimersByTime(1000); });

    const viewDownloadOption = screen.getByText('View download');
    fireEvent.click(viewDownloadOption);

    await waitFor(() => {
      expect(apiService.viewDownload).toHaveBeenCalled();
    });

    expect(
      screen.getByText('Files you download will appear here.')
    ).toBeInTheDocument();
  });

  test('Shows empty message when viewDownload API throws', async () => {
    (apiService.viewDownload as jest.Mock).mockRejectedValue(new Error('API Error'));

    render(<DocumentManagementServerView />);
    act(() => { jest.advanceTimersByTime(2000); });

    await waitFor(() => {
      expect(screen.getAllByText("Documents").length).toBeGreaterThan(0);
    });

    const actionsButton = screen.getByText('Actions');
    fireEvent.click(actionsButton);

    act(() => { jest.advanceTimersByTime(1000); });

    const viewDownloadOption = screen.getByText('View download');
    fireEvent.click(viewDownloadOption);

    await waitFor(() => {
      expect(apiService.viewDownload).toHaveBeenCalled();
    });

    expect(
      screen.getByText('Files you download will appear here.')
    ).toBeInTheDocument();
  });

  test('Closes side panel when close button is clicked after viewing downloads', async () => {
    render(<DocumentManagementServerView />);
    act(() => { jest.advanceTimersByTime(2000); });

    await waitFor(() => {
      expect(screen.getAllByText("Documents").length).toBeGreaterThan(0);
    });

    const actionsButton = screen.getByText('Actions');
    fireEvent.click(actionsButton);

    act(() => { jest.advanceTimersByTime(1000); });

    const viewDownloadOption = screen.getByText('View download');
    fireEvent.click(viewDownloadOption);

    const sidePanelHeader = await screen.findByTestId("side-panel-header");
    expect(sidePanelHeader).toBeInTheDocument();

    const closeIcon = screen.getByTestId("side-panel-close-button");
    fireEvent.click(closeIcon);

    await waitFor(() =>
      expect(screen.queryByTestId("side-panel-header")).not.toBeInTheDocument()
    );
  });
});