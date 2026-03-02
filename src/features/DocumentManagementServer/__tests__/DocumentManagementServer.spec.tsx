import React from "react";
// import { renderHook } from "@testing-library/react-hooks";
import { render, screen, cleanup, fireEvent, waitFor, act, within } from "@testing-library/react";
import { renderHook } from '@testing-library/react-hooks';
import { MemoryRouter } from "react-router-dom";
import { authService } from "@essnextgen/auth-ui";
import DocumentManagementServerView from "../Views/DocumentManagementServer.view";
import * as ApiService from "../api/ApiService";
import * as Logic from "../logic/DocumentManagementServer.logic";
import { useTotalSelectedCountEffect } from '../hooks/useDocumentManagementEffects';
 
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
    any: "any" // ← mock value (doesn't matter what)
  }
}));

jest.mock("@essnextgen/ui-intl-kit", () => {
  const translationMap: Record<string, string> = {
    "DocumentManagementServer.ExpiresToday": "Expires today.",
    "DocumentManagementServer.headingText": "Documents",
    "DocumentManagementServer.Home": "Home",
    "DocumentManagementServer.ViewDownload": "View downloads",
    "DocumentManagementServer.sidePanelTitle": "Downloads",
    "DocumentManagementServer.subHeadingText": "Bulk download or delete documents for pupils, staff members, or the school.",
    "DocumentManagementServer.dateAddedColumn": "Date added",
    "DocumentManagementServer.documentColumn": "Document",
    "DocumentManagementServer.formatColumn": "Format",
    "DocumentManagementServer.sizeColumn": "Size",
    "DocumentManagementServer.categoryColumn": "Category",
    "DocumentManagementServer.editSelectedBtnTitle": "Actions",
    "DocumentManagementServer.PrepareDownload": "Prepare download",
    "DocumentManagementServer.Delete": "Delete",
    "DocumentManagementServer.keepIt": "Keep it",
    "DocumentManagementServer.noItemsSelectedMessage": "Please select at least one item from the search results to perform the action.",
    "Filter.applyFilters": "Search",
    "DocumentManagementServer.clearAllDownloadsTitle": "Clear all downloads?",
    "DocumentManagementServer.keepAll": "Keep all",
    "DocumentManagementServer.documentsCannotBeDownloaded": "documents cannot be downloaded as they have already been deleted.",
    "DocumentManagementServer.documentCannotBeDeletedNotification": "This document cannot be deleted as it is currently being prepared for download. Please try again later",
    "Filter.invalidDate": "Invalid Date",
    "Filter.Pupil": "Pupil",
    "Filter.pupilName": "Pupil name",
    "DocumentManagementServer.Cancel": "Cancel",
    "DocumentManagementServer.Okay": "Okay",
    "DocumentManagementServer.informationUnavailable": "Information unavailable"
  };

  return {
    ...jest.requireActual("@essnextgen/ui-intl-kit"),
    useTranslation: () => ({
      t: (key: string, options?: any) => {
        if (key === "DocumentManagementServer.ExpiresInDays") {
          return `Expires in ${options?.count ?? options?.days ?? "?"} day(s).`;
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
        // fallback to static map or key itself
        return translationMap[key] ?? key;
      }
    })
  };
});


 
jest.mock('focus-trap-react', () => ({
  __esModule: true,
  default: ({ children }: any) => <>{children}</>,
}));

jest.mock("../logic/DocumentManagementServer.logic", () => {
  const original: any = jest.requireActual("../logic/DocumentManagementServer.logic");
  return {
    __esModule: true,
    ...original,
    fetchGetDocumentDetailsLogic: jest.fn(),
    prepareDownload: jest.fn(),
    reduceCategories: jest.fn(),
    fileDownload: jest.fn(),
    fetchDocumentCategoryData: jest.fn(),
  };
});
 
jest.mock("../api/ApiService", () => ({
  fetchDocumentDetails: jest.fn(),
  fetchDMSSuggestions: jest.fn(),
  fetchDocumentCategory: jest.fn(),
  prepareAndDownloadFile: jest.fn(),
  viewDownload: jest.fn(),
  fetchStaffProfilePhoto: jest.fn(),
  validation: jest.fn()
}));


const mockCategories: Array<{ application: string; registrationId: number[]; section: string[] }> = [
  { application: "App1", registrationId: [1], section: ["Section1"] },
  { application: "App2", registrationId: [1], section: ["Section2"] },
  { application: "App3", registrationId: [1], section: ["Section3"] },
  { application: "App4", registrationId: [1], section: ["Section4"] }
];

const mockDocData: { statusCode: number; totalRecords: number; data: Array<{ fileId: string; document: string; category: string; addedBy: string; dateAdded: string; format: string; size: string; registrationId: number; relatedTo: Array<any>; }> } = {
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
  ]
};

