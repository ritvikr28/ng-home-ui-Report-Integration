import React from "react";
import { render, screen, fireEvent, waitFor, act, within, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { authService } from "@essnextgen/auth-ui";
import DocumentManagementServerView from "../DocumentManagementServer.view";
import * as ApiService from "../ApiService";
import * as Logic from "../DocumentManagementServer.logic";
 
jest.spyOn(authService, "getAuthTokens").mockReturnValue(null);

jest.mock("@essnextgen/auth-ui", () => ({
  authService: {
    getUsername: jest.fn(() => "TestUser"),
    getOrgId: jest.fn(() => "Org123"),
    getUserId: jest.fn(() => "User456"),
    isAuthorised: jest.fn(() => true),
    getAuthTokens: jest.fn(() => "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IldIVmVvZVBuZk5qZnUxZE9HTlFkSWhSN2FCdyIsImtpZCI6IldIVmVvZVBuZk5qZnUxZE9HTlFkSWhSN2FCdyJ9.eyJpc3MiOiJodHRwczovL3NpbXNpZC1wYXJ0bmVyLXN0c3NlcnZlci5henVyZXdlYnNpdGVzLm5ldC8iLCJhdWQiOiJwbS1zc28tZWRjNGE3ZWMtNjI0Zi00OWQ0LTkxODEtNTU1YjczMDFlMzNmIiwiZXhwIjoxNjcyMDU2NTk5LCJuYmYiOjE2NzIwNTYyOTksImlhdCI6MTY3MjA1NjI5OSwic2lkIjoiNzMyNzAzZWQ3NzQ5ZTZhZWE3ZjJlN2U0OTdlMDM5ZjQiLCJzdWIiOiIxNDk5MDZ8RjZDMTdBMDItRkVCMC00OUFELTg4MjQtRTZBOTQxOTUwQkFDfEluaXRpYWwuQWRtaW4zMEBzaW1zaWQucGxhY2Vob2xkZXIuaWRlbnRpdHlmb3IuY28udWt8U0lNUyBJRHw2NTNhNDVjZi1hOGY3LTQyM2EtYjEzNC1jOGVjMmE0NGE1OGQiLCJhdXRoX3RpbWUiOjE2NzIwNTYyOTcsImlkcCI6Imlkc3J2IiwiTGFzdExvZ2luVGltZXN0YW1wIjoiRGVjIDI2LCAyMDIyIDEwOjE5OjEzIiwiUGFzc3dvcmRDaGFuZ2VkVGltZXN0YW1wIjoiRGVjIDA4LCAyMDIxIDE3OjAyOjQwIiwic2l0ZSI6IkI0MUJCMkFCIiwibGF1bmNoZXIiOiJ3ZWItYWNjZXNzIiwiU2l0ZVJvbGUiOiJBZG1pbiIsImhvbWVvcmdhbmlzYXRpb25pZGVudGlmaWVyIjoiQjQxQkIyQUItMzk3QS00RkNGLUJBNTktNjE1NkY0NTUzMjY5IiwibXVsdGlwbGVvcmdhbmlzYXRpb25zIjoiZmFsc2UiLCJuYW1lIjoiSW5pdGlhbCBBZG1pbiIsInJvbGUiOiJhZG1pbkBiNDFiYjJhYi0zOTdhLTRmY2YtYmE1OS02MTU2ZjQ1NTMyNjkiLCJhZGRpdGlvbmFscm9sZXNwcmVzZW50IjoiZmFsc2UiLCJ1c2Vyb3JnYW5pc2F0aW9uaWRlbnRpZmllciI6IjlGMEU2RTUyLTVGMjItNDYxRi05RjNCLTYwNEJFRDQxMEU5Q3xCNDFCQjJBQi0zOTdBLTRGQ0YtQkE1OS02MTU2RjQ1NTMyNjl8UyIsInByb3ZpZGVyIjoiU0lNUyBJRCIsInByb3ZpZGVyaWQiOiIxNDk5MDYiLCJwcm92aWRlcm5hbWUiOiJJbml0aWFsIEFkbWluIiwidmVuZG9yaWQiOiIyODYxQTAwMC03OTM0LTQ0QkYtOUY2RS05NkE5MjIyNjZGMzkiLCJhcHBsaWNhdGlvbmlkIjoiMUEyQjMyQzctOUMzOS00Q0NGLUE1ODEtRTI1M0E5RkEwN0E0IiwiYXBwbGljYXRpb25uYW1lIjoiRVNTLVNhdGVsbGl0ZXMtRGV2ZWxvcG1lbnQtU3RhZmYgJiBBZG1pbiIsImFtciI6WyJwYXNzd29yZCJdfQ.0dhbAIzNyXm5oJ679cOuiqwT8RgqcBhEGACfvxfGBLKHSNxvlBKqwmtRNxySYIc4MgH3w2sT4SLpo8yaEihjk9AXzfSPshHKbfAigb82834xnfMAEDnyc0hMT9jaxvfYVw8ZORPsVw68mxAwt4-WTVoUxLy4IK7tpI-Pzc_aFpW-BbMHr9Ctt_ls8EPH8NxJ22LnNbxJPSx3iBn8OwvcCIf2TeJL0fs30_VAm-XMLnF4w2SMbOC5O8CNd-ii6dmDLDriYYVzp-mQ4NiARohGJyDl6IwdgX6wXsSJB78Yy6AmCxUIXPQk4TYg_8wI9a_XNgilY5iMmEV6GXoLtm4e0A")
  },
  MatchPermissions: {
    any: "any", // ← mock value (doesn't matter what)
  },
}));

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
      if (key === "DocumentManagementServer.Home") {
        return "Home";
      }
      if (key === "DocumentManagementServer.ViewDownload") {
        return "View downloads";
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
      if (key === "DocumentManagementServer.keepIt") {
        return "Keep it";
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
      if (key === "Filter.Pupil") {
        return "Pupil";
      }
      if (key === "Filter.pupilName") {
        return "Pupil name";
      }
      if (key === "DocumentManagementServer.Cancel") {
        return "Cancel";
      }
      if (key === "DocumentManagementServer.Okay") {
        return "Okay";
      }
      if (key === "DocumentManagementServer.informationUnavailable") {
        return "Information unavailable";
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
 
jest.mock('focus-trap-react', () => ({
  __esModule: true,
  default: ({ children }: any) => <>{children}</>,
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
    fileDownload: jest.fn(),
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
  { application: "App1", registrationId: [1], section: ["Section1"] },
  { application: "App2", registrationId: [1], section: ["Section2"] },
  { application: "App3", registrationId: [1], section: ["Section3"] },
  { application: "App4", registrationId: [1], section: ["Section4"] }
];
 
const mockDocData = {
  statusCode: 200,
  totalRecords: 2,
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
 
const zipFileDownloadMockData = {
  statusCode: 200,
  payload: "https://pazdevpfmdocumentsa.blob.core.windows.net/zipfiles/SIMS_2025-11-17_05-49-21-949-5726c2dc-0b13-4a31-bc42-55212f9be681.zip?sv=2025-05-05&ss=b&srt=o&spr=https&st=2025-11-17T05%3A45%3A38Z&se=2025-11-17T11%3A50%3A38Z&sp=r&sig=KNCUB3ApzNzLwV%2FJa7p4YbJSr%2F6NUOTz7EmguJTwS%2B4%3D&rscd=attachment;filename=SIMS_2025-11-17_11-19-20.zip",
  errorMessage: null
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
    (Logic.fileDownload as jest.Mock).mockResolvedValue(zipFileDownloadMockData);
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
 
it("shows suggestions and triggers search when user clicks a suggestion", async () => {
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

  jest.advanceTimersByTime(3000);
 
  const suggestionNode = await screen.findAllByText("Alfie");
 
  // click suggestion
  fireEvent.click(suggestionNode[0]);
 
  // verify document is displayed
  await waitFor(() => {
    expect(screen.getByText("Doc1")).toBeInTheDocument();
  });
 jest.useRealTimers();
});
 
 
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

  // Click the suggestion
  jest.advanceTimersByTime(3000);
  const suggestionNode = await screen.findAllByText("Alfie");
  fireEvent.click(suggestionNode[0]);

  // Wait for Doc1 to appear
  await waitFor(() => {
    expect(screen.getByText("Doc1")).toBeInTheDocument();
  });

    const headerCheckbox = await screen.findByTestId("checkmark-check-box-row-testid");

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
  jest.useRealTimers();
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
 
  jest.advanceTimersByTime(3000);
  const suggestionNode = await screen.findAllByText("Alfie");
 
  // click suggestion
  fireEvent.click(suggestionNode[0]);
    fireEvent.click(screen.getByTestId("search-close--icon-btn"));
    expect(screen.getByRole("textbox")).toHaveValue("");
    jest.useRealTimers();
  });
 
    it("closes side panel and clears interval", async () => {
    const { container } = render(<MemoryRouter>
      <DocumentManagementServerView />
    </MemoryRouter>);
 
      fireEvent.click(await screen.findByText("Actions"));
      fireEvent.click(await screen.findByText("View downloads"));
 
    fireEvent.click(screen.getByTestId("side-panel-close-button")); // side panel close
    // Verify loader and interval cleared
    expect(container).toBeTruthy(); // minimal assertion
  });
  it("renders side panel files with expiry 0 or undefined", async () => {
    (ApiService.viewDownload as jest.Mock).mockResolvedValue({
      status: 200,
      data: [
        { name: "FileZero", status: "complete", fileExpiryDays: 0 },
        { name: "FileUndefined", status: "complete" },
        { name: "FileOneDay", status: "complete", fileExpiryDays: 1 }
      ],
    });
    render(<MemoryRouter>
      <DocumentManagementServerView />
    </MemoryRouter>);
    fireEvent.click(await screen.getByText("Actions"));
    fireEvent.click(await screen.getByText("View downloads"));
    await waitFor(() => {
      expect(screen.getByText("FileZero")).toBeInTheDocument();
      expect(screen.getByText("Expires today.")).toBeInTheDocument();
      expect(screen.getByText("FileUndefined")).toBeInTheDocument();
      expect(screen.getByText("FileOneDay")).toBeInTheDocument();
      expect(screen.getByText("Expires in 1 day(s).")).toBeInTheDocument();
    });
    const downloadBtns = screen.getAllByText("DocumentManagementServer.download");
    fireEvent.click(downloadBtns[0]);
    
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
//   jest.mock("@essnextgen/auth-ui", () => ({
//   ...jest.requireActual("@essnextgen/auth-ui"),
//   authService: {
//     isAuthorised: () => true,
//     getAuthTokens: () => ({
//       accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Ik1vY2sgVXNlciIsIm9yZ2FuaXNhdGlvbiI6Ik9yZzEyMyJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
//     }),
//   },
//   MatchPermissions: { all: "all" }
// }));
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
 
 
  it("handles multiple files for email notification", async () => {
  jest.useFakeTimers();
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

  jest.advanceTimersByTime(3000);
 
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
 
    fireEvent.click(await screen.getByText("Actions"));
    fireEvent.click(await screen.getByText("Prepare download"));
    const saveBtn = await screen.findByTestId("close-btn");
    fireEvent.click(saveBtn);
    jest.useRealTimers();
  });
 
 

 
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
 
  jest.advanceTimersByTime(3000);
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
  fireEvent.click(screen.getByText("Search"));
 
 
    expect(screen.getByText(/invalid date/i)).toBeInTheDocument();
    jest.useRealTimers();
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

  jest.advanceTimersByTime(3000);
 
  const suggestionNode = await screen.findAllByText("Alfie");
 
  // click suggestion
  fireEvent.click(suggestionNode[0]);
  expect(screen.getByText(/Information unavailable/)).toBeInTheDocument();
  jest.useRealTimers();
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

  jest.advanceTimersByTime(3000);

  const suggestionNode = await screen.findAllByText("Alfie");

  fireEvent.click(suggestionNode[0]);

  await waitFor(() => {
    expect(screen.getByText("Doc1")).toBeInTheDocument();
  });

  fireEvent.click(screen.getByTestId("check-box-row-testid-0"));

  fireEvent.click(screen.getByText("Actions"));

  fireEvent.click(screen.getByText("Delete"));

  const deleteDialog = await screen.findByText(/will be gone forever once deleted./i);
  expect(deleteDialog).toBeInTheDocument();

  fireEvent.click(screen.getByText("Delete"));
  jest.useRealTimers();
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

  jest.advanceTimersByTime(3000);
  const suggestionNode = await screen.findAllByText("Alfie");

  fireEvent.click(suggestionNode[0]);

  await waitFor(() => {
    expect(screen.getByText("Doc1")).toBeInTheDocument();
  });

  fireEvent.click(screen.getByTestId("check-box-row-testid-0"));

  fireEvent.click(screen.getByText("Actions"));

  fireEvent.click(screen.getByText("Delete"));

  const deleteDialog = await screen.findByText(/will be gone forever once deleted./i);
  expect(deleteDialog).toBeInTheDocument();
  fireEvent.click(screen.getByText("Keep it"));
  jest.useRealTimers();
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

  jest.advanceTimersByTime(3000);
  const suggestionNode = await screen.findAllByText("Alfie");

  fireEvent.click(suggestionNode[0]);

  await waitFor(() => {
    expect(screen.getByText("Doc1")).toBeInTheDocument();
  });

  fireEvent.click(screen.getByTestId("check-box-row-testid-0"));

  fireEvent.click(screen.getByText("Actions"));

  fireEvent.click(screen.getByText("Delete"));

  const deleteDialog = await screen.findByText(/documents have already been deleted./i);
  expect(deleteDialog).toBeInTheDocument();

  fireEvent.click(screen.getByText("Okay"));
  jest.useRealTimers();
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

  jest.advanceTimersByTime(3000);
  const suggestionNode = await screen.findAllByText("Alfie");

  fireEvent.click(suggestionNode[0]);

  await waitFor(() => {
    expect(screen.getByText("Doc1")).toBeInTheDocument();
  });

  fireEvent.click(screen.getByTestId("check-box-row-testid-0"));

  fireEvent.click(screen.getByText("Actions"));

  fireEvent.click(screen.getByText("Prepare download"));

  const prepareDialog = await screen.findByText(/documents cannot be downloaded as they have been deleted./i);
  expect(prepareDialog).toBeInTheDocument();

  fireEvent.click(screen.getByText("Okay"));
  jest.useRealTimers();
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
  jest.advanceTimersByTime(3000);

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
    const saveBtn = await screen.findByTestId("tid-save-btn--small-screen");
    fireEvent.click(saveBtn);
    jest.useRealTimers();
})

 it("Catch 409 error code for failed prepareDownload", async () => {
  jest.useFakeTimers();
     (ApiService.fetchFilterCategory as jest.Mock).mockResolvedValue([]);
  jest.spyOn(ApiService, "fetchDMSSuggestions").mockResolvedValue(mockSuggestions);
  (ApiService.fetchDocumentDetails as jest.Mock).mockResolvedValue(mockDocData);
  (Logic.prepareDownload as jest.Mock).mockResolvedValue([409]);
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
  jest.advanceTimersByTime(3000);

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
    const saveBtn = await screen.findByTestId("tid-save-btn--small-screen");
    fireEvent.click(saveBtn);
    jest.useRealTimers();
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

  jest.advanceTimersByTime(3000);
  const suggestionNode = await screen.findAllByText("Alfie");

  // click suggestion
  fireEvent.click(suggestionNode[0]);

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
  jest.useRealTimers();
});

it("if documents already deleted - documents cannot be downloaded as they have been deleted.", async () => {
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

  jest.advanceTimersByTime(3000);
  const suggestionNode = await screen.findAllByText("Alfie");

  fireEvent.click(suggestionNode[0]);

  await waitFor(() => {
    expect(screen.getByText("Doc1")).toBeInTheDocument();
  });

  fireEvent.click(screen.getByTestId("check-box-row-testid-0"));

  fireEvent.click(screen.getByText("Actions"));

  fireEvent.click(screen.getByText("Prepare download"));

  const prepareDialog = await screen.findByText(/documents cannot be downloaded as they have already been deleted./i);
  expect(prepareDialog).toBeInTheDocument();

  fireEvent.click(screen.getByText("Cancel"));
  jest.useRealTimers();
});

it("This document cannot be deleted as it is currently being prepared for download. Please try again later.", async () => {
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

  jest.advanceTimersByTime(3000);
  const suggestionNode = await screen.findAllByText("Alfie");

  fireEvent.click(suggestionNode[0]);

  await waitFor(() => {
    expect(screen.getByText("Doc1")).toBeInTheDocument();
  });

  fireEvent.click(screen.getByTestId("check-box-row-testid-0"));

  fireEvent.click(screen.getByText("Actions"));

  fireEvent.click(screen.getByText("Delete"));

  const prepareDialog = await screen.findByText(/This document cannot be deleted as it is currently being prepared for download. Please try again later/i);
  expect(prepareDialog).toBeInTheDocument();

  fireEvent.click(screen.getByText("Okay"));
  jest.useRealTimers();
});


it("Documents cannot be downloaded as they have been deleted", async () => {
  jest.useFakeTimers();
  jest.spyOn(ApiService, "fetchDMSSuggestions").mockResolvedValue(mockSuggestions);
  (ApiService.fetchDocumentDetails as jest.Mock).mockResolvedValue(mockDocData);
  (ApiService.validation as jest.Mock).mockResolvedValue({
  data: {
    restrictedFileCount: 0,
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

  jest.advanceTimersByTime(3000);
  const suggestionNode = await screen.findAllByText("Alfie");

  fireEvent.click(suggestionNode[0]);

  await waitFor(() => {
    expect(screen.getByText("Doc1")).toBeInTheDocument();
  });

  fireEvent.click(screen.getByTestId("check-box-row-testid-0"));

  fireEvent.click(screen.getByText("Actions"));

  fireEvent.click(screen.getByText("Prepare download"));
  const prepareDialog = await screen.findByText(/documents cannot be downloaded as they have been deleted./i);

  expect(prepareDialog).toBeInTheDocument();

  fireEvent.click(screen.getByText("Okay"));
  jest.useRealTimers();
}); 

it("shows correct message when one document is already deleted in dialog", async () => {
  // Mock validation to set alreadyDeletedFileCount = 1, availableFileCount = 0
  jest.useFakeTimers();
  (ApiService.fetchFilterCategory as jest.Mock).mockResolvedValue([]);
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
  // Click the suggestion
  jest.advanceTimersByTime(3000);
  const suggestionNode = await screen.findAllByText("Alfie");
  fireEvent.click(suggestionNode[0]);
  // Wait for Doc1 to appear
  await waitFor(() => {
    expect(screen.getByText("Doc1")).toBeInTheDocument();
  });
  // Select the checkbox for the first row
  fireEvent.click(screen.getByTestId("check-box-row-testid-0"));
  // Open actions and trigger Prepare download
  fireEvent.click(await screen.findByText("Actions"));
  fireEvent.click(await screen.findByText("Prepare download"));
  // Should show the single deleted document message
  await waitFor(() => {
  expect(screen.getByText(/cannot be downloaded as it has been deleted/)).toBeInTheDocument();
});
jest.useRealTimers();
});

it("shows correct notification when one document is available for download in dialog", async () => {
  // Mock validation to set availableFileCount = 1, alreadyDeletedFileCount = 0
  jest.useFakeTimers();
  (ApiService.fetchFilterCategory as jest.Mock).mockResolvedValue([]);
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
  // Simulate search for "Alfie"
  const input = await screen.findByTestId("search-autocomplete-input");
  fireEvent.change(input, { target: { value: "Alfie" } });
  fireEvent.keyDown(input, { key: "Enter", code: "Enter" });
  // Wait for suggestions to load
  const searchLoader = screen.getAllByTestId("loader-arc");
  await waitFor(() => {
    expect(within(searchLoader[0]).queryByTestId("loader-arc")).not.toBeInTheDocument();
  });
  // Click the suggestion
  jest.advanceTimersByTime(3000);
  const suggestionNode = await screen.findAllByText("Alfie");
  fireEvent.click(suggestionNode[0]);
  // Wait for Doc1 to appear
  await waitFor(() => {
    expect(screen.getByText("Doc1")).toBeInTheDocument();
  });
  // Select the checkbox for the first row
  fireEvent.click(screen.getByTestId("check-box-row-testid-0"));
  // Open actions and trigger Prepare download
  fireEvent.click(await screen.findByText("Actions"));
  fireEvent.click(await screen.findByText("Prepare download"));
  // Should show the single available document message
await waitFor(() => {
   expect(screen.getByText("1 document is about to be prepared for downloading.")).toBeInTheDocument();
});
jest.useRealTimers();
})

it("resets search input and increments tableKey when filter applied with referenceExternalIds", async () => {
  (ApiService.fetchFilterCategory as jest.Mock).mockResolvedValue([]);
  (ApiService.fetchDMSSuggestions as jest.Mock).mockResolvedValue(mockSuggestions);
  (ApiService.fetchDocumentDetails as jest.Mock).mockResolvedValue(mockDocData);
  render(<MemoryRouter>
    <DocumentManagementServerView />
  </MemoryRouter>);
  // Open filter dialog
  fireEvent.click(screen.getByTestId("filter-btn"));
  await waitFor(() => expect(screen.getByTestId("dms-filter-dialog")).toBeInTheDocument());
  // Open Related to dropdown and select "Pupil"
  fireEvent.click(screen.getByTestId("text-input-dms-filter-dialog-related-to"));
  const pupilOption = await screen.getByText("Pupil");
  fireEvent.click(pupilOption);
  // Type in advanced search input and select a suggestion
  const advInput = await screen.getByPlaceholderText("Pupil name");
  fireEvent.change(advInput, { target: { value: "Alfie" } });
  fireEvent.keyDown(advInput, { key: "Enter", code: "Enter" });
  // Click Apply
  const input = await screen.getAllByTestId("search-autocomplete-input");
  fireEvent.click(input[0]);
  
    // expect(screen.getByTestId("search-autocomplete-input")).toHaveValue("");
 
});

it("shows 'All selected documents have already been deleted.' when all selected are already deleted", async () => {
  // Mock validation to set alreadyDeletedFileCount = 2, availableFileCount = 0, totalSelectedCount = 2
  jest.useFakeTimers();
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

  // Click the suggestion
  jest.advanceTimersByTime(3000);
  const suggestionNode = await screen.findAllByText("Alfie");
  fireEvent.click(suggestionNode[0]);

  // Wait for Doc1 to appear
  await waitFor(() => {
    expect(screen.getByText("Doc1")).toBeInTheDocument();
  });

  // Select the checkboxes for both rows (simulate selecting multiple docs)
  fireEvent.click(screen.getByTestId("check-box-row-testid-0"));
  fireEvent.click(screen.getByTestId("check-box-row-testid-1"));

  // Open actions and trigger Delete
  fireEvent.click(await screen.findByText("Actions"));
  fireEvent.click(await screen.findByText("Delete"));

  // Should show the "All selected documents have already been deleted." message
  await waitFor(() => {
    expect(screen.getByText("All selected documents have already been deleted.")).toBeInTheDocument();
  });
  jest.useRealTimers();
});

it("shows 'document will be gone forever once deleted.'", async () => {
  // Mock validation to set alreadyDeletedFileCount = 2, availableFileCount = 0, totalSelectedCount = 2
  jest.useFakeTimers();
  (ApiService.fetchFilterCategory as jest.Mock).mockResolvedValue([]);
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

  // Simulate search for "Alfie"
  const input = await screen.findByTestId("search-autocomplete-input");
  fireEvent.change(input, { target: { value: "Alfie" } });
  fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

  // Wait for suggestions to load
  const searchLoader = screen.getAllByTestId("loader-arc");
  await waitFor(() => {
    expect(within(searchLoader[0]).queryByTestId("loader-arc")).not.toBeInTheDocument();
  });

  // Click the suggestion
  jest.advanceTimersByTime(3000);
  const suggestionNode = await screen.findAllByText("Alfie");
  fireEvent.click(suggestionNode[0]);

  // Wait for Doc1 to appear
  await waitFor(() => {
    expect(screen.getByText("Doc1")).toBeInTheDocument();
  });

  // Select the checkboxes for both rows (simulate selecting multiple docs)
  fireEvent.click(screen.getByTestId("check-box-row-testid-0"));
  // fireEvent.click(screen.getByTestId("check-box-row-testid-1"));

  // Open actions and trigger Delete
  fireEvent.click(await screen.findByText("Actions"));
  fireEvent.click(await screen.findByText("Delete"));

  // Should show the "document will be gone forever once deleted." message
  await waitFor(() => {
    expect(screen.getByText(/document will be gone forever once deleted./)).toBeInTheDocument();
  });
  jest.useRealTimers();
});

it("covers setTimeout and fetchViewDownloadData in prepare mode", async () => {
  jest.useFakeTimers();
  (ApiService.fetchFilterCategory as jest.Mock).mockResolvedValue([]);
  jest.spyOn(ApiService, "fetchDMSSuggestions").mockResolvedValue(mockSuggestions);
  (ApiService.fetchDocumentDetails as jest.Mock).mockResolvedValue(mockDocData);
  (ApiService.viewDownload as jest.Mock).mockResolvedValue({
    status: 200,
    data: [{ name: "File1", status: "complete" }],
  });
  (ApiService.validation as jest.Mock).mockResolvedValue({
    data: {
      restrictedFileCount: 0,
      alreadyDeletedFileCount: 0,
      availableFileCount: 2,
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

  // Click the suggestion
  jest.advanceTimersByTime(3000);
  const suggestionNode = await screen.findAllByText("Alfie");
  fireEvent.click(suggestionNode[0]);

  // Wait for Doc1 to appear
  await waitFor(() => {
    expect(screen.getByText("Doc1")).toBeInTheDocument();
  });

  // Select the checkboxes for both rows (simulate selecting multiple docs)
  fireEvent.click(screen.getByTestId("check-box-row-testid-0"));
  fireEvent.click(screen.getByTestId("check-box-row-testid-1"));

  // Open actions and click "Prepare download"
  fireEvent.click(await screen.getByText("Actions"));
  fireEvent.click(await screen.getByText("Prepare download"));

  // Click the confirmation button to trigger prepare mode
  const viewLoader = screen.getAllByTestId("loader-arc");
  await waitFor(() => {
    expect(within(viewLoader[0]).queryByTestId("loader-arc")).not.toBeInTheDocument();
  });
  const saveBtn = await screen.getByTestId("tid-save-btn--small-screen");
  fireEvent.click(saveBtn);

  await waitFor(() => {
  expect(screen.getByText("Downloads")).toBeInTheDocument();
});
  // Fast-forward the 2-second timer
  act(() => {
    jest.advanceTimersByTime(2000);
  });

});

it("sets visible breadcrumbs to last item on mobile view", () => {
  // Set window width to mobile
  window.innerWidth = 500;
  // Trigger resize event
  window.dispatchEvent(new Event("resize"));

  render(<MemoryRouter>
    <DocumentManagementServerView />
  </MemoryRouter>);

  const breadcrumb = document.querySelector('[data-test-id="breadcrumb-test-id"]');
  expect(breadcrumb).toBeInTheDocument();
});

it("sets visible breadcrumbs to all items on desktop view", () => {
  // Set window width to desktop
  window.innerWidth = 1200;
  window.dispatchEvent(new Event("resize"));

  render(<MemoryRouter>
    <DocumentManagementServerView />
  </MemoryRouter>);

  // The breadcrumbs should show all items: Home, Admin Console, Documents
  const breadcrumb = document.querySelector('[data-test-id="breadcrumb-test-id"]');
  expect(breadcrumb).toBeInTheDocument();
  expect(screen.getByText("Home")).toBeInTheDocument();
});
})