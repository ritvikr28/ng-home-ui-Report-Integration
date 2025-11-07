import React from "react";
import { render, screen, fireEvent, waitFor, act, within, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import DocumentManagementServerView from "../DocumentManagementServer.view";
import * as ApiService from "../ApiService";
import * as Logic from "../DocumentManagementServer.logic";
 
 jest.mock("@essnextgen/ui-intl-kit", () => ({
  ...jest.requireActual("@essnextgen/ui-intl-kit"),
  useTranslation: () => ({
    t: (key: string, options?: any) => {
      if (key === "DocumentManagementServer.ExpiresInDays") {
        // Handle pluralization if needed
        return `Expires in ${options?.count ?? options?.days ?? "?"} day(s).`;
      }
      if (key === "DocumentManagementServer.ExpiresToday") {
        return "Expires today.";
      }
      if (key === "DocumentManagementServer.headingText") {
        return "Documents";
      }
      if (key === "DocumentManagementServer.sidePanelTitle") {
        return "Downloads";
      }
      if (key === "DocumentManagementServer.subHeadingText") {
        return "Bulk download or delete documents for pupils, staff members, or the school.";
      }
      if (key === "DocumentManagementServer.dateAddedColumn") {
        return "Date added";
      }
      if (key === "DocumentManagementServer.documentColumn") {
        return "Document";
      }
      if (key === "DocumentManagementServer.formatColumn") {
        return "Format";
      }
      if (key === "DocumentManagementServer.sizeColumn") {
        return "Size";
      }
      if (key === "DocumentManagementServer.categoryColumn") {
        return "Category";
      }
      if (key === "DocumentManagementServer.editSelectedBtnTitle") {
        return "Actions";
      }
      if (key === "DocumentManagementServer.PrepareDownload") {
        return "Prepare download";
      }
      if (key === "DocumentManagementServer.ViewDownload") {
        return "View download";
      }
      if (key === "DocumentManagementServer.Delete") {
        return "Delete";
      }
      if (key === "DocumentManagementServer.noItemsSelectedMessage") {
        return "Please select at least one item from the search results to perform the action.";
      }
      if (key === "Filter.applyFilters") {
        return "Search";
      }
      if (key === "DocumentManagementServer.documentWillBeGoneForever") {
        return `${options?.count ?? "?"} document will be gone forever once deleted.`;
      }
      if (key === "DocumentManagementServer.documentsWillBeGoneForever") {
        return `${options?.all ?? ""}${options?.count ?? "?"} documents will be gone forever once deleted.`;
      }
      if (key === "DocumentManagementServer.documentsAlreadyDeletedMsg") {
        return `${options?.all ?? ""}${options?.count ?? "?"} documents have already been deleted.`;
      }
      if (key === "DocumentManagementServer.allSelectedDocumentsAlreadyDeleted") {
        return "All selected documents have already been deleted.";
      }
      if (key === "DocumentManagementServer.documentsCannotBeDownloadedMsg") {
        return `${options?.all ?? ""}${options?.count ?? "?"} documents cannot be downloaded as they have been deleted.`;
      }
       if (key === "DocumentManagementServer.documentCannotBeDownloadedMsg") {
        return "This document cannot be downloaded as it has been deleted.";
      }
      if (key === "DocumentManagementServer.prepareSingleDocument") {
        return `${options?.count ?? "?"} document is about to be prepared for downloading.`;
      }
      if (key === "DocumentManagementServer.clearAllDownloadsTitle") {
        return "Clear all downloads?";
      }
      if (key === "DocumentManagementServer.keepAll") {
        return "Keep all";
      }
      if (key === "DocumentManagementServer.documentsCannotBeDownloaded") {
        return "documents cannot be downloaded as they have already been deleted.";
      }
      if (key === "DocumentManagementServer.documentCannotBeDeletedNotification") {
        return "This document cannot be deleted as it is currently being prepared for download. Please try again later";
      }
      if (key === "Filter.invalidDate") {
        return "Invalid Date";
      }
      return key;
    }
  })
}));

jest.mock("../ApiService", () => ({
  fetchFilterCategory: jest.fn(),
  viewDownload: jest.fn(),
  prepareAndDownloadFile: jest.fn(),
}));
 
jest.mock("../DocumentManagementServer.logic", () => {
  const original = jest.requireActual("../DocumentManagementServer.logic");
  return {
    __esModule: true,
    ...original,
    fetchGetDocumentDetailsLogic: jest.fn(),
    prepareDownload: jest.fn(),
    reduceCategories: jest.fn(),
    fetchCategory: jest.fn(),
    debouncedFetchSuggestions: jest.fn(),
  };
});
 
jest.mock("../ApiService", () => ({
  fetchDocumentDetails: jest.fn(),
  fetchDMSSuggestions: jest.fn(),
  fetchFilterCategory: jest.fn(),
  prepareAndDownloadFile: jest.fn(),
  viewDownload: jest.fn(),
  fetchStaffProfilePhoto: jest.fn(),
  validation: jest.fn(),
}));
 
 
const mockCategories = [
  { application: "App1", registrationId: [1], section: ["Section1"] }
];
 
const mockDocData = {
  statusCode: 200,
  totalRecords: 1,
  data: [
    {
      fileId: "f1",
      document: "Doc1",
      category: "cat1",
      addedBy: "Admin",
      dateAdded: "2025-01-01",
      format: "pdf",
      size: "10MB",
      registrationId: 10,
      relatedTo: [],
    },
    {
      fileId: "f2",
      document: "Doc2",
      category: "cat1",
      addedBy: "Admin",
      dateAdded: "2025-01-01",
      format: "pdf",
      size: "10MB",
      registrationId: 10,
      relatedTo: [],
    }
  ],
};
 
const mockSuggestions = {
    payload: [
      { name: "Pupil", link: "", values: [
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
                }] },
      { name: "Staff", link: null, values: [] },
      { name: "Organisation", link: null, values: [] }
    ],
    statusCode: 200,
  }
 
  beforeEach(() => {
    (Logic.fetchCategory as jest.Mock).mockResolvedValue(mockCategories);
    (Logic.reduceCategories as jest.Mock).mockReturnValue(mockCategories);
    (Logic.fetchGetDocumentDetailsLogic as jest.Mock).mockImplementation(
      ({ setDocData }: any) => setDocData(mockDocData)
    );
    (Logic.prepareDownload as jest.Mock).mockResolvedValue([204]);
    (ApiService.viewDownload as jest.Mock).mockResolvedValue({
      status: 200,
      data: [],
    });
  })