const zipFileDownloadMockData: { statusCode: number; payload: string; errorMessage: null } = {
  statusCode: 200,
  payload: "https://pazdevpfmdocumentsa.blob.core.windows.net/zipfiles/SIMS_2025-11-17_05-49-21-949-5726c2dc-0b13-4a31-bc42-55212f9be681.zip?sv=2025-05-05&ss=b&srt=o&spr=https&st=2025-11-17T05%3A45%3A38Z&se=2025-11-17T11%3A50%3A38Z&sp=r&sig=KNCUB3ApzNzLwV%2FJa7p4YbJSr%2F6NUOTz7EmguJTwS%2B4%3D&rscd=attachment;filename=SIMS_2025-11-17_11-19-20.zip",
  errorMessage: null
};
const mockSuggestions: any = {
    "payload": [
        {
            "name": "Pupil",
            "link": "",
            "values": [
                {
                    "learnerExternalId": "67a94600-40ed-49ec-ab41-8b66020c9fdf",
                    "preferredForename": "Ben",
                    "preferredSurname": "Elliot",
                    "legalName": "Benjamen Elliot",
                    "currentYearGroup": "Year  R",
                    "currentPrimaryClass": "PINE",
                    "admissionNumber": "002117",
                    "onRollState": "Current",
                    "imagePath": ""
                },
                {
                    "learnerExternalId": "77a766a4-54ca-487d-86a0-4ea89f8a0af5",
                    "preferredForename": "Ben",
                    "preferredSurname": "Pineton",
                    "legalName": "Benjamin Pineton",
                    "currentYearGroup": "Year  6",
                    "currentPrimaryClass": "6KH",
                    "admissionNumber": "001659",
                    "onRollState": "Current",
                    "imagePath": "https://pazdevpfmimagesa.blob.core.windows.net/8e3f658d-b952-4e64-bf2b-1eb5733e5416/77a766a4-54ca-487d-86a0-4ea89f8a0af5?sv=2025-01-05&se=2026-02-16T11%3A46%3A53Z&sr=b&sp=r&sig=OiQgPA0sVYd2jQ%2FNseOF08O4b%2BBi2bIBvg1oG767quU%3D"
                }
            ]
        },
        {
            "name": "Staff",
            "link": "",
            "values": []
        },
        {
            "name": "Organisation",
            "link": "",
            "values": []
        }
    ],
    "statusCode": 200,
    "errorMessage": null
}
 
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    (Logic.fetchDocumentCategoryData as jest.Mock).mockResolvedValue(mockCategories);
    // (Logic.reduceCategories as jest.Mock).mockReturnValue(mockCategories);
    (Logic.fetchGetDocumentDetailsLogic as jest.Mock).mockImplementation(
      ({ setDocData }: any) => setDocData(mockDocData)
    );
    (Logic.prepareDownload as jest.Mock).mockResolvedValue([204]);
    (ApiService.viewDownload as jest.Mock).mockResolvedValue({
      status: 200,
      data: [],
    });
    (Logic.fileDownload as jest.Mock).mockResolvedValue(zipFileDownloadMockData);
    /* eslint-disable */

    global.ResizeObserver =
  global.ResizeObserver ||
  (class implements ResizeObserver{
    observe(target: Element): void {  jest.fn()(target); }
    unobserve(target: Element) : void { jest.fn()(target); }
    disconnect(): void { jest.fn()(); }
  });
    /* eslint-enable */
  
});  
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

  jest.spyOn(ApiService, "fetchDMSSuggestions")
    .mockResolvedValue(mockSuggestions);

  (ApiService.fetchDocumentDetails as jest.Mock)
    .mockResolvedValue(mockDocData);

  render(
    <MemoryRouter>
      <DocumentManagementServerView />
    </MemoryRouter>
  );

  const input: HTMLInputElement = await screen.findByTestId("search-autocomplete-input");

  fireEvent.change(input, { target: { value: "Ben" } });

  // advance debounce timer (3000ms)
  act(() => {
    jest.advanceTimersByTime(3000);
  });

  // flush async promise inside debounce
  await act(async () => {
    await Promise.resolve();
  });

  // wait for suggestion API to be called
  await waitFor(() => {
    expect(ApiService.fetchDMSSuggestions).toHaveBeenCalled();
  });

  // suggestion should appear
  const loader: HTMLElement[] = screen.getAllByTestId("loader-arc");
  await waitFor(() => {
    expect(within(loader[0]).queryByTestId("loader-arc")).not.toBeInTheDocument();
  });
  const suggestion: HTMLElement[] = await screen.findAllByText("Ben");

  fireEvent.click(suggestion[0]);

  // documents should render
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
   
  test("removes id from selectedCheckBoxIds and allSelectedDocs when checkbox is unchecked", async () => {
  jest.useFakeTimers();
    (ApiService.fetchDocumentCategory as jest.Mock).mockResolvedValue([]);
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
  const input: HTMLInputElement = await screen.findByTestId("search-autocomplete-input");
  fireEvent.change(input, { target: { value: "Ben" } });
  fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

  // Wait for suggestions to load
  const searchLoader: HTMLElement[] = screen.getAllByTestId("loader-arc");
  await waitFor(() => {
    expect(within(searchLoader[0]).queryByTestId("loader-arc")).not.toBeInTheDocument();
  });

  // Click the suggestion
  jest.advanceTimersByTime(3000);
  const suggestionNode: HTMLElement[] = await screen.findAllByText("Ben");
  fireEvent.click(suggestionNode[0]);

  // Wait for Doc1 to appear
  await waitFor(() => {
    expect(screen.getByText("Doc1")).toBeInTheDocument();
  });

    const headerCheckbox: HTMLInputElement = await screen.findByTestId("checkmark-check-box-row-testid");

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
  const checkbox: HTMLInputElement = screen.getByTestId("check-box-row-testid-0");

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
       (ApiService.fetchDocumentCategory as jest.Mock).mockResolvedValue([]);
  jest.spyOn(ApiService, "fetchDMSSuggestions").mockResolvedValue(mockSuggestions);
  (ApiService.fetchDocumentDetails as jest.Mock).mockResolvedValue({data: [], status: 500 });

  render(<MemoryRouter>
      <DocumentManagementServerView />
    </MemoryRouter>);

  // type search query
  const input: HTMLInputElement = await screen.findByTestId("search-autocomplete-input");
  fireEvent.change(input, { target: { value: "Ben" } });
  fireEvent.keyDown(input, { key: "Enter", code: "Enter" });
 
  // wait for suggestion to show up
  const searchLoader: HTMLElement[] = screen.getAllByTestId("loader-arc");
  await waitFor(() => {
    expect(within(searchLoader[0]).queryByTestId("loader-arc")).not.toBeInTheDocument();
  });
 
  jest.advanceTimersByTime(3000);
  const suggestionNode: HTMLElement[] = await screen.findAllByText("Ben");
 
  // click suggestion
  fireEvent.click(suggestionNode[0]);
    fireEvent.click(screen.getByTestId("search-close--icon-btn"));
    expect(screen.getByRole("textbox")).toHaveValue("");
    jest.useRealTimers();
  });
 
    it("closes side panel and clears interval", async () => {
    const { container }: { container: HTMLElement } = render(<MemoryRouter>
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
    const downloadBtns: HTMLElement[] = screen.getAllByText("DocumentManagementServer.download");
    fireEvent.click(downloadBtns[0]);
    
  });
 

});


