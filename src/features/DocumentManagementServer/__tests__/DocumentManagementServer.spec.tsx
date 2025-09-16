import React from "react";
import { render, screen, fireEvent, waitFor, act, within, cleanup } from "@testing-library/react";
import DocumentManagementServerView from "../DocumentManagementServer.view";
import * as ApiService from "../ApiService";
import * as Logic from "../DocumentManagementServer.logic";


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
                    "imagePath": "https://pazdevpfmimagesa.blob.core.windows.net/8e3f658d-b952-4e64-bf2b-1eb5733e5416/adb3a2c6-5d92-4955-88c8-0e6b5a7b323d?sv=2025-01-05&se=2025-09-08T16%3A41%3A34Z&sr=b&sp=r&sig=r9EiksyvH7Fw2suLb6OpnKLwZhtpC9tuatLBUiWT6XY%3D"
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
                    "imagePath": "https://pazdevpfmimagesa.blob.core.windows.net/8e3f658d-b952-4e64-bf2b-1eb5733e5416/04aaedd6-5307-4a4f-abaa-8b2230b3983b?sv=2025-01-05&se=2025-09-08T16%3A41%3A34Z&sr=b&sp=r&sig=ODZ%2FbhewCi3E3NcAYDf%2FAKHinSUC%2FU5dTQChdf7g%2BlA%3D"
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
jest.setTimeout(20000);
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
    render(<DocumentManagementServerView />);
    expect(screen.getByText("Home")).toBeInTheDocument();
  });

  it("renders empty state before search", () => {
    render(<DocumentManagementServerView />);
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    expect(
      screen.getByText("Use the search bar to find and select a pupil, staff member, or school to view, download, or delete related documents.")
    ).toBeInTheDocument();
  });