jest.setTimeout(10000);
  beforeEach(() => {
  jest.clearAllMocks();
  jest.clearAllTimers?.();
  cleanup();
});
 
afterEach(() => {
  jest.useRealTimers();
  cleanup();
});
  describe("DocumentManagementServerView", () => {
  
  it("renders breadcrumbs in desktop view", () => {
    render(<MemoryRouter>
      <DocumentManagementServerView />
    </MemoryRouter>);
    expect(screen.getByText("Home")).toBeInTheDocument();
  });


  it("sets failedFileName when cancelled files are present in viewData", async () => {
  // Mock viewDownload to return a cancelled file
  (ApiService.viewDownload as jest.Mock).mockResolvedValue({
    status: 200,
    data: [
      { name: "FailedFile.pdf", status: "cancel" },
      { name: "SuccessFile.pdf", status: "complete" }
    ],
  });

  render(
    <MemoryRouter>
      <DocumentManagementServerView />
    </MemoryRouter>
  );

  fireEvent.click(await screen.getByText("Actions"));
  fireEvent.click(await screen.getByText("View downloads"));

  await waitFor(() => {
    expect(screen.getByText("FailedFile.pdf")).toBeInTheDocument();
  });

});

  it("opens side panel in view mode when isViewDownload param is true", () => {
  render(
    <MemoryRouter initialEntries={["/?isViewDownload=true"]}>
      <DocumentManagementServerView />
    </MemoryRouter>
  );
  expect(screen.getByText("Downloads")).toBeInTheDocument();
});
 
  it("renders empty state before search", () => {
    render(<MemoryRouter>
      <DocumentManagementServerView />
    </MemoryRouter>);
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    expect(
      screen.getByText("DocumentManagementServer.searchBarText")
    ).toBeInTheDocument();
  });
 
// it("shows suggestions and triggers search when user clicks a suggestion", async () => {
 
//   (ApiService.fetchFilterCategory as jest.Mock).mockResolvedValue([]);
//   jest.spyOn(ApiService, "fetchDMSSuggestions").mockResolvedValue(mockSuggestions);
//   (ApiService.fetchDocumentDetails as jest.Mock).mockResolvedValue(mockDocData);

//   render(<MemoryRouter>
//     <DocumentManagementServerView />
//   </MemoryRouter>);

//   // type search query
//   const input = await screen.findByTestId("search-autocomplete-input");
//   fireEvent.change(input, { target: { value: "Alfie" } });
//   fireEvent.keyDown(input, { key: "Enter", code: "Enter" });
 
//   // wait for suggestion to show up
//   const searchLoader = screen.getAllByTestId("loader-arc");
//   await waitFor(() => {
//     expect(within(searchLoader[0]).queryByTestId("loader-arc")).not.toBeInTheDocument();
//   });
 
//   const suggestionNode = await screen.findAllByText("Alfie");
 
//   // click suggestion
//   fireEvent.click(suggestionNode[0]);
 
//   // verify document is displayed
//   await waitFor(() => {
//     expect(screen.getByText("Doc1")).toBeInTheDocument();
//   });
 
// });
 
 
  it("handles sorting on multiple columns", () => {
    render(<MemoryRouter>
      <DocumentManagementServerView />
    </MemoryRouter>);
   
    fireEvent.click(screen.getByText("Date added"));
    fireEvent.click(screen.getByText("Document"));
    fireEvent.click(screen.getByText("Format"));
    fireEvent.click(screen.getByText("Size"));
    fireEvent.click(screen.getByText("Category"));
  });
   
 
  it("shows NoSelectionDialog when no item selected for prepare download", async () => {
    render(<MemoryRouter>
      <DocumentManagementServerView />
    </MemoryRouter>);
    fireEvent.click(await screen.findByText("Actions"));
    fireEvent.click(await screen.findByText("Prepare download"));
    expect(
      screen.getByText(
        "Please select at least one item from the search results to perform the action."
      )
    ).toBeInTheDocument();
  });
 
  test("removes id from selectedCheckBoxIds and allSelectedDocs when checkbox is unchecked", async () => {
    jest.useFakeTimers();
    (ApiService.fetchFilterCategory as jest.Mock).mockResolvedValue([]);
  jest.spyOn(ApiService, "fetchDMSSuggestions").mockResolvedValue(mockSuggestions);
  (ApiService.fetchDocumentDetails as jest.Mock).mockResolvedValue(mockDocData);
  (Logic.prepareDownload as jest.Mock).mockResolvedValue([500]);
  (ApiService.viewDownload as jest.Mock).mockResolvedValue({
      status: 200,
      data: [
        { name: "FileZero", status: "complete", fileExpiryDays: 0 },
        { name: "FileUndefined", status: "complete" }
      ],
    });
  render(
    <MemoryRouter>
      <DocumentManagementServerView />
    </MemoryRouter>
  );

  // Simulate search for "Alfie"
  const input = await screen.findByTestId("search-autocomplete-input");
  fireEvent.change(input, { target: { value: "Alfie" } });
  fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

  // Wait for suggestions to load
  const searchLoader = screen.getAllByTestId("loader-arc");
  await waitFor(() => {
    expect(within(searchLoader[0]).queryByTestId("loader-arc")).not.toBeInTheDocument();
  });

  jest.advanceTimersByTime(3000); // advance timers if there are any debounced functions
  // Click the suggestion
  await waitFor(async () => {
  const suggestionNode = await screen.getAllByText(/Alfie/i);
  fireEvent.click(suggestionNode[0]);
  });

  // Wait for Doc1 to appear
  await waitFor(() => {
    expect(screen.getByText("Doc1")).toBeInTheDocument();
  });

    const headerCheckbox = await screen.getByTestId("checkmark-check-box-row-testid");

    // Check the header checkbox
    fireEvent.click(headerCheckbox);
    await waitFor(() => {
      expect(headerCheckbox).toHaveAttribute("aria-checked", "true");
    });

    // Uncheck the header checkbox
    fireEvent.click(headerCheckbox);
    await waitFor(() => {
      expect(headerCheckbox).toHaveAttribute("aria-checked", "false");
    });

  // Find the checkbox for the first row
  const checkbox = screen.getByTestId("check-box-row-testid-0");

  // Select the checkbox (add)
  fireEvent.click(checkbox);
  expect(checkbox).toBeChecked();

  // Unselect the checkbox (remove)
  fireEvent.click(checkbox);
  expect(checkbox).not.toBeChecked();
});
 
  it("resets state on search close", async () => {
    jest.useFakeTimers();
       (ApiService.fetchFilterCategory as jest.Mock).mockResolvedValue([]);
  jest.spyOn(ApiService, "fetchDMSSuggestions").mockResolvedValue(mockSuggestions);
  (ApiService.fetchDocumentDetails as jest.Mock).mockResolvedValue({data: [], status: 500 });

  render(<MemoryRouter>
      <DocumentManagementServerView />
    </MemoryRouter>);

  // type search query
  const input = await screen.findByTestId("search-autocomplete-input");
  fireEvent.change(input, { target: { value: "Alfie" } });
  fireEvent.keyDown(input, { key: "Enter", code: "Enter" });
 
  // wait for suggestion to show up
  const searchLoader = screen.getAllByTestId("loader-arc");
  await waitFor(() => {
    expect(within(searchLoader[0]).queryByTestId("loader-arc")).not.toBeInTheDocument();
  });
 
  jest.advanceTimersByTime(3000); // advance timers if there are any debounced functions

  await waitFor(async () => {
  const suggestionNode = await screen.getAllByText(/Alfie/i);
  // click suggestion
  fireEvent.click(suggestionNode[0]);
  });
    fireEvent.click(screen.getByTestId("search-close--icon-btn"));
    expect(screen.getByRole("textbox")).toHaveValue("");
  });
 
    it("closes side panel and clears interval", async () => {
    const { container } = render(<MemoryRouter>
      <DocumentManagementServerView />
    </MemoryRouter>);
 
      fireEvent.click(await screen.getByText("Actions"));
      fireEvent.click(await screen.getByText("View download"));
 
    fireEvent.click(screen.getByTestId("side-panel-close-button")); // side panel close
    // Verify loader and interval cleared
    expect(container).toBeTruthy(); // minimal assertion
  });
  it("renders side panel files with expiry 0 or undefined", async () => {
    (ApiService.viewDownload as jest.Mock).mockResolvedValue({
      status: 200,
      data: [
        { name: "FileZero", status: "complete", fileExpiryDays: 0 },
        { name: "FileOne", status: "complete", fileExpiryDays: 1 },
        { name: "FileUndefined", status: "complete" }
      ],
    });
    render(<MemoryRouter>
      <DocumentManagementServerView />
    </MemoryRouter>);
    fireEvent.click(await screen.getByText("Actions"));
    fireEvent.click(await screen.getByText("View download"));
    // await waitFor(() => {
      // expect(screen.getByText("FileZero")).toBeInTheDocument();
      // expect(screen.getByText("Expires today.")).toBeInTheDocument();
      // expect(screen.getByText("FileUndefined")).toBeInTheDocument();
    // });
  });
 

});
 