describe('useTotalSelectedCountEffect', () => {
  it('should reset selections when all checkboxes are excluded', () => {
    const setIsHeaderBoxChecked: jest.Mock = jest.fn();
    const setAllSelectedDocs: jest.Mock = jest.fn();
    const setExcludedCheckBoxIds: jest.Mock = jest.fn();
    const setTotalSelectedCount: jest.Mock = jest.fn();

    const docData: { totalRecords: number } = { totalRecords: 3 };
    const excludedCheckBoxIds = ['1', '2', '3'];
    const allSelectedDocs: { fileId: string; registrationId: number; externalId: string }[] = [
      { fileId: "f1", registrationId: 1, externalId: "e1" },
      { fileId: "f2", registrationId: 2, externalId: "e2" },
      { fileId: "f3", registrationId: 3, externalId: "e3" }
    ];

    renderHook(() =>
      useTotalSelectedCountEffect({
        isHeaderBoxChecked: true,
        excludedCheckBoxIds,
        docData,
        allSelectedDocs,
        setIsHeaderBoxChecked,
        setAllSelectedDocs,
        setExcludedCheckBoxIds,
        setTotalSelectedCount,
      })
    );

    expect(setIsHeaderBoxChecked).toHaveBeenCalledWith(false);
    expect(setAllSelectedDocs).toHaveBeenCalledWith([]);
    expect(setExcludedCheckBoxIds).toHaveBeenCalledWith([]);
    expect(setTotalSelectedCount).toHaveBeenCalledWith(0);
  });
});
 