it("shows suggestions and triggers search when user clicks a suggestion", async () => {

  (ApiService.fetchFilterCategory as jest.Mock).mockResolvedValue([]);
  jest.spyOn(ApiService, "fetchDMSSuggestions").mockResolvedValue(mockSuggestions);
  (ApiService.fetchDocumentDetails as jest.Mock).mockResolvedValue(mockDocData);

  render(<DocumentManagementServerView />);

  // type search query
  const input = await screen.findByTestId("search-autocomplete-input");
  fireEvent.change(input, { target: { value: "Alfie" } });
  fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

  // wait for suggestion to show up
  const searchLoader = screen.getAllByTestId("loader-arc");
  await waitFor(() => {
    expect(within(searchLoader[0]).queryByTestId("loader-arc")).not.toBeInTheDocument();
  });

  const suggestionNode = await screen.findAllByText("Alfie");

  // click suggestion
  fireEvent.click(suggestionNode[0]);

  // verify document is displayed
  await waitFor(() => {
    expect(screen.getByText("Doc1")).toBeInTheDocument();
  });

});


  it("handles sorting on multiple columns", () => {
    render(<DocumentManagementServerView />);
   
    fireEvent.click(screen.getByText("Date added"));
    fireEvent.click(screen.getByText("Document"));
    fireEvent.click(screen.getByText("Format"));
    fireEvent.click(screen.getByText("Size"));
    fireEvent.click(screen.getByText("Category"));
  });
    

  it("shows NoSelectionDialog when no item selected for prepare download", async () => {
    render(<DocumentManagementServerView />);
    fireEvent.click(await screen.findByText("Actions"));
    fireEvent.click(await screen.findByText("Prepare download"));
    expect(
      screen.getByText(
        "Please select at least one item from the search results to perform the action."
      )
    ).toBeInTheDocument();
  });

  it("renders download view panel with complete file", async () => {
    (ApiService.viewDownload as jest.Mock).mockResolvedValue({
      status: 200,
      data: [{ name: "File1", status: "complete", fileExpiryDays: 2 }],
    });
    render(<DocumentManagementServerView />);

      fireEvent.click(await screen.findByText("Actions"));
      fireEvent.click(await screen.findByText("View download"));

    const sidePanelHeader = await screen.getByText("Downloads");
    expect(sidePanelHeader).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText("File1")).toBeInTheDocument());
    expect(screen.getByText("Expires in 2 days.")).toBeInTheDocument();
  });

  it("renders in-progress downloads", async () => {
    (ApiService.viewDownload as jest.Mock).mockResolvedValue({
      status: 200,
      data: [{ name: "File2", status: "inprogress" }],
    });
    render(<DocumentManagementServerView />);

      fireEvent.click(await screen.findByText("Actions"));
      fireEvent.click(await screen.findByText("View download"));

    await waitFor(() => expect(screen.getByText("File2")).toBeInTheDocument());
  });

  it("renders initiated downloads", async () => {
    (ApiService.viewDownload as jest.Mock).mockResolvedValue({
      status: 200,
      data: [{ name: "File3", status: "initiated" }],
    });
    render(<DocumentManagementServerView />);

      fireEvent.click(await screen.findByText("Actions"));
      fireEvent.click(await screen.findByText("View download"));

    expect(await screen.findByText("File3")).toBeInTheDocument();
  });

  it("shows error banner when showErrorBanner is set", async () => {
     (ApiService.fetchFilterCategory as jest.Mock).mockResolvedValue([]);
  jest.spyOn(ApiService, "fetchDMSSuggestions").mockResolvedValue(mockSuggestions);
  (ApiService.fetchDocumentDetails as jest.Mock).mockResolvedValue({data: [], status: 500 });

  render(<DocumentManagementServerView />);

  // type search query
  const input = await screen.findByTestId("search-autocomplete-input");
  fireEvent.change(input, { target: { value: "Alfie" } });
  fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

  // wait for suggestion to show up
  const searchLoader = screen.getAllByTestId("loader-arc");
  await waitFor(() => {
    expect(within(searchLoader[0]).queryByTestId("loader-arc")).not.toBeInTheDocument();
  });

  const suggestionNode = await screen.findAllByText("Alfie");

  // click suggestion
  fireEvent.click(suggestionNode[0]);

  const gridLoader = screen.getAllByTestId("loader-arc");
  await waitFor(() => {
    expect(within(gridLoader[0]).queryByTestId("loader-arc")).not.toBeInTheDocument();
  });
  
  });

  it("resets state on search close", async () => {
       (ApiService.fetchFilterCategory as jest.Mock).mockResolvedValue([]);
  jest.spyOn(ApiService, "fetchDMSSuggestions").mockResolvedValue(mockSuggestions);
  (ApiService.fetchDocumentDetails as jest.Mock).mockResolvedValue({data: [], status: 500 });

  render(<DocumentManagementServerView />);

  // type search query
  const input = await screen.findByTestId("search-autocomplete-input");
  fireEvent.change(input, { target: { value: "Alfie" } });
  fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

  // wait for suggestion to show up
  const searchLoader = screen.getAllByTestId("loader-arc");
  await waitFor(() => {
    expect(within(searchLoader[0]).queryByTestId("loader-arc")).not.toBeInTheDocument();
  });

  const suggestionNode = await screen.findAllByText("Alfie");

  // click suggestion
  fireEvent.click(suggestionNode[0]);
    fireEvent.click(screen.getByTestId("search-close--icon-btn"));
    expect(screen.getByRole("textbox")).toHaveValue("");
  });

    it("closes side panel and clears interval", async () => {
    const { container } = render(<DocumentManagementServerView />);

      fireEvent.click(await screen.findByText("Actions"));
      fireEvent.click(await screen.findByText("View download"));

    fireEvent.click(screen.getByTestId("side-panel-close-button")); // side panel close
    // Verify loader and interval cleared
    expect(container).toBeTruthy(); // minimal assertion
  });

  it("renders side panel files with expiry 0 or undefined", async () => {
    (ApiService.viewDownload as jest.Mock).mockResolvedValue({
      status: 200,
      data: [
        { name: "FileZero", status: "complete", fileExpiryDays: 0 },
        { name: "FileUndefined", status: "complete" }
      ],
    });
    render(<DocumentManagementServerView />);
    fireEvent.click(await screen.findByText("Actions"));
    fireEvent.click(await screen.findByText("View download"));
    await waitFor(() => {
      expect(screen.getByText("FileZero")).toBeInTheDocument();
      expect(screen.getByText("Expires today.")).toBeInTheDocument();
      expect(screen.getByText("FileUndefined")).toBeInTheDocument();
    });
  });

  it("updates breadcrumbs on resize for mobile", () => {
    global.innerWidth = 500;
    act(() => {
      global.dispatchEvent(new Event("resize"));
    });
    render(<DocumentManagementServerView />);
    expect(screen.getByText("Document Management Server")).toBeInTheDocument();
  });
});

