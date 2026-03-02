import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { DmsSidePanel } from "../components/DMSSidePanel/DocumentManagement.sidepanel";

jest.mock("@essnextgen/ui-intl-kit", () => ({
	...jest.requireActual("@essnextgen/ui-intl-kit"),
	useTranslation: () => ({
		t: (key: string, options?: { type?: string; files?: string }) => {
			if (key === "DocumentManagementServer.clearAllErrorTitle") return "Clear All Error";
			if (key === "DocumentManagementServer.clearAllErrorMessage") return "Clear All Error Message";
			if (key === "DocumentManagementServer.prepareDownloadErrorTitle") return options?.type === "document" ? "Prepare Download Error Title - document" : "Prepare Download Error Title - documents";
			if (key === "DocumentManagementServer.prepareDownloadErrorMessage") return options?.type === "document" ? "Prepare Download Error Message - document" : "Prepare Download Error Message - documents";
			if (key === "DocumentManagementServer.oneOrMoreSelectedDocumentsCannotBeDownloaded") return "One or more selected documents cannot be downloaded.";
			if (key === "DocumentManagementServer.downloadErrorTitle") return "Download Error Title";
			if (key === "DocumentManagementServer.downloadErrorMessage") return "Download Error Message";
			if (key === "DocumentManagementServer.emailNotificationTitle") return "Email Notification Title";
			if (key === "DocumentManagementServer.emailNotificationMessage") return "Email Notification Message";
			if (key === "DocumentManagementServer.failedDownloadTitle") return "Failed Download Title";
			if (key === "DocumentManagementServer.failedDownloadMessage") return `Failed Download Message: ${options?.files}`;
			if (key === "DocumentManagementServer.downloadsCleared") return "Downloads Cleared";
			return key;
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

it("renders ManageDocumentsSidePanel", () => {
    render(<DmsSidePanel {...defaultProps} sidePanelOpenReason="manage" />);
    expect(screen.getByText("Manage private documents")).toBeInTheDocument();
});
});
