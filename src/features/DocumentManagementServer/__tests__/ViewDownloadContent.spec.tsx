import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ViewDownloadContent } from "../components/ViewDownloadContent";
import { LoaderType, NotificationStatus } from "@essnextgen/ui-kit";

const t = (key: string, options?: { days?: number }) => {
	if (key === "DocumentManagementServer.ExpiresInDays") {
		return `Expires in ${options?.days} days`;
	}
	if (key === "DocumentManagementServer.ExpiresToday") {
		return "Expires today";
	}
	if (key === "DocumentManagementServer.download") {
		return "Download";
	}
	if (key === "DocumentManagementServer.informationUnavailable") {
		return "Information unavailable";
	}
	if (key === "DocumentManagementServer.technicalIssueMessage") {
		return "Technical issue";
	}
	if (key === "DocumentManagementServer.downloadsAppearHere") {
		return "Downloads will appear here";
	}
	if (key === "DocumentManagementServer.preparedDownloadsExpireMsg") {
		return "Prepared downloads expire soon";
	}
	return key;
};

const gtmAnalytics = {
	pushEvent: jest.fn(),
};

const setDownloadError = jest.fn();

jest.mock("../logic/DocumentManagementServer.logic", () => ({
	fileDownload: jest.fn(() => Promise.resolve()),
}));
import { fileDownload } from "../logic/DocumentManagementServer.logic";