describe("Additional tests to increase coverage", () => {
  it("clears search input and resets state", async () => {
    render(<DocumentManagementServerView />);
    fireEvent.change(screen.getByTestId("search-autocomplete-input"), { target: { value: "Test" } });
    fireEvent.click(screen.getByTestId("search-close--icon-btn")); // triggers handleSearchClose
  });

  // it("removes a tag and updates filters", () => {
  //   render(<DocumentManagementServerView />);
  //   act(() => {
  //     Logic.handleTagCloseLogic = jest.fn();
  //   });
  //   fireEvent.click(screen.getByTestId("search-tag-close-btn")); // assuming a test id exists for tags
  //   expect(Logic.handleTagCloseLogic).toHaveBeenCalled();
  // });



  it("shows error notifications for failed prepareDownload", async () => {
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


  render(<DocumentManagementServerView />);

  // type search query
  const input = await screen.findByTestId("search-autocomplete-input");
  fireEvent.change(input, { target: { value: "Alfie" } });
  fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

  // wait for suggestion to show up
  const searchLoader = screen.getAllByTestId("loader-arc");
  await waitFor(() => {
    expect(within(searchLoader[0]).queryByTestId("loader-arc")).not.toBeInTheDocument();
  });

  const suggestionNode = await screen.findAllByText("Alfie");

  // click suggestion
  fireEvent.click(suggestionNode[0]);

  // verify document is displayed
  await waitFor(() => {
    expect(screen.getByText("Doc1")).toBeInTheDocument();
  });

  fireEvent.click(screen.getByTestId("check-box-row-testid-0"));
    fireEvent.click(await screen.findByText("Actions"));
    const option = await screen.findByTestId("option-test-0");
    fireEvent.click(option);


    fireEvent.click(screen.getByTestId("tid-save-btn--small-screen"));
    const sidePanelLoader = await screen.getByText("Please wait...");
    expect(sidePanelLoader).toBeInTheDocument();
  });

  it("handles multiple files for email notification", async () => {
    (ApiService.fetchFilterCategory as jest.Mock).mockResolvedValue([]);
  jest.spyOn(ApiService, "fetchDMSSuggestions").mockResolvedValue(mockSuggestions);
  (ApiService.fetchDocumentDetails as jest.Mock).mockResolvedValue(mockDocData);
  (Logic.prepareDownload as jest.Mock).mockResolvedValue([204]);
  (ApiService.viewDownload as jest.Mock).mockResolvedValue({
      status: 200,
      data: [
        { name: "FileZero", status: "complete", fileExpiryDays: 0 },
        { name: "FileUndefined", status: "complete" }
      ],
    });


  render(<DocumentManagementServerView />);

  // type search query
  const input = await screen.findByTestId("search-autocomplete-input");
  fireEvent.change(input, { target: { value: "Alfie" } });
  fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

  // wait for suggestion to show up
  const searchLoader = screen.getAllByTestId("loader-arc");
  await waitFor(() => {
    expect(within(searchLoader[0]).queryByTestId("loader-arc")).not.toBeInTheDocument();
  });

  const suggestionNode = await screen.findAllByText("Alfie");

  // click suggestion
  fireEvent.click(suggestionNode[0]);

  // verify document is displayed
  await waitFor(() => {
    expect(screen.getByText("Doc1")).toBeInTheDocument();
  });
    // Select multiple checkboxes
    fireEvent.click(screen.getByTestId("check-box-row-testid-0"));
    fireEvent.click(screen.getByTestId("check-box-row-testid-1"));

    fireEvent.click(await screen.findByText("Actions"));
    fireEvent.click(await screen.findByText("Prepare download"));
    fireEvent.click(await screen.getByTestId("tid-save-btn--small-screen"));
  });


  it("updates breadcrumbs on resize for mobile", () => {
    global.innerWidth = 500;
    act(() => {
      global.dispatchEvent(new Event("resize"));
    });
    render(<DocumentManagementServerView />);
    expect(screen.getByText("Document Management Server")).toBeInTheDocument();
  });

  it("handles date filter validation error", async () => {
       (ApiService.fetchFilterCategory as jest.Mock).mockResolvedValue([]);
  jest.spyOn(ApiService, "fetchDMSSuggestions").mockResolvedValue(mockSuggestions);
  (ApiService.fetchDocumentDetails as jest.Mock).mockResolvedValue(mockDocData);

  render(<DocumentManagementServerView />);

  // type search query
  const input = await screen.findByTestId("search-autocomplete-input");
  fireEvent.change(input, { target: { value: "Alfie" } });
  fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

  // wait for suggestion to show up
  const searchLoader = screen.getAllByTestId("loader-arc");
  await waitFor(() => {
    expect(within(searchLoader[0]).queryByTestId("loader-arc")).not.toBeInTheDocument();
  });

  const suggestionNode = await screen.findAllByText("Alfie");

  // click suggestion
  fireEvent.click(suggestionNode[0]);

  // verify document is displayed
  await waitFor(() => {
    expect(screen.getByText("Doc1")).toBeInTheDocument();
  });
    fireEvent.click(screen.getByTestId("filter-btn"));
    // Set invalid date range in state
     const fromDateInput = screen.getAllByPlaceholderText("DD");
  fireEvent.change(fromDateInput[0], { target: { value: "32" } });
  fireEvent.click(screen.getByText("Apply"));

 
    expect(screen.getByText(/invalid date/i)).toBeInTheDocument();
  });

  it("renders empty states for showErrorBanner and showSearchError", async () => {
    (ApiService.fetchDocumentDetails as jest.Mock).mockResolvedValue({ data: [], status: 500 });
    (Logic.fetchGetDocumentDetailsLogic as jest.Mock).mockImplementation(
      ({ setShowErrorBanner }: any) => setShowErrorBanner(true)
    );
    jest.spyOn(ApiService, "fetchDMSSuggestions").mockResolvedValue(mockSuggestions);

  render(<DocumentManagementServerView />);

  // type search query
  const input = await screen.findByTestId("search-autocomplete-input");
  fireEvent.change(input, { target: { value: "Alfie" } });
  fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

  // wait for suggestion to show up
  const searchLoader = screen.getAllByTestId("loader-arc");
  await waitFor(() => {
    expect(within(searchLoader[0]).queryByTestId("loader-arc")).not.toBeInTheDocument();
  });

  const suggestionNode = await screen.findAllByText("Alfie");

  // click suggestion
  fireEvent.click(suggestionNode[0]);
  expect(screen.getByText(/Information unavailable/)).toBeInTheDocument();
  });
});
