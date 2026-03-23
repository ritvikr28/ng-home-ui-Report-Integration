import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { DmsSidePanel } from "../components/DMSSidePanel/DocumentManagement.sidepanel";
import { fileDownload } from "../logic/DocumentManagementServer.logic";

global.ResizeObserver = class {
  observe(): ResizeObserver { return this; }
  unobserve(): ResizeObserver { return this; }
  disconnect(): ResizeObserver { return this; }
};
const translationMap: Record<string, string | ((options?: { type?: string; files?: string }) => string)> = {
  "DocumentManagementServer.clearAllErrorTitle": "Clear All Error",
  "DocumentManagementServer.clearAllErrorMessage": "Clear All Error Message",
  "DocumentManagementServer.oneOrMoreSelectedDocumentsCannotBeDownloaded": "One or more selected documents cannot be downloaded.",
  "DocumentManagementServer.downloadErrorTitle": "Download Error Title",
  "DocumentManagementServer.downloadErrorMessage": "Download Error Message",
  "DocumentManagementServer.emailNotificationTitle": "Email Notification Title",
  "DocumentManagementServer.emailNotificationMessage": "Email Notification Message",
  "DocumentManagementServer.failedDownloadTitle": "Failed Download Title",
  "DocumentManagementServer.downloadsCleared": "Downloads Cleared",
  "DocumentManagementServer.managePrivateDocuments": "Manage private documents",
  "DocumentManagementServer.informationUnavailable": "Information Unavailable",
  "DocumentManagementServer.privateDocTechnicalIssue": "A technical issue is preventing access to your private documents, please ",
  "DocumentManagementServer.contactSupport": "contact support",
  "DocumentManagementServer.privateDocDownloadFailureTitle": "Unable to download document",
  "DocumentManagementServer.privateDocDownloadFailureMessage": "A technical issue stopped you from downloading the document. Please try again or <link> if the issue persists.",
  "DocumentManagementServer.prepareDownloadErrorTitle": (options) =>
    options?.type === "document"
      ? "Prepare Download Error Title - document"
      : "Prepare Download Error Title - documents",
  "DocumentManagementServer.prepareDownloadErrorMessage": (options) =>
    options?.type === "document"
      ? "Prepare Download Error Message - document"
      : "Prepare Download Error Message - documents",
  "DocumentManagementServer.failedDownloadMessage": (options) =>
    `Failed Download Message: ${options?.files}`
};

jest.mock("../logic/DocumentManagementServer.logic", () => ({
  fileDownload: jest.fn().mockResolvedValue(undefined)
}));

jest.mock("@essnextgen/ui-intl-kit", () => ({  
  ...jest.requireActual("@essnextgen/ui-intl-kit"),
  useTranslation: () => ({
    t: (key: string, options?: { type?: string; files?: string }) => {
      const value: string | ((option?: { type?: string; files?: string }) => string) | undefined = translationMap[key];
      if (typeof value === "function") {
        return value(options);
      }
      return value ?? key;
    }
  })
}));

const { t }: any = require("@essnextgen/ui-intl-kit").useTranslation();

const defaultProps: any = {
	t,
	isSidePanelLoader: false,
	hasFetchedViewDownload: true,
	isViewDownloadError: false,
	viewData: [],
	failedFileName: [],
	clearAllError: false,
	prepareDownloadError: false,
	prepareDownloadAbortBanner: false,
	downloadError: false,
	showEmailNotification: false,
	showToastNotification: false,
	availableFileCount: 2,
	setClearAllError: jest.fn(),
	setPrepareDownloadError: jest.fn(),
	setPrepareDownloadAbortBanner: jest.fn(),
	setDownloadError: jest.fn(),
	setShowEmailNotification: jest.fn(),
	setShowToastNotification: jest.fn(),
	setFailedFileName: jest.fn(),
	fileDownload: jest.fn(),
	gtmAnalytics: {},
	sidePanelOpenReason: "view"
};