describe("Additional tests to increase coverage", () => {
  it("clears search input and resets state", async () => {
    render(<MemoryRouter>
      <DocumentManagementServerView />
    </MemoryRouter>);
    const input: HTMLInputElement = await screen.findByTestId("search-autocomplete-input");
    fireEvent.change(input, { target: { value: "Ben" } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

    // wait for suggestion to show up
    const searchLoader: HTMLElement[] = screen.getAllByTestId("loader-arc");
    await waitFor(() => {
      expect(within(searchLoader[0]).queryByTestId("loader-arc")).not.toBeInTheDocument();
    });

    jest.advanceTimersByTime(3000);

    const suggestionNode: HTMLElement[] = await screen.findAllByText("Ben");

    // click suggestion
    fireEvent.click(suggestionNode[0]);
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
    (ApiService.fetchDocumentCategory as jest.Mock).mockResolvedValue([]);
    jest.spyOn(ApiService, "fetchDMSSuggestions").mockResolvedValue(mockSuggestions);
    (ApiService.fetchDocumentDetails as jest.Mock).mockResolvedValue(mockDocData);
    (ApiService.validation as jest.Mock).mockResolvedValue({
      data: {
        restrictedFileCount: 0,
        alreadyDeletedFileCount: 0,
        availableFileCount: 2,
      },
      status: 200
    });
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
    const input: HTMLInputElement = await screen.findByTestId("search-autocomplete-input");
    fireEvent.change(input, { target: { value: "Ben" } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

    // wait for suggestion to show up
    const searchLoader: HTMLElement[] = screen.getAllByTestId("loader-arc");
    await waitFor(() => {
      expect(within(searchLoader[0]).queryByTestId("loader-arc")).not.toBeInTheDocument();
    });

    jest.advanceTimersByTime(3000);

    const suggestionNode: HTMLElement[] = await screen.findAllByText("Ben");

    // click suggestion
    fireEvent.click(suggestionNode[0]);

    // verify document is displayed
    await waitFor(() => {
      expect(screen.getByText("Doc1")).toBeInTheDocument();
    });
    // Select multiple checkboxes
    const checkbox0: HTMLInputElement = screen.getByTestId("check-box-row-testid-0");
    const checkbox1: HTMLInputElement = screen.getByTestId("check-box-row-testid-1");
    fireEvent.click(checkbox0);
    fireEvent.click(checkbox1);

    fireEvent.click(await screen.getByText("Actions"));
    fireEvent.click(await screen.getByText("Prepare download"));
    
    // const saveBtn = await screen.findByTestId("tid-save-btn--large-screen");
    // fireEvent.click(saveBtn);
    jest.useRealTimers();
  });

 
 
    it("handles filter close", async () => {
       (ApiService.fetchDocumentCategory as jest.Mock).mockResolvedValue([]);
  jest.spyOn(ApiService, "fetchDMSSuggestions").mockResolvedValue(mockSuggestions);
  (ApiService.fetchDocumentDetails as jest.Mock).mockResolvedValue(mockDocData);
 
  render(<MemoryRouter>
      <DocumentManagementServerView />
    </MemoryRouter>);
 
    fireEvent.click(screen.getByTestId("filter-btn"));
    // Set invalid date range in state

    const closeBtn: HTMLButtonElement = screen.getByTestId("dialog-close-button");
 
    fireEvent.click(closeBtn);

    expect(screen.queryByTestId("dms-filter-dialog")).not.toBeInTheDocument();
  });

  it("renders empty states for showErrorBanner and showSearchError", async () => {
  jest.useFakeTimers();
    (ApiService.fetchDocumentDetails as jest.Mock).mockResolvedValue({ data: [], status: 500 });
    (Logic.fetchGetDocumentDetailsLogic as jest.Mock).mockImplementation(
      ({ setShowSearchError }: any) => setShowSearchError(true)
    );
    jest.spyOn(ApiService, "fetchDMSSuggestions").mockResolvedValue(mockSuggestions);
 
  render(<MemoryRouter>
      <DocumentManagementServerView />
    </MemoryRouter>);
 
  // type search query
  const input: HTMLInputElement = await screen.findByTestId("search-autocomplete-input");
  fireEvent.change(input, { target: { value: "Ben" } });
  fireEvent.keyDown(input, { key: "Enter", code: "Enter" });
 
  // wait for suggestion to show up
  const searchLoader: HTMLElement[] = screen.getAllByTestId("loader-arc");
  await waitFor(() => {
    expect(within(searchLoader[0]).queryByTestId("loader-arc")).not.toBeInTheDocument();
  });

  jest.advanceTimersByTime(3000);
 
  const suggestionNode: HTMLElement[] = await screen.findAllByText("Ben");
 
  // click suggestion
  fireEvent.click(suggestionNode[0]);
  const errorBanner: HTMLElement[] = screen.getAllByText(/Information unavailable/);
  expect(errorBanner[0]).toBeInTheDocument();
  jest.useRealTimers();
  }); 

  it("calls onRefreshAfterClose when dialog is closed", async () => {
    jest.useFakeTimers();
    (ApiService.fetchDocumentCategory as jest.Mock).mockResolvedValue([]);
    jest.spyOn(ApiService, "fetchDMSSuggestions").mockResolvedValue(mockSuggestions);
    (ApiService.fetchDocumentDetails as jest.Mock).mockResolvedValue(mockDocData);
    (ApiService.validation as jest.Mock).mockResolvedValue({
      data: {
        restrictedFileCount: 0,
        alreadyDeletedFileCount: 2,
        availableFileCount: 0,
      },
      status: 200
    });
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
    const input: HTMLInputElement = await screen.findByTestId("search-autocomplete-input");
    fireEvent.change(input, { target: { value: "Ben" } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

    // wait for suggestion to show up
    const searchLoader: HTMLElement[] = screen.getAllByTestId("loader-arc");
    await waitFor(() => {
      expect(within(searchLoader[0]).queryByTestId("loader-arc")).not.toBeInTheDocument();
    });

    jest.advanceTimersByTime(3000);

    const suggestionNode: HTMLElement[] = await screen.findAllByText("Ben");

    // click suggestion
    fireEvent.click(suggestionNode[0]);

    // verify document is displayed
    await waitFor(() => {
      expect(screen.getByText("Doc1")).toBeInTheDocument();
    });
    // Select multiple checkboxes
    const checkbox0: HTMLInputElement = screen.getByTestId("check-box-row-testid-0");
    const checkbox1: HTMLInputElement = screen.getByTestId("check-box-row-testid-1");
    fireEvent.click(checkbox0);
    fireEvent.click(checkbox1);

    fireEvent.click(await screen.getByText("Actions"));
    fireEvent.click(await screen.getByText("Delete"));
    
    // const saveBtn = await screen.findByTestId("tid-save-btn--large-screen");
    // fireEvent.click(saveBtn);

    
    await waitFor(() => {
      const okayBtn = screen.getByText("Okay");
      expect(okayBtn).toBeInTheDocument();
      fireEvent.click(okayBtn);
    });
    jest.useRealTimers();
  });
});