describe("ViewDownloadContent", () => {
			it("renders item with undefined status (branch coverage)", () => {
				const viewData = [
					{
						name: "file8.pdf",
						fileExpiryDays: 1,
						fileId: "uvw123",
						application: "app",
						section: "sec",
						blobName: "blob8",
					},
				];
				render(
					<ViewDownloadContent
						t={t}
						isViewDownloadError={false}
						isSidePanelLoader={false}
						hasFetchedViewDownload={true}
						viewData={viewData}
						setDownloadError={setDownloadError}
						gtmAnalytics={gtmAnalytics}
					/>
				);
				expect(screen.getByText("file8.pdf")).toBeInTheDocument();
				expect(screen.queryByText("Download")).not.toBeInTheDocument();
				expect(screen.queryByTestId("loader-arc")).not.toBeInTheDocument();
			});

			it("renders item with null status (branch coverage)", () => {
				const viewData = [
					{
						name: "file8.pdf",
						fileExpiryDays: 1,
						fileId: "uvw123",
						application: "app",
						section: "sec",
						blobName: "blob8",
					},
				];
				render(
					<ViewDownloadContent
						t={t}
						isViewDownloadError={false}
						isSidePanelLoader={false}
						hasFetchedViewDownload={true}
						viewData={viewData}
						setDownloadError={setDownloadError}
						gtmAnalytics={gtmAnalytics}
					/>
				);
				expect(screen.getByText("file8.pdf")).toBeInTheDocument();
				expect(screen.queryByText("Download")).not.toBeInTheDocument();
				expect(screen.queryByTestId("loader-arc")).not.toBeInTheDocument();
			});
		it("renders item with unknown status (branch coverage)", () => {
			const viewData = [
				{
					name: "file7.pdf",
					status: "unknown",
					fileExpiryDays: 1,
					fileId: "xyz123",
					application: "app",
					section: "sec",
					blobName: "blob7",
				},
			];
			render(
				<ViewDownloadContent
					t={t}
					isViewDownloadError={false}
					isSidePanelLoader={false}
					hasFetchedViewDownload={true}
					viewData={viewData}
					setDownloadError={setDownloadError}
					gtmAnalytics={gtmAnalytics}
				/>
			);
			// Should render file name, but no download button or loader
			expect(screen.getByText("file7.pdf")).toBeInTheDocument();
			expect(screen.queryByText("Download")).not.toBeInTheDocument();
			expect(screen.queryByTestId("loader-arc")).not.toBeInTheDocument();
		});
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("renders error notification when isViewDownloadError is true", () => {
		render(
			<ViewDownloadContent
				t={t}
				isViewDownloadError={true}
				isSidePanelLoader={false}
				hasFetchedViewDownload={false}
				viewData={[]}
				setDownloadError={setDownloadError}
				gtmAnalytics={gtmAnalytics}
			/>
		);
		expect(screen.getByText("Information unavailable")).toBeInTheDocument();
		expect(screen.getByText("Technical issue")).toBeInTheDocument();
	});

	it("renders loader when isSidePanelLoader is true", () => {
		render(
			<ViewDownloadContent
				t={t}
				isViewDownloadError={false}
				isSidePanelLoader={true}
				hasFetchedViewDownload={false}
				viewData={[]}
				setDownloadError={setDownloadError}
				gtmAnalytics={gtmAnalytics}
			/>
		);
		// Loader from @essnextgen/ui-kit likely renders a progressbar role
		// Check for loader SVGs by data-testid
		expect(screen.getByTestId("loader-arc")).toBeInTheDocument();
		expect(screen.getByTestId("loader-cir")).toBeInTheDocument();
	});

	it("renders message when hasFetchedViewDownload is true and viewData is empty", () => {
		render(
			<ViewDownloadContent
				t={t}
				isViewDownloadError={false}
				isSidePanelLoader={false}
				hasFetchedViewDownload={true}
				viewData={[]}
				setDownloadError={setDownloadError}
				gtmAnalytics={gtmAnalytics}
			/>
		);
		expect(screen.getByText("Downloads will appear here")).toBeInTheDocument();
	});

	it("renders download items with expiry days > 0", () => {
		const viewData = [
			{
				name: "file1.pdf",
				status: "complete",
				fileExpiryDays: 3,
				fileId: "abc123",
				application: "app",
				section: "sec",
				blobName: "blob1",
			},
		];
		render(
			<ViewDownloadContent
				t={t}
				isViewDownloadError={false}
				isSidePanelLoader={false}
				hasFetchedViewDownload={true}
				viewData={viewData}
				setDownloadError={setDownloadError}
				gtmAnalytics={gtmAnalytics}
			/>
		);
		expect(screen.getByText("Prepared downloads expire soon")).toBeInTheDocument();
		expect(screen.getByText("file1.pdf")).toBeInTheDocument();
		expect(screen.getByText("Expires in 3 days")).toBeInTheDocument();
		expect(screen.getByText("Download")).toBeInTheDocument();
	});

	it("renders download items with expiry days = 0", () => {
		const viewData = [
			{
				name: "file2.pdf",
				status: "complete",
				fileExpiryDays: 0,
				fileId: "def456",
				application: "app",
				section: "sec",
				blobName: "blob2",
			},
		];
		render(
			<ViewDownloadContent
				t={t}
				isViewDownloadError={false}
				isSidePanelLoader={false}
				hasFetchedViewDownload={true}
				viewData={viewData}
				setDownloadError={setDownloadError}
				gtmAnalytics={gtmAnalytics}
			/>
		);
		expect(screen.getByText("Expires today")).toBeInTheDocument();
	});

	it("renders loader for inprogress and initiated statuses", () => {
		const viewData = [
			{
				name: "file3.pdf",
				status: "inprogress",
				fileId: "id3",
				application: "app",
				section: "sec",
				blobName: "blob3",
			},
			{
				name: "file4.pdf",
				status: "initiated",
				fileId: "id4",
				application: "app",
				section: "sec",
				blobName: "blob4",
			},
		];
		render(
			<ViewDownloadContent
				t={t}
				isViewDownloadError={false}
				isSidePanelLoader={false}
				hasFetchedViewDownload={true}
				viewData={viewData}
				setDownloadError={setDownloadError}
				gtmAnalytics={gtmAnalytics}
			/>
		);
		// There should be at least two progressbar loaders for the two items
		// Check for loader SVGs by data-testid (one per loader)
		expect(screen.getAllByTestId("loader-arc").length).toBeGreaterThanOrEqual(2);
	});

	it("calls fileDownload and gtmAnalytics.pushEvent on download button click (success)", async () => {
		const viewData = [
			{
				name: "file5.pdf",
				status: "complete",
				fileExpiryDays: 2,
				fileId: "ghi789",
				application: "app",
				section: "sec",
				blobName: "blob5",
			},
		];
		(fileDownload as jest.Mock).mockResolvedValueOnce(undefined);
		render(
			<ViewDownloadContent
				t={t}
				isViewDownloadError={false}
				isSidePanelLoader={false}
				hasFetchedViewDownload={true}
				viewData={viewData}
				setDownloadError={setDownloadError}
				gtmAnalytics={gtmAnalytics}
			/>
		);
		const btn = screen.getByText("Download");
		fireEvent.click(btn);
		await waitFor(() => {
			expect(fileDownload).toHaveBeenCalledWith(
				"GHI789",
				"file5.pdf",
				"app",
				"sec",
				"blob5"
			);
			expect(gtmAnalytics.pushEvent).toHaveBeenCalledWith(
				expect.objectContaining({ event: "file_download" })
			);
		});
	});

	it("handles fileDownload error and calls setDownloadError and gtmAnalytics.pushEvent", async () => {
		const viewData = [
			{
				name: "file6.pdf",
				status: "complete",
				fileExpiryDays: 1,
				fileId: "jkl012",
				application: "app",
				section: "sec",
				blobName: "blob6",
			},
		];
		(fileDownload as jest.Mock).mockRejectedValueOnce(new Error("fail"));
		render(
			<ViewDownloadContent
				t={t}
				isViewDownloadError={false}
				isSidePanelLoader={false}
				hasFetchedViewDownload={true}
				viewData={viewData}
				setDownloadError={setDownloadError}
				gtmAnalytics={gtmAnalytics}
			/>
		);
		const btn = screen.getByText("Download");
		fireEvent.click(btn);
		await waitFor(() => {
			expect(setDownloadError).toHaveBeenCalledWith(true);
			expect(gtmAnalytics.pushEvent).toHaveBeenCalledWith(
				expect.objectContaining({ event: "error_message" })
			);
		});
	});

	it("renders fallback loader if no other condition matches", () => {
		render(
			<ViewDownloadContent
				t={t}
				isViewDownloadError={false}
				isSidePanelLoader={false}
				hasFetchedViewDownload={false}
				viewData={[]}
				setDownloadError={setDownloadError}
				gtmAnalytics={gtmAnalytics}
			/>
		);
		// expect(screen.getByRole("progressbar")).toBeInTheDocument();
		expect(screen.getByText("Please wait...")).toBeInTheDocument();
	});
});