describe("DmsSidePanel", () => {
	// it("renders without crashing", () => {
	// 	render(<DmsSidePanel {...defaultProps} />);
	// 	expect(screen.getByRole("region", { hidden: true }) || screen.getByText("viewDownloadWrap")).toBeTruthy();
	// });

	it("shows clearAllError notification", () => {
		render(<DmsSidePanel {...defaultProps} clearAllError={true} />);
		expect(screen.getByText("Clear All Error")).toBeInTheDocument();
		fireEvent.click(screen.getByRole("button"));
	});

	it("shows prepareDownloadError notification (plural)", () => {
		render(<DmsSidePanel {...defaultProps} prepareDownloadError={true} availableFileCount={2} />);
		expect(screen.getByText("Prepare Download Error Title - documents")).toBeInTheDocument();
		expect(screen.getByText("Prepare Download Error Message - documents")).toBeInTheDocument();
	});

	it("shows prepareDownloadError notification (singular)", () => {
		render(<DmsSidePanel {...defaultProps} prepareDownloadError={true} availableFileCount={1} />);
		expect(screen.getByText("Prepare Download Error Title - document")).toBeInTheDocument();
		expect(screen.getByText("Prepare Download Error Message - document")).toBeInTheDocument();
	});

	it("shows prepareDownloadAbortBanner notification", () => {
		render(<DmsSidePanel {...defaultProps} prepareDownloadAbortBanner={true} />);
		expect(screen.getByText("One or more selected documents cannot be downloaded.")).toBeInTheDocument();
	});

	it("shows downloadError notification", () => {
		render(<DmsSidePanel {...defaultProps} downloadError={true} />);
		expect(screen.getByText("Download Error Title")).toBeInTheDocument();
		expect(screen.getByText("Download Error Message")).toBeInTheDocument();
	});

	it("shows email notification if not view download error", () => {
		render(<DmsSidePanel {...defaultProps} showEmailNotification={true} isViewDownloadError={false} />);
		expect(screen.getByText("Email Notification Title")).toBeInTheDocument();
		expect(screen.getByText("Email Notification Message")).toBeInTheDocument();
	});

	it("does not show email notification if view download error", () => {
		render(<DmsSidePanel {...defaultProps} showEmailNotification={true} isViewDownloadError={true} />);
		expect(screen.queryByText("Email Notification Title")).toBeNull();
	});

	it("shows failedFileName notification", () => {
		render(<DmsSidePanel {...defaultProps} failedFileName={["file1.pdf", "file2.doc"]} />);
		expect(screen.getByText("Failed Download Title")).toBeInTheDocument();
		expect(screen.getByText("Failed Download Message: file1.pdf, file2.doc")).toBeInTheDocument();
	});

	it("shows toast notification", () => {
		render(<DmsSidePanel {...defaultProps} showToastNotification={true} />);
		expect(screen.getByText("Downloads Cleared")).toBeInTheDocument();
	});

    	it("calls setPrepareDownloadError(false) when prepareDownloadError notification is closed", () => {
		const setPrepareDownloadError: jest.Mock = jest.fn();
		render(
			<DmsSidePanel
				{...defaultProps}
				prepareDownloadError={true}
				setPrepareDownloadError={setPrepareDownloadError}
			/>
		);
		// Find the close button for the notification
		const closeButton: HTMLButtonElement = screen.getByRole("button");
		fireEvent.click(closeButton);
		expect(setPrepareDownloadError).toHaveBeenCalledWith(false);
	});

    	it("calls setPrepareDownloadAbortBanner(false) when prepareDownloadAbortBanner notification is closed", () => {
		const setPrepareDownloadAbortBanner: jest.Mock = jest.fn();
		render(
			<DmsSidePanel
				{...defaultProps}
				prepareDownloadAbortBanner={true}
				setPrepareDownloadAbortBanner={setPrepareDownloadAbortBanner}
			/>
		);
		// Find the close button for the notification
		const closeButton: HTMLButtonElement = screen.getByRole("button");
		fireEvent.click(closeButton);
		expect(setPrepareDownloadAbortBanner).toHaveBeenCalledWith(false);
	});

      	it("calls setDownloadError(false) when downloadError notification is closed", () => {
		const setDownloadError: jest.Mock = jest.fn();
		render(
			<DmsSidePanel
				{...defaultProps}
				downloadError={true}
				setDownloadError={setDownloadError}
			/>
		);
		// Find the close button for the notification
		const closeButton: HTMLButtonElement = screen.getByRole("button");
		fireEvent.click(closeButton);
		expect(setDownloadError).toHaveBeenCalledWith(false);
	});

    it("calls setShowEmailNotification(false) when email notification is closed", () => {
		const setShowEmailNotification: jest.Mock = jest.fn();
		render(
			<DmsSidePanel
				{...defaultProps}
				showEmailNotification={true}
				isViewDownloadError={false}
				setShowEmailNotification={setShowEmailNotification}
			/>
		);
		// Find the close button for the notification
		const closeButton: HTMLButtonElement = screen.getByRole("button");
		fireEvent.click(closeButton);
		expect(setShowEmailNotification).toHaveBeenCalledWith(false);
	});

       it("calls setShowToastNotification(false) when toast notification is closed", () => {
		const setShowToastNotification: jest.Mock = jest.fn();
		render(
			<DmsSidePanel
				{...defaultProps}
				showToastNotification={true}
				isViewDownloadError={false}
				setShowToastNotification={setShowToastNotification}
			/>
		);
		// Find the close button for the notification
		const closeButton: HTMLButtonElement = screen.getByRole("button");
		fireEvent.click(closeButton);
		expect(setShowToastNotification).toHaveBeenCalledWith(false);
	});

    it("calls setPrepareDownloadError(false) and setFailedFileName([]) when failedFileName notification is closed", () => {
		const setPrepareDownloadError: jest.Mock = jest.fn();
		const setFailedFileName: jest.Mock = jest.fn();
		render(
			<DmsSidePanel
				{...defaultProps}
				failedFileName={["file1.pdf", "file2.doc"]}
				setPrepareDownloadError={setPrepareDownloadError}
				setFailedFileName={setFailedFileName}
			/>
		);
		// Find the close button for the notification
		const closeButton: HTMLButtonElement = screen.getByRole("button");
		fireEvent.click(closeButton);
		expect(setPrepareDownloadError).toHaveBeenCalledWith(false);
		expect(setFailedFileName).toHaveBeenCalledWith([]);
	});

it("shows PrivateDocErrorNotification when isPrivateDocError is true", () => {
    render(<DmsSidePanel {...defaultProps} sidePanelOpenReason="manage" isPrivateDocError={true} onSidePanelSortChange={jest.fn()} />);
    expect(screen.getByText("Information Unavailable")).toBeInTheDocument();
  });

  it("does not show PrivateDocErrorNotification when isPrivateDocError is false", () => {
    render(<DmsSidePanel {...defaultProps} sidePanelOpenReason="manage" isPrivateDocError={false} onSidePanelSortChange={jest.fn()} />);
    expect(screen.queryByText("Information Unavailable")).not.toBeInTheDocument();
  });

  it("shows DownloadErrorNotification when document download fails", async () => {
    (fileDownload as jest.Mock).mockRejectedValueOnce(new Error("Download failed"));

    const docRow = {
      id: "file-1",
      document: [{ name: "My Document", fileId: "file-1", application: "app", sectionName: "section", blobName: "blob" }],
      relatedTo: [],
      addedBy: "User",
      dateAdded: "01 Jan 2025"
    };
    render(
      <DmsSidePanel
        {...defaultProps}
        sidePanelOpenReason="manage"
        privateDocData={[docRow]}
        isPrivateDocError={false}
        onSidePanelSortChange={jest.fn()}
      />
    );

    fireEvent.click(screen.getByText("My Document"));

    await waitFor(() => {
      expect(screen.getByText("Unable to download document")).toBeInTheDocument();
    });
  });

  it("renders ManageDocumentsSidePanel", () => {
    render(<DmsSidePanel {...defaultProps} sidePanelOpenReason="manage" />);
    expect(screen.getByText("DocumentManagementServer.privateFilesDescription")).toBeInTheDocument();
});

it("renders ManageDocumentsSidePanel and click on Action menu", () => {
    render(<DmsSidePanel {...defaultProps} sidePanelOpenReason="manage" />);
    expect(screen.getByText("DocumentManagementServer.privateFilesDescription")).toBeInTheDocument();

	const actionButton: HTMLButtonElement = screen.getByTestId("edit-selected-btn-testid");
	fireEvent.click(actionButton);

	expect(screen.getByText("Make standard")).toBeInTheDocument();
	fireEvent.click(screen.getByText("Make standard"));
});

it("renders ManageDocumentsSidePanel and change page", () => {
    const manyRows = Array.from({ length: 40 }, (_, i) => ({
      id: `file-${i}`,
      document: [{ name: `Document ${i + 1}`, fileId: `file-${i}`, application: "app", sectionName: "section", blobName: "blob" }],
      relatedTo: [],
      addedBy: "User",
      dateAdded: "01 Jan 2025"
    }));
    const onSidePanelPageChange: jest.Mock = jest.fn();
    render(<DmsSidePanel
      {...defaultProps}
      sidePanelOpenReason="manage"
      privateDocData={manyRows}
      isPrivateDocError={false}
      onSidePanelSortChange={jest.fn()}
      privateTotalRecords={41}
      onSidePanelPageChange={onSidePanelPageChange}
    />);
    expect(screen.getByText("DocumentManagementServer.privateFilesDescription")).toBeInTheDocument();

	const nextButton: HTMLButtonElement = screen.getByLabelText("next page");
	fireEvent.click(nextButton);

	expect(onSidePanelPageChange).toHaveBeenCalledWith(2);

});
});