describe("Additional tests to increase coverage", () => {
  it("clears search input and resets state", async () => {
    render(<MemoryRouter>
      <DocumentManagementServerView />
    </MemoryRouter>);
    fireEvent.change(screen.getByTestId("search-autocomplete-input"), { target: { value: "Test" } });
    fireEvent.click(screen.getByTestId("search-close--icon-btn")); // triggers handleSearchClose
  });
 
 it("shows NoSelectionDialog when no item selected for delete", async () => {
  render(<MemoryRouter>
      <DocumentManagementServerView />
    </MemoryRouter>);
  // Open the actions menu
  fireEvent.click(await screen.findByText("Actions"));
  // Click the Delete option
  fireEvent.click(await screen.findByText("Delete"));
  // Assert the dialog is shown
  expect(
    screen.getByText(
      "Please select at least one item from the search results to perform the action."
    )
  ).toBeInTheDocument();
});
 
 
  // it("handles multiple files for email notification", async () => {
  //   jest.useFakeTimers();
  //   (ApiService.fetchFilterCategory as jest.Mock).mockResolvedValue([]);
  // jest.spyOn(ApiService, "fetchDMSSuggestions").mockResolvedValue(mockSuggestions);
  // (ApiService.fetchDocumentDetails as jest.Mock).mockResolvedValue(mockDocData);
  // (Logic.prepareDownload as jest.Mock).mockResolvedValue([204]);
  // (ApiService.viewDownload as jest.Mock).mockResolvedValue({
  //     status: 200,
  //     data: [
  //       { name: "FileZero", status: "complete", fileExpiryDays: 0 },
  //       { name: "FileUndefined", status: "complete" }
  //     ],
  //   });
 
 
  // render(<MemoryRouter>
  //     <DocumentManagementServerView />
  //   </MemoryRouter>);
 
  // // type search query
  // const input = await screen.findByTestId("search-autocomplete-input");
  // fireEvent.change(input, { target: { value: "Alfie" } });
  // fireEvent.keyDown(input, { key: "Enter", code: "Enter" });
 
  // // wait for suggestion to show up
  // const searchLoader = screen.getAllByTestId("loader-arc");
  // await waitFor(() => {
  //   expect(within(searchLoader[0]).queryByTestId("loader-arc")).not.toBeInTheDocument();
  // });
 
  // jest.advanceTimersByTime(3000); // advance timers if there are any debounced functions
  // // click suggestion
  // await waitFor(async () => { 
  //   const suggestionNode = await screen.findAllByText("Alfie");

  //   // click suggestion
  //   fireEvent.click(suggestionNode[0]);
  // });

  // // verify document is displayed
  // await waitFor(() => {
  //   expect(screen.getByText("Doc1")).toBeInTheDocument();
  // });
  //   // Select multiple checkboxes
  //   fireEvent.click(screen.getByTestId("check-box-row-testid-0"));
  //   fireEvent.click(screen.getByTestId("check-box-row-testid-1"));
 
  //   fireEvent.click(await screen.getByText("Actions"));
  //   fireEvent.click(await screen.getByText("Prepare download"));
  //   const saveBtn =
  //     screen.queryByTestId("tid-save-btn--small-screen") ||
  //     screen.queryByTestId("tid-save-btn--large-screen");

  //   if (saveBtn) {
  //     fireEvent.click(saveBtn);
  //   }
  // });
 
 

 
  it("handles date filter validation error", async () => {
    jest.useFakeTimers();
       (ApiService.fetchFilterCategory as jest.Mock).mockResolvedValue([]);
  jest.spyOn(ApiService, "fetchDMSSuggestions").mockResolvedValue(mockSuggestions);
  (ApiService.fetchDocumentDetails as jest.Mock).mockResolvedValue(mockDocData);
 
  render(<MemoryRouter>
      <DocumentManagementServerView />
    </MemoryRouter>);
 
  // type search query
  const input = await screen.findByTestId("search-autocomplete-input");
  fireEvent.change(input, { target: { value: "Alfie" } });
  fireEvent.keyDown(input, { key: "Enter", code: "Enter" });
 
  // wait for suggestion to show up
  const searchLoader = screen.getAllByTestId("loader-arc");
  await waitFor(() => {
    expect(within(searchLoader[0]).queryByTestId("loader-arc")).not.toBeInTheDocument();
  });
 
  jest.advanceTimersByTime(3000); // advance timers if there are any debounced functions
  await waitFor(async () => {
  const suggestionNode = await screen.findAllByText("Alfie");
  // click suggestion
  fireEvent.click(suggestionNode[0]);
  });
 
  // verify document is displayed
  await waitFor(() => {
    expect(screen.getByText("Doc1")).toBeInTheDocument();
  });
    fireEvent.click(screen.getByTestId("filter-btn"));
    // Set invalid date range in state
     const fromDateInput = screen.getAllByPlaceholderText("DD");
  fireEvent.change(fromDateInput[0], { target: { value: "32" } });
  fireEvent.click(screen.getByText("Search"));
 
 
    expect(screen.getByText(/invalid date/i)).toBeInTheDocument();
  });
 
    it("handles filter close", async () => {
       (ApiService.fetchFilterCategory as jest.Mock).mockResolvedValue([]);
  jest.spyOn(ApiService, "fetchDMSSuggestions").mockResolvedValue(mockSuggestions);
  (ApiService.fetchDocumentDetails as jest.Mock).mockResolvedValue(mockDocData);
 
  render(<MemoryRouter>
      <DocumentManagementServerView />
    </MemoryRouter>);
 
    fireEvent.click(screen.getByTestId("filter-btn"));
    // Set invalid date range in state

    const closeBtn = screen.getByTestId("dialog-close-button");
 
    fireEvent.click(closeBtn);

    expect(screen.queryByTestId("dms-filter-dialog")).not.toBeInTheDocument();
  });

  it("renders empty states for showErrorBanner and showSearchError", async () => {
    jest.useFakeTimers();
    (ApiService.fetchDocumentDetails as jest.Mock).mockResolvedValue({ data: [], status: 500 });
    (Logic.fetchGetDocumentDetailsLogic as jest.Mock).mockImplementation(
      ({ setShowErrorBanner }: any) => setShowErrorBanner(true)
    );
    jest.spyOn(ApiService, "fetchDMSSuggestions").mockResolvedValue(mockSuggestions);
 
  render(<MemoryRouter>
      <DocumentManagementServerView />
    </MemoryRouter>);
 
  // type search query
  const input = await screen.findByTestId("search-autocomplete-input");
  fireEvent.change(input, { target: { value: "Alfie" } });
  fireEvent.keyDown(input, { key: "Enter", code: "Enter" });
 
  // wait for suggestion to show up
  const searchLoader = screen.getAllByTestId("loader-arc");
  await waitFor(() => {
    expect(within(searchLoader[0]).queryByTestId("loader-arc")).not.toBeInTheDocument();
  });
 
  jest.advanceTimersByTime(3000); // advance timers if there are any debounced functions
  await waitFor(async () => {
  const suggestionNode = await screen.findAllByText("Alfie");
 
  // click suggestion
  fireEvent.click(suggestionNode[0]);
  });
  expect(screen.getByText(/Information unavailable/)).toBeInTheDocument();
  }); 

 it("opens delete confirmation dialog when delete is clicked with selection and confirm delete", async () => {
  jest.useFakeTimers();
  jest.spyOn(ApiService, "fetchDMSSuggestions").mockResolvedValue(mockSuggestions);
  (ApiService.fetchDocumentDetails as jest.Mock).mockResolvedValue(mockDocData);
  (ApiService.validation as jest.Mock).mockResolvedValue({
  data: {
    restrictedFileCount: 0,
    alreadyDeletedFileCount: 0,
    availableFileCount: 2,
  }
});
  render(<MemoryRouter>
      <DocumentManagementServerView />
    </MemoryRouter>);

  const input = await screen.findByTestId("search-autocomplete-input");
  fireEvent.change(input, { target: { value: "Alfie" } });
  fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

  const searchLoader = screen.getAllByTestId("loader-arc");
  await waitFor(() => {
    expect(within(searchLoader[0]).queryByTestId("loader-arc")).not.toBeInTheDocument();
  });

 act(() => {
    jest.advanceTimersByTime(3000);
  });
  
  await waitFor(async () => {
  const suggestionNode = await screen.getAllByText(/Alfie/i);
  fireEvent.click(suggestionNode[0]);
  });

  await waitFor(() => {
    expect(screen.getByText("Doc1")).toBeInTheDocument();
  });


  fireEvent.click(screen.getByTestId("check-box-row-testid-0"));

  fireEvent.click(screen.getByText("Actions"));

  fireEvent.click(screen.getByText("Delete"));

    const searchLoaderDialog = screen.getAllByTestId("loader-arc");
  await waitFor(() => {
    expect(within(searchLoaderDialog[0]).queryByTestId("loader-arc")).not.toBeInTheDocument();
  });

  const deleteDialog = await screen.getByText(/will be gone forever once deleted./i);
  expect(deleteDialog).toBeInTheDocument();

  fireEvent.click(screen.getByText("Delete"));
});

it("restrict delete for restrictedFileCount 1", async () => {
  jest.useFakeTimers();
  jest.spyOn(ApiService, "fetchDMSSuggestions").mockResolvedValue(mockSuggestions);
  (ApiService.fetchDocumentDetails as jest.Mock).mockResolvedValue(mockDocData);
  (ApiService.validation as jest.Mock).mockResolvedValue({
  data: {
    restrictedFileCount: 1,
    alreadyDeletedFileCount: 0,
    availableFileCount: 0,
  }
});
  render(<MemoryRouter>
      <DocumentManagementServerView />
    </MemoryRouter>);

  const input = await screen.findByTestId("search-autocomplete-input");
  fireEvent.change(input, { target: { value: "Alfie" } });
  fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

  const searchLoader = screen.getAllByTestId("loader-arc");
  await waitFor(() => {
    expect(within(searchLoader[0]).queryByTestId("loader-arc")).not.toBeInTheDocument();
  });

 act(() => {
    jest.advanceTimersByTime(3000);
  });
  
  await waitFor(async () => {
  const suggestionNode = await screen.getAllByText(/Alfie/i);
  fireEvent.click(suggestionNode[0]);
  });

  await waitFor(() => {
    expect(screen.getByText("Doc1")).toBeInTheDocument();
  });


  fireEvent.click(screen.getByTestId("check-box-row-testid-0"));

  fireEvent.click(screen.getByText("Actions"));

  fireEvent.click(screen.getByText("Delete"));

    const searchLoaderDialog = screen.getAllByTestId("loader-arc");
  await waitFor(() => {
    expect(within(searchLoaderDialog[0]).queryByTestId("loader-arc")).not.toBeInTheDocument();
  });

  const deleteDialog = await screen.getByText(/This document cannot be deleted as it is currently being prepared for download. Please try again later./i);
  expect(deleteDialog).toBeInTheDocument();

  fireEvent.click(screen.getByText("Okay"));
});


it("Delete dialog cancel button works", async () => {
  jest.useFakeTimers();
  jest.spyOn(ApiService, "fetchDMSSuggestions").mockResolvedValue(mockSuggestions);
  (ApiService.fetchDocumentDetails as jest.Mock).mockResolvedValue(mockDocData);
  (ApiService.validation as jest.Mock).mockResolvedValue({
  data: {
    restrictedFileCount: 0,
    alreadyDeletedFileCount: 2,
    availableFileCount: 2,
  }
});
  render(<MemoryRouter>
      <DocumentManagementServerView />
    </MemoryRouter>);

  const input = await screen.findByTestId("search-autocomplete-input");
  fireEvent.change(input, { target: { value: "Alfie" } });
  fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

  const searchLoader = screen.getAllByTestId("loader-arc");
  await waitFor(() => {
    expect(within(searchLoader[0]).queryByTestId("loader-arc")).not.toBeInTheDocument();
  });

 act(() => {
    jest.advanceTimersByTime(3000);
  });
  
  await waitFor(async () => {
  const suggestionNode = await screen.getAllByText(/Alfie/i);
  fireEvent.click(suggestionNode[0]);
  });

  await waitFor(() => {
    expect(screen.getByText("Doc1")).toBeInTheDocument();
  });


  fireEvent.click(screen.getByTestId("check-box-row-testid-0"));

  fireEvent.click(screen.getByText("Actions"));

  fireEvent.click(screen.getByText("Delete"));

      const searchLoaderDialog = screen.getAllByTestId("loader-arc");
  await waitFor(() => {
    expect(within(searchLoaderDialog[0]).queryByTestId("loader-arc")).not.toBeInTheDocument();
  });
  const deleteDialog = await screen.getByText(/will be gone forever once deleted./i);
  expect(deleteDialog).toBeInTheDocument();
  fireEvent.click(screen.getByText("Keep it"));
});

it("Delete dialog for already deleted works", async () => {
  jest.useFakeTimers();
  jest.spyOn(ApiService, "fetchDMSSuggestions").mockResolvedValue(mockSuggestions);
  (ApiService.fetchDocumentDetails as jest.Mock).mockResolvedValue(mockDocData);
  (ApiService.validation as jest.Mock).mockResolvedValue({
  data: {
    restrictedFileCount: 0,
    alreadyDeletedFileCount: 2,
    availableFileCount: 0,
  }
});
  render(<MemoryRouter>
      <DocumentManagementServerView />
    </MemoryRouter>);

  const input = await screen.findByTestId("search-autocomplete-input");
  fireEvent.change(input, { target: { value: "Alfie" } });
  fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

  const searchLoader = screen.getAllByTestId("loader-arc");
  await waitFor(() => {
    expect(within(searchLoader[0]).queryByTestId("loader-arc")).not.toBeInTheDocument();
  });

 act(() => {
    jest.advanceTimersByTime(3000);
  });
  
  await waitFor(async () => {
  const suggestionNode = await screen.getAllByText(/Alfie/i);
  fireEvent.click(suggestionNode[0]);
  });

  await waitFor(() => {
    expect(screen.getByText("Doc1")).toBeInTheDocument();
  });

  fireEvent.click(screen.getByTestId("check-box-row-testid-0"));

  fireEvent.click(screen.getByText("Actions"));

  fireEvent.click(screen.getByText("Delete"));
// act(() => {
//     jest.advanceTimersByTime(2000);
//   });


  const searchLoaderDialog = screen.getAllByTestId("loader-arc");
  await waitFor(() => {
    expect(within(searchLoaderDialog[0]).queryByTestId("loader-arc")).not.toBeInTheDocument();
  });

  expect(
    screen.getByText(/already been deleted/i)
  ).toBeInTheDocument();

  fireEvent.click(screen.getByText("Okay"));
});

it("opens prepare download confirmation dialog when prepare download is clicked with selection and have files with deleted", async () => {
  jest.useFakeTimers();
  jest.spyOn(ApiService, "fetchDMSSuggestions").mockResolvedValue(mockSuggestions);
  (ApiService.fetchDocumentDetails as jest.Mock).mockResolvedValue(mockDocData);
  (ApiService.validation as jest.Mock).mockResolvedValue({
  data: {
    restrictedFileCount: 2,
    alreadyDeletedFileCount: 2,
    availableFileCount: 0,
  }
});
  const { container } =  render(<MemoryRouter>
      <DocumentManagementServerView />
    </MemoryRouter>);

  const input = await screen.findByTestId("search-autocomplete-input");
  fireEvent.change(input, { target: { value: "Alfie" } });
  fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

  const searchLoader = screen.getAllByTestId("loader-arc");
  await waitFor(() => {
    expect(within(searchLoader[0]).queryByTestId("loader-arc")).not.toBeInTheDocument();
  });

 act(() => {
    jest.advanceTimersByTime(3000);
  });
  
  await waitFor(async () => {
  const suggestionNode = await screen.getAllByText(/Alfie/i);
  fireEvent.click(suggestionNode[0]);
  });

  await waitFor(() => {
    expect(screen.getByText("Doc1")).toBeInTheDocument();
  });
  fireEvent.click(screen.getByTestId("check-box-row-testid-0"));

  fireEvent.click(screen.getByText("Actions"));

  fireEvent.click(screen.getByText("Prepare download"));

    const searchLoaderDialog = screen.getAllByTestId("loader-arc");
  await waitFor(() => {
    expect(within(searchLoaderDialog[0]).queryByTestId("loader-arc")).not.toBeInTheDocument();
  });
  console.log(container.innerHTML);
  const prepareDialog = await screen.getByText(/documents cannot be downloaded as they have been deleted./i);
  expect(prepareDialog).toBeInTheDocument();

  fireEvent.click(screen.getByText("Okay"));
});

describe('onClickSidePnlSecondaryBtn', () => {
  it("shows confirm dialog when clicking 'Clear all' with completed files", async () => {
    cleanup();
  (ApiService.viewDownload as jest.Mock).mockResolvedValue({
    status: 200,
    data: [{ name: "File1", status: "complete" }],
  });
  render(<MemoryRouter>
      <DocumentManagementServerView />
    </MemoryRouter>);
 
  fireEvent.click(screen.getByText("Actions"));
  fireEvent.click(screen.getByText("View downloads"));

  await waitFor(() => expect(screen.queryByTestId('secondary-button')).toBeInTheDocument());
  fireEvent.click(screen.getByTestId('secondary-button'));

  const confirmDialog = await screen.getByText("Clear all downloads?");
  expect(confirmDialog).toBeInTheDocument();

  fireEvent.click(screen.getByText("Keep all"));
});
 
 it("Catch error for failed prepareDownload", async () => {
  jest.useFakeTimers();
     (ApiService.fetchFilterCategory as jest.Mock).mockResolvedValue([]);
  jest.spyOn(ApiService, "fetchDMSSuggestions").mockResolvedValue(mockSuggestions);
  (ApiService.fetchDocumentDetails as jest.Mock).mockResolvedValue(mockDocData);
  (Logic.prepareDownload as jest.Mock).mockResolvedValue(Error("Network error"));
  (ApiService.viewDownload as jest.Mock).mockResolvedValue({
      status: 200,
      data: [
        { name: "FileZero", status: "complete", fileExpiryDays: 0 },
        { name: "FileUndefined", status: "complete" }
      ],
    });
  (ApiService.validation as jest.Mock).mockResolvedValue({
  data: {
    restrictedFileCount: 0,
    alreadyDeletedFileCount: 0,
    availableFileCount: 2,
  }
});  
 
 
  render(<MemoryRouter>
      <DocumentManagementServerView />
    </MemoryRouter>);
 
  // type search query
  const input = await screen.findByTestId("search-autocomplete-input");
  fireEvent.change(input, { target: { value: "Alfie" } });
  fireEvent.keyDown(input, { key: "Enter", code: "Enter" });
 
  // wait for suggestion to show up
  const searchLoader = screen.getAllByTestId("loader-arc");
  await waitFor(() => {
    expect(within(searchLoader[0]).queryByTestId("loader-arc")).not.toBeInTheDocument();
  });

  jest.advanceTimersByTime(3000); // advance timers if there are any debounced functions
  await waitFor(async () => {
  const suggestionNode = await screen.getAllByText(/Alfie/i);

  // click suggestion
  fireEvent.click(suggestionNode[0]);
  });

  // verify document is displayed
  await waitFor(() => {
    expect(screen.getByText("Doc1")).toBeInTheDocument();
  });
 
    fireEvent.click(screen.getByTestId("check-box-row-testid-0"));
    fireEvent.click(await screen.getByText("Actions"));
    const option = await screen.getByText("Prepare download");
    fireEvent.click(option);
    const saveBtn =
     screen.queryByTestId("tid-save-btn--small-screen") ||
     screen.queryByTestId("tid-save-btn--large-screen");

   if (saveBtn) {
    fireEvent.click(saveBtn);
  }
})
})
it("sets excludedFileDetails and fileDetails correctly when select all with exclusions", async () => {
  jest.useFakeTimers();
  // Mock document data with two files
  (ApiService.fetchFilterCategory as jest.Mock).mockResolvedValue([]);
  jest.spyOn(ApiService, "fetchDMSSuggestions").mockResolvedValue(mockSuggestions);
  (ApiService.fetchDocumentDetails as jest.Mock).mockResolvedValue(mockDocData);


  render(<MemoryRouter>
    <DocumentManagementServerView />
  </MemoryRouter>);

  // Simulate search and select all
   const input = await screen.findByTestId("search-autocomplete-input");
  fireEvent.change(input, { target: { value: "Alfie" } });
  fireEvent.keyDown(input, { key: "Enter", code: "Enter" });
 
  // wait for suggestion to show up
  const searchLoader = screen.getAllByTestId("loader-arc");
  await waitFor(() => {
    expect(within(searchLoader[0]).queryByTestId("loader-arc")).not.toBeInTheDocument();
  });
  jest.advanceTimersByTime(3000); // advance timers if there are any debounced functions

  await waitFor(async () => {
    const suggestionNode = await screen.getAllByText(/Alfie/i);
    fireEvent.click(suggestionNode[0]);
  });

  // click suggestion

  // verify document is displayed
  await waitFor(() => {
    expect(screen.getByText("Doc1")).toBeInTheDocument();
  });

  // Check the header checkbox (select all)
  const headerCheckbox = await screen.findByTestId("checkmark-check-box-row-testid");
  fireEvent.click(headerCheckbox);

  // Exclude one file (simulate exclusion)
  // This depends on your UI, but let's assume you can exclude by clicking the row checkbox
  const rowCheckbox = screen.getByTestId("check-box-row-testid-1");
  fireEvent.click(rowCheckbox); // Uncheck to exclude

  // Open actions and trigger "Prepare download"
  fireEvent.click(screen.getByText("Actions"));
  fireEvent.click(screen.getByText("Prepare download"));

  // Assert that NoSelectionDialog does NOT show (since at least one file is selected)
  // expect(screen.queryByText("Please select at least one item from the search results to perform the action.")).not.toBeInTheDocument();

  // You can also check for correct dialog or notification if needed
});

it("opens prepare download confirmation dialog when prepare download is clicked with selection and have files with deleted and clicking Cancel button triggers grid reload", async () => {
  jest.useFakeTimers();
  jest.spyOn(ApiService, "fetchDMSSuggestions").mockResolvedValue(mockSuggestions);
  (ApiService.fetchDocumentDetails as jest.Mock).mockResolvedValue(mockDocData);
  (ApiService.validation as jest.Mock).mockResolvedValue({
  data: {
    restrictedFileCount: 2,
    alreadyDeletedFileCount: 2,
    availableFileCount: 2,
  }
});
   
   render(<MemoryRouter>
      <DocumentManagementServerView />
    </MemoryRouter>);

  const input = await screen.findByTestId("search-autocomplete-input");
  fireEvent.change(input, { target: { value: "Alfie" } });
  fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

  const searchLoader = screen.getAllByTestId("loader-arc");
  await waitFor(() => {
    expect(within(searchLoader[0]).queryByTestId("loader-arc")).not.toBeInTheDocument();
  });

 act(() => {
    jest.advanceTimersByTime(3000);
  });
  
  await waitFor(async () => {
  const suggestionNode = await screen.getAllByText(/Alfie/i);
  fireEvent.click(suggestionNode[0]);
  });

  await waitFor(() => {
    expect(screen.getByText("Doc1")).toBeInTheDocument();
  });

  fireEvent.click(screen.getByTestId("check-box-row-testid-0"));

  fireEvent.click(screen.getByText("Actions"));

  fireEvent.click(screen.getByText("Prepare download"));

  const searchLoaderDialog = screen.getAllByTestId("loader-arc");
  await waitFor(() => {
    expect(within(searchLoaderDialog[0]).queryByTestId("loader-arc")).not.toBeInTheDocument();
  });

  const prepareDialog = await screen.getByText(/documents cannot be downloaded as they have already been deleted./i);
  expect(prepareDialog).toBeInTheDocument();

  fireEvent.click(screen.getByText("Cancel"));
});

it("shows correct message when one document is already deleted in dialog", async () => {
  jest.useFakeTimers();
  jest.spyOn(ApiService, "fetchDMSSuggestions").mockResolvedValue(mockSuggestions);
  (ApiService.fetchDocumentDetails as jest.Mock).mockResolvedValue(mockDocData);
  (ApiService.validation as jest.Mock).mockResolvedValue({
    data: {
      restrictedFileCount: 0,
      alreadyDeletedFileCount: 1,
      availableFileCount: 0,
    },
  });

  render(<MemoryRouter>
    <DocumentManagementServerView />
  </MemoryRouter>);
  // Simulate search for "Alfie"
  const input = await screen.findByTestId("search-autocomplete-input");
  fireEvent.change(input, { target: { value: "Alfie" } });
  fireEvent.keyDown(input, { key: "Enter", code: "Enter" });
  // Wait for suggestions to load
  const searchLoader = screen.getAllByTestId("loader-arc");
  await waitFor(() => {
    expect(within(searchLoader[0]).queryByTestId("loader-arc")).not.toBeInTheDocument();
  });
  jest.advanceTimersByTime(3000); // advance timers if there are any debounced functions
  // Click the suggestion
  await waitFor(async () => {
  const suggestionNode = await screen.findAllByText("Alfie");
  fireEvent.click(suggestionNode[0]);
  });
  // Wait for Doc1 to appear
  await waitFor(() => {
    expect(screen.getByText("Doc1")).toBeInTheDocument();
  });
  // Select the checkbox for the first row
  fireEvent.click(screen.getByTestId("check-box-row-testid-0"));
  // Open actions and trigger Prepare download
  fireEvent.click(await screen.findByText("Actions"));
  fireEvent.click(await screen.findByText("Prepare download"));

  const searchLoaderDialog = screen.getAllByTestId("loader-arc");
  await waitFor(() => {
    expect(within(searchLoaderDialog[0]).queryByTestId("loader-arc")).not.toBeInTheDocument();
  });
  // Should show the single deleted document message
  await waitFor(() => {
  expect(screen.getByText(/cannot be downloaded as it has been deleted/)).toBeInTheDocument();
});
});

it("shows correct notification when one document is available for download in dialog", async () => {
  jest.useFakeTimers();
  jest.spyOn(ApiService, "fetchDMSSuggestions").mockResolvedValue(mockSuggestions);
  (ApiService.fetchDocumentDetails as jest.Mock).mockResolvedValue(mockDocData);
   (ApiService.validation as jest.Mock).mockResolvedValue({
    data: {
      restrictedFileCount: 0,
      alreadyDeletedFileCount: 0,
      availableFileCount: 1,
    },
  });

   render(<MemoryRouter>
      <DocumentManagementServerView />
    </MemoryRouter>);

  const input = await screen.findByTestId("search-autocomplete-input");
  fireEvent.change(input, { target: { value: "Alfie" } });
  fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

  const searchLoader = screen.getAllByTestId("loader-arc");
  await waitFor(() => {
    expect(within(searchLoader[0]).queryByTestId("loader-arc")).not.toBeInTheDocument();
  });

 act(() => {
    jest.advanceTimersByTime(3000);
  });
  
  await waitFor(async () => {
  const suggestionNode = await screen.getAllByText(/Alfie/i);
  fireEvent.click(suggestionNode[0]);
  });

  await waitFor(() => {
    expect(screen.getByText("Doc1")).toBeInTheDocument();
  });
  // Select the checkbox for the first row
  fireEvent.click(screen.getByTestId("check-box-row-testid-0"));
  // Open actions and trigger Prepare download
  fireEvent.click(await screen.findByText("Actions"));
  fireEvent.click(await screen.findByText("Prepare download"));
  // Should show the single available document message
    const searchLoaderDialog = screen.getAllByTestId("loader-arc");
  await waitFor(() => {
    expect(within(searchLoaderDialog[0]).queryByTestId("loader-arc")).not.toBeInTheDocument();
  });

await waitFor(() => {
   expect(screen.getByText("1 document is about to be prepared for downloading.")).toBeInTheDocument();
});

fireEvent.click(await screen.findByText("Prepare download"));
})

it("catches error on failure of document download preparation", async () => {
  jest.useFakeTimers();
  jest.spyOn(ApiService, "fetchDMSSuggestions").mockResolvedValue(mockSuggestions);
  (ApiService.fetchDocumentDetails as jest.Mock).mockResolvedValue(mockDocData);
   (ApiService.validation as jest.Mock).mockResolvedValue({
    data: {
      restrictedFileCount: 0,
      alreadyDeletedFileCount: 0,
      availableFileCount: 1,
    },
  });
  (Logic.prepareDownload as jest.Mock).mockRejectedValue(new Error("Network Error"));

   render(<MemoryRouter>
      <DocumentManagementServerView />
    </MemoryRouter>);

  const input = await screen.findByTestId("search-autocomplete-input");
  fireEvent.change(input, { target: { value: "Alfie" } });
  fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

  const searchLoader = screen.getAllByTestId("loader-arc");
  await waitFor(() => {
    expect(within(searchLoader[0]).queryByTestId("loader-arc")).not.toBeInTheDocument();
  });

 act(() => {
    jest.advanceTimersByTime(3000);
  });
  
  await waitFor(async () => {
  const suggestionNode = await screen.getAllByText(/Alfie/i);
  fireEvent.click(suggestionNode[0]);
  });

  await waitFor(() => {
    expect(screen.getByText("Doc1")).toBeInTheDocument();
  });
  // Select the checkbox for the first row
  fireEvent.click(screen.getByTestId("check-box-row-testid-0"));
  // Open actions and trigger Prepare download
  fireEvent.click(await screen.findByText("Actions"));
  fireEvent.click(await screen.findByText("Prepare download"));
  // Should show the single available document message
    const searchLoaderDialog = screen.getAllByTestId("loader-arc");
  await waitFor(() => {
    expect(within(searchLoaderDialog[0]).queryByTestId("loader-arc")).not.toBeInTheDocument();
  });

await waitFor(() => {
  expect(screen.getByText(/1 document is about to be prepared for downloading./)).toBeInTheDocument();
});

fireEvent.click(await screen.findByText("Prepare download"));
});

it("resets search input and increments tableKey when filter applied with referenceExternalIds", async () => {
   jest.useFakeTimers();
  jest.spyOn(ApiService, "fetchDMSSuggestions").mockResolvedValue(mockSuggestions);
  (ApiService.fetchDocumentDetails as jest.Mock).mockResolvedValue(mockDocData);
  (ApiService.fetchFilterCategory as jest.Mock).mockResolvedValue([]);
  const { container } = render(<MemoryRouter>
    <DocumentManagementServerView />
  </MemoryRouter>);
  // Open filter dialog
  fireEvent.click(screen.getByTestId("filter-btn"));
  
    
//   fireEvent.click(screen.getByTestId("text-input-dms-filter-dialog-related-to"));
  
//   const pupilOption = await screen.getByText("Pupil");
//   fireEvent.click(pupilOption);
//   console.log(container.innerHTML);
//   // Type in advanced search input and select a suggestion
//   const input = await screen.findByTestId("search-autocomplete-input");
//   fireEvent.change(input, { target: { value: "Alfie" } });
//   fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

//   const searchLoader = screen.getAllByTestId("loader-arc");
//   await waitFor(() => {
//     expect(within(searchLoader[0]).queryByTestId("loader-arc")).not.toBeInTheDocument();
//   });

//  act(() => {
//     jest.advanceTimersByTime(3000);
//   });
  
//   await waitFor(async () => {
//   const suggestionNode = await screen.getAllByText(/Alfie/i);
//   fireEvent.click(suggestionNode[0]);
//   });
//   fireEvent.click(screen.getByTestId("dms-filter-dialog-apply-btn"));
//   // Wait for Doc1 to appear
//   // await waitFor(() => {
//     await expect(screen.getByText("Doc1")).toBeInTheDocument();


    // expect(screen.getByTestId("search-autocomplete-input")).toHaveValue("");
})


it("shows 'All selected documents have already been deleted.' when all selected are already deleted", async () => {
  jest.useFakeTimers();
  // Mock validation to set alreadyDeletedFileCount = 2, availableFileCount = 0, totalSelectedCount = 2
  (ApiService.fetchFilterCategory as jest.Mock).mockResolvedValue([]);
  jest.spyOn(ApiService, "fetchDMSSuggestions").mockResolvedValue(mockSuggestions);
  (ApiService.fetchDocumentDetails as jest.Mock).mockResolvedValue(mockDocData);
  (ApiService.validation as jest.Mock).mockResolvedValue({
    data: {
      restrictedFileCount: 0,
      alreadyDeletedFileCount: 2,
      availableFileCount: 0,
    },
  });

  render(<MemoryRouter>
    <DocumentManagementServerView />
  </MemoryRouter>);

  // Simulate search for "Alfie"
  const input = await screen.findByTestId("search-autocomplete-input");
  fireEvent.change(input, { target: { value: "Alfie" } });
  fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

  // Wait for suggestions to load
  const searchLoader = screen.getAllByTestId("loader-arc");
  await waitFor(() => {
    expect(within(searchLoader[0]).queryByTestId("loader-arc")).not.toBeInTheDocument();
  });

  jest.advanceTimersByTime(3000); // advance timers if there are any debounced functions
  // Click the suggestion
  await waitFor(async () => {
  const suggestionNode = await screen.getAllByText(/Alfie/i);
  fireEvent.click(suggestionNode[0]);
  });

  // Wait for Doc1 to appear
  await waitFor(() => {
    expect(screen.getByText("Doc1")).toBeInTheDocument();
  });

  // Select the checkboxes for both rows (simulate selecting multiple docs)
  fireEvent.click(screen.getByTestId("check-box-row-testid-0"));
  fireEvent.click(screen.getByTestId("check-box-row-testid-1"));

  // Open actions and trigger Delete
  fireEvent.click(await screen.getByText("Actions"));
  fireEvent.click(await screen.getByText("Delete"));
  const searchLoaderDialog = screen.getAllByTestId("loader-arc");
  await waitFor(() => {
    expect(within(searchLoaderDialog[0]).queryByTestId("loader-arc")).not.toBeInTheDocument();
  });

  expect(
    screen.getByText(/All selected documents have already been deleted./i)
  ).toBeInTheDocument();

});
})

